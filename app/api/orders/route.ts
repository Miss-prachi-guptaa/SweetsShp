import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { isServiceablePincode } from '@/lib/delivery';
import { sendOrderNotificationEmail } from '@/lib/email';
import { MINIMUM_ORDER_VALUE, SHOP_PHONE_E164, SHOP_PINCODE } from '@/lib/shop';

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json');
const TMP_ORDERS_FILE = path.join(os.tmpdir(), 'chiksum_orders.json');

// In-memory fallback for serverless runtimes (like Vercel lambda)
let inMemoryOrders: any[] = [];

function getStore() {
  let baseOrders: any[] = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.orders)) baseOrders = parsed.orders;
    }
  } catch (e) {
    // Read failure fallback
  }

  // Also check /tmp orders on serverless
  try {
    if (fs.existsSync(TMP_ORDERS_FILE)) {
      const tmpRaw = fs.readFileSync(TMP_ORDERS_FILE, 'utf8');
      const tmpParsed = JSON.parse(tmpRaw);
      if (Array.isArray(tmpParsed)) {
        baseOrders = [...tmpParsed, ...baseOrders];
      }
    }
  } catch (e) {
    // Ignore tmp read failure
  }

  // Merge with in-memory orders (deduplicate by orderId)
  const all = [...inMemoryOrders, ...baseOrders];
  const unique = Array.from(new Map(all.map((item) => [item.orderId, item])).values());
  return { orders: unique };
}

function saveStore(newOrder: any) {
  // Always update in-memory
  inMemoryOrders.unshift(newOrder);

  // Try writing to local project data file (works in local dev / Docker)
  try {
    const raw = fs.existsSync(DATA_FILE) ? fs.readFileSync(DATA_FILE, 'utf8') : '{}';
    const store = JSON.parse(raw);
    if (!store.orders) store.orders = [];
    store.orders.unshift(newOrder);
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
    return;
  } catch (e) {
    // EROFS on Vercel: expected on serverless Lambda
  }

  // Fallback: write to /tmp on serverless (writable on AWS Lambda / Vercel)
  try {
    let tmpOrders: any[] = [];
    if (fs.existsSync(TMP_ORDERS_FILE)) {
      tmpOrders = JSON.parse(fs.readFileSync(TMP_ORDERS_FILE, 'utf8'));
    }
    tmpOrders.unshift(newOrder);
    fs.writeFileSync(TMP_ORDERS_FILE, JSON.stringify(tmpOrders.slice(0, 100)), 'utf8');
  } catch (e) {
    console.warn('[Storage Warning] Could not persist to /tmp:', e);
  }
}

export async function GET() {
  try {
    const store = getStore();
    return NextResponse.json({ success: true, orders: store.orders || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerName,
      mobileNumber,
      streetAddress,
      landmark,
      pincode,
      deliverySlot,
      paymentMethod,
      items,
      itemsPrice,
      deliveryFee,
      discount,
      couponCode,
      finalTotal,
    } = body;

    if (!orderId || !mobileNumber || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order ID, mobile number, and items are required.' },
        { status: 400 }
      );
    }

    if (!pincode || !isServiceablePincode(String(pincode))) {
      return NextResponse.json(
        { success: false, error: 'Delivery is available only within 2 km of our Ghosi shop (PIN 284128).' },
        { status: 400 }
      );
    }

    const calculatedItemsPrice = items.reduce(
      (sum: number, item: { price?: number; quantity?: number }) =>
        sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    if (calculatedItemsPrice < MINIMUM_ORDER_VALUE) {
      return NextResponse.json(
        { success: false, error: `Minimum order value is ₹${MINIMUM_ORDER_VALUE}.` },
        { status: 400 }
      );
    }

    const newOrder = {
      orderId,
      customerName: customerName || 'Valued Customer',
      mobileNumber,
      streetAddress: streetAddress || '',
      landmark: landmark || '',
      pincode: pincode || SHOP_PINCODE,
      deliverySlot: deliverySlot || 'Express (45-60 mins)',
      paymentMethod: paymentMethod || 'UPI_ON_DELIVERY',
      items,
      itemsPrice: calculatedItemsPrice,
      deliveryFee: 0,
      discount: discount || 0,
      couponCode: couponCode || '',
      finalTotal: Math.max(0, calculatedItemsPrice - Number(discount || 0)),
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to database / Admin store (with Vercel serverless safety)
    try {
      saveStore(newOrder);
    } catch (saveErr) {
      console.warn('[Order Save Warning]:', saveErr);
    }

    // 2. Prepare Structured WhatsApp Dispatch Notification Message
    const itemsFormatted = items
      .map(
        (it: any, idx: number) =>
          `  ${idx + 1}. *${it.name}* (${it.weight}) x ${it.quantity} = ₹${it.price * it.quantity}`
      )
      .join('\n');

    const whatsappAdminText = `🚨 *NEW VINDHYAVAISINI ORDER RECEIVED!*\n\n` +
      `📦 *Order ID:* #${orderId}\n` +
      `👤 *Customer:* ${customerName} (+91 ${mobileNumber})\n` +
      `📍 *Address:* ${streetAddress}, Landmark: ${landmark || 'N/A'}, PIN: ${pincode}\n` +
      `⏰ *Delivery Slot:* ${deliverySlot}\n` +
      `💳 *Payment:* ${paymentMethod === 'UPI_ON_DELIVERY' ? 'Online Payment on Delivery (Scan QR / UPI)' : paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment on Delivery'}\n\n` +
      `🛒 *Items Ordered:*\n${itemsFormatted}\n\n` +
      `💰 *Subtotal:* ₹${itemsPrice}\n` +
      `🏷️ *Discount:* -₹${discount}\n` +
      `💵 *FINAL TOTAL:* ₹${finalTotal}\n\n` +
      `⚡ *Action Required:* Please prepare, pack and dispatch the order!`;

    // 3. Email Notification to Store Admin (Utkarsh.221005@gmail.com)
    let emailResult: any = { success: false, reason: 'Pending' };
    try {
      emailResult = await sendOrderNotificationEmail({
        orderId,
        customerName: newOrder.customerName,
        mobileNumber,
        streetAddress,
        landmark,
        pincode,
        deliverySlot,
        paymentMethod,
        items,
        itemsPrice,
        deliveryFee,
        discount: newOrder.discount,
        couponCode,
        finalTotal,
      });
    } catch (err: any) {
      console.error('[Order Email Trigger Failed]:', err);
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      emailSent: emailResult.success,
      whatsappAdminUrl: `https://wa.me/${SHOP_PHONE_E164}?text=${encodeURIComponent(whatsappAdminText)}`,
      whatsappNotificationText: whatsappAdminText,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'orderId and status are required' }, { status: 400 });
    }

    const store = getStore();
    const ord = store.orders.find((o: any) => o.orderId === orderId);
    if (!ord) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    ord.status = status;
    ord.updatedAt = new Date().toISOString();

    // write back to DATA_FILE
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.orders)) {
        const idx = parsed.orders.findIndex((o: any) => o.orderId === orderId);
        if (idx !== -1) {
          parsed.orders[idx].status = status;
          parsed.orders[idx].updatedAt = ord.updatedAt;
          fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');
        }
      }
    }

    return NextResponse.json({ success: true, order: ord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

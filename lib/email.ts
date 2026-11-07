import nodemailer from 'nodemailer';

export interface OrderNotificationPayload {
  orderId: string;
  customerName: string;
  mobileNumber: string;
  streetAddress: string;
  landmark?: string;
  pincode: string;
  deliverySlot: string;
  paymentMethod: string;
  items: Array<{
    name: string;
    weight: string;
    quantity: number;
    price: number;
  }>;
  itemsPrice: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  finalTotal: number;
}

export async function sendOrderNotificationEmail(order: OrderNotificationPayload) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'Utkarsh.221005@gmail.com';
  const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim().replace(/^["']|["']$/g, '') : '';
  const rawPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/^["']|["']$/g, '') : '';
  // Gmail app passwords can have spaces or no spaces; strip spaces for nodemailer reliability
  const smtpPass = rawPass.replace(/\s+/g, '');

  if (!smtpUser || !smtpPass) {
    console.warn(
      `[Email Warning] SMTP credentials (SMTP_USER, SMTP_PASS) not found in .env.local. Email notification for Order #${order.orderId} skipped.`
    );
    return { success: false, reason: 'SMTP credentials not configured in .env.local' };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const itemsRows = order.items
      .map(
        (it, idx) => `
        <tr style="border-bottom: 1px solid #283144;">
          <td style="padding: 10px 8px; color: #f5f5f5;">${idx + 1}. <strong>${it.name}</strong></td>
          <td style="padding: 10px 8px; color: #a3a3a3; text-align: center;">${it.weight}</td>
          <td style="padding: 10px 8px; color: #a3a3a3; text-align: center;">x ${it.quantity}</td>
          <td style="padding: 10px 8px; color: #CCA748; font-weight: bold; text-align: right;">₹${it.price * it.quantity}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07090e; color: #ffffff; padding: 24px; max-width: 600px; margin: auto; border-radius: 16px; border: 1px solid #232b3a;">
        
        <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #232b3a;">
          <div style="display: inline-block; background: linear-gradient(135deg, #FBF0A6 0%, #CCA748 50%, #8A5E18 100%); padding: 6px 18px; border-radius: 30px; font-weight: 900; color: #120e05; letter-spacing: 1px; font-size: 18px;">
            CHICKSUM
          </div>
          <h2 style="color: #ffffff; margin-top: 12px; margin-bottom: 4px; font-size: 20px;">🚨 NEW ORDER RECEIVED!</h2>
          <p style="color: #a3a3a3; font-size: 13px; margin: 0;">Order ID: <strong style="color: #CCA748; font-family: monospace;">#${order.orderId}</strong></p>
        </div>

        <div style="background-color: #0d1117; border-radius: 12px; padding: 16px; margin: 18px 0; border: 1px solid #1c222e;">
          <h3 style="color: #CCA748; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px;">👤 Customer & Delivery Details</h3>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Name:</strong> ${order.customerName}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Mobile:</strong> <a href="tel:${order.mobileNumber}" style="color: #25D366; text-decoration: none; font-weight: bold;">+91 ${order.mobileNumber}</a></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Address:</strong> ${order.streetAddress}${order.landmark ? ` (Landmark: ${order.landmark})` : ''}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>PIN Code:</strong> ${order.pincode}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Delivery Slot:</strong> <span style="color: #38bdf8;">${order.deliverySlot}</span></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Payment Method:</strong> <span style="color: ${order.paymentMethod === 'COD' ? '#fbbf24' : '#34d399'}; font-weight: bold;">${order.paymentMethod === 'UPI_ON_DELIVERY' ? 'Online Payment on Delivery (Scan QR / UPI)' : order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment on Delivery'}</span></p>
        </div>

        <div style="margin: 18px 0;">
          <h3 style="color: #CCA748; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">🛒 Ordered Items</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; background-color: #0d1117; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #121620; color: #a3a3a3; text-align: left;">
                <th style="padding: 8px;">Item</th>
                <th style="padding: 8px; text-align: center;">Pack</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
        </div>

        <div style="background-color: #121620; border-radius: 12px; padding: 14px 16px; margin: 18px 0; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #a3a3a3;">Items Subtotal:</span>
            <span style="font-weight: bold;">₹${order.itemsPrice}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #a3a3a3;">Delivery Fee:</span>
            <span style="color: #34d399; font-weight: bold;">${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
          </div>
          ${order.discount ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #f87171;">
            <span>Discount:</span>
            <span>-₹${order.discount}</span>
          </div>` : ''}
          <div style="border-top: 1px solid #232b3a; margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; font-size: 16px;">
            <strong style="color: #ffffff;">Final Bill Total:</strong>
            <strong style="color: #CCA748;">₹${order.finalTotal}</strong>
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #232b3a;">
          <a href="https://wa.me/91${order.mobileNumber}?text=Hi%20${encodeURIComponent(order.customerName)},%20we%20have%20received%20your%20order%20%23${order.orderId}%20at%20CHICKSUM!%20Preparing%20your%20fresh%20cut%20now."
             style="display: inline-block; background-color: #25D366; color: #000000; font-weight: 900; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px;">
            💬 WhatsApp Customer Directly
          </a>
        </div>

        <p style="color: #737373; font-size: 11px; text-align: center; margin-top: 16px;">
          CHICKSUM Varanasi • Real-Time Order Management
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"CHICKSUM Orders" <${smtpUser}>`,
      to: adminEmail,
      subject: `🚨 [NEW ORDER] #${order.orderId} - ₹${order.finalTotal} from ${order.customerName} (${order.pincode})`,
      html: htmlContent,
    });

    console.log(`[Order Email Success] Notification sent to ${adminEmail} for Order #${order.orderId}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Order Email Error] Failed to send email for Order #${order.orderId}:`, error);
    return { success: false, error: error.message };
  }
}


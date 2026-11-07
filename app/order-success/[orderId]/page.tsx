"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem("chiksum_orders") || "[]");
      const found = orders.find((o: any) => o.orderId === orderId);
      if (found) {
        setOrder(found);
      }
    } catch (e) {
      console.error(e);
    }
  }, [orderId]);

  const handleWhatsAppUpdates = () => {
    if (!order) {
      const text = encodeURIComponent(
        `Namaste Vindhyavaisini! I just placed order #${orderId}. Please send me preparation and delivery updates.`
      );
      window.open(`https://wa.me/919264933232?text=${text}`, "_blank");
      return;
    }

    const itemsSummary = (order.items || [])
      .map((it: any, i: number) => `  ${i + 1}. *${it.name}* (${it.weight}) x ${it.quantity} = ₹${it.price * it.quantity}`)
      .join('\n');

    const fullMessage =
      `🚨 *NEW ORDER NOTIFICATION - VINDHYAVAISINI*\n\n` +
      `📦 *Order ID:* #${order.orderId}\n` +
      `👤 *Customer Name:* ${order.customerName}\n` +
      `📞 *Mobile Number:* +91 ${order.mobileNumber}\n` +
      `📍 *Address:* ${order.streetAddress}${order.landmark ? `, Landmark: ${order.landmark}` : ''}, PIN: ${order.pincode}\n` +
      `⏰ *Delivery Slot:* ${order.deliverySlot}\n` +
      `💳 *Payment:* ${order.paymentMethod === 'UPI_ON_DELIVERY' ? 'UPI on Delivery (Scan QR)' : 'Cash on Delivery (COD)'}\n\n` +
      `🛒 *Items:*\n${itemsSummary}\n\n` +
      `💵 *FINAL TOTAL:* ₹${order.finalTotal}\n\n` +
      `Please confirm and dispatch!`;

    window.open(`https://wa.me/919264933232?text=${encodeURIComponent(fullMessage)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-white py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Exact Green ORDER CONFIRMED Card from Screenshot */}
        <div className="bg-[#123E28] border border-[#1F6B45] text-white rounded-3xl p-6 sm:p-8 text-center shadow-[0_12px_40px_rgba(18,62,40,0.6)] relative overflow-hidden animate-fade-in">
          
          {/* Ambient inner glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Success Checkmark Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="text-xs uppercase tracking-widest text-emerald-200 font-extrabold block mb-1">
            Order Successfully Placed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-white mb-2">
            ORDER CONFIRMED
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-sm mx-auto mb-4 leading-relaxed">
            Order ID • Confirmation • Delivery updates
          </p>

          {/* Order ID Pill */}
          <div className="inline-block bg-black/40 border border-emerald-500/40 px-5 py-2 rounded-full font-mono text-base font-extrabold text-emerald-300 tracking-wider mb-2">
            #{orderId || "CHK-CONFIRMED"}
          </div>
          
          <p className="text-[11px] text-emerald-200/70 mt-1">
            Estimated Delivery: <strong className="text-white">45-60 Minutes (Express Dispatch)</strong>
          </p>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="bg-[#12161F] border border-[#232938] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-[#1E2533] pb-2">
              Delivery &amp; Payment Details
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Deliver To</span>
                <span className="font-semibold text-white">{order.customerName} (+91 {order.mobileNumber})</span>
                <p className="text-neutral-400 text-[11px] mt-0.5">{order.streetAddress}, PIN: {order.pincode}</p>
              </div>

              <div>
                <span className="text-neutral-500 block">Payment Method</span>
                <span className="font-semibold text-[#DAAE3C]">
                  {order.paymentMethod === "UPI_ON_DELIVERY"
                    ? "Online Payment on Delivery (Scan QR / UPI)"
                    : order.paymentMethod === "COD"
                    ? "Cash on Delivery (COD)"
                    : "Online Payment on Delivery"}
                </span>
                <p className="text-neutral-400 text-[11px] mt-0.5">Amount: ₹{order.finalTotal}</p>
              </div>
            </div>

            {/* Items summary */}
            <div className="border-t border-[#1E2533] pt-3 space-y-2">
              <span className="text-xs font-semibold text-neutral-400 block">Items in this order:</span>
              <div className="space-y-1.5">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-xs text-neutral-300">
                    <span>{item.name} ({item.weight}) x {item.quantity}</span>
                    <span className="font-mono font-medium text-white">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Next Step Actions: WhatsApp Updates + Back to Shop */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppUpdates}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BE5B] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(37,211,102,0.3)]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 0.743.965 1.202.664.591 1.224.774 1.397.86.173.086.274.072.375-.043.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.072.043.419-.101.824z" />
            </svg>
            <span>Get WhatsApp Live Dispatch Updates</span>
          </button>

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 text-center bg-[#181D27] hover:bg-[#222836] border border-[#2D3547] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Back to Home
            </Link>
            <Link
              href="/my-orders"
              className="flex-1 text-center bg-[#181D27] hover:bg-[#222836] border border-[#2D3547] text-[#DAAE3C] font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              View My Orders
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}


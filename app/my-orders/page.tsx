"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [phoneSearch, setPhoneSearch] = useState<string>("");
  const [searched, setSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeUserPhone, setActiveUserPhone] = useState<string>("");

  useEffect(() => {
    try {
      // 1. Check local session orders
      const saved = JSON.parse(localStorage.getItem("chiksum_orders") || "[]");
      if (saved && saved.length > 0) {
        setOrders(saved);
        if (saved[0]?.mobileNumber) {
          setActiveUserPhone(saved[0].mobileNumber);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Phone number lookup for returning customers from any device
  const handlePhoneLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch || phoneSearch.trim().length !== 10) return;

    setIsSearching(true);
    setSearched(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        const userOrders = data.orders.filter(
          (o: any) => o.mobileNumber === phoneSearch.trim()
        );
        setOrders(userOrders);
        setActiveUserPhone(phoneSearch.trim());
      }
    } catch (err) {
      console.error("Error searching orders:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrackWhatsApp = (orderId: string) => {
    const text = encodeURIComponent(
      `Namaste Vindhyavaisini! Please share live status for my order #${orderId}.`
    );
    window.open(`https://wa.me/919264933232?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto selection:bg-[#DAAE3C] selection:text-black">
      
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1E2533] pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#DAAE3C] font-bold">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            My Orders &amp; Tracking
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            View orders placed on this phone or look up orders using your 10-digit mobile number.
          </p>
        </div>

        <Link
          href="/products"
          className="bg-gradient-to-r from-[#F3CD4D] via-[#DAAE3C] to-[#B38728] hover:brightness-110 text-black font-black text-xs uppercase px-5 py-2.5 rounded-xl tracking-wide transition-all shadow-md shrink-0"
        >
          Order Fresh Meat →
        </Link>
      </div>

      {/* Lookup Bar by Mobile Number */}
      <div className="bg-[#11151F] border border-[#232B3B] p-4 rounded-2xl mb-8 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-200">
            🔍 Track by Mobile Number (From any phone or browser):
          </span>
          {activeUserPhone && (
            <span className="text-[11px] text-[#DAAE3C] font-semibold bg-[#1C2333] px-2.5 py-0.5 rounded-md border border-[#2E3B52]">
              Viewing for: +91 {activeUserPhone}
            </span>
          )}
        </div>

        <form onSubmit={handlePhoneLookup} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-2.5 text-xs text-neutral-500 font-mono">+91</span>
            <input
              type="tel"
              maxLength={10}
              placeholder="Enter your 10-digit mobile number..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-[#090C12] border border-[#293448] focus:border-[#DAAE3C] rounded-xl pl-12 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-[#DAAE3C] hover:bg-[#c29c27] text-black font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-md"
          >
            {isSearching ? "Searching..." : "Find Orders"}
          </button>
        </form>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#11151F] border border-[#232B3B] rounded-2xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#181F2C] flex items-center justify-center mx-auto text-2xl text-neutral-400">
            📦
          </div>
          <h3 className="text-base font-bold text-white">
            {searched ? "No Orders Found for this Mobile Number" : "No Orders Found On This Device"}
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searched
              ? "Please check the 10-digit number entered, or place your first order below."
              : "Orders you place will appear here automatically with live tracking & reorder options."}
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#DAAE3C] text-black font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
          >
            Start Ordering
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-neutral-400 flex justify-between items-center px-1">
            <span>Showing <strong>{orders.length}</strong> order{orders.length > 1 ? "s" : ""}</span>
            <span className="text-[11px] text-emerald-400">⚡ Cold-chain 45-60 min dispatch</span>
          </div>

          {orders.map((order, idx) => (
            <div
              key={order.orderId || idx}
              className="bg-[#11151F] border border-[#232B3B] hover:border-[#DAAE3C]/50 rounded-2xl p-5 space-y-3 transition-all duration-200 shadow-lg"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#1E2533] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-[#DAAE3C]">
                      #{order.orderId}
                    </span>
                    <span className="bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      ✓ {order.status || "CONFIRMED"}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">
                    {order.date ? new Date(order.date).toLocaleDateString() : "Recent"} • Slot: <strong className="text-neutral-300">{order.deliverySlot}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-white font-mono">
                    ₹{order.finalTotal}
                  </span>
                  <button
                    onClick={() => handleTrackWhatsApp(order.orderId)}
                    className="text-xs bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-black font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    💬 Live Track
                  </button>
                </div>
              </div>

              {/* Items in order */}
              <div className="text-xs text-neutral-300 space-y-1.5 py-1">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-neutral-400 bg-[#0A0D12] p-2 rounded-lg border border-[#1E2533]">
                    <span className="font-medium text-white">{item.name} ({item.weight}) x {item.quantity}</span>
                    <span className="text-white font-mono font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Method footer */}
              <div className="border-t border-[#1C212B] pt-2 flex flex-col sm:flex-row justify-between text-[11px] text-neutral-400 gap-1">
                <span>Deliver to: <strong className="text-neutral-300">{order.streetAddress}, PIN: {order.pincode}</strong></span>
                <span className="text-[#DAAE3C] font-semibold">{order.paymentMethod === 'UPI_ON_DELIVERY' ? 'Online Payment on Delivery (UPI)' : order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment on Delivery'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

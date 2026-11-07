"use client";

import React, { useState } from "react";
import { SERVICEABLE_PINCODES } from "@/lib/CartContext";
import { MINIMUM_ORDER_VALUE, SHOP_PHONE_E164 } from "@/lib/shop";

export default function DeliveryAreasPage() {
  const [searchPin, setSearchPin] = useState("");

  const pins = Object.entries(SERVICEABLE_PINCODES);

  const filtered = pins.filter(([pin, data]) => {
    return pin.includes(searchPin) || data.area.toLowerCase().includes(searchPin.toLowerCase());
  });

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Namaste Vindhyavaisini! I want to check delivery for a PIN code not listed on your website."
    );
    window.open(`https://wa.me/${SHOP_PHONE_E164}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-white py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#DAAE3C] font-bold">
          Coverage &amp; Delivery Logistics
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Serviceable PIN Codes &amp; Charges
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Free delivery of fresh mithai and snacks within 2 km of our Ghosi shop. Minimum order ₹{MINIMUM_ORDER_VALUE}.
        </p>
      </div>

      {/* Search Filter */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search area name or 6-digit PIN..."
          value={searchPin}
          onChange={(e) => setSearchPin(e.target.value)}
          className="w-full bg-[#12161F] border border-[#2B3447] focus:border-[#DAAE3C] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
        />
      </div>

      {/* Pincodes Table */}
      <div className="bg-[#12161F] border border-[#232938] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#181D27] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-[#232938]">
            <tr>
              <th className="py-3 px-4">PIN Code</th>
              <th className="py-3 px-4">Area / Locality</th>
              <th className="py-3 px-4">Estimated Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2533]">
            {filtered.map(([pin, details]) => (
              <tr key={pin} className="hover:bg-[#161C27] transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#DAAE3C]">{pin}</td>
                <td className="py-3.5 px-4 font-medium text-white">{details.area}</td>
                <td className="py-3.5 px-4 text-neutral-400">{details.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Not on the list? WhatsApp assistance */}
      <div className="mt-8 bg-[#151D18] border border-[#25D366]/30 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-white">Don&apos;t see your area listed?</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Delivery is currently limited to a 2 km radius. Send your live location on WhatsApp and we will quickly confirm availability.
        </p>
        <button
          onClick={handleWhatsApp}
          className="bg-[#25D366] hover:bg-[#20BE5B] text-black font-extrabold text-xs uppercase px-6 py-3 rounded-xl tracking-wider transition-all inline-flex items-center gap-2"
        >
          💬 Ask on WhatsApp for Special Delivery
        </button>
      </div>

    </div>
  );
}


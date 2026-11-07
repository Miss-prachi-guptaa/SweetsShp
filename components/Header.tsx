"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";

export default function Header() {
  const { totalItems, setIsCartOpen, pincodeInfo, verifyPincode } = useCart();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");
    const res = verifyPincode(pinInput);
    if (res.serviceable) {
      setPinSuccess(res.message);
      setTimeout(() => setShowPinModal(false), 1200);
    } else {
      setPinError(res.message);
    }
  };

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent(
      "Namaste Vindhyavaisini! Please confirm delivery to my area and help me place an order."
    );
    window.open(`https://wa.me/919264933232?text=${text}`, "_blank");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (Matches logo gradient: Soft gold to rich dark gold with continuous smooth motion marquee) */}
      <div className="bg-gradient-to-r from-[#FBF0A6] via-[#DAAE3C] to-[#9E7422] text-[#120E05] text-xs font-bold py-1.5 shadow-sm overflow-hidden select-none relative">
        <div className="w-full flex items-center justify-between px-3 sm:px-6">
          {/* Continuous Infinite Marquee Scroller */}
          <div className="relative flex-1 overflow-hidden">
            <div className="marquee-track flex whitespace-nowrap items-center">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 shrink-0 px-4">
                  <span className="text-sm">🚚</span>
                  <span className="tracking-wide">
                    FRESH MITHAI EVERY DAY <span className="opacity-60">•</span> ₹110 Minimum Order <span className="opacity-60">•</span> Free Delivery within 2 km in Ghosi
                  </span>
                  <span className="text-[#8A5E18] font-black">★</span>
                  <span className="tracking-wide">
                    Traditional Recipes &amp; Premium Ingredients
                  </span>
                  <span className="text-[#8A5E18] font-black">★</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Right Links */}
          <div className="hidden lg:flex items-center gap-4 shrink-0 text-[11px] font-bold pl-4 z-10 bg-gradient-to-l from-[#9E7422] via-[#9E7422]/90 to-transparent">
            <Link href="/my-orders" className="hover:underline flex items-center gap-1">
              <span>👤</span> My Orders
            </Link>
            <span>|</span>
            <Link href="/contact" className="hover:underline">
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#1A0405]/95 backdrop-blur-md border-b border-[#6E191D] shadow-xl">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 md:gap-8">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
                <div className="relative h-11 w-28 sm:h-14 sm:w-40 shrink-0 flex items-center justify-center">
                  <Image
                    src="/vindhyavaisini/logo.png"
                    alt="Vindhyavaisini Sweets"
                    width={220}
                    height={80}
                    className="h-auto w-full object-contain drop-shadow-[0_2px_10px_rgba(218,174,60,0.45)] group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="hidden xl:block">
                  <span className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-[#FBF0A6] via-[#DAAE3C] to-[#9E7422] bg-clip-text text-transparent block leading-none">
                    VINDHYAVAISINI
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-neutral-400 font-medium tracking-tight block mt-0.5">
                    Mithai • Snacks • Celebrations
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Search Bar (Prominent in middle on md/lg screens) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search gulab jamun, barfi, laddoo, samosa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121620] border border-[#232B3A] focus:border-[#DAAE3C] rounded-full py-2.5 pl-11 pr-4 text-xs lg:text-sm text-white placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
                />
                <svg
                  className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </form>
            </div>

            {/* Right Action Buttons: Location, WhatsApp, Cart */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              
              {/* Delivery Location Pill */}
              <button
                onClick={() => setShowPinModal(true)}
                className={`hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-full transition-all cursor-pointer ${
                  pincodeInfo && !pincodeInfo.isServiceable
                    ? "border border-red-500/60 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                    : "border border-[#232B3A] bg-[#121620] text-neutral-300 hover:bg-[#181F2C] hover:text-white"
                }`}
              >
                <svg className={`w-4 h-4 shrink-0 ${pincodeInfo && !pincodeInfo.isServiceable ? "text-red-400" : "text-[#DAAE3C]"}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div className="text-left text-[11px] leading-tight">
                  <span className={`text-[9px] block -mb-0.5 ${pincodeInfo && !pincodeInfo.isServiceable ? "text-red-300/80" : "text-neutral-400"}`}>
                    {pincodeInfo && !pincodeInfo.isServiceable ? "Delivery status" : "Delivering to"}
                  </span>
                  <span className={`font-semibold flex items-center gap-1 ${pincodeInfo && !pincodeInfo.isServiceable ? "text-red-300" : "text-white"}`}>
                    {pincodeInfo?.isServiceable ? pincodeInfo.pincode : pincodeInfo ? "Not Serviceable Area" : "Check location"}
                    <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </button>

              {/* WhatsApp Quick Order Button */}
              <a
                href="https://wa.me/919264933232?text=Namaste%20Vindhyavaisini!%20I%20would%20like%20to%20order%20mithai%20and%20snacks."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 bg-[#121620] hover:bg-[#25D366] text-neutral-200 hover:text-black border border-[#232B3A] hover:border-[#25D366] px-3.5 py-2 rounded-full transition-all text-xs font-semibold"
              >
                <svg className="w-4 h-4 fill-current text-[#25D366] group-hover:text-black" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </a>

              {/* Admin Login / Profile */}
              <Link
                href="/admin"
                aria-label="Admin Login"
                title="Admin Login"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2B3447] bg-[#121620] text-neutral-300 transition-all hover:border-[#DAAE3C] hover:bg-[#DAAE3C]/10 hover:text-[#DAAE3C] sm:h-11 sm:w-11"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
                </svg>
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#F3CD4D] via-[#DAAE3C] to-[#9E7422] hover:opacity-95 text-[#120E05] transition-all shadow-[0_2px_14px_rgba(218,174,60,0.35)] active:scale-95 cursor-pointer"
                aria-label="View Cart"
              >
                <svg className="w-5 h-5 text-[#120E05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-[#FBF0A6] border border-[#DAAE3C] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Only visible on small/mobile screens below the header) */}
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search mithai, snacks, gift boxes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121620] border border-[#212838] focus:border-[#DAAE3C] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-400 focus:outline-none transition-all shadow-inner"
              />
              <svg
                className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
          </div>

          {/* Desktop Category Navigation Links (Matches wireframe below main bar: Home, All Products, Chicken, Mutton, Fish & Seafood, Vegetables, About Us, Contact) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 py-2.5 border-t border-[#1C222E] text-xs font-semibold text-neutral-300">
            <Link href="/" className="text-[#DAAE3C] hover:text-[#FBF0A6] transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-white transition-colors">
              All Products
            </Link>
            <Link href="/products?category=Traditional%20Sweets" className="hover:text-[#DAAE3C] transition-colors">
              Traditional Sweets
            </Link>
            <Link href="/products?category=Barfi%20%26%20Kaju" className="hover:text-[#DAAE3C] transition-colors">
              Barfi &amp; Kaju
            </Link>
            <Link href="/products?category=Snacks%20%26%20Chaat" className="hover:text-[#DAAE3C] transition-colors">
              Snacks &amp; Chaat
            </Link>
            <Link href="/products?category=Gift%20Boxes" className="hover:text-[#DAAE3C] transition-colors">
              Gift Boxes
            </Link>
            <Link href="/about-us" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

        </div>
      </header>

      {/* PIN Code Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141820] border border-[#2B313E] rounded-2xl p-6 max-w-sm w-full text-white shadow-2xl relative">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-full bg-[#DAAE3C]/10 border border-[#DAAE3C]/30 flex items-center justify-center mx-auto mb-3 text-[#DAAE3C]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center text-[#DAAE3C]">Enter Delivery PIN Code</h3>
            <p className="text-xs text-neutral-400 text-center mt-1 mb-4">
              We check your PIN to guarantee fresh cut &amp; express 45-60 mins delivery.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit PIN (e.g. 221005)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-[#0E1117] border border-[#2B313E] focus:border-[#DAAE3C] rounded-xl px-4 py-3 text-center text-lg tracking-widest font-mono text-white placeholder-neutral-500 focus:outline-none"
                autoFocus
              />

              {pinError && (
                <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-2.5 text-xs text-red-300">
                  <p>{pinError}</p>
                  <button
                    type="button"
                    onClick={handleWhatsAppHelp}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                  >
                    💬 Order via WhatsApp assistance instead
                  </button>
                </div>
              )}

              {pinSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-2.5 text-xs text-emerald-300 text-center font-medium">
                  ✓ {pinSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F3CD4D] via-[#DAAE3C] to-[#9E7422] hover:opacity-95 text-[#120E05] font-black py-3 rounded-xl transition-all text-sm uppercase tracking-wide cursor-pointer shadow-lg shadow-[#DAAE3C]/20"
              >
                Verify &amp; Continue
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-[#222731] text-center text-[11px] text-neutral-400">
              Ghosi, District Mau • PIN 284128 • Free delivery within 2 km
            </div>
          </div>
        </div>
      )}
    </>
  );
}

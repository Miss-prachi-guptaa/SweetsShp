"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, isCartOpen, setIsCartOpen, finalTotal } = useCart();
  const [isDismissed, setIsDismissed] = useState(false);

  // If item count changes or items added again, re-show floating pill
  useEffect(() => {
    setIsDismissed(false);
  }, [totalItems]);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Namaste Vindhyavaisini! Please share today's fresh mithai and snacks menu."
    );
    window.open(`https://wa.me/919919853648?text=${text}`, "_blank");
  };

  return (
    <>
      {/* Floating Ready to Place Order pill if items are in cart and cart drawer is NOT open */}
      {totalItems > 0 && !isDismissed && !isCartOpen && pathname !== "/checkout" && (
        <div className="fixed bottom-[72px] sm:bottom-6 inset-x-0 z-50 px-3 sm:px-4 max-w-lg mx-auto pointer-events-none transition-all">
          <div className="bg-[#181D27]/98 border border-[#DAAE3C] rounded-2xl p-2.5 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center justify-between pointer-events-auto backdrop-blur-md relative gap-2">
            
            {/* Top-Right Absolute Cross (X) Close Button so it's always clearly visible and never cut */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#1F2533] hover:bg-[#E02636] border border-[#DAAE3C]/60 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 z-20"
              title="Dismiss"
              aria-label="Dismiss order notification"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Info */}
            <div className="pl-1 sm:pl-2 min-w-0">
              <span className="text-[11px] text-neutral-300 block font-medium leading-tight">Ready to place your order?</span>
              <span className="text-sm sm:text-base font-extrabold text-[#DAAE3C] block leading-tight mt-0.5">
                {totalItems} item{totalItems > 1 ? "s" : ""} • ₹{finalTotal}
              </span>
            </div>

            {/* Right Action */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-gradient-to-r from-[#FBF0A6] via-[#DAAE3C] to-[#C5972C] hover:brightness-110 text-black font-black text-xs sm:text-sm uppercase px-3.5 sm:px-5 py-2.5 rounded-xl tracking-wider transition-all shadow-md flex items-center gap-1.5 active:scale-95"
              >
                <span>ORDER NOW</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar matching screenshot: Home | Orders | Offers | Profile/WhatsApp */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B0D11]/95 backdrop-blur-md border-t border-[#1F2533] px-2 py-2">
        <div className="grid grid-cols-4 items-center text-center">
          
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname === "/" ? "text-[#DAAE3C]" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-[10px] font-bold">Home</span>
            {pathname === "/" && <span className="w-4 h-0.5 bg-gradient-to-r from-[#FBF0A6] to-[#DAAE3C] rounded-full mt-0.5" />}
          </Link>

          {/* Orders */}
          <Link
            href="/my-orders"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname === "/my-orders" ? "text-[#DAAE3C]" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-medium">Orders</span>
          </Link>

          {/* Catalogue / Offers */}
          <Link
            href="/products"
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              pathname.startsWith("/products") ? "text-[#DAAE3C]" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-[10px] font-medium">Shop</span>
          </Link>

          {/* WhatsApp Support / Help */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <svg className="w-5 h-5 mb-0.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 0.743.965 1.202.664.591 1.224.774 1.397.86.173.086.274.072.375-.043.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.072.043.419-.101.824z" />
            </svg>
            <span className="text-[10px] font-medium">Support</span>
          </button>

        </div>
      </nav>
    </>
  );
}


"use client";

import React, { useState } from "react";
import Link from "next/link";
import BlurImage from "@/components/BlurImage";
import { useCart } from "@/lib/CartContext";
import { formatItemWeight, getBaseWeightLabel, checkCartMinWeightViolations } from "@/lib/weightHelper";
import { MINIMUM_ORDER_VALUE } from "@/lib/shop";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    itemsPrice,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
    finalTotal,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isCartOpen) return null;

  // Check minimum weight restrictions:
  // Chicken: Min 1 kg
  // Fish & Seafood: Min 1 kg
  // Mutton: Min half kg (500 g)
  const minWeightViolations = checkCartMinWeightViolations(cart);
  const hasWeightViolation = minWeightViolations.length > 0;
  const hasMinimumValueViolation = itemsPrice < MINIMUM_ORDER_VALUE;
  const checkoutBlocked = hasWeightViolation || hasMinimumValueViolation;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg({
      type: res.success ? "success" : "error",
      text: res.message,
    });
  };

  const categoryQuickAdd = [
    { name: "Mithai", slug: "Traditional Sweets", image: "/vindhyavaisini/mithai-hero.png" },
    { name: "Barfi", slug: "Barfi & Kaju", image: "/vindhyavaisini/mithai-hero.png" },
    { name: "Snacks", slug: "Snacks & Chaat", image: "/vindhyavaisini/mithai-hero.png" },
    { name: "Gift Boxes", slug: "Gift Boxes", image: "/vindhyavaisini/mithai-hero.png" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container: 100% width on mobile (no awkward left padding), max-w-md on desktop */}
      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
        <div className="w-full sm:w-[420px] bg-[#0E1219] border-l border-[#242A38] text-white flex flex-col shadow-2xl h-full">
          
          {/* Header */}
          <div className="p-4 border-b border-[#242A38] flex items-center justify-between bg-[#151922] shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#DAAE3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="font-extrabold text-base text-white">Your Cart</h2>
              <span className="text-xs bg-[#DAAE3C]/20 text-[#DAAE3C] px-2 py-0.5 rounded-full font-bold">
                {totalItems} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202634] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Cart Items Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181D27] flex items-center justify-center mx-auto text-neutral-400">
                  🛒
                </div>
                <h3 className="text-base font-bold text-neutral-200">Your cart is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Add fresh mithai, snacks or a celebration gift box to begin your order.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {categoryQuickAdd.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${encodeURIComponent(cat.slug)}`}
                      onClick={() => setIsCartOpen(false)}
                      className="flex items-center gap-2 bg-[#161C27] border border-[#2B3547] hover:border-[#DAAE3C] p-2 rounded-xl text-left transition-all"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <BlurImage src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-bold text-white">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Items loop */}
                <div className="space-y-2.5">
                  {cart.map((item) => {
                    const uniqueKey = item.itemKey || `${item.id}_${item.weight}`;
                    return (
                    <div
                      key={uniqueKey}
                      className="flex gap-2.5 bg-[#141822] border border-[#232938] p-2.5 sm:p-3 rounded-xl relative group"
                    >
                      {/* Product image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0A0D12] border border-[#2B3547]">
                        <BlurImage src={item.image} alt={item.name} fill className="object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.name}</h4>
                        
                        {/* Dynamic calculated weight pill */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-black text-[#DAAE3C] bg-[#1E2535] px-2 py-0.5 rounded border border-[#2E394E]">
                            Pack: {item.weight} (Qty: {item.quantity})
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-amber-300">
                          Total: {formatItemWeight(item.weight, item.quantity, item.category)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-black text-white font-mono">
                            ₹{item.price * item.quantity}
                          </span>

                          {/* Quantity selector */}
                          <div className="flex items-center border border-[#2E374A] rounded-lg bg-[#0B0D12] overflow-hidden">
                            <button
                              onClick={() => updateQuantity(uniqueKey, -1)}
                              className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#1E2533] transition-colors font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-black text-white font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(uniqueKey, 1)}
                              className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#1E2533] transition-colors font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromCart(uniqueKey)}
                        className="absolute right-2 top-2 text-neutral-500 hover:text-red-400 text-xs p-1"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  );
                  })}
                </div>

                {/* ADD MORE ITEMS — Visual Category Tiles instead of just a link! */}
                <div className="bg-[#121620] border border-[#222A3A] p-3 rounded-2xl space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#DAAE3C] block">
                    + Add More Items From Category:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {categoryQuickAdd.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${encodeURIComponent(cat.slug)}`}
                        onClick={() => setIsCartOpen(false)}
                        className="group flex flex-col items-center p-1.5 rounded-xl bg-[#181E2B] hover:bg-[#20283A] border border-[#293448] hover:border-[#DAAE3C] transition-all text-center"
                      >
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden mb-1 border border-[#34425A]">
                          <BlurImage src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-200 group-hover:text-[#DAAE3C] truncate w-full">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="bg-[#141822] border border-[#242A38] p-3 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-neutral-300 block">Apply Coupon</span>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg text-xs text-emerald-300 font-medium">
                      <span>✓ &apos;{couponCode}&apos; applied (-₹{discount})</span>
                      <button onClick={removeCoupon} className="text-neutral-400 hover:text-white text-xs underline">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try CHIK10 or WELCOME10"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="flex-1 bg-[#0A0D12] border border-[#2B3447] focus:border-[#DAAE3C] rounded-lg px-3 py-1.5 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-[#DAAE3C] hover:bg-[#B58729] text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponMsg && !couponCode && (
                    <p className={`text-[11px] ${couponMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="bg-[#141822] border border-[#242A38] p-3 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Items Subtotal</span>
                    <span className="text-white font-mono">₹{itemsPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Coupon</span>
                      <span className="font-mono">-₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-[#242A38] pt-2 flex justify-between text-sm font-extrabold text-white">
                    <span>To Pay</span>
                    <span className="text-[#DAAE3C] text-base font-mono">₹{finalTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          {cart.length > 0 && (
            <div className="p-3.5 border-t border-[#242A38] bg-[#11151F] space-y-2 shrink-0">
              
              {/* Minimum Weight Requirement Warning Alert */}
              {hasMinimumValueViolation && (
                <div className="rounded-xl border border-amber-600/70 bg-amber-950/70 p-2.5 text-xs text-amber-200">
                  <strong className="text-amber-400">Minimum order ₹{MINIMUM_ORDER_VALUE}</strong>
                  <p className="mt-1 text-[11px]">Add ₹{MINIMUM_ORDER_VALUE - itemsPrice} more to proceed. Delivery is free within 2 km.</p>
                </div>
              )}

              {hasWeightViolation && (
                <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-600/70 space-y-1.5 text-xs text-amber-200">
                  <div className="flex items-center gap-1.5 font-black text-amber-400">
                    <span>⚠️ Minimum Order Requirement:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90 pl-1">
                    {minWeightViolations.map((v) => (
                      <li key={v.name}>
                        <strong className="text-white">{v.name}</strong> minimum required is{" "}
                        <strong className="text-[#DAAE3C]">{v.minDisplay}</strong> (currently: {v.currentDisplay}).
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-amber-300 font-semibold pt-0.5">
                    Please increase quantity (+) to reach minimum order requirement.
                  </p>
                </div>
              )}

              {checkoutBlocked ? (
                <button
                  disabled
                  className="w-full flex items-center justify-between bg-neutral-800 text-neutral-400 font-black py-3 px-4 rounded-xl text-xs sm:text-sm uppercase tracking-wide cursor-not-allowed opacity-75 border border-neutral-700"
                >
                  <span>MINIMUM ORDER ₹{MINIMUM_ORDER_VALUE}</span>
                  <span className="bg-neutral-900 text-neutral-400 px-2.5 py-1 rounded-md text-xs font-mono font-bold">
                    ₹{finalTotal}
                  </span>
                </button>
              ) : (
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-[#F3CD4D] via-[#DAAE3C] to-[#B38728] hover:brightness-110 text-black font-black py-3 px-4 rounded-xl transition-all shadow-[0_4px_16px_rgba(218,174,60,0.3)] text-xs sm:text-sm uppercase tracking-wide cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <span className="bg-black text-[#DAAE3C] px-2.5 py-1 rounded-md text-xs font-mono font-bold">
                    ₹{finalTotal}
                  </span>
                </Link>
              )}

              {/* WhatsApp orders collect complete delivery details before opening WhatsApp. */}
              {checkoutBlocked ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-[#141F1A] border border-neutral-700 text-neutral-500 font-bold py-2 px-3 rounded-xl text-xs cursor-not-allowed opacity-60"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 0.743.965 1.202.664.591 1.224.774 1.397.86.173.086.274.072.375-.043.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.072.043.419-.101.824z" />
                  </svg>
                  <span>Minimum order ₹{MINIMUM_ORDER_VALUE} required</span>
                </button>
              ) : (
                <Link
                  href="/checkout?mode=whatsapp"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#1A2E22] hover:bg-[#203D2C] border border-[#25D366]/40 text-[#25D366] font-bold py-2 px-3 rounded-xl transition-all text-xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 0.743.965 1.202.664.591 1.224.774 1.397.86.173.086.274.072.375-.043.101-.116.433-.506.549-.679.116-.173.231-.144.39-.086.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.072.043.419-.101.824z" />
                  </svg>
                  <span>Continue with WhatsApp</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

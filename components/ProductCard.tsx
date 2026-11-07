"use client";

import React, { useState } from "react";
import BlurImage from "@/components/BlurImage";
import { useCart } from "@/lib/CartContext";
import { formatItemWeight, getBaseWeightLabel } from "@/lib/weightHelper";

export interface ProductVariant {
  weight: string;
  price: number;
  originalPrice?: number;
}

export interface ProductProps {
  id: number;
  name: string;
  slug?: string;
  weight: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  tag?: string;
  rating?: number;
  cutType?: string;
  description?: string;
  inStock?: boolean;
  variants?: ProductVariant[];
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { cart, addToCart, updateQuantity } = useCart();

  // Variants list: if variants array provided use it, otherwise default to single weight
  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [{ weight: product.weight, price: product.price, originalPrice: product.originalPrice }];

  // Currently selected variant state (defaults to first variant)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const activeVariant = variants[selectedVariantIndex] || variants[0];

  const currentWeight = activeVariant.weight;
  const currentPrice = activeVariant.price;
  const currentOriginalPrice = activeVariant.originalPrice;

  // Key in cart
  const itemKey = `${product.id}_${currentWeight}`;
  const cartItem = cart.find((i) => (i.itemKey || `${i.id}_${i.weight}`) === itemKey);
  const qty = cartItem ? cartItem.quantity : 0;

  const isOnDemand = currentPrice === 0 || Boolean(currentWeight && currentWeight.toLowerCase().includes("on demand"));
  const weightPillLabel = getBaseWeightLabel(currentWeight);

  // Discount percentage
  const discountPercent =
    currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : null;

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Namaste Vindhyavaisini! I want to order: *${product.name}* (${currentWeight}) at ₹${currentPrice}. Please confirm availability.`
    );
    window.open(`https://wa.me/919919853648?text=${text}`, "_blank");
  };

  return (
    <div className="group bg-[#0D1117] border border-[#212838] hover:border-[#DAAE3C] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_32px_rgba(218,174,60,0.18)] hover:-translate-y-1 relative">
      
      {/* 1. PRODUCT PHOTO with 16:10 aspect ratio */}
      <div className="relative aspect-[16/10] w-full bg-[#161B22] overflow-hidden">
        <BlurImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Ambient shadow gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-black/30 pointer-events-none" />

        {/* Badges container */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {product.tag && (
            <span className="bg-gradient-to-r from-[#F3CD4D] to-[#DAAE3C] text-[#120E05] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
              {product.tag}
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-md">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Availability Badge & WhatsApp */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm ${
            product.inStock === false
              ? "bg-rose-950/80 text-rose-400 border border-rose-800"
              : "bg-[#0A2E1A]/80 text-emerald-400 border border-emerald-700/60"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock === false ? "bg-rose-400" : "bg-emerald-400 animate-pulse"}`} />
            {product.inStock === false ? "Out of Stock" : "In Stock"}
          </span>
        </div>

        {/* Bottom tags on image (cut type and rating) */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] z-10">
          {product.rating && (
            <span className="bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-amber-400 font-bold flex items-center gap-0.5 border border-white/10">
              ★ {product.rating}
            </span>
          )}
          {product.cutType && (
            <span className="bg-black/75 backdrop-blur-md text-neutral-300 px-2 py-0.5 rounded text-[9px] font-semibold border border-white/10 truncate max-w-[150px]">
              {product.cutType}
            </span>
          )}
        </div>
      </div>

      {/* 2. CARD CONTENT */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#DAAE3C] tracking-wider block mb-0.5">
            {product.category}
          </span>

          <h3 className="font-extrabold text-sm text-white group-hover:text-[#DAAE3C] transition-colors truncate leading-tight">
            {product.name}
          </h3>

          <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1 leading-snug">
            {product.description || "Farm-fresh cleaned cut, vacuum packed at 0-4°C."}
          </p>
        </div>

        {/* 3. DYNAMIC WEIGHT / PORTION SELECTOR BUTTONS */}
        {variants.length > 1 && (
          <div className="pt-2 border-t border-[#1C2331]/80">
            <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block mb-1.5">
              Select Portion / Weight:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((v, idx) => {
                const isSelected = idx === selectedVariantIndex;
                return (
                  <button
                    key={v.weight}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariantIndex(idx);
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#DAAE3C] text-black border-[#DAAE3C] shadow-sm font-black"
                        : "bg-[#141A24] text-neutral-300 hover:text-white border-[#232C3D] hover:border-[#DAAE3C]/50"
                    }`}
                  >
                    {v.weight}
                    {v.price > 0 && <span className="ml-1 opacity-80">₹{v.price}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. PRICE & WEIGHT BAR */}
        <div className="pt-2 border-t border-[#1C2331] space-y-2">
          
          {/* Price display row */}
          <div className="flex items-baseline justify-between gap-1">
            <div>
              {isOnDemand ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-[#DAAE3C] tracking-wide">
                    Rate on Demand
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-white font-mono">
                    ₹{currentPrice}
                  </span>
                  <span className="text-[11px] font-bold text-[#DAAE3C]">
                    / {weightPillLabel}
                  </span>
                  {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="text-[10px] text-neutral-500 line-through font-mono ml-1">
                      ₹{currentOriginalPrice}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[9px] text-neutral-400 block font-medium -mt-0.5">
                {isOnDemand ? "Market Price" : currentWeight}
              </span>
            </div>

            {/* Current Selected Portion Badge */}
            <span className="text-[10px] font-bold text-[#DAAE3C] bg-[#141A24] px-2 py-0.5 rounded border border-[#232C3D] shrink-0">
              {currentWeight}
            </span>
          </div>

          {/* Quick ADD or QTY Toggle */}
          <div className="bg-[#141A24] border border-[#232C3D] p-1.5 rounded-xl flex items-center justify-between text-xs">
            <span className="text-[10px] text-neutral-400 pl-1 font-medium truncate max-w-[120px]">
              {qty > 0 ? (
                <span className="text-[#DAAE3C] font-bold">
                  In cart: {qty} ({currentWeight})
                </span>
              ) : (
                <span>Pack: {currentWeight}</span>
              )}
            </span>

            {isOnDemand ? (
              <button
                onClick={handleWhatsAppEnquiry}
                className="py-1 px-3 rounded-lg font-black text-[10px] uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all duration-200 flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                Enquire
              </button>
            ) : qty === 0 ? (
              <button
                onClick={() => addToCart(product, 1, currentWeight, currentPrice)}
                disabled={product.inStock === false}
                className={`py-1 px-3.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all duration-200 ${
                  product.inStock === false
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#F3CD4D] to-[#DAAE3C] hover:opacity-95 text-[#120E05] shadow cursor-pointer active:scale-95"
                }`}
              >
                + ADD
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-[#0A0D12] border border-[#DAAE3C] rounded-lg p-0.5">
                <button
                  onClick={() => updateQuantity(itemKey, -1)}
                  className="w-5 h-5 rounded bg-[#1C2331] hover:bg-[#DAAE3C] hover:text-black text-white flex items-center justify-center font-black text-xs transition-colors"
                >
                  -
                </button>
                <span className="w-5 text-center text-xs font-black text-white font-mono">
                  {qty}
                </span>
                <button
                  onClick={() => updateQuantity(itemKey, 1)}
                  className="w-5 h-5 rounded bg-[#DAAE3C] text-black hover:bg-[#B58729] flex items-center justify-center font-black text-xs transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import BlurImage from "@/components/BlurImage";
import { HeroBannerItem } from "@/data/heroBanners";

interface HeroBannerProps {
  banner: HeroBannerItem;
  priority?: boolean;
}

export default function HeroBanner({ banner, priority = false }: HeroBannerProps) {
  return (
    <div className="relative w-full min-h-[300px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] rounded-2xl sm:rounded-3xl border border-[#212838] shadow-[0_16px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col justify-between p-5 sm:p-8 md:p-10 transition-all bg-[#07090E]">
      
      {/* Background Layer: Right 58% Ultra-Sharp Food Photography + Left 48% Solid Black */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-y-0 right-0 w-full sm:w-[65%] md:w-[60%] lg:w-[58%] h-full">
          <BlurImage
            src={banner.image}
            alt={`${banner.titleLight} ${banner.titleGold}`}
            fill
            priority={priority}
            className="object-cover object-center sm:object-right brightness-110 contrast-110"
          />
        </div>

        {/* Solid deep black on left 48% for crystal clear text readability */}
        <div className="absolute inset-0 bg-[#07090E]/65 sm:inset-y-0 sm:left-0 sm:right-auto sm:w-[55%] md:w-[50%] lg:w-[48%] sm:bg-[#07090E] z-10" />
        <div className="hidden sm:block absolute inset-y-0 sm:left-[45%] md:left-[46%] lg:left-[46%] sm:w-[20%] md:w-[18%] bg-gradient-to-r from-[#07090E] via-[#07090E]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/60 via-transparent to-[#07090E]/20 z-10 pointer-events-none" />
      </div>

      {/* Top Header Row: Left Pill Badge + Right Fresh Script Stamp */}
      <div className="relative z-20 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] sm:text-xs font-semibold text-neutral-300 uppercase tracking-widest shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#DAAE3C] animate-pulse" />
          {banner.badge}
        </div>

        <div className="bg-black/80 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-[#DAAE3C]/40 text-right shadow-lg">
          <span className="text-xs sm:text-sm font-serif italic font-bold text-[#DAAE3C] block leading-tight">
            Fresh
          </span>
          <span className="text-[10px] sm:text-[11px] font-serif italic text-neutral-200 block leading-tight">
            Healthy • Hygienic
          </span>
        </div>
      </div>

      {/* Middle Content: Clean Short Heading Only (No subtext paragraph) */}
      <div className="relative z-20 max-w-xl space-y-1.5 sm:space-y-2 my-auto py-3">
        <span className="inline-block text-[11px] sm:text-xs font-black tracking-widest uppercase text-[#DAAE3C]">
          {banner.tagline}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          {banner.titleLight} <br />
          <span className="text-[#DAAE3C] drop-shadow-[0_2px_15px_rgba(218, 174, 60,0.5)]">
            {banner.titleGold}
          </span>
        </h1>
      </div>

      {/* Bottom Bar: Action Button */}
      <div className="relative z-20 flex items-center justify-between pt-1">
        <Link
          href={`/products?category=${banner.categoryKey}`}
          className="inline-flex items-center gap-2 bg-[#DAAE3C] hover:bg-[#B58729] text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-full transition-all shadow-[0_4px_20px_rgba(218, 174, 60,0.5)] hover:scale-105 active:scale-95"
        >
          <span>Shop Now</span>
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import BlurImage from "@/components/BlurImage";
import { HeroBannerItem } from "@/data/heroBanners";

interface HeroCarouselProps {
  banners: HeroBannerItem[];
  autoSlideInterval?: number; // default 4500ms
}

export default function HeroCarousel({ banners, autoSlideInterval = 4500 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = banners.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused || total <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoSlideInterval, nextSlide, total]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // px

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentBanner = banners[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative group w-full select-none"
    >
      {/* Banner Container: Left solid dark 48%, right ultra-clear photographic food staging */}
      <div className="relative w-full min-h-[300px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] rounded-2xl sm:rounded-3xl border border-[#7F292E] shadow-[0_16px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col justify-between p-5 sm:p-8 md:p-10 transition-all bg-[#190304]">
        
        {/* Background Food Photography Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {banners.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Sharp, unblurred right-aligned photographic layer */}
              <div className="absolute inset-y-0 right-0 w-full sm:w-[65%] md:w-[60%] lg:w-[58%] h-full">
                <BlurImage
                  src={item.image}
                  alt={`${item.titleLight} ${item.titleGold}`}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center sm:object-right brightness-110 contrast-110"
                />
              </div>
            </div>
          ))}

          {/* Left Solid Black Foundation for crisp readability (48% width) + Smooth gradient feather across the middle */}
          <div className="absolute inset-0 bg-[#190304]/70 sm:inset-y-0 sm:left-0 sm:right-auto sm:w-[55%] md:w-[50%] lg:w-[48%] sm:bg-[#190304] z-20" />
          <div className="hidden sm:block absolute inset-y-0 sm:left-[45%] md:left-[46%] lg:left-[46%] sm:w-[20%] md:w-[18%] bg-gradient-to-r from-[#190304] via-[#190304]/80 to-transparent z-20 pointer-events-none" />
          
          {/* Subtle top/bottom edge vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/60 via-transparent to-[#07090E]/20 z-20 pointer-events-none" />
        </div>

        {/* Top Header Row: Left Pill Badge + Right Fresh Script Stamp */}
        <div className="relative z-30 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] sm:text-xs font-semibold text-neutral-300 uppercase tracking-widest shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#DAAE3C] animate-pulse" />
            {currentBanner.badge}
          </div>

          <div className="bg-black/80 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-[#DAAE3C]/40 text-right shadow-lg">
            <span className="text-xs sm:text-sm font-serif italic font-bold text-[#DAAE3C] block leading-tight">
              {currentBanner.freshTag || "Fresh"}
            </span>
            <span className="text-[10px] sm:text-[11px] font-serif italic text-neutral-200 block leading-tight">
              Pure • Delicious
            </span>
          </div>
        </div>

        {/* Middle Content: Clean Short Heading Only (No Subtext Paragraph) */}
        <div
          key={currentBanner.id}
          className="relative z-30 max-w-xl space-y-1.5 sm:space-y-2 my-auto py-3 transition-all duration-500 animate-fade-in"
        >
          <span className="inline-block text-[11px] sm:text-xs font-black tracking-widest uppercase text-[#DAAE3C]">
            {currentBanner.tagline}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {currentBanner.titleLight} <br />
            <span className="text-[#DAAE3C] drop-shadow-[0_2px_15px_rgba(218, 174, 60,0.5)]">
              {currentBanner.titleGold}
            </span>
          </h1>
        </div>

        {/* Bottom Bar: CTA Button + Center Pagination Indicators */}
        <div className="relative z-30 flex items-center justify-between pt-1">
          <Link
            href={`/products?category=${encodeURIComponent(currentBanner.categoryKey)}`}
            className="inline-flex items-center gap-2 bg-[#DAAE3C] hover:bg-[#B58729] text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-full transition-all shadow-[0_4px_20px_rgba(218, 174, 60,0.5)] hover:scale-105 active:scale-95"
          >
            <span>Shop Now</span>
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          {/* Bottom-Center Pagination Dots / Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            {banners.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "w-6 bg-[#DAAE3C] shadow-[0_0_8px_rgba(218, 174, 60,0.6)]"
                    : "w-2 bg-neutral-600 hover:bg-neutral-400"
                }`}
                aria-label={`Slide to ${item.categoryKey}`}
              />
            ))}
          </div>
        </div>

        {/* Previous Arrow Control (Desktop hoverable) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 hover:bg-[#DAAE3C] text-white hover:text-black border border-white/20 hover:border-[#DAAE3C] backdrop-blur-md items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl cursor-pointer"
          aria-label="Previous Slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Arrow Control (Desktop hoverable) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 hover:bg-[#DAAE3C] text-white hover:text-black border border-white/20 hover:border-[#DAAE3C] backdrop-blur-md items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl cursor-pointer"
          aria-label="Next Slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

      </div>
    </div>
  );
}

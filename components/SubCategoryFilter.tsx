import React from "react";
import BlurImage from "@/components/BlurImage";

interface SubCategoryFilterProps {
  categoryName: string;
  subcuts: string[];
  selectedSubcut: string;
  onSelectSubcut: (subcut: string) => void;
  subcutMeta: Record<string, { count: number; image?: string; minPrice?: number }>;
  totalCount: number;
  // Weight portions filter
  availableWeights: string[];
  selectedWeight: string;
  onSelectWeight: (weight: string) => void;
}

export default function SubCategoryFilter({
  categoryName,
  subcuts,
  selectedSubcut,
  onSelectSubcut,
  subcutMeta,
  totalCount,
  availableWeights,
  selectedWeight,
  onSelectWeight,
}: SubCategoryFilterProps) {
  return (
    <section aria-label={`${categoryName} sub-categories and portion filters`} className="space-y-4">
      {/* 1. SUBCATEGORY / CUT HEADER & CARDS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-full bg-[#DAAE3C]" />
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
                {categoryName} Cuts &amp; Types
              </h2>
              <p className="text-[11px] text-neutral-400">
                Choose a cut or browse all options
              </p>
            </div>
          </div>

          {(selectedSubcut !== "All" || selectedWeight !== "All") && (
            <button
              onClick={() => {
                onSelectSubcut("All");
                onSelectWeight("All");
              }}
              className="text-xs text-[#DAAE3C] hover:underline font-bold transition-all"
            >
              Reset Filters ({totalCount})
            </button>
          )}
        </div>

        {/* Visual Sub-Category Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {/* 'All Cuts' card */}
          <button
            onClick={() => onSelectSubcut("All")}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
              selectedSubcut === "All"
                ? "bg-[#181F2C] border-[#DAAE3C] ring-2 ring-[#DAAE3C]/20 shadow-[0_4px_16px_rgba(218,174,60,0.15)]"
                : "bg-[#0D1117] border-[#212838] hover:border-[#DAAE3C]/50 hover:bg-[#121620]"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#161B22] border border-[#2B3547] flex items-center justify-center shrink-0 text-base">
              🥩
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-xs font-black block truncate transition-colors ${
                selectedSubcut === "All" ? "text-[#DAAE3C]" : "text-white group-hover:text-[#DAAE3C]"
              }`}>
                All Cuts
              </span>
              <span className="text-[10px] text-neutral-400 block">
                {totalCount} items
              </span>
            </div>
          </button>

          {/* Dynamic Sub-Category Cards */}
          {subcuts.map((cut) => {
            const isSelected = selectedSubcut === cut;
            const info = subcutMeta[cut];
            const img = info?.image;
            const minPrice = info?.minPrice;

            return (
              <button
                key={cut}
                onClick={() => onSelectSubcut(cut)}
                className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                  isSelected
                    ? "bg-[#181F2C] border-[#DAAE3C] ring-2 ring-[#DAAE3C]/20 shadow-[0_4px_16px_rgba(218,174,60,0.15)]"
                    : "bg-[#0D1117] border-[#212838] hover:border-[#DAAE3C]/50 hover:bg-[#121620]"
                }`}
              >
                {img ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#2B3547] bg-[#161B22]">
                    <BlurImage
                      src={img}
                      alt={cut}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#161B22] border border-[#2B3547] flex items-center justify-center shrink-0 text-sm">
                    ✓
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-bold block truncate transition-colors ${
                    isSelected ? "text-[#DAAE3C]" : "text-white group-hover:text-[#DAAE3C]"
                  }`}>
                    {cut}
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    {minPrice && minPrice > 0 ? `from ₹${minPrice}` : "Rate on Demand"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. WEIGHT / PORTION QUICK FILTER PILLS (Half kg, 1 kg, 750g, etc.) */}
      {availableWeights.length > 0 && (
        <div className="rounded-xl border border-[#212838] bg-[#0A0D13] p-3 sm:p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-[#DAAE3C] tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Filter by Weight / Portion
              </span>
            </div>
            {selectedWeight !== "All" && (
              <button
                onClick={() => onSelectWeight("All")}
                className="text-[11px] text-neutral-400 hover:text-white transition-colors"
              >
                Clear portion filter ×
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSelectWeight("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedWeight === "All"
                  ? "bg-[#DAAE3C] text-black shadow-sm font-extrabold"
                  : "bg-[#141A24] text-neutral-300 hover:text-white border border-[#232C3D] hover:border-[#DAAE3C]/40"
              }`}
            >
              All Weights
            </button>

            {availableWeights.map((w) => {
              const isSelected = selectedWeight === w;
              // Format label user-friendly (e.g. "500 g (Half kg)")
              let displayLabel = w;
              if (w === "500 g") displayLabel = "500 g (Half kg)";
              else if (w === "1 kg") displayLabel = "1 kg";
              else if (w === "750 g") displayLabel = "750 g";
              else if (w === "250 g") displayLabel = "250 g";

              return (
                <button
                  key={w}
                  onClick={() => onSelectWeight(w)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#DAAE3C] text-black shadow-sm font-extrabold"
                      : "bg-[#141A24] text-neutral-300 hover:text-white border border-[#232C3D] hover:border-[#DAAE3C]/40"
                  }`}
                >
                  <span>{displayLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useEffect, useState } from "react";

export default function StoreStatusBanner() {
  const [storeOpen, setStoreOpen] = useState<boolean | null>(null);
  const [closedNotice, setClosedNotice] = useState<string>("");

  useEffect(() => {
    // Check initial status
    const checkStatus = () => {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.settings) {
            setStoreOpen(data.settings.isStoreOpen);
            setClosedNotice(data.settings.closedNotice || "We are currently closed for fresh butchering & daily sanitization. Orders placed now will be prioritized tomorrow morning.");
          }
        })
        .catch(() => {
          // If network fails, default to open
          setStoreOpen(true);
        });
    };

    checkStatus();
    // Re-check periodically every 15 seconds so admin toggle updates live
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // If store is open or still loading initial state, do not show closed banner
  if (storeOpen === null || storeOpen === true) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white py-2.5 px-4 shadow-lg border-b border-red-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg animate-pulse">🔴</span>
          <span>
            <strong>STORE CURRENTLY CLOSED:</strong> {closedNotice}
          </span>
        </div>
        <a
          href="https://wa.me/919264933232?text=Namaste%20Vindhyavaisini!%20Can%20I%20pre-book%20mithai%20or%20snacks%20for%20tomorrow?"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-neutral-100 text-red-700 font-extrabold text-[11px] uppercase px-3 py-1 rounded-lg tracking-wider transition-all whitespace-nowrap ml-auto"
        >
          💬 WhatsApp Pre-Book
        </a>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { isWithinDeliveryRadius } from "@/lib/delivery";

export default function LocationGate() {
  const { pincodeInfo, verifyPincode } = useCart();
  const [ready, setReady] = useState(false);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("chiksum_location_gate_dismissed") === "true");
    setReady(true);
  }, []);
  if (!ready || dismissed || pincodeInfo?.isServiceable) return null;

  const dismissGate = () => {
    sessionStorage.setItem("chiksum_location_gate_dismissed", "true");
    setDismissed(true);
  };

  const checkPin = () => {
    const result = verifyPincode(pin);
    setMessage(result.serviceable ? "" : "Sorry, online delivery is available only within 2 km of our Ghosi shop.");
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Location detection is unavailable. Please enter PIN 284128.");
      return;
    }
    setChecking(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setChecking(false);
        if (isWithinDeliveryRadius(coords.latitude, coords.longitude)) {
          verifyPincode("284128");
        } else {
          setMessage("This location is outside our 2 km free-delivery radius in Ghosi.");
        }
      },
      () => {
        setChecking(false);
        setMessage("We could not access your location. Please enter PIN 284128.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#303849] bg-[#0D1117] shadow-[0_28px_90px_rgba(0,0,0,0.75)]">
        <div className="relative bg-gradient-to-br from-[#F3CD4D] via-[#DAAE3C] to-[#9E7422] p-6 text-[#120E05]">
          <button type="button" onClick={dismissGate} aria-label="Close location check" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-xl font-bold transition hover:bg-black/25">×</button>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/10 text-3xl">📍</div>
          <h2 className="mt-4 text-2xl font-black">Check delivery availability</h2>
          <p className="mt-2 text-sm font-medium text-black/75">Free delivery within 2 km of our Ghosi shop.</p>
        </div>
        <div className="space-y-4 p-6">
          <button onClick={detectLocation} disabled={checking} className="w-full rounded-xl border border-[#DAAE3C]/50 bg-[#DAAE3C]/10 px-4 py-3 text-sm font-black text-[#FBF0A6] transition hover:bg-[#DAAE3C] hover:text-black disabled:opacity-60">
            {checking ? "Checking your location..." : "⌖ Use My Current Location"}
          </button>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-neutral-600"><span className="h-px flex-1 bg-[#293142]" />or enter PIN<span className="h-px flex-1 bg-[#293142]" /></div>
          <div className="flex gap-2">
            <input value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(event) => event.key === "Enter" && checkPin()} inputMode="numeric" placeholder="Ghosi PIN: 284128" className="min-w-0 flex-1 rounded-xl border border-[#303849] bg-[#080B10] px-4 py-3 text-sm font-mono text-white outline-none focus:border-[#DAAE3C]" />
            <button onClick={checkPin} className="rounded-xl bg-gradient-to-r from-[#F3CD4D] to-[#DAAE3C] px-5 text-sm font-black text-black hover:opacity-95">Check</button>
          </div>
          {message && <div role="alert" className="rounded-xl border border-red-500/35 bg-red-500/10 p-4 text-sm leading-6 text-red-200"><strong className="block text-red-300">Sorry, Not Serviceable Area</strong>{message}</div>}
          {message && <button type="button" onClick={dismissGate} className="w-full rounded-xl border border-[#303849] px-4 py-3 text-sm font-bold text-neutral-300 transition hover:border-neutral-500 hover:text-white">Continue browsing</button>}
          <p className="text-center text-[11px] text-neutral-500">Service PIN: 284128 • Delivery radius: 2 km</p>
        </div>
      </div>
    </div>
  );
}

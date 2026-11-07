"use client";

import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { getDistanceFromStoreKm } from "@/lib/delivery";

export default function LocationGate() {
  const { pincodeInfo, verifyPincode } = useCart();
  const [ready, setReady] = useState(false);
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "inside" | "outside" | "denied" | "unavailable">("idle");

  useEffect(() => {
    setDismissed(sessionStorage.getItem("chiksum_location_gate_dismissed") === "true");
    setReady(true);
  }, []);
  const dismissGate = () => {
    sessionStorage.setItem("chiksum_location_gate_dismissed", "true");
    setDismissed(true);
  };

  const checkPin = () => {
    const result = verifyPincode(pin);
    setLocationStatus(result.serviceable ? "inside" : "outside");
    setMessage(result.serviceable ? "" : "Yeh PIN hamare listed service area mein nahi hai. GPS se current location check karein, ya Ghosi shop ke 2 km andar ka delivery address use karein.");
  };

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      setMessage("Is device par automatic location available nahi hai. GPS/location services on karein, ya Ghosi shop ke 2 km andar ka delivery address daalein.");
      return;
    }
    setChecking(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setChecking(false);
        const distanceKm = getDistanceFromStoreKm(coords.latitude, coords.longitude);
        localStorage.setItem("vindhyavaisini_delivery_location", JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
          distanceKm,
          checkedAt: new Date().toISOString(),
        }));
        if (distanceKm <= 2) {
          setLocationStatus("inside");
          verifyPincode("284128");
        } else {
          setLocationStatus("outside");
          setMessage(`Aapki current location shop se lagbhag ${distanceKm.toFixed(1)} km door hai. Delivery sirf 2 km ke andar available hai. Kripya shop ke paas ka koi doosra delivery address/location select karein.`);
        }
      },
      (error) => {
        setChecking(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied");
          setMessage("Location permission off hai. Browser settings mein location allow karke ‘Check Again’ dabayein, ya Ghosi shop ke 2 km andar ka delivery address daalein.");
        } else {
          setLocationStatus("unavailable");
          setMessage("Current location nahi mil paayi. GPS on karke khuli jagah se dobara try karein, ya shop ke 2 km andar ka delivery address daalein.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }, [verifyPincode]);

  useEffect(() => {
    if (!ready || dismissed || pincodeInfo?.isServiceable) return;
    detectLocation();
  }, [ready, dismissed, pincodeInfo?.isServiceable, detectLocation]);

  if (!ready || dismissed || pincodeInfo?.isServiceable) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#303849] bg-[#0D1117] shadow-[0_28px_90px_rgba(0,0,0,0.75)]">
        <div className="relative bg-gradient-to-br from-[#F3CD4D] via-[#DAAE3C] to-[#9E7422] p-6 text-[#120E05]">
          <button type="button" onClick={dismissGate} aria-label="Close location check" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/15 text-xl font-bold transition hover:bg-black/25">×</button>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/10 text-3xl">📍</div>
          <h2 className="mt-4 text-2xl font-black">Check delivery availability</h2>
          <p className="mt-2 text-sm font-medium text-black/75">Location automatically check karke shop se distance calculate hoga.</p>
        </div>
        <div className="space-y-4 p-6">
          <button onClick={detectLocation} disabled={checking} className="w-full rounded-xl border border-[#DAAE3C]/50 bg-[#DAAE3C]/10 px-4 py-3 text-sm font-black text-[#FBF0A6] transition hover:bg-[#DAAE3C] hover:text-black disabled:opacity-60">
            {checking ? "GPS se distance check ho raha hai..." : message ? "⌖ Check Again" : "⌖ Check My Current Location"}
          </button>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-neutral-600"><span className="h-px flex-1 bg-[#293142]" />or enter PIN<span className="h-px flex-1 bg-[#293142]" /></div>
          <div className="flex gap-2">
            <input value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(event) => event.key === "Enter" && checkPin()} inputMode="numeric" placeholder="Ghosi PIN: 284128" className="min-w-0 flex-1 rounded-xl border border-[#303849] bg-[#080B10] px-4 py-3 text-sm font-mono text-white outline-none focus:border-[#DAAE3C]" />
            <button onClick={checkPin} className="rounded-xl bg-gradient-to-r from-[#F3CD4D] to-[#DAAE3C] px-5 text-sm font-black text-black hover:opacity-95">Check</button>
          </div>
          {message && <div role="alert" className="rounded-xl border border-red-500/35 bg-red-500/10 p-4 text-sm leading-6 text-red-200"><strong className="mb-1 block text-red-300">{locationStatus === "outside" ? "Delivery is location par available nahi hai" : "Location verify nahi ho paayi"}</strong>{message}</div>}
          {message && <button type="button" onClick={dismissGate} className="w-full rounded-xl border border-[#303849] px-4 py-3 text-sm font-bold text-neutral-300 transition hover:border-neutral-500 hover:text-white">Continue browsing</button>}
          <p className="text-center text-[11px] text-neutral-500">Service PIN: 284128 • Delivery radius: 2 km</p>
        </div>
      </div>
    </div>
  );
}

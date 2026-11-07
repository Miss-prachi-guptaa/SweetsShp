export const SERVICEABLE_PINCODES: Record<string, { area: string; fee: number; time: string; active?: boolean }> = {
  "284128": { area: "Ghosi, District Mau — within 2 km of store", fee: 0, time: "30-45 mins", active: true },
};

export const isServiceablePincode = (pincode: string) => {
  const pin = pincode.trim();
  // Check client-side session / storage override if present
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('chiksum_active_pincodes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[pin]) return parsed[pin].active !== false;
      }
    } catch {
      // Fallback
    }
  }
  return Boolean(SERVICEABLE_PINCODES[pin]);
};

export function isWithinDeliveryRadius(latitude: number, longitude: number) {
  const ghosiStore = { latitude: 26.105, longitude: 83.539 };
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(latitude - ghosiStore.latitude);
  const longitudeDelta = toRadians(longitude - ghosiStore.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(ghosiStore.latitude)) * Math.cos(toRadians(latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) <= 2;
}

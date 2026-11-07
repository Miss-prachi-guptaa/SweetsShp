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

export const GHOSI_STORE_LOCATION = {
  latitude: 26.1136875,
  longitude: 83.5450625,
};

export function getDistanceFromStoreKm(latitude: number, longitude: number) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(latitude - GHOSI_STORE_LOCATION.latitude);
  const longitudeDelta = toRadians(longitude - GHOSI_STORE_LOCATION.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(GHOSI_STORE_LOCATION.latitude)) * Math.cos(toRadians(latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isWithinDeliveryRadius(latitude: number, longitude: number) {
  return getDistanceFromStoreKm(latitude, longitude) <= 2;
}

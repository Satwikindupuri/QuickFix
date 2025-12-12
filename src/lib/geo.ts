// src/lib/geo.ts
export const getCurrentPositionPromise = (options?: PositionOptions) =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

export async function reverseGeocode(lat: number, lon: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "QuickFix/1.0 (contact@yourdomain.com)",
        Referer: window.location.origin,
      } as any,
    });
    if (!res.ok) return null;
    const j = await res.json();
    const city = j.address?.city || j.address?.town || j.address?.village || j.address?.county || j.address?.state;
    return { city, display_name: j.display_name, lat: j.lat, lon: j.lon };
  } catch (e) {
    console.warn("reverseGeocode error", e);
    return null;
  }
}

export async function geocodeCity(city: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "QuickFix/1.0 (contact@yourdomain.com)",
        Referer: window.location.origin,
      } as any,
    });
    if (!res.ok) return null;
    const arr = await res.json();
    if (!arr || arr.length === 0) return null;
    return { lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon), display_name: arr[0].display_name };
  } catch (e) {
    console.warn("geocodeCity error", e);
    return null;
  }
}

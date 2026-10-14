import "server-only";
import { siteConfig } from "../../config/site";

// Server-side geocoding so the travel distance (and therefore the price) cannot
// be supplied by the browser. Uses OpenStreetMap Nominatim, which requires an
// identifying User-Agent and allows roughly one request per second.
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "us");
  url.searchParams.set("q", address);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": `${siteConfig.title} checkout (${siteConfig.url}; ${siteConfig.email})` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const results = (await res.json()) as { lat: string; lon: string }[];
    if (!results.length) return null;
    const lat = Number.parseFloat(results[0].lat);
    const lng = Number.parseFloat(results[0].lon);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  } catch {
    return null;
  }
}

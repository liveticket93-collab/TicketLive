export async function geocodeMapTiler(query: string) {
  const key = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_MAPTILER_API_KEY");

  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(
    query
  )}.json?key=${key}&limit=1`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

  const data = await res.json();

  const first = data?.features?.[0];
  if (!first) return null;

  const [lon, lat] = first.center as [number, number];
  return { lat, lon };
}

export async function geocodeMapTiler(address: string) {
  const key = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_MAPTILER_API_KEY");

  const url =
    `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json` +
    `?key=${key}&limit=5&language=es&country=co&types=poi,address`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Geocode failed:", res.status);
    return null;
  }

  const data = await res.json();

  // 🔎 Debug: see what MapTiler is actually returning
  const options = (data?.features ?? []).slice(0, 5).map((f: any) => ({
    name: f?.place_name ?? f?.text,
    center: f?.center,
    type: f?.place_type,
  }));
  console.log("GEOCODE OPTIONS:", address, options);

  const feature = data?.features?.[0];
  if (!feature?.center) return null;

  const [lon, lat] = feature.center; // [lon, lat]
  return { lat: Number(lat), lon: Number(lon) };
}

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

type GeocodeOpts = {
  country?: string; // "co", "ar", etc.
  proximity?: { lon: number; lat: number }; // bias results
};

export async function geocodeMapTiler(address: string, opts: GeocodeOpts = {}) {
  const key = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_MAPTILER_API_KEY");

  const base = "https://api.maptiler.com/geocoding/";
  const queryVariants = [
    address,
    stripAccents(address),
  ];

  const attempts: Array<{
    q: string;
    params: Record<string, string>;
  }> = [];

  for (const q of queryVariants) {
    // Attempt 1: strict (what you currently do, but optional country)
    attempts.push({
      q,
      params: {
        key,
        limit: "5",
        language: "es",
        ...(opts.country ? { country: opts.country } : {}),
        types: "poi,address",
        ...(opts.proximity ? { proximity: `${opts.proximity.lon},${opts.proximity.lat}` } : {}),
      },
    });

    // Attempt 2: relax types (sometimes POI isn't tagged as poi/address)
    attempts.push({
      q,
      params: {
        key,
        limit: "5",
        language: "es",
        ...(opts.country ? { country: opts.country } : {}),
        ...(opts.proximity ? { proximity: `${opts.proximity.lon},${opts.proximity.lat}` } : {}),
      },
    });

    // Attempt 3: relax country as well (last resort)
    attempts.push({
      q,
      params: {
        key,
        limit: "5",
        language: "es",
        ...(opts.proximity ? { proximity: `${opts.proximity.lon},${opts.proximity.lat}` } : {}),
      },
    });
  }

  for (const attempt of attempts) {
    const url =
      `${base}${encodeURIComponent(attempt.q)}.json?` +
      new URLSearchParams(attempt.params).toString();

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) continue;

    const data = await res.json();
    const features = data?.features ?? [];

    const options = features.slice(0, 5).map((f: any) => ({
      name: f?.place_name ?? f?.text,
      center: f?.center,
      type: f?.place_type,
    }));
    console.log("GEOCODE OPTIONS:", attempt.q, options);

    const feature = features[0];
    if (feature?.center?.length === 2) {
      const [lon, lat] = feature.center;
      return { lat: Number(lat), lon: Number(lon) };
    }
  }

  return null;
}

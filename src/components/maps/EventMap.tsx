"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  lat: number;
  lon: number;
  title?: string;
};

export default function EventMap({ lat, lon, title }: Props) {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const key = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!key) {
      // no crash, just no map
      console.error("Missing NEXT_PUBLIC_MAPTILER_API_KEY");
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`,
      center: [lon, lat],
      zoom: 14,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "top-right"
    );

    new maplibregl.Marker({ color: "#8B5CF6" })
      .setLngLat([lon, lat])
      .setPopup(
        title ? new maplibregl.Popup({ offset: 20 }).setText(title) : undefined
      )
      .addTo(map);

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lon, title]);

  return (
    <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 bg-secondary/20">
      <div ref={containerRef} className="h-[320px] w-full" />
    </div>
  );
}

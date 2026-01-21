"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  lat: number;
  lon: number;
  title?: string;
};

export default function EventMap({ lat, lon, title }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Create map ONCE
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const key = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!key) {
      console.error("Missing NEXT_PUBLIC_MAPTILER_API_KEY");
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`,
      center: [lon, lat],
      zoom: 14,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const marker = new maplibregl.Marker({ color: "#8B5CF6" })
      .setLngLat([lon, lat])
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lon]);

  // Update center + marker whenever props change
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    // ✅ Move marker to new coords
    marker.setLngLat([lon, lat]);

    // ✅ Update popup text (optional)
    if (title) {
      marker.setPopup(new Popup({ offset: 20 }).setText(title));
    } else {
      marker.setPopup(undefined);
    }

    // ✅ Move camera
    map.flyTo({ center: [lon, lat], zoom: 14, essential: true });
  }, [lat, lon, title]);

  return (
    <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 bg-secondary/20">
      <div ref={containerRef} className="h-[320px] w-full" />
    </div>
  );
}

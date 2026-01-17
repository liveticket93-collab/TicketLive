"use client";

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapDemoProps {
  lat?: number;
  lng?: number;
  address?: string;
  title?: string;
}

/**
 * COMPONENTE DE PRUEBA: MapDemo
 * Este componente es independiente y puede ser usado para probar la integración con MapTiler.
 * 
 * Requisitos: npm install maplibre-gl
 */
export default function MapDemo({ 
  lat: initialLat, 
  lng: initialLng, 
  address,
  title = "Ubicación del evento" 
}: MapDemoProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  
  // OBTENER API KEY DESDE ENV (Si existe)
  const API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'wemIQXrE7zRPXtirnmUx';

  // Función para geocodificar (Dirección -> Coordenadas)
  const geocodeAddress = async (addr: string) => {
    try {
      const res = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(addr)}.json?key=${API_KEY}`);
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
    } catch (err) {
      console.error("Error en geocodificación:", err);
    }
    return null;
  };

  useEffect(() => {
    const initMap = async () => {
      let currentLat = initialLat || -34.6037;
      let currentLng = initialLng || -58.3816;

      // Si hay dirección pero no coordenadas, geocodificamos
      if (address && !initialLat && !initialLng) {
        const coords = await geocodeAddress(address);
        if (coords) {
          currentLat = coords.lat;
          currentLng = coords.lng;
        }
      }

      if (map.current) {
        map.current.flyTo({ center: [currentLng, currentLat], zoom: 14 });
        if (marker.current) {
          marker.current.setLngLat([currentLng, currentLat]);
        }
        return;
      }

      if (!mapContainer.current) return;

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${API_KEY}`,
        center: [currentLng, currentLat],
        zoom: 14,
        attributionControl: false
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      marker.current = new maplibregl.Marker({ color: "#8B5CF6" })
        .setLngLat([currentLng, currentLat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<h3>${title}</h3><p>${address || ''}</p>`))
        .addTo(map.current);
    };

    initMap();

    return () => {
      // No removemos el mapa aquí para permitir actualizaciones suaves, 
      // pero podríamos llamar a map.current.remove() si el componente se desmonta de verdad.
    };
  }, [initialLat, initialLng, address, API_KEY, title]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full min-h-[400px]" />
      <div className="bg-black/80 backdrop-blur-md p-3 text-xs text-muted-foreground border-t border-white/5">
        📍 {title} {address ? `- ${address}` : ''}
      </div>
    </div>
  );
}

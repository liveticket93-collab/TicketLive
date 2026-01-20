"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  date: string;
  location: string;
  category?: string;
}

interface FavoritesContextType {
  favorites: Event[];
  addToFavorites: (event: Event) => void;
  removeFromFavorites: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  getFavoritesCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Event[]>([]);

  // Cargar favoritos desde localStorage al montar
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites);
        setFavorites(parsed);
      } catch (error) {
        console.error("Error loading favorites:", error);
        localStorage.removeItem("favorites");
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambian los favoritos
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (event: Event) => {
    if (!isFavorite(event.id)) {
      setFavorites([...favorites, event]);
      toast.success(`${event.title} agregado a favoritos ❤️`);
    }
  };

  const removeFromFavorites = (eventId: string) => {
    const event = favorites.find((e) => e.id === eventId);
    setFavorites(favorites.filter((e) => e.id !== eventId));
    if (event) {
      toast.info(`${event.title} removido de favoritos`);
    }
  };

  const isFavorite = (eventId: string) => {
    return favorites.some((e) => e.id === eventId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
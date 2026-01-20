"use client";

import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  event: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    date: string;
    location: string;
    category?: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({ event, className = "", size = "md" }: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(event.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(event.id);
    } else {
      addToFavorites(event);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${favorite 
          ? "bg-red-500/90 hover:bg-red-600" 
          : "bg-white/10 hover:bg-white/20"
        }
        backdrop-blur-sm
        rounded-full
        flex items-center justify-center
        transition-all
        hover:scale-110
        active:scale-95
        ${className}
      `}
      title={favorite ? "Remover de favoritos" : "Agregar a favoritos"}
    >
      <svg
        className={`${iconSizes[size]} ${favorite ? "text-white" : "text-gray-300"}`}
        fill={favorite ? "currentColor" : "none"}
        stroke={favorite ? "none" : "currentColor"}
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
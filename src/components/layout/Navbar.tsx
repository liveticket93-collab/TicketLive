"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Keep local input synced with URL (back button, manual URL edits, etc.)
  useEffect(() => {
    setSearchValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  // Autofocus when opening
  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

const pushSearchToUrl = (nextValue: string) => {
  const params = new URLSearchParams(searchParams.toString());

  if (!nextValue) params.delete("q");
  else params.set("q", nextValue);

  const qs = params.toString();
  router.push(qs ? `/events?${qs}` : "/events");
};


  const clearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const qs = params.toString();
    router.push(qs ? `/events?${qs}` : "/events");
  };

  // Cerrar menú de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-zinc-900 bg-opacity-95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-purple-500 border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              {/* Icono del ticket SVG */}
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 10V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V10C3.10457 10 4 10.8954 4 12C4 13.1046 3.10457 14 2 14V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V14C20.8954 14 20 13.1046 20 12C20 10.8954 20.8954 10 22 10Z"
                  fill="url(#gradient)"
                  stroke="url(#gradient)"
                  strokeWidth="1.5"
                />
                <path
                  d="M13 4L13 20"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="3 3"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="2"
                    y1="12"
                    x2="22"
                    y2="12"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#A855F7" />
                    <stop offset="1" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Texto del logo */}
              <span className="text-white text-xl font-bold tracking-wide">
                TicketLive
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              href="/events"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Eventos
            </Link>
            <Link
              href="/promociones"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Promociones
            </Link>
            <Link
              href="/help-center"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Cómo funciona
            </Link>
            <Link
              href="/testimonios"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Testimonios
            </Link>
            {/* Carrito de compras */}
            <Link
              href="/cart"
              className="relative text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              🛒
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search (Desktop) */}
            <div className="flex items-center gap-2">
              {isSearchOpen && (
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    value={searchValue}
                    onChange={(e) => {
                      const next = e.target.value;
                      setSearchValue(next);
                      pushSearchToUrl(next);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setIsSearchOpen(false);
                    }}
                    placeholder="Buscar eventos…"
                    className="w-64 rounded-full border border-white/10 bg-zinc-800/70 px-4 py-2 pr-9 text-sm text-white outline-none focus:border-purple-400"
                  />

                  {!!searchValue.trim() && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                      aria-label="Limpiar búsqueda"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen((v) => !v);
                  // If user is on another page, open search and also take them to /events
                  // so they see results immediately.
                  if (pathname !== "/events") router.push("/events");
                }}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Buscar eventos"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Auth Section - Desktop */}
            <div className="hidden sm:flex gap-3 items-center">
              {isAuthenticated && user ? (
                // Usuario autenticado - Mostrar menú de usuario
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    {user.profile_photo ? (
                      <img
                        src={user.profile_photo}
                        alt={user.name || "Usuario"}
                        className="w-9 h-9 rounded-full object-cover border-2 border-purple-500/50"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      </div>
                    )}
                    <span className="text-white text-sm font-medium hidden lg:block">
                      {user.name || "Usuario"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-300 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-zinc-800 rounded-lg shadow-xl py-2 border border-purple-500/20 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-zinc-700">
                        <p className="text-sm font-medium text-white">
                          {user.name || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Mi Perfil
                      </Link>

                      {/* Panel de Admin (solo si es admin) */}
                      {user.isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-purple-400 hover:bg-zinc-700 hover:text-purple-300 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Panel de Admin
                        </Link>
                      )}

                      <Link
                        href="/mis-boletos"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                          />
                        </svg>
                        Mis Boletos
                      </Link>

                      <Link
                        href="/favoritos"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Favoritos
                      </Link>

                      <div className="border-t border-zinc-700 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 hover:text-red-300 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Usuario NO autenticado - Mostrar botones de login/registro
                <>
                  <Link
                    href="/login"
                    className="text-white hover:text-purple-400 font-medium transition-colors duration-200"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-500/50"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-800 bg-opacity-95 border-t border-purple-500 border-opacity-20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/events"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              href="/promociones"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Promociones
            </Link>
            <Link
              href="/help-center"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="/testimonios"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonios
            </Link>
            <Link
              href="/cart"
              className="block text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              🛒 Carrito
            </Link>

            {/* Auth Section Mobile */}
            <div className="pt-4 space-y-2 border-t border-purple-500 border-opacity-20">
              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block text-center text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>

                  {/* Panel de Admin (solo si es admin) */}
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      className="block text-center text-purple-400 hover:text-purple-300 hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚙️ Panel de Admin
                    </Link>
                  )}

                  <Link
                    href="/mis-boletos"
                    className="block text-center text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mis Boletos
                  </Link>
                  <Link
                    href="/favoritos"
                    className="block text-center text-gray-300 hover:text-white hover:bg-zinc-700 hover:bg-opacity-50 px-3 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ❤️ Favoritos
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-center text-white bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-center text-white hover:text-purple-400 px-3 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-3 rounded-lg font-medium transition-colors shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

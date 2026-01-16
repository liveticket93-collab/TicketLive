"use client";

import AdminGuard from "@/components/guards/AdminGuard";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getEventCategories, ICategory } from "@/services/events.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CrearEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // CAMBIO: singular
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    capacity: "",
    price: "",
    imageUrl: "",
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getEventCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Validar formato de hora (HH:MM)
  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Manejar input de hora (solo números y ":")
  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Permitir solo números y ":"
    const filteredValue = value.replace(/[^0-9:]/g, "");
    
    // Limitar a formato HH:MM
    let formattedValue = filteredValue;
    if (filteredValue.length > 5) {
      formattedValue = filteredValue.slice(0, 5);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Validar si está completo
    if (formattedValue.length === 5) {
      if (!validateTimeFormat(formattedValue)) {
        setErrors((prev) => ({ ...prev, [name]: "Formato inválido. Use HH:MM (ej: 14:30)" }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // Combinar fecha + hora en formato ISO 8601
  const combineDateTime = (date: string, time: string): string => {
    // date: "2026-02-15"
    // time: "14:30"
    // resultado: "2026-02-15T14:30:00"
    return `${date}T${time}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors: Record<string, string> = {};

    if (!formData.start_time || !validateTimeFormat(formData.start_time)) {
      newErrors.start_time = "Hora de inicio inválida (formato: HH:MM)";
    }

    if (!formData.end_time || !validateTimeFormat(formData.end_time)) {
      newErrors.end_time = "Hora de fin inválida (formato: HH:MM)";
    }

    if (!selectedCategory) {
      newErrors.category = "Selecciona una categoría";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Combinar fecha + hora en formato ISO 8601
      const startDateTime = combineDateTime(formData.date, formData.start_time);
      const endDateTime = combineDateTime(formData.date, formData.end_time);

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        start_time: startDateTime, // ISO 8601
        end_time: endDateTime,     // ISO 8601
        location: formData.location,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        status: formData.status,
        categoryId: selectedCategory, // UUID singular
      };

      console.log("Enviando:", payload); // Para debug

      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Evento creado exitosamente");
        router.push("/admin/eventos");
      } else {
        const error = await response.json();
        console.error("Error del backend:", error);
        alert(`Error: ${error.message || "No se pudo crear el evento"}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error al crear evento");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/eventos"
              className="text-purple-400 hover:text-purple-300 mb-2 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a Eventos
            </Link>
            <h1 className="text-4xl font-bold text-white">Crear Nuevo Evento</h1>
            <p className="text-gray-400 mt-2">Completa los datos del evento</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título del Evento *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Ej: Concierto de Rock"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Describe el evento..."
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha del Evento *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Horas de Inicio y Fin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hora de Inicio *
                </label>
                <input
                  type="text"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleTimeInput}
                  required
                  placeholder="14:30"
                  maxLength={5}
                  className={`w-full px-4 py-2 bg-zinc-700/50 border rounded-lg text-white focus:outline-none ${
                    errors.start_time ? "border-red-500" : "border-zinc-600 focus:border-purple-500"
                  }`}
                />
                {errors.start_time && (
                  <p className="text-red-400 text-sm mt-1">{errors.start_time}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Formato: HH:MM (ej: 14:30)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hora de Fin *
                </label>
                <input
                  type="text"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleTimeInput}
                  required
                  placeholder="18:00"
                  maxLength={5}
                  className={`w-full px-4 py-2 bg-zinc-700/50 border rounded-lg text-white focus:outline-none ${
                    errors.end_time ? "border-red-500" : "border-zinc-600 focus:border-purple-500"
                  }`}
                />
                {errors.end_time && (
                  <p className="text-red-400 text-sm mt-1">{errors.end_time}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Formato: HH:MM (ej: 18:00)</p>
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="Ej: Estadio Nacional, Buenos Aires"
              />
            </div>

            {/* Capacidad y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacidad *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="50.00"
                />
              </div>
            </div>

            {/* URL de Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="https://..."
              />
            </div>

            {/* Categoría (Single-select con Radio Buttons) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría *
              </label>
              
              {loadingCategories ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                  Cargando categorías...
                </div>
              ) : categories.length === 0 ? (
                <p className="text-red-400 text-sm">
                  No hay categorías disponibles. Por favor, crea categorías primero.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                        selectedCategory === category.id
                          ? "bg-purple-600 border-purple-500"
                          : "bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700"
                      } border`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-white text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {errors.category && (
                <p className="text-red-400 text-sm mt-2">{errors.category}</p>
              )}
            </div>

            {/* Estado */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-300">
                Evento activo (visible para usuarios)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || loadingCategories}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando..." : "Crear Evento"}
              </button>
              <Link
                href="/admin/eventos"
                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AdminGuard>
  );
}
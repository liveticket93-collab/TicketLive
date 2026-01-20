"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/imageUpload/ImageUpload";
import { useAuth } from "@/contexts/AuthContext";
import AdminGuard from "@/components/guards/AdminGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Category {
  id: string;
  name: string;
}

export default function CrearEventoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",

    // Nuevo: ubicación separada
    locationPlace: "",
    locationCity: "",
    locationCountry: "",

    capacity: "",
    price: "",
    capacity: "",
    categoryId: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getEventCategories();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const filteredValue = value.replace(/[^0-9:]/g, "");

    let formattedValue = filteredValue;
    if (filteredValue.length > 5) {
      formattedValue = filteredValue.slice(0, 5);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (formattedValue.length === 5) {
      if (!validateTimeFormat(formattedValue)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Formato inválido. Use HH:MM (ej: 14:30)",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }

  const combineDateTime = (date: string, time: string): string => {
    return `${date}T${time}:00`;
  };

  // Nuevo: Constructor de la dirección que se manda al backend
  const buildLocation = () => {
    const parts = [
      formData.locationPlace,
      formData.locationCity,
      formData.locationCountry,
    ]
      .map((s) => s.trim())
      .filter(Boolean);

    return parts.join(", ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (eventDateTime < now) {
      alert("La fecha y hora del evento no pueden ser en el pasado");
      return false;
    }

    // Validar precio
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("El precio debe ser un número válido mayor o igual a 0");
      return false;
    }

    // Validar capacidad
    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      alert("La capacidad debe ser un número entero mayor a 0");
      return false;
    }

    // Nuevo: validación de ubicación (requiere ciudad y país)
    if (!formData.locationCity.trim()) {
      newErrors.locationCity = "Ciudad requerida";
    }
    if (!formData.locationCountry.trim()) {
      newErrors.locationCountry = "País requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const startDateTime = combineDateTime(formData.date, formData.start_time);
      const endDateTime = combineDateTime(formData.date, formData.end_time);

      // Nuevo: convierte la ubicación en un solo string
      const location = buildLocation();

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        start_time: startDateTime,
        end_time: endDateTime,

        // Una única ubicación que se manda al backend
        location,

        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        status: formData.status,
        categoryId: selectedCategory,
      };

      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el evento");
      }

      const newEvent = await response.json();
      
      alert("✅ Evento creado exitosamente");
      router.push("/admin/eventos");
    } catch (error: any) {
      console.error("Error creating event:", error);
      alert(`❌ Error al crear el evento: ${error.message}`);
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
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a Eventos
            </Link>
            <h1 className="text-4xl font-bold text-white">
              Crear Nuevo Evento
            </h1>
            <p className="text-gray-400 mt-2">Completa los datos del evento</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 space-y-6"
          >
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
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Horas */}
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
                    errors.start_time
                      ? "border-red-500"
                      : "border-zinc-600 focus:border-purple-500"
                  }`}
                />
                {errors.start_time && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.start_time}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Formato: HH:MM (ej: 14:30)
                </p>
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
                    errors.end_time
                      ? "border-red-500"
                      : "border-zinc-600 focus:border-purple-500"
                  }`}
                />
                {errors.end_time && (
                  <p className="text-red-400 text-sm mt-1">{errors.end_time}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Formato: HH:MM (ej: 18:00)
                </p>
              </div>
            </div>

            {/* Ubicación (ahora en 3 campos) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ubicación *
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={handleChange}
                    placeholder="Ciudad (ej: Bogotá)"
                    className={`w-full px-4 py-2 bg-zinc-700/50 border rounded-lg text-white focus:outline-none ${
                      errors.locationCity
                        ? "border-red-500"
                        : "border-zinc-600 focus:border-purple-500"
                    }`}
                  />
                  {errors.locationCity && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.locationCity}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="locationCountry"
                    value={formData.locationCountry}
                    onChange={handleChange}
                    placeholder="País (ej: Colombia)"
                    className={`w-full px-4 py-2 bg-zinc-700/50 border rounded-lg text-white focus:outline-none ${
                      errors.locationCountry
                        ? "border-red-500"
                        : "border-zinc-600 focus:border-purple-500"
                    }`}
                  />
                  {errors.locationCountry && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.locationCountry}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="locationPlace"
                    value={formData.locationPlace}
                    onChange={handleChange}
                    placeholder="Lugar (venue/dirección)"
                    className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* optional preview */}
              <p className="text-xs text-gray-500 mt-2">
                Se guardará como:{" "}
                <span className="text-gray-300">{buildLocation() || "—"}</span>
              </p>
            </div>

                {/* Hora */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora de Inicio *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    La duración del evento será de 2 horas
                  </p>
                </div>

                {/* Ubicación */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ej: Teatro Municipal, Calle 123, Ciudad"
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Categoría */}
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
                  No hay categorías disponibles. Por favor, crea categorías
                  primero.
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
                      <span className="text-white text-sm">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {errors.category && (
                <p className="text-red-400 text-sm mt-2">{errors.category}</p>
              )}
            </div>

            {/* Imagen */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Imagen del Evento</h2>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImage={formData.image}
                label="Imagen del Evento *"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Creando...
                  </span>
                ) : (
                  "Crear Evento"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminGuard>
  );
}

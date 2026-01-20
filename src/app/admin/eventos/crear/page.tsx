"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/imageUpload/ImageUpload";
import AdminGuard from "@/components/guards/AdminGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Category {
  id: string;
  name: string;
}

export default function CrearEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",

    // Nuevo: el evento tendrá una sola ubicación divida en tres partes
    locationCity: "",
    locationCountry: "",
    locationPlace: "",

    price: "",
    capacity: "",
    categoryId: "",
    image: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, image: url });
  };

  // Nuevo: Construye la ubicación del evento
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

  const validateForm = () => {
    const {
      title,
      description,
      date,
      time,
      locationCity,
      locationCountry,
      locationPlace,
      price,
      capacity,
      categoryId,
      image,
    } = formData;

    // required fields
    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !price ||
      !capacity ||
      !categoryId
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return false;
    }

    // Ubicación obligatoria (ciudad + país)
    if (!locationCity.trim() || !locationCountry.trim()) {
      alert("Por favor completa Ciudad y País en la ubicación");
      return false;
    }

    // El nombre del sitio es obligatorio
    if (!locationPlace.trim()) {
      alert("Por favor completa el Lugar/Dirección del evento");
      return false;
    }

    // Validar imagen
    if (!image) {
      alert("Por favor sube una imagen para el evento");
      return false;
    }

    // Validar fecha y hora
    const eventDateTime = new Date(`${date}T${time}`);
    const now = new Date();

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

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.date}T${formData.time}`);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2);

      // Nuevo: construir la ubicación
      const location = buildLocation();

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: startDateTime.toISOString(),
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        location, // ✅ composed string sent to backend
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        categoryId: formData.categoryId,
        imageUrl: formData.image,
        status: true,
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

      await response.json();

      alert("✅ Evento creado exitosamente");
      router.push("/admin/eventos");
    } catch (error: any) {
      console.error("Error creating event:", error);
      alert(`❌ Error al crear el evento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">
              Crear Nuevo Evento
            </h1>
            <p className="text-gray-400">Completa la información del evento</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Información Básica
              </h2>

              <div className="space-y-4">
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
                    placeholder="Ej: Concierto de Rock en Vivo"
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    required
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
                    placeholder="Describe el evento..."
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {loadingCategories ? (
                      <option value="">Cargando categorías...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Fecha y Ubicación */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Fecha y Ubicación
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
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

                {/* Nuevo: Ubicación (3 partes) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ubicación *
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      name="locationCity"
                      value={formData.locationCity}
                      onChange={handleChange}
                      placeholder="Ciudad (ej: Bogotá)"
                      className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                    <input
                      type="text"
                      name="locationCountry"
                      value={formData.locationCountry}
                      onChange={handleChange}
                      placeholder="País (ej: Colombia)"
                      className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                    <input
                      type="text"
                      name="locationPlace"
                      value={formData.locationPlace}
                      onChange={handleChange}
                      required
                      placeholder="Nombre del lugar"
                      className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Se guardará como:{" "}
                    <span className="text-gray-200">
                      {buildLocation() || "—"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Precio y Capacidad */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Precio y Capacidad
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Capacidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Capacidad *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Ej: 100"
                    min="1"
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Imagen del Evento
              </h2>
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

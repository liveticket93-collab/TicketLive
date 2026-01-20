"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/imageUpload/ImageUpload";
import { useAuth } from "@/contexts/AuthContext";
import AdminGuard from "@/components/guards/AdminGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Category {
  id: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  imageUrl: string;
  status: boolean;
}

export default function EditarEventoPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    capacity: "",
    categoryId: "",
    image: "",
    status: true,
  });

  // Cargar categorías
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

  // Cargar datos del evento
  const fetchEvent = async () => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al cargar el evento");
      }

      const event: Event = await response.json();

      // Extraer fecha y hora del start_time
      const startDate = new Date(event.start_time);
      const dateStr = startDate.toISOString().split("T")[0];
      const timeStr = startDate.toTimeString().slice(0, 5);

      setFormData({
        title: event.title,
        description: event.description,
        date: dateStr,
        time: timeStr,
        location: event.location,
        price: event.price.toString(),
        capacity: event.capacity.toString(),
        categoryId: event.categoryId,
        image: event.imageUrl,
        status: event.status,
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      alert("Error al cargar el evento");
      router.push("/admin/eventos");
    } finally {
      setLoadingEvent(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchEvent();
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, image: url });
  };

  const validateForm = () => {
    const { title, description, date, time, location, price, capacity, categoryId, image } =
      formData;

    if (!title || !description || !date || !time || !location || !price || !capacity || !categoryId) {
      alert("Por favor completa todos los campos obligatorios");
      return false;
    }

    if (!image) {
      alert("Por favor sube una imagen para el evento");
      return false;
    }

    const eventDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (eventDateTime < now) {
      alert("La fecha y hora del evento no pueden ser en el pasado");
      return false;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("El precio debe ser un número válido mayor o igual a 0");
      return false;
    }

    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      alert("La capacidad debe ser un número entero mayor a 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2);

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: startDateTime.toISOString(),
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        location: formData.location,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        categoryId: formData.categoryId,
        imageUrl: formData.image,
        status: formData.status,
      };

      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el evento");
      }

      alert("✅ Evento actualizado exitosamente");
      router.push("/admin/eventos");
    } catch (error: any) {
      console.error("Error updating event:", error);
      alert(`❌ Error al actualizar el evento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingEvent) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando evento...</p>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/admin/eventos")}
              className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Editar Evento</h1>
            <p className="text-gray-400">Modifica la información del evento</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Información Básica</h2>

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

                {/* Estado */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-zinc-700 border-zinc-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="status" className="text-sm font-medium text-gray-300">
                    Evento activo
                  </label>
                </div>
              </div>
            </div>

            {/* Fecha y Ubicación */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Fecha y Ubicación</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fecha *</label>
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

            {/* Precio y Capacidad */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Precio y Capacidad</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Precio *</label>
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
                onClick={() => router.push("/admin/eventos")}
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
                    Guardando...
                  </span>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminGuard>
  );
}
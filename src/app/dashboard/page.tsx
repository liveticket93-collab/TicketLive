"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function DashboardPage() {
  const { user, loading, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 1MB)
    if (file.size > 1000000) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'La imagen debe ser menor a 1MB',
      });
      return;
    }

    // Validar tipo
    if (!file.type.match(/image\/(jpg|jpeg|png|webp)/)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato no válido',
        text: 'Solo se permiten imágenes JPG, PNG o WebP',
      });
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir al backend
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`http://localhost:3000/file-upload/profileImage/${user.id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const imageUrl = await response.text();

      // Actualizar usuario en localStorage
      updateUser({ profile_photo: imageUrl });

      Swal.fire({
        icon: 'success',
        title: '¡Imagen actualizada!',
        text: 'Tu foto de perfil se ha actualizado correctamente',
      });

      setImagePreview(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la imagen. Inténtalo de nuevo.',
      });
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar foto de perfil?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        // Actualizar en el backend
        const response = await fetch(`http://localhost:3000/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ profile_photo: null as any }),
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la imagen en el servidor');
        }

        // Actualizar usuario en localStorage (usar undefined para TypeScript)
        updateUser({ profile_photo: undefined });

        Swal.fire({
          icon: 'success',
          title: '¡Foto eliminada!',
          text: 'Tu foto de perfil ha sido eliminada',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la imagen. Inténtalo de nuevo.',
        });
      }
    }
  };

  const handleUpdateProfile = async (values: {
    name: string;
    phone: string;
    address: string;
    dni?: string;
    birthday?: string;
  }) => {
    try {
      setIsUpdating(true);

      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedData = await response.json();
      
      // Actualizar usuario en localStorage
      updateUser(values);

      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Tus datos se han actualizado correctamente',
      });

      setIsEditModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil. Inténtalo de nuevo.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Administra tu información personal</p>
        </div>

        {/* Profile Card */}
        <div className="bg-zinc-900 bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500 border-opacity-20 overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600"></div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar Section */}
            <div className="relative -mt-16 mb-6">
              <div className="relative inline-block">
                {imagePreview || user.profile_photo ? (
                  <img
                    src={imagePreview || user.profile_photo}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-zinc-900 shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center border-4 border-zinc-900 shadow-xl">
                    <span className="text-white font-bold text-4xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Upload Button */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer transition-colors shadow-lg"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </label>

                {/* Delete Button - Solo aparece si hay imagen */}
                {user.profile_photo && !isUploading && (
                  <button
                    onClick={handleDeleteImage}
                    className="absolute bottom-0 left-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors shadow-lg"
                    title="Eliminar foto de perfil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                {user.isAdmin && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-full">
                    Administrador
                  </span>
                )}
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Email */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 bg-opacity-20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-pink-600 bg-opacity-20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Teléfono</p>
                    <p className="text-white font-medium">{user.phone || 'No registrado'}</p>
                  </div>
                </div>
              </div>

              {/* DNI */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 bg-opacity-20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">DNI</p>
                    <p className="text-white font-medium">{user.dni || 'No registrado'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-zinc-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 bg-opacity-20 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Ubicación</p>
                    <p className="text-white font-medium">{user.address || 'No registrada'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {(user.dni || user.birthday || user.googleId) && (
              <div className="mt-6 bg-zinc-800 bg-opacity-30 rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-semibold mb-3">Información Adicional</h3>
                <div className="space-y-2">
                  {user.dni && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">DNI:</span>
                      <span className="text-white">{user.dni}</span>
                    </div>
                  )}
                  {user.birthday && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fecha de Nacimiento:</span>
                      <span className="text-white">{new Date(user.birthday).toLocaleDateString()}</span>
                    </div>
                  )}
                  {user.googleId && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-gray-400">Cuenta vinculada con Google</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
              >
                Editar Perfil
              </button>
              <button className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Ver Historial
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-400 font-semibold">Consejo</p>
              <p className="text-gray-300 text-sm mt-1">
                Mantén tu perfil actualizado para una mejor experiencia. Las imágenes deben ser menores a 1MB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Perfil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-purple-500 border-opacity-20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-zinc-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateProfile({
                  name: formData.get('name') as string,
                  phone: formData.get('phone') as string,
                  address: formData.get('address') as string,
                  dni: formData.get('dni') as string || undefined,
                  birthday: formData.get('birthday') as string || undefined,
                });
              }}
              className="p-6 space-y-6"
            >
              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={user.name}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>

              {/* Email (solo lectura) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email (no editable)
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={user.phone || ''}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tu teléfono"
                  />
                </div>

                {/* DNI */}
                <div>
                  <label htmlFor="dni" className="block text-sm font-medium text-gray-300 mb-2">
                    DNI (opcional)
                  </label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    defaultValue={user.dni || ''}
                    className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tu DNI"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={user.address || ''}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tu dirección"
                />
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de nacimiento (opcional)
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  defaultValue={user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''}
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-colors"
                  disabled={isUpdating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
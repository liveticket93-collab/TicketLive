import Swal from "sweetalert2";

/**
 * Valida que el archivo sea una imagen válida
 */
export const validateImageFile = (file: File): boolean => {
  // Validar tamaño (max 1MB)
  if (file.size > 1000000) {
    Swal.fire({
      icon: "error",
      title: "Archivo muy grande",
      text: "La imagen debe ser menor a 1MB",
    });
    return false;
  }

  // Validar tipo
  if (!file.type.match(/image\/(jpg|jpeg|png|webp)/)) {
    Swal.fire({
      icon: "error",
      title: "Formato no válido",
      text: "Solo se permiten imágenes JPG, PNG o WebP",
    });
    return false;
  }

  return true;
};

/**
 * Crea un preview de la imagen
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Muestra confirmación de eliminación
 */
export const confirmDelete = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: "¿Eliminar foto de perfil?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  return result.isConfirmed;
};

/**
 * Muestra mensaje de éxito
 */
export const showSuccessMessage = (title: string, text: string) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
  });
};

/**
 * Muestra mensaje de error
 */
export const showErrorMessage = (title: string, text: string) => {
  Swal.fire({
    icon: "error",
    title,
    text,
  });
};
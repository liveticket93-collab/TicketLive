import { User, AuthResponse } from "@/interfaces/user.interface";
import { LoginFormValuesType } from "@/validators/loginSchema";
import { RegisterFormValuesType } from "@/validators/registerSchema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Error personalizado para autenticación
 */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}

/**
 * Inicia sesión con credenciales
 */
export const loginUser = async (credentials: LoginFormValuesType): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Error al iniciar sesión");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
};

/**
 * Registra un nuevo usuario
 */
export const registerUser = async (userData: RegisterFormValuesType): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });


    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Error al registrar usuario");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
};

/**
 * Obtiene el perfil del usuario actual
 */
export const fetchUserProfile = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }

      const data = await response.json();
      throw new AuthError(
        data?.message || "Error al obtener perfil",
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      return null;
    }
    return null;
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/auth/signout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (error) {
    console.error("Error al cerrar sesión en servidor", error);
  }
};

/**
 * Actualiza el perfil del usuario
 */
export const updateUserProfile = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Error al actualizar perfil");
  }

  const result = await response.json();
  return result;
};

/**
 * Sube una imagen de perfil a Cloudinary
 */
export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/file-upload/profileImage/${userId}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al subir la imagen");
  }

  const contentType = response.headers.get("content-type");
  let imageUrl: string;

  if (contentType && contentType.includes("application/json")) {
    const jsonResponse = await response.json();
    imageUrl = jsonResponse.url || jsonResponse.profile_photo || jsonResponse;
  } else {
    imageUrl = await response.text();
  }

  return imageUrl.replace(/^["']|["']$/g, "");
};
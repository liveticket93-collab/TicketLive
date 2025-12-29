import { RegisterFormValuesType } from "@/validators/registerSchema";
import { LoginFormValuesType } from "@/validators/loginSchema";


const API_URL = process.env.NEXT_PUBLIC_API_URL ; //|| "http://localhost:3001"

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}


/**** */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}
/**** */



export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}


export const registerUser = async (
  userData: RegisterFormValuesType
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
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


export const loginUser = async (
  userData: LoginFormValuesType
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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


export const fetchUserProfile = async (): Promise<AuthResponse['user']> => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(data?.message || "Error al obtener perfil", response.status);
    }

    return data;
  } catch (error) {
    throw error;
  }
};


export const logoutUser = async (): Promise<void> => {
  try {
    
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Error al cerrar sesión en servidor", error);
  }
};

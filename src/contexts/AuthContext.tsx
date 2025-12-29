"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginFormValuesType } from "@/validators/loginSchema";
import { RegisterFormValuesType } from "@/validators/registerSchema";
import { AuthResponse, loginUser, logoutUser, registerUser, fetchUserProfile } from "@/services/auth.service";


interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {

  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;


  login: (credentials: LoginFormValuesType) => Promise<void>;
  register: (userData: RegisterFormValuesType) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const initAuth = async () => {
      try {
        // Al usar cookies HttpOnly, no podemos verificar token en localStorage.
        // Intentamos obtener el perfil directamente. Si falla (401), no estamos logueados.
        const userData = await fetchUserProfile();
        if (userData) {
          setUser({
            ...userData,
            role: userData.role || 'user'
          });
        }
      } catch (error) {
        // Si hay error (ej. 401 Unauthorized), asumimos que no hay sesión válida
        // No es necesario loguear error en consola si es un 401 esperado
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /*
   * FUNCIÓN DE LOGIN
   */
  const login = async (credentials: LoginFormValuesType) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await loginUser(credentials);

      if (response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role || 'user',
        });
      }

    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * FUNCIÓN DE REGISTRO
   */
  const register = async (userData: RegisterFormValuesType) => {
    try {
      setIsLoading(true);
      // 1. Registramos al usuario
      await registerUser(userData);
      
      // 2. Si el registro es exitoso, iniciamos sesión automáticamente
      // Asumimos que RegisterFormValuesType tiene email y password compatibles con login
      await login({ 
        email: userData.email, 
        password: userData.password 
      });
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * FUNCIÓN DE LOGOUT
   */
  const logout = async () => {
    await logoutUser(); 
    setUser(null); 
    router.push("/login"); 
  };


  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
}

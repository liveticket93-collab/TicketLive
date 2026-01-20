"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, AuthResponse } from "@/interfaces/user.interface";
import { LoginFormValuesType } from "@/validators/loginSchema";
import { RegisterFormValuesType } from "@/validators/registerSchema";
import {
  loginUser,
  registerUser,
  fetchUserProfile,
  logoutUser,
} from "@/services/auth.service";
import {
  saveUserToLocalStorage,
  loadUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "@/utils/localStorage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginFormValuesType) => Promise<void>;
  register: (userData: RegisterFormValuesType) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Refresca el usuario desde el backend
   */
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const savedUser = loadUserFromLocalStorage();
      const userData = await fetchUserProfile();

      if (userData) {
        const fullUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          googleId: userData.googleId,
          isAdmin: userData.isAdmin || false,
          phone: userData.phone,
          address: userData.address,
          profile_photo: userData.profile_photo || savedUser?.profile_photo || null,
          profile_photo_id: userData.profile_photo_id || savedUser?.profile_photo_id,
          birthday: userData.birthday,
        };
        setUser(fullUser);
        saveUserToLocalStorage(fullUser);
      } else {
        if (savedUser) {
          setUser(savedUser);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
      const savedUser = loadUserFromLocalStorage();
      if (savedUser) {
        setUser(savedUser);
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Carga el usuario al montar el componente
   */
  useEffect(() => {
    const savedUser = loadUserFromLocalStorage();
    if (savedUser) {
      setUser(savedUser);
      setIsLoading(false);
    }
    
    // TEMPORALMENTE COMENTADO: El backend no guarda los cambios correctamente
    // Descomentar cuando el backend esté arreglado
    // refreshUser();
    
    setIsLoading(false);
  }, [refreshUser]);

  /**
   * Inicia sesión
   */
  const login = async (credentials: LoginFormValuesType) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await loginUser(credentials);

      if (response.user) {
        const fullUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          googleId: response.user.googleId,
          isAdmin: response.user.isAdmin || false,
          phone: response.user.phone,
          address: response.user.address,
          profile_photo: response.user.profile_photo,
          profile_photo_id: response.user.profile_photo_id,
          birthday: response.user.birthday,
        };
        setUser(fullUser);
        saveUserToLocalStorage(fullUser);
        
        // ⭐ AGREGAR: Guardar token en localStorage
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registra un nuevo usuario
   */
  const register = async (userData: RegisterFormValuesType) => {
    try {
      setIsLoading(true);
      await registerUser(userData);
      await login({
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cierra sesión
   */
  const logout = async () => {
    await logoutUser();
    setUser(null);
    removeUserFromLocalStorage();
    localStorage.removeItem("token"); // ⭐ AGREGAR: Eliminar token también
    router.push("/login");
  };

  /**
   * Actualiza los datos del usuario
   */
  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      saveUserToLocalStorage(updatedUser);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userUpdated'));
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    loading: isLoading,
    isLoggedIn: !!user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

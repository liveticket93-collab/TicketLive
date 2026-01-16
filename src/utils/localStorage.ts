import { User } from "@/interfaces/user.interface";

const USER_STORAGE_KEY = 'ticketlive_user';

/**
 * Guarda el usuario en localStorage
 */
export const saveUserToLocalStorage = (userData: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }
};

/**
 * Carga el usuario desde localStorage
 */
export const loadUserFromLocalStorage = (): User | null => {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        return null;
      }
    }
  }
  return null;
};

/**
 * Elimina el usuario de localStorage
 */
export const removeUserFromLocalStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};
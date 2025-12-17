import { RegisterFormValuesType } from "@/validators/registerSchema";
import { LoginFormValuesType } from "@/validators/loginSchema";

const API_URL = "http://localhost:3001";

export const registerUser = async (userData: RegisterFormValuesType) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Registro fallido");
  }
  return response.json();
};

export const loginUser = async (userData: LoginFormValuesType) => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Login fallido");
  }
  return response.json();
};

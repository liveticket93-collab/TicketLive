import { RegisterFormValuesType } from "@/validators/registerSchema";
import { LoginFormValuesType } from "@/validators/loginSchema";

// const API_URL = "http://localhost:3001";

// export const registerUser = async (userData: RegisterFormValuesType) => {
//   const response = await fetch(`${API_URL}/users/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userData),
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => null);
//     throw new Error(errorData?.message || "Registro fallido");
//   }
//   return response.json();
// };

// export const loginUser = async (userData: LoginFormValuesType) => {
//   const response = await fetch(`${API_URL}/users/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userData),
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => null);
//     throw new Error(errorData?.message || "Login fallido");
//   }
//   return response.json();
// };

/* MOCK DEL SERVICE REGISTER*/
export const registerUser = async (userData: RegisterFormValuesType) => {
  console.log("Mock register payload:", userData);
  // Simulación del delay de backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Usuario registrado correctamente",
      });
    }, 1000);
  });
};

/* MOCK DEL SERVICE LOGIN*/
export const loginUser = async (userData: LoginFormValuesType) => {
  console.log("Mock login payload:", userData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        token: "mock-token",
        user: {
          email: userData.email,
        },
        message: "Login exitoso (mock)",
      });
    }, 1000);
  });
};

"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import {
  LoginFormValuesType,
  loginInitialValues,
  loginValidationSchema,
} from "@/validators/loginSchema";

import { loginUser } from "@/services/auth.service";

export default function LoginForm() {
  const router = useRouter();

  const formik = useFormik<LoginFormValuesType>({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await loginUser(values);
        console.log("Login success:", response);

        // NUEVO: Guardar usuario en localStorage
        const userData = {
          email: values.email,
          name: response.user?.name || values.email.split('@')[0],
        };
        localStorage.setItem('ticketlive_user', JSON.stringify(userData));

        Swal.fire({
          title: "Inicio de sesión exitoso",
          icon: "success",
          draggable: true,
        });

        resetForm();
        router.push("/");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unsuccessful login";

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        });
      }
    },
  });

  // NUEVO: Función para login con Google
  const handleGoogleLogin = () => {
    // Guardar la URL actual para volver después del login
    localStorage.setItem('ticketlive_redirect', window.location.pathname);
     window.location.href = 'http://localhost:3000/auth/google'; 
  };

  return (
    <div className="w-full max-w-md">
      <form
        className="bg-white rounded-xl shadow-md p-12 flex flex-col space-y-4"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col space-y-2 text-black">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Inserta tu correo electrónico"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-600 text-sm">{formik.errors.email}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2 text-black">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Inserta tu contraseña"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-600 text-sm">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-3 py-2 mt-4 transition"
        >
          {formik.isSubmitting ? "Iniciando sesión..." : "Inicia sesión"}
        </button>
      </form>

      {/* NUEVO: Separador y botón de Google */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">O continúa con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-medium">Continuar con Google</span>
        </button>
      </div>
    </div>
  );
}
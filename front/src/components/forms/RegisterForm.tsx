"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Swal from "sweetalert2";

import {
  RegisterFormValuesType,
  registerInitialValues,
  registerValidationSchema,
} from "@/validators/registerSchema";

import { registerUser } from "@/services/auth.service";

export default function RegisterForm() {
  const router = useRouter();

  const formik = useFormik<RegisterFormValuesType>({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await registerUser(values);
        console.log("Register success:", response);

        Swal.fire({
          title: "Registro exitoso",
          icon: "success",
          draggable: true,
        });

        resetForm();
        router.push("/login");
      } catch (error: unknown) {
        let errorMessage = "Unsuccessful register";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage || "Unsuccessful register",
        });
      }
    },
  });

  // NUEVO: Función para registro con Google
  const handleGoogleRegister = () => {
    localStorage.setItem('ticketlive_redirect', '/');
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-xl shadow-md p-12 flex flex-col space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EMAIL */}
          <div className="flex flex-col space-y-2 text-black">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Inserta tu email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-600 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* CONTRASEÑA */}
          <div className="flex flex-col space-y-2 text-black">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
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

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="flex flex-col space-y-2 text-black">
            <label htmlFor="confirmPassword">Confirmación de contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Inserta tu contraseña"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-600 text-sm">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          {/* NOMBRE */}
          <div className="flex flex-col space-y-2 text-black">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Inserta tu nombre"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600 text-sm">{formik.errors.name}</p>
            )}
          </div>

          {/* DIRECCION */}
          <div className="flex flex-col space-y-2 text-black">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Inserta tu dirección"
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-red-600 text-sm">{formik.errors.address}</p>
            )}
          </div>

          {/* TELEFONO */}
          <div className="flex flex-col space-y-2 text-black">
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Inserta tu teléfono"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-600 text-sm">{formik.errors.phone}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-3 py-2 mt-6 mx-auto transition"
        >
          {formik.isSubmitting ? "Creando tu cuenta..." : "Crea tu cuenta"}
        </button>
      </form>

      {/* NUEVO: Separador y botón de Google */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">O regístrate con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="mt-4 w-full max-w-2xl mx-auto flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
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
"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";

import {
  RegisterFormValuesType,
  registerInitialValues,
  registerValidationSchema,
} from "@/validators/registerSchema";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth(); // 🪝 Usamos el hook de autenticación

  const formik = useFormik<RegisterFormValuesType>({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Llamamos a la función register del contexto
        await register(values);

        // Mostramos notificación de éxito
        toast.success("¡Cuenta creada exitosamente!", {
          description: "Ahora puedes iniciar sesión con tus credenciales",
        });

        resetForm();
        router.push("/login"); // Redirigimos al login
      } catch (error: unknown) {
        // Manejo de errores
        const errorMessage =
          error instanceof Error ? error.message : "Error al crear la cuenta";

        toast.error("Error en el registro", {
          description: errorMessage,
        });
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-2xl rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 shadow-2xl shadow-black/40 ring-1 ring-white/10 p-10 md:p-12 flex flex-col gap-8 mb-9"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* CORREO ELECTRÓNICO */}
        <div className="form-div">
          <label className="form-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="form-error">{formik.errors.email}</p>
          )}
        </div>

        {/* CONTRASEÑA */}
        <div className="form-div">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu contraseña"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="form-error">{formik.errors.password}</p>
          )}
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div className="form-div">
          <label htmlFor="confirmPassword">Confirmación de contraseña</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu contraseña"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="form-error">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {/* NOMBRE */}
        <div className="form-div">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu nombre"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="form-error">{formik.errors.name}</p>
          )}
        </div>

        {/* DIRECCION */}
        <div className="form-div">
          <label htmlFor="address">Dirección</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu dirección"
          />
          {formik.touched.address && formik.errors.address && (
            <p className="form-error">{formik.errors.address}</p>
          )}
        </div>

        {/* TELEFONO */}
        <div className="form-div">
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu teléfono"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="form-error">{formik.errors.phone}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="form-button"
      >
        {formik.isSubmitting ? "Creando tu cuenta..." : "Crea tu cuenta"}
      </button>

      {/* Opción de registro con Google */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">
              O
            </span>
          </div>
        </div>
      </div>
      <Link
        className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-s"
        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
      >
        <span className="font-medium">Crea tu cuenta con Google</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </Link>
    </form>
  );
}

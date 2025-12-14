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

  return (
    <form
      className="w-full max-w-md bg-white rounded-xl shadow-md p-12 flex flex-col space-y-4"
      onSubmit={formik.handleSubmit}
    >
      <div className="flex flex-col space-y-2  text-black">
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

      <div className="flex flex-col space-y-2  text-black">
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
  );
}

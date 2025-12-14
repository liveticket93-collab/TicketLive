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

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-2xl bg-white rounded-xl shadow-md p-12 flex flex-col space-y-8"
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
        <div className="flex flex-col space-y-2  text-black">
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
        <div className="flex flex-col space-y-2  text-black">
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
        <div className="flex flex-col space-y-2  text-black">
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
        <div className="flex flex-col space-y-2  text-black">
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
        {formik.isSubmitting
          ? "Creando tu cuenta..."
          : "Crea tu cuenta"}
      </button>
    </form>
  );
}

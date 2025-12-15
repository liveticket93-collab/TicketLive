import * as Yup from "yup";

export interface LoginFormValuesType {
  email: string;
  password: string;
}

export const loginInitialValues: LoginFormValuesType = {
  email: "",
  password: "",
};

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Correo electrónico inválido").required("El correo electrónico es requerido"),
  password: Yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
});

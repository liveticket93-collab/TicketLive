
import * as Yup from 'yup';

//Interfaz de los valores de register
export interface RegisterFormValuesType {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  address: string;
  phone: string;
}

//Valores iniciales de formulario register
export const registerInitialValues = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  address: '',
  phone: ''
};

//Esquema de validación
export const registerValidationSchema = Yup.object({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
    .matches(/[0-9]/, 'La contraseña debe tener al menos un número')
    .required('La contraseña es requerida'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Por favor confirma tu contraseña'),
  name: Yup.string().required('El nombre es requerido'),
  address: Yup.string().required('La dirección es requerida'),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'Solo debe contener números')
    .required('El teléfono es requerido')
});


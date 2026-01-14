/**
 * Validadores para el formulario de perfil de usuario
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida el nombre completo (debe tener nombre y apellido)
 */
export const validateFullName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "El nombre es obligatorio" };
  }

  const trimmedName = name.trim();

  // Mínimo 3 caracteres
  if (trimmedName.length < 3) {
    return { isValid: false, error: "El nombre debe tener al menos 3 caracteres" };
  }

  // Debe tener al menos 2 palabras (nombre y apellido)
  const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 2) {
    return { isValid: false, error: "Debes ingresar tu nombre y apellido" };
  }

  // Solo letras, espacios, acentos y ñ
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: "El nombre solo puede contener letras" };
  }

  return { isValid: true };
};

/**
 * Valida el número de teléfono (formato internacional)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: "El teléfono es obligatorio" };
  }

  const trimmedPhone = phone.trim();

  // Solo puede contener números, espacios, guiones y el símbolo +
  const phoneRegex = /^[\d\s\-+()]+$/;
  if (!phoneRegex.test(trimmedPhone)) {
    return { isValid: false, error: "El teléfono solo puede contener números, espacios, guiones y el símbolo +" };
  }

  // El + solo puede estar al inicio
  if (trimmedPhone.includes('+') && !trimmedPhone.startsWith('+')) {
    return { isValid: false, error: "El símbolo + solo puede estar al inicio" };
  }

  // Extraer solo los números para validar longitud
  const onlyNumbers = trimmedPhone.replace(/\D/g, '');
  
  // Mínimo 8 dígitos, máximo 15 (estándar internacional)
  if (onlyNumbers.length < 8 || onlyNumbers.length > 15) {
    return { isValid: false, error: "El teléfono debe tener entre 8 y 15 dígitos" };
  }

  return { isValid: true };
};

/**
 * Valida la dirección (debe tener letras y números)
 */
export const validateAddress = (address: string): ValidationResult => {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: "La dirección es obligatoria" };
  }

  const trimmedAddress = address.trim();

  // Mínimo 5 caracteres
  if (trimmedAddress.length < 5) {
    return { isValid: false, error: "La dirección debe tener al menos 5 caracteres" };
  }

  // Debe contener al menos una letra
  const hasLetter = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmedAddress);
  if (!hasLetter) {
    return { isValid: false, error: "La dirección debe contener al menos un nombre de calle" };
  }

  // Debe contener al menos un número
  const hasNumber = /\d/.test(trimmedAddress);
  if (!hasNumber) {
    return { isValid: false, error: "La dirección debe incluir un número" };
  }

  return { isValid: true };
};

/**
 * Valida la fecha de nacimiento
 */
export const validateBirthday = (birthday: string): ValidationResult => {
  if (!birthday || birthday.trim().length === 0) {
    return { isValid: false, error: "La fecha de nacimiento es obligatoria" };
  }

  const birthDate = new Date(birthday);
  const today = new Date();

  // Verificar que la fecha sea válida
  if (isNaN(birthDate.getTime())) {
    return { isValid: false, error: "Fecha de nacimiento inválida" };
  }

  // No puede ser fecha futura
  if (birthDate > today) {
    return { isValid: false, error: "La fecha de nacimiento no puede ser futura" };
  }

  // Calcular edad
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Edad mínima: 13 años (requisito común para plataformas digitales)
  if (age < 13) {
    return { isValid: false, error: "Debes tener al menos 13 años para usar la plataforma" };
  }

  // Edad máxima razonable: 120 años
  if (age > 120) {
    return { isValid: false, error: "Por favor, verifica tu fecha de nacimiento" };
  }

  return { isValid: true };
};

/**
 * Valida todos los campos del formulario
 */
export const validateProfileForm = (formData: {
  name: string;
  phone: string;
  address: string;
  birthday: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const nameValidation = validateFullName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }

  const addressValidation = validateAddress(formData.address);
  if (!addressValidation.isValid) {
    errors.address = addressValidation.error!;
  }

  const birthdayValidation = validateBirthday(formData.birthday);
  if (!birthdayValidation.isValid) {
    errors.birthday = birthdayValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
/**
 * Validaciones de contraseña
 */

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Valida una contraseña según los requisitos
 */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[@"#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  if (!requirements.minLength) {
    errors.push("Debe tener al menos 8 caracteres");
  }
  if (!requirements.hasUppercase) {
    errors.push("Debe contener al menos una mayúscula");
  }
  if (!requirements.hasLowercase) {
    errors.push("Debe contener al menos una minúscula");
  }
  if (!requirements.hasNumber) {
    errors.push("Debe contener al menos un número");
  }
  if (!requirements.hasSpecialChar) {
    errors.push('Debe contener al menos un carácter especial (@, ", #, etc)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    requirements,
  };
}

/**
 * Verifica si puede cambiar la contraseña (cooldown de 24 horas)
 */
export function canChangePassword(userId: string): {
  canChange: boolean;
  remainingTime?: string;
  lastChange?: Date;
} {
  const lastChangeKey = `password_change_${userId}`;
  const lastChangeStr = localStorage.getItem(lastChangeKey);

  if (!lastChangeStr) {
    return { canChange: true };
  }

  const lastChange = new Date(lastChangeStr);
  const now = new Date();
  const diffMs = now.getTime() - lastChange.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    const remainingHours = 24 - diffHours;
    const hours = Math.floor(remainingHours);
    const minutes = Math.floor((remainingHours - hours) * 60);
    
    return {
      canChange: false,
      remainingTime: `${hours}h ${minutes}m`,
      lastChange,
    };
  }

  return { canChange: true, lastChange };
}

/**
 * Registra el cambio de contraseña
 */
export function recordPasswordChange(userId: string): void {
  const lastChangeKey = `password_change_${userId}`;
  localStorage.setItem(lastChangeKey, new Date().toISOString());
}
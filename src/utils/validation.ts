
import { VALIDATION } from '../constants';

export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`A senha deve ter no mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`);
  }
  
  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    errors.push(`A senha deve ter no máximo ${VALIDATION.PASSWORD_MAX_LENGTH} caracteres`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 11 || cleanPhone.length === 10;
};

export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  }
  
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }
  
  return phone;
};

export const validateTicketPrice = (price: number): boolean => {
  return price >= VALIDATION.MIN_TICKET_PRICE && price <= VALIDATION.MAX_TICKET_PRICE;
};

export const validateTicketCount = (count: number): boolean => {
  return count >= VALIDATION.MIN_TICKETS && count <= VALIDATION.MAX_TICKETS;
};

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return startDate >= now && endDate > startDate;
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const validateName = (name: string): boolean => {
  const trimmedName = name.trim();
  return (
    trimmedName.length >= VALIDATION.NAME_MIN_LENGTH &&
    trimmedName.length <= VALIDATION.NAME_MAX_LENGTH &&
    /^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)
  );
};

export const validateImageFile = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  if (file.size > VALIDATION.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `O arquivo deve ter no máximo ${VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }
  
  if (!VALIDATION.ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Formato de arquivo não aceito. Use JPEG, PNG, GIF ou WebP'
    };
  }
  
  return { isValid: true };
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  formatPhone,
  validateTicketPrice,
  validateTicketCount,
  validateDateRange,
  sanitizeInput,
  validateRequired,
  validateName,
  validateImageFile,
  validateUrl
};
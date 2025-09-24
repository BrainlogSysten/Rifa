
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5044/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  TOKEN_REFRESH_INTERVAL: 30 * 60 * 1000,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000
} as const;

export const RAFFLE_STATUS = {
  DRAFT: 0,
  ACTIVE: 1,
  FINISHED: 2,
  CANCELLED: 3
} as const;

export const RAFFLE_STATUS_LABELS = {
  [RAFFLE_STATUS.DRAFT]: 'Rascunho',
  [RAFFLE_STATUS.ACTIVE]: 'Ativa',
  [RAFFLE_STATUS.FINISHED]: 'Finalizada',
  [RAFFLE_STATUS.CANCELLED]: 'Cancelada'
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\(\d{2}\) \d{5}-\d{4}$/,
  MIN_TICKET_PRICE: 0.01,
  MAX_TICKET_PRICE: 10000,
  MIN_TICKETS: 1,
  MAX_TICKETS: 1000000
} as const;

export const UI_CONFIG = {
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 200,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
} as const;

export const DEFAULTS = {
  RAFFLE: {
    TICKET_PRICE: 10,
    NUMBER_OF_TICKETS: 100,
    DESCRIPTION: '',
    TERMS: 'Consulte os termos gerais da plataforma.'
  },
  USER: {
    AVATAR: 'https://ui-avatars.com/api/?name=User&background=9333ea&color=fff'
  }
} as const;

export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Por favor, tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Por favor, faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para realizar esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro no servidor. Por favor, tente mais tarde.',
  VALIDATION: 'Por favor, verifique os dados informados.',
  FILE_TOO_LARGE: 'O arquivo é muito grande. Máximo 5MB.',
  INVALID_FILE_TYPE: 'Tipo de arquivo inválido. Use JPEG, PNG, GIF ou WebP.'
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Cadastro realizado com sucesso!',
  LOGOUT: 'Logout realizado com sucesso!',
  RAFFLE_CREATED: 'Rifa criada com sucesso!',
  RAFFLE_UPDATED: 'Rifa atualizada com sucesso!',
  RAFFLE_DELETED: 'Rifa excluída com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  PASSWORD_CHANGED: 'Senha alterada com sucesso!',
  TICKET_PURCHASED: 'Bilhete comprado com sucesso!'
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/dashboard/admin',
  PROFILE: '/dashboard/profile',
  MY_RAFFLES: '/dashboard/raffles',
  CREATE_RAFFLE: '/dashboard/raffles/create',
  MY_TICKETS: '/dashboard/tickets',
  WINNERS: '/dashboard/winners',
  PUBLIC_RAFFLES: '/raffles'
} as const;

export default {
  API_CONFIG,
  AUTH_CONFIG,
  RAFFLE_STATUS,
  RAFFLE_STATUS_LABELS,
  VALIDATION,
  UI_CONFIG,
  DEFAULTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES
};
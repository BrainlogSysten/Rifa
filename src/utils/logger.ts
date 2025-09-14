
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  
  apiError: (endpoint: string, error: any) => {
    const errorInfo = {
      endpoint,
      message: error.message || 'Unknown error',
      status: error.response?.status,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    };
    
    if (isDevelopment) {
      console.error('[API ERROR]', errorInfo);
    }
  }
};

export default logger;
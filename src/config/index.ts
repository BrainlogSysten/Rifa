
interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    environment: string;
  };
  features: {
    analytics: boolean;
    errorTracking: boolean;
  };
  services: {
    sentryDsn?: string;
    analyticsId?: string;
  };
}

const config: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5044/api',
    timeout: 10000
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'RifaModerna',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_ENV || 'development'
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    errorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true'
  },
  services: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    analyticsId: import.meta.env.VITE_ANALYTICS_ID
  }
};

export default config;
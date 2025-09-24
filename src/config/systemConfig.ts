interface SystemConfig {
  mode: 'client' | 'platform';
  features: {
    publicRaffleCreation: boolean;
    guestPurchase: boolean;
    simplifiedRegistration: boolean;
    adminOnlyCreation: boolean;
  };
}

const getSystemMode = (): 'client' | 'platform' => {
  return import.meta.env.VITE_SYSTEM_MODE as 'client' | 'platform' || 'client';
};

const systemConfigs: Record<'client' | 'platform', SystemConfig> = {
  client: {
    mode: 'client',
    features: {
      publicRaffleCreation: false,
      guestPurchase: true,
      simplifiedRegistration: true,
      adminOnlyCreation: true,
    }
  },
  platform: {
    mode: 'platform',
    features: {
      publicRaffleCreation: true,
      guestPurchase: false,
      simplifiedRegistration: false,
      adminOnlyCreation: false,
    }
  }
};

export const SYSTEM_CONFIG = systemConfigs[getSystemMode()];
export default SYSTEM_CONFIG;
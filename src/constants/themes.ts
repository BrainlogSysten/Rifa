export interface RaffleTheme {
  id: string;
  name: string;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  fontFamily: string;
  backgroundImage?: string;
  customCSS?: string;
  ticketButtonText: string;
  purchaseButtonText: string;
  headerTitle: string;
  footerText: string;
  preview?: string;
}

export const RAFFLE_THEMES: RaffleTheme[] = [
  {
    id: 'default',
    name: 'Padrão',
    category: 'Básico',
    primaryColor: '#9333ea',
    secondaryColor: '#a855f7',
    accentColor: '#ec4899',
    backgroundColor: '#f8fafc',
    textColor: '#1f2937',
    buttonStyle: 'rounded',
    fontFamily: 'Inter',
    ticketButtonText: 'Escolher',
    purchaseButtonText: 'Comprar Números',
    headerTitle: 'Participe da Rifa',
    footerText: 'Boa sorte!',
    preview: '🎯'
  },
  {
    id: 'luxury-car',
    name: 'Carros de Luxo',
    category: 'Automotivo',
    primaryColor: '#1f2937',
    secondaryColor: '#374151',
    accentColor: '#fbbf24',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    buttonStyle: 'square',
    fontFamily: 'Montserrat',
    backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #000000 100%)',
    ticketButtonText: 'RESERVAR',
    purchaseButtonText: 'GARANTIR NÚMEROS',
    headerTitle: 'Concorra ao Carro dos Sonhos',
    footerText: 'Luxo e velocidade te esperam!',
    preview: '🏎️'
  },
  {
    id: 'motorcycle',
    name: 'Motocicletas',
    category: 'Automotivo',
    primaryColor: '#dc2626',
    secondaryColor: '#b91c1c',
    accentColor: '#f59e0b',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    fontFamily: 'Bebas Neue',
    backgroundImage: 'linear-gradient(45deg, #dc2626 0%, #1f2937 100%)',
    ticketButtonText: 'ACELERAR',
    purchaseButtonText: 'PILOTAR AGORA',
    headerTitle: 'Sua Nova Moto Te Espera',
    footerText: 'Adrenalina pura nas suas mãos!',
    preview: '🏍️'
  },
  {
    id: 'money-prize',
    name: 'Prêmio em Dinheiro',
    category: 'Financeiro',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#fbbf24',
    backgroundColor: '#ecfdf5',
    textColor: '#064e3b',
    buttonStyle: 'rounded',
    fontFamily: 'Roboto',
    backgroundImage: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    ticketButtonText: 'INVESTIR',
    purchaseButtonText: 'GARANTIR CHANCE',
    headerTitle: 'Transforme R$ em R$ Milhões',
    footerText: 'Sua independência financeira começou!',
    preview: '💰'
  },
  {
    id: 'tech-gadgets',
    name: 'Eletrônicos',
    category: 'Tecnologia',
    primaryColor: '#2563eb',
    secondaryColor: '#1d4ed8',
    accentColor: '#06b6d4',
    backgroundColor: '#f0f9ff',
    textColor: '#1e3a8a',
    buttonStyle: 'rounded',
    fontFamily: 'SF Pro Display',
    backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    ticketButtonText: 'CONECTAR',
    purchaseButtonText: 'BAIXAR SORTE',
    headerTitle: 'O Futuro em Suas Mãos',
    footerText: 'Tecnologia de ponta te espera!',
    preview: '📱'
  },
  {
    id: 'house-home',
    name: 'Casa Própria',
    category: 'Imóveis',
    primaryColor: '#b45309',
    secondaryColor: '#92400e',
    accentColor: '#fbbf24',
    backgroundColor: '#fffbeb',
    textColor: '#78350f',
    buttonStyle: 'square',
    fontFamily: 'Playfair Display',
    backgroundImage: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    ticketButtonText: 'CONSTRUIR',
    purchaseButtonText: 'REALIZAR SONHO',
    headerTitle: 'Sua Casa dos Sonhos',
    footerText: 'O lar perfeito te aguarda!',
    preview: '🏠'
  },
  {
    id: 'travel-vacation',
    name: 'Viagem dos Sonhos',
    category: 'Turismo',
    primaryColor: '#0891b2',
    secondaryColor: '#0e7490',
    accentColor: '#f97316',
    backgroundColor: '#f0fdff',
    textColor: '#164e63',
    buttonStyle: 'pill',
    fontFamily: 'Poppins',
    backgroundImage: 'linear-gradient(135deg, #f0fdff 0%, #cffafe 100%)',
    ticketButtonText: 'EMBARCAR',
    purchaseButtonText: 'VIAJAR AGORA',
    headerTitle: 'Destino: Paraíso',
    footerText: 'Aventuras incríveis te esperam!',
    preview: '✈️'
  },
  {
    id: 'gaming',
    name: 'Games & Consoles',
    category: 'Entretenimento',
    primaryColor: '#7c3aed',
    secondaryColor: '#6d28d9',
    accentColor: '#ec4899',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    buttonStyle: 'rounded',
    fontFamily: 'Orbitron',
    backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #7c3aed 100%)',
    ticketButtonText: 'JOGAR',
    purchaseButtonText: 'LEVEL UP',
    headerTitle: 'Game Over? Never!',
    footerText: 'Victory Royale te espera!',
    preview: '🎮'
  },
  {
    id: 'jewelry-luxury',
    name: 'Joias & Luxo',
    category: 'Luxo',
    primaryColor: '#7c2d12',
    secondaryColor: '#92400e',
    accentColor: '#fbbf24',
    backgroundColor: '#1f2937',
    textColor: '#fbbf24',
    buttonStyle: 'square',
    fontFamily: 'Cinzel',
    backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #7c2d12 100%)',
    ticketButtonText: 'BRILHAR',
    purchaseButtonText: 'SER EXCLUSIVO',
    headerTitle: 'Elegância Incomparável',
    footerText: 'Luxo que você merece!',
    preview: '💎'
  },
  {
    id: 'sports-fitness',
    name: 'Esportes & Fitness',
    category: 'Esportivo',
    primaryColor: '#dc2626',
    secondaryColor: '#b91c1c',
    accentColor: '#ffffff',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    buttonStyle: 'pill',
    fontFamily: 'Roboto Condensed',
    backgroundImage: 'linear-gradient(45deg, #dc2626 0%, #1f2937 100%)',
    ticketButtonText: 'TREINAR',
    purchaseButtonText: 'SER CAMPEÃO',
    headerTitle: 'Supere Seus Limites',
    footerText: 'A vitória está ao seu alcance!',
    preview: '🏆'
  }
];

export const getThemeById = (id: string): RaffleTheme | undefined => {
  return RAFFLE_THEMES.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: string): RaffleTheme[] => {
  return RAFFLE_THEMES.filter(theme => theme.category === category);
};

export const getCategories = (): string[] => {
  return Array.from(new Set(RAFFLE_THEMES.map(theme => theme.category)));
};
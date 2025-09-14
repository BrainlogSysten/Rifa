import { Prize } from './prize';

export enum RaffleStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  FINISHED = 'Finished',
  CANCELLED = 'Cancelled',
}

export enum RaffleType {
  WINNING_TICKET = 'winning_ticket',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CreditCard',
  DEBIT_CARD = 'DebitCard',
  BANK_SLIP = 'BankSlip',
  PIX = 'Pix',
  PAYPAL = 'PayPal',
  APPLE_PAY = 'ApplePay',
  GOOGLE_PAY = 'GooglePay',
  CASH = 'Cash',
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  type: RaffleType;
  images?: string[];
  imageBanner?: string;
  startDate: string;
  endDate?: string;
  terms?: string;
  ticketsSold: number;
  ticketPrice: number;
  maxTicketPerUser: number;
  maxParticipants: number;
  paymentMethod: PaymentMethod;
  isEnabled: boolean;
  status: RaffleStatus;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  prizes?: Prize[];
}

export interface CreateRaffleDto {
  title: string;
  description: string;
  type: RaffleType;
  images?: string[];
  imageBanner?: string;
  startDate: string;
  endDate?: string;
  terms?: string;
  ticketPrice: number;
  maxTicketPerUser: number;
  maxParticipants: number;
  paymentMethod: PaymentMethod;
  coverImageUrl?: string;
  prizes?: Partial<Prize>[];
}

export interface UpdateRaffleDto extends Partial<CreateRaffleDto> {
  status?: RaffleStatus;
  isEnabled?: boolean;
}
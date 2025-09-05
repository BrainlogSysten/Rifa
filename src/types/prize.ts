export enum PrizeType {
  PRODUCT = 'Product',
  MONEY = 'Money',
}

export interface Prize {
  id: string;
  title: string;
  description?: string;
  value?: number;
  imageUrl?: string;
  quantity: number;
  type: PrizeType;
  raffleId?: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePrizeDto {
  title: string;
  description?: string;
  value?: number;
  imageUrl?: string;
  quantity: number;
  type: PrizeType;
}

export interface UpdatePrizeDto extends Partial<CreatePrizeDto> {
  isEnabled?: boolean;
}
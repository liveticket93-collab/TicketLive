// Tipos de cupón
export enum CouponType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

// Estado de redención
export enum RedemptionStatus {
  RESERVED = "RESERVED",
  APPLIED = "APPLIED",
  CANCELED = "CANCELED",
}

// Interface de Cupón
export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  isActive: boolean;
  maxRedemptions: number;
  redemptions?: CouponRedemption[];
  events?: {
    id: string;
    title: string;
  }[];
  categories?: {
    id: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Interface de Redención de Cupón
export interface CouponRedemption {
  id: string;
  userId: string;
  cartId: string;
  status: RedemptionStatus;
  createdAt: string;
}

// DTO para crear cupón
export interface CreateCouponDto {
  code: string;
  type: CouponType;
  value: number;
  maxRedemptions?: number;
  eventIds?: string[];
  categoryIds?: string[];
}
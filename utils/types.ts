import type { UserRole } from '@prisma/client';

export interface UsersTable {
  id: string;
  createdAt: Date;
  createdBy: string | null;
  isActive: boolean;
  isDeleted: boolean;
  name: string | 'User'; // Matching the required type
  email: string | null;
  emailVerified: Date | null;
  image: string | '';
  role: UserRole;
  isTwoFactorEnabled: boolean;
  creatorName: string | 'User'; // Matching the required type
}

export type UsersTableArray = UsersTable[];
export interface SubscriptionData {
  id: string;
  cid: string;
  userId: string;
  stripeSubscriptionId: string;
  productId: string;
  priceId: string;
  quantity: number;
  status: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
  isActive: boolean;
  interval: string | null;
  subscriptionObj: string | null;
}

export interface CompaniesTable {
  id: string;
  companyName: string;
  createdAt: Date;
  updatedAt: Date;
  logo: string | null;
  apiKey: string | null;
  expireDate: Date | null;
  creatorName: string | null;
  creatorEmail: string | null;
  isActive: boolean;
  isTrial: boolean;
  subscription: SubscriptionData | null; // Allowing null here
}
export type CompaniesTableArray = CompaniesTable[];

// Shared types for Subscription Management

export interface SubscriptionPlan {
  id: number;
  planName: string;
  billingType: string;
  price: string;
  priceValue: number;
  period: string;
  features: string[];
  featureCount: string;
  status: string;
}

export interface SubscribedUser {
  id: number;
  businessName: string;
  currentPlan: string;
  status: string;
  startDate: string;
  renewalDate: string;
}

// Types for Create/Update operations
export interface NewPlan {
  id: number;
  planName: string;
  billingType: string;
  price: string;
  priceValue: number;
  period: string;
  features: string[];
  featureCount: string;
  status: string;
}

export interface UpdatedPlan {
  id: number;
  planName: string;
  billingType: string;
  priceValue: number;
  features: string[];
  price: string;
  period?: string;
  featureCount?: string;
  status?: string;
}

export interface NewSubscription {
  id: number;
  businessName: string;
  currentPlan: string;
  status: string;
  startDate: string;
  renewalDate: string;
}

export interface UpdatedSubscription {
  id: number;
  businessName: string;
  currentPlan: string;
  startDate: string;
  renewalDate: string;
  status?: string;
}

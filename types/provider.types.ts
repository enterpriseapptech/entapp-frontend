import type { UserStatus, UserType } from "@/redux/services/adminApi";

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  userType: UserType;
  status: UserStatus;
  lastLoginAt: string | null;
  loginAttempts: number;
  streetAddress: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  location: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  catering: [];
  eventCenter: [];
}

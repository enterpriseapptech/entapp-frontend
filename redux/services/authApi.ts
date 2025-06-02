import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export enum UserType {
  ADMIN = 'ADMIN',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
}

interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  password: string;
}

interface CreateUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  userType: UserType;
  status: string;
  refreshToken: string | null;
  lastLoginAt: string | null;
  loginAttempts: number;
  streetAddress: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

interface VerifyUserRequest {
  id: string;
  token: string;
}

interface VerifyUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  userType: UserType;
  status: string;
  refreshToken: string | null;
  lastLoginAt: string | null;
  loginAttempts: number;
  streetAddress: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://13.60.205.107:8000' }),
  endpoints: (builder) => ({
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (body) => ({
        url: '/users/create',
        method: 'POST',
        body,
      }),
    }),
    verifyUser: builder.mutation<VerifyUserResponse, VerifyUserRequest>({
      query: (body) => ({
        url: '/users/verify',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateUserMutation, useVerifyUserMutation } = api;
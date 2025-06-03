import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export enum UserType {
  ADMIN = 'ADMIN',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
}

export enum ServiceType {
  EVENTCENTERS = 'EVENTCENTERS',
  CATERING = 'CATERING',
  ALL = 'ALL',
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType.CUSTOMER;
  password: string;
}

export interface CreateServiceProviderRequest {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType.SERVICE_PROVIDER;
  password: string;
  businessName: string;
  serviceType: ServiceType;
}

export type CreateUserRequest = CreateCustomerRequest | CreateServiceProviderRequest;

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  userType: UserType;
  serviceType?: ServiceType;
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

export interface VerifyUserRequest {
  id: string;
  token: string;
}

export interface ResendVerificationRequest {
  id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserResponse;
  access_token: string;
  refresh_token: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://13.49.145.99:8000' }),
  endpoints: (builder) => ({
    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (body) => ({
        url: '/users/create',
        method: 'POST',
        body,
      }),
    }),
    verifyUser: builder.mutation<UserResponse, VerifyUserRequest>({
      query: (body) => ({
        url: '/users/verify',
        method: 'POST',
        body,
      }),
    }),
    resendVerification: builder.mutation<UserResponse, ResendVerificationRequest>({
      query: (body) => ({
        url: '/users/resend-verification',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateUserMutation, useVerifyUserMutation, useResendVerificationMutation, useLoginMutation } = api;
"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateUserMutation } from "../../../redux/services/authApi";
import { UserType } from "../../../redux/services/authApi";
import Notification from "../../../components/ui/Notification";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    userType: z.enum([UserType.SERVICE_PROVIDER, UserType.CUSTOMER], {
      errorMap: () => ({ message: "Please select a user type" }),
    }),
    password: z
      .string()
      .min(10, "Must be at least 10 characters")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least 1 special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [createUser, { isLoading, error }] = useCreateUserMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: FormData) => {
    try {
      const response = await createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        userType: data.userType,
        password: data.password,
      }).unwrap();
      localStorage.setItem('userId', response.id);
      if (!response.isEmailVerified) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch {
      setNotification({ message: 'Failed to create account. Please try again.', type: 'error' });
    }
  };

  const passwordValidation = (value: string) => ({
    minLength: value.length >= 10,
    uppercase: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Image width={100} height={100} src="/logoSignup.png" alt="logoSignup.png" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">Sign up to start booking with us.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="mt-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name*
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  {...register("firstName")}
                  type="text"
                  className="text-gray-500 appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            <div className="mt-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name*
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  {...register("lastName")}
                  type="text"
                  className="text-gray-500 appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  className="text-gray-500 appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                User Type*
              </label>
              <div className="mt-1 relative">
                <select
                  id="userType"
                  {...register("userType")}
                  className="text-gray-500 appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="" disabled>Select user type</option>
                  <option value={UserType.SERVICE_PROVIDER}>Service Provider</option>
                  <option value={UserType.CUSTOMER}>Customer</option>
                </select>
                {errors.userType && (
                  <p className="mt-1 text-sm text-red-500">{errors.userType.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password*
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="text-gray-500 appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Type your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {isSubmitted && (
                <div className="mt-2 space-y-2">
                  <div className={`flex items-center ${passwordValidation(password).minLength ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${passwordValidation(password).minLength ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
                    <span className="text-sm">Must be at least 10 characters</span>
                  </div>
                  <div className={`flex items-center ${passwordValidation(password).uppercase ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${passwordValidation(password).uppercase ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
                    <span className="text-sm">1 uppercase letter</span>
                  </div>
                  <div className={`flex items-center ${passwordValidation(password).number ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${passwordValidation(password).number ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
                    <span className="text-sm">1 or more number</span>
                  </div>
                  <div className={`flex items-center ${passwordValidation(password).special ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${passwordValidation(password).special ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
                    <span className="text-sm">1 or more special character</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Re-enter Password*
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="text-gray-500 appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {isSubmitted && errors.confirmPassword && (
                <div className="mt-2 space-y-2">
                  <div className={`flex items-center ${errors.confirmPassword ? 'text-red-500' : 'text-gray-600'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${errors.confirmPassword ? 'border-red-500' : 'bg-orange-500 border-orange-500'}`} />
                    <span className="text-sm">{errors.confirmPassword.message}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && !notification && (
            <p className="text-sm text-red-500 text-center">
              Failed to create account. Please try again.
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        <div className="mt-4 space-y-3">
          <button className="py-2 w-full flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-600 font-medium cursor-pointer">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign up with Google
          </button>
          <button className="py-2 w-full flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-600 font-medium cursor-pointer">
            <img
              src="https://www.facebook.com/favicon.ico"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            Sign up with Facebook
          </button>
          <button className="py-2 w-full flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-600 font-medium cursor-pointer">
            <img
              src="https://www.apple.com/favicon.ico"
              alt="Apple"
              className="w-5 h-5 mr-2"
            />
            Sign up with Apple
          </button>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

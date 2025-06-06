"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useChangePasswordMutation } from "../../../redux/services/authApi";
import Notification from "../../../components/ui/Notification";

const schema = z.object({
  password: z
    .string()
    .min(10, "Must be at least 10 characters")
    .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Must contain at least 1 number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least 1 special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('resettoken');
  const id = searchParams.get('tokendata');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const passwordValidation = (value: string) => ({
    minLength: value.length >= 10,
    uppercase: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  });

  const onSubmit = async (data: FormData) => {
    if (!id || !token) {
      setNotification({ message: "Invalid reset link", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({
        id,
        token,
        password: data.password,
      }).unwrap();
      setNotification({ message: "Password reset successfully. Please log in.", type: "success" });
      setTimeout(() => {
        router.push('/login');
        setIsSubmitting(false);
      }, 2000);
    } catch {
      setNotification({ message: "Failed to reset password. Please try again.", type: "error" });
      setIsSubmitting(false);
    }
  };

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
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-sm text-gray-600">Create a new password to get access.</p>
        </div>
        <form className="space-y-4 items-center justify-center flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 w-full flex justify-center">
            <div className="md:w-[70%] w-full">
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
                  disabled={isLoading || isSubmitting}
                  className={`text-gray-500 appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Type your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {password && (
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
          </div>

          <div className="space-y-4 w-full flex justify-center">
            <div className="md:w-[70%] w-full">
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
                  disabled={isLoading || isSubmitting}
                  className={`text-gray-500 appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading || isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPassword && errors.confirmPassword && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-red-500">
                    <div className="w-4 h-4 border rounded-full mr-2 border-red-500" />
                    <span className="text-sm">{errors.confirmPassword.message}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className={`w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isLoading || isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Resetting...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
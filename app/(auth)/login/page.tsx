"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useLoginMutation,
  useResendVerificationMutation,
  UserType,
  ServiceType,
} from "../../../redux/services/authApi";
import Notification from "../../../components/ui/Notification";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [login, { isLoading: isLoggingIn, error: loginError }] =
    useLoginMutation();
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: false },
  });

  useEffect(() => {
    // Reset navigation state if login fails
    if (loginError && isNavigating) {
      setIsNavigating(false);
    }
  }, [loginError, isNavigating]);

  const onSubmit = async (data: FormData) => {
    setIsNavigating(true);
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const { user } = response;

      if (!user.isEmailVerified) {
        localStorage.setItem("userId", user.id);
        await resendVerification({ id: user.id }).unwrap();
        setNotification({
          message: "Please verify your email. A new code has been sent.",
          type: "error",
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        return;
      }

      // Store tokens if rememberMe is checked
      if (data.rememberMe) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
      }

      // Redirect based on userType
      let targetRoute = "";
      switch (user.userType) {
        case UserType.CUSTOMER:
          targetRoute = "/";
          break;
        case UserType.ADMIN:
          targetRoute = "/admin";
          break;
        case UserType.STAFF:
          targetRoute = "/staff";
          break;
        case UserType.SERVICE_PROVIDER:
          const serviceType = user.serviceProvider?.serviceType; 
          if (serviceType === ServiceType.CATERING) {
            targetRoute = "/cateringServiceManagement/cateringServiceDashboard";
          } else if (serviceType === ServiceType.EVENTCENTERS) {
            targetRoute = "/eventServiceManagement/eventServiceDashboard";
          } else {
            targetRoute = "/eventServiceManagement/eventServiceDashboard";
          }
          break;
        default:
          setNotification({ message: "Invalid user type", type: "error" });
          setIsNavigating(false);
          return;
      }

      router.push(targetRoute);
      setTimeout(() => setIsNavigating(false), 5000);
    } catch {
      setNotification({ message: "Invalid credentials", type: "error" });
      setIsNavigating(false);
    }
  };

  const isFormDisabled = isLoggingIn || isResending || isNavigating;

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
            <Image
              width={100}
              height={100}
              src="/logoSignup.png"
              alt="logoSignup.png"
            />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Login to Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form
          className="space-y-4 items-center justify-center flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4 w-full">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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
                  disabled={isFormDisabled}
                  className={`text-gray-500 appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
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
                  disabled={isFormDisabled}
                  className={`text-gray-500 appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Type your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isFormDisabled}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  {...register("rememberMe")}
                  type="checkbox"
                  disabled={isFormDisabled}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                    isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember for 30 days
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/forgotpassword"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          {loginError && !notification && (
            <p className="text-sm text-red-500 text-center">
              Invalid credentials
            </p>
          )}

          <div className="w-full">
            <button
              type="submit"
              disabled={isFormDisabled}
              className={`w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer flex items-center justify-center ${
                isFormDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isNavigating ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 space-y-3">
          <button
            className={`py-2 w-full flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-600 font-medium ${
              isFormDisabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={isFormDisabled}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
          <button
            className={`py-2 w-full flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-600 font-medium ${
              isFormDisabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={isFormDisabled}
          >
            <img
              src="https://www.facebook.com/favicon.ico"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            Sign in with Facebook
          </button>
          <button
            className={`py-2 w-full flex items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-600 font-medium ${
              isFormDisabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={isFormDisabled}
          >
            <img
              src="https://www.apple.com/favicon.ico"
              alt="Apple"
              className="w-5 h-5 mr-2"
            />
            Sign in with Apple
          </button>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

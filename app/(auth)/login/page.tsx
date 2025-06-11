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
  useRefreshTokenMutation,
  useGetUserByIdQuery,
  useResendVerificationMutation,
  UserType,
  ServiceType,
  UserResponse,
} from "../../../redux/services/authApi";
import Notification from "../../../components/ui/Notification";

// Token storage with expiration
const TOKEN_EXPIRY_DAYS = 7;
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

const storeTokens = (
  accessToken: string,
  refreshToken: string,
  userId: string,
  rememberMe: boolean
) => {
  if (rememberMe) {
    const expiry = Date.now() + TOKEN_EXPIRY_MS;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("token_expiry", expiry.toString());
    localStorage.setItem("user_id", userId);
  } else {
    // Session storage for non-persistent login
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
    sessionStorage.setItem("user_id", userId);
  }
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_expiry");
  localStorage.removeItem("user_id");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("user_id");
};

const isTokenValid = () => {
  const expiry = localStorage.getItem("token_expiry");
  if (!expiry) return false;
  return Date.now() < parseInt(expiry, 10);
};

// Reusable redirect logic based on user type
const getRedirectRoute = (user: UserResponse): string => {
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
      return "";
  }
  return targetRoute;
};

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof schema>;
interface CustomError {
  status?: number;
  data?: {
    message?: string;
    userId?: string;
  };
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state for auth check

  const [login, { isLoading: isLoggingIn, error: loginError }] =
    useLoginMutation();
  const [refreshToken, { isLoading: isRefreshing }] = useRefreshTokenMutation();
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

  // Get user data only when shouldFetchUser is true and userId is available
  const { data: user, error: userError } = useGetUserByIdQuery(currentUserId!, {
    skip: !shouldFetchUser || !currentUserId,
  });

  // Check for existing tokens on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      const accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");
      const refreshTokenValue =
        localStorage.getItem("refresh_token") ||
        sessionStorage.getItem("refresh_token");
      const userId =
        localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

      if (accessToken && refreshTokenValue && userId) {
        const rememberMe = !!localStorage.getItem("access_token");
        let newAccessToken = accessToken;

        // Check if tokens in localStorage are expired
        if (rememberMe && !isTokenValid()) {
          try {
            const response = await refreshToken({
              refresh_token: refreshTokenValue,
            }).unwrap();
            newAccessToken = response.access_token;
            const newRefreshToken = response.refresh_token;
            storeTokens(newAccessToken, newRefreshToken, userId, true);
          } catch {
            clearTokens();
            setNotification({
              message: "Session expired. Please log in again.",
              type: "error",
            });
            setIsCheckingAuth(false);
            return;
          }
        }

        // Update state to trigger user data fetch
        setCurrentUserId(userId);
        setShouldFetchUser(true);
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [refreshToken]);

  // Handle user data and redirect logic
  useEffect(() => {
    if (userError) {
      clearTokens();
      setNotification({
        message: "Unable to authenticate. Please log in again.",
        type: "error",
      });
      setShouldFetchUser(false);
      setIsCheckingAuth(false);
      return;
    }

    if (user) {
      if (!user.isEmailVerified) {
        localStorage.setItem("userId", user.id);
        resendVerification({ id: user.id })
          .unwrap()
          .then(() => {
            setNotification({
              message: "Please verify your email. A new code has been sent.",
              type: "error",
            });
            router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`);
          })
          .catch(() => {
            setNotification({
              message: "Failed to resend verification email.",
              type: "error",
            });
            setIsCheckingAuth(false);
          });
        return;
      }

      const targetRoute = getRedirectRoute(user);
      if (targetRoute) {
        // Use replace instead of push
        router.replace(targetRoute); 
      } else {
        setNotification({ message: "Invalid user type", type: "error" });
        clearTokens();
        setIsCheckingAuth(false);
      }
      setShouldFetchUser(false);
    }
  }, [user, userError, resendVerification, router]);

  // Reset navigation state if login fails
  useEffect(() => {
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

      const { user, access_token, refresh_token } = response;

      // Store tokens and user ID based on rememberMe
      storeTokens(access_token, refresh_token, user.id, data.rememberMe);

      // Redirect based on userType
      const targetRoute = getRedirectRoute(user);
      if (targetRoute) {
        router.replace(targetRoute); 
        setTimeout(() => setIsNavigating(false), 5000);
      } else {
        setNotification({ message: "Invalid user type", type: "error" });
        setIsNavigating(false);
      }
    } catch (error: unknown) {
      const err = error as CustomError;
      if (
        err.status === 401 &&
        err.data?.message === "Verification error!, kindly verifify your email before logging in."
      ) {
        const userId = localStorage.getItem("userId") || err.data?.userId; 
        if (userId) {
          localStorage.setItem("userId", userId);
          try {
            await resendVerification({ id: userId }).unwrap();
            setNotification({
              message: "Verification error!, kindly verify your email before logging in.",
              type: "error",
            });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            router.replace(`/verify-email?email=${encodeURIComponent(data.email)}`);
          } catch {
            setNotification({
              message: "Failed to resend verification email.",
              type: "error",
            });
            setIsNavigating(false);
          }
        } else {
          setNotification({
            message: "User ID not found. Please sign up again.",
            type: "error",
          });
          setIsNavigating(false);
        }
      } else {
        setNotification({ message: "Invalid credentials", type: "error" });
        setIsNavigating(false);
      }
    }
  };

  const isFormDisabled = isLoggingIn || isResending || isNavigating || isRefreshing;

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

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
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  disabled={isFormDisabled}
                  className={`text-sm text-gray-500 block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
                  placeholder="Enter your email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password*
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isFormDisabled}
                  className={`text-sm text-gray-500 block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
                  placeholder="Type your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isFormDisabled}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="checkbox"
                  type="checkbox"
                  disabled={isFormDisabled}
                  className={`w-4 h-4 border-gray-300 rounded-md text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50`}
                  {...register("rememberMe")}
                />
                <label
                  htmlFor="checkbox"
                  className="block ml-2 text-sm font-medium text-gray-700"
                >
                  Remember me for 7 days
                </label>
              </div>
              <div className="text-sm font-medium text-blue-600 hover:text-blue-400">
                <Link href="/forgotpassword">Forgot password?</Link>
              </div>
            </div>
          </div>

          {loginError && !notification && (
            <p className="text-sm text-red-500 text-center">Invalid credentials</p>
          )}

          <div className="w-full">
            <button
              type="submit"
              disabled={isFormDisabled}
              className={`w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isNavigating || isRefreshing ? (
                <>
                  <Loader2 className="mr-2 animate-spin h-5 w-5" />
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
            className={`w-full flex items-center justify-center p-3 border border-gray-300 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isFormDisabled}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="mr-2 w-5 h-5"
            />
            Sign in with Google
          </button>
          <button
            className={`w-full flex items-center justify-center p-3 border border-gray-300 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isFormDisabled}
          >
            <img
              src="https://www.facebook.com/favicon.ico"
              alt="Facebook"
              className="mr-2 w-5 h-5"
            />
            Sign in with Facebook
          </button>
          <button
            className={`w-full flex items-center justify-center p-3 border border-gray-300 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isFormDisabled}
          >
            <img
              src="https://www.apple.com/favicon.ico"
              alt="Apple"
              className="mr-2 w-5 h-5"
            />
            Sign in with Apple
          </button>
        </div>

        <p className="mt-2 text-sm text-center text-gray-600">
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
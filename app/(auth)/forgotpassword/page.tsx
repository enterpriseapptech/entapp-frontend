"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForgotPasswordMutation } from "../../../redux/services/authApi";
import Notification from "../../../components/ui/Notification";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await forgotPassword({ email: data.email });
      const message =
        response.data ||
        "We sent you an email containing details to reset your password";
      setNotification({ message, type: "success" });
      setTimeout(() => setIsSubmitting(false), 1000);
    } catch (error) {
      console.error("Forgot password error:", error);
      setNotification({
        message: "Failed to send reset email. Please try again.",
        type: "error",
      });
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
            <Image
              width={100}
              height={100}
              src="/logoSignup.png"
              alt="logoSignup.png"
            />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link.
          </p>
        </div>
        <form
          className="space-y-4 items-center justify-center flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4 w-full flex justify-center">
            <div className="md:w-[70%] w-full">
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
                  disabled={isLoading || isSubmitting}
                  className={`text-gray-500 appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    isLoading || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
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
          </div>

          <div className="w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className={`w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${
                  isLoading || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isLoading || isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Code"
                )}
              </button>
            </div>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to send verification code to the email
    console.log("Sending verification code to:", email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Image width={100} height={100} src="/logoSignup.png" alt="logoSignup.png" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your email to get a verification code.</p>
        </div>
        <form className="space-y-4 items-center justify-center flex flex-col" onSubmit={handleSubmit}>
          <div className="space-y-4 w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="text-gray-500 appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <button
                type="submit"
                className="w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Send Code
              </button>
            </div>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
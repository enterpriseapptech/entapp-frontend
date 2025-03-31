"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      console.log("Please fill in all fields");
      return;
    }

    // Proceed with login logic here
    console.log("Logging in with:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Image width={100} height={100} src="/logoSignup.png" alt="logoSignup.png" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Login to Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">Welcome back! Please enter your details.</p>
        </div>
        <form className="space-y-4 items-center justify-center flex flex-col" onSubmit={handleSubmit}>
          <div className="space-y-4 w-full">
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="text-gray-500 appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Type your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember for 30 days
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgotpassword" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full">
            <button
              type="submit"
              className="w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Sign In
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
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
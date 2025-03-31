"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [showConfirmValidation, setShowConfirmValidation] = useState(false);

  const passwordValidation = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const confirmPasswordValidation = {
    matches: password === confirmPassword && password !== "",
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean) && confirmPasswordValidation.matches;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPasswordValidation(true);
    setShowConfirmValidation(true);

    if (!isPasswordValid) {
      return;
    }

    // Proceed with password reset logic here
    console.log("Password reset successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Image width={100} height={100} src="/logoSignup.png" alt="logoSignup.png" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-sm text-gray-600">Create a new password to get access.</p>
        </div>
        <form className="space-y-4 items-center justify-center flex flex-col" onSubmit={handleSubmit}>
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="text-gray-500 appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Type your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowPasswordValidation(true);
                  }}
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
              {showPasswordValidation && (
                <div className="mt-2 space-y-2">
                  <div className={`flex items-center ${passwordValidation.minLength ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${passwordValidation.minLength ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
                    <span className="text-sm">Must be at least 8 characters</span>
                  </div>
                  <div className={`flex items-center ${passwordValidation.uppercase ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${passwordValidation.uppercase ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
                    <span className="text-sm">1 uppercase letter</span>
                  </div>
                  <div className={`flex items-center ${passwordValidation.number ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${passwordValidation.number ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
                    <span className="text-sm">1 or more number</span>
                  </div>
                  <div className={`flex items-center ${passwordValidation.special ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${passwordValidation.special ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
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
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="text-gray-500 appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setShowConfirmValidation(true);
                  }}
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
              {showConfirmValidation && (
                <div className="mt-2 space-y-2">
                  <div className={`flex items-center ${confirmPasswordValidation.matches ? 'text-gray-600' : 'text-red-500'}`}>
                    <div className={`w-4 h-4 border rounded-full mr-2 ${confirmPasswordValidation.matches ? 'bg-orange-500 border-orange-500' : 'border-red-500'}`} />
                    <span className="text-sm">Passwords must match</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <button
                type="submit"
                className="w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
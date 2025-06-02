"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyUserMutation } from "../../../redux/services/authApi";
import Notification from "../../../components/ui/Notification";

export default function VerifyEmailPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [verifyUser, { isLoading, error }] = useVerifyUserMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleChange = (index: number, value: string) => {
    if (/^[0-9a-fA-F]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^[0-9a-fA-F]{6}$/.test(pastedData)) {
      const newCode = pastedData.split("").slice(0, 6);
      setCode(newCode);
      const lastInput = document.getElementById(`code-5`);
      if (lastInput) lastInput.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(enteredCode)) {
      setNotification({ message: "Invalid code", type: "error" });
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setNotification({ message: "User ID not found. Please sign up again.", type: "error" });
      return;
    }

    try {
      const response = await verifyUser({ id: userId, token: enteredCode }).unwrap();
      if (response.isEmailVerified) {
        setNotification({ message: "Email verification successful. You can now login.", type: "success" });
        setTimeout(() => {
          localStorage.removeItem('userId');
          router.push("/login");
        }, 2000); 
      }
    } catch {
      setNotification({ message: "Invalid code", type: "error" });
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
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to {email || "your email"} to verify.
          </p>
        </div>
        <form className="space-y-4 items-center justify-center flex flex-col" onSubmit={handleSubmit}>
          <div className="space-y-4 w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <label className="block text-sm font-medium text-gray-700">Secure Code</label>
              <div className="mt-1 flex gap-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-gray-500 appearance-none border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>
          </div>

          {error && !notification && (
            <p className="text-sm text-red-500 text-center">Invalid code</p>
          )}

          <div className="w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
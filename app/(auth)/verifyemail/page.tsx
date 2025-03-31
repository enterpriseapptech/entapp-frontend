"use client";

import { useState } from "react";
import Image from "next/image";

export default function VerifyEmailPage() {
  const [code, setCode] = useState(["", "", "", ""]); // State to store the 4-digit code

  const handleChange = (index: number, value: string) => {
    // Allow only single digits and update the code array
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus the next input if a digit is entered
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to the previous input
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text").trim();
    // Check if the pasted data is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const newCode = pastedData.split("").slice(0, 4); // Split the pasted code into an array of digits
      setCode(newCode);
      // Focus the last input after pasting
      const lastInput = document.getElementById(`code-3`);
      if (lastInput) lastInput.focus();
    }
    e.preventDefault(); // Prevent default paste behavior
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode.length !== 4 || !/^\d{4}$/.test(enteredCode)) {
      console.log("Please enter a valid 4-digit code");
      return;
    }

    // Proceed with verification logic here
    console.log("Verifying code:", enteredCode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Image width={100} height={100} src="/logoSignup.png" alt="logoSignup.png" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">Enter the code sent to your email to verify.</p>
        </div>
        <form className="space-y-4 items-center justify-center flex flex-col" onSubmit={handleSubmit}>
          <div className="space-y-4 w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <label className="block text-sm font-medium text-gray-700">Secure Code</label>
              <div className="mt-1 flex gap-8">
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

          <div className="w-full flex justify-center">
            <div className="md:w-[70%] w-full">
              <button
                type="submit"
                className="w-full py-2 px-20 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0047AB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
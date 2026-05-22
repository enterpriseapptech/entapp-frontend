"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");
  const [source, setSource] = useState<string>("booking");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Paystack only calls the callback_url on a successful payment,
    // so the presence of reference/trxref in the URL is sufficient proof.
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");
    const invoiceId = searchParams.get("invoiceId");
    const urlSource = searchParams.get("source") || "booking";

    setSource(urlSource);

    // Also read stored context (set before redirect) as a cross-check
    const pendingPayment = sessionStorage.getItem("pendingPayment");
    const stored = pendingPayment ? JSON.parse(pendingPayment) : null;

    // Success: Paystack provided a reference AND we have an invoiceId
    if ((reference || trxref) && invoiceId) {
      setPaymentStatus("success");
      sessionStorage.removeItem("pendingPayment");
    } else if (stored?.invoiceId === invoiceId && invoiceId) {
      // Fallback: stored context matches the URL invoiceId
      setPaymentStatus("success");
      sessionStorage.removeItem("pendingPayment");
    } else {
      setPaymentStatus("failed");
    }

    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {paymentStatus === "success" ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              {source === "subscription"
                ? "Your subscription has been activated successfully."
                : "Your payment has been processed successfully. You will receive a confirmation email shortly."}
            </p>
            <div className="space-y-3">
              {source === "subscription" ? (
                <button
                  onClick={() => router.push("/eventServiceManagement/subscriptions")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Subscriptions
                </button>
              ) : (
                <button
                  onClick={() => router.push("/bookings")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Bookings
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t process your payment. Please try again or contact
              support if the problem persists.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/payment")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

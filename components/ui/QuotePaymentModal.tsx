import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useInitiatePaymentMutation } from "@/redux/services/book";
import StripePaymentForm from "./StripePaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentReason } from "@/redux/services/book";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

declare global {
  interface Window {
    PaystackPop?: {
      setup(config: unknown): { openIframe: () => void };
    };
  }
}

export enum PaymentMethod {
  PAYSTACK = "paystack",
  STRIPE = "stripe",
}

interface QuotePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountDue: number;
  invoiceId: string;
  userId: string | null;
  userEmail: string | null;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  paymentType?: "deposit" | "full";
  depositPercentage?: number;
  totalAmount?: number;
}

const QuotePaymentModal: React.FC<QuotePaymentModalProps> = ({
  isOpen,
  onClose,
  amountDue,
  invoiceId,
  userId,
  userEmail,
  onPaymentSuccess,
  onPaymentError,
  paymentType = "full",
  depositPercentage = 0,
  totalAmount = 0,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(
    null
  );
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [selectedAmountType, setSelectedAmountType] = useState<
    "deposit" | "full"
  >(paymentType);

  // Calculate deposit amount if not provided
  const calculatedDepositAmount =
    depositPercentage > 0 ? (totalAmount * depositPercentage) / 100 : amountDue;

  // Calculate the actual amount to be paid based on selection
  const paymentAmount =
    selectedAmountType === "deposit" ? calculatedDepositAmount : amountDue;

  const [initiatePayment] = useInitiatePaymentMutation();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAmountType(paymentType);
      setPaymentError(null);
      setSelectedPaymentMethod(null);
    }
  }, [isOpen, paymentType]);

  // Check if amount meets Stripe's minimum requirement
  const isAmountBelowStripeMinimum = paymentAmount < 100;

  const getCallbackUrl = () => {
    if (typeof window === "undefined") return "";

    // Create a success page URL with necessary parameters
    const successUrl = new URL("/payment/success", window.location.origin);
    successUrl.searchParams.set("invoiceId", invoiceId);
    successUrl.searchParams.set("amount", paymentAmount.toString());
    successUrl.searchParams.set("userId", userId || "");
    successUrl.searchParams.set("amountType", selectedAmountType);
    successUrl.searchParams.set("source", "quote");

    return successUrl.toString();
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError("Please select a payment method");
      return;
    }

    // Additional check for Stripe minimum amount
    if (
      selectedPaymentMethod === PaymentMethod.STRIPE &&
      isAmountBelowStripeMinimum
    ) {
      setPaymentError(
        "Payment amount is below the minimum of ₦100 required for Stripe payments. Please select Paystack or pay the full amount."
      );
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Prepare payment payload - WITHOUT amount field
      const paymentPayload: {
        invoiceId: string;
        paymentGateWay: string;
        paymentReason: PaymentReason;
        email?: string | null;
        callback_url?: string;
      } = {
        invoiceId,
        paymentGateWay: selectedPaymentMethod,
        paymentReason: PaymentReason.SERVICEREQUEST,
        email: userEmail,
      };

      // Only add callback_url for Paystack payments
      if (selectedPaymentMethod === PaymentMethod.PAYSTACK) {
        paymentPayload.callback_url = getCallbackUrl();
      }

      const response = await initiatePayment(paymentPayload).unwrap();

      if (response.includes("https://") || response.includes("http://")) {
        // For Paystack with callback URL, store payment info
        if (selectedPaymentMethod === PaymentMethod.PAYSTACK) {
          sessionStorage.setItem(
            "pendingPayment",
            JSON.stringify({
              invoiceId,
              amountDue: paymentAmount,
              amountType: selectedAmountType,
              userId,
              userEmail,
              paymentMethod: selectedPaymentMethod,
              source: "quote",
              timestamp: Date.now(),
            })
          );
        }

        // Redirect to payment gateway
        window.location.href = response;
      } else if (selectedPaymentMethod === PaymentMethod.STRIPE) {
        if (response.startsWith("pi_") && response.includes("_secret_")) {
          setStripeClientSecret(response);
          setShowStripeForm(true);
        } else {
          throw new Error("Invalid Stripe client secret received");
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to process payment. Please try again.";
      setPaymentError(msg);
      onPaymentError(msg);
      setIsProcessingPayment(false);
    }
  };

  const handleStripeSuccess = (paymentIntentId: string) => {
    console.log("Stripe payment successful:", paymentIntentId);
    setShowStripeForm(false);
    onPaymentSuccess();
  };

  const handleStripeCancel = () => {
    setShowStripeForm(false);
    setStripeClientSecret(null);
  };

  const handleStripeError = (error: string) => {
    setPaymentError(error);
    onPaymentError(error);
    setShowStripeForm(false);
    setStripeClientSecret(null);
  };

  if (!isOpen) return null;

  if (showStripeForm && stripeClientSecret) {
    return (
      <Elements stripe={stripePromise}>
        <StripePaymentForm
          clientSecret={stripeClientSecret}
          amount={paymentAmount}
          currency="NGN"
          onSuccess={handleStripeSuccess}
          onCancel={handleStripeCancel}
          onError={handleStripeError}
        />
      </Elements>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Make Payment</h2>
          <button
            onClick={onClose}
            disabled={isProcessingPayment}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Summary */}
          <div className="text-center bg-gray-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-900">
              ₦{paymentAmount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Invoice #{invoiceId.substring(0, 8).toUpperCase()}
            </p>

            {/* Financial Summary - Only show if we have deposit information */}
            {depositPercentage > 0 && totalAmount > 0 && (
              <div className="mt-3 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Total Due:</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Required Deposit:</span>
                  <span className="text-blue-600">
                    ₦{calculatedDepositAmount.toLocaleString()} (
                    {depositPercentage}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Amount Selection - Only show if we have deposit information */}
          {depositPercentage > 0 && totalAmount > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">
                Select Payment Amount
              </h3>

              {/* Deposit Option */}
              <button
                onClick={() => setSelectedAmountType("deposit")}
                className={`w-full border-2 rounded-lg p-4 text-left transition-all ${
                  selectedAmountType === "deposit"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isProcessingPayment}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Deposit ({depositPercentage}%)
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum required to secure booking
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₦{calculatedDepositAmount.toLocaleString()}
                  </span>
                </div>
              </button>

              {/* Full Amount Option */}
              <button
                onClick={() => setSelectedAmountType("full")}
                className={`w-full border-2 rounded-lg p-4 text-left transition-all ${
                  selectedAmountType === "full"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isProcessingPayment}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">Full Amount</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay the entire balance
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </button>

              {/* Note about payment amounts */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <strong>Note:</strong> The backend will process the{" "}
                  {selectedAmountType === "deposit" ? "deposit" : "full"} amount
                  based on your selection.
                </p>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Select Payment Method</h3>
            {([PaymentMethod.PAYSTACK, PaymentMethod.STRIPE] as const).map(
              (method) => {
                const isSelected = selectedPaymentMethod === method;
                const isStripeDisabled =
                  method === PaymentMethod.STRIPE && isAmountBelowStripeMinimum;

                return (
                  <button
                    key={method}
                    onClick={() =>
                      !isProcessingPayment &&
                      !isStripeDisabled &&
                      setSelectedPaymentMethod(method)
                    }
                    disabled={isProcessingPayment || isStripeDisabled}
                    className={`w-full border-2 rounded-lg p-4 text-left flex items-center transition-all
                    ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }
                    ${
                      isProcessingPayment || isStripeDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                    ${isStripeDisabled ? "bg-gray-100" : ""}`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center mr-4 rounded-md bg-orange-100">
                      <span className="font-bold text-orange-600">
                        {method === PaymentMethod.PAYSTACK ? "P" : "S"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {method === PaymentMethod.PAYSTACK
                          ? "Paystack"
                          : "Stripe"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {method === PaymentMethod.PAYSTACK
                          ? "Card, bank transfer, or USSD"
                          : "Credit card payments"}
                      </p>
                      {isStripeDisabled && (
                        <p className="text-xs text-red-500 mt-1">
                          Minimum ₦100 required
                        </p>
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {/* Minimum payment warning */}
          {isAmountBelowStripeMinimum &&
            selectedPaymentMethod !== PaymentMethod.STRIPE && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm font-medium">
                  ⚠️ Stripe Payment Notice
                </p>
                <p className="text-yellow-600 text-sm mt-1">
                  {selectedAmountType === "deposit"
                    ? "Deposit amount is below ₦100 minimum for Stripe. Paystack is recommended or pay the full amount."
                    : "Amount is below ₦100 minimum for Stripe. Paystack is recommended."}
                </p>
              </div>
            )}

          {/* Payment Error */}
          {paymentError && (
            <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 mr-2" />
              {paymentError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <p className="text-xs text-gray-500 text-center">
              You will be redirected to the payment gateway to complete your
              transaction.
            </p>
            <div className="flex justify-between space-x-3">
              <button
                onClick={onClose}
                disabled={isProcessingPayment}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex-1"
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                disabled={
                  isProcessingPayment ||
                  !selectedPaymentMethod ||
                  !!paymentError
                }
                className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center flex-1"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Pay ₦${paymentAmount.toLocaleString()}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePaymentModal;

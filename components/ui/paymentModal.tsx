import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useInitiatePaymentMutation } from "@/redux/services/book";
import StripePaymentForm from "./StripePaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountDue: number;
  invoiceId: string;
  userId: string | null;
  userEmail: string | null;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amountDue,
  invoiceId,
  userId,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);

  const [initiatePayment] = useInitiatePaymentMutation();

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError("Please select a payment method");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const response = await initiatePayment({
        invoiceId,
        paymentGateWay: selectedPaymentMethod,
      }).unwrap();

      if (response.includes("https://") || response.includes("http://")) {
        // Store booking info for callback page
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          invoiceId,
          amountDue,
          userId,
          timestamp: Date.now()
        }));
        
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
      const msg = err instanceof Error ? err.message : "Failed to process payment. Please try again.";
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
          amount={amountDue}
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Choose Payment Method</h2>
          <button
            onClick={onClose}
            disabled={isProcessingPayment}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">₦{amountDue.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">
              Invoice #{invoiceId.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="space-y-3">
            {([PaymentMethod.PAYSTACK, PaymentMethod.STRIPE] as const).map((method) => {
              const isSelected = selectedPaymentMethod === method;
              return (
                <button
                  key={method}
                  onClick={() => !isProcessingPayment && setSelectedPaymentMethod(method)}
                  disabled={isProcessingPayment}
                  className={`w-full border-2 rounded-lg p-4 text-left flex items-center transition-all
                    ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                    ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="w-10 h-10 flex items-center justify-center mr-4 rounded-md bg-orange-100">
                    <span className="font-bold text-orange-600">
                      {method === PaymentMethod.PAYSTACK ? "P" : "S"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {method === PaymentMethod.PAYSTACK ? "Paystack" : "Stripe"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {method === PaymentMethod.PAYSTACK
                        ? "Card, bank transfer, or USSD"
                        : "Credit card payments"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {paymentError && (
            <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 mr-2" />
              {paymentError}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs text-gray-500 text-center">
              You will be redirected to the payment gateway to complete your transaction.
            </p>
            <div className="flex justify-between">
              <button
                onClick={onClose}
                disabled={isProcessingPayment}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                disabled={isProcessingPayment || !selectedPaymentMethod}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Redirecting...
                  </>
                ) : (
                  "Pay Now"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
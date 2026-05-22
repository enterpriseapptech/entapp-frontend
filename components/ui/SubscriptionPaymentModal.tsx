import React, { useState, useEffect } from "react";
import { X, AlertCircle, Shield, CreditCard, Loader2 } from "lucide-react";
import { useInitiatePaymentMutation, PaymentReason } from "@/redux/services/book";
import StripePaymentForm from "./StripePaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export enum PaymentMethod {
  PAYSTACK = "paystack",
  STRIPE = "stripe",
}

interface SubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  invoiceId: string;
  userId: string | null;
  userEmail: string | null;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const SubscriptionPaymentModal: React.FC<SubscriptionPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  invoiceId,
  userId,
  userEmail,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);

  const [initiatePayment] = useInitiatePaymentMutation();

  useEffect(() => {
    if (isOpen) {
      setPaymentError(null);
      setSelectedPaymentMethod(null);
      setShowStripeForm(false);
      setStripeClientSecret(null);
    }
  }, [isOpen]);

  const isAmountBelowStripeMinimum = amount < 100;

  const getCallbackUrl = () => {
    if (typeof window === "undefined") return "";
    const successUrl = new URL("/payment/success", window.location.origin);
    successUrl.searchParams.set("invoiceId", invoiceId);
    successUrl.searchParams.set("source", "subscription");
    return successUrl.toString();
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError("Please select a payment method");
      return;
    }

    if (selectedPaymentMethod === PaymentMethod.STRIPE && isAmountBelowStripeMinimum) {
      setPaymentError("Minimum payment amount is ₦100 for Stripe.");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const payload: any = {
        invoiceId,
        paymentGateWay: selectedPaymentMethod,
        paymentReason: PaymentReason.SUBSCRIPTION,
        email: userEmail,
      };

      if (selectedPaymentMethod === PaymentMethod.PAYSTACK) {
        payload.callback_url = getCallbackUrl();
      }

      const response = await initiatePayment(payload).unwrap();

      if (response.includes("https://") || response.includes("http://")) {
        // Store payment context before leaving the page
        sessionStorage.setItem(
          "pendingPayment",
          JSON.stringify({ invoiceId, amount, source: "subscription" })
        );
        window.location.href = response;
      } else if (selectedPaymentMethod === PaymentMethod.STRIPE) {
        if (response.startsWith("pi_") && response.includes("_secret_")) {
          setStripeClientSecret(response);
          setShowStripeForm(true);
        } else {
          throw new Error("Invalid Stripe client secret received");
        }
      }
    } catch (err: any) {
      const msg = err?.data?.message || err.message || "Failed to process payment.";
      setPaymentError(msg);
      onPaymentError(msg);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (!isOpen) return null;

  if (showStripeForm && stripeClientSecret) {
    return (
      <Elements stripe={stripePromise}>
        <StripePaymentForm
          clientSecret={stripeClientSecret}
          amount={amount}
          currency="NGN"
          onSuccess={() => {
            setShowStripeForm(false);
            onPaymentSuccess();
          }}
          onCancel={() => setShowStripeForm(false)}
          onError={(err) => {
            setPaymentError(err);
            onPaymentError(err);
            setShowStripeForm(false);
          }}
        />
      </Elements>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Choose Payment Method</h2>
          <button
            onClick={onClose}
            disabled={isProcessingPayment}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center bg-[#F2F6FC] rounded-2xl p-6">
            <p className="text-sm font-medium text-blue-600 mb-1 uppercase tracking-wider">Total Amount</p>
            <div className="text-4xl font-black text-gray-900">
              ₦{amount.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-2">Subscription Invoice: {invoiceId.split('-')[0].toUpperCase()}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Select Gateway</h3>
            
            {/* Paystack Option */}
            <button
              onClick={() => setSelectedPaymentMethod(PaymentMethod.PAYSTACK)}
              disabled={isProcessingPayment}
              className={`w-full group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selectedPaymentMethod === PaymentMethod.PAYSTACK
                  ? "border-[#0047AB] bg-blue-50/50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-gray-900">Paystack</p>
                <p className="text-xs text-gray-500">Cards, Transfer, USSD</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === PaymentMethod.PAYSTACK ? "border-[#0047AB] bg-[#0047AB]" : "border-gray-300"
              }`}>
                {selectedPaymentMethod === PaymentMethod.PAYSTACK && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>

            {/* Stripe Option */}
            <button
              onClick={() => setSelectedPaymentMethod(PaymentMethod.STRIPE)}
              disabled={isProcessingPayment || isAmountBelowStripeMinimum}
              className={`w-full group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selectedPaymentMethod === PaymentMethod.STRIPE
                  ? "border-[#0047AB] bg-blue-50/50"
                  : "border-gray-100 hover:border-gray-200"
              } ${isAmountBelowStripeMinimum ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-gray-900">Stripe</p>
                <p className="text-xs text-gray-500">Global Credit Cards</p>
                {isAmountBelowStripeMinimum && <p className="text-[10px] text-red-500 mt-1">Min. ₦100 required</p>}
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === PaymentMethod.STRIPE ? "border-[#0047AB] bg-[#0047AB]" : "border-gray-300"
              }`}>
                {selectedPaymentMethod === PaymentMethod.STRIPE && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          </div>

          {paymentError && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {paymentError}
            </div>
          )}

          <button
            onClick={processPayment}
            disabled={isProcessingPayment || !selectedPaymentMethod}
            className="w-full bg-[#0047AB] text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Proceed to Payment</span>
            )}
          </button>
          
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Secure Encrypted Transaction</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPaymentModal;

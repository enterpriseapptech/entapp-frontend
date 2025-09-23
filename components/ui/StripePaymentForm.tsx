import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { X, Lock, Shield, CreditCard, Loader } from "lucide-react";
import type { StripeCardElementChangeEvent } from "@stripe/stripe-js";

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onCancel,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      onError("Stripe not initialized");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: localStorage.getItem("user_email") || sessionStorage.getItem("user_email") || "",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        onError(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess(paymentIntent.id);
      } else {
        setErrorMessage("Payment failed. Please try again.");
        onError("Payment failed");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Payment failed";
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete);
    if (event.error) {
      setErrorMessage(event.error.message);
    } else {
      setErrorMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center bg-blue-50 rounded-full p-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <div className="mb-6 text-center">
            <p className="text-gray-600 mb-1">You&apos;re paying</p>
            <p className="text-2xl font-bold text-gray-900">
              {currency} {amount.toLocaleString()}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card information
              </label>
              <div className="border border-gray-300 rounded-lg p-3 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                        iconColor: '#666ee8',
                      },
                    },
                    hidePostalCode: true,
                  }}
                  onChange={handleCardChange}
                />
              </div>
            </div>
            
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              <span>Payments are secure and encrypted</span>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!stripe || loading || !cardComplete}
              className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Pay Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentForm;
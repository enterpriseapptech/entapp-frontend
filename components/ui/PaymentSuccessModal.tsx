import React from "react";
import { CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  invoiceId: string;
  paymentMethod: string;
  transactionReference: string;
  onDownloadReceipt?: () => void;
  onEmailReceipt?: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  amount,
}) => {
  const router = useRouter();
  if (!isOpen) return null;
  const handleCloseAndRedirect = () => {
    onClose?.();
    router.push("/");
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
      {/* Header (Sticky) */}
      <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-gray-800">Payment Successful!</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
  
      {/* Scrollable Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* ✅ Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
  
        {/* ✅ Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Payment Completed Successfully!
          </h3>
          <p className="text-gray-600">
            Thank you for your payment. Your booking has been confirmed.
          </p>
        </div>
  
        {/* ✅ Payment Details */}
        <div className="bg-gray-50 rounded-lg p-5 border">
          <h4 className="font-medium text-gray-700 mb-3">Payment Details</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold text-gray-900">
                ₦{amount.toLocaleString()}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Invoice ID:</span>
              <span className="font-medium text-gray-600">
                #{invoiceId.substring(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium capitalize">
                {paymentMethod.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction Reference:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs break-all">
                  {transactionReference.substring(0, 12)}...
                </span>
                <button
                  onClick={handleCopyReference}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Copy reference"
                >
                  <Copy className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            </div> */}
          </div>
        </div>
  
        {/* ✅ Next Steps */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">What&apos;s Next?</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• A confirmation email will be sent shortly</li>
            <li>• The service provider will contact you soon</li>
          </ul>
        </div>
  
        {/* ✅ Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCloseAndRedirect}
            className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default PaymentSuccessModal;
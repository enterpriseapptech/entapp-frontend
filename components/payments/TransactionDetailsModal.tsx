import { X } from "lucide-react";
import type { Transaction } from "@/types/payment.types";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailsModalProps) {
  if (!isOpen || !transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "failed":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transaction ID</p>
              <p className="text-base font-medium text-gray-900">
                {transaction.transactionId}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                transaction.status
              )}`}
            >
              {transaction.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p
                className={`text-base font-medium ${
                  transaction.amount.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.amount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-base font-medium text-gray-900">
                {transaction.date}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="text-base font-medium text-gray-900">
              {transaction.type}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Related To</p>
            <p className="text-base font-medium text-gray-900">
              {transaction.relatedTo}
            </p>
          </div>

          {transaction.description && (
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-base font-medium text-gray-900">
                {transaction.description}
              </p>
            </div>
          )}

          {transaction.paymentMethod && (
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="text-base font-medium text-gray-900">
                {transaction.paymentMethod}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import { TransactionTableRow } from "./TransactionTable";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionTableRow | null;
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailsModalProps) {
  if (!isOpen || !transaction) return null;

  const getStatusColor = (status: TransactionTableRow["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "FAILED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
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
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Status + Transaction ID */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Transaction ID</p>
              <p className="text-sm font-medium text-gray-900 break-all">
                {transaction.transactionId}
              </p>
            </div>
            <span
              className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                transaction.status
              )}`}
            >
              {transaction.status}
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* Amount row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                {transaction.amount}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{transaction.currency}</p>
            </div>
            {transaction.amountCharged !== undefined && transaction.amountCharged !== transaction.amountRaw && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Amount Charged</p>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.currency} {transaction.amountCharged.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            {transaction.paidAt && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Paid At</p>
                <p className="text-sm font-medium text-gray-900">{transaction.paidAt}</p>
              </div>
            )}
            {transaction.createdAt && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Created At</p>
                <p className="text-sm font-medium text-gray-900">{transaction.createdAt}</p>
              </div>
            )}
          </div>

          {/* Type + Method */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Payment Reason</p>
              <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Payment Method</p>
              <p className="text-sm font-medium text-gray-900">{transaction.paymentMethod}</p>
            </div>
          </div>

          {/* Reference */}
          {transaction.reference && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Reference</p>
              <p className="text-sm font-medium text-gray-900 break-all">{transaction.reference}</p>
            </div>
          )}

          {/* Invoice ID */}
          {transaction.invoiceId && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Invoice ID</p>
              <p className="text-sm font-medium text-gray-900 break-all">{transaction.invoiceId}</p>
            </div>
          )}

          {/* User ID */}
          {transaction.userId && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">User ID</p>
              <p className="text-sm font-medium text-gray-900 break-all">{transaction.userId}</p>
            </div>
          )}

          {/* Description */}
          {transaction.description && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Description</p>
              <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 shrink-0">
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

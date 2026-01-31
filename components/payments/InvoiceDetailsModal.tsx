import { X } from "lucide-react";
import type { Invoice } from "@/types/payment.types";

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export default function InvoiceDetailsModal({
  isOpen,
  onClose,
  invoice,
}: InvoiceDetailsModalProps) {
  if (!isOpen || !invoice) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "overdue":
        return "bg-red-50 text-red-700";
      case "partially paid":
        return "bg-blue-50 text-blue-700";
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
            Invoice Details
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
              <p className="text-sm text-gray-600">Invoice Reference</p>
              <p className="text-base font-medium text-gray-900">
                {invoice.invoiceRef}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Amount Due</p>
              <p className="text-base font-medium text-gray-900">
                {invoice.amount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="text-base font-medium text-gray-900">
                {invoice.dueDate}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">User</p>
            <p className="text-base font-medium text-gray-900">
              {invoice.user}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Related To</p>
            <p className="text-base font-medium text-gray-900">
              {invoice.relatedTo}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Payments Linked</p>
            <p className="text-base font-medium text-gray-900">
              {invoice.payments} payment(s)
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Created At</p>
            <p className="text-base font-medium text-gray-900">
              {invoice.createdAt}
            </p>
          </div>
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

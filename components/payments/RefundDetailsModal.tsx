import { X } from "lucide-react";
import type { RefundRequest } from "@/types/payment.types";

interface RefundDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  refund: RefundRequest | null;
  onApprove?: (refund: RefundRequest) => void;
  onDecline?: (refund: RefundRequest) => void;
}

export default function RefundDetailsModal({
  isOpen,
  onClose,
  refund,
  onApprove,
  onDecline,
}: RefundDetailsModalProps) {
  if (!isOpen || !refund) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "requested":
        return "bg-yellow-50 text-yellow-700";
      case "approved":
        return "bg-green-50 text-green-700";
      case "processing":
        return "bg-blue-50 text-blue-700";
      case "declined":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const showActions = refund.status.toLowerCase() === "requested";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Refund Request Details
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
              <p className="text-sm text-gray-600">Refund ID</p>
              <p className="text-base font-medium text-gray-900">
                {refund.refundId}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                refund.status
              )}`}
            >
              {refund.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-base font-medium text-gray-900">
                {refund.amount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Request Date</p>
              <p className="text-base font-medium text-gray-900">
                {refund.requestDate}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Payment Reference</p>
            <p className="text-base font-medium text-gray-900">
              {refund.paymentRef}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Requested By</p>
            <p className="text-base font-medium text-gray-900">
              {refund.requestedBy}
            </p>
          </div>

          {refund.reason && (
            <div>
              <p className="text-sm text-gray-600">Reason</p>
              <p className="text-base font-medium text-gray-900">
                {refund.reason}
              </p>
            </div>
          )}

          {refund.processedDate && (
            <div>
              <p className="text-sm text-gray-600">Processed Date</p>
              <p className="text-base font-medium text-gray-900">
                {refund.processedDate}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          {showActions ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onDecline?.(refund);
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  onApprove?.(refund);
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                Approve
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

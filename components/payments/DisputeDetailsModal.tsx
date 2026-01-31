import { X } from "lucide-react";
import { useState } from "react";
import type { Dispute } from "@/types/payment.types";

interface DisputeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispute: Dispute | null;
  onResolve?: (dispute: Dispute, notes: string) => void;
  onReject?: (dispute: Dispute, notes: string) => void;
}

export default function DisputeDetailsModal({
  isOpen,
  onClose,
  dispute,
  onResolve,
  onReject,
}: DisputeDetailsModalProps) {
  const [resolutionNotes, setResolutionNotes] = useState("");

  if (!isOpen || !dispute) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-yellow-50 text-yellow-700";
      case "resolved":
        return "bg-green-50 text-green-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const showActions = dispute.status.toLowerCase() === "open";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Dispute Details
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
              <p className="text-sm text-gray-600">Dispute ID</p>
              <p className="text-base font-medium text-gray-900">
                {dispute.disputeId}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                dispute.status
              )}`}
            >
              {dispute.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Created Date</p>
              <p className="text-base font-medium text-gray-900">
                {dispute.createdDate}
              </p>
            </div>
            {dispute.resolvedDate && (
              <div>
                <p className="text-sm text-gray-600">Resolved Date</p>
                <p className="text-base font-medium text-gray-900">
                  {dispute.resolvedDate}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600">User</p>
            <p className="text-base font-medium text-gray-900">
              {dispute.user}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Payment ID</p>
            <p className="text-base font-medium text-gray-900">
              {dispute.paymentId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Service Request ID</p>
            <p className="text-base font-medium text-gray-900">
              {dispute.serviceRequestId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Reason</p>
            <p className="text-base font-medium text-gray-900">
              {dispute.reason}
            </p>
          </div>

          {dispute.resolution && (
            <div>
              <p className="text-sm text-gray-600">Resolution</p>
              <p className="text-base font-medium text-gray-900">
                {dispute.resolution}
              </p>
            </div>
          )}

          {showActions && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Resolution Notes
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter resolution details..."
                className="w-full placeholder:text-gray-400 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
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
                  onReject?.(dispute, resolutionNotes);
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  onResolve?.(dispute, resolutionNotes);
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                Resolve
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

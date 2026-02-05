import { X } from "lucide-react";
import type { Fee } from "@/types/fee.types";

interface FeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: Fee | null;
}

export default function FeeDetailsModal({
  isOpen,
  onClose,
  fee,
}: FeeDetailsModalProps) {
  if (!isOpen || !fee) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Inactive":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Fee Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Fee Name and Status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Fee Name</p>
              <h3 className="text-lg font-semibold text-gray-900">
                {fee.feeName}
              </h3>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                fee.status
              )}`}
            >
              {fee.status}
            </span>
          </div>

          {/* Amount */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              {fee.currency}
              <span className="ml-1">{fee.amount.toFixed(2)}</span>
            </p>
          </div>

          {/* Type */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Type</p>
            <p className="text-base font-medium text-gray-900">{fee.type}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-base text-gray-900">{fee.description}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Additional Information */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Created At</span>
              <span className="text-sm font-medium text-gray-900">
                {fee.createdAt}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-medium text-gray-900">
                {fee.lastUpdated}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Updated By</span>
              <span className="text-sm font-medium text-gray-900">
                {fee.updatedBy}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

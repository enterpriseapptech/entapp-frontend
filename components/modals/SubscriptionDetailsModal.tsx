import { X } from "lucide-react";

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: {
    businessName: string;
    currentPlan: string;
    status: string;
    startDate: string;
    renewalDate: string;
  } | null;
}

export default function SubscriptionDetailsModal({
  isOpen,
  onClose,
  subscription,
}: SubscriptionDetailsModalProps) {
  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Subscription Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Business Name
              </label>
              <p className="text-base font-medium text-gray-900">
                {subscription.businessName}
              </p>
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Plan</label>
              <p className="text-base font-medium text-gray-900">
                {subscription.currentPlan}
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  subscription.status === "Active"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {subscription.status}
              </span>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Start Date
              </label>
              <p className="text-base font-medium text-gray-900">
                {subscription.startDate}
              </p>
            </div>

            {/* Renewal Date */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Renewal Date
              </label>
              <p className="text-base font-medium text-gray-900">
                {subscription.renewalDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

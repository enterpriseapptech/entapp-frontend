import { X } from "lucide-react";
import type { SubscriptionPlan } from "@/redux/services/adminApi";

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}

export default function PlanDetailsModal({
  isOpen,
  onClose,
  plan,
}: PlanDetailsModalProps) {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Plan Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Plan Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Plan Name
              </label>
              <p className="text-base font-medium text-gray-900">
                {plan.plan}
              </p>
            </div>

            {/* Time Frame */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Time Frame (Days)
              </label>
              <p className="text-base font-medium text-gray-900">
                {plan.timeFrame}
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <p className="text-base font-medium text-gray-900">
                ${plan.amount}
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.status === "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-700"
                  }`}
              >
                {plan.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

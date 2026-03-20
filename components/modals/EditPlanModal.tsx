import { X } from "lucide-react";
import { useState, useEffect } from "react";
import type { SubscriptionPlan, UpdateSubscriptionPlanRequest } from "@/redux/services/adminApi";

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  onUpdate: (id: string, updatedPlan: UpdateSubscriptionPlanRequest) => void;
}

export default function EditPlanModal({
  isOpen,
  onClose,
  plan,
  onUpdate,
}: EditPlanModalProps) {
  const [formData, setFormData] = useState({
    plan: plan?.plan || "",
    timeFrame: plan?.timeFrame?.toString() || "",
    amount: plan?.amount?.toString() || "",
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        plan: plan.plan || "",
        timeFrame: plan.timeFrame?.toString() || "",
        amount: plan.amount?.toString() || "",
      });
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

  const handleSubmit = () => {
    onUpdate(plan.id, {
      plan: formData.plan,
      timeFrame: Number(formData.timeFrame),
      amount: Number(formData.amount),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Subscription Plan
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              value={formData.plan}
              onChange={(e) =>
                setFormData({ ...formData, plan: e.target.value })
              }
              className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
              placeholder="Enter plan name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Time Frame (Days)
              </label>
              <input
                type="number"
                value={formData.timeFrame}
                onChange={(e) =>
                  setFormData({ ...formData, timeFrame: e.target.value })
                }
                className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                placeholder="e.g., 30, 365"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                placeholder="49"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Update Plan
          </button>
        </div>
      </div>
    </div>
  );
}

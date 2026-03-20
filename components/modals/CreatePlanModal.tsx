import { X } from "lucide-react";
import { useState } from "react";
import type { CreateSubscriptionPlanRequest } from "@/redux/services/adminApi";

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newPlan: CreateSubscriptionPlanRequest) => void;
}

export default function CreatePlanModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePlanModalProps) {
  const [formData, setFormData] = useState({
    plan: "",
    timeFrame: "",
    amount: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.plan || !formData.timeFrame || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const newPlan: CreateSubscriptionPlanRequest = {
      plan: formData.plan,
      amount: Number(formData.amount),
      timeFrame: Number(formData.timeFrame),
      status: "ACTIVE",
    };

    onCreate(newPlan);
    setFormData({ plan: "", timeFrame: "", amount: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Subscription Plan
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
              placeholder="e.g., Gold, Premium"
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
                placeholder="299"
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
            Create Plan
          </button>
        </div>
      </div>
    </div>
  );
}

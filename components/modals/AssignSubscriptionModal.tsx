import { X } from "lucide-react";
import { useState } from "react";
import type { NewSubscription } from "@/types/subscription.types";

interface AssignSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePlans: string[];
  onAssign: (newSubscription: NewSubscription) => void;
}

export default function AssignSubscriptionModal({
  isOpen,
  onClose,
  availablePlans,
  onAssign,
}: AssignSubscriptionModalProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    subscriptionPlan: "",
    startDate: "",
    renewalDate: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (
      !formData.businessName ||
      !formData.subscriptionPlan ||
      !formData.startDate ||
      !formData.renewalDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newSubscription = {
      id: Date.now(),
      businessName: formData.businessName,
      currentPlan: formData.subscriptionPlan,
      status: "Active",
      startDate: formData.startDate,
      renewalDate: formData.renewalDate,
    };

    onAssign(newSubscription);
    setFormData({
      businessName: "",
      subscriptionPlan: "",
      startDate: "",
      renewalDate: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Subscription
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
          {/* Business Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter business name"
            />
          </div>

          {/* Subscription Plan */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subscription Plan
            </label>
            <select
              value={formData.subscriptionPlan}
              onChange={(e) =>
                setFormData({ ...formData, subscriptionPlan: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a plan</option>
              {availablePlans.map((plan, index) => (
                <option key={index} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date and Renewal Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Renewal Date
              </label>
              <input
                type="date"
                value={formData.renewalDate}
                onChange={(e) =>
                  setFormData({ ...formData, renewalDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Assign Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

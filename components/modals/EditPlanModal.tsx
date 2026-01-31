import { X, Trash2 } from "lucide-react";
import { useState } from "react";
import type { UpdatedPlan } from "@/types/subscription.types";

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: number;
    planName: string;
    billingType: string;
    priceValue: number;
    features: string[];
  } | null;
  onUpdate: (updatedPlan: UpdatedPlan) => void;
}

export default function EditPlanModal({
  isOpen,
  onClose,
  plan,
  onUpdate,
}: EditPlanModalProps) {
  const [formData, setFormData] = useState({
    planName: plan?.planName || "",
    billingType: plan?.billingType || "",
    price: plan?.priceValue || 0,
    features: plan?.features || [],
  });
  const [newFeature, setNewFeature] = useState("");

  if (!isOpen || !plan) return null;

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    onUpdate({
      ...plan,
      ...formData,
      priceValue: formData.price,
      price: `$${formData.price}`,
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
          {/* Plan Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              value={formData.planName}
              onChange={(e) =>
                setFormData({ ...formData, planName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
              placeholder="Enter plan name"
            />
          </div>

          {/* Billing Type and Price */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Billing Type
              </label>
              <input
                type="text"
                value={formData.billingType}
                onChange={(e) =>
                  setFormData({ ...formData, billingType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                placeholder="e.g., Monthly, Annual"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                placeholder="49"
              />
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Features
            </label>
            <div className="space-y-2 mb-3">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg"
                >
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      setFormData({ ...formData, features: newFeatures });
                    }}
                    className="flex-1 px-3 py-1 border-0 focus:outline-none placeholder:text-gray-300"
                  />
                  <button
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddFeature()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                placeholder="Add a feature..."
              />
              <button
                onClick={handleAddFeature}
                className="px-4 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Add
              </button>
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

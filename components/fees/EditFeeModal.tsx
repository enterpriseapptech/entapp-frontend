import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Fee } from "@/types/fee.types";

interface EditFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: Fee | null;
  onSubmit: (fee: Fee) => void;
}

export default function EditFeeModal({
  isOpen,
  onClose,
  fee,
  onSubmit,
}: EditFeeModalProps) {
  const [formData, setFormData] = useState<Partial<Fee>>({
    feeName: "",
    type: "",
    amount: 0,
    currency: "USD",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (fee) {
      setFormData({
        id: fee.id,
        feeName: fee.feeName,
        type: fee.type,
        amount: fee.amount,
        currency: fee.currency,
        description: fee.description,
        status: fee.status,
        lastUpdated: fee.lastUpdated,
        updatedBy: fee.updatedBy,
        createdAt: fee.createdAt,
      });
    }
  }, [fee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      onSubmit(formData as Fee);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  if (!isOpen || !fee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Fee</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 placeholder-gray-400 tex-gray-500"
        >
          {/* Fee Name */}
          <div>
            <label
              htmlFor="feeName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fee Name
            </label>
            <input
              type="text"
              id="feeName"
              name="feeName"
              value={formData.feeName}
              onChange={handleChange}
              placeholder="KYC Verification Fee"
              className="w-full placeholder-gray-400 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Fee Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Fee Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white placeholder-gray-400"
              required
            >
              <option value="">Select type</option>
              <option value="KYC">KYC</option>
              <option value="Certification">Certification</option>
              <option value="Listing">Listing</option>
              <option value="Verification">Verification</option>
              <option value="Subscription">Subscription</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                className="w-full placeholder-gray-400 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 placeholder-gray-400 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the purpose of this fee..."
              rows={3}
              className="w-full px-4 placeholder-gray-400 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

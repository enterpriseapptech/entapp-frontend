import { X } from "lucide-react";
import { useState } from "react";
import type { NewAccount } from "@/types/payment.types";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (account: NewAccount) => void;
}

export default function AddAccountModal({
  isOpen,
  onClose,
  onSubmit,
}: AddAccountModalProps) {
  const [formData, setFormData] = useState<NewAccount>({
    name: "",
    bank: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
    isDefault: false,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (
      formData.name &&
      formData.bank &&
      formData.accountNumber &&
      formData.routingNumber &&
      formData.accountType
    ) {
      onSubmit(formData);
      setFormData({
        name: "",
        bank: "",
        accountNumber: "",
        routingNumber: "",
        accountType: "",
        isDefault: false,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Withdrawal Account
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Business Operations Account"
              className="w-full placeholder:text-gray-400 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={formData.bank}
              onChange={(e) =>
                setFormData({ ...formData, bank: e.target.value })
              }
              placeholder="Bank of America"
              className="w-full placeholder:text-gray-400 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                placeholder="****1234"
                className="w-full placeholder:text-gray-400 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Number
              </label>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) =>
                  setFormData({ ...formData, routingNumber: e.target.value })
                }
                placeholder="026009593"
                className="w-full placeholder:text-gray-400 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              value={formData.accountType}
              onChange={(e) =>
                setFormData({ ...formData, accountType: e.target.value })
              }
              className="w-full text-gray-400 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select account type</option>
              <option value="Checking">Checking</option>
              <option value="Savings">Savings</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="setDefault"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="setDefault" className="text-sm text-gray-700">
              Set as default withdrawal account
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !formData.bank ||
              !formData.accountNumber ||
              !formData.routingNumber ||
              !formData.accountType
            }
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}

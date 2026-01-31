import { X } from "lucide-react";
import { useState } from "react";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: string;
  onSubmit: (amount: string, account: string) => void;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
  onSubmit,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (amount && selectedAccount) {
      onSubmit(amount, selectedAccount);
      setAmount("");
      setSelectedAccount("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Request Withdrawal
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-blue-900">
              {availableBalance}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2.5 border placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Account
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2.5 border text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select account</option>
              <option value="account1">
                Business Operations Account - ****1234
              </option>
              <option value="account2">Savings Reserve - ****5678</option>
              <option value="account3">
                Secondary Business Account - ****9012
              </option>
            </select>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Withdrawals typically take 2-3 business days to process. A
              notification will be sent once completed.
            </p>
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
            disabled={!amount || !selectedAccount}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

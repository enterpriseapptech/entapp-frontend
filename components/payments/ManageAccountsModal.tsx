import { X, Plus, CreditCard, Edit2, Trash2 } from "lucide-react";
import type { WithdrawalAccount } from "@/types/payment.types";

interface ManageAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: WithdrawalAccount[];
  onAddAccount: () => void;
  onEditAccount: (account: WithdrawalAccount) => void;
  onDeleteAccount: (accountId: string) => void;
}

export default function ManageAccountsModal({
  isOpen,
  onClose,
  accounts,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
}: ManageAccountsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Withdrawal Accounts
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your withdrawal accounts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={onAddAccount}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {account.name}
                        </p>
                        {account.isDefault && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {account.bank}
                      </p>
                      <p className="text-sm text-gray-600">
                        {account.type} • {account.accountNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditAccount(account)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onDeleteAccount(account.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import { Subscription } from "@/redux/services/adminApi";

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

export default function SubscriptionDetailsModal({
  isOpen,
  onClose,
  subscription,
}: SubscriptionDetailsModalProps) {
  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
            {/* Service Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Service Name
              </label>
              <p className="text-base font-medium text-gray-900">
                {subscription.serviceName || "N/A"}
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <p className="text-base font-medium text-gray-900">
                {subscription.type}
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  subscription.status === "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {subscription.status}
              </span>
            </div>

            {/* Created Date */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Created Date
              </label>
              <p className="text-base font-medium text-gray-900">
                {new Date(subscription.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Expiry Date */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Expiry Date
              </label>
              <p className="text-base font-medium text-gray-900">
                {new Date(subscription.expiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Invoices section if available */}
          {subscription.invoice && subscription.invoice.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoices</h3>
              <div className="space-y-4">
                {subscription.invoice.map((inv) => (
                  <div key={inv.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Ref: {inv.reference}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Amount: {inv.currency} {inv.amountDue}</span>
                      <span>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

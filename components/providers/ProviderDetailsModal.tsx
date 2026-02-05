import { X } from "lucide-react";
import type { Provider } from "@/types/provider.types";

interface ProviderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
}

export default function ProviderDetailsModal({
  isOpen,
  onClose,
  provider,
}: ProviderDetailsModalProps) {
  if (!isOpen || !provider) return null;

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Expired":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getCertificationColor = (certification: string) => {
    switch (certification) {
      case "Certified":
        return "bg-green-50 text-green-700 border-green-200";
      case "Not Certified":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Provider Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Business Name and Subscription Status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Business Name</p>
              <h3 className="text-lg font-semibold text-gray-900">
                {provider.businessName}
              </h3>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${getSubscriptionColor(
                provider.subscription
              )}`}
            >
              {provider.subscription}
            </span>
          </div>

          {/* Wallet Balance and Service Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${provider.walletBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Service Type</p>
              <p className="text-base font-medium text-gray-900">
                {provider.serviceType}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Contact Information */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-base text-gray-900">{provider.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="text-base text-gray-900">{provider.phone}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Status Information */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Status Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">KYC Status</span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getKycStatusColor(
                    provider.kycStatus
                  )}`}
                >
                  {provider.kycStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Certification Status
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getCertificationColor(
                    provider.certification
                  )}`}
                >
                  {provider.certification}
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Note:</span> The provider can
              request withdrawals from their wallet balance and manage their
              services through the provider portal.
            </p>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

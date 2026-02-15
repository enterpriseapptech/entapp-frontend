import { X } from "lucide-react";
import type { User, UserStatus, UserType } from "@/redux/services/adminApi";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const getStatusColor = (status: UserStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-50 text-green-700 border-green-200";
    case "INACTIVE":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "SUSPENDED":
      return "bg-red-50 text-red-700 border-red-200";
  }
};

const getUserTypeColor = (userType: UserType): string => {
  switch (userType) {
    case "SERVICE_PROVIDER":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "CUSTOMER":
      return "bg-purple-50 text-purple-700 border-purple-200";
  }
};

const formatUserType = (userType: UserType): string => {
  switch (userType) {
    case "SERVICE_PROVIDER":
      return "Service Provider";
    case "CUSTOMER":
      return "Customer";
  }
};

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl md:w-full w-[90%] sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto ">
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
          <h2 className="text-base md:text-xl font-semibold text-gray-900">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Name, Type & Status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Full Name</p>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 flex-shrink-0">
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getUserTypeColor(
                  user.userType
                )}`}
              >
                {formatUserType(user.userType)}
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                  user.status
                )}`}
              >
                {user.status}
              </span>
            </div>
          </div>

          {/* Email & Verification */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-900 break-all">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email Verified</p>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                  user.isEmailVerified
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                }`}
              >
                {user.isEmailVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Address */}
          <div>
            <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
              Address
            </h4>
            <div className="space-y-2 md:space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Street Address</p>
                <p className="text-sm text-gray-900">
                  {user.streetAddress
                    ? `${user.streetAddress}${
                        user.streetAddress2 ? `, ${user.streetAddress2}` : ""
                      }`
                    : "—"}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">City</p>
                  <p className="text-sm text-gray-900">{user.city ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">State</p>
                  <p className="text-sm text-gray-900">{user.state ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Country</p>
                  <p className="text-sm text-gray-900">{user.country ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Activity */}
          <div>
            <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3">
              Account Activity
            </h4>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Registered</p>
                <p className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Last Login</p>
                <p className="text-sm text-gray-900">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Login Attempts</p>
                <p className="text-sm text-gray-900">{user.loginAttempts}</p>
              </div>
            </div>
          </div>

          {/* Close */}
          <div className="pt-2 pb-safe">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

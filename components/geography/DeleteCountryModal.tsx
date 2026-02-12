import { X, AlertTriangle, Loader2 } from "lucide-react";
import type { Country } from "@/redux/services/adminApi";

interface DeleteCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: Country | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteCountryModal({
  isOpen,
  onClose,
  country,
  onConfirm,
  isLoading = false,
}: DeleteCountryModalProps) {
  if (!isOpen || !country) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Delete Country
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              You are about to delete the country:{" "}
              <span className="font-semibold text-gray-900">
                {country.name}
              </span>
              {country.code && (
                <span className="ml-1 text-gray-500">({country.code})</span>
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete Country"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import type { Country } from "@/types/geography.types";

interface CountryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: Country | null;
}

export default function CountryDetailsModal({
  isOpen,
  onClose,
  country,
}: CountryDetailsModalProps) {
  if (!isOpen || !country) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Country Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Country Name
              </label>
              <p className="text-base text-gray-900">{country.countryName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Country Code
              </label>
              <p className="text-base text-gray-900">{country.code}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Currency
              </label>
              <p className="text-base text-gray-900">{country.currency}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Currency Symbol
              </label>
              <p className="text-base text-gray-900">
                {country.currencySymbol}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  country.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {country.status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Last Updated
              </label>
              <p className="text-base text-gray-900">{country.lastUpdated}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Created At
              </label>
              <p className="text-base text-gray-900">{country.createdAt}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import type { City } from "@/types/geography.types";

interface CityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: City | null;
}

export default function CityDetailsModal({
  isOpen,
  onClose,
  city,
}: CityDetailsModalProps) {
  if (!isOpen || !city) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">City Details</h2>
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
                City Name
              </label>
              <p className="text-base text-gray-900">{city.cityName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                State/Province
              </label>
              <p className="text-base text-gray-900">{city.state}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Country
              </label>
              <p className="text-base text-gray-900">{city.country}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  city.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {city.status}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Last Updated
              </label>
              <p className="text-base text-gray-900">{city.lastUpdated}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Created At
              </label>
              <p className="text-base text-gray-900">{city.createdAt}</p>
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

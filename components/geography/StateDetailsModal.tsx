import { X } from "lucide-react";
import type { State } from "@/redux/services/adminApi";

interface StateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: State | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function StateDetailsModal({
  isOpen,
  onClose,
  state,
}: StateDetailsModalProps) {
  if (!isOpen || !state) return null;

  const isActive = !state.deletedAt;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            State/Province Details
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
                State/Province Name
              </label>
              <p className="text-base text-gray-900">{state.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                State Code
              </label>
              <p className="text-base text-gray-900">{state.code}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Country ID
              </label>
              <p className="text-base text-gray-900 font-mono text-sm">
                {state.countryId}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Last Updated
              </label>
              <p className="text-base text-gray-900">
                {formatDate(state.updatedAt)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Created At
              </label>
              <p className="text-base text-gray-900">
                {formatDate(state.createdAt)}
              </p>
            </div>

            {state.updatedBy && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Updated By
                </label>
                <p className="text-base text-gray-900 font-mono text-sm">
                  {state.updatedBy}
                </p>
              </div>
            )}
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

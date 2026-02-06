import { X, AlertTriangle } from "lucide-react";
import type { State } from "@/types/geography.types";

interface DeleteStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: State | null;
  onConfirm: () => void;
}

export default function DeleteStateModal({
  isOpen,
  onClose,
  state,
  onConfirm,
}: DeleteStateModalProps) {
  if (!isOpen || !state) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Delete State/Province
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
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
              You are about to delete the state/province:{" "}
              <span className="font-semibold text-gray-900">
                {state.stateName}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Delete State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

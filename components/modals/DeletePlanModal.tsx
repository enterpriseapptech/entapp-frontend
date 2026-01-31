import { X, AlertTriangle } from "lucide-react";

interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    planName: string;
  } | null;
  onDelete: () => void;
}

export default function DeletePlanModal({
  isOpen,
  onClose,
  plan,
  onDelete,
}: DeletePlanModalProps) {
  if (!isOpen || !plan) return null;

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Delete Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-600">
                Do you really want to delete the plan{" "}
                <span className="font-semibold text-gray-900">
                  &quot;{plan.planName}&ldquo;
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Delete Plan
          </button>
        </div>
      </div>
    </div>
  );
}

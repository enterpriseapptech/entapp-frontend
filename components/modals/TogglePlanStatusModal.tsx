import { X, Power } from "lucide-react";

interface TogglePlanStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    planName: string;
    status: string;
  } | null;
  onToggle: () => void;
}

export default function TogglePlanStatusModal({
  isOpen,
  onClose,
  plan,
  onToggle,
}: TogglePlanStatusModalProps) {
  if (!isOpen || !plan) return null;

  const isActive = plan.status === "Active";
  const newStatus = isActive ? "Inactive" : "Active";

  const handleToggle = () => {
    onToggle();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isActive ? "Deactivate" : "Activate"} Plan
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
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Power className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Change Plan Status
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to change the status of{" "}
                <span className="font-semibold text-gray-900">
                  &quot;{plan.planName}&ldquo;
                </span>{" "}
                to{" "}
                <span
                  className={`font-semibold ${
                    isActive ? "text-gray-700" : "text-green-700"
                  }`}
                >
                  {newStatus}
                </span>
                ?
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
            onClick={handleToggle}
            className={`px-4 py-2 rounded-lg font-medium ${
              isActive
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}

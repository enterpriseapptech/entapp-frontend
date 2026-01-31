import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Dispute } from "@/types/payment.types";

interface DisputeTableProps {
  disputes: Dispute[];
  onViewDetails: (dispute: Dispute) => void;
}

/**
 * Maps Dispute status values to the literal union expected by StatusBadge.
 * This keeps StatusBadge unchanged while fixing the type error.
 */
const getBadgeStatus = (
  status: Dispute["status"]
): "Requested" | "Approved" | "Processing" | "Declined" => {
  switch (status) {
    case "Open":
      return "Requested"; // Active / awaiting action
    case "Resolved":
      return "Approved"; // Successfully closed in favor of resolution
    case "Rejected":
      return "Declined"; // Dispute not upheld
    // Exhaustive — TypeScript will warn if new statuses are added
  }
};

export default function DisputeTable({
  disputes,
  onViewDetails,
}: DisputeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Dispute ID
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              User
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Payment ID
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Created Date
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {disputes.map((dispute) => (
            <tr
              key={dispute.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6 text-sm text-gray-900">
                {dispute.disputeId}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {dispute.user}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {dispute.paymentId}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {dispute.createdDate}
              </td>
              <td className="py-4 px-6">
                <StatusBadge status={getBadgeStatus(dispute.status)} />
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => onViewDetails(dispute)}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="View details"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

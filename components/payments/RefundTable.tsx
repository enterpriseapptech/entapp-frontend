import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { RefundRequest } from "@/types/payment.types";

interface RefundTableProps {
  refunds: RefundRequest[];
  onViewDetails: (refund: RefundRequest) => void;
}

export default function RefundTable({
  refunds,
  onViewDetails,
}: RefundTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Refund ID
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Payment Ref
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Requested By
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Amount
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Request Date
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
          {refunds.map((refund) => (
            <tr
              key={refund.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6 text-sm text-gray-900">
                {refund.refundId}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {refund.paymentRef}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {refund.requestedBy}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {refund.amount}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {refund.requestDate}
              </td>
              <td className="py-4 px-6">
                <StatusBadge status={refund.status} />
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => onViewDetails(refund)}
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

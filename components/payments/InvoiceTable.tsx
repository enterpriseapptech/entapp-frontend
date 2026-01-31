import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Invoice } from "@/types/payment.types";

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewDetails: (invoice: Invoice) => void;
}

const getBadgeStatus = (
  status: Invoice["status"]
): "Requested" | "Approved" | "Processing" | "Declined" => {
  switch (status) {
    case "Pending":
      return "Requested";

    case "Partially Paid":
      return "Processing";

    case "Paid":
      return "Approved";

    case "Overdue":
      return "Declined";
  }
};

export default function InvoiceTable({
  invoices,
  onViewDetails,
}: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Invoice Ref
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              User
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Related To
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Amount
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Due Date
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Payments
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6 text-sm text-gray-900">
                {invoice.invoiceRef}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {invoice.user}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {invoice.relatedTo}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {invoice.amount}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {invoice.dueDate}
              </td>
              <td className="py-4 px-6">
                <StatusBadge status={getBadgeStatus(invoice.status)} />
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {invoice.payments} linked
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => onViewDetails(invoice)}
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

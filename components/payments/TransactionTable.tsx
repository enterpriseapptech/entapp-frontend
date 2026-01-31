import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Transaction } from "@/types/payment.types";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
}

const getBadgeStatus = (
  status: Transaction["status"]
): "Requested" | "Approved" | "Processing" | "Declined" => {
  switch (status) {
    case "Pending":
      return "Requested";
    case "Completed":
      return "Approved";
    case "Failed":
      return "Declined";
  }
};

export default function TransactionTable({
  transactions,
  onViewDetails,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Transaction ID
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Type
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Amount
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Date
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Related To
            </th>
            <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6 text-sm text-gray-900">
                {transaction.transactionId}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {transaction.type}
              </td>
              <td
                className={`py-4 px-6 text-sm font-medium ${
                  transaction.amount.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.amount}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {transaction.date}
              </td>
              <td className="py-4 px-6">
                <StatusBadge status={getBadgeStatus(transaction.status)} />
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {transaction.relatedTo}
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => onViewDetails(transaction)}
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

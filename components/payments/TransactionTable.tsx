import { Eye } from "lucide-react";

export interface TransactionTableRow {
  id: string;
  transactionId: string;
  type: string;
  amount: string;
  amountRaw: number;
  date: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  description?: string;
  paymentMethod: "STRIPE" | "PAYSTACK";
  currency: string;
}

interface TransactionTableProps {
  transactions: TransactionTableRow[];
  onViewDetails: (transaction: TransactionTableRow) => void;
}

export default function TransactionTable({
  transactions,
  onViewDetails,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  const getStatusColor = (status: TransactionTableRow["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "FAILED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-sm text-gray-600">{transaction.type}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {transaction.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {transaction.amount}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => onViewDetails(transaction)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="View details"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <table className="w-full hidden sm:table">
        <thead>
          <tr className="border-b border-gray-200">
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
              Payment Method
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
                {transaction.type}
              </td>
              <td className="py-4 px-6 text-sm font-medium text-gray-900">
                {transaction.amount}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {transaction.date}
              </td>
              <td className="py-4 px-6">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {transaction.paymentMethod}
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

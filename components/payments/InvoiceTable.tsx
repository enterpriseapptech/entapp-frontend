import { Eye } from "lucide-react";

export interface InvoiceTableRow {
  id: string;
  invoiceRef: string;
  amount: string;
  amountRaw: number;
  dueDate: string;
  status: "PAID" | "PENDING" | "CANCELLED";
  currency: string;
  items: number;
  itemDetails?: { item: string; amount: number }[];
  createdAt: string;
  updatedAt?: string;
  userId?: string;
  bookingId?: string;
  note?: string;
  billingAddress?: {
    city: string;
    state: string;
    postal: string;
    street: string;
    country: string;
  };
}

interface InvoiceTableProps {
  invoices: InvoiceTableRow[];
  onViewDetails: (invoice: InvoiceTableRow) => void;
}

export default function InvoiceTable({
  invoices,
  onViewDetails,
}: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-500">No invoices found</p>
      </div>
    );
  }

  const getStatusColor = (status: InvoiceTableRow["status"]) => {
    switch (status) {
      case "PAID":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "CANCELLED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {invoice.invoiceRef}
                </p>
                <p className="text-xs text-gray-500 mt-1">{invoice.dueDate}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-medium text-gray-900">
                  {invoice.amount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Items</p>
                <p className="text-sm text-gray-900">{invoice.items} item(s)</p>
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => onViewDetails(invoice)}
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
              Invoice Ref
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
              Items
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
              <td className="py-4 px-6 text-sm font-medium text-gray-900">
                {invoice.amount}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {invoice.dueDate}
              </td>
              <td className="py-4 px-6">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="py-4 px-6 text-sm text-gray-900">
                {invoice.items}
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

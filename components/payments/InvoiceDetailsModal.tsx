import { X } from "lucide-react";
import { InvoiceTableRow } from "./InvoiceTable";

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceTableRow | null;
}

export default function InvoiceDetailsModal({
  isOpen,
  onClose,
  invoice,
}: InvoiceDetailsModalProps) {
  if (!isOpen || !invoice) return null;

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

  const totalItemsAmount = invoice.itemDetails?.reduce(
    (sum, i) => sum + i.amount,
    0
  ) ?? 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            Invoice Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Ref + Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Invoice Reference</p>
              <p className="text-sm font-semibold text-gray-900 break-all">{invoice.invoiceRef}</p>
            </div>
            <span
              className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* Amount + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Amount Due</p>
              <p className="text-sm font-semibold text-gray-900">{invoice.amount}</p>
              <p className="text-xs text-gray-400 mt-0.5">{invoice.currency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Due Date</p>
              <p className="text-sm font-medium text-gray-900">{invoice.dueDate}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Created At</p>
              <p className="text-sm font-medium text-gray-900">{invoice.createdAt}</p>
            </div>
            {invoice.updatedAt && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">{invoice.updatedAt}</p>
              </div>
            )}
          </div>

          {/* IDs */}
          {(invoice.userId || invoice.bookingId) && (
            <div className="grid grid-cols-1 gap-3">
              {invoice.userId && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">User ID</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{invoice.userId}</p>
                </div>
              )}
              {invoice.bookingId && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Booking ID</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{invoice.bookingId}</p>
                </div>
              )}
            </div>
          )}

          {/* Note */}
          {invoice.note && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Note</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{invoice.note}</p>
            </div>
          )}

          {/* Items Breakdown */}
          {invoice.itemDetails && invoice.itemDetails.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Items ({invoice.itemDetails.length})
              </p>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Item</th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.itemDetails.map((it, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="px-3 py-2 text-gray-900">{it.item}</td>
                        <td className="px-3 py-2 text-right text-gray-900">
                          {invoice.currency} {it.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td className="px-3 py-2 text-xs font-semibold text-gray-600">Total</td>
                      <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900">
                        {invoice.currency} {totalItemsAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Billing Address */}
          {invoice.billingAddress && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Billing Address</p>
              <div className="bg-gray-50 rounded-lg px-3 py-3 text-sm text-gray-700 space-y-0.5">
                <p>{invoice.billingAddress.street}</p>
                <p>
                  {invoice.billingAddress.city},{" "}
                  {invoice.billingAddress.state}{" "}
                  {invoice.billingAddress.postal}
                </p>
                <p>{invoice.billingAddress.country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

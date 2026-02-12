"use client";

import { useState } from "react";
import { Zap, Settings, Bell, Menu } from "lucide-react";
import Pagination from "@/components/payments/Pagination";
import Sidebar from "@/components/layouts/SideBar";
import TransactionDetailsModal from "@/components/payments/TransactionDetailsModal";
import InvoiceDetailsModal from "@/components/payments/InvoiceDetailsModal";
import TransactionTable, {
  TransactionTableRow,
} from "@/components/payments/TransactionTable";
import InvoiceTable, {
  InvoiceTableRow,
} from "@/components/payments/InvoiceTable";

// Import the API and types
import {
  useGetPaymentsQuery,
  useGetInvoicesQuery,
  type Payment,
  type Invoice,
} from "@/redux/services/adminApi";

type TabType = "Transactions" | "Invoices";

// Transform API Payment to match Transaction table expected format
const transformPaymentToTransaction = (
  payment: Payment
): TransactionTableRow => ({
  id: payment.id,
  transactionId: payment.transactionId || payment.reference,
  type: payment.paymentReason || "Payment",
  amount: `${payment.currency} ${payment.amount.toLocaleString()}`,
  amountRaw: payment.amount,
  date: new Date(payment.paidAt || payment.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ),
  status: payment.status,
  // relatedTo: `Invoice #${payment.invoiceId?.slice(-6) || "N/A"}`,
  description: `Payment via ${payment.paymentMethod}`,
  paymentMethod: payment.paymentMethod,
  currency: payment.currency,
});

// Transform API Invoice to match Invoice table expected format
const transformApiInvoiceToComponent = (invoice: Invoice): InvoiceTableRow => {
  return {
    id: invoice.id,
    invoiceRef: invoice.reference || `INV-${invoice.id.slice(-6)}`,
    // userId: invoice.userId ? invoice.userId.slice(-8) : "N/A",
    // relatedTo: invoice.bookingId
    //   ? `Booking #${invoice.bookingId.slice(-6)}`
    //   : invoice.subscriptionId
    //   ? "Subscription"
    //   : "N/A",
    amount: `${invoice.currency} ${invoice.amountDue.toLocaleString()}`,
    amountRaw: invoice.amountDue,
    dueDate: new Date(invoice.dueDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    status: invoice.status,
    currency: invoice.currency,
    items: invoice.items?.length || 0,
    createdAt: new Date(invoice.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  };
};

export default function PaymentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Transactions");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch payments data
  const {
    data: paymentsData,
    isLoading: isLoadingPayments,
    isError: isPaymentsError,
  } = useGetPaymentsQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  // Fetch invoices data
  const {
    data: invoicesData,
    isLoading: isLoadingInvoices,
    isError: isInvoicesError,
  } = useGetInvoicesQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Selected item states
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionTableRow | null>(null);
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceTableRow | null>(null);

  const tabs: TabType[] = ["Transactions", "Invoices"];

  // Calculate total pages
  const totalPages =
    activeTab === "Transactions"
      ? Math.ceil((paymentsData?.count || 0) / pageSize)
      : Math.ceil((invoicesData?.count || 0) / pageSize);

  const handleViewTransactionDetails = (transaction: TransactionTableRow) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleViewInvoiceDetails = (invoice: InvoiceTableRow) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Transform API data for tables
  const transactions =
    paymentsData?.data?.map(transformPaymentToTransaction) || [];
  const invoices =
    invoicesData?.data?.map(transformApiInvoiceToComponent) || [];

  const renderTabContent = () => {
    if (activeTab === "Transactions") {
      return (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction History
              {paymentsData?.count !== undefined && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({paymentsData.count} total)
                </span>
              )}
            </h2>
          </div>
          {isLoadingPayments ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isPaymentsError ? (
            <div className="text-center py-12 px-4">
              <p className="text-red-600">
                Error loading transactions. Please try again.
              </p>
            </div>
          ) : (
            <TransactionTable
              transactions={transactions}
              onViewDetails={handleViewTransactionDetails}
            />
          )}
        </>
      );
    } else {
      return (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Invoice Management
              {invoicesData?.count !== undefined && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({invoicesData.count} total)
                </span>
              )}
            </h2>
          </div>
          {isLoadingInvoices ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isInvoicesError ? (
            <div className="text-center py-12 px-4">
              <p className="text-red-600">
                Error loading invoices. Please try again.
              </p>
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              onViewDetails={handleViewInvoiceDetails}
            />
          )}
        </>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full md:ml-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 md:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>

                {/* Page Title */}
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Payment & Wallet Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    View platform transactions and manage invoices
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Upgrade now
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          {/* Tabs and Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 px-4 sm:px-6 overflow-x-auto">
              <div className="flex gap-6 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                    className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <TransactionDetailsModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        transaction={selectedTransaction}
      />

      <InvoiceDetailsModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
}

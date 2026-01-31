"use client";

import { useState } from "react";
import {
  Wallet,
  CircleDollarSign,
  TrendingUp,
  Zap,
  Settings,
  Bell,
  Download,
  Menu,
  Building2,
} from "lucide-react";
import StatCard from "@/components/payments/StatCard";
import RefundTable from "@/components/payments/RefundTable";
import Pagination from "@/components/payments/Pagination";
import Sidebar from "@/components/layouts/SideBar";
import type {
  RefundRequest,
  TabType,
  Transaction,
  Invoice,
  Dispute,
  WithdrawalAccount,
  NewAccount,
} from "@/types/payment.types";

// Import all modals
import TransactionDetailsModal from "@/components/payments/TransactionDetailsModal";
import InvoiceDetailsModal from "@/components/payments/InvoiceDetailsModal";
import RefundDetailsModal from "@/components/payments/RefundDetailsModal";
import DisputeDetailsModal from "@/components/payments/DisputeDetailsModal";
import WithdrawalModal from "@/components/payments/WithdrawalModal";
import ManageAccountsModal from "@/components/payments/ManageAccountsModal";
import AddAccountModal from "@/components/payments/AddAccountModal";
import TransactionTable from "@/components/payments/TransactionTable";
import InvoiceTable from "@/components/payments/InvoiceTable";
import DisputeTable from "@/components/payments/DisputeTable";

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "1",
    transactionId: "TXN001",
    type: "Booking Payment",
    amount: "+$5,000",
    date: "2025-01-02",
    status: "Completed",
    relatedTo: "Booking #BK-10234",
    description: "Event center booking for corporate event",
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    transactionId: "TXN002",
    type: "Subscription Payment",
    amount: "+$99",
    date: "2025-01-01",
    status: "Completed",
    relatedTo: "Grand Ballroom Hall",
    description: "Monthly subscription",
    paymentMethod: "Credit Card",
  },
  {
    id: "3",
    transactionId: "TXN003",
    type: "Withdrawal",
    amount: "-$2,500",
    date: "2024-12-30",
    status: "Completed",
    relatedTo: "John Smith",
    description: "Withdrawal to bank account",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "4",
    transactionId: "TXN004",
    type: "Refund",
    amount: "+$500",
    date: "2024-12-28",
    status: "Pending",
    relatedTo: "Booking #BK-10120",
    description: "Refund for cancelled booking",
    paymentMethod: "Credit Card",
  },
  {
    id: "5",
    transactionId: "TXN005",
    type: "Booking Payment",
    amount: "+$3,500",
    date: "2024-12-27",
    status: "Completed",
    relatedTo: "Booking #BK-10118",
    description: "Wedding venue booking",
    paymentMethod: "Credit Card",
  },
];

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceRef: "INV-2025-001",
    user: "Alice Thompson",
    relatedTo: "Booking #BK-10234",
    amount: "USD 5,000",
    dueDate: "2025-01-15",
    status: "Paid",
    payments: 1,
    createdAt: "2025-01-01",
  },
  {
    id: "2",
    invoiceRef: "INV-2025-002",
    user: "Grand Ballroom Hall",
    relatedTo: "Subscription - Professional Plan",
    amount: "USD 99",
    dueDate: "2025-02-01",
    status: "Pending",
    payments: 0,
    createdAt: "2025-01-01",
  },
  {
    id: "3",
    invoiceRef: "INV-2024-089",
    user: "Bob Martinez",
    relatedTo: "Booking #BK-10099",
    amount: "USD 8,000",
    dueDate: "2024-12-20",
    status: "Overdue",
    payments: 0,
    createdAt: "2024-12-01",
  },
  {
    id: "4",
    invoiceRef: "INV-2025-003",
    user: "Alice Thompson",
    relatedTo: "Booking #BK-10245",
    amount: "USD 3,500",
    dueDate: "2025-01-25",
    status: "Partially Paid",
    payments: 1,
    createdAt: "2025-01-01",
  },
];

// Mock data for refund requests
const mockRefunds: RefundRequest[] = [
  {
    id: "1",
    refundId: "REF001",
    paymentRef: "TXN004",
    requestedBy: "Alice Thompson",
    amount: "USD 500",
    requestDate: "2024-12-28",
    status: "Requested",
    reason: "Event cancelled by organizer",
  },
  {
    id: "2",
    refundId: "REF002",
    paymentRef: "TXN015",
    requestedBy: "Bob Martinez",
    amount: "USD 1,200",
    requestDate: "2024-12-20",
    status: "Approved",
    reason: "Service not provided as agreed",
    processedDate: "2024-12-22",
  },
  {
    id: "3",
    refundId: "REF003",
    paymentRef: "TXN022",
    requestedBy: "Sarah Johnson",
    amount: "USD 750",
    requestDate: "2025-01-10",
    status: "Processing",
    reason: "Duplicate payment",
  },
  {
    id: "4",
    refundId: "REF004",
    paymentRef: "TXN018",
    requestedBy: "Michael Brown",
    amount: "USD 300",
    requestDate: "2024-12-15",
    status: "Declined",
    reason: "Outside refund policy window",
  },
];

// Mock data for disputes
const mockDisputes: Dispute[] = [
  {
    id: "1",
    disputeId: "DIS001",
    user: "Alice Thompson",
    paymentId: "TXN001",
    serviceRequestId: "BK-10234",
    createdDate: "2025-01-10",
    status: "Open",
    reason: "Service quality did not match description",
  },
  {
    id: "2",
    disputeId: "DIS002",
    user: "Bob Martinez",
    paymentId: "TXN008",
    serviceRequestId: "BK-10099",
    createdDate: "2024-12-18",
    status: "Resolved",
    reason: "Unauthorized charge on account",
    resolution: "Full refund issued to customer",
    resolvedDate: "2024-12-20",
  },
  {
    id: "3",
    disputeId: "DIS003",
    user: "Michael Brown",
    paymentId: "TXN025",
    serviceRequestId: "BK-10145",
    createdDate: "2025-01-15",
    status: "Open",
    reason: "Service not provided as agreed",
  },
];

// Mock withdrawal accounts
const mockAccounts: WithdrawalAccount[] = [
  {
    id: "1",
    name: "Business Operations Account",
    bank: "Bank of America",
    type: "Checking",
    accountNumber: "****1234",
    isDefault: true,
  },
  {
    id: "2",
    name: "Savings Reserve",
    bank: "Chase Bank",
    type: "Savings",
    accountNumber: "****5678",
    isDefault: false,
  },
  {
    id: "3",
    name: "Secondary Business Account",
    bank: "Wells Fargo",
    type: "Checking",
    accountNumber: "****9012",
    isDefault: false,
  },
];

export default function PaymentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Transactions");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isManageAccountsModalOpen, setIsManageAccountsModalOpen] =
    useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // Selected item states
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(
    null
  );
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const tabs: TabType[] = ["Transactions", "Invoices", "Refunds", "Disputes"];

  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleViewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleViewRefundDetails = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setIsRefundModalOpen(true);
  };

  const handleViewDisputeDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsDisputeModalOpen(true);
  };

  const handleApproveRefund = (refund: RefundRequest) => {
    console.log("Approve refund:", refund);
    // Handle approve logic here
  };

  const handleDeclineRefund = (refund: RefundRequest) => {
    console.log("Decline refund:", refund);
    // Handle decline logic here
  };

  const handleResolveDispute = (dispute: Dispute, notes: string) => {
    console.log("Resolve dispute:", dispute, "Notes:", notes);
    // Handle resolve logic here
  };

  const handleRejectDispute = (dispute: Dispute, notes: string) => {
    console.log("Reject dispute:", dispute, "Notes:", notes);
    // Handle reject logic here
  };

  const handleWithdrawalRequest = (amount: string, account: string) => {
    console.log("Withdrawal request:", amount, account);
    // Handle withdrawal logic here
  };

  const handleAddAccount = (account: NewAccount) => {
    console.log("Add account:", account);
    // Handle add account logic here
  };

  const handleEditAccount = (account: WithdrawalAccount) => {
    console.log("Edit account:", account);
    // Handle edit account logic here
  };

  const handleDeleteAccount = (accountId: string) => {
    console.log("Delete account:", accountId);
    // Handle delete account logic here
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Handle page change logic here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Transactions":
        return (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Transaction History
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <TransactionTable
              transactions={mockTransactions}
              onViewDetails={handleViewTransactionDetails}
            />
          </>
        );
      case "Invoices":
        return (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Invoice Management
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <InvoiceTable
              invoices={mockInvoices}
              onViewDetails={handleViewInvoiceDetails}
            />
          </>
        );
      case "Refunds":
        return (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Refund Requests
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <RefundTable
              refunds={mockRefunds}
              onViewDetails={handleViewRefundDetails}
            />
          </>
        );
      case "Disputes":
        return (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Disputes
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <DisputeTable
              disputes={mockDisputes}
              onViewDetails={handleViewDisputeDetails}
            />
          </>
        );
      default:
        return null;
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
      <div className="flex-1 md:ml-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>

                {/* Back Button */}
                <button className="hidden md:flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page Title */}
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Payment & Wallet Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    View platform transactions, invoices, refunds, and manage
                    disputes
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Upgrade now
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-end">
            <button
              onClick={() => setIsManageAccountsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Building2 className="w-4 h-4" />
              Manage Accounts
            </button>
            <button
              onClick={() => setIsWithdrawalModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              Request Withdrawal
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Balance"
              value="$125,000"
              subtitle="Platform wallet"
              icon={Wallet}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
            <StatCard
              title="Available"
              value="$98,500"
              subtitle="Ready for withdrawal"
              icon={CircleDollarSign}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
            <StatCard
              title="Pending"
              value="$8,500"
              subtitle="In processing"
              icon={TrendingUp}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-50"
            />
            <StatCard
              title="Commission Earned"
              value="$26,500"
              subtitle="This month"
              icon={TrendingUp}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-50"
            />
          </div>

          {/* Tabs and Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      {/* All Modals */}
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

      <RefundDetailsModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        refund={selectedRefund}
        onApprove={handleApproveRefund}
        onDecline={handleDeclineRefund}
      />

      <DisputeDetailsModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        dispute={selectedDispute}
        onResolve={handleResolveDispute}
        onReject={handleRejectDispute}
      />

      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        availableBalance="$98,500"
        onSubmit={handleWithdrawalRequest}
      />

      <ManageAccountsModal
        isOpen={isManageAccountsModalOpen}
        onClose={() => setIsManageAccountsModalOpen(false)}
        accounts={mockAccounts}
        onAddAccount={() => {
          setIsManageAccountsModalOpen(false);
          setIsAddAccountModalOpen(true);
        }}
        onEditAccount={handleEditAccount}
        onDeleteAccount={handleDeleteAccount}
      />

      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSubmit={handleAddAccount}
      />
    </div>
  );
}

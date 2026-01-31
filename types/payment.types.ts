// Payment & Wallet Management Types

export interface WalletStats {
  totalBalance: number;
  available: number;
  pending: number;
  commissionEarned: number;
}

export interface RefundRequest {
  id: string;
  refundId: string;
  paymentRef: string;
  requestedBy: string;
  amount: string;
  requestDate: string;
  status: "Requested" | "Approved" | "Processing" | "Declined";
  reason?: string;
  processedDate?: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  type: string;
  amount: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  relatedTo: string;
  description?: string;
  paymentMethod?: string;
}

export interface Invoice {
  id: string;
  invoiceRef: string;
  user: string;
  relatedTo: string;
  amount: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Partially Paid";
  payments: number;
  createdAt: string;
}

export interface Dispute {
  id: string;
  disputeId: string;
  user: string;
  paymentId: string;
  serviceRequestId: string;
  createdDate: string;
  status: "Open" | "Resolved" | "Rejected";
  reason: string;
  resolution?: string;
  resolvedDate?: string;
}

export interface WithdrawalAccount {
  id: string;
  name: string;
  bank: string;
  type: string;
  accountNumber: string;
  isDefault: boolean;
}

export interface NewAccount {
  name: string;
  bank: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  isDefault: boolean;
}

export type TabType = "Transactions" | "Invoices" | "Refunds" | "Disputes";

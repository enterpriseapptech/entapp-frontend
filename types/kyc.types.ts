export interface KYCDocument {
  id: string;
  documentId: string;
  providerName: string;
  providerId: string;
  documentType: string;
  uploadedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  documentUrl?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
}

export type DocumentFilterType = "All" | "Pending" | "Approved" | "Rejected";

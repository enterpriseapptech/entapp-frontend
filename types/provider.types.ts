export interface Provider {
  id: string;
  businessName: string;
  serviceType: string;
  subscription: "Active" | "Expired" | "Pending";
  walletBalance: number;
  kycStatus: "Approved" | "Pending" | "Rejected";
  certification: "Certified" | "Not Certified" | "Pending";
  email: string;
  phone: string;
  registeredDate: string;
  lastActive: string;
}

export interface NewProvider {
  businessName: string;
  serviceType: string;
  email: string;
  phone: string;
  subscription: "Active" | "Expired" | "Pending";
  kycStatus: "Approved" | "Pending" | "Rejected";
  certification: "Certified" | "Not Certified" | "Pending";
}

export interface Fee {
  id: string;
  feeName: string;
  type: string;
  amount: number;
  currency: string;
  status: "Active" | "Inactive";
  lastUpdated: string;
  updatedBy: string;
  description: string;
  createdAt: string;
}

export interface NewFee {
  feeName: string;
  type: string;
  amount: number;
  currency: string;
  description: string;
  status: "Active" | "Inactive";
}

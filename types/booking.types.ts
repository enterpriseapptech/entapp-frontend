export interface Booking {
  id: string;
  bookingId: string;
  bookingType: string;
  customerName: string;
  customerEmail: string;
  dateAndTime: string;
  eventDate: string;
  eventTime: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  paymentStatus: "Paid" | "Unpaid" | "Partial" | "Refunded";
  totalAmount: number;
  paidAmount: number;
  venue: string;
  attendees: number;
  specialRequests?: string;
  createdAt: string;
}

export interface NewBooking {
  bookingType: string;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  attendees: number;
  totalAmount: number;
  specialRequests?: string;
}

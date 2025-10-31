"use client";

import {
  useGetBookingByIdQuery,
  useGetInvoicesByBookingIdQuery,
} from "@/redux/services/book";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/layouts/Footer";
import {
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Zap,
  Building,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import PaymentModal from "@/components/ui/paymentModal";
import SuccessModal from "@/components/ui/SuccessModal";
import { useGetUserByIdQuery } from "@/redux/services/authApi";

export default function QuoteDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Replace useGetQuoteByIdQuery with useGetBookingByIdQuery
  const { data: booking, error, isLoading } = useGetBookingByIdQuery(bookingId);

  // Fetch invoice when booking exists
  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useGetInvoicesByBookingIdQuery(
    { bookingId: bookingId || "", limit: 10, offset: 0 },
    { skip: !bookingId }
  );

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id") || sessionStorage.getItem("user_id")
      : null;
  const { data: currentUser } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });
  const userEmail =
    currentUser?.email ||
    (typeof window !== "undefined"
      ? localStorage.getItem("user_email") ||
        sessionStorage.getItem("user_email") ||
        "customer@example.com"
      : "customer@example.com");

  const handlePaymentSuccess = () => {
    console.log("Payment completed successfully");
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
    // You might want to refetch the invoice data here to update the status
  };

  const handlePaymentError = (error: string) => {
    console.log(error);
  };

  // Check if amount is below minimum for Stripe
  const invoice = invoiceData?.data?.[0];
  const isBelowMinimum = invoice && invoice.amountDue < 100;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The booking you&apos;re looking for doesn&apos;t exist or may have
              been removed.
            </p>
            <Link
              href="/quotes"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Bookings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with back navigation */}
        <div className="mb-6">
          <Link
            href="/quotes"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Link>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Header section */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Booking Details
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Reference: {booking.bookingReference}
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "BOOKED"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "CANCELED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {booking.status === "PENDING" && (
                    <AlertTriangle className="w-4 h-4 mr-1" />
                  )}
                  {booking.status === "BOOKED" && (
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                  )}
                  {booking.status === "CANCELED" && (
                    <XCircle className="w-4 h-4 mr-1" />
                  )}
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Booking Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Booking Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Total Amount
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        ${booking.total}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Service Type
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {booking.serviceType}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <dt className="text-sm font-medium text-gray-500">
                        Created At
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(booking.createdAt).toLocaleString()}
                      </dd>
                    </div>
                  </div>

                  {booking.customerNotes && (
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Customer Notes
                      </h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {booking.customerNotes}
                      </p>
                    </div>
                  )}

                  {booking.serviceNotes && (
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Service Notes
                      </h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {booking.serviceNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Payment Status */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Payment Information
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Subtotal:</span>
                    <span className="text-sm text-gray-900">${booking.subTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Discount:</span>
                    <span className="text-sm text-gray-900">${booking.discount}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm font-medium text-gray-500">Total:</span>
                    <span className="text-sm font-semibold text-gray-900">${booking.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Payment Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.paymentStatus === "PAID" 
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Center Booking Details */}
            {booking.eventCenterBooking && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-500" />
                  Event Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Event Name</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.eventCenterBooking.eventName}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Event Type</h3>
                    <p className="text-sm text-gray-900">
                      {booking.eventCenterBooking.eventType}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Event Theme</h3>
                    <p className="text-sm text-gray-900">
                      {booking.eventCenterBooking.eventTheme}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Number of Guests</h3>
                    <p className="text-sm text-gray-900">
                      {booking.eventCenterBooking.noOfGuest}
                    </p>
                  </div>
                  {booking.eventCenterBooking.description && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {booking.eventCenterBooking.description}
                      </p>
                    </div>
                  )}
                  {booking.eventCenterBooking.specialRequirements.length > 0 && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Special Requirements</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {booking.eventCenterBooking.specialRequirements.map((req, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Requested Time Slots */}
            {booking.requestedTimeSlots?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                  Requested Time Slots
                </h2>

                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Start Time
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          End Time
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Availability
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {booking.requestedTimeSlots.map((slot) => (
                        <tr key={slot.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {new Date(slot.startTime).toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(slot.endTime).toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                slot.isAvailable
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {slot.isAvailable ? "Available" : "Unavailable"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Invoice Section */}
            {bookingId && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Invoice
                </h2>

                {invoiceLoading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                )}

                {invoiceError && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-red-800">
                      Error loading invoice details.
                    </p>
                  </div>
                )}

                {invoice && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Invoice Reference
                        </h3>
                        <p className="text-lg font-semibold text-gray-900">
                          {invoice.invoiceReference}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Amount Due
                        </h3>
                        <p className="text-lg font-semibold text-gray-900">
                          {invoice.amountDue} {invoice.currency}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Status
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {invoice.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Due Date
                        </h3>
                        <p className="text-sm text-gray-900">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Minimum amount warning */}
                    {isBelowMinimum && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-700">
                            Minimum payment amount is 100 Naira. Please contact support to complete your payment.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        disabled={isBelowMinimum || booking.paymentStatus === "PAID"}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          isBelowMinimum || booking.paymentStatus === "PAID"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        }`}
                      >
                        {booking.paymentStatus === "PAID" 
                          ? "Payment Completed" 
                          : isBelowMinimum 
                            ? "Minimum Payment Required: 100 Naira" 
                            : "Make Payment"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {invoice && booking.paymentStatus !== "PAID" && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amountDue={invoice.amountDue}
          invoiceId={invoice.id}
          userId={userId}
          userEmail={currentUser?.email || userEmail}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          bookingDates={[
            booking.requestedTimeSlots?.[0]
              ? new Date(
                  booking.requestedTimeSlots[0].startTime
                ).toLocaleDateString()
              : "",
            booking.requestedTimeSlots?.[0]
              ? new Date(
                  booking.requestedTimeSlots[0].endTime
                ).toLocaleDateString()
              : "",
          ]}
        />
      )}
      <Footer />
    </main>
  );
}
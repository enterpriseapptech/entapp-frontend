"use client";

import {
  useGetQuoteByIdQuery,
  useGetInvoicesByBookingIdQuery,
} from "@/redux/services/quoteApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/layouts/Footer";
import {
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Zap,
  Building,
} from "lucide-react";
import { useState } from "react";
import PaymentModal from "@/components/ui/paymentModal";

export default function QuoteDetailPage() {
  const params = useParams();
  const quoteId = params.id as string;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: quote, error, isLoading } = useGetQuoteByIdQuery(quoteId);

  // Fetch invoice when booking exists
  const bookingId = quote?.booking?.id;
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

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("user_email") ||
        sessionStorage.getItem("user_email")
      : null;

  const handlePaymentSuccess = () => {
    console.log("Payment completed successfully");
    setIsPaymentModalOpen(false);
    // You might want to refetch the invoice data here to update the status
  };

  const handlePaymentError = (error: string) => {
    console.log(error);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (error || !quote) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Quote Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The quote you&apos;re looking for doesn&apos;t exist or may have
              been removed.
            </p>
            <Link
              href="/quotes"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Quotes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const invoice = invoiceData?.data?.[0];

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
                  Quote Details
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Reference: {quote.quoteReference}
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    quote.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : quote.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : quote.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {quote.status === "PENDING" && (
                    <AlertTriangle className="w-4 h-4 mr-1" />
                  )}
                  {quote.status === "APPROVED" && (
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                  )}
                  {quote.status === "REJECTED" && (
                    <XCircle className="w-4 h-4 mr-1" />
                  )}
                  {quote.status}
                </span>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Quote Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Quote Information
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
                        Budget
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        ${quote.budget}
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
                        {quote.serviceType}
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
                        {new Date(quote.createdAt).toLocaleString()}
                      </dd>
                    </div>
                  </div>

                  {quote.customerNotes && (
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Customer Notes
                      </h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {quote.customerNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Billing Address */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  Billing Address
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-900">
                    <div className="font-medium">
                      {quote.billingDetails.street}
                    </div>
                    <div>
                      {quote.billingDetails.city}, {quote.billingDetails.state}{" "}
                      {quote.billingDetails.postal}
                    </div>
                    <div>{quote.billingDetails.country}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requested Time Slots */}
            {quote.requestedTimeSlots?.length > 0 && (
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
                      {quote.requestedTimeSlots.map((slot) => (
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

            {/* Booking Details */}
            {quote.booking && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-500" />
                  Booking Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-blue-800">
                      Booking Reference
                    </dt>
                    <dd className="text-lg font-semibold text-blue-900">
                      {quote.booking.bookingReference}
                    </dd>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-green-800">
                      Total Amount
                    </dt>
                    <dd className="text-lg font-semibold text-green-900">
                      ${quote.booking.total}
                    </dd>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-purple-800">
                      Payment Status
                    </dt>
                    <dd className="text-lg font-semibold text-purple-900">
                      {quote.booking.paymentStatus}
                    </dd>
                  </div>
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
                          {invoice.reference}
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

                    <div className="mt-6">
                      <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Make Payment
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
      {invoice && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amountDue={invoice.amountDue}
          invoiceId={invoice.id}
          userId={userId}
          userEmail={userEmail}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      <Footer />
    </main>
  );
}

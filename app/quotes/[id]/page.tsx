"use client";

import {
  useGetQuoteByIdQuery,
  useGetInvoicesByBookingIdQuery,
} from "@/redux/services/quoteApi";
import { useGetEventCenterByIdQuery } from "@/redux/services/eventsApi";
import { useGetCateringByIdQuery } from "@/redux/services/cateringApi";
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
  AlertCircle,
  Target,
  MapPin,
  CreditCard,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGetUserByIdQuery } from "@/redux/services/authApi";
import QuotePaymentModal from "@/components/ui/QuotePaymentModal";
import BookingQuotesSuceessModal from "@/components/ui/BookingQuotesSuceessModal";

export default function QuoteDetailPage() {
  const params = useParams();
  const quoteId = params.id as string;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
  const [depositPercentage, setDepositPercentage] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);
  // Use the quote query instead of booking
  const {
    data: quote,
    error,
    isLoading,
    refetch,
  } = useGetQuoteByIdQuery(quoteId);

  // Fetch service data for deposit calculation
  const { data: eventCenter } = useGetEventCenterByIdQuery(
    quote?.serviceId || "",
    { skip: !quote || quote.serviceType !== "EVENTCENTER" }
  );

  const { data: catering } = useGetCateringByIdQuery(quote?.serviceId || "", {
    skip: !quote || quote.serviceType !== "CATERING",
  });

  // Calculate deposit amount when quote and service data are available
  useEffect(() => {
    if (quote?.booking) {
      setIsLoadingDeposit(true);

      let depositPercentage = 0;

      if (quote.serviceType === "EVENTCENTER" && eventCenter) {
        depositPercentage = eventCenter.depositPercentage;
      } else if (quote.serviceType === "CATERING" && catering) {
        depositPercentage = catering.depositPercentage;
      }

      setDepositPercentage(depositPercentage);

      // Calculate deposit amount based on booking total
      const totalAmount = Number(quote.booking?.total) || 0;
      const percentage = Number(depositPercentage) || 0;

      const calculatedDeposit = (totalAmount * percentage) / 100;
      setDepositAmount(calculatedDeposit);

      setIsLoadingDeposit(false);
    }
  }, [quote, eventCenter, catering]);

  // Fetch invoice when quote has a booking
  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useGetInvoicesByBookingIdQuery(
    { bookingId: quote?.booking?.id || "", limit: 10, offset: 0 },
    { skip: !quote?.booking?.id }
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

  const handlePaymentSuccess = async () => {
    console.log("Payment completed successfully");
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
    await refetch();
  };

  const handlePaymentError = (error: string) => {
    console.log(error);
  };

  const handlePayNow = (type: "full" | "deposit") => {
    setPaymentType(type);
    setIsPaymentModalOpen(true);
  };

  // Check if amount is below minimum for Stripe
  const invoice = invoiceData?.data?.[0];
  const fullAmount = invoice?.amountDue || 0;
  const isFullBelowMinimum = fullAmount < 100;
  const isDepositBelowMinimum = depositAmount < 100;

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
              <div className="mt-3 sm:mt-0 flex gap-2">
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
                  Quote: {quote.status}
                </span>
                {quote.booking && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      quote.booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : quote.booking.status === "BOOKED"
                        ? "bg-green-100 text-green-800"
                        : quote.booking.status === "CANCELED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {quote.booking.status === "PENDING" && (
                      <AlertTriangle className="w-4 h-4 mr-1" />
                    )}
                    {quote.booking.status === "BOOKED" && (
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                    )}
                    {quote.booking.status === "CANCELED" && (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    Booking: {quote.booking.status}
                  </span>
                )}
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

              {/* Right column - Billing Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-500" />
                  Billing Information
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-500">
                        Address:
                      </span>
                      <p className="text-sm text-gray-900">
                        {quote.billingAddress?.street ||
                          quote.billingDetails?.street}
                        ,{" "}
                        {quote.billingAddress?.city ||
                          quote.billingDetails?.city}
                        ,{" "}
                        {quote.billingAddress?.state ||
                          quote.billingDetails?.state}{" "}
                        {quote.billingAddress?.postal ||
                          quote.billingDetails?.postal}
                      </p>
                      <p className="text-sm text-gray-900">
                        {quote.billingAddress?.country ||
                          quote.billingDetails?.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-500">
                      Service Provider:
                    </span>
                    <span className="text-sm text-gray-900">
                      {quote.serviceProvider}
                    </span>
                  </div>
                </div>

                {/* Policies & Agreements */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Agreements
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                          quote.isTermsAccepted
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {quote.isTermsAccepted ? "✓" : "✗"}
                      </span>
                      <span className="ml-2 text-sm text-gray-700">
                        Terms & Conditions Accepted
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                          quote.isCancellationPolicyAccepted
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {quote.isCancellationPolicyAccepted ? "✓" : "✗"}
                      </span>
                      <span className="ml-2 text-sm text-gray-700">
                        Cancellation Policy Accepted
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                          quote.isLiabilityWaiverSigned
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {quote.isLiabilityWaiverSigned ? "✓" : "✗"}
                      </span>
                      <span className="ml-2 text-sm text-gray-700">
                        Liability Waiver Signed
                      </span>
                    </div>
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

            {/* Booking Information (if quote has been converted to booking) */}
            {quote.booking && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-500" />
                  Booking Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-green-50 p-6 rounded-lg border border-green-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Booking Reference
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {quote.booking.bookingReference}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Payment Status
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        quote.booking.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {quote.booking.paymentStatus}
                    </span>
                  </div>
                  {quote.booking.subTotal && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Subtotal
                      </h3>
                      <p className="text-sm text-gray-900">
                        ${quote.booking.subTotal}
                      </p>
                    </div>
                  )}
                  {quote.booking.discount && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Discount
                      </h3>
                      <p className="text-sm text-gray-900">
                        ${quote.booking.discount}
                      </p>
                    </div>
                  )}
                  {quote.booking.total && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Amount
                      </h3>
                      <p className="text-lg font-semibold text-gray-900">
                        ${quote.booking.total}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Options Section (only if quote has booking and not paid) */}
            {quote.booking && quote.booking.paymentStatus !== "PAID" && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
                  Payment Options
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Payment Option */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pay Full Amount
                        </h3>
                        <p className="text-sm text-gray-600">
                          Secure your booking with full payment
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="text-lg font-bold text-gray-900">
                          ${fullAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {isFullBelowMinimum ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-700">
                            Minimum payment amount is 100 Naira. Please contact
                            support.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePayNow("full")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
                      >
                        Pay Full Amount
                      </button>
                    )}
                  </div>

                  {/* Deposit Payment Option */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pay Deposit
                        </h3>
                        <p className="text-sm text-gray-600">
                          Secure your booking with deposit
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Deposit Amount:
                        </span>
                        {isLoadingDeposit ? (
                          <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                        ) : (
                          <span className="text-lg font-bold text-green-600">
                            ${depositAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Deposit Percentage:
                        </span>
                        <span className="text-sm text-gray-600">
                          {isLoadingDeposit ? (
                            <div className="animate-pulse bg-gray-200 h-3 w-8 rounded"></div>
                          ) : (
                            `${depositPercentage}%`
                          )}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Remaining balance: $
                        {(fullAmount - depositAmount).toLocaleString()}
                      </div>
                    </div>

                    {isLoadingDeposit ? (
                      <div className="w-full bg-gray-400 text-white py-2 px-4 rounded-md font-medium text-center">
                        Calculating...
                      </div>
                    ) : isDepositBelowMinimum ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-700">
                            Deposit amount below minimum. Please pay full amount
                            or contact support.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePayNow("deposit")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
                      >
                        Pay Deposit
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    💡 <strong>Note:</strong> Paying the deposit will secure
                    your booking. The remaining balance will be due before the
                    event date.
                  </p>
                </div>
              </div>
            )}

            {/* Invoice Section (only if quote has booking) */}
            {quote.booking && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Invoice Details
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
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
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
                  </div>
                )}
              </div>
            )}

            {/* Convert to Booking Button (only show for approved quotes without booking) */}
            {quote.status === "APPROVED" && !quote.booking && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Ready to Book?
                      </h3>
                      <p className="text-blue-700">
                        Your quote has been approved! Convert this quote to a
                        booking to secure your dates.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        // Handle convert to booking action
                        console.log("Convert quote to booking:", quote.id);
                      }}
                      className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Convert to Booking
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {invoice && quote.booking && quote.booking.paymentStatus !== "PAID" && (
        <QuotePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amountDue={fullAmount}
          invoiceId={invoice.id}
          userId={userId}
          userEmail={currentUser?.email || userEmail}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          paymentType={paymentType}
          depositPercentage={depositPercentage}
          totalAmount={fullAmount}
        />
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <BookingQuotesSuceessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          bookingDates={[
            quote.requestedTimeSlots?.[0]
              ? new Date(
                  quote.requestedTimeSlots[0].startTime
                ).toLocaleDateString()
              : "",
            quote.requestedTimeSlots?.[0]
              ? new Date(
                  quote.requestedTimeSlots[0].endTime
                ).toLocaleDateString()
              : "",
          ]}
          paymentType={paymentType}
          amountPaid={paymentType === "deposit" ? depositAmount : fullAmount}
        />
      )}

      <Footer />
    </main>
  );
}

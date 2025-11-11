"use client";

import { useGetBookingByIdQuery } from "@/redux/services/book";
import { useGetEventCenterByIdQuery } from "@/redux/services/eventsApi";
import { useGetCateringByIdQuery } from "@/redux/services/cateringApi";
import { useParams } from "next/navigation";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import { useState, useEffect } from "react";
import type { BookingEntity } from "@/redux/services/book";
import BookingPaymentModal from "@/components/ui/BookingPaymentModal";
import { useGetUserByIdQuery } from "@/redux/services/authApi";
import BookingSuccessModal from "@/components/ui/BookingSuccessModal";

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingEntity | null>(
    null
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useGetBookingByIdQuery(bookingId);

  // Fetch deposit percentage based on service type
  const { data: eventCenter } = useGetEventCenterByIdQuery(
    booking?.serviceId || "",
    { skip: !booking || booking.serviceType !== "EVENTCENTER" }
  );

  const { data: catering } = useGetCateringByIdQuery(booking?.serviceId || "", {
    skip: !booking || booking.serviceType !== "CATERING",
  });

  // Calculate deposit amount when booking and service data are available
  useEffect(() => {
    if (booking) {
      setIsLoadingDeposit(true);

      let depositPercentage = 0;

      if (booking.serviceType === "EVENTCENTER" && eventCenter) {
        depositPercentage = eventCenter.depositPercentage;
      } else if (booking.serviceType === "CATERING" && catering) {
        depositPercentage = catering.depositPercentage;
      }

      setDepositPercentage(depositPercentage);

      // Calculate deposit amount
      const calculatedDeposit = (booking.total * depositPercentage) / 100;
      setDepositAmount(calculatedDeposit);
      setIsLoadingDeposit(false);
    }
  }, [booking, eventCenter, catering]);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const accessToken =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    const storedUserId =
      localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    setIsLoggedIn(!!accessToken);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  };
  const firstTimeSlot = booking?.requestedTimeSlots?.[0];
  // Handle payment initiation
  const handlePayNow = (booking: BookingEntity) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    console.log("Payment completed successfully");
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
    await refetch();
    setShowSuccessModal(true);
    // You might want to refetch booking data here to update the status
    // Or show a success message to the user
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.log("Payment error:", error);
    // You can show an error message to the user here
  };

  // Close payment modal
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
  };
  // Fetch user details using the existing RTK Query getUserById endpoint
  const { data: userData } = useGetUserByIdQuery(userId!, { skip: !userId });

  // Email from backend response
  const userEmail = userData?.email ?? "";

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 text-center text-red-500">
              Error loading booking details. Please try again.
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Booking Details
            </h1>
            <p className="text-gray-600">
              Reference: {booking.bookingReference}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Booking Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Service Type
                    </label>
                    <p className="text-gray-900">{booking.serviceType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "BOOKED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "CANCELED"
                          ? "bg-red-100 text-red-800"
                          : booking.status === "RESERVED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Payment Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : booking.paymentStatus === "UNPAID"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.paymentStatus === "GENERATED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Booking Source
                    </label>
                    <p className="text-gray-900">{booking.source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {new Date(booking.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-500">
                  Financial Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Subtotal
                    </label>
                    <p className="text-gray-900">
                      ${booking.subTotal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Discount
                    </label>
                    <p className="text-gray-900">
                      -${booking.discount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Total Amount
                    </label>
                    <p className="text-gray-900 font-semibold">
                      ${booking.total.toLocaleString()}
                    </p>
                  </div>

                  {/* Deposit Information */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-500">
                        Required Deposit
                      </label>
                      {isLoadingDeposit ? (
                        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                      ) : (
                        <p className="text-blue-600 font-semibold">
                          ${depositAmount.toLocaleString()}
                          <span className="text-xs text-gray-500 ml-1">
                            ({depositPercentage}%)
                          </span>
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum payment required to secure your booking
                    </p>
                  </div>

                  {booking.invoice && booking.invoice.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Invoice(s)
                      </label>
                      <p className="text-gray-900">
                        {booking.invoice.length} invoice(s) generated
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Event Details
                </h3>
                {booking.eventCenterBooking && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Event Name
                      </label>
                      <p className="text-gray-900">
                        {booking.eventCenterBooking.eventName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Event Theme
                      </label>
                      <p className="text-gray-900">
                        {booking.eventCenterBooking.eventTheme}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Event Type
                      </label>
                      <p className="text-gray-900">
                        {booking.eventCenterBooking.eventType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Number of Guests
                      </label>
                      <p className="text-gray-900">
                        {booking.eventCenterBooking.noOfGuest}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <p className="text-gray-900">
                        {booking.eventCenterBooking.description}
                      </p>
                    </div>
                    {booking.eventCenterBooking.specialRequirements &&
                      booking.eventCenterBooking.specialRequirements.length >
                        0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Special Requirements
                          </label>
                          <ul className="list-disc list-inside text-gray-900">
                            {booking.eventCenterBooking.specialRequirements.map(
                              (req, index) => (
                                <li key={index}>{req}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
                {booking.cateringBooking && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Number of Guests
                      </label>
                      <p className="text-gray-900">
                        {booking.cateringBooking.guests}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Menu Items
                      </label>
                      {booking.cateringBooking.menuItems &&
                      booking.cateringBooking.menuItems.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-900">
                          {booking.cateringBooking.menuItems.map(
                            (item, index) => (
                              <li key={index}>{item}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-900">
                          No specific menu items selected
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Notes
                      </label>
                      <p className="text-gray-900">
                        {booking.cateringBooking.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Time Slots Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Time Slots
                </h3>
                {booking.requestedTimeSlots &&
                booking.requestedTimeSlots.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">
                      Requested Time Slots
                    </h4>
                    {booking.requestedTimeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Start:</span>{" "}
                          {new Date(slot.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">End:</span>{" "}
                          {new Date(slot.endTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Status:</span>{" "}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                              slot.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {slot.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No time slots requested</p>
                )}

                {booking.confirmedTimeSlots &&
                  booking.confirmedTimeSlots.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <h4 className="font-medium text-gray-700">
                        Confirmed Time Slots
                      </h4>
                      {booking.confirmedTimeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="border border-green-200 bg-green-50 rounded-lg p-3"
                        >
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Start:</span>{" "}
                            {new Date(slot.startTime).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">End:</span>{" "}
                            {new Date(slot.endTime).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Notes and Policies Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Notes
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Service Notes
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {booking.serviceNotes}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Customer Notes
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {booking.customerNotes}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Policies & Agreements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        booking.isTermsAccepted
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.isTermsAccepted ? "✓" : "✗"}
                    </span>
                    <span className="ml-2 text-sm text-gray-700">
                      Terms & Conditions Accepted
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        booking.isCancellationPolicyAccepted
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.isCancellationPolicyAccepted ? "✓" : "✗"}
                    </span>
                    <span className="ml-2 text-sm text-gray-700">
                      Cancellation Policy Accepted
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        booking.isLiabilityWaiverSigned
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.isLiabilityWaiverSigned ? "✓" : "✗"}
                    </span>
                    <span className="ml-2 text-sm text-gray-700">
                      Liability Waiver Signed
                    </span>
                  </div>
                </div>

                {/* Cancellation Info */}
                {booking.canceledAt && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="font-medium text-red-800">
                      Cancellation Information
                    </h4>
                    <p className="text-sm text-red-700">
                      Canceled on:{" "}
                      {new Date(booking.canceledAt).toLocaleDateString()}
                    </p>
                    {booking.cancelationReason && (
                      <p className="text-sm text-red-700">
                        Reason: {booking.cancelationReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                {isLoggedIn === false && (
                  <p className="text-red-500">
                    Please log in to make a payment.
                  </p>
                )}
                {booking.paymentStatus !== "PAID" && (
                  <button
                    onClick={() => handlePayNow(booking)}
                    disabled={isLoadingDeposit}
                    className={`cursor-pointer px-6 py-2 rounded-md transition-colors ${
                      isLoadingDeposit
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isLoadingDeposit ? "Loading..." : "Pay Now"}
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Print Details
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Back to Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Payment Modal */}
      {selectedBooking && (
        <BookingPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          amountDue={Number(selectedBooking.total)}
          depositAmount={depositAmount}
          depositPercentage={depositPercentage}
          invoiceId={selectedBooking.invoice?.[0] ?? ""}
          userId={userId}
          userEmail={userEmail}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        startTime={firstTimeSlot?.startTime}
        endTime={firstTimeSlot?.endTime}
      />
    </main>
  );
}

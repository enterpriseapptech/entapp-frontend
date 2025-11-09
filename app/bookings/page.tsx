"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/layouts/Footer";
import { useGetBookingsByCustomerQuery } from "@/redux/services/book";
import { useGetUserByIdQuery } from "@/redux/services/authApi";
import Link from "next/link";
import Navbar from "@/components/layouts/Navbar";
import { useRouter } from "next/navigation";
import PaymentModal from "../../components/ui/paymentModal";
import type { BookingEntity } from "@/redux/services/book";

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingEntity | null>(
    null
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const limit = 10;
  const offset = (page - 1) * limit;
  const router = useRouter();

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

  // Get user data
  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(
    userId!,
    {
      skip: !userId || !isLoggedIn,
    }
  );

  // Get bookings data
  const {
    data: bookingsData,
    error: bookingsError,
    isLoading: isLoadingBookings,
  } = useGetBookingsByCustomerQuery(
    {
      customerId: userId!,
      limit,
      offset,
    },
    {
      skip: !userId || !isLoggedIn,
    }
  );

  // Handle payment initiation
  const handlePayNow = (booking: BookingEntity) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    console.log("Payment completed successfully");
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
    // You might want to refetch bookings data here to update the status
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

  // Get user email for payment modal
  const userEmail =
    userData?.email ||
    (typeof window !== "undefined"
      ? localStorage.getItem("user_email") ||
        sessionStorage.getItem("user_email") ||
        "customer@example.com"
      : "customer@example.com");

  // Show loading while checking authentication
  if (isLoggedIn === null) {
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

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-gray-600">View and manage all your bookings</p>
            </div>
            <div className="p-6 text-center">
              <div className="text-yellow-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Authentication Required
              </h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view your bookings.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push("/login")}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Show loading state while checking user data
  if (isLoadingUser) {
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-600">View and manage all your bookings</p>
            {userData && (
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {userData.firstName} {userData.lastName}
              </p>
            )}
          </div>

          {isLoadingBookings ? (
            <div className="p-6 flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : bookingsError ? (
            <div className="p-6 text-center text-red-500">
              Error loading bookings. Please try again.
            </div>
          ) : bookingsData && bookingsData.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Booking Reference
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Service Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Event Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Payment Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Booking Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingsData.data.map((booking, index) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          {offset + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.serviceType === "CATERING"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {booking.serviceType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.eventCenterBooking?.eventName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${booking.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/bookings/${booking.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Details
                          </Link>
                          {booking.paymentStatus !== "PAID" && (
                            <button
                              onClick={() => handlePayNow(booking)}
                              className="cursor-pointer text-green-600 hover:text-green-900 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {bookingsData.count > limit && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{offset + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(offset + limit, bookingsData.count)}
                    </span>{" "}
                    of <span className="font-medium">{bookingsData.count}</span>{" "}
                    results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={offset + limit >= bookingsData.count}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No bookings found. Create a booking to get started.
              <div className="mt-4">
                <Link
                  href="/"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors inline-block"
                >
                  Browse Services
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Payment Modal */}
      {selectedBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          amountDue={Number(selectedBooking.amountDue || selectedBooking.total)}
          invoiceId={selectedBooking.id}
          userId={userId}
          userEmail={userEmail}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </main>
  );
}

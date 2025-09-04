"use client";
import { JSX, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetBookingByIdQuery } from "@/redux/services/book";
import Header from "@/components/layouts/Header";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";
import { ArrowLeft, Calendar, Clock, MapPin, User, Mail, Phone, CheckCircle, XCircle, Clock as ClockIcon } from "lucide-react";

export default function BookingDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: booking, isLoading, error } = useGetBookingByIdQuery(bookingId || "", {
    skip: !bookingId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventServiceSideBar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="md:ml-[280px]">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <main className="md:p-10 p-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Loading booking details...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventServiceSideBar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="md:ml-[280px]">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <main className="md:p-10 p-4">
            <div className="flex flex-col justify-center items-center h-64">
              <div className="text-red-600 mb-4">
                Error loading booking details. Please try again.
              </div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Format date and time for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: JSX.Element }> = {
      PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <ClockIcon className="w-4 h-4" />,
      },
      BOOKED: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      CONFIRMED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      CANCELLED: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="w-4 h-4" />,
      },
      COMPLETED: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: <CheckCircle className="w-4 h-4" />,
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: <ClockIcon className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {status}
      </span>
    );
  };

  // Get payment status badge style
  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      PAID: {
        bg: "bg-green-100",
        text: "text-green-800",
      },
      UNPAID: {
        bg: "bg-red-100",
        text: "text-red-800",
      },
      REFUNDED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
      },
      PARTIAL: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EventServiceSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="md:ml-[280px]">
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="md:p-10 p-4">
          {/* Header with back button and actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Bookings</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
            </div>
            {/* <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Edit Booking
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Export Invoice
              </button>
            </div> */}
          </div>

          {/* Booking Reference and Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{booking.bookingReference}</h2>
                <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(booking.status)}
                {getPaymentStatusBadge(booking.paymentStatus)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Booking Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Details Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="font-medium text-gray-900">
                        {booking.createdAt ? formatDate(booking.createdAt) : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">
                        {booking.createdAt ? formatTime(booking.createdAt) : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-gray-900">
                        {booking.serviceType === "EVENTCENTER" ? "Event Center" : "Catering Service"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-medium text-gray-900">Customer Name Placeholder</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">customer@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Card */}
              {(booking.serviceNotes || booking.customerNotes) && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <div className="space-y-4">
                    {booking.serviceNotes && (
                      <div>
                        <p className="text-sm text-gray-500">Service Notes</p>
                        <p className="font-medium text-gray-900">{booking.serviceNotes}</p>
                      </div>
                    )}
                    {booking.customerNotes && (
                      <div>
                        <p className="text-sm text-gray-500">Customer Notes</p>
                        <p className="font-medium text-gray-900">{booking.customerNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Payment & Actions */}
            <div className="space-y-6">
              {/* Payment Summary Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${booking.subTotal?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-${booking.discount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${booking.total?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium">
                      {booking.paymentStatus === "PAID" 
                        ? `$${booking.total?.toFixed(2) || "0.00"}` 
                        : "$0.00"}
                    </span>
                  </div>
                  {booking.paymentStatus === "UNPAID" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Due</span>
                      <span className="font-medium text-red-600">${booking.total?.toFixed(2) || "0.00"}</span>
                    </div>
                  )}
                </div>
                {/* <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Process Payment
                </button> */}
              </div>

              {/* Booking Actions Card */}
              {/* <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Contract
                  </button>
                  <button className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Generate Invoice
                  </button>
                  {booking.status === "PENDING" && (
                    <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Confirm Booking
                    </button>
                  )}
                  {booking.status !== "CANCELLED" && (
                    <button className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div> */}

              {/* Timeline Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-16 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Booking Created</p>
                      <p className="text-xs text-gray-500">
                        {booking.createdAt ? `${formatDate(booking.createdAt)} at ${formatTime(booking.createdAt)}` : "N/A"}
                      </p>
                    </div>
                  </div>

                  {booking.confirmedAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-16 bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Booking Confirmed</p>
                        <p className="text-xs text-gray-500">
                          {`${formatDate(booking.confirmedAt)} at ${formatTime(booking.confirmedAt)}`}
                        </p>
                        {booking.confirmedBy && (
                          <p className="text-xs text-gray-500">By: {booking.confirmedBy}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs text-gray-500">
                          {`${formatDate(booking.updatedAt)} at ${formatTime(booking.updatedAt)}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
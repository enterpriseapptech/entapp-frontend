"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  Menu,
  Plus,
  Upload,
  Search,
  Calendar,
  Users,
  MapPin,
  DollarSign,
} from "lucide-react";
import Sidebar from "@/components/layouts/SideBar";
import BookingTable from "@/components/bookings/BookingTable";
import BookingFilters from "@/components/bookings/BookingFilters";
import AddBookingModal from "@/components/bookings/AddBookingModal";
import BookingDetailsModal from "@/components/bookings/BookingDetailsModal";
import type { Booking, NewBooking } from "@/types/booking.types";

// Mock data for bookings
const mockBookings: Booking[] = [
  {
    id: "1",
    bookingId: "BK-2024-001",
    bookingType: "Wedding",
    customerName: "John & Sarah Miller",
    customerEmail: "john.miller@email.com",
    dateAndTime: "2024-03-15, 6:00 PM",
    eventDate: "2024-03-15",
    eventTime: "18:00",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: 15000,
    paidAmount: 15000,
    venue: "Grand Ballroom",
    attendees: 200,
    specialRequests: "Vegetarian menu required",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    bookingId: "BK-2024-002",
    bookingType: "Corporate Event",
    customerName: "Tech Corp Inc.",
    customerEmail: "events@techcorp.com",
    dateAndTime: "2024-03-20, 2:00 PM",
    eventDate: "2024-03-20",
    eventTime: "14:00",
    status: "Pending",
    paymentStatus: "Partial",
    totalAmount: 8500,
    paidAmount: 4250,
    venue: "Conference Hall A",
    attendees: 150,
    specialRequests: "Audio/Visual equipment needed",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    bookingId: "BK-2024-003",
    bookingType: "Birthday Party",
    customerName: "Emily Thompson",
    customerEmail: "emily.t@email.com",
    dateAndTime: "2024-03-25, 7:00 PM",
    eventDate: "2024-03-25",
    eventTime: "19:00",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: 3500,
    paidAmount: 3500,
    venue: "Garden Terrace",
    attendees: 50,
    specialRequests: "Cake and decorations provided by client",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    bookingId: "BK-2024-004",
    bookingType: "Anniversary",
    customerName: "Robert & Lisa Chen",
    customerEmail: "robert.chen@email.com",
    dateAndTime: "2024-04-05, 8:00 PM",
    eventDate: "2024-04-05",
    eventTime: "20:00",
    status: "Pending",
    paymentStatus: "Unpaid",
    totalAmount: 5000,
    paidAmount: 0,
    venue: "Rooftop Lounge",
    attendees: 75,
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    bookingId: "BK-2024-005",
    bookingType: "Corporate Event",
    customerName: "Finance Solutions Ltd.",
    customerEmail: "admin@financesolutions.com",
    dateAndTime: "2024-04-10, 10:00 AM",
    eventDate: "2024-04-10",
    eventTime: "10:00",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: 12000,
    paidAmount: 12000,
    venue: "Executive Suite",
    attendees: 100,
    specialRequests: "Need projector and screen",
    createdAt: "2024-02-01",
  },
  {
    id: "6",
    bookingId: "BK-2024-006",
    bookingType: "Wedding",
    customerName: "David & Michelle Rodriguez",
    customerEmail: "d.rodriguez@email.com",
    dateAndTime: "2024-04-15, 5:00 PM",
    eventDate: "2024-04-15",
    eventTime: "17:00",
    status: "Cancelled",
    paymentStatus: "Refunded",
    totalAmount: 18000,
    paidAmount: 0,
    venue: "Grand Ballroom",
    attendees: 250,
    specialRequests: "Client cancelled - full refund issued",
    createdAt: "2024-01-05",
  },
  {
    id: "7",
    bookingId: "BK-2024-007",
    bookingType: "Graduation Party",
    customerName: "Amanda Wilson",
    customerEmail: "amanda.w@email.com",
    dateAndTime: "2024-05-20, 6:00 PM",
    eventDate: "2024-05-20",
    eventTime: "18:00",
    status: "Confirmed",
    paymentStatus: "Partial",
    totalAmount: 4000,
    paidAmount: 2000,
    venue: "Garden Terrace",
    attendees: 60,
    createdAt: "2024-02-05",
  },
  {
    id: "8",
    bookingId: "BK-2024-008",
    bookingType: "Corporate Event",
    customerName: "Marketing Pro Agency",
    customerEmail: "events@marketingpro.com",
    dateAndTime: "2024-05-25, 1:00 PM",
    eventDate: "2024-05-25",
    eventTime: "13:00",
    status: "Pending",
    paymentStatus: "Unpaid",
    totalAmount: 6500,
    paidAmount: 0,
    venue: "Conference Hall B",
    attendees: 80,
    specialRequests: "Lunch catering required",
    createdAt: "2024-02-10",
  },
  {
    id: "9",
    bookingId: "BK-2024-009",
    bookingType: "Baby Shower",
    customerName: "Jessica Martinez",
    customerEmail: "jess.martinez@email.com",
    dateAndTime: "2024-06-01, 3:00 PM",
    eventDate: "2024-06-01",
    eventTime: "15:00",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: 2500,
    paidAmount: 2500,
    venue: "Garden Terrace",
    attendees: 40,
    createdAt: "2024-02-15",
  },
  {
    id: "10",
    bookingId: "BK-2024-010",
    bookingType: "Wedding",
    customerName: "Michael & Jennifer Lee",
    customerEmail: "m.lee@email.com",
    dateAndTime: "2024-06-10, 6:00 PM",
    eventDate: "2024-06-10",
    eventTime: "18:00",
    status: "Completed",
    paymentStatus: "Paid",
    totalAmount: 20000,
    paidAmount: 20000,
    venue: "Grand Ballroom",
    attendees: 300,
    specialRequests: "Live band performance",
    createdAt: "2023-12-20",
  },
];

export default function ManageBookingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [isBookingDetailsModalOpen, setIsBookingDetailsModalOpen] =
    useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDetailsModalOpen(true);
  };

  const handleAddBooking = (newBooking: NewBooking) => {
    console.log("Add new booking:", newBooking);
    setIsAddBookingModalOpen(false);
  };

  const handleImport = () => {
    console.log("Import bookings");
    // Handle import logic
  };

  // Filter bookings based on search query
  const filteredBookings = mockBookings.filter(
    (booking) =>
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalBookings = mockBookings.length;
  const confirmedBookings = mockBookings.filter(
    (b) => b.status === "Confirmed"
  ).length;
  const pendingBookings = mockBookings.filter(
    (b) => b.status === "Pending"
  ).length;
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.paidAmount, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>

                {/* Page Title */}
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Welcome back, Jonnuel
                  </h1>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Track, manage and forecast your customers and orders.
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Upgrade now
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Total Bookings
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {totalBookings}
                  </h3>
                  <p className="text-sm text-gray-400">All time bookings</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Confirmed
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {confirmedBookings}
                  </h3>
                  <p className="text-sm text-gray-400">Active bookings</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Pending
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {pendingBookings}
                  </h3>
                  <p className="text-sm text-gray-400">Awaiting confirmation</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <MapPin className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Total Revenue
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    ${totalRevenue.toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-400">Collected payments</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Manage Bookings Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Manage Bookings
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleImport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Import
                  </button>
                  <button
                    onClick={() => setIsAddBookingModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <BookingFilters />
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <BookingTable
              bookings={filteredBookings}
              onViewDetails={handleViewBookingDetails}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddBookingModal
        isOpen={isAddBookingModalOpen}
        onClose={() => setIsAddBookingModalOpen(false)}
        onSubmit={handleAddBooking}
      />

      <BookingDetailsModal
        isOpen={isBookingDetailsModalOpen}
        onClose={() => setIsBookingDetailsModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
}

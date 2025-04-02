"use client";
import Image from "next/image";
import { ChevronUp, ChevronDown, Edit2, Trash2 } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import SideBar from "@/components/layouts/SideBar";
import { useState } from "react";
import Header from "@/components/layouts/Header";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample data for the charts
  const existingUsersData = [
    { value: 3200 },
    { value: 4100 },
    { value: 3800 },
    { value: 5653 },
    { value: 4800 },
    { value: 4100 },
    { value: 3800 },
  ];

  const totalEventsData = [
    { value: 1200 },
    { value: 1300 },
    { value: 1400 },
    { value: 1600 },
    { value: 1500 },
    { value: 1400 },
    { value: 1300 },
  ];

  const totalBookingsData = [
    { value: 54200 },
    { value: 53000 },
    { value: 55000 },
    { value: 52000 },
    { value: 54000 },
    { value: 51000 },
    { value: 54200 },
  ];

  // Expanded recent bookings data to have more entries for pagination
  const recentBookings = [
    {
      id: "BK-10234",
      customer: "Jonnuel Doe",
      service: "Event Center",
      date: "Feb 2, 2025, 5:00 PM",
      status: "Confirmed",
      amount: "$10,000",
    },
    {
      id: "BK-10235",
      customer: "Jane Smith",
      service: "Event Center",
      date: "Feb 3, 2025, 3:00 PM",
      status: "Confirmed",
      amount: "$8,500",
    },
    {
      id: "BK-10236",
      customer: "Robert Johnson",
      service: "Event Center",
      date: "Feb 4, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$12,000",
    },
    {
      id: "BK-10237",
      customer: "Emily Davis",
      service: "Catering",
      date: "Feb 5, 2025, 1:00 PM",
      status: "Confirmed",
      amount: "$5,000",
    },
    {
      id: "BK-10238",
      customer: "Michael Brown",
      service: "Event Center",
      date: "Feb 6, 2025, 4:00 PM",
      status: "Confirmed",
      amount: "$15,000",
    },
    {
      id: "BK-10239",
      customer: "Sarah Wilson",
      service: "Catering",
      date: "Feb 7, 2025, 6:00 PM",
      status: "Confirmed",
      amount: "$7,500",
    },
    {
      id: "BK-10240",
      customer: "David Lee",
      service: "Event Center",
      date: "Feb 8, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$9,000",
    },
    {
      id: "BK-10241",
      customer: "Laura Adams",
      service: "Catering",
      date: "Feb 9, 2025, 3:00 PM",
      status: "Confirmed",
      amount: "$6,000",
    },
    {
      id: "BK-10242",
      customer: "Chris Evans",
      service: "Event Center",
      date: "Feb 10, 2025, 5:00 PM",
      status: "Confirmed",
      amount: "$11,000",
    },
    {
      id: "BK-10243",
      customer: "Anna Taylor",
      service: "Catering",
      date: "Feb 11, 2025, 1:00 PM",
      status: "Confirmed",
      amount: "$4,500",
    },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(recentBookings.length / itemsPerPage);

  // Get the bookings for the current page
  const paginatedBookings = recentBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // If total pages are less than or equal to max visible pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show the first page
      pageNumbers.push(1);

      // Calculate the start and end of the middle range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust the range to always show 3 pages in the middle (if possible)
      if (endPage - startPage < 2) {
        if (startPage === 2) {
          endPage = startPage + 2;
        } else {
          startPage = endPage - 2;
        }
      }

      // Add ellipsis after the first page if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add the middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before the last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show the last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="md:ml-[280px]">
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Dashboard Content */}
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-950">Dashboard</h1>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium">
              <Image
                width={10}
                height={10}
                alt="manageBooking"
                src="/manageBooking.png"
                className="w-5 h-5"
                unoptimized
              />
              <span>Manage Bookings</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {/* Existing Users Card */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Existing Users</p>
                    <h3 className="text-2xl font-bold text-gray-800">5,653</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="flex items-center text-green-500">
                      <ChevronUp className="h-5 w-5" />
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <p className="text-xs text-gray-400">vs last month</p>
                  </div>
                  <div className="flex-1 h-[60px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={existingUsersData}>
                        <Bar
                          dataKey="value"
                          fill="rgba(37, 99, 235, 0.2)"
                          radius={[4, 4, 0, 0]}
                          barSize={10}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Events Card */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Total Events</p>
                    <h3 className="text-2xl font-bold text-gray-800">1,600</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="flex items-center text-green-500">
                      <ChevronUp className="h-5 w-5" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <p className="text-xs text-gray-400">vs last month</p>
                  </div>
                  <div className="flex-1 h-[50px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={totalEventsData}>
                        <Bar
                          dataKey="value"
                          fill="rgba(34, 197, 94, 0.2)"
                          radius={[4, 4, 0, 0]}
                          barSize={10}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Bookings Card */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Total Bookings</p>
                    <h3 className="text-2xl font-bold text-gray-800">54,200</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="flex items-center text-red-500">
                      <ChevronDown className="h-5 w-5" />
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <p className="text-xs text-gray-400">vs last month</p>
                  </div>
                  <div className="flex-1 h-[50px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={totalBookingsData}>
                        <Bar
                          dataKey="value"
                          fill="rgba(234, 179, 8, 0.2)"
                          radius={[4, 4, 0, 0]}
                          barSize={10}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="mt-8">
            <div className="rounded-lg border bg-white shadow">
              <div className="p-6">
                <h2 className="text-md font-semibold text-gray-900">
                  Recent Activities
                </h2>
                <p className="text-xs text-gray-500">
                  List of recent event and catering bookings.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[800px]">
                  <thead>
                    <tr className="border-t">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Booking ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Service Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Date and Time
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBookings.map((booking) => (
                      <tr key={booking.id} className="border-t">
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.customer}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.service}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.date}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.amount}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <div className="flex gap-2">
                            <button className="rounded-lg p-1 hover:bg-gray-100">
                              <Edit2 className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="rounded-lg p-1 hover:bg-gray-100">
                              <Trash2 className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                 
                </table>
              </div>
              {/* Pagination moved outside overflow-x-auto and centered on mobile */}
              <div className="flex justify-between items-center p-4 border-t md:flex-wrap gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1 text-sm text-gray-600 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <Image
                    src="/leftArrow.png"
                    alt="Previous"
                    width={10}
                    height={10}
                    className="w-4 h-4"
                    unoptimized
                  />
                  <span>Previous</span>
                </button>
                <div className="flex gap-2 flex-wrap justify-center">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number" && setCurrentPage(page)
                      }
                      className={`px-3 py-1 rounded-md text-sm ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : typeof page === "number"
                          ? "text-gray-600 hover:bg-gray-100"
                          : "text-gray-600 cursor-default"
                      }`}
                      disabled={typeof page !== "number"}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1 text-sm text-gray-600 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <Image
                    src="/rightArrow.png"
                    alt="Next"
                    width={10}
                    height={10}
                    className="w-4 h-4"
                    unoptimized
                  />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

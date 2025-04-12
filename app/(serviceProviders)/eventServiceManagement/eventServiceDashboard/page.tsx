"use client";
import Image from "next/image";
import { ChevronUp, ChevronDown, Edit2, Trash2 } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";
import Header from "@/components/layouts/Header";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar"; // Updated sidebar component

export default function EventServices() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample data for the charts
  const eventAttendeesData = [
    { value: 3200 },
    { value: 4100 },
    { value: 3800 },
    { value: 5653 },
    { value: 4800 },
    { value: 4100 },
  ];

  const newRegistrationsData = [
    { value: 900 },
    { value: 1300 },
    { value: 1400 },
    { value: 1600 },
    { value: 1500 },
    { value: 1400 },
  ];

  const totalTicketsSoldData = [
    { value: 54200 },
    { value: 51000 },
    { value: 55000 },
    { value: 52000 },
    { value: 54000 },
    { value: 40000 },
  ];

  // Data for Bookings Over Time (Line Chart) - Updated dates to April 10 and 11, 2025
  const bookingsOverTimeData = [
    {
      time: "8:00am",
      date: "Apr 11",
      bookings: 34,
      bookingsPrevious: 24,
      previousDate: "Apr 10",
    },
    {
      time: "9:00am",
      date: "Apr 11",
      bookings: 28,
      bookingsPrevious: 22,
      previousDate: "Apr 10",
    },
    {
      time: "10:00am",
      date: "Apr 11",
      bookings: 40,
      bookingsPrevious: 35,
      previousDate: "Apr 10",
    },
    {
      time: "11:00am",
      date: "Apr 11",
      bookings: 37,
      bookingsPrevious: 30,
      previousDate: "Apr 10",
    },
    {
      time: "12:00pm",
      date: "Apr 11",
      bookings: 45,
      bookingsPrevious: 42,
      previousDate: "Apr 10",
    },
    {
      time: "1:00pm",
      date: "Apr 11",
      bookings: 30,
      bookingsPrevious: 28,
      previousDate: "Apr 10",
    },
  ];

  // Data for Last 7 Days Booking Revenue (Bar Chart) - Updated to ticket sales
  const last7DaysRevenueData = [
    { day: "5", revenue: 500 },
    { day: "6", revenue: 600 },
    { day: "7", revenue: 700 },
    { day: "8", revenue: 800 },
    { day: "9", revenue: 900 },
    { day: "10", revenue: 1000 },
    { day: "11", revenue: 2528 },
  ];

  // Sample event bookings data
  const recentEventBookings = [
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
      service: "Wedding Venue",
      date: "Feb 3, 2025, 3:00 PM",
      status: "Confirmed",
      amount: "$12,000",
    },
    {
      id: "BK-10236",
      customer: "Robert Johnson",
      service: "Conference Hall",
      date: "Feb 4, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$8,000",
    },
    {
      id: "BK-10237",
      customer: "Emily Davis",
      service: "Outdoor Pavilion",
      date: "Feb 5, 2025, 1:00 PM",
      status: "Confirmed",
      amount: "$6,000",
    },
    {
      id: "BK-10238",
      customer: "Michael Brown",
      service: "Event Center",
      date: "Feb 6, 2025, 4:00 PM",
      status: "Confirmed",
      amount: "$10,500",
    },
    {
      id: "BK-10239",
      customer: "Sarah Wilson",
      service: "Wedding Venue",
      date: "Feb 7, 2025, 6:00 PM",
      status: "Confirmed",
      amount: "$15,000",
    },
    {
      id: "BK-10240",
      customer: "David Lee",
      service: "Conference Hall",
      date: "Feb 8, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$9,000",
    },
    {
      id: "BK-10241",
      customer: "Laura Adams",
      service: "Outdoor Pavilion",
      date: "Feb 9, 2025, 3:00 PM",
      status: "Confirmed",
      amount: "$7,000",
    },
    {
      id: "BK-10241",
      customer: "Laura Adams",
      service: "Outdoor Pavilion",
      date: "Feb 9, 2025, 3:00 PM",
      status: "Confirmed",
      amount: "$7,000",
    },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(recentEventBookings.length / itemsPerPage);

  // Get the bookings for the current page
  const paginatedBookings = recentEventBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (endPage - startPage < 2) {
        if (startPage === 2) {
          endPage = startPage + 2;
        } else {
          startPage = endPage - 2;
        }
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <EventServiceSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="md:ml-[280px]">
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Event Services Content */}
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-950">Dashboard</h1>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium">
              <Image
                width={10}
                height={10}
                alt="manageEvents"
                src="/manageBooking.png"
                className="w-5 h-5"
                unoptimized
              />
              <span>Manage Bookings</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {/* Existing Attendees Card */}
            <div className="rounded-lg p-4 bg-white shadow-md w-[320px] mx-auto">
              <div>
                <div className="flex justify-between">
                  <div className="flex flex-col items-center gap-2 w-[30%] whitespace-nowrap">
                    <div>
                      <p className="text-xs text-gray-400">Existing Attendees</p>
                      <h3 className="text-xl font-bold text-gray-800">5.653</h3>
                    </div>
                    <div className="flex items-center text-green-500 mt-4">
                      <span className="text-sm font-medium">22.45%</span>
                      <ChevronUp className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="w-[40%] min-w-0">
                    <ResponsiveContainer width="100%">
                      <BarChart data={eventAttendeesData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
                          {eventAttendeesData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 2 ? "blue" : "rgba(37, 99, 235, 0.2)"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* New Registrations */}
            <div className="rounded-lg p-4 bg-white shadow-md w-[320px] mx-auto">
              <div>
                <div className="flex justify-between">
                  <div className="flex flex-col items-center gap-1 w-[30%] whitespace-nowrap">
                    <div>
                      <p className="text-xs text-gray-400">New Registrations</p>
                      <h3 className="text-xl font-bold text-gray-800">1.650</h3>
                    </div>
                    <div className="flex items-center text-green-500 mt-4">
                      <span className="text-sm font-medium">+15.34%</span>
                      <ChevronUp className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="w-[40%] min-w-0">
                    <ResponsiveContainer width="100%">
                      <BarChart data={newRegistrationsData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
                          {newRegistrationsData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 4 ? "green" : "rgba(34, 197, 94, 0.2)"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Tickets Sold Card */}
            <div className="rounded-lg p-4 bg-white shadow-md w-[320px] mx-auto">
              <div>
                <div className="flex justify-between">
                  <div className="flex flex-col items-center gap-2 w-[30%] whitespace-nowrap">
                    <div>
                      <p className="text-xs text-gray-400">Unique Visits</p>
                      <h3 className="text-xl font-bold text-gray-800">5.420</h3>
                    </div>
                    <div className="flex items-center text-red-500 mt-4">
                      <span className="text-sm font-medium">-10.24%</span>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="w-[40%] min-w-0">
                    <ResponsiveContainer width="100%">
                      <BarChart data={totalTicketsSoldData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
                          {totalTicketsSoldData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 2
                                  ? "#eab308"
                                  : "rgba(234, 179, 8, 0.2)"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="flex md:flex-row flex-col gap-6 mt-8 md:h-[400px] h-auto">
            {/* Bookings Over Time (Line Chart) */}
            <div className="rounded-lg bg-white shadow-md w-[370px] md:w-[800px] mx-auto">
              <div className="flex justify-between p-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">
                    Bookings Over Time
                  </h3>
                  <div className="flex gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-md text-gray-800 font-semibold">645</p>
                      <div className="text-xs text-gray-500">
                        Orders on Apr 11
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-md text-gray-800 font-semibold">472</p>
                      <div className="text-xs text-gray-500">
                        Orders on Apr 10
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-gray-300"></div>
                    <span className="text-xs text-gray-500">Apr 10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-blue-600"></div>
                    <span className="text-xs text-gray-500">Apr 11</span>
                  </div>
                  <select className="p-1 text-sm text-gray-600 border-none focus:outline-none focus:ring-0">
                    <option>Last 12 Hours</option>
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                  </select>
                </div>
              </div>
              <div className="h-[280px] mt-2 p-4 ml-[-40px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingsOverTimeData}>
                    <CartesianGrid
                      strokeDasharray="2"
                      stroke="#e5e7eb"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      stroke="#9ca3af"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const current = payload.find(
                            (p) => p.dataKey === "bookings"
                          );
                          const previous = payload.find(
                            (p) => p.dataKey === "bookingsPrevious"
                          );
                          const date = current?.payload.date;
                          const prevDate = current?.payload.previousDate;
                          const time = current?.payload.time;

                          return (
                            <div
                              style={{
                                backgroundColor: "#000000",
                                border: "none",
                                borderRadius: "4px",
                                padding: "8px",
                              }}
                            >
                              <p
                                style={{
                                  color: "#ffffff",
                                  fontSize: "12px",
                                  margin: 0,
                                }}
                              >
                                {`${current?.value} bookings, ${date}, ${time}`}
                              </p>
                              <p
                                style={{
                                  color: "#ffffff",
                                  fontSize: "12px",
                                  margin: 0,
                                }}
                              >
                                {`${previous?.value} bookings, ${prevDate}, ${time}`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="bookingsPrevious"
                      stroke="#d1d5db"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Last 7 Days Ticket Sales Revenue (Bar Chart) */}
            <div className="rounded-lg bg-white p-4 shadow-md w-[240px]">
              <h3 className="text-sm font-semibold text-gray-800 mb-8 whitespace-nowrap">
                Last 7 Days Ticket Sales
              </h3>
              <p className="text-2xl font-bold text-gray-800">$12,546</p>
              <p className="text-sm text-[#5A607F] mb-1">Revenue</p>
              <hr className="mt-2" />
              <div className="h-[200px] mt-12">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7DaysRevenueData}>
                    <XAxis
                      dataKey="day"
                      stroke="#9ca3af"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#22c55e"
                      radius={[4, 4, 4, 4]}
                      barSize={7}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Event Bookings */}
          <div className="mt-8">
            <div className="rounded-lg border bg-white shadow">
              <div className="p-6">
                <h2 className="text-md font-semibold text-gray-900">
                  Recent Activities
                </h2>
                <p className="text-xs text-gray-500">
                  List of recent event bookings.
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
              {/* Pagination */}
              <div className="flex justify-between items-center p-4 border-t md:flex-wrap gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
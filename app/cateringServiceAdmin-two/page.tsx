"use client";

import { useState } from "react";
import { ChevronUp, Edit2, Trash2, Plus, Filter, Search } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import Header from "@/components/layouts/Header";
import CateringServiceSideBar from "@/components/layouts/CateringServiceSideBar";

export default function CateringServices() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample data for the charts
  const totalBookingsData = [
    { value: 54200 },
    { value: 53000 },
    { value: 55000 },
    { value: 52000 },
    { value: 54000 },
    { value: 51000 },
    { value: 54200 },
  ];

  const revenueData = [
    { value: 12000 },
    { value: 15000 },
    { value: 13000 },
    { value: 16000 },
    { value: 14000 },
    { value: 15000 },
    { value: 13000 },
  ];

  const clientSatisfactionData = [
    { value: 85 },
    { value: 88 },
    { value: 87 },
    { value: 90 },
    { value: 89 },
    { value: 91 },
    { value: 90 },
  ];

  // Bookings over time data
  const bookingsOverTimeData = [
    { time: "4am", may21: 20, may22: 25 },
    { time: "5am", may21: 15, may22: 10 },
    { time: "6am", may21: 18, may22: 15 },
    { time: "7am", may21: 25, may22: 20 },
    { time: "8am", may21: 30, may22: 35 },
    { time: "9am", may21: 28, may22: 30 },
    { time: "10am", may21: 35, may22: 45 },
    { time: "11am", may21: 40, may22: 38 },
    { time: "12pm", may21: 25, may22: 35 },
    { time: "1pm", may21: 38, may22: 32 },
    { time: "2pm", may21: 42, may22: 35 },
    { time: "3pm", may21: 35, may22: 38 },
  ];

  // Weekly revenue data
  const weeklyRevenueData = [
    { day: "12", value: 1200 },
    { day: "13", value: 1500 },
    { day: "14", value: 1800 },
    { day: "15", value: 2000 },
    { day: "16", value: 2200 },
    { day: "17", value: 2500 },
    { day: "18", value: 2525 },
  ];

  const cateringServices = [
    {
      id: "CS-001",
      name: "Wedding Package Premium",
      type: "Wedding",
      price: "$5,000",
      capacity: "200-300",
      status: "Available",
      lastUpdated: "Feb 2, 2025",
    },
    {
      id: "CS-002",
      name: "Corporate Lunch Basic",
      type: "Corporate",
      price: "$25/person",
      capacity: "50-100",
      status: "Available",
      lastUpdated: "Feb 3, 2025",
    },
    {
      id: "CS-003",
      name: "Birthday Party Special",
      type: "Birthday",
      price: "$1,500",
      capacity: "50-75",
      status: "Available",
      lastUpdated: "Feb 4, 2025",
    },
    {
      id: "CS-004",
      name: "Gala Dinner Deluxe",
      type: "Corporate",
      price: "$100/person",
      capacity: "300-500",
      status: "Available",
      lastUpdated: "Feb 5, 2025",
    },
    {
      id: "CS-005",
      name: "Cocktail Reception",
      type: "Corporate",
      price: "$45/person",
      capacity: "100-150",
      status: "Unavailable",
      lastUpdated: "Feb 6, 2025",
    },
    {
      id: "CS-006",
      name: "Wedding Package Basic",
      type: "Wedding",
      price: "$3,500",
      capacity: "100-150",
      status: "Available",
      lastUpdated: "Feb 7, 2025",
    },
    {
      id: "CS-007",
      name: "Holiday Party Package",
      type: "Holiday",
      price: "$2,500",
      capacity: "75-100",
      status: "Available",
      lastUpdated: "Feb 8, 2025",
    },
    {
      id: "CS-008",
      name: "Business Meeting Package",
      type: "Corporate",
      price: "$35/person",
      capacity: "20-30",
      status: "Available",
      lastUpdated: "Feb 9, 2025",
    },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(cateringServices.length / itemsPerPage);

  // Get the services for the current page
  const paginatedServices = cateringServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <CateringServiceSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="md:ml-[280px]">
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-950">DashBoard</h1>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              <Plus className="h-4 w-4" />
              <span>Add New Service</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 mb-8">
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
                    <div className="flex items-center text-green-500">
                      <ChevronUp className="h-5 w-5" />
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <p className="text-xs text-gray-400">vs last month</p>
                  </div>
                  <div className="flex-1 h-[50px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={totalBookingsData}>
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

            {/* Monthly Revenue Card */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Monthly Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-800">$15,600</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="flex items-center text-green-500">
                      <ChevronUp className="h-5 w-5" />
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <p className="text-xs text-gray-400">vs last month</p>
                  </div>
                  <div className="flex-1 h-[50px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
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

            {/* Client Satisfaction Card */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Client Satisfaction</p>
                    <h3 className="text-2xl font-bold text-gray-800">90%</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="flex items-center text-green-500">
                      <ChevronUp className="h-5 w-5" />
                      <span className="text-sm font-medium">2%</span>
                    </div>
                    <p className="text-xs text-gray-400">vs last month</p>
                  </div>
                  <div className="flex-1 h-[50px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientSatisfactionData}>
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

          {/* Bookings Over Time Chart */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4">
                <h3 className="text-sm font-semibold">Bookings Over Time</h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">645</span>
                    <span className="text-sm text-gray-500">Orders on May 22</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">472</span>
                    <span className="text-sm text-gray-500">Orders on May 21</span>
                  </div>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingsOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tickMargin={8}
                    />
                    <Line
                      type="monotone"
                      dataKey="may22"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="may21"
                      stroke="#e5e7eb"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Revenue Chart */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4">
                <h3 className="text-sm font-semibold">Last 7 Days Booking Revenue</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">$12,546</span>
                  <span className="text-sm text-gray-500">Revenue</span>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tickMargin={8}
                    />
                    <Bar
                      dataKey="value"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      className="pl-9 pr-4 py-2 w-full border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm">Filters</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-2 border rounded-lg text-sm text-gray-600">
                    <option value="all">All Types</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate</option>
                    <option value="birthday">Birthday</option>
                    <option value="holiday">Holiday</option>
                  </select>
                  <select className="px-3 py-2 border rounded-lg text-sm text-gray-600">
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[800px]">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      Service ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      Service Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedServices.map((service) => (
                    <tr key={service.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {service.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {service.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {service.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {service.capacity}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            service.status === "Available"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {service.lastUpdated}
                      </td>
                      <td className="px-6 py-4">
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

            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, cateringServices.length)} of{" "}
                {cateringServices.length} services
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
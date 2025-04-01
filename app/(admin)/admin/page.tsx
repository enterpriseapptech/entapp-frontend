// pages/admin/dashboard.tsx
"use client";

import { useState } from "react";
import {
  BarChart,
  Building,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Calendar,
} from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  serviceType: string;
  dateTime: string;
  status: string;
  amount: string;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data for the table
  const bookings: Booking[] = [
    {
      id: "BK-10234",
      customerName: "Jannuel Doe",
      serviceType: "Event Center",
      dateTime: "Feb 15, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$10,000",
    },
    {
      id: "BK-10235",
      customerName: "Jannuel Doe",
      serviceType: "Event Center",
      dateTime: "Feb 15, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$10,000",
    },
    {
      id: "BK-10236",
      customerName: "Jannuel Doe",
      serviceType: "Event Center",
      dateTime: "Feb 15, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$10,000",
    },
    {
      id: "BK-10237",
      customerName: "Jannuel Doe",
      serviceType: "Event Center",
      dateTime: "Feb 15, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$10,000",
    },
    {
      id: "BK-10238",
      customerName: "Jannuel Doe",
      serviceType: "Event Center",
      dateTime: "Feb 15, 2025, 2:00 PM",
      status: "Confirmed",
      amount: "$10,000",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">ET</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">
              ENTAPP TECH
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50"
          >
            <BarChart className="w-5 h-5 mr-2" />
            Overview
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <Building className="w-5 h-5 mr-2" />
            Manage Event Center
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <Building className="w-5 h-5 mr-2" />
            Manage Services
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <Users className="w-5 h-5 mr-2" />
            Manage Users
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Manage Booking
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome back, Jannuel
            </h1>
            <p className="text-sm text-gray-500 ml-2">
              Track, manage, and monitor your centers and orders.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="w-6 h-6" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Dashboard
          </h2>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    5,655
                  </h3>
                  <p className="text-sm text-green-500">+45% vs last month</p>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 h-12 bg-gray-100 rounded"></div> {/* Placeholder for chart */}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    1,600
                  </h3>
                  <p className="text-sm text-green-500">+15% vs last month</p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded flex items-center justify-center">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="mt-4 h-12 bg-gray-100 rounded"></div> {/* Placeholder for chart */}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    $4,200
                  </h3>
                  <p className="text-sm text-red-500">-10% vs last month</p>
                </div>
                <div className="w-16 h-16 bg-orange-100 rounded flex items-center justify-center">
                  <BarChart className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 h-12 bg-gray-100 rounded"></div> {/* Placeholder for chart */}
            </div>
          </div>

          {/* Recent Activities Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 p-4">
              Recent Activities
            </h3>
            <p className="text-sm text-gray-500 p-4 pt-0">
              List of recent events and bookings
            </p>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Names
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date and Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.dateTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex items-center justify-between p-4">
              <button className="text-gray-500 hover:text-gray-700">
                Previous
              </button>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded ${
                      page === 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
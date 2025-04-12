"use client";

import Header from "@/components/layouts/Header";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";

export default function EventCenterDetails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();

  // Retrieve data from query parameters
  const id = searchParams.get("id") || "N/A";
  const name = searchParams.get("name") || "N/A";
  const location = searchParams.get("location") || "N/A";
  const date = searchParams.get("date") || "N/A";
  const status = searchParams.get("status") || "N/A";
  const bookingType = searchParams.get("bookingType") || "N/A";
  const paymentStatus = searchParams.get("paymentStatus") || "N/A";
  const bookingStatus = searchParams.get("bookingStatus") || "N/A"; // Added bookingStatus

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

        {/* Event Center Details Content */}
        <main className="md:p-10 p-4">
          <div>
            <h1 className="md:text-xl text-md font-bold text-gray-950">
             {id}
            </h1>
          </div>

          {/* Details Card */}
          <div className="rounded-lg border bg-white shadow p-6 mt-6">
            <div className="flex justify-between">
              <div className="">
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Booking ID</p>
                  <p className="text-sm font-medium text-gray-900">{id}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Name</p>
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Booking Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {bookingType}
                  </p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Venue/Caterer</p>
                  <p className="text-sm font-medium text-gray-900">
                    {location}
                  </p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Date & Time</p>
                  <p className="text-sm font-medium text-gray-900">{date}</p>
                </div>
                <div className="flex items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Payment Status</p>
                  <p
                    className={`text-sm font-medium ${
                      paymentStatus === "Pending"
                        ? "text-orange-700"
                        : "text-gray-900"
                    }`}
                  >
                    {paymentStatus}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 w-32">Booking Status</p>
                  <p
                    className={`text-sm font-medium ${
                      bookingStatus === "Pending"
                        ? "text-orange-700"
                        : "text-gray-900"
                    }`}
                  >
                    {bookingStatus}
                  </p>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    status === "In Progress"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {status}...
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
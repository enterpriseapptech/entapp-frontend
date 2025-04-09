"use client";
import Header from "@/components/layouts/Header";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CateringServiceSideBar from "@/components/layouts/CateringServiceSideBar";

export default function CateringServiceDetails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();

  // Retrieve data from query parameters
  const id = searchParams.get("id") || "N/A";
  const name = searchParams.get("name") || "N/A";
  const location = searchParams.get("location") || "N/A";
  const date = searchParams.get("date") || "N/A";
  const status = searchParams.get("status") || "N/A";
  const ratings = searchParams.get("ratings") || "N/A";
  const revenue = searchParams.get("revenue") || "N/A";
  const dateAdded = searchParams.get("dateAdded") || "N/A";
  const availability = searchParams.get("availability") || "N/A";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CateringServiceSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="md:ml-[280px]">
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Catering Service Details Content */}
        <main className="md:p-10 p-4">
          <div>
            <h1 className="md:text-xl text-md font-bold text-gray-950">
              {id}
            </h1>
          </div>

          {/* Details Card */}
          <div className="rounded-lg border bg-white shadow p-6 mt-6">
            <div className="flex justify-between">
              <div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Catering ID</p>
                  <p className="text-sm font-medium text-gray-900">{id}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Name</p>
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Location</p>
                  <p className="text-sm font-medium text-gray-900">{location}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Next Booking</p>
                  <p className="text-sm font-medium text-gray-900">{date}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Ratings</p>
                  <p className="text-sm font-medium text-gray-900">{ratings} Star{ratings !== "1" && ratings !== "N/A" ? "s" : ""}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Revenue</p>
                  <p className="text-sm font-medium text-gray-900">{revenue}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Date Added</p>
                  <p className="text-sm font-medium text-gray-900">{dateAdded}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center">
                  <p className="text-sm text-gray-500 w-32">Availability</p>
                  <p
                    className={`text-sm font-medium ${
                      availability === "Available"
                        ? "text-green-700"
                        : availability === "Booked"
                        ? "text-orange-700"
                        : "text-gray-900"
                    }`}
                  >
                    {availability}
                  </p>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    status === "Active"
                      ? "bg-green-50 text-green-700"
                      : status === "Confirmed"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
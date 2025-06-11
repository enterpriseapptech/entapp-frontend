"use client";

import Header from "@/components/layouts/Header";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";
import { Plus, X } from "lucide-react";
import { useGetEventCenterByIdQuery } from "../../../../redux/services/eventsApi";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-50/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-[#0047AB] border-gray-200 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700">Loading Event Center Details...</p>
      </div>
    </div>
  );
};

export default function EventCenterDetails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  // Retrieve event center ID from query parameters
  const id = searchParams.get("id") || "";

  // Fetch event center details
  const { data: eventCenter, isLoading, error } = useGetEventCenterByIdQuery(id, {
    skip: !id,
  });

  // Handle loading and error states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !eventCenter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Error loading event center details. Please try again.</p>
      </div>
    );
  }

  // Format date for display
  const formattedDate = new Date(eventCenter.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Format amenities as comma-separated string
  const formattedAmenities = eventCenter.amenities.join(", ");

  // Format images as comma-separated URLs
  const formattedImages = eventCenter.images.join(", ");

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
            <h1 className="md:text-xl text-md font-bold text-gray-950">{eventCenter.id}</h1>
          </div>

          {/* Details Card */}
          <div className="rounded-lg border bg-white shadow p-6 mt-6">
            <div className="flex justify-between">
              <div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Event Center ID</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.id}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Name</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.description.split(" ")[0]} Center</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Description</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.description}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Venue Layout</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.venueLayout}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Location</p>
                  <p className="text-sm font-medium text-gray-900">{`${eventCenter.city}, ${eventCenter.state}`}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Street Address</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.streetAddress}{eventCenter.streetAddress2 ? `, ${eventCenter.streetAddress2}` : ""}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Postal Code</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.postal}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Country</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.country}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Created At</p>
                  <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Deposit Amount</p>
                  <p className="text-sm font-medium text-gray-900">${eventCenter.depositAmount.toLocaleString()}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Pricing Per Slot</p>
                  <p className="text-sm font-medium text-gray-900">${eventCenter.pricingPerSlot.toFixed(2)}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Sitting Capacity</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.sittingCapacity}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Amenities</p>
                  <p className="text-sm font-medium text-gray-900">{formattedAmenities}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Images</p>
                  <p className="text-sm font-medium text-gray-900">{formattedImages}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Terms of Use</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.termsOfUse}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Cancellation Policy</p>
                  <p className="text-sm font-medium text-gray-900">{eventCenter.cancellationPolicy}</p>
                </div>
                <div className="flex items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Payment Status</p>
                  <p
                    className={`text-sm font-medium ${
                      eventCenter.paymentRequired ? "text-orange-700" : "text-gray-900"
                    }`}
                  >
                    {eventCenter.paymentRequired ? "Pending" : "Paid"}
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Status</p>
                  <p
                    className={`text-sm font-medium ${
                      eventCenter.status === "ACTIVE" ? "text-gray-900" : "text-orange-700"
                    }`}
                  >
                    {eventCenter.status}
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center rounded-md border border-[#0047AB] px-3 py-1 text-sm font-medium text-[#0047AB] hover:bg-blue-50 focus:outline-none"
                >
                  <Plus className="mr-1 h-4 w-4 text-[#0047AB]" />
                  Create Timeslot
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20">
          <div className="mx-8 bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Timeslot</h2>

            {/* Modal Content */}
            <div className="space-y-4">
              {/* Hall/Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hall / Day
                </label>
                <select className="text-gray-400 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Days
                </label>
                <div className="flex gap-2 flex-wrap">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                    (day) => (
                      <label key={day} className="flex items-center">
                        <input type="checkbox" className="mr-1" />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Start Date and End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="text-gray-400 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    defaultValue="2024-08-23"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="text-gray-400 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    defaultValue="2024-08-23"
                  />
                </div>
              </div>

              {/* Start Time and End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="text-gray-400 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    defaultValue="15:30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="text-gray-400 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    defaultValue="11:00"
                  />
                </div>
              </div>

              {/* Buffer Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buffer Time
                </label>
                <select className="text-gray-400 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>30 mins</option>
                  <option>15 mins</option>
                  <option>45 mins</option>
                  <option>1 hour</option>
                </select>
              </div>

              {/* Available Employees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Employees
                </label>
                <input
                  type="number"
                  defaultValue="8"
                  className="text-gray-400 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Auto Repeat */}
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">
                  Auto repeat
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  <span className="ml-2 text-sm text-gray-700">YES</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

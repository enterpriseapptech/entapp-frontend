"use client";
import Header from "@/components/layouts/Header";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CateringServiceSideBar from "@/components/layouts/CateringServiceSideBar";
import { Plus, X } from "lucide-react";
import { useGetCateringByIdQuery } from "../../../../redux/services/cateringApi";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-50/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-[#0047AB] border-gray-200 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Loading Catering Service Details...
        </p>
      </div>
    </div>
  );
};

export default function CateringServiceDetails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  // Retrieve catering service ID from query parameters
  const id = searchParams.get("id") || "";

  // Fetch catering service details
  const { data: cateringService, isLoading, error } = useGetCateringByIdQuery(id, {
    skip: !id,
  });

  // Handle loading and error states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !cateringService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Error loading catering service details. Please try again.</p>
      </div>
    );
  }

  // Format date for display
  const formattedDate = new Date(cateringService.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Format dish types, cuisine, and images as comma-separated strings
  const formattedDishTypes = cateringService.dishTypes.join(", ");
  const formattedCuisine = cateringService.cuisine.join(", ");
  const formattedImages = cateringService.images.join(", ");

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
            <h1 className="md:text-xl text-md font-bold text-gray-950">{cateringService.id}</h1>
          </div>

          {/* Details Card */}
          <div className="rounded-lg border bg-white shadow p-6 mt-6">
            <div className="flex justify-between">
              <div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Catering ID</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.id}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Name</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.tagLine}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Description</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.description}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Location</p>
                  <p className="text-sm font-medium text-gray-900">{`${cateringService.city}, ${cateringService.state}`}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Street Address</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.streetAddress}{cateringService.streetAddress2 ? `, ${cateringService.streetAddress2}` : ""}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Postal Code</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.postal}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Country</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.country}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Created At</p>
                  <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Deposit Amount</p>
                  <p className="text-sm font-medium text-gray-900">${cateringService.depositAmount.toLocaleString()}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Start Price</p>
                  <p className="text-sm font-medium text-gray-900">${cateringService.startPrice.toFixed(2)}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Min Capacity</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.minCapacity}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Max Capacity</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.maxCapacity}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Dish Types</p>
                  <p className="text-sm font-medium text-gray-900">{formattedDishTypes}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Cuisine</p>
                  <p className="text-sm font-medium text-gray-900">{formattedCuisine}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Images</p>
                  <p className="text-sm font-medium text-gray-900">{formattedImages}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Terms Of Service</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.termsOfUse}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Cancellation Policy</p>
                  <p className="text-sm font-medium text-gray-900">{cateringService.cancellationPolicy}</p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Payment Status</p>
                  <p
                    className={`text-sm font-medium ${
                      cateringService.paymentRequired ? "text-orange-600" : "text-gray-900"
                    }`}
                  >
                    {cateringService.paymentRequired ? "Pending" : "Paid"}
                  </p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center mb-4">
                  <p className="text-sm text-gray-500 w-32">Status</p>
                  <p
                    className={`text-sm font-medium ${
                      cateringService.status === "ACTIVE" ? "text-green-700" : "text-orange-600"
                    }`}
                  >
                    {cateringService.status}
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center rounded-md border border-[#0047AB] px-3 py-2 text-sm font-medium text-[#0047AB] hover:bg-blue-50 focus:outline-none"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Timeslot
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[80vh] overflow-y-auto">
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
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Full Service</option>
                    <option>Buffet</option>
                    <option>Drop-off</option>
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue="2025-06-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue="2025-06-11"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue="09:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue="17:00"
                    />
                  </div>
                </div>

                {/* Buffer Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buffer Time
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>30 mins</option>
                    <option>15 mins</option>
                    <option>45 mins</option>
                    <option>1 hour</option>
                  </select>
                </div>

                {/* Available Staff */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Staff
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
    </div>
  );
}
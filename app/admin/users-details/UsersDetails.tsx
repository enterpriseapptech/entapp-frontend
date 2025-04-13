"use client";
import SideBar from "@/components/layouts/SideBar";
import Header from "@/components/layouts/Header";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function UsersDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Extract booking data from query parameters
  const booking = {
    fullName: searchParams.get("fullName") || "N/A",
    email: searchParams.get("email") || "N/A",
    phoneNumber: searchParams.get("phoneNumber") || "N/A",
    profileStatus: searchParams.get("profileStatus") || "N/A",
    role: searchParams.get("role") || "N/A",
    created: searchParams.get("created") || "N/A",
    ratings: searchParams.get("ratings") || "N/A",
  };

  // Sample additional data to match the UI in the image
  const details = {
    eventCenterName: "Loko Event Center Hall",
    location: "Abuja Continental Hotel",
    address: "Herbert Macurly",
    contactDetails: `+${booking.phoneNumber}`,
    email: booking.email,
    capacity: "500",
    eventType: ["African", "Nigerian"],
    amenities: ["Hall", "AC", "Swimming Pool"],
    description:
      "For the Manage Bookings section in the Admin Dashboard of your event hall booking web application, the admin should have full control over event bookings and catering service orders. Here's the key information and actions the admin should have access to",
    availability: "mon - sat",
    image: "eventbanner.png",
    pricePerDay: "$200",
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

        {/* Booking Details Content */}
        <main className="md:p-10 p-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <Link href="/admin/manage-users">Manage User</Link>
            <span>{">"}</span>
            <span>User ID</span>
          </div>

          {/* Title, Email, and Status */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col gap-1">
                <h1 className="md:text-xl text-sm font-bold text-gray-900 uppercase">
                  {details.eventCenterName}
                </h1>
                <p className="text-sm text-gray-600">{details.email}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase ${
                  booking.ratings === "Pending"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {booking.ratings === "Pending" ? "Waiting For Approval" : booking.ratings}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 gap-4">
              {/* Event Center Name */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Event Center Name
                </h2>
                <p className="text-sm text-gray-900">{details.eventCenterName}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Location
                </h2>
                <p className="text-sm text-gray-900">{details.location}</p>
              </div>

              {/* Address */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Address
                </h2>
                <p className="text-sm text-gray-900">{details.address}</p>
              </div>

              {/* Contact Details */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Contact Details
                </h2>
                <p className="text-sm text-gray-900">{details.contactDetails}</p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Email
                </h2>
                <p className="text-sm text-gray-900">{details.email}</p>
              </div>

              {/* Capacity */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Capacity
                </h2>
                <p className="text-sm text-gray-900">{details.capacity}</p>
              </div>

              {/* Event Type */}
              <div className="flex items-start gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Event Type
                </h2>
                <div className="flex gap-2">
                  {details.eventType.map((type, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="flex items-start gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Amenities
                </h2>
                <div className="flex gap-2">
                  {details.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Availability
                </h2>
                <p className="text-sm text-gray-900">{details.availability}</p>
              </div>

              {/* Description */}
              <div className="flex items-start gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Description
                </h2>
                <p className="text-sm text-gray-900 w-[50%]">{details.description}</p>
              </div>

              {/* Image */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Image
                </h2>
                <div className="flex gap-2 items-center">
                  <Image
                    src={`/${details.image}`}
                    alt="Event Banner"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded"
                    unoptimized
                  />
                  <a
                    href={`/${details.image}`}
                    className="text-blue-600 underline text-sm"
                  >
                    View Document
                  </a>
                </div>
              </div>

              {/* Price Per Day */}
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-sm font-medium text-gray-500 w-32">
                  Price Per Day
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-900 font-semibold">
                    {details.pricePerDay}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => router.push("/admin/manage-users")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                Decline
              </button>
              <button
                onClick={() => console.log("Approve booking")}
                className="px-6 py-2 bg-[#0047AB] text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Approve
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
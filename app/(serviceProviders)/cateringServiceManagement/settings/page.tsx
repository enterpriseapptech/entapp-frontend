"use client";
import { useEffect, useState } from "react";
import Header from "@/components/layouts/Header";
import Image from "next/image";
import ServiceProviderSideBar from "@/components/layouts/ServiceProviderSideBar";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/redux/services/authApi";
import { useGetCountriesQuery, useGetStatesQuery } from "@/redux/services/adminApi";
import { Loader2 } from "lucide-react";
import Notification from "@/components/ui/Notification";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("GMT +02:00");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [location, setLocation] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const userId = typeof window !== "undefined" ? (localStorage.getItem("user_id") || sessionStorage.getItem("user_id")) : null;

  const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(userId as string, {
    skip: !userId,
  });

  const { data: countriesData } = useGetCountriesQuery({ limit: 100, offset: 0 });
  const { data: statesData } = useGetStatesQuery({ limit: 100, offset: 0 });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setEmail(userData.email || "");
      setCountry(userData.country || "");
      setState(userData.state || "");
      setLocation(userData.location || "");
    }
  }, [userData]);


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await updateUser({
        id: userId,
        body: {
          firstName,
          lastName,
          country,
          state,
          location,
          status: "ACTIVE", // As per requirement
        },
      }).unwrap();
      setNotification({ message: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setNotification({ message: "Failed to update profile.", type: "error" });
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Sidebar */}
      <ServiceProviderSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="md:ml-[280px]">
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Settings Content */}
        <main className="md:p-10 p-4">
            <h1 className="md:text-xl text-md font-bold text-gray-950 mb-6">
              Settings
            </h1>

          {/* Profile Header (Outside the white card) */}
          <div className="flex items-center mb-6 relative">
            <div className="ml-4">
              <h2 className="text-md font-bold text-gray-900">
                {firstName} {lastName}
              </h2>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>

          {/* Profile Details Form (Inside the white card) */}
          <div className="rounded-lg border bg-white shadow p-6">
            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-2 border-b pb-2 border-gray-100">
                Profile
              </h3>
              <h4 className="text-md font-semibold text-gray-900 mb-2 pt-2">
                Profile Details
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Enter your profile information
              </p>

              <form onSubmit={handleSubmit}>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="text-gray-300 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="text-gray-300 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Country and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="text-gray-900 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Country</option>
                      {countriesData?.docs?.map((c: any) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="text-gray-900 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      {statesData?.docs?.map((s: any) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-gray-900 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your location"
                  />
                </div>

                {/* Regional Settings */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-1">
                    Regional Settings
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold mb-4">Set your language and timezone</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-gray-300 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="GMT +02:00">GMT +02:00</option>
                        <option value="GMT +00:00">GMT +00:00</option>
                        <option value="GMT -05:00">GMT -05:00</option>
                        <option value="GMT +08:00">GMT +08:00</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#0047AB] text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Header from "@/components/layouts/Header";
import Image from "next/image";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Livia");
  const [lastName, setLastName] = useState("Rhye");
  const [email, setEmail] = useState("ayobami@entapp.com");
  const [phone, setPhone] = useState("+2349182738475");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("GMT +02:00");

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      email,
      phone,
      language,
      timezone,
      profileImage,
    });
    // Add logic to save the updated profile details (e.g., API call)
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

        {/* Settings Content */}
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="md:text-xl text-md font-bold text-gray-950">
              Settings
            </h1>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium">
                <Image
                  width={10}
                  height={10}
                  alt="import"
                  src="/import.png"
                  className="w-5 h-5"
                  unoptimized
                />
                <span>Import</span>
              </button>
              <button className="flex items-center gap-3 px-5 py-1.5 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 text-sm font-medium cursor-pointer">
                <Image
                  width={10}
                  height={10}
                  alt="add"
                  src="/add.png"
                  className="w-4 h-4"
                  unoptimized
                />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Blue Background Card */}
          <div className="w-full h-40 bg-[#1E5EFF] rounded-lg mb-4"></div>

          {/* Profile Header (Outside the white card) */}
          <div className="flex items-center mb-6 relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center ml-4 absolute -top-14">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                  unoptimized
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <div className="ml-30 mt-[-4px]">
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
                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Images
                  </label>
                  <div className="gap-2 flex flex-col border-2 border-dashed border-gray-300 rounded-lg p-6 justify-center items-center">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-[#0047AB] text-white px-8 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                            src="/upload.png"
                            alt="upload.png"
                            width={20}
                            height={20}
                            className="w-4 h-4"
                            unoptimized
                        />
                        <span>Upload</span>
                      </div> 
                      
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <span className="ml-2 text-sm text-gray-500">
                      Or drag and drop files
                    </span>
                  </div>
                </div>

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

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-gray-300 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-gray-300 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone"
                    />
                  </div>
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
                    className="bg-[#0047AB] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
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

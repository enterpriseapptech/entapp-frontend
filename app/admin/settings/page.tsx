"use client";
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Menu,
  Globe,
  DollarSign,
  Shield,
  Eye,
  User,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/layouts/SideBar";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/redux/services/authApi";
import {
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
} from "@/redux/services/adminApi";
import Notification from "@/components/ui/Notification";

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    platformName: "Event & Catering Platform",
    supportEmail: "support@platform.com",
    serviceCharge: "5.5",
    commissionRate: "10",
    kycMethod: "",
    certifiedUserVisibility: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    state: "",
    location: "",
  });

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

  const { data: appSettings, isLoading: isAppSettingsLoading } = useGetAppSettingsQuery();
  const [updateAppSettings, { isLoading: isUpdatingAppSettings }] = useUpdateAppSettingsMutation();

  const [updateUser, { isLoading: isUpdatingProfile }] = useUpdateUserMutation();

  useEffect(() => {
    if (userData) {
      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        country: userData.country || "",
        state: userData.state || "",
        location: userData.location || "",
      });
    }
  }, [userData]);

  useEffect(() => {
    if (appSettings) {
      setFormData({
        ...formData,
        serviceCharge: appSettings.serviceCharge.toString(),
        kycMethod: appSettings.kycMethod,
        emailNotifications: appSettings.notifyOnRequest, // Mapping notifyOnRequest to emailNotifications for now
        certifiedUserVisibility: appSettings.visibleToCertifiedOnly,
        smsNotifications: appSettings.notifyCertifiedOnly, // Mapping notifyCertifiedOnly to smsNotifications for now
      });
    }
  }, [appSettings]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await updateUser({
        id: userId,
        body: {
          ...profileData,
          status: "ACTIVE",
        },
      }).unwrap();
      setNotification({ message: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setNotification({ message: "Failed to update profile.", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAppSettings({
        serviceCharge: parseFloat(formData.serviceCharge),
        notifyOnRequest: formData.emailNotifications,
        notifyCertifiedOnly: formData.smsNotifications,
        visibleToCertifiedOnly: formData.certifiedUserVisibility,
      }).unwrap();
      setNotification({ message: "App settings updated successfully!", type: "success" });
    } catch (error) {
      setNotification({ message: "Failed to update app settings.", type: "error" });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  if (isUserLoading || isAppSettingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>

                {/* Back Button */}
                <button className="hidden md:flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page Title */}
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    App Settings
                  </h1>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Configure global platform settings and preferences
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Upgrade now
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <SettingsIcon className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
          {/* Last Updated Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-blue-800">
              Last updated: 2025-01-15 by Admin
            </p>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Settings
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmitProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={profileData.country}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    name="state"
                    value={profileData.state}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter your location"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Platform Settings */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    General Platform Settings
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    name="platformName"
                    value={formData.platformName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Financial Settings */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Financial Settings
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Charge (Platform Fee %)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="serviceCharge"
                      value={formData.serviceCharge}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Platform fee charged on each transaction
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="commissionRate"
                      value={formData.commissionRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Commission earned from service providers
                  </p>
                </div>
              </div>
            </div>

            {/* KYC & Security Settings */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    KYC & Security Settings
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KYC Verification Method
                  </label>
                  <select
                    name="kycMethod"
                    value={formData.kycMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="" className="text-gray-400">
                      Select method
                    </option>
                    <option value="manual">Manual</option>
                    <option value="automated">Automated</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Admin must manually approve or reject each KYC submission
                  </p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Certified User Visibility
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Show only certified users in public listings
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="certifiedUserVisibility"
                      checked={formData.certifiedUserVisibility}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Notification Settings
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Email Notifications
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Send email notifications for platform events
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      SMS Notifications
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Send SMS notifications for critical events
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Current Configuration Summary */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Current Configuration Summary
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Platform Name
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formData.platformName}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Service Charge
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formData.serviceCharge}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Commission Rate
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formData.commissionRate}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-1">KYC Method</p>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                        {formData.kycMethod || "Manual"}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Email Notifications
                      </p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          formData.emailNotifications
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formData.emailNotifications ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        SMS Notifications
                      </p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          formData.smsNotifications
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formData.smsNotifications ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingAppSettings}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {isUpdatingAppSettings ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

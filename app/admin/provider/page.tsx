"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  Wallet,
  Settings,
  Bell,
  Download,
  Menu,
} from "lucide-react";
import Sidebar from "@/components/layouts/SideBar";
import StatCard from "@/components/providers/StatCard";
import ProviderTable from "@/components/providers/ProviderTable";
import Pagination from "@/components/providers/Pagination";
import ProviderDetailsModal from "@/components/providers/ProviderDetailsModal";
import type { Provider } from "@/types/provider.types";

// Mock data for providers
const mockProviders: Provider[] = [
  {
    id: "1",
    businessName: "Grand Ballroom Hall",
    serviceType: "Event Center",
    subscription: "Active",
    walletBalance: 12500,
    kycStatus: "Approved",
    certification: "Certified",
    email: "john@grandballroom.com",
    phone: "+1 234 567 8900",
    registeredDate: "2024-01-15",
    lastActive: "2025-02-05",
  },
  {
    id: "2",
    businessName: "Gourmet Delights Catering",
    serviceType: "Catering",
    subscription: "Active",
    walletBalance: 8300,
    kycStatus: "Approved",
    certification: "Certified",
    email: "info@gourmetdelights.com",
    phone: "+1 234 567 8901",
    registeredDate: "2024-02-20",
    lastActive: "2025-02-04",
  },
  {
    id: "3",
    businessName: "Downtown Event Space",
    serviceType: "Event Center",
    subscription: "Expired",
    walletBalance: 4200,
    kycStatus: "Pending",
    certification: "Not Certified",
    email: "contact@downtownevents.com",
    phone: "+1 234 567 8902",
    registeredDate: "2024-03-10",
    lastActive: "2025-01-28",
  },
  {
    id: "4",
    businessName: "Elite Photography Services",
    serviceType: "Photography",
    subscription: "Active",
    walletBalance: 15600,
    kycStatus: "Approved",
    certification: "Certified",
    email: "hello@elitephoto.com",
    phone: "+1 234 567 8903",
    registeredDate: "2024-01-05",
    lastActive: "2025-02-05",
  },
  {
    id: "5",
    businessName: "Perfect Sound Audio",
    serviceType: "Audio/Visual",
    subscription: "Pending",
    walletBalance: 2800,
    kycStatus: "Pending",
    certification: "Pending",
    email: "info@perfectsound.com",
    phone: "+1 234 567 8904",
    registeredDate: "2025-01-20",
    lastActive: "2025-02-03",
  },
];

export default function ServiceProvidersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // Modal states
  const [isProviderDetailsModalOpen, setIsProviderDetailsModalOpen] =
    useState(false);

  // Selected provider state
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const handleViewDetails = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsProviderDetailsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Handle page change logic here
  };

  // Calculate stats
  const totalProviders = mockProviders.length;
  const activeProviders = mockProviders.filter(
    (p) => p.subscription === "Active"
  ).length;
  const totalWalletBalance = mockProviders.reduce(
    (sum, p) => sum + p.walletBalance,
    0
  );

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
                    Service Providers
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    View and manage service provider accounts
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Upgrade now
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-400" />
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Providers"
              value={totalProviders.toString()}
              subtitle="All registered providers"
              icon={Users}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
            <StatCard
              title="Active Providers"
              value={activeProviders.toString()}
              subtitle="With active subscriptions"
              icon={TrendingUp}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
            <StatCard
              title="Total Wallet Balance"
              value={`$${totalWalletBalance.toLocaleString()}`}
              subtitle="Combined provider wallets"
              icon={Wallet}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-50"
            />
          </div>

          {/* Providers Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                All Service Providers
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Provider Table */}
            <ProviderTable
              providers={mockProviders}
              onViewDetails={handleViewDetails}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      {/* Provider Details Modal */}
      <ProviderDetailsModal
        isOpen={isProviderDetailsModalOpen}
        onClose={() => setIsProviderDetailsModalOpen(false)}
        provider={selectedProvider}
      />
    </div>
  );
}

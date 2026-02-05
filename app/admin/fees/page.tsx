"use client";

import { useState } from "react";
import {
  DollarSign,
  Settings,
  Bell,
  Download,
  Menu,
  Plus,
  TrendingUp,
  CreditCard,
  Shield,
} from "lucide-react";
import Sidebar from "@/components/layouts/SideBar";
import StatCard from "@/components/fees/StatCard";
import FeeTable from "@/components/fees/FeeTable";
import Pagination from "@/components/fees/Pagination";
import AddFeeModal from "@/components/fees/AddFeeModal";
import EditFeeModal from "@/components/fees/EditFeeModal";
import DeleteFeeModal from "@/components/fees/DeleteFeeModal";
import FeeDetailsModal from "@/components/fees/FeeDetailsModal";

import type { Fee, NewFee } from "@/types/fee.types";

// Mock data for fees
const mockFees: Fee[] = [
  {
    id: "1",
    feeName: "KYC Verification Fee",
    type: "KYC",
    amount: 25.0,
    currency: "USD",
    status: "Active",
    lastUpdated: "2024-01-01",
    updatedBy: "Admin",
    description: "One-time fee for KYC document verification",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    feeName: "Certification Fee",
    type: "Certification",
    amount: 50.0,
    currency: "USD",
    status: "Active",
    lastUpdated: "2024-06-15",
    updatedBy: "Admin",
    description: "Certification charges",
    createdAt: "2024-06-15",
  },
  {
    id: "3",
    feeName: "Premium Listing Fee",
    type: "Listing",
    amount: 99.0,
    currency: "USD",
    status: "Active",
    lastUpdated: "2024-03-10",
    updatedBy: "Admin",
    description: "Monthly fee for premium venue listing",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    feeName: "Background Check Fee",
    type: "Verification",
    amount: 35.0,
    currency: "USD",
    status: "Inactive",
    lastUpdated: "2023-12-01",
    updatedBy: "Admin",
    description: "Fee for conducting background verification",
    createdAt: "2023-11-15",
  },
];

export default function FeesManagementPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // Modal states
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState(false);
  const [isEditFeeModalOpen, setIsEditFeeModalOpen] = useState(false);
  const [isDeleteFeeModalOpen, setIsDeleteFeeModalOpen] = useState(false);
  const [isFeeDetailsModalOpen, setIsFeeDetailsModalOpen] = useState(false);

  // Selected fee state
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

  const handleViewDetails = (fee: Fee) => {
    setSelectedFee(fee);
    setIsFeeDetailsModalOpen(true);
  };

  const handleEditFee = (fee: Fee) => {
    setSelectedFee(fee);
    setIsEditFeeModalOpen(true);
  };

  const handleDeleteFee = (fee: Fee) => {
    setSelectedFee(fee);
    setIsDeleteFeeModalOpen(true);
  };

  const handleToggleStatus = (fee: Fee) => {
    console.log("Toggle status for fee:", fee);
    // Handle toggle status logic here
  };

  const handleAddFee = (newFee: NewFee) => {
    console.log("Add new fee:", newFee);
    // Handle add fee logic here
    setIsAddFeeModalOpen(false);
  };

  const handleUpdateFee = (updatedFee: Fee) => {
    console.log("Update fee:", updatedFee);
    // Handle update fee logic here
    setIsEditFeeModalOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log("Delete fee:", selectedFee);
    // Handle delete fee logic here
    setIsDeleteFeeModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Handle page change logic here
  };

  // Calculate stats
  const totalFees = mockFees.length;
  const activeFees = mockFees.filter((fee) => fee.status === "Active").length;
  const kycFees = mockFees.filter((fee) => fee.type === "KYC").length;
  const certificationFees = mockFees.filter(
    (fee) => fee.type === "Certification"
  ).length;

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
                    Fees Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Configure mandatory platform charges for KYC and
                    Certification
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
          {/* Add Fee Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsAddFeeModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Fee
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Fees"
              value={totalFees.toString()}
              subtitle="Active fees configured"
              icon={DollarSign}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
            <StatCard
              title="KYC Fees"
              value={kycFees.toString()}
              subtitle="KYC verification charges"
              icon={Shield}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
            <StatCard
              title="Certification Fees"
              value={certificationFees.toString()}
              subtitle="Certification charges"
              icon={CreditCard}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-50"
            />
            <StatCard
              title="Active"
              value={activeFees.toString()}
              subtitle="Currently active"
              icon={TrendingUp}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-50"
            />
          </div>

          {/* Fees Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Platform Fees
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Fee Table */}
            <FeeTable
              fees={mockFees}
              onViewDetails={handleViewDetails}
              onEdit={handleEditFee}
              onDelete={handleDeleteFee}
              onToggleStatus={handleToggleStatus}
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

      {/* All Modals */}
      <AddFeeModal
        isOpen={isAddFeeModalOpen}
        onClose={() => setIsAddFeeModalOpen(false)}
        onSubmit={handleAddFee}
      />

      <EditFeeModal
        isOpen={isEditFeeModalOpen}
        onClose={() => setIsEditFeeModalOpen(false)}
        fee={selectedFee}
        onSubmit={handleUpdateFee}
      />

      <DeleteFeeModal
        isOpen={isDeleteFeeModalOpen}
        onClose={() => setIsDeleteFeeModalOpen(false)}
        fee={selectedFee}
        onConfirm={handleConfirmDelete}
      />

      <FeeDetailsModal
        isOpen={isFeeDetailsModalOpen}
        onClose={() => setIsFeeDetailsModalOpen(false)}
        fee={selectedFee}
      />
    </div>
  );
}

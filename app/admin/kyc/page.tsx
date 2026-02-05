"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Bell,
  Download,
  Menu,
  TrendingUp,
} from "lucide-react";
import Sidebar from "@/components/layouts/SideBar";
import StatCard from "@/components/kyc/StatCard";
import KYCTable from "@/components/kyc/KYCTable";
import Pagination from "@/components/kyc/Pagination";
import KYCDocumentDetailsModal from "@/components/kyc/KYCDocumentDetailsModal";
import type { KYCDocument, DocumentFilterType } from "@/types/kyc.types";

// Mock data for KYC documents
const mockKYCDocuments: KYCDocument[] = [
  {
    id: "1",
    documentId: "KYC001",
    providerName: "Downtown Event Space",
    providerId: "SP003",
    documentType: "Business License",
    uploadedDate: "2024-12-28",
    status: "Pending",
    documentUrl: "#",
  },
  {
    id: "2",
    documentId: "KYC002",
    providerName: "Grand Ballroom Hall",
    providerId: "SP001",
    documentType: "Tax ID",
    uploadedDate: "2024-01-15",
    status: "Approved",
    documentUrl: "#",
    reviewedBy: "Admin",
    reviewedDate: "2024-01-16",
  },
  {
    id: "3",
    documentId: "KYC003",
    providerName: "Elite Photography Services",
    providerId: "SP004",
    documentType: "Business License",
    uploadedDate: "2025-01-20",
    status: "Pending",
    documentUrl: "#",
  },
  {
    id: "4",
    documentId: "KYC004",
    providerName: "Perfect Sound Audio",
    providerId: "SP005",
    documentType: "Tax ID",
    uploadedDate: "2025-02-01",
    status: "Rejected",
    documentUrl: "#",
    reviewedBy: "Admin",
    reviewedDate: "2025-02-02",
    rejectionReason: "Document is not clear enough",
  },
  {
    id: "5",
    documentId: "KYC005",
    providerName: "Gourmet Delights Catering",
    providerId: "SP002",
    documentType: "Health Certificate",
    uploadedDate: "2024-02-20",
    status: "Approved",
    documentUrl: "#",
    reviewedBy: "Admin",
    reviewedDate: "2024-02-21",
  },
];

export default function KYCPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<DocumentFilterType>("All");
  const totalPages = 10;

  // Modal states
  const [isDocumentDetailsModalOpen, setIsDocumentDetailsModalOpen] =
    useState(false);

  // Selected document state
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(
    null
  );

  const handleViewDetails = (document: KYCDocument) => {
    setSelectedDocument(document);
    setIsDocumentDetailsModalOpen(true);
  };

  const handleApproveDocument = (document: KYCDocument) => {
    console.log("Approve document:", document);
    // Handle approve logic here
    setIsDocumentDetailsModalOpen(false);
  };

  const handleRejectDocument = (document: KYCDocument, reason: string) => {
    console.log("Reject document:", document, "Reason:", reason);
    // Handle reject logic here
    setIsDocumentDetailsModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Handle page change logic here
  };

  // Filter documents based on active filter
  const filteredDocuments =
    activeFilter === "All"
      ? mockKYCDocuments
      : mockKYCDocuments.filter((doc) => doc.status === activeFilter);

  // Calculate stats
  const totalDocuments = mockKYCDocuments.length;
  const pendingDocuments = mockKYCDocuments.filter(
    (doc) => doc.status === "Pending"
  ).length;
  const approvedDocuments = mockKYCDocuments.filter(
    (doc) => doc.status === "Approved"
  ).length;
  const rejectedDocuments = mockKYCDocuments.filter(
    (doc) => doc.status === "Rejected"
  ).length;

  const filters: DocumentFilterType[] = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
  ];

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
                    KYC & Certification
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Review and approve KYC documents and manage certifications
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Documents"
              value={totalDocuments.toString()}
              subtitle="All submissions"
              icon={FileText}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
            <StatCard
              title="Pending Review"
              value={pendingDocuments.toString()}
              subtitle="Awaiting approval"
              icon={Clock}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-50"
            />
            <StatCard
              title="Approved"
              value={approvedDocuments.toString()}
              subtitle="Verified documents"
              icon={CheckCircle}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
            <StatCard
              title="Rejected"
              value={rejectedDocuments.toString()}
              subtitle="Declined submissions"
              icon={XCircle}
              iconColor="text-red-600"
              iconBgColor="bg-red-50"
            />
          </div>

          {/* KYC Documents Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                KYC Documents
              </h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-4 overflow-x-auto">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeFilter === filter
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* KYC Table */}
            <KYCTable
              documents={filteredDocuments}
              onViewDetails={handleViewDetails}
              onApprove={handleApproveDocument}
              onReject={(doc) => {
                setSelectedDocument(doc);
                setIsDocumentDetailsModalOpen(true);
              }}
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

      {/* KYC Document Details Modal */}
      <KYCDocumentDetailsModal
        isOpen={isDocumentDetailsModalOpen}
        onClose={() => setIsDocumentDetailsModalOpen(false)}
        document={selectedDocument}
        onApprove={handleApproveDocument}
        onReject={handleRejectDocument}
      />
    </div>
  );
}

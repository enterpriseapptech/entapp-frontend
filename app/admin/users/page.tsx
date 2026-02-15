"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  UserCheck,
  Settings,
  Bell,
  Menu,
} from "lucide-react";
import Sidebar from "@/components/layouts/SideBar";
import StatCard from "@/components/providers/StatCard";
import Pagination from "@/components/providers/Pagination";
import UserTable from "@/components/users/UserTable";
import UserFilterTabs from "@/components/users/UserFilterTabs";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import { useGetUsersQuery } from "@/redux/services/adminApi";
import type { User, UserType } from "@/redux/services/adminApi";
import type { UserFilterType } from "@/types/user.types";

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<UserFilterType>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const queryArgs = {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    ...(activeFilter !== "ALL" && {
      userType: activeFilter as UserType,
    }),
  };

  const { data, isLoading, isError } = useGetUsersQuery(queryArgs);

  const users = data?.docs ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
  const verifiedUsers = users.filter((u) => u.isEmailVerified).length;

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleFilterChange = (filter: UserFilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 md:ml-72 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              {/* Left */}
              <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>

                <button className="hidden md:flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg flex-shrink-0">
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

                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-semibold text-gray-900 truncate">
                    Users
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    View and manage all user accounts
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Upgrade now
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-3 md:p-6">
          {/* Stats — 2 cols on mobile, 3 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            <StatCard
              title="Total Users"
              value={totalCount.toString()}
              subtitle="All registered users"
              icon={Users}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
            <StatCard
              title="Active Users"
              value={activeUsers.toString()}
              subtitle="Active on this page"
              icon={TrendingUp}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
            {/* Third card spans full width on mobile when it wraps */}
            <div className="col-span-2 sm:col-span-1">
              <StatCard
                title="Verified Users"
                value={verifiedUsers.toString()}
                subtitle="Email verified"
                icon={UserCheck}
                iconColor="text-purple-600"
                iconBgColor="bg-purple-50"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Table toolbar */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
              {/* Title row */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  All Users
                </h2>
              </div>
              {/* Filter tabs — full width on mobile */}
              <UserFilterTabs
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                counts={{ all: totalCount }}
              />
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
                Loading users...
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="flex items-center justify-center py-16 text-red-500 text-sm">
                Failed to load users. Please try again.
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && users.length === 0 && (
              <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
                No users found
                {activeFilter !== "ALL"
                  ? ` for: ${activeFilter.replace("_", " ").toLowerCase()}`
                  : ""}
                .
              </div>
            )}

            {/* Table + Pagination */}
            {!isLoading && !isError && users.length > 0 && (
              <>
                <UserTable users={users} onViewDetails={handleViewDetails} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
          </div>
        </main>
      </div>

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}

"use client";
import {
  Eye,
  Edit2,
  Power,
  Trash2,
  Grid3x3,
  List,
  Check,
  UserPlus,
} from "lucide-react";
import SideBar from "@/components/layouts/SideBar";
import Header from "@/components/layouts/Header";
import Notification from "@/components/ui/Notification";
import { useState } from "react";
import {
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  type SubscriptionPlan,
} from "@/redux/services/adminApi";

// Import all modals
import PlanDetailsModal from "@/components/modals/PlanDetailsModal";
import EditPlanModal from "@/components/modals/EditPlanModal";
import CreatePlanModal from "@/components/modals/CreatePlanModal";
import DeletePlanModal from "@/components/modals/DeletePlanModal";
import TogglePlanStatusModal from "@/components/modals/TogglePlanStatusModal";
import SubscriptionDetailsModal from "@/components/modals/SubscriptionDetailsModal";
import ChangeSubscriptionPlanModal from "@/components/modals/ChangeSubscriptionPlanModal";
import ToggleSubscriptionStatusModal from "@/components/modals/ToggleSubscriptionStatusModal";
import AssignSubscriptionModal from "@/components/modals/AssignSubscriptionModal";

type ViewMode = "cards" | "list";
type TabType = "plans" | "users";



interface SubscribedUser {
  id: number;
  businessName: string;
  currentPlan: string;
  status: string;
  startDate: string;
  renewalDate: string;
}

export default function SubscriptionManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<TabType>("plans");
  const itemsPerPage = viewMode === "list" ? 10 : 6;

  const { data: plansData, isLoading: plansLoading } = useGetSubscriptionPlansQuery({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  const [createPlan] = useCreateSubscriptionPlanMutation();
  const [updatePlan] = useUpdateSubscriptionPlanMutation();
  const [deletePlan] = useDeleteSubscriptionPlanMutation();

  const subscriptionPlans = plansData?.data || [];
  const totalPlansCount = plansData?.count || 0;

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Modal states for Plans
  const [planDetailsModal, setPlanDetailsModal] = useState<{
    isOpen: boolean;
    plan: SubscriptionPlan | null;
  }>({ isOpen: false, plan: null });

  const [editPlanModal, setEditPlanModal] = useState<{
    isOpen: boolean;
    plan: SubscriptionPlan | null;
  }>({ isOpen: false, plan: null });

  const [createPlanModal, setCreatePlanModal] = useState(false);

  const [deletePlanModal, setDeletePlanModal] = useState<{
    isOpen: boolean;
    plan: SubscriptionPlan | null;
  }>({ isOpen: false, plan: null });

  const [togglePlanStatusModal, setTogglePlanStatusModal] = useState<{
    isOpen: boolean;
    plan: SubscriptionPlan | null;
  }>({ isOpen: false, plan: null });

  // Modal states for Subscribed Users
  const [subscriptionDetailsModal, setSubscriptionDetailsModal] = useState<{
    isOpen: boolean;
    subscription: SubscribedUser | null;
  }>({ isOpen: false, subscription: null });

  const [changeSubscriptionModal, setChangeSubscriptionModal] = useState<{
    isOpen: boolean;
    subscription: SubscribedUser | null;
  }>({ isOpen: false, subscription: null });

  const [toggleSubscriptionStatusModal, setToggleSubscriptionStatusModal] =
    useState<{
      isOpen: boolean;
      subscription: SubscribedUser | null;
    }>({ isOpen: false, subscription: null });

  const [assignSubscriptionModal, setAssignSubscriptionModal] = useState(false);

  // Sample data for subscribed users
  const [subscribedUsers, setSubscribedUsers] = useState<SubscribedUser[]>([
    {
      id: 1,
      businessName: "Grand Ballroom Hall",
      currentPlan: "Professional Plan",
      status: "Active",
      startDate: "2025-01-01",
      renewalDate: "2025-02-01",
    },
    {
      id: 2,
      businessName: "Gourmet Delights Catering",
      currentPlan: "Basic Plan",
      status: "Active",
      startDate: "2024-12-15",
      renewalDate: "2025-01-15",
    },
    {
      id: 3,
      businessName: "Downtown Event Space",
      currentPlan: "Professional Plan",
      status: "Expired",
      startDate: "2024-11-01",
      renewalDate: "2024-12-01",
    },
  ]);

  // Get current data based on active tab
  const totalPages =
    activeTab === "plans"
      ? Math.ceil(totalPlansCount / itemsPerPage)
      : Math.ceil(subscribedUsers.length / itemsPerPage);

  const paginatedData =
    activeTab === "plans"
      ? subscriptionPlans
      : subscribedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  // Handler functions for Plans
  const handleCreatePlan = async (newPlan: Parameters<typeof createPlan>[0]) => {
    try {
      await createPlan(newPlan).unwrap();
      setNotification({ message: "Plan created successfully", type: "success" });
    } catch (e) {
      console.error(e);
      setNotification({ message: "Failed to create plan", type: "error" });
    }
  };

  const handleUpdatePlan = async (id: string, updatedPlan: Parameters<typeof updatePlan>[0]["body"]) => {
    try {
      await updatePlan({ id, body: updatedPlan }).unwrap();
      setNotification({ message: "Plan updated successfully", type: "success" });
    } catch (e) {
      console.error(e);
      setNotification({ message: "Failed to update plan", type: "error" });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlan(planId).unwrap();
      setNotification({ message: "Plan deleted successfully", type: "success" });
    } catch (e) {
      console.error(e);
      setNotification({ message: "Failed to delete plan", type: "error" });
    }
  };

  const handleTogglePlanStatus = async (plan: SubscriptionPlan) => {
    try {
      const newStatus = plan.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updatePlan({ id: plan.id, body: { status: newStatus } }).unwrap();
      setNotification({ message: "Plan status updated successfully", type: "success" });
    } catch (e) {
      console.error(e);
      setNotification({ message: "Failed to update plan status", type: "error" });
    }
  };

  // Handler functions for Subscribed Users
  const handleAssignSubscription = (newSubscription: SubscribedUser) => {
    setSubscribedUsers([...subscribedUsers, newSubscription]);
  };

  const handleChangeSubscription = (
    updatedSubscription: Partial<SubscribedUser> & { id: number }
  ) => {
    setSubscribedUsers(
      subscribedUsers.map((user) =>
        user.id === updatedSubscription.id
          ? { ...user, ...updatedSubscription }
          : user
      )
    );
  };

  const handleToggleSubscriptionStatus = (subscriptionId: number) => {
    setSubscribedUsers(
      subscribedUsers.map((user) =>
        user.id === subscriptionId
          ? {
            ...user,
            status: user.status === "Active" ? "Expired" : "Active",
          }
          : user
      )
    );
  };

  // Get available plan names for dropdowns
  const availablePlanNames = subscriptionPlans.map((plan) => plan.plan);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (endPage - startPage < 2) {
        if (startPage === 2) {
          endPage = startPage + 2;
        } else {
          startPage = endPage - 2;
        }
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
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

        {/* Subscription Management Content */}
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="md:text-2xl text-xl font-semibold text-gray-900">
                Subscription Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage subscription plans and user subscriptions
              </p>
            </div>
            <div className="flex gap-2">
              {activeTab === "users" && (
                <button
                  onClick={() => setAssignSubscriptionModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Assign Subscription</span>
                </button>
              )}
              {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 text-sm font-medium">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.334 7.333L8.667 2.667M8.667 2.667L4 7.333M8.667 2.667V13.333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Upgrade now</span>
              </button> */}
              {activeTab === "plans" && (
                <button
                  onClick={() => setCreatePlanModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  <span className="text-lg">+</span>
                  <span>Create Plan</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs and View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6 border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab("plans");
                  setCurrentPage(1);
                }}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "plans"
                  ? "text-[#0047AB]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Subscription Plans ({totalPlansCount})
                {activeTab === "plans" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047AB]"></div>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("users");
                  setCurrentPage(1);
                }}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "users"
                  ? "text-[#0047AB]"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Subscribed Users ({subscribedUsers.length})
                {activeTab === "users" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047AB]"></div>
                )}
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 border border-gray-200 rounded-lg p-1 bg-white">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "cards"
                  ? "bg-gray-100 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <Grid3x3 className="w-4 h-4" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "list"
                  ? "bg-gray-100 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "users" ? (
            viewMode === "list" ? (
              // Subscribed Users List View
              <div className="rounded-lg border bg-white shadow">
                {/* Table with Horizontal Scroll */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto min-w-[800px]">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Business Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Current Plan
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Renewal Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(paginatedData as SubscribedUser[]).map(
                        (user, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap font-medium">
                              {user.businessName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                              {user.currentPlan}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === "Active"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                                  }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                              {user.startDate}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                              {user.renewalDate}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setSubscriptionDetailsModal({
                                      isOpen: true,
                                      subscription: user,
                                    })
                                  }
                                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() =>
                                    setChangeSubscriptionModal({
                                      isOpen: true,
                                      subscription: user,
                                    })
                                  }
                                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                  <Edit2 className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() =>
                                    setToggleSubscriptionStatusModal({
                                      isOpen: true,
                                      subscription: user,
                                    })
                                  }
                                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                  <Power className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center p-4 border-t">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 12L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Previous</span>
                  </button>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof page === "number" && setCurrentPage(page)
                        }
                        className={`px-3 py-1 rounded-md text-sm ${page === currentPage
                          ? "bg-blue-600 text-white"
                          : typeof page === "number"
                            ? "text-gray-600 hover:bg-gray-100"
                            : "text-gray-600 cursor-default"
                          }`}
                        disabled={typeof page !== "number"}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              // Subscribed Users Cards View
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(paginatedData as SubscribedUser[]).map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.businessName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {user.currentPlan}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                            }`}
                        >
                          {user.status}
                        </span>
                      </div>

                      {/* Subscription Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="text-gray-900 font-medium">
                            {user.startDate}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Renewal Date:</span>
                          <span className="text-gray-900 font-medium">
                            {user.renewalDate}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button
                          onClick={() =>
                            setSubscriptionDetailsModal({
                              isOpen: true,
                              subscription: user,
                            })
                          }
                          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() =>
                            setChangeSubscriptionModal({
                              isOpen: true,
                              subscription: user,
                            })
                          }
                          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Edit2 className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() =>
                            setToggleSubscriptionStatusModal({
                              isOpen: true,
                              subscription: user,
                            })
                          }
                          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Power className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for Cards */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed bg-white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 12L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Previous</span>
                  </button>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof page === "number" && setCurrentPage(page)
                        }
                        className={`px-3 py-1 rounded-md text-sm ${page === currentPage
                          ? "bg-blue-600 text-white"
                          : typeof page === "number"
                            ? "text-gray-600 hover:bg-gray-100 bg-white"
                            : "text-gray-600 cursor-default"
                          }`}
                        disabled={typeof page !== "number"}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed bg-white"
                  >
                    <span>Next</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )
          ) : viewMode === "list" ? (
            // Subscription Plans List View
            <div className="rounded-lg border bg-white shadow">
              {/* Table with Horizontal Scroll */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[800px]">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                        Plan Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                        Time Frame (Days)
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(paginatedData as SubscriptionPlan[]).map(
                      (plan, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap font-medium">
                            {plan.plan}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {plan.timeFrame}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap font-medium">
                            ${plan.amount}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.status === "ACTIVE"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-700"
                                }`}
                            >
                              {plan.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  setPlanDetailsModal({
                                    isOpen: true,
                                    plan: plan,
                                  })
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() =>
                                  setEditPlanModal({ isOpen: true, plan: plan })
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() =>
                                  setTogglePlanStatusModal({
                                    isOpen: true,
                                    plan: plan,
                                  })
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <Power className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeletePlanModal({
                                    isOpen: true,
                                    plan: plan,
                                  })
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center p-4 border-t">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Previous</span>
                </button>
                <div className="flex gap-2 flex-wrap justify-center">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number" && setCurrentPage(page)
                      }
                      className={`px-3 py-1 rounded-md text-sm ${page === currentPage
                        ? "bg-blue-600 text-white"
                        : typeof page === "number"
                          ? "text-gray-600 hover:bg-gray-100"
                          : "text-gray-600 cursor-default"
                        }`}
                      disabled={typeof page !== "number"}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            // Subscription Plans Cards View
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(paginatedData as SubscriptionPlan[]).map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {plan.plan}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {plan.timeFrame} Days
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${plan.status === "ACTIVE"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">
                          ${plan.amount}
                        </span>
                        <span className="text-gray-600 ml-1">
                          / {plan.timeFrame} Days
                        </span>
                      </div>
                    </div>



                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <button
                        onClick={() =>
                          setPlanDetailsModal({ isOpen: true, plan: plan })
                        }
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          setEditPlanModal({ isOpen: true, plan: plan })
                        }
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          setTogglePlanStatusModal({ isOpen: true, plan: plan })
                        }
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Power className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          setDeletePlanModal({ isOpen: true, plan: plan })
                        }
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination for Cards */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed bg-white"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Previous</span>
                </button>
                <div className="flex gap-2 flex-wrap justify-center">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof page === "number" && setCurrentPage(page)
                      }
                      className={`px-3 py-1 rounded-md text-sm ${page === currentPage
                        ? "bg-blue-600 text-white"
                        : typeof page === "number"
                          ? "text-gray-600 hover:bg-gray-100 bg-white"
                          : "text-gray-600 cursor-default"
                        }`}
                      disabled={typeof page !== "number"}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed bg-white"
                >
                  <span>Next</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* All Modals */}
      {/* Plan Modals */}
      <PlanDetailsModal
        isOpen={planDetailsModal.isOpen}
        onClose={() => setPlanDetailsModal({ isOpen: false, plan: null })}
        plan={planDetailsModal.plan}
      />

      <EditPlanModal
        isOpen={editPlanModal.isOpen}
        onClose={() => setEditPlanModal({ isOpen: false, plan: null })}
        plan={editPlanModal.plan}
        onUpdate={handleUpdatePlan}
      />

      <CreatePlanModal
        isOpen={createPlanModal}
        onClose={() => setCreatePlanModal(false)}
        onCreate={handleCreatePlan}
      />

      <DeletePlanModal
        isOpen={deletePlanModal.isOpen}
        onClose={() => setDeletePlanModal({ isOpen: false, plan: null })}
        plan={deletePlanModal.plan}
        onDelete={() =>
          deletePlanModal.plan && handleDeletePlan(deletePlanModal.plan.id)
        }
      />

      <TogglePlanStatusModal
        isOpen={togglePlanStatusModal.isOpen}
        onClose={() => setTogglePlanStatusModal({ isOpen: false, plan: null })}
        plan={togglePlanStatusModal.plan}
        onToggle={() =>
          togglePlanStatusModal.plan &&
          handleTogglePlanStatus(togglePlanStatusModal.plan)
        }
      />

      {/* Subscription Modals */}
      <SubscriptionDetailsModal
        isOpen={subscriptionDetailsModal.isOpen}
        onClose={() =>
          setSubscriptionDetailsModal({ isOpen: false, subscription: null })
        }
        subscription={subscriptionDetailsModal.subscription}
      />

      <ChangeSubscriptionPlanModal
        isOpen={changeSubscriptionModal.isOpen}
        onClose={() =>
          setChangeSubscriptionModal({ isOpen: false, subscription: null })
        }
        subscription={changeSubscriptionModal.subscription}
        availablePlans={availablePlanNames}
        onChange={handleChangeSubscription}
      />

      <ToggleSubscriptionStatusModal
        isOpen={toggleSubscriptionStatusModal.isOpen}
        onClose={() =>
          setToggleSubscriptionStatusModal({
            isOpen: false,
            subscription: null,
          })
        }
        subscription={toggleSubscriptionStatusModal.subscription}
        onToggle={() =>
          toggleSubscriptionStatusModal.subscription &&
          handleToggleSubscriptionStatus(
            toggleSubscriptionStatusModal.subscription.id
          )
        }
      />

      <AssignSubscriptionModal
        isOpen={assignSubscriptionModal}
        onClose={() => setAssignSubscriptionModal(false)}
        availablePlans={availablePlanNames}
        onAssign={handleAssignSubscription}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

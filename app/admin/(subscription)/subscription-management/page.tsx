"use client";
import {
  Eye,
  Edit2,
  Power,
  Trash2,
  Grid3x3,
  List,
  UserPlus,
} from "lucide-react";
import SideBar from "@/components/layouts/SideBar";
import Header from "@/components/layouts/Header";
import Notification from "@/components/ui/Notification";
import { useState } from "react";
import {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionsQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  type SubscriptionPlan,
  type Subscription,
} from "@/redux/services/adminApi";

// Import all modals
import PlanDetailsModal from "@/components/modals/PlanDetailsModal";
import EditPlanModal from "@/components/modals/EditPlanModal";
import CreatePlanModal from "@/components/modals/CreatePlanModal";
import DeletePlanModal from "@/components/modals/DeletePlanModal";
import TogglePlanStatusModal from "@/components/modals/TogglePlanStatusModal";
import SubscriptionDetailsModal from "@/components/modals/SubscriptionDetailsModal";

type ViewMode = "cards" | "list";
type TabType = "plans" | "subscriptions";

// SubscribedUser interface removed

export default function SubscriptionManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<TabType>("plans");
  const itemsPerPage = viewMode === "list" ? 10 : 6;

  const { data: plansData } = useGetSubscriptionPlansQuery({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  const [createPlan] = useCreateSubscriptionPlanMutation();
  const [updatePlan] = useUpdateSubscriptionPlanMutation();
  const [deletePlan] = useDeleteSubscriptionPlanMutation();

  const { data: subscriptionsData } = useGetSubscriptionsQuery({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  const subscriptionPlans = plansData?.data || [];
  const totalPlansCount = plansData?.count || 0;

  const subscriptions = subscriptionsData?.docs || [];
  const totalSubscriptionsCount = subscriptionsData?.count || 0;

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
    subscription: Subscription | null;
  }>({ isOpen: false, subscription: null });

  // Sample data for subscribed users removed and replaced by API

  // Get current data based on active tab
  const totalPages =
    activeTab === "plans"
      ? Math.ceil(totalPlansCount / itemsPerPage)
      : Math.ceil(totalSubscriptionsCount / itemsPerPage);

  const paginatedData =
    activeTab === "plans" ? subscriptionPlans : subscriptions;

  // Handler functions for Plans
  const handleCreatePlan = async (
    newPlan: Parameters<typeof createPlan>[0]
  ) => {
    try {
      await createPlan(newPlan).unwrap();
      setNotification({
        message: "Plan created successfully",
        type: "success",
      });
    } catch (e) {
      console.error(e);
      setNotification({ message: "Failed to create plan", type: "error" });
    }
  };

  const handleUpdatePlan = async (
    id: string,
    updatedPlan: Parameters<typeof updatePlan>[0]["body"]
  ) => {
    try {
      await updatePlan({ id, body: updatedPlan }).unwrap();
      setNotification({
        message: "Plan updated successfully",
        type: "success",
      });
    } catch (e) {
      console.error(e);
      setNotification({ message: "Failed to update plan", type: "error" });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlan(planId).unwrap();
      setNotification({
        message: "Plan deleted successfully",
        type: "success",
      });
    } catch (e) {
      console.error(e);
      setNotification({ message: "Failed to delete plan", type: "error" });
    }
  };

  const handleTogglePlanStatus = async (plan: SubscriptionPlan) => {
    try {
      const newStatus = plan.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updatePlan({ id: plan.id, body: { status: newStatus } }).unwrap();
      setNotification({
        message: "Plan status updated successfully",
        type: "success",
      });
    } catch (e) {
      console.error(e);
      setNotification({
        message: "Failed to update plan status",
        type: "error",
      });
    }
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
              {/* Assign Subscription button removed as per request to remove edit/delete/create-like actions in this view */}
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
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === "plans"
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
                  setActiveTab("subscriptions");
                  setCurrentPage(1);
                }}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === "subscriptions"
                    ? "text-[#0047AB]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Subscriptions ({totalSubscriptionsCount})
                {activeTab === "subscriptions" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047AB]"></div>
                )}
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 border border-gray-200 rounded-lg p-1 bg-white">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "cards"
                    ? "bg-gray-100 text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
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
          {activeTab === "subscriptions" ? (
            viewMode === "list" ? (
              // Subscribed Users List View
              <div className="rounded-lg border bg-white shadow">
                {/* Table with Horizontal Scroll */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto min-w-[800px]">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Service Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Created Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Expiry Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(paginatedData as Subscription[]).map(
                        (subscription, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap font-medium">
                              {subscription.serviceName || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                              {subscription.type}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  subscription.status === "ACTIVE"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {subscription.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                              {new Date(subscription.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                              {new Date(subscription.expiryDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setSubscriptionDetailsModal({
                                      isOpen: true,
                                      subscription: subscription,
                                    })
                                  }
                                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-gray-600" />
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
                        className={`px-3 py-1 rounded-md text-sm ${
                          page === currentPage
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
                  {(paginatedData as Subscription[]).map((subscription) => (
                    <div
                      key={subscription.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {subscription.serviceName || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {subscription.type}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            subscription.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {subscription.status}
                        </span>
                      </div>

                      {/* Subscription Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Created Date:</span>
                          <span className="text-gray-900 font-medium">
                            {new Date(subscription.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Expiry Date:</span>
                          <span className="text-gray-900 font-medium">
                            {new Date(subscription.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button
                          onClick={() =>
                            setSubscriptionDetailsModal({
                              isOpen: true,
                              subscription: subscription,
                            })
                          }
                          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
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
                        className={`px-3 py-1 rounded-md text-sm ${
                          page === currentPage
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
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                plan.status === "ACTIVE"
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
                      className={`px-3 py-1 rounded-md text-sm ${
                        page === currentPage
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
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          plan.status === "ACTIVE"
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
                      className={`px-3 py-1 rounded-md text-sm ${
                        page === currentPage
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

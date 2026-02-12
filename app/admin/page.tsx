"use client";
import Image from "next/image";
import { Trash2, Eye } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import SideBar from "@/components/layouts/SideBar";
import { useState } from "react";
import Header from "@/components/layouts/Header";

// Import your existing APIs
import {
  useGetEventCentersQuery,
  useDeleteEventCenterMutation,
} from "@/redux/services/eventsApi";
import {
  useGetCateringsQuery,
  useDeleteCateringMutation,
} from "@/redux/services/cateringApi";

// Import Notification component
import Notification from "@/components/ui/Notification";

// Import types from your APIs
import type { EventCenter } from "@/redux/services/eventsApi";
import type { Catering } from "@/redux/services/cateringApi";

// Type definitions for table data
interface EventTableItem {
  id: number;
  originalId: string;
  name: string;
  type: string;
  location: string;
  date: string;
  status: string;
  capacity: string;
  amount: string;
  entity: EventCenter;
}

interface CateringTableItem {
  id: number;
  originalId: string;
  name: string;
  cuisine: string;
  location: string;
  date: string;
  status: string;
  capacity: string;
  amount: string;
  entity: Catering;
}

type TableItem = EventTableItem | CateringTableItem;

// Type guard to check if item is EventTableItem
const isEventTableItem = (item: TableItem): item is EventTableItem => {
  return "type" in item;
};

// Type guard to check if item is CateringTableItem
const isCateringTableItem = (item: TableItem): item is CateringTableItem => {
  return "cuisine" in item;
};

// Type for selected service in modal
interface SelectedService {
  type: "event" | "catering";
  data: EventCenter | Catering;
}

// Type for notification
interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  serviceType: string;
  isLoading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  serviceType,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Delete {serviceType}
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this service?
              </p>
            </div>
          </div>

          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800 font-medium">{serviceName}</p>
            <p className="text-xs text-red-600 mt-1">
              This action cannot be undone. All data related to this service
              will be permanently removed.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                "Delete Service"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Component for Viewing Details
interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "event" | "catering";
  data: EventCenter | Catering | null;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
}) => {
  if (!isOpen || !data) return null;

  const isEvent = type === "event";
  const eventData = isEvent ? (data as EventCenter) : null;
  const cateringData = !isEvent ? (data as Catering) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto text-gray-500">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isEvent ? "Event Center" : "Catering Service"} Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {isEvent && eventData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{eventData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Event Types</p>
                      <p className="font-medium">
                        {eventData.eventTypes?.join(", ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {eventData.city}, {eventData.streetAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">
                        {eventData.contact || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pricing & Capacity
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Pricing per Slot</p>
                      <p className="font-medium">
                        ${eventData.pricingPerSlot?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sitting Capacity</p>
                      <p className="font-medium">
                        {eventData.sittingCapacity?.toLocaleString() || "0"}{" "}
                        people
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Deposit Percentage
                      </p>
                      <p className="font-medium">
                        {eventData.depositPercentage || "0"}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Discount Percentage
                      </p>
                      <p className="font-medium">
                        {eventData.discountPercentage || "0"}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <p className="text-gray-700">
                  {eventData.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {eventData.amenities?.map(
                      (amenity: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {amenity}
                        </span>
                      )
                    ) || <p className="text-gray-500">No amenities listed</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Status:</span>
                      <span
                        className={`font-medium ${
                          eventData.status === "ACTIVE"
                            ? "text-green-600"
                            : eventData.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {eventData.status || "UNKNOWN"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Required:</span>
                      <span className="font-medium">
                        {eventData.paymentRequired ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created At:</span>
                      <span className="font-medium">
                        {new Date(eventData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : cateringData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{cateringData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tagline</p>
                      <p className="font-medium">
                        {cateringData.tagLine || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {cateringData.city}, {cateringData.streetAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">
                        {cateringData.contact || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pricing & Capacity
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Starting Price</p>
                      <p className="font-medium">
                        ${cateringData.startPrice?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capacity Range</p>
                      <p className="font-medium">
                        {cateringData.minCapacity || "0"} -{" "}
                        {cateringData.maxCapacity || "0"} people
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Deposit Percentage
                      </p>
                      <p className="font-medium">
                        {cateringData.depositPercentage || "0"}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Discount Percentage
                      </p>
                      <p className="font-medium">
                        {cateringData.discountPercentage || "0"}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <p className="text-gray-700">
                  {cateringData.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Cuisine & Dishes
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Cuisine Types</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {cateringData.cuisine?.map(
                          (item: string, index: number) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                            >
                              {item}
                            </span>
                          )
                        ) || <p className="text-gray-500">No cuisine listed</p>}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dish Types</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {cateringData.dishTypes?.map(
                          (item: string, index: number) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full"
                            >
                              {item}
                            </span>
                          )
                        ) || (
                          <p className="text-gray-500">No dish types listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Status:</span>
                      <span
                        className={`font-medium ${
                          cateringData.status === "ACTIVE"
                            ? "text-green-600"
                            : cateringData.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {cateringData.status || "UNKNOWN"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Required:</span>
                      <span className="font-medium">
                        {cateringData.paymentRequired ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Featured:</span>
                      <span className="font-medium">
                        {cateringData.isFeatured ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created At:</span>
                      <span className="font-medium">
                        {new Date(cateringData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"events" | "catering">("events");
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<{
    id: string;
    name: string;
    type: "event" | "catering";
  } | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "success",
  });
  const itemsPerPage = 8;

  // API hooks
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    error: eventsError,
    refetch: refetchEvents,
  } = useGetEventCentersQuery({
    limit: 1,
    offset: 0,
  });

  const {
    data: cateringData,
    isLoading: isLoadingCatering,
    error: cateringError,
    refetch: refetchCatering,
  } = useGetCateringsQuery({
    limit: 1,
    offset: 0,
  });

  const [deleteEventCenter, { isLoading: isDeletingEvent }] =
    useDeleteEventCenterMutation();
  const [deleteCatering, { isLoading: isDeletingCatering }] =
    useDeleteCateringMutation();

  // Fetch recent data
  const { data: recentEventsData, refetch: refetchRecentEvents } =
    useGetEventCentersQuery({
      limit: 20,
      offset: 0,
    });

  const { data: recentCateringData, refetch: refetchRecentCatering } =
    useGetCateringsQuery({
      limit: 20,
      offset: 0,
    });

  // Calculate totals from API responses
  const totalEvents = eventsData?.count ?? 0;
  const totalCatering = cateringData?.count ?? 0;

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({
      show: false,
      message: "",
      type: "success",
    });
  };

  // Process recent events for the table
  const processRecentEvents = (): EventTableItem[] => {
    if (!recentEventsData?.data) return [];

    return recentEventsData.data.map((event, index) => ({
      id: index + 1, // Using 1, 2, 3... instead of UUID
      originalId: event.id,
      name: event.name,
      type: event.eventTypes?.[0] || "Event",
      location: event.city || "N/A",
      date: event.createdAt
        ? new Date(event.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      status: event.status || "ACTIVE",
      capacity: event.sittingCapacity
        ? `${event.sittingCapacity} people`
        : "N/A",
      amount: event.pricingPerSlot
        ? `$${event.pricingPerSlot.toLocaleString()}/slot`
        : "N/A",
      entity: event,
    }));
  };

  // Process recent catering for the table
  const processRecentCatering = (): CateringTableItem[] => {
    if (!recentCateringData?.data) return [];

    return recentCateringData.data.map((catering, index) => ({
      id: index + 1, // Using 1, 2, 3... instead of UUID
      originalId: catering.id,
      name: catering.name,
      cuisine: catering.cuisine?.[0] || "Cuisine",
      location: catering.city || "N/A",
      date: catering.createdAt
        ? new Date(catering.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      status: catering.status || "ACTIVE",
      capacity: `${catering.minCapacity || 0}-${
        catering.maxCapacity || 0
      } people`,
      amount: catering.startPrice
        ? `$${catering.startPrice.toLocaleString()}`
        : "N/A",
      entity: catering,
    }));
  };

  // Get data based on active tab
  const processedData: TableItem[] =
    activeTab === "events" ? processRecentEvents() : processRecentCatering();

  // Calculate total pages
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  // Get the data for the current page
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
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

  // Handle view details
  const handleViewDetails = (item: TableItem) => {
    setSelectedService({
      type: activeTab === "events" ? "event" : "catering",
      data: item.entity,
    });
    setIsDetailsModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (item: TableItem) => {
    setServiceToDelete({
      id: item.originalId,
      name: item.name,
      type: activeTab === "events" ? "event" : "catering",
    });
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    try {
      if (serviceToDelete.type === "event") {
        await deleteEventCenter(serviceToDelete.id).unwrap();
        // Refetch event data
        refetchEvents();
        refetchRecentEvents();
        // Show success notification
        showNotification(
          `Event Center "${serviceToDelete.name}" deleted successfully!`,
          "success"
        );
      } else {
        await deleteCatering(serviceToDelete.id).unwrap();
        // Refetch catering data
        refetchCatering();
        refetchRecentCatering();
        // Show success notification
        showNotification(
          `Catering Service "${serviceToDelete.name}" deleted successfully!`,
          "success"
        );
      }

      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error deleting service:", error);
      // Show error notification
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete service";
      showNotification(`Error: ${errorMessage}`, "error");
    }
  };

  // Get display value for type/cuisine column
  const getTypeOrCuisine = (item: TableItem): string => {
    if (isEventTableItem(item)) {
      return item.type;
    } else if (isCateringTableItem(item)) {
      return item.cuisine;
    }
    return "N/A";
  };

  // Use real data for the charts - just show current totals
  const totalEventsData = Array(7).fill({ value: totalEvents });
  const totalCateringData = Array(7).fill({ value: totalCatering });
  const totalServicesData = Array(7).fill({
    value: totalEvents + totalCatering,
  });

  // Loading state
  if (isLoadingEvents || isLoadingCatering) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (eventsError || cateringError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">
            Error loading dashboard data
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

        {/* Dashboard Content */}
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-950">Admin Dashboard</h1>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {/* Total Services Card */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Total Services</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {(totalEvents + totalCatering).toLocaleString()}
                    </h3>
                  </div>
                  <div className="text-xs text-gray-400">All Services</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="text-sm text-gray-600">Current total</div>
                  </div>
                  <div className="flex-1 h-[50px] min-w-0">
                    <ResponsiveContainer width="100%" height={60}>
                      <BarChart
                        data={totalServicesData}
                        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                      >
                        <Bar
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                          barSize={8}
                          isAnimationActive={true}
                        >
                          {totalServicesData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#gradient${index})`}
                            />
                          ))}
                        </Bar>

                        <defs>
                          {totalServicesData.map((entry, index) => (
                            <linearGradient
                              key={`gradient-${index}`}
                              id={`gradient${index}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="rgba(37, 99, 235, 0.8)"
                                stopOpacity={0.9}
                              />
                              <stop
                                offset="100%"
                                stopColor="rgba(37, 99, 235, 0.2)"
                                stopOpacity={0.5}
                              />
                            </linearGradient>
                          ))}
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Events Card */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Total Event Centers</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {totalEvents.toLocaleString()}
                    </h3>
                  </div>
                  <div className="text-xs text-gray-400">All Locations</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="text-sm text-gray-600">Current total</div>
                  </div>
                  <div className="flex-1 h-[50px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={totalEventsData}>
                        <Bar
                          dataKey="value"
                          fill="rgba(34, 197, 94, 0.2)"
                          radius={[4, 4, 0, 0]}
                          barSize={10}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Catering Card */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Total Catering Services
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {totalCatering.toLocaleString()}
                    </h3>
                  </div>
                  <div className="text-xs text-gray-400">All Providers</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="text-sm text-gray-600">Current total</div>
                  </div>
                  <div className="flex-1 h-[50px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={totalCateringData}>
                        <Bar
                          dataKey="value"
                          fill="rgba(37, 99, 235, 0.2)"
                          radius={[4, 4, 0, 0]}
                          barSize={10}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mt-8">
            <div className="rounded-lg border bg-white shadow">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-md font-semibold text-gray-900">
                      Recent Services
                    </h2>
                    <p className="text-xs text-gray-500">
                      Recently added event centers and catering services.
                    </p>
                  </div>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        setActiveTab("events");
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "events"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Event Centers
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("catering");
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "catering"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Catering Services
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[800px]">
                  <thead>
                    <tr className="border-t">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        {activeTab === "events" ? "Event Type" : "Cuisine"}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Added Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        {activeTab === "events" ? "Capacity" : "Guest Range"}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Pricing
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item) => (
                        <tr key={item.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {getTypeOrCuisine(item)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {item.location}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                item.status === "ACTIVE" ||
                                item.status === "PUBLISHED"
                                  ? "bg-green-50 text-green-700"
                                  : item.status === "PENDING"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : item.status === "INACTIVE" ||
                                    item.status === "SUSPENDED"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-gray-50 text-gray-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {item.capacity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {item.amount}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(item)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item)}
                                className="rounded-lg p-1 hover:bg-gray-100 hover:text-red-600"
                                title="Delete"
                                disabled={isDeletingEvent || isDeletingCatering}
                              >
                                <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No{" "}
                          {activeTab === "events"
                            ? "event centers"
                            : "catering services"}{" "}
                          found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {processedData.length > 0 && (
                <div className="flex justify-between items-center p-4 border-t md:flex-wrap gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white"
                  >
                    <Image
                      src="/leftArrow.png"
                      alt="Previous"
                      width={10}
                      height={10}
                      className="w-4 h-4"
                      unoptimized
                    />
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
                    className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white"
                  >
                    <span>Next</span>
                    <Image
                      src="/rightArrow.png"
                      alt="Next"
                      width={10}
                      height={10}
                      className="w-4 h-4"
                      unoptimized
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Platform Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Event Centers
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {totalEvents}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Catering Services
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {totalCatering}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Services</span>
                  <span className="text-sm font-medium text-gray-900">
                    {totalEvents + totalCatering}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm font-semibold text-gray-900">
                    Total Platform Services
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {totalEvents + totalCatering}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {recentEventsData?.data?.length || 0}
                  </span>{" "}
                  event centers loaded
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {recentCateringData?.data?.length || 0}
                  </span>{" "}
                  catering services loaded
                </div>
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(processedData.length, itemsPerPage)}
                  </span>{" "}
                  of <span className="font-medium">{processedData.length}</span>{" "}
                  total services
                </div>
                <div className="text-sm text-gray-600 pt-3 border-t">
                  Last updated:{" "}
                  <span className="font-medium">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        type={selectedService?.type || "event"}
        data={selectedService?.data || null}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        serviceName={serviceToDelete?.name || ""}
        serviceType={
          serviceToDelete?.type === "event"
            ? "Event Center"
            : "Catering Service"
        }
        isLoading={isDeletingEvent || isDeletingCatering}
      />

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

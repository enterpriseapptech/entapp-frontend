"use client";

import { useState } from "react";
import {
  Globe,
  Map,
  Settings,
  Bell,
  Download,
  Menu,
  Plus,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Zap,
} from "lucide-react";
import Sidebar from "@/components/layouts/SideBar";
import StatCard from "@/components/geography/StatCard";
import GeographyTable from "@/components/geography/GeographyTable";
import Pagination from "@/components/geography/Pagination";
import AddCountryModal from "@/components/geography/AddCountryModal";
import EditCountryModal from "@/components/geography/EditCountryModal";
import DeleteCountryModal from "@/components/geography/DeleteCountryModal";
import CountryDetailsModal from "@/components/geography/CountryDetailsModal";
import AddStateModal from "@/components/geography/AddStateModal";
import EditStateModal from "@/components/geography/EditStateModal";
import DeleteStateModal from "@/components/geography/DeleteStateModal";
import StateDetailsModal from "@/components/geography/StateDetailsModal";
import Notification from "@/components/ui/Notification";

import {
  useGetCountriesQuery,
  useGetStatesQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  type Country,
  type State,
  type CreateCountryRequest,
  type UpdateCountryRequest,
  type CreateStateRequest,
  type UpdateStateRequest,
} from "@/redux/services/adminApi";
import { useGetUserByIdQuery } from "@/redux/services/authApi";

import type { NewCountry, NewState } from "@/types/geography.types";

type TabType = "Countries" | "States/Provinces";

function getCurrentUserId(): string {
  if (typeof window === "undefined") return "";
  try {
    return (
      localStorage.getItem("user_id") || sessionStorage.getItem("user_id") || ""
    );
  } catch {
    return "";
  }
}

function GeographyManagementPageInner({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Countries");

  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const PAGE_SIZE = 10;
  const [countryPage, setCountryPage] = useState(1);
  const [statePage, setStatePage] = useState(1);

  // Modal states
  const [isAddCountryModalOpen, setIsAddCountryModalOpen] = useState(false);
  const [isEditCountryModalOpen, setIsEditCountryModalOpen] = useState(false);
  const [isDeleteCountryModalOpen, setIsDeleteCountryModalOpen] =
    useState(false);
  const [isCountryDetailsModalOpen, setIsCountryDetailsModalOpen] =
    useState(false);

  const [isAddStateModalOpen, setIsAddStateModalOpen] = useState(false);
  const [isEditStateModalOpen, setIsEditStateModalOpen] = useState(false);
  const [isDeleteStateModalOpen, setIsDeleteStateModalOpen] = useState(false);
  const [isStateDetailsModalOpen, setIsStateDetailsModalOpen] = useState(false);

  // Selected items
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  // Queries
  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesError,
    refetch: refetchCountries,
  } = useGetCountriesQuery({
    limit: PAGE_SIZE,
    offset: (countryPage - 1) * PAGE_SIZE,
  });

  const {
    data: statesData,
    isLoading: statesLoading,
    isError: statesError,
    refetch: refetchStates,
  } = useGetStatesQuery({
    limit: PAGE_SIZE,
    offset: (statePage - 1) * PAGE_SIZE,
  });

  const { data: currentUser } = useGetUserByIdQuery(currentUserId, {
    skip: !currentUserId,
  });

  // Mutations
  const [createCountry, { isLoading: isCreatingCountry }] =
    useCreateCountryMutation();
  const [updateCountry, { isLoading: isUpdatingCountry }] =
    useUpdateCountryMutation();
  const [deleteCountry, { isLoading: isDeletingCountry }] =
    useDeleteCountryMutation();
  const [createState, { isLoading: isCreatingState }] =
    useCreateStateMutation();
  const [updateState, { isLoading: isUpdatingState }] =
    useUpdateStateMutation();
  const [deleteState, { isLoading: isDeletingState }] =
    useDeleteStateMutation();

  // Derived data
  const countries: Country[] = countriesData?.docs ?? [];
  const states: State[] = statesData?.docs ?? [];

  const totalCountryPages = Math.ceil((countriesData?.count ?? 0) / PAGE_SIZE);
  const totalStatePages = Math.ceil((statesData?.count ?? 0) / PAGE_SIZE);

  const currentPage = activeTab === "Countries" ? countryPage : statePage;
  const totalPages =
    activeTab === "Countries" ? totalCountryPages : totalStatePages;

  const isLoading =
    (activeTab === "Countries" && countriesLoading) ||
    (activeTab === "States/Provinces" && statesLoading);

  const isError =
    (activeTab === "Countries" && countriesError) ||
    (activeTab === "States/Provinces" && statesError);

  const isAddButtonDisabled =
    isCreatingCountry ||
    isUpdatingCountry ||
    isDeletingCountry ||
    isCreatingState ||
    isUpdatingState ||
    isDeletingState;

  // Helper function to show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  };

  // Country handlers
  const handleViewCountryDetails = (country: Country) => {
    setSelectedCountry(country);
    setIsCountryDetailsModalOpen(true);
  };

  const handleEditCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsEditCountryModalOpen(true);
  };

  const handleDeleteCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsDeleteCountryModalOpen(true);
  };

  const handleToggleCountryStatus = (country: Country) => {
    console.log("Toggle country status (API coming soon):", country.id);
  };

  const handleAddCountry = async (newCountry: NewCountry) => {
    const updatedBy = currentUser?.id ?? currentUserId;
    const payload: CreateCountryRequest = {
      name: newCountry.name,
      code: newCountry.code,
      currency: newCountry.currency,
      currencyCode: newCountry.currencyCode,
      currencySymbol: newCountry.currencySymbol,
      updatedBy,
    };
    try {
      await createCountry(payload).unwrap();
      setIsAddCountryModalOpen(false);
      showNotification("Country created successfully!", "success");
    } catch (err) {
      console.error("Failed to create country:", err);
      showNotification("Failed to create country. Please try again.", "error");
    }
  };

  const handleUpdateCountry = async (updatedCountry: Country) => {
    const updatedBy = currentUser?.id ?? currentUserId;
    const body: UpdateCountryRequest = {
      name: updatedCountry.name,
      code: updatedCountry.code,
      currency: updatedCountry.currency,
      currencyCode: updatedCountry.currencyCode,
      currencySymbol: updatedCountry.currencySymbol,
      updatedBy,
    };
    try {
      await updateCountry({ countryId: updatedCountry.id, body }).unwrap();
      setIsEditCountryModalOpen(false);
      showNotification("Country updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update country:", err);
      showNotification("Failed to update country. Please try again.", "error");
    }
  };

  const handleConfirmDeleteCountry = async () => {
    if (!selectedCountry) return;
    try {
      await deleteCountry(selectedCountry.id).unwrap();
      setIsDeleteCountryModalOpen(false);
      setSelectedCountry(null);
      showNotification("Country deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete country:", err);
      showNotification("Failed to delete country. Please try again.", "error");
    }
  };

  // State handlers
  const handleViewStateDetails = (state: State) => {
    setSelectedState(state);
    setIsStateDetailsModalOpen(true);
  };

  const handleEditState = (state: State) => {
    setSelectedState(state);
    setIsEditStateModalOpen(true);
  };

  const handleDeleteState = (state: State) => {
    setSelectedState(state);
    setIsDeleteStateModalOpen(true);
  };

  const handleToggleStateStatus = (state: State) => {
    console.log("Toggle state status (API coming soon):", state.id);
  };

  const handleAddState = async (newState: NewState) => {
    const updatedBy = currentUser?.id ?? currentUserId;
    const payload: CreateStateRequest = {
      name: newState.name,
      code: newState.code,
      countryId: newState.countryId,
      updatedBy,
    };
    try {
      await createState(payload).unwrap();
      setIsAddStateModalOpen(false);
      showNotification("State created successfully!", "success");
    } catch (err) {
      console.error("Failed to create state:", err);
      showNotification("Failed to create state. Please try again.", "error");
    }
  };

  const handleUpdateState = async (updatedState: State) => {
    const updatedBy = currentUser?.id ?? currentUserId;
    const body: UpdateStateRequest = {
      name: updatedState.name,
      code: updatedState.code,
      countryId: updatedState.countryId,
      updatedBy,
    };
    try {
      await updateState({ stateId: updatedState.id, body }).unwrap();
      setIsEditStateModalOpen(false);
      showNotification("State updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update state:", err);
      showNotification("Failed to update state. Please try again.", "error");
    }
  };

  const handleConfirmDeleteState = async () => {
    if (!selectedState) return;
    try {
      await deleteState(selectedState.id).unwrap();
      setIsDeleteStateModalOpen(false);
      setSelectedState(null);
      showNotification("State deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete state:", err);
      showNotification("Failed to delete state. Please try again.", "error");
    }
  };

  // Pagination
  const handlePageChange = (page: number) => {
    if (activeTab === "Countries") setCountryPage(page);
    else setStatePage(page);
  };

  const handleRetry = () => {
    if (activeTab === "Countries") refetchCountries();
    else refetchStates();
  };

  // UI helpers
  const getAddButtonText = () => {
    return activeTab === "Countries" ? "Add Country" : "Add State";
  };

  const handleAddButtonClick = () => {
    if (activeTab === "Countries") {
      setIsAddCountryModalOpen(true);
    } else {
      setIsAddStateModalOpen(true);
    }
  };

  // Stats
  const totalCountriesCount = countriesData?.count ?? 0;
  const totalStatesCount = statesData?.count ?? 0;

  const activeCountries = countries.filter((c) => !c.deletedAt).length;
  const activeStates = states.filter((s) => !s.deletedAt).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-72 w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>

                <button className="hidden lg:flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg flex-shrink-0">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                    Geography Management
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">
                    Manage countries and states for platform locations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs lg:text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  <span className="hidden lg:inline">Upgrade now</span>
                  <span className="lg:hidden">Upgrade</span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-3 sm:p-4 lg:p-6">
          {/* Add Button */}
          <div className="flex justify-end mb-4 sm:mb-6">
            <button
              onClick={handleAddButtonClick}
              disabled={isAddButtonDisabled}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {getAddButtonText()}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <StatCard
              title="Countries"
              value={totalCountriesCount.toString()}
              subtitle={`${activeCountries} active`}
              icon={Globe}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
            <StatCard
              title="States/Provinces"
              value={totalStatesCount.toString()}
              subtitle={`${activeStates} active`}
              icon={Map}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Platform Locations
                </h2>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg self-end sm:self-center"
                  aria-label="Download"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {(["Countries", "States/Provinces"] as TabType[]).map((tab) => {
                  const Icon = tab === "Countries" ? Globe : Map;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${activeTab === tab
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className={activeTab === tab ? "text-white" : ""}>
                        {tab}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12 sm:py-16 gap-3 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading data…</span>
              </div>
            )}

            {!isLoading && isError && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-3 text-red-500">
                <AlertCircle className="w-6 h-6" />
                <p className="text-sm">Failed to load data.</p>
                <button
                  onClick={handleRetry}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Retry
                </button>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                <GeographyTable
                  type={activeTab}
                  countries={countries}
                  states={states}
                  onViewCountryDetails={handleViewCountryDetails}
                  onEditCountry={handleEditCountry}
                  onDeleteCountry={handleDeleteCountry}
                  onToggleCountryStatus={handleToggleCountryStatus}
                  onViewStateDetails={handleViewStateDetails}
                  onEditState={handleEditState}
                  onDeleteState={handleDeleteState}
                  onToggleStateStatus={handleToggleStateStatus}
                />

                {totalPages > 0 && (
                  <div className="border-t border-gray-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Country Modals */}
      <AddCountryModal
        isOpen={isAddCountryModalOpen}
        onClose={() => setIsAddCountryModalOpen(false)}
        onSubmit={handleAddCountry}
      />
      <EditCountryModal
        isOpen={isEditCountryModalOpen}
        onClose={() => setIsEditCountryModalOpen(false)}
        country={selectedCountry}
        onSubmit={handleUpdateCountry}
        isLoading={isUpdatingCountry}
      />
      <DeleteCountryModal
        isOpen={isDeleteCountryModalOpen}
        onClose={() => setIsDeleteCountryModalOpen(false)}
        country={selectedCountry}
        onConfirm={handleConfirmDeleteCountry}
        isLoading={isDeletingCountry}
      />
      <CountryDetailsModal
        isOpen={isCountryDetailsModalOpen}
        onClose={() => setIsCountryDetailsModalOpen(false)}
        country={selectedCountry}
      />

      {/* State Modals */}
      <AddStateModal
        isOpen={isAddStateModalOpen}
        onClose={() => setIsAddStateModalOpen(false)}
        onSubmit={handleAddState}
        countries={countries}
      />
      <EditStateModal
        isOpen={isEditStateModalOpen}
        onClose={() => setIsEditStateModalOpen(false)}
        state={selectedState}
        onSubmit={handleUpdateState}
        countries={countries}
        isLoading={isUpdatingState}
      />
      <DeleteStateModal
        isOpen={isDeleteStateModalOpen}
        onClose={() => setIsDeleteStateModalOpen(false)}
        state={selectedState}
        onConfirm={handleConfirmDeleteState}
        isLoading={isDeletingState}
      />
      <StateDetailsModal
        isOpen={isStateDetailsModalOpen}
        onClose={() => setIsStateDetailsModalOpen(false)}
        state={selectedState}
      />
    </div>
  );
}

export default function GeographyManagementPage() {
  const currentUserId = getCurrentUserId();
  return <GeographyManagementPageInner currentUserId={currentUserId} />;
}

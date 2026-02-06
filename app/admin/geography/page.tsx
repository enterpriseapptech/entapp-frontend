"use client";

import { useState } from "react";
import {
  Globe,
  Map,
  MapPin,
  Settings,
  Bell,
  Download,
  Menu,
  Plus,
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
import AddCityModal from "@/components/geography/AddCityModal";
import EditCityModal from "@/components/geography/EditCityModal";
import DeleteCityModal from "@/components/geography/DeleteCityModal";
import CityDetailsModal from "@/components/geography/CityDetailsModal";

import type {
  Country,
  State,
  City,
  NewCountry,
  NewState,
  NewCity,
} from "@/types/geography.types";

// Mock data for countries
const mockCountries: Country[] = [
  {
    id: "1",
    countryName: "United States",
    code: "US",
    currency: "USD",
    currencySymbol: "$",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    countryName: "United Kingdom",
    code: "GB",
    currency: "GBP",
    currencySymbol: "£",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    countryName: "Canada",
    code: "CA",
    currency: "CAD",
    currencySymbol: "$",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
];

// Mock data for states
const mockStates: State[] = [
  {
    id: "1",
    stateName: "California",
    country: "United States",
    countryId: "1",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    stateName: "New York",
    country: "United States",
    countryId: "1",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    stateName: "Texas",
    country: "United States",
    countryId: "1",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    stateName: "Ontario",
    country: "Canada",
    countryId: "3",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
];

// Mock data for cities
const mockCities: City[] = [
  {
    id: "1",
    cityName: "Los Angeles",
    state: "California",
    stateId: "1",
    country: "United States",
    countryId: "1",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    cityName: "San Francisco",
    state: "California",
    stateId: "1",
    country: "United States",
    countryId: "1",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    cityName: "New York City",
    state: "New York",
    stateId: "2",
    country: "United States",
    countryId: "1",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    cityName: "Houston",
    state: "Texas",
    stateId: "3",
    country: "United States",
    countryId: "1",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    cityName: "Toronto",
    state: "Ontario",
    stateId: "4",
    country: "Canada",
    countryId: "3",
    status: "Active",
    lastUpdated: "2024-01-01",
    createdAt: "2024-01-01",
  },
];

type TabType = "Countries" | "States/Provinces" | "Cities";

export default function GeographyManagementPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("Countries");
  const totalPages = 10;

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

  const [isAddCityModalOpen, setIsAddCityModalOpen] = useState(false);
  const [isEditCityModalOpen, setIsEditCityModalOpen] = useState(false);
  const [isDeleteCityModalOpen, setIsDeleteCityModalOpen] = useState(false);
  const [isCityDetailsModalOpen, setIsCityDetailsModalOpen] = useState(false);

  // Selected item states
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

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
    console.log("Toggle country status:", country);
  };

  const handleAddCountry = (newCountry: NewCountry) => {
    console.log("Add new country:", newCountry);
    setIsAddCountryModalOpen(false);
  };

  const handleUpdateCountry = (updatedCountry: Country) => {
    console.log("Update country:", updatedCountry);
    setIsEditCountryModalOpen(false);
  };

  const handleConfirmDeleteCountry = () => {
    console.log("Delete country:", selectedCountry);
    setIsDeleteCountryModalOpen(false);
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
    console.log("Toggle state status:", state);
  };

  const handleAddState = (newState: NewState) => {
    console.log("Add new state:", newState);
    setIsAddStateModalOpen(false);
  };

  const handleUpdateState = (updatedState: State) => {
    console.log("Update state:", updatedState);
    setIsEditStateModalOpen(false);
  };

  const handleConfirmDeleteState = () => {
    console.log("Delete state:", selectedState);
    setIsDeleteStateModalOpen(false);
  };

  // City handlers
  const handleViewCityDetails = (city: City) => {
    setSelectedCity(city);
    setIsCityDetailsModalOpen(true);
  };

  const handleEditCity = (city: City) => {
    setSelectedCity(city);
    setIsEditCityModalOpen(true);
  };

  const handleDeleteCity = (city: City) => {
    setSelectedCity(city);
    setIsDeleteCityModalOpen(true);
  };

  const handleToggleCityStatus = (city: City) => {
    console.log("Toggle city status:", city);
  };

  const handleAddCity = (newCity: NewCity) => {
    console.log("Add new city:", newCity);
    setIsAddCityModalOpen(false);
  };

  const handleUpdateCity = (updatedCity: City) => {
    console.log("Update city:", updatedCity);
    setIsEditCityModalOpen(false);
  };

  const handleConfirmDeleteCity = () => {
    console.log("Delete city:", selectedCity);
    setIsDeleteCityModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate stats
  const totalCountries = mockCountries.length;
  const activeCountries = mockCountries.filter(
    (country) => country.status === "Active"
  ).length;
  const totalStates = mockStates.length;
  const activeStates = mockStates.filter(
    (state) => state.status === "Active"
  ).length;
  const totalCities = mockCities.length;
  const activeCities = mockCities.filter(
    (city) => city.status === "Active"
  ).length;

  // Get button text based on active tab
  const getAddButtonText = () => {
    switch (activeTab) {
      case "Countries":
        return "Add";
      case "States/Provinces":
        return "Add State";
      case "Cities":
        return "Add City";
      default:
        return "Add";
    }
  };

  // Handle add button click
  const handleAddButtonClick = () => {
    switch (activeTab) {
      case "Countries":
        setIsAddCountryModalOpen(true);
        break;
      case "States/Provinces":
        setIsAddStateModalOpen(true);
        break;
      case "Cities":
        setIsAddCityModalOpen(true);
        break;
    }
  };

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
                    Geography Management
                  </h1>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Manage countries, states, and cities for platform locations
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
          {/* Add Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleAddButtonClick}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              {getAddButtonText()}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Countries"
              value={totalCountries.toString()}
              subtitle={`${activeCountries} active`}
              icon={Globe}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-50"
            />
            <StatCard
              title="States/Provinces"
              value={totalStates.toString()}
              subtitle={`${activeStates} active`}
              icon={Map}
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
            />
            <StatCard
              title="Cities"
              value={totalCities.toString()}
              subtitle={`${activeCities} active`}
              icon={MapPin}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-50"
            />
          </div>

          {/* Geography Table Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Table Header with Tabs */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Platform Locations
                </h2>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Download"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("Countries")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === "Countries"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Countries
                </button>
                <button
                  onClick={() => setActiveTab("States/Provinces")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === "States/Provinces"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Map className="w-4 h-4" />
                  States/Provinces
                </button>
                <button
                  onClick={() => setActiveTab("Cities")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === "Cities"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Cities
                </button>
              </div>
            </div>

            {/* Geography Table */}
            <GeographyTable
              type={activeTab}
              countries={mockCountries}
              states={mockStates}
              cities={mockCities}
              onViewCountryDetails={handleViewCountryDetails}
              onEditCountry={handleEditCountry}
              onDeleteCountry={handleDeleteCountry}
              onToggleCountryStatus={handleToggleCountryStatus}
              onViewStateDetails={handleViewStateDetails}
              onEditState={handleEditState}
              onDeleteState={handleDeleteState}
              onToggleStateStatus={handleToggleStateStatus}
              onViewCityDetails={handleViewCityDetails}
              onEditCity={handleEditCity}
              onDeleteCity={handleDeleteCity}
              onToggleCityStatus={handleToggleCityStatus}
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
      />

      <DeleteCountryModal
        isOpen={isDeleteCountryModalOpen}
        onClose={() => setIsDeleteCountryModalOpen(false)}
        country={selectedCountry}
        onConfirm={handleConfirmDeleteCountry}
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
        countries={mockCountries}
      />

      <EditStateModal
        isOpen={isEditStateModalOpen}
        onClose={() => setIsEditStateModalOpen(false)}
        state={selectedState}
        onSubmit={handleUpdateState}
        countries={mockCountries}
      />

      <DeleteStateModal
        isOpen={isDeleteStateModalOpen}
        onClose={() => setIsDeleteStateModalOpen(false)}
        state={selectedState}
        onConfirm={handleConfirmDeleteState}
      />

      <StateDetailsModal
        isOpen={isStateDetailsModalOpen}
        onClose={() => setIsStateDetailsModalOpen(false)}
        state={selectedState}
      />

      {/* City Modals */}
      <AddCityModal
        isOpen={isAddCityModalOpen}
        onClose={() => setIsAddCityModalOpen(false)}
        onSubmit={handleAddCity}
        states={mockStates}
        countries={mockCountries}
      />

      <EditCityModal
        isOpen={isEditCityModalOpen}
        onClose={() => setIsEditCityModalOpen(false)}
        city={selectedCity}
        onSubmit={handleUpdateCity}
        states={mockStates}
        countries={mockCountries}
      />

      <DeleteCityModal
        isOpen={isDeleteCityModalOpen}
        onClose={() => setIsDeleteCityModalOpen(false)}
        city={selectedCity}
        onConfirm={handleConfirmDeleteCity}
      />

      <CityDetailsModal
        isOpen={isCityDetailsModalOpen}
        onClose={() => setIsCityDetailsModalOpen(false)}
        city={selectedCity}
      />
    </div>
  );
}

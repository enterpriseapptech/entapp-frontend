"use client";
import { Edit2, Trash2, ChevronRight, X, Search } from "lucide-react";
import Header from "@/components/layouts/Header";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CateringServiceSideBar from "@/components/layouts/CateringServiceSideBar";
import { useGetCateringsByServiceProviderQuery, useDeleteCateringMutation } from "../../../../redux/services/cateringApi";
import { useGetUserByIdQuery } from "../../../../redux/services/authApi";
import Notification from "../../../../components/ui/Notification";

type FilterType =
  | "location"
  | "status"
  | "ratings"
  | "cuisine"
  | "capacity"
  | "dishTypes";

interface CateringTableData {
  id: string;
  name: string;
  location: string;
  date: string;
  status: string;
  ratings: number;
  depositAmount: string;
  cuisine: string;
  minCapacity: string;
  maxCapacity: string;
  dishTypes: string;
  contactNumber: string;
}

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-50/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-[#0047AB] border-gray-200 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Loading Catering Services...
        </p>
      </div>
    </div>
  );
};

export default function ManageCatering() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State for managing filters
  const [filters, setFilters] = useState<{
    location: string | null;
    status: string | null;
    ratings: number | null;
    cuisine: string | null;
    capacity: string | null;
    dishTypes: string | null;
  }>({
    location: null,
    status: null,
    ratings: null,
    cuisine: null,
    capacity: null,
    dishTypes: null,
  });

  // State for search input
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for controlling the "More filters" dropdown
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [clickedFilter, setClickedFilter] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Retrieve user ID from storage
  const [userId, setUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cateringToDelete, setCateringToDelete] = useState<string | null>(null);
  const [deleteCatering, { isLoading: isDeleting }] = useDeleteCateringMutation();

  // Handle delete flow
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCateringToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!cateringToDelete) return;

    try {
      await deleteCatering(cateringToDelete).unwrap();
      setNotification({
        show: true,
        message: "Catering service deleted successfully",
        type: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      setNotification({
        show: true,
        message: "Failed to delete catering service",
        type: "error",
      });
    } finally {
      setShowDeleteModal(false);
      setCateringToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCateringToDelete(null);
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    const storedUserId =
      localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Fetch user data to get serviceProviderId
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  // Fetch catering services for the service provider
  const serviceProviderId = user?.serviceProvider?.id;
  const {
    data: cateringData,
    isLoading: isCateringLoading,
    error: cateringError,
  } = useGetCateringsByServiceProviderQuery(
    {
      serviceProviderId: serviceProviderId!,
      limit: 100,
      offset: 0,
    },
    {
      skip: !serviceProviderId,
    }
  );

  // Detect if the device is mobile based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Map API data to table format
  const cateringServices: CateringTableData[] =
    cateringData?.data?.map((service) => ({
      id: service.id,
      name: service.name || service.tagLine || "Catering Service",
      location: `${service.city}, ${service.state}`,
      date: new Date(service.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      status: service.status,
      ratings: service.rating || 0,
      depositAmount: `$${(service.depositAmount || 0).toLocaleString()}`,
      cuisine: service.cuisine?.join(", ") || "N/A",
      minCapacity: service.minCapacity?.toString() || "N/A",
      maxCapacity: service.maxCapacity?.toString() || "N/A",
      dishTypes: service.dishTypes?.join(", ") || "N/A",
      contactNumber: service.contact || "N/A",
    })) || [];

  // Extract unique values for each filter category
  const uniqueLocations = [...new Set(cateringServices.map((service) => service.location))];
  const uniqueStatuses = [...new Set(cateringServices.map((service) => service.status))];
  const uniqueRatings = [...new Set(cateringServices.map((service) => service.ratings))].sort((a, b) => a - b);
  const uniqueCuisines = [...new Set(cateringServices.flatMap(service => service.cuisine.split(", ")))];
  const uniqueCapacities = [...new Set(cateringServices.map(service => `${service.minCapacity}-${service.maxCapacity}`))];
  const uniqueDishTypes = [...new Set(cateringServices.flatMap(service => service.dishTypes.split(", ")))];

  // Apply filters to the data
  const filteredCateringServices = cateringServices.filter((service) => {
    return (
      (!filters.location || service.location === filters.location) &&
      (!filters.status || service.status === filters.status) &&
      (filters.ratings === null || service.ratings === filters.ratings) &&
      (!filters.cuisine || service.cuisine.includes(filters.cuisine)) &&
      (!filters.capacity || `${service.minCapacity}-${service.maxCapacity}` === filters.capacity) &&
      (!filters.dishTypes || service.dishTypes.includes(filters.dishTypes))
    );
  });

  // Apply search to the filtered data
  const searchedCateringServices = filteredCateringServices.filter((service) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      service.id.toLowerCase().includes(query) ||
      service.name.toLowerCase().includes(query) ||
      service.location.toLowerCase().includes(query) ||
      service.date.toLowerCase().includes(query) ||
      service.status.toLowerCase().includes(query) ||
      service.depositAmount.toLowerCase().includes(query) ||
      service.cuisine.toLowerCase().includes(query) ||
      service.minCapacity.toLowerCase().includes(query) ||
      service.maxCapacity.toLowerCase().includes(query) ||
      service.dishTypes.toLowerCase().includes(query) ||
      service.contactNumber.toLowerCase().includes(query)
    );
  });

  // Calculate total pages based on searched and filtered data
  const totalPages = Math.ceil(searchedCateringServices.length / itemsPerPage);

  // Get the catering services for the current page
  const paginatedCateringServices = searchedCateringServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // Handle filter application
  const applyFilter = (
    filterType: FilterType,
    value: string | number | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
    setIsFilterDropdownOpen(false);
    setClickedFilter(null);
  };

  // Handle filter removal
  const removeFilter = (filterType: FilterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: null,
    }));
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle sub-dropdown toggle on mobile
  const toggleSubDropdown = (filter: string) => {
    setClickedFilter((prev) => (prev === filter ? null : filter));
  };

  // Handle navigation to the details page
  const handleViewCateringService = (service: CateringTableData) => {
    router.push(
      `/cateringServiceManagement/catering-service-details?id=${encodeURIComponent(
        service.id
      )}&name=${encodeURIComponent(service.name)}&location=${encodeURIComponent(
        service.location
      )}&date=${encodeURIComponent(service.date)}&status=${encodeURIComponent(
        service.status
      )}&ratings=${service.ratings}&depositAmount=${encodeURIComponent(
        service.depositAmount
      )}&cuisine=${encodeURIComponent(
        service.cuisine
      )}&minCapacity=${encodeURIComponent(
        service.minCapacity
      )}&maxCapacity=${encodeURIComponent(
        service.maxCapacity
      )}&dishTypes=${encodeURIComponent(
        service.dishTypes
      )}&contactNumber=${encodeURIComponent(service.contactNumber)}`
    );
  };

  // Show loading state
  if (isUserLoading || isCateringLoading || !userId) {
    return <LoadingSpinner />;
  }

  // Handle errors
  if (userError || cateringError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">
          Error loading catering services. Please try again.
        </p>
      </div>
    );
  }

  // Handle empty data state
  if (!cateringData?.data?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CateringServiceSideBar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="md:ml-[280px]">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <main className="md:p-10 p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="md:text-xl text-md font-bold text-gray-950">
                Manage Catering Services
              </h1>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium">
                  <Image
                    width={10}
                    height={10}
                    alt="import"
                    src="/import.png"
                    className="w-5 h-5"
                    unoptimized
                  />
                  <span>Import</span>
                </button>
                <Link href="/cateringServiceManagement/add-catering-services">
                  <button className="flex items-center gap-3 px-5 py-1.5 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 text-sm font-medium cursor-pointer">
                    <Image
                      width={10}
                      height={10}
                      alt="add"
                      src="/add.png"
                      className="w-4 h-4"
                      unoptimized
                    />
                    <span>Add</span>
                  </button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-white shadow p-6 text-center">
              <p className="text-gray-600 text-sm">
                No catering services found. Click Add to create a new catering service.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CateringServiceSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="md:ml-[280px]">
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Manage Catering Content */}
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="md:text-xl text-md font-bold text-gray-950">
              Manage Catering Services
            </h1>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium">
                <Image
                  width={10}
                  height={10}
                  alt="import"
                  src="/import.png"
                  className="w-5 h-5"
                  unoptimized
                />
                <span>Import</span>
              </button>
              <Link href="/cateringServiceManagement/add-catering-services">
                <button className="flex items-center gap-3 px-5 py-1.5 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 text-sm font-medium cursor-pointer">
                  <Image
                    width={10}
                    height={10}
                    alt="add"
                    src="/add.png"
                    className="w-4 h-4"
                    unoptimized
                  />
                  <span>Add</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Catering Services Table */}
          <div className="rounded-lg border bg-white shadow">
            {/* Filters and Search */}
            <div className="p-6">
              <div className="flex md:flex-row flex-col justify-between md:items-center items-start gap-5">
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(filters).map(([key, value]) =>
                    value ? (
                      <button
                        key={key}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium cursor-pointer"
                        onClick={() => removeFilter(key as FilterType)}
                      >
                        <span>
                          {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        </span>
                        <X className="w-3 h-3" />
                      </button>
                    ) : null
                  )}

                  <div className="relative">
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium cursor-pointer"
                      onClick={() =>
                        setIsFilterDropdownOpen(!isFilterDropdownOpen)
                      }
                    >
                      <Image
                        src="/filterIcon.png"
                        alt="Filter Icon"
                        width={10}
                        height={10}
                        className="w-4 h-4"
                        unoptimized
                      />
                      <span>More Filters</span>
                    </button>

                    {isFilterDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          {/* Location Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("location")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("location")
                              }
                            >
                              Location
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "location"
                              : hoveredFilter === "location") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueLocations.map((location) => (
                                  <button
                                    key={location}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("location", location)
                                    }
                                  >
                                    {location}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Status Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("status")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("status")
                              }
                            >
                              Status
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "status"
                              : hoveredFilter === "status") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueStatuses.map((status) => (
                                  <button
                                    key={status}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("status", status)
                                    }
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Ratings Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("ratings")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("ratings")
                              }
                            >
                              Ratings
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "ratings"
                              : hoveredFilter === "ratings") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueRatings.map((rating) => (
                                  <button
                                    key={rating}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("ratings", rating)
                                    }
                                  >
                                    {rating} Star{rating !== 1 ? "s" : ""}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Cuisine Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("cuisine")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("cuisine")
                              }
                            >
                              Cuisine
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "cuisine"
                              : hoveredFilter === "cuisine") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueCuisines.map((cuisine) => (
                                  <button
                                    key={cuisine}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("cuisine", cuisine)
                                    }
                                  >
                                    {cuisine}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Capacity Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("capacity")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("capacity")
                              }
                            >
                              Capacity
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "capacity"
                              : hoveredFilter === "capacity") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueCapacities.map((capacity) => (
                                  <button
                                    key={capacity}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("capacity", capacity)
                                    }
                                  >
                                    {capacity}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Dish Types Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("dishTypes")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("dishTypes")
                              }
                            >
                              Dish Types
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "dishTypes"
                              : hoveredFilter === "dishTypes") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueDishTypes.map((dishType) => (
                                  <button
                                    key={dishType}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("dishTypes", dishType)
                                    }
                                  >
                                    {dishType}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Search Input */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-200 focus:ring-1 focus:ring-purple-100"
                  />
                </div>
              </div>
            </div>

            {/* Table with Horizontal Scroll */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[800px]">
                <thead>
                  <tr className="border-t">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Catering ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Date Added
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Ratings
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Deposit Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCateringServices.map((service, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewCateringService(service)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {service.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {service.date}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            service.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < service.ratings
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {service.depositAmount}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            className="rounded-lg p-1 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/cateringServiceManagement/edit-catering?id=${service.id}`
                              );
                            }}
                          >
                            <Edit2 className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            className="rounded-lg p-1 hover:bg-gray-100"
                            onClick={(e) => handleDeleteClick(e, service.id)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-600 cursor-pointer" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t md:flex-wrap gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1 text-sm text-gray-600 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
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
                className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1 text-sm text-gray-600 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
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
          </div>
        </main>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Are you sure you want to delete this catering service?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All data associated with this catering service will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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

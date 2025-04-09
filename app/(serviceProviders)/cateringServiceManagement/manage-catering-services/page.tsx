"use client";
import { Edit2, Trash2, ChevronRight, X } from "lucide-react";
import Header from "@/components/layouts/Header";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import CateringServiceSideBar from "@/components/layouts/CateringServiceSideBar";

type FilterType = "location" | "status" | "ratings" | "dateAdded" | "availability";

export default function ManageCateringServices() {
  const router = useRouter(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State for managing filters
  const [filters, setFilters] = useState<{
    location: string | null;
    status: string | null;
    ratings: number | null;
    dateAdded: string | null;
    availability: string | null;
  }>({
    location: null,
    status: null,
    ratings: null,
    dateAdded: null,
    availability: null,
  });

  // State for search input
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for controlling the "More filters" dropdown
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [clickedFilter, setClickedFilter] = useState<string | null>(null); 
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect if the device is mobile based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's `md` breakpoint
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sample data for catering services
  const cateringServices = [
    {
      id: "CAT-1001",
      name: "Delightful Bites",
      location: "Nigeria",
      date: "Apr 10, 2025, 12:00 PM",
      status: "Active",
      ratings: 5,
      revenue: "$5,000",
      dateAdded: "2025-04-01",
      availability: "Available",
    },
    {
      id: "CAT-1002",
      name: "Savory Catering",
      location: "USA",
      date: "Apr 11, 2025, 1:00 PM",
      status: "Confirmed",
      ratings: 4,
      revenue: "$7,000",
      dateAdded: "2025-04-02",
      availability: "Booked",
    },
    {
      id: "CAT-1003",
      name: "Tasty Treats",
      location: "UK",
      date: "Apr 12, 2025, 2:00 PM",
      status: "Pending",
      ratings: 3,
      revenue: "$4,500",
      dateAdded: "2025-04-03",
      availability: "Available",
    },
    {
      id: "CAT-1004",
      name: "Gourmet Eats",
      location: "Nigeria",
      date: "Apr 13, 2025, 3:00 PM",
      status: "Active",
      ratings: 2,
      revenue: "$6,000",
      dateAdded: "2025-04-04",
      availability: "Booked",
    },
    {
      id: "CAT-1005",
      name: "Flavor Fusion",
      location: "USA",
      date: "Apr 14, 2025, 4:00 PM",
      status: "Confirmed",
      ratings: 5,
      revenue: "$8,000",
      dateAdded: "2025-04-05",
      availability: "Available",
    },
    {
      id: "CAT-1006",
      name: "CaterJoy",
      location: "UK",
      date: "Apr 15, 2025, 5:00 PM",
      status: "Pending",
      ratings: 1,
      revenue: "$3,500",
      dateAdded: "2025-04-06",
      availability: "Booked",
    },
    {
      id: "CAT-1007",
      name: "FeastMasters",
      location: "Nigeria",
      date: "Apr 16, 2025, 6:00 PM",
      status: "Active",
      ratings: 4,
      revenue: "$5,500",
      dateAdded: "2025-04-07",
      availability: "Available",
    },
    {
      id: "CAT-1008",
      name: "Epicurean Delights",
      location: "USA",
      date: "Apr 17, 2025, 7:00 PM",
      status: "Confirmed",
      ratings: 3,
      revenue: "$6,500",
      dateAdded: "2025-04-08",
      availability: "Booked",
    },
    {
      id: "CAT-1009",
      name: "Cuisine Crafters",
      location: "UK",
      date: "Apr 18, 2025, 8:00 PM",
      status: "Pending",
      ratings: 2,
      revenue: "$4,000",
      dateAdded: "2025-04-09",
      availability: "Available",
    },
    {
      id: "CAT-1010",
      name: "Bite Bliss",
      location: "Nigeria",
      date: "Apr 19, 2025, 9:00 PM",
      status: "Active",
      ratings: 5,
      revenue: "$7,500",
      dateAdded: "2025-04-10",
      availability: "Booked",
    },
  ];

  // Extract unique values for each filter category
  const uniqueLocations = [...new Set(cateringServices.map((service) => service.location))];
  const uniqueStatuses = [...new Set(cateringServices.map((service) => service.status))];
  const uniqueRatings = [...new Set(cateringServices.map((service) => service.ratings))].sort(
    (a, b) => a - b
  );
  const uniqueDateAdded = [...new Set(cateringServices.map((service) => service.dateAdded))].sort();
  const availabilityOptions = ["Available", "Booked"];

  // Apply filters to the data
  const filteredCateringServices = cateringServices.filter((service) => {
    return (
      (!filters.location || service.location === filters.location) &&
      (!filters.status || service.status === filters.status) &&
      (filters.ratings === null || service.ratings === filters.ratings) &&
      (!filters.dateAdded || service.dateAdded === filters.dateAdded) &&
      (!filters.availability || service.availability === filters.availability)
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
      service.revenue.toLowerCase().includes(query) ||
      service.dateAdded.toLowerCase().includes(query) ||
      service.availability.toLowerCase().includes(query)
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
  const applyFilter = (filterType: FilterType, value: string | number | null) => {
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

  // Define the CateringService type (added)
  type CateringService = {
    id: string;
    name: string;
    location: string;
    date: string;
    status: string;
    ratings: number;
    revenue: string;
    dateAdded: string;
    availability: string;
  };

  // Handle navigation to the details page (added)
  const handleViewCateringService = (service: CateringService) => {
    router.push(
      `/cateringServiceManagement/catering-service-details?id=${encodeURIComponent(
        service.id
      )}&name=${encodeURIComponent(service.name)}&location=${encodeURIComponent(
        service.location
      )}&date=${encodeURIComponent(service.date)}&status=${encodeURIComponent(
        service.status
      )}&ratings=${service.ratings}&revenue=${encodeURIComponent(
        service.revenue
      )}&dateAdded=${encodeURIComponent(
        service.dateAdded
      )}&availability=${encodeURIComponent(service.availability)}`
    );
  };

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

        {/* Manage Catering Services Content */}
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
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium"
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
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-200 text-sm font-medium"
                      onClick={() =>
                        setIsFilterDropdownOpen(!isFilterDropdownOpen)
                      }
                    >
                      <Image
                        width={10}
                        height={10}
                        alt="filter"
                        src="/filterIcon.png"
                        className="w-4 h-4"
                        unoptimized
                      />
                      <span>More filters</span>
                    </button>

                    {isFilterDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          {/* Location Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() => !isMobile && setHoveredFilter("location")}
                            onMouseLeave={() => !isMobile && setHoveredFilter(null)}
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => isMobile && toggleSubDropdown("location")}
                            >
                              Location
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile ? clickedFilter === "location" : hoveredFilter === "location") && (
                              <div className={`absolute ${isMobile ? "left-0 top-full mt-1 bg-gray-900 z-20" : "left-full top-0 bg-white"} w-48 border border-gray-200 rounded-lg shadow-lg`}>
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
                            onMouseEnter={() => !isMobile && setHoveredFilter("status")}
                            onMouseLeave={() => !isMobile && setHoveredFilter(null)}
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => isMobile && toggleSubDropdown("status")}
                            >
                              Status
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile ? clickedFilter === "status" : hoveredFilter === "status") && (
                              <div className={`absolute ${isMobile ? "left-0 top-full mt-1 bg-gray-900 z-20" : "left-full top-0 bg-white"} w-48 border border-gray-200 rounded-lg shadow-lg`}>
                                {uniqueStatuses.map((status) => (
                                  <button
                                    key={status}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => applyFilter("status", status)}
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
                            onMouseEnter={() => !isMobile && setHoveredFilter("ratings")}
                            onMouseLeave={() => !isMobile && setHoveredFilter(null)}
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => isMobile && toggleSubDropdown("ratings")}
                            >
                              Ratings
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile ? clickedFilter === "ratings" : hoveredFilter === "ratings") && (
                              <div className={`absolute ${isMobile ? "left-0 top-full mt-1 bg-gray-900 z-20" : "left-full top-0 bg-white"} w-48 border border-gray-200 rounded-lg shadow-lg`}>
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

                          {/* Date Added Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() => !isMobile && setHoveredFilter("dateAdded")}
                            onMouseLeave={() => !isMobile && setHoveredFilter(null)}
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => isMobile && toggleSubDropdown("dateAdded")}
                            >
                              Date Added
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile ? clickedFilter === "dateAdded" : hoveredFilter === "dateAdded") && (
                              <div className={`absolute ${isMobile ? "left-0 top-full mt-1 bg-gray-900 z-20" : "left-full top-0 bg-white"} w-48 border border-gray-200 rounded-lg shadow-lg`}>
                                {uniqueDateAdded.map((date) => (
                                  <button
                                    key={date}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("dateAdded", date)
                                    }
                                  >
                                    {date}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Availability Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() => !isMobile && setHoveredFilter("availability")}
                            onMouseLeave={() => !isMobile && setHoveredFilter(null)}
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => isMobile && toggleSubDropdown("availability")}
                            >
                              Availability
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile ? clickedFilter === "availability" : hoveredFilter === "availability") && (
                              <div className={`absolute ${isMobile ? "left-0 top-full mt-1 bg-gray-900 z-20" : "left-full top-0 bg-white"} w-48 border border-gray-200 rounded-lg shadow-lg`}>
                                {availabilityOptions.map((option) => (
                                  <label
                                    key={option}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <input
                                      type="radio"
                                      name="availability"
                                      value={option}
                                      checked={filters.availability === option}
                                      onChange={() =>
                                        applyFilter("availability", option)
                                      }
                                      className="mr-2"
                                    />
                                    {option}
                                  </label>
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
                      Next Booking
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Ratings
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Revenue
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
                      className="border-t hover:bg-gray-50 cursor-pointer" // Added hover and cursor styles
                      onClick={() => handleViewCateringService(service)} // Added onClick handler
                    >
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {service.id}
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
                            service.status === "Active"
                              ? "bg-green-50 text-green-700"
                              : service.status === "Confirmed"
                              ? "bg-blue-50 text-blue-700"
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
                        {service.revenue}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex gap-2">
                          <button className="rounded-lg p-1 hover:bg-gray-100">
                            <Edit2 className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="rounded-lg p-1 hover:bg-gray-100">
                            <Trash2 className="h-4 w-4 text-gray-600" />
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
    </div>
  );
}
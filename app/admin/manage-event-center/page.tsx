"use client";
import { Edit2, Trash2, ChevronRight, X } from "lucide-react";
import SideBar from "@/components/layouts/SideBar";
import Header from "@/components/layouts/Header";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type FilterType = "location" | "status" | "ratings" | "dateAdded" | "bookingAvailability";

export default function ManageEventCenter() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State for managing filters
  const [filters, setFilters] = useState<{
    location: string | null;
    status: string | null;
    ratings: number | null;
    dateAdded: string | null;
    bookingAvailability: string | null;
  }>({
    location: null,
    status: null,
    ratings: null,
    dateAdded: null,
    bookingAvailability: null,
  });

  // State for search input
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for controlling the "More filters" dropdown
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [clickedFilter, setClickedFilter] = useState<string | null>(null); // For mobile click events
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect if the device is mobile based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's `md` breakpoint
    };

    // Set initial value
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sample data for the event centers (with additional fields for filtering)
  const eventCenters = [
    {
      id: "BK-10234",
      name: "Jonnuel Doe",
      location: "Nigeria",
      date: "Feb 2, 2025, 5:00 PM",
      status: "Active",
      ratings: 5,
      revenue: "$10,000",
      dateAdded: "2025-02-01",
      bookingAvailability: "Available",
    },
    {
      id: "BK-10235",
      name: "Jonnuel Doe",
      location: "USA",
      date: "Feb 3, 2025, 5:00 PM",
      status: "Confirmed",
      ratings: 4,
      revenue: "$12,000",
      dateAdded: "2025-02-02",
      bookingAvailability: "Booked",
    },
    {
      id: "BK-10236",
      name: "Jonnuel Doe",
      location: "Event Center",
      date: "Feb 4, 2025, 5:00 PM",
      status: "Confirmed",
      ratings: 0,
      revenue: "$10,000",
      dateAdded: "2025-02-03",
      bookingAvailability: "Available",
    },
    {
      id: "BK-10237",
      name: "Jonnuel Doe",
      location: "Nigeria",
      date: "Feb 5, 2025, 5:00 PM",
      status: "Confirmed",
      ratings: 3,
      revenue: "$8,000",
      dateAdded: "2025-02-04",
      bookingAvailability: "Booked",
    },
    {
      id: "BK-10238",
      name: "Jonnuel Doe",
      location: "USA",
      date: "Feb 6, 2025, 5:00 PM",
      status: "Active",
      ratings: 2,
      revenue: "$15,000",
      dateAdded: "2025-02-05",
      bookingAvailability: "Available",
    },
    {
      id: "BK-10239",
      name: "Jonnuel Doe",
      location: "Event Center",
      date: "Feb 7, 2025, 5:00 PM",
      status: "Confirmed",
      ratings: 0,
      revenue: "$10,000",
      dateAdded: "2025-02-06",
      bookingAvailability: "Booked",
    },
    {
      id: "BK-10240",
      name: "Jonnuel Doe",
      location: "Nigeria",
      date: "Feb 8, 2025, 5:00 PM",
      status: "Active",
      ratings: 5,
      revenue: "$10,000",
      dateAdded: "2025-02-07",
      bookingAvailability: "Available",
    },
    {
      id: "BK-10241",
      name: "Jonnuel Doe",
      location: "USA",
      date: "Feb 9, 2025, 5:00 PM",
      status: "Confirmed",
      ratings: 1,
      revenue: "$10,000",
      dateAdded: "2025-02-08",
      bookingAvailability: "Booked",
    },
    {
      id: "BK-10242",
      name: "Jonnuel Doe",
      location: "Event Center",
      date: "Feb 10, 2025, 5:00 PM",
      status: "Confirmed",
      ratings: 0,
      revenue: "$10,000",
      dateAdded: "2025-02-09",
      bookingAvailability: "Available",
    },
    {
      id: "BK-10243",
      name: "Jonnuel Doe",
      location: "Nigeria",
      date: "Feb 11, 2025, 5:00 PM",
      status: "Confirmed",
      ratings: 0,
      revenue: "$10,000",
      dateAdded: "2025-02-10",
      bookingAvailability: "Booked",
    },
  ];

  // Extract unique values for each filter category
  const uniqueLocations = [...new Set(eventCenters.map((center) => center.location))];
  const uniqueStatuses = [...new Set(eventCenters.map((center) => center.status))];
  const uniqueRatings = [...new Set(eventCenters.map((center) => center.ratings))].sort(
    (a, b) => a - b
  );
  const uniqueDateAdded = [...new Set(eventCenters.map((center) => center.dateAdded))].sort();
  const bookingAvailabilityOptions = ["Available", "Booked"];

  // Apply filters to the data
  const filteredEventCenters = eventCenters.filter((center) => {
    return (
      (!filters.location || center.location === filters.location) &&
      (!filters.status || center.status === filters.status) &&
      (filters.ratings === null || center.ratings === filters.ratings) &&
      (!filters.dateAdded || center.dateAdded === filters.dateAdded) &&
      (!filters.bookingAvailability ||
        center.bookingAvailability === filters.bookingAvailability)
    );
  });

  // Apply search to the filtered data
  const searchedEventCenters = filteredEventCenters.filter((center) => {
    if (!searchQuery) return true; // If no search query, return all filtered data
    const query = searchQuery.toLowerCase();
    return (
      center.id.toLowerCase().includes(query) ||
      center.name.toLowerCase().includes(query) ||
      center.location.toLowerCase().includes(query) ||
      center.date.toLowerCase().includes(query) ||
      center.status.toLowerCase().includes(query) ||
      center.revenue.toLowerCase().includes(query) ||
      center.dateAdded.toLowerCase().includes(query) ||
      center.bookingAvailability.toLowerCase().includes(query)
    );
  });

  // Calculate total pages based on searched and filtered data
  const totalPages = Math.ceil(searchedEventCenters.length / itemsPerPage);

  // Get the event centers for the current page
  const paginatedEventCenters = searchedEventCenters.slice(
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
    setCurrentPage(1); // Reset to first page when applying a filter
    setIsFilterDropdownOpen(false); // Close the dropdown after selecting a filter
    setClickedFilter(null); // Close sub-dropdown on mobile
  };

  // Handle filter removal
  const removeFilter = (filterType: FilterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: null,
    }));
    setCurrentPage(1); // Reset to first page when removing a filter
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  // Handle sub-dropdown toggle on mobile
  const toggleSubDropdown = (filter: string) => {
    setClickedFilter((prev) => (prev === filter ? null : filter));
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

        {/* Manage Event Center Content */}
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="md:text-xl text-md font-bold text-gray-950">
              Manage Event Center
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
              <Link href="/admin/add-event-center">
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

          {/* Event Centers Table */}
          <div className="rounded-lg border bg-white shadow">
            {/* Filters and Search */}
            <div className="p-6">
              <div className="flex md:flex-row flex-col justify-between md:items-center items-start gap-5">
                <div className="flex gap-2 flex-wrap">
                  {/* Display applied filters as removable tags */}
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
                  {/* More Filters Button with Dropdown */}
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

                    {/* Filter Dropdown */}
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
                              <div className={`absolute ${isMobile ? "left-0 top-full mt-1 bg-gray-900 z-20" : "left-full top-0 bg-white"} w-48  border border-gray-200 rounded-lg shadow-lg`}>
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
                              <div className={`absolute${isMobile ? "left-0 top-full mt-1 bg-gray-900 z-20" : "left-full top-0 bg-white"} w-48  border border-gray-200 rounded-lg shadow-lg`}>
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

                          {/* Booking Availability Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() => !isMobile && setHoveredFilter("bookingAvailability")}
                            onMouseLeave={() => !isMobile && setHoveredFilter(null)}
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => isMobile && toggleSubDropdown("bookingAvailability")}
                            >
                              Booking Availability
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile ? clickedFilter === "bookingAvailability" : hoveredFilter === "bookingAvailability") && (
                              <div className={`absolute${isMobile ? "left-0 top-full mt-1 bg-gray-900 z-20" : "left-full top-0 bg-white"} w-48 border border-gray-200 rounded-lg shadow-lg`}>
                                {bookingAvailabilityOptions.map((option) => (
                                  <label
                                    key={option}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <input
                                      type="radio"
                                      name="bookingAvailability"
                                      value={option}
                                      checked={
                                        filters.bookingAvailability === option
                                      }
                                      onChange={() =>
                                        applyFilter("bookingAvailability", option)
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
                      Event Center ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Names
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Date and Time
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
                  {paginatedEventCenters.map((center, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {center.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {center.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {center.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {center.date}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            center.status === "Active"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {center.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < center.ratings
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
                        {center.revenue}
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
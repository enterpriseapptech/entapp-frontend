"use client";
import { ChevronRight, X, MoreVertical } from "lucide-react";
import SideBar from "@/components/layouts/SideBar";
import Header from "@/components/layouts/Header";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

type FilterType = "profileStatus" | "role" | "created" | "ratings";

export default function ManageUsers() {
  const router = useRouter(); // Initialize useRouter
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null); // Track which row's dropdown is open

  // State for managing filters
  const [filters, setFilters] = useState<{
    profileStatus: string | null;
    role: string | null;
    created: string | null;
    ratings: string | null;
  }>({
    profileStatus: null,
    role: null,
    created: null,
    ratings: null,
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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Updated data to match the 7-column structure in the image
  const bookings = [
    {
      fullName: "Jonnel Doe",
      email: "example@email.com",
      phoneNumber: "08012484371",
      profileStatus: "Active",
      role: "Event Hall Booker",
      created: "Feb 2, 2025, 5:00 PM",
      ratings: "Pending",
    },
    {
      fullName: "Jonnel Doe",
      email: "example@email.com",
      phoneNumber: "08012484371",
      profileStatus: "Confirmed",
      role: "Catering Service Provider",
      created: "Feb 2, 2025, 5:00 PM",
      ratings: "Confirmed",
    },
    {
      fullName: "Jonnel Doe",
      email: "example@email.com",
      phoneNumber: "08012484371",
      profileStatus: "Confirmed",
      role: "Event Hall Booker",
      created: "Feb 2, 2025, 5:00 PM",
      ratings: "Confirmed",
    },
    {
      fullName: "Jonnel Doe",
      email: "example@email.com",
      phoneNumber: "08012484371",
      profileStatus: "Confirmed",
      role: "Catering Service Provider",
      created: "Feb 2, 2025, 5:00 PM",
      ratings: "Confirmed",
    },
    {
      fullName: "Jonnel Doe",
      email: "example@email.com",
      phoneNumber: "08012484371",
      profileStatus: "Confirmed",
      role: "Event Hall Booker",
      created: "Feb 2, 2025, 5:00 PM",
      ratings: "Confirmed",
    },
    {
      fullName: "Jonnel Doe",
      email: "example@email.com",
      phoneNumber: "08012484371",
      profileStatus: "Confirmed",
      role: "Event Hall Booker",
      created: "Feb 2, 2025, 5:00 PM",
      ratings: "Confirmed",
    },
    {
      fullName: "Jonnel Doe",
      email: "example@email.com",
      phoneNumber: "08012484371",
      profileStatus: "Confirmed",
      role: "Event Hall Booker",
      created: "Feb 2, 2025, 5:00 PM",
      ratings: "Confirmed",
    },
    {
      fullName: "Jonnel Doe",
      email: "example@email.com",
      phoneNumber: "08012484371",
      profileStatus: "Confirmed",
      role: "Event Hall Booker",
      created: "Feb 2, 2025, 5:00 PM",
      ratings: "Confirmed",
    },
    {
      fullName: "Kate Doe",
      email: "kate@email.com",
      phoneNumber: "09012484371",
      profileStatus: "Confirmed",
      role: "Event Hall Booker",
      created: "Feb 3, 2025, 5:00 PM",
      ratings: "Confirmed",
    },
  ];

  // Extract unique values for each filter category
  const uniqueProfileStatuses = [
    ...new Set(bookings.map((booking) => booking.profileStatus)),
  ];
  const uniqueRoles = [...new Set(bookings.map((booking) => booking.role))];
  const uniqueCreatedDates = [
    ...new Set(bookings.map((booking) => booking.created)),
  ].sort();
  const uniqueRatings = [
    ...new Set(bookings.map((booking) => booking.ratings)),
  ];

  // Apply filters to the data
  const filteredBookings = bookings.filter((booking) => {
    return (
      (!filters.profileStatus ||
        booking.profileStatus === filters.profileStatus) &&
      (!filters.role || booking.role === filters.role) &&
      (!filters.created || booking.created === filters.created) &&
      (!filters.ratings || booking.ratings === filters.ratings)
    );
  });

  // Apply search to the filtered data
  const searchedBookings = filteredBookings.filter((booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.fullName.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.phoneNumber.toLowerCase().includes(query) ||
      booking.profileStatus.toLowerCase().includes(query) ||
      booking.role.toLowerCase().includes(query) ||
      booking.created.toLowerCase().includes(query) ||
      booking.ratings.toLowerCase().includes(query)
    );
  });

  // Calculate total pages based on searched and filtered data
  const totalPages = Math.ceil(searchedBookings.length / itemsPerPage);

  // Get the bookings for the current page
  const paginatedBookings = searchedBookings.slice(
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
  const applyFilter = (filterType: FilterType, value: string | null) => {
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

  // Toggle dropdown for View/Delete actions
  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  // Handle navigation to the details page
  type Booking = {
    fullName: string;
    email: string;
    phoneNumber: string;
    profileStatus: string;
    role: string;
    created: string;
    ratings: string;
  };

  const handleViewBooking = (booking: Booking) => {
    // Pass booking data as query parameters
    router.push(
      `/admin/users-details?fullName=${encodeURIComponent(
        booking.fullName
      )}&email=${encodeURIComponent(booking.email)}&phoneNumber=${
        booking.phoneNumber
      }&profileStatus=${encodeURIComponent(
        booking.profileStatus
      )}&role=${encodeURIComponent(booking.role)}&created=${encodeURIComponent(
        booking.created
      )}&ratings=${encodeURIComponent(booking.ratings)}`
    );
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

        {/* Manage Bookings Content */}
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="md:text-xl text-md font-bold text-gray-950">
              Manage Users
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
              <Link href="/admin/add-booking">
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

          {/* Bookings Table */}
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
                          {/* Profile Status Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("profileStatus")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("profileStatus")
                              }
                            >
                              Profile Status
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "profileStatus"
                              : hoveredFilter === "profileStatus") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueProfileStatuses.map((status) => (
                                  <button
                                    key={status}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("profileStatus", status)
                                    }
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Role Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("role")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("role")
                              }
                            >
                              Role
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "role"
                              : hoveredFilter === "role") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueRoles.map((role) => (
                                  <button
                                    key={role}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => applyFilter("role", role)}
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Created Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("created")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("created")
                              }
                            >
                              Created
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "created"
                              : hoveredFilter === "created") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueCreatedDates.map((date) => (
                                  <button
                                    key={date}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => applyFilter("created", date)}
                                  >
                                    {date}
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
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                                    {rating}
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
                      Full Names
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Profile Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Ratings
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      {/* Empty header for the dropdown button */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewBooking(booking)} // Navigate on row click
                    >
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {booking.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {booking.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {booking.phoneNumber}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            booking.profileStatus === "Active"
                              ? "bg-green-50 text-green-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {booking.profileStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {booking.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {booking.created}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            booking.ratings === "Pending"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {booking.ratings}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-sm whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking dropdown
                      >
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </button>
                        {dropdownOpen === index && (
                          <div className="absolute right-4 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="flex flex-col">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                onClick={() => handleViewBooking(booking)} // Navigate on View click
                              >
                                View
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  console.log(
                                    `Delete booking: ${booking.fullName}`
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
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
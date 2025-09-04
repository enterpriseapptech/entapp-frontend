"use client";
import { ChevronDown, X, Search } from "lucide-react";
import Header from "@/components/layouts/Header";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";
import { useGetBookingsByServiceProviderQuery } from "@/redux/services/book";
import { useGetEventCentersByServiceProviderQuery } from "@/redux/services/eventsApi";
import { useGetUserByIdQuery } from "@/redux/services/authApi";

type FilterType = "bookingType" | "venue" | "caterer" | "dateAndTime" | "status" | "paymentStatus";

export default function ManageBookings() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State for managing filters
  const [filters, setFilters] = useState<{
    bookingType: string | null;
    venue: string | null;
    caterer: string | null;
    dateAndTime: string | null;
    status: string | null;
    paymentStatus: string | null;
  }>({
    bookingType: null,
    venue: null,
    caterer: null,
    dateAndTime: null,
    status: null,
    paymentStatus: null,
  });

  // State for search input
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for controlling the "More filters" dropdown
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [clickedFilter, setClickedFilter] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID from localStorage or sessionStorage
  useEffect(() => {
    const user_id = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    setUserId(user_id);
  }, []);

  const { data: userData } = useGetUserByIdQuery(userId || "", {
    skip: !userId,
  });

  // Extract service provider ID from user data
  useEffect(() => {
    if (userData?.serviceProvider?.id) {
      setServiceProviderId(userData.serviceProvider.id);
    }
  }, [userData]);

  // Fetch event centers for this service provider
  const { data: eventCentersData, isLoading: isLoadingEventCenters } =
    useGetEventCentersByServiceProviderQuery(
      {
        serviceProviderId: serviceProviderId || "",
        limit: 10,
        offset: 0,
      },
      { skip: !serviceProviderId }
    );

  // Get the first event center ID to use for fetching bookings
  useEffect(() => {
    if (eventCentersData?.data && eventCentersData.data.length > 0) {
      setSelectedServiceId(eventCentersData.data[0].id);
    }
  }, [eventCentersData]);

  // Fetch bookings using the service ID
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error,
  } = useGetBookingsByServiceProviderQuery(
    { serviceId: selectedServiceId || "", limit: 100, offset: 0 },
    { skip: !selectedServiceId }
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Transform API data to match the UI structure
  const bookings =
    bookingsData?.data?.map((booking) => ({
      id: booking.id,
      bookingId: booking.bookingReference || booking.id,
      name: "Customer Name", // You might need to fetch customer data separately
      bookingType: booking.serviceType,
      venue: "Venue Name", // You might need to fetch venue data separately
      caterer: "Caterer Name", // You might need to fetch caterer data separately
      dateAndTime: new Date(booking.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    })) || [];

  // Extract unique values for each filter category
  const uniqueBookingTypes = [...new Set(bookings.map((booking) => booking.bookingType))];
  const uniqueVenues = [...new Set(bookings.map((booking) => booking.venue))];
  const uniqueCaterers = [...new Set(bookings.map((booking) => booking.caterer))];
  const uniqueDateAndTimes = [...new Set(bookings.map((booking) => booking.dateAndTime))].sort();
  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))];
  const uniquePaymentStatuses = [...new Set(bookings.map((booking) => booking.paymentStatus))];

  // Apply filters to the data
  const filteredBookings = bookings.filter((booking) => {
    return (
      (!filters.bookingType || booking.bookingType === filters.bookingType) &&
      (!filters.venue || booking.venue === filters.venue) &&
      (!filters.caterer || booking.caterer === filters.caterer) &&
      (!filters.dateAndTime || booking.dateAndTime === filters.dateAndTime) &&
      (!filters.status || booking.status === filters.status) &&
      (!filters.paymentStatus || booking.paymentStatus === filters.paymentStatus)
    );
  });

  // Apply search to the filtered data
  const searchedBookings = filteredBookings.filter((booking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.bookingId.toLowerCase().includes(query) ||
      booking.name.toLowerCase().includes(query) ||
      booking.bookingType.toLowerCase().includes(query) ||
      booking.venue.toLowerCase().includes(query) ||
      booking.caterer.toLowerCase().includes(query) ||
      booking.dateAndTime.toLowerCase().includes(query) ||
      booking.status.toLowerCase().includes(query) ||
      booking.paymentStatus.toLowerCase().includes(query)
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

  // Handle navigation to the details page
  type Booking = {
    id: string;
    bookingId: string;
    name: string;
    bookingType: string;
    venue: string;
    caterer: string;
    dateAndTime: string;
    status: string;
    paymentStatus: string;
  };

  const handleViewBooking = (booking: Booking) => {
    router.push(
      `/eventServiceManagement/manage-bookings-details?bookingId=${encodeURIComponent(
        booking.id
      )}&displayId=${encodeURIComponent(
        booking.bookingId
      )}&name=${encodeURIComponent(booking.name)}&bookingType=${encodeURIComponent(
        booking.bookingType
      )}&venue=${encodeURIComponent(booking.venue)}&caterer=${encodeURIComponent(
        booking.caterer
      )}&dateAndTime=${encodeURIComponent(booking.dateAndTime)}&status=${encodeURIComponent(
        booking.status
      )}&paymentStatus=${encodeURIComponent(booking.paymentStatus)}`
    );
  };

  // Show loading if either event centers or bookings are loading
  const isLoading = isLoadingEventCenters || isLoadingBookings;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventServiceSideBar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="md:ml-[280px]">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <main className="md:p-10 p-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Loading bookings...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventServiceSideBar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="md:ml-[280px]">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <main className="md:p-10 p-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-red-600">
                Error loading bookings. Please try again.
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <EventServiceSideBar
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
              Manage Bookings
            </h1>
            {/* {eventCentersData?.data && eventCentersData.data.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Service:</span>
                <select
                  className="border border-gray-200 rounded-md px-3 py-1 text-sm"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                  {eventCentersData.data.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
            )} */}
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
                      <span>More filters</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {isFilterDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          {/* Booking Type Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("bookingType")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("bookingType")
                              }
                            >
                              Booking Type
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "bookingType"
                              : hoveredFilter === "bookingType") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueBookingTypes.map((type) => (
                                  <button
                                    key={type}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("bookingType", type)
                                    }
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Venue Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("venue")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("venue")
                              }
                            >
                              Venue
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "venue"
                              : hoveredFilter === "venue") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueVenues.map((venue) => (
                                  <button
                                    key={venue}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => applyFilter("venue", venue)}
                                  >
                                    {venue}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Caterer Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("caterer")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("caterer")
                              }
                            >
                              Caterer
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "caterer"
                              : hoveredFilter === "caterer") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueCaterers.map((caterer) => (
                                  <button
                                    key={caterer}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("caterer", caterer)
                                    }
                                  >
                                    {caterer}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Date and Time Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("dateAndTime")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("dateAndTime")
                              }
                            >
                              Date and Time
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "dateAndTime"
                              : hoveredFilter === "dateAndTime") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueDateAndTimes.map((date) => (
                                  <button
                                    key={date}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("dateAndTime", date)
                                    }
                                  >
                                    {date}
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
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("status")
                              }
                            >
                              Status
                              <ChevronDown className="w-4 h-4" />
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
                                    onClick={() => applyFilter("status", status)}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Payment Status Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("paymentStatus")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("paymentStatus")
                              }
                            >
                              Payment Status
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "paymentStatus"
                              : hoveredFilter === "paymentStatus") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniquePaymentStatuses.map((paymentStatus) => (
                                  <button
                                    key={paymentStatus}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("paymentStatus", paymentStatus)
                                    }
                                  >
                                    {paymentStatus}
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
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Booking Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Venue / Caterer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Date and Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.length > 0 ? (
                    paginatedBookings.map((booking, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewBooking(booking)}
                      >
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.bookingId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.bookingType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.venue}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {booking.dateAndTime}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              booking.status === "PENDING"
                                ? "bg-orange-50 text-orange-700"
                                : booking.status === "BOOKED" || booking.status === "CONFIRMED"
                                ? "bg-green-50 text-green-700"
                                : booking.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-700"
                                : booking.status === "COMPLETED"
                                ? "bg-purple-50 text-purple-700"
                                : booking.status === "CANCELLED"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              booking.paymentStatus === "PAID"
                                ? "bg-green-50 text-green-700"
                                : booking.paymentStatus === "PENDING"
                                ? "bg-orange-50 text-orange-700"
                                : booking.paymentStatus === "REFUNDED"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {searchedBookings.length > 0 && (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
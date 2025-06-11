"use client";
import { Edit2, Trash2, ChevronRight, X, Search } from "lucide-react";
import Header from "@/components/layouts/Header";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";
import { useGetEventCentersByServiceProviderQuery } from "../../../../redux/services/eventsApi";
import { useGetUserByIdQuery } from "../../../../redux/services/authApi";

type FilterType =
  | "location"
  | "status"
  | "ratings"
  | "eventType"
  | "bookingStatus"
  | "paymentStatus";

interface EventCenterTableData {
  id: string;
  name: string;
  location: string;
  date: string;
  status: string;
  ratings: number;
  revenue: string;
  bookingType: string;
  paymentStatus: string;
  bookingStatus: string;
  eventType: string;
  capacity: string;
  contactNumber: string;
  email: string;
}

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-50/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-[#0047AB] border-gray-200 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          Loading Event Centers...
        </p>
      </div>
    </div>
  );
};

export default function ManageEventCenter() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State for managing filters
  const [filters, setFilters] = useState<{
    location: string | null;
    status: string | null;
    ratings: number | null;
    eventType: string | null;
    bookingStatus: string | null;
    paymentStatus: string | null;
  }>({
    location: null,
    status: null,
    ratings: null,
    eventType: null,
    bookingStatus: null,
    paymentStatus: null,
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

  // Fetch event centers for the service provider
  const serviceProviderId = user?.serviceProvider?.id;
  const {
    data: eventCentersData,
    isLoading: isEventCentersLoading,
    error: eventCentersError,
  } = useGetEventCentersByServiceProviderQuery(
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
  const eventCenters: EventCenterTableData[] =
    eventCentersData?.data?.map((center) => ({
      id: center.id,
      name: center.description.split(" ")[0] + " Center",
      location: `${center.city}, ${center.state}`,
      date: new Date(center.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      status: center.status,
      ratings: 0,
      revenue: `$${center.depositAmount.toLocaleString()}`,
      bookingType: center.venueLayout,
      paymentStatus: center.paymentRequired ? "Pending" : "Paid",
      bookingStatus: center.status === "ACTIVE" ? "Confirmed" : "Pending",
      eventType: "Event",
      capacity: center.sittingCapacity.toString(),
      contactNumber: "+1234567890",
      email: "contact@example.com",
    })) || [];

  // Extract unique values for each filter category
  const uniqueLocations = [
    ...new Set(eventCenters.map((center) => center.location)),
  ];
  const uniqueStatuses = [
    ...new Set(eventCenters.map((center) => center.status)),
  ];
  const uniqueRatings = [
    ...new Set(eventCenters.map((center) => center.ratings)),
  ].sort((a, b) => a - b);
  const uniqueEventTypes = [
    ...new Set(eventCenters.map((center) => center.eventType)),
  ];
  const uniqueBookingStatuses = [
    ...new Set(eventCenters.map((center) => center.bookingStatus)),
  ];
  const uniquePaymentStatuses = [
    ...new Set(eventCenters.map((center) => center.paymentStatus)),
  ];

  // Apply filters to the data
  const filteredEventCenters = eventCenters.filter((center) => {
    return (
      (!filters.location || center.location === filters.location) &&
      (!filters.status || center.status === filters.status) &&
      (filters.ratings === null || center.ratings === filters.ratings) &&
      (!filters.eventType || center.eventType === filters.eventType) &&
      (!filters.bookingStatus ||
        center.bookingStatus === filters.bookingStatus) &&
      (!filters.paymentStatus || center.paymentStatus === filters.paymentStatus)
    );
  });

  // Apply search to the filtered data
  const searchedEventCenters = filteredEventCenters.filter((center) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      center.id.toLowerCase().includes(query) ||
      center.name.toLowerCase().includes(query) ||
      center.location.toLowerCase().includes(query) ||
      center.date.toLowerCase().includes(query) ||
      center.status.toLowerCase().includes(query) ||
      center.revenue.toLowerCase().includes(query) ||
      center.bookingType.toLowerCase().includes(query) ||
      center.paymentStatus.toLowerCase().includes(query) ||
      center.bookingStatus.toLowerCase().includes(query) ||
      center.eventType.toLowerCase().includes(query) ||
      center.capacity.toLowerCase().includes(query) ||
      center.contactNumber.toLowerCase().includes(query) ||
      center.email.toLowerCase().includes(query)
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
  const handleViewEventCenter = (center: EventCenterTableData) => {
    router.push(
      `/eventServiceManagement/event-center-details?id=${encodeURIComponent(
        center.id
      )}&name=${encodeURIComponent(center.name)}&location=${encodeURIComponent(
        center.location
      )}&date=${encodeURIComponent(center.date)}&status=${encodeURIComponent(
        center.status
      )}&ratings=${center.ratings}&revenue=${encodeURIComponent(
        center.revenue
      )}&bookingType=${encodeURIComponent(
        center.bookingType
      )}&paymentStatus=${encodeURIComponent(
        center.paymentStatus
      )}&bookingStatus=${encodeURIComponent(
        center.bookingStatus
      )}&eventType=${encodeURIComponent(
        center.eventType
      )}&capacity=${encodeURIComponent(
        center.capacity
      )}&contactNumber=${encodeURIComponent(
        center.contactNumber
      )}&email=${encodeURIComponent(center.email)}`
    );
  };

  // Show loading state
  if (isUserLoading || isEventCentersLoading || !userId) {
    return <LoadingSpinner />;
  }

  // Handle errors
  if (userError || eventCentersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">
          Error loading event centers. Please try again.
        </p>
      </div>
    );
  }

  // Handle empty data state
  if (!eventCentersData?.data?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventServiceSideBar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="md:ml-[280px]">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
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
                <Link href="/eventServiceManagement/add-event-center">
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
                No event centers found. Click Add; to create a new event
                center.
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
      <EventServiceSideBar
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
              <Link href="/eventServiceManagement/add-event-center">
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

                          {/* Event Type Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("eventType")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("eventType")
                              }
                            >
                              Event Type
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "eventType"
                              : hoveredFilter === "eventType") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueEventTypes.map((eventType) => (
                                  <button
                                    key={eventType}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("eventType", eventType)
                                    }
                                  >
                                    {eventType}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Booking Status Filter */}
                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("bookingStatus")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("bookingStatus")
                              }
                            >
                              Booking Status
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "bookingStatus"
                              : hoveredFilter === "bookingStatus") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueBookingStatuses.map((bookingStatus) => (
                                  <button
                                    key={bookingStatus}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter(
                                        "bookingStatus",
                                        bookingStatus
                                      )
                                    }
                                  >
                                    {bookingStatus}
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
                              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("paymentStatus")
                              }
                            >
                              Payment Status
                              <ChevronRight className="w-4 h-4" />
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
                                      applyFilter(
                                        "paymentStatus",
                                        paymentStatus
                                      )
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
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewEventCenter(center)}
                    >
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
                            center.status === "In Progress"
                              ? "bg-blue-50 text-blue-700"
                              : center.status === "Confirmed"
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

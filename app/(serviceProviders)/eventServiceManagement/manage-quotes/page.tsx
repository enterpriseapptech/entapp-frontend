"use client";
import { ChevronDown, X, Search } from "lucide-react";
import Header from "@/components/layouts/Header";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";
import { useGetQuotesByServiceIdQuery } from "@/redux/services/quoteApi";
import { useGetEventCentersByServiceProviderQuery } from "@/redux/services/eventsApi";
import { useGetUserByIdQuery } from "@/redux/services/authApi";

type FilterType =
  | "bookingType"
  | "eventType"
  | "dateAndTime"
  | "invoiceStatus";

export default function QuoteRequests() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [filters, setFilters] = useState<{
    bookingType: string | null;
    eventType: string | null;
    dateAndTime: string | null;
    invoiceStatus: string | null;
  }>({
    bookingType: null,
    eventType: null,
    dateAndTime: null,
    invoiceStatus: null,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [clickedFilter, setClickedFilter] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID from localStorage or sessionStorage
  useEffect(() => {
    const user_id =
      localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
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

  // Get the first event center ID to use for fetching quotes
  useEffect(() => {
    if (eventCentersData?.data && eventCentersData.data.length > 0) {
      setSelectedServiceId(eventCentersData.data[0].id);
    }
  }, [eventCentersData]);

  // Fetch quotes using the service ID
  const {
    data: quotesData,
    isLoading: isLoadingQuotes,
    error,
  } = useGetQuotesByServiceIdQuery(
    { serviceId: selectedServiceId || "", limit: 100, offset: 0 },
    { skip: !selectedServiceId } // Skip query if no service ID is available
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
  const quotes =
    quotesData?.data?.map((quote) => ({
      id: quote.id,
      displayId: quote.quoteReference || quote.id,
      customerName: "Customer Name",
      customerEmail: "customer@email.com",
      eventType: quote.serviceType,
      dateAndTime: new Date(quote.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      invoiceStatus: quote.status === "SENT" ? "Sent" : "Pending",
    })) || [];

  const uniqueEventTypes = [...new Set(quotes.map((quote) => quote.eventType))];
  const uniqueDateAndTimes = [
    ...new Set(quotes.map((quote) => quote.dateAndTime)),
  ].sort();
  const uniqueInvoiceStatuses = [
    ...new Set(quotes.map((quote) => quote.invoiceStatus)),
  ];

  const filteredQuotes = quotes.filter((quote) => {
    return (
      (!filters.bookingType || quote.eventType === filters.bookingType) &&
      (!filters.dateAndTime || quote.dateAndTime === filters.dateAndTime) &&
      (!filters.invoiceStatus || quote.invoiceStatus === filters.invoiceStatus)
    );
  });

  const searchedQuotes = filteredQuotes.filter((quote) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      quote.eventType.toLowerCase().includes(query) ||
      quote.dateAndTime.toLowerCase().includes(query) ||
      quote.invoiceStatus.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(searchedQuotes.length / itemsPerPage);
  const paginatedQuotes = searchedQuotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const applyFilter = (filterType: FilterType, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
    setIsFilterDropdownOpen(false);
    setClickedFilter(null);
  };

  const removeFilter = (filterType: FilterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: null,
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleSubDropdown = (filter: string) => {
    setClickedFilter((prev) => (prev === filter ? null : filter));
  };

  type Quote = {
    id: string;
    displayId: string;
    eventType: string;
    dateAndTime: string;
    invoiceStatus: string;
  };
  const handleViewQuote = (quote: Quote) => {
    router.push(
      `/eventServiceManagement/manage-quotes-details?requestId=${encodeURIComponent(
        quote.id
      )}&eventType=${encodeURIComponent(
        quote.eventType
      )}&dateAndTime=${encodeURIComponent(
        quote.dateAndTime
      )}&invoiceStatus=${encodeURIComponent(quote.invoiceStatus)}`
    );
  };

  // Show loading if either event centers or quotes are loading
  const isLoading = isLoadingEventCenters || isLoadingQuotes;

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
              <div className="text-gray-600">Loading quotes...</div>
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
                Error loading quotes. Please try again.
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!selectedServiceId) {
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
              <div className="text-gray-600">
                No event centers found. Please create an event center first.
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              Quote Request List
            </h1>
            {eventCentersData?.data && eventCentersData.data.length > 1 && (
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
            )}
          </div>

          <div className="rounded-lg border bg-white shadow">
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
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("eventType")
                              }
                            >
                              Event Type
                              <ChevronDown className="w-4 h-4" />
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
                                {uniqueEventTypes.map((type) => (
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

                          <div
                            className="relative"
                            onMouseEnter={() =>
                              !isMobile && setHoveredFilter("invoiceStatus")
                            }
                            onMouseLeave={() =>
                              !isMobile && setHoveredFilter(null)
                            }
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                isMobile && toggleSubDropdown("invoiceStatus")
                              }
                            >
                              Invoice Status
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            {(isMobile
                              ? clickedFilter === "invoiceStatus"
                              : hoveredFilter === "invoiceStatus") && (
                              <div
                                className={`absolute ${
                                  isMobile
                                    ? "left-0 top-full mt-1 bg-gray-900 z-20"
                                    : "left-full top-0 bg-white"
                                } w-48 border border-gray-200 rounded-lg shadow-lg`}
                              >
                                {uniqueInvoiceStatuses.map((status) => (
                                  <button
                                    key={status}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      applyFilter("invoiceStatus", status)
                                    }
                                  >
                                    {status}
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

            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[800px]">
                <thead>
                  <tr className="border-t">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Event Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Date and Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap">
                      Invoice Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedQuotes.length > 0 ? (
                    paginatedQuotes.map((quote, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {quote.eventType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {quote.dateAndTime}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              quote.invoiceStatus === "Sent"
                                ? "bg-green-50 text-green-700"
                                : quote.invoiceStatus === "Pending"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {quote.invoiceStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                          <button
                            onClick={() => handleViewQuote(quote)}
                            className="text-blue-600 hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No quotes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {searchedQuotes.length > 0 && (
              <div className="flex justify-between items-center p-4 border-t md:flex-wrap gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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

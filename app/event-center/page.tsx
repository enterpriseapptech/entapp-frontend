"use client";
import { useState, useEffect } from "react";
import HeroWithNavbar from "@/components/layouts/HeroWithNavbar";
import Card from "@/components/ui/card";
import { X } from "lucide-react";
import DualRangeSlider from "@/components/ui/DualRangeSlider";
import Image from "next/image";
import Link from "next/link";
import { useGetEventCentersQuery } from "@/redux/services/eventsApi";
import CardSkeleton from "@/components/ui/card-skeleton";

export default function EventCenters() {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [capacityRange, setCapacityRange] = useState<[number, number]>([0, 20000]);
  const [location, setLocation] = useState<string>("Nigeria");
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Default values for filters
  const defaultCapacityRange: [number, number] = [0, 20000];
  const defaultLocation = "Nigeria";

  // Pagination settings
  const itemsPerPage = 12;
  const offset = (currentPage - 1) * itemsPerPage;

  // Fetch event centers
  const { data, isLoading, error } = useGetEventCentersQuery({
    limit: itemsPerPage,
    offset,
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching event centers:', error);
    }
  }, [error]);

  const totalPages = data?.count ? Math.ceil(data.count / itemsPerPage) : 1;

  const toggleCategoryDropdown = () => setIsCategoryOpen((prev) => !prev);
  const toggleLocationDropdown = () => setIsLocationOpen((prev) => !prev);
  const handleCategoryChange = () => setIsCategoryOpen(false);
  const handleLocationChange = () => setIsLocationOpen(false);

  // Map API data to the format expected by the Card component
  const eventCenters =
    data?.data?.map((venue) => ({
      id: venue.id,
      name: venue.name || "Event Hall",
      imageSrc: venue.images?.[0] || "/placeholder-image.png",
      label: "Featured",
      title: venue.description
        ? venue.description.slice(0, 50) + "..."
        : "No description available",
      location: venue.city ? `${venue.city}, Nigeria` : "Unknown location",
      price: `₦${venue.depositAmount?.toLocaleString() || "0"}`,
      eventType: venue.eventTypes[0] || "General Event",
      capacity: venue.sittingCapacity || 0,
      rawPrice: venue.depositAmount || 0,
    })) ?? [];

  // Helper function to determine if a capacity value is within the selected range
  const isCapacitySelected = (value: number) => {
    return value >= capacityRange[0] && value <= capacityRange[1];
  };

  // Helper function to update capacity range based on checkbox toggle
  const toggleCapacity = (value: string) => {
    const numValue = parseInt(value);
    if (isCapacitySelected(numValue)) {
      if (numValue === 1000) {
        setCapacityRange([Math.max(1001, capacityRange[0]), capacityRange[1]]);
      } else if (numValue === 5000) {
        setCapacityRange([capacityRange[0], Math.min(4999, capacityRange[1])]);
      } else if (numValue === 10000) {
        setCapacityRange([capacityRange[0], Math.min(9999, capacityRange[1])]);
      }
    } else {
      setCapacityRange([
        Math.min(numValue, capacityRange[0]),
        Math.max(numValue, capacityRange[1]),
      ]);
    }
  };

  // Toggle event type in the selectedEventTypes array
  const toggleEventType = (eventType: string) => {
    if (selectedEventTypes.includes(eventType)) {
      setSelectedEventTypes(
        selectedEventTypes.filter((type) => type !== eventType)
      );
    } else {
      setSelectedEventTypes([...selectedEventTypes, eventType]);
    }
  };

  // Filter event centers based on selected filters
  const filteredEventCenters = eventCenters.filter((center) => {
    const matchesEventType =
      selectedEventTypes.length === 0 ||
      selectedEventTypes.some(type => 
        center.eventType.toLowerCase().includes(type.toLowerCase())
      );
    
    const matchesCapacity =
      center.capacity >= capacityRange[0] &&
      center.capacity <= capacityRange[1];
    
    const matchesPrice =
      center.rawPrice >= priceRange[0] && 
      center.rawPrice <= priceRange[1];
    
    const matchesLocation = location === "Nigeria" || 
      center.location.toLowerCase().includes(location.toLowerCase());
    
    return (
      matchesEventType && matchesCapacity && matchesPrice && matchesLocation
    );
  });

  // Determine active filters for display as tags
  const activeFilters = [];

  // Add Event Type filters
  selectedEventTypes.forEach((eventType) => {
    activeFilters.push({
      label: eventType,
      onRemove: () =>
        setSelectedEventTypes(
          selectedEventTypes.filter((type) => type !== eventType)
        ),
    });
  });

  // Add Capacity filter if not default
  if (capacityRange[0] !== defaultCapacityRange[0] || capacityRange[1] !== defaultCapacityRange[1]) {
    const capacityLabel =
      capacityRange[0] === capacityRange[1]
        ? `${capacityRange[0].toLocaleString()}`
        : `${capacityRange[0].toLocaleString()} - ${capacityRange[1].toLocaleString()}`;
    activeFilters.push({
      label: capacityLabel,
      onRemove: () => setCapacityRange(defaultCapacityRange),
    });
  }

  // Add Location filter if not default
  if (location !== defaultLocation) {
    activeFilters.push({
      label: location,
      onRemove: () => setLocation(defaultLocation),
    });
  }

  // Display text for the "Showing results" heading
  const displayEventTypes =
    selectedEventTypes.length > 0 ? selectedEventTypes.join(", ") : "All";

  // Skeleton loader for cards
  const loadingSkeletons = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );

  // Error display
  const errorDisplay = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <p className="text-red-600 text-center col-span-full">
        Error loading event centers. Please try again later.
      </p>
    </div>
  );

  // No results display
  const noResultsDisplay = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <p className="text-gray-600 text-center col-span-full">
        No event centers match your filters.
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroWithNavbar
        isCategoryOpen={isCategoryOpen}
        isLocationOpen={isLocationOpen}
        toggleCategoryDropdown={toggleCategoryDropdown}
        toggleLocationDropdown={toggleLocationDropdown}
        handleCategoryChange={handleCategoryChange}
        handleLocationChange={handleLocationChange}
        height="400px"
        backgroundImage="url('/eventHeroImage.png')"
        heading="Events Center"
        subheading=""
      />

      {/* Filters and Event Listings Section */}
      <div className="flex flex-col lg:flex-row">
        {/* Filters Sidebar */}
        <aside
          className={`w-full lg:w-64 bg-white p-6 border-r border-gray-200 lg:sticky lg:top-0 lg:min-h-[calc(100vh-400px)] lg:overflow-y-auto transition-transform duration-300 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="cursor-pointer"
            >
              <Image
                alt="closefilter"
                src="/closefilter.png"
                width={5}
                height={5}
                className="w-4 h-4"
              />
            </button>
          </div>
          <hr className="border-gray-200 mb-4" />

          {/* Event Type Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-gray-700">
              Event Type
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedEventTypes.length === 0
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => setSelectedEventTypes([])}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedEventTypes.includes("Wedding")
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => toggleEventType("Wedding")}
                >
                  Wedding
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedEventTypes.includes("Birthday")
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => toggleEventType("Birthday")}
                >
                  Birthday
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedEventTypes.includes("Conference")
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => toggleEventType("Conference")}
                >
                  Conference
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedEventTypes.includes("Corporate Events")
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => toggleEventType("Corporate Events")}
                >
                  Corporate Events
                </button>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200 mb-4" />

          {/* Price Range Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium mb-2 text-gray-700">
                Price Range
              </h4>
              <button
                className="text-gray-800 text-sm hover:underline"
                onClick={() => setPriceRange([0, 1000000])}
              >
                reset
              </button>
            </div>
            <DualRangeSlider
              min={0}
              max={1000000}
              value={priceRange}
              step={1000}
              onChange={setPriceRange}
              prefix="₦"
            />
          </div>

          <hr className="border-gray-200 mb-4" />

          {/* Capacity Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium mb-2 text-gray-700">
                Capacity
              </h4>
              <button
                className="text-gray-800 text-sm hover:underline"
                onClick={() => setCapacityRange([0, 20000])}
              >
                reset
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={isCapacitySelected(1000)}
                  onChange={() => toggleCapacity("1000")}
                  className="accent-blue-600"
                />
                1k
              </label>
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={isCapacitySelected(5000)}
                  onChange={() => toggleCapacity("5000")}
                  className="accent-blue-600"
                />
                5k
              </label>
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={isCapacitySelected(10000)}
                  onChange={() => toggleCapacity("10000")}
                  className="accent-blue-600"
                />
                10k
              </label>
            </div>
            <div className="mt-4">
              <DualRangeSlider
                min={0}
                max={20000}
                value={capacityRange}
                step={100}
                onChange={setCapacityRange}
                formatValue={(val) => val.toLocaleString()}
                prefix=""
              />
            </div>
          </div>

          <hr className="border-gray-200 mb-4" />

          {/* Location Filter */}
          <div>
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium mb-2 text-gray-700">
                Location
              </h4>
              <button
                className="text-gray-800 text-sm hover:underline"
                onClick={() => setLocation("Nigeria")}
              >
                reset
              </button>
            </div>
            <select
              className="w-full px-3 py-2 border rounded-md text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Nigeria">Nigeria</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
        </aside>

        {/* Event Listings */}
        <main className="flex-1 py-6 bg-gray-50 overflow-x-auto p-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center">
              <div
                className={`flex items-center bg-[#F5F5F8] text-[#000000] text-sm font-bold p-2 rounded-sm gap-20 cursor-pointer mb-2 ${
                  isSidebarOpen ? "hidden" : "block"
                }`}
                onClick={() => setIsSidebarOpen(true)}
              >
                <h2>Filters</h2>
                <Image
                  src="/openFilter.png"
                  alt="openFilter.png"
                  width={10}
                  height={10}
                  className="h-2 w-2"
                  unoptimized
                />
              </div>
              {/* Filter Tags */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeFilters.map((filter, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-[#F2F6FC] text-blue-800 text-sm font-medium px-3 py-1 rounded-sm border border-blue-200"
                    >
                      <span>{filter.label}</span>
                      <button
                        onClick={filter.onRemove}
                        className="ml-2 focus:outline-none"
                      >
                        <X
                          size={14}
                          className="text-blue-800 hover:text-blue-600"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-600 font-bold">Sort by</span>
                <Image
                  src="/dropDown.png"
                  alt="dropDown"
                  width={10}
                  height={10}
                  className="h-2 w-2"
                  unoptimized
                />
              </div>
            </div>

            <hr className="w-full mb-4" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Showing results for {displayEventTypes} Events
              </h3>
              <p className="text-sm text-gray-600">
                {filteredEventCenters.length} of {data?.count || 0} results
              </p>
            </div>

            {isLoading ? (
              loadingSkeletons
            ) : error ? (
              errorDisplay
            ) : filteredEventCenters.length === 0 ? (
              noResultsDisplay
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEventCenters.map((center) => (
                  <Link key={center.id} href={`/event-center/${center.id}`}>
                    <Card
                      name={center.name}
                      imageSrc={center.imageSrc}
                      label={center.label}
                      title={center.title}
                      location={center.location}
                      price={center.price}
                      // eventType={center.eventType}
                      // capacity={center.capacity}
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 space-x-2 mx-auto md:p-8 p-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1 text-sm text-gray-600 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <Image
                  src="/leftArrow.png"
                  alt="leftArrow"
                  width={10}
                  height={10}
                  className="w-4 h-4"
                  unoptimized
                />
              </button>
              <span className="text-gray-600 text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 border rounded-md border-gray-200 px-3 py-1 text-sm text-gray-600 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <Image
                  src="/rightArrow.png"
                  alt="rightArrow"
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
    </main>
  );
}
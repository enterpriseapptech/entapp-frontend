// pages/CateringServices.tsx
"use client";
import { useState } from "react";
import HeroWithNavbar from "@/components/layouts/HeroWithNavbar";
import Card from "@/components/ui/card";
import { X } from "lucide-react";
import DualRangeSlider from "@/components/ui/DualRangeSlider";
import Image from "next/image";
import Link from "next/link";

export default function CateringServicesAllPost() {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 10;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleCategoryDropdown = () => setIsCategoryOpen((prev) => !prev);
  const toggleLocationDropdown = () => setIsLocationOpen((prev) => !prev);
  const handleCategoryChange = () => setIsCategoryOpen(false);
  const handleLocationChange = () => setIsLocationOpen(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [orderSizeRange, setOrderSizeRange] = useState<[number, number]>([0, 0]); // Initialize to [0, 0] so no range is selected by default
  const [location, setLocation] = useState<string>("Nigeria");
  const [selectedCuisineTypes, setSelectedCuisineTypes] = useState<string[]>([]);
  const [selectedOrderSizes, setSelectedOrderSizes] = useState<string[]>([]); // Track selected order size ranges

  // Default values for filters
  const defaultOrderSizeRange: [number, number] = [0, 5000]; // We'll use this in the reset logic
  const defaultLocation = "Nigeria";

  const cateringServices = [
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Taste of Africa",
      location: "Lagos, Nigeria",
      price: "₦500,000",
      cuisineType: "African",
      orderSize: 2000,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Italian Delight",
      location: "Abuja, Nigeria",
      price: "₦300,000",
      cuisineType: "Italian",
      orderSize: 1000,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Chinese Feast",
      location: "London, UK",
      price: "₦800,000",
      cuisineType: "Chinese",
      orderSize: 3000,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "French Gourmet",
      location: "New York, USA",
      price: "₦600,000",
      cuisineType: "French",
      orderSize: 1500,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "African Spice",
      location: "Lagos, Nigeria",
      price: "₦450,000",
      cuisineType: "African",
      orderSize: 800,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Italian Bistro",
      location: "Abuja, Nigeria",
      price: "₦250,000",
      cuisineType: "Italian",
      orderSize: 500,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Chinese Dragon",
      location: "London, UK",
      price: "₦700,000",
      cuisineType: "Chinese",
      orderSize: 4000,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "French Elegance",
      location: "New York, USA",
      price: "₦550,000",
      cuisineType: "French",
      orderSize: 2500,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Savory Africa",
      location: "Lagos, Nigeria",
      price: "₦400,000",
      cuisineType: "African",
      orderSize: 1800,
    },
    {
      name: "Catering Service",
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Italian Charm",
      location: "Abuja, Nigeria",
      price: "₦200,000",
      cuisineType: "Italian",
      orderSize: 600,
    },
  ];

  // Helper function to toggle order size range
  const toggleOrderSize = (range: string) => {
    if (selectedOrderSizes.includes(range)) {
      // If the range is already selected, remove it
      const updatedRanges = selectedOrderSizes.filter((r) => r !== range);
      setSelectedOrderSizes(updatedRanges);

      if (updatedRanges.length === 0) {
        // If no ranges are selected, reset the range to [0, 0]
        setOrderSizeRange([0, 0]);
      } else {
        // Recalculate the range based on remaining selected ranges
        let newMin = Infinity;
        let newMax = -Infinity;
        updatedRanges.forEach((r) => {
          let rMin: number, rMax: number;
          if (r === "50-100") {
            rMin = 50;
            rMax = 100;
          } else if (r === "200-500") {
            rMin = 200;
            rMax = 500;
          } else {
            rMin = 1000;
            rMax = 5000;
          }
          newMin = Math.min(newMin, rMin);
          newMax = Math.max(newMax, rMax);
        });
        setOrderSizeRange([newMin, newMax]);
      }
    } else {
      // If the range is not selected, add it
      const updatedRanges = [...selectedOrderSizes, range];
      setSelectedOrderSizes(updatedRanges);

      // Update the range to include the new selection
      const currentMin = updatedRanges.reduce((min, r) => {
        if (r === "50-100") return Math.min(min, 50);
        if (r === "200-500") return Math.min(min, 200);
        return Math.min(min, 1000);
      }, Infinity);
      const currentMax = updatedRanges.reduce((max, r) => {
        if (r === "50-100") return Math.max(max, 100);
        if (r === "200-500") return Math.max(max, 500);
        return Math.max(max, 5000);
      }, -Infinity);
      setOrderSizeRange([currentMin, currentMax]);
    }
  };

  // Toggle cuisine type in the selectedCuisineTypes array
  const toggleCuisineType = (cuisineType: string) => {
    if (selectedCuisineTypes.includes(cuisineType)) {
      setSelectedCuisineTypes(
        selectedCuisineTypes.filter((type) => type !== cuisineType)
      );
    } else {
      setSelectedCuisineTypes([...selectedCuisineTypes, cuisineType]);
    }
  };

  // Filter catering services based on selected cuisine types, order size, price, and location
  const filteredCateringServices = cateringServices.filter((service) => {
    const matchesCuisineType =
      selectedCuisineTypes.length === 0 ||
      selectedCuisineTypes.includes(service.cuisineType);

    // If no order size range is selected, match all services
    const matchesOrderSize =
      selectedOrderSizes.length === 0 ||
      (service.orderSize >= orderSizeRange[0] &&
        service.orderSize <= orderSizeRange[1]);

    const servicePrice = parseInt(service.price.replace(/[^0-9]/g, ""));
    const matchesPrice =
      servicePrice >= priceRange[0] && servicePrice <= priceRange[1];
    const matchesLocation = service.location
      .toLowerCase()
      .includes(location.toLowerCase());
    return (
      matchesCuisineType && matchesOrderSize && matchesPrice && matchesLocation
    );
  });

  // Determine active filters for display as tags
  const activeFilters = [];

  // Add Cuisine Type filters
  selectedCuisineTypes.forEach((cuisineType) => {
    activeFilters.push({
      label: cuisineType,
      onRemove: () =>
        setSelectedCuisineTypes(
          selectedCuisineTypes.filter((type) => type !== cuisineType)
        ),
    });
  });

  // Add Order Size filter (only if a range is selected)
  if (selectedOrderSizes.length > 0) {
    const orderSizeLabel =
      orderSizeRange[0] === orderSizeRange[1]
        ? `${orderSizeRange[0].toLocaleString()}`
        : `${orderSizeRange[0].toLocaleString()} - ${orderSizeRange[1].toLocaleString()}`;
    activeFilters.push({
      label: orderSizeLabel,
      onRemove: () => {
        setSelectedOrderSizes([]);
        setOrderSizeRange([0, 0]);
      },
    });
  }

  // Add Location filter (only if not default)
  if (location !== defaultLocation) {
    activeFilters.push({
      label: location,
      onRemove: () => setLocation(defaultLocation),
    });
  }

  // Display text for the "Showing results" heading
  const displayCuisineTypes =
    selectedCuisineTypes.length > 0 ? selectedCuisineTypes.join(", ") : "All";

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
        backgroundImage="url('/cateringServiceAll.png')"
        heading="Catering Services"
        subheading=""
      />

      {/* Filters and Catering Listings Section */}
      <div className="flex flex-col lg:flex-row">
        {/* Filters Sidebar */}
        <aside
          className={`w-full lg:w-64 bg-white p-6 border-r border-gray-200 lg:sticky lg:top-0 lg:min-h-[calc(100vh-400px)] lg:overflow-y-auto transition-transform duration-300 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          {/* Filters Header with Close Icon */}
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

          {/* Cuisine Type Filter */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-gray-700">
              Cuisine Type
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedCuisineTypes.length === 0
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => setSelectedCuisineTypes([])}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedCuisineTypes.includes("African")
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => toggleCuisineType("African")}
                >
                  African
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedCuisineTypes.includes("Italian")
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => toggleCuisineType("Italian")}
                >
                  Italian
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedCuisineTypes.includes("Chinese")
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => toggleCuisineType("Chinese")}
                >
                  Chinese
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-1 rounded-md text-sm ${
                    selectedCuisineTypes.includes("French")
                      ? "bg-[#F2F6FC] text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  onClick={() => toggleCuisineType("French")}
                >
                  French
                </button>
              </li>
            </ul>
          </div>

          {/* Horizontal Line */}
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

          {/* Horizontal Line */}
          <hr className="border-gray-200 mb-4" />

          {/* Order Size Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium mb-2 text-gray-700">
                Order Size
              </h4>
              <button
                className="text-gray-800 text-sm hover:underline"
                onClick={() => {
                  setSelectedOrderSizes([]);
                  setOrderSizeRange([defaultOrderSizeRange[0], defaultOrderSizeRange[0]]); // Reset to [0, 0]
                }}
              >
                reset
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedOrderSizes.includes("50-100")}
                  onChange={() => toggleOrderSize("50-100")}
                  className="accent-blue-600"
                />
                50-100
              </label>
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedOrderSizes.includes("200-500")}
                  onChange={() => toggleOrderSize("200-500")}
                  className="accent-blue-600"
                />
                200-500
              </label>
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedOrderSizes.includes("1k-5k")}
                  onChange={() => toggleOrderSize("1k-5k")}
                  className="accent-blue-600"
                />
                1k-5k
              </label>
            </div>
            <div className="mt-4">
              <DualRangeSlider
                min={0}
                max={5000}
                value={orderSizeRange}
                step={50}
                onChange={setOrderSizeRange}
                formatValue={(val) => val.toLocaleString()}
                prefix=""
              />
            </div>
          </div>

          {/* Horizontal Line */}
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

        {/* Catering Listings */}
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
                Showing results for {displayCuisineTypes} Catering Services
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCateringServices.length > 0 ? (
                filteredCateringServices.map((service, index) => (
                  <Link key={index} href={`/cateringServices/${index + 1}`}>
                    <Card
                      name={service.name}
                      imageSrc={service.imageSrc}
                      label={service.label}
                      title={service.title}
                      location={service.location}
                      price={service.price}
                    />
                  </Link>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center">
                  No catering services match the selected filters.
                </p>
              )}
            </div>

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
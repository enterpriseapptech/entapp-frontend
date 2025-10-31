"use client";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/services/authApi";
import {
  useGetCountriesQuery,
  useGetStatesQuery,
} from "@/redux/services/eventsApi";

interface HeroProps {
  isCategoryOpen: boolean;
  isLocationOpen: boolean;
  toggleCategoryDropdown: () => void;
  toggleLocationDropdown: () => void;
  handleCategoryChange: (category: string) => void;
  handleLocationChange: (location: string) => void;
  onSearch: (
    category: string,
    locationId: string,
    countryName: string,
    stateName: string
  ) => void;
  className?: string;
  backgroundImage?: string;
  height?: string;
  heading?: string;
  subheading?: string;
  showSearch?: boolean;
}

interface Country {
  id: string;
  name: string;
  code: string;
}

interface State {
  id: string;
  name: string;
  code: string;
  countryId: string;
}

export default function HeroWithNavbar({
  isCategoryOpen,
  isLocationOpen,
  toggleCategoryDropdown,
  toggleLocationDropdown,
  handleCategoryChange,
  onSearch,
  className,
  backgroundImage = "url('/heroImage.png')",
  height = "600px",
  heading = "Simplify Your Event Planning with<br />All-in-One Booking.",
  subheading = "Book stunning venues and top-notch catering services effortlessly.",
  showSearch = true,
}: HeroProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch countries and states
  const { data: countriesData } = useGetCountriesQuery({ limit: 250 });
  const { data: statesData, refetch: refetchStates } = useGetStatesQuery(
    { limit: 250 },
    { skip: !selectedCountry }
  );

  // Get user data when userId is available
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetUserByIdQuery(userId!, {
    skip: !userId || !isLoggedIn,
  });

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Refetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      refetchStates();
      setSelectedState("");
      setSelectedStateId("");
    }
  }, [selectedCountry, refetchStates]);

  const checkAuthStatus = () => {
    const accessToken =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    const storedUserId =
      localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    setIsLoggedIn(!!accessToken);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user_id");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user_id");

    setIsLoggedIn(false);
    setUserId(null);
    setOpenMobileMenu(false);
    router.push("/");
  };

  const handleLogin = () => {
    setOpenMobileMenu(false);
    router.push("/login");
  };

  const handleSignup = () => {
    setOpenMobileMenu(false);
    router.push("/signup");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    handleCategoryChange(category);
  };

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    setSelectedState("");
    setSelectedStateId("");
  };

  const handleStateSelect = (stateId: string) => {
    const selectedStateData = statesData?.docs.find(
      (state: State) => state.id === stateId
    );
    setSelectedState(selectedStateData?.name || "");
    setSelectedStateId(stateId);
  };

  const handleApplySearch = () => {
    if (selectedStateId) {
      const selectedCountryData = countriesData?.docs.find(
        (country: Country) => country.id === selectedCountry
      );
      const selectedStateData = statesData?.docs.find(
        (state: State) => state.id === selectedStateId
      );

      onSearch(
        selectedCategory,
        selectedStateId,
        selectedCountryData?.name || "",
        selectedStateData?.name || ""
      );
    }
  };

  const navLinks = [
    { label: "Event Centers", href: "/event-center" },
    { label: "Catering Services", href: "/cateringServices" },
    { label: "Quotes", href: "/quotes" },
    { label: "About Us", href: "#" },
  ];

  // Get user's first name for display
  const userName = user ? `${user.firstName}` : "";

  return (
    <section
      className={`relative bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage,
        minHeight: height,
      }}
    >
      {/* Content container */}
      <div className="relative max-w-5xl mx-auto px-4">
        {/* Navbar */}
        <nav
          className={clsx(
            "h-20 flex items-center justify-center text-white",
            isScrolling
              ? "md:px-20 px-10 fixed top-0 left-0 right-0 bg-white/95 shadow-lg z-50 text-gray-800"
              : "relative"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <Link href="/">
                <Image
                  src={isScrolling ? "/logo-footer.png" : "/logo.png"}
                  alt="logo"
                  width={150}
                  height={100}
                  className="object-contain"
                  unoptimized
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={clsx(
                    "hover:text-blue-200",
                    isScrolling && "text-gray-800 hover:text-blue-500"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex gap-4 items-center">
              {isLoggedIn ? (
                <>
                  <div
                    className={clsx(
                      "px-3 py-1 text-sm",
                      isScrolling ? "text-gray-700" : "text-white"
                    )}
                  >
                    {isLoadingUser ? (
                      <span>Loading...</span>
                    ) : userError ? (
                      <span>Welcome!</span>
                    ) : (
                      <span>Welcome, {userName}!</span>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className={clsx(
                      "px-4 py-2 cursor-pointer",
                      isScrolling
                        ? "text-gray-800 hover:text-blue-500"
                        : "text-white hover:text-blue-200"
                    )}
                  >
                    Log in
                  </button>
                  <button
                    onClick={handleSignup}
                    className="px-4 py-2 bg-[#0047AB] hover:bg-blue-700 rounded-md text-white cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            <div
              className="md:hidden"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
            >
              {openMobileMenu ? (
                <X size={25} color={isScrolling ? "black" : "white"} />
              ) : (
                <Menu
                  size={25}
                  color={isScrolling ? "black" : "white"}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>

          {openMobileMenu && (
            <div
              className="fixed inset-0 bg-black/25 z-50 md:hidden"
              onClick={() => setOpenMobileMenu(false)}
            >
              <div
                className="absolute h-screen left-0 top-0 w-60 bg-white text-gray-800 z-[999] px-5 border-r flex flex-col gap-5 py-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b pb-5">
                  <Image
                    src={isScrolling ? "/logo-footer.png" : "/logo.png"}
                    alt="logo"
                    width={150}
                    height={100}
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <div className="flex flex-col gap-5">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="hover:text-blue-500"
                      onClick={() => setOpenMobileMenu(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="flex flex-col gap-4 mt-5">
                  {isLoggedIn ? (
                    <>
                      <div className="px-2 py-2 text-sm text-gray-700 border-b">
                        {isLoadingUser ? (
                          <span>Loading...</span>
                        ) : userError ? (
                          <span>Welcome!</span>
                        ) : (
                          <span>Welcome, {userName}!</span>
                        )}
                      </div>

                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-center cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="px-4 py-2 text-gray-800 hover:text-blue-500 text-left cursor-pointer"
                      >
                        Log in
                      </button>
                      <button
                        onClick={handleSignup}
                        className="px-4 py-2 bg-[#0047AB] hover:bg-blue-700 rounded-md text-white text-center cursor-pointer"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div
          className="flex flex-col items-center justify-center text-center text-white"
          style={{ minHeight: `calc(${height} - 5rem)` }}
        >
          <h1
            className="md:text-5xl text-3xl font-bold mb-2"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
          {subheading && (
            <p className="text-sm mb-12 max-w-2xl">{subheading}</p>
          )}

          {/* Conditionally render search UI */}
          {showSearch && (
            <div className="flex flex-col md:flex-row gap-3 w-full max-w-3xl bg-white p-3 rounded-lg items-center shadow-sm border">
              {/* Category Dropdown */}
              <div className="relative w-full md:flex-1">
                <div className="relative flex items-center">
                  <select
                    className="appearance-none w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-gray-700 text-sm cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    onClick={toggleCategoryDropdown}
                  >
                    <option value="all">All Category</option>
                    <option value="EVENTCENTERS">Event Centers</option>
                    <option value="CATERING">Catering Services</option>
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 transition-transform duration-200 cursor-pointer ${
                      isCategoryOpen ? "rotate-180" : "rotate-0"
                    }`}
                    size={16}
                  />
                </div>
              </div>

              {/* Country Dropdown */}
              <div className="relative w-full md:flex-1">
                <div className="relative flex items-center">
                  <select
                    className="appearance-none w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-gray-700 text-sm cursor-pointer"
                    value={selectedCountry}
                    onChange={(e) => handleCountrySelect(e.target.value)}
                  >
                    <option value="">Select Country</option>
                    {countriesData?.docs.map((country: Country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                    size={16}
                  />
                </div>
              </div>

              {/* State Dropdown */}
              <div className="relative w-full md:flex-1">
                <div className="relative flex items-center">
                  <select
                    className="appearance-none w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-gray-700 text-sm cursor-pointer disabled:opacity-50"
                    value={selectedStateId}
                    onChange={(e) => handleStateSelect(e.target.value)}
                    disabled={!selectedCountry}
                    onClick={toggleLocationDropdown}
                  >
                    <option value="">Select State</option>
                    {statesData?.docs.map((state: State) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 transition-transform duration-200 cursor-pointer ${
                      isLocationOpen ? "rotate-180" : "rotate-0"
                    }`}
                    size={16}
                  />
                </div>
              </div>

              {/* Apply Search Button */}
              <button
                className="bg-[#0047AB] hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full md:w-auto md:min-w-[140px] text-sm font-medium transition-colors cursor-pointer"
                onClick={handleApplySearch}
                disabled={!selectedStateId}
              >
                Apply Search
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
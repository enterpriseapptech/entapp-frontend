// components/layouts/HeroWithNavbar.tsx
"use client";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";

interface HeroProps {
  isCategoryOpen: boolean;
  isLocationOpen: boolean;
  toggleCategoryDropdown: () => void;
  toggleLocationDropdown: () => void;
  handleCategoryChange: () => void;
  handleLocationChange: () => void;
  className?: string;
  backgroundImage?: string;
  height?: string;
  heading?: string; 
  subheading?: string;
}

export default function HeroWithNavbar({
  isCategoryOpen,
  isLocationOpen,
  toggleCategoryDropdown,
  toggleLocationDropdown,
  handleCategoryChange,
  handleLocationChange,
  className,
  backgroundImage = "url('/heroImage.png')",
  height = "600px",
  heading = "Simplify Your Event Planning with<br />All-in-One Booking.", // Default for homepage
  subheading = "Book stunning venues and top-notch catering services effortlessly.", // Default for homepage
}: HeroProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

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

  const navLinks = [
    { label: "Event Centers", href: "/event-center" },
    { label: "Catering Services", href: "#" },
    { label: "Bookings", href: "#" },
    { label: "About Us", href: "#" },
  ];

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

            <div className="hidden md:flex gap-4">
              <button
                className={clsx(
                  "px-4 py-2",
                  isScrolling
                    ? "text-gray-800 hover:text-blue-500"
                    : "text-white hover:text-blue-200"
                )}
              >
                Log in
              </button>
              <button className="px-4 py-2 bg-[#0047AB] hover:bg-blue-700 rounded-md text-white">
                Sign up
              </button>
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
                  <button className="px-4 py-2 text-gray-800 hover:text-blue-500 text-left">
                    Log in
                  </button>
                  <button className="px-4 py-2 bg-[#0047AB] hover:bg-blue-700 rounded-md text-white">
                    Sign up
                  </button>
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
            dangerouslySetInnerHTML={{ __html: heading }} // Render HTML for <br />
          />
          {subheading && ( // Conditionally render the subheading
            <p className="text-sm mb-12 max-w-2xl">{subheading}</p>
          )}

          <div className="flex flex-row gap-2 w-full max-w-3xl bg-white p-2 rounded-lg items-center md:gap-4">
            {/* Category Dropdown */}
            <div className="relative min-w-[150px] sm:min-w-[200px] md:min-w-[250px]">
              <div className="relative flex items-center">
                <select
                  className="appearance-none w-full px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-gray-600 text-xs sm:text-sm sm:px-3 sm:pr-10 cursor-pointer"
                  defaultValue="all"
                  onChange={handleCategoryChange}
                  onClick={toggleCategoryDropdown}
                >
                  <option value="all">All Category</option>
                  <option value="wedding">Wedding Venues</option>
                  <option value="corporate">Corporate Events</option>
                  <option value="social">Social Gatherings</option>
                </select>
                <ChevronDown
                  className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-600 transition-transform duration-200 cursor-pointer ${
                    isCategoryOpen ? "rotate-180" : "rotate-0"
                  }`}
                  size={16}
                />
              </div>
            </div>

            <div className="h-6 w-px bg-gray-300 sm:h-10" />

            <div className="flex-1 relative min-w-0">
              <div className="relative flex items-center">
                <select
                  className="appearance-none w-full px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 text-gray-600 text-xs sm:text-sm sm:px-3 sm:pr-10 cursor-pointer"
                  defaultValue=""
                  onChange={handleLocationChange}
                  onClick={toggleLocationDropdown}
                >
                  <option value="">Location</option>
                  <option value="new-york">New York, NY</option>
                  <option value="los-angeles">Los Angeles, CA</option>
                  <option value="chicago">Chicago, IL</option>
                  <option value="miami">Miami, FL</option>
                </select>
                <ChevronDown
                  className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-600 transition-transform duration-200 cursor-pointer ${
                    isLocationOpen ? "rotate-180" : "rotate-0"
                  }`}
                  size={16}
                />
              </div>
            </div>

            <button className="bg-[#0047AB] hover:bg-blue-700 text-white px-3 py-2 rounded-md min-w-[100px] text-xs sm:text-sm sm:min-w-[140px] sm:px-6">
              Apply Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
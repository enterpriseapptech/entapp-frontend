"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/services/authApi";

export default function Navbar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navLinks = [
    { label: "Event Centers", href: "/event-center" },
    { label: "Catering Services", href: "/cateringServices" },
    { label: "Quotes", href: "/quotes" },
    { label: "Bookings", href: "/bookings" },
    { label: "About Us", href: "#" },
  ];

  // Get user's first name for display
  const userName = user ? `${user.firstName}` : "";

  return (
    <nav
      className={clsx(
        "h-20 flex items-center justify-center text-white px-6 md:px-20",
        isScrolling
          ? "md:px-20 px-10 fixed top-0 left-0 right-0 bg-white/95 shadow-lg z-50 text-gray-800"
          : "relative"
      )}
    >
      <div className="flex items-center justify-between w-full max-w-5xl">
        <div>
          <Link href="/">
            <Image
              src={isScrolling ? "/logo-footer.png" : "/logo-footer.png"}
              alt="logo"
              width={150}
              height={100}
              className="object-contain"
              unoptimized
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={clsx(
                "hover:text-blue-200 text-gray-800",
                isScrolling && "text-gray-800 hover:text-blue-500"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <div
                className={clsx(
                  "px-3 py-1 text-sm",
                  isScrolling ? "text-gray-700" : "text-gray-800"
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
                    : "text-gray-800 hover:text-blue-200"
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

        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
        >
          {openMobileMenu ? (
            <X size={25} color={isScrolling ? "black" : "black"} />
          ) : (
            <Menu size={25} color={isScrolling ? "black" : "black"} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
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
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-blue-500"
                  onClick={() => setOpenMobileMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-5">
              {isLoggedIn ? (
                <>
                  <div className="px-2 py-2 text-sm text-gray-700 border-b text-gray-800">
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
  );
}

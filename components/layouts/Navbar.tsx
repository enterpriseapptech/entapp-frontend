"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";

export default function Navbar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Event Centers", href: "/event-center" },
    { label: "Catering Services", href: "/cateringServices" },
    { label: "Quotes", href: "/quotes" },
    { label: "About Us", href: "#" },
  ];

  return (
    <nav
      className={clsx(
        "h-20 flex items-center justify-center text-white",
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
        <div className="hidden md:flex gap-4">
          <button
            className={clsx(
              "px-4 py-2",
              isScrolling
                ? "text-gray-800 hover:text-blue-500"
                : "text-gray-800 hover:text-blue-200"
            )}
          >
            Log in
          </button>
          <button className="px-4 py-2 bg-[#0047AB] hover:bg-blue-700 rounded-md text-white">
            Sign up
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden"
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
        >
          {openMobileMenu ? (
            <X size={25} color={isScrolling ? "black" : "white"} />
          ) : (
            <Menu size={25} color={isScrolling ? "black" : "white"} />
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
  );
}

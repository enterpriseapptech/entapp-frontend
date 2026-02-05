"use client";

import {
  BarChart3,
  X,
  Search,
  LifeBuoy,
  Settings,
  CreditCard,
  Users,
  MapPin,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SideBar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();

  // Helper function to handle link clicks (for mobile sidebar toggle)
  const handleLinkClick = () => {
    if (isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col p-6 w-72 z-40 transition-transform overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close Button (Mobile) */}
        <button
          className="md:hidden p-2 absolute top-4 right-4"
          onClick={toggleSidebar}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center mb-8">
          <Image
            src="/dashboardlogo.png"
            alt="dashboardlogo.png"
            width={40}
            height={40}
            className="w-40 h-10"
            unoptimized
          />
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium text-sm">Overview</span>
          </Link>

          <Link
            href="/admin/manage-event-center"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/manage-event-center" ||
              pathname === "/admin/manage-event-center"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <Image
              width={20}
              height={20}
              alt="event centers"
              src="/mangeEventCenterIcon.png"
              className="w-5 h-5"
              unoptimized
            />
            <span className="font-medium text-sm">Event Centers</span>
          </Link>

          <Link
            href="/admin/manage-catering-services"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/manage-catering-services" ||
              pathname === "/admin/manage-catering-services"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <Image
              width={20}
              height={20}
              alt="catering"
              src="/mangeEventCenterIcon.png"
              className="w-5 h-5"
              unoptimized
            />
            <span className="font-medium text-sm">Catering</span>
          </Link>

          <Link
            href="/admin/bookings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/bookings"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <Image
              width={20}
              height={20}
              alt="bookings"
              src="/manageBooking.png"
              className="w-5 h-5"
              unoptimized
            />
            <span className="font-medium text-sm">Bookings</span>
          </Link>

          <Link
            href="/admin/subscription-management"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/subscription-management"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium text-sm">Subscriptions</span>
          </Link>

          <Link
            href="/admin/payments"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/payments"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-medium text-sm">Payments</span>
          </Link>

          <Link
            href="/admin/fees"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/fees"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium text-sm">Fees</span>
          </Link>

          <Link
            href="/admin/provider"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/provider"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <Image
              width={20}
              height={20}
              alt="providers"
              src="/mangeEventCenterIcon.png"
              className="w-5 h-5"
              unoptimized
            />
            <span className="font-medium text-sm">Providers</span>
          </Link>

          <Link
            href="/admin/kyc"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/kyc"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="font-medium text-sm">KYC</span>
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/users"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Users</span>
          </Link>

          <Link
            href="/admin/geography"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === "/admin/geography"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={handleLinkClick}
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium text-sm">Geography</span>
          </Link>
        </nav>

        {/* Support, Settings, and Profile Section */}
        <div className="mt-auto pt-8">
          {/* Support Button */}
          <Link
            href="/admin/support"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full`}
            onClick={handleLinkClick}
          >
            <LifeBuoy className="w-5 h-5" />
            <span className="font-medium text-sm">Support</span>
          </Link>

          {/* Settings Button */}
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full`}
            onClick={handleLinkClick}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>

          {/* Horizontal Line */}
          <hr className="my-4 border-gray-200" />

          {/* Profile Section */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Image
              src="/profileImg.png"
              alt="Profile Picture"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
              unoptimized
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Olivia Rhye</p>
              <p className="text-xs text-gray-500">olivia@ui.com</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.833 7.5L10 13.333 4.167 7.5"
                  stroke="currentColor"
                  strokeWidth="1.667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay when Sidebar is Open (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default SideBar;

"use client";

import { BarChart3, X, Search, LifeBuoy, Settings } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const CateringServiceSideBar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-200 focus:ring-1 focus:ring-purple-100"
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <Link
            href="/cateringServiceAdmin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              pathname === "/cateringServiceAdmin"
                ? "bg-[#F2F6FC] text-[#0047AB]"
                : "text-[#081127] hover:bg-gray-100"
            }`}
            onClick={handleLinkClick}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium text-sm">Overview</span>
          </Link>

          <Link
            href="/admin/manage-event-center"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              pathname === "/admin/manage-event-center" || pathname === "/admin/add-event-center"
                ? "bg-[#F2F6FC] text-[#0047AB]"
                : "text-[#081127] hover:bg-gray-100"
            }`}
            onClick={handleLinkClick}
          >
            <Image
              width={10}
              height={10}
              alt="mangeEventCenterIcon"
              src="/mangeEventCenterIcon.png"
              className="w-5 h-5"
              unoptimized
            />
            <span className="font-medium text-sm">Manage Bookings</span>
          </Link>

          <Link
            href="/admin/manage-catering-services"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              pathname === "/admin/manage-catering-services" || pathname === "/admin/add-catering-services"
                ? "bg-[#F2F6FC] text-[#0047AB]"
                : "text-[#081127] hover:bg-gray-100"
            }`}
            onClick={handleLinkClick}
          >
            <Image
              width={10}
              height={10}
              alt="report"
              src="/report.png"
              className="w-5 h-5"
              unoptimized
            />
            <span className="font-medium text-sm whitespace-nowrap">
              Reporting
            </span>
          </Link>
        </nav>

        {/* Support, Settings, and Profile Section */}
        <div className="mt-auto md:pt-8">
          {/* Support Button */}
          <Link
            href="/admin/support"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[#081127] hover:bg-gray-100 w-full`}
            onClick={handleLinkClick}
          >
            <LifeBuoy className="w-5 h-5" />
            <span className="font-medium text-sm">Support</span>
          </Link>

          {/* Settings Button */}
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[#081127] hover:bg-gray-100 w-full`}
            onClick={handleLinkClick}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>

          {/* Horizontal Line */}
          <hr className="my-4 border-gray-200" />

          {/* Profile Section */}
          <div className="flex items-center gap-3 px-4 py-3">
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
              <p className="text-xs text-gray-500">olivia@untitledui.com</p>
            </div>
            <Image
              src="/sidebardown.png"
              alt="sidebardown"
              width={40}
              height={40}
              className="w-10 h-8 rounded-full ml-4"
              unoptimized
            />
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

export default CateringServiceSideBar;
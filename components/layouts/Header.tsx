"use client";

import { Menu, Settings, Bell, Zap } from "lucide-react";

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Header({ setIsSidebarOpen }: HeaderProps) {
  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center md:px-6 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        {/* Left Section: Hamburger Menu + Welcome Message */}
        <div className="flex items-center gap-3 w-full md:p-2">
          {/* Hamburger Menu (Mobile) */}
          <button
            className="md:hidden p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Welcome Message */}
          <div className="flex flex-col">
            <p className="text-base md:text-lg font-semibold text-gray-800">
              Welcome back, Jonnuel
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              Track, manage and forecast your customers and orders.
            </p>
          </div>
        </div>

        {/* Right Section: Upgrade Button + Icons */}
        <div className="flex items-center gap-2 mt-3 md:mt-0 w-full md:w-auto justify-end">
          {/* Upgrade Button */}
          <button className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-200 active:bg-gray-300 text-xs md:text-sm font-medium transition-colors md:whitespace-nowrap">
            <Zap className="w-4 h-4" />
            <span>Upgrade now</span>
          </button>

          {/* Settings Icon */}
          <button className="p-1.5 hover:bg-gray-200 active:bg-gray-300 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>

          {/* Notification Icon */}
          <button className="p-1.5 hover:bg-gray-200 active:bg-gray-300 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>
    </div>
  );
}

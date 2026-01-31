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
  Calendar,
  Utensils,
  Shield,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface PaymentsSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function PaymentsSidebar({ isOpen, toggleSidebar }: PaymentsSidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isOpen) {
      toggleSidebar();
    }
  };

  const navItems = [
    { href: '/admin', icon: BarChart3, label: 'Overview' },
    { href: '/admin/event-centers', icon: MapPin, label: 'Event Centers' },
    { href: '/admin/catering', icon: Utensils, label: 'Catering' },
    { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { href: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { href: '/admin/payments', icon: DollarSign, label: 'Payments' },
    { href: '/admin/fees', icon: DollarSign, label: 'Fees' },
    { href: '/admin/providers', icon: Users, label: 'Providers' },
    { href: '/admin/kyc', icon: Shield, label: 'KYC' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/geography', icon: MapPin, label: 'Geography' },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col p-6 w-72 z-40 transition-transform overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
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
            alt="ENTAPP TECH - Innovation Simplified"
            width={160}
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
        <nav className="flex flex-col space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={handleLinkClick}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-6 border-t border-gray-200 space-y-1">
          <Link
            href="/support"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={handleLinkClick}
          >
            <LifeBuoy className="w-5 h-5" />
            <span className="font-medium text-sm">Support</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={handleLinkClick}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="mt-6 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">OR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Olivia Rhye</p>
            <p className="text-xs text-gray-500 truncate">olivia@ui.com</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}

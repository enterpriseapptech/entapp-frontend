"use client";

import { useState, useEffect } from "react";
import { useGetUserByIdQuery, ServiceType } from "@/redux/services/authApi";
import EventServiceSideBar from "./EventServiceSideBar";
import CateringServiceSideBar from "./CateringServiceSideBar";
import AllServiceSideBar from "./AllServiceSideBar";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ServiceProviderSideBar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId =
      localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const { data: user } = useGetUserByIdQuery(userId!, { skip: !userId });

  const serviceType = user?.serviceProvider?.serviceType;

  if (serviceType === ServiceType.ALL) {
    return <AllServiceSideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />;
  }
  if (serviceType === ServiceType.CATERING) {
    return <CateringServiceSideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />;
  }
  // Default: EVENTCENTERS or loading state
  return <EventServiceSideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />;
};

export default ServiceProviderSideBar;

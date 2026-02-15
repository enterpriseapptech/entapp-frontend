import type { UserFilterType } from "@/types/user.types";

interface FilterTab {
  label: string;
  value: UserFilterType;
}

const FILTER_TABS: FilterTab[] = [
  { label: "All Users", value: "ALL" },
  { label: "Customers", value: "CUSTOMER" },
  { label: "Service Providers", value: "SERVICE_PROVIDER" },
];

interface UserFilterTabsProps {
  activeFilter: UserFilterType;
  onFilterChange: (filter: UserFilterType) => void;
  counts: {
    all: number;
  };
}

export default function UserFilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: UserFilterTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg overflow-x-auto scrollbar-none min-w-0 max-w-full">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onFilterChange(tab.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
            activeFilter === tab.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          {tab.value === "ALL" && (
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                activeFilter === "ALL"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {counts.all}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

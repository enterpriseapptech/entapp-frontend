import { ChevronDown } from "lucide-react";

export default function BookingFilters() {
  return (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
        More filters
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}

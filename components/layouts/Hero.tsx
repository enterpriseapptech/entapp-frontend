import { ChevronDown } from "lucide-react";

interface HeroProps {
  isCategoryOpen: boolean;
  isLocationOpen: boolean;
  toggleCategoryDropdown: () => void;
  toggleLocationDropdown: () => void;
  handleCategoryChange: () => void;
  handleLocationChange: () => void;
}

export default function Hero({
  isCategoryOpen,
  isLocationOpen,
  toggleCategoryDropdown,
  toggleLocationDropdown,
  handleCategoryChange,
  handleLocationChange
}: HeroProps) {
  return (
    <section className="relative h-[600px]">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/heroImage.png')" }}>
        <div className="absolute inset-0 bg-purple-900/60" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 h-[calc(100%-5rem)] flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl font-bold mb-2">
          Simplify Your Event Planning with<br />All-in-One Booking.
        </h1>
        <p className="text-sm mb-12 max-w-2xl">
          Book stunning venues and top-notch catering services effortlessly.
        </p>

        <div className="flex gap-4 w-full max-w-3xl bg-white p-2 rounded-lg items-center">
          <div className="relative min-w-[200px]">
            <div className="relative flex items-center">
              <select
                className="appearance-none w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-gray-600 text-sm cursor-pointer"
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
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 transition-transform duration-200 cursor-pointer ${isCategoryOpen ? "rotate-180" : "rotate-0"}`}
                size={20}
              />
            </div>
          </div>

          <div className="h-10 w-px bg-gray-300" />

          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <select
                className="appearance-none w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-gray-600 text-sm cursor-pointer"
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
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 transition-transform duration-200 cursor-pointer ${isLocationOpen ? "rotate-180" : "rotate-0"}`}
                size={20}
              />
            </div>
          </div>

          <button className="bg-[#0047AB] hover:bg-blue-700 text-white px-6 py-2 rounded-md min-w-[140px]">
            Apply Search
          </button>
        </div>
      </div>
    </section>
  );
}
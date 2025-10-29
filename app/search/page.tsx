"use client";
import { useSearchParams } from "next/navigation";
import { useGetEventCentersByLocationQuery } from "@/redux/services/eventsApi";
import { useGetCateringsByLocationQuery } from "@/redux/services/cateringApi";
import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const locationId = searchParams.get("location") || "";
  const country = searchParams.get("country") || "";
  const state = searchParams.get("state") || "";

  const [currentPage, setCurrentPage] = useState(0);
  const limit = 10;

  // Fetch data based on category
  const { data: eventCentersData, isLoading: isLoadingEvents } =
    useGetEventCentersByLocationQuery(
      { locationId, limit, offset: currentPage * limit },
      {
        skip:
          !locationId || (category !== "all" && category !== "EVENTCENTERS"),
      }
    );

  const { data: cateringData, isLoading: isLoadingCatering } =
    useGetCateringsByLocationQuery(
      { locationId, limit, offset: currentPage * limit },
      { skip: !locationId || (category !== "all" && category !== "CATERING") }
    );

  const isLoading = isLoadingEvents || isLoadingCatering;

  const totalResults = (eventCentersData?.count || 0) + (cateringData?.count || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-12 bg-blue-600 rounded"></div>
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              Search Results
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {category === "all" && "All Services"}
            {category === "EVENTCENTERS" && "Event Centers"}
            {category === "CATERING" && "Catering Services"}
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-lg">
              {state}, {country}
              {!isLoading && totalResults > 0 && (
                <span className="ml-2 text-gray-400">• {totalResults} results</span>
              )}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading results...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <div className="space-y-12">
            {/* Event Centers Results */}
            {(category === "all" || category === "EVENTCENTERS") &&
              eventCentersData && eventCentersData.count > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Event Centers
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {eventCentersData.count} found
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventCentersData.data.map((eventCenter) => (
                      <Link 
                        key={eventCenter.id} 
                        href={`/event-center/${eventCenter.id}`}
                        className="block"
                      >
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer">
                          <div className="relative h-52 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                            {eventCenter.images[0] ? (
                              <img
                                src={eventCenter.images[0]}
                                alt={eventCenter.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
                              <span className="text-sm font-bold text-blue-600">
                                ${eventCenter.pricingPerSlot}
                              </span>
                              <span className="text-xs text-gray-500">/slot</span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                              {eventCenter.name}
                            </h3>
                            <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {eventCenter.city}
                            </p>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                              {eventCenter.description}
                            </p>
                            <div className="pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-sm">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-gray-700 font-medium">
                                  Up to {eventCenter.sittingCapacity} guests
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Catering Results */}
            {(category === "all" || category === "CATERING") && cateringData && cateringData.count > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Catering Services
                  </h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {cateringData.count} found
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cateringData.data.map((catering) => (
                    <Link 
                      key={catering.id} 
                      href={`/cateringServices/${catering.id}`}
                      className="block"
                    >
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer">
                        <div className="relative h-52 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                          {catering.images[0] ? (
                            <img
                              src={catering.images[0]}
                              alt={catering.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
                            <span className="text-xs text-gray-500">From </span>
                            <span className="text-sm font-bold text-green-600">
                              ${catering.startPrice}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-green-600 transition-colors">
                            {catering.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-3 italic">
                            {catering.tagLine}
                          </p>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                            {catering.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {catering.cuisine.slice(0, 3).map((cuisine, index) => (
                              <span
                                key={index}
                                className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200"
                              >
                                {cuisine}
                              </span>
                            ))}
                            {catering.cuisine.length > 3 && (
                              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                +{catering.cuisine.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-gray-700 font-medium">
                                {catering.minCapacity}-{catering.maxCapacity} guests
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {totalResults === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn&apos;t find any services matching your criteria. Try adjusting your search or browse all categories.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalResults > 0 && (
          <div className="flex justify-center items-center gap-3 mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-600">
              Page {currentPage + 1}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={
                (category === "all" || category === "EVENTCENTERS"
                  ? (eventCentersData?.count || 0) <= (currentPage + 1) * limit
                  : true) &&
                (category === "all" || category === "CATERING"
                  ? (cateringData?.count || 0) <= (currentPage + 1) * limit
                  : true)
              }
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

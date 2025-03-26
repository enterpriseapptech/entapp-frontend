"use client";
import Image from "next/image";
// import { useState } from "react";

interface CustomerReview {
  quote: string;
  name: string;
  userImage: string;
  profession: string;
  companyName: string;
}

interface CustomerReviewsProps {
  reviews: CustomerReview[];
  currentPage: number;
  reviewsPerPage: number;
  totalPages: number;
  handleNextReview: () => void;
  handlePrevReview: () => void;
  setCurrentPage: (page: number) => void;
}

export default function CustomerReviews({
  reviews,
  currentPage,
  reviewsPerPage,
  totalPages,
  handleNextReview,
  handlePrevReview,
  setCurrentPage,
}: CustomerReviewsProps) {
  const startIndex = currentPage * reviewsPerPage;
  const displayedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#081127]">Customer Review</h2>
          <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedReviews.map((review, index) => (
              <div key={startIndex + index} className="bg-white border p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">&quot;{review.quote}&quot;</p>
                <div className="flex items-center">
                  <Image
                    src={review.userImage}
                    alt={review.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="flex flex-col">
                    <p className="text-[#081127] text-sm">{review.name}</p>
                    <div className="flex gap-1">
                        <p className="text-gray-400 text-xs">{review.profession},</p>
                        <p className="text-gray-400 text-xs">{review.companyName}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrevReview}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextReview}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentPage ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
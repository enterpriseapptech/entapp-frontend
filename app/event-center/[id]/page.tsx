"use client";
import Link from "next/link";
import HeroWithNavbar from "@/components/layouts/HeroWithNavbar";
import Image from "next/image";
import { useState } from "react";
import { Calendar, Wifi, Shield, User, BadgeCheck, FileText, Ban } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CustomerReviews from "@/components/layouts/CustomerReviews";
import FeaturedVenues from "@/components/layouts/FeaturedVenues";
import Footer from "@/components/layouts/Footer";
import CardSkeleton from "@/components/ui/card-skeleton";
import { useGetEventCenterByIdQuery } from "@/redux/services/eventsApi";

export interface EventCenter {
  id: string;
  serviceProviderId: string;
  name: string;
  eventTypes: string[];
  depositAmount: number;
  totalAmount?: number;
  description: string;
  pricingPerSlot: number;
  sittingCapacity: number;
  venueLayout: string;
  amenities: string[];
  images: string[];
  termsOfUse: string;
  cancellationPolicy: string;
  streetAddress: string;
  streetAddress2: string | null;
  city: string;
  location: string;
  postal: string;
  status: string;
  rating?: number;
  paymentRequired: boolean;
  contact: string;
  // createdAt: string;
  // updatedAt: string;
  // deletedAt: string | null;
  // deletedBy: string | null;
}

export default function EventCenterDetails() {
  const params = useParams();
  const { id } = params as { id: string };
  const router = useRouter();

  const { data: eventCenterData, isLoading, error } = useGetEventCenterByIdQuery(id);

  // Map API data to component's EventCenter interface
  const eventCenter: EventCenter | undefined = eventCenterData
    ? {
        id: eventCenterData.id,
        serviceProviderId: eventCenterData.serviceProviderId,
        name: eventCenterData.name,
        eventTypes: eventCenterData.eventTypes,
        depositAmount: eventCenterData.depositAmount,
        totalAmount: eventCenterData.totalAmount,
        description: eventCenterData.description,
        pricingPerSlot: eventCenterData.pricingPerSlot,
        sittingCapacity: eventCenterData.sittingCapacity,
        venueLayout: eventCenterData.venueLayout,
        amenities: eventCenterData.amenities,
        images: eventCenterData.images.length ? eventCenterData.images : ["/placeholder-image.png"],
        termsOfUse: eventCenterData.termsOfUse,
        cancellationPolicy: eventCenterData.cancellationPolicy,
        streetAddress: eventCenterData.streetAddress,
        streetAddress2: eventCenterData.streetAddress2,
        city: eventCenterData.city,
        location: eventCenterData.location,
        postal: eventCenterData.postal,
        status: eventCenterData.status,
        rating: eventCenterData.rating,
        paymentRequired: eventCenterData.paymentRequired,
        contact: eventCenterData.contact,
      }
    : undefined;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isMoreThanOneDay, setIsMoreThanOneDay] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState<string>("");

  const images = eventCenter?.images || ["/placeholder-image.png"];

  // State and logic for CustomerReviews pagination
  const [currentReviewPage, setCurrentReviewPage] = useState<number>(0);

  const reviews = [
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      userImage: "/user1.png",
      profession: "position",
      companyName: "companyName",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      userImage: "/user2.png",
      profession: "position",
      companyName: "companyName",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      userImage: "/user3.png",
      profession: "position",
      companyName: "companyName",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      userImage: "/user1.png",
      profession: "position",
      companyName: "companyName",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      userImage: "/user2.png",
      profession: "position",
      companyName: "companyName",
    },
  ];

  const reviewsPerPage = 3;
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleNextReview = () =>
    setCurrentReviewPage((prev) => (prev + 1) % totalReviewPages);
  const handlePrevReview = () =>
    setCurrentReviewPage((prev) => (prev - 1 + totalReviewPages) % totalReviewPages);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddDate = () => {
    setSelectedDates([...selectedDates, ""]);
  };

  const handleDateChange = (index: number, date: string) => {
    const updatedDates = [...selectedDates];
    updatedDates[index] = date;
    setSelectedDates(updatedDates);
  };

  const handleRemoveDate = (index: number) => {
    const updatedDates = selectedDates.filter((_, i) => i !== index);
    setSelectedDates(updatedDates);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.length === 0 || selectedDates.some((date) => !date)) {
      alert("Please select all dates.");
      return;
    }
    if (!numberOfGuests) {
      alert("Please select the number of guests.");
      return;
    }
    router.push(
      `/payment?dates=${selectedDates.join(",")}&time=12:00 pm&totalCost=${
        eventCenter!.totalAmount
      }&eventTitle=${eventCenter!.name}`
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <HeroWithNavbar
          isCategoryOpen={false}
          isLocationOpen={false}
          toggleCategoryDropdown={() => {}}
          toggleLocationDropdown={() => {}}
          handleCategoryChange={() => {}}
          handleLocationChange={() => {}}
          height="400px"
          backgroundImage="url('/eventHeroImage.png')"
          heading="Event Centers"
          subheading=""
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <CardSkeleton />
          </div>
          <div className="lg:w-[350px]">
            <CardSkeleton />
          </div>
        </div>
      </main>
    );
  }

  // Error state or event not found
  if (error || !eventCenter) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <HeroWithNavbar
          isCategoryOpen={false}
          isLocationOpen={false}
          toggleCategoryDropdown={() => {}}
          toggleLocationDropdown={() => {}}
          handleCategoryChange={() => {}}
          handleLocationChange={() => {}}
          height="400px"
          backgroundImage="url('/eventHeroImage.png')"
          heading="Event Centers"
          subheading=""
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-red-600">
          Event not found or error loading data. Please try again later.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <HeroWithNavbar
        isCategoryOpen={false}
        isLocationOpen={false}
        toggleCategoryDropdown={() => {}}
        toggleLocationDropdown={() => {}}
        handleCategoryChange={() => {}}
        handleLocationChange={() => {}}
        height="400px"
        backgroundImage="url('/eventHeroImage.png')"
        heading="Event Centers"
        subheading=""
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-[#F2F6FC] p-8">
          <nav className="text-gray-500 text-sm mb-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            {">"}{" "}
            <Link href="/event-centers" className="hover:underline">
              Event Centers
            </Link>{" "}
            {">"} <span className="text-gray-800">{eventCenter.name}</span>
          </nav>

          <h1 className="md:text-4xl text-2xl font-bold text-gray-900 mb-4">
            {eventCenter.name}
          </h1>
          <p className="text-gray-600 mb-8">{eventCenter.description}</p>

          <div className="relative mb-8">
            <Image
              src={images[currentImageIndex]}
              alt={eventCenter.name}
              width={800}
              height={400}
              className="w-full h-80 object-cover rounded-lg"
              unoptimized={!images[currentImageIndex].startsWith('/')}
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {eventCenter.name}
            </h2>
            <p className="text-gray-600">{eventCenter.description}</p>
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2 pt-2">
                Event Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {eventCenter.eventTypes.map((type, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1 mt-2">
                Amenities
              </h3>
              <div className="flex gap-6">
                {eventCenter.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {amenity === "WIFI" && <Wifi className="w-4 h-4 text-gray-600" />}
                    {amenity === "PACKINGSPACE" && (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v-4a4 4 0 014-4h0a4 4 0 014 4v4m-8 0h8m-8 0H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-3m-8 0v4a1 1 0 001 1h6a1 1 0 001-1v-4" />
                      </svg>
                    )}
                    {amenity === "SECURITY" && <Shield className="w-4 h-4 text-gray-600" />}
                    <span className="text-gray-600 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Location
              </h3>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-600 text-sm">
                  {eventCenter.streetAddress}
                  {eventCenter.streetAddress2 && `, ${eventCenter.streetAddress2}`}, {eventCenter.location}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1 mt-2">
                Amenities
              </h3>
              <div className="flex gap-6">
                {eventCenter.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {amenity === "WIFI" && (
                      <Wifi className="w-4 h-4 text-gray-600" />
                    )}
                    {amenity === "PACKINGSPACE" && (
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 14v-4a4 4 0 014-4h0a4 4 0 014 4v4m-8 0h8m-8 0H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-3m-8 0v4a1 1 0 001 1h6a1 1 0 001-1v-4"
                        />
                      </svg>
                    )}
                    {amenity === "SECURITY" && (
                      <Shield className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="text-gray-600 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pb-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Capacity
              </h3>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-gray-600">{eventCenter.sittingCapacity}</span>
              </div>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Pricing
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">
                  Deposit: ₦{eventCenter.depositAmount.toLocaleString()}
                </span>
                {eventCenter.totalAmount && (
                  <span className="text-gray-600 text-sm">
                    | Total: ₦{eventCenter.totalAmount.toLocaleString()}
                  </span>
                )}
                <span className="text-gray-600 text-sm">
                  | Per slot: ₦{eventCenter.pricingPerSlot.toLocaleString()}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Venue Layout
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">{eventCenter.venueLayout}</span>
              </div>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Status
              </h3>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 text-sm">{eventCenter.status}</span>
              </div>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Terms of Use
              </h3>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 text-sm">{eventCenter.termsOfUse}</span>
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1">
                Cancellation Policy
              </h3>
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 text-sm">{eventCenter.cancellationPolicy}</span>
              </div>
            </div>
            <div>
              <hr className="mb-2" />
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-600 text-xs">{eventCenter.description}</p>
              <button className="text-blue-600 text-xs mt-2">Read more</button>
            </div>
          </div>
        </div>

        <aside className="lg:w-[350px] bg-white p-6 rounded-lg shadow-md sticky top-6">
          <h2 className="text-md font-semibold text-gray-800 mb-4">Book Now</h2>
          <form className="space-y-4" onSubmit={handleBook}>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={isMoreThanOneDay}
                  onChange={(e) => {
                    setIsMoreThanOneDay(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedDates(selectedDates.slice(0, 1));
                    }
                  }}
                />
                <span className="text-gray-600 text-sm">More than one day</span>
              </label>
            </div>

            <div className="space-y-3">
              {selectedDates.map((date, index) => (
                <div key={index} className="relative flex items-center gap-2">
                  <div className="flex-1 flex items-center border rounded-md px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                    <select
                      className="w-full text-gray-600 text-sm focus:outline-none"
                      value={date}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select a date
                      </option>
                      {/* {eventCenter.availability
                        .filter((availDate) => !selectedDates.includes(availDate) || availDate === date)
                        .map((availDate) => (
                          <option key={availDate} value={availDate}>
                            {availDate}
                          </option>
                        ))} */}
                    </select>
                  </div>
                  {isMoreThanOneDay && selectedDates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {selectedDates.length === 0 && (
                <div className="flex items-center border rounded-md px-3 py-2">
                  <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                  <select
                    className="w-full text-gray-600 text-sm focus:outline-none"
                    value=""
                    onChange={(e) => setSelectedDates([e.target.value])}
                    required
                  >
                    <option value="" disabled>
                      Select a date
                    </option>
                    {/* {eventCenter.availability.map((availDate) => (
                      <option key={availDate} value={availDate}>
                        {availDate}
                      </option>
                    ))} */}
                  </select>
                </div>
              )}
              {isMoreThanOneDay && (
                <button
                  type="button"
                  onClick={handleAddDate}
                  className="text-blue-600 text-sm block w-full text-right hover:underline"
                >
                  Add another date
                </button>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center border rounded-md px-3 py-2">
                <User className="w-4 h-4 text-gray-600 mr-2" />
                <select
                  className="w-full text-gray-600 text-sm focus:outline-none"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>
                    Number of guests
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-[#0047AB] text-white py-3 rounded-md hover:bg-blue-700 transition text-lg font-semibold"
            >
              Book {eventCenter.totalAmount ? `₦${eventCenter.totalAmount.toLocaleString()}` : "now"}
            </button>
            <hr className="mb-2" />
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-400 text-sm">Share</span>
              <div className="flex gap-3">
                <Image
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="w-6 h-6"
                />
                <Image
                  src="/facebook.png"
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="w-6 h-6"
                />
                <Image
                  src="/twitter.png"
                  alt="Twitter"
                  width={20}
                  height={20}
                  className="w-6 h-6"
                />
                <Image
                  src="/email.png"
                  alt="Email"
                  width={20}
                  height={20}
                  className="w-6 h-6"
                />
                <Image
                  src="/pinterest.png"
                  alt="Pinterest"
                  width={20}
                  height={20}
                  className="w-6 h-6"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Note: Invoice amount will be displayed in NGN currency but can be
              paid with Credit Cards in other currencies.
            </p>
          </form>
        </aside>
      </div>
      <hr className="mb-4 mt-4 mx-30" />
      <CustomerReviews
        reviews={reviews}
        currentPage={currentReviewPage}
        reviewsPerPage={reviewsPerPage}
        totalPages={totalReviewPages}
        handleNextReview={handleNextReview}
        handlePrevReview={handlePrevReview}
        setCurrentPage={setCurrentReviewPage}
      />
      <hr className="mb-4 mt-4 mx-30" />
      <FeaturedVenues heading="Featured Event Centers" />
      <Footer />
    </main>
  );
}
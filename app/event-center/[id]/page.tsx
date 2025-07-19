"use client";
import Link from "next/link";
import HeroWithNavbar from "@/components/layouts/HeroWithNavbar";
import Image from "next/image";
import { useState } from "react";
import { FileText, Ban, BadgeCheck, Wifi, Shield } from "lucide-react";
import { useParams } from "next/navigation";
import CustomerReviews from "@/components/layouts/CustomerReviews";
import FeaturedVenues from "@/components/layouts/FeaturedVenues";
import Footer from "@/components/layouts/Footer";
import CardSkeleton from "@/components/ui/card-skeleton";
import { useGetEventCenterByIdQuery } from "@/redux/services/eventsApi";
import DatePicker from "@/components/ui/DatePicker";

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
}

interface BookingData {
  date: string;
  time: string;
  guests: number;
  price: number;
}

export default function EventCenterDetails() {
  const params = useParams();
  const { id } = params as { id: string };
  // const router = useRouter();

  const { data: eventCenterData, isLoading, error } = useGetEventCenterByIdQuery(id);

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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingData | null>(null);

  const images = eventCenter?.images || ["/placeholder-image.png"];

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

  const handleBook = (bookingData: BookingData) => {
    setLastBooking(bookingData);
    console.log('Booking confirmed:', bookingData);
    // router.push(
    //   `/payment?date=${bookingData.date}&time=${bookingData.time}&guests=&totalCost=${bookingData.price}&eventTitle=${eventCenter!.name}`
    // );
  };

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

        <aside className="lg:w-[350px] bg-white p-6 rounded-lg shadow-lg sticky top-6 h-[750px]">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Book Your Event
            </h2>
            <p className="text-gray-600 text-sm">
              Reserve our premium event center for your special occasion
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                What&apos;s Included
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Spacious venue with modern amenities</p>
                <p>• Professional event support team</p>
                <p>• Flexible seating arrangements</p>
                <p>• High-speed Wi-Fi and AV equipment</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Starting from</span>
                <span className="text-2xl font-bold text-[#0047AB]">
                  ₦{eventCenter.depositAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Final price depends on event duration and guest count
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDatePickerOpen(true)}
            className="w-full bg-[#0047AB] text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg cursor-pointer"
          >
            Choose Date & Time
          </button>

          {lastBooking && (
            <div className="mt-6 border border-green-200 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                Latest Booking
              </h3>
              <div className="space-y-1 text-sm text-green-800">
                <p>Date: {new Date(lastBooking.date).toLocaleDateString()}</p>
                <p>Time: {lastBooking.time}</p>
                <p>Guests: {lastBooking.guests}</p>
                <p>Price: ₦{lastBooking.price.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Need help with your booking?
              </p>
              <p className="text-sm font-medium text-[#0047AB]">
                {eventCenter.contact}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Share</span>
              <div className="flex gap-3">
                <Image
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <Image
                  src="/facebook.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <Image
                  src="/twitter.png"
                  alt="Twitter"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <Image
                  src="/email.png"
                  alt="Email"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <Image
                  src="/pinterest.png"
                  alt="Pinterest"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Secure booking • Flexible cancellation • Professional service guaranteed
          </p>
        </aside>
      </div>

      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onBook={handleBook}
        startPrice={eventCenter.depositAmount}
      />

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
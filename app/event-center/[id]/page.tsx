"use client";
import Link from "next/link";
import HeroWithNavbar from "@/components/layouts/HeroWithNavbar";
import Image from "next/image";
import { useState } from "react";
import { Calendar, Wifi, Shield, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CustomerReviews from "@/components/layouts/CustomerReviews";
import FeaturedVenues from "@/components/layouts/FeaturedVenues";
import Footer from "@/components/layouts/Footer";

interface EventCenter {
  id: string;
  name: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  price: string;
  eventType: string;
  capacity: number;
  availability: string[];
  amenities: string[];
}

export default function EventCenterDetails() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const eventCenters: EventCenter[] = [
    {
      id: "1",
      name: "Event Hall",
      title: "Mezebu Event Centers",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/bookEvent.png", "/event.png", "/event.png"],
      location: "Lagos, Nigeria",
      price: "₦500 per night",
      eventType: "Weddings",
      capacity: 900,
      availability: ["Sat 10 Feb 2024", "Sun 11 Feb 2024", "Mon 12 Feb 2024"], // Updated to array for multiple dates
      amenities: ["WiFi", "Parking Space", "Security"],
    },
    {
      id: "2",
      name: "Event Hall",
      title: "Skyline Event Hall",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/bookEvent.png", "/event.png", "/event.png"],
      location: "Abuja, Nigeria",
      price: "₦300 per night",
      eventType: "Birthdays",
      capacity: 1000,
      availability: ["Sun 11 Feb 2024", "Mon 12 Feb 2024"], // Updated to array for multiple dates
      amenities: ["WiFi", "Security"],
    },
  ];

  const eventCenter = eventCenters.find((center) => center.id === id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState<string[]>([]); // Array to store multiple selected dates
  const [isMoreThanOneDay, setIsMoreThanOneDay] = useState(false); // State for "More than one day" checkbox
  const [numberOfGuests, setNumberOfGuests] = useState<string>("");

  const images = eventCenter?.images || ["/eventCard1.png"];

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
    // Add a new empty date slot to the selectedDates array
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
    // Navigate to PaymentPage with query parameters
    router.push(
      `/payment?dates=${selectedDates.join(",")}&time=12:00 pm&totalCost=${
        eventCenter!.price
      }&eventTitle=${eventCenter!.title}`
    );
  };

  if (!eventCenter) {
    return <div className="min-h-screen bg-gray-50 p-8">Event not found</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-8">
        {/* Left Section: Breadcrumb and Details */}
        <div className="flex-1 bg-[#F2F6FC] p-8">
          {/* Breadcrumb Navigation */}
          <nav className="text-gray-500 text-sm mb-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            {">"}{" "}
            <Link href="/event-centers-details" className="hover:underline">
              Link Two
            </Link>{" "}
            {">"} <span className="text-gray-800">{eventCenter.title}</span>
          </nav>

          {/* Event Center Title */}
          <h1 className="md:text-4xl text-2xl font-bold text-gray-900 mb-4">
            {eventCenter.title}
          </h1>
          <p className="text-gray-600 mb-8">{eventCenter.description}</p>

          {/* Image Gallery */}
          <div className="relative mb-8">
            <Image
              src={images[currentImageIndex]}
              alt={eventCenter.title}
              width={800}
              height={400}
              className="w-full h-80 object-cover rounded-lg"
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

          {/* Event Center Details */}
          <div className="space-y-4">
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800">
              {eventCenter.title}
            </h2>
            <p className="text-gray-600">{eventCenter.description}</p>

            {/* Availability */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2 pt-2">
                Availability
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 text-sm">
                  {eventCenter.availability.join(", ")}
                </span>
              </div>
            </div>

            {/* Location */}
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
                  {eventCenter.location}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1 mt-2">
                Amenities
              </h3>
              <div className="flex gap-6">
                {eventCenter.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {amenity === "WiFi" && (
                      <Wifi className="w-4 h-4 text-gray-600" />
                    )}
                    {amenity === "Parking Space" && (
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
                    {amenity === "Security" && (
                      <Shield className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="text-gray-600 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity */}
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
                <span className="text-gray-600">{eventCenter.capacity}</span>
              </div>
            </div>

            {/* Description */}
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

        {/* Right Section: Booking Form */}
        <aside className="lg:w-[350px] bg-white p-6 rounded-lg shadow-md sticky top-6">
          <h2 className="text-md font-semibold text-gray-800 mb-4">Book Now</h2>
          <form className="space-y-4" onSubmit={handleBook}>
            {/* Duration */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={isMoreThanOneDay}
                  onChange={(e) => {
                    setIsMoreThanOneDay(e.target.checked);
                    if (!e.target.checked) {
                      // Reset to single date if unchecked
                      setSelectedDates(selectedDates.slice(0, 1));
                    }
                  }}
                />
                <span className="text-gray-600 text-sm">More than one day</span>
              </label>
            </div>

            {/* Date Selection */}
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
                      {eventCenter.availability
                        .filter((availDate) => !selectedDates.includes(availDate) || availDate === date) // Prevent selecting already chosen dates
                        .map((availDate) => (
                          <option key={availDate} value={availDate}>
                            {availDate}
                          </option>
                        ))}
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
                    {eventCenter.availability.map((availDate) => (
                      <option key={availDate} value={availDate}>
                        {availDate}
                      </option>
                    ))}
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

            {/* Number of Guests */}
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

            {/* Price and Book Button */}
            <button
              type="submit"
              className="w-full cursor-pointer bg-[#0047AB] text-white py-3 rounded-md hover:bg-blue-700 transition text-lg font-semibold"
            >
              Book {eventCenter.price}
            </button>
            <hr className="mb-2" />
            {/* Share Options */}
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

            {/* Note */}
            <p className="text-xs text-gray-500 mt-4">
              Note: Invoice amount will be displayed in NGN currency but can be
              paid with Credit Cards in other currencies.
            </p>
          </form>
        </aside>
      </div>
      <hr className="mb-4 mt-4 mx-30" />
      {/* Customer Reviews Section */}
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
      <FeaturedVenues heading="Featured Event Centers"/>
      <Footer />
    </main>
  );
}
// pages/catering-service/[id].tsx
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

interface CateringService {
  id: string;
  name: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  price: string;
  cuisineType: string;
  orderSize: number;
  availability: string;
  amenities: string[];
}

export default function CateringServiceDetails() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const cateringServices: CateringService[] = [
    {
      id: "1",
      name: "Catering Service",
      title: "Taste of Africa",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/event.png", "/catering.png"],
      location: "Lagos, Nigeria",
      price: "₦500,000",
      cuisineType: "African",
      orderSize: 2000,
      availability: "Sat 10 Feb 2024",
      amenities: ["WiFi", "Parking Space", "Security"],
    },
    {
      id: "2",
      name: "Catering Service",
      title: "Italian Delight",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "Abuja, Nigeria",
      price: "₦300,000",
      cuisineType: "Italian",
      orderSize: 1000,
      availability: "Sun 11 Feb 2024",
      amenities: ["WiFi", "Security"],
    },
    {
      id: "3",
      name: "Catering Service",
      title: "Chinese Feast",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "London, UK",
      price: "₦800,000",
      cuisineType: "Chinese",
      orderSize: 3000,
      availability: "Mon 12 Feb 2024",
      amenities: ["WiFi", "Parking Space"],
    },
    {
      id: "4",
      name: "Catering Service",
      title: "French Gourmet",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "New York, USA",
      price: "₦600,000",
      cuisineType: "French",
      orderSize: 1500,
      availability: "Tue 13 Feb 2024",
      amenities: ["Security", "Parking Space"],
    },
    {
      id: "5",
      name: "Catering Service",
      title: "African Spice",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "Lagos, Nigeria",
      price: "₦450,000",
      cuisineType: "African",
      orderSize: 800,
      availability: "Wed 14 Feb 2024",
      amenities: ["WiFi", "Security"],
    },
    {
      id: "6",
      name: "Catering Service",
      title: "Italian Bistro",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "Abuja, Nigeria",
      price: "₦250,000",
      cuisineType: "Italian",
      orderSize: 500,
      availability: "Thu 15 Feb 2024",
      amenities: ["WiFi", "Parking Space"],
    },
    {
      id: "7",
      name: "Catering Service",
      title: "Chinese Dragon",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "London, UK",
      price: "₦700,000",
      cuisineType: "Chinese",
      orderSize: 4000,
      availability: "Fri 16 Feb 2024",
      amenities: ["Security", "WiFi"],
    },
    {
      id: "8",
      name: "Catering Service",
      title: "French Elegance",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "New York, USA",
      price: "₦550,000",
      cuisineType: "French",
      orderSize: 2500,
      availability: "Sat 17 Feb 2024",
      amenities: ["Parking Space", "Security"],
    },
    {
      id: "9",
      name: "Catering Service",
      title: "Savory Africa",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "Lagos, Nigeria",
      price: "₦400,000",
      cuisineType: "African",
      orderSize: 1800,
      availability: "Sun 18 Feb 2024",
      amenities: ["WiFi", "Parking Space"],
    },
    {
      id: "10",
      name: "Catering Service",
      title: "Italian Charm",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      images: ["/catering.png", "/catering.png", "/catering.png"],
      location: "Abuja, Nigeria",
      price: "₦200,000",
      cuisineType: "Italian",
      orderSize: 600,
      availability: "Mon 19 Feb 2024",
      amenities: ["WiFi", "Security"],
    },
  ];

  const cateringService = cateringServices.find((service) => service.id === id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [numberOfGuests, setNumberOfGuests] = useState<string>("");

  const images = cateringService?.images || ["/catering.png"];

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

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to PaymentPage with query parameters
    router.push(
      `/payment?date=${selectedDate || cateringService!.availability}&time=12:00 pm&totalCost=${
        cateringService!.price
      }&serviceTitle=${cateringService!.title}`
    );
  };

  if (!cateringService) {
    return <div className="min-h-screen bg-gray-50 p-8">Service not found</div>;
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
        backgroundImage="url('/caterringSerDetails.png')"
        heading="Catering Services"
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
            <Link href="/catering-service" className="hover:underline">
              Catering Services
            </Link>{" "}
            {">"} <span className="text-gray-800">{cateringService.title}</span>
          </nav>

          {/* Catering Service Title */}
          <h1 className="md:text-4xl text-2xl font-bold text-gray-900 mb-4">
            {cateringService.title}
          </h1>
          <p className="text-gray-600 mb-8">{cateringService.description}</p>

          {/* Image Gallery */}
          <div className="relative mb-8">
            <Image
              src={images[currentImageIndex]}
              alt={cateringService.title}
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

          {/* Catering Service Details */}
          <div className="space-y-4">
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800">
              {cateringService.title}
            </h2>
            <p className="text-gray-600">{cateringService.description}</p>

            {/* Availability */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2 pt-2">
                Availability
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 text-sm">
                  {cateringService.availability}
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
                  {cateringService.location}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-1 mt-2">
                Amenities
              </h3>
              <div className="flex gap-6">
                {cateringService.amenities.map((amenity, index) => (
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

            {/* Order Size */}
            <div className="pb-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Order Size
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
                <span className="text-gray-600">{cateringService.orderSize}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <hr className="mb-2" />
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-600 text-xs">{cateringService.description}</p>
              <button className="text-blue-600 text-xs mt-2">Read more</button>
            </div>
          </div>
        </div>

        {/* Right Section: Booking Form */}
        <aside className="lg:w-[350px] h-[45%] bg-white p-6 rounded-lg shadow-md sticky top-6">
          <h2 className="text-md font-semibold text-gray-800 mb-4">Book Now</h2>
          <form className="space-y-4" onSubmit={handleBook}>
            {/* Duration */}
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" />
                <span className="text-gray-600 text-sm">More than one day</span>
              </label>
            </div>

            {/* Date Picker */}
            <div className="relative">
              <div className="flex items-center border rounded-md px-3 py-2">
                <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                <input
                  type="date"
                  className="w-full text-gray-600 text-sm focus:outline-none"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <button className="text-blue-600 text-sm mt-2 block w-full text-right">
                Add another date
              </button>
            </div>

            {/* Number of Guests */}
            <div className="relative">
              <div className="flex items-center border rounded-md px-3 py-2">
                <User className="w-4 h-4 text-gray-600 mr-2" />
                <select
                  className="w-full text-gray-600 text-sm focus:outline-none"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
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
              Book {cateringService.price}
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
      <FeaturedVenues heading="Featured Catering Services" />
      <Footer />
    </main>
  );
}
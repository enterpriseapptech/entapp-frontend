"use client";
import { useState } from "react";
import HeroWithNavbar from "@/components/layouts/HeroWithNavbar";
import Features from "@/components/layouts/Features";
import FeaturedVenues from "@/components/layouts/FeaturedVenues";
import CateringServices from "@/components/layouts/CateringServices";
import ElevateEvents from "@/components/layouts/ElevateEvents";
import EventPlanning from "@/components/layouts/EventPlanning";
import BookEvent from "@/components/layouts/BookEvent";
import Testimonials from "@/components/layouts/Testimonials";
import EventGallery from "@/components/layouts/EventGallery";
import PlanNextEvent from "@/components/layouts/PlanNextEvent";
import Footer from "@/components/layouts/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const router = useRouter();
  const handleSearch = (
    category: string,
    locationId: string,
    countryName: string,
    stateName: string
  ) => {
    // Navigate to search page with parameters
    router.push(
      `/search?category=${category}&location=${locationId}&country=${encodeURIComponent(
        countryName
      )}&state=${encodeURIComponent(stateName)}`
    );
  };
  const handleCategoryChange = (category: string) => {
    console.log("Category changed to:", category);
  };

  const handleLocationChange = (location: string) => {
    console.log("Location changed to:", location);
  };

  const testimonials = [
    {
      quote:
        "Booking our venue and catering through this platform was incredibly easy. The service was fast, and everything arrived exactly as promised. Our guests loved the setup!",
      name: "Sarah Johnson",
      position: "Event Host",
      company: "Private Wedding Event",
    },
    {
      quote:
        "I was able to find a beautiful event center within minutes. The catering team was professional, punctual, and the food was exceptional. Highly recommended!",
      name: "Michael Adewale",
      position: "Project Manager",
      company: "Adewale & Co.",
    },
    {
      quote:
        "What impressed me most was the seamless booking experience. From decorations to catering, every detail was handled perfectly. Made my event stress-free.",
      name: "Chiamaka Eze",
      position: "Founder",
      company: "Chia Events",
    },
    {
      quote:
        "The platform saved us so much time! We found the ideal hall, hired catering, and scheduled delivery in one place. Everything was smooth and well-organized.",
      name: "David Thompson",
      position: "Operations Lead",
      company: "Thompson Realty",
    },
    {
      quote:
        "Effortless experience from start to finish. The team delivered high-quality catering, and the venue looked amazing. Definitely using this for future events.",
      name: "Aisha Mohammed",
      position: "Entrepreneur",
      company: "AM Fashion House",
    },
    {
      quote:
        "I loved how transparent the pricing was. No hidden fees, and the customer support responded quickly. Our birthday event was a huge success!",
      name: "Samuel Obi",
      position: "Parent",
      company: "Obi Family Event",
    },
    {
      quote:
        "From corporate events to private parties, this service solves everything. The booking was smooth, and the caterers delivered beyond expectations.",
      name: "Linda Peters",
      position: "HR & Admin",
      company: "PrimeTech Solutions",
    },
  ];

  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const handleNextTestimonial = () =>
    setCurrentPage((prev) => (prev + 1) % totalPages);
  const handlePrevTestimonial = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  const toggleCategoryDropdown = () => setIsCategoryOpen((prev) => !prev);
  const toggleLocationDropdown = () => setIsLocationOpen((prev) => !prev);

  return (
    <main className="min-h-screen">
      <HeroWithNavbar
        isCategoryOpen={isCategoryOpen}
        isLocationOpen={isLocationOpen}
        toggleCategoryDropdown={toggleCategoryDropdown}
        toggleLocationDropdown={toggleLocationDropdown}
        handleCategoryChange={handleCategoryChange}
        handleLocationChange={handleLocationChange}
        onSearch={handleSearch}
        showSearch={true}
        heading="Simplify Your Event Planning with <br /> All-in-One Booking."
        subheading="Book stunning venues and top-notch catering services effortlessly."
      />
      <Features
        heading="Your One-Stop Solution for Event Planning"
        description="Discover and book the perfect event center with ease. Customize your experience by adding services and making secure payments all in one place."
        imageSrc="/event.png"
      />
      <FeaturedVenues heading="Featured Event Centers" />
      <div className="bg-white">
        <CateringServices />
      </div>
      <ElevateEvents />
      <EventPlanning />
      <BookEvent />
      <Testimonials
        testimonials={testimonials}
        currentPage={currentPage}
        testimonialsPerPage={testimonialsPerPage}
        totalPages={totalPages}
        handleNextTestimonial={handleNextTestimonial}
        handlePrevTestimonial={handlePrevTestimonial}
        setCurrentPage={setCurrentPage}
      />
      <EventGallery />
      <PlanNextEvent />
      <Footer />
    </main>
  );
}

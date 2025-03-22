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

export default function Home() {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const testimonials = [
    {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      position: "Position",
      company: "Company name",
    },
    {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      position: "Position",
      company: "Company name",
    },
    {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      position: "Position",
      company: "Company name",
    },
    {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      position: "Position",
      company: "Company name",
    },
    {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      position: "Position",
      company: "Company name",
    },
    {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      position: "Position",
      company: "Company name",
    },
    {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "Name Surname",
      position: "Position",
      company: "Company name",
    },
  ];

  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const handleNextTestimonial = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const handlePrevTestimonial = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  const toggleCategoryDropdown = () => setIsCategoryOpen((prev) => !prev);
  const toggleLocationDropdown = () => setIsLocationOpen((prev) => !prev);
  const handleCategoryChange = () => setIsCategoryOpen(false);
  const handleLocationChange = () => setIsLocationOpen(false);

  return (
    <main className="min-h-screen">
      <HeroWithNavbar
        isCategoryOpen={isCategoryOpen}
        isLocationOpen={isLocationOpen}
        toggleCategoryDropdown={toggleCategoryDropdown}
        toggleLocationDropdown={toggleLocationDropdown}
        handleCategoryChange={handleCategoryChange}
        handleLocationChange={handleLocationChange}
      />
      <Features />
      <FeaturedVenues />
      <CateringServices />
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
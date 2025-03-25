import FeatureCard from "@/components/ui/FeatureCard";

export default function EventPlanning() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-30">
        <div className="mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#000000]">
            Effortless Event Planning at Your Fingertips
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:md:grid-cols-3 gap-4">
          <FeatureCard
            imageSrc="/user-regImage.png"
            title="Seamless User Registration for All"
            description="Sign up easily and securely to start planning your events."
            linkText="Join"
            linkHref="/signup"
          />
          <FeatureCard
            imageSrc="/explore-image.png"
            title="Explore Our Extensive Event Center Listings"
            description="Find the perfect venue with detailed filters and high-quality images."
            linkText="Browse"
            linkHref="/venues"
          />
          <FeatureCard
            imageSrc="/streamLine.png"
            title="Streamlined Booking System for Your Convenience"
            description="Easily select dates, specify event details, and manage your bookings."
            linkText="Book"
            linkHref="/bookings"
          />
        </div>
      </div>
    </section>
  );
}
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

export default function FeaturedVenues() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-30">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#000000]">
              Featured Event Centers
            </h2>
            <p className="text-xs sm:text-base text-gray-600">
              Showcasing top-rated event centers
            </p>
          </div>
          <Button className="px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-base cursor-pointer">
            View all posts
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              imageSrc="/eventCard.png"
              label="Featured"
              title="Ample Apartment At Last Floor"
              location="9 west flamingo road, las vegas"
              price="$350,000"
              name="Event Hall"
              // rating={5}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
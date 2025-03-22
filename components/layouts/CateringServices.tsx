// components/CateringServices.tsx
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

export default function CateringServices() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-30">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#000000]">
              Boosting Company Culture, One Meal at a Time
            </h2>
            <p className="text-xs sm:text-base text-gray-600">
              Showcasing top-rated catering services
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
              imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2091&q=80"
              label="Featured"
              title="Delish Catering Co."
              location="9 west flamingo road, las vegas"
              price="$30 Per Person"
              rating={5}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
// components/CateringServices.tsx
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CateringServices() {
  const router = useRouter();

  const handleOnclick = () => {
    router.push("/cateringServices/allPost");
  };

  // Sample data for catering services (you can replace this with real data)
  const featuredCateringServices = [
    {
      id: 1,
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Delish Catering Co.",
      location: "9 west flamingo road, las vegas",
      price: "$30 Per Person",
      rating: 5,
      name: "Catering Service",
    },
    {
      id: 2,
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Taste of Africa",
      location: "Lagos, Nigeria",
      price: "₦500,000",
      rating: 4,
      name: "Catering Service",
    },
    {
      id: 3,
      imageSrc: "/catering.png",
      label: "Featured",
      title: "Italian Delight",
      location: "Abuja, Nigeria",
      price: "₦300,000",
      rating: 5,
      name: "Catering Service",
    },
  ];

  return (
    <section className="py-20">
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
          <Button
            className="px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-base cursor-pointer"
            onClick={handleOnclick}
          >
            View all posts
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:md:grid-cols-3 gap-4">
          {featuredCateringServices.map((service) => (
            <Link key={service.id} href={`/cateringServices/${service.id}`}>
              <Card
                imageSrc={service.imageSrc}
                label={service.label}
                title={service.title}
                location={service.location}
                price={service.price}
                rating={service.rating}
                name={service.name}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
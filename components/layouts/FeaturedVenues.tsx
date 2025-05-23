import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FeaturedProps {
  heading: string;
}

export default function FeaturedVenues({ heading }: FeaturedProps) {
  const router = useRouter();

  const handleOnclick = () => {
    router.push("/event-center");
  };

  // Sample data for featured venues (you can replace this with real data)
  const featuredVenues = [
    {
      id: 1,
      imageSrc: "/eventCard.png",
      label: "Featured",
      title: "Ample Apartment At Last Floor",
      location: "9 west flamingo road, las vegas",
      price: "$350,000",
      name: "Event Hall",
    },
    {
      id: 2,
      imageSrc: "/eventCard.png",
      label: "Featured",
      title: "Skyline Event Hall",
      location: "Abuja, Nigeria",
      price: "₦300,000",
      name: "Event Hall",
    },
    {
      id: 3,
      imageSrc: "/eventCard.png",
      label: "Featured",
      title: "Corporate Hub",
      location: "London, UK",
      price: "₦800,000",
      name: "Event Hall",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-30">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#000000]">
              {heading}
            </h2>
            <p className="text-xs sm:text-base text-gray-600">
              Showcasing top-rated event centers
            </p>
          </div>
          <Button
            className="px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-base cursor-pointer md:mt-0 mt-4"
            onClick={handleOnclick}
          >
            View all posts
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:md:grid-cols-3 gap-4">
          {featuredVenues.map((venue) => (
            <Link key={venue.id} href={`/event-center/${venue.id}`}>
              <Card
                imageSrc={venue.imageSrc}
                label={venue.label}
                title={venue.title}
                location={venue.location}
                price={venue.price}
                name={venue.name}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
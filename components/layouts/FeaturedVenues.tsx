import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetEventCentersQuery } from "@/redux/services/eventsApi";
import CardSkeleton from "@/components/ui/card-skeleton";

interface FeaturedProps {
  heading: string;
}

export default function FeaturedVenues({ heading }: FeaturedProps) {
  const router = useRouter();

  const { data, isLoading, error } = useGetEventCentersQuery({
    limit: 3,
    offset: 0,
  });

  const handleOnclick = () => {
    router.push("/event-center");
  };

  const loadingSkeletons = (
    <div className="grid grid-cols-1 sm:md:grid-cols-3 gap-4">
      {[1, 2, 3].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );

  const errorDisplay = (
    <div className="grid grid-cols-1 sm:md:grid-cols-3 gap-4">
      <p className="text-red-600 text-center col-span-full">
        Error loading event centers. Please try again later.
      </p>
    </div>
  );

  // Map API data to the format expected by the Card component
  const featuredVenues = data?.data?.map((venue) => ({
    id: venue.id,
    imageSrc: venue.images[0] || "/placeholder-image.png",
    label: "Featured",
    title: venue.description,
    location: `${venue.city}, ${venue.state}, ${venue.country}`,
    price: `₦${venue.depositAmount.toLocaleString()}`,
    name: "Event Hall",
  })) ?? [];

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

        {isLoading ? (
          loadingSkeletons
        ) : error || !data?.data?.length ? (
          errorDisplay
        ) : (
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
        )}
      </div>
    </section>
  );
}
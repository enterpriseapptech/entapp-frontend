"use client";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CateringResponse, useGetCateringsQuery } from "@/redux/services/cateringApi";
import CardSkeleton from "@/components/ui/card-skeleton";

interface CateringServicesProps {
  heading?: string;
  searchResults?: CateringResponse;
}

export default function CateringServices({
  heading = "Boosting Company Culture, One Meal at a Time",
}: CateringServicesProps) {
  const router = useRouter();

  const { data, isLoading, error } = useGetCateringsQuery({
    limit: 3,
    offset: 0,
  });

  const handleOnclick = () => {
    router.push("/cateringServices/allPost");
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
        Error loading catering services. Please try again later.
      </p>
    </div>
  );

  // Map API data to the format expected by the Card component
  const featuredCateringServices =
    data?.data?.map((service) => {
      // Calculate deposit amount after discount
      const discounted =
        service.startPrice * (1 - (service.discountPercentage ?? 0) / 100);
      const depositAmount = discounted * (service.depositPercentage / 100);

      return {
        id: service.id,
        imageSrc: service.images[0] || "/catering.png",
        label: service.isFeatured ? "Featured" : "",
        title: service.tagLine,
        location: service.city,
        price: `₦${depositAmount.toLocaleString()}`, // final deposit amount
        name: service.name,
        pricingPerSlot: service.startPrice,
        discountPercentage: service.discountPercentage,
        depositPercentage: service.depositPercentage,
        rating: service.rating ?? 4,
      };
    }) ?? [];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-30">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#000000]">
              {heading}
            </h2>
            <p className="text-xs sm:text-base text-gray-600">
              Showcasing top-rated catering services
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
            {featuredCateringServices.map((service) => (
              <Link key={service.id} href={`/cateringServices/${service.id}`}>
                <Card
                  imageSrc={service.imageSrc}
                  label={service.label}
                  title={service.title}
                  location={service.location}
                  name={service.name}
                  pricingPerSlot={service.pricingPerSlot}
                  discountPercentage={service.discountPercentage}
                  depositPercentage={service.depositPercentage}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

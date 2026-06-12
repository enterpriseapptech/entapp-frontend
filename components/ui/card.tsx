// components/ui/card.tsx
import Image from "next/image";

interface CardProps {
  name: string;
  imageSrc: string;
  label: string;
  title: string;
  location: string;
  rating?: number;
  pricingPerSlot?: number;
  discountPercentage?: number;
  depositPercentage?: number;
  eventTypes?: string[];
  sittingCapacity?: number;
}

const Card: React.FC<CardProps> = ({
  imageSrc,
  label,
  title,
  location,
  rating,
  name,
  pricingPerSlot,
  discountPercentage,
  depositPercentage,
  eventTypes,
  sittingCapacity,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Top Image with Label */}
      <div className="relative">
        {label && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#0047AB] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              {label}
            </span>
          </div>
        )}
        <Image
          src={imageSrc}
          alt={title}
          width={400}
          height={250}
          className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
              {name}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-1">{title}</p>
          </div>
          {rating !== undefined && (
            <div className="flex items-center space-x-0.5 ml-4 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                  } fill-current`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-500 text-xs mt-1">{location}</p>

        {/* Event Types */}
        {eventTypes && eventTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {eventTypes.slice(0, 3).map((type) => (
              <span
                key={type}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
              >
                {type}
              </span>
            ))}
            {eventTypes.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                +{eventTypes.length - 3}
              </span>
            )}
          </div>
        )}

        <hr className="my-3 border-gray-200" />

        {/* Breakdown Section */}
        <div className="space-y-2 text-sm">
          {sittingCapacity !== undefined && (
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Sitting capacity:</span>
              <span className="font-semibold text-gray-900">
                {sittingCapacity.toLocaleString()} guests
              </span>
            </div>
          )}
          {pricingPerSlot !== undefined && (
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Pricing per slot:</span>
              <span className="font-semibold text-gray-900">
                ₦{pricingPerSlot.toLocaleString()}
              </span>
            </div>
          )}
          {discountPercentage !== undefined && discountPercentage > 0 && (
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Discount:</span>
              <span className="font-semibold text-green-600">
                {discountPercentage}%
              </span>
            </div>
          )}
          {depositPercentage !== undefined && (
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Deposit percentage:</span>
              <span className="font-semibold text-gray-900">
                {depositPercentage}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;

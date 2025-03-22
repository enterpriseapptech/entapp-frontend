import Link from "next/link";

interface FeatureCardProps {
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, title, description, linkText, linkHref }) => {
  return (
    <div className="bg-white rounded-sm overflow-hidden shadow-md">
      <div className="relative">
        <img
          src={imageSrc}
          alt={title}
          className="h-48 w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-[#081127] mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Link href={linkHref} className="text-[#0047AB] hover:underline flex items-center gap-1">
          {linkText}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard;
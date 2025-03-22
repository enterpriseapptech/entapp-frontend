// import Image from "next/image";

interface CardProps {
  imageSrc: string;
  label: string;
  title: string;
  location: string;
  price: string;
  rating: number;
}

const Card: React.FC<CardProps> = ({ imageSrc, label, title, location, price }) => {
  return (
    <div className="bg-white rounded-sm overflow-hidden shadow-md group">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#0047AB] text-white px-3 py-1 rounded-full text-sm font-medium">
            {label}
          </span>
        </div>
        <img
          src={imageSrc}
          alt={title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-md font-sm text-sm text-[#081127]">{title}</h3>
        <p className="text-gray-400 text-sm mb-2">{location}</p>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 text-yellow-400 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <p className="text-md font-bold text-gray-600">{price}</p>
      </div>
    </div>
  );
};

export default Card;
// components/SuccessModal.tsx
import Image from "next/image";
import { useRouter } from "next/navigation";
// import Image from "next/image";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDates: string[];
}

export default function SuccessModal({ isOpen, onClose, bookingDates }: SuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    router.push("/"); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {/* Checkmark Icon */}
        <div className="flex justify-center mb-4">
          <Image src="/suceessModalIcon.png" alt="suceessModalIcon" width={10} height={10} className="w-12 h-12" unoptimized/>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
          Booking was successful
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm mb-6">
          The booking has been successful for {bookingDates[0]} and {bookingDates[1]}. The booking
          details will be sent to your email for further reference.
        </p>

        {/* Continue Exploring Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-[#0047AB] text-white py-2 rounded-md hover:bg-blue-700 transition text-lg font-semibold"
        >
          Continue exploring
        </button>
      </div>
    </div>
  );
}
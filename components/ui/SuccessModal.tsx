// components/SuccessModal.tsx
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
    router.push("/"); // Redirect to homepage
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {/* Checkmark Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 rounded-full p-2">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
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
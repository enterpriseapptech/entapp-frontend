import Image from "next/image";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  startTime?: string;
  endTime?: string;
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  startTime,
  endTime,
}: SuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    router.push("/bookings");
  };

  const formattedStart = startTime ? new Date(startTime).toLocaleString() : "";
  const formattedEnd = endTime ? new Date(endTime).toLocaleString() : "";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-center mb-4">
          <Image
            src="/suceessModalIcon.png"
            alt="success icon"
            width={10}
            height={10}
            className="w-12 h-12"
            unoptimized
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
          Booking was successful
        </h2>

        <p className="text-gray-600 text-center text-sm mb-6">
          Your booking has been confirmed for:
          <br />
          <span className="font-semibold block mt-1">{formattedStart}</span>
          {formattedEnd && (
            <span className="font-semibold block">to {formattedEnd}</span>
          )}
          <br />
          Booking details have been sent to your email.
        </p>

        <button
          onClick={handleContinue}
          className="cursor-pointer w-full bg-[#0047AB] text-white py-2 rounded-md hover:bg-blue-700 transition text-lg font-semibold"
        >
          Continue exploring
        </button>
      </div>
    </div>
  );
}

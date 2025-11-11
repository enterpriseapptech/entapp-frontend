import React from "react";
import { CheckCircle, X, Calendar, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDates: string[];
  paymentType: "deposit" | "full";
  amountPaid: number;
}

const BookingQuotesSuceessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  onClose,
  bookingDates,
  paymentType,
  amountPaid,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleCloseAndRedirect = () => {
    onClose?.();
    router.push("/bookings");
  };

  const handleViewBookings = () => {
    onClose?.();
    router.push("/quotes");
  };

  const [startDate, endDate] = bookingDates;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header (Sticky) */}
        <div className="flex items-center justify-between p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Booking Confirmed!
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ✅ Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* ✅ Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {paymentType === "deposit"
                ? "Deposit Paid Successfully!"
                : "Payment Completed Successfully!"}
            </h3>
            <p className="text-gray-600">
              {paymentType === "deposit"
                ? "Your booking has been secured with a deposit payment."
                : "Your booking has been fully confirmed and paid for."}
            </p>
          </div>

          {/* ✅ Booking Details */}
          <div className="bg-gray-50 rounded-lg p-5 border">
            <h4 className="font-medium text-gray-700 mb-3">Booking Details</h4>
            <div className="space-y-3 text-sm">
              {/* Payment Type */}
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {paymentType === "deposit" ? "Deposit" : "Full Payment"}
                </span>
              </div>

              {/* Amount Paid */}
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-gray-900">
                  ₦{amountPaid.toLocaleString()}
                </span>
              </div>

              {/* Booking Dates */}
              {startDate && (
                <div className="flex items-start justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Booking Dates:
                  </span>
                  <div className="text-right">
                    {endDate && endDate !== startDate ? (
                      <>
                        <div className="font-medium text-gray-900">
                          {startDate}
                        </div>
                        <div className="text-xs text-gray-500">to</div>
                        <div className="font-medium text-gray-900">
                          {endDate}
                        </div>
                      </>
                    ) : (
                      <div className="font-medium text-gray-900">
                        {startDate}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Next Steps */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              What&apos;s Next?
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              {paymentType === "deposit" ? (
                <>
                  <li>• Your booking has been secured with deposit payment</li>
                  <li>• Remaining balance will be due before the event date</li>
                  <li>• Service provider will contact you within 24 hours</li>
                  <li>
                    • Confirmation email with details will be sent shortly
                  </li>
                </>
              ) : (
                <>
                  <li>• Your booking has been fully confirmed</li>
                  <li>• Service provider will contact you within 24 hours</li>
                  <li>
                    • Confirmation email with all details will be sent shortly
                  </li>
                  <li>• You can manage your booking from the dashboard</li>
                </>
              )}
            </ul>
          </div>

          {/* ✅ Additional Info for Deposit */}
          {paymentType === "deposit" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-blue-800 text-sm mb-1">
                    Deposit Payment Note
                  </h5>
                  <p className="text-blue-700 text-xs">
                    Your booking is now secured. The remaining balance must be
                    paid before your event date. You&apos;ll receive payment
                    reminders via email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleViewBookings}
              className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              View My Quotes
            </button>
            <button
              onClick={handleCloseAndRedirect}
              className="px-6 py-3 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingQuotesSuceessModal;

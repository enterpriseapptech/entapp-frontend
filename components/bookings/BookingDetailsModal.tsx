import { X, Calendar, MapPin, Users, Mail, Clock } from "lucide-react";
import type { Booking } from "@/types/booking.types";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
}: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Booking Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking ID and Status */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-400 mb-1">Booking ID</p>
              <p className="text-lg font-semibold text-gray-900">
                {booking.bookingId}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full ${
                  booking.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : booking.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {booking.status}
              </span>
              <span
                className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full ${
                  booking.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700"
                    : booking.paymentStatus === "Unpaid"
                    ? "bg-red-100 text-red-700"
                    : booking.paymentStatus === "Partial"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Customer Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.customerEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Booking Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.bookingType}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Date & Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.dateAndTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Venue</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Attendees</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.attendees} guests
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Payment Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-sm font-semibold text-gray-900">
                  ${booking.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="text-sm font-semibold text-green-600">
                  ${booking.paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  Outstanding Balance
                </p>
                <p className="text-base font-bold text-gray-900">
                  ${(booking.totalAmount - booking.paidAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Special Requests
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  {booking.specialRequests}
                </p>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-400 mb-1">Created Date</p>
              <p className="text-sm font-medium text-gray-900">
                {booking.createdAt}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Edit Booking
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: BookingData) => void;
}

interface BookingData {
  date: string;
  time: string;
  guests: number;
  price: number;
}

const DatePicker: React.FC<DatePickerProps> = ({ isOpen, onClose, onBook }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6)); // July 2025
  const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);

  // Mock available dates - in reality, this would come from an API
  const availableDates = [
    "2025-07-10",
    "2025-07-11",
    "2025-07-14",
    "2025-07-15",
    "2025-07-16",
    "2025-07-18",
    "2025-07-21",
    "2025-07-22",
    "2025-07-25",
    "2025-07-28",
    "2025-07-29",
    "2025-08-01",
    "2025-08-05",
    "2025-08-08",
    "2025-08-12",
  ];

  // Mock available time slots for selected date
  const availableTimeSlots = {
    morning: ["09:00", "10:00", "11:00"],
    afternoon: ["13:00", "14:00", "15:00", "16:00", "17:00"],
  };

  const basePrice = 5000;

  const resetModal = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setNumberOfGuests(1);
    setShowUnavailableMessage(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isDateAvailable = (date: string) => {
    return availableDates.includes(date);
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateAvailable(dateStr)) {
      setSelectedDate(dateStr);
      setStep(2);
      setShowUnavailableMessage(false);
    } else {
      setShowUnavailableMessage(true);
      setTimeout(() => setShowUnavailableMessage(false), 3000);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirmBooking = () => {
    setStep(4);
    setTimeout(() => {
      onBook({
        date: selectedDate,
        time: selectedTime,
        guests: numberOfGuests,
        price: basePrice,
      });
      handleClose();
    }, 8000);
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              Step {step} of 4
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Step 1: Choose a Date */}
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Choose a Date
            </h2>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((day, index) => {
                if (day === null) {
                  return <div key={index} className="h-10"></div>;
                }

                const dateStr = formatDate(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );
                const isAvailable = isDateAvailable(dateStr);
                const isToday =
                  new Date().toDateString() ===
                  new Date(dateStr).toDateString();

                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => handleDateClick(day)}
                      className={`
                        w-10 h-10 rounded-full text-sm font-medium transition-all
                        ${
                          isAvailable
                            ? "hover:bg-blue-50 text-gray-900 cursor-pointer"
                            : "text-gray-300 cursor-not-allowed"
                        }
                        ${isToday ? "ring-2 ring-blue-500" : ""}
                      `}
                    >
                      {day}
                    </button>
                    {/* Availability dot */}
                    {isAvailable && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Unavailable</span>
              </div>
            </div>

            {/* Unavailable message */}
            {showUnavailableMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 text-center">
                  This date is not available. Please choose another date.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select a Time */}
        {step === 2 && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                Select a Time
              </h2>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Available slots for</p>
              <p className="font-medium text-gray-900">
                {formatDateDisplay(selectedDate)}
              </p>
            </div>

            {/* Morning slots */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Morning
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {availableTimeSlots.morning.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Afternoon slots */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Afternoon
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {availableTimeSlots.afternoon.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Your Details */}
        {step === 3 && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep(2)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                Confirm Your Details
              </h2>
            </div>

            <div className="space-y-6">
              {/* Service */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-medium text-gray-900">Catering Service</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDateDisplay(selectedDate)}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{selectedTime}</p>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Number of guests</p>
                  <div className="relative">
                    <select
                      value={numberOfGuests}
                      onChange={(e) =>
                        setNumberOfGuests(parseInt(e.target.value))
                      }
                      className="w-full appearance-none bg-gray-100 text-gray-800 px-4 py-2 border border-gray-400 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>

                    {/* Custom dropdown icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₦{basePrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Confirm & Book Now
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Booking Confirmed */}
        {step === 4 && (
          <div className="p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-gray-600">
                You&apos;ll receive a confirmation email shortly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;

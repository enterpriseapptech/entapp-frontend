import React, { useState } from "react";
import {
  Calendar,
  Clock,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetTimeSlotsByServiceProviderQuery } from "@/redux/services/timeslot";
import { useCreateBookingMutation } from "@/redux/services/book";
import { useParams } from "next/navigation";
import type { CreateBookingRequest } from "@/redux/services/book";

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: BookingData) => void;
  startPrice: number;
}

interface BookingData {
  date: string;
  time: string;
  guests: number;
  price: number;
}

interface TimeSlot {
  id: string;
  serviceId: string;
  serviceType: "CATERING" | "EVENTCENTERS";
  bookingId: string | null;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  previousBookings: [];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

enum SpecialRequirement {
  WHEELCHAIRACCESS = "WHEELCHAIRACCESS",
  TEMPERATUREADJUSTMENT = "TEMPERATUREADJUSTMENT",
}

const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  onBook,
  startPrice,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [serviceType, setServiceType] = useState("");
  const [source, setSource] = useState<"WEB" | "MOBILE">("WEB");
  const [serviceNotes, setServiceNotes] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [eventTheme, setEventTheme] = useState("");
  const [eventType, setEventType] = useState("");
  const [description, setDescription] = useState("");
  const [specialRequirement, setSpecialRequirement] = useState<
    SpecialRequirement | ""
  >("");

  const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const params = useParams();
  const { id } = params as { id: string };
  const userId =
    localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

  const {
    data: timeSlotsData,
    isLoading,
    error,
  } = useGetTimeSlotsByServiceProviderQuery(
    { serviceId: id, limit: 100, offset: 0 },
    { skip: !id }
  );

  const [createBooking, { isLoading: isBookingLoading }] =
    useCreateBookingMutation();

  const availableDates = Array.from(
    new Set(
      timeSlotsData?.data
        ?.filter((slot: TimeSlot) => slot.isAvailable)
        .map(
          (slot: TimeSlot) =>
            new Date(slot.startTime).toISOString().split("T")[0]
        ) ?? []
    )
  );

  const availableTimeSlots = (() => {
    if (!selectedDate || !timeSlotsData?.data) return [];

    return timeSlotsData.data
      .filter(
        (slot: TimeSlot) =>
          new Date(slot.startTime).toISOString().split("T")[0] === selectedDate
      )
      .map((slot: TimeSlot) => ({
        start: new Date(slot.startTime).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        end: new Date(slot.endTime).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        isAvailable: slot.isAvailable && slot.bookingId === null,
        fullSlot: slot,
      }));
  })();

  const resetModal = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setNumberOfGuests(1);
    setServiceType("");
    setSource("WEB");
    setServiceNotes("");
    setCustomerNotes("");
    setEventTheme("");
    setEventType("");
    setDescription("");
    setSpecialRequirement("");
    setShowUnavailableMessage(false);
    setBookingError(null);
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

    for (let i = 0; i < startDate; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const formatDate = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

  const isDateAvailable = (date: string) => availableDates.includes(date);

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

  const handleConfirmBooking = async () => {
    try {
      const selectedSlot = availableTimeSlots.find(
        (slot) => `${slot.start} – ${slot.end}` === selectedTime
      );

      if (!selectedSlot) {
        setBookingError("Selected time slot is not available.");
        return;
      }
      if (!userId) {
        throw new Error("User ID not found in localStorage or sessionStorage");
      }

      const payload: CreateBookingRequest = {
        customerId: userId,
        timeslotId: [selectedSlot.fullSlot.id],
        serviceType:
          selectedSlot.fullSlot.serviceType === "EVENTCENTERS"
            ? "EVENTCENTER"
            : "CATERING",
        totalBeforeDiscount: startPrice,
        discount: 0,
        totalAfterDiscount: startPrice,
        bookingDates: [selectedDate],
        isTermsAccepted: true,
        isCancellationPolicyAccepted: true,
        isLiabilityWaiverSigned: true,
        source,
        serviceNotes,
        customerNotes,
        serviceId: id,
        eventName: "Event Booking",
        eventTheme,
        eventType,
        description,
        noOfGuest: numberOfGuests,
        specialRequirements: specialRequirement ? [specialRequirement] : [],
      };

      await createBooking(payload).unwrap();
      setStep(4);
      setTimeout(() => {
        onBook({
          date: selectedDate,
          time: selectedTime,
          guests: numberOfGuests,
          price: startPrice,
        });
        handleClose();
      }, 2000);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      setBookingError(
        apiError?.data?.message || "Failed to create booking. Please try again."
      );
    }
  };

  const formatDateDisplay = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newMonth;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all  max-h-[90vh] flex flex-col">
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
        <div className="overflow-y-auto p-6 space-y-6 grow">
          {/* Step 1: Choose a Date */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Choose a Date
              </h2>

              {isLoading ? (
                <div className="text-center text-gray-600">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-600">
                  Error loading available dates. Please try again.
                </div>
              ) : (
                <>
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
                            disabled={!isAvailable}
                          >
                            {day}
                          </button>
                          {/* Blue dot for available dates */}
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
                </>
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
                <p className="text-sm text-gray-600 mb-2">
                  Available slots for
                </p>
                <p className="font-medium text-gray-900">
                  {formatDateDisplay(selectedDate)}
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Available Time Slots
                </h3>

                {availableTimeSlots.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No available time slots for this date.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((slot, index) => {
                      const isDisabled = !slot.isAvailable;

                      return (
                        <button
                          key={index}
                          onClick={() =>
                            !isDisabled &&
                            handleTimeSelect(`${slot.start} – ${slot.end}`)
                          }
                          disabled={isDisabled}
                          className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors
          ${
            isDisabled
              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
              : "border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
          }`}
                        >
                          {slot.start} – {slot.end}
                        </button>
                      );
                    })}
                  </div>
                )}
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

              <div className="space-y-4">
                {/* Service Type and Source */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select a service</option>
                      <option value="EVENTCENTER">Event Center</option>
                      <option value="CATERING">Catering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source
                    </label>
                    <select
                      value={source}
                      onChange={(e) =>
                        setSource(e.target.value as "WEB" | "MOBILE")
                      }
                      className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="WEB">Web</option>
                      <option value="MOBILE">Mobile</option>
                    </select>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatDateDisplay(selectedDate)}
                        readOnly
                        className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Time
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedTime}
                        readOnly
                        className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm"
                      />
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Event Type and Number of Guests */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <input
                      type="text"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full  text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter event type"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={numberOfGuests}
                      onChange={(e) =>
                        setNumberOfGuests(parseInt(e.target.value))
                      }
                      className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>

                {/* Event Theme and Budget Range (Optional) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Theme
                    </label>
                    <input
                      type="text"
                      value={eventTheme}
                      onChange={(e) => setEventTheme(e.target.value)}
                      className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter event theme"
                    />
                  </div>
                </div>

                {/* Service Notes and Customer Notes */}
                <div className="">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Notes
                    </label>
                    <textarea
                      value={serviceNotes}
                      rows={3}
                      onChange={(e) => setServiceNotes(e.target.value)}
                      className="w-full px-3 text-gray-400 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter service notes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Notes
                    </label>
                    <textarea
                      rows={3}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full px-3 text-gray-400 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter customer notes"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Tell us more about your event..."
                  />
                </div>

                {/* Special Requirement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirement
                  </label>
                  <select
                    value={specialRequirement}
                    onChange={(e) =>
                      setSpecialRequirement(
                        e.target.value as SpecialRequirement | ""
                      )
                    }
                    className="w-full text-gray-400 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="" className="">Select a requirement</option>
                    <option value={SpecialRequirement.WHEELCHAIRACCESS}>
                      Wheelchair Access
                    </option>
                    <option value={SpecialRequirement.TEMPERATUREADJUSTMENT}>
                      Temperature Adjustment
                    </option>
                  </select>
                </div>

                {/* Price */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₦{startPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {bookingError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 text-center">
                      {bookingError}
                    </p>
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={isBookingLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mt-6
                  ${
                    isBookingLoading
                      ? "bg-blue-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isBookingLoading ? "Booking..." : "Confirm & Book Now"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Booking Confirmed */}
          {step === 4 && (
            <div className="p-6 text-center">
              <div className="mb-6 cursor-pointer">
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
    </div>
  );
};

export default DatePicker;

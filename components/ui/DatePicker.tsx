import React, { JSX, useState } from "react";
import { X, CheckCircle, Calendar, MapPin, FileText } from "lucide-react";
import { useGetTimeSlotsByServiceProviderQuery } from "@/redux/services/timeslot";
import { useCreateBookingMutation } from "@/redux/services/book";
import type {
  CreateBookingRequest,
  CreateBookingResponse,
} from "@/redux/services/book";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import PaymentModal from "./paymentModal";
import SuccessModal from "@/components/ui/SuccessModal";
import { useGetUserByIdQuery } from "@/redux/services/authApi";

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: BookingData) => void;
  serviceId: string;
  serviceName: string;
  startPrice: number;
  discountPercentage?: number;
  depositPercentage: number;
  serviceType: "EVENTCENTER" | "CATERING";
}

interface BookingData {
  date: string;
  time: string;
  guests: number;
  price: number;
  deposit: number;
}

interface TimeSlot {
  id: string;
  serviceId: string;
  serviceType: "CATERING" | "EVENTCENTERS";
  bookingId: string | null;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
interface BookingItem {
  item: string;
  amount: number;
}

// interface BookingResponse {
//   id: string;
//   items: BookingItem[];
//   subTotal: number;
//   discount: number;
//   total: number;
//   amountDue: number;
// }

enum SpecialRequirement {
  WHEELCHAIRACCESS = "WHEELCHAIRACCESS",
  TEMPERATUREADJUSTMENT = "TEMPERATUREADJUSTMENT",
  // SPECIALLIGHTING = "SPECIALLIGHTING",
  // AUDIOVISUALEQUIPMENT = "AUDIOVISUALEQUIPMENT",
}

const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  startPrice,
  discountPercentage = 0,
  depositPercentage,
  serviceType,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<string[]>([]);
  const [eventName, setEventName] = useState("");
  const [eventTheme, setEventTheme] = useState("");
  const [eventType, setEventType] = useState("");
  const [description, setDescription] = useState("");
  const [noOfGuest, setNoOfGuest] = useState(1);
  const [specialRequirements, setSpecialRequirements] = useState<
    SpecialRequirement[]
  >([]);
  const [serviceNotes, setServiceNotes] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  // Billing address states
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postal, setPostal] = useState("");

  // Terms states
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isCancellationPolicyAccepted, setIsCancellationPolicyAccepted] =
    useState(false);
  const [isLiabilityWaiverSigned, setIsLiabilityWaiverSigned] = useState(false);

  // Payment option
  const [payDepositOnly, setPayDepositOnly] = useState(true);
  const [customPaymentAmount, setCustomPaymentAmount] = useState<number | "">(
    ""
  );

  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] =
    useState<CreateBookingResponse | null>(null);
  const [paymentDate, setPaymentDate] = useState("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // const [paymentError, setPaymentError] = useState<string | null>(null);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id") || sessionStorage.getItem("user_id")
      : null;
  const { data: currentUser } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  const { data: timeSlotsData, isLoading: isLoadingTimeSlots } =
    useGetTimeSlotsByServiceProviderQuery(
      { serviceId, limit: 100, offset: 0 },
      { skip: !serviceId || !isOpen }
    );

  const [createBooking, { isLoading: isBookingLoading }] =
    useCreateBookingMutation();

  // Get unique available dates
  const availableDates = Array.from(
    new Set(
      timeSlotsData?.data
        ?.filter((slot: TimeSlot) => slot.isAvailable && !slot.bookingId)
        .map(
          (slot: TimeSlot) =>
            new Date(slot.startTime).toISOString().split("T")[0]
        ) ?? []
    )
  ).sort(); // Sort dates chronologically

  // Get available time slots for selected date
  const availableTimeSlots = (() => {
    if (!selectedDate || !timeSlotsData?.data) return [];

    return timeSlotsData.data
      .filter((slot: TimeSlot) => {
        const slotDate = new Date(slot.startTime).toISOString().split("T")[0];
        return slotDate === selectedDate && slot.isAvailable && !slot.bookingId;
      })
      .map((slot: TimeSlot) => ({
        id: slot.id,
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
        fullSlot: slot,
      }));
  })();

  // Calculate pricing
  const subTotal = selectedTimeSlotIds.length * startPrice;
  const discount = Math.round((subTotal * (discountPercentage || 0)) / 100);
  const total = subTotal - discount;
  const depositAmount = Math.round((total * depositPercentage) / 100);

  // Calculate amount due based on payment option
  const getAmountDue = () => {
    if (customPaymentAmount && customPaymentAmount >= depositAmount) {
      return customPaymentAmount;
    }
    return payDepositOnly ? depositAmount : total;
  };

  const amountDue = getAmountDue();
  const isCustomPayment =
    customPaymentAmount !== "" && customPaymentAmount >= depositAmount;

  // Check if amount meets Stripe's minimum requirement (100 Naira)
  const isAmountBelowStripeMinimum = amountDue < 100;

  // Check if custom payment amount is valid
  const isCustomAmountValid =
    customPaymentAmount === "" ||
    (customPaymentAmount >= depositAmount && customPaymentAmount <= total);

  // Calculate due date (7 days from now)
  const calculateDueDate = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    dueDate.setUTCHours(12, 0, 0, 0);
    return dueDate.toISOString();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleTimeSlotSelect = (timeSlotId: string) => {
    const selectedSlot = availableTimeSlots.find((s) => s.id === timeSlotId);
    if (!selectedSlot) return;

    setSelectedTimeSlotIds((prev) => {
      // check if any already selected slot has same start & end
      const hasConflict = prev.some((id) => {
        const slot = availableTimeSlots.find((s) => s.id === id);
        return (
          slot &&
          slot.start === selectedSlot.start &&
          slot.end === selectedSlot.end
        );
      });

      if (hasConflict) {
        // optional: show error message instead of silently ignoring
        setBookingError("This time slot is already selected.");
        return prev;
      }

      // toggle selection normally
      return prev.includes(timeSlotId)
        ? prev.filter((id) => id !== timeSlotId)
        : [...prev, timeSlotId];
    });
  };

  const handleSpecialRequirementToggle = (requirement: SpecialRequirement) => {
    setSpecialRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((req) => req !== requirement)
        : [...prev, requirement]
    );
  };

  const handleCustomPaymentAmountChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value);
    setCustomPaymentAmount(numValue);

    // Auto-select custom payment option when user enters an amount
    if (numValue !== "") {
      setPayDepositOnly(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      if (selectedTimeSlotIds.length === 0) {
        setBookingError("Please select at least one time slot.");
        return;
      }

      if (!userId) {
        setBookingError("User not authenticated. Please log in.");
        return;
      }

      if (
        !isTermsAccepted ||
        !isCancellationPolicyAccepted ||
        !isLiabilityWaiverSigned
      ) {
        setBookingError("Please accept all terms and policies to continue.");
        return;
      }

      // Validate custom payment amount
      if (customPaymentAmount !== "" && !isCustomAmountValid) {
        setBookingError(
          `Custom payment amount must be between ₦${depositAmount.toLocaleString()} and ₦${total.toLocaleString()}`
        );
        return;
      }

      // Check if amount is below Stripe minimum
      if (isAmountBelowStripeMinimum) {
        setBookingError(
          "Payment amount is below the minimum payment of ₦100 required for online payments. Please increase your payment amount."
        );
        return;
      }

      const payload: CreateBookingRequest = {
        customerId: userId,
        serviceId,
        serviceType,
        timeslotId: selectedTimeSlotIds,
        subTotal,
        discount,
        total,
        amountDue: amountDue, // Add the amountDue field
        items: selectedTimeSlotIds.map(() => ({
          item: serviceName,
          amount: startPrice,
        })),
        billingAddress: {
          street,
          city,
          state,
          country,
          postal,
        },
        dueDate: calculateDueDate(), // Set due date to 7 days from now
        isTermsAccepted,
        isCancellationPolicyAccepted,
        isLiabilityWaiverSigned,
        source: "WEB",
        serviceNotes,
        customerNotes,
        eventName,
        eventTheme,
        eventType,
        description,
        noOfGuest,
        specialRequirements: specialRequirements as string[],
      };

      const result = await createBooking(payload).unwrap();
      setBookingResponse(result);
      setStep(5);
    } catch (error) {
      if ((error as FetchBaseQueryError)?.data) {
        // error from API
        const apiError = error as FetchBaseQueryError & {
          data?: { message?: string };
        };
        setBookingError(
          apiError.data?.message || "Booking failed. Please try again."
        );
      } else {
        // generic error
        const fallbackError = error as SerializedError;
        setBookingError(
          fallbackError.message || "Booking failed. Please try again."
        );
      }
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedTimeSlotIds([]);
    setEventName("");
    setEventTheme("");
    setEventType("");
    setDescription("");
    setNoOfGuest(1);
    setSpecialRequirements([]);
    setServiceNotes("");
    setCustomerNotes("");
    setStreet("");
    setCity("");
    setState("");
    setCountry("");
    setPostal("");
    setIsTermsAccepted(false);
    setIsCancellationPolicyAccepted(false);
    setIsLiabilityWaiverSigned(false);
    setPayDepositOnly(true);
    setCustomPaymentAmount("");
    setBookingError(null);
  };

  const handleClose = () => {
    resetForm();
    setIsSuccessModalOpen(false);
    onClose();
  };

  const handlePaymentSuccess = () => {
    console.log("Payment completed successfully");
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
  };
  const handlePaymentError = (error: string) => {
    console.log(error);
    // Keep the payment modal open to let user try again
  };

  // Open payment modal
  const openPaymentModal = () => {
    // Check if amount meets Stripe minimum before opening payment modal
    const dueAmount = Number(bookingResponse?.amountDue ?? 0);

    if (dueAmount < 100) {
      setBookingError(
        "Payment amount is below the minimum of ₦100 required for online payments. Please contact support for assistance."
      );
      return;
    }

    setIsPaymentModalOpen(true);
  };

  // Close payment modal
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const userEmail =
    currentUser?.email ||
    (typeof window !== "undefined"
      ? localStorage.getItem("user_email") ||
        sessionStorage.getItem("user_email") ||
        "customer@example.com"
      : "customer@example.com");

  // Function to get booking dates for success modal
  const getBookingDates = (): string[] => {
    if (!selectedDate || selectedTimeSlotIds.length === 0) return [];

    const dates: string[] = [];
    const formattedDate = new Date(selectedDate).toLocaleDateString();

    // If multiple time slots, show first and last
    if (selectedTimeSlotIds.length > 1) {
      const timeSlots = availableTimeSlots
        .filter((slot) => selectedTimeSlotIds.includes(slot.id))
        .sort((a, b) => a.start.localeCompare(b.start));

      dates.push(`${formattedDate} ${timeSlots[0].start}`);
      dates.push(`${formattedDate} ${timeSlots[timeSlots.length - 1].end}`);
    } else {
      // Single time slot
      const slot = availableTimeSlots.find((slot) =>
        selectedTimeSlotIds.includes(slot.id)
      );
      if (slot) {
        dates.push(`${formattedDate} ${slot.start}`);
        dates.push(`${formattedDate} ${slot.end}`);
      }
    }

    return dates;
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-700">
            {step === 1 && "Select Date & Time"}
            {step === 2 && "Event Details"}
            {step === 3 && "Billing Information"}
            {step === 4 && "Review & Confirm"}
            {step === 5 && "Booking Confirmed!"}
          </h2>
          <div className="flex items-center">
            {step < 5 && (
              <span className="text-sm font-medium text-gray-800 mr-4">
                Step {step} of 4
              </span>
            )}

            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {/* Step 1: Date and Time Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Select an available date and time slot</span>
              </div>

              {isLoadingTimeSlots ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">
                    Loading available time slots...
                  </p>
                </div>
              ) : availableDates.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <p>No available time slots found for this service.</p>
                  <p className="text-sm mt-2">
                    Please try another service or check back later.
                  </p>
                </div>
              ) : (
                <>
                  {/* Date Selection */}
                  <div className="flex items-center justify-between mb-3 text-gray-600">
                    <button
                      onClick={handlePrevMonth}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Prev
                    </button>
                    <span className="font-medium">
                      {currentMonth.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                  <div className="text-gray-600">
                    <h3 className="font-medium mb-3">Available Dates</h3>

                    {/* Calendar-like grid */}
                    <div className="grid grid-cols-7 gap-2 text-sm">
                      {(() => {
                        const start = new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          1
                        );
                        const end = new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                          0
                        );

                        const days: JSX.Element[] = [];
                        for (
                          let d = start;
                          d <= end;
                          d.setDate(d.getDate() + 1)
                        ) {
                          const isoDate = d.toISOString().split("T")[0];
                          const isAvailable = availableDates.includes(isoDate);
                          const isSelected = selectedDate === isoDate;

                          days.push(
                            <button
                              key={isoDate}
                              onClick={() =>
                                isAvailable && setSelectedDate(isoDate)
                              }
                              disabled={!isAvailable}
                              className={`relative p-2 rounded-lg w-10 h-10 flex items-center justify-center
              ${isSelected ? "bg-blue-600 text-white" : ""}
              ${
                !isAvailable
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-blue-50"
              }
            `}
                            >
                              {d.getDate()}
                              {/* dot indicator for available days */}
                              {isAvailable && (
                                <span
                                  className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                                    isSelected ? "bg-white" : "bg-blue-600"
                                  }`}
                                ></span>
                              )}
                            </button>
                          );
                        }
                        return days;
                      })()}
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  {selectedDate && (
                    <div className="text-gray-600">
                      <h3 className="font-medium mb-3">Available Time Slots</h3>
                      {availableTimeSlots.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">
                          No available time slots for this date.
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {availableTimeSlots.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => handleTimeSlotSelect(slot.id)}
                              className={`p-3 border rounded-lg text-center ${
                                selectedTimeSlotIds.includes(slot.id)
                                  ? "border-blue-600 bg-blue-50 text-blue-700"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {slot.start} – {slot.end}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTimeSlotIds.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-gray-600">
                      <h4 className="font-medium mb-2">Selected Time Slots</h4>
                      <ul className="list-disc list-inside">
                        {availableTimeSlots
                          .filter((slot) =>
                            selectedTimeSlotIds.includes(slot.id)
                          )
                          .map((slot) => (
                            <li key={slot.id}>
                              {new Date(selectedDate).toLocaleDateString()} -{" "}
                              {slot.start} – {slot.end}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end mt-8 text-gray-600">
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedTimeSlotIds.length === 0}
                  className="px-6 py-3 text-white bg-blue-600 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next: Event Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Event Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center text-gray-600 mb-4">
                <FileText className="w-5 h-5 mr-2" />
                <span>Tell us about your event</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event Theme
                  </label>
                  <input
                    type="text"
                    value={eventTheme}
                    onChange={(e) => setEventTheme(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select event type</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Conference">Conference</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={noOfGuest}
                    onChange={(e) => setNoOfGuest(Number(e.target.value))}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
              </div>

              <div className="text-gray-600">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="text-gray-600">
                <label className="block text-sm font-medium mb-2">
                  Special Requirements
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(SpecialRequirement).map((req) => (
                    <label key={req} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={specialRequirements.includes(req)}
                        onChange={() => handleSpecialRequirementToggle(req)}
                        className="mr-2"
                      />
                      <span className="text-sm">{req}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-gray-600">
                <label className="block text-sm font-medium mb-1">
                  Service Notes
                </label>
                <textarea
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  rows={2}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Any special instructions for the service provider"
                />
              </div>

              <div className="text-gray-600">
                <label className="block text-sm font-medium mb-1">
                  Customer Notes
                </label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={2}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Any additional notes or requests"
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!eventName || !eventType}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next: Billing Information
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Billing Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Enter your billing information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
              </div>

              {/* Terms and Policies */}
              <div className="border-t pt-6 mt-6 text-gray-600">
                <h3 className="font-medium mb-4">Terms & Policies</h3>

                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={isTermsAccepted}
                      onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                      className="mt-1 mr-2"
                    />
                    <span className="text-sm">I accept the Terms of Use *</span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={isCancellationPolicyAccepted}
                      onChange={() =>
                        setIsCancellationPolicyAccepted(
                          !isCancellationPolicyAccepted
                        )
                      }
                      className="mt-1 mr-2"
                    />
                    <span className="text-sm">
                      I accept the Cancellation Policy *
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={isLiabilityWaiverSigned}
                      onChange={() =>
                        setIsLiabilityWaiverSigned(!isLiabilityWaiverSigned)
                      }
                      className="mt-1 mr-2"
                    />
                    <span className="text-sm">
                      I sign the Liability Waiver *
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={
                    !street ||
                    !city ||
                    !state ||
                    !country ||
                    !postal ||
                    !isTermsAccepted ||
                    !isCancellationPolicyAccepted ||
                    !isLiabilityWaiverSigned
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next: Review & Confirm
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review and Confirm */}
          {step === 4 && (
            <div className="space-y-6 text-gray-600">
              <div className="flex items-center text-gray-600 mb-4">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Review your booking details</span>
              </div>

              {/* Booking Summary */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Booking Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{serviceName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time Slots:</span>
                    <span>
                      {availableTimeSlots
                        .filter((slot) => selectedTimeSlotIds.includes(slot.id))
                        .map((slot) => `${slot.start} – ${slot.end}`)
                        .join(", ")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Event:</span>
                    <span>
                      {eventName} ({eventType})
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>{noOfGuest}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Pricing</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      Base Price ({selectedTimeSlotIds.length} slots):
                    </span>
                    <span>₦{subTotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountPercentage}%):</span>
                      <span>-₦{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-medium border-t pt-2 mt-2">
                    <span>Total Amount:</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-blue-600">
                    <span>Deposit ({depositPercentage}%):</span>
                    <span>₦{depositAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Option */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Payment Option</h3>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={payDepositOnly && !isCustomPayment}
                      onChange={() => {
                        setPayDepositOnly(true);
                        setCustomPaymentAmount("");
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Pay Deposit Now (₦{depositAmount.toLocaleString()})
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!payDepositOnly && !isCustomPayment}
                      onChange={() => {
                        setPayDepositOnly(false);
                        setCustomPaymentAmount("");
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Pay Full Amount Now (₦{total.toLocaleString()})
                    </span>
                  </label>

                  {/* Custom Payment Amount */}
                  <div className="border-t pt-3 mt-3">
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        checked={isCustomPayment}
                        onChange={() => {
                          setPayDepositOnly(false);
                          if (customPaymentAmount === "") {
                            setCustomPaymentAmount(depositAmount);
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">
                        Pay Custom Amount
                      </span>
                    </label>

                    <div className="ml-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">₦</span>
                        <input
                          type="number"
                          min={depositAmount}
                          max={total}
                          value={customPaymentAmount}
                          onChange={(e) =>
                            handleCustomPaymentAmountChange(e.target.value)
                          }
                          className="w-32 border px-3 py-1 rounded text-sm"
                          placeholder="Enter amount"
                        />
                        <span className="text-xs text-gray-500">
                          Min: ₦{depositAmount.toLocaleString()}
                        </span>
                      </div>

                      {!isCustomAmountValid &&
                        customPaymentAmount !== null &&
                        customPaymentAmount !== undefined && (
                          <p className="text-red-500 text-xs mt-1">
                            Amount must be between ₦
                            {depositAmount.toLocaleString()} and ₦
                            {total.toLocaleString()}
                          </p>
                        )}

                      {isCustomPayment && (
                        <p className="text-blue-600 text-xs mt-1">
                          You&apos;ll pay ₦
                          {customPaymentAmount.toLocaleString()} now, and the
                          remaining ₦
                          {(
                            total - (customPaymentAmount as number)
                          ).toLocaleString()}{" "}
                          before your event.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount Due Display */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Amount Due Now:</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ₦{amountDue.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment due date:{" "}
                    {new Date(calculateDueDate()).toLocaleDateString()}
                  </p>
                </div>

                {/* Stripe minimum payment warning */}
                {isAmountBelowStripeMinimum && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700 font-medium">
                      ⚠️ Minimum Payment Required
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                      Payment amount is below the minimum of ₦100 required for
                      online payments. Please increase your payment amount to
                      proceed.
                    </p>
                  </div>
                )}
              </div>

              {bookingError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                  {bookingError}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={
                    isBookingLoading ||
                    bookingError === "This time slot is already selected." ||
                    isAmountBelowStripeMinimum ||
                    !isCustomAmountValid
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isBookingLoading
                    ? "Processing..."
                    : `Book ₦${amountDue.toLocaleString()} Now`}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-gray-600 mb-6">
                Your booking has been successfully created. You will receive a
                confirmation email shortly.
              </p>

              {/* Invoice Display */}
              <div className="border rounded-lg p-6 max-w-2xl mx-auto text-left mb-6 text-gray-600">
                <h3 className="text-lg font-semibold mb-4">Invoice</h3>

                {/* Invoice Header */}
                <div className="mb-6">
                  <h4 className="font-medium">Custom Quote</h4>
                  <p className="text-sm text-gray-600">
                    Invoice #
                    {bookingResponse?.id?.substring(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm font-medium">Booking Generated</p>
                </div>

                {/* Items Table */}
                <table className="w-full mb-6">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-center py-2">Qty</th>
                      <th className="text-right py-2">Rate</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingResponse?.items?.map(
                      (item: BookingItem, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.item}</td>
                          <td className="text-center py-2">1</td>
                          <td className="text-right py-2">
                            ₦{item.amount.toLocaleString()}
                          </td>
                          <td className="text-right py-2">
                            ₦{item.amount.toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>₦{bookingResponse?.subTotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Discount:</span>
                    <span>-₦{bookingResponse?.discount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax:</span>
                    <span>₦0</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Additional:</span>
                    <span>₦0</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-4 pt-2 border-t">
                    <span>Total:</span>
                    <span>₦{bookingResponse?.total?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium text-blue-600 mt-2">
                    <span>Amount Due:</span>
                    <span>₦{bookingResponse?.amountDue?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Date Picker and Pay Button */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-3">Select Payment Date</h4>
                  <input
                    type="date"
                    value={paymentDate}
                    className="w-full p-2 border rounded mb-4"
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />

                  {/* Check if amount meets minimum requirement */}
                  {Number(bookingResponse?.amountDue ?? 0) < 100 ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <p className="text-yellow-700 text-sm font-medium">
                        ⚠️ Payment Amount Below Minimum
                      </p>
                      <p className="text-yellow-600 text-sm mt-1">
                        The payment amount of ₦
                        {bookingResponse?.amountDue?.toLocaleString()} is below
                        the minimum of ₦100 required for online payments. Please
                        contact our support team to complete your payment.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={openPaymentModal}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Pay ₦{bookingResponse?.amountDue?.toLocaleString()}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Payment Modal */}
      {bookingResponse && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          amountDue={Number(bookingResponse.amountDue ?? 0)}
          invoiceId={bookingResponse.id}
          userId={userId}
          userEmail={currentUser?.email || userEmail}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          handleClose();
        }}
        bookingDates={getBookingDates()}
      />
    </div>
  );
};

export default DatePicker;

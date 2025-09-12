"use client";
import React, { JSX, useState } from "react";
import { X, CheckCircle, Calendar, MapPin, DollarSign } from "lucide-react";
import { useGetTimeSlotsByServiceProviderQuery } from "@/redux/services/timeslot";
import { useRequestQuoteMutation } from "@/redux/services/quoteApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import Notification from "./Notification";

interface QuoteRequestProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
  serviceType: "EVENTCENTER" | "CATERING";
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

enum SpecialRequirement {
  WHEELCHAIRACCESS = "WHEELCHAIRACCESS",
  TEMPERATUREADJUSTMENT = "TEMPERATUREADJUSTMENT",
}

const QuoteRequest: React.FC<QuoteRequestProps> = ({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  serviceType,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState<
    SpecialRequirement[]
  >([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isQuoteSubmitted, setIsQuoteSubmitted] = useState(false);

  // Notification states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id") || sessionStorage.getItem("user_id")
      : null;

  const { data: timeSlotsData, isLoading: isLoadingTimeSlots } =
    useGetTimeSlotsByServiceProviderQuery(
      { serviceId, limit: 100, offset: 0 },
      { skip: !serviceId || !isOpen }
    );

  const [requestQuote, { isLoading: isQuoteLoading }] =
    useRequestQuoteMutation();

  // Show notification function
  const showNotificationMessage = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

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
  ).sort();

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
      const hasConflict = prev.some((id) => {
        const slot = availableTimeSlots.find((s) => s.id === id);
        return (
          slot &&
          slot.start === selectedSlot.start &&
          slot.end === selectedSlot.end
        );
      });

      if (hasConflict) {
        setQuoteError("This time slot is already selected.");
        return prev;
      }

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

  const handleSubmitQuote = async () => {
    try {
      if (selectedTimeSlotIds.length === 0) {
        setQuoteError("Please select at least one time slot.");
        return;
      }

      if (!userId) {
        setQuoteError("User not authenticated. Please log in.");
        return;
      }

      if (!budget) {
        setQuoteError("Please provide your budget estimate.");
        return;
      }

      if (
        !isTermsAccepted ||
        !isCancellationPolicyAccepted ||
        !isLiabilityWaiverSigned
      ) {
        setQuoteError("Please accept all terms and policies to continue.");
        return;
      }

      const payload = {
        customerId: userId,
        serviceId,
        serviceType: serviceType as "CATERING" | "EVENTCENTER",
        timeslotId: selectedTimeSlotIds,
        budget,
        billingAddress: {
          street,
          city,
          state,
          country,
          postal,
        },
        isTermsAccepted,
        isCancellationPolicyAccepted,
        isLiabilityWaiverSigned,
        source: "WEB",
      };

      await requestQuote(payload).unwrap();
      setIsQuoteSubmitted(true);

      // Show success notification
      showNotificationMessage(
        "Your quote request has been submitted successfully! You will be notified when an invoice is sent to you.",
        "success"
      );

      // Redirect after a delay
      setTimeout(() => {
        resetForm();
        onClose();
        // Redirect to home page
        window.location.href = "/";
      }, 5000);
    } catch (error) {
      let errorMessage = "Quote request failed. Please try again.";

      if ((error as FetchBaseQueryError)?.data) {
        const apiError = error as FetchBaseQueryError & {
          data?: { message?: string };
        };
        errorMessage = apiError.data?.message || errorMessage;
      } else {
        const fallbackError = error as SerializedError;
        errorMessage = fallbackError.message || errorMessage;
      }

      setQuoteError(errorMessage);
      showNotificationMessage(errorMessage, "error");
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedTimeSlotIds([]);
    setBudget("");
    setSpecialRequirements([]);
    setStreet("");
    setCity("");
    setState("");
    setCountry("");
    setPostal("");
    setIsTermsAccepted(false);
    setIsCancellationPolicyAccepted(false);
    setIsLiabilityWaiverSigned(false);
    setQuoteError(null);
    setIsQuoteSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Notification Component */}
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-700">
              {step === 1 && "Select Date & Time"}
              {step === 2 && "Details & Budget"}
              {step === 3 && "Billing Information"}
              {step === 4 && "Review Quote Request"}
              {isQuoteSubmitted && "Quote Request Submitted!"}
            </h2>
            <div className="flex items-center">
              {!isQuoteSubmitted && (
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
            {/* Success Message */}
            {isQuoteSubmitted && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Quote Request Submitted!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your quote request has been successfully submitted. You will
                  receive a notification when an invoice has been sent to you.
                </p>
                <p className="text-gray-500 text-sm">
                  Redirecting you back to the homepage shortly...
                </p>
              </div>
            )}

            {/* Step 1: Date and Time Selection */}
            {!isQuoteSubmitted && step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Select preferred date and time slots</span>
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
                            const isAvailable =
                              availableDates.includes(isoDate);
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
                        <h3 className="font-medium mb-3">
                          Available Time Slots
                        </h3>
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
                        <h4 className="font-medium mb-2">
                          Selected Time Slots
                        </h4>
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

                <div className="flex justify-end mt-8">
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

            {/* Step 2: Event Details and Budget */}
            {!isQuoteSubmitted && step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center text-gray-600 mb-4">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>Tell us about your event and budget</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Budget Estimate *
                    </label>
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter your budget range (e.g., ₦50,000 - ₦100,000)"
                      required
                    />
                  </div>
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

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!budget}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next: Billing Information
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Billing Information */}
            {!isQuoteSubmitted && step === 3 && (
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
                      <span className="text-sm">
                        I accept the Terms of Use *
                      </span>
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
                    Next: Review Quote
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review Quote Request */}
            {!isQuoteSubmitted && step === 4 && (
              <div className="space-y-6 text-gray-600">
                <div className="flex items-center text-gray-600 mb-4">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Review your quote request</span>
                </div>

                {/* Quote Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Quote Request Summary</h3>

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
                          .filter((slot) =>
                            selectedTimeSlotIds.includes(slot.id)
                          )
                          .map((slot) => `${slot.start} – ${slot.end}`)
                          .join(", ")}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-semibold">{budget}</span>
                    </div>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Billing Information</h3>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span>{street}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>City:</span>
                      <span>{city}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>State:</span>
                      <span>{state}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Country:</span>
                      <span>{country}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Postal Code:</span>
                      <span>{postal}</span>
                    </div>
                  </div>
                </div>

                {quoteError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                    {quoteError}
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
                    onClick={handleSubmitQuote}
                    disabled={isQuoteLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isQuoteLoading ? "Submitting..." : "Submit Quote Request"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuoteRequest;

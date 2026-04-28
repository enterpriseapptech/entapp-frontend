"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import Header from "@/components/layouts/Header";
import ServiceProviderSideBar from "@/components/layouts/ServiceProviderSideBar";
import { useGetUserByIdQuery, ServiceType } from "@/redux/services/authApi";
import { useGetEventCentersByServiceProviderQuery } from "@/redux/services/eventsApi";
import { useGetTimeSlotsByServiceProviderQuery } from "@/redux/services/timeslot";
import { useCreateBookingMutation } from "@/redux/services/book";
import Notification from "@/components/ui/Notification";

const EVENT_TYPES = ["Wedding", "Conference", "Birthday", "Party", "Corporate", "Other"];

interface LineItem {
  item: string;
  amount: number;
}

export default function AddBooking() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [serviceProviderId, setServiceProviderId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [selectedTimeslots, setSelectedTimeslots] = useState<string[]>([]);
  const [eventName, setEventName] = useState<string>("");
  const [eventTheme, setEventTheme] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [noOfGuest, setNoOfGuest] = useState<number>(0);
  const [specialRequirements, setSpecialRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState<string>("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ item: "", amount: 0 }]);
  const [discount, setDiscount] = useState<number>(0);
  const [serviceNotes, setServiceNotes] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [billingStreet, setBillingStreet] = useState<string>("");
  const [billingCity, setBillingCity] = useState<string>("");
  const [billingState, setBillingState] = useState<string>("");
  const [billingCountry, setBillingCountry] = useState<string>("");
  const [billingPostal, setBillingPostal] = useState<string>("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isCancellationPolicyAccepted, setIsCancellationPolicyAccepted] = useState(false);
  const [isLiabilityWaiverSigned, setIsLiabilityWaiverSigned] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    setUserId(stored);
  }, []);

  const { data: user } = useGetUserByIdQuery(userId!, { skip: !userId });

  useEffect(() => {
    if (userId === null) return;
    if (!userId) {
      router.push("/login");
      return;
    }
    if (
      user &&
      user.serviceProvider?.serviceType !== ServiceType.EVENTCENTERS &&
      user.serviceProvider?.serviceType !== ServiceType.ALL
    ) {
      router.push("/eventServiceManagement/eventServiceDashboard");
    }
  }, [user, userId, router]);

  useEffect(() => {
    if (user?.serviceProvider?.id) {
      setServiceProviderId(user.serviceProvider.id);
    }
  }, [user]);

  const { data: eventCentersData } = useGetEventCentersByServiceProviderQuery(
    { serviceProviderId, limit: 50, offset: 0 },
    { skip: !serviceProviderId }
  );

  const { data: timeslotsData, isLoading: isLoadingTimeslots } =
    useGetTimeSlotsByServiceProviderQuery(
      {
        serviceId: selectedServiceId,
        limit: 50,
        offset: 0,
        ...(filterDate ? { date: filterDate } : {}),
      },
      { skip: !selectedServiceId }
    );

  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const subTotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const total = Math.max(0, subTotal - discount);

  const toggleTimeslot = (id: string) => {
    setSelectedTimeslots((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const addRequirement = () => {
    const val = requirementInput.trim();
    if (val) {
      setSpecialRequirements((prev) => [...prev, val]);
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setSpecialRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addLineItem = () => setLineItems((prev) => [...prev, { item: "", amount: 0 }]);

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedServiceId) return setError("Please select an event center.");
    if (!customerId.trim()) return setError("Customer ID is required.");
    if (!dueDate) return setError("Due date is required.");
    if (selectedTimeslots.length === 0) return setError("Please select at least one time slot.");
    if (!eventName.trim()) return setError("Event name is required.");
    if (!eventType) return setError("Event type is required.");
    if (!isTermsAccepted) return setError("You must accept the terms of use.");
    if (!isCancellationPolicyAccepted) return setError("You must accept the cancellation policy.");
    if (!isLiabilityWaiverSigned) return setError("You must sign the liability waiver.");

    try {
      await createBooking({
        customerId: customerId.trim(),
        serviceId: selectedServiceId,
        timeslotId: selectedTimeslots,
        serviceType: "EVENTCENTER",
        subTotal,
        discount,
        total,
        items: lineItems.filter((i) => i.item.trim()),
        billingAddress: {
          street: billingStreet,
          city: billingCity,
          state: billingState,
          country: billingCountry,
          postal: billingPostal,
        },
        dueDate: new Date(dueDate).toISOString(),
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
        specialRequirements,
      }).unwrap();

      setSuccess("Booking created successfully!");
      setTimeout(() => router.push("/eventServiceManagement/manage-bookings"), 1500);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to create booking. Please try again.";
      setError(msg);
    }
  };

  const availableTimeslots = timeslotsData?.data?.filter((ts) => ts.isAvailable) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceProviderSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="md:ml-[280px]">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="md:p-10 p-4">
          {error && (
            <Notification
              message={error}
              type="error"
              onClose={() => setError(null)}
            />
          )}
          {success && (
            <Notification
              message={success}
              type="success"
              onClose={() => setSuccess(null)}
            />
          )}

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Booking</h1>
              <p className="text-sm text-gray-500 mt-1">Create a new event booking</p>
            </div>
            <div className="flex gap-3">
              <Link href="/eventServiceManagement/manage-bookings">
                <button
                  type="button"
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                form="bookingForm"
                disabled={isCreating}
                className="px-6 py-2 bg-[#315E9D] text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
              >
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCreating ? "Creating..." : "Create Booking"}
              </button>
            </div>
          </div>

          <form id="bookingForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Booking Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Event Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => {
                      setSelectedServiceId(e.target.value);
                      setSelectedTimeslots([]);
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select event center</option>
                    {eventCentersData?.data?.map((ec) => (
                      <option key={ec.id} value={ec.id}>
                        {ec.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Customer ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Enter customer ID"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Smith Wedding"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Event Theme
                  </label>
                  <input
                    type="text"
                    value={eventTheme}
                    onChange={(e) => setEventTheme(e.target.value)}
                    placeholder="e.g. Garden, Vintage"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={noOfGuest}
                    onChange={(e) => setNoOfGuest(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Brief description of the event"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Special Requirements
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                      placeholder="Add a requirement and press Enter"
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specialRequirements.map((req, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {req}
                        <button type="button" onClick={() => removeRequirement(i)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">
                Time Slots <span className="text-red-500">*</span>
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setSelectedTimeslots([]);
                  }}
                  className="w-full md:w-64 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {!selectedServiceId ? (
                <p className="text-sm text-gray-400">Select an event center to see available time slots.</p>
              ) : isLoadingTimeslots ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading time slots...
                </div>
              ) : availableTimeslots.length === 0 ? (
                <p className="text-sm text-gray-400">No available time slots{filterDate ? " for selected date" : ""}.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTimeslots.map((ts) => {
                    const isSelected = selectedTimeslots.includes(ts.id);
                    return (
                      <button
                        key={ts.id}
                        type="button"
                        onClick={() => toggleTimeslot(ts.id)}
                        className={`flex flex-col items-start p-3 rounded-lg border text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-[#F2F6FC] border-[#0047AB] text-[#0047AB]"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">
                          {new Date(ts.startTime).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          {" – "}
                          {new Date(ts.endTime).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">
                          {new Date(ts.startTime).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedTimeslots.length > 0 && (
                <p className="mt-3 text-xs text-blue-600 font-medium">
                  {selectedTimeslots.length} slot{selectedTimeslots.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Line Items & Pricing */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Items & Pricing</h2>

              <div className="space-y-3 mb-4">
                {lineItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => updateLineItem(index, "item", e.target.value)}
                      placeholder="Item description"
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="number"
                      min={0}
                      value={item.amount}
                      onChange={(e) => updateLineItem(index, "amount", Number(e.target.value))}
                      placeholder="Amount"
                      className="w-36 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                      className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addLineItem}
                className="flex items-center gap-2 text-sm text-[#0047AB] hover:underline mb-5"
              >
                <Plus className="w-4 h-4" />
                Add item
              </button>

              <div className="border-t border-gray-100 pt-4 space-y-2 max-w-sm ml-auto text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Discount</span>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Billing Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street</label>
                  <input
                    type="text"
                    value={billingStreet}
                    onChange={(e) => setBillingStreet(e.target.value)}
                    placeholder="Street address"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                  <input
                    type="text"
                    value={billingState}
                    onChange={(e) => setBillingState(e.target.value)}
                    placeholder="State"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                  <input
                    type="text"
                    value={billingPostal}
                    onChange={(e) => setBillingPostal(e.target.value)}
                    placeholder="Postal code"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Notes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Service Notes
                  </label>
                  <textarea
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    rows={3}
                    placeholder="Notes for the service provider"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Customer Notes
                  </label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={3}
                    placeholder="Notes from the customer"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Agreements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Agreements</h2>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#0047AB] accent-[#0047AB]"
                  />
                  <span className="text-sm text-gray-700">
                    Customer has accepted the <strong>Terms of Use</strong>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCancellationPolicyAccepted}
                    onChange={(e) => setIsCancellationPolicyAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#0047AB] accent-[#0047AB]"
                  />
                  <span className="text-sm text-gray-700">
                    Customer has accepted the <strong>Cancellation Policy</strong>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLiabilityWaiverSigned}
                    onChange={(e) => setIsLiabilityWaiverSigned(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#0047AB] accent-[#0047AB]"
                  />
                  <span className="text-sm text-gray-700">
                    Customer has signed the <strong>Liability Waiver</strong>
                  </span>
                </label>
              </div>
            </div>
          </form>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4 flex justify-end gap-3 mt-6 -mx-4 md:-mx-10">
            <Link href="/eventServiceManagement/manage-bookings">
              <button
                type="button"
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              form="bookingForm"
              disabled={isCreating}
              className="px-6 py-2 bg-[#315E9D] text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
            >
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCreating ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

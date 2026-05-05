"use client";
import { ChevronLeft, ChevronRight, Plus, Trash2, Search, ChevronDown } from "lucide-react";
import Header from "@/components/layouts/Header";
import ServiceProviderSideBar from "@/components/layouts/ServiceProviderSideBar";
import { useGetUserByIdQuery, ServiceType } from "@/redux/services/authApi";
import { useGetCateringsByServiceProviderQuery, useGetCateringByIdQuery } from "@/redux/services/cateringApi";
import { useGetTimeSlotsByServiceProviderQuery } from "@/redux/services/timeslot";
import { useCreateBookingMutation } from "@/redux/services/book";
import { useGetUsersQuery } from "@/redux/services/adminApi";
import { useState, useEffect } from "react";
import Image from "next/image";

interface LineItem {
  item: string;
  amount: number;
}

const EVENT_TYPES = ["Wedding", "Conference", "Birthday", "Party", "Corporate", "Other"];

export default function AddCateringBooking() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
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
  const [serviceCharge, setServiceCharge] = useState<number>(1500);
  const [serviceNotes, setServiceNotes] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [billingStreet, setBillingStreet] = useState<string>("");
  const [billingCity, setBillingCity] = useState<string>("");
  const [billingState, setBillingState] = useState<string>("");
  const [billingCountry, setBillingCountry] = useState<string>("Nigeria");
  const [billingPostal, setBillingPostal] = useState<string>("");

  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [isCancellationPolicyAccepted, setIsCancellationPolicyAccepted] = useState(true);
  const [isLiabilityWaiverSigned, setIsLiabilityWaiverSigned] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    setUserId(user_id);
  }, []);

  const { data: userData } = useGetUserByIdQuery(userId || "", { skip: !userId });

  useEffect(() => {
    if (userData?.serviceProvider?.id) {
      setServiceProviderId(userData.serviceProvider.id);
    }
  }, [userData]);

  const { data: cateringsData } = useGetCateringsByServiceProviderQuery(
    { serviceProviderId: serviceProviderId || "", limit: 100, offset: 0 },
    { skip: !serviceProviderId }
  );

  const { data: timeslotsData } = useGetTimeSlotsByServiceProviderQuery(
    {
      serviceId: selectedServiceId,
      date: selectedDate,
      limit: 100,
      offset: 0,
    },
    { skip: !selectedServiceId }
  );
    
  const { data: fullCatering } = useGetCateringByIdQuery(selectedServiceId, { skip: !selectedServiceId });

  const { data: customersData, isLoading: isLoadingCustomers } = useGetUsersQuery({
    limit: 100,
    offset: 0,
    userType: "CUSTOMER",
  });

  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  // Auto-fill form
  useEffect(() => {
    if (fullCatering) {
      setDescription(fullCatering.description || "");
      setNoOfGuest(fullCatering.minCapacity || 0);
      setBillingStreet(fullCatering.streetAddress || "");
      setBillingCity(fullCatering.city || "");
      setBillingPostal(fullCatering.postal || "");
      setServiceNotes(fullCatering.termsOfUse || "");
      setCustomerNotes(fullCatering.cancellationPolicy || "");
      setEventType(fullCatering.eventTypes?.[0] || "");
      setEventName(`${fullCatering.name} Service`);
      setLineItems([{ item: `Catering Service - ${fullCatering.name}`, amount: fullCatering.startPrice || 0 }]);
    }
  }, [fullCatering]);

  const subTotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const total = Math.max(0, subTotal + serviceCharge - discount);

  const toggleTimeslot = (id: string) => {
    setSelectedTimeslots((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
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

    if (!selectedServiceId) return setError("Please select a catering service.");
    if (!customerId.trim()) return setError("Customer is required.");
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
        serviceType: "CATERING",
        subTotal,
        discount,
        serviceCharge,
        total,
        amountDue: total,
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
      setTimeout(() => {
        window.location.href = "/cateringServiceManagement/manage-bookings";
      }, 2000);
    } catch (err: any) {
      setError(err?.data?.message || "An error occurred while creating the booking.");
    }
  };

  const availableTimeslots = timeslotsData?.data?.filter((ts) => ts.isAvailable) ?? [];
  const dynamicEventTypes = fullCatering?.eventTypes?.length ? fullCatering.eventTypes : EVENT_TYPES;

  const filteredCustomers = customersData?.docs.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceProviderSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="md:ml-[280px]">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="md:p-10 p-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Catering Booking</h1>
              <p className="text-gray-500">Create a new catering service booking</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            {/* Booking Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Booking Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Catering Service <span className="text-red-500">*</span></label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => {
                      setSelectedServiceId(e.target.value);
                      setSelectedTimeslots([]);
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                  >
                    <option value="">Select catering service</option>
                    {cateringsData?.data?.map((ec) => (
                      <option key={ec.id} value={ec.id}>{ec.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Customer <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerDropdown(true);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      placeholder="Search customer by name or email"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                    />
                    {showCustomerDropdown && (customerSearch || isLoadingCustomers) && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoadingCustomers ? (
                          <div className="p-4 text-center text-sm text-gray-500">Loading customers...</div>
                        ) : filteredCustomers.length > 0 ? (
                          filteredCustomers.map((c) => (
                            <div
                              key={c.id}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                              onClick={() => {
                                setCustomerId(c.id);
                                setCustomerSearch(`${c.firstName} ${c.lastName}`);
                                setShowCustomerDropdown(false);
                              }}
                            >
                              <p className="text-sm font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                              <p className="text-xs text-gray-500">{c.email}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-gray-500">No customers found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Due Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Smith Wedding"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event Type <span className="text-red-500">*</span></label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                  >
                    <option value="">Select event type</option>
                    {dynamicEventTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event Theme</label>
                  <input
                    type="text"
                    value={eventTheme}
                    onChange={(e) => setEventTheme(e.target.value)}
                    placeholder="e.g. Garden, Vintage"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Number of Guests</label>
                  <input
                    type="number"
                    value={noOfGuest}
                    onChange={(e) => setNoOfGuest(Number(e.target.value))}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    readOnly={false}
                    placeholder="Brief description of the event"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Time Slots <span className="text-red-500">*</span></h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-full max-w-xs space-y-2">
                    <label className="text-sm font-medium text-gray-700">Filter by Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                    />
                  </div>
                </div>

                {!selectedServiceId ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">Please select a catering service to see available timeslots</p>
                  </div>
                ) : availableTimeslots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableTimeslots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => toggleTimeslot(slot.id)}
                        className={`p-3 text-sm rounded-lg border text-left transition-all ${
                          selectedTimeslots.includes(slot.id)
                            ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500"
                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">
                          {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-500 text-sm">
                    No available timeslots for this date.
                  </div>
                )}
              </div>
            </div>

            {/* Items & Pricing */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Items & Pricing</h2>
              <div className="space-y-4">
                {lineItems.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handleLineItemChange(index, "item", e.target.value)}
                        placeholder="Item Description"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleLineItemChange(index, "amount", Number(e.target.value))}
                        placeholder="Price"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLineItem}
                  className="flex items-center gap-2 text-[#0047AB] text-sm font-semibold hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add item</span>
                </button>

                <div className="max-w-xs ml-auto pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Discount</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                    />
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Service Charge</span>
                    <input
                      type="number"
                      min={0}
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(Number(e.target.value))}
                      className="w-28 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                    />
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Billing Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Street</label>
                  <input
                    type="text"
                    value={billingStreet}
                    onChange={(e) => setBillingStreet(e.target.value)}
                    readOnly={false}
                    placeholder="Street address"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    readOnly={false}
                    placeholder="City"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={billingState}
                    onChange={(e) => setBillingState(e.target.value)}
                    readOnly={false}
                    placeholder="State"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    value={billingPostal}
                    onChange={(e) => setBillingPostal(e.target.value)}
                    readOnly={false}
                    placeholder="Postal code"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Service Notes</h2>
                <textarea
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  rows={4}
                  placeholder="Internal notes for the service"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Customer Notes</h2>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={4}
                  placeholder="Notes for the customer"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Notifications */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Form Actions */}
            <div className="fixed bottom-0 right-0 left-0 md:left-[280px] bg-white border-t p-4 flex justify-end gap-4 z-10">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-8 py-2.5 bg-[#0047AB] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 shadow-md"
              >
                {isCreating ? "Creating..." : "Create Booking"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

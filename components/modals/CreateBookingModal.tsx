"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { useGetUsersQuery } from "../../redux/services/adminApi";
import { useGetTimeSlotsByServiceProviderQuery } from "../../redux/services/timeslot";
import { useCreateBookingMutation, CreateBookingRequest } from "../../redux/services/book";
import { useGetEventCenterByIdQuery } from "../../redux/services/eventsApi";
import { useGetCateringByIdQuery } from "../../redux/services/cateringApi";
import Notification from "../ui/Notification";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceType: "EVENTCENTER" | "CATERING";
  serviceName: string;
}

export default function CreateBookingModal({
  isOpen,
  onClose,
  serviceId,
  serviceType,
  serviceName,
}: CreateBookingModalProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CreateBookingRequest>>({
    customerId: "",
    serviceId: serviceId,
    serviceType: serviceType,
    timeslotId: [],
    items: [{ item: `Booking - ${serviceName}`, amount: 0 }],
    subTotal: 0,
    serviceCharge: 1500,
    discount: 0,
    total: 0,
    amountDue: 0,
    billingAddress: {
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
      postal: "",
    },
    dueDate: new Date().toISOString().split("T")[0],
    isTermsAccepted: true,
    isCancellationPolicyAccepted: true,
    isLiabilityWaiverSigned: true,
    source: "WEB",
    serviceNotes: "",
    customerNotes: "",
    eventName: "",
    eventTheme: "",
    eventType: "",
    description: "",
    noOfGuest: 1,
    specialRequirements: [],
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // API Hooks
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({
    limit: 100,
    offset: 0,
    userType: "CUSTOMER",
  });

  const { data: timeSlotsData, isLoading: isTimeSlotsLoading } = useGetTimeSlotsByServiceProviderQuery(
    {
      serviceId,
      date: selectedDate,
      limit: 100,
      offset: 0,
    },
    { skip: !serviceId || !selectedDate }
  );

  const { data: eventDetails } = useGetEventCenterByIdQuery(serviceId, { skip: !serviceId || serviceType !== "EVENTCENTER" });
  const { data: cateringDetails } = useGetCateringByIdQuery(serviceId, { skip: !serviceId || serviceType !== "CATERING" });

  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();

  // Auto-fill from service details
  useEffect(() => {
    const details = serviceType === "EVENTCENTER" ? eventDetails : cateringDetails;
    if (details) {
      setFormData((prev) => ({
        ...prev,
        description: details.description || "",
        noOfGuest: (details as any).sittingCapacity || (details as any).minCapacity || 1,
        eventType: details.eventTypes?.[0] || "",
        eventName: `${details.name} Event`,
        billingAddress: {
          ...prev.billingAddress!,
          street: details.streetAddress || "",
          city: details.city || "",
          postal: details.postal || "",
        },
        items: [
          { 
            item: `Booking - ${details.name}`, 
            amount: (details as any).pricingPerSlot || (details as any).startPrice || 0 
          }
        ],
        serviceNotes: details.termsOfUse ? `Terms: ${details.termsOfUse}\n\n` : "",
        customerNotes: details.cancellationPolicy ? `Cancellation Policy: ${details.cancellationPolicy}` : "",
      }));
    }
  }, [eventDetails, cateringDetails, serviceType]);

  // Calculations
  useEffect(() => {
    const itemsTotal = formData.items?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    const subTotal = itemsTotal + (formData.serviceCharge || 0);
    const total = subTotal - (formData.discount || 0);
    
    setFormData((prev) => ({
      ...prev,
      subTotal: itemsTotal,
      total: total,
      amountDue: total,
    }));
  }, [formData.items, formData.serviceCharge, formData.discount]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      billingAddress: { ...prev.billingAddress!, [field]: value },
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { item: "", amount: 0 }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: "item" | "amount", value: string | number) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleTimeslotToggle = (id: string) => {
    const current = formData.timeslotId || [];
    if (current.includes(id)) {
      setFormData((prev) => ({ ...prev, timeslotId: current.filter((t) => t !== id) }));
    } else {
      setFormData((prev) => ({ ...prev, timeslotId: [...current, id] }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.customerId) return setError("Please select a customer");
    if (!formData.timeslotId?.length) return setError("Please select at least one timeslot");
    if (!formData.eventName) return setError("Event name is required");

    try {
      const payload = {
        ...formData,
        dueDate: new Date(formData.dueDate!).toISOString(),
      } as CreateBookingRequest;

      await createBooking(payload).unwrap();
      setSuccess("Booking created successfully!");
      setTimeout(() => {
        onClose();
        setStep(1);
      }, 2000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create booking");
    }
  };

  const filteredCustomers = usersData?.docs.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-white to-gray-50 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Booking</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {step} of 4: {step === 1 ? "Customer & Service" : step === 2 ? "Event Details" : step === 3 ? "Pricing & Items" : "Review & Billing"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Select Customer</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search customer by name or email..."
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {isUsersLoading ? (
                        <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin h-4 w-4" /> Loading...
                        </div>
                      ) : filteredCustomers?.length ? (
                        filteredCustomers.map(u => (
                          <div
                            key={u.id}
                            className={`p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${formData.customerId === u.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                            onClick={() => {
                              handleInputChange("customerId", u.id);
                              setSearchTerm(`${u.firstName} ${u.lastName} (${u.email})`);
                            }}
                          >
                            <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 italic">No customers found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Service</label>
                  <input
                    type="text"
                    value={serviceName}
                    disabled
                    className="w-full border border-gray-100 bg-gray-50 p-3 rounded-xl text-gray-600 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Select Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Available Timeslots</label>
                {isTimeSlotsLoading ? (
                  <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin h-4 w-4" /> Loading slots...</div>
                ) : timeSlotsData?.data.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlotsData.data.filter(s => s.isAvailable).map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleTimeslotToggle(slot.id)}
                        className={`p-3 text-sm rounded-xl border-2 transition-all font-medium ${
                          formData.timeslotId?.includes(slot.id)
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-100 hover:border-gray-200 text-gray-600"
                        }`}
                      >
                        {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 text-orange-700 rounded-xl text-sm border border-orange-100 italic">No available timeslots for this date.</div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Event Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wedding Reception"
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange("eventName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Event Type</label>
                {serviceType === "EVENTCENTER" && eventDetails?.eventTypes?.length ? (
                  <select
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                    value={formData.eventType}
                    onChange={(e) => handleInputChange("eventType", e.target.value)}
                  >
                    <option value="">Select Event Type</option>
                    {eventDetails.eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. Wedding"
                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                    value={formData.eventType}
                    onChange={(e) => handleInputChange("eventType", e.target.value)}
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Event Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Vintage Romance"
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                  value={formData.eventTheme}
                  onChange={(e) => handleInputChange("eventTheme", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Number of Guests</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                  value={formData.noOfGuest}
                  onChange={(e) => handleInputChange("noOfGuest", parseInt(e.target.value))}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Special Requirements (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. WHEELCHAIRACCESS, VEGAN"
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                  value={formData.specialRequirements?.join(", ")}
                  onChange={(e) => handleInputChange("specialRequirements", e.target.value.split(",").map(s => s.trim()).filter(s => s))}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-gray-900 placeholder:text-gray-500"
                  placeholder="Briefly describe the event..."
                  value={formData.description}
                  readOnly={false}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">Line Items</label>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.items?.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          placeholder="Item Description"
                          className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                          value={item.item}
                          onChange={(e) => handleItemChange(index, "item", e.target.value)}
                        />
                      </div>
                      <div className="w-32 space-y-1">
                        <input
                          type="number"
                          placeholder="Price"
                          className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, "amount", parseFloat(e.target.value))}
                        />
                      </div>
                      {index > 0 && (
                        <button onClick={() => handleRemoveItem(index)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Service Charge (NGN)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.serviceCharge}
                      onChange={(e) => handleInputChange("serviceCharge", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Discount (NGN)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.discount}
                      onChange={(e) => handleInputChange("discount", parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 flex flex-col items-end gap-2">
                  <div className="flex justify-between w-full md:w-64">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-semibold">NGN {formData.subTotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between w-full md:w-64 text-blue-600 text-lg">
                    <span className="font-bold">Amount Due:</span>
                    <span className="font-bold">NGN {formData.amountDue?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Billing Address</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                      value={formData.billingAddress?.street}
                      readOnly={false}
                      onChange={(e) => handleBillingChange("street", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                        value={formData.billingAddress?.city}
                        readOnly={false}
                        onChange={(e) => handleBillingChange("city", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                        value={formData.billingAddress?.state}
                        readOnly={false}
                        onChange={(e) => handleBillingChange("state", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Postal Code"
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 bg-gray-50"
                        value={formData.billingAddress?.postal}
                        readOnly={false}
                        onChange={(e) => handleBillingChange("postal", e.target.value)}
                      />
                      <input
                        type="date"
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Notes</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Service Notes</label>
                      <textarea
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none text-gray-900 placeholder:text-gray-500"
                        placeholder="Internal notes for the service..."
                        value={formData.serviceNotes}
                        onChange={(e) => handleInputChange("serviceNotes", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Customer Notes</label>
                      <textarea
                        className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none text-gray-900 placeholder:text-gray-500"
                        placeholder="Notes for the customer..."
                        value={formData.customerNotes}
                        onChange={(e) => handleInputChange("customerNotes", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-white transition-all shadow-sm"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          
          <button
            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-lg flex items-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin h-4 w-4" /> Creating...</>
            ) : step === 4 ? (
              "Confirm & Create"
            ) : (
              "Next Step"
            )}
          </button>
        </div>
      </div>

      {success && <Notification message={success} type="success" onClose={() => setSuccess(null)} />}
      {error && <Notification message={error} type="error" onClose={() => setError(null)} />}
    </div>
  );
}

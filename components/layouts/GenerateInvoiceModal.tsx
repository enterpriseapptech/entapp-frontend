"use client";
import { useState, useEffect } from "react";
import { CalendarDays, X, Plus, Trash2, CheckCircle } from "lucide-react";
import { useCreateBookingMutation } from "@/redux/services/book";

interface Quote {
  id: string;
  customerId: string;
  serviceId: string;
  serviceType: "EVENTCENTER" | "CATERING";
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal: string;
  };
  isTermsAccepted: boolean;
  isCancellationPolicyAccepted: boolean;
  isLiabilityWaiverSigned: boolean;
  source: "WEB" | "MOBILE" | string;
  customerNotes: string;
  timeslotIds: string[];
}

interface GenerateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuote: Quote;
  timeslotIds: string[];
}

enum SpecialRequirement {
  WHEELCHAIRACCESS = "WHEELCHAIRACCESS",
  TEMPERATUREADJUSTMENT = "TEMPERATUREADJUSTMENT",
}

export default function GenerateInvoiceModal({
  isOpen,
  onClose,
  initialQuote,
  timeslotIds,
}: GenerateInvoiceModalProps) {
  const [createBooking, { isLoading, error }] = useCreateBookingMutation();
  const [items, setItems] = useState([{ item: "", amount: 0 }]);
  const [specialRequirements, setSpecialRequirements] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    subTotal: 0,
    discount: 0,
    total: 0,
    dueDate: "",
    serviceNotes: "",
    eventName: "",
    eventTheme: "",
    description: "",
    noOfGuest: 0,
  });

  // Calculate totals whenever items or discount changes
  useEffect(() => {
    const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const total = parseFloat(
      (subTotal - (subTotal * (formData.discount || 0)) / 100).toFixed(2)
    );
    setFormData((prev) => ({
      ...prev,
      subTotal,
      total,
    }));
  }, [items, formData.discount]);

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { item: "", amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSpecialRequirementChange = (requirement: SpecialRequirement) => {
    setSpecialRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((r) => r !== requirement)
        : [...prev, requirement]
    );
  };

  const handleSubmit = async () => {
    try {
      const bookingData = {
        customerId: initialQuote.customerId,
        serviceId: initialQuote.serviceId,
        timeslotId: timeslotIds,
        serviceType: initialQuote.serviceType,
        subTotal: formData.subTotal,
        discount: formData.discount,
        total: formData.total,
        items: items.filter((item) => item.item && item.amount > 0),
        billingAddress: initialQuote.billingAddress,
        dueDate: new Date(formData.dueDate).toISOString(),
        isTermsAccepted: initialQuote.isTermsAccepted,
        isCancellationPolicyAccepted: initialQuote.isCancellationPolicyAccepted,
        isLiabilityWaiverSigned: initialQuote.isLiabilityWaiverSigned,
        source: initialQuote.source,
        serviceNotes: formData.serviceNotes,
        customerNotes: initialQuote.customerNotes,
        eventName: formData.eventName,
        eventTheme: formData.eventTheme,
        eventType: initialQuote.serviceType,
        description: formData.description,
        noOfGuest: formData.noOfGuest,
        specialRequirements,
      };

      await createBooking(bookingData).unwrap();
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to create booking:", err);
    }
  };
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  if (!isOpen && !showSuccessModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Generate Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Items Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
            {items.map((item, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) =>
                      handleItemChange(index, "item", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-400"
                    placeholder="Item description"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          {/* Discount Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Discount
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400"
                  placeholder="0%"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Event Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      eventName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-400"
                  placeholder="Event name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Theme
                </label>
                <input
                  type="text"
                  value={formData.eventTheme}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      eventTheme: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-400"
                  placeholder="Event theme"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  value={formData.noOfGuest}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      noOfGuest: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400"
                  placeholder="Number of guests"
                  min="1"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-gray-400"
                />
                <CalendarDays className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Special Requirements
            </h3>
            <div className="space-y-2">
              {Object.values(SpecialRequirement).map((requirement) => (
                <label key={requirement} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={specialRequirements.includes(requirement)}
                    onChange={() => handleSpecialRequirementChange(requirement)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    {requirement === SpecialRequirement.WHEELCHAIRACCESS
                      ? "Wheelchair Access"
                      : "Temperature Adjustment"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <textarea
              value={formData.serviceNotes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  serviceNotes: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-400"
              placeholder="Service notes..."
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h3>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-400"
              placeholder="Event description..."
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Invoice Summary
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">
                  ${formData.subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount ({formData.discount}%):</span>
                <span className="font-medium">
                  -${((formData.subTotal * formData.discount) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200 mt-4">
                <span>Total:</span>
                <span>${formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              Error:{" "}
              {error instanceof Error
                ? error.message
                : "Failed to create booking"}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Creating..." : "Generate Invoice"}
          </button>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Invoice Created Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your invoice has been generated and sent successfully.
              </p>
              <button
                onClick={handleCloseSuccessModal}
                className="px-6 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

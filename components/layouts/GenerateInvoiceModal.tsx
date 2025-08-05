import { useState } from "react";
import { CalendarDays, X } from "lucide-react"; // Using lucide-react for calendar and close icons

export default function GenerateInvoiceModal({
  isOpen,
  onClose,
  initialQuote,
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: initialQuote?.customerName || "",
    emailAddress: initialQuote?.customerEmail || "",
    billingAddress: "",
    eventType: initialQuote?.eventType || "",
    eventDate: initialQuote?.dateAndTime
      ? new Date(initialQuote.dateAndTime).toISOString().split("T")[0]
      : "", // Format date for input type="date"
    invoiceDate: new Date().toISOString().split("T")[0], // Default to today
    dueDate: "",
    serviceDescription: "",
    serviceAmount: "",
    serviceCurrency: "USD",
    discountDescription: "",
    discountAmount: "",
    discountCurrency: "USD",
    subtotal: 0,
    discount: 0,
    tax: 0,
    additional: 0,
    total: 0,
    additionalNotes: "",
  });

  // Calculate totals whenever relevant formData changes
  useState(() => {
    const serviceAmt = parseFloat(formData.serviceAmount) || 0;
    const discountAmt = parseFloat(formData.discountAmount) || 0;
    const calculatedSubtotal = serviceAmt; // For simplicity, subtotal is just service amount initially
    const calculatedDiscount = discountAmt;
    const calculatedTax = calculatedSubtotal * 0.05; // Example 5% tax
    const calculatedAdditional = 0; // No additional charges for now

    setFormData((prev) => ({
      ...prev,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      tax: calculatedTax,
      additional: calculatedAdditional,
      total:
        calculatedSubtotal -
        calculatedDiscount +
        calculatedTax +
        calculatedAdditional,
    }));
  }, [formData.serviceAmount, formData.discountAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (action) => {
    console.log(`Invoice Action: ${action}`, formData);
    // In a real application, you would send this data to your backend
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-300  text-center mt-2 mb-4">
          Generate a professional invoice for your catering services
        </p>

        {/* Modal Body */}
        <div className="p-6">
          {step === 1 && (
            <>
              {/* Client Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Client Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="clientName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Client Name
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-gray-300 text-gray-300    rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Jon Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="eventType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      id="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-gray-300 text-gray-300   rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Event Type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="emailAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-gray-300 text-gray-300    rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="jonnuel@mail.com"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="eventDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      id="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border-gray-300 text-gray-300   rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <CalendarDays className="absolute right-3 top-8 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div>
                    <label
                      htmlFor="billingAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Billing Address
                    </label>
                    <input
                      type="text"
                      name="billingAddress"
                      id="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-gray-300 text-gray-300   rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123 str"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="invoiceDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      name="invoiceDate"
                      id="invoiceDate"
                      value={formData.invoiceDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border-gray-300 text-gray-300   rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <CalendarDays className="absolute right-3 top-8 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border-gray-300 text-gray-300    rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <CalendarDays className="absolute right-3 top-8 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Add-on Service (optional) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add-on Service (optional)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="serviceDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Service Description
                    </label>
                    <textarea
                      name="serviceDescription"
                      id="serviceDescription"
                      rows={3} // ensures 2-3 lines height
                      value={formData.serviceDescription}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-gray-300 text-gray-300   rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="...enter a description here"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 mb-2">
                      <label
                        htmlFor="serviceAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 ">
                          $
                        </span>
                        <input
                          type="number"
                          name="serviceAmount"
                          id="serviceAmount"
                          value={formData.serviceAmount}
                          onChange={handleChange}
                          className="w-full pl-7 pr-3 py-2 border-gray-300 text-gray-300    rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="200"
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label htmlFor="serviceCurrency" className="sr-only">
                        Currency
                      </label>
                      <select
                        name="serviceCurrency"
                        id="serviceCurrency"
                        value={formData.serviceCurrency}
                        onChange={handleChange}
                        className="px-3 py-2 border-gray-300 text-gray-300    rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-[42px]"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="NGN">NGN</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Discount (optional) */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Discount (optional)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="discountDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Discount Description
                    </label>
                    <input
                      type="text"
                      name="discountDescription"
                      id="discountDescription"
                      value={formData.discountDescription}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-gray-300 text-gray-300    rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="...enter a description here"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label
                        htmlFor="discountAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 ">
                          $
                        </span>
                        <input
                          type="number"
                          name="discountAmount"
                          id="discountAmount"
                          value={formData.discountAmount}
                          onChange={handleChange}
                          className="w-full pl-7 pr-3 py-2 border-gray-300 text-gray-300   rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="200"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="discountCurrency" className="sr-only">
                        Currency
                      </label>
                      <select
                        name="discountCurrency"
                        id="discountCurrency"
                        value={formData.discountCurrency}
                        onChange={handleChange}
                        className="px-3 py-2 border-gray-300 text-gray-300   text  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-[42px]"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="NGN">NGN</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="mb-6 bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Invoice Summary
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">
                      ${formData.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-medium">
                      -${formData.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-medium">
                      ${formData.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional:</span>
                    <span className="font-medium">
                      ${formData.additional.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200 mt-4">
                    <span>Total:</span>
                    <span>${formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Notes
                </h3>
                <textarea
                  name="additionalNotes"
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-300   rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Payment terms, special instructions, or additional details..."
                ></textarea>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200">
          {step === 1 && (
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          {step === 2 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Previous
            </button>
          )}

          {step === 1 && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Next
            </button>
          )}
          {step === 2 && (
            <div className="flex gap-4">
              <button
                onClick={() => handleSubmit("Save as Draft")}
                className="px-6 py-2 border-gray-300  text-gray-300   rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit("Send Invoice")}
                className="px-6 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Send Invoice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

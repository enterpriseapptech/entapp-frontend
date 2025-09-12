"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layouts/Header";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";
import GenerateInvoiceModal from "@/components/layouts/GenerateInvoiceModal";
import { useGetQuoteByIdQuery } from "@/redux/services/quoteApi";

export default function QuoteDetails() {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const requestId = searchParams.get("requestId") || "";

  // Fetch quote details using the API
  const {
    data: quoteData,
    isLoading,
    error,
  } = useGetQuoteByIdQuery(requestId, {
    skip: !requestId,
  });

  const [quote, setQuote] = useState({
    id: "",
    customerId: "",
    serviceId: "",
    serviceType: "EVENTCENTER" as "EVENTCENTER" | "CATERING",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      postal: "",
    },
    isTermsAccepted: false,
    isCancellationPolicyAccepted: false,
    isLiabilityWaiverSigned: false,
    source: "WEB" as "WEB" | "MOBILE",
    customerNotes: "",
    requestId: "",
    customerName: "Loading...",
    customerEmail: "Loading...",
    eventType: "Loading...",
    dateAndTime: "",
    invoiceStatus: "PENDING",
    budget: "",
    timeslotIds: [] as string[],
  });

  useEffect(() => {
    if (quoteData) {
      const timeslotIds = quoteData.requestedTimeSlots?.map(slot => slot.id) || [];
      setQuote({
        id: quoteData.id,
        customerId: quoteData.customerId,
        serviceId: quoteData.serviceId,
        serviceType:
          quoteData.serviceType === "EVENTCENTER" || quoteData.serviceType === "CATERING"
            ? quoteData.serviceType
            : "EVENTCENTER",
        billingAddress: quoteData.billingAddress,
        isTermsAccepted: quoteData.isTermsAccepted,
        isCancellationPolicyAccepted: quoteData.isCancellationPolicyAccepted,
        isLiabilityWaiverSigned: quoteData.isLiabilityWaiverSigned,
        source: quoteData.source === "WEB" || quoteData.source === "MOBILE" ? quoteData.source : "WEB",
        customerNotes: quoteData.customerNotes || "",
        requestId: quoteData.quoteReference || quoteData.id,
        customerName: "Customer Name",
        customerEmail: "customer@email.com",
        eventType: quoteData.serviceType,
        dateAndTime: quoteData.createdAt,
        invoiceStatus: quoteData.status,
        budget: quoteData.budget,
        timeslotIds: timeslotIds,
      });
    }
  }, [quoteData]);

  const handleGenerateInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventServiceSideBar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="md:ml-[280px]">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <main className="md:p-10 p-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Loading quote details...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EventServiceSideBar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="md:ml-[280px]">
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <main className="md:p-10 p-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-red-600">
                Error loading quote details. Please try again.
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventServiceSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="md:ml-[280px]">
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="md:p-10 p-4">
          <div className="rounded-lg border bg-white shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="md:text-xl text-md font-bold text-gray-950">
                  Quote Request Details
                </h1>
                <button
                  className="px-4 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  onClick={handleGenerateInvoice}
                >
                  Generate Invoice
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Event Information
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <strong>Request ID:</strong> {quote.requestId}
                    </p>
                    <p>
                      <strong>Event Type:</strong> {quote.eventType}
                    </p>
                    <p>
                      <strong>Event Date:</strong>{" "}
                      {quote.dateAndTime
                        ? new Date(quote.dateAndTime).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "Not provided"}
                    </p>
                    <p>
                      <strong>Budget Range:</strong> {quote.budget}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ml-2 ${
                          quote.invoiceStatus === "SENT" ||
                          quote.invoiceStatus === "APPROVED"
                            ? "bg-green-50 text-green-700"
                            : quote.invoiceStatus === "PENDING"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {quote.invoiceStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Client Information
                    </h2>
                    <div className="flex items-center gap-4">
                      <Image
                        src="/profileImg.png"
                        alt="Client Avatar"
                        width={50}
                        height={50}
                        className="rounded-full"
                        unoptimized
                      />
                      <div className="text-gray-600">
                        <p>
                          <strong>Name:</strong> {quote.customerName}
                        </p>
                        <p>
                          <strong>Email:</strong> {quote.customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Billing Address
                    </h2>
                    <div className="text-gray-600">
                      <p>{quote.billingAddress.street}</p>
                      <p>
                        {quote.billingAddress.city},{" "}
                        {quote.billingAddress.state}
                      </p>
                      <p>
                        {quote.billingAddress.country},{" "}
                        {quote.billingAddress.postal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Special Requirements & Notes
                </h2>
                <p className="text-gray-600">{quote.customerNotes}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Request Timeline
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="text-green-400">●</span> Request Submitted:{" "}
                    {new Date(quoteData?.createdAt || "").toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p>
                    <span className="text-blue-400">●</span> Last Updated:{" "}
                    {new Date(quoteData?.updatedAt || "").toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <GenerateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        initialQuote={quote}
        timeslotIds={quote.timeslotIds}
      />
    </div>
  );
}

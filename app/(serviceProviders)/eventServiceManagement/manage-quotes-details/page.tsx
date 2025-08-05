"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layouts/Header";
import EventServiceSideBar from "@/components/layouts/EventServiceSideBar";
import GenerateInvoiceModal from "@/components/layouts/GenerateInvoiceModal";

export default function QuoteDetails() {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [quote, setQuote] = useState({
    requestId: "",
    customerName: "",
    customerEmail: "",
    eventType: "",
    dateAndTime: "",
    invoiceStatus: "",
  });

  useEffect(() => {
    const requestId = searchParams.get("requestId") || "";
    const customerName = searchParams.get("customerName") || "";
    const customerEmail = searchParams.get("customerEmail") || "";
    const eventType = searchParams.get("eventType") || "";
    const dateAndTime = searchParams.get("dateAndTime") || "";
    const invoiceStatus = searchParams.get("invoiceStatus") || "";

    setQuote({
      requestId,
      customerName,
      customerEmail,
      eventType,
      dateAndTime,
      invoiceStatus,
    });
  }, [searchParams]);

  const handleGenerateInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

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
                  <div className="space-y-2 text-gray-400">
                    <p><strong>Request ID:</strong> {quote.requestId}</p>
                    <p><strong>Event Type:</strong> {quote.eventType}</p>
                    <p><strong>Event Date:</strong> {quote.dateAndTime}</p>
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
                      <div className="text-gray-400">
                        <p><strong>Name:</strong> {quote.customerName}</p>
                        <p><strong>Email:</strong> {quote.customerEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Request Timeline
                    </h2>
                    <div className="space-y-2 text-gray-400">
                      <p><span className="text-green-400">●</span> Request Submitted: March 15, 2025</p>
                      <p><span className="text-blue-400">●</span> Quote Generation: Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Special Requirements & Notes
                </h2>
                <p className="text-gray-600">
                  We need full-service catering for a wedding reception. The service should include appetizers, a multi-course meal, dessert, and beverage station. Options should accommodate dietary restrictions and include both local and continental dishes. The setup must be elegant with professional staff to handle serving and cleanup.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <GenerateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        initialQuote={quote}
      />
    </div>
  );
}
"use client";
import Link from "next/link";
import Image from "next/image";
import HeroWithNavbar from "@/components/layouts/HeroWithNavbar";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Footer from "@/components/layouts/Footer";
import SuccessModal from "@/components/ui/SuccessModal";

function PaymentContent() {
  const searchParams = useSearchParams();

  // Extract booking details from query parameters
  const date = searchParams.get("date") || "21 Mar, 2025";
  const time = searchParams.get("time") || "12:00 pm";
  const totalCost = searchParams.get("totalCost") || "₦500,000";

  // State to track the selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  // State to control the success modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Booking dates for the modal
  const bookingDates = [date, "27th-Feb-2024"];

  const handleBook = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method before booking.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSetAsDefault = (method: string) => {
    console.log(`${method} set as default`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-white">
      <HeroWithNavbar
        isCategoryOpen={false}
        isLocationOpen={false}
        toggleCategoryDropdown={() => {}}
        toggleLocationDropdown={() => {}}
        handleCategoryChange={() => {}}
        handleLocationChange={() => {}}
        height="400px"
        backgroundImage="url('/eventHeroImage.png')"
        heading="Event Centers"
        subheading=""
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-8">
          <nav className="text-gray-500 text-sm mb-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            {">"}{" "}
            <Link href="/event-centers-details" className="hover:underline">
              Link Two
            </Link>{" "}
            {">"}{" "}
            <Link href="/event-centers-details" className="hover:underline">
              Link Three
            </Link>{" "}
            {">"} <span className="text-gray-800">Payment</span>
          </nav>
          <Image
            src="/paymentLogo.png"
            alt="paymentLogo.png"
            width={10}
            height={10}
            className="w-10 h-10"
            unoptimized
          />
          <h2 className="text-md font-semibold text-gray-800 mb-2">Payment method</h2>
          <p className="text-gray-400 mb-4 text-sm">Update your payment details</p>
          <div className="space-y-4">
            {/* Visa */}
            <div
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${
                selectedPaymentMethod === "visa" ? "bg-[#F2F6FC]" : "bg-white"
              }`}
            >
              <div className="flex gap-3">
                <Image
                  src="/visa.png"
                  alt="Visa"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                  unoptimized
                />
                <div>
                  <p
                    className={`${
                      selectedPaymentMethod === "visa" ? "text-[#0047AB]" : "text-gray-800"
                    }`}
                  >
                    Visa ending in 1234
                  </p>
                  <p className="text-gray-500 text-sm">Expiry 06/2024</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleSetAsDefault("Visa")}
                      className={`text-sm ${
                        selectedPaymentMethod === "visa" ? "text-[#0047AB]" : "text-gray-600"
                      }`}
                    >
                      Set as default
                    </button>
                    <button
                      className={`text-sm ${
                        selectedPaymentMethod === "visa" ? "text-[#0047AB]" : "text-[#0047AB]"
                      }`}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <input
                  type="radio"
                  name="payment-method"
                  value="visa"
                  checked={selectedPaymentMethod === "visa"}
                  onChange={() => setSelectedPaymentMethod("visa")} // Use setSelectedPaymentMethod
                  className="w-4 h-4 text-[#0047AB]"
                />
              </div>
            </div>

            {/* Mastercard */}
            <div
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${
                selectedPaymentMethod === "mastercard" ? "bg-[#F2F6FC]" : "bg-white"
              }`}
            >
              <div className="flex gap-3">
                <Image
                  src="/master.png"
                  alt="Mastercard"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                  unoptimized
                />
                <div>
                  <p
                    className={`${
                      selectedPaymentMethod === "mastercard"
                        ? "text-[#0047AB]"
                        : "text-gray-800"
                    }`}
                  >
                    Mastercard ending in 1234
                  </p>
                  <p className="text-gray-500 text-sm">Expiry 06/2024</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleSetAsDefault("Mastercard")}
                      className={`text-sm ${
                        selectedPaymentMethod === "mastercard"
                          ? "text-[#0047AB]"
                          : "text-gray-600"
                      }`}
                    >
                      Set as default
                    </button>
                    <button
                      className={`text-sm ${
                        selectedPaymentMethod === "mastercard"
                          ? "text-[#0047AB]"
                          : "text-[#0047AB]"
                      }`}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <input
                  type="radio"
                  name="payment-method"
                  value="mastercard"
                  checked={selectedPaymentMethod === "mastercard"}
                  onChange={() => setSelectedPaymentMethod("mastercard")} // Use setSelectedPaymentMethod
                  className="w-4 h-4 text-[#0047AB]"
                />
              </div>
            </div>

            {/* Apple Pay */}
            <div
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${
                selectedPaymentMethod === "applepay" ? "bg-[#F2F6FC]" : "bg-white"
              }`}
            >
              <div className="flex gap-3">
                <Image
                  src="/apple.png"
                  alt="Apple Pay"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                  unoptimized
                />
                <div>
                  <p
                    className={`${
                      selectedPaymentMethod === "applepay" ? "text-[#0047AB]" : "text-gray-800"
                    }`}
                  >
                    Apple Pay ending in 1234
                  </p>
                  <p className="text-gray-500 text-sm">Expiry 06/2024</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleSetAsDefault("Apple Pay")}
                      className={`text-sm ${
                        selectedPaymentMethod === "applepay" ? "text-[#0047AB]" : "text-gray-600"
                      }`}
                    >
                      Set as default
                    </button>
                    <button
                      className={`text-sm ${
                        selectedPaymentMethod === "applepay" ? "text-[#0047AB]" : "text-[#0047AB]"
                      }`}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <input
                  type="radio"
                  name="payment-method"
                  value="applepay"
                  checked={selectedPaymentMethod === "applepay"}
                  onChange={() => setSelectedPaymentMethod("applepay")} // Use setSelectedPaymentMethod
                  className="w-4 h-4 text-[#0047AB]"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleBook}
            className="cursor-pointer w-full bg-[#0047AB] text-white py-3 rounded-md hover:bg-blue-700 transition text-lg font-semibold mt-6"
          >
            Book
          </button>
        </div>
        <aside className="lg:w-[300px] h-[45%] bg-white p-6 rounded-lg shadow-md md:mt-20">
          <Image
            src="/event.png"
            alt="Event Image"
            width={300}
            height={150}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h2 className="text-md font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Date of booking</span>
              <span className="text-gray-800 font-semibold">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Booking time</span>
              <span className="text-gray-800 font-semibold">{time}</span>
            </div>
            <hr />
            <div className="flex justify-between mt-4">
              <span className="text-gray-800 font-semibold">Total Cost</span>
              <span className="text-[#0047AB] text-sm">{totalCost}</span>
            </div>
          </div>
        </aside>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        bookingDates={bookingDates}
      />
      <Footer />
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
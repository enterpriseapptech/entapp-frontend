"use client";

import { useState } from "react";
import Header from "@/components/layouts/Header";
import ServiceProviderSideBar from "@/components/layouts/ServiceProviderSideBar";
import {
  useGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useLazyGetSubscriptionByIdQuery,
} from "@/redux/services/subscriptionApi";
import { useGetSubscriptionPlansQuery } from "@/redux/services/adminApi";
import { useGetUserByIdQuery } from "@/redux/services/authApi";
import { useGetEventCentersByServiceProviderQuery } from "@/redux/services/eventsApi";
import { useGetCateringsByServiceProviderQuery } from "@/redux/services/cateringApi";
import { Loader2, Plus, CreditCard, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import Notification from "@/components/ui/Notification";
import { getApiError } from "@/hooks/getApiError";
import SubscriptionPaymentModal from "@/components/ui/SubscriptionPaymentModal";

export default function SubscriptionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{ id: string; type: string } | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<{ id: string; amount: number } | null>(null);

  // Billing address state
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postal: "",
  });

  const userId = typeof window !== "undefined" ? (localStorage.getItem("user_id") || sessionStorage.getItem("user_id")) : null;

  const { data: userData } = useGetUserByIdQuery(userId as string, { skip: !userId });
  const { data: eventCentersData } = useGetEventCentersByServiceProviderQuery({ serviceProviderId: userId as string, limit: 100, offset: 0 }, { skip: !userId });
  const { data: cateringsData } = useGetCateringsByServiceProviderQuery({ serviceProviderId: userId as string, limit: 100, offset: 0 }, { skip: !userId });
  const { data: subscriptionsData, isLoading: isSubsLoading } = useGetSubscriptionsQuery({ limit: 10, offset: 0 });
  const [getSubscriptionDetails] = useLazyGetSubscriptionByIdQuery();
  const { data: plansData } = useGetSubscriptionPlansQuery({ limit: 100, offset: 0 });
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedService || !selectedPlanId) return;

    try {
      const response = await createSubscription({
        serviceProviderId: userId,
        serviceId: selectedService.id,
        serviceType: selectedService.type,
        type: "SUBSCRIPTIONPLANS",
        subscriptionplanId: selectedPlanId,
        billingAddress,
        currency: "NGN",
      }).unwrap();
      
      // Get the invoice from the response
      const invoice = Array.isArray(response.invoice) ? response.invoice[0] : response.invoice;
      
      if (invoice) {
        setActiveInvoice({
          id: invoice.id,
          amount: typeof invoice.amountDue === 'string' ? parseFloat(invoice.amountDue) : invoice.amountDue
        });
        setIsModalOpen(false);
        setIsPaymentModalOpen(true);
      } else {
        setNotification({ message: "Subscription created but no invoice found. Please contact support.", type: "error" });
      }
    } catch (error) {
      setNotification({ message: getApiError(error, "Failed to create subscription."), type: "error" });
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setNotification({ message: "Subscription activated successfully!", type: "success" });
    // Reset form
    setSelectedPlanId("");
    setSelectedService(null);
  };

  const services = [
    ...(eventCentersData?.data?.map((ec: { id: string; name: string }) => ({ id: ec.id, name: ec.name, type: "EVENTCENTER" })) || []),
    ...(cateringsData?.data?.map((cs: { id: string; name: string }) => ({ id: cs.id, name: cs.name, type: "CATERING" })) || []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <ServiceProviderSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="md:ml-[280px]">
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
              <p className="text-sm text-gray-500">Manage your active plans and services</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#0047AB] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Subscription</span>
            </button>
          </div>

          {isSubsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {subscriptionsData?.docs && subscriptionsData.docs.length > 0 ? (
                subscriptionsData.docs.map((sub) => (
                  <div key={sub.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-[#0047AB]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {sub.serviceName || "Premium Plan"}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              Expires on {new Date(sub.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sub.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
                        <div className="flex gap-6">
                          <div className="text-xs text-gray-400">
                            <p className="font-medium text-gray-500 uppercase tracking-wider mb-1">Created At</p>
                            <p>{new Date(sub.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-xs text-gray-400">
                            <p className="font-medium text-gray-500 uppercase tracking-wider mb-1">Service Type</p>
                            <p className="capitalize">{sub.type.replace("_", " ")}</p>
                          </div>
                        </div>

                        {sub.status === "INACTIVE" && (
                          <button
                            onClick={async () => {
                              try {
                                // Fetch full details to get the invoice
                                const details = await getSubscriptionDetails(sub.id).unwrap();
                                const inv = Array.isArray(details.invoice) ? details.invoice[0] : details.invoice;
                                
                                if (inv) {
                                  setActiveInvoice({
                                    id: inv.id,
                                    amount: typeof inv.amountDue === 'string' ? parseFloat(inv.amountDue) : inv.amountDue
                                  });
                                  setIsPaymentModalOpen(true);
                                } else {
                                  setNotification({ message: "No invoice found for this subscription. Please contact support.", type: "error" });
                                }
                              } catch (err) {
                                setNotification({ message: getApiError(err, "Failed to fetch subscription details."), type: "error" });
                              }
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Complete Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No active subscriptions</h3>
                  <p className="text-gray-500 mb-6">You haven&apos;t subscribed any of your services to a plan yet.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[#0047AB] font-medium hover:underline"
                  >
                    Subscribe your first service
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">New Subscription</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubscribe} className="p-6">
              <div className="space-y-4">
                {/* Select Service */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Service</label>
                  <select
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={selectedService?.id || ""}
                    onChange={(e) => {
                      const service = services.find(s => s.id === e.target.value);
                      if (service) setSelectedService({ id: service.id, type: service.type });
                    }}
                  >
                    <option value="" className="text-gray-500">Select a service to subscribe</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                    ))}
                  </select>
                </div>

                {/* Select Plan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Plan</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plansData?.data?.map((plan) => (
                      <label 
                        key={plan.id}
                        className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedPlanId === plan.id 
                            ? "border-[#0047AB] bg-blue-50/50 ring-1 ring-[#0047AB]" 
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          className="hidden"
                          value={plan.id}
                          checked={selectedPlanId === plan.id}
                          onChange={() => setSelectedPlanId(plan.id)}
                        />
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-gray-900">{plan.plan}</span>
                          {selectedPlanId === plan.id && <CheckCircle2 className="w-4 h-4 text-[#0047AB]" />}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-gray-900">₦{plan.amount.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">/ {plan.timeFrame} days</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Billing Address */}
                <div className="pt-2">
                  <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Billing Address
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                      value={billingAddress.street}
                      onChange={e => setBillingAddress({...billingAddress, street: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                        value={billingAddress.city}
                        onChange={e => setBillingAddress({...billingAddress, city: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        required
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                        value={billingAddress.state}
                        onChange={e => setBillingAddress({...billingAddress, state: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Postal Code"
                        required
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                        value={billingAddress.postal}
                        onChange={e => setBillingAddress({...billingAddress, postal: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        disabled
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-400 outline-none"
                        value={billingAddress.country}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-[2] bg-[#0047AB] text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Subscribe Now</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {activeInvoice && (
        <SubscriptionPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={activeInvoice.amount}
          invoiceId={activeInvoice.id}
          userId={userId}
          userEmail={userData?.email || localStorage.getItem("user_email")}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={(err) => setNotification({ message: err, type: "error" })}
        />
      )}
    </div>
  );
}

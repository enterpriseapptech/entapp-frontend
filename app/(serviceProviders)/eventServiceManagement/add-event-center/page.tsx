"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Header from "@/components/layouts/Header";
import EventServiceSideBar from "@/components/layouts/CateringServiceSideBar";
import {
  useCreateEventCenterMutation,
  CreateEventCenterRequest,
} from "../../../../redux/services/eventsApi";
import {
  useGetUserByIdQuery,
  UserType,
  ServiceType,
} from "../../../../redux/services/authApi";
import Notification from "../../../../components/ui/Notification";

const eventTypesOptions = ["Wedding", "Conference", "Birthday", "Party"];
const amenitiesOptions = [
  "WIFI",
  "SECURITY",
  "PARKINGSPACE",
  "PROJECTOR",
  "SOUND_SYSTEM",
];

const schema = z.object({
  serviceProviderId: z.string().uuid("Invalid service provider ID"),
  name: z.string().min(1, "Event center name is required"),
  eventTypes: z.array(z.string()).min(1, "At least one event type is required"),
  depositAmount: z.number().min(0, "Deposit amount must be non-negative"),
  totalAmount: z.number().min(0, "Total amount must be non-negative"),
  description: z.string().min(1, "Description is required"),
  pricingPerSlot: z.number().min(0, "Pricing per slot must be non-negative"),
  sittingCapacity: z.number().min(1, "Sitting capacity must be at least 1"),
  venueLayout: z.string().min(1, "Venue layout is required"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  termsOfUse: z.string().min(1, "Terms of use are required"),
  cancellationPolicy: z.string().min(1, "Cancellation policy is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  streetAddress2: z.string().nullable(),
  city: z.string().min(1, "City is required"),
  location: z.string().uuid("Invalid location ID"),
  contact: z.string().min(1, "Contact number is required"),
  postal: z.string().min(1, "Postal code is required"),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Status must be ACTIVE or INACTIVE" }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function AddEventCenter() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const [createEventCenter, { isLoading }] = useCreateEventCenterMutation();

  // Check authentication
  const userId =
    localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceProviderId: "",
      name: "",
      eventTypes: [],
      depositAmount: 0,
      totalAmount: 0,
      description: "",
      pricingPerSlot: 0,
      sittingCapacity: 0,
      venueLayout: "",
      amenities: [],
      termsOfUse: "",
      cancellationPolicy: "",
      streetAddress: "",
      streetAddress2: null,
      city: "",
      location: "",
      contact: "",
      postal: "",
      status: "ACTIVE",
    },
  });

  // Redirect to login if not authenticated or not a service provider
  useEffect(() => {
    if (!userId || userError) {
      router.replace("/login");
      return;
    }
    if (user) {
      if (
        user.userType !== UserType.SERVICE_PROVIDER ||
        user.serviceProvider?.serviceType !== ServiceType.EVENTCENTERS
      ) {
        setError("You are not authorized to create event centers.");
        router.replace("/login");
        return;
      }
      // Set the serviceProviderId in the form
      if (user.serviceProvider?.id) {
        setValue("serviceProviderId", user.serviceProvider.id);
      }
    }
  }, [user, userError, userId, router, setValue]);

  const selectedEventTypes = watch("eventTypes");
  const selectedAmenities = watch("amenities");

  const handleEventTypeChange = (type: string) => {
    const currentTypes = selectedEventTypes;
    setValue(
      "eventTypes",
      currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type]
    );
  };

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = selectedAmenities;
    setValue(
      "amenities",
      currentAmenities.includes(amenity)
        ? currentAmenities.filter((a) => a !== amenity)
        : [...currentAmenities, amenity]
    );
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  const handleDragOver = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    try {
      // In a real app, images would be uploaded to a storage service (e.g., S3)
      const imageUrls = images.map((file) => URL.createObjectURL(file));

      const requestData: CreateEventCenterRequest = {
        ...data,
        images: imageUrls,
      };

      await createEventCenter(requestData).unwrap();
      setSuccess("Event center created successfully!");
      setTimeout(() => {
        router.push("/eventServiceManagement/eventServiceDashboard");
      }, 2000);
    } catch (err) {
      function hasStatus(err: unknown): err is { status: number } {
        return (
          typeof err === "object" &&
          err !== null &&
          "status" in err &&
          typeof (err as { status?: unknown }).status === "number"
        );
      }

      if (hasStatus(err)) {
        if (err.status === 401) {
          setError("You are not authorized. Please log in again.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_expiry");
          localStorage.removeItem("user_id");
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("refresh_token");
          sessionStorage.removeItem("user_id");
          router.push("/login");
        } else {
          setError("Failed to create event center. Please try again.");
          console.error(err);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
        console.error(err);
      }
    }
  };

  // Show loading state while checking user authentication
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="md:text-xl text-md font-bold text-gray-950">
              Add Event Center
            </h1>
            <div className="flex gap-2">
              <Link href="/eventServiceManagement/eventServiceDashboard">
                <button className="cursor-pointer px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                form="eventCenterForm"
                disabled={isLoading}
                className="px-4 py-2 bg-[#315E9D] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>

          <form id="eventCenterForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white p-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Service Provider ID
                  </label>
                  <input
                    {...register("serviceProviderId")}
                    disabled
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="Service provider ID (auto-filled)"
                  />
                  {errors.serviceProviderId && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.serviceProviderId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter event center name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Street Address
                  </label>
                  <input
                    {...register("streetAddress")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter street address"
                  />
                  {errors.streetAddress && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.streetAddress.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Street Address 2
                  </label>
                  <input
                    {...register("streetAddress2")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter additional address (optional)"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    City
                  </label>
                  <input
                    {...register("city")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Location ID
                  </label>
                  <input
                    {...register("location")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter location ID"
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Postal Code
                  </label>
                  <input
                    {...register("postal")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter postal code"
                  />
                  {errors.postal && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.postal.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Contact Number
                  </label>
                  <input
                    {...register("contact")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter contact number"
                  />
                  {errors.contact && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.contact.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Sitting Capacity
                  </label>
                  <input
                    type="number"
                    {...register("sittingCapacity", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter sitting capacity"
                  />
                  {errors.sittingCapacity && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.sittingCapacity.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Venue Layout
                  </label>
                  <input
                    {...register("venueLayout")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter venue layout"
                  />
                  {errors.venueLayout && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.venueLayout.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Deposit Amount
                  </label>
                  <input
                    type="number"
                    {...register("depositAmount", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter deposit amount"
                  />
                  {errors.depositAmount && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.depositAmount.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    {...register("totalAmount", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter total amount"
                  />
                  {errors.totalAmount && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.totalAmount.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Pricing Per Slot
                  </label>
                  <input
                    type="number"
                    {...register("pricingPerSlot", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter pricing per slot"
                  />
                  {errors.pricingPerSlot && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.pricingPerSlot.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <hr className="w-full mt-4" />

              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Event Types
                </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedEventTypes.map((type) => (
                      <div
                        key={type}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-300"
                      >
                        <span>{type}</span>
                        <button
                          type="button"
                          onClick={() => handleEventTypeChange(type)}
                          className="text-blue-800 hover:text-blue-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {eventTypesOptions.map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedEventTypes.includes(type)}
                          onChange={() => handleEventTypeChange(type)}
                          className="form-checkbox h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.eventTypes && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.eventTypes.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Amenities
                </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedAmenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-300"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleAmenityChange(amenity)}
                          className="text-blue-800 hover:text-blue-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {amenitiesOptions.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="form-checkbox h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-600">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.amenities && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.amenities.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Description
                </h3>
                <textarea
                  {...register("description")}
                  className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 h-32"
                  placeholder="Enter description"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Terms of Use
                </h3>
                <textarea
                  {...register("termsOfUse")}
                  className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 h-32"
                  placeholder="Enter terms of use"
                />
                {errors.termsOfUse && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.termsOfUse.message}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Cancellation Policy
                </h3>
                <textarea
                  {...register("cancellationPolicy")}
                  className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 h-32"
                  placeholder="Enter cancellation policy"
                />
                {errors.cancellationPolicy && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.cancellationPolicy.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-medium text-gray-900 mb-2">
                  Image Uploads
                </h3>
                <div
                  className="border border-dashed border-gray-300 rounded-md p-6 text-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    className="px-4 py-1 text-[#1E5EFF] bg-white border border-gray-200 rounded-sm hover:bg-gray-100"
                  >
                    Add File
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Or drag and drop files
                  </p>
                  {images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Uploaded ${index}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageRemove(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
      {success && (
        <Notification
          message={success}
          type="success"
          onClose={() => setSuccess("")}
        />
      )}
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}

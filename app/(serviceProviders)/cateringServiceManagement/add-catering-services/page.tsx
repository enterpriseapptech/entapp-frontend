"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Header from "@/components/layouts/Header";
import CateringServiceSideBar from "@/components/layouts/CateringServiceSideBar";
import {
  useCreateCateringMutation,
  useUploadCateringImagesMutation,
} from "../../../../redux/services/cateringApi";
import {
  useGetUserByIdQuery,
  UserType,
  ServiceType,
} from "../../../../redux/services/authApi";
import Notification from "../../../../components/ui/Notification";

const cuisineOptions = ["Italian", "Mexican", "Indian", "Chinese", "American"];
const dishTypeOptions = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Gluten-Free",
];
const eventTypeOptions = ["Wedding", "Conference", "Birthday", "Party"];

const schema = z.object({
  serviceProviderId: z.string().uuid("Invalid service provider ID"),
  name: z.string().min(1, "Catering service name is required"),
  eventTypes: z.array(z.string()).min(1, "At least one event type is required"),
  location: z
    .array(z.string().uuid())
    .min(1, "At least one location is required"),
  tagLine: z.string().min(1, "TagLattice is required"),
  depositPercentage: z
    .number()
    .min(0, "Deposit percentage must be non-negative"),
  discountPercentage: z
    .number()
    .min(0, "Discount percentage must be non-negative"),
  startPrice: z.number().min(0, "Start price must be non-negative"),
  minCapacity: z.number().min(1, "Minimum capacity must be at least 1"),
  maxCapacity: z.number().min(1, "Maximum capacity must be at least 1"),
  cuisine: z.array(z.string()).min(1, "At least one cuisine is required"),
  description: z.string().min(1, "Description is required"),
  dishTypes: z.array(z.string()).min(1, "At least one dish type is required"),
  termsOfUse: z.string().min(1, "Terms of use are required"),
  cancellationPolicy: z.string().min(1, "Cancellation policy is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  streetAddress2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postal: z.string().min(1, "Postal code is required"),
  images: z
    .array(z.instanceof(File))
    .max(3, "Maximum 3 images allowed")
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddCatering() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const [createCatering, { isLoading: isCreating }] =
    useCreateCateringMutation();
  const [uploadCateringImages, { isLoading: isUploadingImages }] =
    useUploadCateringImagesMutation();

  // Check authentication
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId =
        localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
      setUserId(storedUserId);
    }
  }, []);
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
      location: [],
      tagLine: "",
      depositPercentage: 0,
      discountPercentage: 0,
      startPrice: 0,
      minCapacity: 0,
      maxCapacity: 0,
      cuisine: [],
      description: "",
      dishTypes: [],
      termsOfUse: "",
      cancellationPolicy: "",
      streetAddress: "",
      streetAddress2: "",
      city: "",
      postal: "",
      images: [],
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
        user.serviceProvider?.serviceType !== ServiceType.CATERING
      ) {
        setError("You are not authorized to create catering services.");
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
  const selectedCuisines = watch("cuisine");
  const selectedDishTypes = watch("dishTypes");

  const handleEventTypeChange = (type: string) => {
    const currentTypes = selectedEventTypes;
    setValue(
      "eventTypes",
      currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type]
    );
  };

  const handleCuisineChange = (cuisine: string) => {
    const currentCuisines = selectedCuisines;
    setValue(
      "cuisine",
      currentCuisines.includes(cuisine)
        ? currentCuisines.filter((c) => c !== cuisine)
        : [...currentCuisines, cuisine]
    );
  };

  const handleDishTypeChange = (dishType: string) => {
    const currentDishTypes = selectedDishTypes;
    setValue(
      "dishTypes",
      currentDishTypes.includes(dishType)
        ? currentDishTypes.filter((d) => d !== dishType)
        : [...currentDishTypes, dishType]
    );
  };

  const handleAddLocation = () => {
    if (newLocation && !locations.includes(newLocation)) {
      const updatedLocations = [...locations, newLocation];
      setLocations(updatedLocations);
      setValue("location", updatedLocations);
      setNewLocation("");
    }
  };

  const handleRemoveLocation = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
    setValue("location", updatedLocations);
  };

  const validateImage = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, and WEBP images are allowed");
    }

    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    try {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach(validateImage);
      const newFiles = [...images, ...filesArray].slice(0, 3);
      setImages(newFiles);
      setValue("images", newFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid file");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer?.files) return;
    try {
      const filesArray = Array.from(e.dataTransfer.files);
      filesArray.forEach(validateImage);
      const newFiles = [...images, ...filesArray].slice(0, 3);
      setImages(newFiles);
      setValue("images", newFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid file");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setValue("images", images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const requestData = {
        ...data,
        location: locations,
        images: [],
      };

      const catering = await createCatering(requestData).unwrap();

      if (images.length > 0) {
        try {
          await uploadCateringImages({
            cateringId: catering.id,
            images: images,
          }).unwrap();
          setSuccess("Catering service created with images successfully!");
        } catch (uploadError) {
          setError(
            "Catering service created but image upload failed. You can add images later."
          );
          console.error("Image upload error:", uploadError);
        }
      } else {
        setSuccess("Catering service created successfully!");
      }

      setTimeout(() => {
        router.push("/cateringServiceManagement/manage-catering-services");
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
          setError("Failed to create catering service. Please try again.");
          console.error(err);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
        console.error(err);
      }
    }
  };

  // Consolidated useEffect for managing image previews
  useEffect(() => {
    // Clean up previous previews
    previews.forEach((url) => URL.revokeObjectURL(url));
    // Generate new previews
    const newPreviews = images.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    // Cleanup on unmount or when images change
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

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
      <CateringServiceSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="md:ml-[280px]">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="md:p-10 p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="md:text-xl text-md font-bold text-gray-950">
              Add Catering Service
            </h1>
            <div className="flex gap-2">
              <Link href="/cateringServiceManagement/catering-dashboard">
                <button className="cursor-pointer px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                form="cateringForm"
                disabled={isCreating || isUploadingImages}
                className="px-4 py-2 bg-[#315E9D] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {isCreating || isUploadingImages ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>

          <form id="cateringForm" onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="Enter catering service name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Tagline
                  </label>
                  <input
                    {...register("tagLine")}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter a catchy tagline"
                  />
                  {errors.tagLine && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.tagLine.message}
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
                    Deposit Percentage
                  </label>
                  <input
                    type="number"
                    {...register("depositPercentage", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter deposit percentage"
                  />
                  {errors.depositPercentage && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.depositPercentage.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    {...register("discountPercentage", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter discount percentage"
                  />
                  {errors.discountPercentage && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.discountPercentage.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Starting Price
                  </label>
                  <input
                    type="number"
                    {...register("startPrice", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter starting price"
                  />
                  {errors.startPrice && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.startPrice.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Minimum Capacity
                  </label>
                  <input
                    type="number"
                    {...register("minCapacity", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter minimum capacity"
                  />
                  {errors.minCapacity && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.minCapacity.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-900 mb-1">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    {...register("maxCapacity", { valueAsNumber: true })}
                    className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter maximum capacity"
                  />
                  {errors.maxCapacity && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.maxCapacity.message}
                    </p>
                  )}
                </div>
              </div>

              <hr className="w-full mt-4" />

              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Locations
                </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {locations.map((loc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-300"
                      >
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(index)}
                          className="text-blue-800 hover:text-blue-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="flex-1 text-gray-400 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter location UUID"
                    />
                    <button
                      type="button"
                      onClick={handleAddLocation}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

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
                    {eventTypeOptions.map((type) => (
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
                  Cuisine Types
                </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCuisines.map((cuisine) => (
                      <div
                        key={cuisine}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-300"
                      >
                        <span>{cuisine}</span>
                        <button
                          type="button"
                          onClick={() => handleCuisineChange(cuisine)}
                          className="text-blue-800 hover:text-blue-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {cuisineOptions.map((cuisine) => (
                      <label key={cuisine} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCuisines.includes(cuisine)}
                          onChange={() => handleCuisineChange(cuisine)}
                          className="form-checkbox h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-600">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                  {errors.cuisine && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.cuisine.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Dish Types
                </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedDishTypes.map((dishType) => (
                      <div
                        key={dishType}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-300"
                      >
                        <span>{dishType}</span>
                        <button
                          type="button"
                          onClick={() => handleDishTypeChange(dishType)}
                          className="text-blue-800 hover:text-blue-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {dishTypeOptions.map((dishType) => (
                      <label key={dishType} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDishTypes.includes(dishType)}
                          onChange={() => handleDishTypeChange(dishType)}
                          className="form-checkbox h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-600">{dishType}</span>
                      </label>
                    ))}
                  </div>
                  {errors.dishTypes && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.dishTypes.message}
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
                  Image Uploads (Max 3 images)
                </h3>
                <div
                  className={`border border-dashed rounded-md p-6 text-center ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    disabled={images.length >= 3}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className={`px-4 py-1 text-[#1E5EFF] bg-white border border-gray-200 rounded-sm hover:bg-gray-100 ${
                      images.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={images.length >= 3}
                  >
                    Add Image
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    {images.length >= 3
                      ? "Maximum 3 images reached"
                      : "Or drag and drop files (PNG, JPG, max 5MB each)"}
                  </p>
                  {previews.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
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
                      {errors.images && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.images.message}
                        </p>
                      )}
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
// pages/add-event-center.tsx
"use client";
import { useState, ChangeEvent, FormEvent, DragEvent } from "react";
import Link from "next/link";
import SideBar from "@/components/layouts/SideBar";
import Header from "@/components/layouts/Header";

// Define the FormData interface
interface FormData {
  eventCenterName: string;
  address: string;
  capacity: string;
  location: string;
  contactDetails: string[];
  eventTypes: string[];
  amenities: string[];
  description: string;
  pricePerDay: number;
  availability: string[];
  images: File[];
}

export default function AddEventCenter() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // State to manage form inputs with typed FormData
  const [formData, setFormData] = useState<FormData>({
    eventCenterName: "",
    address: "",
    capacity: "",
    location: "",
    contactDetails: ["+1 (555) 000-0000"],
    eventTypes: [],
    amenities: [],
    description: "",
    pricePerDay: 200,
    availability: [],
    images: [],
  });

  // State for event type checkboxes
  const eventTypesOptions: string[] = [
    "Weddings",
    "Parties",
    "Conferences",
    "Lectures",
  ];
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

  // State for amenities input, selected amenities, and suggestions
  const amenitiesOptions: string[] = [
    "WiFi",
    "AC",
    "Swimming Pool",
    "Parking",
    "Catering",
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Handle input changes for form fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle event type checkbox changes
  const handleEventTypeChange = (type: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Handle amenities input change with autocomplete suggestion
  const handleAmenityInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmenityInput(value);

    // Filter suggestions based on input
    const filteredSuggestions = amenitiesOptions.filter((option) =>
      option.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(value.length > 0 ? filteredSuggestions : []);
  };

  // Handle Enter key to add amenity
  const handleAmenityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && amenityInput.trim() !== "") {
      e.preventDefault();
      const matchedOption = amenitiesOptions.find((option) =>
        option.toLowerCase().startsWith(amenityInput.toLowerCase())
      );
      const newAmenity = matchedOption || amenityInput.trim();
      if (!selectedAmenities.includes(newAmenity)) {
        setSelectedAmenities((prev) => [...prev, newAmenity]);
      }
      setAmenityInput("");
      setSuggestions([]);
    }
  };

  // Handle removing an amenity
  const handleAmenityRemove = (amenity: string) => {
    setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    if (!selectedAmenities.includes(suggestion)) {
      setSelectedAmenities((prev) => [...prev, suggestion]);
    }
    setAmenityInput("");
    setSuggestions([]);
  };

  // Handle file input change (via "Add File" button)
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    }
  };

  // Handle drag and drop events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images as File[]), ...filesArray],
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFormData: FormData = {
      ...formData,
      eventTypes: selectedEventTypes,
      amenities: selectedAmenities,
    };
    console.log("Form Data:", updatedFormData);
    // After submission, you can redirect back to the ManageEventCenter page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="md:ml-[280px]">
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Add Event Center Content */}
        <main className="md:p-10 p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="md:text-xl text-md font-bold text-gray-950">
              Add Event
            </h1>
            <div className="flex gap-2">
              <Link href="/admin/manage-event-center">
                <button className="cursor-pointer px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100">
                  Cancel
                </button>
              </Link>
              <button className="px-4 py-2 bg-[#315E9D] text-white rounded-lg hover:bg-blue-700">
                Publish
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-8">
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">
                  Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="">
                    <label className="block text-xs text-gray-900 mb-1">
                      Event Center Name
                    </label>
                    <input
                      type="text"
                      name="eventCenterName"
                      value={formData.eventCenterName}
                      onChange={handleInputChange}
                      placeholder="enter the centers' name"
                      className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div className="">
                    <label className="block text-xs text-gray-900 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="enter the centers' location"
                      className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div className="">
                    <label className="block text-xs text-gray-900 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="enter the centers' address"
                      className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div className="">
                    <label className="block text-xs text-gray-900 mb-1">
                      Contact Detail
                    </label>
                    <div className="flex items-center gap-2">
                      <select className="p-2 border border-gray-200 rounded-lg">
                        <option>US</option>
                      </select>
                      <input
                        type="text"
                        value="+1 (555) 000-0000"
                        readOnly
                        className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                      />
                    </div>
                  </div>
                  <div className="">
                    <label className="block text-xs text-gray-900 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="enter the centers' capacity"
                      className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div className="">
                    <label className="block text-xs text-gray-900 mb-1">
                      Contact Detail
                    </label>
                    <div className="flex items-center gap-2">
                      <select className="p-2 border border-gray-200 rounded-lg">
                        <option>US</option>
                      </select>
                      <input
                        type="text"
                        value="+1 (555) 000-0000"
                        readOnly
                        className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className="w-full mt-4" />
              {/* Event Type */}
              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Event Type
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
                </div>
              </div>
              {/* Amenities */}
              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Amenities
                </h3>
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={handleAmenityInputChange}
                    onKeyDown={handleAmenityKeyDown}
                    placeholder="Enter the centers' amenities (e.g., WiFi, AC)"
                    className="w-full text-gray-600 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {/* Suggestions dropdown */}
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="rounded-lg p-1">
                  <div className="flex flex-wrap gap-2">
                    {selectedAmenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded border border-blue-300"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleAmenityRemove(amenity)}
                          className="text-blue-800 hover:text-blue-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-900 mb-1">
                  Description
                </h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a description..."
                  className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1 h-32"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is a hint text to help user.
                </p>
              </div>
              {/* Image Upload */}
              <div className="mt-6">
                <h3 className="text-xs font-medium text-gray-900 mb-2">
                  Image Uploads
                </h3>
                <div
                  className="border border-dashed border-gray-300 rounded-md p-6 text-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={handleDragOver}
                >
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    multiple
                    onChange={handleFileInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="px-4 py-1 text-[#1E5EFF] bg-white border border-gray-200 rounded-sm hover:bg-gray-100"
                  >
                    Add File
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Or drag and drop files
                  </p>
                  {/* Display uploaded images (optional preview) */}
                  {formData.images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Uploaded ${index}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index),
                              }))
                            }
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
              {/* Availability and Price */}
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="">
                    <label className="block text-xs text-gray-900 mb-1">
                      Availability
                    </label>
                    <input
                      type="text"
                      placeholder="select days"
                      className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div className="">
                    <label className="block text-xs text-gray-900 mb-1">
                      Price per day
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-900">$</span>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleInputChange}
                        className="w-full text-gray-400 p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="flex justify-end gap-2 mt-4">
            <Link href="/admin/manage-event-center">
              <button className="cursor-pointer px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
            </Link>
            <button className="px-4 py-2 bg-[#315E9D] text-white rounded-lg hover:bg-blue-700">
              Publish
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
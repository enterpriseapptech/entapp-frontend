"use client";

import Header from "@/components/layouts/Header";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CateringServiceSideBar from "@/components/layouts/CateringServiceSideBar";
import { Plus, X, Trash2 } from "lucide-react";
import { useGetCateringByIdQuery } from "../../../../redux/services/cateringApi";
import {
  useCreateTimeSlotsMutation,
  useGetTimeSlotsByServiceProviderQuery,
} from "../../../../redux/services/timeslot";
import { useGetUserByIdQuery } from "../../../../redux/services/authApi";
import { useDeleteTimeSlotMutation } from "../../../../redux/services/timeslot";
import Notification from "../../../../components/ui/Notification";

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-gray-50/80 flex items-center justify-center z-50">
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-[#0047AB] border-gray-200 rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
);

export default function CateringServiceDetails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [slots, setSlots] = useState([
    { date: "", startTime: "09:00", endTime: "17:00" },
  ]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTimeSlot] = useDeleteTimeSlotMutation();
  const serviceType = "CATERING" as const;

  const searchParams = useSearchParams();
  const userId =
    localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
  const id = searchParams.get("id") || "";

  const { data: cateringService, isLoading: isCateringLoading } =
    useGetCateringByIdQuery(id, { skip: !id });

  const { data: user } = useGetUserByIdQuery(userId!, { skip: !userId });

  const {
    data: timeSlotsData,
    isLoading: isTimeSlotsLoading,
    error: timeSlotsError,
    refetch,
  } = useGetTimeSlotsByServiceProviderQuery(
    {
      serviceId: id,
      limit: 10,
      offset: 0,
    },
    { skip: !id }
  );

  const [createTimeSlots, { isLoading: isCreating }] =
    useCreateTimeSlotsMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setError("User not found. Please log in again.");
      return;
    }

    try {
      const formattedSlots = slots.map(({ date, startTime, endTime }) => {
        const start = new Date(`${date}T${startTime}:00`);
        const end = new Date(`${date}T${endTime}:00`);

        return {
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        };
      });
      const payload = {
        serviceId: id,
        serviceType,
        createdBy: user.id,
        slots: formattedSlots,
      };

      await createTimeSlots(payload).unwrap();
      await refetch();
      setSuccess("Time slots created successfully!");
      setIsModalOpen(false);
      setSlots([
        {
          startTime: "09:00",
          endTime: "17:00",
          date: "",
        },
      ]);
    } catch (err) {
      console.error("Failed to create time slots:", err);
      setError("Failed to create time slots. Please try again.");
    }
  };
  const handleOpenDeleteModal = (slotId: string) => {
    setSelectedSlotId(slotId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setSelectedSlotId(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSlotId) return;

    try {
      setIsDeleting(true);
      await deleteTimeSlot(selectedSlotId).unwrap();
      await refetch();
      setSuccess("Timeslot deleted successfully.");
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete timeslot. Try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedSlotId(null);
    }
  };

  const addSlot = () =>
    setSlots([...slots, { date: "", startTime: "09:00", endTime: "17:00" }]);

  const removeSlot = (index: number) =>
    setSlots(slots.filter((_, i) => i !== index));

  const handleSlotChange = (
    index: number,
    field: "date" | "startTime" | "endTime",
    value: string
  ) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  if (isCateringLoading) return <LoadingSpinner />;

  if (!cateringService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">
          Error loading catering service details. Please try again.
        </p>
      </div>
    );
  }

  const formattedDate = new Date(cateringService.createdAt).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );

  const formattedCuisine = cateringService.cuisine.join(", ");

  return (
    <div className="min-h-screen bg-gray-50">
      <CateringServiceSideBar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="md:ml-[280px] p-4 md:p-8">
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="max-w-7xl mx-auto">
          <div className="mb-6 mt-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {cateringService.tagLine}
            </h1>
            <p className="text-sm text-gray-500">ID: {cateringService.id}</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Service Details
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-[#0047AB] text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Timeslot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <DetailRow
                  label="Description"
                  value={cateringService.description}
                />
                <DetailRow
                  label="Location"
                  value={`${cateringService.city}, ${cateringService.state}`}
                />
                <DetailRow
                  label="Street"
                  value={`${cateringService.streetAddress}${
                    cateringService.streetAddress2
                      ? `, ${cateringService.streetAddress2}`
                      : ""
                  }`}
                />
                <DetailRow label="Postal Code" value={cateringService.postal} />
                <DetailRow label="Created At" value={formattedDate} />
              </div>
              <div className="space-y-3">
                <DetailRow
                  label="Deposit"
                  value={`$${cateringService.depositAmount.toLocaleString()}`}
                />
                <DetailRow
                  label="Start Price"
                  value={`$${cateringService.startPrice.toFixed(2)}`}
                />
                <DetailRow
                  label="Capacity"
                  value={`${cateringService.minCapacity} - ${cateringService.maxCapacity}`}
                />
                <DetailRow label="Cuisine" value={formattedCuisine} />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Time Slots
              </h2>
            </div>
            {isTimeSlotsLoading ? (
              <p className="text-sm text-gray-500">Loading time slots...</p>
            ) : timeSlotsError ? (
              <p className="text-sm text-red-500">Error loading time slots.</p>
            ) : !timeSlotsData?.data.length ? (
              <p className="text-sm text-gray-500">No time slots found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100  text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2 text-black">Date</th>
                    <th className="px-4 py-2 text-black">Start</th>
                    <th className="px-4 py-2 text-black">End</th>
                    <th className="px-4 py-2 text-black">Status</th>
                    {/* <th className="px-4 py-2 text-black">Created At</th> */}
                  </tr>
                </thead>
                <tbody>
                  {timeSlotsData.data
                    .filter((slot) => slot.isAvailable)
                    .map((slot) => (
                      <tr key={slot.id} className="border-b">
                        <td className="px-4 py-2 text-gray-600">
                          {" "}
                          {new Date(slot.startTime).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {formatTime(slot.startTime)}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {formatTime(slot.endTime)}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          <span className="text-green-600 text-xs font-medium">
                            Available
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-600 flex items-center justify-between">
                          {/* {new Date(slot.createdAt).toLocaleDateString("en-CA")} */}
                          <Trash2
                            className="h-4 w-4 text-red-500 cursor-pointer ml-4"
                            onClick={() => handleOpenDeleteModal(slot.id)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* Modal for creating time slots */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[95%] sm:w-full max-w-2xl px-4 sm:px-6 py-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Create Time Slot
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3 items-center relative"
                  >
                    <div>
                      <label className="text-sm text-gray-700">Date</label>
                      <input
                        type="date"
                        value={slot.date}
                        onChange={(e) =>
                          handleSlotChange(index, "date", e.target.value)
                        }
                        required
                        className="w-full border px-3 py-2 rounded-md text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          handleSlotChange(index, "startTime", e.target.value)
                        }
                        required
                        className="w-full border px-3 py-2 rounded-md text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">End Time</label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleSlotChange(index, "endTime", e.target.value)
                        }
                        required
                        className="w-full border px-3 py-2 rounded-md text-gray-700"
                      />
                    </div>

                    {slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        className="absolute top-0 right-0 text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSlot}
                  className="text-blue-600 text-sm font-medium"
                >
                  + Add Another Slot
                </button>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-[#0047AB] text-white rounded-md hover:bg-blue-700"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Are you sure you want to delete this time slot?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The timeslot will be permanently
              removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <Notification
          message={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

// ✅ Reusable row for service details
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center">
    <p className="w-32 text-sm font-medium text-gray-500">{label}</p>
    <p className="text-sm text-gray-900">{value}</p>
  </div>
);

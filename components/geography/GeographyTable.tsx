import { Eye, Pencil, Trash2, Power } from "lucide-react";
import type { Country, State } from "@/redux/services/adminApi";

interface GeographyTableProps {
  type: "Countries" | "States/Provinces";
  countries?: Country[];
  states?: State[];
  onViewCountryDetails?: (country: Country) => void;
  onEditCountry?: (country: Country) => void;
  onDeleteCountry?: (country: Country) => void;
  onToggleCountryStatus?: (country: Country) => void;
  onViewStateDetails?: (state: State) => void;
  onEditState?: (state: State) => void;
  onDeleteState?: (state: State) => void;
  onToggleStateStatus?: (state: State) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ deletedAt }: { deletedAt: string | null }) {
  const isActive = !deletedAt;
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default function GeographyTable({
  type,
  countries = [],
  states = [],
  onViewCountryDetails,
  onEditCountry,
  onDeleteCountry,
  onToggleCountryStatus,
  onViewStateDetails,
  onEditState,
  onDeleteState,
  onToggleStateStatus,
}: GeographyTableProps) {
  // Countries Table
  if (type === "Countries") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] lg:min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Country Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Code
              </th>
              <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {countries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 sm:px-6 py-8 sm:py-10 text-center text-sm text-gray-400"
                >
                  No countries found.
                </td>
              </tr>
            ) : (
              countries.map((country) => (
                <tr key={country.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {country.name}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {country.code}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {country.currency}{" "}
                      <span className="text-gray-400 hidden lg:inline">
                        {country.currencyCode} · {country.currencySymbol}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <StatusBadge deletedAt={country.deletedAt} />
                  </td>
                  <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {formatDate(country.updatedAt)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => onViewCountryDetails?.(country)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => onEditCountry?.(country)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => onToggleCountryStatus?.(country)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                        title="Toggle Status"
                      >
                        <Power className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => onDeleteCountry?.(country)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // States/Provinces Table
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] lg:min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              State Name
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Code
            </th>
            <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {states.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 sm:px-6 py-8 sm:py-10 text-center text-sm text-gray-400"
              >
                No states found.
              </td>
            </tr>
          ) : (
            states.map((state) => (
              <tr key={state.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {state.name}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{state.code}</span>
                </td>
                <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                  <StatusBadge deletedAt={state.deletedAt} />
                </td>
                <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {formatDate(state.updatedAt)}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => onViewStateDetails?.(state)}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => onEditState?.(state)}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => onToggleStateStatus?.(state)}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                      title="Toggle Status"
                    >
                      <Power className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => onDeleteState?.(state)}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

import { Eye } from "lucide-react";
import type { User, UserStatus } from "@/redux/services/adminApi";

interface ProviderTableProps {
  providers: User[];
  onViewDetails: (provider: User) => void;
}

const getStatusColor = (status: UserStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-50 text-green-700 border-green-200";
    case "INACTIVE":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "SUSPENDED":
      return "bg-red-50 text-red-700 border-red-200";
  }
};

const getEmailVerifiedColor = (verified: boolean): string =>
  verified
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-orange-50 text-orange-700 border-orange-200";

export default function ProviderTable({
  providers,
  onViewDetails,
}: ProviderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Verified
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Location
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Registered
            </th>
            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {providers.map((provider) => (
            <tr
              key={provider.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {provider.firstName} {provider.lastName}
                </div>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <div className="text-xs md:text-sm text-gray-600 max-w-[160px] truncate">
                  {provider.email}
                </div>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                    provider.status
                  )}`}
                >
                  {provider.status}
                </span>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getEmailVerifiedColor(
                    provider.isEmailVerified
                  )}`}
                >
                  {provider.isEmailVerified ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-xs md:text-sm text-gray-600">
                  {[provider.city, provider.state, provider.country]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </div>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap hidden sm:table-cell">
                <div className="text-xs md:text-sm text-gray-600">
                  {new Date(provider.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <button
                  onClick={() => onViewDetails(provider)}
                  className="p-1.5 md:p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

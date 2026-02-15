import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-5 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 font-medium mb-0.5 truncate">
            {title}
          </p>
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
            {value}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate hidden sm:block">
            {subtitle}
          </p>
        </div>
        <div className={`p-2 md:p-3 rounded-lg flex-shrink-0 ${iconBgColor}`}>
          <Icon className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

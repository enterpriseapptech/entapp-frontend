export default function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
}
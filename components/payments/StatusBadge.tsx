interface StatusBadgeProps {
  status: 'Requested' | 'Approved' | 'Processing' | 'Declined';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Requested':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Declined':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
}

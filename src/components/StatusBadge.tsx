export default function StatusBadge({
  status,
}: {
  status: string;
}) {
  const colors: Record<string, string> = {
    admitted: 'bg-yellow-100 text-yellow-800',
    outpatient: 'bg-blue-100 text-blue-800',
    discharged: 'bg-gray-100 text-gray-700',
    available: 'bg-green-100 text-green-800',
    unavailable: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
}
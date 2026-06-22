interface StatCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
}

export default function StatCard({
  label,
  value,
  sublabel,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
      <p className="text-gray-500 text-sm font-medium">
        {label}
      </p>

      <p className="text-4xl font-bold text-blue-600 mt-2">
        {value}
      </p>

      {sublabel && (
        <p className="text-gray-400 text-sm mt-2">
          {sublabel}
        </p>
      )}
    </div>
  );
}
type KnownStatus =
  | 'admitted' | 'discharged' | 'outpatient'
  | 'available' | 'on-leave' | 'in-surgery'
  | 'scheduled' | 'completed' | 'cancelled'
  | 'waiting' | 'called' | 'emergency';

const STATUS_STYLES: Record<KnownStatus, string> = {
  admitted: 'bg-amber-50 text-amber-800 border-amber-200',
  outpatient: 'bg-teal-50 text-teal-800 border-teal-200',
  discharged: 'bg-gray-100 text-gray-600 border-gray-200',
  available: 'bg-green-50 text-green-800 border-green-200',
  'in-surgery': 'bg-red-50 text-red-800 border-red-200',
  'on-leave': 'bg-gray-100 text-gray-600 border-gray-200',
  scheduled: 'bg-teal-50 text-teal-800 border-teal-200',
  completed: 'bg-green-50 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  waiting: 'bg-gray-100 text-gray-600 border-gray-200',
  called: 'bg-teal-50 text-teal-800 border-teal-200',
  emergency: 'bg-red-50 text-red-800 border-red-200',
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status as KnownStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {status}
    </span>
  );
}
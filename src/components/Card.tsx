export default function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {children}
    </div>
  );
}
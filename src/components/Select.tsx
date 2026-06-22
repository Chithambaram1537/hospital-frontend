interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  error,
}: SelectProps) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full
          px-4
          py-3
          rounded-xl
          border
          bg-white
          shadow-sm
          transition-all
          duration-200
          focus:outline-none
          focus:ring-4
          ${
            error
              ? "border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
          }
        `}
      >
        <option value="">Select...</option>

        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
          >
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  min?: string;
}

export default function Input({ label, value, onChange, type = 'text', placeholder, error, min }: InputProps)  {
  return (
    <div className="mb-5 w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        min={min}
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
      />

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
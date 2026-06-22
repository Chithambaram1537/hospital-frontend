interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
}: ButtonProps) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl
        font-medium
        transition-all duration-200
        hover:-translate-y-0.5
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
      `}
    >
      {children}
    </button>
  );
}
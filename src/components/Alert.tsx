interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export default function Alert({ variant, children }: AlertProps) {
  return <div className={`${styles[variant]} border rounded-lg px-4 py-3 text-sm`}>{children}</div>;
}
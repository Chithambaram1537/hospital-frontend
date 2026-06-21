import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Button from './Button';


export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-primary">
            Hospital MS
          </span>

          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-primary"
          >
            Dashboard
          </Link>

          <Link
            to="/patients"
            className="text-gray-600 hover:text-primary"
          >
            Patients
          </Link>
          <Link to="/doctors" className="text-gray-600 hover:text-primary">Doctors</Link>

          <Link to="/appointments" className="text-gray-600 hover:text-primary">
  Appointments
</Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {user?.name}
          </span>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </nav>

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
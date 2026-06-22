import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Button from './Button';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItem = (path: string, label: string) => (
    <Link
      to={path}
      className={`block px-4 py-3 rounded-lg transition ${
        location.pathname.startsWith(path)
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  );

  return (
<div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">
            Hospital MS
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Management System
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItem('/dashboard', 'Dashboard')}
          {navItem('/patients', 'Patients')}
          {navItem('/doctors', 'Doctors')}
          {navItem('/appointments', 'Appointments')}
        </nav>

        <div className="p-4 border-t">
          <p className="text-sm text-gray-500 mb-3">
            {user?.name}
          </p>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
  <div className="max-w-7xl mx-auto p-8">
    {children}
  </div>
</main>
    </div>
  );
}
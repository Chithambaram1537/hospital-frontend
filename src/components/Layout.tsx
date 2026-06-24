import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Users, Stethoscope, Calendar, History, User as UserIcon, Plus } from 'lucide-react';import { useAuth } from '../store/AuthContext';
import Button from './Button';

const STAFF_NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/queue', label: 'Queue', icon: ListOrdered },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
];

const PATIENT_NAV_ITEMS = [
  { to: '/my/book', label: 'Book appointment', icon: Plus },
  { to: '/my/appointments', label: 'My appointments', icon: Calendar },
  { to: '/my/visits', label: 'Visit history', icon: History },
  { to: '/my/profile', label: 'My profile', icon: UserIcon },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItems = user?.role === 'patient' ? PATIENT_NAV_ITEMS : STAFF_NAV_ITEMS;
  const currentLabel = navItems.find((item) => location.pathname.startsWith(item.to))?.label ?? '';

  return (
    <div className="min-h-screen flex bg-surface">
      {isMenuOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setIsMenuOpen(false)} />}

      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 transition-transform duration-200 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-semibold text-primary">Hospital MS</span>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium border-l-4 transition ${active ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize mb-3">{user?.role}</p>
          <Button variant="secondary" size="sm" fullWidth onClick={handleLogout}>Logout</Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 gap-3">
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900" aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h2 className="text-base font-semibold text-gray-900">{currentLabel}</h2>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
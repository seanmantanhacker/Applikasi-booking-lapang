// ============================================================
// JIOS — Admin Sidebar
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, List, LogOut, X } from 'lucide-react';
import JiosLogo from '../JiosLogo';
import { signOut } from '../../services/authService';

interface AdminSidebarProps {
  onClose?: () => void;
}

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
  { to: '/admin/schedule', label: 'Schedule', icon: <CalendarDays className="w-5 h-5" />, end: false },
  { to: '/admin/bookings', label: 'All Bookings', icon: <List className="w-5 h-5" />, end: false },
];

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="flex flex-col h-full bg-navy text-cream-300 w-64">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-cream-200/10">
        <JiosLogo variant="light" size="sm" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-cream-500 bg-cream-200/10 px-2 py-0.5 rounded-full">
            Admin
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg hover:bg-cream-200/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-caramel text-cream-100 shadow-soft'
                : 'text-cream-400 hover:bg-cream-200/10 hover:text-cream-200'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cream-200/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
                     text-cream-500 hover:text-red-400 hover:bg-red-900/20 transition-all duration-150"
          id="admin-signout-btn"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

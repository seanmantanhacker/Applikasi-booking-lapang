// ============================================================
// JIOS — Admin Layout
// ============================================================

import { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import JiosLogo from '../components/JiosLogo';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-cream-200 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-navy/50 backdrop-blur-soft"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-cream-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-navy hover:bg-cream-200 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {title && (
              <h1 className="font-serif text-navy text-lg">{title}</h1>
            )}
          </div>
          <JiosLogo variant="dark" size="sm" />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}

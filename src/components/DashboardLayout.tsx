import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Inbox, Star, Crosshair, CheckCircle2, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import CursorGlow from '@/components/CursorGlow';
import OceanBackground from '@/components/OceanBackground';

const navItems = [
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/priority', label: 'Priority', icon: Star },
  { to: '/today', label: 'Today Focus', icon: Crosshair },
  { to: '/completed', label: 'Completed', icon: CheckCircle2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Background Image - behind everything, darker in dark mode */}
      <img 
        src="/bg.jpg" 
        alt="Background" 
        className="fixed inset-0 w-full h-full object-cover pointer-events-none dark:opacity-20 opacity-30"
        style={{ zIndex: -2 }}
      />
      {/* Simple Ocean Background - above bg.jpg, below content */}
      <div style={{ zIndex: -1 }}>
        <OceanBackground />
      </div>
      {/* Strong overlay to make UI clear - especially in dark mode */}
      <div className="fixed inset-0 bg-background/85 dark:bg-background/90 z-0 pointer-events-none" />
      <div className="relative z-10 min-h-screen flex w-full">
        <CursorGlow />
      {/* Mobile menu toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass-panel rounded-xl p-2"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -280 }}
            className="fixed lg:sticky top-0 left-0 h-screen w-[260px] z-40 bg-secondary/80 backdrop-blur-xl border-r border-border/50 flex flex-col py-6 px-4"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-3 mb-8">
              <div className="w-10 h-10 rounded-xl gradient-ocean flex items-center justify-center glow-primary">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Life<span className="text-gradient-ocean">OS</span>
              </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'gradient-ocean text-primary-foreground glow-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl gradient-ocean -z-10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all w-full"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={async () => await logout()}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-0 min-h-screen relative z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
      </div>
    </div>
  );
}

import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Receipt,
  TrendingUp,
  Users,
  UserCog,
  BarChart3,
  Settings,
  ChefHat,
  LogOut,
  X,
  Store,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'menu'
  | 'expenses'
  | 'profit'
  | 'customers'
  | 'staff'
  | 'reports'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  ordersCount: number;
  expensesCount: number;
  isRestaurantOpen: boolean;
  onExitMode: () => void;
  onNavigateToKitchen?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  ordersCount,
  expensesCount,
  isRestaurantOpen,
  onExitMode,
  onNavigateToKitchen,
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: ShoppingBag, badge: ordersCount, badgeColor: 'bg-emerald-500 text-neutral-950' },
    { id: 'menu', label: 'Menu & Availability', icon: UtensilsCrossed },
    { id: 'expenses', label: 'Expense Tracker', icon: Receipt, badge: expensesCount, badgeColor: 'bg-amber-400 text-neutral-950' },
    { id: 'profit', label: 'Profit & Margins', icon: TrendingUp },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'staff', label: 'Staff Management', icon: UserCog },
    { id: 'reports', label: 'Analytics Reports', icon: BarChart3 },
    { id: 'settings', label: 'Business Settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 border-r border-neutral-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" variant="light" />
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Live Operational Status Indicator */}
      <div className="px-5 py-3 bg-neutral-900/60 border-b border-neutral-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isRestaurantOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="font-bold text-neutral-300">
            {isRestaurantOpen ? 'Fryway: Live Open' : 'Fryway: Closed'}
          </span>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400">
          Bahria Town
        </span>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-neutral-500">
          Management Console
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-400 text-neutral-950 font-black shadow-lg shadow-amber-400/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-950 stroke-[2.5]' : 'text-neutral-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    isActive ? 'bg-neutral-950 text-amber-300' : item.badgeColor || 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Switcher & Lock */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/40 space-y-2">
        <button
          onClick={onNavigateToKitchen || (() => {
            window.location.pathname = '/kitchen';
          })}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-bold transition-all border border-amber-400/20"
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Switch to Kitchen KDS</span>
        </button>

        <button
          onClick={onExitMode}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-bold transition-all border border-rose-900/50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock / Exit Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-20">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

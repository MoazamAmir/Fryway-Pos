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
  ExternalLink,
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
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders Management',
      icon: ShoppingBag,
      badge: ordersCount,
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    },
    { id: 'menu', label: 'Menu & Availability', icon: UtensilsCrossed },
    {
      id: 'expenses',
      label: 'Expense Tracker',
      icon: Receipt,
      badge: expensesCount,
      badgeColor: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
    },
    { id: 'profit', label: 'Profit & Margins', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reports', label: 'Analytics Reports', icon: BarChart3 },
    { id: 'staff', label: 'Staff Management', icon: UserCog },
    { id: 'settings', label: 'Business Settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full backdrop-blur-2xl bg-neutral-950/85 text-white border-r border-white/10 shadow-2xl select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <BrandLogo size="md" variant="light" />
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Operational Status Banner */}
      <div className="px-5 py-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRestaurantOpen ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-rose-500'
            }`}
          />
          <span className="font-bold text-neutral-200">
            {isRestaurantOpen ? 'Store: Live Open' : 'Store: Paused'}
          </span>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-emerald-300 shadow-2xs">
          Bahria Town
        </span>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-neutral-400">
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-extrabold shadow-lg shadow-emerald-950/40 border border-emerald-400/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-amber-300 stroke-[2.5]' : 'text-neutral-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Link to Kitchen Display System */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-neutral-400">
            Operations
          </div>
          <button
            onClick={() => {
              if (onNavigateToKitchen) onNavigateToKitchen();
              else window.location.pathname = '/kitchen';
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-950/50 transition-colors cursor-pointer border border-emerald-500/20"
          >
            <div className="flex items-center gap-2.5">
              <ChefHat className="w-4 h-4 text-emerald-400" />
              <span>Kitchen Display (KDS)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Footer: User Role & Logout */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 border border-emerald-400/30">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-black text-white truncate">Store Owner</div>
              <div className="text-[10px] font-semibold text-neutral-400 truncate">Administrator</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400 shrink-0" title="Authenticated" />
        </div>

        <button
          onClick={onExitMode}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-950/40 border border-rose-500/30 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock & Exit Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

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
    <div className="flex flex-col h-full bg-white text-neutral-900 border-r border-neutral-200/90 shadow-sm select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <BrandLogo size="md" variant="dark" />
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Operational Status Banner */}
      <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRestaurantOpen ? 'bg-emerald-600 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className="font-bold text-neutral-800">
            {isRestaurantOpen ? 'Store: Live Open' : 'Store: Paused'}
          </span>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600 shadow-2xs">
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
                  ? 'bg-emerald-800 text-white font-extrabold shadow-md shadow-emerald-950/15'
                  : 'text-neutral-600 hover:text-emerald-900 hover:bg-emerald-50/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-amber-300 stroke-[2.5]' : 'text-neutral-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Link to Kitchen Display System */}
        <div className="pt-4 mt-4 border-t border-neutral-100">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-neutral-400">
            Operations
          </div>
          <button
            onClick={() => {
              if (onNavigateToKitchen) onNavigateToKitchen();
              else window.location.pathname = '/kitchen';
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer border border-emerald-200/60"
          >
            <div className="flex items-center gap-2.5">
              <ChefHat className="w-4 h-4 text-emerald-800" />
              <span>Kitchen Display (KDS)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Footer: User Role & Logout */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50/70">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-black text-neutral-900 truncate">Store Owner</div>
              <div className="text-[10px] font-semibold text-neutral-500 truncate">Administrator</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" title="Authenticated" />
        </div>

        <button
          onClick={onExitMode}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
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

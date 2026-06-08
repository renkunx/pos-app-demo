import { Home, FileText, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import type { UserRole } from '@/types';

const tabs = [
  { key: 'home' as const, label: '首页', icon: Home, roles: ['admin', 'operator'] as UserRole[] },
  { key: 'orders' as const, label: '订单', icon: FileText, roles: ['admin', 'operator'] as UserRole[] },
  { key: 'profile' as const, label: '我的', icon: User, roles: ['system_admin', 'admin', 'operator'] as UserRole[] },
];

export function BottomNav() {
  const user = useAuthStore((s) => s.user);
  const currentScreen = useUiStore((s) => s.currentScreen);
  const activeTab = useUiStore((s) => s.activeTab);
  const setTab = useUiStore((s) => s.setTab);

  const isFullScreen = currentScreen === 'payment_loading' || currentScreen === 'payment_result' || currentScreen === 'login';

  if (isFullScreen) return null;

  const visibleTabs = tabs.filter((tab) => user && tab.roles.includes(user.role));

  return (
    <nav className="shrink-0 h-16 bg-white border-t border-black/5 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] z-50 relative flex items-center justify-around select-none">
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className="flex flex-col items-center justify-center gap-0.5 w-20 h-full transition-colors duration-200"
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.5}
              className={`transition-colors duration-200 ${
                isActive ? 'text-[var(--pos-accent-primary)]' : 'text-[var(--pos-text-secondary)]'
              }`}
            />
            <span
              className={`text-[11px] font-medium transition-colors duration-200 ${
                isActive ? 'text-[var(--pos-accent-primary)]' : 'text-[var(--pos-text-secondary)]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

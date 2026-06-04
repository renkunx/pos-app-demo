import { Home, FileText, User } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const tabs = [
  { key: 'home' as const, label: '首页', icon: Home },
  { key: 'orders' as const, label: '订单', icon: FileText },
  { key: 'profile' as const, label: '我的', icon: User },
];

export function BottomNav() {
  const { state, dispatch } = useAppState();

  // Hide nav on payment screens
  if (state.currentScreen === 'payment_loading' || state.currentScreen === 'payment_result' || state.currentScreen === 'order_detail') {
    return null;
  }

  return (
    <nav className="shrink-0 h-16 bg-white border-t border-black/5 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] z-50 relative flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const isActive = state.activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => dispatch({ type: 'SET_TAB', tab: tab.key })}
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

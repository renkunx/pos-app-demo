import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { BottomNav } from '@/components/pos/BottomNav';
import { ActionSheet } from '@/components/pos/ActionSheet';
import { Toast } from '@/components/pos/Toast';
import { HomeScreen } from '@/pages/pos/HomeScreen';
import { OrdersScreen } from '@/pages/pos/OrdersScreen';
import { ProfileScreen } from '@/pages/pos/ProfileScreen';
import { PaymentLoadingScreen } from '@/pages/pos/PaymentLoadingScreen';
import { PaymentResultScreen } from '@/pages/pos/PaymentResultScreen';
import { LoginScreen } from '@/pages/LoginScreen';
import './App.css';

function getAllowedScreens(role: string) {
  return role === 'system_admin'
    ? ['profile', 'payment_loading', 'payment_result']
    : ['home', 'orders', 'profile', 'payment_loading', 'payment_result'];
}

function AppContent() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const currentScreen = useUiStore((s) => s.currentScreen);
  const setTab = useUiStore((s) => s.setTab);

  // 刷新后 auth 已持久化恢复，但 uiStore 的 currentScreen 仍为默认 'login'，需同步
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const allowed = getAllowedScreens(user.role);
    if (!allowed.includes(currentScreen)) {
      setTab(user.role === 'system_admin' ? 'profile' : 'home');
    }
  }, [isLoggedIn, user, currentScreen, setTab]);

  // 未登录 → 登录页
  if (!isLoggedIn || !user) {
    return (
      <div className="h-screen w-full bg-neutral-900 flex justify-center items-center p-0 md:p-4">
        <div className="w-full max-w-[430px] h-[100dvh] md:h-[850px] bg-[var(--pos-bg-primary)] rounded-none overflow-hidden shadow-2xl relative isolate flex flex-col">
          <LoginScreen />
        </div>
      </div>
    );
  }

  const allowedScreens = getAllowedScreens(user.role);
  const effectiveScreen = allowedScreens.includes(currentScreen) ? currentScreen : 'profile';

  const renderScreen = () => {
    switch (effectiveScreen) {
      case 'home':
        return <HomeScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'payment_loading':
        return <PaymentLoadingScreen />;
      case 'payment_result':
        return <PaymentResultScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // 全屏页面
  const isFullScreen = effectiveScreen === 'payment_loading' || effectiveScreen === 'payment_result' || effectiveScreen === 'login';

  return (
    <div className="h-screen w-full bg-neutral-900 flex justify-center items-center p-0 md:p-4">
      <div className="w-full max-w-[430px] h-[100dvh] md:h-[850px] bg-[var(--pos-bg-primary)] rounded-none overflow-hidden shadow-2xl relative isolate flex flex-col">
        {isFullScreen ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderScreen()}
          </div>
        ) : (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              {renderScreen()}
            </div>
            <BottomNav />
          </>
        )}

        {/* Overlays */}
        <ActionSheet />
        <Toast />
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

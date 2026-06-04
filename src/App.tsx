import { AppProvider, useAppState } from '@/hooks/useAppState';
import { BottomNav } from '@/components/pos/BottomNav';
import { ActionSheet } from '@/components/pos/ActionSheet';
import { Toast } from '@/components/pos/Toast';
import { HomeScreen } from '@/pages/pos/HomeScreen';
import { OrdersScreen } from '@/pages/pos/OrdersScreen';
import { ProfileScreen } from '@/pages/pos/ProfileScreen';
import { PaymentLoadingScreen } from '@/pages/pos/PaymentLoadingScreen';
import { PaymentResultScreen } from '@/pages/pos/PaymentResultScreen';
import './App.css';

function AppContent() {
  const { state } = useAppState();

  const renderScreen = () => {
    switch (state.currentScreen) {
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

  // Full-screen pages (payment flow) don't use the standard layout
  const isFullScreen = state.currentScreen === 'payment_loading' || state.currentScreen === 'payment_result';

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
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

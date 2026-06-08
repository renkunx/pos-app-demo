import { create } from 'zustand';
import type { OrderDateFilter, ScreenName } from '@/types';

interface UiState {
  currentScreen: ScreenName;
  activeTab: 'home' | 'orders' | 'profile';
  isActionSheetOpen: boolean;
  actionSheetType: string | null;
  selectedOrderId: string | null;
  orderDateFilter: OrderDateFilter | null;
  toast: { message: string; visible: boolean } | null;

  navigate: (screen: ScreenName) => void;
  setTab: (tab: 'home' | 'orders' | 'profile') => void;
  openActionSheet: (sheetType: string) => void;
  closeActionSheet: () => void;
  selectOrder: (orderId: string) => void;
  setOrderDateFilter: (filter: OrderDateFilter) => void;
  clearOrderDateFilter: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiState>()((set) => ({
  currentScreen: 'login',
  activeTab: 'home',
  isActionSheetOpen: false,
  actionSheetType: null,
  selectedOrderId: null,
  orderDateFilter: null,
  toast: null,

  navigate: (screen) => set({ currentScreen: screen }),

  setTab: (tab) => {
    const screenMap = { home: 'home', orders: 'orders', profile: 'profile' };
    set({ activeTab: tab, currentScreen: screenMap[tab] as ScreenName });
  },

  openActionSheet: (sheetType) =>
    set({ isActionSheetOpen: true, actionSheetType: sheetType }),

  closeActionSheet: () =>
    set({ isActionSheetOpen: false, actionSheetType: null }),

  selectOrder: (orderId) => set({ selectedOrderId: orderId }),

  setOrderDateFilter: (filter) => set({ orderDateFilter: filter }),

  clearOrderDateFilter: () => set({ orderDateFilter: null }),

  showToast: (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, visible: true } });
    toastTimer = setTimeout(() => {
      set({ toast: null });
    }, 2000);
  },

  hideToast: () => set({ toast: null }),
}));

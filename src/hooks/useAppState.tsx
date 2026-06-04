import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import type { AppState, AppAction, Transaction } from '@/types';

const initialTransactions: Transaction[] = [
  {
    id: '1',
    orderNo: '202406030001',
    type: 'payment',
    amount: 88.00,
    paymentMethod: 'scan',
    status: 'success',
    time: '14:32',
    referenceNo: 'REF001',
    voucherNo: 'VC001',
  },
  {
    id: '2',
    orderNo: '202406030002',
    type: 'refund',
    amount: 120.00,
    paymentMethod: 'card',
    status: 'success',
    time: '14:25',
    referenceNo: 'REF002',
    voucherNo: 'VC002',
  },
  {
    id: '3',
    orderNo: '202406030003',
    type: 'payment',
    amount: 256.00,
    paymentMethod: 'card',
    status: 'fail',
    time: '13:48',
    referenceNo: 'REF003',
    voucherNo: 'VC003',
  },
  {
    id: '4',
    orderNo: '202406030004',
    type: 'payment',
    amount: 35.50,
    paymentMethod: 'scan',
    status: 'success',
    time: '12:15',
    referenceNo: 'REF004',
    voucherNo: 'VC004',
  },
  {
    id: '5',
    orderNo: '202406030005',
    type: 'payment',
    amount: 168.00,
    paymentMethod: 'auto',
    status: 'success',
    time: '11:30',
    referenceNo: 'REF005',
    voucherNo: 'VC005',
  },
  {
    id: '6',
    orderNo: '202406030006',
    type: 'refund',
    amount: 45.00,
    paymentMethod: 'scan',
    status: 'success',
    time: '10:55',
    referenceNo: 'REF006',
    voucherNo: 'VC006',
  },
  {
    id: '7',
    orderNo: '202406030007',
    type: 'payment',
    amount: 520.00,
    paymentMethod: 'card',
    status: 'success',
    time: '09:20',
    referenceNo: 'REF007',
    voucherNo: 'VC007',
  },
  {
    id: '8',
    orderNo: '202406030008',
    type: 'payment',
    amount: 12.00,
    paymentMethod: 'scan',
    status: 'success',
    time: '08:45',
    referenceNo: 'REF008',
    voucherNo: 'VC008',
  },
];

const initialState: AppState = {
  currentScreen: 'home',
  activeTab: 'home',
  amount: '0',
  selectedPaymentMethod: 'card',
  paymentStatus: 'success',
  lastTransaction: null,
  transactions: initialTransactions,
  terminal: {
    merchantName: '极速零售',
    merchantNo: 'M88001234',
    terminalNo: 'T20240601',
    operator: '王磊',
    isSignedIn: true,
    isCheckedIn: true,
    networkOnline: true,
    keyStatus: 'online',
    deviceServiceStatus: 'online',
    devices: [
      { name: '打印机', status: 'online', detail: '剩余60%' },
      { name: '读卡器', status: 'online' },
      { name: 'PINPad', status: 'online' },
      { name: '扫码器', status: 'online' },
      { name: '网络', status: 'online', detail: 'WiFi' },
    ],
    appVersion: '3.2.1',
    configVersion: 'v2.8.0',
  },
  isActionSheetOpen: false,
  actionSheetType: null,
  selectedOrderId: null,
  toast: null,
  quickAmounts: [10, 20, 50, 100],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentScreen: action.screen };
    case 'SET_TAB': {
      const screenMap = { home: 'home', orders: 'orders', profile: 'profile' };
      return { ...state, activeTab: action.tab, currentScreen: screenMap[action.tab] as AppState['currentScreen'] };
    }
    case 'SET_AMOUNT':
      return { ...state, amount: action.amount };
    case 'APPEND_DIGIT': {
      const digit = action.digit;
      let current = state.amount;
      if (current === '0' && digit !== '.') {
        current = digit;
      } else if (digit === '.' && current.includes('.')) {
        // do nothing
      } else if (current.includes('.')) {
        const [, decimal] = current.split('.');
        if (decimal && decimal.length >= 2) {
          // do nothing
        } else {
          current = current + digit;
        }
      } else {
        if (current.length >= 8) {
          // max length
        } else {
          current = current + digit;
        }
      }
      return { ...state, amount: current };
    }
    case 'BACKSPACE': {
      let current = state.amount;
      if (current.length === 1) {
        current = '0';
      } else {
        current = current.slice(0, -1);
      }
      return { ...state, amount: current };
    }
    case 'CLEAR_AMOUNT':
      return { ...state, amount: '0' };
    case 'SET_PAYMENT_METHOD':
      return { ...state, selectedPaymentMethod: action.method };
    case 'START_PAYMENT':
      return { ...state, currentScreen: 'payment_loading', paymentStatus: 'pending' };
    case 'SET_PAYMENT_STATUS': {
      const newState = { ...state, paymentStatus: action.status };
      if (action.transaction) {
        newState.lastTransaction = action.transaction;
        newState.transactions = [action.transaction, ...state.transactions];
      }
      return newState;
    }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.transaction, ...state.transactions] };
    case 'OPEN_ACTION_SHEET':
      return { ...state, isActionSheetOpen: true, actionSheetType: action.sheetType };
    case 'CLOSE_ACTION_SHEET':
      return { ...state, isActionSheetOpen: false, actionSheetType: null };
    case 'SELECT_ORDER':
      return { ...state, selectedOrderId: action.orderId };
    case 'SHOW_TOAST':
      return { ...state, toast: { message: action.message, visible: true } };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'RESET_HOME':
      return { ...state, currentScreen: 'home', activeTab: 'home', amount: '0', paymentStatus: 'success', lastTransaction: null };
    case 'REFUND_ORDER': {
      const orderId = action.orderId;
      const updatedTransactions = state.transactions.map((t) => {
        if (t.id === orderId) {
          return { ...t, type: 'refund' as const, status: 'success' as const };
        }
        return t;
      });
      return { ...state, transactions: updatedTransactions };
    }
    case 'UPDATE_TERMINAL':
      return { ...state, terminal: { ...state.terminal, ...action.partial } };
    case 'UPDATE_QUICK_AMOUNTS':
      return { ...state, quickAmounts: action.amounts };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

// Hook for auto-hiding toast
export function useAutoToast() {
  const { state, dispatch } = useAppState();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    dispatch({ type: 'SHOW_TOAST', message });
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 2000);
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast: state.toast, showToast };
}

export type ScreenName = 'home' | 'orders' | 'profile' | 'payment_loading' | 'payment_result' | 'order_detail';

export type PaymentMethod = 'card' | 'scan' | 'auto';

export type PaymentStatus = 'success' | 'fail' | 'pending';

export type TransactionType = 'payment' | 'refund';

export type DeviceStatus = 'online' | 'offline' | 'warning';

export interface Transaction {
  id: string;
  orderNo: string;
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  time: string;
  referenceNo?: string;
  voucherNo?: string;
}

export interface DeviceInfo {
  name: string;
  status: DeviceStatus;
  detail?: string;
}

export interface TerminalState {
  merchantName: string;
  merchantNo: string;
  terminalNo: string;
  operator: string;
  isSignedIn: boolean;
  isCheckedIn: boolean;
  networkOnline: boolean;
  keyStatus: DeviceStatus;
  deviceServiceStatus: DeviceStatus;
  devices: DeviceInfo[];
  appVersion: string;
  configVersion: string;
}

export interface AppState {
  currentScreen: ScreenName;
  activeTab: 'home' | 'orders' | 'profile';
  amount: string;
  selectedPaymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  lastTransaction: Transaction | null;
  transactions: Transaction[];
  terminal: TerminalState;
  isActionSheetOpen: boolean;
  actionSheetType: string | null;
  selectedOrderId: string | null;
  toast: { message: string; visible: boolean } | null;
  quickAmounts: number[];
}

export type AppAction =
  | { type: 'NAVIGATE'; screen: ScreenName }
  | { type: 'SET_TAB'; tab: 'home' | 'orders' | 'profile' }
  | { type: 'SET_AMOUNT'; amount: string }
  | { type: 'APPEND_DIGIT'; digit: string }
  | { type: 'BACKSPACE' }
  | { type: 'CLEAR_AMOUNT' }
  | { type: 'SET_PAYMENT_METHOD'; method: PaymentMethod }
  | { type: 'START_PAYMENT' }
  | { type: 'SET_PAYMENT_STATUS'; status: PaymentStatus; transaction?: Transaction }
  | { type: 'ADD_TRANSACTION'; transaction: Transaction }
  | { type: 'OPEN_ACTION_SHEET'; sheetType: string }
  | { type: 'CLOSE_ACTION_SHEET' }
  | { type: 'SELECT_ORDER'; orderId: string }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'RESET_HOME' }
  | { type: 'REFUND_ORDER'; orderId: string }
  | { type: 'UPDATE_TERMINAL'; partial: Partial<TerminalState> }
  | { type: 'UPDATE_QUICK_AMOUNTS'; amounts: number[] };

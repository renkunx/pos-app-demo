export type ScreenName = 'login' | 'home' | 'orders' | 'profile' | 'payment_loading' | 'payment_result' | 'order_detail';

export type PaymentMethod = 'card' | 'scan' | 'auto';

export type PaymentStatus = 'success' | 'fail' | 'pending';

export type TransactionType = 'payment' | 'refund';

export type DeviceStatus = 'online' | 'offline' | 'warning';

export type UserRole = 'system_admin' | 'admin' | 'operator';

export interface User {
  username: string;
  role: UserRole;
  displayName: string;
}

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
  isSignedIn: boolean;
  isCheckedIn: boolean;
  networkOnline: boolean;
  keyStatus: DeviceStatus;
  deviceServiceStatus: DeviceStatus;
  devices: DeviceInfo[];
  appVersion: string;
  configVersion: string;
}

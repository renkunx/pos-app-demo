import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, TerminalState, PaymentMethod, PaymentStatus } from '@/types';

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

const initialTerminal: TerminalState = {
  merchantName: '商户_任琨',
  merchantNo: 'M88001234',
  terminalNo: 'T20240601',
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
};

interface PosState {
  amount: string;
  selectedPaymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  lastTransaction: Transaction | null;
  transactions: Transaction[];
  terminal: TerminalState;
  quickAmounts: number[];

  setAmount: (amount: string) => void;
  appendDigit: (digit: string) => void;
  backspace: () => void;
  clearAmount: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  startPayment: () => { prePaymentState: { amount: string; selectedPaymentMethod: PaymentMethod } };
  setPaymentStatus: (status: PaymentStatus, transaction?: Transaction) => void;
  addTransaction: (transaction: Transaction) => void;
  refundOrder: (orderId: string) => void;
  updateTerminal: (partial: Partial<TerminalState>) => void;
  updateQuickAmounts: (amounts: number[]) => void;
  resetHome: () => void;
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      amount: '0',
      selectedPaymentMethod: 'card',
      paymentStatus: 'success',
      lastTransaction: null,
      transactions: initialTransactions,
      terminal: initialTerminal,
      quickAmounts: [10, 20, 50, 100],

      setAmount: (amount) => set({ amount }),

      appendDigit: (digit) => {
        let current = get().amount;
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
        set({ amount: current });
      },

      backspace: () => {
        let current = get().amount;
        if (current.length === 1) {
          current = '0';
        } else {
          current = current.slice(0, -1);
        }
        set({ amount: current });
      },

      clearAmount: () => set({ amount: '0' }),

      setPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

      startPayment: () => {
        const state = get();
        set({ paymentStatus: 'pending' });
        return {
          prePaymentState: {
            amount: state.amount,
            selectedPaymentMethod: state.selectedPaymentMethod,
          },
        };
      },

      setPaymentStatus: (status, transaction) => {
        const state = get();
        set({ paymentStatus: status });
        if (transaction) {
          set({
            lastTransaction: transaction,
            transactions: [transaction, ...state.transactions],
          });
        }
      },

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      refundOrder: (orderId) =>
        set((state) => ({
          transactions: state.transactions.map((t) => {
            if (t.id === orderId) {
              return { ...t, type: 'refund' as const, status: 'success' as const };
            }
            return t;
          }),
        })),

      updateTerminal: (partial) =>
        set((state) => ({
          terminal: { ...state.terminal, ...partial },
        })),

      updateQuickAmounts: (amounts) => set({ quickAmounts: amounts }),

      resetHome: () =>
        set({
          amount: '0',
          paymentStatus: 'success',
          lastTransaction: null,
        }),
    }),
    {
      name: 'pos-data',
      partialize: (state) => ({
        transactions: state.transactions,
        terminal: state.terminal,
        quickAmounts: state.quickAmounts,
      }),
    }
  )
);

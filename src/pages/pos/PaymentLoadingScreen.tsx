import { useEffect } from 'react';
import { useAppState } from '@/hooks/useAppState';

export function PaymentLoadingScreen() {
  const { state, dispatch } = useAppState();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate payment result
      const isSuccess = Math.random() > 0.1; // 90% success rate
      const amount = parseFloat(state.amount);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const orderNo = `20240603${String(Math.floor(Math.random() * 9000) + 1000)}`;

      const transaction = {
        id: String(Date.now()),
        orderNo,
        type: 'payment' as const,
        amount,
        paymentMethod: state.selectedPaymentMethod,
        status: (isSuccess ? 'success' : 'fail') as 'success' | 'fail',
        time: timeStr,
        referenceNo: `REF${String(Math.floor(Math.random() * 900) + 100)}`,
        voucherNo: `VC${String(Math.floor(Math.random() * 900) + 100)}`,
      };

      dispatch({ type: 'SET_PAYMENT_STATUS', status: isSuccess ? 'success' : 'fail', transaction });
      dispatch({ type: 'NAVIGATE', screen: 'payment_result' });
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, state.amount, state.selectedPaymentMethod]);

  return (
    <div className="flex flex-col h-full bg-white items-center justify-center">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--pos-accent-primary-light)]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--pos-accent-primary)] animate-spin-slow" />
      </div>
      <h2 className="text-xl font-semibold text-[var(--pos-text-primary)] mb-2">支付处理中</h2>
      <p className="text-sm text-[var(--pos-text-secondary)] animate-pulse-opacity">
        请稍候，正在处理您的交易...
      </p>
      <div className="mt-8 text-3xl font-bold text-[var(--pos-text-primary)] pos-amount">
        ¥{parseFloat(state.amount).toFixed(2)}
      </div>
      <p className="mt-2 text-xs text-[var(--pos-text-secondary)]">
        {state.selectedPaymentMethod === 'card' ? '刷卡支付' : state.selectedPaymentMethod === 'scan' ? '扫码支付' : '自动识别'}
      </p>
    </div>
  );
}

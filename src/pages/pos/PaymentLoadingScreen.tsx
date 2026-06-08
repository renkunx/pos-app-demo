import { useEffect } from 'react';
import { usePosStore } from '@/stores/posStore';
import { useUiStore } from '@/stores/uiStore';

export function PaymentLoadingScreen() {
  const amount = usePosStore((s) => s.amount);
  const selectedPaymentMethod = usePosStore((s) => s.selectedPaymentMethod);
  const setPaymentStatus = usePosStore((s) => s.setPaymentStatus);
  const navigate = useUiStore((s) => s.navigate);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isSuccess = Math.random() > 0.1;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const datePrefix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const orderNo = `${datePrefix}${String(Math.floor(Math.random() * 9000) + 1000)}`;

      const transaction = {
        id: String(Date.now()),
        orderNo,
        type: 'payment' as const,
        amount: parseFloat(amount),
        paymentMethod: selectedPaymentMethod,
        status: (isSuccess ? 'success' : 'fail') as 'success' | 'fail',
        time: timeStr,
        referenceNo: `REF${String(Math.floor(Math.random() * 900) + 100)}`,
        voucherNo: `VC${String(Math.floor(Math.random() * 900) + 100)}`,
      };

      setPaymentStatus(isSuccess ? 'success' : 'fail', transaction);
      navigate('payment_result');
    }, 2000);

    return () => clearTimeout(timer);
  }, [amount, selectedPaymentMethod, setPaymentStatus, navigate]);

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
        ¥{parseFloat(amount).toFixed(2)}
      </div>
      <p className="mt-2 text-xs text-[var(--pos-text-secondary)]">
        {selectedPaymentMethod === 'card' ? '刷卡支付' : selectedPaymentMethod === 'scan' ? '扫码支付' : '自动识别'}
      </p>
    </div>
  );
}

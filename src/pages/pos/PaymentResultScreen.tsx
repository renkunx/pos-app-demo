import { useEffect, useRef } from 'react';
import { XCircle, Printer, Home, RotateCcw, FileSearch } from 'lucide-react';
import { usePosStore } from '@/stores/posStore';
import { useUiStore } from '@/stores/uiStore';

export function PaymentResultScreen() {
  const amount = usePosStore((s) => s.amount);
  const lastTransaction = usePosStore((s) => s.lastTransaction);
  const paymentStatus = usePosStore((s) => s.paymentStatus);
  const resetHome = usePosStore((s) => s.resetHome);
  const navigate = useUiStore((s) => s.navigate);
  const setTab = useUiStore((s) => s.setTab);
  const showToast = useUiStore((s) => s.showToast);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tx = lastTransaction;
  const isSuccess = paymentStatus === 'success';

  // Auto-return after 5 seconds on success
  useEffect(() => {
    if (isSuccess) {
      timerRef.current = setTimeout(() => {
        resetHome();
        navigate('home');
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isSuccess, resetHome, navigate]);

  const handlePrint = () => {
    showToast('小票打印成功');
  };

  const handleReturnHome = () => {
    resetHome();
    navigate('home');
  };

  const handleRetry = () => {
    navigate('home');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Status area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Status icon */}
        <div className="mb-6 scale-bounce">
          {isSuccess ? (
            <div className="w-20 h-20 rounded-full bg-[var(--pos-accent-success)]/10 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#ECFDF5" />
                <path
                  className="checkmark-anim"
                  d="M14 24L21 31L34 17"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[var(--pos-accent-error)]/10 flex items-center justify-center">
              <XCircle size={48} className="text-[var(--pos-accent-error)]" />
            </div>
          )}
        </div>

        {/* Status text */}
        <h2 className={`text-2xl font-bold mb-1 ${isSuccess ? 'text-[var(--pos-accent-success)]' : 'text-[var(--pos-accent-error)]'}`}>
          {isSuccess ? '交易成功' : '交易失败'}
        </h2>
        <p className="text-sm text-[var(--pos-text-secondary)] mb-6">
          {isSuccess ? '支付已完成，请打印小票' : '支付未成功，请重试或更换支付方式'}
        </p>

        {/* Amount */}
        <div className="text-4xl font-bold text-[var(--pos-text-primary)] pos-amount mb-6">
          ¥{tx ? tx.amount.toFixed(2) : parseFloat(amount).toFixed(2)}
        </div>

        {/* Detail card */}
        {tx && (
          <div className="w-full bg-[var(--pos-bg-primary)] rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[var(--pos-text-secondary)]">支付方式</span>
              <span className="text-sm text-[var(--pos-text-primary)]">
                {tx.paymentMethod === 'card' ? '刷卡支付' : tx.paymentMethod === 'scan' ? '扫码支付' : '自动识别'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--pos-text-secondary)]">订单号</span>
              <span className="text-sm font-mono text-[var(--pos-text-primary)]">{tx.orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--pos-text-secondary)]">参考号</span>
              <span className="text-sm font-mono text-[var(--pos-text-primary)]">{tx.referenceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--pos-text-secondary)]">交易时间</span>
              <span className="text-sm text-[var(--pos-text-primary)]">{tx.time}</span>
            </div>
          </div>
        )}

        {/* Auto-return hint */}
        {isSuccess && (
          <p className="mt-4 text-xs text-[var(--pos-text-secondary)]">
            5秒后自动返回首页
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="shrink-0 p-4 space-y-2.5 bg-white border-t border-black/5">
        {isSuccess ? (
          <>
            <button
              onClick={handlePrint}
              className="w-full h-12 bg-[var(--pos-bg-dark)] text-white rounded-xl text-base font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            >
              <Printer size={18} />
              打印小票
            </button>
            <button
              onClick={handleReturnHome}
              className="w-full h-12 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-base font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            >
              <Home size={18} />
              返回首页
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleRetry}
              className="w-full h-12 bg-[var(--pos-accent-primary)] text-white rounded-xl text-base font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            >
              <RotateCcw size={18} />
              重新支付
            </button>
            <div className="flex gap-2.5">
              <button
                onClick={() => setTab('orders')}
                className="flex-1 h-12 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-base font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
              >
                <FileSearch size={18} />
                查询订单
              </button>
              <button
                onClick={handleReturnHome}
                className="flex-1 h-12 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-base font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
              >
                <Home size={18} />
                返回首页
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

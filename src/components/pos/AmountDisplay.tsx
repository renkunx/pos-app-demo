import { useAppState } from '@/hooks/useAppState';
import { CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AmountDisplay() {
  const { state, dispatch } = useAppState();
  const [ghostNumber, setGhostNumber] = useState<string | null>(null);
  const amount = state.amount;

  // Trigger ghost number animation when amount changes
  useEffect(() => {
    if (amount !== '0') {
      setGhostNumber(`+${amount.slice(-1)}`);
      const timer = setTimeout(() => setGhostNumber(null), 400);
      return () => clearTimeout(timer);
    }
  }, [amount]);

  const formattedAmount = parseFloat(amount).toFixed(2);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-4 min-h-0">
      {/* Operator info */}
      <div className="absolute top-3 left-4 text-xs text-[var(--pos-text-secondary)]">
        操作员：{state.terminal.operator}
      </div>

      {/* Today's summary */}
      <div className="absolute top-3 right-4 text-xs text-[var(--pos-text-secondary)] text-right">
        <div>今日 {state.transactions.filter((t) => t.type === 'payment' && t.status === 'success').length} 笔</div>
        <div>
          ¥
          {state.transactions
            .filter((t) => t.type === 'payment' && t.status === 'success')
            .reduce((sum, t) => sum + t.amount, 0)
            .toFixed(2)}
        </div>
      </div>

      {/* Amount + clear (input-style trailing button) */}
      <div className="flex items-center justify-center gap-2">
        <div className="relative">
          <span className="pos-amount text-[56px] sm:text-[64px] font-bold text-[var(--pos-text-primary)] leading-none tracking-tight">
            ¥{formattedAmount}
          </span>
          {ghostNumber && (
            <span className="absolute -top-6 right-0 text-lg font-semibold text-[var(--pos-accent-primary)] float-up">
              {ghostNumber}
            </span>
          )}
        </div>
        {amount !== '0' && (
          <button
            type="button"
            aria-label="清空金额"
            onClick={() => dispatch({ type: 'CLEAR_AMOUNT' })}
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[var(--pos-text-secondary)] bg-[var(--pos-bg-surface)] shadow-sm active:scale-95 active:bg-gray-100 transition-all select-none"
          >
            <CircleX size={20} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Hint text */}
      <p className="mt-2 text-sm text-[var(--pos-text-secondary)]">
        {amount === '0' ? '请输入收款金额' : '确认金额后点击收款'}
      </p>
    </div>
  );
}

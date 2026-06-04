import { useAppState } from '@/hooks/useAppState';
import { useEffect, useState } from 'react';

export function AmountDisplay() {
  const { state } = useAppState();
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

      {/* Amount */}
      <div className="relative flex items-center justify-center">
        <span className="pos-amount text-[56px] sm:text-[64px] font-bold text-[var(--pos-text-primary)] leading-none tracking-tight">
          ¥{formattedAmount}
        </span>

        {/* Ghost floating number */}
        {ghostNumber && (
          <span className="absolute -top-6 right-0 text-lg font-semibold text-[var(--pos-accent-primary)] float-up">
            {ghostNumber}
          </span>
        )}
      </div>

      {/* Hint text */}
      <p className="mt-2 text-sm text-[var(--pos-text-secondary)]">
        {amount === '0' ? '请输入收款金额' : '确认金额后点击收款'}
      </p>
    </div>
  );
}

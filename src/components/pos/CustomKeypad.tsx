import { Delete, CreditCard, QrCode, Pencil } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { useState, useCallback } from 'react';

const keys = [
  { label: '1', value: '1', type: 'digit' },
  { label: '2', value: '2', type: 'digit' },
  { label: '3', value: '3', type: 'digit' },
  { label: '退格', value: 'backspace', type: 'action', icon: Delete },
  { label: '4', value: '4', type: 'digit' },
  { label: '5', value: '5', type: 'digit' },
  { label: '6', value: '6', type: 'digit' },
  { label: '刷卡', value: 'pay_card', type: 'submit-card', color: 'blue', icon: CreditCard },
  { label: '7', value: '7', type: 'digit' },
  { label: '8', value: '8', type: 'digit' },
  { label: '9', value: '9', type: 'digit' },
  { label: '扫码', value: 'pay_scan', type: 'submit-scan', color: 'green', icon: QrCode },
  { label: '00', value: '00', type: 'digit' },
  { label: '0', value: '0', type: 'digit' },
  { label: '.', value: '.', type: 'digit' }
];

export function CustomKeypad() {
  const { state, dispatch } = useAppState();
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const canPay = parseFloat(state.amount) > 0;

  const handleKeyPress = useCallback((key: typeof keys[0]) => {
    if ((key.value === 'pay_card') && !canPay) return;

    switch (key.value) {
      case 'clear':
        dispatch({ type: 'CLEAR_AMOUNT' });
        break;
      case 'backspace':
        dispatch({ type: 'BACKSPACE' });
        break;
      case 'pay_card':
        dispatch({ type: 'SET_PAYMENT_METHOD', method: 'card' });
        dispatch({ type: 'START_PAYMENT' });
        break;
      default:
        dispatch({ type: 'APPEND_DIGIT', digit: key.value });
    }
  }, [dispatch, canPay]);

  const handleQuickAmount = (val: number) => {
    const current = parseFloat(state.amount);
    const newVal = current === 0 ? val : current + val;
    dispatch({ type: 'SET_AMOUNT', amount: String(newVal) });
  };

  const handleScanPay = () => {
    if (!canPay) return;
    dispatch({ type: 'SET_PAYMENT_METHOD', method: 'scan' });
    dispatch({ type: 'START_PAYMENT' });
  };

  return (
    <div className="shrink-0 bg-[#F0F1F5] p-3 pb-5">
      {/* 快捷金额行 + 编辑 */}
      <div className="flex gap-2 mb-3">
        {state.quickAmounts.map((val) => (
          <button
            key={val}
            onClick={() => handleQuickAmount(val)}
            className="flex-1 h-10 bg-white rounded-xl text-sm font-medium text-[var(--pos-text-primary)] shadow-sm active:scale-[0.96] active:bg-[var(--pos-accent-primary-light)] active:text-[var(--pos-accent-primary)] transition-all select-none"
          >
            ¥{val}
          </button>
        ))}
        <button
          onClick={() => dispatch({ type: 'OPEN_ACTION_SHEET', sheetType: 'quick_amount_settings' })}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm active:scale-[0.96] transition-transform text-[var(--pos-text-secondary)]"
        >
          <Pencil size={15} />
        </button>
      </div>

      {/* 4x4 键盘网格 */}
      <div className="grid grid-cols-4 gap-2.5">
        {keys.map((key) => {
          const isPressed = pressedKey === key.value;
          const isPayKey = key.value === 'pay_card' || key.value === 'pay_scan';
          const isAction = key.type === 'action';

          let btnClass = 'h-14 rounded-xl font-semibold text-xl select-none flex items-center justify-center transition-all duration-75 ';
          let textClass = '';

          if (isPayKey) {
            btnClass += canPay
              ? `bg-${key.color}-500 text-white shadow-md active:scale-[0.96] active:opacity-90 `
              : `bg-${key.color}-500/40 text-white/70 cursor-not-allowed `;
            textClass = 'text-sm font-semibold';
          } else if (isAction) {
            btnClass += 'bg-white text-[var(--pos-text-secondary)] shadow-sm active:scale-[0.96] active:bg-gray-100 ';
            textClass = 'text-sm font-medium';
          } else {
            btnClass += 'bg-white text-[var(--pos-text-primary)] shadow-sm active:scale-[0.96] active:bg-gray-100 ';
          }

          if (isPressed && !isPayKey) {
            btnClass += ' scale-[0.96] bg-gray-100 ';
          }

          const Icon = key.icon;

          return (
            <button
              key={key.value}
              className={btnClass}
              onPointerDown={() => setPressedKey(key.value)}
              onPointerUp={() => setPressedKey(null)}
              onPointerLeave={() => setPressedKey(null)}
              onClick={() => handleKeyPress(key)}
              disabled={isPayKey && !canPay}
            >
              {Icon && (
                  <Icon size={20} strokeWidth={2} />
              )}
              <span className={textClass}>{key.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

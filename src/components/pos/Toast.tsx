import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';

export function Toast() {
  const toast = useUiStore((s) => s.toast);

  if (!toast?.visible) return null;

  let Icon = CheckCircle2;
  let iconColor = 'text-[var(--pos-accent-success)]';

  const msg = toast.message;
  if (msg.includes('失败') || msg.includes('错误') || msg.includes('退款')) {
    Icon = XCircle;
    iconColor = 'text-[var(--pos-accent-error)]';
  } else if (msg.includes('确认') || msg.includes('注意')) {
    Icon = AlertCircle;
    iconColor = 'text-[var(--pos-accent-warning)]';
  }

  return (
    <div className="absolute top-16 left-0 right-0 z-[90] flex justify-center px-4 pointer-events-none">
      <div className="bg-[var(--pos-bg-dark)] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 animate-[fadeIn_0.2s_ease,slideInUp_0.3s_ease]">
        <Icon size={18} className={iconColor} />
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
}

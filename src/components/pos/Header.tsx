import { useAuthStore } from '@/stores/authStore';
import { usePosStore } from '@/stores/posStore';

interface HeaderProps {
  showStatus?: boolean;
}

export function Header({ showStatus = true }: HeaderProps) {
  const terminal = usePosStore((s) => s.terminal);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="shrink-0 h-12 bg-white border-b border-black/5 flex items-center justify-between px-4 z-50 relative">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[var(--pos-text-primary)]">
          {terminal.merchantName}
        </span>
        {user && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--pos-accent-primary-light)] text-[var(--pos-accent-primary)]">
            {user.displayName}
          </span>
        )}
      </div>

      {showStatus && (
        <div className="flex items-center gap-2">
          {/* Check-in status */}
          <div className={`status-capsule ${terminal.isCheckedIn ? 'status-capsule-success' : 'status-capsule-error'}`}>
            <span className="dot" />
            <span>{terminal.isCheckedIn ? '已签到' : '未签到'}</span>
          </div>

          {/* Device service */}
          <div className={`status-capsule ${terminal.deviceServiceStatus === 'online' ? 'status-capsule-success' : 'status-capsule-error'}`}>
            <span className="dot" />
            <span>设备</span>
          </div>

          {/* Network */}
          <div className={`status-capsule ${terminal.networkOnline ? 'status-capsule-success' : 'status-capsule-error'}`}>
            <span className="dot" />
            <span>{terminal.networkOnline ? '在线' : '离线'}</span>
          </div>
        </div>
      )}
    </header>
  );
}

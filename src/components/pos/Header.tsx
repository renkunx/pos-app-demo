import { useAppState } from '@/hooks/useAppState';

interface HeaderProps {
  showStatus?: boolean;
}

export function Header({ showStatus = true }: HeaderProps) {
  const { state } = useAppState();
  const { terminal } = state;

  return (
    <header className="shrink-0 h-12 bg-white border-b border-black/5 flex items-center justify-between px-4 z-50 relative">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[var(--pos-text-primary)]">
          {terminal.merchantName}
        </span>
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

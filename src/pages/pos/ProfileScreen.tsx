import {
  Printer,
  CreditCard,
  Keyboard,
  ScanLine,
  Wifi,
  Download,
  RefreshCw,
  Settings,
  Shield,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Smartphone,
  KeyRound,
  LogIn,
} from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import type { DeviceStatus } from '@/types';

export function ProfileScreen() {
  const { state, dispatch } = useAppState();
  const { terminal } = state;

  const handleManageAction = (_action: string) => {
    dispatch({ type: 'OPEN_ACTION_SHEET', sheetType: 'manage_confirm' });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--pos-bg-primary)]">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* 终端信息 + 管理操作 合并卡片 */}
        <div className="mx-4 mt-3 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-[var(--pos-accent-primary-light)] flex items-center justify-center">
              <Smartphone size={20} className="text-[var(--pos-accent-primary)]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--pos-text-primary)]">{terminal.merchantName}</h3>
              <p className="text-xs text-[var(--pos-text-secondary)]">{terminal.operator}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <InfoRow label="商户号" value={terminal.merchantNo} />
            <InfoRow label="终端号" value={terminal.terminalNo} />
          </div>

          {/* 分隔线 */}
          <div className="border-t border-black/5 -mx-4 mb-1" />

          {/* 管理操作区 */}
          <ManageRow
            icon={<Download size={18} />}
            label="参数下载"
            onClick={() => handleManageAction('param_download')}
          />
          <ManageRow
            icon={<RefreshCw size={18} />}
            label="重新签到"
            onClick={() => handleManageAction('re_checkin')}
          />
          <ManageRow
            icon={<Settings size={18} />}
            label="商户设置"
            onClick={() => handleManageAction('merchant_setting')}
            isLast
          />
        </div>

        {/* Transaction readiness */}
        <SectionTitle title="交易准备状态" />
        <div className="mx-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <StatusRow
            icon={<LogIn size={16} />}
            label="已登录"
            status={terminal.isSignedIn ? 'online' : 'offline'}
            statusText={terminal.isSignedIn ? '正常' : '未登录'}
          />
          <StatusRow
            icon={<CheckCircle2 size={16} />}
            label="已签到"
            status={terminal.isCheckedIn ? 'online' : 'offline'}
            statusText={terminal.isCheckedIn ? '正常' : '未签到'}
          />
          <StatusRow
            icon={<KeyRound size={16} />}
            label="密钥状态"
            status={terminal.keyStatus}
            statusText={terminal.keyStatus === 'online' ? '正常' : '异常'}
          />
          <StatusRow
            icon={<Shield size={16} />}
            label="设备服务"
            status={terminal.deviceServiceStatus}
            statusText={terminal.deviceServiceStatus === 'online' ? '正常' : '异常'}
            isLast
          />
        </div>

        {/* Device status grid */}
        <SectionTitle title="设备状态" />
        <div className="mx-4 grid grid-cols-3 gap-2">
          <DeviceCard
            icon={<Printer size={20} />}
            name="打印机"
            status={terminal.devices[0]?.status || 'online'}
            detail={terminal.devices[0]?.detail}
          />
          <DeviceCard
            icon={<CreditCard size={20} />}
            name="读卡器"
            status={terminal.devices[1]?.status || 'online'}
          />
          <DeviceCard
            icon={<Keyboard size={20} />}
            name="PINPad"
            status={terminal.devices[2]?.status || 'online'}
          />
          <DeviceCard
            icon={<ScanLine size={20} />}
            name="扫码器"
            status={terminal.devices[3]?.status || 'online'}
          />
          <DeviceCard
            icon={<Wifi size={20} />}
            name="网络"
            status={terminal.devices[4]?.status || 'online'}
            detail={terminal.devices[4]?.detail}
          />
          <DeviceCard
            icon={<Smartphone size={20} />}
            name="终端"
            status="online"
          />
        </div>

        {/* Version info */}
        <div className="mx-4 mt-4 mb-2 flex items-center justify-center gap-4 text-xs text-[var(--pos-text-secondary)]">
          <span>App v{terminal.appVersion}</span>
          <span>配置 {terminal.configVersion}</span>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h4 className="px-4 pt-4 pb-2 text-xs font-semibold text-[var(--pos-text-secondary)] uppercase tracking-wider">
      {title}
    </h4>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--pos-bg-primary)] rounded-lg px-3 py-2">
      <div className="text-[10px] text-[var(--pos-text-secondary)] mb-0.5">{label}</div>
      <div className="text-xs font-medium text-[var(--pos-text-primary)] font-mono">{value}</div>
    </div>
  );
}

function StatusRow({
  icon,
  label,
  status,
  statusText,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  status: DeviceStatus;
  statusText: string;
  isLast?: boolean;
}) {
  const statusColors = {
    online: 'text-[var(--pos-accent-success)]',
    offline: 'text-[var(--pos-accent-error)]',
    warning: 'text-[var(--pos-accent-warning)]',
  };

  const StatusIcon = status === 'online' ? CheckCircle2 : status === 'warning' ? AlertTriangle : XCircle;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${!isLast ? 'border-b border-black/5' : ''}`}>
      <div className="w-8 h-8 rounded-lg bg-[var(--pos-bg-primary)] flex items-center justify-center text-[var(--pos-text-secondary)]">
        {icon}
      </div>
      <span className="flex-1 text-sm text-[var(--pos-text-primary)]">{label}</span>
      <div className={`flex items-center gap-1 ${statusColors[status]}`}>
        <StatusIcon size={14} />
        <span className="text-xs font-medium">{statusText}</span>
      </div>
    </div>
  );
}

function DeviceCard({
  icon,
  name,
  status,
  detail,
}: {
  icon: React.ReactNode;
  name: string;
  status: DeviceStatus;
  detail?: string;
}) {
  const statusColors = {
    online: 'bg-[var(--pos-accent-success)]/10 text-[var(--pos-accent-success)]',
    offline: 'bg-[var(--pos-accent-error)]/10 text-[var(--pos-accent-error)]',
    warning: 'bg-[var(--pos-accent-warning)]/10 text-[var(--pos-accent-warning)]',
  };

  const dotColors = {
    online: 'bg-[var(--pos-accent-success)]',
    offline: 'bg-[var(--pos-accent-error)]',
    warning: 'bg-[var(--pos-accent-warning)]',
  };

  const statusText = {
    online: '在线',
    offline: '离线',
    warning: '异常',
  };

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusColors[status]}`}>
          {icon}
        </div>
        <div className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
      </div>
      <div className="text-xs font-medium text-[var(--pos-text-primary)]">{name}</div>
      <div className="text-[10px] text-[var(--pos-text-secondary)] mt-0.5">
        {detail || statusText[status]}
      </div>
    </div>
  );
}

function ManageRow({
  icon,
  label,
  onClick,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isLast?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50 transition-colors ${
        !isLast ? 'border-b border-black/5' : ''
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--pos-bg-primary)] flex items-center justify-center text-[var(--pos-text-secondary)]">
        {icon}
      </div>
      <span className="flex-1 text-sm text-[var(--pos-text-primary)]">{label}</span>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
}
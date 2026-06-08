import { X, RotateCcw, Printer, FileSearch, Calendar, Pencil, Search, Lock, Eye, EyeOff } from 'lucide-react';
import { useEffect, useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePosStore } from '@/stores/posStore';
import { useUiStore } from '@/stores/uiStore';

export function ActionSheet() {
  const isOpen = useUiStore((s) => s.isActionSheetOpen);
  const actionSheetType = useUiStore((s) => s.actionSheetType);
  const closeActionSheet = useUiStore((s) => s.closeActionSheet);

  const handleClose = useCallback(() => {
    closeActionSheet();
  }, [closeActionSheet]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (actionSheetType) {
      case 'order_options':
        return <OrderOptionsSheet onClose={handleClose} />;
      case 'refund_confirm':
        return <RefundConfirmSheet onClose={handleClose} />;
      case 'reprint_options':
        return <ReprintOptionsSheet onClose={handleClose} />;
      case 'date_filter':
        return <DateFilterSheet onClose={handleClose} />;
      case 'payment_methods':
        return <PaymentMethodsSheet onClose={handleClose} />;
      case 'manage_confirm':
        return <ManageConfirmSheet onClose={handleClose} />;
      case 'quick_amount_settings':
        return <QuickAmountSettingsSheet onClose={handleClose} />;
      case 'refund_input':
        return <RefundInputSheet onClose={handleClose} />;
      case 'verify_refund_password':
        return <VerifyRefundPasswordSheet onClose={handleClose} />;
      case 'set_refund_password':
        return <SetRefundPasswordSheet onClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 overlay-enter"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-2xl sheet-enter max-h-[70%] flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto no-scrollbar pb-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-sheets ─── */

function OrderOptionsSheet({ onClose }: { onClose: () => void }) {
  const transactions = usePosStore((s) => s.transactions);
  const selectedOrderId = useUiStore((s) => s.selectedOrderId);
  const openActionSheet = useUiStore((s) => s.openActionSheet);
  const showToast = useUiStore((s) => s.showToast);
  const order = transactions.find((t) => t.id === selectedOrderId);

  if (!order) return null;

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-4">订单详情</h3>

      <div className="bg-[var(--pos-bg-primary)] rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[var(--pos-text-secondary)]">交易类型</span>
          <span className={`text-sm font-medium ${order.type === 'payment' ? 'text-[var(--pos-text-primary)]' : 'text-[var(--pos-accent-error)]'}`}>
            {order.type === 'payment' ? '收款' : '退款'}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[var(--pos-text-secondary)]">交易金额</span>
          <span className="text-lg font-bold text-[var(--pos-text-primary)]">
            {order.type === 'refund' ? '-' : ''}¥{order.amount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[var(--pos-text-secondary)]">支付方式</span>
          <span className="text-sm text-[var(--pos-text-primary)]">
            {order.paymentMethod === 'card' ? '刷卡' : order.paymentMethod === 'scan' ? '扫码' : '自动'}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[var(--pos-text-secondary)]">订单号</span>
          <span className="text-sm font-mono text-[var(--pos-text-primary)]">{order.orderNo}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[var(--pos-text-secondary)]">参考号</span>
          <span className="text-sm font-mono text-[var(--pos-text-primary)]">{order.referenceNo}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--pos-text-secondary)]">交易时间</span>
          <span className="text-sm text-[var(--pos-text-primary)]">{order.time}</span>
        </div>
      </div>

      <div className="flex gap-3">
        {order.type === 'payment' && order.status === 'success' && (
          <button
            onClick={() => {
              openActionSheet('refund_confirm');
            }}
            className="flex-1 h-11 bg-[var(--pos-accent-error)]/10 text-[var(--pos-accent-error)] rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          >
            <RotateCcw size={16} />
            退款
          </button>
        )}
        <button
          onClick={() => {
            onClose();
            showToast('补打小票成功');
          }}
          className="flex-1 h-11 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <Printer size={16} />
          补打小票
        </button>
      </div>
    </div>
  );
}

function RefundConfirmSheet({ onClose }: { onClose: () => void }) {
  const transactions = usePosStore((s) => s.transactions);
  const selectedOrderId = useUiStore((s) => s.selectedOrderId);
  const refundOrder = usePosStore((s) => s.refundOrder);
  const closeActionSheet = useUiStore((s) => s.closeActionSheet);
  const showToast = useUiStore((s) => s.showToast);
  const order = transactions.find((t) => t.id === selectedOrderId);

  if (!order) return null;

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-4">确认退款</h3>
      <p className="text-sm text-[var(--pos-text-secondary)] mb-4">
        您确定要对该笔交易进行退款吗？退款金额将原路退回。
      </p>
      <div className="bg-[var(--pos-bg-primary)] rounded-xl p-4 mb-4">
        <div className="text-center">
          <span className="text-3xl font-bold text-[var(--pos-accent-error)]">-¥{order.amount.toFixed(2)}</span>
        </div>
        <div className="text-center mt-2 text-sm text-[var(--pos-text-secondary)]">
          订单号：{order.orderNo}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 h-11 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-sm font-medium active:scale-[0.97] transition-transform"
        >
          取消
        </button>
        <button
          onClick={() => {
            refundOrder(order.id);
            closeActionSheet();
            showToast('退款申请已提交');
          }}
          className="flex-1 h-11 bg-[var(--pos-accent-error)] text-white rounded-xl text-sm font-medium active:scale-[0.97] transition-transform"
        >
          确认退款
        </button>
      </div>
    </div>
  );
}

function ReprintOptionsSheet({ onClose }: { onClose: () => void }) {
  const options = [
    { label: '最后一笔', desc: '打印最近一笔交易' },
    { label: '按订单号', desc: '输入订单号查询打印' },
    { label: '按参考号', desc: '输入参考号查询打印' },
  ];

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-1">补打小票</h3>
      <p className="text-xs text-[var(--pos-text-secondary)] mb-4">选择补打方式</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => {
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3.5 bg-[var(--pos-bg-primary)] rounded-xl text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Printer size={18} className="text-[var(--pos-text-secondary)]" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--pos-text-primary)]">{opt.label}</div>
              <div className="text-xs text-[var(--pos-text-secondary)]">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DateFilterSheet({ onClose }: { onClose: () => void }) {
  const options = ['今天', '昨天', '近7天', '近30天', '自定义'];

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-4 flex items-center gap-2">
        <Calendar size={18} />
        选择时间范围
      </h3>
      <div className="space-y-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onClose()}
            className="w-full text-left px-4 py-3 rounded-xl text-sm text-[var(--pos-text-primary)] hover:bg-[var(--pos-bg-primary)] active:bg-[var(--pos-accent-primary-light)] active:text-[var(--pos-accent-primary)] transition-colors"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function PaymentMethodsSheet({ onClose }: { onClose: () => void }) {
  const selectedPaymentMethod = usePosStore((s) => s.selectedPaymentMethod);
  const setPaymentMethod = usePosStore((s) => s.setPaymentMethod);
  const methods = [
    { key: 'card' as const, label: '刷卡支付', desc: '银行卡/信用卡' },
    { key: 'scan' as const, label: '扫码支付', desc: '微信/支付宝' },
    { key: 'auto' as const, label: '自动识别', desc: '自动判断支付方式' },
  ];

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-4">选择支付方式</h3>
      <div className="space-y-2">
        {methods.map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setPaymentMethod(m.key);
              onClose();
            }}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${
              selectedPaymentMethod === m.key
                ? 'bg-[var(--pos-accent-primary-light)] border-2 border-[var(--pos-accent-primary)]'
                : 'bg-[var(--pos-bg-primary)] border-2 border-transparent'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${
              selectedPaymentMethod === m.key ? 'bg-[var(--pos-accent-primary)]' : 'bg-white'
            }`}>
              <FileSearch size={18} className={selectedPaymentMethod === m.key ? 'text-white' : 'text-[var(--pos-text-secondary)]'} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[var(--pos-text-primary)]">{m.label}</div>
              <div className="text-xs text-[var(--pos-text-secondary)]">{m.desc}</div>
            </div>
            {selectedPaymentMethod === m.key && (
              <div className="w-5 h-5 rounded-full bg-[var(--pos-accent-primary)] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ManageConfirmSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-2">管理员确认</h3>
      <p className="text-sm text-[var(--pos-text-secondary)] mb-4">
        此操作需要管理员权限，执行后将影响终端正常运行。是否继续？
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 h-11 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-sm font-medium active:scale-[0.97] transition-transform"
        >
          取消
        </button>
        <button
          onClick={() => {
            onClose();
          }}
          className="flex-1 h-11 bg-[var(--pos-accent-primary)] text-white rounded-xl text-sm font-medium active:scale-[0.97] transition-transform"
        >
          确认执行
        </button>
      </div>
    </div>
  );
}

function QuickAmountSettingsSheet({ onClose }: { onClose: () => void }) {
  const quickAmounts = usePosStore((s) => s.quickAmounts);
  const updateQuickAmounts = usePosStore((s) => s.updateQuickAmounts);
  const showToast = useUiStore((s) => s.showToast);
  const [values, setValues] = useState(quickAmounts.map(String));

  const handleSave = () => {
    const nums = values.map(Number).filter((n) => !isNaN(n) && n > 0);
    if (nums.length === 4) {
      updateQuickAmounts(nums);
      showToast('快捷金额已更新');
      onClose();
    }
  };

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-4 flex items-center gap-2">
        <Pencil size={18} />
        快捷金额设置
      </h3>
      <p className="text-xs text-[var(--pos-text-secondary)] mb-4">
        设置收银页面的 4 个快捷输入金额
      </p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {values.map((v, i) => (
          <div key={i} className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-[var(--pos-text-secondary)]">
              ¥
            </span>
            <input
              type="number"
              value={v}
              onChange={(e) => {
                const newValues = [...values];
                newValues[i] = e.target.value;
                setValues(newValues);
              }}
              className="w-full h-11 pl-6 pr-2 bg-[var(--pos-bg-primary)] rounded-xl text-sm font-medium text-[var(--pos-text-primary)] text-center outline-none focus:ring-2 focus:ring-[var(--pos-accent-primary)]/20"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="w-full h-11 bg-[var(--pos-accent-primary)] text-white rounded-xl text-sm font-medium active:scale-[0.97] transition-transform"
      >
        保存
      </button>
    </div>
  );
}

function RefundInputSheet({ onClose }: { onClose: () => void }) {
  const transactions = usePosStore((s) => s.transactions);
  const openActionSheet = useUiStore((s) => s.openActionSheet);
  const selectOrder = useUiStore((s) => s.selectOrder);
  const showToast = useUiStore((s) => s.showToast);
  const [orderNo, setOrderNo] = useState('');

  const handleSearch = () => {
    if (!orderNo.trim()) return;
    const order = transactions.find(
      (t) => t.orderNo === orderNo.trim() && t.type === 'payment' && t.status === 'success'
    );
    if (order) {
      selectOrder(order.id);
      openActionSheet('refund_confirm');
    } else {
      showToast('未找到可退款的订单');
    }
  };

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-4 flex items-center gap-2">
        <RotateCcw size={18} className="text-[var(--pos-accent-error)]" />
        退款
      </h3>
      <p className="text-xs text-[var(--pos-text-secondary)] mb-4">
        输入订单号查询待退款的交易
      </p>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pos-text-secondary)]" />
        <input
          type="text"
          placeholder="请输入订单号"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          className="w-full h-11 pl-9 pr-4 bg-[var(--pos-bg-primary)] rounded-xl text-sm text-[var(--pos-text-primary)] placeholder:text-[var(--pos-text-secondary)] outline-none focus:ring-2 focus:ring-[var(--pos-accent-primary)]/20"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 h-11 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-sm font-medium active:scale-[0.97] transition-transform"
        >
          取消
        </button>
        <button
          onClick={handleSearch}
          disabled={!orderNo.trim()}
          className={`flex-1 h-11 rounded-xl text-sm font-medium active:scale-[0.97] transition-transform ${
            orderNo.trim()
              ? 'bg-[var(--pos-accent-error)] text-white'
              : 'bg-[var(--pos-accent-error)]/40 text-white/70 cursor-not-allowed'
          }`}
        >
          查询
        </button>
      </div>
    </div>
  );
}

/** 操作员退款前验证退货密码 */
function VerifyRefundPasswordSheet({ onClose }: { onClose: () => void }) {
  const verifyRefundPassword = useAuthStore((s) => s.verifyRefundPassword);
  const openActionSheet = useUiStore((s) => s.openActionSheet);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (verifyRefundPassword(password)) {
      onClose();
      openActionSheet('refund_input');
    } else {
      setError('退货密码错误');
      setPassword('');
    }
  };

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-4 flex items-center gap-2">
        <Lock size={18} className="text-[var(--pos-accent-warning)]" />
        验证退货密码
      </h3>
      <p className="text-xs text-[var(--pos-text-secondary)] mb-4">
        操作员进行退款需要输入退货密码
      </p>
      <input
        type="password"
        placeholder="请输入退货密码"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(''); }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleVerify(); }}
        className="w-full h-11 px-4 bg-[var(--pos-bg-primary)] rounded-xl text-sm text-[var(--pos-text-primary)] placeholder:text-[var(--pos-text-secondary)] outline-none focus:ring-2 focus:ring-[var(--pos-accent-primary)]/20 mb-3"
      />
      {error && (
        <p className="text-sm text-[var(--pos-accent-error)] mb-3">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 h-11 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-sm font-medium active:scale-[0.97] transition-transform"
        >
          取消
        </button>
        <button
          onClick={handleVerify}
          disabled={!password.trim()}
          className={`flex-1 h-11 rounded-xl text-sm font-medium active:scale-[0.97] transition-transform ${
            password.trim()
              ? 'bg-[var(--pos-accent-primary)] text-white'
              : 'bg-[var(--pos-accent-primary)]/40 text-white/70 cursor-not-allowed'
          }`}
        >
          确认
        </button>
      </div>
    </div>
  );
}

/** 管理员设置退货密码 */
function SetRefundPasswordSheet({ onClose }: { onClose: () => void }) {
  const refundPassword = useAuthStore((s) => s.refundPassword);
  const setRefundPassword = useAuthStore((s) => s.setRefundPassword);
  const showToast = useUiStore((s) => s.showToast);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (newPassword.trim().length < 4) return;
    setRefundPassword(newPassword.trim());
    showToast('退货密码已更新');
    onClose();
  };

  return (
    <div className="px-4">
      <h3 className="text-base font-semibold text-[var(--pos-text-primary)] mb-4 flex items-center gap-2">
        <Lock size={18} />
        设置退货密码
      </h3>
      <p className="text-xs text-[var(--pos-text-secondary)] mb-4">
        设置操作员进行退款时需要的退货密码（当前：{refundPassword.replace(/./g, '•')}）
      </p>
      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="请输入新退货密码（至少4位）"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full h-11 pl-4 pr-11 bg-[var(--pos-bg-primary)] rounded-xl text-sm text-[var(--pos-text-primary)] placeholder:text-[var(--pos-text-secondary)] outline-none focus:ring-2 focus:ring-[var(--pos-accent-primary)]/20"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pos-text-secondary)]"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 h-11 bg-[var(--pos-bg-primary)] text-[var(--pos-text-primary)] rounded-xl text-sm font-medium active:scale-[0.97] transition-transform"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={newPassword.trim().length < 4}
          className={`flex-1 h-11 rounded-xl text-sm font-medium active:scale-[0.97] transition-transform ${
            newPassword.trim().length >= 4
              ? 'bg-[var(--pos-accent-primary)] text-white'
              : 'bg-[var(--pos-accent-primary)]/40 text-white/70 cursor-not-allowed'
          }`}
        >
          保存
        </button>
      </div>
    </div>
  );
}

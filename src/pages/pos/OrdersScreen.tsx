import { useState } from 'react';
import { Search, Filter, ChevronRight, CreditCard, QrCode, Zap, ArrowDownLeft, ArrowUpRight, RotateCcw, Printer } from 'lucide-react';
import { Header } from '@/components/pos/Header';
import { useAuthStore } from '@/stores/authStore';
import { usePosStore } from '@/stores/posStore';
import { useUiStore } from '@/stores/uiStore';
import { getDateFilterLabel, isTransactionInDateFilter } from '@/lib/orderFilter';
import type { Transaction } from '@/types';

export function OrdersScreen() {
  const user = useAuthStore((s) => s.user);
  const transactions = usePosStore((s) => s.transactions);
  const openActionSheet = useUiStore((s) => s.openActionSheet);
  const selectOrder = useUiStore((s) => s.selectOrder);
  const orderDateFilter = useUiStore((s) => s.orderDateFilter);
  const [searchQuery, setSearchQuery] = useState('');

  const hasActiveFilter = orderDateFilter !== null;
  const filterLabel = getDateFilterLabel(orderDateFilter);

  const filtered = transactions.filter((tx) => {
    if (!isTransactionInDateFilter(tx, orderDateFilter)) return false;
    if (searchQuery) {
      return tx.orderNo.includes(searchQuery) || tx.referenceNo?.includes(searchQuery);
    }
    return true;
  });

  const refundCount = filtered.filter((t) => t.type === 'refund').length;
  const failCount = filtered.filter((t) => t.status === 'fail').length;
  const totalAmount = filtered
    .filter((t) => t.type === 'payment' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleOrderClick = (tx: Transaction) => {
    selectOrder(tx.id);
    openActionSheet('order_options');
  };

  // 操作员退款需要校验退货密码
  const handleRefundClick = () => {
    if (user?.role === 'operator') {
      openActionSheet('verify_refund_password');
    } else {
      openActionSheet('refund_input');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--pos-bg-primary)]">
      <Header />

      {/* 退款/补打操作卡片 */}
      <div className="shrink-0 flex gap-2 px-4 pt-3 pb-2">
        <button
          onClick={handleRefundClick}
          className="flex-1 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-[var(--pos-text-primary)] active:scale-[0.97] transition-transform"
        >
          <RotateCcw size={16} className="text-[var(--pos-accent-error)]" />
          退款
        </button>
        <button
          onClick={() => openActionSheet('reprint_options')}
          className="flex-1 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-[var(--pos-text-primary)] active:scale-[0.97] transition-transform"
        >
          <Printer size={16} className="text-[var(--pos-text-secondary)]" />
          补打
        </button>
      </div>

      {/* Search bar */}
      <div className="shrink-0 flex gap-2 px-4 pt-3 pb-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pos-text-secondary)]" />
          <input
            type="text"
            placeholder="搜索订单号、参考号"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-white rounded-xl text-sm text-[var(--pos-text-primary)] placeholder:text-[var(--pos-text-secondary)] shadow-sm outline-none focus:ring-2 focus:ring-[var(--pos-accent-primary)]/20"
          />
        </div>
        <button
          onClick={() => openActionSheet('date_filter')}
          className={`h-10 px-3 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-[0.97] transition-all ${
            hasActiveFilter
              ? 'bg-[var(--pos-accent-primary-light)] ring-2 ring-[var(--pos-accent-primary)]'
              : 'bg-white'
          }`}
        >
          <Filter
            size={16}
            className={hasActiveFilter ? 'text-[var(--pos-accent-primary)]' : 'text-[var(--pos-text-secondary)]'}
          />
          <span
            className={`text-sm max-w-[4.5rem] truncate ${
              hasActiveFilter ? 'text-[var(--pos-accent-primary)] font-medium' : 'text-[var(--pos-text-secondary)]'
            }`}
          >
            {hasActiveFilter ? filterLabel : '筛选'}
          </span>
        </button>
      </div>

      {/* Stats card */}
      <div className="shrink-0 mx-4 mb-2 bg-white rounded-xl p-3 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-[var(--pos-text-primary)]">{filtered.length}</div>
            <div className="text-[10px] text-[var(--pos-text-secondary)]">总笔数</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--pos-accent-primary)]">¥{totalAmount.toFixed(2)}</div>
            <div className="text-[10px] text-[var(--pos-text-secondary)]">总金额</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--pos-accent-error)]">{refundCount}</div>
            <div className="text-[10px] text-[var(--pos-text-secondary)]">退款</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--pos-accent-warning)]">{failCount}</div>
            <div className="text-[10px] text-[var(--pos-text-secondary)]">失败</div>
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        <div className="space-y-2">
          {filtered.map((tx) => (
            <button
              key={tx.id}
              onClick={() => handleOrderClick(tx)}
              className="w-full bg-white rounded-xl p-3.5 shadow-sm flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                tx.type === 'refund'
                  ? 'bg-[var(--pos-accent-error)]/10'
                  : tx.status === 'fail'
                  ? 'bg-[var(--pos-accent-warning)]/10'
                  : 'bg-[var(--pos-accent-success)]/10'
              }`}>
                {tx.type === 'refund' ? (
                  <ArrowDownLeft size={18} className="text-[var(--pos-accent-error)]" />
                ) : tx.status === 'fail' ? (
                  <ArrowUpRight size={18} className="text-[var(--pos-accent-warning)]" />
                ) : (
                  <ArrowUpRight size={18} className="text-[var(--pos-accent-success)]" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--pos-text-primary)]">
                    {tx.type === 'refund' ? '退款' : '收款'}
                  </span>
                  <PaymentMethodBadge method={tx.paymentMethod} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--pos-text-secondary)]">{tx.time}</span>
                  <span className="text-xs text-[var(--pos-text-secondary)] font-mono">{tx.orderNo}</span>
                </div>
              </div>

              {/* Amount & status */}
              <div className="text-right shrink-0">
                <div className={`text-base font-bold ${
                  tx.type === 'refund'
                    ? 'text-[var(--pos-accent-error)]'
                    : tx.status === 'fail'
                    ? 'text-[var(--pos-accent-warning)]'
                    : 'text-[var(--pos-text-primary)]'
                }`}>
                  {tx.type === 'refund' ? '-' : ''}¥{tx.amount.toFixed(2)}
                </div>
                <div className={`text-[10px] mt-0.5 ${
                  tx.status === 'success' ? 'text-[var(--pos-accent-success)]' : 'text-[var(--pos-accent-error)]'
                }`}>
                  {tx.status === 'success' ? '成功' : '失败'}
                </div>
              </div>

              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-sm text-[var(--pos-text-secondary)]">暂无交易记录</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentMethodBadge({ method }: { method: Transaction['paymentMethod'] }) {
  const icons = {
    card: CreditCard,
    scan: QrCode,
    auto: Zap,
  };
  const labels = {
    card: '刷卡',
    scan: '扫码',
    auto: '自动',
  };
  const Icon = icons[method];

  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[var(--pos-bg-primary)] rounded text-[10px] text-[var(--pos-text-secondary)]">
      <Icon size={10} />
      {labels[method]}
    </span>
  );
}

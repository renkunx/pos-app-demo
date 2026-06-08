import type { OrderDateFilter, Transaction } from '@/types';

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getTransactionDate(tx: Transaction): Date {
  const dateStr = tx.orderNo.slice(0, 8);
  const y = parseInt(dateStr.slice(0, 4), 10);
  const m = parseInt(dateStr.slice(4, 6), 10) - 1;
  const d = parseInt(dateStr.slice(6, 8), 10);
  return new Date(y, m, d);
}

function getDateRange(filter: OrderDateFilter): { start: Date; end: Date } {
  const today = startOfDay(new Date());

  switch (filter.preset) {
    case 'today':
      return { start: today, end: today };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: yesterday };
    }
    case 'last7days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { start, end: today };
    }
    case 'last30days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { start, end: today };
    }
    case 'custom': {
      const start = filter.customStartDate
        ? startOfDay(parseISODate(filter.customStartDate))
        : today;
      const end = filter.customEndDate
        ? startOfDay(parseISODate(filter.customEndDate))
        : today;
      return start <= end ? { start, end } : { start: end, end: start };
    }
  }
}

export function isTransactionInDateFilter(tx: Transaction, filter: OrderDateFilter | null): boolean {
  if (!filter) return true;
  const txDate = startOfDay(getTransactionDate(tx));
  const { start, end } = getDateRange(filter);
  return txDate >= start && txDate <= end;
}

const PRESET_LABELS: Record<OrderDateFilter['preset'], string> = {
  today: '今天',
  yesterday: '昨天',
  last7days: '近7天',
  last30days: '近30天',
  custom: '自定义',
};

export function getDateFilterLabel(filter: OrderDateFilter | null): string | null {
  if (!filter) return null;
  if (filter.preset === 'custom' && filter.customStartDate && filter.customEndDate) {
    const start = filter.customStartDate.slice(5).replace('-', '/');
    const end = filter.customEndDate.slice(5).replace('-', '/');
    return start === end ? `${start}` : `${start}~${end}`;
  }
  return PRESET_LABELS[filter.preset];
}

'use client';

import { Order, Status, STATUSES, STATUS_COLORS, CURRENCY_SYMBOL, TRACKING_PHONE, ACTIVE_STATUSES } from '@/lib/types';
import DeadlinePill from './DeadlinePill';

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onToast: (msg: string) => void;
}

function fmt(amount: number, currency: Order['currency']) {
  const sym = CURRENCY_SYMBOL[currency];
  return `${sym}${amount.toLocaleString()}`;
}

export default function OrderCard({ order, onStatusChange, onEdit, onDelete, onToast }: OrderCardProps) {
  const sameCurrency = order.currency === order.shipCurrency;
  const sym = CURRENCY_SYMBOL[order.currency];

  async function handleTrack() {
    try {
      await navigator.clipboard.writeText(TRACKING_PHONE);
    } catch {}
    onToast(`Утасны дугаар хуулагдлаа: ${TRACKING_PHONE} — 17track шаардвал буулгана уу`);
    window.open(`https://t.17track.net/en#nums=${order.tracking}`, '_blank');
  }

  return (
    <div className="bg-white border border-[#E6EDEB] rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow duration-150">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left: main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-base text-[#14211F]">{order.customer}</span>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as Status)}
              style={{
                backgroundColor: STATUS_COLORS[order.status],
                fontFamily: 'var(--font-montserrat, Montserrat), sans-serif',
              }}
              className="text-white text-xs font-semibold px-2 py-0.5 rounded-full border-none cursor-pointer appearance-none pr-5 outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} style={{ backgroundColor: STATUS_COLORS[s] }}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-[#6B7C78] font-medium mb-2">
            {order.brand} · {order.model}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B7C78] mb-3">
            <span className="font-mono text-[#14211F] bg-[#F5F8F7] px-2 py-0.5 rounded">{order.tracking}</span>
            <span>{order.carrier}</span>
            <span>Захиалсан: {order.date}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <DeadlinePill deadline={order.deadline} status={order.status} />
          </div>

          <div className="text-xs text-[#6B7C78]">
            Бараа{' '}
            <span className="text-[#14211F] font-medium">{fmt(order.amount, order.currency)}</span>
            {' · '}
            Тээвэр{' '}
            <span className="text-[#14211F] font-medium">{fmt(order.ship, order.shipCurrency)}</span>
          </div>
        </div>

        {/* Right: total + actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-3 sm:min-w-[140px]">
          <div className="text-right">
            <div className="text-xs text-[#6B7C78] mb-0.5">Нийт өртөг</div>
            {sameCurrency ? (
              <div className="text-lg font-bold text-[#14211F]">{sym}{(order.amount + order.ship).toLocaleString()}</div>
            ) : (
              <div className="text-sm font-bold text-[#14211F] leading-snug">
                <div>{fmt(order.amount, order.currency)}</div>
                <div className="text-[#6B7C78] font-medium">+ {fmt(order.ship, order.shipCurrency)}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 items-end">
            <button
              onClick={handleTrack}
              className="text-xs font-bold text-[#12B5A6] hover:text-[#0C897E] transition-colors px-3 py-1.5 border border-[#12B5A6] rounded-md hover:bg-[#F0FAFA] whitespace-nowrap"
            >
              Хянах →
            </button>
            <div className="flex gap-1.5">
              <button
                onClick={() => onEdit(order)}
                className="text-xs font-medium text-[#6B7C78] hover:text-[#14211F] px-2 py-1 border border-[#E6EDEB] rounded hover:border-[#14211F] transition-colors"
              >
                Засах
              </button>
              <button
                onClick={() => onDelete(order.id)}
                className="text-xs font-medium text-[#9A3030] hover:text-red-700 px-2 py-1 border border-[#E6EDEB] rounded hover:border-red-300 transition-colors"
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

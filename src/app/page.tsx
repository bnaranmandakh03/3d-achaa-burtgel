'use client';

import { useState, useEffect, useCallback } from 'react';
import { Order, Status, STATUSES, CURRENCY_SYMBOL, ACTIVE_STATUSES, TRACKING_PHONE, Currency } from '@/lib/types';
import { getOrders, saveOrders, deleteOrder } from '@/lib/storage';
import OrderCard from '@/components/OrderCard';
import OrderModal from '@/components/OrderModal';
import Toast from '@/components/Toast';

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | 'Бүгд'>('Бүгд');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  async function handleSave(order: Order) {
    const next = orders.find((o) => o.id === order.id)
      ? orders.map((o) => (o.id === order.id ? order : o))
      : [...orders, order];
    setOrders(next);
    await saveOrders([order]);
    setModalOpen(false);
    setEditOrder(null);
  }

  async function handleStatusChange(id: string, status: Status) {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    const order = updated.find((o) => o.id === id);
    if (order) await saveOrders([order]);
  }

  async function handleDelete(id: string) {
    if (!confirm('Энэ захиалгыг устгах уу?')) return;
    setOrders(orders.filter((o) => o.id !== id));
    await deleteOrder(id);
  }

  function handleEdit(order: Order) {
    setEditOrder(order);
    setModalOpen(true);
  }

  function handleNew() {
    setEditOrder(null);
    setModalOpen(true);
  }

  const showToast = useCallback((msg: string) => setToast(msg), []);

  async function handleTrackAll() {
    const active = orders.filter((o) => ACTIVE_STATUSES.includes(o.status) && o.tracking);
    if (!active.length) {
      showToast('Идэвхтэй захиалга олдсонгүй');
      return;
    }
    const nums = active.map((o) => o.tracking).join(',');
    try { await navigator.clipboard.writeText(TRACKING_PHONE); } catch {}
    showToast(`Утасны дугаар хуулагдлаа: ${TRACKING_PHONE} — 17track шаардвал буулгана уу`);
    window.open(`https://t.17track.net/en#nums=${nums}`, '_blank');
  }

  function handleCsvExport() {
    const BOM = '﻿';
    const headers = [
      'Үйлчлүүлэгч', 'Брэнд', '3D принтерийн загвар', 'Хянах дугаар',
      'Тээвэрлэгч', 'Захиалсан огноо', 'Эцсийн хугацаа', 'Төлөв',
      'Валют', 'Захиалгын дүн', 'Тээврийн валют', 'Тээврийн зардал',
    ];
    const rows = orders.map((o) => [
      o.customer, o.brand, o.model, o.tracking,
      o.carrier, o.date, o.deadline, o.status,
      o.currency, o.amount, o.shipCurrency, o.ship,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = BOM + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'achaa_burtgel.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Stats
  const totalCount = orders.length;
  const inTransit = orders.filter((o) => o.status === 'Замд яваа').length;
  const delivered = orders.filter((o) => o.status === 'Хүргэгдсэн').length;

  const currencyTotals: Partial<Record<Currency, number>> = {};
  for (const o of orders) {
    currencyTotals[o.currency] = (currencyTotals[o.currency] ?? 0) + o.amount;
    currencyTotals[o.shipCurrency] = (currencyTotals[o.shipCurrency] ?? 0) + o.ship;
  }
  const totalStr = (Object.entries(currencyTotals) as [Currency, number][])
    .filter(([, v]) => v > 0)
    .map(([c, v]) => `${CURRENCY_SYMBOL[c]}${v.toLocaleString()}`)
    .join(' · ') || '—';

  const statusCounts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const filtered = orders
    .filter((o) => filter === 'Бүгд' || o.status === filter)
    .filter((o) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        o.customer.toLowerCase().includes(q) ||
        o.brand.toLowerCase().includes(q) ||
        o.model.toLowerCase().includes(q) ||
        o.tracking.toLowerCase().includes(q) ||
        o.carrier.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: 'var(--font-montserrat, Montserrat), sans-serif' }}
    >
      {/* Header */}
      <header className="border-b border-[#E6EDEB] bg-white">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#14211F] tracking-tight">
                  АЧААНЫ БҮРТГЭЛ
                </h1>
                <span className="text-xs font-bold bg-[#12B5A6] text-white px-2 py-0.5 rounded-full">
                  ХЯТАД → МОНГОЛ
                </span>
              </div>
              <p className="text-sm text-[#6B7C78] font-medium">3D принтерийн захиалгын хяналт</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleNew}
                className="bg-[#12B5A6] hover:bg-[#0C897E] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
              >
                + Шинэ захиалга
              </button>
              <button
                onClick={handleTrackAll}
                className="border border-[#12B5A6] text-[#12B5A6] hover:bg-[#F0FAFA] text-sm font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Идэвхтэйг хянах
              </button>
              <button
                onClick={handleCsvExport}
                className="border border-[#E6EDEB] text-[#6B7C78] hover:text-[#14211F] hover:border-[#14211F] text-sm font-bold px-4 py-2 rounded-lg transition-colors"
              >
                CSV татах
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Нийт захиалга', value: loading ? '…' : totalCount },
            { label: 'Замд яваа', value: loading ? '…' : inTransit },
            { label: 'Хүргэгдсэн', value: loading ? '…' : delivered },
            { label: 'Захиалгын дүн', value: loading ? '…' : totalStr },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[#E6EDEB] rounded-lg p-4">
              <div className="text-xs font-semibold text-[#6B7C78] uppercase tracking-wide mb-1">{s.label}</div>
              <div className="text-xl font-bold text-[#12B5A6] truncate">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter chips + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-2">
            {(['Бүгд', ...STATUSES] as const).map((s) => {
              const count = s === 'Бүгд' ? orders.length : statusCounts[s];
              const active = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                    active
                      ? 'bg-[#12B5A6] border-[#12B5A6] text-white'
                      : 'bg-white border-[#E6EDEB] text-[#6B7C78] hover:border-[#12B5A6] hover:text-[#12B5A6]'
                  }`}
                >
                  {s} {count !== undefined && <span className="opacity-75">({count})</span>}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Хайх: үйлчлүүлэгч, загвар, дугаар…"
            className="flex-1 border border-[#E6EDEB] rounded-lg px-3 py-2 text-sm text-[#14211F] placeholder:text-[#6B7C78] focus:outline-none focus:border-[#12B5A6] focus:ring-1 focus:ring-[#12B5A6] bg-white font-[inherit] min-w-0"
          />
        </div>

        {/* Order list */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-16 text-[#6B7C78] text-sm font-medium">Уншиж байна…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[#6B7C78] text-sm font-medium">Захиалга олдсонгүй</div>
          ) : (
            filtered.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToast={showToast}
              />
            ))
          )}
        </div>
      </main>

      {modalOpen && (
        <OrderModal
          initial={editOrder}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditOrder(null); }}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

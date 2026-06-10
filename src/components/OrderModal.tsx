'use client';

import { useState, useEffect } from 'react';
import { Order, Status, Currency, Route, STATUSES, CURRENCIES, BRANDS, ROUTES, ROUTE_LABEL, ALL_CARRIERS } from '@/lib/types';

interface OrderModalProps {
  initial?: Order | null;
  onSave: (order: Order) => void;
  onClose: () => void;
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const EMPTY: Omit<Order, 'id'> = {
  customer: '',
  brand: 'Bambu Lab',
  model: '',
  tracking: '',
  carrier: 'SF Express',
  route: 'China',
  date: new Date().toISOString().slice(0, 10),
  deadline: '',
  status: 'Захиалсан',
  currency: 'USD',
  amount: 0,
  shipCurrency: 'USD',
  ship: 0,
  sellPrice: 0,
  sellCurrency: 'MNT',
};

export default function OrderModal({ initial, onSave, onClose }: OrderModalProps) {
  const [form, setForm] = useState<Omit<Order, 'id'>>(initial ? { ...initial } : { ...EMPTY });
  const [error, setError] = useState('');

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function set<K extends keyof Omit<Order, 'id'>>(key: K, val: Omit<Order, 'id'>[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleRouteChange(route: Route) {
    const carriers = ALL_CARRIERS(route);
    setForm((f) => ({ ...f, route, carrier: carriers[0] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer.trim()) {
      setError('Үйлчлүүлэгчийн нэр шаардлагатай');
      return;
    }
    onSave({ id: initial?.id ?? newId(), ...form });
  }

  const inputCls = "w-full border border-[#E6EDEB] rounded-md px-3 py-2 text-sm text-[#14211F] focus:outline-none focus:border-[#12B5A6] focus:ring-1 focus:ring-[#12B5A6] bg-white font-[inherit]";
  const labelCls = "block text-xs font-semibold text-[#6B7C78] mb-1 uppercase tracking-wide";

  const carriers = ALL_CARRIERS(form.route);

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-xl border border-[#E6EDEB] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: 'var(--font-montserrat, Montserrat), sans-serif' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6EDEB] sticky top-0 bg-white z-10">
          <h2 className="font-bold text-base text-[#14211F]">
            {initial ? 'Захиалга засах' : 'Шинэ захиалга'}
          </h2>
          <button onClick={onClose} className="text-[#6B7C78] hover:text-[#14211F] text-xl font-bold leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Route */}
          <div>
            <label className={labelCls}>Маршрут</label>
            <div className="flex gap-2">
              {ROUTES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRouteChange(r)}
                  className={`flex-1 text-xs font-bold py-2 rounded-md border transition-colors ${
                    form.route === r
                      ? 'bg-[#12B5A6] border-[#12B5A6] text-white'
                      : 'bg-white border-[#E6EDEB] text-[#6B7C78] hover:border-[#12B5A6] hover:text-[#12B5A6]'
                  }`}
                >
                  {ROUTE_LABEL[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div>
            <label className={labelCls}>Үйлчлүүлэгчийн нэр *</label>
            <input
              type="text"
              value={form.customer}
              onChange={(e) => set('customer', e.target.value)}
              className={inputCls}
              placeholder="Нэрийг оруулна уу"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Brand + Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Принтерийн брэнд</label>
              <select value={form.brand} onChange={(e) => set('brand', e.target.value)} className={inputCls}>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>3D принтерийн загвар</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => set('model', e.target.value)}
                className={inputCls}
                placeholder="Ender 3 V3…"
              />
            </div>
          </div>

          {/* Tracking + Carrier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Хянах дугаар</label>
              <input
                type="text"
                value={form.tracking}
                onChange={(e) => set('tracking', e.target.value)}
                className={inputCls}
                placeholder="SF1234567890"
              />
            </div>
            <div>
              <label className={labelCls}>Тээвэрлэгч</label>
              <select value={form.carrier} onChange={(e) => set('carrier', e.target.value)} className={inputCls}>
                {carriers.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Захиалсан огноо</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Эцсийн хугацаа</label>
              <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelCls}>Төлөв</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value as Status)} className={inputCls}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Currency + Amount */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Валют</label>
              <select value={form.currency} onChange={(e) => set('currency', e.target.value as Currency)} className={inputCls}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Захиалгын дүн</label>
              <input
                type="number"
                min={0}
                value={form.amount || ''}
                onChange={(e) => set('amount', parseFloat(e.target.value) || 0)}
                className={inputCls}
                placeholder="0"
              />
            </div>
          </div>

          {/* Ship Currency + Ship Cost */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Тээврийн валют</label>
              <select value={form.shipCurrency} onChange={(e) => set('shipCurrency', e.target.value as Currency)} className={inputCls}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Тээврийн зардал</label>
              <input
                type="number"
                min={0}
                value={form.ship || ''}
                onChange={(e) => set('ship', parseFloat(e.target.value) || 0)}
                className={inputCls}
                placeholder="0"
              />
            </div>
          </div>

          {/* Selling price */}
          <div className="border-t border-[#E6EDEB] pt-4">
            <div className="text-xs font-bold text-[#14211F] uppercase tracking-wide mb-3">Борлуулалт</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Борлуулах валют</label>
                <select value={form.sellCurrency} onChange={(e) => set('sellCurrency', e.target.value as Currency)} className={inputCls}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Борлуулах үнэ</label>
                <input
                  type="number"
                  min={0}
                  value={form.sellPrice || ''}
                  onChange={(e) => set('sellPrice', parseFloat(e.target.value) || 0)}
                  className={inputCls}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#12B5A6] hover:bg-[#0C897E] text-white font-bold py-2.5 rounded-lg transition-colors"
            >
              Хадгалах
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E6EDEB] text-[#6B7C78] hover:text-[#14211F] font-bold py-2.5 rounded-lg transition-colors hover:border-[#14211F]"
            >
              Болих
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

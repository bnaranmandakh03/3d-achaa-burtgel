import { Order } from './types';

const LOCAL_KEY = 'freight_ledger_orders';
const SEEDED_KEY = 'freight_ledger_seeded';

const API = '/api/sheets';

const SEED_ORDERS: Order[] = [
  {
    id: 'seed-1',
    customer: 'Батболд Дорж',
    brand: 'Bambu Lab',
    model: 'X1 Carbon',
    tracking: 'SF1234567890CN',
    carrier: 'SF Express',
    route: 'China',
    date: '2026-05-20',
    deadline: '2026-06-25',
    status: 'Замд яваа',
    currency: 'USD',
    amount: 1200,
    shipCurrency: 'CNY',
    ship: 580,
    sellPrice: 5500000,
    sellCurrency: 'MNT',
  },
  {
    id: 'seed-2',
    customer: 'Энхтуяа Нямдорж',
    brand: 'Creality',
    model: 'Ender 3 V3 SE',
    tracking: 'YT9876543210YQ',
    carrier: 'YunExpress',
    route: 'China',
    date: '2026-05-28',
    deadline: '2026-06-18',
    status: 'Гааль',
    currency: 'CNY',
    amount: 1580,
    shipCurrency: 'CNY',
    ship: 320,
    sellPrice: 1200000,
    sellCurrency: 'MNT',
  },
  {
    id: 'seed-3',
    customer: 'Ганбаатар Лхамсүрэн',
    brand: 'Elegoo',
    model: 'Saturn 4 Ultra',
    tracking: 'CP0011223344CN',
    carrier: 'China Post',
    route: 'China',
    date: '2026-06-01',
    deadline: '2026-07-10',
    status: 'Захиалсан',
    currency: 'USD',
    amount: 650,
    shipCurrency: 'MNT',
    ship: 210000,
    sellPrice: 2800000,
    sellCurrency: 'MNT',
  },
];

function migrate(orders: Order[]): Order[] {
  return orders.map((o) => ({
    ...o,
    route: o.route ?? ('China' as const),
    ship: o.ship ?? 0,
    shipCurrency: o.shipCurrency ?? o.currency,
    sellPrice: o.sellPrice ?? 0,
    sellCurrency: o.sellCurrency ?? ('MNT' as const),
  }));
}

// ── Google Sheets (via Next.js API proxy) ────────────────────────────────────

async function apiPost(body: object): Promise<unknown> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = (await res.json()) as Order[];

    if (!data || data.length === 0) {
      const alreadySeeded = typeof window !== 'undefined' && localStorage.getItem(SEEDED_KEY);
      if (!alreadySeeded) {
        localStorage.setItem(SEEDED_KEY, '1');
        await saveOrders(SEED_ORDERS);
        return SEED_ORDERS;
      }
      return [];
    }
    if (typeof window !== 'undefined') localStorage.setItem(SEEDED_KEY, '1');
    return migrate(data);
  } catch (err) {
    console.warn('Sheets unavailable, falling back to localStorage', err);
    return getLocalOrders();
  }
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  try {
    await apiPost({ action: 'upsert', orders });
    return true;
  } catch (err) {
    console.error('Sheets save failed:', err);
    saveLocalOrders(orders);
    return false;
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    await apiPost({ action: 'delete', id });
  } catch (err) {
    console.warn('Sheets unavailable, falling back to localStorage', err);
    saveLocalOrders(getLocalOrders().filter((o) => o.id !== id));
  }
}

// ── localStorage fallback ─────────────────────────────────────────────────────

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return SEED_ORDERS;
    return migrate(JSON.parse(raw) as Order[]);
  } catch {
    return [];
  }
}

function saveLocalOrders(newOrders: Order[]): void {
  if (typeof window === 'undefined') return;
  let existing: Order[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) existing = JSON.parse(raw) as Order[];
  } catch {}
  const ids = new Set(newOrders.map((o) => o.id));
  const merged = [...existing.filter((o) => !ids.has(o.id)), ...newOrders];
  localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
}

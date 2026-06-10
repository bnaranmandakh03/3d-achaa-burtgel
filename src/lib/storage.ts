import { Order } from './types';
import { supabase } from './supabase';

const LOCAL_KEY = 'freight_ledger_orders';
const SEEDED_KEY = 'freight_ledger_seeded';

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
    shipCurrency: o.shipCurrency ?? o.currency,
    sellPrice: o.sellPrice ?? 0,
    sellCurrency: o.sellCurrency ?? ('MNT' as const),
  }));
}

// ── Supabase ──────────────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      // Only seed once — never re-seed after user deletes all orders
      const alreadySeeded = typeof window !== 'undefined' && localStorage.getItem(SEEDED_KEY);
      if (!alreadySeeded) {
        localStorage.setItem(SEEDED_KEY, '1');
        await saveOrders(SEED_ORDERS);
        return SEED_ORDERS;
      }
      return [];
    }
    // Mark as seeded so future empty-table states aren't re-seeded
    if (typeof window !== 'undefined') localStorage.setItem(SEEDED_KEY, '1');

    return migrate(data as Order[]);
  } catch (err) {
    console.warn('Supabase unavailable, falling back to localStorage', err);
    return getLocalOrders();
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  try {
    // Upsert all orders; Supabase matches on primary key (id)
    const { error } = await supabase
      .from('orders')
      .upsert(orders, { onConflict: 'id' });

    if (error) throw error;
  } catch (err) {
    console.warn('Supabase unavailable, falling back to localStorage', err);
    saveLocalOrders(orders);
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.warn('Supabase unavailable, falling back to localStorage', err);
    const orders = getLocalOrders().filter((o) => o.id !== id);
    saveLocalOrders(orders);
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

function saveLocalOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(orders));
}

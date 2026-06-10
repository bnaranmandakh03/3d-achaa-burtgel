import { Order } from './types';

const KEY = 'freight_ledger_orders';

const SEED_ORDERS: Order[] = [
  {
    id: 'seed-1',
    customer: 'Батболд Дорж',
    brand: 'Bambu Lab',
    model: 'X1 Carbon',
    tracking: 'SF1234567890CN',
    carrier: 'SF Express',
    date: '2026-05-20',
    deadline: '2026-06-25',
    status: 'Замд яваа',
    currency: 'USD',
    amount: 1200,
    ship: 85,
  },
  {
    id: 'seed-2',
    customer: 'Энхтуяа Нямдорж',
    brand: 'Creality',
    model: 'Ender 3 V3 SE',
    tracking: 'YT9876543210YQ',
    carrier: 'YunExpress',
    date: '2026-05-28',
    deadline: '2026-06-18',
    status: 'Гааль',
    currency: 'CNY',
    amount: 1580,
    ship: 320,
  },
  {
    id: 'seed-3',
    customer: 'Ганбаатар Лхамсүрэн',
    brand: 'Elegoo',
    model: 'Saturn 4 Ultra',
    tracking: 'CP0011223344CN',
    carrier: 'China Post',
    date: '2026-06-01',
    deadline: '2026-07-10',
    status: 'Захиалсан',
    currency: 'USD',
    amount: 650,
    ship: 60,
  },
];

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      saveOrders(SEED_ORDERS);
      return SEED_ORDERS;
    }
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(orders));
}

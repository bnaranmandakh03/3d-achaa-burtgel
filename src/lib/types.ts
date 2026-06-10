export type Status =
  | 'Захиалсан'
  | 'Замд яваа'
  | 'Гааль'
  | 'Хүргэгдсэн'
  | 'Цуцалсан';

export type Currency = 'USD' | 'CNY' | 'MNT';

export interface Order {
  id: string;
  customer: string;
  brand: string;
  model: string;
  tracking: string;
  carrier: string;
  date: string;
  deadline: string;
  status: Status;
  currency: Currency;
  amount: number;
  ship: number;
}

export const STATUSES: Status[] = [
  'Захиалсан',
  'Замд яваа',
  'Гааль',
  'Хүргэгдсэн',
  'Цуцалсан',
];

export const STATUS_COLORS: Record<Status, string> = {
  'Захиалсан': '#6B8079',
  'Замд яваа': '#1C7FA4',
  'Гааль': '#B07900',
  'Хүргэгдсэн': '#2F8D6A',
  'Цуцалсан': '#9A3030',
};

export const BRANDS = [
  'Bambu Lab',
  'Creality',
  'Prusa',
  'Anycubic',
  'Elegoo',
  'FlashForge',
  'QIDI',
  'Sovol',
  'Artillery',
  'Snapmaker',
  'Raise3D',
  'Ultimaker',
  'Formlabs',
  'Phrozen',
  'Бусад',
];

export const CARRIERS = [
  'SF Express',
  'YunExpress',
  'China Post',
  'Cainiao',
  'J&T',
  'YTO',
  'Төмөр зам',
  'Авто тээвэр',
  'Агаар',
  'Бусад',
];

export const CURRENCIES: Currency[] = ['USD', 'CNY', 'MNT'];

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  CNY: '¥',
  MNT: '₮',
};

export const ACTIVE_STATUSES: Status[] = ['Захиалсан', 'Замд яваа', 'Гааль'];
export const TRACKING_PHONE = '15104790257';

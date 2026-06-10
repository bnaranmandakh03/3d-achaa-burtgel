export type Status =
  | 'Захиалсан'
  | 'Замд яваа'
  | 'Гааль'
  | 'Хүргэгдсэн'
  | 'Цуцалсан';

export type Currency = 'USD' | 'CNY' | 'KRW' | 'MNT';

export type Route = 'China' | 'USA' | 'Korea';

export interface Order {
  id: string;
  customer: string;
  brand: string;
  model: string;
  tracking: string;
  carrier: string;
  route: Route;
  date: string;
  deadline: string;
  status: Status;
  currency: Currency;
  amount: number;
  shipCurrency: Currency;
  ship: number;
  sellPrice: number;
  sellCurrency: Currency;
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

export const ROUTES: Route[] = ['China', 'USA', 'Korea'];

export const ROUTE_LABEL: Record<Route, string> = {
  China: 'ХЯТАД → МОНГОЛ',
  USA: 'АНУ → МОНГОЛ',
  Korea: 'СОЛОНГОС → МОНГОЛ',
};

export const ROUTE_COLOR: Record<Route, string> = {
  China: '#12B5A6',
  USA: '#1C7FA4',
  Korea: '#B07900',
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

// Grouped by origin country
export const CARRIERS_BY_ROUTE: Record<Route, string[]> = {
  China: [
    'SF Express',
    'YunExpress',
    'China Post',
    'Cainiao',
    'J&T Express',
    'YTO Express',
    'ZTO Express',
    'STO Express',
    'Yunda Express',
    'Best Express',
    'Deppon',
    'Yanwen',
  ],
  USA: [
    'UPS',
    'FedEx',
    'USPS',
    'DHL USA',
    'Amazon Logistics',
  ],
  Korea: [
    'Korea Post (EMS)',
    'CJ Logistics',
    'Lotte Global Logistics',
    'Hanjin Express',
    'Coupang Logistics',
    'Hana Logis',
  ],
};

export const CARRIERS_INTERNATIONAL = [
  'DHL Express',
  'FedEx International',
  'UPS International',
  'TNT',
  'Aramex',
  'EMS',
];

export const CARRIERS_MONGOLIA = [
  'Төмөр зам',
  'Авто тээвэр',
  'Агаарын тээвэр',
];

export const ALL_CARRIERS = (route: Route): string[] => [
  ...CARRIERS_BY_ROUTE[route],
  ...CARRIERS_INTERNATIONAL,
  ...CARRIERS_MONGOLIA,
  'Бусад',
];

export const CURRENCIES: Currency[] = ['USD', 'CNY', 'KRW', 'MNT'];

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  CNY: '¥',
  KRW: '₩',
  MNT: '₮',
};

export const ACTIVE_STATUSES: Status[] = ['Захиалсан', 'Замд яваа', 'Гааль'];
export const TRACKING_PHONE = '15104790257';

import type { CatalogFoamInsertKit, ToolCart } from './catalogTypes';

export const demoToolCarts: ToolCart[] = [
  {
    article: 'WC-DEMO-700-A',
    name: 'Тележка инструментальная Compact 700',
    previewUrl: '/placeholder-cart-a.svg',
    price: 89000,
    shelves: [
      { id: 'top', name: 'Верхняя полка', widthMm: 620, heightMm: 420, capacityUnits: 6 },
      { id: 'middle', name: 'Средняя полка', widthMm: 620, heightMm: 420, capacityUnits: 6 },
      { id: 'bottom', name: 'Нижняя полка', widthMm: 620, heightMm: 420, capacityUnits: 6 },
    ],
  },
  {
    article: 'WC-DEMO-900-B',
    name: 'Тележка инструментальная Pro 900',
    previewUrl: '/placeholder-cart-b.svg',
    price: 126000,
    shelves: [
      { id: 'drawer-1', name: 'Полка 1 — измерительный инструмент', widthMm: 820, heightMm: 460, capacityUnits: 6 },
      { id: 'drawer-2', name: 'Полка 2 — ручной инструмент', widthMm: 820, heightMm: 460, capacityUnits: 6 },
      { id: 'drawer-3', name: 'Полка 3 — расходные материалы', widthMm: 820, heightMm: 460, capacityUnits: 6 },
      { id: 'drawer-4', name: 'Полка 4 — сервисный набор', widthMm: 820, heightMm: 460, capacityUnits: 6 },
    ],
  },
];

export const demoCatalogKits: CatalogFoamInsertKit[] = [
  {
    article: 'KIT-DEMO-WRENCH-16',
    name: 'Набор рожковых ключей',
    previewUrl: null,
    shelfUnits: 1,
    sizeLabel: '1/6 полки',
    priceEmpty: 2600,
    priceWithTools: 14200,
    includedTools: [
      { article: 'TOOL-WR-08', name: 'Ключ рожковый 8 мм', price: 1200 },
      { article: 'TOOL-WR-10', name: 'Ключ рожковый 10 мм', price: 1400 },
      { article: 'TOOL-WR-12', name: 'Ключ рожковый 12 мм', price: 1600 },
    ],
  },
  {
    article: 'KIT-DEMO-SCREW-13',
    name: 'Отвертки базовые',
    previewUrl: null,
    shelfUnits: 2,
    sizeLabel: '1/3 полки',
    priceEmpty: 3900,
    priceWithTools: 18700,
    includedTools: [
      { article: 'TOOL-SD-PH1', name: 'Отвертка PH1', price: 1800 },
      { article: 'TOOL-SD-PH2', name: 'Отвертка PH2', price: 1900 },
      { article: 'TOOL-SD-SL5', name: 'Отвертка SL5', price: 1700 },
    ],
  },
  {
    article: 'KIT-DEMO-PLIERS-13',
    name: 'Пассатижи и кусачки',
    previewUrl: null,
    shelfUnits: 2,
    sizeLabel: '1/3 полки',
    priceEmpty: 4200,
    priceWithTools: 22100,
    includedTools: [
      { article: 'TOOL-PL-COMB', name: 'Пассатижи комбинированные', price: 5600 },
      { article: 'TOOL-PL-CUT', name: 'Бокорезы', price: 5100 },
    ],
  },
  {
    article: 'KIT-DEMO-MEASURE-23',
    name: 'Измерительный комплект',
    previewUrl: null,
    shelfUnits: 4,
    sizeLabel: '2/3 полки',
    priceEmpty: 6800,
    priceWithTools: 39400,
    includedTools: [
      { article: 'TOOL-CAL-150', name: 'Штангенциркуль 150 мм', price: 11800 },
      { article: 'TOOL-TAPE-5M', name: 'Рулетка 5 м', price: 2400 },
      { article: 'TOOL-SQ-250', name: 'Угольник 250 мм', price: 3600 },
    ],
  },
  {
    article: 'KIT-DEMO-SOCKET-23',
    name: 'Торцевые головки 1/2',
    previewUrl: null,
    shelfUnits: 4,
    sizeLabel: '2/3 полки',
    priceEmpty: 7600,
    priceWithTools: 46800,
    includedTools: [
      { article: 'TOOL-RATCHET-12', name: 'Трещотка 1/2', price: 8900 },
      { article: 'TOOL-SOCKET-SET', name: 'Комплект головок', price: 21600 },
    ],
  },
  {
    article: 'KIT-DEMO-ELECTRIC-FULL',
    name: 'Электромонтажный набор',
    previewUrl: null,
    shelfUnits: 6,
    sizeLabel: 'полка целиком',
    priceEmpty: 9800,
    priceWithTools: 58400,
    includedTools: [
      { article: 'TOOL-STRIPPER', name: 'Стриппер', price: 7800 },
      { article: 'TOOL-CRIMP', name: 'Кримпер', price: 13200 },
      { article: 'TOOL-TESTER', name: 'Тестер напряжения', price: 4900 },
    ],
  },
  {
    article: 'KIT-DEMO-HAMMER-16',
    name: 'Ударный инструмент',
    previewUrl: null,
    shelfUnits: 1,
    sizeLabel: '1/6 полки',
    priceEmpty: 2400,
    priceWithTools: 11600,
    includedTools: [
      { article: 'TOOL-HAM-500', name: 'Молоток 500 г', price: 3100 },
      { article: 'TOOL-PUNCH', name: 'Кернер', price: 1200 },
    ],
  },
];

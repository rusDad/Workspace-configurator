import type { ModuleSizeLabel, ShelfUnits, ToolItem } from '../catalog/catalogTypes';

export interface CustomLaymentLaunchRequest {
  shelfId: string;
  shelfName: string;
  widthMm: number;
  heightMm: number;
  maxLaymentHeightMm: number;
  remainingShelfUnits: number;
  parentCartArticle: string;
}

export interface CustomLaymentResult {
  orderId: string;
  orderNumber?: string;
  article: string;
  name: string;
  price: number;
  previewPngUrl: string | null;
  shelfUnits: ShelfUnits;
  sizeLabel: ModuleSizeLabel;
  laymentHeightMm: number;
  widthMm: number;
  heightMm: number;
  laymentType: 'foam-insert';
  composition: ToolItem[];
}

export async function launchCustomLayment(_request: CustomLaymentLaunchRequest): Promise<CustomLaymentResult | null> {
  return null;
}

export function createMockCustomLaymentResult(request: CustomLaymentLaunchRequest): CustomLaymentResult {
  return {
    orderId: `mock-layment-${request.shelfId}`,
    orderNumber: 'DEV-0001',
    article: 'CUSTOM-LAYOUT-DEMO',
    name: `Демо-ложемент для ${request.shelfName}`,
    price: 12000,
    previewPngUrl: null,
    shelfUnits: 2,
    sizeLabel: '1/3 полки',
    laymentHeightMm: Math.min(70, request.maxLaymentHeightMm),
    widthMm: request.widthMm,
    heightMm: request.heightMm,
    laymentType: 'foam-insert',
    composition: [],
  };
}

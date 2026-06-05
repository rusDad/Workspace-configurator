export type ShelfUnits = 1 | 2 | 4 | 6;

export type ModuleSizeLabel = '1/6 полки' | '1/3 полки' | '2/3 полки' | 'полка целиком';

export interface ToolItem {
  article: string;
  name: string;
  price: number;
}

export interface CartShelf {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  capacityUnits: 6;
}

export interface ToolCart {
  article: string;
  name: string;
  previewUrl: string;
  price: number;
  shelves: CartShelf[];
}

export interface CatalogFoamInsertKit {
  article: string;
  name: string;
  previewUrl: string | null;
  shelfUnits: ShelfUnits;
  sizeLabel: ModuleSizeLabel;
  priceEmpty: number;
  priceWithTools: number;
  includedTools: ToolItem[];
}

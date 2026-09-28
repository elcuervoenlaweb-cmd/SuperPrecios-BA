export type SupermarketId = 'carrefour' | 'coto' | 'makro' | 'abastecedor' | 'disco' | 'jumbo' | 'dia';

export interface SupermarketInfo {
  id: SupermarketId;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  logoUrl?: string;
  websiteUrl: string;
  category: 'Hipermercado' | 'Mayorista' | 'Supermercado' | 'Cercanía';
  bankBenefits: {
    bbva?: string;
    santander?: string;
    naranja?: string;
    propia?: string;
  };
  bestDays: {
    day: string;
    deal: string;
    bank: string;
  }[];
}

export interface SupermarketPrice {
  unitPrice: number;
  promoUnitPrice?: number;
  promoDescription?: string;
  promoType?: '2x1' | '2do_70' | '2do_50' | '3x2' | '4x3' | '35_off' | 'bulto' | 'none';
  promoMinQty?: number;
  bestDay?: string;
  bestBank?: string;
  bestBankDiscountPct?: number;
  bestNetPrice?: number;
  sku?: string;
  productUrl?: string;
  bulkUnitPrice?: number;
  bulkMinQuantity?: number;
  inStock: boolean;
}

export interface InvoiceProduct {
  id: string;
  barcode: string;
  name: string;
  category: 'Lácteos y Frescos' | 'Almacén y Pastas' | 'Congelados' | 'Perfumería e Higiene' | 'Snacks y Galletitas';
  quantity: number;
  selected?: boolean;
  unit: string;
  iconType?: string;
  invoicePriceUnit: number;
  invoiceTotal: number;
  invoicePromoUnit?: number;
  invoicePromoTotal?: number;
  invoicePromoNote?: string;
  prices: Record<SupermarketId, SupermarketPrice>;
}

export type BankCardType = 'none' | 'bbva' | 'santander' | 'naranja' | 'carrefour_card' | 'cuentadni';

export type PurchaseStrategy = 'winner' | 'optimized';

export interface BankConfig {
  id: BankCardType;
  name: string;
  description: string;
  supermarketDiscount: Record<SupermarketId, { percentage: number; maxCap: number; dayRule: string }>;
}

export interface StoreCalculation {
  storeId: SupermarketId;
  storeName: string;
  grossTotal: number;
  promoTotal: number;
  bankDiscount: number;
  netFinalTotal: number;
  monthlyOnePurchase: number;
  monthlyBiweekly: number;
  monthlyWeekly: number;
  itemsWithBestPrice: number;
}

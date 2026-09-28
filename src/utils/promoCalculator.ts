import { BankCardType, InvoiceProduct, SupermarketId } from '../types/products';
import { SUPERMARKETS, BANK_CONFIGS } from '../data/invoiceProducts';

export interface EnrichedStorePrice {
  unitPrice: number;
  promoUnitPrice: number;
  promoDescription?: string;
  promoType: '2x1' | '2do_70' | '2do_50' | '3x2' | '4x3' | '35_off' | 'bulto' | 'none';
  promoMinQty: number;
  promoLabel: string;
  isVolumePromo: boolean;
  isPromoActive: boolean;
  missingQtyForPromo: number;
  nextPromoQty: number;
  bestDay: string;
  bestBank: string;
  bestBankDiscountPct: number;
  bestBankCap: number;
  sku: string;
  productUrl: string;
}

export interface StoreTotalCalculation {
  storeId: SupermarketId;
  storeName: string;
  baseGondolaTotal: number;
  bankName: string;
  bestDay: string;
  bankDiscountPct: number;
  unconstrainedBankDiscount: number;
  maxCap: number;
  actualBankDiscount: number;
  isCapReached: boolean;
  capUtilizationPct: number;
  netFinalTotal: number;
}

// Map each supermarket to its prime discount day and bank promotion
export const SUPERMARKET_BEST_DAYS: Record<
  SupermarketId,
  {
    day: string;
    bankName: string;
    cardType: BankCardType;
    discountPct: number;
    maxCap: number;
    ruleDetail: string;
  }
> = {
  coto: {
    day: 'Viernes',
    bankName: 'BBVA (MODO)',
    cardType: 'bbva',
    discountPct: 25,
    maxCap: 15000,
    ruleDetail: '25% reintegro viernes con MODO BBVA (tope $15.000 en el total)',
  },
  carrefour: {
    day: 'Miércoles',
    bankName: 'Santander Select',
    cardType: 'santander',
    discountPct: 20,
    maxCap: 10000,
    ruleDetail: '20% off miércoles con Santander Select (tope $10.000) o Mi Carrefour (tope $25.000)',
  },
  makro: {
    day: 'Jueves',
    bankName: 'BBVA / Mayorista',
    cardType: 'bbva',
    discountPct: 20,
    maxCap: 12000,
    ruleDetail: '20% reintegro BBVA (tope $12.000) + precios bulto cerrado sin tope',
  },
  abastecedor: {
    day: 'Sábados',
    bankName: 'Cuenta DNI / Naranja X',
    cardType: 'cuentadni',
    discountPct: 25,
    maxCap: 8000,
    ruleDetail: '25% reintegro Cuenta DNI sábados (tope $8.000) o Naranja X (tope $8.000)',
  },
  disco: {
    day: 'Lunes',
    bankName: 'Santander Black',
    cardType: 'santander',
    discountPct: 20,
    maxCap: 12000,
    ruleDetail: '20% de ahorro Santander Black (tope $12.000)',
  },
  jumbo: {
    day: 'Lunes',
    bankName: 'Santander Select',
    cardType: 'santander',
    discountPct: 25,
    maxCap: 15000,
    ruleDetail: '25% de ahorro Santander Select lunes (tope $15.000)',
  },
  dia: {
    day: 'Martes',
    bankName: 'Tarjeta Naranja X',
    cardType: 'naranja',
    discountPct: 25,
    maxCap: 8000,
    ruleDetail: '25% de ahorro con Tarjeta Naranja X (tope $8.000) y Plan Z',
  },
};

export function detectPromoType(desc?: string): {
  promoType: '2x1' | '2do_70' | '2do_50' | '3x2' | '4x3' | '35_off' | 'bulto' | 'none';
  promoMinQty: number;
  promoLabel: string;
} {
  if (!desc) {
    return { promoType: 'none', promoMinQty: 1, promoLabel: '' };
  }
  const lower = desc.toLowerCase();

  if (lower.includes('2do al 70') || lower.includes('2° al 70') || lower.includes('segundo al 70')) {
    return { promoType: '2do_70', promoMinQty: 2, promoLabel: '2° al 70%' };
  }
  if (lower.includes('2do al 50') || lower.includes('2° al 50') || lower.includes('segundo al 50')) {
    return { promoType: '2do_50', promoMinQty: 2, promoLabel: '2° al 50%' };
  }
  if (lower.includes('2do al 60') || lower.includes('2° al 60')) {
    return { promoType: '2do_70', promoMinQty: 2, promoLabel: '2° al 60%' };
  }
  if (lower.includes('2x1')) {
    return { promoType: '2x1', promoMinQty: 2, promoLabel: '2x1' };
  }
  if (lower.includes('3x2')) {
    return { promoType: '3x2', promoMinQty: 3, promoLabel: '3x2' };
  }
  if (lower.includes('4x3')) {
    return { promoType: '4x3', promoMinQty: 4, promoLabel: '4x3' };
  }
  if (lower.includes('35%') || lower.includes('35 %')) {
    return { promoType: '35_off', promoMinQty: 1, promoLabel: '35% OFF' };
  }
  if (lower.includes('40%') || lower.includes('40 %')) {
    return { promoType: '35_off', promoMinQty: 1, promoLabel: '40% OFF' };
  }
  if (lower.includes('30%') || lower.includes('30 %')) {
    return { promoType: '35_off', promoMinQty: 1, promoLabel: '30% OFF' };
  }
  if (lower.includes('bulto') || lower.includes('mayorista') || lower.includes('pack')) {
    let min = 2;
    if (lower.includes('x24') || lower.includes('24l') || lower.includes('24 unid')) min = 24;
    else if (lower.includes('x12') || lower.includes('12')) min = 12;
    else if (lower.includes('x6') || lower.includes('6')) min = 6;
    else if (lower.includes('x4') || lower.includes('4')) min = 4;
    return { promoType: 'bulto', promoMinQty: min, promoLabel: `Pack x${min}` };
  }

  return { promoType: 'none', promoMinQty: 1, promoLabel: '' };
}

export function getEnrichedPrice(
  product: InvoiceProduct,
  storeId: SupermarketId,
  currentQty: number = product.quantity,
  userSelectedBank?: BankCardType
): EnrichedStorePrice {
  const storePrice = product.prices[storeId];
  const unitPrice = storePrice.unitPrice;
  const promoUnitPrice = storePrice.promoUnitPrice !== undefined ? storePrice.promoUnitPrice : unitPrice;
  const promoDesc = storePrice.promoDescription;

  const { promoType, promoMinQty, promoLabel } = detectPromoType(promoDesc);
  const isVolumePromo = promoType === '2do_70' || promoType === '2do_50' || promoType === '2x1' || promoType === '3x2' || promoType === '4x3' || promoType === 'bulto';

  // Check if current quantity activates promo
  let isPromoActive = false;
  let missingQtyForPromo = 0;
  let nextPromoQty = currentQty;

  if (isVolumePromo) {
    if (promoType === '2do_70' || promoType === '2do_50' || promoType === '2x1') {
      isPromoActive = currentQty >= 2 && currentQty % 2 === 0;
      if (currentQty % 2 !== 0) {
        missingQtyForPromo = 1;
        nextPromoQty = currentQty + 1;
      }
    } else if (promoType === '3x2') {
      isPromoActive = currentQty >= 3 && currentQty % 3 === 0;
      missingQtyForPromo = currentQty % 3 === 0 ? 0 : 3 - (currentQty % 3);
      nextPromoQty = currentQty + missingQtyForPromo;
    } else if (promoType === '4x3') {
      isPromoActive = currentQty >= 4 && currentQty % 4 === 0;
      missingQtyForPromo = currentQty % 4 === 0 ? 0 : 4 - (currentQty % 4);
      nextPromoQty = currentQty + missingQtyForPromo;
    } else if (promoType === 'bulto') {
      isPromoActive = currentQty >= promoMinQty;
      missingQtyForPromo = currentQty >= promoMinQty ? 0 : promoMinQty - currentQty;
      nextPromoQty = currentQty >= promoMinQty ? currentQty : promoMinQty;
    }
  } else {
    isPromoActive = promoUnitPrice < unitPrice;
  }

  // Best day & bank rule
  const bestDayConfig = SUPERMARKET_BEST_DAYS[storeId];
  const bestDay = bestDayConfig.day;
  const bestBank = bestDayConfig.bankName;
  let activeDiscountPct = bestDayConfig.discountPct;
  let activeCap = bestDayConfig.maxCap;

  if (userSelectedBank && userSelectedBank !== 'none') {
    const userBankRule = BANK_CONFIGS[userSelectedBank]?.supermarketDiscount[storeId];
    if (userBankRule && userBankRule.percentage > 0) {
      activeDiscountPct = userBankRule.percentage;
      activeCap = userBankRule.maxCap;
    }
  }

  // SKU and direct store search URL
  const sku = product.barcode;
  let productUrl = '';
  switch (storeId) {
    case 'coto':
      productUrl = `https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=${encodeURIComponent(product.barcode)}`;
      break;
    case 'carrefour':
      productUrl = `https://www.carrefour.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
      break;
    case 'jumbo':
      productUrl = `https://www.jumbo.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
      break;
    case 'disco':
      productUrl = `https://www.disco.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
      break;
    case 'dia':
      productUrl = `https://diaonline.supermercadosdia.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
      break;
    case 'makro':
      productUrl = `https://compra.makro.com.ar/buscar?q=${encodeURIComponent(product.barcode)}`;
      break;
    case 'abastecedor':
      productUrl = `https://elabastecedor.com.ar/buscar?q=${encodeURIComponent(product.barcode)}`;
      break;
  }

  return {
    unitPrice,
    promoUnitPrice,
    promoDescription: promoDesc,
    promoType,
    promoMinQty,
    promoLabel,
    isVolumePromo,
    isPromoActive,
    missingQtyForPromo,
    nextPromoQty,
    bestDay,
    bestBank,
    bestBankDiscountPct: activeDiscountPct,
    bestBankCap: activeCap,
    sku,
    productUrl,
  };
}

/**
 * Calculates store total basket applying store promos first, and applying the bank discount CAP on the total basket.
 */
export function calculateStoreTotalWithCap(
  storeId: SupermarketId,
  products: InvoiceProduct[],
  selectedBank?: BankCardType
): StoreTotalCalculation {
  const storeInfo = SUPERMARKETS.find((s) => s.id === storeId) || SUPERMARKETS[0];
  const bestDayConfig = SUPERMARKET_BEST_DAYS[storeId];

  let bankPct = bestDayConfig.discountPct;
  let maxCap = bestDayConfig.maxCap;
  let bankName = bestDayConfig.bankName;

  if (selectedBank && selectedBank !== 'none') {
    const userBankRule = BANK_CONFIGS[selectedBank]?.supermarketDiscount[storeId];
    if (userBankRule && userBankRule.percentage > 0) {
      bankPct = userBankRule.percentage;
      maxCap = userBankRule.maxCap;
      bankName = BANK_CONFIGS[selectedBank].name;
    } else if (userBankRule && userBankRule.percentage === 0) {
      bankPct = 0;
      maxCap = 0;
      bankName = 'Sin descuento de este banco';
    }
  }

  // 1. Calculate base basket using store promos (2do al 70%, 2do al 50%, bulto, etc. which have no bank cap)
  const activeProducts = products.filter((p) => p.selected !== false);
  let baseGondolaTotal = 0;

  activeProducts.forEach((p) => {
    const sp = p.prices[storeId];
    const effUnit = sp.promoUnitPrice !== undefined ? sp.promoUnitPrice : sp.unitPrice;
    baseGondolaTotal += effUnit * p.quantity;
  });

  // 2. Calculate unconstrained bank discount
  const unconstrainedBankDiscount = bankPct > 0 ? (baseGondolaTotal * bankPct) / 100 : 0;

  // 3. Apply the cap (tope de reintegro)
  let actualBankDiscount = unconstrainedBankDiscount;
  let isCapReached = false;

  if (maxCap > 0 && actualBankDiscount > maxCap) {
    actualBankDiscount = maxCap;
    isCapReached = true;
  }

  const capUtilizationPct = maxCap > 0 ? Math.min(100, Math.round((actualBankDiscount / maxCap) * 100)) : 0;
  const netFinalTotal = baseGondolaTotal - actualBankDiscount;

  return {
    storeId,
    storeName: storeInfo.name,
    baseGondolaTotal,
    bankName,
    bestDay: bestDayConfig.day,
    bankDiscountPct: bankPct,
    unconstrainedBankDiscount,
    maxCap,
    actualBankDiscount,
    isCapReached,
    capUtilizationPct,
    netFinalTotal,
  };
}

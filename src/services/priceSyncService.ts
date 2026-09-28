import { InvoiceProduct } from '../types/products';
import { SUPERMARKET_BEST_DAYS } from '../utils/promoCalculator';
import { KNOWN_ARGENTINA_EANS } from './eanCatalog';

export interface PriceSyncStatus {
  lastSyncTimestamp: number;
  lastSyncShift: 'mañana' | 'tarde';
  lastSyncFormatted: string;
  nextScheduledShift: string;
  isUpToDate: boolean;
  totalProductsUpdated: number;
}

const STORAGE_KEY = 'superprecios_sync_status_v1';

export function getSyncStatus(): PriceSyncStatus {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const now = new Date();
      const last = new Date(data.lastSyncTimestamp);
      const isSameDay = now.toDateString() === last.toDateString();
      const currentHour = now.getHours();
      const currentShift = currentHour < 14 ? 'mañana' : 'tarde';

      return {
        ...data,
        isUpToDate: isSameDay && data.lastSyncShift === currentShift,
      };
    }
  } catch (e) {
    console.error(e);
  }

  // Default initial status
  const now = new Date();
  const currentHour = now.getHours();
  const currentShift = currentHour < 14 ? 'mañana' : 'tarde';
  const nextShift = currentHour < 14 ? '14:30 hs (Turno Tarde)' : '08:00 hs (Turno Mañana)';

  return {
    lastSyncTimestamp: Date.now() - 1000 * 60 * 30, // 30 min ago
    lastSyncShift: currentShift,
    lastSyncFormatted: `Hoy ${now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs (Turno ${currentShift === 'mañana' ? 'Mañana' : 'Tarde'})`,
    nextScheduledShift: nextShift,
    isUpToDate: true,
    totalProductsUpdated: 15,
  };
}

export function saveSyncStatus(shift: 'mañana' | 'tarde', count: number): PriceSyncStatus {
  const now = new Date();
  const nextShift = shift === 'mañana' ? '14:30 hs (Turno Tarde)' : 'Mañana 08:00 hs (Turno Mañana)';
  const formatted = `Hoy ${now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs (Turno ${shift === 'mañana' ? 'Mañana' : 'Tarde'})`;

  const newStatus: PriceSyncStatus = {
    lastSyncTimestamp: Date.now(),
    lastSyncShift: shift,
    lastSyncFormatted: formatted,
    nextScheduledShift: nextShift,
    isUpToDate: true,
    totalProductsUpdated: count,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
  } catch (e) {
    console.error(e);
  }

  return newStatus;
}

/**
 * Simulates a deep sync against official supermarket digital catalogs and bank promotions
 */
export async function executeDailyCatalogSync(
  currentProducts: InvoiceProduct[]
): Promise<{ updatedProducts: InvoiceProduct[]; status: PriceSyncStatus }> {
  // Simulate network fetch from supermarket pricing endpoints
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const now = new Date();
  const currentHour = now.getHours();
  const currentShift: 'mañana' | 'tarde' = currentHour < 14 ? 'mañana' : 'tarde';

  // Day-of-week active bank deals
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const todayName = dayNames[now.getDay()];

  // Update products with verified benchmark pricing and active daily volume promos
  const updatedProducts = currentProducts.map((p) => {
    const known = KNOWN_ARGENTINA_EANS[p.barcode];
    if (!known) return p;

    // Refresh store prices
    const updatedPrices = { ...p.prices };

    // Example: On Fridays (Coto Day), activate Coto 2do al 70% on grocery staples
    if (todayName === 'viernes' || todayName === 'sábado') {
      if (p.category === 'Lácteos y Frescos' || p.category === 'Almacén y Pastas') {
        if (!updatedPrices.coto.promoDescription || updatedPrices.coto.promoDescription.includes('Góndola')) {
          updatedPrices.coto.promoDescription = '2do al 70% Coto Fin de Semana';
          updatedPrices.coto.promoUnitPrice = Math.round(updatedPrices.coto.unitPrice * 0.65);
        }
      }
    }

    // Keep known latest verified benchmark prices
    if (p.barcode === '7790742373304' || p.name.includes('7790742373304')) {
      p.name = 'Queso untable Finlandia light pote 290 g';
      p.category = 'Lácteos y Frescos';
      p.iconType = 'dairy';
      updatedPrices.carrefour = { unitPrice: 5699, promoUnitPrice: 5699, promoDescription: 'Precio góndola online Carrefour', inStock: true };
      updatedPrices.jumbo = { unitPrice: 5900, promoDescription: 'Precio góndola Jumbo Online', inStock: true };
      updatedPrices.disco = { unitPrice: 5550, promoDescription: 'Precio góndola Disco Online', inStock: true };
      updatedPrices.dia = { unitPrice: 5698, promoUnitPrice: 4273.5, promoDescription: 'Club Día %', inStock: true };
      updatedPrices.coto = { unitPrice: 5650, promoDescription: 'Precio góndola Coto Digital', inStock: true };
      updatedPrices.makro = { unitPrice: 5129, promoUnitPrice: 4890, promoDescription: 'Escala mayorista', inStock: true };
      updatedPrices.abastecedor = { unitPrice: 5290, promoUnitPrice: 5290, promoDescription: 'Precio mostrador', inStock: true };
    } else if (p.barcode === '7790272000831') {
      // Aceite Natura
      updatedPrices.coto.unitPrice = 4429;
      updatedPrices.coto.promoUnitPrice = 4429;
      updatedPrices.coto.promoDescription = 'Precio de lista Coto Digital (Sin promo)';
    } else if (p.barcode === '7500435219655') {
      // Espuma Gillette
      updatedPrices.carrefour.unitPrice = 15929;
      updatedPrices.carrefour.promoUnitPrice = 15929;
    }

    return {
      ...p,
      prices: updatedPrices,
    };
  });

  const status = saveSyncStatus(currentShift, updatedProducts.length);
  return { updatedProducts, status };
}

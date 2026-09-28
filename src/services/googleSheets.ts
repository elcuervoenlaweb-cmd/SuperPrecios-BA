import { BankCardType, InvoiceProduct, SupermarketId } from '../types/products';
import { BANK_CONFIGS, SUPERMARKETS } from '../data/invoiceProducts';
import { resolveEanToProduct, KNOWN_ARGENTINA_EANS } from './eanCatalog';
import { fetchLiveProductByEan } from './liveEanService';

export interface CreateSheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

export interface SheetImportResult {
  products: InvoiceProduct[];
  addedCount: number;
  updatedCount: number;
  newEansDetected: string[];
}

/**
 * Creates and formats the Master Editable Catalog in Google Sheets
 */
export const createAndPopulateGoogleSheet = async (
  accessToken: string,
  products: InvoiceProduct[],
  selectedBank: BankCardType
): Promise<CreateSheetResult> => {
  if (!accessToken) {
    throw new Error('Token de acceso requerido para Google Sheets.');
  }

  // 1. Create Spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `SuperPrecios BA - Catálogo Maestro y Comparador (${new Date().toLocaleDateString('es-AR')})`,
      },
      sheets: [
        {
          properties: {
            sheetId: 0,
            title: 'Catálogo Maestro (Editable)',
            gridProperties: { frozenRowCount: 2, frozenColumnCount: 2 },
          },
        },
        {
          properties: {
            sheetId: 1,
            title: 'Descuentos Bancarios y Totales',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            sheetId: 2,
            title: 'Proyección Mensual y Ganador',
          },
        },
      ],
    }),
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Error al crear la hoja de cálculo en Google Drive');
  }

  const sheetData = await createResponse.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Prepare Data for Sheet 1: Catálogo Maestro
  const header1 = [
    'Código EAN (Solo ingresá esto para agregar)',
    'Detalle de Producto',
    'Categoría',
    'Cantidad',
    'Coto Góndola',
    'Promo Coto (ej: 2do al 70%)',
    'Carrefour Góndola',
    'Promo Carrefour',
    'Makro Góndola',
    'Promo Makro',
    'El Abastecedor',
    'Disco Góndola',
    'Jumbo Góndola',
    'Día % Góndola',
    'Supermercado Más Barato',
    'Mejor Precio Unitario'
  ];

  const rows1 = products.map((p) => {
    const coto = p.prices.coto.promoUnitPrice || p.prices.coto.unitPrice;
    const carrefour = p.prices.carrefour.promoUnitPrice || p.prices.carrefour.unitPrice;
    const makro = p.prices.makro.promoUnitPrice || p.prices.makro.unitPrice;
    const abast = p.prices.abastecedor.promoUnitPrice || p.prices.abastecedor.unitPrice;
    const disco = p.prices.disco.promoUnitPrice || p.prices.disco.unitPrice;
    const jumbo = p.prices.jumbo.promoUnitPrice || p.prices.jumbo.unitPrice;
    const dia = p.prices.dia.promoUnitPrice || p.prices.dia.unitPrice;

    const list = [
      { name: 'Coto', price: coto },
      { name: 'Carrefour', price: carrefour },
      { name: 'Makro', price: makro },
      { name: 'El Abastecedor', price: abast },
      { name: 'Disco', price: disco },
      { name: 'Jumbo', price: jumbo },
      { name: 'Día %', price: dia },
    ];
    list.sort((a, b) => a.price - b.price);
    const best = list[0];

    return [
      p.barcode,
      p.name,
      p.category,
      p.quantity,
      p.prices.coto.unitPrice,
      p.prices.coto.promoDescription || '',
      p.prices.carrefour.unitPrice,
      p.prices.carrefour.promoDescription || '',
      p.prices.makro.unitPrice,
      p.prices.makro.promoDescription || '',
      p.prices.abastecedor.unitPrice,
      p.prices.disco.unitPrice,
      p.prices.jumbo.unitPrice,
      p.prices.dia.unitPrice,
      best.name,
      best.price
    ];
  });

  // 3. Bank totals
  const bankHeader = [
    'Supermercado',
    'Total Carrito (Góndola)',
    'Descuento ' + BANK_CONFIGS[selectedBank].name,
    'Tope Máximo Reintegro',
    'Total Final a Pagar',
    'Día Más Conveniente'
  ];

  const bankRows = SUPERMARKETS.map((s) => {
    let storeTotal = 0;
    products.forEach((p) => {
      const price = p.prices[s.id];
      const eff = price.promoUnitPrice || price.unitPrice;
      storeTotal += eff * p.quantity;
    });

    const bankRule = BANK_CONFIGS[selectedBank].supermarketDiscount[s.id];
    let discount = 0;
    if (bankRule && bankRule.percentage > 0) {
      discount = (storeTotal * bankRule.percentage) / 100;
      if (bankRule.maxCap > 0 && discount > bankRule.maxCap) {
        discount = bankRule.maxCap;
      }
    }
    const net = storeTotal - discount;

    return [
      s.name,
      Math.round(storeTotal),
      Math.round(discount),
      bankRule?.maxCap ? `$${bankRule.maxCap.toLocaleString('es-AR')}` : 'Sin tope',
      Math.round(net),
      bankRule?.dayRule || 'Días de promoción'
    ];
  });

  // Write values
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: [
        {
          range: "'Catálogo Maestro (Editable)'!A1",
          values: [
            ['💡 INSTRUCCIONES: Podés agregar un nuevo producto escribiendo SOLAMENTE el Código EAN en una nueva fila. La app lo reconocerá automáticamente y completará sus precios.'],
            header1,
            ...rows1,
          ],
        },
        {
          range: "'Descuentos Bancarios y Totales'!A1",
          values: [bankHeader, ...bankRows],
        },
      ],
    }),
  });

  // Format Header styling
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 1,
              endRowIndex: 2,
              startColumnIndex: 0,
              endColumnIndex: header1.length,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.08, green: 0.5, blue: 0.24 },
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                horizontalAlignment: 'CENTER',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: header1.length,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.98, green: 0.95, blue: 0.8 },
                textFormat: { bold: true, italic: true, foregroundColor: { red: 0.45, green: 0.25, blue: 0.05 } },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        },
      ],
    }),
  });

  return { spreadsheetId, spreadsheetUrl };
};

/**
 * Reads products from Google Sheet and automatically resolves any row containing just an EAN code
 */
export const importProductsFromGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  existingProducts: InvoiceProduct[] = []
): Promise<SheetImportResult> => {
  if (!accessToken || !spreadsheetId) {
    throw new Error('Faltan credenciales de Google Sheets o el ID de la hoja.');
  }

  // 1. Fetch rows from Sheet 1
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Catálogo Maestro (Editable)'!A3:P100`;
  const response = await fetch(readUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    // Try fallback sheet title
    const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Comparativa de Precios'!A3:U100`;
    const fallbackRes = await fetch(fallbackUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!fallbackRes.ok) {
      throw new Error('No se pudo leer la hoja de cálculo. Asegurate de que el archivo exista y esté accesible.');
    }
    const fallbackData = await fallbackRes.json();
    return await parseRowsIntoProducts(fallbackData.values || [], existingProducts);
  }

  const data = await response.json();
  const rows: any[][] = data.values || [];
  return await parseRowsIntoProducts(rows, existingProducts);
};

async function parseRowsIntoProducts(
  rows: any[][],
  existingProducts: InvoiceProduct[]
): Promise<SheetImportResult> {
  const existingMap = new Map<string, InvoiceProduct>();
  existingProducts.forEach((p) => existingMap.set(p.barcode.trim(), p));

  const importedProducts: InvoiceProduct[] = [];
  const newEansDetected: string[] = [];
  let updatedCount = 0;
  let addedCount = 0;

  for (const row of rows) {
    if (!row || !row[0]) continue;
    const rawEan = String(row[0]).trim();
    if (!rawEan || rawEan.toLowerCase().includes('código') || rawEan.toLowerCase().includes('instrucciones')) {
      continue;
    }

    const existing = existingMap.get(rawEan);

    // Columns:
    // 0: EAN
    // 1: Name (optional)
    // 2: Category (optional)
    // 3: Qty (optional)
    // 4: Coto Price
    // 5: Coto Promo
    // 6: Carrefour Price
    // 7: Carrefour Promo
    // 8: Makro Price
    // 9: Makro Promo
    // 10: Abastecedor Price
    // 11: Disco Price
    // 12: Jumbo Price
    // 13: Dia Price
    const sheetName = row[1] ? String(row[1]).trim() : undefined;
    const rawCategory = row[2] ? String(row[2]).trim() : undefined;
    const validCats: InvoiceProduct['category'][] = [
      'Almacén y Pastas',
      'Lácteos y Frescos',
      'Congelados',
      'Perfumería e Higiene',
      'Snacks y Galletitas',
    ];
    const sheetCategory: InvoiceProduct['category'] | undefined = validCats.includes(rawCategory as any)
      ? (rawCategory as InvoiceProduct['category'])
      : undefined;

    const sheetQty = row[3] ? parseInt(String(row[3]).replace(/[^0-9]/g, ''), 10) || 1 : 1;

    let product: InvoiceProduct;

    if (existing) {
      // Update existing product with sheet values
      product = {
        ...existing,
        name: sheetName || existing.name,
        category: sheetCategory || existing.category,
        quantity: sheetQty,
      };

      // Custom prices from sheet if entered
      const cotoPrice = parseFloat(String(row[4]).replace(/[^0-9.]/g, ''));
      if (!isNaN(cotoPrice) && cotoPrice > 0) {
        product.prices.coto.unitPrice = cotoPrice;
      }
      if (row[5]) product.prices.coto.promoDescription = String(row[5]);

      const carrefourPrice = parseFloat(String(row[6]).replace(/[^0-9.]/g, ''));
      if (!isNaN(carrefourPrice) && carrefourPrice > 0) {
        product.prices.carrefour.unitPrice = carrefourPrice;
      }
      if (row[7]) product.prices.carrefour.promoDescription = String(row[7]);

      const makroPrice = parseFloat(String(row[8]).replace(/[^0-9.]/g, ''));
      if (!isNaN(makroPrice) && makroPrice > 0) {
        product.prices.makro.unitPrice = makroPrice;
      }

      updatedCount++;
    } else {
      // NEW PRODUCT ADDED ONLY WITH EAN! Fetch live prices & product name from official APIs
      product = await fetchLiveProductByEan(rawEan, sheetQty);
      if (sheetName) product.name = sheetName;
      if (sheetCategory) product.category = sheetCategory;
      newEansDetected.push(rawEan);
      addedCount++;
    }

    importedProducts.push(product);
  }

  return {
    products: importedProducts.length > 0 ? importedProducts : existingProducts,
    addedCount,
    updatedCount,
    newEansDetected,
  };
}

export const exportToCsv = (products: InvoiceProduct[]): string => {
  const headers = [
    'Código EAN',
    'Producto',
    'Categoría',
    'Cantidad',
    'Carrefour Factura Unit',
    'Carrefour Factura Total',
    'Coto Unit',
    'Coto Total',
    'Makro Unit',
    'Makro Total',
    'El Abastecedor Unit',
    'Disco Unit',
    'Jumbo Unit',
    'Día % Unit',
  ];

  const rows = products.map((p) => [
    `"${p.barcode}"`,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.category}"`,
    p.quantity,
    p.invoicePromoUnit || p.invoicePriceUnit,
    p.invoicePromoTotal || p.invoiceTotal,
    p.prices.coto.promoUnitPrice || p.prices.coto.unitPrice,
    (p.prices.coto.promoUnitPrice || p.prices.coto.unitPrice) * p.quantity,
    p.prices.makro.promoUnitPrice || p.prices.makro.unitPrice,
    (p.prices.makro.promoUnitPrice || p.prices.makro.unitPrice) * p.quantity,
    p.prices.abastecedor.promoUnitPrice || p.prices.abastecedor.unitPrice,
    p.prices.disco.promoUnitPrice || p.prices.disco.unitPrice,
    p.prices.jumbo.promoUnitPrice || p.prices.jumbo.unitPrice,
    p.prices.dia.promoUnitPrice || p.prices.dia.unitPrice,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

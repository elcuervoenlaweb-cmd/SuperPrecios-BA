import { InvoiceProduct, SupermarketId } from '../types/products';
import { SUPERMARKETS } from '../data/invoiceProducts';

export interface CartItemPayload {
  product: InvoiceProduct;
  quantity: number;
  barcode: string;
  sku: string;
  name: string;
  searchUrl: string;
  searchTerm: string;
}

export interface GeneratedStoreCart {
  storeId: SupermarketId;
  storeName: string;
  cartUrl: string;
  isDirectCartAddSupported: boolean;
  requiresSessionExplanation: boolean;
  items: CartItemPayload[];
  bookmarkletScript: string;
  plainTextList: string;
}

/**
 * Generates the cart payloads, deep links, and automated loaders for Argentine supermarkets
 */
export function generateSupermarketCart(
  storeId: SupermarketId,
  items: { product: InvoiceProduct; quantity: number }[]
): GeneratedStoreCart {
  const storeInfo = SUPERMARKETS.find((s) => s.id === storeId) || SUPERMARKETS[0];

  const cartItems: CartItemPayload[] = items.map(({ product, quantity }) => {
    let searchUrl = '';
    // Use cleaned product name for broad keyword search in Coto & Makro
    const cleanSearchTerm = product.name
      .replace(/x\s*\d+\s*(g|gr|grs|cc|un|unid|potes|bolsas|litros)/gi, '')
      .replace(/bolsa|cilindro|brik/gi, '')
      .trim();

    switch (storeId) {
      case 'coto':
        // Coto Digital search URL by name and EAN
        searchUrl = `https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=${encodeURIComponent(cleanSearchTerm)}`;
        break;
      case 'carrefour':
        searchUrl = `https://www.carrefour.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
        break;
      case 'jumbo':
        searchUrl = `https://www.jumbo.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
        break;
      case 'disco':
        searchUrl = `https://www.disco.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
        break;
      case 'dia':
        searchUrl = `https://diaonline.supermercadosdia.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
        break;
      case 'makro':
        searchUrl = `https://compra.makro.com.ar/buscar?q=${encodeURIComponent(cleanSearchTerm)}`;
        break;
      case 'abastecedor':
        searchUrl = `https://elabastecedor.com.ar/buscar?q=${encodeURIComponent(cleanSearchTerm)}`;
        break;
    }

    return {
      product,
      quantity,
      barcode: product.barcode,
      sku: product.barcode,
      name: product.name,
      searchUrl,
      searchTerm: cleanSearchTerm,
    };
  });

  let cartUrl = storeInfo.websiteUrl;
  let isDirectCartAddSupported = false;
  let requiresSessionExplanation = false;

  // 1. VTEX Supermarkets (Carrefour, Jumbo, Disco, Día) allow public multi-SKU cart injection URLs
  if (storeId === 'carrefour') {
    isDirectCartAddSupported = true;
    const queryParams = cartItems
      .map((item) => `sku=${encodeURIComponent(item.sku)}&qty=${item.quantity}&seller=1`)
      .join('&');
    cartUrl = `https://www.carrefour.com.ar/checkout/cart/add?${queryParams}`;
  } else if (storeId === 'jumbo') {
    isDirectCartAddSupported = true;
    const queryParams = cartItems
      .map((item) => `sku=${encodeURIComponent(item.sku)}&qty=${item.quantity}&seller=1`)
      .join('&');
    cartUrl = `https://www.jumbo.com.ar/checkout/cart/add?${queryParams}`;
  } else if (storeId === 'disco') {
    isDirectCartAddSupported = true;
    const queryParams = cartItems
      .map((item) => `sku=${encodeURIComponent(item.sku)}&qty=${item.quantity}&seller=1`)
      .join('&');
    cartUrl = `https://www.disco.com.ar/checkout/cart/add?${queryParams}`;
  } else if (storeId === 'dia') {
    isDirectCartAddSupported = true;
    const queryParams = cartItems
      .map((item) => `sku=${encodeURIComponent(item.sku)}&qty=${item.quantity}&seller=1`)
      .join('&');
    cartUrl = `https://diaonline.supermercadosdia.com.ar/checkout/cart/add?${queryParams}`;
  } else if (storeId === 'coto') {
    // Coto Digital requires user ATG session
    requiresSessionExplanation = true;
    isDirectCartAddSupported = false;
    cartUrl = `https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=${encodeURIComponent(cartItems[0]?.searchTerm || 'almacen')}`;
  } else if (storeId === 'makro') {
    requiresSessionExplanation = true;
    isDirectCartAddSupported = false;
    cartUrl = `https://compra.makro.com.ar/carrinho`;
  } else if (storeId === 'abastecedor') {
    requiresSessionExplanation = true;
    isDirectCartAddSupported = false;
    cartUrl = `https://elabastecedor.com.ar/carrito`;
  }

  // Plain text list for fast copy/paste
  const plainTextList = cartItems
    .map((item, idx) => `${idx + 1}. ${item.name} - Cantidad: ${item.quantity} (EAN: ${item.barcode})`)
    .join('\n');

  // Interactive In-Page Changuito Assistant Bookmarklet for Coto Digital
  const itemsJson = JSON.stringify(
    cartItems.map((i) => ({
      name: i.name,
      qty: i.quantity,
      ean: i.barcode,
      term: i.searchTerm,
    }))
  );

  const bookmarkletScript = `javascript:(function(){
    var old = document.getElementById('spba-coto-toolbar');
    if(old) old.remove();
    var items = ${itemsJson};
    var tb = document.createElement('div');
    tb.id = 'spba-coto-toolbar';
    tb.style = 'position:fixed;bottom:15px;right:15px;z-index:99999999;width:350px;max-height:85vh;background:#0f172a;color:#f8fafc;padding:16px;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);font-family:system-ui,-apple-system,sans-serif;font-size:12px;border:2px solid #10b981;overflow-y:auto;';
    
    var h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #334155;">';
    h += '<strong style="font-size:14px;color:#34d399;">🛒 Changuito SuperPrecios BA</strong>';
    h += '<button onclick="this.closest(\\'#spba-coto-toolbar\\').remove()" style="background:#334155;color:#fff;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:12px;">✕</button></div>';
    h += '<p style="margin:0 0 10px;font-size:11px;color:#94a3b8;">Hacé clic en cada producto para buscarlo en Coto y agregarlo con su cantidad exacta:</p>';
    
    items.forEach(function(it, i){
      h += '<div style="background:#1e293b;padding:8px 10px;margin-bottom:6px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;gap:6px;">';
      h += '<div style="overflow:hidden;"><div style="font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px;" title="' + it.name + '">' + (i+1) + '. ' + it.name + '</div>';
      h += '<div style="font-size:10px;color:#34d399;">Llevar: <strong>' + it.qty + ' unid</strong></div></div>';
      h += '<a href="https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=' + encodeURIComponent(it.term) + '" style="background:#059669;color:#fff;padding:5px 9px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:11px;white-space:nowrap;">Buscar</a>';
      h += '</div>';
    });
    
    tb.innerHTML = h;
    document.body.appendChild(tb);
  })();`;

  return {
    storeId,
    storeName: storeInfo.name,
    cartUrl,
    isDirectCartAddSupported,
    requiresSessionExplanation,
    items: cartItems,
    bookmarkletScript,
    plainTextList,
  };
}

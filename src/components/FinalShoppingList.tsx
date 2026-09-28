import React, { useState } from 'react';
import { 
  ShoppingCart, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Printer, 
  Store, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Sparkles, 
  AlertCircle,
  Calendar,
  CreditCard,
  Zap
} from 'lucide-react';
import { BankCardType, InvoiceProduct, PurchaseStrategy, SupermarketId } from '../types/products';
import { BANK_CONFIGS, INVOICE_METADATA, SUPERMARKETS } from '../data/invoiceProducts';
import { GroceryIllustration } from './GroceryIllustrations';
import { generateSupermarketCart, GeneratedStoreCart } from '../utils/cartGenerator';
import { CartRedirectModal } from './CartRedirectModal';
import { getEnrichedPrice, SUPERMARKET_BEST_DAYS } from '../utils/promoCalculator';

interface FinalShoppingListProps {
  products: InvoiceProduct[];
  selectedBank: BankCardType;
  strategy: PurchaseStrategy;
  onSelectStrategy: (strat: PurchaseStrategy) => void;
  onOpenSheetsModal: () => void;
}

export const FinalShoppingList: React.FC<FinalShoppingListProps> = ({
  products,
  selectedBank,
  strategy,
  onSelectStrategy,
  onOpenSheetsModal,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedText, setCopiedText] = useState(false);
  const [activeCartModal, setActiveCartModal] = useState<GeneratedStoreCart | null>(null);

  const selectedProducts = products.filter((p) => p.selected !== false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 1. Calculate store totals to find winner for currently selected products
  const storeCalculations = SUPERMARKETS.map((store) => {
    let baseBasket = 0;
    selectedProducts.forEach((p) => {
      const price = p.prices[store.id];
      const effUnit = price.promoUnitPrice !== undefined ? price.promoUnitPrice : price.unitPrice;
      baseBasket += effUnit * p.quantity;
    });

    const bankRule = BANK_CONFIGS[selectedBank].supermarketDiscount[store.id];
    let bankDiscount = 0;
    if (bankRule && bankRule.percentage > 0) {
      bankDiscount = (baseBasket * bankRule.percentage) / 100;
      if (bankRule.maxCap > 0 && bankDiscount > bankRule.maxCap) {
        bankDiscount = bankRule.maxCap;
      }
    }

    const netTotal = baseBasket - bankDiscount;
    return {
      store,
      baseBasket,
      bankDiscount,
      netTotal,
      savingsVsCarrefour: INVOICE_METADATA.totalPaid - netTotal,
    };
  });

  storeCalculations.sort((a, b) => a.netTotal - b.netTotal);
  const winnerCalc = storeCalculations[0];
  const winnerStore = winnerCalc.store;

  // 2. Multitienda: Group products by their absolute cheapest supermarket
  const multitiendaGroups: Record<
    SupermarketId,
    {
      store: (typeof SUPERMARKETS)[0];
      items: {
        product: InvoiceProduct;
        unitPrice: number;
        totalPrice: number;
        promoDescription?: string;
      }[];
      subtotal: number;
    }
  > = {
    carrefour: { store: SUPERMARKETS.find((s) => s.id === 'carrefour')!, items: [], subtotal: 0 },
    coto: { store: SUPERMARKETS.find((s) => s.id === 'coto')!, items: [], subtotal: 0 },
    makro: { store: SUPERMARKETS.find((s) => s.id === 'makro')!, items: [], subtotal: 0 },
    abastecedor: { store: SUPERMARKETS.find((s) => s.id === 'abastecedor')!, items: [], subtotal: 0 },
    disco: { store: SUPERMARKETS.find((s) => s.id === 'disco')!, items: [], subtotal: 0 },
    jumbo: { store: SUPERMARKETS.find((s) => s.id === 'jumbo')!, items: [], subtotal: 0 },
    dia: { store: SUPERMARKETS.find((s) => s.id === 'dia')!, items: [], subtotal: 0 },
  };

  let totalOptimizedBasket = 0;

  selectedProducts.forEach((p) => {
    let minPrice = Infinity;
    let bestStoreId: SupermarketId = 'carrefour';
    let bestPromoDesc: string | undefined = undefined;

    SUPERMARKETS.forEach((s) => {
      const sp = p.prices[s.id];
      const eff = sp.promoUnitPrice !== undefined ? sp.promoUnitPrice : sp.unitPrice;
      if (eff < minPrice) {
        minPrice = eff;
        bestStoreId = s.id;
        bestPromoDesc = sp.promoDescription;
      }
    });

    const itemTotal = minPrice * p.quantity;
    multitiendaGroups[bestStoreId].items.push({
      product: p,
      unitPrice: minPrice,
      totalPrice: itemTotal,
      promoDescription: bestPromoDesc,
    });
    multitiendaGroups[bestStoreId].subtotal += itemTotal;
    totalOptimizedBasket += itemTotal;
  });

  // Calculate estimated bank savings on optimized multitienda
  const optimizedBankSaving = selectedBank !== 'none' ? Math.min(totalOptimizedBasket * 0.18, 12000) : 0;
  const netOptimizedTotal = totalOptimizedBasket - optimizedBankSaving;

  // Active stores in multitienda
  const activeStoresInMultitienda = Object.values(multitiendaGroups).filter(
    (g) => g.items.length > 0
  );

  // Trigger Checkout Cart for Winner Supermarket
  const handleCheckoutWinnerStore = () => {
    const cart = generateSupermarketCart(
      winnerStore.id,
      selectedProducts.map((p) => ({ product: p, quantity: p.quantity }))
    );
    // Open official store cart
    window.open(cart.cartUrl, '_blank');
    // Open in-app assistant modal
    setActiveCartModal(cart);
  };

  // Trigger Checkout Cart for Multitienda store group
  const handleCheckoutStoreGroup = (storeId: SupermarketId, items: { product: InvoiceProduct }[]) => {
    const cart = generateSupermarketCart(
      storeId,
      items.map((i) => ({ product: i.product, quantity: i.product.quantity }))
    );
    window.open(cart.cartUrl, '_blank');
    setActiveCartModal(cart);
  };

  // Generate WhatsApp formatted text
  const handleCopyWhatsApp = () => {
    let text = `🛒 *MI LISTA DE COMPRA - SUPERPRECIOS BA*\n`;
    text += `Fecha: ${new Date().toLocaleDateString('es-AR')}\n`;
    text += `Estrategia: ${strategy === 'winner' ? `Único Supermercado (${winnerStore.name})` : 'Compra Optimizada Multitienda'}\n\n`;

    if (strategy === 'winner') {
      text += `📍 *Comprar todo en: ${winnerStore.name}*\n`;
      text += `📅 Mejor día: ${SUPERMARKET_BEST_DAYS[winnerStore.id].day} con ${SUPERMARKET_BEST_DAYS[winnerStore.id].bankName}\n`;
      selectedProducts.forEach((p) => {
        const pr = p.prices[winnerStore.id];
        const eff = pr.promoUnitPrice !== undefined ? pr.promoUnitPrice : pr.unitPrice;
        text += `• [ ] ${p.name} x${p.quantity} (${p.unit}) - $${Math.round(eff * p.quantity).toLocaleString('es-AR')}\n`;
      });
      text += `\n💰 *Total a pagar:* $${Math.round(winnerCalc.netTotal).toLocaleString('es-AR')}\n`;
      if (winnerCalc.bankDiscount > 0) {
        text += `💳 *Descuento con ${BANK_CONFIGS[selectedBank].name}:* -$${Math.round(winnerCalc.bankDiscount).toLocaleString('es-AR')}\n`;
      }
    } else {
      activeStoresInMultitienda.forEach((group) => {
        text += `📍 *${group.store.name}* (Subtotal: $${Math.round(group.subtotal).toLocaleString('es-AR')})\n`;
        text += `📅 Mejor día: ${SUPERMARKET_BEST_DAYS[group.store.id].day} con ${SUPERMARKET_BEST_DAYS[group.store.id].bankName}\n`;
        group.items.forEach((item) => {
          text += `  • [ ] ${item.product.name} x${item.product.quantity} (${item.product.unit}) - $${Math.round(item.totalPrice).toLocaleString('es-AR')}\n`;
        });
        text += `\n`;
      });
      text += `💰 *Total Compra Optimizada:* $${Math.round(netOptimizedTotal).toLocaleString('es-AR')}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Strategy Selector Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <CheckCircle className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Paso 4 · Lista de Compra Final y Pago Online
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Elegí cómo querés hacer tu compra y hacé clic en el botón para <strong>abrir el carrito del supermercado con todos los productos ya cargados</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-1.5 text-slate-500" />
                  Compartir WhatsApp
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4 mr-1.5 text-slate-500" />
              Imprimir
            </button>
          </div>
        </div>

        {/* Strategy Switcher Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Strategy A: Winner Store */}
          <button
            onClick={() => onSelectStrategy('winner')}
            className={`text-left p-4.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              strategy === 'winner'
                ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-400/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  Opción A · Comodidad Total
                </span>
                <span className="text-xl">🥇</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Comprar Todo en {winnerStore.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Un solo supermercado, un solo envío o sucursal. Pagás toda la lista en un único ticket.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total a Pagar</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  ${Math.round(winnerCalc.netTotal).toLocaleString('es-AR')}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                Ahorro: +${Math.round(winnerCalc.savingsVsCarrefour).toLocaleString('es-AR')}
              </span>
            </div>
          </button>

          {/* Strategy B: Optimized Multistore */}
          <button
            onClick={() => onSelectStrategy('optimized')}
            className={`text-left p-4.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              strategy === 'optimized'
                ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                  Opción B · Ahorro Supremo
                </span>
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Compra Optimizada Multitienda
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Comprás cada producto en el súper donde está más barato ({activeStoresInMultitienda.length} tiendas).
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Combinado</span>
                <span className="text-xl font-black text-emerald-800 font-mono">
                  ${Math.round(netOptimizedTotal).toLocaleString('es-AR')}
                </span>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-200 px-2.5 py-1 rounded-lg">
                ¡Ahorrás ${Math.round(INVOICE_METADATA.totalPaid - netOptimizedTotal).toLocaleString('es-AR')}!
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* STRATEGY A: Single Winner Supermarket View */}
      {strategy === 'winner' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                style={{ backgroundColor: winnerStore.color }}
              >
                {winnerStore.shortName[0]}
              </div>
              <div>
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                  Supermercado Recomendado (Mejor Precio Global)
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {winnerStore.name}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  📅 Día sugerido: <strong className="text-slate-900">{SUPERMARKET_BEST_DAYS[winnerStore.id].day}</strong> con <strong className="text-slate-900">{SUPERMARKET_BEST_DAYS[winnerStore.id].bankName}</strong> ({SUPERMARKET_BEST_DAYS[winnerStore.id].discountPct}% off)
                </p>
              </div>
            </div>

            {/* Direct Cart Button with Automated Pre-Load */}
            <button
              onClick={handleCheckoutWinnerStore}
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer group"
            >
              <ShoppingCart className="w-4 h-4 mr-2 text-emerald-400" />
              <span>Cargar Carrito en {winnerStore.shortName}</span>
              <ExternalLink className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Interactive Checklist for Winner Store */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase px-2">
              <span>Producto ({selectedProducts.length} items marcables)</span>
              <span>Subtotal en {winnerStore.shortName}</span>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
              {selectedProducts.map((p) => {
                const isChecked = checkedItems[p.id];
                const enriched = getEnrichedPrice(p, winnerStore.id, p.quantity, selectedBank);
                const lineTotal = enriched.promoUnitPrice * p.quantity;

                return (
                  <div
                    key={p.id}
                    onClick={() => toggleCheck(p.id)}
                    className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isChecked ? 'bg-slate-50 text-slate-400 line-through' : 'hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <GroceryIllustration type={p.iconType || 'fruit'} size={24} />
                      </div>

                      <div>
                        <p className={`text-xs font-bold ${isChecked ? 'text-slate-400' : 'text-slate-900'}`}>
                          {p.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span>{p.quantity} {p.unit} · ${Math.round(enriched.promoUnitPrice).toLocaleString('es-AR')} c/u</span>
                          {enriched.promoLabel && (
                            <span className="font-bold text-amber-800 bg-amber-100 px-1 rounded">
                              {enriched.promoLabel}
                            </span>
                          )}
                          <span className="text-slate-500 font-medium">
                            (Descuento {enriched.bestBank} se aplica al total con tope de ${enriched.bestBankCap.toLocaleString('es-AR')})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black font-mono ${isChecked ? 'text-slate-400' : 'text-slate-900'}`}>
                        ${Math.round(lineTotal).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Productos en Góndola:</span>
              <span className="font-bold text-slate-800 font-mono">
                ${Math.round(winnerCalc.baseBasket).toLocaleString('es-AR')}
              </span>
            </div>
            {winnerCalc.bankDiscount > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Descuento Bancario ({BANK_CONFIGS[selectedBank].name}):</span>
                  <span className="font-bold font-mono">
                    -${Math.round(winnerCalc.bankDiscount).toLocaleString('es-AR')}
                  </span>
                </div>
                {winnerCalc.bankDiscount >= (BANK_CONFIGS[selectedBank].supermarketDiscount[winnerStore.id]?.maxCap || 0) && (
                  <span className="text-[10px] text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-black block text-center">
                    ⚠️ Se aplicó el tope máximo de reintegro de ${BANK_CONFIGS[selectedBank].supermarketDiscount[winnerStore.id]?.maxCap.toLocaleString('es-AR')}
                  </span>
                )}
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Total Final Estimado a Pagar:</span>
              <span className="text-lg text-emerald-800 font-mono">
                ${Math.round(winnerCalc.netTotal).toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STRATEGY B: Optimized Multistore View */}
      {strategy === 'optimized' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-black text-sm">
                Tu compra se dividió de forma inteligente en {activeStoresInMultitienda.length} supermercados
              </p>
              <p className="text-emerald-800 mt-0.5">
                Comprás cada producto exactamente en el lugar que tiene la oferta más baja de Buenos Aires.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-800 font-mono block">
                ${Math.round(netOptimizedTotal).toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">Total con Descuentos</span>
            </div>
          </div>

          {/* Render cards for each active store */}
          <div className="space-y-4">
            {activeStoresInMultitienda.map((group) => {
              const bestDayInfo = SUPERMARKET_BEST_DAYS[group.store.id];

              return (
                <div
                  key={group.store.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5"
                >
                  {/* Store Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs"
                        style={{ backgroundColor: group.store.color }}
                      >
                        {group.store.shortName[0]}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-black text-slate-900">
                            Comprar en {group.store.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {group.items.length} productos
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Mejor día: <strong className="text-indigo-700">{bestDayInfo.day}</strong> con <strong className="text-slate-800">{bestDayInfo.bankName}</strong> ({bestDayInfo.discountPct}% off)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-black text-slate-900 font-mono">
                        ${Math.round(group.subtotal).toLocaleString('es-AR')}
                      </span>

                      {/* Direct Button to open cart with items */}
                      <button
                        onClick={() => handleCheckoutStoreGroup(group.store.id, group.items)}
                        className="inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        <span>Cargar Carrito</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Product items in this store */}
                  <div className="space-y-1.5">
                    {group.items.map((item) => {
                      const isChecked = checkedItems[item.product.id];
                      const enriched = getEnrichedPrice(item.product, group.store.id, item.product.quantity, selectedBank);

                      return (
                        <div
                          key={item.product.id}
                          onClick={() => toggleCheck(item.product.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                              : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                              <GroceryIllustration type={item.product.iconType || 'fruit'} size={18} />
                            </div>

                            <div>
                              <p className={`text-xs font-semibold ${isChecked ? 'text-slate-400' : 'text-slate-900'}`}>
                                {item.product.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                <span>{item.product.quantity} {item.product.unit} (${Math.round(item.unitPrice).toLocaleString('es-AR')} c/u)</span>
                                {enriched.promoLabel && (
                                  <span className="font-bold text-amber-800 bg-amber-100 px-1 rounded">
                                    {enriched.promoLabel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <span className={`text-xs font-bold font-mono ${isChecked ? 'text-slate-400' : 'text-slate-900'}`}>
                            ${Math.round(item.totalPrice).toLocaleString('es-AR')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cart Redirect Modal */}
      <CartRedirectModal
        isOpen={!!activeCartModal}
        onClose={() => setActiveCartModal(null)}
        cartData={activeCartModal}
      />
    </div>
  );
};

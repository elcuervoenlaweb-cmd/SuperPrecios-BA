import React from 'react';
import { Trophy, TrendingDown, Award, CheckCircle, ArrowRight, Lightbulb, Zap, ShoppingBag, DollarSign, Store } from 'lucide-react';
import { BankCardType, InvoiceProduct, PurchaseStrategy, SupermarketId } from '../types/products';
import { BANK_CONFIGS, INVOICE_METADATA, SUPERMARKETS } from '../data/invoiceProducts';

interface WinnerVerdictCardProps {
  products: InvoiceProduct[];
  selectedBank: BankCardType;
  strategy?: PurchaseStrategy;
  onSelectStrategy?: (strategy: PurchaseStrategy) => void;
  onGoToCheckout?: () => void;
}

export const WinnerVerdictCard: React.FC<WinnerVerdictCardProps> = ({
  products,
  selectedBank,
  strategy = 'winner',
  onSelectStrategy,
  onGoToCheckout,
}) => {
  const activeProducts = products.filter((p) => p.selected !== false);

  if (activeProducts.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
        <p className="text-sm font-bold text-slate-700">No seleccionaste ningún producto en tu carrito.</p>
        <p className="text-xs text-slate-500">Volvé al Paso 1 (Mi Lista) para marcar qué productos deseás comprar.</p>
      </div>
    );
  }

  // Calculate dynamic reference total from invoice for selected items
  const dynamicRefTotal = activeProducts.reduce(
    (sum, p) => sum + (p.invoicePromoTotal || p.invoiceTotal),
    0
  );

  // Calculate total for each supermarket
  const storeTotals: {
    storeId: SupermarketId;
    storeName: string;
    grossTotal: number;
    promoTotal: number;
    bankDiscount: number;
    unconstrainedDiscount: number;
    maxCap: number;
    isCapped: boolean;
    netTotal: number;
    savingsVsInvoice: number;
    percentSaved: number;
  }[] = SUPERMARKETS.map((store) => {
    let gross = 0;
    let promo = 0;

    activeProducts.forEach((p) => {
      const price = p.prices[store.id];
      gross += price.unitPrice * p.quantity;
      const effectiveUnit = price.promoUnitPrice !== undefined ? price.promoUnitPrice : price.unitPrice;
      promo += effectiveUnit * p.quantity;
    });

    const bankRule = BANK_CONFIGS[selectedBank].supermarketDiscount[store.id];
    let bankDiscount = 0;
    let unconstrainedDiscount = 0;
    let isCapped = false;
    let maxCap = 0;

    if (bankRule && bankRule.percentage > 0) {
      unconstrainedDiscount = (promo * bankRule.percentage) / 100;
      bankDiscount = unconstrainedDiscount;
      maxCap = bankRule.maxCap;
      if (maxCap > 0 && bankDiscount > maxCap) {
        bankDiscount = maxCap;
        isCapped = true;
      }
    }

    const netTotal = promo - bankDiscount;
    const savingsVsInvoice = dynamicRefTotal - netTotal;
    const percentSaved = dynamicRefTotal > 0 ? ((dynamicRefTotal - netTotal) / dynamicRefTotal) * 100 : 0;

    return {
      storeId: store.id,
      storeName: store.name,
      grossTotal: gross,
      promoTotal: promo,
      bankDiscount,
      unconstrainedDiscount,
      maxCap,
      isCapped,
      netTotal,
      savingsVsInvoice,
      percentSaved,
    };
  });

  // Sort by netTotal ascending
  storeTotals.sort((a, b) => a.netTotal - b.netTotal);

  const winner = storeTotals[0];
  const second = storeTotals[1];
  const third = storeTotals[2];

  // Best mixed basket calculation (buying each product at its absolute lowest price across BA)
  const mixedStoreBaskets: Record<SupermarketId, number> = {
    carrefour: 0, coto: 0, makro: 0, abastecedor: 0, disco: 0, jumbo: 0, dia: 0
  };
  let mixedTotal = 0;

  activeProducts.forEach((p) => {
    let minUnit = Infinity;
    let bestStoreId: SupermarketId = 'carrefour';
    SUPERMARKETS.forEach((s) => {
      const price = p.prices[s.id];
      const eff = price.promoUnitPrice !== undefined ? price.promoUnitPrice : price.unitPrice;
      if (eff < minUnit) {
        minUnit = eff;
        bestStoreId = s.id;
      }
    });
    mixedStoreBaskets[bestStoreId] += minUnit * p.quantity;
    mixedTotal += minUnit * p.quantity;
  });

  // Calculate separate independent bank discounts per store (exploiting separate caps!)
  let mixedBankDiscount = 0;
  let activeStoreCountInMixed = 0;
  SUPERMARKETS.forEach((s) => {
    const storeSubtotal = mixedStoreBaskets[s.id];
    if (storeSubtotal > 0) {
      activeStoreCountInMixed++;
      const bankRule = BANK_CONFIGS[selectedBank].supermarketDiscount[s.id];
      if (bankRule && bankRule.percentage > 0) {
        const raw = (storeSubtotal * bankRule.percentage) / 100;
        const disc = bankRule.maxCap > 0 ? Math.min(raw, bankRule.maxCap) : raw;
        mixedBankDiscount += disc;
      }
    }
  });

  const netMixedTotal = mixedTotal - mixedBankDiscount;
  const mixedSavings = dynamicRefTotal - netMixedTotal;
  const mixedPercentSaved = dynamicRefTotal > 0 ? ((dynamicRefTotal - netMixedTotal) / dynamicRefTotal) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Title & Verdict Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Veredicto Final: ¿Dónde Ahorrás Más Dinero en la Compra Total?
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Análisis de los {activeProducts.length} productos seleccionados comparando góndola y medio de pago seleccionado.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>Ticket Factura Referencia: ${Math.round(dynamicRefTotal).toLocaleString('es-AR')}</span>
          </div>

          {onGoToCheckout && (
            <button
              onClick={onGoToCheckout}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center"
            >
              <span>Preparar Compra</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Podium Cards: 1st, 2nd, 3rd place */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1st Place Winner */}
        <div className="relative rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 p-5 shadow-md flex flex-col justify-between">
          <div className="absolute -top-3.5 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[11px] px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center">
            <Trophy className="w-3.5 h-3.5 mr-1" />
            1° Lugar · Ganador Compra Total
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">{winner.storeName}</h3>
              <span className="text-2xl">🥇</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {winner.storeId === 'makro'
                ? 'Líder en volumen bulto cerrado de leche (24L), fideos y puré de tomate.'
                : winner.storeId === 'coto'
                ? 'Mejor aprovechamiento con descuentos bancarios (BBVA / Santander) y 2do al 70%.'
                : 'La mejor opción para hacer la compra en un solo supermercado.'}
            </p>

            <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold">
                <span>Subtotal Góndola:</span>
                <span className="font-mono text-slate-700 font-bold">${Math.round(winner.promoTotal).toLocaleString('es-AR')}</span>
              </div>
              {winner.bankDiscount > 0 && (
                <div className="flex justify-between items-center text-[11px] text-emerald-700 font-bold">
                  <span>Reintegro {BANK_CONFIGS[selectedBank].name}:</span>
                  <span className="font-mono">-${Math.round(winner.bankDiscount).toLocaleString('es-AR')}</span>
                </div>
              )}
              {winner.isCapped && (
                <span className="text-[10px] text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded font-black block text-center">
                  ⚠️ Tope de reintegro de ${winner.maxCap.toLocaleString('es-AR')} alcanzado
                </span>
              )}
              <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black uppercase text-slate-700">Total a Pagar:</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  ${Math.round(winner.netTotal).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Ahorro vs Factura Carrefour:</span>
              <span className={`font-extrabold ${winner.savingsVsInvoice >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {winner.savingsVsInvoice >= 0 ? '+' : ''}${Math.round(winner.savingsVsInvoice).toLocaleString('es-AR')}
                <span className="text-[10px] font-normal text-slate-500 ml-1">
                  ({winner.percentSaved.toFixed(1)}%)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 2nd Place */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                2° Lugar
              </span>
              <span className="text-xl">🥈</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">{second.storeName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Excelente rendimiento en promociones de marcas combinadas y frescos.
            </p>

            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Costo Total</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                ${Math.round(second.netTotal).toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs flex justify-between">
            <span className="text-slate-500">Diferencia vs 1°:</span>
            <span className="font-bold text-slate-700">
              +${Math.round(second.netTotal - winner.netTotal).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">
                3° Lugar
              </span>
              <span className="text-xl">🥉</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">{third.storeName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Buena alternativa para compras de proximidad y fiambrería.
            </p>

            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Costo Total</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                ${Math.round(third.netTotal).toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs flex justify-between">
            <span className="text-slate-500">Diferencia vs 1°:</span>
            <span className="font-bold text-slate-700">
              +${Math.round(third.netTotal - winner.netTotal).toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      </div>

      {/* Super Strategy: Mixed Purchase Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-emerald-500/30 text-emerald-300">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Estrategia Suprema de Ahorro en Buenos Aires
              </span>
            </div>
            <h4 className="text-lg font-black text-white">
              Compra Mixta Optimizada (Dividiendo por Supermercado)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si comprás los <strong>bultos pesados (24L de leche, puré de tomate y fideos) en Makro</strong>, los <strong>lácteos y quesos (Mozzarella Silvia) en El Abastecedor</strong>, y la <strong>perfumería (Dove Clinical, Rexona y Gillette) en Coto o Carrefour con descuento del 40%</strong>:
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-right min-w-[240px]">
            <p className="text-[11px] text-emerald-200 font-semibold uppercase">Costo Compra Mixta</p>
            <p className="text-3xl font-black text-emerald-300 mt-0.5">
              ${Math.round(netMixedTotal).toLocaleString('es-AR')}
            </p>
            <p className="text-xs text-emerald-100 font-bold mt-1">
              ¡Ahorrás ${Math.round(mixedSavings).toLocaleString('es-AR')} ({mixedPercentSaved.toFixed(1)}%) vs Factura Carrefour!
            </p>
            {mixedBankDiscount > 0 && (
              <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-200">
                <span>Reintegros Bancarios Sumados:</span>
                <span className="font-bold font-mono text-emerald-300">
                  -${Math.round(mixedBankDiscount).toLocaleString('es-AR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Multi-Store Cap Multiplication Explanatory Insight */}
        <div className="mt-3 p-3 bg-emerald-950/40 rounded-xl border border-emerald-400/20 text-xs text-emerald-100 flex items-start space-x-2.5">
          <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>¿Por qué el ahorro es superior al dividir en varias tiendas?</strong> En una sola tienda, un ticket de ${Math.round(winner.promoTotal).toLocaleString('es-AR')} rápidamente satura el tope de reintegro (máximo ${winner.maxCap > 0 ? `$${winner.maxCap.toLocaleString('es-AR')}` : 'del comercio'}). Al dividir la compra entre {activeStoreCountInMixed} supermercados, <strong>cada ticket se cobra por separado aprovechando topes independientes</strong>, acumulando <strong>${Math.round(mixedBankDiscount).toLocaleString('es-AR')} en reintegros totales</strong> además de pagar el menor precio de góndola en cada ítem.
          </p>
        </div>
      </div>

      {/* Strategy Selector Block */}
      <div className="bg-slate-50 border-2 border-slate-200/80 rounded-2xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Configurá tu Estrategia de Compra
            </span>
            <h4 className="text-base font-extrabold text-slate-900">
              ¿Cómo deseás realizar tu compra?
            </h4>
          </div>
          {onGoToCheckout && (
            <button
              onClick={onGoToCheckout}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer shrink-0"
            >
              <span>Preparar Lista & Pagar</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Strategy A */}
          <button
            onClick={() => onSelectStrategy && onSelectStrategy('winner')}
            className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              strategy === 'winner'
                ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                1 Sola Compra (Cómodo)
              </span>
              <span className="text-base">🥇</span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              Comprar todo en {winner.storeName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Un solo ticket, un solo envío o sucursal.
            </p>
            <p className="text-sm font-black text-slate-900 mt-2 font-mono">
              Total: ${Math.round(winner.netTotal).toLocaleString('es-AR')}
            </p>
          </button>

          {/* Strategy B */}
          <button
            onClick={() => onSelectStrategy && onSelectStrategy('optimized')}
            className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              strategy === 'optimized'
                ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded">
                Compra Optimizada (Máximo Ahorro)
              </span>
              <span className="text-base">⚡</span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              Dividir por Supermercado Más Barato
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Aprovechás cada producto a su menor costo en BA.
            </p>
            <p className="text-sm font-black text-emerald-700 mt-2 font-mono">
              Total: ${Math.round(netMixedTotal).toLocaleString('es-AR')}
            </p>
          </button>
        </div>
      </div>

      {/* Comparative Ranking Table */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Tabla Resumen de la Compra Total en Todos los Supermercados
        </h4>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Posición</th>
                <th className="py-2.5 px-3">Supermercado</th>
                <th className="py-2.5 px-3">Categoría</th>
                <th className="py-2.5 px-3">Subtotal Góndola</th>
                <th className="py-2.5 px-3 text-emerald-700">Desc. Bancario ({BANK_CONFIGS[selectedBank].name})</th>
                <th className="py-2.5 px-3 font-extrabold text-slate-900">Total a Pagar</th>
                <th className="py-2.5 px-3">Ahorro vs Factura Original</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {storeTotals.map((store, idx) => {
                const isWinner = idx === 0;
                return (
                  <tr
                    key={store.storeId}
                    className={`hover:bg-slate-50 transition-colors ${
                      isWinner ? 'bg-emerald-50/50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      {idx === 0 ? '🥇 1°' : idx === 1 ? '🥈 2°' : idx === 2 ? '🥉 3°' : `${idx + 1}°`}
                    </td>
                    <td className="py-2.5 px-3 flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{store.storeName}</span>
                      {isWinner && (
                        <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                          Mejor Precio
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {SUPERMARKETS.find((s) => s.id === store.storeId)?.category}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      ${Math.round(store.promoTotal).toLocaleString('es-AR')}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-700 font-medium">
                      {store.bankDiscount > 0 ? (
                        <div>
                          <span className="font-extrabold font-mono">-${Math.round(store.bankDiscount).toLocaleString('es-AR')}</span>
                          {store.isCapped && (
                            <span className="block text-[9px] font-black text-amber-900 bg-amber-100 px-1 py-0.2 rounded mt-0.5 max-w-[120px]">
                              Tope ${store.maxCap.toLocaleString('es-AR')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">$0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-sm font-black text-slate-900">
                      ${Math.round(store.netTotal).toLocaleString('es-AR')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          store.savingsVsInvoice >= 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {store.savingsVsInvoice >= 0 ? '+' : ''}${Math.round(store.savingsVsInvoice).toLocaleString('es-AR')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

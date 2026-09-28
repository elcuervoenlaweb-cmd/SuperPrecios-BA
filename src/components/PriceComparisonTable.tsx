import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  AlertCircle, 
  ShoppingBag, 
  Edit3, 
  Info, 
  Calendar, 
  CreditCard,
  Tag,
  ArrowUpRight,
  Trophy,
  ShieldAlert
} from 'lucide-react';
import { BankCardType, InvoiceProduct, SupermarketId } from '../types/products';
import { SUPERMARKETS, INVOICE_METADATA } from '../data/invoiceProducts';
import { 
  getEnrichedPrice, 
  SUPERMARKET_BEST_DAYS, 
  calculateStoreTotalWithCap,
  StoreTotalCalculation 
} from '../utils/promoCalculator';

interface PriceComparisonTableProps {
  products: InvoiceProduct[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onOpenAddModal: () => void;
  onEditCellPrice: (product: InvoiceProduct, storeId: SupermarketId) => void;
  viewMode: 'unit' | 'total';
  onToggleViewMode: (mode: 'unit' | 'total') => void;
  selectedBank?: BankCardType;
}

export const PriceComparisonTable: React.FC<PriceComparisonTableProps> = ({
  products,
  onUpdateQuantity,
  onOpenAddModal,
  onEditCellPrice,
  viewMode,
  onToggleViewMode,
  selectedBank,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showExplanationBanner, setShowExplanationBanner] = useState(true);

  const categories = [
    'Todos', 
    'Lácteos y Frescos', 
    'Almacén y Pastas', 
    'Congelados', 
    'Perfumería e Higiene', 
    'Snacks y Galletitas'
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate totals with bank cap for each supermarket on selected products
  const activeProducts = products.filter((p) => p.selected !== false);
  const storeTotals: StoreTotalCalculation[] = SUPERMARKETS.map((store) =>
    calculateStoreTotalWithCap(store.id, activeProducts, selectedBank)
  );

  // Rank supermarkets by netFinalTotal (ascending)
  const rankedStores = [...storeTotals].sort((a, b) => a.netFinalTotal - b.netFinalTotal);
  const winnerStoreId = rankedStores[0]?.storeId;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Tabla Comparativa de Precios con Aplicación de Topes Bancarios
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Precios en góndola por producto (con promos de supermercado sin tope) y <strong className="text-slate-800">descuentos bancarios con tope de reintegro aplicados al total de la compra</strong> al pie de la tabla.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle Switch */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
            <button
              onClick={() => onToggleViewMode('unit')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center cursor-pointer ${
                viewMode === 'unit'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="mr-1.5">🏷️</span>
              Unitario (c/u)
            </button>
            <button
              onClick={() => onToggleViewMode('total')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center cursor-pointer ${
                viewMode === 'total'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="mr-1.5">📦</span>
              Total x Cantidad
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Explanatory Banner about Bank Caps */}
      {showExplanationBanner && (
        <div className="p-4 bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 rounded-2xl border border-amber-200/90 text-xs text-slate-800 relative">
          <button
            onClick={() => setShowExplanationBanner(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            title="Cerrar aviso"
          >
            ✕
          </button>
          <div className="flex items-start space-x-2.5 pr-6">
            <span className="p-1 rounded-lg bg-amber-200/80 text-amber-900 shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div className="space-y-1">
              <p className="font-extrabold text-slate-900 text-sm">
                ⚠️ Regla de Topes de Reintegro en Bancos y Billeteras (MODO, Santander, BBVA, Naranja X):
              </p>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                • <strong>Promos de Góndola (2° al 70%, 2° al 50%, 2x1, Packs):</strong> Son otorgadas por el supermercado y aplican directamente a <strong>cada producto sin tope</strong>.
                <br />
                • <strong>Promos Bancarias (ej. 25% con MODO BBVA, 20% Santander):</strong> Tienen un <strong>tope de reintegro por mes o por compra</strong> (ej. $15.000 en Coto o $10.000 en Carrefour). No se pueden restar indefinidamente a cada artículo porque al superar el tope, los productos adicionales pagan precio normal.
                <br />
                • <strong>¿Por qué puede haber diferencias con la web? (Ej. Espuma Gillette):</strong> La web muestra el <strong>precio de lista en góndola ($15.929)</strong>, mientras que la factura original registraba el precio neto tras aplicar el 20% de Tarjeta Carrefour Martes ($11.495). Hemos actualizado el precio de lista a <strong>$15.929</strong>.
                <br />
                • <strong>Control total:</strong> Hacé clic en cualquier celda para editar el precio al instante si ves una variación en la tienda online.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por producto, marca o código EAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 divide-x divide-slate-200">
            <tr>
              <th className="py-3 px-3.5 min-w-[210px]">Producto / EAN</th>
              <th className="py-3 px-2 text-center w-28">Cantidad</th>
              {SUPERMARKETS.map((s) => {
                const bestDay = SUPERMARKET_BEST_DAYS[s.id];
                return (
                  <th key={s.id} className="py-2.5 px-3 text-center min-w-[160px]" style={{ backgroundColor: s.bgColor }}>
                    <div className="font-extrabold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium flex flex-col items-center mt-0.5 space-y-0.5">
                      <span className="font-bold text-emerald-800 bg-white/90 px-1.5 py-0.2 rounded border border-emerald-200">
                        📅 {bestDay.day} · {bestDay.bankName}
                      </span>
                      <span className="text-[9px] text-slate-600 font-semibold">
                        {bestDay.discountPct}% (Tope: ${bestDay.maxCap.toLocaleString('es-AR')})
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredProducts.map((p) => {
              // Precalculate all prices for this row to highlight the lowest in gondola
              const storePrices = SUPERMARKETS.map((store) => {
                const enriched = getEnrichedPrice(p, store.id, p.quantity, selectedBank);
                const displayUnit = enriched.promoUnitPrice;
                const displayTotal = displayUnit * p.quantity;
                return {
                  storeId: store.id,
                  enriched,
                  displayUnit,
                  displayTotal,
                };
              });

              let minUnit = Infinity;
              let bestStoreId: SupermarketId = 'carrefour';
              storePrices.forEach((item) => {
                if (item.displayUnit < minUnit) {
                  minUnit = item.displayUnit;
                  bestStoreId = item.storeId;
                }
              });

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-100">
                  {/* Product Details */}
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {p.barcode}
                      </span>
                      <span>·</span>
                      <span className="text-slate-500 font-medium">{p.category}</span>
                    </div>
                  </td>

                  {/* Quantity Modifier */}
                  <td className="py-3 px-2 text-center bg-slate-50/40">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => onUpdateQuantity(p.id, Math.max(1, p.quantity - 1))}
                        className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
                        title="Restar 1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-slate-900 min-w-[24px] text-center font-mono">
                        {p.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(p.id, p.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
                        title="Sumar 1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">{p.unit}</span>
                  </td>

                  {/* Supermarket Price Columns (Gondola Price with store promos) */}
                  {storePrices.map(({ storeId, enriched, displayUnit, displayTotal }) => {
                    const isBest = storeId === bestStoreId;

                    return (
                      <td
                        key={storeId}
                        onClick={() => onEditCellPrice(p, storeId)}
                        className={`py-2.5 px-3 text-center transition-all cursor-pointer group relative ${
                          isBest
                            ? 'bg-emerald-50/90 text-emerald-950 font-extrabold border-l-2 border-r-2 border-emerald-500 ring-1 ring-emerald-500/40'
                            : 'text-slate-700 hover:bg-slate-100/70'
                        }`}
                        title={`Hacé clic para editar el precio de ${p.name}`}
                      >
                        {/* Edit Icon on Hover */}
                        <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-slate-200/90 text-slate-600 hover:text-emerald-700">
                          <Edit3 className="w-3 h-3" />
                        </span>

                        <div className="flex flex-col items-center space-y-1">
                          {isBest && (
                            <span className="inline-flex items-center text-[9px] font-black uppercase text-emerald-900 bg-emerald-300/90 px-2 py-0.2 rounded-full shadow-2xs">
                              ★ Mejor Góndola
                            </span>
                          )}

                          {/* Primary Price Value */}
                          {viewMode === 'unit' ? (
                            <div>
                              <div className={`text-sm ${isBest ? 'text-emerald-950 font-black' : 'font-extrabold text-slate-900'} font-mono`}>
                                ${displayUnit.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <span className="text-[10px] font-normal text-slate-500 ml-0.5">c/u</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium font-mono">
                                Total ({p.quantity}): ${Math.round(displayTotal).toLocaleString('es-AR')}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className={`text-sm ${isBest ? 'text-emerald-950 font-black' : 'font-extrabold text-slate-900'} font-mono`}>
                                ${Math.round(displayTotal).toLocaleString('es-AR')}
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium font-mono">
                                (${displayUnit.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u)
                              </div>
                            </div>
                          )}

                          {/* Volume Promotion Tag (2x1, 2° al 70%, 2° al 50%, etc.) */}
                          {enriched.promoLabel ? (
                            <div className="flex flex-col items-center gap-1 w-full">
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                                  enriched.promoType === '2do_70'
                                    ? 'bg-pink-100 text-pink-900 border-pink-300'
                                    : enriched.promoType === '2do_50'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : enriched.promoType === '2x1'
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : 'bg-blue-100 text-blue-900 border-blue-300'
                                }`}
                              >
                                <Tag className="w-2.5 h-2.5 mr-0.5" />
                                <span>{enriched.promoLabel}</span>
                              </span>

                              {/* Interactive Increment Prompt for Volume Promo */}
                              {enriched.missingQtyForPromo > 0 ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateQuantity(p.id, p.quantity + enriched.missingQtyForPromo);
                                  }}
                                  className="text-[9px] font-extrabold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center shadow-2xs"
                                  title={`Agregá ${enriched.missingQtyForPromo} para activar la promo ${enriched.promoLabel}`}
                                >
                                  <span>+1 para {enriched.promoLabel}</span>
                                </button>
                              ) : enriched.isVolumePromo ? (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                  ✓ Promo activa
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-medium">Precio regular</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* ================= TOTALS & BANK CAP APPLICATION ROW ================= */}
          <tfoot className="bg-slate-50 border-t-2 border-slate-300 divide-x divide-slate-200">
            {/* Subtotal Gondola Row */}
            <tr className="border-b border-slate-200">
              <td colSpan={2} className="py-2.5 px-3.5 font-bold text-slate-700 bg-slate-100/80">
                1. Subtotal Productos en Góndola:
                <span className="block text-[10px] text-slate-400 font-normal">
                  Suma de todos los ítems con promociones de supermercado (sin tope bancario)
                </span>
              </td>
              {SUPERMARKETS.map((store) => {
                const totalCalc = storeTotals.find((t) => t.storeId === store.id)!;
                return (
                  <td key={store.id} className="py-2 px-3 text-center font-bold text-slate-800 font-mono">
                    ${Math.round(totalCalc.baseGondolaTotal).toLocaleString('es-AR')}
                  </td>
                );
              })}
            </tr>

            {/* Bank Discount with Cap Row */}
            <tr className="border-b border-slate-200 bg-emerald-50/40">
              <td colSpan={2} className="py-2.5 px-3.5 font-bold text-emerald-900 bg-emerald-100/50">
                2. Descuento Bancario Real (Aplicando Tope):
                <span className="block text-[10px] text-emerald-700 font-normal">
                  Calculado sobre el total y limitado al tope mensual de reintegro
                </span>
              </td>
              {SUPERMARKETS.map((store) => {
                const totalCalc = storeTotals.find((t) => t.storeId === store.id)!;
                return (
                  <td key={store.id} className="py-2.5 px-2 text-center">
                    {totalCalc.actualBankDiscount > 0 ? (
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-emerald-700 font-mono text-xs block">
                          -${Math.round(totalCalc.actualBankDiscount).toLocaleString('es-AR')}
                        </span>
                        {totalCalc.isCapReached ? (
                          <span className="inline-block text-[9px] font-black text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded leading-tight">
                            ⚠️ Tope de ${totalCalc.maxCap.toLocaleString('es-AR')} alcanzado
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] font-semibold text-emerald-800 bg-emerald-100 px-1 rounded">
                            {totalCalc.bankDiscountPct}% ({totalCalc.capUtilizationPct}% del tope)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">$0</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Final Real Total to Pay Row */}
            <tr className="border-b-2 border-slate-400 bg-slate-100/90 font-black">
              <td colSpan={2} className="py-3 px-3.5 text-slate-900 text-sm">
                3. TOTAL FINAL A PAGAR:
                <span className="block text-[10px] text-slate-500 font-medium">
                  Subtotal góndola menos reintegro bancario con tope aplicado
                </span>
              </td>
              {SUPERMARKETS.map((store) => {
                const totalCalc = storeTotals.find((t) => t.storeId === store.id)!;
                const isWinner = store.id === winnerStoreId;
                return (
                  <td 
                    key={store.id} 
                    className={`py-3 px-3 text-center ${
                      isWinner 
                        ? 'bg-emerald-600 text-white shadow-inner font-mono' 
                        : 'text-slate-900 font-mono'
                    }`}
                  >
                    <div className="text-base font-black">
                      ${Math.round(totalCalc.netFinalTotal).toLocaleString('es-AR')}
                    </div>
                    {isWinner && (
                      <span className="inline-block mt-0.5 text-[9px] uppercase font-black tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-2xs">
                        🏆 1° Más Barato
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Podium Ranking Row */}
            <tr className="bg-white text-xs">
              <td colSpan={2} className="py-2.5 px-3.5 font-bold text-slate-600">
                Posición en la Compra Total:
              </td>
              {SUPERMARKETS.map((store) => {
                const rankIdx = rankedStores.findIndex((s) => s.storeId === store.id);
                return (
                  <td key={store.id} className="py-2 px-3 text-center font-bold text-slate-700">
                    {rankIdx === 0 ? '🥇 1° Lugar' : rankIdx === 1 ? '🥈 2° Lugar' : rankIdx === 2 ? '🥉 3° Lugar' : `${rankIdx + 1}° Lugar`}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Search, Plus, Minus, Check, CheckSquare, Square, ShoppingCart, Sparkles, Filter, RotateCcw, ArrowRight, DollarSign, Tag } from 'lucide-react';
import { InvoiceProduct, SupermarketId } from '../types/products';
import { GroceryIllustration } from './GroceryIllustrations';
import { SUPERMARKETS } from '../data/invoiceProducts';
import { detectPromoType } from '../utils/promoCalculator';

interface ProductSelectorListProps {
  products: InvoiceProduct[];
  onToggleProduct: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onProceedToCompare: () => void;
  onOpenAddModal: () => void;
}

export const ProductSelectorList: React.FC<ProductSelectorListProps> = ({
  products,
  onToggleProduct,
  onSelectAll,
  onUpdateQuantity,
  onProceedToCompare,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = [
    'Todos',
    'Lácteos y Frescos',
    'Almacén y Pastas',
    'Congelados',
    'Perfumería e Higiene',
    'Snacks y Galletitas',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    const matchesCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const selectedProducts = products.filter((p) => p.selected !== false);
  const totalUnits = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);

  // Quick estimated minimum total
  const estimatedMinTotal = selectedProducts.reduce((sum, p) => {
    const minUnit = Math.min(
      ...SUPERMARKETS.map((s) => {
        const pr = p.prices[s.id];
        return pr.promoUnitPrice !== undefined ? pr.promoUnitPrice : pr.unitPrice;
      })
    );
    return sum + minUnit * p.quantity;
  }, 0);

  return (
    <div className="space-y-5">
      {/* Hero Welcome & Instruction Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span className="p-1 rounded-md bg-emerald-500/30">
                <ShoppingCart className="w-4 h-4 text-emerald-300" />
              </span>
              <span>Paso 1 · Tu Lista de Compra Personalizada</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¿Qué productos querés comprar hoy?
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Seleccioná los artículos y ajustá las cantidades. Buscaremos las mejores promociones en tiempo real en los supermercados de Buenos Aires (Coto, Carrefour, Makro, Disco, Jumbo, El Abastecedor y Día) para maximizar tu ahorro.
            </p>
          </div>

          {/* Quick Counter Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center sm:text-right shrink-0 min-w-[220px]">
            <span className="text-xs font-semibold text-emerald-200 block uppercase">
              Carrito Actual
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white mt-1 block font-mono">
              {selectedProducts.length} <span className="text-sm font-medium text-emerald-200">items</span>
            </span>
            <span className="text-xs text-emerald-100 font-medium block mt-0.5">
              {totalUnits} unidades en total
            </span>

            <button
              onClick={onProceedToCompare}
              disabled={selectedProducts.length === 0}
              className={`mt-3 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                selectedProducts.length > 0
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Comparar Precios</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Bulk Action Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por producto, marca o EAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Quick Bulk Selection Buttons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onSelectAll(true)}
              className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center"
            >
              <CheckSquare className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              <span className="hidden sm:inline">Seleccionar</span> Todos ({products.length})
            </button>
            <button
              onClick={() => onSelectAll(false)}
              className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center"
            >
              <Square className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Deseleccionar
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid (Mobile friendly with food drawings) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredProducts.map((p) => {
          const isSelected = p.selected !== false;

          // Find cheapest unit price in BA for this product
          let cheapestUnit = Infinity;
          let cheapestStoreName = 'Carrefour';

          SUPERMARKETS.forEach((s) => {
            const pr = p.prices[s.id];
            const eff = pr.promoUnitPrice !== undefined ? pr.promoUnitPrice : pr.unitPrice;
            if (eff < cheapestUnit) {
              cheapestUnit = eff;
              cheapestStoreName = s.shortName;
            }
          });

          return (
            <div
              key={p.id}
              className={`rounded-2xl border transition-all p-4 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-500/20'
                  : 'bg-slate-50/70 border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header: Checkbox + Icon + Category */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onToggleProduct(p.id)}
                      className="cursor-pointer p-0.5 rounded focus:outline-none"
                    >
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                      )}
                    </button>

                    {/* Food illustration */}
                    <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                      <GroceryIllustration type={p.iconType || 'fruit'} size={32} />
                    </div>

                    <div>
                      <h4 className={`text-sm font-bold leading-tight ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {p.category} · EAN: {p.barcode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price hint & Volume Promo Badges */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Mejor precio actual:</span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      Desde ${cheapestUnit.toLocaleString('es-AR', { minimumFractionDigits: 2 })} en {cheapestStoreName}
                    </span>
                  </div>

                  {/* Volume Promos on this product */}
                  {(() => {
                    // Check if any supermarket has 2x1, 2° al 70%, 2° al 50%, etc.
                    const volumePromos = SUPERMARKETS.map((s) => {
                      const sp = p.prices[s.id];
                      const detected = detectPromoType(sp.promoDescription);
                      return {
                        storeName: s.shortName,
                        desc: sp.promoDescription,
                        ...detected,
                      };
                    }).filter((v) => v.promoLabel !== '');

                    if (volumePromos.length === 0) return null;

                    const bestPromo = volumePromos[0];
                    const isOddQuantity = bestPromo.promoMinQty === 2 && p.quantity % 2 !== 0;

                    return (
                      <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 flex items-center">
                            <Tag className="w-3 h-3 mr-1 text-amber-600" />
                            {bestPromo.promoLabel} ({bestPromo.storeName})
                          </span>
                          {isOddQuantity ? (
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(p.id, p.quantity + 1)}
                              className="text-[10px] font-black text-amber-900 bg-amber-200/90 hover:bg-amber-300 px-2 py-0.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                              title={`Llevá ${p.quantity + 1} para aprovechar la promo ${bestPromo.promoLabel}`}
                            >
                              +1 para {bestPromo.promoLabel}
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              ✓ Promo activa
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Quantity Control */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  Cantidad a comprar:
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(p.id, Math.max(1, p.quantity - 1))}
                    disabled={!isSelected}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-10 text-center font-black text-sm text-slate-900 font-mono">
                    {p.quantity}
                  </span>

                  <button
                    onClick={() => onUpdateQuantity(p.id, p.quantity + 1)}
                    disabled={!isSelected}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[11px] text-slate-400 font-medium ml-1">
                    {p.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Bar for Mobile & Quick Navigation */}
      <div className="sticky bottom-4 z-30 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 text-white shadow-2xl border border-slate-700 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-medium">
            Seleccionaste <strong className="text-white">{selectedProducts.length} productos</strong> ({totalUnits} unid)
          </p>
          <p className="text-base font-black text-emerald-400 font-mono">
            Aprox. ${Math.round(estimatedMinTotal).toLocaleString('es-AR')} <span className="text-[10px] font-normal text-slate-400">(mejor combinación)</span>
          </p>
        </div>

        <button
          onClick={onProceedToCompare}
          disabled={selectedProducts.length === 0}
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center cursor-pointer disabled:opacity-40"
        >
          <span>Ir a Comparativa & Días</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

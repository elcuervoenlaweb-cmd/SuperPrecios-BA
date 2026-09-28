import React, { useState } from 'react';
import { X, Check, DollarSign, Store, Tag, ExternalLink, RotateCcw, AlertCircle } from 'lucide-react';
import { InvoiceProduct, SupermarketId } from '../types/products';
import { SUPERMARKETS } from '../data/invoiceProducts';

interface EditPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: InvoiceProduct | null;
  storeId: SupermarketId | null;
  onSavePrice: (
    productId: string,
    storeId: SupermarketId,
    unitPrice: number,
    promoUnitPrice?: number,
    promoDescription?: string
  ) => void;
}

export const EditPriceModal: React.FC<EditPriceModalProps> = ({
  isOpen,
  onClose,
  product,
  storeId,
  onSavePrice,
}) => {
  if (!isOpen || !product || !storeId) return null;

  const store = SUPERMARKETS.find((s) => s.id === storeId);
  const currentPrice = product.prices[storeId];

  const [unitPrice, setUnitPrice] = useState<number>(currentPrice?.unitPrice || 0);
  const [promoUnitPrice, setPromoUnitPrice] = useState<number>(
    currentPrice?.promoUnitPrice !== undefined ? currentPrice.promoUnitPrice : currentPrice?.unitPrice || 0
  );
  const [promoDescription, setPromoDescription] = useState<string>(
    currentPrice?.promoDescription || ''
  );
  const [hasPromo, setHasPromo] = useState<boolean>(
    currentPrice?.promoUnitPrice !== undefined && currentPrice.promoUnitPrice < currentPrice.unitPrice
  );

  let storeSearchUrl = '';
  switch (storeId) {
    case 'coto':
      storeSearchUrl = `https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=${encodeURIComponent(product.barcode)}`;
      break;
    case 'carrefour':
      storeSearchUrl = `https://www.carrefour.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
      break;
    case 'jumbo':
      storeSearchUrl = `https://www.jumbo.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
      break;
    case 'disco':
      storeSearchUrl = `https://www.disco.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
      break;
    case 'dia':
      storeSearchUrl = `https://diaonline.supermercadosdia.com.ar/${encodeURIComponent(product.barcode)}?_q=${encodeURIComponent(product.barcode)}&map=ft`;
      break;
    case 'makro':
      storeSearchUrl = `https://compra.makro.com.ar/buscar?q=${encodeURIComponent(product.barcode || product.name)}`;
      break;
    case 'abastecedor':
      storeSearchUrl = `https://elabastecedor.com.ar/buscar?q=${encodeURIComponent(product.name)}`;
      break;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrice(
      product.id,
      storeId,
      unitPrice,
      hasPromo ? promoUnitPrice : unitPrice,
      hasPromo ? promoDescription : 'Precio de lista'
    );
    onClose();
  };

  const handleSetNoPromo = () => {
    setHasPromo(false);
    setPromoUnitPrice(unitPrice);
    setPromoDescription('Precio de lista regular');
  };

  const calculateQuickDiscount = (pct: number) => {
    if (pct === 70) {
      const avg = unitPrice * 0.65;
      setPromoUnitPrice(Math.round(avg * 100) / 100);
      setPromoDescription('2do al 70% de descuento');
      setHasPromo(true);
    } else if (pct === 50) {
      const avg = unitPrice * 0.75;
      setPromoUnitPrice(Math.round(avg * 100) / 100);
      setPromoDescription('2do al 50% de descuento');
      setHasPromo(true);
    } else {
      const discounted = unitPrice * (1 - pct / 100);
      setPromoUnitPrice(Math.round(discounted * 100) / 100);
      setPromoDescription(`${pct}% OFF`);
      setHasPromo(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Store & Product Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs"
            style={{ backgroundColor: store?.color || '#004F9F' }}
          >
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Actualizar Precio en {store?.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate max-w-[280px]">
              {product.name}
            </p>
          </div>
        </div>

        {/* Real-time Verification Link with Official Store */}
        {storeSearchUrl && (
          <div className="mb-4 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Verificar en la web oficial:
            </span>
            <a
              href={storeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 px-2.5 py-1 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <span>Ver en {store?.shortName} Online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Unit Price Regular */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Precio Regular de Góndola (por 1 unidad)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">EAN: {product.barcode}</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={unitPrice}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setUnitPrice(val);
                  if (!hasPromo) setPromoUnitPrice(val);
                }}
                className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono font-black text-slate-900"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Ingresá el precio que figura en góndola o en la página sin promociones.
            </p>
          </div>

          {/* Quick presets for common Argentine promos */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600">
                Calcular Promoción en Góndola:
              </span>
              <button
                type="button"
                onClick={handleSetNoPromo}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Sin Promo (Solo Precio Lista)
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => calculateQuickDiscount(70)}
                className="py-1 px-1.5 text-[10px] font-bold rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
              >
                2do al 70%
              </button>
              <button
                type="button"
                onClick={() => calculateQuickDiscount(50)}
                className="py-1 px-1.5 text-[10px] font-bold rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 transition-colors cursor-pointer"
              >
                2do al 50%
              </button>
              <button
                type="button"
                onClick={() => calculateQuickDiscount(20)}
                className="py-1 px-1.5 text-[10px] font-bold rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-colors cursor-pointer"
              >
                20% OFF
              </button>
              <button
                type="button"
                onClick={() => calculateQuickDiscount(15)}
                className="py-1 px-1.5 text-[10px] font-bold rounded-lg border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 transition-colors cursor-pointer"
              >
                15% OFF
              </button>
            </div>
          </div>

          {/* Promotional Price Toggle and Input */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPromo}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasPromo(checked);
                    if (!checked) setPromoUnitPrice(unitPrice);
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 mr-2 cursor-pointer"
                />
                Aplicar Promoción de Góndola (2x1, 2do al 70%, etc.)
              </label>
            </div>

            {hasPromo && (
              <div className="space-y-2.5 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Precio Efectivo por Unidad con Promo (ARS)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-emerald-700 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={promoUnitPrice}
                      onChange={(e) => setPromoUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-black text-emerald-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Detalle de la Promoción
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 2do al 70% Coto Digital, 20% Mi Carrefour"
                    value={promoDescription}
                    onChange={(e) => setPromoDescription(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Impact preview */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Cantidad en tu lista:</span>
              <span className="font-bold text-slate-800">{product.quantity} {product.unit}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 mt-1">
              <span>Precio unitario góndola:</span>
              <span className="font-bold text-emerald-700 font-mono">
                ${(hasPromo ? promoUnitPrice : unitPrice).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-900 font-black mt-1.5 pt-1.5 border-t border-slate-200">
              <span>Subtotal producto ({product.quantity} unid):</span>
              <span className="text-sm text-emerald-800 font-mono">
                ${((hasPromo ? promoUnitPrice : unitPrice) * product.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer flex items-center"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Guardar y Recalcular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

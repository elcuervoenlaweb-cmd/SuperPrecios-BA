import React, { useState, useEffect } from 'react';
import { X, Plus, ShoppingBag, Barcode, Sparkles, Loader2, Check } from 'lucide-react';
import { InvoiceProduct } from '../types/products';
import { fetchLiveProductByEan } from '../services/liveEanService';
import { KNOWN_ARGENTINA_EANS } from '../services/eanCatalog';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: InvoiceProduct) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InvoiceProduct['category']>('Lácteos y Frescos');
  const [quantity, setQuantity] = useState(1);
  const [basePrice, setBasePrice] = useState(5699);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [autoResolved, setAutoResolved] = useState(false);
  const [resolvedProduct, setResolvedProduct] = useState<InvoiceProduct | null>(null);

  if (!isOpen) return null;

  const handleLookupEan = async (eanToSearch: string) => {
    const clean = eanToSearch.trim();
    if (clean.length < 8) return;

    setIsSearchingLive(true);
    try {
      const live = await fetchLiveProductByEan(clean, quantity);
      setName(live.name);
      setCategory(live.category);
      setBasePrice(live.prices.carrefour.unitPrice);
      setResolvedProduct(live);
      setAutoResolved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleBarcodeChange = (val: string) => {
    setBarcode(val);
    const clean = val.trim();
    if (clean.length >= 12) {
      handleLookupEan(clean);
    } else {
      setAutoResolved(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEan = barcode.trim() || `779${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    if (resolvedProduct && resolvedProduct.barcode === cleanEan) {
      onAddProduct({
        ...resolvedProduct,
        quantity,
        name: name.trim() || resolvedProduct.name,
        category,
      });
    } else {
      // Async lookup if not done
      fetchLiveProductByEan(cleanEan, quantity).then((live) => {
        onAddProduct({
          ...live,
          name: name.trim() || live.name,
          category,
          quantity,
        });
      });
    }

    onClose();
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

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Agregar Producto con EAN Real
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Consulta en tiempo real en Carrefour, Jumbo, Disco y Día
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Barcode input with auto-detection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center">
                <Barcode className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Código de Barras EAN
              </label>
              {isSearchingLive ? (
                <span className="text-[10px] font-bold text-amber-700 flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Buscando en góndolas online...
                </span>
              ) : autoResolved ? (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center">
                  <Check className="w-3 h-3 mr-0.5" /> ¡Reconocido con Precios Reales!
                </span>
              ) : null}
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Pegá el EAN (ej: 7790742373304, 7792798000041)..."
                value={barcode}
                onChange={(e) => handleBarcodeChange(e.target.value)}
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => handleLookupEan(barcode)}
                disabled={barcode.trim().length < 8 || isSearchingLive}
                className="px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Buscar
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Ejemplo de prueba: probá con <code className="bg-slate-100 px-1 rounded font-bold">7790742373304</code> (Finlandia Light).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre Oficial del Producto
            </label>
            <input
              type="text"
              placeholder="Se autocompleta con la consulta oficial..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Lácteos y Frescos">Lácteos y Frescos</option>
                <option value="Almacén y Pastas">Almacén y Pastas</option>
                <option value="Congelados">Congelados</option>
                <option value="Perfumería e Higiene">Perfumería e Higiene</option>
                <option value="Snacks y Galletitas">Snacks y Galletitas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cantidad a Comprar
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>
          </div>

          {autoResolved && resolvedProduct && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-950 block">Precios Reales Encontrados:</span>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                <span>Carrefour: <strong>${Math.round(resolvedProduct.prices.carrefour.unitPrice).toLocaleString('es-AR')}</strong></span>
                <span>Jumbo: <strong>${Math.round(resolvedProduct.prices.jumbo.unitPrice).toLocaleString('es-AR')}</strong></span>
                <span>Disco: <strong>${Math.round(resolvedProduct.prices.disco.unitPrice).toLocaleString('es-AR')}</strong></span>
                <span>Día %: <strong>${Math.round(resolvedProduct.prices.dia.promoUnitPrice || resolvedProduct.prices.dia.unitPrice).toLocaleString('es-AR')}</strong></span>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSearchingLive}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Agregar a la Comparativa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

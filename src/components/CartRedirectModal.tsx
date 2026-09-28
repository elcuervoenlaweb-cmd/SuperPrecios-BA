import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShoppingCart, 
  Check, 
  Copy, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Zap,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  ExternalLink as LinkIcon
} from 'lucide-react';
import { SupermarketId } from '../types/products';
import { SUPERMARKETS } from '../data/invoiceProducts';
import { GeneratedStoreCart } from '../utils/cartGenerator';
import { GroceryIllustration } from './GroceryIllustrations';

interface CartRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: GeneratedStoreCart | null;
}

export const CartRedirectModal: React.FC<CartRedirectModalProps> = ({
  isOpen,
  onClose,
  cartData,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedList, setCopiedList] = useState(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  if (!isOpen || !cartData) return null;

  const storeInfo = SUPERMARKETS.find((s) => s.id === cartData.storeId) || SUPERMARKETS[0];
  const isCoto = cartData.storeId === 'coto';

  const handleCopyScript = () => {
    navigator.clipboard.writeText(cartData.bookmarkletScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyList = () => {
    navigator.clipboard.writeText(cartData.plainTextList);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2500);
  };

  const toggleItemDone = (id: string) => {
    setAddedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenAllTabs = () => {
    cartData.items.forEach((item) => {
      if (item.searchUrl) {
        window.open(item.searchUrl, '_blank');
      }
    });
  };

  const addedCount = Object.values(addedItems).filter(Boolean).length;
  const totalCount = cartData.items.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm"
              style={{ backgroundColor: storeInfo.color }}
            >
              {storeInfo.shortName[0]}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                  {isCoto ? 'Asistente de Changuito Coto' : 'Carga Automática de Carrito'}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {isCoto ? 'Cargar Productos en Coto Digital' : `Carrito en ${storeInfo.name}`}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Explanation for Coto Digital */}
        {isCoto ? (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 space-y-2">
              <div className="flex items-center space-x-2 font-black text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>¿Por qué Coto Digital no carga el carrito con un solo link?</span>
              </div>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                A diferencia de Carrefour o Jumbo (que usan la plataforma VTEX y aceptan links directos), <strong>Coto Digital utiliza Oracle ATG</strong> con sesiones privadas de usuario. Para que se guarden productos en el changuito, <strong>Coto exige que inicies sesión en tu cuenta</strong> con usuario y contraseña.
              </p>
              <p className="text-amber-900 font-semibold text-[11px]">
                Te preparamos los accesos directos producto por producto con sus cantidades exactas para que los cargues en segundos:
              </p>
            </div>

            {/* Progress counter */}
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="font-bold text-slate-700">
                Progreso: {addedCount} de {totalCount} agregados
              </span>
              <div className="w-36 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${totalCount > 0 ? (addedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* VTEX Status Banner */
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-black text-sm text-emerald-900">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>¡Enlace oficial de carga generado!</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              El checkout oficial de {storeInfo.name} recibió los códigos SKU y cantidades de tus {totalCount} productos.
            </p>
            <div className="pt-2">
              <a
                href={cartData.cartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span>Abrir Checkout en {storeInfo.shortName}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        )}

        {/* Product Items List with Direct 1-Click Search and Checkmark */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase px-1">
            <span>Productos a Cargar ({cartData.items.length})</span>
            <span>Acción</span>
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 max-h-60 overflow-y-auto">
            {cartData.items.map((item, idx) => {
              const isDone = addedItems[item.product.id];

              return (
                <div
                  key={item.product.id}
                  className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                    isDone ? 'bg-emerald-50/50' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <button
                      onClick={() => toggleItemDone(item.product.id)}
                      className="cursor-pointer p-0.5 rounded focus:outline-none shrink-0"
                      title={isDone ? 'Desmarcar' : 'Marcar como agregado'}
                    >
                      {isDone ? (
                        <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                      )}
                    </button>

                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                      <GroceryIllustration type={item.product.iconType || 'fruit'} size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className={`font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {idx + 1}. {item.name}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-bold text-emerald-700 bg-emerald-100/70 px-1 rounded">
                          Llevar: {item.quantity} {item.product.unit}
                        </span>
                        <span>·</span>
                        <span>EAN: {item.barcode}</span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Search and Add button in Coto */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <a
                      href={item.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => toggleItemDone(item.product.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
                      title={`Buscar en ${storeInfo.shortName} y cargar ${item.quantity} unidades`}
                    >
                      <span>Cargar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Bulk Actions for Coto */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-slate-700">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Herramientas Rápidas de Carga</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Open All in tabs */}
            <button
              onClick={handleOpenAllTabs}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer flex items-center"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Abrir Todos en Pestañas
            </button>

            {/* Copy plain text list */}
            <button
              onClick={handleCopyList}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer flex items-center"
            >
              {copiedList ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Lista Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Copiar Lista de Texto
                </>
              )}
            </button>

            {/* Copy In-Page Bookmarklet Script */}
            <button
              onClick={handleCopyScript}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer flex items-center"
              title="Copia un script que podés pegar en la consola o marcador de Coto para tener una barra flotante con tus compras"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Script Copiado!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  Copiar Asistente Flotante Coto
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar Asistente
          </button>
        </div>
      </div>
    </div>
  );
};

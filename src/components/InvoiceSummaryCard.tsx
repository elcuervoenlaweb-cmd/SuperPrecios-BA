import React, { useState } from 'react';
import { FileText, Calendar, User, MapPin, Receipt, CheckCircle, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import { INVOICE_METADATA } from '../data/invoiceProducts';

export const InvoiceSummaryCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl shadow-xl p-6 border border-slate-700/60 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top badge and metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <Receipt className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-500/30">
                  Factura Extraída del PDF
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {INVOICE_METADATA.invoiceType}
                </span>
              </div>
              <h2 className="text-base font-semibold text-white">
                {INVOICE_METADATA.storeName} — Sucursal Martínez
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-300">
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{INVOICE_METADATA.date}</span>
            </div>
            <div className="flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{INVOICE_METADATA.client}</span>
            </div>
            <div className="hidden sm:flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>Hurlingham, GBA</span>
            </div>
          </div>
        </div>

        {/* Invoice Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
            <p className="text-[11px] text-slate-400 font-medium uppercase">Total Artículos</p>
            <p className="text-xl font-extrabold text-white mt-0.5">
              15 <span className="text-xs font-normal text-slate-400">(54 unidades)</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Almacén, Lácteos, Frescos, Higiene</p>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
            <p className="text-[11px] text-slate-400 font-medium uppercase">Precio Lista Bruto</p>
            <p className="text-xl font-extrabold text-slate-300 line-through decoration-rose-400/80 mt-0.5">
              ${INVOICE_METADATA.subtotalGross.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Sin promociones ni descuentos</p>
          </div>

          <div className="bg-emerald-950/40 rounded-xl p-3.5 border border-emerald-500/30">
            <p className="text-[11px] text-emerald-400 font-medium uppercase flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Promos Aplicadas Ticket
            </p>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
              -${INVOICE_METADATA.discountsSum.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-emerald-300/80 mt-1">2do al 50%/70% + Tarjeta Carrefour</p>
          </div>

          <div className="bg-blue-950/50 rounded-xl p-3.5 border border-blue-500/40">
            <p className="text-[11px] text-blue-300 font-medium uppercase">Total Pagado Ticket</p>
            <p className="text-2xl font-black text-white mt-0.5">
              ${INVOICE_METADATA.totalPaid.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-blue-300/80 mt-1">Base para la comparativa</p>
          </div>
        </div>

        {/* Expandable Invoice Details */}
        <div className="mt-4 pt-3 border-t border-slate-700/60">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center font-medium">
              <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              {isExpanded ? 'Ocultar detalles fiscales y desglose de descuentos' : 'Ver desglose de promociones del ticket original (12 descuentos aplicados)'}
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-3 p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 text-xs space-y-2 text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[11px] uppercase font-bold">Datos del Comprobante:</p>
                  <p>• CUIT INC S.A.: <span className="font-mono text-white">30-68731043-4</span></p>
                  <p>• Domicilio Cliente: <span className="text-white">J. Battle y Ordóñez 1518, Hurlingham</span></p>
                  <p>• IVA Contenido (Ley 27.743): <span className="text-emerald-400 font-semibold">$29.399,19</span></p>
                  <p>• Pago: <span className="text-blue-300">Tarjeta Carrefour Mastercard 1 cuota</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 text-[11px] uppercase font-bold">Descuentos Aplicados en la Factura:</p>
                  <p>• 2do al 50% Las Tres Niñas (24 unid): <span className="text-emerald-400 font-semibold">-$15.660,00</span></p>
                  <p>• Tarjeta Carrefour 20% Off Martes: <span className="text-emerald-400 font-semibold">-$7.352,80</span></p>
                  <p>• 40% Off Tarjeta Carrefour / Cuenta Digital: <span className="text-emerald-400 font-semibold">-$7.199,20</span></p>
                  <p>• 2do al 50% Rexona (-$6.838,50) y Silvia (-$5.069,50)</p>
                  <p>• 2do al 50% Don Vicente, La Salteña, Krachitos, Natura, Arcor</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

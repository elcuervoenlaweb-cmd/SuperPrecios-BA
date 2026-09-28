import React, { useState } from 'react';
import { Calendar, BarChart3, TrendingUp, PiggyBank, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BankCardType, InvoiceProduct, SupermarketId } from '../types/products';
import { BANK_CONFIGS, INVOICE_METADATA, SUPERMARKETS } from '../data/invoiceProducts';

interface MonthlyAnalysisProps {
  products: InvoiceProduct[];
  selectedBank: BankCardType;
}

export const MonthlyAnalysis: React.FC<MonthlyAnalysisProps> = ({ products, selectedBank }) => {
  const [purchaseFrequency, setPurchaseFrequency] = useState<'monthly' | 'biweekly' | 'weekly'>('monthly');

  const multiplier = purchaseFrequency === 'monthly' ? 1 : purchaseFrequency === 'biweekly' ? 2 : 4;
  const frequencyLabel =
    purchaseFrequency === 'monthly'
      ? '1 Compra Mensual Completa'
      : purchaseFrequency === 'biweekly'
      ? '2 Compras Quincenales al Mes'
      : '4 Compras Semanales al Mes';

  // Calculate monthly figures per store
  const storeData = SUPERMARKETS.map((store) => {
    let baseBasket = 0;
    products.forEach((p) => {
      const price = p.prices[store.id];
      const effectiveUnit = price.promoUnitPrice !== undefined ? price.promoUnitPrice : price.unitPrice;
      baseBasket += effectiveUnit * p.quantity;
    });

    const bankRule = BANK_CONFIGS[selectedBank].supermarketDiscount[store.id];
    let discountPerPurchase = 0;
    if (bankRule && bankRule.percentage > 0) {
      discountPerPurchase = (baseBasket * bankRule.percentage) / 100;
      if (bankRule.maxCap > 0 && discountPerPurchase > bankRule.maxCap) {
        discountPerPurchase = bankRule.maxCap;
      }
    }

    const netBasket = baseBasket - discountPerPurchase;
    const monthlyNet = netBasket * multiplier;
    const monthlyGross = baseBasket * multiplier;

    return {
      storeId: store.id,
      storeName: store.name,
      shortName: store.shortName,
      color: store.color,
      netBasket,
      monthlyNet,
      monthlyGross,
      monthlySavingsVsCarrefourFactura: (INVOICE_METADATA.totalPaid * multiplier) - monthlyNet,
    };
  });

  // Calculate lowest mixed basket
  let singleMixedBasket = 0;
  products.forEach((p) => {
    const minUnit = Math.min(
      ...SUPERMARKETS.map((s) => {
        const pr = p.prices[s.id];
        return pr.promoUnitPrice !== undefined ? pr.promoUnitPrice : pr.unitPrice;
      })
    );
    singleMixedBasket += minUnit * p.quantity;
  });

  const mixedDiscount = selectedBank !== 'none' ? Math.min(singleMixedBasket * 0.18, 12000) : 0;
  const netMixedBasket = singleMixedBasket - mixedDiscount;
  const monthlyMixedNet = netMixedBasket * multiplier;
  const monthlyMixedSavings = (INVOICE_METADATA.totalPaid * multiplier) - monthlyMixedNet;

  // Find max monthly cost for relative bar heights
  const maxMonthly = Math.max(...storeData.map((d) => d.monthlyNet), INVOICE_METADATA.totalPaid * multiplier);

  // Category breakdown for monthly consumption
  const categoryTotals: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category;
    const carrefourVal = (p.invoicePromoTotal || p.invoiceTotal) * multiplier;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + carrefourVal;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Title & Frequency Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Análisis de Costos Mensuales y Proyección de Ahorro
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulá tu presupuesto mensual de supermercado en base al ticket de consumo habitual y tu banco seleccionado.
          </p>
        </div>

        {/* Frequency selector buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setPurchaseFrequency('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              purchaseFrequency === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1x Mensual
          </button>
          <button
            onClick={() => setPurchaseFrequency('biweekly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              purchaseFrequency === 'biweekly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2x Quincenal
          </button>
          <button
            onClick={() => setPurchaseFrequency('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              purchaseFrequency === 'weekly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4x Semanal
          </button>
        </div>
      </div>

      {/* Visual Bars Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
          <span>Comparativa de Presupuesto Mensual ({frequencyLabel})</span>
          <span className="text-slate-400 font-normal">Valores con promociones y banco aplicados</span>
        </div>

        <div className="space-y-2.5">
          {/* Reference Factura Carrefour */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2" />
                Carrefour (Factura Base Matías Gallardo)
              </span>
              <span className="font-bold text-slate-800 font-mono">
                ${Math.round(INVOICE_METADATA.totalPaid * multiplier).toLocaleString('es-AR')} / mes
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((INVOICE_METADATA.totalPaid * multiplier) / maxMonthly) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Each Supermarket */}
          {storeData.map((s) => {
            const isBest = s.monthlyNet === Math.min(...storeData.map((x) => x.monthlyNet));
            const percentage = (s.monthlyNet / maxMonthly) * 100;

            return (
              <div key={s.storeId}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center">
                    <span
                      className="w-2.5 h-2.5 rounded-full mr-2"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.storeName}
                    {isBest && (
                      <span className="ml-2 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Más Económico Único
                      </span>
                    )}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 font-mono">
                      ${Math.round(s.monthlyNet).toLocaleString('es-AR')} / mes
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        s.monthlySavingsVsCarrefourFactura >= 0
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                      }`}
                    >
                      ({s.monthlySavingsVsCarrefourFactura >= 0 ? 'Ahorrás ' : '+'}
                      ${Math.abs(Math.round(s.monthlySavingsVsCarrefourFactura)).toLocaleString('es-AR')})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isBest ? 'bg-emerald-600' : 'bg-slate-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Mixed Strategy Bar */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-black text-emerald-800 flex items-center">
                <PiggyBank className="w-4 h-4 mr-1.5 text-emerald-600" />
                Compra Mixta Optimizada (Makro + Coto + El Abastecedor)
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-black text-emerald-700 font-mono text-sm">
                  ${Math.round(monthlyMixedNet).toLocaleString('es-AR')} / mes
                </span>
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Ahorro Máximo: ${Math.round(monthlyMixedSavings).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3.5 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(monthlyMixedNet / maxMonthly) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown cards */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          ¿En Qué Rubros se Va Tu Presupuesto Mensual? (Desglose por Categoría)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(categoryTotals).map(([cat, amount]) => {
            const pct = ((amount / (INVOICE_METADATA.totalPaid * multiplier)) * 100).toFixed(1);
            return (
              <div key={cat} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-bold text-slate-700 truncate" title={cat}>
                  {cat}
                </p>
                <p className="text-base font-extrabold text-slate-900 mt-1 font-mono">
                  ${Math.round(amount).toLocaleString('es-AR')}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Representa el <span className="font-bold text-emerald-700">{pct}%</span> del gasto
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

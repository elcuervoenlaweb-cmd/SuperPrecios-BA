import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Store, Tag, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { BankCardType, InvoiceProduct, SupermarketId } from '../types/products';
import { BANK_CONFIGS, SUPERMARKETS } from '../data/invoiceProducts';

interface DayRecommendationCardProps {
  products: InvoiceProduct[];
  selectedBank: BankCardType;
}

interface DayPlan {
  dayName: string;
  shortDay: string;
  isToday?: boolean;
  storeId: SupermarketId;
  storeName: string;
  discountSummary: string;
  bankName: string;
  suggestedProducts: string[];
  estimatedSavings: string;
  badgeColor: string;
}

export const DayRecommendationCard: React.FC<DayRecommendationCardProps> = ({
  products,
  selectedBank,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<string>('todos');

  const selectedProducts = products.filter((p) => p.selected !== false);

  // Dynamic day recommendations based on Argentine supermarket schedule
  const weeklyPlans: DayPlan[] = [
    {
      dayName: 'Lunes',
      shortDay: 'LUN',
      storeId: 'jumbo',
      storeName: 'Jumbo / Disco',
      discountSummary: '25% Santander Select (Jumbo) / 20% Santander Black (Disco) / 20% BBVA en Día',
      bankName: 'Santander / BBVA',
      suggestedProducts: [
        'Perfumería (Dove Clinical, Espuma Gillette)',
        'Productos importados y congelados Granja del Sol'
      ],
      estimatedSavings: 'Hasta $15.000 de reintegro directo',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300'
    },
    {
      dayName: 'Martes',
      shortDay: 'MAR',
      storeId: 'coto',
      storeName: 'Coto & Día %',
      discountSummary: '20% con Tarjeta Naranja X (Plan Z 3 cuotas) en Coto y 25% en Día % / 20% Mi Carrefour',
      bankName: 'Tarjeta Naranja X / Mi Carrefour',
      suggestedProducts: [
        'Yogur Natural Yogurísimo (2do al 70% + Naranja X)',
        'Papas Fritas Krachitos',
        'Galletitas Integra'
      ],
      estimatedSavings: 'Ahorro del 20% al 25% + financiación sin interés',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      dayName: 'Miércoles',
      shortDay: 'MIÉ',
      storeId: 'coto',
      storeName: 'Coto & Carrefour',
      discountSummary: '20% de ahorro Santander (Coto y Carrefour Select) / 20% Santander MODO en Día %',
      bankName: 'Banco Santander',
      suggestedProducts: [
        'Fideos Don Vicente Tallarines y Caserito',
        'Tapas de Pascualina La Salteña',
        'Aceite Girasol Natura Aerosol'
      ],
      estimatedSavings: 'Ahorro directo en caja hasta $12.000',
      badgeColor: 'bg-red-100 text-red-800 border-red-300'
    },
    {
      dayName: 'Jueves',
      shortDay: 'JUE',
      storeId: 'makro',
      storeName: 'Supermercados Makro (Mayorista)',
      discountSummary: '20% reintegro BBVA / 15% Naranja X en Carrefour / Promos bulto cerrado',
      bankName: 'Banco BBVA / Mayorista',
      suggestedProducts: [
        'Leche Las 3 Niñas 1% (Caja cerrada x24 litros)',
        'Puré de Tomate Arcor Brik (Bulto x12 unid)',
        'Desodorantes Rexona (Pack mayorista x6)'
      ],
      estimatedSavings: 'Ahorro récord: hasta $24.000 por volumen mayorista',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    {
      dayName: 'Viernes',
      shortDay: 'VIE',
      storeId: 'coto',
      storeName: 'Coto C.I.C.S.A.',
      discountSummary: '20% a 25% de reintegro MODO BBVA (tope $15.000) + 2do al 70% Coto',
      bankName: 'Banco BBVA (MODO)',
      suggestedProducts: [
        'Yogurísimo Natural ($3.360,50 c/u con 2do al 70%)',
        'Relleno de Tarta Granja del Sol (35% OFF)',
        'Fiambrería y quesos'
      ],
      estimatedSavings: 'Máximo beneficio bancario de la semana ($15.000)',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    {
      dayName: 'Sábados',
      shortDay: 'SÁB',
      storeId: 'abastecedor',
      storeName: 'El Abastecedor & Fiambrerías',
      discountSummary: '25% Cuenta DNI / 20% Naranja X en comercios y carnicerías',
      bankName: 'Cuenta DNI / Naranja X',
      suggestedProducts: [
        'Queso Mozzarella Silvia Cilindro x 500g',
        'Carnes frescas y embutidos',
        'Lácteos del día'
      ],
      estimatedSavings: 'Ahorro de $7.000 a $8.000 en frescos',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  ];

  const filteredPlans =
    selectedDayTab === 'todos'
      ? weeklyPlans
      : weeklyPlans.filter((p) => p.dayName.toLowerCase() === selectedDayTab.toLowerCase());

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Calendario Inteligente: ¿Qué día te conviene comprar cada producto?
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Programá tus compras semanales en Buenos Aires según el día de mayor descuento bancario y promociones de góndola.
          </p>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto bg-slate-100 p-1 rounded-xl text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setSelectedDayTab('todos')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedDayTab === 'todos'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toda la Semana
          </button>
          {weeklyPlans.map((wp) => (
            <button
              key={wp.dayName}
              onClick={() => setSelectedDayTab(wp.dayName)}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedDayTab === wp.dayName
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {wp.shortDay}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.map((plan) => {
          const store = SUPERMARKETS.find((s) => s.id === plan.storeId);

          return (
            <div
              key={plan.dayName}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4.5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs"
            >
              <div>
                {/* Header: Day Badge & Store */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg border ${plan.badgeColor}`}>
                    {plan.dayName}
                  </span>
                  <span className="text-xs font-bold text-slate-700 flex items-center">
                    <Store className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {plan.storeName}
                  </span>
                </div>

                {/* Deal headline */}
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  {plan.discountSummary}
                </h4>

                {/* Bank / Card requirement */}
                <p className="text-[11px] font-semibold text-indigo-600 mt-1 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Medio de pago: {plan.bankName}
                </p>

                {/* Products to buy on this day */}
                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    🛒 Qué comprar este día:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {plan.suggestedProducts.map((prod, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-emerald-500 mr-1.5 font-bold">✓</span>
                        <span>{prod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom savings note */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Beneficio:</span>
                <span className="font-extrabold text-emerald-700">{plan.estimatedSavings}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

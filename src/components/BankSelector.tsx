import React from 'react';
import { CreditCard, ShieldCheck, Tag, Info, Sparkles } from 'lucide-react';
import { BankCardType } from '../types/products';
import { BANK_CONFIGS, SUPERMARKETS } from '../data/invoiceProducts';

interface BankSelectorProps {
  selectedBank: BankCardType;
  onSelectBank: (bank: BankCardType) => void;
}

export const BankSelector: React.FC<BankSelectorProps> = ({ selectedBank, onSelectBank }) => {
  const bankKeys: BankCardType[] = ['none', 'bbva', 'santander', 'naranja', 'carrefour_card', 'cuentadni'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <CreditCard className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Descuentos Bancarios y Medios de Pago
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulá el impacto en cada supermercado con las promociones bancarias de Buenos Aires (BBVA, Santander, Naranja X, etc.)
          </p>
        </div>

        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 self-start md:self-auto">
          <Tag className="w-3.5 h-3.5 mr-1" />
          Aplica sobre precio final o góndola
        </div>
      </div>

      {/* Bank Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
        {bankKeys.map((key) => {
          const bank = BANK_CONFIGS[key];
          const isSelected = selectedBank === key;

          return (
            <button
              key={key}
              onClick={() => onSelectBank(key)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isSelected ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  />
                  {isSelected && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.2 rounded">
                      Activo
                    </span>
                  )}
                </div>
                <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                  {bank.name}
                </p>
              </div>

              <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                {key === 'bbva' && '20%-25% Viernes/Martes'}
                {key === 'santander' && '20%-25% Miércoles/Lunes'}
                {key === 'naranja' && '15%-25% + Plan Z'}
                {key === 'carrefour_card' && '20% Martes + 40% Digital'}
                {key === 'cuentadni' && '20%-25% Sáb/Lun'}
                {key === 'none' && 'Precio lista / góndola'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Bank details breakdown banner */}
      {selectedBank !== 'none' && (
        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          <div className="flex items-center space-x-2 font-semibold text-slate-800 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Beneficios activos con {BANK_CONFIGS[selectedBank].name}:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {SUPERMARKETS.map((store) => {
              const rule = BANK_CONFIGS[selectedBank].supermarketDiscount[store.id];
              if (!rule || rule.percentage === 0) return null;
              return (
                <div
                  key={store.id}
                  className="p-2 rounded-lg bg-white border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{store.shortName}</span>
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                      {rule.percentage}% OFF
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {rule.dayRule} {rule.maxCap > 0 && `(Tope: $${rule.maxCap.toLocaleString('es-AR')})`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

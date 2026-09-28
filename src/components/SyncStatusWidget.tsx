import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Clock, FileSpreadsheet, Plus, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { PriceSyncStatus } from '../services/priceSyncService';

interface SyncStatusWidgetProps {
  syncStatus: PriceSyncStatus;
  isSyncing: boolean;
  onTriggerSync: () => void;
  onOpenSheetModal: () => void;
  onOpenAddModal: () => void;
  lastSheetUrl: string | null;
}

export const SyncStatusWidget: React.FC<SyncStatusWidgetProps> = ({
  syncStatus,
  isSyncing,
  onTriggerSync,
  onOpenSheetModal,
  onOpenAddModal,
  lastSheetUrl,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-700/60">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Schedule Information */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sincronización Automática 2 Veces al Día</span>
            </span>

            <span className="inline-flex items-center text-[10px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              <Clock className="w-3 h-3 mr-1 text-amber-400" />
              Próxima: {syncStatus.nextScheduledShift}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <h4 className="text-sm sm:text-base font-black text-white">
              Precios y Promociones al Día
            </h4>
            <span className="text-xs text-emerald-400 font-bold hidden sm:inline">
              · {syncStatus.lastSyncFormatted}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed max-w-2xl">
            La app actualiza automáticamente las góndolas y promociones bancarias a la mañana (08:00 hs) y a la tarde (14:30 hs). La lista de productos se gestiona desde tu <strong>Google Sheet editable</strong> agregando únicamente el <strong>código EAN</strong>.
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Force Sync Button */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            title="Fuerza la actualización instantánea de góndolas y consulta al Google Sheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando Góndolas...' : 'Sincronizar Ahora'}</span>
          </button>

          {/* Google Sheet Access Button */}
          <button
            onClick={onOpenSheetModal}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lastSheetUrl ? 'Ver Google Sheet Maestro' : 'Conectar Google Sheet'}</span>
          </button>

          {/* Add Product by EAN Button */}
          <button
            onClick={onOpenSheetModal}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Agregar con EAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};

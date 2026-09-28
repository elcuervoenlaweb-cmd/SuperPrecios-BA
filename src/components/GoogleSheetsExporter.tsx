import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  Sparkles, 
  X, 
  ShieldAlert,
  Plus,
  ArrowDownToLine,
  Database,
  Barcode
} from 'lucide-react';
import { BankCardType, InvoiceProduct } from '../types/products';
import { 
  createAndPopulateGoogleSheet, 
  importProductsFromGoogleSheet, 
  exportToCsv,
  SheetImportResult 
} from '../services/googleSheets';
import { googleSignIn } from '../services/auth';
import { resolveEanToProduct, KNOWN_ARGENTINA_EANS } from '../services/eanCatalog';
import { fetchLiveProductByEan } from '../services/liveEanService';

interface GoogleSheetsExporterProps {
  isOpen: boolean;
  onClose: () => void;
  products: InvoiceProduct[];
  selectedBank: BankCardType;
  user: User | null;
  accessToken: string | null;
  onAuthSuccess: (user: User, token: string) => void;
  onSheetCreated: (url: string) => void;
  onProductsImported: (newProducts: InvoiceProduct[]) => void;
  lastSheetUrl: string | null;
}

export const GoogleSheetsExporter: React.FC<GoogleSheetsExporterProps> = ({
  isOpen,
  onClose,
  products,
  selectedBank,
  user,
  accessToken,
  onAuthSuccess,
  onSheetCreated,
  onProductsImported,
  lastSheetUrl,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [manualEanInput, setManualEanInput] = useState('');

  if (!isOpen) return null;

  // Extract spreadsheetId from URL
  const getSpreadsheetId = (url: string | null): string | null => {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await googleSignIn();
      if (res) {
        onAuthSuccess(res.user, res.accessToken);
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteCreateSheet = async () => {
    setShowConfirmDialog(false);
    if (!accessToken) {
      setError('Por favor iniciá sesión con Google para sincronizar con Google Sheets.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMsg(null);
      const result = await createAndPopulateGoogleSheet(accessToken, products, selectedBank);
      onSheetCreated(result.spreadsheetUrl);
      setSuccessMsg('¡Catálogo Maestro creado en tu Google Drive! Ya podés abrirlo y editarlo.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al crear la hoja de cálculo en Google Sheets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromSheet = async () => {
    const sheetId = getSpreadsheetId(lastSheetUrl);
    if (!accessToken || !sheetId) {
      setError('Para sincronizar, primero creá o conectá tu hoja de cálculo en Google Drive.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMsg(null);
      const result: SheetImportResult = await importProductsFromGoogleSheet(accessToken, sheetId, products);
      onProductsImported(result.products);
      
      let msg = `¡Sincronizado! Se leyeron ${result.products.length} productos del Google Sheet.`;
      if (result.addedCount > 0) {
        msg += ` Se detectaron ${result.addedCount} productos nuevos agregados por código EAN.`;
      }
      setSuccessMsg(msg);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al leer el Google Sheet. Verificá los permisos de tu cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDirectByEan = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEan = manualEanInput.trim();
    if (!cleanEan) return;

    // Check if already in products
    if (products.some((p) => p.barcode === cleanEan)) {
      setError('Ese producto ya está en tu lista.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const newProd = await fetchLiveProductByEan(cleanEan);
      onProductsImported([newProd, ...products]);
      setManualEanInput('');
      setSuccessMsg(`¡Producto identificado con precios reales! ${newProd.name} (Carrefour: $${Math.round(newProd.prices.carrefour.unitPrice).toLocaleString('es-AR')})`);
    } catch (err: any) {
      setError(err?.message || 'Error al buscar el código EAN');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = exportToCsv(products);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SuperPrecios_BA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Catálogo Maestro Bidireccional
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              Google Sheet Editable con solo EAN
            </h3>
          </div>
        </div>

        {/* Confirmation Dialog for Workspace API action */}
        {showConfirmDialog ? (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3 mb-4">
            <div className="flex items-start space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  ¿Crear Catálogo Maestro en tu Google Drive?
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Se creará un archivo llamado <strong className="font-semibold">SuperPrecios BA - Catálogo Maestro</strong> en tu Google Drive. Podrás abrirlo en cualquier momento y agregar productos escribiendo únicamente su código EAN en la columna A.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteCreateSheet}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
              >
                Sí, Crear en mi Google Drive
              </button>
            </div>
          </div>
        ) : null}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* How It Works Explanatory Box */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 mb-4">
          <div className="flex items-center space-x-2 font-bold text-slate-900">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>¿Cómo funciona la carga por Código EAN en Google Sheet?</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            1. Abrí tu Google Sheet vinculado.<br />
            2. En una nueva fila de la <strong>Columna A</strong>, escribí el <strong>código de barras EAN</strong> (ej. <code className="bg-white px-1 rounded border">7792798000041</code> para Yerba Playadito, <code className="bg-white px-1 rounded border">7790895000997</code> para Fideos Lucchetti).<br />
            3. Al hacer clic en <strong>"Sincronizar desde Sheet"</strong>, la app lo reconoce automáticamente, autocompleta el nombre y busca las mejores ofertas en los 7 supermercados.
          </p>
        </div>

        {/* Quick Add Product by EAN right inside the app */}
        <form onSubmit={handleAddDirectByEan} className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-2 mb-4">
          <div className="flex items-center justify-between font-bold text-emerald-950">
            <span className="flex items-center space-x-1.5">
              <Barcode className="w-4 h-4 text-emerald-700" />
              <span>Agregar Producto Rápido con solo EAN</span>
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ingresá el código EAN (ej: 7792798000041)..."
              value={manualEanInput}
              onChange={(e) => setManualEanInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <button
              type="submit"
              disabled={!manualEanInput.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </form>

        {/* Main Status & Action */}
        <div className="space-y-4">
          {lastSheetUrl ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Hoja de Cálculo Vinculada</span>
                </div>
                <a
                  href={lastSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  Abrir en Google Sheets
                </a>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  onClick={handleSyncFromSheet}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Importar Cambios & Nuevos EANs desde Sheet</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Connect / Create Button */}
          {!user ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Iniciá sesión para vincular tu Google Sheet:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permite a la aplicación crear la hoja de cálculo con los productos y sincronizar automáticamente las variaciones de precios y nuevos códigos EAN.
              </p>
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="gsi-material-button w-full cursor-pointer flex items-center justify-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xs transition-all"
              >
                <div className="w-4 h-4 mr-2">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                <span>Conectar con Google</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span>Conectado como: <strong className="text-slate-900">{user.email}</strong></span>
                <span className="text-emerald-700 font-bold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" /> Permisos Sheets OK
                </span>
              </div>

              {!lastSheetUrl && (
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                  <span>Crear Catálogo Maestro en mi Google Drive</span>
                </button>
              )}
            </div>
          )}

          {/* Secondary Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleDownloadCsv}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Descargar Respaldo CSV
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

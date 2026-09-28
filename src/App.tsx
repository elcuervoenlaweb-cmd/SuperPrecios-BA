import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  CheckSquare, 
  Search, 
  Trophy, 
  CreditCard, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  Layers
} from 'lucide-react';
import { Header } from './components/Header';
import { InvoiceSummaryCard } from './components/InvoiceSummaryCard';
import { BankSelector } from './components/BankSelector';
import { WinnerVerdictCard } from './components/WinnerVerdictCard';
import { PriceComparisonTable } from './components/PriceComparisonTable';
import { MonthlyAnalysis } from './components/MonthlyAnalysis';
import { GoogleSheetsExporter } from './components/GoogleSheetsExporter';
import { AddProductModal } from './components/AddProductModal';
import { EditPriceModal } from './components/EditPriceModal';
import { ProductSelectorList } from './components/ProductSelectorList';
import { DayRecommendationCard } from './components/DayRecommendationCard';
import { FinalShoppingList } from './components/FinalShoppingList';
import { FloatingGroceryDecorations } from './components/GroceryIllustrations';
import { SyncStatusWidget } from './components/SyncStatusWidget';
import { BankCardType, InvoiceProduct, PurchaseStrategy, SupermarketId } from './types/products';
import { INITIAL_INVOICE_PRODUCTS } from './data/invoiceProducts';
import { initAuth, setCachedAccessToken } from './services/auth';
import { getSyncStatus, executeDailyCatalogSync, PriceSyncStatus } from './services/priceSyncService';

type AppStep = 'products' | 'compare' | 'verdict' | 'checkout';

export default function App() {
  const [products, setProducts] = useState<InvoiceProduct[]>(() => {
    try {
      const saved = localStorage.getItem('superprecios_custom_products_v3');
      if (saved) {
        const parsed: InvoiceProduct[] = JSON.parse(saved);
        return parsed.map((p) => {
          if (p.barcode === '7790742373304') {
            return {
              ...p,
              name: 'Queso untable Finlandia light pote 290 g',
              category: 'Lácteos y Frescos',
              unit: 'unid',
              iconType: 'dairy',
              invoicePriceUnit: 5699,
              invoiceTotal: 5699 * p.quantity,
              prices: {
                carrefour: { unitPrice: 5699, promoUnitPrice: 5699, promoDescription: 'Precio góndola online Carrefour', inStock: true },
                coto: { unitPrice: 5650, promoUnitPrice: 5650, promoDescription: 'Precio góndola Coto Digital', inStock: true },
                jumbo: { unitPrice: 5900, promoUnitPrice: 5900, promoDescription: 'Precio góndola Jumbo Online', inStock: true },
                disco: { unitPrice: 5550, promoUnitPrice: 5550, promoDescription: 'Precio góndola Disco Online', inStock: true },
                dia: { unitPrice: 5698, promoUnitPrice: 4273.5, promoDescription: 'Club Día % ($4.273,50)', inStock: true },
                makro: { unitPrice: 5129, promoUnitPrice: 4890, promoDescription: 'Escala mayorista', inStock: true },
                abastecedor: { unitPrice: 5290, promoUnitPrice: 5290, promoDescription: 'Precio mostrador', inStock: true },
              },
            };
          }
          return p;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INVOICE_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('superprecios_custom_products_v3', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  const [selectedBank, setSelectedBank] = useState<BankCardType>('bbva');
  const [currentStep, setCurrentStep] = useState<AppStep>('products');
  const [strategy, setStrategy] = useState<PurchaseStrategy>('winner');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{ product: InvoiceProduct; storeId: SupermarketId } | null>(null);
  const [viewMode, setViewMode] = useState<'unit' | 'total'>('unit');
  const [sheetUrl, setSheetUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('superprecios_sheet_url_v1') || null;
    } catch {
      return null;
    }
  });
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [verdictSubTab, setVerdictSubTab] = useState<'winner' | 'monthly'>('winner');

  // Twice-daily sync status
  const [syncStatus, setSyncStatus] = useState<PriceSyncStatus>(getSyncStatus);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    if (sheetUrl) {
      try {
        localStorage.setItem('superprecios_sheet_url_v1', sheetUrl);
      } catch (e) {
        console.error(e);
      }
    }
  }, [sheetUrl]);

  // Automated twice daily sync trigger on boot if outdated
  useEffect(() => {
    if (!syncStatus.isUpToDate) {
      handleTriggerSync();
    }
  }, []);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const { updatedProducts, status } = await executeDailyCatalogSync(products);
      setProducts(updatedProducts);
      setSyncStatus(status);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        if (token) {
          setAccessToken(token);
          setCachedAccessToken(token);
        }
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleUpdateQuantity = (id: string, newQty: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const effectiveUnit = p.invoicePromoUnit || p.invoicePriceUnit;
        return {
          ...p,
          quantity: newQty,
          invoiceTotal: p.invoicePriceUnit * newQty,
          invoicePromoTotal: effectiveUnit * newQty,
        };
      })
    );
  };

  const handleToggleProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: p.selected === false ? true : false } : p))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setProducts((prev) => prev.map((p) => ({ ...p, selected: select })));
  };

  const handleAddProduct = (newProduct: InvoiceProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleAuthChange = (newUser: User | null, token: string) => {
    setUser(newUser);
    setAccessToken(token);
    if (token) setCachedAccessToken(token);
  };

  const handleSavePrice = (
    productId: string,
    storeId: SupermarketId,
    unitPrice: number,
    promoUnitPrice?: number,
    promoDescription?: string
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          prices: {
            ...p.prices,
            [storeId]: {
              ...p.prices[storeId],
              unitPrice,
              promoUnitPrice,
              promoDescription,
            },
          },
        };
      })
    );
  };

  const selectedProducts = products.filter((p) => p.selected !== false);
  const totalUnits = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);

  const stepList = [
    {
      id: 'products',
      number: '1',
      title: 'Mi Lista & Cantidades',
      subtitle: `${selectedProducts.length} seleccionados`,
      icon: CheckSquare,
    },
    {
      id: 'compare',
      number: '2',
      title: 'Comparativa & Días',
      subtitle: 'Precios vivos y bancos',
      icon: Search,
    },
    {
      id: 'verdict',
      number: '3',
      title: 'Ganador & Estrategia',
      subtitle: 'Podio y proyección',
      icon: Trophy,
    },
    {
      id: 'checkout',
      number: '4',
      title: 'Lista Final & Pago',
      subtitle: 'Checklist y enlaces',
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col selection:bg-emerald-500 selection:text-white relative">
      {/* Background Grocery Drawings for warm visual feeling */}
      <FloatingGroceryDecorations />

      {/* Top Header */}
      <Header
        user={user}
        onAuthChange={handleAuthChange}
        isConnectingSheets={false}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        sheetUrl={sheetUrl}
      />

      {/* Stepper Navigation Header (Mobile-responsive, touch-friendly) */}
      <nav aria-label="Pasos de la compra" className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-18 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
            {stepList.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast =
                (step.id === 'products' && currentStep !== 'products') ||
                (step.id === 'compare' && (currentStep === 'verdict' || currentStep === 'checkout')) ||
                (step.id === 'verdict' && currentStep === 'checkout');

              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id as AppStep)}
                  className={`flex items-center space-x-2.5 py-1.5 px-3 rounded-xl transition-all shrink-0 cursor-pointer text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                      isActive
                        ? 'bg-white text-emerald-700'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {step.number}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none">
                      {step.title}
                    </span>
                    <span
                      className={`text-[10px] leading-tight mt-0.5 ${
                        isActive ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {step.subtitle}
                    </span>
                  </div>

                  {idx < stepList.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-1 hidden lg:block" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 relative z-10">
        {/* Twice Daily Automated Price & Sheet Sync Bar */}
        <SyncStatusWidget
          syncStatus={syncStatus}
          isSyncing={isSyncing}
          onTriggerSync={handleTriggerSync}
          onOpenSheetModal={() => setIsSheetsModalOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          lastSheetUrl={sheetUrl}
        />

        {/* Collapsible Reference Invoice Source Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 sm:px-5 flex items-center justify-between text-xs bg-slate-50/70 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-blue-100 text-blue-700">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <span className="font-semibold text-slate-700">
                Ticket Base: Factura B Carrefour N° 20356-06848012 (Matías Gallardo · Hurlingham)
              </span>
            </div>
            <button
              onClick={() => setShowInvoiceDetails(!showInvoiceDetails)}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
            >
              {showInvoiceDetails ? 'Ocultar Detalle' : 'Ver Detalle del Ticket'}
            </button>
          </div>
          {showInvoiceDetails && (
            <div className="p-4 border-t border-slate-100">
              <InvoiceSummaryCard />
            </div>
          )}
        </div>

        {/* Global Bank Selection component on Steps 2 and 3 */}
        {(currentStep === 'compare' || currentStep === 'verdict') && (
          <div className="animate-in fade-in duration-150">
            <BankSelector
              selectedBank={selectedBank}
              onSelectBank={setSelectedBank}
            />
          </div>
        )}

        {/* ================= STEP 1: Product & Quantity Selection ================= */}
        {currentStep === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ProductSelectorList
              products={products}
              onToggleProduct={handleToggleProduct}
              onSelectAll={handleSelectAll}
              onUpdateQuantity={handleUpdateQuantity}
              onProceedToCompare={() => setCurrentStep('compare')}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </div>
        )}

        {/* ================= STEP 2: Live Price Comparison & Best Days ================= */}
        {currentStep === 'compare' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Navigation between Steps */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setCurrentStep('products')}
                className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Volver a Seleccionar Productos ({selectedProducts.length})
              </button>

              <button
                onClick={() => setCurrentStep('verdict')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                <span>Ver Supermercado Ganador & Podio</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>

            {/* Which day to buy at which supermarket */}
            <DayRecommendationCard
              products={products}
              selectedBank={selectedBank}
            />

            {/* Live Price Table with In-line Editing */}
            <PriceComparisonTable
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onEditCellPrice={(prod, store) => setEditingCell({ product: prod, storeId: store })}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              selectedBank={selectedBank}
            />

            {/* Bottom Proceed Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep('verdict')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                <span>Avanzar al Análisis del Ganador</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: Winner Verdict, Strategy & Monthly ================= */}
        {currentStep === 'verdict' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Step 3 Navigation Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setCurrentStep('compare')}
                className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Volver a la Comparativa en Vivo
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVerdictSubTab('winner')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    verdictSubTab === 'winner'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🏆 Podio y Estrategia
                </button>
                <button
                  onClick={() => setVerdictSubTab('monthly')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    verdictSubTab === 'monthly'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  📊 Proyección Mensual
                </button>
              </div>

              <button
                onClick={() => setCurrentStep('checkout')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                <span>Preparar Lista y Pagar</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>

            {verdictSubTab === 'winner' ? (
              <WinnerVerdictCard
                products={products}
                selectedBank={selectedBank}
                strategy={strategy}
                onSelectStrategy={setStrategy}
                onGoToCheckout={() => setCurrentStep('checkout')}
              />
            ) : (
              <MonthlyAnalysis
                products={products}
                selectedBank={selectedBank}
              />
            )}

            {/* Bottom Button */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentStep('compare')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-white border border-slate-200 transition-colors cursor-pointer"
              >
                ← Comparativa y Días
              </button>

              <button
                onClick={() => setCurrentStep('checkout')}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center cursor-pointer"
              >
                <span>Finalizar y Preparar Pago</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: Final Shopping List & Checkout ================= */}
        {currentStep === 'checkout' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('verdict')}
                className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Volver al Análisis del Ganador
              </button>

              <button
                onClick={() => setCurrentStep('products')}
                className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Modificar productos en la lista
              </button>
            </div>

            <FinalShoppingList
              products={products}
              selectedBank={selectedBank}
              strategy={strategy}
              onSelectStrategy={setStrategy}
              onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Google Sheets Sync Modal */}
      <GoogleSheetsExporter
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        products={products}
        selectedBank={selectedBank}
        user={user}
        accessToken={accessToken}
        onAuthSuccess={handleAuthChange}
        onSheetCreated={(url) => {
          setSheetUrl(url);
        }}
        onProductsImported={(newProducts) => {
          setProducts(newProducts);
        }}
        lastSheetUrl={sheetUrl}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Edit Price Modal */}
      <EditPriceModal
        isOpen={!!editingCell}
        onClose={() => setEditingCell(null)}
        product={editingCell?.product || null}
        storeId={editingCell?.storeId || null}
        onSavePrice={handleSavePrice}
      />

      {/* Mobile-Friendly Sticky Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            SuperPrecios BA · Comparador de Supermercados de Buenos Aires · Factura Carrefour de Matías Gallardo (Hurlingham)
          </p>
          <p className="text-slate-400">
            Precios actualizados para Coto, Carrefour, Makro, El Abastecedor, Disco, Jumbo y Día % con promociones bancarias
          </p>
        </div>
      </footer>
    </div>
  );
}

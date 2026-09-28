import React from 'react';
import { User } from 'firebase/auth';
import { ShoppingCart, Sparkles, LogOut, CheckCircle2, FileSpreadsheet, Store } from 'lucide-react';
import { googleSignIn, logout } from '../services/auth';

interface HeaderProps {
  user: User | null;
  onAuthChange: (user: User | null, token: string) => void;
  isConnectingSheets: boolean;
  onOpenSheetsModal: () => void;
  sheetUrl?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onAuthChange,
  isConnectingSheets,
  onOpenSheetsModal,
  sheetUrl,
}) => {
  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        onAuthChange(res.user, res.accessToken);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onAuthChange(null, '');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & App title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  SuperPrecios <span className="text-emerald-600 font-black">BA</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                  Comparador Inteligente
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Coto · Carrefour · Makro · El Abastecedor · Disco · Jumbo · Día %
              </p>
            </div>
          </div>

          {/* Right actions: Google Sheets Sync & User Profile */}
          <div className="flex items-center space-x-3">
            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
                Abrir Google Sheet
              </a>
            )}

            <button
              onClick={onOpenSheetsModal}
              disabled={isConnectingSheets}
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-400" />
              <span className="hidden sm:inline">Sincronizar</span> Google Sheets
            </button>

            {/* Google Auth Button or Profile */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuario'}
                    className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.displayName ? user.displayName[0] : 'U'}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium flex items-center">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 inline" /> Google Conectado
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="gsi-material-button cursor-pointer flex items-center justify-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-all"
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

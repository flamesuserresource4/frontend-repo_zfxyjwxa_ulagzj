import { ShieldCheck, FileText, User as UserIcon, LogOut } from 'lucide-react';

export default function Header({ currentRole, userName, onLogout }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Izin Membawa Barang</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1"><FileText size={14}/> Sistem Pendataan & Approval</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userName ? (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 text-sm flex items-center gap-2">
                <UserIcon size={16} />
                <span className="font-medium">{userName}</span>
                <span className="text-gray-400">•</span>
                <span className="uppercase text-xs tracking-wide">{currentRole || 'Tamu'}</span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border hover:bg-gray-50 transition"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Silakan masuk untuk melanjutkan</span>
          )}
        </div>
      </div>
    </header>
  );
}

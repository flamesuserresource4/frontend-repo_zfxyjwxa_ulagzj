import { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import LoginPanel from './components/LoginPanel.jsx';
import PermitForm from './components/PermitForm.jsx';
import ManagementBoard from './components/ManagementBoard.jsx';

function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 border-b">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight">Sistem Izin Membawa Barang</h2>
            <p className="mt-3 text-gray-600">Alur lengkap: Pengajuan oleh User → Persetujuan Pengawas → Cetak kartu izin dengan QR → Verifikasi pelepasan oleh Security.</p>
            <ul className="mt-4 text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>Login multi-peran: Superadmin, User, Pengawas, Security</li>
              <li>Riwayat login tersimpan di halaman</li>
              <li>Kartu izin siap cetak dengan kode verifikasi</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="p-3 rounded-lg bg-indigo-50 border"><p className="font-semibold">Pengajuan</p><p className="text-indigo-700">User</p></div>
              <div className="p-3 rounded-lg bg-emerald-50 border"><p className="font-semibold">Persetujuan</p><p className="text-emerald-700">Pengawas</p></div>
              <div className="p-3 rounded-lg bg-blue-50 border"><p className="font-semibold">Pelepasan</p><p className="text-blue-700">Security</p></div>
            </div>
            <p className="mt-3 text-xs text-gray-500 text-center">Gunakan login sesuai peran untuk mencoba alur di bawah.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [loginHistory, setLoginHistory] = useState([]);
  const [permits, setPermits] = useState([]);
  const [selectedForPrint, setSelectedForPrint] = useState(null);
  const [scanned, setScanned] = useState([]);

  const canCreate = role === 'User' || role === 'Superadmin';

  function handleLogin({ name, role }) {
    setUserName(name);
    setRole(role);
    setLoginHistory((h) => [{ name, role, time: Date.now() }, ...h]);
  }

  function handleLogout() {
    setUserName('');
    setRole('');
  }

  function handleCreatePermit(payload) {
    const id = `IZN-${Date.now().toString(36).toUpperCase()}`;
    const qrCode = `PERMIT-${id}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const doc = {
      id,
      qrCode,
      itemName: payload.itemName,
      quantity: payload.quantity,
      purpose: payload.purpose,
      destination: payload.destination,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      requester: payload.requester,
      status: 'pending',
      supervisorBy: null,
      securityBy: null,
      createdAt: Date.now(),
    };
    setPermits((arr) => [doc, ...arr]);
  }

  function handleApprove(id) {
    setPermits((arr) => arr.map((p) => (p.id === id ? { ...p, status: 'approved', supervisorBy: userName } : p)));
  }
  function handleReject(id) {
    setPermits((arr) => arr.map((p) => (p.id === id ? { ...p, status: 'rejected', supervisorBy: userName } : p)));
  }

  function handlePrintSelect(permit) {
    setSelectedForPrint(permit);
  }

  function handleClosePrint() {
    setSelectedForPrint(null);
  }

  function handleScan(code) {
    let found = null;
    setPermits((arr) => arr.map((p) => {
      if (p.qrCode === code && p.status === 'approved') {
        found = p;
        return { ...p, status: 'released', securityBy: userName };
      }
      return p;
    }));
    if (found) {
      setScanned((s) => [{ permitId: found.id, time: Date.now() }, ...s]);
    }
  }

  const greeting = useMemo(() => (userName ? `Halo, ${userName}!` : 'Selamat datang!'), [userName]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header currentRole={role} userName={userName} onLogout={handleLogout} />
      <Hero />

      {!userName && (
        <LoginPanel onLogin={handleLogin} loginHistory={loginHistory} />
      )}

      {userName && (
        <>
          {canCreate && (
            <PermitForm onCreate={handleCreatePermit} requester={userName} />
          )}
          <ManagementBoard
            role={role}
            userName={userName}
            permits={permits}
            onApprove={handleApprove}
            onReject={handleReject}
            onPrintSelect={handlePrintSelect}
            selectedForPrint={selectedForPrint}
            onClosePrint={handleClosePrint}
            onScan={handleScan}
            scanned={scanned}
          />
        </>
      )}

      <footer className="mt-10 py-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} Sistem Izin Barang — Demo UI</footer>
    </div>
  );
}

export default App;

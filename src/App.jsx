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
            <p className="mt-3 text-gray-600">Alur lengkap: Pengajuan oleh User → Persetujuan Pengawas (satu bagian/section) → Cetak kartu izin dengan QR → Verifikasi pelepasan oleh Security.</p>
            <ul className="mt-4 text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>Login multi-peran: Superadmin, User, Pengawas, Security</li>
              <li>Pengawas hanya memproses pengajuan dari bagian yang sama</li>
              <li>Kartu izin siap cetak dengan kode verifikasi</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="p-3 rounded-lg bg-indigo-50 border"><p className="font-semibold">Pengajuan</p><p className="text-indigo-700">User</p></div>
              <div className="p-3 rounded-lg bg-emerald-50 border"><p className="font-semibold">Persetujuan</p><p className="text-emerald-700">Pengawas</p></div>
              <div className="p-3 rounded-lg bg-blue-50 border"><p className="font-semibold">Pelepasan</p><p className="text-blue-700">Security</p></div>
            </div>
            <p className="mt-3 text-xs text-gray-500 text-center">Gunakan login sesuai peran & bagian untuk mencoba alur di bawah.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  // Database pengguna (dapat dikelola oleh Superadmin di panel Admin)
  const [users, setUsers] = useState([
    { username: 'Dana', password: 'Dana', role: 'Superadmin', section: 'ERS' },
    { username: 'Abi', password: 'Abi', role: 'User', section: 'Plant' },
    { username: 'Aba', password: 'Aba', role: 'Pengawas', section: 'Plant' },
    { username: 'Abu', password: 'Abu', role: 'Security', section: 'ERS' },
  ]);

  const [currentUser, setCurrentUser] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [permits, setPermits] = useState([]);
  const [selectedForPrint, setSelectedForPrint] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const canCreate = currentUser && (currentUser.role === 'User' || currentUser.role === 'Superadmin');

  function handleLogin({ username, password }) {
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) {
      alert('Username atau password salah.');
      return;
    }
    setCurrentUser(found);
    setLoginHistory((h) => [{ name: found.username, role: found.role, section: found.section, time: Date.now() }, ...h]);
  }

  function handleLogout() {
    setCurrentUser(null);
  }

  function handleCreatePermit(payload) {
    if (!currentUser) return;
    const id = `IZN-${Date.now().toString(36).toUpperCase()}`;
    const qrCode = `PERMIT-${id}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const doc = {
      id,
      qrCode,
      items: payload.items,
      purpose: payload.purpose,
      destination: payload.destination,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      requester: currentUser.username,
      section: currentUser.section,
      status: 'pending',
      supervisorBy: null,
      supervisorNote: '',
      securityBy: null,
      createdAt: Date.now(),
    };
    setPermits((arr) => [doc, ...arr]);
  }

  function handleApprove(id, note = '') {
    if (!currentUser) return;
    setPermits((arr) =>
      arr.map((p) => (p.id === id ? { ...p, status: 'approved', supervisorBy: currentUser.username, supervisorNote: note } : p))
    );
  }
  function handleReject(id, note = '') {
    if (!currentUser) return;
    setPermits((arr) =>
      arr.map((p) => (p.id === id ? { ...p, status: 'rejected', supervisorBy: currentUser.username, supervisorNote: note } : p))
    );
  }

  function handlePrintSelect(permit) {
    setSelectedForPrint(permit);
  }

  function handleClosePrint() {
    setSelectedForPrint(null);
  }

  function handleScan({ code, location, note }) {
    if (!currentUser) return;
    let found = null;
    setPermits((arr) =>
      arr.map((p) => {
        if (p.qrCode === code && p.status === 'approved') {
          found = p;
          return { ...p, status: 'released', securityBy: currentUser.username };
        }
        return p;
      })
    );

    const entryBase = {
      by: currentUser.username,
      location,
      time: Date.now(),
      note: note || '',
    };

    if (found) {
      setScanHistory((s) => [
        { ...entryBase, result: 'released', permitId: found.id, data: { requester: found.requester, section: found.section, items: found.items } },
        ...s,
      ]);
    } else {
      setScanHistory((s) => [
        { ...entryBase, result: 'invalid', permitId: code, data: null },
        ...s,
      ]);
      alert('Kode tidak valid atau belum disetujui.');
    }
  }

  // Admin: kelola database pengguna
  function addUser(user) {
    setUsers((prev) => [user, ...prev]);
  }
  function removeUser(username) {
    setUsers((prev) => prev.filter((u) => u.username !== username));
  }

  const greeting = useMemo(() => (currentUser ? `Halo, ${currentUser.username}!` : 'Selamat datang!'), [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header currentRole={currentUser?.role} userName={currentUser?.username} onLogout={handleLogout} />
      <Hero />

      {!currentUser && <LoginPanel onLogin={handleLogin} />}

      {currentUser && (
        <>
          {canCreate && <PermitForm onCreate={handleCreatePermit} requester={currentUser.username} section={currentUser.section} />}
          <ManagementBoard
            role={currentUser.role}
            section={currentUser.section}
            userName={currentUser.username}
            permits={permits}
            onApprove={handleApprove}
            onReject={handleReject}
            onPrintSelect={handlePrintSelect}
            selectedForPrint={selectedForPrint}
            onClosePrint={handleClosePrint}
            onScan={handleScan}
            scanHistory={scanHistory}
            users={users}
            addUser={addUser}
            removeUser={removeUser}
            loginHistory={loginHistory}
          />
        </>
      )}

      <footer className="mt-10 py-8 text-center text-sm text-gray-500">© {new Date().getFullYear()} Sistem Izin Barang — Demo UI</footer>
    </div>
  );
}

export default App;

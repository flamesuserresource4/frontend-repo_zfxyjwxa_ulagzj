import { LogIn } from 'lucide-react';
import { useState } from 'react';

const roles = [
  { value: 'Superadmin', label: 'Superadmin' },
  { value: 'User', label: 'User' },
  { value: 'Pengawas', label: 'Pengawas' },
  { value: 'Security', label: 'Security' },
];

export default function LoginPanel({ onLogin, loginHistory = [] }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin({ name: name.trim(), role });
    setName('');
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-2 gap-8">
      <div className="rounded-xl border p-6 bg-white shadow-sm">
        <h2 className="text-base font-semibold mb-2">Masuk</h2>
        <p className="text-sm text-gray-500 mb-6">Gunakan akun sesuai peran Anda untuk mengakses fitur.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Peran</label>
            <select
              className="w-full rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <LogIn size={18} /> Masuk
          </button>
        </form>
      </div>

      <div className="rounded-xl border p-6 bg-white shadow-sm">
        <h2 className="text-base font-semibold mb-2">Riwayat Login</h2>
        <p className="text-sm text-gray-500 mb-4">Catatan waktu & peran yang login.</p>
        <div className="max-h-72 overflow-auto divide-y">
          {loginHistory.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada riwayat.</p>
          )}
          {loginHistory.map((h, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{h.name} <span className="text-gray-400">•</span> <span className="uppercase">{h.role}</span></p>
                <p className="text-gray-500">{new Date(h.time).toLocaleString()}</p>
              </div>
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">#{String(idx + 1).padStart(3, '0')}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

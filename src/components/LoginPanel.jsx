import { LogIn } from 'lucide-react';
import { useMemo, useState } from 'react';

const ROLE_OPTIONS = [
  { value: 'Superadmin', label: 'Superadmin' },
  { value: 'User', label: 'User' },
  { value: 'Pengawas', label: 'Pengawas' },
  { value: 'Security', label: 'Security' },
];

const SECTIONS = ['Produksi', 'Keuangan', 'HR', 'Umum'];

export default function LoginPanel({ onLogin, allowedRoles = { Superadmin: true, User: true, Pengawas: true, Security: true } }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');
  const [section, setSection] = useState(SECTIONS[0]);

  const filteredRoles = useMemo(() => ROLE_OPTIONS.filter(r => allowedRoles[r.value]), [allowedRoles]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin({ name: name.trim(), role, section });
    setName('');
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-2 gap-8">
      <div className="rounded-xl border p-6 bg-white shadow-sm lg:col-span-2">
        <h2 className="text-base font-semibold mb-2">Masuk</h2>
        <p className="text-sm text-gray-500 mb-6">Gunakan akun sesuai peran dan bagian (Section) Anda untuk mengakses fitur.</p>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
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
              {filteredRoles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bagian (Section)</label>
            <select
              className="w-full rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              {SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <LogIn size={18} /> Masuk
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

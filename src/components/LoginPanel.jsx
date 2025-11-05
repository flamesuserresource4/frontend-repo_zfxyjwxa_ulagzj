import { LogIn } from 'lucide-react';
import { useState } from 'react';

export default function LoginPanel({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    onLogin({ username: username.trim(), password: password.trim() });
    setPassword('');
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-2 gap-8">
      <div className="rounded-xl border p-6 bg-white shadow-sm lg:col-span-2">
        <h2 className="text-base font-semibold mb-2">Masuk</h2>
        <p className="text-sm text-gray-500 mb-6">Gunakan username dan password yang telah ditentukan oleh Superadmin.</p>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Contoh: Dana"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex items-end justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <LogIn size={18} /> Masuk
            </button>
          </div>
        </form>
        <div className="mt-4 text-xs text-gray-500">
          Contoh akun: Dana/Dana (Superadmin, ERS) • Abi/Abi (User, Plant) • Aba/Aba (Pengawas, Plant) • Abu/Abu (Security, ERS)
        </div>
      </div>
    </section>
  );
}

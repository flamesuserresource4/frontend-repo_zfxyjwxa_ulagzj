import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Printer, Shield, QrCode, Trash2, Users, Plus } from 'lucide-react';

function Badge({ children, color = 'gray' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    violet: 'bg-violet-100 text-violet-800',
  };
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[color]}`}>{children}</span>;
}

function statusMeta(status) {
  switch (status) {
    case 'pending':
      return { label: 'Menunggu', color: 'yellow' };
    case 'approved':
      return { label: 'Disetujui', color: 'green' };
    case 'rejected':
      return { label: 'Ditolak', color: 'red' };
    case 'released':
      return { label: 'Dilepas', color: 'blue' };
    default:
      return { label: status, color: 'gray' };
  }
}

function PermitCard({ permit, role, onApprove, onReject, onPrint }) {
  const meta = statusMeta(permit.status);
  const [note, setNote] = useState('');
  return (
    <div className="border rounded-lg p-4 bg-white flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{permit.items.map(it=>`${it.name} (x${it.qty})`).join(', ')}</h4>
          <Badge color={meta.color}>{meta.label}</Badge>
          <Badge color="violet">{permit.section}</Badge>
        </div>
        <span className="text-xs text-gray-500">ID: {permit.id}</span>
      </div>
      <p className="text-sm text-gray-600">Pemohon: <span className="font-medium text-gray-800">{permit.requester}</span> • Tujuan: {permit.destination}</p>
      <p className="text-sm text-gray-600">Periode: <span className="font-medium text-gray-800">{permit.dateFrom}</span>{permit.dateTo && ` → ${permit.dateTo}`}</p>
      {role === 'Pengawas' && permit.status === 'pending' && (
        <div className="mt-1">
          <label className="block text-xs font-medium mb-1">Catatan (opsional)</label>
          <textarea value={note} onChange={(e)=>setNote(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Tulis catatan persetujuan/penolakan"/>
        </div>
      )}
      <div className="flex items-center gap-2 mt-2">
        {onApprove && permit.status === 'pending' && role === 'Pengawas' && (
          <button onClick={() => onApprove(permit.id, note)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700">
            <CheckCircle2 size={16}/> Setujui
          </button>
        )}
        {onReject && permit.status === 'pending' && role === 'Pengawas' && (
          <button onClick={() => onReject(permit.id, note)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700">
            <XCircle size={16}/> Tolak
          </button>
        )}
        {onPrint && permit.status === 'approved' && (
          <button onClick={() => onPrint(permit)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50">
            <Printer size={16}/> Cetak/QR
          </button>
        )}
      </div>
      {permit.supervisorNote && (
        <p className="text-xs text-gray-500">Catatan Pengawas: <span className="text-gray-700">{permit.supervisorNote}</span></p>
      )}
    </div>
  );
}

function PrintPreview({ permit, onClose }) {
  if (!permit) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Kartu Izin Membawa Barang</h3>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Tutup</button>
        </div>
        <div className="p-6 grid md:grid-cols-[1fr_220px] gap-6">
          <div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500">ID</p><p className="font-medium">{permit.id}</p>
              <p className="text-gray-500">Pemohon</p><p className="font-medium">{permit.requester}</p>
              <p className="text-gray-500">Bagian</p><p className="font-medium">{permit.section}</p>
              <p className="text-gray-500">Keperluan</p><p className="font-medium">{permit.purpose}</p>
              <p className="text-gray-500">Tujuan</p><p className="font-medium">{permit.destination}</p>
              <p className="text-gray-500">Periode</p><p className="font-medium">{permit.dateFrom} {permit.dateTo && `→ ${permit.dateTo}`}</p>
              <p className="text-gray-500">Status</p><p className="font-medium">{statusMeta(permit.status).label}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold mb-1">Barang</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {permit.items.map((it, i) => (
                  <li key={i}>{it.name} (x{it.qty})</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border rounded-lg p-3 flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-[radial-gradient(theme(colors.gray.300)_1px,transparent_1px)] [background-size:12px_12px] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">QR CODE</div>
                <div className="text-xs font-mono break-all max-w-[10rem] mt-1">{permit.qrCode}</div>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2">Scan oleh Security untuk pelepasan</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-600">
          Tunjukkan kartu ini saat di lapangan. Simbol QR berisi kode verifikasi unik.
        </div>
      </div>
    </div>
  );
}

function AdminControls({ users, addUser, removeUser, loginHistory }) {
  const [form, setForm] = useState({ username: '', password: '', role: 'User', section: 'Produksi' });
  const roles = ['Superadmin', 'User', 'Pengawas', 'Security'];
  const sections = ['Produksi', 'Keuangan', 'HR', 'Umum', 'Plant', 'ERS'];

  return (
    <div className="rounded-xl border p-6 bg-white shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2"><Shield size={18}/> Panel Superadmin</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2"><Users size={16}/> Kelola Pengguna</h4>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-md border px-3 py-2" placeholder="Username" value={form.username} onChange={(e)=>setForm(v=>({...v, username:e.target.value}))} />
            <input type="password" className="rounded-md border px-3 py-2" placeholder="Password" value={form.password} onChange={(e)=>setForm(v=>({...v, password:e.target.value}))} />
            <select className="rounded-md border px-3 py-2" value={form.role} onChange={(e)=>setForm(v=>({...v, role:e.target.value}))}>
              {roles.map(r=> <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="rounded-md border px-3 py-2" value={form.section} onChange={(e)=>setForm(v=>({...v, section:e.target.value}))}>
              {sections.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="col-span-2 flex items-center justify-end">
              <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => {
                  if (!form.username || !form.password) return;
                  addUser({ ...form });
                  setForm({ username: '', password: '', role: 'User', section: 'Produksi' });
                }}
              >
                <Plus size={16}/> Tambah Pengguna
              </button>
            </div>
          </div>
          <div className="border rounded-md divide-y">
            {users.length === 0 && <p className="p-3 text-sm text-gray-500">Belum ada pengguna.</p>}
            {users.map((u) => (
              <div key={u.username} className="p-3 text-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{u.username} <span className="text-gray-400">•</span> <span className="uppercase">{u.role}</span></p>
                  <p className="text-gray-500 text-xs">Bagian: {u.section}</p>
                </div>
                <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-rose-600 hover:bg-rose-50" onClick={()=>removeUser(u.username)}>
                  <Trash2 size={14}/> Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Riwayat Login</h4>
          <div className="max-h-64 overflow-auto divide-y rounded-md border">
            {loginHistory.length === 0 && <p className="p-3 text-sm text-gray-500">Belum ada riwayat.</p>}
            {loginHistory.map((h, idx) => (
              <div key={idx} className="py-2 px-3 text-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{h.name} <span className="text-gray-400">•</span> <span className="uppercase">{h.role}</span> <span className="text-gray-400">•</span> <span className="text-xs">{h.section}</span></p>
                  <p className="text-gray-500">{new Date(h.time).toLocaleString()}</p>
                </div>
                <Badge color="indigo">#{String(idx + 1).padStart(3, '0')}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManagementBoard({ role, section, userName, permits, onApprove, onReject, onPrintSelect, selectedForPrint, onClosePrint, onScan, scanHistory, users, addUser, removeUser, loginHistory }) {
  const pending = useMemo(() => permits.filter(p => p.status === 'pending' && (role === 'Superadmin' || p.section === section)), [permits, section, role]);
  const mine = useMemo(() => permits.filter(p => p.requester === userName), [permits, userName]);
  const approved = useMemo(() => permits.filter(p => p.status === 'approved'), [permits]);
  const [scanCode, setScanCode] = useState('');
  const [location, setLocation] = useState('Pintu 1');
  const [scanNote, setScanNote] = useState('');

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {(role === 'User' || role === 'Superadmin') && (
        <div className="rounded-xl border p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pengajuan Saya</h3>
            <Badge color="indigo">{mine.length} data</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {mine.length === 0 && <p className="text-sm text-gray-500">Belum ada pengajuan.</p>}
            {mine.map((p) => (
              <PermitCard key={p.id} role={role} permit={p} onPrint={onPrintSelect} />
            ))}
          </div>
        </div>
      )}

      {(role === 'Pengawas' || role === 'Superadmin') && (
        <div className="rounded-xl border p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Menunggu Persetujuan (Bagian {role==='Superadmin'?'Semua':section})</h3>
            <Badge color="yellow">{pending.length} pending</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {pending.length === 0 && <p className="text-sm text-gray-500">Tidak ada data menunggu.</p>}
            {pending.map((p) => (
              <PermitCard key={p.id} role={role} permit={p} onApprove={onApprove} onReject={onReject} />
            ))}
          </div>
        </div>
      )}

      {(role === 'Security' || role === 'Superadmin') && (
        <div className="rounded-xl border p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><QrCode size={18}/> Verifikasi Security</h3>
            <Badge color="blue">{approved.length} siap dilepas</Badge>
          </div>
          <div className="grid md:grid-cols-[1fr_1fr] gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Lokasi Jaga</label>
                <select className="w-full rounded-md border px-3 py-2" value={location} onChange={(e)=>setLocation(e.target.value)}>
                  {['Pintu 1','Pintu 2','Gudang','Lobby'].map(l=>(<option key={l}>{l}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tempel/Scan Kode</label>
                <div className="flex gap-2">
                  <input className="w-full rounded-md border px-3 py-2 font-mono" placeholder="Contoh: PERMIT-..." value={scanCode} onChange={(e)=>setScanCode(e.target.value)} />
                  <button onClick={()=>{ if(scanCode) { onScan({ code: scanCode, location, note: scanNote }); setScanCode(''); setScanNote(''); } }} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Verifikasi</button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Masukkan kode dari QR untuk melihat detail dan menyetujui pelepasan.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catatan (opsional, contoh: barang tidak sesuai)</label>
                <input className="w-full rounded-md border px-3 py-2" value={scanNote} onChange={(e)=>setScanNote(e.target.value)} placeholder="Tulis catatan jika ada ketidaksesuaian"/>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Riwayat Scan Terakhir</h4>
              <div className="max-h-64 overflow-auto space-y-2">
                {scanHistory.length === 0 && <p className="text-sm text-gray-500">Belum ada scan.</p>}
                {scanHistory.map((s, idx) => (
                  <div key={idx} className="text-sm border rounded-md p-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{s.permitId} <span className="text-gray-400">•</span> <span className="text-xs">{s.location}</span></p>
                      <Badge color={s.result==='released'?'blue':'red'}>{s.result}</Badge>
                    </div>
                    <p className="text-gray-500">{new Date(s.time).toLocaleString()} <span className="text-gray-400">•</span> oleh {s.by}</p>
                    {s.note && <p className="text-gray-700 mt-1">Catatan: {s.note}</p>}
                    {s.data && (
                      <>
                        <p className="text-gray-700 mt-1">Pemohon: <span className="font-medium">{s.data.requester}</span> <span className="text-gray-400">•</span> Bagian: {s.data.section}</p>
                        <ul className="list-disc pl-5 text-gray-700">
                          {s.data.items.map((it, i)=> (
                            <li key={i}>{it.name} (x{it.qty})</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'Superadmin' && (
        <AdminControls users={users} addUser={addUser} removeUser={removeUser} loginHistory={loginHistory} />
      )}

      <PrintPreview permit={selectedForPrint} onClose={onClosePrint} />
    </section>
  );
}

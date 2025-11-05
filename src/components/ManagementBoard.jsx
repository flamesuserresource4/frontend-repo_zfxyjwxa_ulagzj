import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Printer, ScanLine } from 'lucide-react';

function Badge({ children, color = 'gray' }) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    indigo: 'bg-indigo-100 text-indigo-800',
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

function PermitCard({ permit, onApprove, onReject, onPrint }) {
  const meta = statusMeta(permit.status);
  return (
    <div className="border rounded-lg p-4 bg-white flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{permit.itemName}</h4>
          <Badge color={meta.color}>{meta.label}</Badge>
        </div>
        <span className="text-xs text-gray-500">ID: {permit.id}</span>
      </div>
      <p className="text-sm text-gray-600">Jumlah: <span className="font-medium text-gray-800">{permit.quantity}</span> • Tujuan: {permit.destination}</p>
      <p className="text-sm text-gray-600">Pemohon: <span className="font-medium text-gray-800">{permit.requester}</span></p>
      <div className="flex items-center gap-2 mt-2">
        {onApprove && permit.status === 'pending' && (
          <button onClick={() => onApprove(permit.id)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700">
            <CheckCircle2 size={16}/> Setujui
          </button>
        )}
        {onReject && permit.status === 'pending' && (
          <button onClick={() => onReject(permit.id)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700">
            <XCircle size={16}/> Tolak
          </button>
        )}
        {onPrint && permit.status === 'approved' && (
          <button onClick={() => onPrint(permit)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50">
            <Printer size={16}/> Cetak/QR
          </button>
        )}
      </div>
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
              <p className="text-gray-500">Barang</p><p className="font-medium">{permit.itemName} (x{permit.quantity})</p>
              <p className="text-gray-500">Keperluan</p><p className="font-medium">{permit.purpose}</p>
              <p className="text-gray-500">Tujuan</p><p className="font-medium">{permit.destination}</p>
              <p className="text-gray-500">Periode</p><p className="font-medium">{permit.dateFrom} {permit.dateTo && `→ ${permit.dateTo}`}</p>
              <p className="text-gray-500">Status</p><p className="font-medium">{statusMeta(permit.status).label}</p>
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

export default function ManagementBoard({ role, userName, permits, onApprove, onReject, onPrintSelect, selectedForPrint, onClosePrint, onScan, scanned }) {
  const pending = useMemo(() => permits.filter(p => p.status === 'pending'), [permits]);
  const mine = useMemo(() => permits.filter(p => p.requester === userName), [permits, userName]);
  const approved = useMemo(() => permits.filter(p => p.status === 'approved'), [permits]);
  const [scanCode, setScanCode] = useState('');

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
              <PermitCard key={p.id} permit={p} onPrint={onPrintSelect} />
            ))}
          </div>
        </div>
      )}

      {(role === 'Pengawas' || role === 'Superadmin') && (
        <div className="rounded-xl border p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Menunggu Persetujuan</h3>
            <Badge color="yellow">{pending.length} pending</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {pending.length === 0 && <p className="text-sm text-gray-500">Tidak ada data menunggu.</p>}
            {pending.map((p) => (
              <PermitCard key={p.id} permit={p} onApprove={onApprove} onReject={onReject} />
            ))}
          </div>
        </div>
      )}

      {(role === 'Security' || role === 'Superadmin') && (
        <div className="rounded-xl border p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><ScanLine size={18}/> Verifikasi Security</h3>
            <Badge color="blue">{approved.length} siap dilepas</Badge>
          </div>
          <div className="grid md:grid-cols-[1fr_1fr] gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tempel/Scan Kode</label>
              <div className="flex gap-2">
                <input className="w-full rounded-md border px-3 py-2 font-mono" placeholder="Contoh: PERMIT-..." value={scanCode} onChange={(e)=>setScanCode(e.target.value)} />
                <button onClick={()=>{ if(scanCode) { onScan(scanCode); setScanCode(''); } }} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Verifikasi</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Masukkan kode dari QR untuk menyetujui pelepasan.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Riwayat Scan Terakhir</h4>
              <div className="max-h-40 overflow-auto space-y-2">
                {scanned.length === 0 && <p className="text-sm text-gray-500">Belum ada scan.</p>}
                {scanned.map((s, idx) => (
                  <div key={idx} className="text-sm border rounded-md p-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{s.permitId}</p>
                      <p className="text-gray-500">{new Date(s.time).toLocaleString()}</p>
                    </div>
                    <Badge color="blue">released</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <PrintPreview permit={selectedForPrint} onClose={onClosePrint} />
    </section>
  );
}

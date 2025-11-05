import { useState } from 'react';
import { FilePlus, Plus, Trash2 } from 'lucide-react';

export default function PermitForm({ onCreate, requester, section }) {
  const [items, setItems] = useState([{ name: '', qty: 1 }]);
  const [purpose, setPurpose] = useState('');
  const [destination, setDestination] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  function updateItem(idx, field, value) {
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((arr) => [...arr, { name: '', qty: 1 }]);
  }
  function removeItem(idx) {
    setItems((arr) => arr.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validItems = items.filter(it => it.name && it.qty > 0);
    if (!requester || validItems.length === 0 || !purpose || !destination || !dateFrom) return;
    onCreate({ items: validItems, purpose, destination, dateFrom, dateTo, requester, section });
    setItems([{ name: '', qty: 1 }]);
    setPurpose('');
    setDestination('');
    setDateFrom('');
    setDateTo('');
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-xl border p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">Pengajuan Izin Membawa Barang</h2>
          <span className="text-xs text-gray-500">Pemohon: <span className="font-medium text-gray-800">{requester}</span> • Bagian: <span className="font-medium text-gray-800">{section}</span></span>
        </div>
        <p className="text-sm text-gray-500 mb-6">Isi form berikut untuk membuat izin baru. Tambahkan lebih dari satu barang bila diperlukan.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Daftar Barang</h3>
              <button type="button" onClick={addItem} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"><Plus size={16}/> Tambah Barang</button>
            </div>
            {items.map((it, idx) => (
              <div key={idx} className="grid md:grid-cols-[1fr_140px_44px] gap-2">
                <input className="rounded-md border px-3 py-2" placeholder="Nama barang" value={it.name} onChange={(e)=>updateItem(idx,'name',e.target.value)} />
                <input type="number" min={1} className="rounded-md border px-3 py-2" placeholder="Jumlah" value={it.qty} onChange={(e)=>updateItem(idx,'qty',Number(e.target.value))} />
                <button type="button" onClick={()=>removeItem(idx)} className="inline-flex items-center justify-center rounded-md border text-rose-600 hover:bg-rose-50"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Keperluan</label>
              <input className="w-full rounded-md border px-3 py-2" value={purpose} onChange={(e)=>setPurpose(e.target.value)} placeholder="Contoh: Peminjaman untuk presentasi"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tujuan</label>
              <input className="w-full rounded-md border px-3 py-2" value={destination} onChange={(e)=>setDestination(e.target.value)} placeholder="Contoh: Ruang Meeting A"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Waktu Keluar</label>
              <input type="datetime-local" className="w-full rounded-md border px-3 py-2" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Waktu Kembali (opsional)</label>
              <input type="datetime-local" className="w-full rounded-md border px-3 py-2" value={dateTo} onChange={(e)=>setDateTo(e.target.value)}/>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
              <FilePlus size={18}/> Buat Izin
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

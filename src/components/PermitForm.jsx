import { useState } from 'react';
import { FilePlus } from 'lucide-react';

export default function PermitForm({ onCreate, requester }) {
  const [form, setForm] = useState({
    itemName: '',
    quantity: 1,
    purpose: '',
    destination: '',
    dateFrom: '',
    dateTo: '',
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.itemName || !form.purpose || !form.destination || !form.dateFrom) return;
    onCreate({ ...form, requester });
    setForm({ itemName: '', quantity: 1, purpose: '', destination: '', dateFrom: '', dateTo: '' });
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-xl border p-6 bg-white shadow-sm">
        <h2 className="text-base font-semibold mb-2">Pengajuan Izin Membawa Barang</h2>
        <p className="text-sm text-gray-500 mb-6">Isi form berikut untuk membuat izin baru.</p>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Barang</label>
            <input className="w-full rounded-md border px-3 py-2" value={form.itemName} onChange={(e)=>update('itemName', e.target.value)} placeholder="Contoh: Laptop"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jumlah</label>
            <input type="number" min={1} className="w-full rounded-md border px-3 py-2" value={form.quantity} onChange={(e)=>update('quantity', Number(e.target.value))}/>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Keperluan</label>
            <input className="w-full rounded-md border px-3 py-2" value={form.purpose} onChange={(e)=>update('purpose', e.target.value)} placeholder="Contoh: Peminjaman untuk presentasi"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tujuan</label>
            <input className="w-full rounded-md border px-3 py-2" value={form.destination} onChange={(e)=>update('destination', e.target.value)} placeholder="Contoh: Ruang Meeting A"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Keluar</label>
            <input type="date" className="w-full rounded-md border px-3 py-2" value={form.dateFrom} onChange={(e)=>update('dateFrom', e.target.value)}/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Kembali (opsional)</label>
            <input type="date" className="w-full rounded-md border px-3 py-2" value={form.dateTo} onChange={(e)=>update('dateTo', e.target.value)}/>
          </div>
          <div className="md:col-span-2 flex items-center justify-end">
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
              <FilePlus size={18}/> Buat Izin
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

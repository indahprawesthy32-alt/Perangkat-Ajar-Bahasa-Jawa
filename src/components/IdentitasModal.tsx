import { X } from 'lucide-react';
import type { IdentitasSekolah } from '../types';

interface Props {
  open: boolean;
  identitas: IdentitasSekolah;
  onClose: () => void;
  onChange: (next: IdentitasSekolah) => void;
}

export function IdentitasModal({ open, identitas, onClose, onChange }: Props) {
  if (!open) return null;

  const update = (key: keyof IdentitasSekolah, val: string) => {
    onChange({ ...identitas, [key]: val });
  };

  return (
    <div className="no-print fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Identitas Satuan Pendidikan &amp; Guru</h3>
            <p className="text-xs text-slate-600">
              Perubahan identitas otomatis diterapkan ke seluruh 11 dokumen perangkat ajar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Satuan Pendidikan / Sekolah</label>
            <input
              type="text"
              value={identitas.satuanPendidikan}
              onChange={(e) => update('satuanPendidikan', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={identitas.mataPelajaran}
              onChange={(e) => update('mataPelajaran', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Fase</label>
            <input
              type="text"
              list="fase-options"
              value={identitas.fase}
              onChange={(e) => update('fase', e.target.value)}
              placeholder="Contoh: C (atau Fase C)"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
            />
            <datalist id="fase-options">
              <option value="A">Fase A (Kelas 1–2)</option>
              <option value="B">Fase B (Kelas 3–4)</option>
              <option value="C">Fase C (Kelas 5–6)</option>
              <option value="D">Fase D (Kelas 7–9)</option>
              <option value="E">Fase E (Kelas 10)</option>
              <option value="F">Fase F (Kelas 11–12)</option>
            </datalist>
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Kelas</label>
            <input
              type="text"
              value={identitas.kelas}
              onChange={(e) => update('kelas', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Semester Aktif</label>
            <input
              type="text"
              list="semester-options"
              value={identitas.semester}
              onChange={(e) => update('semester', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
            />
            <datalist id="semester-options">
              <option value="Gasal" />
              <option value="Genap" />
            </datalist>
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Tahun Pelajaran</label>
            <input
              type="text"
              value={identitas.tahunPelajaran}
              onChange={(e) => update('tahunPelajaran', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-medium text-slate-700 mb-1">Tempat &amp; Tanggal Pembuatan</label>
            <input
              type="text"
              value={identitas.kotaTanggal}
              onChange={(e) => update('kotaTanggal', e.target.value)}
              placeholder="Contoh: Ngaglik, 16 Oktober 2026"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nama Kepala Sekolah</label>
            <input
              type="text"
              value={identitas.namaKepalaSekolah}
              onChange={(e) => update('namaKepalaSekolah', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">NIP Kepala Sekolah</label>
            <input
              type="text"
              value={identitas.nipKepalaSekolah}
              onChange={(e) => update('nipKepalaSekolah', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nama Guru Mapel / Kelas</label>
            <input
              type="text"
              value={identitas.namaGuru}
              onChange={(e) => update('namaGuru', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">NIP Guru</label>
            <input
              type="text"
              value={identitas.nipGuru}
              onChange={(e) => update('nipGuru', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] rounded-md"
          >
            Simpan Identitas
          </button>
        </div>
      </div>
    </div>
  );
}

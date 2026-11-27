import { useEffect, useState } from 'react';
import { Plus, Sparkles, Trash2, Loader2 } from 'lucide-react';
import type { IdentitasSekolah, PenilaianInstrument } from '../types';
import { generateWithAi } from '../utils/apiClient';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  identitas: IdentitasSekolah;
  penilaianList: PenilaianInstrument[];
  activeMateri?: string;
  onChange: (next: PenilaianInstrument[]) => void;
}

export function Menu11Penilaian({ identitas, penilaianList, activeMateri, onChange }: Props) {
  const [selectedId, setSelectedId] = useState<string>(penilaianList[0]?.id || 'rubrik_lkpd');
  const [materiTopik, setMateriTopik] = useState(activeMateri || 'Unggah-Ungguh Basa & Tembang Macapat');
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (activeMateri) {
      setMateriTopik(activeMateri);
    }
  }, [activeMateri]);

  const activeIndex = Math.max(
    0,
    penilaianList.findIndex((p) => p.id === selectedId),
  );
  const activeItem = penilaianList[activeIndex];

  const updateActive = (updated: PenilaianInstrument) => {
    const next = [...penilaianList];
    next[activeIndex] = updated;
    onChange(next);
  };

  const handleGenerateAi = async () => {
    if (!activeItem) return;
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const res = await generateWithAi<Omit<PenilaianInstrument, 'id' | 'kategori'>>('penilaian_rubrik', {
        kategori: activeItem.kategori,
        materi: materiTopik,
      });
      updateActive({
        ...activeItem,
        judul: res.judul || activeItem.judul,
        deskripsi: res.deskripsi || activeItem.deskripsi,
        kolom: Array.isArray(res.kolom) && res.kolom.length > 0 ? res.kolom : activeItem.kolom,
        baris: Array.isArray(res.baris) && res.baris.length > 0 ? res.baris : activeItem.baris,
        catatan: res.catatan || activeItem.catatan,
      });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal menyusun instrumen penilaian.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAddRow = () => {
    if (!activeItem) return;
    const emptyRow = activeItem.kolom.map(() => '');
    updateActive({ ...activeItem, baris: [...activeItem.baris, emptyRow] });
  };

  if (!activeItem) return null;

  return (
    <div className="space-y-6">
      <div className="no-print bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Format Instrumen Penilaian Formatif &amp; Sumatif (15 Instrumen Lengkap)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Pilih kategori instrumen penilaian di bawah ini untuk mengedit tabel atau menyesuaikannya secara otomatis dengan materi Bahasa Jawa.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={materiTopik}
              onChange={(e) => setMateriTopik(e.target.value)}
              placeholder="Topik materi Bahasa Jawa..."
              className="text-xs border border-slate-300 rounded-md px-3 py-2 w-60"
            />
            <button
              type="button"
              onClick={handleGenerateAi}
              disabled={loadingAi}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] disabled:opacity-60 rounded-md whitespace-nowrap shrink-0"
            >
              {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {loadingAi ? 'Menyesuaikan...' : 'Generate Instrumen (AI)'}
            </button>
          </div>
        </div>

        {/* 15 Instrument Selector Grid */}
        <div className="flex flex-wrap gap-1.5">
          {penilaianList.map((item) => {
            const isSelected = item.id === activeItem.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#1B4353] text-white border-[#1B4353]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.kategori}
              </button>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="no-print p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-5">
        <DocumentHeader
          title={activeItem.judul.toUpperCase()}
          subtitle={activeItem.deskripsi}
          fields={[
            { label: 'Satuan Pendidikan', value: identitas.satuanPendidikan },
            { label: 'Mata Pelajaran', value: identitas.mataPelajaran },
            { label: 'Kelas / Fase', value: `${identitas.kelas} / ${identitas.fase}` },
            { label: 'Tahun Pelajaran', value: identitas.tahunPelajaran },
          ]}
        />

        <div className="no-print flex items-center justify-end">
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Baris
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#1B4353] text-white font-semibold">
              <tr>
                {activeItem.kolom.map((col, cIdx) => (
                  <th key={cIdx} className="py-2.5 px-3 border-r border-white/15 last:border-r-0">
                    {col}
                  </th>
                ))}
                <th className="py-2.5 px-2 w-10 no-print text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activeItem.baris.map((row, rIdx) => (
                <tr key={rIdx} className="align-top hover:bg-slate-50/70">
                  {activeItem.kolom.map((_, cIdx) => (
                    <td key={cIdx} className="p-2 border-r border-slate-200">
                      <textarea
                        rows={2}
                        value={row[cIdx] ?? ''}
                        onChange={(e) => {
                          const nextRows = activeItem.baris.map((r) => [...r]);
                          nextRows[rIdx][cIdx] = e.target.value;
                          updateActive({ ...activeItem, baris: nextRows });
                        }}
                        className="w-full bg-transparent text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                      />
                    </td>
                  ))}
                  <td className="p-2 no-print text-center">
                    <button
                      type="button"
                      onClick={() =>
                        updateActive({
                          ...activeItem,
                          baris: activeItem.baris.filter((_, idx) => idx !== rIdx),
                        })
                      }
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan / Pedoman Tindak Lanjut:</label>
          <textarea
            rows={2}
            value={activeItem.catatan}
            onChange={(e) => updateActive({ ...activeItem, catatan: e.target.value })}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded p-2.5"
          />
        </div>

        <SignatureBlock identitas={identitas} />
      </div>
    </div>
  );
}

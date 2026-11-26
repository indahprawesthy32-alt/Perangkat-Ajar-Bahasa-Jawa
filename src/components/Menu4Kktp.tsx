import { useState } from 'react';
import { Plus, RefreshCw, Sparkles, Trash2, Loader2 } from 'lucide-react';
import type { IdentitasSekolah, KktpRow, TpRow } from '../types';
import { generateWithAi } from '../utils/apiClient';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  identitas: IdentitasSekolah;
  tpRows: TpRow[];
  kktpRows: KktpRow[];
  onChange: (rows: KktpRow[]) => void;
}

export function Menu4Kktp({ identitas, tpRows, kktpRows, onChange }: Props) {
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSyncTp = () => {
    const synced: KktpRow[] = tpRows.map((tp, idx) => ({
      id: `kktp_sync_${tp.id}`,
      kodeTp: `TP.${idx + 1}`,
      tujuanPembelajaran: tp.tp,
      perluBimbingan: 'Belum mampu memahami konsep dasar materi tanpa pendampingan intensif.',
      cukup: 'Mampu memahami konsep dasar namun belum konsisten mengaplikasikan dalam kalimat/teks.',
      baik: 'Mampu menganalisis dan mempraktikkan materi Bahasa Jawa dengan tepat.',
      sangatBaik: 'Mampu menganalisis, mengevaluasi, dan mencipta karya Bahasa Jawa secara mandiri dan santun.',
    }));
    onChange(synced);
  };

  const handleGenerateAi = async () => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const result = await generateWithAi<Array<Omit<KktpRow, 'id'>>>('kktp_generate', {
        identitas,
        tpRows,
      });
      if (Array.isArray(result) && result.length > 0) {
        onChange(
          result.map((r, i) => ({
            id: `kktp_ai_${Date.now()}_${i}`,
            kodeTp: r.kodeTp || `TP.${i + 1}`,
            tujuanPembelajaran: r.tujuanPembelajaran || '',
            perluBimbingan: r.perluBimbingan || '',
            cukup: r.cukup || '',
            baik: r.baik || '',
            sangatBaik: r.sangatBaik || '',
          })),
        );
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal menyusun KKTP.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAddRow = () => {
    onChange([
      ...kktpRows,
      {
        id: `kktp_${Date.now()}`,
        kodeTp: `TP.${kktpRows.length + 1}`,
        tujuanPembelajaran: '',
        perluBimbingan: '',
        cukup: '',
        baik: '',
        sangatBaik: '',
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Rubrik interval 4 tingkat ketercapaian (0–60, 61–75, 76–90, 91–100) berdasarkan TP Bahasa Jawa.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncTp}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Muat dari TP
          </button>
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Baris
          </button>
          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={loadingAi}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loadingAi ? 'Menyusun KKTP...' : 'Generate Deskripsi KKTP (AI)'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="no-print p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
        <DocumentHeader
          title="KKTP (KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN)"
          fields={[
            { label: 'Satuan Pendidikan', value: identitas.satuanPendidikan },
            { label: 'Mata Pelajaran', value: identitas.mataPelajaran },
            { label: 'Kelas / Fase', value: `${identitas.kelas} / ${identitas.fase}` },
            { label: 'Tahun Pelajaran', value: identitas.tahunPelajaran },
          ]}
        />

        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#1B4353] text-white font-semibold">
              <tr>
                <th className="py-2.5 px-2.5 w-20 border-r border-white/15">Kode TP</th>
                <th className="py-2.5 px-2.5 w-52 border-r border-white/15">Tujuan Pembelajaran (TP)</th>
                <th className="py-2.5 px-2.5 border-r border-white/15">Perlu Bimbingan (0-60)</th>
                <th className="py-2.5 px-2.5 border-r border-white/15">Cukup (61-75)</th>
                <th className="py-2.5 px-2.5 border-r border-white/15">Baik (76-90)</th>
                <th className="py-2.5 px-2.5 border-r border-white/15">Sangat Baik (91-100)</th>
                <th className="py-2.5 px-2 w-10 no-print text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {kktpRows.map((row, idx) => (
                <tr key={row.id} className="align-top hover:bg-slate-50/70">
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      value={row.kodeTp}
                      onChange={(e) => {
                        const next = [...kktpRows];
                        next[idx] = { ...row, kodeTp: e.target.value };
                        onChange(next);
                      }}
                      className="w-full font-mono font-semibold text-slate-900 bg-transparent px-1 py-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={4}
                      value={row.tujuanPembelajaran}
                      onChange={(e) => {
                        const next = [...kktpRows];
                        next[idx] = { ...row, tujuanPembelajaran: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent font-medium text-slate-900 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={4}
                      value={row.perluBimbingan}
                      onChange={(e) => {
                        const next = [...kktpRows];
                        next[idx] = { ...row, perluBimbingan: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent text-slate-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={4}
                      value={row.cukup}
                      onChange={(e) => {
                        const next = [...kktpRows];
                        next[idx] = { ...row, cukup: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent text-slate-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={4}
                      value={row.baik}
                      onChange={(e) => {
                        const next = [...kktpRows];
                        next[idx] = { ...row, baik: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent text-slate-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={4}
                      value={row.sangatBaik}
                      onChange={(e) => {
                        const next = [...kktpRows];
                        next[idx] = { ...row, sangatBaik: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent text-slate-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                  </td>
                  <td className="p-2 no-print text-center">
                    <button
                      type="button"
                      onClick={() => onChange(kktpRows.filter((x) => x.id !== row.id))}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SignatureBlock identitas={identitas} />
      </div>
    </div>
  );
}

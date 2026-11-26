import { useState } from 'react';
import { Plus, Trash2, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import type { AtpRow, IdentitasSekolah, TpRow } from '../types';
import { DIMENSI_PROFIL_OPTIONS } from '../data/defaultData';
import { generateWithAi } from '../utils/apiClient';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  identitas: IdentitasSekolah;
  tpRows: TpRow[];
  atpRows: AtpRow[];
  onChangeAtp: (rows: AtpRow[]) => void;
}

export function Menu2Atp({ identitas, tpRows, atpRows, onChangeAtp }: Props) {
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSyncFromCp = () => {
    const synced: AtpRow[] = tpRows.map((tp, idx) => ({
      id: `atp_sync_${tp.id}`,
      no: idx + 1,
      elemen: tp.elemen,
      capaianPembelajaran: tp.cp,
      tujuanPembelajaran: tp.tp,
      lingkupMateri: tp.bab.replace(/^Bab\s*\d+\s*:\s*/i, '') || tp.bab,
      dimensiProfilLulusan: ['Penalaran Kritis', 'Komunikasi'],
      waktuJp: 8,
      semester: tp.semester,
    }));
    onChangeAtp(synced);
  };

  const handleEnrichAi = async () => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const result = await generateWithAi<Array<Omit<AtpRow, 'id'>>>('atp_enrich', {
        identitas,
        tpRows,
      });
      if (Array.isArray(result) && result.length > 0) {
        onChangeAtp(
          result.map((r, i) => ({
            id: `atp_ai_${Date.now()}_${i}`,
            no: r.no || i + 1,
            elemen: r.elemen || '',
            capaianPembelajaran: r.capaianPembelajaran || '',
            tujuanPembelajaran: r.tujuanPembelajaran || '',
            lingkupMateri: r.lingkupMateri || '',
            dimensiProfilLulusan: Array.isArray(r.dimensiProfilLulusan) ? r.dimensiProfilLulusan : ['Penalaran Kritis'],
            waktuJp: Number(r.waktuJp) || 8,
            semester: r.semester === 'Genap' ? 'Genap' : 'Gasal',
          })),
        );
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal menyusun ATP otomatis.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAddRow = () => {
    onChangeAtp([
      ...atpRows,
      {
        id: `atp_${Date.now()}`,
        no: atpRows.length + 1,
        elemen: '',
        capaianPembelajaran: '',
        tujuanPembelajaran: '',
        lingkupMateri: '',
        dimensiProfilLulusan: ['Penalaran Kritis'],
        waktuJp: 6,
        semester: 'Gasal',
      },
    ]);
  };

  const toggleDimensi = (rowIdx: number, dim: string) => {
    const row = atpRows[rowIdx];
    const exists = row.dimensiProfilLulusan.includes(dim);
    const updated = exists
      ? row.dimensiProfilLulusan.filter((d) => d !== dim)
      : [...row.dimensiProfilLulusan, dim];
    const next = [...atpRows];
    next[rowIdx] = { ...row, dimensiProfilLulusan: updated };
    onChangeAtp(next);
  };

  const totalJp = atpRows.reduce((s, r) => s + (Number(r.waktuJp) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Alur Tujuan Pembelajaran (ATP)</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Isian berdasarkan CP & TP dari Menu 1 · Total alokasi: <span className="font-mono font-semibold text-slate-900">{totalJp} JP</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncFromCp}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sinkron dari Analisis CP
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
            onClick={handleEnrichAi}
            disabled={loadingAi}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loadingAi ? 'Menyusun ATP...' : 'Lengkapi ATP (AI)'}
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
          title="ALUR TUJUAN PEMBELAJARAN"
          fields={[
            { label: 'Satuan Pendidikan', value: identitas.satuanPendidikan },
            { label: 'Mata Pelajaran', value: identitas.mataPelajaran },
            { label: 'Fase / Kelas', value: `${identitas.fase} / ${identitas.kelas}` },
            { label: 'Tahun Pelajaran', value: identitas.tahunPelajaran },
          ]}
        />

        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#1B4353] text-white font-semibold">
              <tr>
                <th className="py-2.5 px-2 w-10 text-center border-r border-white/15">No</th>
                <th className="py-2.5 px-2.5 w-32 border-r border-white/15">Elemen</th>
                <th className="py-2.5 px-2.5 w-48 border-r border-white/15">Capaian Pembelajaran</th>
                <th className="py-2.5 px-2.5 w-52 border-r border-white/15">Tujuan Pembelajaran</th>
                <th className="py-2.5 px-2.5 w-40 border-r border-white/15">Lingkup Materi</th>
                <th className="py-2.5 px-2.5 w-48 border-r border-white/15">Dimensi Profil Lulusan</th>
                <th className="py-2.5 px-2 w-20 text-center border-r border-white/15">Waktu (JP)</th>
                <th className="py-2.5 px-2 w-10 no-print text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {atpRows.map((row, idx) => (
                <tr key={row.id} className="align-top hover:bg-slate-50/70">
                  <td className="p-2 text-center font-mono border-r border-slate-200">{row.no}</td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={3}
                      value={row.elemen}
                      onChange={(e) => {
                        const next = [...atpRows];
                        next[idx] = { ...row, elemen: e.target.value };
                        onChangeAtp(next);
                      }}
                      className="w-full bg-transparent text-xs focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={4}
                      value={row.capaianPembelajaran}
                      onChange={(e) => {
                        const next = [...atpRows];
                        next[idx] = { ...row, capaianPembelajaran: e.target.value };
                        onChangeAtp(next);
                      }}
                      className="w-full bg-transparent text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={4}
                      value={row.tujuanPembelajaran}
                      onChange={(e) => {
                        const next = [...atpRows];
                        next[idx] = { ...row, tujuanPembelajaran: e.target.value };
                        onChangeAtp(next);
                      }}
                      className="w-full bg-transparent text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <textarea
                      rows={3}
                      value={row.lingkupMateri}
                      onChange={(e) => {
                        const next = [...atpRows];
                        next[idx] = { ...row, lingkupMateri: e.target.value };
                        onChangeAtp(next);
                      }}
                      className="w-full bg-transparent text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                    />
                    <select
                      value={row.semester}
                      onChange={(e) => {
                        const next = [...atpRows];
                        next[idx] = { ...row, semester: e.target.value as 'Gasal' | 'Genap' };
                        onChangeAtp(next);
                      }}
                      className="no-print mt-1 w-full text-[11px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                    >
                      <option value="Gasal">Sem. Gasal</option>
                      <option value="Genap">Sem. Genap</option>
                    </select>
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <div className="space-y-1 no-print">
                      {DIMENSI_PROFIL_OPTIONS.map((dim) => (
                        <label key={dim} className="flex items-start gap-1.5 cursor-pointer text-[11px] text-slate-700">
                          <input
                            type="checkbox"
                            checked={row.dimensiProfilLulusan.includes(dim)}
                            onChange={() => toggleDimensi(idx, dim)}
                            className="mt-0.5 rounded border-slate-300 text-[#1B4353] focus:ring-[#1B4353]"
                          />
                          <span>{dim}</span>
                        </label>
                      ))}
                    </div>
                    <div className="hidden print:block text-xs">
                      {row.dimensiProfilLulusan.join(', ')}
                    </div>
                  </td>
                  <td className="p-2 text-center border-r border-slate-200">
                    <input
                      type="number"
                      min={1}
                      value={row.waktuJp}
                      onChange={(e) => {
                        const next = [...atpRows];
                        next[idx] = { ...row, waktuJp: Number(e.target.value) || 0 };
                        onChangeAtp(next);
                      }}
                      className="w-14 text-center font-mono font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded py-1"
                    />
                  </td>
                  <td className="p-2 no-print text-center">
                    <button
                      type="button"
                      onClick={() => onChangeAtp(atpRows.filter((x) => x.id !== row.id))}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-300 font-semibold text-xs">
              <tr>
                <td colSpan={6} className="py-2.5 px-3 text-right text-slate-700">
                  Total Alokasi Waktu ATP
                </td>
                <td className="py-2.5 px-2 text-center font-mono text-slate-900">{totalJp} JP</td>
                <td className="no-print" />
              </tr>
            </tfoot>
          </table>
        </div>

        <SignatureBlock identitas={identitas} />
      </div>
    </div>
  );
}

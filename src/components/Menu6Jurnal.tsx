import { useState } from 'react';
import { Plus, Sparkles, Trash2, Loader2 } from 'lucide-react';
import type { IdentitasSekolah, JurnalRow, TpRow } from '../types';
import { generateWithAi } from '../utils/apiClient';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  identitas: IdentitasSekolah;
  tpRows: TpRow[];
  jurnalRows: JurnalRow[];
  onChange: (rows: JurnalRow[]) => void;
}

export function Menu6Jurnal({ identitas, tpRows, jurnalRows, onChange }: Props) {
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddRow = () => {
    const firstTp = tpRows[jurnalRows.length % Math.max(1, tpRows.length)];
    onChange([
      ...jurnalRows,
      {
        id: `j_${Date.now()}`,
        pertemuanKe: jurnalRows.length + 1,
        hariTgl: identitas.kotaTanggal.split(',').slice(1).join(',').trim() || 'Senin, 19 Oktober 2026',
        bab: firstTp?.bab || `Bab ${jurnalRows.length + 1}`,
        tp: firstTp?.tp || '',
        materiPokok: firstTp?.bab || '',
        ringkasanKegiatan: '',
        absensi: 'Hadir semua',
        metode: 'PBL / Diskusi Kelompok',
        penilaian: 'Formatif (Rubrik LKPD)',
        refleksi: '',
      },
    ]);
  };

  const handleAiFillRow = async (idx: number) => {
    const row = jurnalRows[idx];
    setLoadingIdx(idx);
    setErrorMsg(null);
    try {
      const result = await generateWithAi<{
        ringkasanKegiatan: string;
        metode: string;
        penilaian: string;
        refleksi: string;
      }>('jurnal_entry', {
        bab: row.bab,
        tp: row.tp,
        materiPokok: row.materiPokok,
      });
      const next = [...jurnalRows];
      next[idx] = {
        ...row,
        ringkasanKegiatan: result.ringkasanKegiatan || row.ringkasanKegiatan,
        metode: result.metode || row.metode,
        penilaian: result.penilaian || row.penilaian,
        refleksi: result.refleksi || row.refleksi,
      };
      onChange(next);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal mengisi entri jurnal.');
    } finally {
      setLoadingIdx(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Jurnal Mengajar Harian Guru</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Catat pertemuan, ringkasan kegiatan, absensi, metode, penilaian, dan refleksi pembelajaran Bahasa Jawa.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Pertemuan
        </button>
      </div>

      {errorMsg && (
        <div className="no-print p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
        <DocumentHeader
          title="JURNAL MENGAJAR GURU"
          fields={[
            { label: 'Satuan Pendidikan', value: identitas.satuanPendidikan },
            { label: 'Mata Pelajaran', value: identitas.mataPelajaran },
            { label: 'Kelas / Fase', value: `${identitas.kelas} / ${identitas.fase}` },
            { label: 'Tahun Pelajaran', value: identitas.tahunPelajaran },
          ]}
        />

        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-[11px] text-left border-collapse">
            <thead className="bg-[#1B4353] text-white font-semibold">
              <tr>
                <th className="py-2 px-2 w-12 text-center border-r border-white/15">Pert. Ke</th>
                <th className="py-2 px-2 w-28 border-r border-white/15">Hari/Tgl</th>
                <th className="py-2 px-2 w-28 border-r border-white/15">Bab</th>
                <th className="py-2 px-2 w-40 border-r border-white/15">TP</th>
                <th className="py-2 px-2 w-32 border-r border-white/15">Materi Pokok</th>
                <th className="py-2 px-2 min-w-[160px] border-r border-white/15">Ringkasan Kegiatan</th>
                <th className="py-2 px-2 w-24 border-r border-white/15">Absensi</th>
                <th className="py-2 px-2 w-28 border-r border-white/15">Metode</th>
                <th className="py-2 px-2 w-28 border-r border-white/15">Penilaian</th>
                <th className="py-2 px-2 min-w-[140px] border-r border-white/15">Refleksi</th>
                <th className="py-2 px-2 w-16 no-print text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {jurnalRows.map((row, idx) => (
                <tr key={row.id} className="align-top hover:bg-slate-50">
                  <td className="p-1.5 text-center border-r border-slate-200">
                    <input
                      type="number"
                      min={1}
                      value={row.pertemuanKe}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, pertemuanKe: Number(e.target.value) || 1 };
                        onChange(next);
                      }}
                      className="w-10 text-center font-mono bg-slate-50 border border-slate-200 rounded py-0.5"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={2}
                      value={row.hariTgl}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, hariTgl: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={2}
                      value={row.bab}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, bab: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={3}
                      value={row.tp}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, tp: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={3}
                      value={row.materiPokok}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, materiPokok: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={3}
                      value={row.ringkasanKegiatan}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, ringkasanKegiatan: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={2}
                      value={row.absensi}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, absensi: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={2}
                      value={row.metode}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, metode: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={2}
                      value={row.penilaian}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, penilaian: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <textarea
                      rows={3}
                      value={row.refleksi}
                      onChange={(e) => {
                        const next = [...jurnalRows];
                        next[idx] = { ...row, refleksi: e.target.value };
                        onChange(next);
                      }}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded resize-y"
                    />
                  </td>
                  <td className="p-1.5 no-print text-center space-y-1">
                    <button
                      type="button"
                      onClick={() => handleAiFillRow(idx)}
                      disabled={loadingIdx === idx}
                      className="p-1 text-[#1B4353] hover:bg-slate-100 rounded block mx-auto"
                      title="Lengkapi kegiatan & refleksi otomatis (AI)"
                    >
                      {loadingIdx === idx ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange(jurnalRows.filter((x) => x.id !== row.id))}
                      className="p-1 text-slate-400 hover:text-red-600 rounded block mx-auto"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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

import { useRef, useState } from 'react';
import { Sparkles, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import type { AtpRow, IdentitasSekolah, LkpdState, TpRow } from '../types';
import { generateWithAi } from '../utils/apiClient';
import { parseAnyUploadedFile } from '../utils/fileEngine';
import { useIdentitas } from '../context/IdentitasContext';

interface Props {
  identitas: IdentitasSekolah;
  lkpd: LkpdState;
  tpRows: TpRow[];
  atpRows: AtpRow[];
  onChange: (next: LkpdState) => void;
}

export function Menu9Lkpd({ identitas, lkpd, tpRows, atpRows, onChange }: Props) {
  const ctx = useIdentitas();
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handlePickTp = (tpId: string) => {
    const idx = tpRows.findIndex((t) => t.id === tpId);
    if (idx === -1) return;
    const tp = tpRows[idx];
    const materi = atpRows[idx]?.lingkupMateri || tp.bab;
    onChange({
      ...lkpd,
      materiInput: `${materi} — ${tp.tp}`,
      judulLkpd: `LKPD ${materi}`,
      tujuanPembelajaran: tp.tp,
    });
  };

  const handleGenerate = async (overrideText?: string) => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const materiInput = overrideText ?? lkpd.materiInput;
      const res = await generateWithAi<Partial<LkpdState>>('lkpd', {
        identitas,
        materiInput,
      });
      onChange({
        ...lkpd,
        materiInput,
        judulLkpd: res.judulLkpd || lkpd.judulLkpd,
        tujuanPembelajaran: res.tujuanPembelajaran || lkpd.tujuanPembelajaran,
        apersepsi: res.apersepsi || lkpd.apersepsi,
        kegiatanInti: res.kegiatanInti || lkpd.kegiatanInti,
        refleksiSiswa: Array.isArray(res.refleksiSiswa) ? res.refleksiSiswa : lkpd.refleksiSiswa,
      });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal menyusun LKPD.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleUpload = async (file: File) => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const parsed = await parseAnyUploadedFile(file, 'lkpd');
      const text = parsed.text || '';
      if (!text) throw new Error('Teks materi pada file tidak terbaca.');
      await handleGenerate(text);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal mengupload materi LKPD.');
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Generator LKPD Berpikir Kritis &amp; Presentasi</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Isikan materi secara manual, pilih dari CP/TP terimpor, atau upload file untuk otomatis menghasilkan LKPD lengkap beserta lembar refleksi siswa.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.docx,.xlsx,.xls,.csv,.pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={loadingAi}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Materi
            </button>
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={loadingAi}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {loadingAi ? 'Menyusun LKPD...' : 'Generate LKPD Lengkap'}
            </button>
          </div>
        </div>

        {tpRows.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Pilih dari CP / TP Terimpor
            </label>
            <select
              defaultValue=""
              onChange={(e) => handlePickTp(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2"
            >
              <option value="" disabled>
                -- Pilih Bab / TP dari Analisis CP untuk dijadikan LKPD --
              </option>
              {tpRows.map((t, idx) => (
                <option key={t.id} value={t.id}>
                  {t.no}. {t.bab} ({atpRows[idx]?.lingkupMateri || t.elemen})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Materi yang Dijadikan LKPD</label>
          <textarea
            rows={2}
            value={lkpd.materiInput}
            onChange={(e) => onChange({ ...lkpd, materiInput: e.target.value })}
            placeholder="Contoh: Analisis watak tokoh Pandhawa dalam crita wayang lan nilai keteladanan..."
            className="w-full text-sm border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#1B4353]"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="no-print p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* Printable LKPD Sheet */}
      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
        {/* Header with Top-Right Student Info & Score Box */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b-2 border-slate-800 pb-5">
          <div className="flex-1 space-y-2">
            <p className="text-xs font-semibold tracking-wider text-[#1B4353] uppercase">
              Lembar Kerja Peserta Didik ({identitas.mataPelajaran})
            </p>
            <input
              type="text"
              value={lkpd.judulLkpd}
              onChange={(e) => onChange({ ...lkpd, judulLkpd: e.target.value })}
              className="w-full font-display text-xl sm:text-2xl font-bold text-slate-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded px-1 -ml-1"
            />
            {ctx ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                <input
                  type="text"
                  value={ctx.identitas.satuanPendidikan}
                  onChange={(e) => ctx.updateIdentitas({ satuanPendidikan: e.target.value })}
                  className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:outline-none font-medium text-slate-800 px-0.5 print:border-none"
                />
                <span>·</span>
                <label className="inline-flex items-center gap-1">
                  <span>Kelas</span>
                  <input
                    type="text"
                    value={ctx.identitas.kelas}
                    onChange={(e) => ctx.updateIdentitas({ kelas: e.target.value })}
                    className="w-10 bg-transparent border-b border-slate-300 focus:border-[#1B4353] focus:outline-none text-center font-medium text-slate-800 print:border-none"
                  />
                </label>
                <span>·</span>
                <label className="inline-flex items-center gap-1">
                  <span>Fase</span>
                  <input
                    type="text"
                    value={ctx.identitas.fase}
                    onChange={(e) => ctx.updateIdentitas({ fase: e.target.value })}
                    className="w-10 bg-transparent border-b border-slate-300 focus:border-[#1B4353] focus:outline-none text-center font-medium text-slate-800 print:border-none"
                  />
                </label>
                <span>·</span>
                <input
                  type="text"
                  value={ctx.identitas.semester}
                  onChange={(e) => ctx.updateIdentitas({ semester: e.target.value })}
                  className="w-16 bg-transparent border-b border-slate-300 focus:border-[#1B4353] focus:outline-none text-center font-medium text-slate-800 print:border-none"
                />
                <span>·</span>
                <label className="inline-flex items-center gap-1">
                  <span>TA</span>
                  <input
                    type="text"
                    value={ctx.identitas.tahunPelajaran}
                    onChange={(e) => ctx.updateIdentitas({ tahunPelajaran: e.target.value })}
                    className="w-24 font-mono bg-transparent border-b border-slate-300 focus:border-[#1B4353] focus:outline-none text-center font-medium text-slate-800 print:border-none"
                  />
                </label>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                {identitas.satuanPendidikan} · Kelas {identitas.kelas} · Semester {identitas.semester} · TA {identitas.tahunPelajaran}
              </p>
            )}
          </div>

          {/* Top-right student identity + score box */}
          <div className="w-full md:w-72 shrink-0 border border-slate-800 rounded-md overflow-hidden text-xs">
            <div className="grid grid-cols-3 border-b border-slate-300">
              <div className="col-span-2 p-2 space-y-1.5 border-r border-slate-300">
                <div className="flex items-center gap-1">
                  <span className="w-16 text-slate-600">Nama</span>
                  <span>: ........................</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-16 text-slate-600">No. Absen</span>
                  <span>: ............</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-16 text-slate-600">Kelas</span>
                  <span>: {identitas.kelas}</span>
                </div>
              </div>
              <div className="p-2 flex flex-col items-center justify-between bg-slate-50">
                <span className="font-bold text-slate-700">NILAI</span>
                <div className="h-10 w-full border border-dashed border-slate-300 rounded mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Tujuan Pembelajaran */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">Tujuan Pembelajaran</h3>
          <textarea
            rows={2}
            value={lkpd.tujuanPembelajaran}
            onChange={(e) => onChange({ ...lkpd, tujuanPembelajaran: e.target.value })}
            className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
          />
        </section>

        {/* 1 Kegiatan Apersepsi Singkat */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">1. Kegiatan Apersepsi Singkat</h3>
          <textarea
            rows={3}
            value={lkpd.apersepsi}
            onChange={(e) => onChange({ ...lkpd, apersepsi: e.target.value })}
            className="w-full text-sm leading-relaxed text-slate-800 bg-slate-50/70 border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
          />
        </section>

        {/* Kegiatan Inti Berpikir Kritis & Presentasi */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            2. Kegiatan Inti (Analisis Kritis & Presentasi Kelompok)
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Petunjuk Pengerjaan</label>
            <input
              type="text"
              value={lkpd.kegiatanInti.petunjuk}
              onChange={(e) =>
                onChange({
                  ...lkpd,
                  kegiatanInti: { ...lkpd.kegiatanInti, petunjuk: e.target.value },
                })
              }
              className="w-full text-sm border border-slate-200 rounded px-3 py-2 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Bahan Stimulus / Studi Kasus Bahasa Jawa</label>
            <textarea
              rows={3}
              value={lkpd.kegiatanInti.stimulus}
              onChange={(e) =>
                onChange({
                  ...lkpd,
                  kegiatanInti: { ...lkpd.kegiatanInti, stimulus: e.target.value },
                })
              }
              className="w-full text-sm leading-relaxed text-slate-900 bg-slate-50 border border-slate-300 rounded-md p-3"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Pertanyaan / Tugas Berpikir Kritis (C4–C6)</span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...lkpd,
                    kegiatanInti: {
                      ...lkpd.kegiatanInti,
                      tugasKritis: [...lkpd.kegiatanInti.tugasKritis, ''],
                    },
                  })
                }
                className="no-print inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
              >
                <Plus className="w-3 h-3" /> Tugas
              </button>
            </div>
            {lkpd.kegiatanInti.tugasKritis.map((t, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <textarea
                    rows={2}
                    value={t}
                    onChange={(e) => {
                      const next = [...lkpd.kegiatanInti.tugasKritis];
                      next[i] = e.target.value;
                      onChange({
                        ...lkpd,
                        kegiatanInti: { ...lkpd.kegiatanInti, tugasKritis: next },
                      });
                    }}
                    className="w-full text-sm text-slate-900 border border-slate-200 rounded p-2.5"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...lkpd,
                        kegiatanInti: {
                          ...lkpd.kegiatanInti,
                          tugasKritis: lkpd.kegiatanInti.tugasKritis.filter((_, idx) => idx !== i),
                        },
                      })
                    }
                    className="no-print p-1.5 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-12 border border-dashed border-slate-300 rounded bg-slate-50/30 px-3 py-1.5 text-[11px] text-slate-400">
                  Ruang jawaban siswa...
                </div>
              </div>
            ))}
          </div>

          <div className="border border-slate-300 rounded-md p-4 bg-slate-50/70">
            <p className="text-xs font-bold text-[#1B4353] mb-1">Ayo Presentasikan Karyamu!</p>
            <textarea
              rows={2}
              value={lkpd.kegiatanInti.panduanPresentasi}
              onChange={(e) =>
                onChange({
                  ...lkpd,
                  kegiatanInti: { ...lkpd.kegiatanInti, panduanPresentasi: e.target.value },
                })
              }
              className="w-full text-sm text-slate-800 bg-transparent focus:outline-none resize-y"
            />
          </div>
        </section>

        {/* Lembar Refleksi Siswa */}
        <section className="border-t border-slate-200 pt-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">3. Lembar Refleksi Siswa</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-semibold">
                <tr>
                  <th className="py-2 px-3 w-10 text-center border-r border-slate-200">No</th>
                  <th className="py-2 px-3 w-1/2 border-r border-slate-200">Pertanyaan Refleksi</th>
                  <th className="py-2 px-3">Jawaban Siswa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lkpd.refleksiSiswa.map((refQ, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 text-center font-mono border-r border-slate-200">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200">
                      <textarea
                        rows={2}
                        value={refQ}
                        onChange={(e) => {
                          const next = [...lkpd.refleksiSiswa];
                          next[idx] = e.target.value;
                          onChange({ ...lkpd, refleksiSiswa: next });
                        }}
                        className="w-full bg-transparent text-xs focus:outline-none"
                      />
                    </td>
                    <td className="p-2.5 text-slate-400 italic">....................................................</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

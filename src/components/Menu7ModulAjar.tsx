import { useState } from 'react';
import { Sparkles, Loader2, CheckSquare, Square } from 'lucide-react';
import type { AtpRow, IdentitasSekolah, ModelPembelajaranId, ModulAjarState, TpRow } from '../types';
import { MODEL_PEMBELAJARAN_META } from '../data/defaultData';
import { generateWithAi } from '../utils/apiClient';
import { useIdentitas } from '../context/IdentitasContext';
import { SignatureBlock } from './DocumentHeader';

interface Props {
  identitas: IdentitasSekolah;
  modul: ModulAjarState;
  tpRows: TpRow[];
  atpRows: AtpRow[];
  onChange: (next: ModulAjarState) => void;
}

const MODEL_OPTIONS: Array<{ id: ModelPembelajaranId; label: string }> = [
  { id: 'PBL', label: 'Problem Based Learning (PBL)' },
  { id: 'PJBL', label: 'Project Based Learning (PjBL)' },
  { id: 'STEAM', label: 'STEAM' },
  { id: 'DISCOVERY', label: 'Discovery Learning' },
  { id: 'INQUIRY', label: 'Inquiry (Pembelajaran Mendalam)' },
];

const DIMENSI_KEYS: Array<{ key: keyof ModulAjarState['dimensiChecklist']; label: string }> = [
  { key: 'penalaranKritis', label: 'Penalaran Kritis' },
  { key: 'kreativitas', label: 'Kreativitas' },
  { key: 'kolaborasi', label: 'Kolaborasi' },
  { key: 'kemandirian', label: 'Kemandirian' },
  { key: 'komunikasi', label: 'Komunikasi' },
  { key: 'keimanan', label: 'Keimanan dan Ketaqwaan' },
  { key: 'kewargaan', label: 'Kewargaan' },
];

export function Menu7ModulAjar({ identitas, modul, tpRows, atpRows, onChange }: Props) {
  const ctx = useIdentitas();
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectModel = (modelId: ModelPembelajaranId) => {
    const meta = MODEL_PEMBELAJARAN_META[modelId];
    onChange({
      ...modul,
      modelPembelajaran: modelId,
      intiSintaks: meta.sintaks,
    });
  };

  const handlePickImportedTp = (tpId: string) => {
    const idx = tpRows.findIndex((t) => t.id === tpId);
    if (idx === -1) return;
    const tp = tpRows[idx];
    const atp = atpRows[idx];
    onChange({
      ...modul,
      materiPelajaran: atp?.lingkupMateri || tp.bab,
      capaianPembelajaran: tp.cp,
      tujuanPembelajaran: tp.tp,
    });
  };

  const handleGenerateAi = async () => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const meta = MODEL_PEMBELAJARAN_META[modul.modelPembelajaran];
      const res = await generateWithAi<Partial<ModulAjarState>>('modul_ajar', {
        sekolah: identitas.satuanPendidikan,
        tahunAjaran: identitas.tahunPelajaran,
        kelasFaseSemester: `${identitas.kelas} / ${identitas.fase} / (${identitas.semester})`,
        mataPelajaran: modul.mataPelajaran,
        materiPelajaran: modul.materiPelajaran,
        alokasiWaktu: modul.alokasiWaktu,
        modelPembelajaran: meta.label,
        sintaks: meta.sintaks.map((s) => s.sintakTitle),
      });
      onChange({
        ...modul,
        kesiapanMurid: res.kesiapanMurid || modul.kesiapanMurid,
        karakteristikMateri: res.karakteristikMateri || modul.karakteristikMateri,
        dimensiChecklist: res.dimensiChecklist || modul.dimensiChecklist,
        capaianPembelajaran: res.capaianPembelajaran || modul.capaianPembelajaran,
        tujuanPembelajaran: res.tujuanPembelajaran || modul.tujuanPembelajaran,
        praktikPedagogis: res.praktikPedagogis || modul.praktikPedagogis,
        lingkunganKemitraan: res.lingkunganKemitraan || modul.lingkunganKemitraan,
        pemanfaatanDigital: res.pemanfaatanDigital || modul.pemanfaatanDigital,
        pendahuluan: Array.isArray(res.pendahuluan) ? res.pendahuluan : modul.pendahuluan,
        intiSintaks: Array.isArray(res.intiSintaks) && res.intiSintaks.length > 0 ? res.intiSintaks : meta.sintaks,
        penutup: Array.isArray(res.penutup) ? res.penutup : modul.penutup,
        asesmenFormatif: Array.isArray(res.asesmenFormatif) ? res.asesmenFormatif : modul.asesmenFormatif,
        asesmenSumatif: res.asesmenSumatif || modul.asesmenSumatif,
      });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal menghasilkan Modul Ajar.');
    } finally {
      setLoadingAi(false);
    }
  };

  const selectedModelMeta = MODEL_PEMBELAJARAN_META[modul.modelPembelajaran];

  return (
    <div className="space-y-6">
      {/* Control Deck */}
      <div className="no-print bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Konfigurasi Modul Ajar Deep Learning (Taksonomi SOLO C4–C6)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Isikan materi, alokasi waktu, mata pelajaran, dan pilih model pembelajaran untuk langsung menautkan sintaknya ke bagian C. Pengalaman Belajar.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={loadingAi}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loadingAi ? 'Menyusun Modul C4–C6...' : 'Generate Modul Ajar (C4–C6 SOLO)'}
          </button>
        </div>

        {tpRows.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ambil Otomatis dari CP / TP Terimpor
            </label>
            <select
              defaultValue=""
              onChange={(e) => handlePickImportedTp(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4353]"
            >
              <option value="" disabled>
                -- Pilih Bab / TP dari Analisis CP untuk diterapkan ke Modul Ajar --
              </option>
              {tpRows.map((t, idx) => (
                <option key={t.id} value={t.id}>
                  {t.no}. {t.bab} ({atpRows[idx]?.lingkupMateri || t.elemen}) — {t.tp.slice(0, 80)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={modul.mataPelajaran}
              onChange={(e) => onChange({ ...modul, mataPelajaran: e.target.value })}
              className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4353]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Materi Pelajaran</label>
            <input
              type="text"
              value={modul.materiPelajaran}
              onChange={(e) => onChange({ ...modul, materiPelajaran: e.target.value })}
              placeholder="Contoh: Tembang Macapat Pangkur / Aksara Jawa"
              className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4353]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Alokasi Waktu</label>
            <input
              type="text"
              value={modul.alokasiWaktu}
              onChange={(e) => onChange({ ...modul, alokasiWaktu: e.target.value })}
              placeholder="2 x 35 Menit (1 Pert)"
              className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4353]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Pilih Model Pembelajaran (Otomatis Terhubung ke Sintak Pengalaman Belajar)
          </label>
          <div className="flex flex-wrap gap-2">
            {MODEL_OPTIONS.map((opt) => {
              const active = modul.modelPembelajaran === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectModel(opt.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#1B4353] text-white border-[#1B4353]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="no-print p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* Document Output */}
      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-10 text-sm text-slate-800 space-y-6">
        <div className="text-center border-b border-slate-300 pb-4">
          <h2 className="font-display text-xl font-bold text-slate-900">
            PERENCANAAN PEMBELAJARAN MENDALAM
          </h2>
          <p className="text-sm font-semibold text-slate-700">(DEEP LEARNING)</p>
          {ctx ? (
            <input
              type="text"
              value={ctx.identitas.satuanPendidikan}
              onChange={(e) => ctx.updateIdentitas({ satuanPendidikan: e.target.value })}
              className="mt-1 text-center text-base font-bold text-[#1B4353] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:outline-none px-2 print:border-none"
            />
          ) : (
            <p className="text-base font-bold text-[#1B4353] mt-1">{identitas.satuanPendidikan}</p>
          )}
        </div>

        {/* Identitas Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 bg-slate-50 border border-slate-200 rounded-md p-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-40 shrink-0 font-medium text-slate-600">Tahun Ajaran</span>
            <span>:</span>
            {ctx ? (
              <input
                type="text"
                value={ctx.identitas.tahunPelajaran}
                onChange={(e) => ctx.updateIdentitas({ tahunPelajaran: e.target.value })}
                className="w-full min-w-0 font-mono font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 print:border-none"
              />
            ) : (
              <span className="font-semibold text-slate-900">{identitas.tahunPelajaran}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-40 shrink-0 font-medium text-slate-600">Kelas / Fase / Semester</span>
            <span>:</span>
            {ctx ? (
              <div className="flex items-center gap-1 min-w-0 font-semibold text-slate-900">
                <input
                  type="text"
                  aria-label="Kelas"
                  value={ctx.identitas.kelas}
                  onChange={(e) => ctx.updateIdentitas({ kelas: e.target.value })}
                  className="w-12 text-center bg-transparent border-b border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 print:border-none"
                />
                <span>/</span>
                <input
                  type="text"
                  aria-label="Fase"
                  value={ctx.identitas.fase}
                  onChange={(e) => ctx.updateIdentitas({ fase: e.target.value })}
                  className="w-12 text-center bg-transparent border-b border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 print:border-none"
                />
                <span>/</span>
                <input
                  type="text"
                  aria-label="Semester"
                  value={ctx.identitas.semester}
                  onChange={(e) => ctx.updateIdentitas({ semester: e.target.value })}
                  className="w-20 bg-transparent border-b border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 print:border-none"
                />
              </div>
            ) : (
              <span className="font-semibold text-slate-900">
                {identitas.kelas} / {identitas.fase} / ({identitas.semester})
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <span className="w-40 shrink-0 font-medium text-slate-600">Mata Pelajaran</span>
            <span>:</span>
            <span className="font-semibold text-slate-900">{modul.mataPelajaran}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-40 shrink-0 font-medium text-slate-600">Materi Pelajaran</span>
            <span>:</span>
            <span className="font-semibold text-slate-900">{modul.materiPelajaran}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-40 shrink-0 font-medium text-slate-600">Alokasi Waktu</span>
            <span>:</span>
            <span className="font-semibold text-slate-900">{modul.alokasiWaktu}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-40 shrink-0 font-medium text-slate-600">Model Pembelajaran</span>
            <span>:</span>
            <span className="font-semibold text-[#1B4353]">{selectedModelMeta.label}</span>
          </div>
        </div>

        {/* A. IDENTIFIKASI */}
        <section className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
            A. IDENTIFIKASI
          </h3>
          <div>
            <p className="font-semibold text-xs text-slate-800 mb-1">• Identifikasi Kesiapan Murid:</p>
            <textarea
              rows={3}
              value={modul.kesiapanMurid}
              onChange={(e) => onChange({ ...modul, kesiapanMurid: e.target.value })}
              className="w-full text-xs leading-relaxed text-slate-700 bg-slate-50/50 border border-slate-200 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
            />
          </div>
          <div>
            <p className="font-semibold text-xs text-slate-800 mb-1">• Karakteristik Materi Pelajaran:</p>
            <textarea
              rows={2}
              value={modul.karakteristikMateri}
              onChange={(e) => onChange({ ...modul, karakteristikMateri: e.target.value })}
              className="w-full text-xs leading-relaxed text-slate-700 bg-slate-50/50 border border-slate-200 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
            />
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-semibold">
                <tr>
                  <th className="py-2 px-3 w-48 text-left border-r border-slate-200">Dimensi Profil Lulusan</th>
                  <th className="py-2 px-3 text-left">Integrasi Kontekstual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {DIMENSI_KEYS.map(({ key, label }) => {
                  const item = modul.dimensiChecklist[key];
                  return (
                    <tr key={key} className="align-top">
                      <td className="p-2.5 border-r border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            onChange({
                              ...modul,
                              dimensiChecklist: {
                                ...modul.dimensiChecklist,
                                [key]: { ...item, checked: !item.checked },
                              },
                            })
                          }
                          className="inline-flex items-center gap-2 text-left font-medium text-slate-900"
                        >
                          {item.checked ? (
                            <CheckSquare className="w-4 h-4 text-[#1B4353] shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span>{label}</span>
                        </button>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.deskripsi}
                          onChange={(e) =>
                            onChange({
                              ...modul,
                              dimensiChecklist: {
                                ...modul.dimensiChecklist,
                                [key]: { ...item, deskripsi: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-transparent text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded px-1.5 py-0.5"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* B. DESAIN PEMBELAJARAN */}
        <section className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
            B. DESAIN PEMBELAJARAN
          </h3>
          <div>
            <p className="font-semibold text-xs text-slate-800 mb-1">• Capaian Pembelajaran:</p>
            <textarea
              rows={2}
              value={modul.capaianPembelajaran}
              onChange={(e) => onChange({ ...modul, capaianPembelajaran: e.target.value })}
              className="w-full text-xs leading-relaxed text-slate-700 bg-slate-50/50 border border-slate-200 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
            />
          </div>
          <div>
            <p className="font-semibold text-xs text-slate-800 mb-1">
              • Tujuan Pembelajaran (Taksonomi SOLO Relational–Extended Abstract / C4–C6):
            </p>
            <textarea
              rows={2}
              value={modul.tujuanPembelajaran}
              onChange={(e) => onChange({ ...modul, tujuanPembelajaran: e.target.value })}
              className="w-full text-xs leading-relaxed text-slate-800 font-medium bg-slate-50/50 border border-slate-200 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="border border-slate-200 rounded-md p-3 space-y-2">
              <p className="font-bold text-slate-900">1. PRAKTIK PEDAGOGIS</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-medium text-slate-600">Pendekatan Pembelajaran</span>
                <input
                  type="text"
                  value={modul.praktikPedagogis.pendekatan}
                  onChange={(e) =>
                    onChange({
                      ...modul,
                      praktikPedagogis: { ...modul.praktikPedagogis, pendekatan: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                />
                <span className="font-medium text-slate-600">Model Pembelajaran</span>
                <div className="sm:col-span-2 font-semibold text-[#1B4353] px-2 py-1 bg-slate-50 border border-slate-200 rounded">
                  {selectedModelMeta.label}
                </div>
                <span className="font-medium text-slate-600">Metode Pembelajaran</span>
                <input
                  type="text"
                  value={modul.praktikPedagogis.metode}
                  onChange={(e) =>
                    onChange({
                      ...modul,
                      praktikPedagogis: { ...modul.praktikPedagogis, metode: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-md p-3 space-y-2">
              <p className="font-bold text-slate-900">2. LINGKUNGAN PEMBELAJARAN & KEMITRAAN</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-medium text-slate-600">Budaya Belajar</span>
                <input
                  type="text"
                  value={modul.lingkunganKemitraan.budayaBelajar}
                  onChange={(e) =>
                    onChange({
                      ...modul,
                      lingkunganKemitraan: { ...modul.lingkunganKemitraan, budayaBelajar: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                />
                <span className="font-medium text-slate-600">Ruang Fisik</span>
                <input
                  type="text"
                  value={modul.lingkunganKemitraan.ruangFisik}
                  onChange={(e) =>
                    onChange({
                      ...modul,
                      lingkunganKemitraan: { ...modul.lingkunganKemitraan, ruangFisik: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                />
                <span className="font-medium text-slate-600">Kemitraan Antarmurid</span>
                <input
                  type="text"
                  value={modul.lingkunganKemitraan.kemitraanAntarmurid}
                  onChange={(e) =>
                    onChange({
                      ...modul,
                      lingkunganKemitraan: { ...modul.lingkunganKemitraan, kemitraanAntarmurid: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-md p-3 space-y-2">
              <p className="font-bold text-slate-900">3. PEMANFAATAN DIGITAL & MEDIA PEMBELAJARAN</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-medium text-slate-600">Platform Desain / Digital</span>
                <input
                  type="text"
                  value={modul.pemanfaatanDigital.platform}
                  onChange={(e) =>
                    onChange({
                      ...modul,
                      pemanfaatanDigital: { ...modul.pemanfaatanDigital, platform: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                />
                <span className="font-medium text-slate-600">Perangkat</span>
                <input
                  type="text"
                  value={modul.pemanfaatanDigital.perangkat}
                  onChange={(e) =>
                    onChange({
                      ...modul,
                      pemanfaatanDigital: { ...modul.pemanfaatanDigital, perangkat: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                />
                <span className="font-medium text-slate-600">Media & Bahan Ajar</span>
                <input
                  type="text"
                  value={modul.pemanfaatanDigital.mediaBahanAjar}
                  onChange={(e) =>
                    onChange({
                      ...modul,
                      pemanfaatanDigital: { ...modul.pemanfaatanDigital, mediaBahanAjar: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* C. PENGALAMAN BELAJAR */}
        <section className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
            C. PENGALAMAN BELAJAR
          </h3>
          <p className="text-xs text-slate-600">
            Tabel alur pembelajaran mendalam mengintegrasikan prinsip Memahami, Mengaplikasi, dan Merefleksi dengan sintak model {selectedModelMeta.label}.
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#1B4353] text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3 w-40 border-r border-white/15">Kegiatan</th>
                  <th className="py-2.5 px-3 border-r border-white/15">Deskripsi Kegiatan</th>
                  <th className="py-2.5 px-3 w-24 text-center">Alokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="align-top">
                  <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/70">
                    Pendahuluan
                    <div className="font-normal text-slate-600 mt-0.5">(Memahami)</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 space-y-1.5">
                    {modul.pendahuluan.map((step, i) => (
                      <textarea
                        key={i}
                        rows={2}
                        value={step}
                        onChange={(e) => {
                          const next = [...modul.pendahuluan];
                          next[i] = e.target.value;
                          onChange({ ...modul, pendahuluan: next });
                        }}
                        className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-[#1B4353] rounded p-1 leading-relaxed focus:outline-none resize-y"
                      />
                    ))}
                  </td>
                  <td className="p-3 text-center font-mono">
                    <input
                      type="text"
                      value={modul.alokasiPendahuluan}
                      onChange={(e) => onChange({ ...modul, alokasiPendahuluan: e.target.value })}
                      className="w-20 text-center bg-slate-50 border border-slate-200 rounded py-1"
                    />
                  </td>
                </tr>

                <tr className="align-top">
                  <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/70">
                    Inti
                    <div className="font-normal text-slate-600 mt-0.5">(Memahami, Mengaplikasi)</div>
                    <div className="mt-2 font-semibold text-[#1B4353]">Model: {selectedModelMeta.shortLabel}</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 space-y-4">
                    {modul.intiSintaks.map((sintak, sIdx) => (
                      <div key={sIdx} className="pb-3 border-b last:border-b-0 border-slate-100">
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                          <span className="font-bold text-slate-900">{sintak.sintakTitle}</span>
                          <span className="text-[11px] font-medium text-[#1B4353]">{sintak.deepLearningTag}</span>
                        </div>
                        <div className="space-y-1">
                          {sintak.aktivitas.map((akt, aIdx) => (
                            <textarea
                              key={aIdx}
                              rows={2}
                              value={akt}
                              onChange={(e) => {
                                const nextSintaks = [...modul.intiSintaks];
                                const nextAkt = [...sintak.aktivitas];
                                nextAkt[aIdx] = e.target.value;
                                nextSintaks[sIdx] = { ...sintak, aktivitas: nextAkt };
                                onChange({ ...modul, intiSintaks: nextSintaks });
                              }}
                              className="w-full bg-slate-50/40 border border-slate-200/70 rounded p-1.5 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] resize-y"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 text-center font-mono">
                    <input
                      type="text"
                      value={modul.alokasiInti}
                      onChange={(e) => onChange({ ...modul, alokasiInti: e.target.value })}
                      className="w-20 text-center bg-slate-50 border border-slate-200 rounded py-1"
                    />
                  </td>
                </tr>

                <tr className="align-top">
                  <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/70">
                    Penutup
                    <div className="font-normal text-slate-600 mt-0.5">(Merefleksi)</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 space-y-1.5">
                    {modul.penutup.map((step, i) => (
                      <textarea
                        key={i}
                        rows={2}
                        value={step}
                        onChange={(e) => {
                          const next = [...modul.penutup];
                          next[i] = e.target.value;
                          onChange({ ...modul, penutup: next });
                        }}
                        className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-[#1B4353] rounded p-1 leading-relaxed focus:outline-none resize-y"
                      />
                    ))}
                  </td>
                  <td className="p-3 text-center font-mono">
                    <input
                      type="text"
                      value={modul.alokasiPenutup}
                      onChange={(e) => onChange({ ...modul, alokasiPenutup: e.target.value })}
                      className="w-20 text-center bg-slate-50 border border-slate-200 rounded py-1"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* D. ASESMEN PEMBELAJARAN */}
        <section className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
            D. ASESMEN PEMBELAJARAN
          </h3>
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-slate-800">• Asesmen Formatif:</p>
            {modul.asesmenFormatif.map((f, i) => (
              <textarea
                key={i}
                rows={2}
                value={f}
                onChange={(e) => {
                  const next = [...modul.asesmenFormatif];
                  next[i] = e.target.value;
                  onChange({ ...modul, asesmenFormatif: next });
                }}
                className="w-full bg-slate-50/50 border border-slate-200 rounded p-2 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
              />
            ))}
            <p className="font-semibold text-slate-800 pt-1">• Asesmen Sumatif (C4–C6 SOLO):</p>
            <textarea
              rows={2}
              value={modul.asesmenSumatif}
              onChange={(e) => onChange({ ...modul, asesmenSumatif: e.target.value })}
              className="w-full bg-slate-50/50 border border-slate-200 rounded p-2 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
            />
          </div>
        </section>

        <SignatureBlock identitas={identitas} />
      </div>
    </div>
  );
}

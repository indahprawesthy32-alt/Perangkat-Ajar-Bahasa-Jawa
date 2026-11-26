import { useRef, useState } from 'react';
import { Sparkles, Upload, Download, Plus, Trash2, Loader2 } from 'lucide-react';
import type { AppState, BentukSoalFormatif, IdentitasSekolah, KisiKisiRow, PaketSoalState, SoalItem } from '../types';
import { generateWithAi } from '../utils/apiClient';
import { exportMenuDocument, parseAnyUploadedFile } from '../utils/fileEngine';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  fullState: AppState;
  identitas: IdentitasSekolah;
  soalFormatif: PaketSoalState;
  soalSumatif: PaketSoalState;
  onChangeFormatif: (next: PaketSoalState) => void;
  onChangeSumatif: (next: PaketSoalState) => void;
}

const FORMATIF_TYPES: BentukSoalFormatif[] = [
  'Pilihan Ganda ABCD',
  'Pilihan Ganda Kompleks / MCMA',
  'Essay',
  'Tes Lisan',
  'Isian Pendek',
];

export function Menu10Soal({
  fullState,
  identitas,
  soalFormatif,
  soalSumatif,
  onChangeFormatif,
  onChangeSumatif,
}: Props) {
  const [tab, setTab] = useState<'formatif' | 'sumatif'>('formatif');
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const activePaket = tab === 'formatif' ? soalFormatif : soalSumatif;
  const setActivePaket = tab === 'formatif' ? onChangeFormatif : onChangeSumatif;
  const maxAllowed = tab === 'formatif' ? 15 : 30;

  const handleGenerate = async () => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const task = tab === 'formatif' ? 'soal_formatif' : 'soal_sumatif';
      const jumlah = Math.min(Math.max(1, activePaket.jumlahSoal), maxAllowed);
      const res = await generateWithAi<{
        kktp: string;
        kisiKisi: Array<Omit<KisiKisiRow, 'id'>>;
        soal: Array<Omit<SoalItem, 'id'>>;
        pedomanUmum: string;
      }>(task, {
        identitas,
        intiMateri: activePaket.intiMateri,
        jumlahSoal: jumlah,
        jenisSoal:
          tab === 'formatif'
            ? activePaket.jenisDipilih
            : ['Pilihan Ganda ABCD', 'Pilihan Ganda Kompleks / MCMA'],
      });

      setActivePaket({
        ...activePaket,
        kktp: res.kktp || activePaket.kktp,
        kisiKisi: Array.isArray(res.kisiKisi)
          ? res.kisiKisi.map((k, i) => ({ ...k, id: `kk_${Date.now()}_${i}` }))
          : activePaket.kisiKisi,
        soal: Array.isArray(res.soal)
          ? res.soal.slice(0, maxAllowed).map((s, i) => ({
              ...s,
              id: `sl_${Date.now()}_${i}`,
              opsi: Array.isArray(s.opsi) ? s.opsi : [],
            }))
          : activePaket.soal,
        pedomanUmum: res.pedomanUmum || activePaket.pedomanUmum,
      });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal membuat soal.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleUploadSoal = async (file: File) => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const parsed = await parseAnyUploadedFile(file, `soal_${tab}`);
      if (parsed.rows && parsed.rows.length > 1) {
        // Parse tabular questions from Excel/CSV
        const importedSoal: SoalItem[] = parsed.rows
          .slice(1)
          .filter((r) => r.some(Boolean))
          .slice(0, maxAllowed)
          .map((r, i) => ({
            id: `imp_s_${Date.now()}_${i}`,
            no: i + 1,
            bentuk: (FORMATIF_TYPES.includes(r[1] as BentukSoalFormatif)
              ? (r[1] as BentukSoalFormatif)
              : 'Pilihan Ganda ABCD'),
            pertanyaan: r[2] || r[0] || '',
            opsi: r[3] ? String(r[3]).split(/\n|\|/).map((x) => x.trim()).filter(Boolean) : [],
            kunciJawaban: r[4] || '',
            skorMaksimal: Number(r[5]) || 10,
            pedomanPenskoran: r[6] || 'Sesuai kunci jawaban',
          }));
        if (importedSoal.length > 0) {
          setActivePaket({ ...activePaket, soal: importedSoal });
          setLoadingAi(false);
          return;
        }
      }

      if (parsed.aiExtracted?.detectedQuestions?.length) {
        const mapped: SoalItem[] = parsed.aiExtracted.detectedQuestions
          .slice(0, maxAllowed)
          .map((q, i) => ({
            id: `imp_ai_${Date.now()}_${i}`,
            no: q.no || i + 1,
            bentuk: (FORMATIF_TYPES.includes(q.bentuk as BentukSoalFormatif)
              ? (q.bentuk as BentukSoalFormatif)
              : 'Pilihan Ganda ABCD'),
            pertanyaan: q.pertanyaan,
            opsi: q.opsi || [],
            kunciJawaban: q.kunciJawaban || '',
            skorMaksimal: 10,
            pedomanPenskoran: 'Sesuai kunci jawaban',
          }));
        setActivePaket({ ...activePaket, soal: mapped });
      } else if (parsed.text) {
        // Put uploaded material into intiMateri and generate structured questions
        setActivePaket({ ...activePaket, intiMateri: parsed.text.slice(0, 4000) });
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal mengupload soal.');
    } finally {
      setLoadingAi(false);
    }
  };

  const toggleJenisFormatif = (jenis: BentukSoalFormatif) => {
    const exists = activePaket.jenisDipilih.includes(jenis);
    const next = exists
      ? activePaket.jenisDipilih.filter((j) => j !== jenis)
      : [...activePaket.jenisDipilih, jenis];
    setActivePaket({
      ...activePaket,
      jenisDipilih: next.length > 0 ? next : ['Pilihan Ganda ABCD'],
    });
  };

  return (
    <div className="space-y-6">
      <div className="no-print bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setTab('formatif')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                tab === 'formatif' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Soal Formatif (Maks 15)
            </button>
            <button
              type="button"
              onClick={() => setTab('sumatif')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                tab === 'sumatif' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Soal Sumatif (Maks 30)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".docx,.xlsx,.xls,.csv,.txt,.md,.pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUploadSoal(f);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={loadingAi}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Soal / Materi
            </button>
            <button
              type="button"
              onClick={() => exportMenuDocument('soal', 'docx', fullState)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Download Word (.docx)
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loadingAi}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] disabled:opacity-60 rounded-md whitespace-nowrap shrink-0"
            >
              {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {loadingAi ? 'Menyusun Soal...' : `Generate ${tab === 'formatif' ? 'Formatif' : 'Sumatif'}`}
            </button>
          </div>
        </div>

        {fullState.tpRows.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ambil Materi dari CP / TP Terimpor
            </label>
            <select
              defaultValue=""
              onChange={(e) => {
                const idx = fullState.tpRows.findIndex((t) => t.id === e.target.value);
                if (idx === -1) return;
                const tp = fullState.tpRows[idx];
                const materi = fullState.atpRows[idx]?.lingkupMateri || tp.bab;
                setActivePaket({
                  ...activePaket,
                  intiMateri: `${materi} — ${tp.tp}`,
                });
              }}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2"
            >
              <option value="" disabled>
                -- Pilih Bab / TP dari Analisis CP untuk dijadikan Soal --
              </option>
              {fullState.tpRows.map((t, idx) => (
                <option key={t.id} value={t.id}>
                  {t.no}. {t.bab} ({fullState.atpRows[idx]?.lingkupMateri || t.elemen})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Inti Materi yang Akan Dibuatkan Soal
            </label>
            <textarea
              rows={2}
              value={activePaket.intiMateri}
              onChange={(e) => setActivePaket({ ...activePaket, intiMateri: e.target.value })}
              placeholder="Tuliskan inti materi Bahasa Jawa..."
              className="w-full text-sm border border-slate-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4353]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Jumlah Soal (Maks {maxAllowed})
            </label>
            <input
              type="number"
              min={1}
              max={maxAllowed}
              value={activePaket.jumlahSoal}
              onChange={(e) =>
                setActivePaket({
                  ...activePaket,
                  jumlahSoal: Math.min(maxAllowed, Math.max(1, Number(e.target.value) || 1)),
                })
              }
              className="w-full font-mono text-sm border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {tab === 'formatif' ? (
          <div>
            <span className="block text-xs font-medium text-slate-700 mb-1.5">Bentuk Soal Formatif:</span>
            <div className="flex flex-wrap gap-2">
              {FORMATIF_TYPES.map((j) => {
                const checked = activePaket.jenisDipilih.includes(j);
                return (
                  <button
                    key={j}
                    type="button"
                    onClick={() => toggleJenisFormatif(j)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      checked
                        ? 'bg-[#1B4353] text-white border-[#1B4353]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {j}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600">
            Bentuk Soal Sumatif: Pilihan Ganda ABCD &amp; Pilihan Ganda Kompleks / MCMA (maksimum 30 soal).
          </p>
        )}
      </div>

      {errorMsg && (
        <div className="no-print p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* Printable Output */}
      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-8">
        <DocumentHeader
          title={tab === 'formatif' ? 'ASESMEN FORMATIF BAHASA JAWA' : 'ASESMEN SUMATIF BAHASA JAWA'}
          fields={[
            { label: 'Satuan Pendidikan', value: identitas.satuanPendidikan },
            { label: 'Mata Pelajaran', value: identitas.mataPelajaran },
            { label: 'Kelas / Fase', value: `${identitas.kelas} / ${identitas.fase}` },
            { label: 'Tahun Pelajaran', value: identitas.tahunPelajaran },
          ]}
        />

        {/* KKTP */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">A. KKTP Terkait</h3>
          <textarea
            rows={2}
            value={activePaket.kktp}
            onChange={(e) => setActivePaket({ ...activePaket, kktp: e.target.value })}
            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded p-2.5"
          />
        </section>

        {/* Kisi-kisi */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">B. Kisi-Kisi Penulisan Soal</h3>
            <button
              type="button"
              onClick={() =>
                setActivePaket({
                  ...activePaket,
                  kisiKisi: [
                    ...activePaket.kisiKisi,
                    {
                      id: `kk_${Date.now()}`,
                      no: activePaket.kisiKisi.length + 1,
                      tp: '',
                      materi: '',
                      indikatorSoal: '',
                      levelKognitif: 'C4',
                      bentukSoal: 'Pilihan Ganda ABCD',
                      noSoal: String(activePaket.kisiKisi.length + 1),
                    },
                  ],
                })
              }
              className="no-print inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded"
            >
              <Plus className="w-3 h-3" /> Baris Kisi-kisi
            </button>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#1B4353] text-white font-semibold">
                <tr>
                  <th className="py-2 px-2 w-10 text-center border-r border-white/15">No</th>
                  <th className="py-2 px-2.5 border-r border-white/15">Tujuan Pembelajaran</th>
                  <th className="py-2 px-2.5 w-36 border-r border-white/15">Materi</th>
                  <th className="py-2 px-2.5 border-r border-white/15">Indikator Soal</th>
                  <th className="py-2 px-2 w-24 border-r border-white/15">Level</th>
                  <th className="py-2 px-2.5 w-32 border-r border-white/15">Bentuk Soal</th>
                  <th className="py-2 px-2 w-16 text-center border-r border-white/15">No Soal</th>
                  <th className="py-2 px-2 w-8 no-print text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activePaket.kisiKisi.map((k, idx) => (
                  <tr key={k.id} className="align-top">
                    <td className="p-2 text-center font-mono border-r border-slate-200">{k.no}</td>
                    <td className="p-1.5 border-r border-slate-200">
                      <textarea
                        rows={2}
                        value={k.tp}
                        onChange={(e) => {
                          const next = [...activePaket.kisiKisi];
                          next[idx] = { ...k, tp: e.target.value };
                          setActivePaket({ ...activePaket, kisiKisi: next });
                        }}
                        className="w-full bg-transparent p-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-1.5 border-r border-slate-200">
                      <input
                        type="text"
                        value={k.materi}
                        onChange={(e) => {
                          const next = [...activePaket.kisiKisi];
                          next[idx] = { ...k, materi: e.target.value };
                          setActivePaket({ ...activePaket, kisiKisi: next });
                        }}
                        className="w-full bg-transparent p-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-1.5 border-r border-slate-200">
                      <textarea
                        rows={2}
                        value={k.indikatorSoal}
                        onChange={(e) => {
                          const next = [...activePaket.kisiKisi];
                          next[idx] = { ...k, indikatorSoal: e.target.value };
                          setActivePaket({ ...activePaket, kisiKisi: next });
                        }}
                        className="w-full bg-transparent p-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-1.5 border-r border-slate-200">
                      <input
                        type="text"
                        value={k.levelKognitif}
                        onChange={(e) => {
                          const next = [...activePaket.kisiKisi];
                          next[idx] = { ...k, levelKognitif: e.target.value };
                          setActivePaket({ ...activePaket, kisiKisi: next });
                        }}
                        className="w-full bg-transparent p-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-1.5 border-r border-slate-200">
                      <input
                        type="text"
                        value={k.bentukSoal}
                        onChange={(e) => {
                          const next = [...activePaket.kisiKisi];
                          next[idx] = { ...k, bentukSoal: e.target.value };
                          setActivePaket({ ...activePaket, kisiKisi: next });
                        }}
                        className="w-full bg-transparent p-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-1.5 text-center border-r border-slate-200">
                      <input
                        type="text"
                        value={k.noSoal}
                        onChange={(e) => {
                          const next = [...activePaket.kisiKisi];
                          next[idx] = { ...k, noSoal: e.target.value };
                          setActivePaket({ ...activePaket, kisiKisi: next });
                        }}
                        className="w-full text-center font-mono bg-transparent p-1 focus:outline-none"
                      />
                    </td>
                    <td className="p-1.5 no-print text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setActivePaket({
                            ...activePaket,
                            kisiKisi: activePaket.kisiKisi.filter((x) => x.id !== k.id),
                          })
                        }
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Naskah Soal */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              C. Butir Soal ({activePaket.soal.length}/{maxAllowed} Soal)
            </h3>
            {activePaket.soal.length < maxAllowed && (
              <button
                type="button"
                onClick={() =>
                  setActivePaket({
                    ...activePaket,
                    soal: [
                      ...activePaket.soal,
                      {
                        id: `sl_${Date.now()}`,
                        no: activePaket.soal.length + 1,
                        bentuk: 'Pilihan Ganda ABCD',
                        pertanyaan: '',
                        opsi: ['A. ', 'B. ', 'C. ', 'D. '],
                        kunciJawaban: 'A',
                        skorMaksimal: 10,
                        pedomanPenskoran: 'Benar = 10, Salah = 0',
                      },
                    ],
                  })
                }
                className="no-print inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded"
              >
                <Plus className="w-3 h-3" /> Tambah Soal
              </button>
            )}
          </div>

          <div className="space-y-4">
            {activePaket.soal.map((s, idx) => (
              <div key={s.id} className="border border-slate-200 rounded-md p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1B4353]">Soal No. {s.no}</span>
                    <span className="text-slate-400">·</span>
                    <select
                      value={s.bentuk}
                      onChange={(e) => {
                        const next = [...activePaket.soal];
                        next[idx] = { ...s, bentuk: e.target.value as BentukSoalFormatif };
                        setActivePaket({ ...activePaket, soal: next });
                      }}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs font-medium"
                    >
                      {FORMATIF_TYPES.map((ft) => (
                        <option key={ft} value={ft}>
                          {ft}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 no-print">
                    <span className="text-slate-500">Skor Maks:</span>
                    <input
                      type="number"
                      min={1}
                      value={s.skorMaksimal}
                      onChange={(e) => {
                        const next = [...activePaket.soal];
                        next[idx] = { ...s, skorMaksimal: Number(e.target.value) || 0 };
                        setActivePaket({ ...activePaket, soal: next });
                      }}
                      className="w-14 text-center font-mono bg-slate-50 border border-slate-200 rounded py-0.5"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setActivePaket({
                          ...activePaket,
                          soal: activePaket.soal.filter((x) => x.id !== s.id),
                        })
                      }
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={s.pertanyaan}
                  onChange={(e) => {
                    const next = [...activePaket.soal];
                    next[idx] = { ...s, pertanyaan: e.target.value };
                    setActivePaket({ ...activePaket, soal: next });
                  }}
                  className="w-full text-sm text-slate-900 bg-slate-50/40 border border-slate-200 rounded p-2.5 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
                />

                {s.opsi.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                    {s.opsi.map((op, oIdx) => (
                      <input
                        key={oIdx}
                        type="text"
                        value={op}
                        onChange={(e) => {
                          const next = [...activePaket.soal];
                          const nextOpsi = [...s.opsi];
                          nextOpsi[oIdx] = e.target.value;
                          next[idx] = { ...s, opsi: nextOpsi };
                          setActivePaket({ ...activePaket, soal: next });
                        }}
                        className="text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1.5"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Kunci Jawaban & Pedoman Penskoran */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">D. Kunci Jawaban &amp; Pedoman Penskoran</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-semibold">
                <tr>
                  <th className="py-2 px-2.5 w-14 text-center border-r border-slate-200">No</th>
                  <th className="py-2 px-3 w-56 border-r border-slate-200">Kunci Jawaban</th>
                  <th className="py-2 px-2.5 w-20 text-center border-r border-slate-200">Skor Maks</th>
                  <th className="py-2 px-3">Pedoman Penskoran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activePaket.soal.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="p-2 text-center font-mono border-r border-slate-200">{s.no}</td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={s.kunciJawaban}
                        onChange={(e) => {
                          const next = [...activePaket.soal];
                          next[idx] = { ...s, kunciJawaban: e.target.value };
                          setActivePaket({ ...activePaket, soal: next });
                        }}
                        className="w-full font-semibold text-slate-900 bg-transparent px-1 py-0.5"
                      />
                    </td>
                    <td className="p-2 text-center font-mono border-r border-slate-200">{s.skorMaksimal}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={s.pedomanPenskoran}
                        onChange={(e) => {
                          const next = [...activePaket.soal];
                          next[idx] = { ...s, pedomanPenskoran: e.target.value };
                          setActivePaket({ ...activePaket, soal: next });
                        }}
                        className="w-full text-slate-700 bg-transparent px-1 py-0.5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <textarea
            rows={2}
            value={activePaket.pedomanUmum}
            onChange={(e) => setActivePaket({ ...activePaket, pedomanUmum: e.target.value })}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded p-2.5"
          />
        </section>

        <SignatureBlock identitas={identitas} />
      </div>
    </div>
  );
}

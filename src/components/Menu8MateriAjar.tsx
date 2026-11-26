import { useRef, useState } from 'react';
import { Sparkles, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import type { AtpRow, IdentitasSekolah, MateriAjarState, TpRow } from '../types';
import { generateWithAi } from '../utils/apiClient';
import { parseAnyUploadedFile } from '../utils/fileEngine';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  identitas: IdentitasSekolah;
  materiAjar: MateriAjarState;
  tpRows: TpRow[];
  atpRows: AtpRow[];
  onChange: (next: MateriAjarState) => void;
}

export function Menu8MateriAjar({ identitas, materiAjar, tpRows, atpRows, onChange }: Props) {
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handlePickTp = (tpId: string) => {
    const idx = tpRows.findIndex((t) => t.id === tpId);
    if (idx === -1) return;
    const tp = tpRows[idx];
    const materi = atpRows[idx]?.lingkupMateri || tp.bab;
    onChange({
      ...materiAjar,
      materiIntiInput: `${materi}: ${tp.tp}`,
      judulMateri: materi,
      bab: tp.bab,
      tujuanPembelajaran: tp.tp,
      petaKonsep: { ...materiAjar.petaKonsep, pusat: materi },
    });
  };

  const handleUploadMateri = async (file: File) => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const parsed = await parseAnyUploadedFile(file, 'materi_ajar');
      const extracted = parsed.text || '';
      if (!extracted) {
        throw new Error('Tidak ada teks materi yang terbaca dari file.');
      }
      const updated = { ...materiAjar, materiIntiInput: extracted };
      onChange(updated);
      const res = await generateWithAi<Partial<MateriAjarState>>('materi_ajar', {
        identitas,
        materiInti: extracted,
      });
      onChange({
        ...updated,
        judulMateri: res.judulMateri || updated.judulMateri,
        bab: res.bab || updated.bab,
        tujuanPembelajaran: res.tujuanPembelajaran || updated.tujuanPembelajaran,
        petaKonsep: res.petaKonsep || updated.petaKonsep,
        paragrafRingkasan: Array.isArray(res.paragrafRingkasan) ? res.paragrafRingkasan : updated.paragrafRingkasan,
        kosakataPenting: Array.isArray(res.kosakataPenting) ? res.kosakataPenting : updated.kosakataPenting,
        contohKontekstual: res.contohKontekstual || updated.contohKontekstual,
      });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal membaca file materi.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGenerate = async () => {
    setLoadingAi(true);
    setErrorMsg(null);
    try {
      const res = await generateWithAi<Partial<MateriAjarState>>('materi_ajar', {
        identitas,
        materiInti: materiAjar.materiIntiInput,
      });
      onChange({
        ...materiAjar,
        judulMateri: res.judulMateri || materiAjar.judulMateri,
        bab: res.bab || materiAjar.bab,
        tujuanPembelajaran: res.tujuanPembelajaran || materiAjar.tujuanPembelajaran,
        petaKonsep: res.petaKonsep || materiAjar.petaKonsep,
        paragrafRingkasan: Array.isArray(res.paragrafRingkasan) ? res.paragrafRingkasan : materiAjar.paragrafRingkasan,
        kosakataPenting: Array.isArray(res.kosakataPenting) ? res.kosakataPenting : materiAjar.kosakataPenting,
        contohKontekstual: res.contohKontekstual || materiAjar.contohKontekstual,
      });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal menyusun materi ajar.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Input */}
      <div className="no-print bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Generator Materi Ajar Bahasa Jawa</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Ketik materi inti, pilih dari CP/TP terimpor, atau upload file untuk menyusun Peta Konsep, ringkasan paragraf, dan kosakata.
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
                if (f) handleUploadMateri(f);
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
              onClick={handleGenerate}
              disabled={loadingAi}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {loadingAi ? 'Menyusun Materi...' : 'Generate Materi & Peta Konsep'}
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
                -- Pilih Bab / Materi dari CP/TP --
              </option>
              {tpRows.map((t, idx) => (
                <option key={t.id} value={t.id}>
                  {t.no}. {t.bab} — {atpRows[idx]?.lingkupMateri || t.elemen}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Input Materi Inti / Bahan Sumber</label>
          <textarea
            rows={3}
            value={materiAjar.materiIntiInput}
            onChange={(e) => onChange({ ...materiAjar, materiIntiInput: e.target.value })}
            placeholder="Tuliskan pokok materi Bahasa Jawa yang ingin dijabarkan (misal: Paugeran Tembang Macapat Pangkur lan tuladhane)..."
            className="w-full text-sm border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#1B4353]"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="no-print p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* Printable Output */}
      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
        <DocumentHeader
          title="BAHAN / MATERI AJAR BAHASA JAWA"
          fields={[
            { label: 'Judul Materi', value: materiAjar.judulMateri },
            { label: 'Bab', value: materiAjar.bab },
            { label: 'Satuan Pendidikan', value: identitas.satuanPendidikan },
            { label: 'Kelas / Fase', value: `${identitas.kelas} / ${identitas.fase}` },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Judul Materi</label>
            <input
              type="text"
              value={materiAjar.judulMateri}
              onChange={(e) => onChange({ ...materiAjar, judulMateri: e.target.value })}
              className="w-full text-sm font-semibold border border-slate-200 rounded px-3 py-1.5"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Bab</label>
            <input
              type="text"
              value={materiAjar.bab}
              onChange={(e) => onChange({ ...materiAjar, bab: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded px-3 py-1.5"
            />
          </div>
        </div>

        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">A. Tujuan Pembelajaran</h3>
          <textarea
            rows={2}
            value={materiAjar.tujuanPembelajaran}
            onChange={(e) => onChange({ ...materiAjar, tujuanPembelajaran: e.target.value })}
            className="w-full text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
          />
        </section>

        {/* Visual Concept Map */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-3">B. Peta Konsep Materi</h3>
          <div className="border border-slate-200 rounded-lg bg-slate-50/70 p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-[#1B4353] text-white px-6 py-3 rounded-lg font-display font-bold text-base text-center shadow-sm">
                <input
                  type="text"
                  value={materiAjar.petaKonsep.pusat}
                  onChange={(e) =>
                    onChange({
                      ...materiAjar,
                      petaKonsep: { ...materiAjar.petaKonsep, pusat: e.target.value },
                    })
                  }
                  className="bg-transparent text-center text-white focus:outline-none w-full min-w-[200px]"
                />
              </div>
            </div>
            <div className="hidden md:block w-2/3 h-4 mx-auto border-t-2 border-x-2 border-slate-300 rounded-t-md -mt-4 mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {materiAjar.petaKonsep.cabang.map((cab, cIdx) => (
                <div key={cIdx} className="bg-white border border-slate-200 rounded-md p-4 space-y-2">
                  <input
                    type="text"
                    value={cab.judul}
                    onChange={(e) => {
                      const next = [...materiAjar.petaKonsep.cabang];
                      next[cIdx] = { ...cab, judul: e.target.value };
                      onChange({
                        ...materiAjar,
                        petaKonsep: { ...materiAjar.petaKonsep, cabang: next },
                      });
                    }}
                    className="w-full font-bold text-xs text-[#1B4353] border-b border-slate-200 pb-1.5 focus:outline-none"
                  />
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {cab.poin.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <textarea
                          rows={2}
                          value={pt}
                          onChange={(e) => {
                            const nextCab = [...materiAjar.petaKonsep.cabang];
                            const nextPoin = [...cab.poin];
                            nextPoin[pIdx] = e.target.value;
                            nextCab[cIdx] = { ...cab, poin: nextPoin };
                            onChange({
                              ...materiAjar,
                              petaKonsep: { ...materiAjar.petaKonsep, cabang: nextCab },
                            });
                          }}
                          className="w-full bg-transparent text-xs leading-snug focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-0.5 resize-y"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ringkasan Paragraf */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">C. Ringkasan Uraian Materi</h3>
            <button
              type="button"
              onClick={() =>
                onChange({ ...materiAjar, paragrafRingkasan: [...materiAjar.paragrafRingkasan, ''] })
              }
              className="no-print inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded"
            >
              <Plus className="w-3 h-3" /> Paragraf
            </button>
          </div>
          {materiAjar.paragrafRingkasan.map((prg, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                rows={3}
                value={prg}
                onChange={(e) => {
                  const next = [...materiAjar.paragrafRingkasan];
                  next[i] = e.target.value;
                  onChange({ ...materiAjar, paragrafRingkasan: next });
                }}
                className="w-full text-sm leading-relaxed text-slate-800 bg-slate-50/40 border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...materiAjar,
                    paragrafRingkasan: materiAjar.paragrafRingkasan.filter((_, idx) => idx !== i),
                  })
                }
                className="no-print p-1.5 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>

        {/* Kosakata */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-2">D. Kawruh Basa / Kosakata Penting</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#1B4353] text-white font-semibold">
                <tr>
                  <th className="py-2 px-3 border-r border-white/15">Ngoko</th>
                  <th className="py-2 px-3 border-r border-white/15">Krama (Lugu / Inggil)</th>
                  <th className="py-2 px-3">Arti Bahasa Indonesia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {materiAjar.kosakataPenting.map((k, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={k.ngoko}
                        onChange={(e) => {
                          const next = [...materiAjar.kosakataPenting];
                          next[idx] = { ...k, ngoko: e.target.value };
                          onChange({ ...materiAjar, kosakataPenting: next });
                        }}
                        className="w-full bg-transparent px-1 py-0.5 font-medium"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={k.krama}
                        onChange={(e) => {
                          const next = [...materiAjar.kosakataPenting];
                          next[idx] = { ...k, krama: e.target.value };
                          onChange({ ...materiAjar, kosakataPenting: next });
                        }}
                        className="w-full bg-transparent px-1 py-0.5"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={k.arti}
                        onChange={(e) => {
                          const next = [...materiAjar.kosakataPenting];
                          next[idx] = { ...k, arti: e.target.value };
                          onChange({ ...materiAjar, kosakataPenting: next });
                        }}
                        className="w-full bg-transparent px-1 py-0.5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Contoh Kontekstual */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-1.5">E. Contoh Teks / Penerapan Kontekstual</h3>
          <textarea
            rows={4}
            value={materiAjar.contohKontekstual}
            onChange={(e) => onChange({ ...materiAjar, contohKontekstual: e.target.value })}
            className="w-full text-sm leading-relaxed text-slate-800 bg-slate-50 border border-slate-200 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
          />
        </section>

        <SignatureBlock identitas={identitas} />
      </div>
    </div>
  );
}

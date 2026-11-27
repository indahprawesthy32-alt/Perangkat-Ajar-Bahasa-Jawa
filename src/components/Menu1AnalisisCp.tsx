import { useRef, useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2, Upload, RefreshCw } from 'lucide-react';
import type { AppState, CpElement, IdentitasSekolah, TpRow } from '../types';
import { generateWithAi } from '../utils/apiClient';
import { cascadeAllMenusFromCpTp, importCpTpFileAndCascade, normalizeFase, normalizeKelas } from '../utils/curriculumSync';
import { useIdentitas } from '../context/IdentitasContext';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  fullState: AppState;
  identitas: IdentitasSekolah;
  cpElements: CpElement[];
  tpRows: TpRow[];
  onChangeCp: (rows: CpElement[]) => void;
  onChangeTp: (rows: TpRow[]) => void;
  onUpdateFullState: (next: AppState) => void;
}

export function Menu1AnalisisCp({
  fullState,
  identitas,
  cpElements,
  tpRows,
  onChangeCp,
  onChangeTp,
  onUpdateFullState,
}: Props) {
  const ctx = useIdentitas();
  const [loadingAi, setLoadingAi] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const activeFase = normalizeFase(identitas.fase);
  const activeKelas = normalizeKelas(identitas.kelas);

  const handleAddCp = () => {
    onChangeCp([
      ...cpElements,
      { id: `cp_${Date.now()}`, elemen: 'Elemen Baru', capaianPembelajaran: '' },
    ]);
  };

  const handleAddTp = () => {
    const nextNo = tpRows.length + 1;
    onChangeTp([
      ...tpRows,
      {
        id: `tp_${Date.now()}`,
        no: nextNo,
        bab: `Bab ${nextNo}`,
        elemen: cpElements[0]?.elemen || 'Menyimak',
        cp: cpElements[0]?.capaianPembelajaran || '',
        tp: '',
        semester: 'Gasal',
      },
    ]);
  };

  const handleUploadCpTpFile = async (file: File) => {
    setLoadingAi(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const { nextState, summary } = await importCpTpFileAndCascade(file, fullState);
      onUpdateFullState(nextState);
      setStatusMsg(summary);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal meng-import file CP/TP.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSyncAllMenus = () => {
    const synced = cascadeAllMenusFromCpTp(fullState, cpElements, tpRows);
    onUpdateFullState(synced);
    setStatusMsg(`Berhasil menyinkronkan ${tpRows.length} TP ke seluruh sub-menu (Menu 2–11).`);
  };

  const handleGenerateTpFromCp = async () => {
    setLoadingAi(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const result = await generateWithAi<Array<Omit<TpRow, 'id'>>>('cp_to_tp', {
        identitas,
        cpElements,
      });
      if (Array.isArray(result) && result.length > 0) {
        const nextTp: TpRow[] = result.map((r, i) => ({
          id: `tp_ai_${Date.now()}_${i}`,
          no: r.no || i + 1,
          bab: r.bab || `Bab ${i + 1}`,
          elemen: r.elemen || '',
          cp: r.cp || '',
          tp: r.tp || '',
          semester: r.semester === 'Genap' ? 'Genap' : 'Gasal',
        }));
        const synced = cascadeAllMenusFromCpTp(fullState, cpElements, nextTp);
        onUpdateFullState(synced);
        setStatusMsg(`Berhasil menurunkan ${nextTp.length} TP dan langsung menghubungkannya ke semua sub-menu.`);
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal menurunkan CP menjadi TP.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Analisis CP &amp; Penurunan Tujuan Pembelajaran</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Upload file CP/TP Bahasa Jawa 2025 (.docx, .pdf, .xlsx, .txt) agar otomatis terhubung &amp; menyesuaikan seluruh sub-menu (ATP, Alokasi Waktu, KKTP, Prota/Promes, Jurnal, Modul Ajar, Materi, LKPD, Soal, Penilaian).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".json,.xlsx,.xls,.csv,.docx,.txt,.md,.pdf,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUploadCpTpFile(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loadingAi}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1B4353] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File CP/TP (Auto-Sinkron)
          </button>
          <button
            type="button"
            onClick={handleSyncAllMenus}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sinkronkan Semua Menu
          </button>
          <button
            type="button"
            onClick={handleAddCp}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Elemen CP
          </button>
          <button
            type="button"
            onClick={handleAddTp}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Baris TP
          </button>
          <button
            type="button"
            onClick={handleGenerateTpFromCp}
            disabled={loadingAi}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {loadingAi ? 'Memproses CP/TP...' : 'Turunkan CP ke TP (AI)'}
          </button>
        </div>

        {ctx && (
          <div className="w-full pt-3 mt-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-slate-600">Tahun Ajaran (Ketik Manual)</span>
              <input
                type="text"
                value={identitas.tahunPelajaran}
                onChange={(e) => ctx.updateIdentitas({ tahunPelajaran: e.target.value })}
                placeholder="Contoh: 2026/2027"
                className="w-full font-mono font-medium border border-slate-300 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-slate-600">Pilih Fase (A / B / C)</span>
              <select
                value={activeFase}
                onChange={(e) => ctx.updateIdentitas({ fase: e.target.value })}
                className="w-full font-medium border border-slate-300 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
              >
                <option value="A">Fase A (Kelas 1–2)</option>
                <option value="B">Fase B (Kelas 3–4)</option>
                <option value="C">Fase C (Kelas 5–6)</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-slate-600">Pilih Kelas (1–6)</span>
              <select
                value={activeKelas}
                onChange={(e) => ctx.updateIdentitas({ kelas: e.target.value })}
                className="w-full font-medium border border-slate-300 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
              >
                <option value="1">Kelas 1 (Fase A)</option>
                <option value="2">Kelas 2 (Fase A)</option>
                <option value="3">Kelas 3 (Fase B)</option>
                <option value="4">Kelas 4 (Fase B)</option>
                <option value="5">Kelas 5 (Fase C)</option>
                <option value="6">Kelas 6 (Fase C)</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {statusMsg && (
        <div className="no-print p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
          {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="no-print p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
        <DocumentHeader
          title="ANALISIS CAPAIAN PEMBELAJARAN"
          subtitle={`Mata Pelajaran ${identitas.mataPelajaran} · Fase ${identitas.fase}`}
          fields={[
            { label: 'Satuan Pendidikan', value: identitas.satuanPendidikan },
            { label: 'Kelas / Semester', value: `${identitas.kelas} / ${identitas.semester}` },
            { label: 'Tahun Pelajaran', value: identitas.tahunPelajaran },
            { label: 'Mata Pelajaran', value: identitas.mataPelajaran },
          ]}
        />

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            A. Elemen dan Capaian Pembelajaran (CP)
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 text-xs font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-56 border-r border-slate-200">Elemen</th>
                  <th className="py-2.5 px-3">Capaian Pembelajaran</th>
                  <th className="py-2.5 px-2 w-10 no-print text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cpElements.map((item, idx) => (
                  <tr key={item.id} className="align-top hover:bg-slate-50/70">
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={item.elemen}
                        onChange={(e) => {
                          const prevEl = item.elemen.trim().toLowerCase();
                          const newEl = e.target.value;
                          const nextCp = [...cpElements];
                          nextCp[idx] = { ...item, elemen: newEl };
                          const nextTp = tpRows.map((row) =>
                            row.elemen.trim().toLowerCase() === prevEl ? { ...row, elemen: newEl } : row,
                          );
                          onUpdateFullState(
                            cascadeAllMenusFromCpTp(fullState, nextCp, nextTp, undefined, undefined, undefined, true),
                          );
                        }}
                        className="w-full bg-transparent text-slate-900 font-medium text-sm focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded px-1.5 py-1"
                      />
                    </td>
                    <td className="p-2">
                      <textarea
                        rows={2}
                        value={item.capaianPembelajaran}
                        onChange={(e) => {
                          const elKey = item.elemen.trim().toLowerCase();
                          const newCpText = e.target.value;
                          const nextCp = [...cpElements];
                          nextCp[idx] = { ...item, capaianPembelajaran: newCpText };
                          const nextTp = tpRows.map((row) =>
                            row.elemen.trim().toLowerCase() === elKey ? { ...row, cp: newCpText } : row,
                          );
                          onUpdateFullState(
                            cascadeAllMenusFromCpTp(fullState, nextCp, nextTp, undefined, undefined, undefined, true),
                          );
                        }}
                        className="w-full bg-transparent text-slate-700 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded px-1.5 py-1 resize-y"
                      />
                    </td>
                    <td className="p-2 no-print text-center">
                      <button
                        type="button"
                        onClick={() => onChangeCp(cpElements.filter((x) => x.id !== item.id))}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                        title="Hapus elemen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            B. Penurunan CP menjadi Tujuan Pembelajaran (TP)
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-[#1B4353] text-white text-xs font-semibold">
                <tr>
                  <th className="py-2.5 px-2.5 w-12 text-center border-r border-white/15">No</th>
                  <th className="py-2.5 px-3 w-40 border-r border-white/15">Bab</th>
                  <th className="py-2.5 px-3 w-40 border-r border-white/15">Elemen</th>
                  <th className="py-2.5 px-3 border-r border-white/15">CP</th>
                  <th className="py-2.5 px-3 border-r border-white/15">TP</th>
                  <th className="py-2.5 px-3 w-28 border-r border-white/15">Semester</th>
                  <th className="py-2.5 px-2 w-10 no-print text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tpRows.map((row, idx) => (
                  <tr key={row.id} className="align-top hover:bg-slate-50/70">
                    <td className="p-2 text-center font-mono text-xs text-slate-600 border-r border-slate-200">
                      <input
                        type="number"
                        value={row.no}
                        onChange={(e) => {
                          const next = [...tpRows];
                          next[idx] = { ...row, no: Number(e.target.value) || idx + 1 };
                          onChangeTp(next);
                        }}
                        className="w-10 text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded py-1"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <textarea
                        rows={2}
                        value={row.bab}
                        onChange={(e) => {
                          const next = [...tpRows];
                          next[idx] = { ...row, bab: e.target.value };
                          onChangeTp(next);
                        }}
                        className="w-full bg-transparent text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.elemen}
                        onChange={(e) => {
                          const next = [...tpRows];
                          next[idx] = { ...row, elemen: e.target.value };
                          onChangeTp(next);
                        }}
                        className="w-full bg-transparent text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <textarea
                        rows={3}
                        value={row.cp}
                        onChange={(e) => {
                          const next = [...tpRows];
                          next[idx] = { ...row, cp: e.target.value };
                          onChangeTp(next);
                        }}
                        className="w-full bg-transparent text-xs text-slate-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <textarea
                        rows={3}
                        value={row.tp}
                        onChange={(e) => {
                          const next = [...tpRows];
                          next[idx] = { ...row, tp: e.target.value };
                          onChangeTp(next);
                        }}
                        className="w-full bg-transparent text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <select
                        value={row.semester}
                        onChange={(e) => {
                          const next = [...tpRows];
                          next[idx] = { ...row, semester: e.target.value as 'Gasal' | 'Genap' };
                          onChangeTp(next);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B4353]"
                      >
                        <option value="Gasal">Gasal</option>
                        <option value="Genap">Genap</option>
                      </select>
                    </td>
                    <td className="p-2 no-print text-center">
                      <button
                        type="button"
                        onClick={() => onChangeTp(tpRows.filter((x) => x.id !== row.id))}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                        title="Hapus baris TP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <SignatureBlock identitas={identitas} />
      </div>
    </div>
  );
}

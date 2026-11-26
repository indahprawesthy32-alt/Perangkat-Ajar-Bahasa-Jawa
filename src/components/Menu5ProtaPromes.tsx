import { useState } from 'react';
import { Check, Plus, RefreshCw, Trash2 } from 'lucide-react';
import type { AtpRow, IdentitasSekolah, MonthKey, PromesRow, ProtaRow } from '../types';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  identitas: IdentitasSekolah;
  atpRows: AtpRow[];
  protaRows: ProtaRow[];
  promesRows: PromesRow[];
  onChangeProta: (rows: ProtaRow[]) => void;
  onChangePromes: (rows: PromesRow[]) => void;
}

const MONTHS: Array<{ key: MonthKey; label: string }> = [
  { key: 'jul', label: 'Jul' },
  { key: 'ags', label: 'Ags' },
  { key: 'sep', label: 'Sep' },
  { key: 'okt', label: 'Okt' },
  { key: 'nov', label: 'Nov' },
  { key: 'des', label: 'Des' },
  { key: 'jan', label: 'Jan' },
  { key: 'feb', label: 'Feb' },
  { key: 'mar', label: 'Mar' },
  { key: 'apr', label: 'Apr' },
  { key: 'mei', label: 'Mei' },
  { key: 'jun', label: 'Jun' },
];

function emptyBulan(sem: 'Gasal' | 'Genap', idx: number): Record<MonthKey, boolean> {
  const base: Record<MonthKey, boolean> = {
    jul: false, ags: false, sep: false, okt: false, nov: false, des: false,
    jan: false, feb: false, mar: false, apr: false, mei: false, jun: false,
  };
  if (sem === 'Gasal') {
    if (idx % 3 === 0) base.jul = base.ags = true;
    else if (idx % 3 === 1) base.sep = base.okt = true;
    else base.nov = true;
  } else {
    if (idx % 3 === 0) base.jan = base.feb = true;
    else if (idx % 3 === 1) base.mar = base.apr = true;
    else base.mei = true;
  }
  return base;
}

export function Menu5ProtaPromes({
  identitas,
  atpRows,
  protaRows,
  promesRows,
  onChangeProta,
  onChangePromes,
}: Props) {
  const [activeTab, setActiveTab] = useState<'prota' | 'promes'>('prota');
  const [filterSemester, setFilterSemester] = useState<'Semua' | 'Gasal' | 'Genap'>('Semua');

  const handleSyncFromAtp = () => {
    onChangeProta(
      atpRows.map((a, idx) => ({
        id: `prota_sync_${a.id}`,
        no: idx + 1,
        atp: a.tujuanPembelajaran,
        materiPokok: a.lingkupMateri,
        semester: a.semester,
        alokasiJp: a.waktuJp,
      })),
    );
    onChangePromes(
      atpRows.map((a, idx) => ({
        id: `promes_sync_${a.id}`,
        no: idx + 1,
        tp: a.tujuanPembelajaran,
        materiPokok: a.lingkupMateri,
        semester: a.semester,
        alokasiJp: a.waktuJp,
        bulan: emptyBulan(a.semester, idx),
      })),
    );
  };

  const totalProtaJp = protaRows.reduce((s, r) => s + (Number(r.alokasiJp) || 0), 0);
  const filteredPromes = promesRows.filter(
    (r) => filterSemester === 'Semua' || r.semester === filterSemester,
  );

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('prota')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'prota' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Program Tahunan (Prota)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('promes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'promes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Program Semester (Promes)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncFromAtp}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sinkron dari ATP
          </button>
          {activeTab === 'prota' ? (
            <button
              type="button"
              onClick={() =>
                onChangeProta([
                  ...protaRows,
                  {
                    id: `prota_${Date.now()}`,
                    no: protaRows.length + 1,
                    atp: '',
                    materiPokok: '',
                    semester: 'Gasal',
                    alokasiJp: 6,
                  },
                ])
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Baris Prota
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                onChangePromes([
                  ...promesRows,
                  {
                    id: `promes_${Date.now()}`,
                    no: promesRows.length + 1,
                    tp: '',
                    materiPokok: '',
                    semester: 'Gasal',
                    alokasiJp: 6,
                    bulan: emptyBulan('Gasal', promesRows.length),
                  },
                ])
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Baris Promes
            </button>
          )}
        </div>
      </div>

      {activeTab === 'prota' ? (
        <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
          <DocumentHeader
            title="PROGRAM TAHUNAN"
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
                  <th className="py-2.5 px-2.5 w-12 text-center border-r border-white/15">No</th>
                  <th className="py-2.5 px-3 border-r border-white/15">Alur Tujuan Pembelajaran (ATP)</th>
                  <th className="py-2.5 px-3 w-52 border-r border-white/15">Materi Pokok</th>
                  <th className="py-2.5 px-3 w-28 border-r border-white/15">Semester</th>
                  <th className="py-2.5 px-3 w-28 text-center border-r border-white/15">Alokasi Waktu (JP)</th>
                  <th className="py-2.5 px-2 w-10 no-print text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {protaRows.map((row, idx) => (
                  <tr key={row.id} className="align-top hover:bg-slate-50">
                    <td className="p-2 text-center font-mono border-r border-slate-200">{row.no}</td>
                    <td className="p-2 border-r border-slate-200">
                      <textarea
                        rows={2}
                        value={row.atp}
                        onChange={(e) => {
                          const next = [...protaRows];
                          next[idx] = { ...row, atp: e.target.value };
                          onChangeProta(next);
                        }}
                        className="w-full bg-transparent text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1 resize-y"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.materiPokok}
                        onChange={(e) => {
                          const next = [...protaRows];
                          next[idx] = { ...row, materiPokok: e.target.value };
                          onChangeProta(next);
                        }}
                        className="w-full bg-transparent text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-1"
                      />
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <select
                        value={row.semester}
                        onChange={(e) => {
                          const next = [...protaRows];
                          next[idx] = { ...row, semester: e.target.value as 'Gasal' | 'Genap' };
                          onChangeProta(next);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1"
                      >
                        <option value="Gasal">Gasal</option>
                        <option value="Genap">Genap</option>
                      </select>
                    </td>
                    <td className="p-2 text-center border-r border-slate-200">
                      <input
                        type="number"
                        min={1}
                        value={row.alokasiJp}
                        onChange={(e) => {
                          const next = [...protaRows];
                          next[idx] = { ...row, alokasiJp: Number(e.target.value) || 0 };
                          onChangeProta(next);
                        }}
                        className="w-16 text-center font-mono font-semibold bg-slate-50 border border-slate-200 rounded py-1"
                      />
                    </td>
                    <td className="p-2 no-print text-center">
                      <button
                        type="button"
                        onClick={() => onChangeProta(protaRows.filter((x) => x.id !== row.id))}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 text-right border-r border-slate-200">
                    Jumlah Alokasi Waktu Tahunan
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono border-r border-slate-200">{totalProtaJp} JP</td>
                  <td className="no-print" />
                </tr>
              </tfoot>
            </table>
          </div>

          <SignatureBlock identitas={identitas} />
        </div>
      ) : (
        <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
          <div className="no-print flex items-center justify-end gap-2 mb-4">
            <span className="text-xs text-slate-500">Filter Semester:</span>
            {(['Semua', 'Gasal', 'Genap'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterSemester(s)}
                className={`px-2.5 py-1 text-xs rounded border ${
                  filterSemester === s
                    ? 'bg-[#1B4353] text-white border-[#1B4353]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <DocumentHeader
            title="PROGRAM SEMESTER"
            fields={[
              { label: 'Satuan Pendidikan', value: identitas.satuanPendidikan },
              { label: 'Mata Pelajaran', value: identitas.mataPelajaran },
              { label: 'Fase / Kelas', value: `${identitas.fase} / ${identitas.kelas}` },
              { label: 'Tahun Pelajaran', value: identitas.tahunPelajaran },
              { label: 'Semester', value: filterSemester === 'Semua' ? 'Gasal & Genap' : filterSemester },
            ]}
          />

          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead className="bg-[#1B4353] text-white font-semibold">
                <tr>
                  <th className="py-2 px-2 w-8 text-center border-r border-white/15">No</th>
                  <th className="py-2 px-2.5 min-w-[180px] border-r border-white/15">TP</th>
                  <th className="py-2 px-2.5 min-w-[130px] border-r border-white/15">Materi Pokok</th>
                  <th className="py-2 px-2 w-16 text-center border-r border-white/15">Sem</th>
                  <th className="py-2 px-2 w-14 text-center border-r border-white/15">JP</th>
                  {MONTHS.map((m) => (
                    <th key={m.key} className="py-2 px-1.5 w-8 text-center border-r border-white/15">
                      {m.label}
                    </th>
                  ))}
                  <th className="py-2 px-1.5 w-8 no-print text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPromes.map((row) => {
                  const realIdx = promesRows.findIndex((r) => r.id === row.id);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="p-1.5 text-center font-mono border-r border-slate-200">{row.no}</td>
                      <td className="p-1.5 border-r border-slate-200">
                        <textarea
                          rows={2}
                          value={row.tp}
                          onChange={(e) => {
                            const next = [...promesRows];
                            next[realIdx] = { ...row, tp: e.target.value };
                            onChangePromes(next);
                          }}
                          className="w-full bg-transparent text-[11px] focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-0.5 resize-y"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-200">
                        <input
                          type="text"
                          value={row.materiPokok}
                          onChange={(e) => {
                            const next = [...promesRows];
                            next[realIdx] = { ...row, materiPokok: e.target.value };
                            onChangePromes(next);
                          }}
                          className="w-full bg-transparent text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded p-0.5"
                        />
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-200">
                        <select
                          value={row.semester}
                          onChange={(e) => {
                            const next = [...promesRows];
                            next[realIdx] = { ...row, semester: e.target.value as 'Gasal' | 'Genap' };
                            onChangePromes(next);
                          }}
                          className="bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-[11px]"
                        >
                          <option value="Gasal">Gasal</option>
                          <option value="Genap">Genap</option>
                        </select>
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-200">
                        <input
                          type="number"
                          min={1}
                          value={row.alokasiJp}
                          onChange={(e) => {
                            const next = [...promesRows];
                            next[realIdx] = { ...row, alokasiJp: Number(e.target.value) || 0 };
                            onChangePromes(next);
                          }}
                          className="w-11 text-center font-mono bg-slate-50 border border-slate-200 rounded py-0.5"
                        />
                      </td>
                      {MONTHS.map((m) => {
                        const checked = row.bulan[m.key];
                        return (
                          <td key={m.key} className="p-1 text-center border-r border-slate-200">
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...promesRows];
                                next[realIdx] = {
                                  ...row,
                                  bulan: { ...row.bulan, [m.key]: !checked },
                                };
                                onChangePromes(next);
                              }}
                              className={`w-6 h-6 inline-flex items-center justify-center rounded border transition-colors ${
                                checked
                                  ? 'bg-[#1B4353] border-[#1B4353] text-white'
                                  : 'bg-white border-slate-200 text-transparent hover:border-slate-400'
                              }`}
                              aria-label={`Checklist ${m.label}`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        );
                      })}
                      <td className="p-1 no-print text-center">
                        <button
                          type="button"
                          onClick={() => onChangePromes(promesRows.filter((x) => x.id !== row.id))}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <SignatureBlock identitas={identitas} />
        </div>
      )}
    </div>
  );
}

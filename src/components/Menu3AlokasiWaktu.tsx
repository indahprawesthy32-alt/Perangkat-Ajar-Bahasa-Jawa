import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import type { AlokasiWaktuState, AtpRow, BulanAlokasi, IdentitasSekolah } from '../types';
import { DocumentHeader, SignatureBlock } from './DocumentHeader';

interface Props {
  identitas: IdentitasSekolah;
  alokasiWaktu: AlokasiWaktuState;
  atpRows: AtpRow[];
  onChange: (next: AlokasiWaktuState) => void;
}

export function Menu3AlokasiWaktu({ identitas, alokasiWaktu, atpRows, onChange }: Props) {
  const sumMonths = (rows: BulanAlokasi[]) =>
    rows.reduce(
      (acc, r) => ({
        minggu: acc.minggu + (Number(r.jumlahMinggu) || 0),
        hari: acc.hari + (Number(r.jumlahHariEfektif) || 0),
        efektif: acc.efektif + (Number(r.jumlahMingguEfektif) || 0),
      }),
      { minggu: 0, hari: 0, efektif: 0 },
    );

  const gasalSum = sumMonths(alokasiWaktu.bulanGasal);
  const genapSum = sumMonths(alokasiWaktu.bulanGenap);

  const gasalTotalJp = gasalSum.efektif * (Number(alokasiWaktu.calcGasal.jpPerMinggu) || 0);
  const gasalJamEfektif =
    gasalTotalJp -
    (Number(alokasiWaktu.calcGasal.jamFormatif) || 0) -
    (Number(alokasiWaktu.calcGasal.jamSumatif) || 0) -
    (Number(alokasiWaktu.calcGasal.cadangan) || 0);

  const genapTotalJp = genapSum.efektif * (Number(alokasiWaktu.calcGenap.jpPerMinggu) || 0);
  const genapJamEfektif =
    genapTotalJp -
    (Number(alokasiWaktu.calcGenap.jamFormatif) || 0) -
    (Number(alokasiWaktu.calcGenap.jamSumatif) || 0) -
    (Number(alokasiWaktu.calcGenap.cadangan) || 0);

  const totalDistribusiMateri = alokasiWaktu.distribusi.reduce((s, d) => s + (Number(d.alokasiJp) || 0), 0);
  const grandTotalDistribusi =
    totalDistribusiMateri +
    (Number(alokasiWaktu.sumatifTotal) || 0) +
    (Number(alokasiWaktu.formatifTotal) || 0) +
    (Number(alokasiWaktu.cadanganTotal) || 0);

  const updateBulan = (
    semester: 'Gasal' | 'Genap',
    idx: number,
    field: keyof BulanAlokasi,
    val: string | number,
  ) => {
    const list = semester === 'Gasal' ? [...alokasiWaktu.bulanGasal] : [...alokasiWaktu.bulanGenap];
    list[idx] = { ...list[idx], [field]: val };
    onChange({
      ...alokasiWaktu,
      ...(semester === 'Gasal' ? { bulanGasal: list } : { bulanGenap: list }),
    });
  };

  const handleLoadFromAtp = () => {
    const mapped = atpRows.map((a, idx) => ({
      id: `dist_atp_${idx}_${Date.now()}`,
      semester: a.semester,
      materiPokok: a.lingkupMateri || a.tujuanPembelajaran,
      alokasiJp: Number(a.waktuJp) || 6,
    }));
    onChange({
      ...alokasiWaktu,
      distribusi: mapped,
      formatifTotal: alokasiWaktu.calcGasal.jamFormatif + alokasiWaktu.calcGenap.jamFormatif,
      sumatifTotal: alokasiWaktu.calcGasal.jamSumatif + alokasiWaktu.calcGenap.jamSumatif,
      cadanganTotal: alokasiWaktu.calcGasal.cadangan + alokasiWaktu.calcGenap.cadangan,
    });
  };

  const handleAddDistribusi = () => {
    onChange({
      ...alokasiWaktu,
      distribusi: [
        ...alokasiWaktu.distribusi,
        { id: `dist_${Date.now()}`, semester: 'Gasal', materiPokok: '', alokasiJp: 4 },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Analisis Alokasi Waktu (Rumus Otomatis)</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Jumlah minggu, hari belajar efektif, minggu efektif (Bahasa Jawa x2 JP/minggu), dan distribusi materi pokok dari ATP dihitung otomatis.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5">
            <span>Durasi 1 JP:</span>
            <input
              type="number"
              value={alokasiWaktu.menitPerJp}
              onChange={(e) => onChange({ ...alokasiWaktu, menitPerJp: Number(e.target.value) || 35 })}
              className="w-12 text-center font-mono font-semibold bg-white border border-slate-200 rounded px-1 py-0.5"
            />
            <span>menit</span>
          </label>
          <button
            type="button"
            onClick={handleLoadFromAtp}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Muat Materi Pokok dari ATP
          </button>
        </div>
      </div>

      <div className="print-container bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-8">
        <DocumentHeader
          title="ALOKASI WAKTU"
          fields={[
            { label: 'Sekolah', value: identitas.satuanPendidikan },
            { label: 'Tahun Pelajaran', value: identitas.tahunPelajaran },
            { label: 'Kelas', value: identitas.kelas },
            { label: 'Mata Pelajaran', value: identitas.mataPelajaran },
          ]}
        />

        {/* Semester 1 */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            1. Perhitungan Alokasi Waktu Banyaknya Minggu dalam Satu Semester 1 (Gasal)
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#1B4353] text-white font-semibold">
                <tr>
                  <th className="py-2 px-2.5 w-10 text-center border-r border-white/15">No</th>
                  <th className="py-2 px-3 border-r border-white/15">Nama Bulan</th>
                  <th className="py-2 px-3 text-center border-r border-white/15">Jumlah Minggu</th>
                  <th className="py-2 px-3 text-center border-r border-white/15">Jumlah Hari Belajar Efektif</th>
                  <th className="py-2 px-3 text-center border-r border-white/15">Jumlah Minggu Efektif</th>
                  <th className="py-2 px-3">Ket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {alokasiWaktu.bulanGasal.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center font-mono border-r border-slate-200">{b.no}</td>
                    <td className="p-2 font-medium border-r border-slate-200">{b.namaBulan}</td>
                    <td className="p-1.5 text-center border-r border-slate-200">
                      <input
                        type="number"
                        min={0}
                        value={b.jumlahMinggu}
                        onChange={(e) => updateBulan('Gasal', idx, 'jumlahMinggu', Number(e.target.value) || 0)}
                        className="w-16 text-center font-mono bg-slate-50 border border-slate-200 rounded py-1"
                      />
                    </td>
                    <td className="p-1.5 text-center border-r border-slate-200">
                      <input
                        type="number"
                        min={0}
                        value={b.jumlahHariEfektif}
                        onChange={(e) => updateBulan('Gasal', idx, 'jumlahHariEfektif', Number(e.target.value) || 0)}
                        className="w-16 text-center font-mono bg-slate-50 border border-slate-200 rounded py-1"
                      />
                    </td>
                    <td className="p-1.5 text-center border-r border-slate-200">
                      <input
                        type="number"
                        min={0}
                        value={b.jumlahMingguEfektif}
                        onChange={(e) => updateBulan('Gasal', idx, 'jumlahMingguEfektif', Number(e.target.value) || 0)}
                        className="w-16 text-center font-mono font-semibold bg-slate-50 border border-slate-200 rounded py-1"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="text"
                        value={b.ket}
                        onChange={(e) => updateBulan('Gasal', idx, 'ket', e.target.value)}
                        placeholder="-"
                        className="w-full bg-transparent px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                <tr>
                  <td colSpan={2} className="py-2 px-3 text-right border-r border-slate-200">Jumlah</td>
                  <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{gasalSum.minggu}</td>
                  <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{gasalSum.hari}</td>
                  <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{gasalSum.efektif}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-md p-4 text-xs space-y-2">
            <p className="font-bold text-slate-900">Semester Gasal (Rumus Otomatis)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span>a. Jumlah Minggu Efektif ({gasalSum.efektif} x {alokasiWaktu.calcGasal.jpPerMinggu} JP)</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span>x</span>
                  <input
                    type="number"
                    min={1}
                    value={alokasiWaktu.calcGasal.jpPerMinggu}
                    onChange={(e) =>
                      onChange({
                        ...alokasiWaktu,
                        calcGasal: { ...alokasiWaktu.calcGasal, jpPerMinggu: Number(e.target.value) || 2 },
                      })
                    }
                    className="w-12 text-center bg-white border border-slate-300 rounded py-0.5"
                  />
                  <span>=</span>
                  <span className="font-bold text-slate-900 w-10 text-right">{gasalTotalJp}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>b. Jumlah jam efektif KBM / minggu</span>
                <input
                  type="number"
                  min={1}
                  value={alokasiWaktu.calcGasal.jamEfektifKbmPerMinggu}
                  onChange={(e) =>
                    onChange({
                      ...alokasiWaktu,
                      calcGasal: { ...alokasiWaktu.calcGasal, jamEfektifKbmPerMinggu: Number(e.target.value) || 2 },
                    })
                  }
                  className="w-16 text-center font-mono bg-white border border-slate-300 rounded py-0.5"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>c. Jumlah Jam untuk asesmen formatif</span>
                <input
                  type="number"
                  min={0}
                  value={alokasiWaktu.calcGasal.jamFormatif}
                  onChange={(e) =>
                    onChange({
                      ...alokasiWaktu,
                      calcGasal: { ...alokasiWaktu.calcGasal, jamFormatif: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-16 text-center font-mono bg-white border border-slate-300 rounded py-0.5"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>d. Jumlah Jam untuk asesmen sumatif</span>
                <input
                  type="number"
                  min={0}
                  value={alokasiWaktu.calcGasal.jamSumatif}
                  onChange={(e) =>
                    onChange({
                      ...alokasiWaktu,
                      calcGasal: { ...alokasiWaktu.calcGasal, jamSumatif: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-16 text-center font-mono bg-white border border-slate-300 rounded py-0.5"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>e. Cadangan</span>
                <input
                  type="number"
                  min={0}
                  value={alokasiWaktu.calcGasal.cadangan}
                  onChange={(e) =>
                    onChange({
                      ...alokasiWaktu,
                      calcGasal: { ...alokasiWaktu.calcGasal, cadangan: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-16 text-center font-mono bg-white border border-slate-300 rounded py-0.5"
                />
              </div>
              <div className="flex items-center justify-between gap-2 font-bold text-[#1B4353]">
                <span>f. Jumlah Jam efektif (a - c - d - e)</span>
                <span className="font-mono text-sm">{gasalJamEfektif} JP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Semester 2 */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            2. Perhitungan Alokasi Waktu Banyaknya Minggu dalam Satu Semester 2 (Genap)
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#1B4353] text-white font-semibold">
                <tr>
                  <th className="py-2 px-2.5 w-10 text-center border-r border-white/15">No</th>
                  <th className="py-2 px-3 border-r border-white/15">Nama Bulan</th>
                  <th className="py-2 px-3 text-center border-r border-white/15">Jumlah Minggu</th>
                  <th className="py-2 px-3 text-center border-r border-white/15">Jumlah Hari Belajar Efektif</th>
                  <th className="py-2 px-3 text-center border-r border-white/15">Jumlah Minggu Efektif</th>
                  <th className="py-2 px-3">Ket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {alokasiWaktu.bulanGenap.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center font-mono border-r border-slate-200">{b.no}</td>
                    <td className="p-2 font-medium border-r border-slate-200">{b.namaBulan}</td>
                    <td className="p-1.5 text-center border-r border-slate-200">
                      <input
                        type="number"
                        min={0}
                        value={b.jumlahMinggu}
                        onChange={(e) => updateBulan('Genap', idx, 'jumlahMinggu', Number(e.target.value) || 0)}
                        className="w-16 text-center font-mono bg-slate-50 border border-slate-200 rounded py-1"
                      />
                    </td>
                    <td className="p-1.5 text-center border-r border-slate-200">
                      <input
                        type="number"
                        min={0}
                        value={b.jumlahHariEfektif}
                        onChange={(e) => updateBulan('Genap', idx, 'jumlahHariEfektif', Number(e.target.value) || 0)}
                        className="w-16 text-center font-mono bg-slate-50 border border-slate-200 rounded py-1"
                      />
                    </td>
                    <td className="p-1.5 text-center border-r border-slate-200">
                      <input
                        type="number"
                        min={0}
                        value={b.jumlahMingguEfektif}
                        onChange={(e) => updateBulan('Genap', idx, 'jumlahMingguEfektif', Number(e.target.value) || 0)}
                        className="w-16 text-center font-mono font-semibold bg-slate-50 border border-slate-200 rounded py-1"
                      />
                    </td>
                    <td className="p-1.5">
                      <input
                        type="text"
                        value={b.ket}
                        onChange={(e) => updateBulan('Genap', idx, 'ket', e.target.value)}
                        placeholder="-"
                        className="w-full bg-transparent px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                <tr>
                  <td colSpan={2} className="py-2 px-3 text-right border-r border-slate-200">Jumlah</td>
                  <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{genapSum.minggu}</td>
                  <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{genapSum.hari}</td>
                  <td className="py-2 px-3 text-center font-mono border-r border-slate-200">{genapSum.efektif}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-md p-4 text-xs space-y-2">
            <p className="font-bold text-slate-900">Semester Genap (Rumus Otomatis)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span>a. Jumlah Minggu Efektif ({genapSum.efektif} x {alokasiWaktu.calcGenap.jpPerMinggu} JP)</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span>x</span>
                  <input
                    type="number"
                    min={1}
                    value={alokasiWaktu.calcGenap.jpPerMinggu}
                    onChange={(e) =>
                      onChange({
                        ...alokasiWaktu,
                        calcGenap: { ...alokasiWaktu.calcGenap, jpPerMinggu: Number(e.target.value) || 2 },
                      })
                    }
                    className="w-12 text-center bg-white border border-slate-300 rounded py-0.5"
                  />
                  <span>=</span>
                  <span className="font-bold text-slate-900 w-10 text-right">{genapTotalJp}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>b. Jumlah jam efektif KBM / minggu</span>
                <input
                  type="number"
                  min={1}
                  value={alokasiWaktu.calcGenap.jamEfektifKbmPerMinggu}
                  onChange={(e) =>
                    onChange({
                      ...alokasiWaktu,
                      calcGenap: { ...alokasiWaktu.calcGenap, jamEfektifKbmPerMinggu: Number(e.target.value) || 2 },
                    })
                  }
                  className="w-16 text-center font-mono bg-white border border-slate-300 rounded py-0.5"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>c. Jumlah Jam untuk asesmen formatif</span>
                <input
                  type="number"
                  min={0}
                  value={alokasiWaktu.calcGenap.jamFormatif}
                  onChange={(e) =>
                    onChange({
                      ...alokasiWaktu,
                      calcGenap: { ...alokasiWaktu.calcGenap, jamFormatif: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-16 text-center font-mono bg-white border border-slate-300 rounded py-0.5"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>d. Jumlah Jam untuk asesmen sumatif</span>
                <input
                  type="number"
                  min={0}
                  value={alokasiWaktu.calcGenap.jamSumatif}
                  onChange={(e) =>
                    onChange({
                      ...alokasiWaktu,
                      calcGenap: { ...alokasiWaktu.calcGenap, jamSumatif: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-16 text-center font-mono bg-white border border-slate-300 rounded py-0.5"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>e. Cadangan</span>
                <input
                  type="number"
                  min={0}
                  value={alokasiWaktu.calcGenap.cadangan}
                  onChange={(e) =>
                    onChange({
                      ...alokasiWaktu,
                      calcGenap: { ...alokasiWaktu.calcGenap, cadangan: Number(e.target.value) || 0 },
                    })
                  }
                  className="w-16 text-center font-mono bg-white border border-slate-300 rounded py-0.5"
                />
              </div>
              <div className="flex items-center justify-between gap-2 font-bold text-[#1B4353]">
                <span>f. Jumlah Jam efektif (a - c - d - e)</span>
                <span className="font-mono text-sm">{genapJamEfektif} JP</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Distribusi Alokasi Waktu */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">
              3. Distribusi Alokasi Waktu (Berdasarkan Materi Pokok ATP)
            </h3>
            <button
              type="button"
              onClick={handleAddDistribusi}
              className="no-print inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Materi
            </button>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#1B4353] text-white font-semibold">
                <tr>
                  <th className="py-2 px-3 w-32 border-r border-white/15">Semester</th>
                  <th className="py-2 px-3 border-r border-white/15">Materi Pokok</th>
                  <th className="py-2 px-3 w-36 text-center border-r border-white/15">
                    Alokasi Waktu @{alokasiWaktu.menitPerJp}'
                  </th>
                  <th className="py-2 px-2 w-10 no-print text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {alokasiWaktu.distribusi.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-2 border-r border-slate-200">
                      <select
                        value={d.semester}
                        onChange={(e) => {
                          const next = [...alokasiWaktu.distribusi];
                          next[idx] = { ...d, semester: e.target.value as 'Gasal' | 'Genap' };
                          onChange({ ...alokasiWaktu, distribusi: next });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1"
                      >
                        <option value="Gasal">Gasal</option>
                        <option value="Genap">Genap</option>
                      </select>
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={d.materiPokok}
                        onChange={(e) => {
                          const next = [...alokasiWaktu.distribusi];
                          next[idx] = { ...d, materiPokok: e.target.value };
                          onChange({ ...alokasiWaktu, distribusi: next });
                        }}
                        className="w-full bg-transparent px-1 py-1 focus:outline-none focus:ring-1 focus:ring-[#1B4353] rounded"
                      />
                    </td>
                    <td className="p-2 text-center border-r border-slate-200">
                      <input
                        type="number"
                        min={0}
                        value={d.alokasiJp}
                        onChange={(e) => {
                          const next = [...alokasiWaktu.distribusi];
                          next[idx] = { ...d, alokasiJp: Number(e.target.value) || 0 };
                          onChange({ ...alokasiWaktu, distribusi: next });
                        }}
                        className="w-16 text-center font-mono bg-slate-50 border border-slate-200 rounded py-1"
                      />
                    </td>
                    <td className="p-2 no-print text-center">
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...alokasiWaktu,
                            distribusi: alokasiWaktu.distribusi.filter((x) => x.id !== d.id),
                          })
                        }
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50/70 font-medium">
                  <td className="p-2 border-r border-slate-200" />
                  <td className="p-2 border-r border-slate-200">Sumatif</td>
                  <td className="p-2 text-center border-r border-slate-200">
                    <input
                      type="number"
                      min={0}
                      value={alokasiWaktu.sumatifTotal}
                      onChange={(e) => onChange({ ...alokasiWaktu, sumatifTotal: Number(e.target.value) || 0 })}
                      className="w-16 text-center font-mono bg-white border border-slate-200 rounded py-1"
                    />
                  </td>
                  <td className="no-print" />
                </tr>
                <tr className="bg-slate-50/70 font-medium">
                  <td className="p-2 border-r border-slate-200" />
                  <td className="p-2 border-r border-slate-200">Formatif</td>
                  <td className="p-2 text-center border-r border-slate-200">
                    <input
                      type="number"
                      min={0}
                      value={alokasiWaktu.formatifTotal}
                      onChange={(e) => onChange({ ...alokasiWaktu, formatifTotal: Number(e.target.value) || 0 })}
                      className="w-16 text-center font-mono bg-white border border-slate-200 rounded py-1"
                    />
                  </td>
                  <td className="no-print" />
                </tr>
                <tr className="bg-slate-50/70 font-medium">
                  <td className="p-2 border-r border-slate-200" />
                  <td className="p-2 border-r border-slate-200">Cadangan</td>
                  <td className="p-2 text-center border-r border-slate-200">
                    <input
                      type="number"
                      min={0}
                      value={alokasiWaktu.cadanganTotal}
                      onChange={(e) => onChange({ ...alokasiWaktu, cadanganTotal: Number(e.target.value) || 0 })}
                      className="w-16 text-center font-mono bg-white border border-slate-200 rounded py-1"
                    />
                  </td>
                  <td className="no-print" />
                </tr>
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3 text-right border-r border-slate-200">
                    Jumlah Total JP (Gasal + Genap = {gasalTotalJp + genapTotalJp} JP tersedia)
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-sm border-r border-slate-200">
                    {grandTotalDistribusi}
                  </td>
                  <td className="no-print" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <SignatureBlock identitas={identitas} />
      </div>
    </div>
  );
}

import type { IdentitasSekolah } from '../types';
import { useIdentitas } from '../context/IdentitasContext';

interface DocumentHeaderProps {
  title: string;
  subtitle?: string;
  fields: Array<{ label: string; value: string }>;
}

export function DocumentHeader({ title, subtitle, fields }: DocumentHeaderProps) {
  const ctx = useIdentitas();

  return (
    <div className="mb-6 border-b border-slate-200 pb-5">
      <div className="text-center mb-5">
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
      </div>

      {ctx ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-lg p-4">
          <label className="flex items-center gap-2">
            <span className="w-28 shrink-0 font-medium text-slate-600">Sekolah</span>
            <span className="text-slate-400">:</span>
            <input
              type="text"
              value={ctx.identitas.satuanPendidikan}
              onChange={(e) => ctx.updateIdentitas({ satuanPendidikan: e.target.value })}
              className="w-full min-w-0 font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 rounded-t print:border-none"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-28 shrink-0 font-medium text-slate-600">Mata Pelajaran</span>
            <span className="text-slate-400">:</span>
            <input
              type="text"
              value={ctx.identitas.mataPelajaran}
              onChange={(e) => ctx.updateIdentitas({ mataPelajaran: e.target.value })}
              className="w-full min-w-0 font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 rounded-t print:border-none"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-28 shrink-0 font-medium text-slate-600">Tahun Pelajaran</span>
            <span className="text-slate-400">:</span>
            <input
              type="text"
              value={ctx.identitas.tahunPelajaran}
              onChange={(e) => ctx.updateIdentitas({ tahunPelajaran: e.target.value })}
              className="w-full min-w-0 font-mono font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 rounded-t print:border-none"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-28 shrink-0 font-medium text-slate-600">Kelas</span>
            <span className="text-slate-400">:</span>
            <input
              type="text"
              value={ctx.identitas.kelas}
              onChange={(e) => ctx.updateIdentitas({ kelas: e.target.value })}
              placeholder="Contoh: 5"
              className="w-full min-w-0 font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 rounded-t print:border-none"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-28 shrink-0 font-medium text-slate-600">Fase</span>
            <span className="text-slate-400">:</span>
            <input
              type="text"
              value={ctx.identitas.fase}
              onChange={(e) => ctx.updateIdentitas({ fase: e.target.value })}
              placeholder="A / B / C / D / E / F"
              className="w-full min-w-0 font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 rounded-t print:border-none"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-28 shrink-0 font-medium text-slate-600">Semester</span>
            <span className="text-slate-400">:</span>
            <input
              type="text"
              value={ctx.identitas.semester}
              onChange={(e) => ctx.updateIdentitas({ semester: e.target.value })}
              placeholder="Gasal / Genap"
              className="w-full min-w-0 font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none px-1 py-0.5 rounded-t print:border-none"
            />
          </label>
          {fields
            .filter(
              (f) =>
                !/satuan pendidikan|sekolah|mata pelajaran|tahun pelajaran|kelas|fase|semester/i.test(
                  f.label,
                ),
            )
            .map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <span className="w-28 shrink-0 font-medium text-slate-600">{f.label}</span>
                <span className="text-slate-400">:</span>
                <span className="font-semibold text-slate-900 truncate">{f.value}</span>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm bg-slate-50/80 border border-slate-200 rounded-lg p-4">
          {fields.map((f) => (
            <div key={f.label} className="flex items-baseline gap-2">
              <span className="w-40 shrink-0 font-medium text-slate-600">{f.label}</span>
              <span className="text-slate-400">:</span>
              <span className="font-semibold text-slate-900">{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SignatureBlock({ identitas }: { identitas: IdentitasSekolah }) {
  const ctx = useIdentitas();
  const data = ctx?.identitas ?? identitas;

  if (!ctx) {
    return (
      <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-slate-800">
        <div>
          <p>Mengetahui,</p>
          <p className="font-medium">Kepala Sekolah</p>
          <div className="h-16" />
          <p className="font-bold underline decoration-slate-400 underline-offset-4">
            {data.namaKepalaSekolah}
          </p>
          <p className="font-mono text-xs text-slate-600 mt-1 tabular-nums">
            NIP. {data.nipKepalaSekolah}
          </p>
        </div>
        <div>
          <p>{data.kotaTanggal}</p>
          <p className="font-medium">Guru Kelas / Mata Pelajaran</p>
          <div className="h-16" />
          <p className="font-bold underline decoration-slate-400 underline-offset-4">
            {data.namaGuru}
          </p>
          <p className="font-mono text-xs text-slate-600 mt-1 tabular-nums">
            NIP. {data.nipGuru}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-slate-800">
      <div>
        <p>Mengetahui,</p>
        <p className="font-medium">Kepala Sekolah</p>
        <div className="h-12" />
        <input
          type="text"
          aria-label="Nama Kepala Sekolah"
          value={data.namaKepalaSekolah}
          onChange={(e) => ctx.updateIdentitas({ namaKepalaSekolah: e.target.value })}
          placeholder="Nama Kepala Sekolah"
          className="w-full max-w-xs font-bold underline decoration-slate-400 underline-offset-4 bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none rounded px-1 -ml-1 py-0.5 print:border-none"
        />
        <div className="flex items-center gap-1 mt-1 font-mono text-xs text-slate-600 tabular-nums">
          <span>NIP.</span>
          <input
            type="text"
            aria-label="NIP Kepala Sekolah"
            value={data.nipKepalaSekolah}
            onChange={(e) => ctx.updateIdentitas({ nipKepalaSekolah: e.target.value })}
            placeholder="NIP Kepala Sekolah"
            className="w-full max-w-[220px] bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none rounded px-1 py-0.5 print:border-none"
          />
        </div>
      </div>

      <div>
        <input
          type="text"
          aria-label="Tempat dan Tanggal Pembuatan"
          value={data.kotaTanggal}
          onChange={(e) => ctx.updateIdentitas({ kotaTanggal: e.target.value })}
          placeholder="Kota, Tanggal Pembuatan"
          className="w-full max-w-xs bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none rounded px-1 -ml-1 py-0.5 print:border-none"
        />
        <p className="font-medium">Guru Kelas / Mata Pelajaran</p>
        <div className="h-12" />
        <input
          type="text"
          aria-label="Nama Guru"
          value={data.namaGuru}
          onChange={(e) => ctx.updateIdentitas({ namaGuru: e.target.value })}
          placeholder="Nama Guru"
          className="w-full max-w-xs font-bold underline decoration-slate-400 underline-offset-4 bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none rounded px-1 -ml-1 py-0.5 print:border-none"
        />
        <div className="flex items-center gap-1 mt-1 font-mono text-xs text-slate-600 tabular-nums">
          <span>NIP.</span>
          <input
            type="text"
            aria-label="NIP Guru"
            value={data.nipGuru}
            onChange={(e) => ctx.updateIdentitas({ nipGuru: e.target.value })}
            placeholder="NIP Guru"
            className="w-full max-w-[220px] bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1B4353] focus:bg-white focus:outline-none rounded px-1 py-0.5 print:border-none"
          />
        </div>
      </div>
    </div>
  );
}

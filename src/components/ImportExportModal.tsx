import { useRef, useState } from 'react';
import { Download, Upload, X, FileText, FileSpreadsheet, Printer, FileJson, Loader2 } from 'lucide-react';
import type { AppState, MenuId } from '../types';
import { exportMenuDocument, MENU_LABELS, parseAnyUploadedFile, type ExportFormat } from '../utils/fileEngine';
import { importCpTpFileAndCascade } from '../utils/curriculumSync';

interface ExportModalProps {
  open: boolean;
  activeMenu: MenuId;
  state: AppState;
  onClose: () => void;
}

export function ExportModal({ open, activeMenu, state, onClose }: ExportModalProps) {
  const [scope, setScope] = useState<'current' | 'all'>('current');
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  if (!open) return null;

  const formats: Array<{ id: ExportFormat; label: string; desc: string; icon: typeof FileText }> = [
    { id: 'docx', label: 'Microsoft Word (.docx)', desc: 'Dokumen siap edit lengkap dengan tabel & tanda tangan.', icon: FileText },
    { id: 'xlsx', label: 'Microsoft Excel (.xlsx)', desc: 'Lembar kerja spreadsheet multi-sheet.', icon: FileSpreadsheet },
    { id: 'pdf', label: 'PDF / Cetak Langsung', desc: 'Tampilan cetak A4 rapi via dialog Print/Save PDF.', icon: Printer },
    { id: 'csv', label: 'CSV (.csv)', desc: 'Format data tabular universal UTF-8.', icon: FileSpreadsheet },
    { id: 'txt', label: 'Teks / Markdown (.txt)', desc: 'Salinan teks polos yang ringan dibuka di mana saja.', icon: FileText },
    { id: 'json', label: 'Backup Proyek (.json)', desc: 'Cadangkan data agar bisa di-import kembali kapan saja.', icon: FileJson },
  ];

  const handleDownload = async (fmt: ExportFormat) => {
    setExporting(fmt);
    try {
      await exportMenuDocument(scope === 'all' ? 'all' : activeMenu, fmt, state);
      if (fmt === 'pdf') onClose();
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg max-w-xl w-full shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Download Perangkat Pembelajaran</h3>
            <p className="text-xs text-slate-600">Pilih cakupan dokumen dan format file yang diinginkan.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setScope('current')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
                scope === 'current' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Menu Aktif: {MENU_LABELS[activeMenu]}
            </button>
            <button
              type="button"
              onClick={() => setScope('all')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
                scope === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Semua 11 Menu Sekaligus
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formats.map((f) => {
              const Icon = f.icon;
              const isBusy = exporting === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleDownload(f.id)}
                  disabled={exporting !== null}
                  className="flex items-start gap-3 text-left p-3.5 border border-slate-200 hover:border-[#1B4353] hover:bg-slate-50 rounded-md transition-colors"
                >
                  <div className="p-2 bg-slate-100 rounded text-[#1B4353] shrink-0">
                    {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{f.label}</span>
                      <Download className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{f.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImportModalProps {
  open: boolean;
  activeMenu: MenuId;
  state: AppState;
  onClose: () => void;
  onUpdateState: (next: AppState) => void;
}

export function ImportModal({ open, activeMenu, state, onClose, onUpdateState }: ImportModalProps) {
  const [importMode, setImportMode] = useState<'cascade_cp_tp' | 'single_menu'>('cascade_cp_tp');
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const handleFileSelected = async (file: File) => {
    setBusy(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      if (importMode === 'cascade_cp_tp') {
        const { nextState, summary } = await importCpTpFileAndCascade(file, state);
        onUpdateState(nextState);
        setStatusMsg(summary);
        setTimeout(onClose, 1200);
        return;
      }

      const result = await parseAnyUploadedFile(file, activeMenu);
      if (result.kind === 'full_state' && result.state) {
        onUpdateState(result.state);
        setStatusMsg(`Berhasil memulihkan seluruh perangkat dari "${result.fileName}".`);
        setTimeout(onClose, 900);
        return;
      }

      if (result.kind === 'table_rows' && result.rows && result.rows.length > 1) {
        const rows = result.rows.slice(1).filter((r) => r.some(Boolean));
        if (activeMenu === 'atp') {
          onUpdateState({
            ...state,
            atpRows: rows.map((r, i) => ({
              id: `imp_atp_${Date.now()}_${i}`,
              no: Number(r[0]) || i + 1,
              elemen: r[1] || '',
              capaianPembelajaran: r[2] || '',
              tujuanPembelajaran: r[3] || '',
              lingkupMateri: r[4] || '',
              dimensiProfilLulusan: r[5] ? String(r[5]).split(',').map((x) => x.trim()) : ['Penalaran Kritis'],
              waktuJp: Number(r[6]) || 6,
              semester: 'Gasal',
            })),
          });
        } else if (activeMenu === 'kktp') {
          onUpdateState({
            ...state,
            kktpRows: rows.map((r, i) => ({
              id: `imp_kktp_${Date.now()}_${i}`,
              kodeTp: r[0] || `TP.${i + 1}`,
              tujuanPembelajaran: r[1] || '',
              perluBimbingan: r[2] || '',
              cukup: r[3] || '',
              baik: r[4] || '',
              sangatBaik: r[5] || '',
            })),
          });
        } else if (activeMenu === 'jurnal') {
          onUpdateState({
            ...state,
            jurnalRows: rows.map((r, i) => ({
              id: `imp_j_${Date.now()}_${i}`,
              pertemuanKe: Number(r[0]) || i + 1,
              hariTgl: r[1] || '',
              bab: r[2] || '',
              tp: r[3] || '',
              materiPokok: r[4] || '',
              ringkasanKegiatan: r[5] || '',
              absensi: r[6] || '',
              metode: r[7] || '',
              penilaian: r[8] || '',
              refleksi: r[9] || '',
            })),
          });
        } else {
          onUpdateState({
            ...state,
            materiAjar: { ...state.materiAjar, materiIntiInput: result.text || '' },
            lkpd: { ...state.lkpd, materiInput: result.text || '' },
            soalFormatif: { ...state.soalFormatif, intiMateri: result.text || '' },
            soalSumatif: { ...state.soalSumatif, intiMateri: result.text || '' },
          });
        }
        setStatusMsg(`Data tabel dari "${result.fileName}" berhasil di-import ke ${MENU_LABELS[activeMenu]}.`);
        setTimeout(onClose, 900);
        return;
      }

      const text = result.text || '';
      if (text) {
        onUpdateState({
          ...state,
          materiAjar: { ...state.materiAjar, materiIntiInput: text },
          lkpd: { ...state.lkpd, materiInput: text },
          soalFormatif: { ...state.soalFormatif, intiMateri: text },
          soalSumatif: { ...state.soalSumatif, intiMateri: text },
          modulAjar: {
            ...state.modulAjar,
            materiPelajaran: result.aiExtracted?.title || state.modulAjar.materiPelajaran,
          },
        });
        setStatusMsg(`Isi dokumen "${result.fileName}" berhasil diekstrak ke bahan Materi, LKPD, dan Soal.`);
        setTimeout(onClose, 1000);
      } else {
        throw new Error('Isi file kosong atau format tidak terbaca.');
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Gagal meng-import file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Import File (Semua Jenis File)</h3>
            <p className="text-xs text-slate-600">
              Mendukung .docx, .xlsx, .xls, .csv, .json, .txt, .md, .pdf, serta foto/gambar dokumen.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setImportMode('cascade_cp_tp')}
              className={`py-2 px-2.5 text-xs font-semibold rounded-md transition-colors ${
                importMode === 'cascade_cp_tp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              File CP/TP (Sinkron Semua 11 Menu)
            </button>
            <button
              type="button"
              onClick={() => setImportMode('single_menu')}
              className={`py-2 px-2.5 text-xs font-semibold rounded-md transition-colors ${
                importMode === 'single_menu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Hanya Menu Aktif ({MENU_LABELS[activeMenu]})
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".json,.xlsx,.xls,.csv,.docx,.txt,.md,.pdf,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelected(f);
              e.target.value = '';
            }}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="w-full border-2 border-dashed border-slate-300 hover:border-[#1B4353] rounded-lg p-8 text-center space-y-2 transition-colors bg-slate-50/70"
          >
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-200/70 flex items-center justify-center text-[#1B4353]">
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {busy ? 'Menganalisis File & Menghubungkan ke Semua Menu...' : 'Klik untuk Memilih File CP / TP atau Dokumen'}
            </p>
            <p className="text-xs text-slate-500">
              {importMode === 'cascade_cp_tp'
                ? 'Otomatis mengisi Analisis CP, ATP, Alokasi Waktu, KKTP, Prota/Promes, Jurnal, Modul Ajar, Materi, LKPD, Soal, & Penilaian.'
                : `Target menu saat ini: ${MENU_LABELS[activeMenu]}`}
            </p>
          </button>

          {statusMsg && (
            <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
              {statusMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

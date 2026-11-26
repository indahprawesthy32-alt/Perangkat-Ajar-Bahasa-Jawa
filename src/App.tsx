/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  BookOpen,
  CalendarClock,
  CheckSquare,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Layers,
  ListChecks,
  Menu,
  NotebookPen,
  ScrollText,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { DEFAULT_STATE } from './data/defaultData';
import type { AppState, IdentitasSekolah, MenuId } from './types';
import { exportMenuDocument, MENU_LABELS } from './utils/fileEngine';
import { IdentitasProvider } from './context/IdentitasContext';
import { Menu1AnalisisCp } from './components/Menu1AnalisisCp';
import { Menu2Atp } from './components/Menu2Atp';
import { Menu3AlokasiWaktu } from './components/Menu3AlokasiWaktu';
import { Menu4Kktp } from './components/Menu4Kktp';
import { Menu5ProtaPromes } from './components/Menu5ProtaPromes';
import { Menu6Jurnal } from './components/Menu6Jurnal';
import { Menu7ModulAjar } from './components/Menu7ModulAjar';
import { Menu8MateriAjar } from './components/Menu8MateriAjar';
import { Menu9Lkpd } from './components/Menu9Lkpd';
import { Menu10Soal } from './components/Menu10Soal';
import { Menu11Penilaian } from './components/Menu11Penilaian';
import { IdentitasModal } from './components/IdentitasModal';
import { ExportModal, ImportModal } from './components/ImportExportModal';

const STORAGE_KEY = 'generator_bhs_jawa_state_v1';

const NAV_ITEMS: Array<{ id: MenuId; num: string; label: string; icon: typeof BookOpen }> = [
  { id: 'analisis_cp', num: '01', label: 'Analisis CP', icon: Layers },
  { id: 'atp', num: '02', label: 'ATP', icon: ListChecks },
  { id: 'alokasi_waktu', num: '03', label: 'Alokasi Waktu', icon: CalendarClock },
  { id: 'kktp', num: '04', label: 'KKTP', icon: CheckSquare },
  { id: 'prota_promes', num: '05', label: 'Prota & Promes', icon: FileSpreadsheet },
  { id: 'jurnal', num: '06', label: 'Jurnal Mengajar', icon: NotebookPen },
  { id: 'modul_ajar', num: '07', label: 'Modul Ajar', icon: GraduationCap },
  { id: 'materi_ajar', num: '08', label: 'Materi Ajar', icon: BookOpen },
  { id: 'lkpd', num: '09', label: 'LKPD', icon: ScrollText },
  { id: 'soal', num: '10', label: 'Soal Formatif & Sumatif', icon: FileText },
  { id: 'penilaian', num: '11', label: 'Format Penilaian', icon: ClipboardCheck },
];

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback to default state
    }
    return DEFAULT_STATE;
  });

  const [activeMenu, setActiveMenu] = useState<MenuId>('analisis_cp');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [identitasOpen, setIdentitasOpen] = useState(false);
  const [quickIdentitasOpen, setQuickIdentitasOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const updateIdentitas = (patch: Partial<IdentitasSekolah>) => {
    setState((prev) => ({
      ...prev,
      identitas: { ...prev.identitas, ...patch },
    }));
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues
    }
  }, [state]);

  const handleResetDefault = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3500);
      return;
    }
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    setConfirmReset(false);
  };

  return (
    <IdentitasProvider value={{ identitas: state.identitas, updateIdentitas }}>
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded"
            aria-label="Buka menu navigasi"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveMenu('analisis_cp');
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Generator Bhs Jawa
          </a>
        </div>

        {/* Zone 2: 4 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setIdentitasOpen(true)}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Identitas
          </button>
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Import File
          </button>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Download
          </button>
          <button
            type="button"
            onClick={handleResetDefault}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {confirmReset ? 'Klik Lagi untuk Reset' : 'Reset Data'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => exportMenuDocument(activeMenu, 'docx', state)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4353] hover:bg-[#143340] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            Export Word
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar Navigation (11 Menus) */}
        <aside
          className={`no-print fixed lg:sticky top-14 left-0 z-20 h-[calc(100vh-3.5rem)] w-64 shrink-0 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {state.identitas.satuanPendidikan}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              Kelas {state.identitas.kelas} · Fase {state.identitas.fase} · {state.identitas.tahunPelajaran}
            </p>
          </div>

          <div className="p-2.5 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded-md transition-colors text-left ${
                    isActive
                      ? 'bg-[#1B4353] text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      isActive ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {item.num}
                  </span>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile quick actions */}
          <div className="md:hidden p-3 border-t border-slate-200 space-y-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setIdentitasOpen(true);
                setSidebarOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded bg-slate-100 text-slate-800 font-medium"
            >
              Atur Identitas Sekolah
            </button>
            <button
              type="button"
              onClick={() => {
                setImportOpen(true);
                setSidebarOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded bg-slate-100 text-slate-800 font-medium"
            >
              Import File
            </button>
            <button
              type="button"
              onClick={() => {
                setExportOpen(true);
                setSidebarOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded bg-slate-100 text-slate-800 font-medium"
            >
              Download Multi-Format
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="no-print fixed inset-0 z-10 bg-slate-900/30 lg:hidden"
          />
        )}

        {/* Main Workspace Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto w-full">
          <div className="no-print mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">
                Perangkat Pembelajaran {state.identitas.mataPelajaran} · Menu {NAV_ITEMS.find((n) => n.id === activeMenu)?.num}
              </p>
              <h1 className="font-display text-2xl font-bold text-slate-900 mt-0.5">
                {MENU_LABELS[activeMenu]}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQuickIdentitasOpen((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-medium border rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  quickIdentitasOpen
                    ? 'bg-[#1B4353] text-white border-[#1B4353]'
                    : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Edit Identitas &amp; Pengesahan
              </button>
              <button
                type="button"
                onClick={() => setImportOpen(true)}
                className="px-3 py-1.5 font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md whitespace-nowrap shrink-0"
              >
                Import File
              </button>
              <button
                type="button"
                onClick={() => setExportOpen(true)}
                className="px-3 py-1.5 font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md whitespace-nowrap shrink-0"
              >
                Download Lainnya
              </button>
            </div>
          </div>

          {quickIdentitasOpen && (
            <div className="no-print mb-5 bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900">
                  Pengaturan Cepat Identitas &amp; Tanda Tangan (Otomatis Sinkron ke Semua 11 Menu)
                </p>
                <button
                  type="button"
                  onClick={() => setQuickIdentitasOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Tutup
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={state.identitas.kelas}
                    onChange={(e) => updateIdentitas({ kelas: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Fase</label>
                  <input
                    type="text"
                    value={state.identitas.fase}
                    onChange={(e) => updateIdentitas({ fase: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Semester</label>
                  <input
                    type="text"
                    value={state.identitas.semester}
                    onChange={(e) => updateIdentitas({ semester: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Tanggal Pembuatan</label>
                  <input
                    type="text"
                    value={state.identitas.kotaTanggal}
                    onChange={(e) => updateIdentitas({ kotaTanggal: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    value={state.identitas.namaKepalaSekolah}
                    onChange={(e) => updateIdentitas({ namaKepalaSekolah: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    value={state.identitas.nipKepalaSekolah}
                    onChange={(e) => updateIdentitas({ nipKepalaSekolah: e.target.value })}
                    className="w-full font-mono border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Guru</label>
                  <input
                    type="text"
                    value={state.identitas.namaGuru}
                    onChange={(e) => updateIdentitas({ namaGuru: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">NIP Guru</label>
                  <input
                    type="text"
                    value={state.identitas.nipGuru}
                    onChange={(e) => updateIdentitas({ nipGuru: e.target.value })}
                    className="w-full font-mono border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'analisis_cp' && (
            <Menu1AnalisisCp
              fullState={state}
              identitas={state.identitas}
              cpElements={state.cpElements}
              tpRows={state.tpRows}
              onChangeCp={(cpElements) => setState({ ...state, cpElements })}
              onChangeTp={(tpRows) => setState({ ...state, tpRows })}
              onUpdateFullState={setState}
            />
          )}

          {activeMenu === 'atp' && (
            <Menu2Atp
              identitas={state.identitas}
              tpRows={state.tpRows}
              atpRows={state.atpRows}
              onChangeAtp={(atpRows) => setState({ ...state, atpRows })}
            />
          )}

          {activeMenu === 'alokasi_waktu' && (
            <Menu3AlokasiWaktu
              identitas={state.identitas}
              alokasiWaktu={state.alokasiWaktu}
              atpRows={state.atpRows}
              onChange={(alokasiWaktu) => setState({ ...state, alokasiWaktu })}
            />
          )}

          {activeMenu === 'kktp' && (
            <Menu4Kktp
              identitas={state.identitas}
              tpRows={state.tpRows}
              kktpRows={state.kktpRows}
              onChange={(kktpRows) => setState({ ...state, kktpRows })}
            />
          )}

          {activeMenu === 'prota_promes' && (
            <Menu5ProtaPromes
              identitas={state.identitas}
              atpRows={state.atpRows}
              protaRows={state.protaRows}
              promesRows={state.promesRows}
              onChangeProta={(protaRows) => setState({ ...state, protaRows })}
              onChangePromes={(promesRows) => setState({ ...state, promesRows })}
            />
          )}

          {activeMenu === 'jurnal' && (
            <Menu6Jurnal
              identitas={state.identitas}
              tpRows={state.tpRows}
              jurnalRows={state.jurnalRows}
              onChange={(jurnalRows) => setState({ ...state, jurnalRows })}
            />
          )}

          {activeMenu === 'modul_ajar' && (
            <Menu7ModulAjar
              identitas={state.identitas}
              modul={state.modulAjar}
              tpRows={state.tpRows}
              atpRows={state.atpRows}
              onChange={(modulAjar) => setState({ ...state, modulAjar })}
            />
          )}

          {activeMenu === 'materi_ajar' && (
            <Menu8MateriAjar
              identitas={state.identitas}
              materiAjar={state.materiAjar}
              tpRows={state.tpRows}
              atpRows={state.atpRows}
              onChange={(materiAjar) => setState({ ...state, materiAjar })}
            />
          )}

          {activeMenu === 'lkpd' && (
            <Menu9Lkpd
              identitas={state.identitas}
              lkpd={state.lkpd}
              tpRows={state.tpRows}
              atpRows={state.atpRows}
              onChange={(lkpd) => setState({ ...state, lkpd })}
            />
          )}

          {activeMenu === 'soal' && (
            <Menu10Soal
              fullState={state}
              identitas={state.identitas}
              soalFormatif={state.soalFormatif}
              soalSumatif={state.soalSumatif}
              onChangeFormatif={(soalFormatif) => setState({ ...state, soalFormatif })}
              onChangeSumatif={(soalSumatif) => setState({ ...state, soalSumatif })}
            />
          )}

          {activeMenu === 'penilaian' && (
            <Menu11Penilaian
              identitas={state.identitas}
              penilaianList={state.penilaianList}
              onChange={(penilaianList) => setState({ ...state, penilaianList })}
            />
          )}
        </main>
      </div>

      <IdentitasModal
        open={identitasOpen}
        identitas={state.identitas}
        onClose={() => setIdentitasOpen(false)}
        onChange={(identitas) => setState({ ...state, identitas })}
      />

      <ExportModal
        open={exportOpen}
        activeMenu={activeMenu}
        state={state}
        onClose={() => setExportOpen(false)}
      />

      <ImportModal
        open={importOpen}
        activeMenu={activeMenu}
        state={state}
        onClose={() => setImportOpen(false)}
        onUpdateState={setState}
      />
    </div>
    </IdentitasProvider>
  );
}

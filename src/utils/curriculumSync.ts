import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import type {
  AppState,
  AtpRow,
  BentukSoalFormatif,
  CpElement,
  CpProfileEntry,
  IdentitasSekolah,
  KisiKisiRow,
  KktpRow,
  MateriAjarState,
  ModelPembelajaranId,
  ModulAjarState,
  MonthKey,
  PenilaianInstrument,
  PromesRow,
  ProtaRow,
  SoalItem,
  TpRow,
} from '../types';
import { MODEL_PEMBELAJARAN_META } from '../data/defaultData';
import { BAHASA_JAWA_PRESETS, FASE_TO_KELAS_MAP, KELAS_TO_FASE_MAP } from '../data/bahasaJawaPresets';
import { generateWithAi } from './apiClient';

export interface EnrichedImportedTp {
  no?: number;
  bab?: string;
  elemen?: string;
  cp?: string;
  tp?: string;
  semester?: 'Gasal' | 'Genap';
  lingkupMateri?: string;
  dimensiProfilLulusan?: string[];
  waktuJp?: number;
  kktp?: {
    kodeTp?: string;
    perluBimbingan?: string;
    cukup?: string;
    baik?: string;
    sangatBaik?: string;
  };
}

export interface CascadeImportPayload {
  detectedIdentitas?: {
    fase?: string;
    kelas?: string;
    tahunPelajaran?: string;
  };
  cpElements?: Array<{ elemen: string; capaianPembelajaran: string }>;
  tpRows?: EnrichedImportedTp[];
  profilesByKey?: Record<
    string,
    {
      cpElements?: Array<{ elemen: string; capaianPembelajaran: string }>;
      tpRows?: EnrichedImportedTp[];
    }
  >;
}

export function normalizeFase(raw: string): 'A' | 'B' | 'C' {
  const upper = (raw || '').toUpperCase().trim();
  if (upper.includes('A')) return 'A';
  if (upper.includes('B')) return 'B';
  return 'C';
}

export function normalizeKelas(raw: string): '1' | '2' | '3' | '4' | '5' | '6' {
  const m = (raw || '').match(/[1-6]/);
  return (m ? m[0] : '5') as '1' | '2' | '3' | '4' | '5' | '6';
}

function buildPromesMonths(semester: 'Gasal' | 'Genap', idxInSem: number, totalInSem: number): Record<MonthKey, boolean> {
  const base: Record<MonthKey, boolean> = {
    jul: false, ags: false, sep: false, okt: false, nov: false, des: false,
    jan: false, feb: false, mar: false, apr: false, mei: false, jun: false,
  };
  const gasalKeys: MonthKey[] = ['jul', 'ags', 'sep', 'okt', 'nov'];
  const genapKeys: MonthKey[] = ['jan', 'feb', 'mar', 'apr', 'mei'];
  const keys = semester === 'Gasal' ? gasalKeys : genapKeys;
  const count = Math.max(1, totalInSem);
  const start = Math.floor((idxInSem / count) * keys.length);
  const end = Math.min(keys.length - 1, Math.floor(((idxInSem + 1) / count) * keys.length));
  for (let i = start; i <= end; i++) {
    base[keys[i]] = true;
  }
  return base;
}

export function cascadeAllMenusFromCpTp(
  prev: AppState,
  cpElements: CpElement[],
  tpRows: TpRow[],
  enrichedItems?: EnrichedImportedTp[],
  detectedIdentitas?: CascadeImportPayload['detectedIdentitas'],
  nextLibrary?: Record<string, CpProfileEntry>,
  preserveCurrentEnrichment = false,
): AppState {
  const stamp = Date.now();

  const identitas: IdentitasSekolah = {
    ...prev.identitas,
    ...(detectedIdentitas?.fase ? { fase: normalizeFase(detectedIdentitas.fase) } : {}),
    ...(detectedIdentitas?.kelas ? { kelas: normalizeKelas(detectedIdentitas.kelas) } : {}),
    ...(detectedIdentitas?.tahunPelajaran ? { tahunPelajaran: detectedIdentitas.tahunPelajaran } : {}),
  };

  const activeKey = `${normalizeFase(identitas.fase)}_${normalizeKelas(identitas.kelas)}`;

  const normalizedTp: TpRow[] = tpRows.map((t, i) => ({
    ...t,
    id: t.id || `tp_${stamp}_${i}`,
    no: t.no || i + 1,
    semester: t.semester === 'Genap' ? 'Genap' : 'Gasal',
  }));

  // 2. ATP
  const atpRows: AtpRow[] = normalizedTp.map((t, i) => {
    const rich = enrichedItems?.[i];
    const prevAtp = preserveCurrentEnrichment ? prev.atpRows[i] : undefined;
    const cleanMater =
      rich?.lingkupMateri ||
      t.bab.replace(/^Bab\s*\d+\s*[:.\-]?\s*/i, '').trim() ||
      t.bab;
    return {
      id: prevAtp?.id || `atp_sync_${stamp}_${i}`,
      no: i + 1,
      elemen: t.elemen,
      capaianPembelajaran: t.cp,
      tujuanPembelajaran: t.tp,
      lingkupMateri: cleanMater,
      dimensiProfilLulusan:
        Array.isArray(rich?.dimensiProfilLulusan) && rich.dimensiProfilLulusan.length > 0
          ? rich.dimensiProfilLulusan
          : prevAtp?.dimensiProfilLulusan?.length
            ? prevAtp.dimensiProfilLulusan
            : ['Penalaran Kritis', 'Komunikasi'],
      waktuJp: Number(rich?.waktuJp) || prevAtp?.waktuJp || 8,
      semester: t.semester,
    };
  });

  // 3. Alokasi Waktu Distribusi
  const distribusi = atpRows.map((a, i) => ({
    id: `dist_sync_${stamp}_${i}`,
    semester: a.semester,
    materiPokok: a.lingkupMateri,
    alokasiJp: a.waktuJp,
  }));

  // 4. KKTP
  const kktpRows: KktpRow[] = normalizedTp.map((t, i) => {
    const k = enrichedItems?.[i]?.kktp;
    const prevK = preserveCurrentEnrichment ? prev.kktpRows[i] : undefined;
    return {
      id: prevK?.id || `kktp_sync_${stamp}_${i}`,
      kodeTp: k?.kodeTp || prevK?.kodeTp || `TP.${i + 1}`,
      tujuanPembelajaran: t.tp,
      perluBimbingan:
        k?.perluBimbingan ||
        prevK?.perluBimbingan ||
        'Belum mampu memahami konsep dasar materi dan memerlukan pendampingan intensif.',
      cukup:
        k?.cukup ||
        prevK?.cukup ||
        'Mampu memahami konsep dasar namun penerapan kaidah Bahasa Jawa masih perlu latihan.',
      baik:
        k?.baik ||
        prevK?.baik ||
        'Mampu menganalisis dan menerapkan kaidah Bahasa Jawa dalam konteks nyata dengan tepat.',
      sangatBaik:
        k?.sangatBaik ||
        prevK?.sangatBaik ||
        'Mampu mengevaluasi serta mencipta karya/tuturan Bahasa Jawa secara mandiri, kritis, dan santun.',
    };
  });

  // 5. Prota & Promes
  const protaRows: ProtaRow[] = atpRows.map((a, i) => ({
    id: `prota_sync_${stamp}_${i}`,
    no: i + 1,
    atp: a.tujuanPembelajaran,
    materiPokok: a.lingkupMateri,
    semester: a.semester,
    alokasiJp: a.waktuJp,
  }));

  const gasalList = atpRows.filter((a) => a.semester === 'Gasal');
  const genapList = atpRows.filter((a) => a.semester === 'Genap');

  const promesRows: PromesRow[] = atpRows.map((a, i) => {
    const idxInSem =
      a.semester === 'Gasal'
        ? gasalList.findIndex((x) => x.id === a.id)
        : genapList.findIndex((x) => x.id === a.id);
    const totalInSem = a.semester === 'Gasal' ? gasalList.length : genapList.length;
    return {
      id: `promes_sync_${stamp}_${i}`,
      no: i + 1,
      tp: a.tujuanPembelajaran,
      materiPokok: a.lingkupMateri,
      semester: a.semester,
      alokasiJp: a.waktuJp,
      bulan: buildPromesMonths(a.semester, Math.max(0, idxInSem), totalInSem),
    };
  });

  // 6. Jurnal Mengajar
  const jurnalRows = normalizedTp.slice(0, 3).map((t, i) => ({
    id: `jurnal_sync_${stamp}_${i}`,
    pertemuanKe: i + 1,
    hariTgl: identitas.kotaTanggal.split(',').slice(1).join(',').trim() || '16 Oktober 2026',
    bab: t.bab,
    tp: t.tp,
    materiPokok: atpRows[i]?.lingkupMateri || t.bab,
    ringkasanKegiatan: `Pembelajaran mendalam materi ${atpRows[i]?.lingkupMateri || t.bab} (Kelas ${identitas.kelas} Fase ${identitas.fase}) melalui diskusi kelompok dan unjuk kerja.`,
    absensi: 'Hadir semua',
    metode: 'Pembelajaran Mendalam (PBL) & Diskusi Kelompok',
    penilaian: 'Asesmen Formatif (Observasi & LKPD)',
    refleksi: 'Murid antusias mengikuti kegiatan analisis teks Bahasa Jawa dan presentasi.',
  }));

  const primaryTp = normalizedTp[0];
  const primaryAtp = atpRows[0];
  const primaryMaterial = primaryAtp?.lingkupMateri || primaryTp?.bab || prev.modulAjar.materiPelajaran;
  const allMaterSummary = atpRows.map((a) => a.lingkupMateri).filter(Boolean).join(', ');

  // 7. Modul Ajar
  const modulAjar = {
    ...prev.modulAjar,
    mataPelajaran: identitas.mataPelajaran,
    materiPelajaran: primaryMaterial,
    capaianPembelajaran: primaryTp?.cp || cpElements[0]?.capaianPembelajaran || prev.modulAjar.capaianPembelajaran,
    tujuanPembelajaran: primaryTp?.tp || prev.modulAjar.tujuanPembelajaran,
  };

  // 8. Materi Ajar
  const materiAjar = {
    ...prev.materiAjar,
    materiIntiInput: `${primaryMaterial}: ${primaryTp?.tp || ''}`,
    judulMateri: primaryMaterial,
    bab: primaryTp?.bab || prev.materiAjar.bab,
    tujuanPembelajaran: primaryTp?.tp || prev.materiAjar.tujuanPembelajaran,
    petaKonsep: {
      ...prev.materiAjar.petaKonsep,
      pusat: primaryMaterial,
    },
  };

  // 9. LKPD
  const lkpd = {
    ...prev.lkpd,
    materiInput: `${primaryMaterial} — ${primaryTp?.tp || ''}`,
    judulLkpd: `LKPD ${primaryMaterial}`,
    tujuanPembelajaran: primaryTp?.tp || prev.lkpd.tujuanPembelajaran,
  };

  // 10. Soal Formatif & Sumatif
  const kisiFromTp = normalizedTp.slice(0, 6).map((t, i) => ({
    id: `kisi_sync_${stamp}_${i}`,
    no: i + 1,
    tp: t.tp,
    materi: atpRows[i]?.lingkupMateri || t.bab,
    indikatorSoal: `Disajikan stimulus teks/kasus ${atpRows[i]?.lingkupMateri || t.bab}, murid Kelas ${identitas.kelas} dapat menganalisis dan memecahkan soal sesuai TP.`,
    levelKognitif: 'C4–C5 (SOLO Relational)',
    bentukSoal: i % 2 === 0 ? 'Pilihan Ganda ABCD' : 'Pilihan Ganda Kompleks / MCMA',
    noSoal: String(i + 1),
  }));

  const soalFormatif = {
    ...prev.soalFormatif,
    intiMateri: `${primaryMaterial} (${primaryTp?.tp || ''})`,
    kktp: kktpRows[0]
      ? `Tuntas apabila mencapai minimal kategori Baik (${kktpRows[0].baik})`
      : prev.soalFormatif.kktp,
    kisiKisi: kisiFromTp.slice(0, 4),
  };

  const soalSumatif = {
    ...prev.soalSumatif,
    intiMateri: allMaterSummary || primaryMaterial,
    kktp: `Tuntas Sumatif Kelas ${identitas.kelas} (Fase ${identitas.fase}) apabila murid mencapai skor >= 76 pada materi: ${allMaterSummary}.`,
    kisiKisi: kisiFromTp,
  };

  // 11. Format Penilaian
  const penilaianList = prev.penilaianList.map((inst) => {
    if (inst.id === 'analisis_penilaian') {
      return {
        ...inst,
        baris: normalizedTp.slice(0, 5).map((t, i) => [
          String(i + 1),
          `${kktpRows[i]?.kodeTp || `TP.${i + 1}`} (${atpRows[i]?.lingkupMateri || t.bab})`,
          '24',
          '28',
          '85.7%',
          'Tuntas Klasikal',
        ]),
      };
    }
    if (inst.id === 'refleksi_akhir_bab') {
      return {
        ...inst,
        deskripsi: `Evaluasi holistik pembelajaran Bahasa Jawa Kelas ${identitas.kelas} (Fase ${identitas.fase}) untuk materi: ${allMaterSummary}.`,
      };
    }
    return inst;
  });

  const mergedLibrary: Record<string, CpProfileEntry> = {
    ...(prev.cpLibrary || {}),
    ...(nextLibrary || {}),
    [activeKey]: {
      cpElements,
      tpRows: normalizedTp,
      enrichedItems: enrichedItems?.map((r) => ({
        lingkupMateri: r.lingkupMateri,
        dimensiProfilLulusan: r.dimensiProfilLulusan,
        waktuJp: r.waktuJp,
        kktp: r.kktp,
      })),
    },
  };

  return {
    ...prev,
    identitas,
    cpElements,
    tpRows: normalizedTp,
    cpLibrary: mergedLibrary,
    atpRows,
    alokasiWaktu: {
      ...prev.alokasiWaktu,
      distribusi,
    },
    kktpRows,
    protaRows,
    promesRows,
    jurnalRows,
    modulAjar,
    materiAjar,
    lkpd,
    soalFormatif,
    soalSumatif,
    penilaianList,
  };
}

export function syncDownstreamFromAtp(prev: AppState, nextAtpRows: AtpRow[]): AppState {
  const stamp = Date.now();
  const distribusi = nextAtpRows.map((a, i) => ({
    id: `dist_atp_${stamp}_${i}`,
    semester: a.semester,
    materiPokok: a.lingkupMateri,
    alokasiJp: a.waktuJp,
  }));

  const protaRows: ProtaRow[] = nextAtpRows.map((a, i) => ({
    id: `prota_atp_${stamp}_${i}`,
    no: i + 1,
    atp: a.tujuanPembelajaran,
    materiPokok: a.lingkupMateri,
    semester: a.semester,
    alokasiJp: a.waktuJp,
  }));

  const gasalList = nextAtpRows.filter((a) => a.semester === 'Gasal');
  const genapList = nextAtpRows.filter((a) => a.semester === 'Genap');

  const promesRows: PromesRow[] = nextAtpRows.map((a, i) => {
    const idxInSem =
      a.semester === 'Gasal'
        ? gasalList.findIndex((x) => x.id === a.id)
        : genapList.findIndex((x) => x.id === a.id);
    const totalInSem = a.semester === 'Gasal' ? gasalList.length : genapList.length;
    return {
      id: `promes_atp_${stamp}_${i}`,
      no: i + 1,
      tp: a.tujuanPembelajaran,
      materiPokok: a.lingkupMateri,
      semester: a.semester,
      alokasiJp: a.waktuJp,
      bulan: buildPromesMonths(a.semester, Math.max(0, idxInSem), totalInSem),
    };
  });

  const primary = nextAtpRows[0];
  const allMater = nextAtpRows.map((a) => a.lingkupMateri).filter(Boolean).join(', ');

  return {
    ...prev,
    atpRows: nextAtpRows,
    alokasiWaktu: { ...prev.alokasiWaktu, distribusi },
    protaRows,
    promesRows,
    modulAjar: primary
      ? {
          ...prev.modulAjar,
          materiPelajaran: primary.lingkupMateri || prev.modulAjar.materiPelajaran,
          capaianPembelajaran: primary.capaianPembelajaran || prev.modulAjar.capaianPembelajaran,
          tujuanPembelajaran: primary.tujuanPembelajaran || prev.modulAjar.tujuanPembelajaran,
        }
      : prev.modulAjar,
    materiAjar: primary
      ? {
          ...prev.materiAjar,
          judulMateri: primary.lingkupMateri || prev.materiAjar.judulMateri,
          tujuanPembelajaran: primary.tujuanPembelajaran || prev.materiAjar.tujuanPembelajaran,
          petaKonsep: { ...prev.materiAjar.petaKonsep, pusat: primary.lingkupMateri || prev.materiAjar.petaKonsep.pusat },
        }
      : prev.materiAjar,
    lkpd: primary
      ? {
          ...prev.lkpd,
          judulLkpd: `LKPD ${primary.lingkupMateri}`,
          tujuanPembelajaran: primary.tujuanPembelajaran || prev.lkpd.tujuanPembelajaran,
        }
      : prev.lkpd,
    soalSumatif: allMater ? { ...prev.soalSumatif, intiMateri: allMater } : prev.soalSumatif,
  };
}

export function switchFaseOrKelasAndSync(
  prev: AppState,
  patch: Partial<IdentitasSekolah>,
): AppState {
  const prevFase = normalizeFase(prev.identitas.fase);
  const prevKelas = normalizeKelas(prev.identitas.kelas);
  const prevKey = `${prevFase}_${prevKelas}`;

  // Save current edits for the previous (fase, kelas) before switching
  const updatedLibrary: Record<string, CpProfileEntry> = {
    ...(prev.cpLibrary || {}),
    [prevKey]: {
      cpElements: prev.cpElements,
      tpRows: prev.tpRows,
      enrichedItems: prev.atpRows.map((a, idx) => ({
        lingkupMateri: a.lingkupMateri,
        dimensiProfilLulusan: a.dimensiProfilLulusan,
        waktuJp: a.waktuJp,
        kktp: prev.kktpRows[idx]
          ? {
              kodeTp: prev.kktpRows[idx].kodeTp,
              perluBimbingan: prev.kktpRows[idx].perluBimbingan,
              cukup: prev.kktpRows[idx].cukup,
              baik: prev.kktpRows[idx].baik,
              sangatBaik: prev.kktpRows[idx].sangatBaik,
            }
          : undefined,
      })),
    },
  };

  let nextFase = patch.fase !== undefined ? normalizeFase(patch.fase) : prevFase;
  let nextKelas = patch.kelas !== undefined ? normalizeKelas(patch.kelas) : prevKelas;

  // Keep Fase (A/B/C) and Kelas (1-6) aligned harmoniously
  if (patch.fase !== undefined && patch.kelas === undefined) {
    const allowed = FASE_TO_KELAS_MAP[nextFase];
    if (!allowed.includes(nextKelas)) {
      nextKelas = allowed[0];
    }
  } else if (patch.kelas !== undefined && patch.fase === undefined) {
    nextFase = KELAS_TO_FASE_MAP[nextKelas] || nextFase;
  }

  const nextIdentitas: IdentitasSekolah = {
    ...prev.identitas,
    ...patch,
    fase: nextFase,
    kelas: nextKelas,
  };

  const didSwitchProfile = nextFase !== prevFase || nextKelas !== prevKelas;
  if (!didSwitchProfile) {
    return {
      ...prev,
      identitas: nextIdentitas,
      cpLibrary: updatedLibrary,
    };
  }

  const targetKey = `${nextFase}_${nextKelas}`;
  const profile =
    updatedLibrary[targetKey] ||
    updatedLibrary[nextFase] ||
    BAHASA_JAWA_PRESETS[targetKey] ||
    BAHASA_JAWA_PRESETS[`${nextFase}_${FASE_TO_KELAS_MAP[nextFase][0]}`];

  if (!profile) {
    return {
      ...prev,
      identitas: nextIdentitas,
      cpLibrary: updatedLibrary,
    };
  }

  const stateWithNextIdentitas: AppState = {
    ...prev,
    identitas: nextIdentitas,
    cpLibrary: updatedLibrary,
  };

  return cascadeAllMenusFromCpTp(
    stateWithNextIdentitas,
    profile.cpElements,
    profile.tpRows,
    profile.enrichedItems,
    { fase: nextFase, kelas: nextKelas },
    updatedLibrary,
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export async function importCpTpFileAndCascade(
  file: File,
  currentState: AppState,
): Promise<{ nextState: AppState; summary: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (ext === 'json') {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.identitas && parsed.tpRows && parsed.modulAjar) {
      return {
        nextState: parsed as AppState,
        summary: `Seluruh paket perangkat ajar dari "${file.name}" berhasil dipulihkan.`,
      };
    }
    if (parsed && Array.isArray(parsed.tpRows)) {
      const cpList: CpElement[] = Array.isArray(parsed.cpElements)
        ? parsed.cpElements
        : currentState.cpElements;
      const nextState = cascadeAllMenusFromCpTp(currentState, cpList, parsed.tpRows);
      return {
        nextState,
        summary: `${parsed.tpRows.length} TP dari "${file.name}" otomatis terhubung ke semua 11 menu.`,
      };
    }
  }

  let rawText = '';
  let base64Data: string | undefined;
  let mimeType: string | undefined;

  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const sheetsText: string[] = [];
    wb.SheetNames.forEach((name) => {
      const ws = wb.Sheets[name];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' }) as string[][];
      const lines = rows.map((r) => r.filter(Boolean).join(' | ')).filter(Boolean);
      if (lines.length) sheetsText.push(`[Sheet: ${name}]\n${lines.join('\n')}`);
    });
    rawText = sheetsText.join('\n\n');
  } else if (ext === 'docx') {
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    rawText = result.value.trim();
  } else if (ext === 'txt' || ext === 'md' || ext === 'html' || ext === 'xml') {
    rawText = await file.text();
  } else {
    const buf = await file.arrayBuffer();
    base64Data = arrayBufferToBase64(buf);
    mimeType = file.type || (ext === 'pdf' ? 'application/pdf' : 'application/octet-stream');
  }

  const aiResult = await generateWithAi<CascadeImportPayload>('import_cp_tp_cascade', {
    identitas: currentState.identitas,
    fileName: file.name,
    rawText,
    base64Data,
    mimeType,
  });

  const stamp = Date.now();
  const cpElements: CpElement[] =
    Array.isArray(aiResult.cpElements) && aiResult.cpElements.length > 0
      ? aiResult.cpElements.map((c, i) => ({
          id: `cp_imp_${stamp}_${i}`,
          elemen: c.elemen || `Elemen ${i + 1}`,
          capaianPembelajaran: c.capaianPembelajaran || '',
        }))
      : currentState.cpElements;

  const richTpList = Array.isArray(aiResult.tpRows) ? aiResult.tpRows : [];
  if (richTpList.length === 0) {
    throw new Error('Tidak ditemukan data CP/TP yang dapat diekstrak dari file tersebut.');
  }

  const tpRows: TpRow[] = richTpList.map((r, i) => ({
    id: `tp_imp_${stamp}_${i}`,
    no: r.no || i + 1,
    bab: r.bab || `Bab ${i + 1}`,
    elemen: r.elemen || cpElements[0]?.elemen || 'Menyimak',
    cp: r.cp || cpElements[0]?.capaianPembelajaran || '',
    tp: r.tp || '',
    semester: r.semester === 'Genap' ? 'Genap' : 'Gasal',
  }));

  // Build multi-fase/kelas library from profilesByKey if extracted
  const importedLibrary: Record<string, CpProfileEntry> = {};
  if (aiResult.profilesByKey && typeof aiResult.profilesByKey === 'object') {
    Object.entries(aiResult.profilesByKey).forEach(([key, entry]) => {
      if (entry && Array.isArray(entry.tpRows) && entry.tpRows.length > 0) {
        const entryCps: CpElement[] = Array.isArray(entry.cpElements) && entry.cpElements.length > 0
          ? entry.cpElements.map((c, idx) => ({
              id: `cp_lib_${key}_${stamp}_${idx}`,
              elemen: c.elemen,
              capaianPembelajaran: c.capaianPembelajaran,
            }))
          : cpElements;
        const entryTps: TpRow[] = entry.tpRows.map((r, idx) => ({
          id: `tp_lib_${key}_${stamp}_${idx}`,
          no: r.no || idx + 1,
          bab: r.bab || `Bab ${idx + 1}`,
          elemen: r.elemen || entryCps[0]?.elemen || '',
          cp: r.cp || entryCps[0]?.capaianPembelajaran || '',
          tp: r.tp || '',
          semester: r.semester === 'Genap' ? 'Genap' : 'Gasal',
        }));
        importedLibrary[key.toUpperCase()] = {
          cpElements: entryCps,
          tpRows: entryTps,
          enrichedItems: entry.tpRows.map((r) => ({
            lingkupMateri: r.lingkupMateri,
            dimensiProfilLulusan: r.dimensiProfilLulusan,
            waktuJp: r.waktuJp,
            kktp: r.kktp,
          })),
        };
      }
    });
  }

  const nextState = cascadeAllMenusFromCpTp(
    currentState,
    cpElements,
    tpRows,
    richTpList,
    aiResult.detectedIdentitas,
    importedLibrary,
  );

  const extraCount = Object.keys(importedLibrary).length;
  return {
    nextState,
    summary: `Berhasil meng-import ${cpElements.length} Elemen CP & ${tpRows.length} TP${
      extraCount > 1 ? ` (${extraCount} profil Fase/Kelas)` : ''
    } dari "${file.name}" dan langsung menghubungkannya ke seluruh 11 sub-menu.`,
  };
}

export interface ModulSyncTargets {
  modul: boolean;
  materi: boolean;
  soal: boolean;
  penilaian: boolean;
}

export function parseAlokasiBreakdown(alokasiWaktu: string): {
  totalMenit: number;
  alokasiPendahuluan: string;
  alokasiInti: string;
  alokasiPenutup: string;
} | null {
  const txt = (alokasiWaktu || '').trim();
  if (!txt) return null;

  let totalMenit = 0;
  const multMatch = txt.match(/(\d+)\s*[xX×]\s*(\d+)/);
  if (multMatch) {
    totalMenit = Number(multMatch[1]) * Number(multMatch[2]);
  } else {
    const singleMatch = txt.match(/(\d+)\s*(?:menit|mnt)/i);
    if (singleMatch) {
      totalMenit = Number(singleMatch[1]);
    }
  }

  if (!totalMenit || totalMenit < 15) return null;

  const pendahuluan = Math.max(5, Math.round((totalMenit * 0.15) / 5) * 5);
  const penutup = Math.max(5, Math.round((totalMenit * 0.15) / 5) * 5);
  const inti = Math.max(10, totalMenit - pendahuluan - penutup);

  return {
    totalMenit,
    alokasiPendahuluan: `${pendahuluan} Menit`,
    alokasiInti: `${inti} Menit`,
    alokasiPenutup: `${penutup} Menit`,
  };
}

interface TopicPresetPack {
  cabang: Array<{ judul: string; poin: string[] }>;
  kosakata: Array<{ ngoko: string; krama: string; arti: string }>;
  contoh: string;
  aspekRubrik: string[];
}

function getTopicPresetPack(materi: string): TopicPresetPack {
  const m = materi.toLowerCase();
  if (m.includes('jamu')) {
    return {
      cabang: [
        { judul: 'Bahan Empon-Empon Jamu Jawa', poin: ['Kunyit (kunir), jahe, kencur, temulawak, asem', 'Beras kencur, kunir asem, sinom, cabe puyang'] },
        { judul: 'Manfaat Jamu tumrap Kesehatan', poin: ['Nambah daya tahan awak lan seger', 'Ngurangi pegel linu lan nambani watuk ringan'] },
        { judul: 'Pelestarian Budaya Jamu', poin: ['Warisan budaya DIY (jamu gendhong)', 'Tata cara ngracik kanthi resik lan aman'] },
      ],
      kosakata: [
        { ngoko: 'Waras / Sehat', krama: 'Saras / Bagas waras', arti: 'Sehat bugar' },
        { ngoko: 'Nginum / Ngombe', krama: 'Ngunjuk', arti: 'Minum' },
        { ngoko: 'Obat / Jamu', krama: 'Jampi / Usada', arti: 'Obat tradisional / jamu' },
        { ngoko: 'Awak', krama: 'Salira / Raga', arti: 'Tubuh / badan' },
      ],
      contoh:
        'Tuladha Teks Jamu Jawa:\n"Jamu kunir asem digawe saka kunir, asem jawa, lan gula jawa. Manfaate kanggo nyegerake salira lan njaga kasarasan."',
      aspekRubrik: ['Identifikasi Bahan & Manfaat Jamu Jawa', 'Analisis Manfaat Kesehatan & Pelestarian Budaya'],
    };
  }
  if (m.includes('peninggalan') || m.includes('sejarah') || m.includes('diy')) {
    return {
      cabang: [
        { judul: 'Peninggalan Sejarah ing DIY', poin: ['Candi Prambanan, Candi Ratu Boko, Candi Kalasan', 'Kraton Ngayogyakarta, Tamansari, Benteng Vredeburg, Kotagede'] },
        { judul: 'Wujud & Sejarah Singkat', poin: ['Arsitektur khas Jawa lan prasasti kuna', 'Peran sejarah perjuangan lan budaya Ngayogyakarta'] },
        { judul: 'Sikap Nguri-uri (Pelestarian)', poin: ['Jaga karesikan lan ora ngrusak cagar budaya', 'Ngajeni warisan leluhur DIY'] },
      ],
      kosakata: [
        { ngoko: 'Biyen', krama: 'Riyin / Kala rumiyin', arti: 'Dahulu kala' },
        { ngoko: 'Watu', krama: 'Sela', arti: 'Batu' },
        { ngoko: 'Omah / Istana', krama: 'Dalem / Kraton', arti: 'Rumah / Istana' },
        { ngoko: 'Ndeleng', krama: 'Mirsani', arti: 'Melihat / mengunjungi' },
      ],
      contoh:
        'Tuladha Teks Peninggalan Sejarah DIY:\n"Kraton Ngayogyakarta Hadiningrat lan Tamansari minangka peninggalan sejarah ing DIY kang kudu dijaga karesikan lan kalestarene."',
      aspekRubrik: ['Identifikasi Peninggalan Sejarah DIY', 'Sikap & Gagasan Pelestarian Budaya'],
    };
  }
  if (m.includes('busana') || m.includes('gagrag') || m.includes('ngayogyakarta')) {
    return {
      cabang: [
        { judul: 'Busana Kakung Gagrag Ngayogyakarta', poin: ['Blangkon (iketan Ngayogyakarta kanthi mondholan)', 'Surjan / Pranakan, jarik (sinjang), kamus/timang, keris', 'Canela / selop'] },
        { judul: 'Busana Putri Gagrag Ngayogyakarta', poin: ['Kebaya tangkepan / kartini, sanggul (ukel tekuk)', 'Jarik batik wiron Ngayogyakarta, setagen, selop'] },
        { judul: 'Filosofi & Tata Krama Busana', poin: ['Ngajeni pakaryan leluhur lan kesopanan', 'Panganggone miturut acara resmi utawa upacara adat'] },
      ],
      kosakata: [
        { ngoko: 'Klambi', krama: 'Rasukan / Ageman', arti: 'Baju / pakaian' },
        { ngoko: 'Nganggo', krama: 'Ngagem', arti: 'Memakai' },
        { ngoko: 'Sirah', krama: 'Mustaka', arti: 'Kepala' },
        { ngoko: 'Sikil', krama: 'Sampeyan / Ampeyan', arti: 'Kaki' },
      ],
      contoh:
        'Tuladha Analisis Busana Jawa:\n"Ciri khas blangkon gagrag Ngayogyakarta yaiku anane mondholan ing sisih mburi. Surjan lurik lan jarik wiron dipunagem kanthi trapsila ing acara adat."',
      aspekRubrik: ['Ketepatan Nama & Fungsi Bagian Busana', 'Pemahaman Filosofi Gagrag Ngayogyakarta'],
    };
  }
  if (m.includes('teknologi')) {
    return {
      cabang: [
        { judul: 'Teknologi Tradisional Jawa', poin: ['Lumpang-alu, lesung, ani-ani, luku/waluku, tenggok', 'Pawon kayu, kendhil lemah, tenggok pring'] },
        { judul: 'Teknologi Modern', poin: ['Traktor, mesin giling pari (huller), rice cooker, komputer', 'Ngirit tenaga lan wektu ing pakaryan'] },
        { judul: 'Perbandingan & Sikap Bijak', poin: ['Kaluwihan tradisional (ramah lingkungan, gotong royong)', 'Panggunaan teknologi modern kanthi wicaksana'] },
      ],
      kosakata: [
        { ngoko: 'Piranti', krama: 'Pirantos', arti: 'Alat / perkakas' },
        { ngoko: 'Gawe', krama: 'Damel', arti: 'Membuat' },
        { ngoko: 'Cepet', krama: 'Enggal / Rikat', arti: 'Cepat' },
        { ngoko: 'Pari', krama: 'Pantun', arti: 'Padi' },
      ],
      contoh:
        'Tuladha Perbandingan Teknologi:\n"Ing jaman biyen wong tani nutu pari nganggo lesung lan alu kanthi guyub rukun, saiki nggunakake mesin giling pari supaya luwih cepet."',
      aspekRubrik: ['Perbandingan Alat Tradisional & Modern', 'Analisis Dampak & Sikap Bijak Teknologi'],
    };
  }
  if (m.includes('dina') || m.includes('pasaran')) {
    return {
      cabang: [
        { judul: 'Jeneng Dina Pitu (7 Hari)', poin: ['Ahad/Minggu, Senen, Selasa, Rebo, Kemis, Jemuwah, Setu'] },
        { judul: 'Jeneng Pasaran Lima (Pancawara)', poin: ['Legi (Manis), Pahing, Pon, Wage, Kliwon'] },
        { judul: 'Panggunaan ing Penanggalan Jawa', poin: ['Nggabungake dina lan pasaran (contone: Rebo Pon, Jemuwah Kliwon)', 'Weton lan kearifan budaya Jawa'] },
      ],
      kosakata: [
        { ngoko: 'Dina', krama: 'Dinten', arti: 'Hari' },
        { ngoko: 'Saiki', krama: 'Samenika / Sapunika', arti: 'Sekarang' },
        { ngoko: 'Sesuk', krama: 'Benjang', arti: 'Besok' },
        { ngoko: 'Wingi', krama: 'Kala wingi', arti: 'Kemarin' },
      ],
      contoh:
        'Tuladha Ukara Dina lan Pasaran:\n"Dinten punika dinten Jemuwah Legi. Benjang enjang dinten Setu Pahing wonten kerja bakti ing sekolah."',
      aspekRubrik: ['Ketepatan Urutan Dina & Pasaran', 'Penerapan Dina-Pasaran dalam Kalimat'],
    };
  }
  if (m.includes('kewan') || m.includes('binatang') || m.includes('tanduran') || m.includes('tanaman') || m.includes('panganan') || m.includes('makanan')) {
    return {
      cabang: [
        { judul: 'Kawruh Basa Kewan', poin: ['Arane anak kewan (pedhet, belo, pitik/kuthuk, cempe)', 'Arane kandhang (gedhogan, kombong, kurungan) & swarane kewan'] },
        { judul: 'Kawruh Basa Tanduran', poin: ['Jeneng & manfaat tanduran (kunir, gedhang, klapa, pari)', 'Aran isi tanduran (beton, kecik, pongge, klungsu, pelok)'] },
        { judul: 'Panganan Tradisional DIY', poin: ['Gudeg, bakpia, geplak, yangko, tiwul, jadah tempe'] },
      ],
      kosakata: [
        { ngoko: 'Kewan', krama: 'Sato kewan', arti: 'Binatang / hewan' },
        { ngoko: 'Tanduran', krama: 'Taneman', arti: 'Tanaman' },
        { ngoko: 'Panganan', krama: 'Tedhan / Dhaharan', arti: 'Makanan' },
        { ngoko: 'Isi', krama: 'Wiji / Isi', arti: 'Biji buah' },
      ],
      contoh:
        'Tuladha Kawruh Basa:\n"Anake jaran arane belo, kandhange gedhogan. Isi nangka arane beton, dene isi pelem arane pelok. Panganan khas Bantul yaiku geplak."',
      aspekRubrik: ['Ketepatan Kawruh Basa Kewan & Tanduran', 'Pengenalan Makanan Tradisional DIY'],
    };
  }
  if (m.includes('pakaryan') || m.includes('pekerjaan')) {
    return {
      cabang: [
        { judul: 'Macam-macam Pakaryan (Pekerjaan)', poin: ['Guru, dhokter, petani, nelayan, bakul/pedagang', 'Kusir andhong, dhalang, tukang kayu, polisi'] },
        { judul: 'Tugas & Papan Nyambut Gawe', poin: ['Petani makarya ing sawah; dhokter ing puskesmas/rumah sakit'] },
        { judul: 'Ngajeni Saben Pakaryan', poin: ['Kabeh pakaryan kang halal mulya lan migunani'] },
      ],
      kosakata: [
        { ngoko: 'Nyambut gawe', krama: 'Nyambut damel / Makarya', arti: 'Bekerja' },
        { ngoko: 'Adol', krama: 'Sade', arti: 'Menjual' },
        { ngoko: 'Tuku', krama: 'Tumbas / Mundhut', arti: 'Membeli' },
        { ngoko: 'Mulang', krama: 'Mucal', arti: 'Mengajar' },
      ],
      contoh:
        'Tuladha Teks Pakaryan:\n"Pak Budi pakaryane dadi kusir andhong ing Malioboro, dene Ibu Siti mucal minangka guru SD."',
      aspekRubrik: ['Identifikasi Jenis & Tugas Pakaryan', 'Penggunaan Krama tentang Pekerjaan'],
    };
  }
  if (m.includes('anggota tubuh') || m.includes('perangane awak') || m.includes('perawatan') || m.includes('silsilah') || m.includes('keluarga')) {
    return {
      cabang: [
        { judul: 'Perangane Awak & Silsilah Kulawarga', poin: ['Sirah/mustaka, mripat/paningal, kuping/talingan, tangan/asta', 'Bapak/rama, ibu, kakang/mbakyu, adhi/rayi'] },
        { judul: 'Cara Ngrumat Awak & Tata Krama', poin: ['Adus sedina kaping pindho, sikatan, ngumbah tangan', 'Ngajeni wong tuwa lan rukun karo sedulur'] },
        { judul: 'Ukara Tepungan & Kulawarga', poin: ['Nyebutake jeneng, alamat, lan jeneng wong tuwa nganggo basa santun'] },
      ],
      kosakata: [
        { ngoko: 'Mripat', krama: 'Paningal', arti: 'Mata' },
        { ngoko: 'Tangan', krama: 'Asta', arti: 'Tangan' },
        { ngoko: 'Jeneng', krama: 'Nami / Asma', arti: 'Nama' },
        { ngoko: 'Adus', krama: 'Siram', arti: 'Mandi' },
      ],
      contoh:
        'Tuladha Tepungan:\n"Sugeng enjang, Bu Guru. Nami kula Bima. Bapak kula asmanipun Pak Santosa, ibu kula asmanipun Bu Rini."',
      aspekRubrik: ['Ketepatan Kosakata Anggota Tubuh/Keluarga', 'Sikap Santun Perawatan Diri & Keluarga'],
    };
  }
  if (m.includes('crita rakyat') || m.includes('cerita rakyat') || m.includes('dongeng') || m.includes('fabel') || m.includes('legenda')) {
    return {
      cabang: [
        { judul: 'Unsur Intrinsik Crita', poin: ['Paraga lan watake (protagonis & antagonis)', 'Latar panggonan, wektu, lan swasana', 'Alur crita (wiwitan nganti pungkasan)'] },
        { judul: 'Jenis Dongeng (Fabel & Legenda DIY)', poin: ['Fabel: crita kewan kang nduweni watak kaya manungsa', 'Legenda DIY: Rawa Pening, Roro Jonggrang, Kaliurang'] },
        { judul: 'Pitutur Luhur (Amanat)', poin: ['Nilai budi pekerti lan tepa selira', 'Relevansi tuladha ing jaman saiki'] },
      ],
      kosakata: [
        { ngoko: 'Crita', krama: 'Cariyos', arti: 'Cerita / kisah' },
        { ngoko: 'Watak', krama: 'Watek / Sipat', arti: 'Karakter / sifat tokoh' },
        { ngoko: 'Pitutur', krama: 'Piwulang', arti: 'Nasihat / pesan moral' },
        { ngoko: 'Panggonan', krama: 'Papan / Panggenan', arti: 'Tempat / lokasi' },
      ],
      contoh:
        'Tuladha Pethikan Dongeng:\n"Kancil lan Baya minangka dongeng fabel kang ngajari supaya pinter ngadhepi masalah, nanging tetep kudu jujur lan ora ngapusi kanca."',
      aspekRubrik: ['Analisis Tokoh & Alur Dongeng', 'Penafsiran Amanat & Nilai Budaya'],
    };
  }
  if (m.includes('tembang') || m.includes('macapat') || m.includes('dolanan') || m.includes('pocung') || m.includes('gambuh') || m.includes('maskumambang') || m.includes('mijil')) {
    return {
      cabang: [
        { judul: 'Paugeran / Ciri Tembang', poin: ['Macapat: Guru Gatra, Guru Wilangan, Guru Lagu (Pocung/Gambuh/Maskumambang/Mijil)', 'Dolanan: lirik ringkes, gampang ditembangake, isi piwulang/dolanan'] },
        { judul: 'Isi, Cangkriman & Pitutur Luhur', poin: ['Tegese tembung kawi / sastra ing cakepan', 'Piwulang kabecikan tumrap kulawarga lan pasrawungan'] },
        { judul: 'Praktik Nembang / Melantunkan', poin: ['Titi laras pelog lan slendro', 'Wirama, ekspresi, lan pangucapan cetha'] },
      ],
      kosakata: [
        { ngoko: 'Tembang', krama: 'Sekar', arti: 'Lagu / tembang Jawa' },
        { ngoko: 'Larik / Baris', krama: 'Gatra', arti: 'Baris dalam bait tembang' },
        { ngoko: 'Suku kata', krama: 'Wanda', arti: 'Suku kata' },
        { ngoko: 'Suara akhir', krama: 'Dhawahing swara / Guru lagu', arti: 'Vokal akhir tiap baris' },
      ],
      contoh:
        'Tuladha Tembang Macapat Pocung (Cangkriman):\n"Bapak pocung renteng-renteng kaya kalung, / Dawa kaya ula, / Pencokanmu wesi miring, / Sing disaba si pocung mung turut kutha." (Batangane: Sepur/Kereta Api)',
      aspekRubrik: ['Ketepatan Analisis Paugeran / Ciri Tembang', 'Pemaknaan Pitutur Luhur & Melantunkan'],
    };
  }
  if (m.includes('aksara') || m.includes('sandhangan') || m.includes('pasangan') || m.includes('adeg') || m.includes('lingga') || m.includes('andhahan')) {
    return {
      cabang: [
        { judul: 'Aksara Nglegena & Pasangan', poin: ['20 aksara nglegena Ha Na Ca Ra Ka nganti Nga', 'Pasangan aksara kanggo mateni aksara sadurunge ing tengah ukara'] },
        { judul: 'Sandhangan & Tandha Waca', poin: ['Sandhangan swara (wulu, suku, taling, pepet, taling tarung) & panyigeg (-r, -h, -ng)', 'Tandha waca: adeg-adeg (wiwitan ukara), pada lingsa (koma), pada lungsi (titik)'] },
        { judul: 'Tembung Lingga & Andhahan (Ater-ater)', poin: ['Tembung lingga (kata dasar) lan andhahan oleh ater-ater (n-, m-, ny-, ng-, di-, ka-)'] },
      ],
      kosakata: [
        { ngoko: 'Tulis', krama: 'Serat', arti: 'Menulis / tulisan' },
        { ngoko: 'Waca', krama: 'Waos', arti: 'Membaca' },
        { ngoko: 'Tembung', krama: 'Tembung', arti: 'Kata' },
        { ngoko: 'Ukara', krama: 'Ukara', arti: 'Kalimat' },
      ],
      contoh:
        'Tuladha Panulisan & Tata Bahasa:\nAksara Jawa diwiwiti tandha adeg-adeg, dipungkasi pada lungsi. Tuladha ater-ater anuswara: n + tulis = nulis; m + baca = maca.',
      aspekRubrik: ['Ketepatan Aksara, Sandhangan, Pasangan & Tandha Waca', 'Ketepatan Tembung Lingga & Andhahan'],
    };
  }
  if (m.includes('wayang') || m.includes('pandhawa') || m.includes('punakawan') || m.includes('ramayana') || m.includes('mahabarata') || m.includes('gamelan') || m.includes('piranti')) {
    return {
      cabang: [
        { judul: 'Paraga & Watak Wayang', poin: ['Punakawan (Semar, Gareng, Petruk, Bagong) & Pandhawa Lima', 'Tokoh Ramayana (Rama, Sinta, Anoman, Rahwana) & Mahabarata'] },
        { judul: 'Piranti Wayang & Ricikan Gamelan', poin: ['Kelir, blencong, debog, cempala, keprak, kothak wayang', 'Ricikan gamelan: kendhang, saron, bonang, gong, gender'] },
        { judul: 'Nilai Keteladanan', poin: ['Karakter, ciri fisik, nama lain, kasatriyan/papan dunung, gaman/aji-aji', 'Penerapan sikap satriya lan budi pekerti'] },
      ],
      kosakata: [
        { ngoko: 'Raja', krama: 'Nata / Prabu', arti: 'Raja / pemimpin' },
        { ngoko: 'Senjata', krama: 'Gaman / Pusaka', arti: 'Senjata / pusaka' },
        { ngoko: 'Omah / Panggonan', krama: 'Kasatriyan / Papan dunung', arti: 'Tempat tinggal ksatria' },
        { ngoko: 'Bener', krama: 'Leres', arti: 'Benar / kebenaran' },
      ],
      contoh:
        'Tuladha Kawruh Wayang:\n"Raden Janaka (Arjuna) kasatriyane ing Madukara, gamane Panah Pasopati. Piranti pagelaran wayang kulit antarane kelir, blencong, debog, lan ricikan gamelan."',
      aspekRubrik: ['Identifikasi Tokoh, Kasatriyan, Gaman & Piranti Wayang', 'Keteladanan Watak dalam Kehidupan'],
    };
  }
  if (m.includes('geguritan') || m.includes('puisi')) {
    return {
      cabang: [
        { judul: 'Unsur Fisik & Batin Geguritan', poin: ['Diksi / pamilihing tembung (tembung entar)', 'Rima, irama, lan tipografi larik', 'Tema, rasa, nada, lan amanat'] },
        { judul: 'Teknik Maca (4W)', poin: ['Wirama (intonasi lan cendhek-dhuwuring swara)', 'Wirasa (penghayatan isi geguritan)', 'Wiraga (gestur lan ekspresi wajah)', 'Wicara (pangucapan cetha)'] },
        { judul: 'Nulis Geguritan Sederhana', poin: ['Milih tema alam, kulawarga, utawa budi pekerti', 'Ngrakit larik puitis nganggo basa Jawa'] },
      ],
      kosakata: [
        { ngoko: 'Ati', krama: 'Manah / Penggalih', arti: 'Hati / perasaan' },
        { ngoko: 'Endah', krama: 'Edi peni', arti: 'Indah / estetis' },
        { ngoko: 'Srengenge', krama: 'Surya', arti: 'Matahari' },
        { ngoko: 'Swara', krama: 'Suwanten', arti: 'Suara' },
      ],
      contoh:
        'Tuladha Pethikan Geguritan:\n"Esuk kang padhang sumunar,\nAngin sumilir nggawa pangarep-arep,\nSinau kanthi sregep lan andhap asor,\nSupaya migunani tumrap nusa lan bangsa."',
      aspekRubrik: ['Penafsiran Makna Kias Geguritan', 'Teknik Wirama, Wirasa, Wiraga saat Membaca'],
    };
  }
  if (m.includes('tata krama') || m.includes('unggah') || m.includes('krama') || m.includes('ngoko') || m.includes('sapa aruh') || m.includes('bertamu') || m.includes('tolong') || m.includes('ajakan') || m.includes('pertanyaan')) {
    return {
      cabang: [
        { judul: 'Konteks Tata Krama Tutur', poin: ['Tepungan, sapa aruh, nyuwun tulung & matur nuwun', 'Ngajokake pitakonan, ajakan & tanya jawab, tata krama bertamu'] },
        { judul: 'Pilihan Ragam Ngoko & Krama', poin: ['Ngoko kanggo kanca raket / wong enom', 'Krama alus kanggo wong tuwa, guru, tamu, lan sesepuh'] },
        { judul: 'Sikap & Solah Bawa (Trapsila)', poin: ['Ndhingkluk/mbungkuk alon nalika liwat, salam, intonasi sareh'] },
      ],
      kosakata: [
        { ngoko: 'Jaluk tulung', krama: 'Nyuwun tulung', arti: 'Meminta tolong' },
        { ngoko: 'Matur suwun', krama: 'Matur nuwun', arti: 'Terima kasih' },
        { ngoko: 'Takon', krama: 'Nyuwun pirsa', arti: 'Bertanya' },
        { ngoko: 'Mlebu / Teka', krama: 'Mlebet / Rawuh', arti: 'Masuk / datang (bertamu)' },
      ],
      contoh:
        'Tuladha Tata Krama:\nBertamu: "Kula nuwun, Sugeng sonten. Kepareng kula sowan badhe pinanggih kaliyan Bapak." | Nyuwun tulung: "Nuwun sewu, nyuwun tulung dipunpendhetaken buku punika. Matur nuwun."',
      aspekRubrik: ['Ketepatan Unggah-Ungguh Basa Jawa', 'Sikap Santun (Trapsila) dalam Praktik'],
    };
  }
  if (m.includes('permainan') || m.includes('dolanan') || m.includes('kosok balen') || m.includes('wilangan')) {
    return {
      cabang: [
        { judul: 'Dolanan Tradisional DIY', poin: ['Gobag sodor, engklek/sunda manda, cublak-cublak suweng, dhakon, egrang'] },
        { judul: 'Kawruh Basa (Kosok Balen & Wilangan)', poin: ['Tembung kosok balen (dawa x cendhek, gedhe x cilik)', 'Wilangan baku (setunggal–sedasa) & saperangan (separo, seprapat)'] },
        { judul: 'Nilai Karakter', poin: ['Jujur, sportif, rukun, lan ora mbedak-bedakake kanca'] },
      ],
      kosakata: [
        { ngoko: 'Dolanan', krama: 'Dolan / Ameng-ameng', arti: 'Bermain' },
        { ngoko: 'Gedhe >< Cilik', krama: 'Ageng >< Alit', arti: 'Besar >< Kecil' },
        { ngoko: 'Siji / Loro / Telu', krama: 'Setunggal / Kalih / Tiga', arti: 'Satu / Dua / Tiga' },
        { ngoko: 'Rukun', krama: 'Rukun', arti: 'Rukun / damai' },
      ],
      contoh:
        'Tuladha:\n"Ing DIY bocah-bocah seneng dolanan dhakon lan gobag sodor. Kosok balene tembung gedhe yaiku cilik; wilangan saperangan kayata separo lan seprapat."',
      aspekRubrik: ['Pemahaman Aturan & Nilai Dolanan DIY', 'Ketepatan Kosok Balen & Tembung Wilangan'],
    };
  }

  return {
    cabang: [
      { judul: `Konsep Inti ${materi}`, poin: [`Definisi lan kaidah dhasar ${materi}`, `Ciri khas kebahasaan ing konteks Jawa`] },
      { judul: `Analisis Teks & Makna`, poin: [`Telaah struktur lan gagasan pokok (C4)`, `Evaluasi nilai budi pekerti lan pesan moral (C5)`] },
      { judul: `Penerapan Kontekstual (C6)`, poin: [`Tuladha nyata ing padinan`, `Kreasi karya/tuturan Bahasa Jawa kang santun`] },
    ],
    kosakata: [
      { ngoko: 'Sinau', krama: 'Sinau / Ngudi kawruh', arti: 'Belajar' },
      { ngoko: 'Ngomong', krama: 'Matur / Ngendika', arti: 'Berbicara' },
      { ngoko: 'Ngrungokake', krama: 'Midhangetaken', arti: 'Mendengarkan' },
      { ngoko: 'Apik', krama: 'Sae', arti: 'Baik / bagus' },
    ],
    contoh: `Tuladha Penerapan "${materi}":\nPara murid nindakake diskusi klompok kanggo nliti teks "${materi}", nemokake gagasan pokok lan nilai luhur budaya Jawa, banjur ngandharake asile nganggo basa Jawa kang trep.`,
    aspekRubrik: [`Analisis Konsep & Kaidah ${materi}`, `Penerapan Bahasa & Karya ${materi}`],
  };
}

export function syncFromModulSelection(
  prev: AppState,
  params: {
    materiPelajaran?: string;
    alokasiWaktu?: string;
    capaianPembelajaran?: string;
    tujuanPembelajaran?: string;
    bab?: string;
    modelPembelajaran?: ModelPembelajaranId;
    tpIndex?: number;
    targets?: Partial<ModulSyncTargets>;
  },
): AppState {
  const stamp = Date.now();
  const targets: ModulSyncTargets = {
    modul: params.targets?.modul ?? true,
    materi: params.targets?.materi ?? true,
    soal: params.targets?.soal ?? true,
    penilaian: params.targets?.penilaian ?? true,
  };

  const materi = (params.materiPelajaran ?? prev.modulAjar.materiPelajaran).trim() || prev.modulAjar.materiPelajaran;
  const alokasi = (params.alokasiWaktu ?? prev.modulAjar.alokasiWaktu).trim() || prev.modulAjar.alokasiWaktu;
  const cp = (params.capaianPembelajaran ?? prev.modulAjar.capaianPembelajaran).trim() || prev.modulAjar.capaianPembelajaran;
  const tp = (params.tujuanPembelajaran ?? prev.modulAjar.tujuanPembelajaran).trim() || prev.modulAjar.tujuanPembelajaran;
  const bab = (params.bab ?? prev.materiAjar.bab).trim() || materi;
  const model = params.modelPembelajaran ?? prev.modulAjar.modelPembelajaran;
  const modelMeta = MODEL_PEMBELAJARAN_META[model];
  const timeBreak = parseAlokasiBreakdown(alokasi);
  const presetPack = getTopicPresetPack(materi);
  const kelasFase = `Kelas ${prev.identitas.kelas} (Fase ${prev.identitas.fase})`;

  // 1. Format Modul Ajar
  let nextModul: ModulAjarState = {
    ...prev.modulAjar,
    materiPelajaran: materi,
    alokasiWaktu: alokasi,
    capaianPembelajaran: cp,
    tujuanPembelajaran: tp,
    modelPembelajaran: model,
  };

  if (targets.modul) {
    const alokasiPendahuluan = timeBreak?.alokasiPendahuluan ?? prev.modulAjar.alokasiPendahuluan;
    const alokasiInti = timeBreak?.alokasiInti ?? prev.modulAjar.alokasiInti;
    const alokasiPenutup = timeBreak?.alokasiPenutup ?? prev.modulAjar.alokasiPenutup;

    const contextualSintaks = modelMeta.sintaks.map((s, idx) => ({
      ...s,
      aktivitas: s.aktivitas.map((act, aIdx) =>
        aIdx === 0
          ? `[${materi}] ${act.replace(/^\[[^\]]+\]\s*/, '')}`
          : act,
      ),
      ...(idx === 2
        ? {
            aktivitas: [
              `Kelompok menganalisis materi "${materi}" sesuai ${tp} pada LKPD (level SOLO Relational C4) dalam alokasi ${alokasiInti}.`,
              ...s.aktivitas.slice(1),
            ],
          }
        : {}),
    }));

    nextModul = {
      ...nextModul,
      alokasiPendahuluan,
      alokasiInti,
      alokasiPenutup,
      kesiapanMurid: `Peserta didik ${kelasFase} memiliki pengetahuan awal yang beragam mengenai "${materi}". Diferensiasi difasilitasi melalui media bertingkat: kelompok visual dengan peta konsep & teks bergambar ${materi}, kelompok kinestetik dengan kartu peran/praktik langsung, serta kelompok auditori dengan simak-ucap pelafalan Bahasa Jawa.`,
      karakteristikMateri: `Materi "${materi}" mencakup pengetahuan faktual, konseptual, prosedural, dan metakognitif dalam Bahasa Jawa. Dirancang kontekstual agar murid mampu mencapai: ${tp}`,
      dimensiChecklist: {
        ...prev.modulAjar.dimensiChecklist,
        penalaranKritis: {
          checked: true,
          deskripsi: `Menganalisis unsur, kaidah, serta makna kontekstual pada materi ${materi} berbasis bukti teks/tuturan (C4).`,
        },
        kreativitas: {
          checked: true,
          deskripsi: `Merancang produk/karya kreatif Bahasa Jawa bertema ${materi} sesuai minat murid (C6).`,
        },
        kolaborasi: {
          checked: true,
          deskripsi: `Bekerja sama dalam kelompok heterogen mendiskusikan dan mempresentasikan hasil telaah ${materi}.`,
        },
        komunikasi: {
          checked: true,
          deskripsi: `Menyajikan hasil analisis ${materi} di depan kelas dengan unggah-ungguh bahasa yang santun dan percaya diri.`,
        },
      },
      praktikPedagogis: {
        pendekatan: `Deep Learning (Bermakna, Berkesadaran, Menggembirakan) & Pembelajaran Kontekstual Bahasa Jawa pada topik ${materi}.`,
        metode: `Diskusi kelompok berdiferensiasi, telaah sumber belajar ${materi}, dan presentasi unjuk kerja (${alokasi}).`,
      },
      lingkunganKemitraan: {
        ...prev.modulAjar.lingkunganKemitraan,
        budayaBelajar: `Budaya saling menyimak dengan santun, berani bertanya, dan antusias mempelajari ${materi}.`,
      },
      pemanfaatanDigital: {
        ...prev.modulAjar.pemanfaatanDigital,
        mediaBahanAjar: `Bahan Ajar Peta Konsep, LKPD C4–C6, dan Kartu Stimulus "${materi}".`,
      },
      pendahuluan: [
        `Orientasi, Salam Hangat Bahasa Jawa, dan Doa Bersama dipimpin murid (Keimanan dan Ketaqwaan) — alokasi total ${alokasi}.`,
        `Latihan fokus (Mindful Breathing) dan pengondisian kesiapan belajar murid ${kelasFase}.`,
        `Apersepsi Bermakna & Pemantik: Guru mengaitkan pengalaman sehari-hari murid dengan topik "${materi}".`,
        `Penyampaian Tujuan Pembelajaran: ${tp}`,
      ],
      intiSintaks: contextualSintaks,
      penutup: [
        `DEEP LEARNING – MEREFLEKSI: Murid menuliskan 3 hal bermakna yang dipelajari tentang "${materi}" dan 1 penerapan nyata di rumah.`,
        `Menyimpulkan Pembelajaran: Guru dan murid merumuskan intisari konsep serta nilai budi pekerti dari materi "${materi}".`,
        `Asesmen Formatif Singkat & Umpan Balik: Evaluasi ketercapaian TP terkait ${materi}.`,
        `Tindak lanjut tugas pengayaan/remedial serta doa penutup.`,
      ],
      asesmenFormatif: [
        `Penilaian Sikap & Proses: Observasi 7 Dimensi Profil Lulusan selama diskusi materi ${materi}.`,
        `Penilaian Keterampilan & Produk: Rubrik LKPD analisis C4–C6 dan unjuk kerja presentasi topik ${materi}.`,
      ],
      asesmenSumatif: `Asesmen tertulis & unjuk kerja topik "${materi}" pada level C4–C6 Taksonomi SOLO (Relational–Extended Abstract) untuk mengukur ketercapaian: ${tp}`,
    };
  }

  // 2. Materi Ajar
  const nextMateri: MateriAjarState = targets.materi
    ? {
        ...prev.materiAjar,
        materiIntiInput: `${materi}: ${tp}`,
        judulMateri: materi,
        bab,
        tujuanPembelajaran: tp,
        petaKonsep: {
          pusat: materi,
          cabang: presetPack.cabang,
        },
        paragrafRingkasan: [
          `Materi "${materi}" merupakan bagian penting pembelajaran Bahasa Jawa ${kelasFase} yang mengacu pada capaian: ${cp}`,
          `Fokus pembelajaran pada pertemuan ini (${alokasi}) diarahkan agar ${tp.charAt(0).toLowerCase() + tp.slice(1)} Melalui pemahaman konsep dan kaidah secara mendalam, murid diajak tidak hanya menghafal, tetapi juga menalar dan merasakan nilai budaya Jawa.`,
          `Dalam konteks kehidupan sehari-hari, penguasaan "${materi}" melatih kepekaan rasa, ketepatan berbahasa, dan sikap santun (andhap asor) saat berinteraksi di keluarga, sekolah, maupun masyarakat.`,
        ],
        kosakataPenting: presetPack.kosakata,
        contohKontekstual: presetPack.contoh,
      }
    : prev.materiAjar;

  // 3. Soal Formatif & Sumatif
  let nextSoalFormatif = prev.soalFormatif;
  let nextSoalSumatif = prev.soalSumatif;

  if (targets.soal) {
    const matchedKktp =
      typeof params.tpIndex === 'number' && params.tpIndex >= 0
        ? prev.kktpRows[params.tpIndex]
        : prev.kktpRows.find(
            (k) => k.tujuanPembelajaran.toLowerCase().includes(materi.toLowerCase()),
          ) || prev.kktpRows[0];

    const kktpText = matchedKktp
      ? `Tuntas apabila mencapai kategori Baik (${matchedKktp.baik}) dengan skor minimal 76 pada materi ${materi}.`
      : `Murid dinyatakan tuntas pada materi ${materi} apabila memperoleh nilai minimal 76.`;

    const kisiBase: KisiKisiRow[] = [
      {
        id: `kisi_mod_${stamp}_1`,
        no: 1,
        tp,
        materi,
        indikatorSoal: `Disajikan teks/stimulus terkait ${materi}, murid ${kelasFase} menganalisis unsur utama atau kaidah Bahasa Jawa dengan tepat.`,
        levelKognitif: 'C4 (Menganalisis)',
        bentukSoal: 'Pilihan Ganda ABCD',
        noSoal: '1',
      },
      {
        id: `kisi_mod_${stamp}_2`,
        no: 2,
        tp,
        materi,
        indikatorSoal: `Murid memilih dua pernyataan atau contoh yang benar sesuai kaidah ${materi}.`,
        levelKognitif: 'C4–C5 (SOLO Relational)',
        bentukSoal: 'Pilihan Ganda Kompleks / MCMA',
        noSoal: '2',
      },
      {
        id: `kisi_mod_${stamp}_3`,
        no: 3,
        tp,
        materi,
        indikatorSoal: `Murid melengkapi istilah/konsep kunci dalam materi ${materi}.`,
        levelKognitif: 'C4',
        bentukSoal: 'Isian Pendek',
        noSoal: '3',
      },
      {
        id: `kisi_mod_${stamp}_4`,
        no: 4,
        tp,
        materi,
        indikatorSoal: `Murid mengevaluasi dan menyintesis penerapan ${materi} dalam konteks kehidupan nyata.`,
        levelKognitif: 'C5–C6 (Extended Abstract)',
        bentukSoal: 'Essay',
        noSoal: '4',
      },
    ];

    const vocab0 = presetPack.kosakata[0];
    const vocab1 = presetPack.kosakata[1];
    const generatedFormatifSoal: SoalItem[] = [
      {
        id: `sf_mod_${stamp}_1`,
        no: 1,
        bentuk: 'Pilihan Ganda ABCD',
        pertanyaan: `Ing pasinaon bab "${materi}", perangan kang paling wigati kanggo nggayuh tujuan "${tp}" yaiku...`,
        opsi: [
          `A. Nggatekake kaidah, makna, lan konteks panggunaan ${materi} kanthi tuhu.`,
          'B. Ngapalake tembung tanpa mangerteni tegese ing ukara.',
          'C. Nggunakake basa sakarepe dhewe tanpa nggatekake unggah-ungguh.',
          'D. Nglirwakake piwulang budi pekerti kang ana ing teks.',
        ],
        kunciJawaban: 'A',
        skorMaksimal: 20,
        pedomanPenskoran: 'Skor 20 jika memilih A, skor 0 jika salah.',
      },
      {
        id: `sf_mod_${stamp}_2`,
        no: 2,
        bentuk: 'Pilihan Ganda Kompleks / MCMA',
        pertanyaan: `Pilihlah DUA pernyataan yang benar mengenai materi "${materi}" (${bab})!`,
        opsi: [
          `A. Pemahaman ${materi} membantu murid menganalisis makna dan nilai budi pekerti secara kritis.`,
          `B. Materi ${materi} tidak memiliki keterkaitan dengan kehidupan sehari-hari.`,
          `C. Penerapan ${materi} dalam komunikasi harus memperhatikan konteks dan kesantunan Bahasa Jawa.`,
          'D. Kaidah Bahasa Jawa boleh diabaikan seluruhnya dalam penulisan karya.',
        ],
        kunciJawaban: 'A dan C',
        skorMaksimal: 25,
        pedomanPenskoran: 'Skor 25 jika memilih A & C, skor 12 jika 1 jawaban benar.',
      },
      {
        id: `sf_mod_${stamp}_3`,
        no: 3,
        bentuk: 'Isian Pendek',
        pertanyaan: `Ing kawruh basa bab "${materi}", tembung ngoko "${vocab0?.ngoko || 'sinau'}" menawa didadekake basa krama dadi .... (artine: ${vocab0?.arti || 'belajar'})`,
        opsi: [],
        kunciJawaban: vocab0?.krama || 'sinau / ngudi kawruh',
        skorMaksimal: 15,
        pedomanPenskoran: 'Skor 15 jika menjawab kata krama dengan tepat.',
      },
      {
        id: `sf_mod_${stamp}_4`,
        no: 4,
        bentuk: 'Essay',
        pertanyaan: `Analisisen (C4–C5) kepriye carane ngetrapake nilai utawa kaidah saka materi "${materi}" ing lingkungan sekolah lan kulawarga, banjur wenehana 1 tuladha ukara/tindakan nyata!`,
        opsi: [],
        kunciJawaban: `Murid menjelaskan keterkaitan kaidah ${materi} dengan sikap santun/budi pekerti dan menuliskan 1 contoh penerapan nyata yang sesuai kaidah Bahasa Jawa.`,
        skorMaksimal: 25,
        pedomanPenskoran: 'Analisis kritis tepat = 15 poin; contoh penerapan kontekstual = 10 poin.',
      },
      {
        id: `sf_mod_${stamp}_5`,
        no: 5,
        bentuk: 'Tes Lisan',
        pertanyaan: `Andharna kanthi lisan ing ngarep kelas: tuladha ukara utawa pitutur saka materi "${materi}" nganggo kosakata "${vocab1?.krama || 'matur'}" lan intonasi kang trep!`,
        opsi: [],
        kunciJawaban: `Pelafalan jelas, diksi Bahasa Jawa sesuai materi ${materi}, dan sikap komunikatif.`,
        skorMaksimal: 15,
        pedomanPenskoran: 'Kesesuaian isi materi (10 poin) + pelafalan & kesantunan (5 poin).',
      },
    ];

    const generatedSumatifSoal: SoalItem[] = [
      {
        id: `ss_mod_${stamp}_1`,
        no: 1,
        bentuk: 'Pilihan Ganda ABCD',
        pertanyaan: `Gatekna pethikan materi "${materi}" iki:\n${presetPack.contoh}\n\nSaka pethikan kasebut, dudutan (simpulan) kang paling trep miturut tujuan pembelajaran yaiku...`,
        opsi: [
          `A. Ngutamakake pangerten kaidah lan nilai luhur sajrone "${materi}" kanggo dipraktekake.`,
          'B. Maca cepet tanpa nggoleki amanat utawa struktur teks.',
          'C. Ngganti kabeh tembung Jawa nganggo basa manca.',
          'D. Mung ngelingi judhule wae tanpa mangerteni isine.',
        ],
        kunciJawaban: 'A',
        skorMaksimal: 25,
        pedomanPenskoran: 'Benar = 25, Salah = 0.',
      },
      {
        id: `ss_mod_${stamp}_2`,
        no: 2,
        bentuk: 'Pilihan Ganda Kompleks / MCMA',
        pertanyaan: `Pilihlah DUA ciri atau kaidah yang sesuai dengan pembahasan "${materi}" pada ${kelasFase}!`,
        opsi: [
          `A. ${presetPack.cabang[0]?.poin[0] || `Memahami konsep dasar ${materi}`}`,
          'B. Tidak memerlukan penalaran atau pemahaman konteks budaya.',
          `C. ${presetPack.cabang[2]?.poin[0] || `Menerapkan ${materi} secara santun dalam kehidupan sehari-hari`}`,
          'D. Melarang murid berdiskusi dan bekerja sama dalam kelompok.',
        ],
        kunciJawaban: 'A dan C',
        skorMaksimal: 25,
        pedomanPenskoran: 'Benar kedua opsi = 25, benar 1 = 12, salah = 0.',
      },
      {
        id: `ss_mod_${stamp}_3`,
        no: 3,
        bentuk: 'Pilihan Ganda ABCD',
        pertanyaan: `Ing materi "${materi}", kosakata basa krama kanggo tembung "${vocab1?.ngoko || 'ngomong'}" kang tegese "${vocab1?.arti || 'berbicara'}" yaiku...`,
        opsi: [
          `A. ${vocab1?.krama || 'Matur / Ngendika'}`,
          `B. ${vocab0?.ngoko || 'Mangan'}`,
          'C. Turu',
          'D. Lungguh',
        ],
        kunciJawaban: 'A',
        skorMaksimal: 25,
        pedomanPenskoran: 'Benar = 25, Salah = 0.',
      },
      {
        id: `ss_mod_${stamp}_4`,
        no: 4,
        bentuk: 'Pilihan Ganda Kompleks / MCMA',
        pertanyaan: `Pilihlah DUA langkah tepat untuk mengevaluasi penguasaan materi "${materi}" secara mendalam (SOLO C4–C6)!`,
        opsi: [
          `A. Menghubungkan konsep ${materi} dengan contoh kasus nyata di masyarakat.`,
          'B. Menyalin jawaban teman tanpa memahami proses analisis.',
          `C. Menciptakan karya atau kalimat Bahasa Jawa bertema ${materi} secara mandiri.`,
          'D. Mengabaikan umpan balik perbaikan dari guru.',
        ],
        kunciJawaban: 'A dan C',
        skorMaksimal: 25,
        pedomanPenskoran: 'Benar kedua opsi = 25, benar 1 = 12, salah = 0.',
      },
    ];

    nextSoalFormatif = {
      ...prev.soalFormatif,
      intiMateri: `${materi} — ${tp}`,
      kktp: kktpText,
      kisiKisi: kisiBase,
      soal: generatedFormatifSoal,
      pedomanUmum: `Asesmen Formatif topik "${materi}" (${alokasi}). Nilai Akhir = (Total Skor / 100) x 100. Skor >= 76 dinyatakan tuntas KKTP.`,
    };

    nextSoalSumatif = {
      ...prev.soalSumatif,
      intiMateri: `${materi} (${bab})`,
      kktp: `Tuntas Sumatif ${kelasFase} pada topik "${materi}" apabila murid mencapai nilai >= 76.`,
      kisiKisi: kisiBase.slice(0, 2).map((k) => ({
        ...k,
        bentukSoal: k.no === 1 ? 'Pilihan Ganda ABCD' : 'Pilihan Ganda Kompleks / MCMA',
      })),
      soal: generatedSumatifSoal,
      pedomanUmum: `Asesmen Sumatif materi "${materi}". Nilai Sumatif = (Total Skor Perolehan / 100) x 100.`,
    };
  }

  // 4. Format Penilaian (15 Instrumen)
  const nextPenilaianList: PenilaianInstrument[] = targets.penilaian
    ? prev.penilaianList.map((inst) => {
        switch (inst.id) {
          case 'rubrik_lkpd':
            return {
              ...inst,
              deskripsi: `Menilai ketepatan analisis isi, kaidah Bahasa Jawa, dan kedalaman berpikir kritis (C4–C6) pada materi "${materi}".`,
              baris: [
                [
                  presetPack.aspekRubrik[0] || `Ketepatan Analisis ${materi}`,
                  `Mampu menganalisis dan menyintesis seluruh unsur ${materi} secara kritis beserta bukti akurat.`,
                  `Mampu menganalisis sebagian besar unsur ${materi} dengan bukti cukup tepat.`,
                  `Mampu mengidentifikasi unsur dasar ${materi} namun analisis belum mendalam.`,
                  `Belum mampu mengidentifikasi unsur utama ${materi} tanpa bimbingan penuh.`,
                ],
                [
                  presetPack.aspekRubrik[1] || `Penerapan Kaidah ${materi}`,
                  `Penggunaan kaidah Bahasa Jawa pada topik ${materi} sangat tepat sesuai konteks.`,
                  `Penggunaan kaidah ${materi} tepat dengan 1–2 kekeliruan minor.`,
                  `Terdapat beberapa ketidaksesuaian kaidah pada tugas ${materi}.`,
                  `Belum dapat menerapkan kaidah dasar ${materi}.`,
                ],
                inst.baris[2] || [
                  'Kelengkapan & Kerapian Produk',
                  'LKPD terisi lengkap, runtut, kreatif, dan mudah dipahami.',
                  'LKPD terisi lengkap dan cukup rapi.',
                  'Sebagian LKPD terisi namun kurang terstruktur.',
                  'LKPD belum selesai dan kurang terbaca.',
                ],
              ],
            };
          case 'rubrik_studi_kasus':
            return {
              ...inst,
              deskripsi: `Menilai kemampuan murid memecahkan persoalan kontekstual terkait "${materi}" (${kelasFase}).`,
              baris: [
                [
                  `Identifikasi Masalah Kasus ${materi}`,
                  `Mengidentifikasi akar masalah ${materi} secara tajam (SOLO Relational).`,
                  `Mengidentifikasi masalah utama ${materi} dengan cukup jelas.`,
                  `Hanya menyebutkan gejala masalah di permukaan.`,
                  `Kesulitan menentukan inti permasalahan ${materi}.`,
                ],
                [
                  'Argumentasi & Solusi (C5–C6)',
                  `Memberikan solusi orisinal terkait ${materi} yang realistis dan selaras budaya Jawa.`,
                  `Memberikan solusi logis namun masih bersifat umum.`,
                  `Solusi kurang relevan dengan konteks kasus ${materi}.`,
                  `Belum mampu merumuskan solusi.`,
                ],
              ],
            };
          case 'rubrik_simulasi':
            return {
              ...inst,
              deskripsi: `Menilai unjuk kerja, pelafalan, ekspresi, dan ketepatan praktik materi "${materi}".`,
              baris: [
                [
                  `Pelafalan & Intonasi (${materi})`,
                  `Pelafalan Bahasa Jawa saat praktik ${materi} sangat fasih, ekspresif, dan wajar.`,
                  `Pelafalan jelas dan intonasi cukup sesuai.`,
                  `Pelafalan kadang ragu dan intonasi datar.`,
                  `Pelafalan kurang jelas dan sering terbata-bata.`,
                ],
                [
                  `Penguasaan Konten & Unggah-Ungguh`,
                  `Pilihan diksi dan sikap tubuh sangat tepat sesuai konteks ${materi}.`,
                  `Diksi dan sikap cukup sesuai konteks ${materi}.`,
                  `Masih ada kekeliruan penerapan kaidah ${materi}.`,
                  `Belum menerapkan kaidah ${materi} dengan tepat.`,
                ],
              ],
            };
          case 'sumatif_akhir_materi':
            return {
              ...inst,
              judul: `Rekapitulasi Asesmen Sumatif Akhir Materi: ${materi}`,
              deskripsi: `Rekap capaian murid ${kelasFase} pada lingkup materi "${materi}" berdasarkan KKTP.`,
            };
          case 'analisis_penilaian':
            return {
              ...inst,
              deskripsi: `Pemetaan persentase ketuntasan klasikal butir soal untuk topik "${materi}".`,
              baris: [
                ['1', `TP 1: Analisis ${materi}`, '25', '28', '89.3%', 'Diterima / Tuntas'],
                ['2', `TP 2: Kaidah & Kosakata ${materi}`, '22', '28', '78.6%', 'Diterima / Tuntas'],
                ['3', `TP 3: Penerapan Kontekstual ${materi}`, '18', '28', '64.3%', 'Perlu Penguatan'],
              ],
            };
          case 'tindak_lanjut':
            return {
              ...inst,
              deskripsi: `Langkah strategis guru menindaklanjuti hasil penilaian topik "${materi}".`,
              baris: [
                [
                  `Sebagian murid masih perlu penguatan pada penerapan mendalam materi "${materi}".`,
                  `Kurangnya variasi contoh kontekstual dan latihan mandiri (${alokasi}).`,
                  `Bimbingan kelompok kecil menggunakan peta konsep & kartu latihan "${materi}".`,
                  'Pertemuan Minggu Depan',
                  'Guru Mata Pelajaran',
                ],
              ],
            };
          case 'refleksi_akhir_bab':
            return {
              ...inst,
              deskripsi: `Evaluasi holistik pembelajaran Bahasa Jawa ${kelasFase} pada pembahasan "${materi}".`,
              baris: [
                [
                  'Ketercapaian Tujuan',
                  `Apakah seluruh murid mampu mencapai TP "${materi}" pada level berpikir kritis (C4–C6)?`,
                  `Sebagian besar murid (85%) berhasil memahami dan mempraktikkan materi ${materi} dengan baik.`,
                ],
                [
                  'Kegembiraan & Kebermaknaan',
                  `Bagian kegiatan mana pada materi ${materi} yang paling bermakna bagi murid?`,
                  `Diskusi kelompok ${modelMeta.shortLabel} dan presentasi karya membuat murid aktif dan antusias.`,
                ],
                [
                  'Perbaikan Pertemuan Berikutnya',
                  `Apa penyesuaian media atau diferensiasi untuk topik ${materi}?`,
                  `Menyediakan stimulus audio/visual tambahan agar murid auditori dan visual lebih cepat memahami ${materi}.`,
                ],
              ],
            };
          default:
            return inst;
        }
      })
    : prev.penilaianList;

  return {
    ...prev,
    modulAjar: nextModul,
    materiAjar: nextMateri,
    soalFormatif: nextSoalFormatif,
    soalSumatif: nextSoalSumatif,
    penilaianList: nextPenilaianList,
  };
}

export interface ModulSyncCascadeAiPayload {
  modulAjar?: Partial<ModulAjarState>;
  materiAjar?: Partial<MateriAjarState>;
  soalFormatif?: {
    kktp?: string;
    kisiKisi?: Array<Omit<KisiKisiRow, 'id'>>;
    soal?: Array<Omit<SoalItem, 'id'>>;
    pedomanUmum?: string;
  };
  soalSumatif?: {
    kktp?: string;
    kisiKisi?: Array<Omit<KisiKisiRow, 'id'>>;
    soal?: Array<Omit<SoalItem, 'id'>>;
    pedomanUmum?: string;
  };
  penilaianUpdates?: Array<{
    id: string;
    judul?: string;
    deskripsi?: string;
    baris?: string[][];
    catatan?: string;
  }>;
}

export function applyAiModulCascadeResult(
  prev: AppState,
  aiRes: ModulSyncCascadeAiPayload,
  targets: ModulSyncTargets,
): AppState {
  const stamp = Date.now();
  const timeBreak = parseAlokasiBreakdown(prev.modulAjar.alokasiWaktu);
  const modelMeta = MODEL_PEMBELAJARAN_META[prev.modulAjar.modelPembelajaran];

  const nextModul: ModulAjarState =
    targets.modul && aiRes.modulAjar
      ? {
          ...prev.modulAjar,
          kesiapanMurid: aiRes.modulAjar.kesiapanMurid || prev.modulAjar.kesiapanMurid,
          karakteristikMateri: aiRes.modulAjar.karakteristikMateri || prev.modulAjar.karakteristikMateri,
          dimensiChecklist: aiRes.modulAjar.dimensiChecklist || prev.modulAjar.dimensiChecklist,
          capaianPembelajaran: aiRes.modulAjar.capaianPembelajaran || prev.modulAjar.capaianPembelajaran,
          tujuanPembelajaran: aiRes.modulAjar.tujuanPembelajaran || prev.modulAjar.tujuanPembelajaran,
          praktikPedagogis: aiRes.modulAjar.praktikPedagogis || prev.modulAjar.praktikPedagogis,
          lingkunganKemitraan: aiRes.modulAjar.lingkunganKemitraan || prev.modulAjar.lingkunganKemitraan,
          pemanfaatanDigital: aiRes.modulAjar.pemanfaatanDigital || prev.modulAjar.pemanfaatanDigital,
          pendahuluan: Array.isArray(aiRes.modulAjar.pendahuluan)
            ? aiRes.modulAjar.pendahuluan
            : prev.modulAjar.pendahuluan,
          alokasiPendahuluan: timeBreak?.alokasiPendahuluan || aiRes.modulAjar.alokasiPendahuluan || prev.modulAjar.alokasiPendahuluan,
          intiSintaks:
            Array.isArray(aiRes.modulAjar.intiSintaks) && aiRes.modulAjar.intiSintaks.length > 0
              ? aiRes.modulAjar.intiSintaks
              : modelMeta.sintaks,
          alokasiInti: timeBreak?.alokasiInti || aiRes.modulAjar.alokasiInti || prev.modulAjar.alokasiInti,
          penutup: Array.isArray(aiRes.modulAjar.penutup) ? aiRes.modulAjar.penutup : prev.modulAjar.penutup,
          alokasiPenutup: timeBreak?.alokasiPenutup || aiRes.modulAjar.alokasiPenutup || prev.modulAjar.alokasiPenutup,
          asesmenFormatif: Array.isArray(aiRes.modulAjar.asesmenFormatif)
            ? aiRes.modulAjar.asesmenFormatif
            : prev.modulAjar.asesmenFormatif,
          asesmenSumatif: aiRes.modulAjar.asesmenSumatif || prev.modulAjar.asesmenSumatif,
        }
      : prev.modulAjar;

  const nextMateri: MateriAjarState =
    targets.materi && aiRes.materiAjar
      ? {
          ...prev.materiAjar,
          materiIntiInput: `${prev.modulAjar.materiPelajaran}: ${nextModul.tujuanPembelajaran}`,
          judulMateri: aiRes.materiAjar.judulMateri || prev.modulAjar.materiPelajaran,
          bab: aiRes.materiAjar.bab || prev.materiAjar.bab,
          tujuanPembelajaran: aiRes.materiAjar.tujuanPembelajaran || nextModul.tujuanPembelajaran,
          petaKonsep: aiRes.materiAjar.petaKonsep || prev.materiAjar.petaKonsep,
          paragrafRingkasan:
            Array.isArray(aiRes.materiAjar.paragrafRingkasan) && aiRes.materiAjar.paragrafRingkasan.length > 0
              ? aiRes.materiAjar.paragrafRingkasan
              : prev.materiAjar.paragrafRingkasan,
          kosakataPenting:
            Array.isArray(aiRes.materiAjar.kosakataPenting) && aiRes.materiAjar.kosakataPenting.length > 0
              ? aiRes.materiAjar.kosakataPenting
              : prev.materiAjar.kosakataPenting,
          contohKontekstual: aiRes.materiAjar.contohKontekstual || prev.materiAjar.contohKontekstual,
        }
      : prev.materiAjar;

  const nextSoalFormatif =
    targets.soal && aiRes.soalFormatif
      ? {
          ...prev.soalFormatif,
          intiMateri: `${prev.modulAjar.materiPelajaran} — ${nextModul.tujuanPembelajaran}`,
          kktp: aiRes.soalFormatif.kktp || prev.soalFormatif.kktp,
          kisiKisi: Array.isArray(aiRes.soalFormatif.kisiKisi) && aiRes.soalFormatif.kisiKisi.length > 0
            ? aiRes.soalFormatif.kisiKisi.map((k, i) => ({
                ...k,
                id: `kk_f_ai_${stamp}_${i}`,
                no: k.no || i + 1,
              }))
            : prev.soalFormatif.kisiKisi,
          soal: Array.isArray(aiRes.soalFormatif.soal) && aiRes.soalFormatif.soal.length > 0
            ? aiRes.soalFormatif.soal.slice(0, 15).map((s, i) => ({
                ...s,
                id: `sl_f_ai_${stamp}_${i}`,
                no: s.no || i + 1,
                bentuk: (s.bentuk as BentukSoalFormatif) || 'Pilihan Ganda ABCD',
                opsi: Array.isArray(s.opsi) ? s.opsi : [],
                skorMaksimal: Number(s.skorMaksimal) || 20,
                pedomanPenskoran: s.pedomanPenskoran || 'Sesuai kunci jawaban',
              }))
            : prev.soalFormatif.soal,
          pedomanUmum: aiRes.soalFormatif.pedomanUmum || prev.soalFormatif.pedomanUmum,
        }
      : prev.soalFormatif;

  const nextSoalSumatif =
    targets.soal && aiRes.soalSumatif
      ? {
          ...prev.soalSumatif,
          intiMateri: `${prev.modulAjar.materiPelajaran} (${nextMateri.bab})`,
          kktp: aiRes.soalSumatif.kktp || prev.soalSumatif.kktp,
          kisiKisi: Array.isArray(aiRes.soalSumatif.kisiKisi) && aiRes.soalSumatif.kisiKisi.length > 0
            ? aiRes.soalSumatif.kisiKisi.map((k, i) => ({
                ...k,
                id: `kk_s_ai_${stamp}_${i}`,
                no: k.no || i + 1,
              }))
            : prev.soalSumatif.kisiKisi,
          soal: Array.isArray(aiRes.soalSumatif.soal) && aiRes.soalSumatif.soal.length > 0
            ? aiRes.soalSumatif.soal.slice(0, 30).map((s, i) => ({
                ...s,
                id: `sl_s_ai_${stamp}_${i}`,
                no: s.no || i + 1,
                bentuk: (s.bentuk as BentukSoalFormatif) || 'Pilihan Ganda ABCD',
                opsi: Array.isArray(s.opsi) ? s.opsi : [],
                skorMaksimal: Number(s.skorMaksimal) || 20,
                pedomanPenskoran: s.pedomanPenskoran || 'Sesuai kunci jawaban',
              }))
            : prev.soalSumatif.soal,
          pedomanUmum: aiRes.soalSumatif.pedomanUmum || prev.soalSumatif.pedomanUmum,
        }
      : prev.soalSumatif;

  const updatesById = new Map((aiRes.penilaianUpdates || []).map((u) => [u.id, u]));
  const nextPenilaianList =
    targets.penilaian && updatesById.size > 0
      ? prev.penilaianList.map((inst) => {
          const upd = updatesById.get(inst.id);
          if (!upd) return inst;
          return {
            ...inst,
            judul: upd.judul || inst.judul,
            deskripsi: upd.deskripsi || inst.deskripsi,
            baris:
              Array.isArray(upd.baris) && upd.baris.length > 0
                ? upd.baris.map((r) => inst.kolom.map((_, idx) => r[idx] ?? ''))
                : inst.baris,
            catatan: upd.catatan || inst.catatan,
          };
        })
      : prev.penilaianList;

  return {
    ...prev,
    modulAjar: nextModul,
    materiAjar: nextMateri,
    soalFormatif: nextSoalFormatif,
    soalSumatif: nextSoalSumatif,
    penilaianList: nextPenilaianList,
  };
}


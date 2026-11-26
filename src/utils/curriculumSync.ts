import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import type {
  AppState,
  AtpRow,
  CpElement,
  KktpRow,
  MonthKey,
  PromesRow,
  ProtaRow,
  TpRow,
} from '../types';
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
): AppState {
  const stamp = Date.now();

  const identitas = {
    ...prev.identitas,
    ...(detectedIdentitas?.fase ? { fase: detectedIdentitas.fase } : {}),
    ...(detectedIdentitas?.kelas ? { kelas: detectedIdentitas.kelas } : {}),
    ...(detectedIdentitas?.tahunPelajaran ? { tahunPelajaran: detectedIdentitas.tahunPelajaran } : {}),
  };

  const normalizedTp: TpRow[] = tpRows.map((t, i) => ({
    ...t,
    id: t.id || `tp_${stamp}_${i}`,
    no: t.no || i + 1,
    semester: t.semester === 'Genap' ? 'Genap' : 'Gasal',
  }));

  // 2. ATP
  const atpRows: AtpRow[] = normalizedTp.map((t, i) => {
    const rich = enrichedItems?.[i];
    const cleanMater =
      rich?.lingkupMateri ||
      t.bab.replace(/^Bab\s*\d+\s*[:.\-]?\s*/i, '').trim() ||
      t.bab;
    return {
      id: `atp_sync_${stamp}_${i}`,
      no: i + 1,
      elemen: t.elemen,
      capaianPembelajaran: t.cp,
      tujuanPembelajaran: t.tp,
      lingkupMateri: cleanMater,
      dimensiProfilLulusan:
        Array.isArray(rich?.dimensiProfilLulusan) && rich.dimensiProfilLulusan.length > 0
          ? rich.dimensiProfilLulusan
          : ['Penalaran Kritis', 'Komunikasi'],
      waktuJp: Number(rich?.waktuJp) || 8,
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
    return {
      id: `kktp_sync_${stamp}_${i}`,
      kodeTp: k?.kodeTp || `TP.${i + 1}`,
      tujuanPembelajaran: t.tp,
      perluBimbingan:
        k?.perluBimbingan ||
        'Belum mampu memahami konsep dasar materi dan memerlukan pendampingan intensif.',
      cukup:
        k?.cukup ||
        'Mampu memahami konsep dasar namun penerapan kaidah Bahasa Jawa masih perlu latihan.',
      baik:
        k?.baik ||
        'Mampu menganalisis dan menerapkan kaidah Bahasa Jawa dalam konteks nyata dengan tepat.',
      sangatBaik:
        k?.sangatBaik ||
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

  // 6. Jurnal Mengajar (initial entries synced from first 2 TPs)
  const jurnalRows = normalizedTp.slice(0, 3).map((t, i) => ({
    id: `jurnal_sync_${stamp}_${i}`,
    pertemuanKe: i + 1,
    hariTgl: identitas.kotaTanggal.split(',').slice(1).join(',').trim() || '16 Oktober 2026',
    bab: t.bab,
    tp: t.tp,
    materiPokok: atpRows[i]?.lingkupMateri || t.bab,
    ringkasanKegiatan: `Pembelajaran mendalam materi ${atpRows[i]?.lingkupMateri || t.bab} melalui diskusi kelompok dan unjuk kerja.`,
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

  // 10. Soal Formatif & Sumatif (Kisi-kisi & Inti Materi synced)
  const kisiFromTp = normalizedTp.slice(0, 6).map((t, i) => ({
    id: `kisi_sync_${stamp}_${i}`,
    no: i + 1,
    tp: t.tp,
    materi: atpRows[i]?.lingkupMateri || t.bab,
    indikatorSoal: `Disajikan stimulus teks/kasus ${atpRows[i]?.lingkupMateri || t.bab}, murid dapat menganalisis dan memecahkan soal sesuai TP.`,
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
    kktp: `Tuntas Sumatif apabila murid mencapai skor >= 76 pada cakupan materi: ${allMaterSummary}.`,
    kisiKisi: kisiFromTp,
  };

  // 11. Format Penilaian (update Analisis Penilaian & STS/SAS rows to reference imported TPs)
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
        deskripsi: `Evaluasi holistik pembelajaran Bahasa Jawa untuk materi: ${allMaterSummary}.`,
      };
    }
    return inst;
  });

  return {
    ...prev,
    identitas,
    cpElements,
    tpRows: normalizedTp,
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

  // Direct JSON backup restore
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

  const nextState = cascadeAllMenusFromCpTp(
    currentState,
    cpElements,
    tpRows,
    richTpList,
    aiResult.detectedIdentitas,
  );

  return {
    nextState,
    summary: `Berhasil meng-import ${cpElements.length} Elemen CP & ${tpRows.length} TP dari "${file.name}" dan langsung menghubungkannya ke seluruh 11 sub-menu.`,
  };
}

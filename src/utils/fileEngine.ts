import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import type { AppState, MenuId, MonthKey } from '../types';
import { MODEL_PEMBELAJARAN_META } from '../data/defaultData';
import { extractDocumentWithAi, type ExtractedDocumentResult } from './apiClient';

export type ExportFormat = 'docx' | 'xlsx' | 'csv' | 'json' | 'txt' | 'pdf';

export const MENU_LABELS: Record<MenuId, string> = {
  analisis_cp: 'Analisis Capaian Pembelajaran',
  atp: 'Alur Tujuan Pembelajaran (ATP)',
  alokasi_waktu: 'Analisis Alokasi Waktu',
  kktp: 'KKTP',
  prota_promes: 'Prota & Promes',
  jurnal: 'Jurnal Mengajar',
  modul_ajar: 'Modul Ajar Deep Learning',
  materi_ajar: 'Materi Ajar',
  lkpd: 'LKPD',
  soal: 'Soal Formatif & Sumatif',
  penilaian: 'Format Penilaian',
};

const MONTHS: MonthKey[] = [
  'jul', 'ags', 'sep', 'okt', 'nov', 'des',
  'jan', 'feb', 'mar', 'apr', 'mei', 'jun',
];

function buildDocxTable(headers: string[], rows: Array<Array<string | number>>): Table {
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: 'CBD5E1',
  };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h) =>
        new TableCell({
          shading: { fill: '1B4353' },
          borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 19 })],
            }),
          ],
        }),
    ),
  });

  const bodyRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              borders: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: String(cell ?? ''), size: 19 })],
                }),
              ],
            }),
        ),
      }),
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows],
  });
}

function p(text: string, options?: { bold?: boolean; heading?: typeof HeadingLevel[keyof typeof HeadingLevel]; spaceAfter?: number }): Paragraph {
  return new Paragraph({
    heading: options?.heading,
    spacing: { after: options?.spaceAfter ?? 120 },
    children: [new TextRun({ text, bold: options?.bold, size: options?.heading ? undefined : 21 })],
  });
}

function buildSignatureBlock(state: AppState): Table {
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const borders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
  const { identitas } = state;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              p('Mengetahui,'),
              p('Kepala Sekolah'),
              p(''),
              p(''),
              p(identitas.namaKepalaSekolah, { bold: true, spaceAfter: 40 }),
              p(`NIP. ${identitas.nipKepalaSekolah}`),
            ],
          }),
          new TableCell({
            borders,
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              p(identitas.kotaTanggal),
              p('Guru Kelas / Mata Pelajaran'),
              p(''),
              p(''),
              p(identitas.namaGuru, { bold: true, spaceAfter: 40 }),
              p(`NIP. ${identitas.nipGuru}`),
            ],
          }),
        ],
      }),
    ],
  });
}

function getStructuredMenuExport(menu: MenuId, state: AppState): {
  title: string;
  metaLines: string[];
  sections: Array<{ heading: string; headers?: string[]; rows?: Array<Array<string | number>>; paragraphs?: string[] }>;
} {
  const { identitas } = state;
  const baseMeta = [
    `Satuan Pendidikan: ${identitas.satuanPendidikan}`,
    `Mata Pelajaran: ${identitas.mataPelajaran}`,
    `Fase / Kelas / Semester: ${identitas.fase} / ${identitas.kelas} / ${identitas.semester}`,
    `Tahun Pelajaran: ${identitas.tahunPelajaran}`,
  ];

  switch (menu) {
    case 'analisis_cp':
      return {
        title: 'ANALISIS CAPAIAN PEMBELAJARAN',
        metaLines: [
          `Satuan Pendidikan: ${identitas.satuanPendidikan}`,
          `Kelas / Semester: ${identitas.kelas} / ${identitas.semester}`,
          `Tahun Pelajaran: ${identitas.tahunPelajaran}`,
        ],
        sections: [
          {
            heading: 'Elemen & Capaian Pembelajaran',
            headers: ['Elemen', 'Capaian Pembelajaran'],
            rows: state.cpElements.map((e) => [e.elemen, e.capaianPembelajaran]),
          },
          {
            heading: 'Penurunan CP menjadi Tujuan Pembelajaran (TP)',
            headers: ['No', 'Bab', 'Elemen', 'CP', 'TP', 'Semester'],
            rows: state.tpRows.map((r) => [r.no, r.bab, r.elemen, r.cp, r.tp, r.semester]),
          },
        ],
      };

    case 'atp':
      return {
        title: 'ALUR TUJUAN PEMBELAJARAN (ATP)',
        metaLines: baseMeta,
        sections: [
          {
            heading: 'Tabel Alur Tujuan Pembelajaran',
            headers: ['No', 'Elemen', 'Capaian Pembelajaran', 'Tujuan Pembelajaran', 'Lingkup Materi', 'Dimensi Profil Lulusan', 'Waktu (JP)'],
            rows: state.atpRows.map((r) => [
              r.no,
              r.elemen,
              r.capaianPembelajaran,
              r.tujuanPembelajaran,
              r.lingkupMateri,
              r.dimensiProfilLulusan.join(', '),
              r.waktuJp,
            ]),
          },
        ],
      };

    case 'alokasi_waktu': {
      const aw = state.alokasiWaktu;
      const sumG = aw.bulanGasal.reduce(
        (acc, b) => ({
          m: acc.m + b.jumlahMinggu,
          h: acc.h + b.jumlahHariEfektif,
          me: acc.me + b.jumlahMingguEfektif,
        }),
        { m: 0, h: 0, me: 0 },
      );
      const sumN = aw.bulanGenap.reduce(
        (acc, b) => ({
          m: acc.m + b.jumlahMinggu,
          h: acc.h + b.jumlahHariEfektif,
          me: acc.me + b.jumlahMingguEfektif,
        }),
        { m: 0, h: 0, me: 0 },
      );
      const totG = sumG.me * aw.calcGasal.jpPerMinggu;
      const effG = totG - aw.calcGasal.jamFormatif - aw.calcGasal.jamSumatif - aw.calcGasal.cadangan;
      const totN = sumN.me * aw.calcGenap.jpPerMinggu;
      const effN = totN - aw.calcGenap.jamFormatif - aw.calcGenap.jamSumatif - aw.calcGenap.cadangan;
      const totDist =
        aw.distribusi.reduce((s, d) => s + d.alokasiJp, 0) + aw.sumatifTotal + aw.formatifTotal + aw.cadanganTotal;

      return {
        title: 'ANALISIS ALOKASI WAKTU',
        metaLines: [
          `Sekolah: ${identitas.satuanPendidikan}`,
          `Tahun Pelajaran: ${identitas.tahunPelajaran}`,
          `Kelas: ${identitas.kelas}`,
          `Mata Pelajaran: ${identitas.mataPelajaran}`,
        ],
        sections: [
          {
            heading: '1. Perhitungan Alokasi Waktu Banyaknya Minggu dalam Satu Semester 1 (Gasal)',
            headers: ['No', 'Nama Bulan', 'Jumlah Minggu', 'Jumlah Hari Belajar Efektif', 'Jumlah Minggu Efektif', 'Ket'],
            rows: [
              ...aw.bulanGasal.map((b) => [b.no, b.namaBulan, b.jumlahMinggu, b.jumlahHariEfektif, b.jumlahMingguEfektif, b.ket]),
              ['', 'Jumlah', sumG.m, sumG.h, sumG.me, ''],
            ],
            paragraphs: [
              `a. Jumlah Minggu Efektif: ${sumG.me} x ${aw.calcGasal.jpPerMinggu} = ${totG} JP`,
              `b. Jumlah jam efektif KBM/minggu: ${aw.calcGasal.jamEfektifKbmPerMinggu}`,
              `c. Jumlah Jam untuk asesmen formatif: ${aw.calcGasal.jamFormatif}`,
              `d. Jumlah Jam untuk asesmen sumatif: ${aw.calcGasal.jamSumatif}`,
              `e. Cadangan: ${aw.calcGasal.cadangan}`,
              `f. Jumlah Jam efektif: ${effG}`,
            ],
          },
          {
            heading: '2. Perhitungan Alokasi Waktu Banyaknya Minggu dalam Satu Semester 2 (Genap)',
            headers: ['No', 'Nama Bulan', 'Jumlah Minggu', 'Jumlah Hari Belajar Efektif', 'Jumlah Minggu Efektif', 'Ket'],
            rows: [
              ...aw.bulanGenap.map((b) => [b.no, b.namaBulan, b.jumlahMinggu, b.jumlahHariEfektif, b.jumlahMingguEfektif, b.ket]),
              ['', 'Jumlah', sumN.m, sumN.h, sumN.me, ''],
            ],
            paragraphs: [
              `a. Jumlah Minggu Efektif: ${sumN.me} x ${aw.calcGenap.jpPerMinggu} = ${totN} JP`,
              `b. Jumlah jam efektif KBM/minggu: ${aw.calcGenap.jamEfektifKbmPerMinggu}`,
              `c. Jumlah Jam untuk asesmen formatif: ${aw.calcGenap.jamFormatif}`,
              `d. Jumlah Jam untuk asesmen sumatif: ${aw.calcGenap.jamSumatif}`,
              `e. Cadangan: ${aw.calcGenap.cadangan}`,
              `f. Jumlah Jam efektif: ${effN}`,
            ],
          },
          {
            heading: `3. Distribusi Alokasi Waktu (@${aw.menitPerJp} Menit)`,
            headers: ['Semester', 'Materi Pokok', `Alokasi Waktu @${aw.menitPerJp}'`],
            rows: [
              ...aw.distribusi.map((d) => [d.semester, d.materiPokok, d.alokasiJp]),
              ['', 'Sumatif', aw.sumatifTotal],
              ['', 'Formatif', aw.formatifTotal],
              ['', 'Cadangan', aw.cadanganTotal],
              ['', 'Jumlah', totDist],
            ],
          },
        ],
      };
    }

    case 'kktp':
      return {
        title: 'KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)',
        metaLines: baseMeta,
        sections: [
          {
            heading: 'Rubrik Interval KKTP',
            headers: ['Kode TP', 'Tujuan Pembelajaran (TP)', 'Perlu Bimbingan (0-60)', 'Cukup (61-75)', 'Baik (76-90)', 'Sangat Baik (91-100)'],
            rows: state.kktpRows.map((k) => [k.kodeTp, k.tujuanPembelajaran, k.perluBimbingan, k.cukup, k.baik, k.sangatBaik]),
          },
        ],
      };

    case 'prota_promes':
      return {
        title: 'PROGRAM TAHUNAN (PROTA) & PROGRAM SEMESTER (PROMES)',
        metaLines: baseMeta,
        sections: [
          {
            heading: 'Program Tahunan (Prota)',
            headers: ['No', 'Alur Tujuan Pembelajaran (ATP)', 'Materi Pokok', 'Semester', 'Alokasi Waktu (JP)'],
            rows: state.protaRows.map((r) => [r.no, r.atp, r.materiPokok, r.semester, r.alokasiJp]),
          },
          {
            heading: 'Program Semester (Promes)',
            headers: ['No', 'TP', 'Materi Pokok', 'Sem', 'JP', ...MONTHS.map((m) => m.toUpperCase())],
            rows: state.promesRows.map((r) => [
              r.no,
              r.tp,
              r.materiPokok,
              r.semester,
              r.alokasiJp,
              ...MONTHS.map((m) => (r.bulan[m] ? '✓' : '')),
            ]),
          },
        ],
      };

    case 'jurnal':
      return {
        title: 'JURNAL MENGAJAR GURU',
        metaLines: baseMeta,
        sections: [
          {
            heading: 'Catatan Pelaksanaan Pembelajaran',
            headers: ['Pertemuan Ke', 'Hari/Tgl', 'Bab', 'TP', 'Materi Pokok', 'Ringkasan Kegiatan', 'Absensi', 'Metode', 'Penilaian', 'Refleksi'],
            rows: state.jurnalRows.map((j) => [
              j.pertemuanKe,
              j.hariTgl,
              j.bab,
              j.tp,
              j.materiPokok,
              j.ringkasanKegiatan,
              j.absensi,
              j.metode,
              j.penilaian,
              j.refleksi,
            ]),
          },
        ],
      };

    case 'modul_ajar': {
      const m = state.modulAjar;
      const modelLabel = MODEL_PEMBELAJARAN_META[m.modelPembelajaran].label;
      return {
        title: `PERENCANAAN PEMBELAJARAN MENDALAM (DEEP LEARNING) - ${identitas.satuanPendidikan}`,
        metaLines: [
          `Tahun Ajaran: ${identitas.tahunPelajaran}`,
          `Kelas / Fase / Semester: ${identitas.kelas} / ${identitas.fase} / ${identitas.semester}`,
          `Mata Pelajaran: ${m.mataPelajaran}`,
          `Materi Pelajaran: ${m.materiPelajaran}`,
          `Alokasi Waktu: ${m.alokasiWaktu}`,
          `Model Pembelajaran: ${modelLabel}`,
        ],
        sections: [
          {
            heading: 'A. IDENTIFIKASI',
            paragraphs: [
              `Identifikasi Kesiapan Murid: ${m.kesiapanMurid}`,
              `Karakteristik Materi Pelajaran: ${m.karakteristikMateri}`,
              `[${m.dimensiChecklist.penalaranKritis.checked ? '✓' : ' '}] Penalaran Kritis: ${m.dimensiChecklist.penalaranKritis.deskripsi}`,
              `[${m.dimensiChecklist.kreativitas.checked ? '✓' : ' '}] Kreativitas: ${m.dimensiChecklist.kreativitas.deskripsi}`,
              `[${m.dimensiChecklist.kolaborasi.checked ? '✓' : ' '}] Kolaborasi: ${m.dimensiChecklist.kolaborasi.deskripsi}`,
              `[${m.dimensiChecklist.kemandirian.checked ? '✓' : ' '}] Kemandirian: ${m.dimensiChecklist.kemandirian.deskripsi}`,
              `[${m.dimensiChecklist.komunikasi.checked ? '✓' : ' '}] Komunikasi: ${m.dimensiChecklist.komunikasi.deskripsi}`,
              `[${m.dimensiChecklist.keimanan.checked ? '✓' : ' '}] Keimanan dan Ketaqwaan: ${m.dimensiChecklist.keimanan.deskripsi}`,
              `[${m.dimensiChecklist.kewargaan.checked ? '✓' : ' '}] Kewargaan: ${m.dimensiChecklist.kewargaan.deskripsi}`,
            ],
          },
          {
            heading: 'B. DESAIN PEMBELAJARAN',
            paragraphs: [
              `Capaian Pembelajaran: ${m.capaianPembelajaran}`,
              `Tujuan Pembelajaran (SOLO C4-C6): ${m.tujuanPembelajaran}`,
              `1. Praktik Pedagogis — Pendekatan: ${m.praktikPedagogis.pendekatan} | Model: ${modelLabel} | Metode: ${m.praktikPedagogis.metode}`,
              `2. Lingkungan Pembelajaran & Kemitraan — Budaya Belajar: ${m.lingkunganKemitraan.budayaBelajar} | Ruang Fisik: ${m.lingkunganKemitraan.ruangFisik} | Kemitraan: ${m.lingkunganKemitraan.kemitraanAntarmurid}`,
              `3. Pemanfaatan Digital & Media — Platform: ${m.pemanfaatanDigital.platform} | Perangkat: ${m.pemanfaatanDigital.perangkat} | Media: ${m.pemanfaatanDigital.mediaBahanAjar}`,
            ],
          },
          {
            heading: 'C. PENGALAMAN BELAJAR',
            headers: ['Kegiatan', 'Deskripsi Kegiatan', 'Alokasi'],
            rows: [
              ['Pendahuluan (Memahami)', m.pendahuluan.map((x) => `• ${x}`).join('\n'), m.alokasiPendahuluan],
              [
                `Inti (Memahami, Mengaplikasi)\nModel: ${modelLabel}`,
                m.intiSintaks
                  .map((s) => `${s.sintakTitle} [${s.deepLearningTag}]\n${s.aktivitas.map((a) => `- ${a}`).join('\n')}`)
                  .join('\n\n'),
                m.alokasiInti,
              ],
              ['Penutup (Merefleksi)', m.penutup.map((x) => `• ${x}`).join('\n'), m.alokasiPenutup],
            ],
          },
          {
            heading: 'D. ASESMEN PEMBELAJARAN',
            paragraphs: [
              ...m.asesmenFormatif.map((f) => `Asesmen Formatif: ${f}`),
              `Asesmen Sumatif: ${m.asesmenSumatif}`,
            ],
          },
        ],
      };
    }

    case 'materi_ajar': {
      const ma = state.materiAjar;
      return {
        title: `MATERI AJAR: ${ma.judulMateri}`,
        metaLines: [...baseMeta, `Bab: ${ma.bab}`],
        sections: [
          {
            heading: 'Tujuan Pembelajaran & Peta Konsep',
            paragraphs: [
              `Tujuan Pembelajaran: ${ma.tujuanPembelajaran}`,
              `Pusat Peta Konsep: ${ma.petaKonsep.pusat}`,
              ...ma.petaKonsep.cabang.map((c) => `- ${c.judul}: ${c.poin.join('; ')}`),
            ],
          },
          {
            heading: 'Ringkasan Materi',
            paragraphs: ma.paragrafRingkasan,
          },
          {
            heading: 'Kosakata Penting (Ngoko – Krama)',
            headers: ['Ngoko', 'Krama', 'Arti'],
            rows: ma.kosakataPenting.map((k) => [k.ngoko, k.krama, k.arti]),
          },
          {
            heading: 'Contoh Kontekstual',
            paragraphs: [ma.contohKontekstual],
          },
        ],
      };
    }

    case 'lkpd': {
      const l = state.lkpd;
      return {
        title: l.judulLkpd,
        metaLines: [
          ...baseMeta,
          'Nama Siswa: __________________ | No. Absen: ____ | Kelas: ____ | Nilai: ____',
        ],
        sections: [
          {
            heading: 'Tujuan Pembelajaran & Apersepsi',
            paragraphs: [`Tujuan Pembelajaran: ${l.tujuanPembelajaran}`, `Kegiatan Apersepsi: ${l.apersepsi}`],
          },
          {
            heading: 'Kegiatan Inti (Berpikir Kritis & Presentasi)',
            paragraphs: [
              `Petunjuk: ${l.kegiatanInti.petunjuk}`,
              `Stimulus / Teks:\n${l.kegiatanInti.stimulus}`,
              ...l.kegiatanInti.tugasKritis,
              `Panduan Presentasi: ${l.kegiatanInti.panduanPresentasi}`,
            ],
          },
          {
            heading: 'Lembar Refleksi Siswa',
            paragraphs: l.refleksiSiswa.map((r, i) => `${i + 1}. ${r}\nJawaban: ............................................................`),
          },
        ],
      };
    }

    case 'soal': {
      const mapPaket = (label: string, p: typeof state.soalFormatif) => [
        {
          heading: `Kisi-Kisi ${label}`,
          headers: ['No', 'TP', 'Materi', 'Indikator Soal', 'Level Kognitif', 'Bentuk Soal', 'No Soal'],
          rows: p.kisiKisi.map((k) => [k.no, k.tp, k.materi, k.indikatorSoal, k.levelKognitif, k.bentukSoal, k.noSoal]),
        },
        {
          heading: `Naskah ${label} & Kunci Jawaban`,
          headers: ['No', 'Bentuk', 'Pertanyaan & Pilihan Jawaban', 'Kunci', 'Skor', 'Pedoman Penskoran'],
          rows: p.soal.map((s) => [
            s.no,
            s.bentuk,
            `${s.pertanyaan}${s.opsi.length ? '\n' + s.opsi.join('\n') : ''}`,
            s.kunciJawaban,
            s.skorMaksimal,
            s.pedomanPenskoran,
          ]),
          paragraphs: [`KKTP: ${p.kktp}`, `Pedoman Umum: ${p.pedomanUmum}`],
        },
      ];

      return {
        title: 'BANK SOAL FORMATIF & SUMATIF BAHASA JAWA',
        metaLines: baseMeta,
        sections: [...mapPaket('Soal Formatif', state.soalFormatif), ...mapPaket('Soal Sumatif', state.soalSumatif)],
      };
    }

    case 'penilaian':
      return {
        title: 'FORMAT INSTRUMEN PENILAIAN FORMATIF & SUMATIF',
        metaLines: baseMeta,
        sections: state.penilaianList.map((item) => ({
          heading: item.judul,
          headers: item.kolom,
          rows: item.baris,
          paragraphs: [item.deskripsi, `Catatan: ${item.catatan}`],
        })),
      };
  }
}

export async function exportMenuDocument(menu: MenuId | 'all', format: ExportFormat, state: AppState): Promise<void> {
  if (format === 'pdf') {
    window.print();
    return;
  }

  const baseFilename =
    menu === 'all'
      ? `Perangkat_Bahasa_Jawa_${state.identitas.satuanPendidikan.replace(/\s+/g, '_')}`
      : `${MENU_LABELS[menu].replace(/[^a-zA-Z0-9]+/g, '_')}_${state.identitas.kelas}`;

  if (format === 'json') {
    const content = menu === 'all' ? state : { menu, identitas: state.identitas, data: getStructuredMenuExport(menu, state) };
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json;charset=utf-8' });
    saveAs(blob, `${baseFilename}.json`);
    return;
  }

  const targetMenus: MenuId[] =
    menu === 'all'
      ? ['analisis_cp', 'atp', 'alokasi_waktu', 'kktp', 'prota_promes', 'jurnal', 'modul_ajar', 'materi_ajar', 'lkpd', 'soal', 'penilaian']
      : [menu];

  if (format === 'xlsx') {
    const wb = XLSX.utils.book_new();
    targetMenus.forEach((mId) => {
      const structured = getStructuredMenuExport(mId, state);
      structured.sections.forEach((sec, idx) => {
        const aoa: Array<Array<string | number>> = [];
        if (idx === 0) {
          aoa.push([structured.title]);
          structured.metaLines.forEach((ml) => aoa.push([ml]));
          aoa.push([]);
        }
        aoa.push([sec.heading]);
        if (sec.headers && sec.rows) {
          aoa.push(sec.headers);
          sec.rows.forEach((r) => aoa.push(r));
        }
        if (sec.paragraphs) {
          aoa.push([]);
          sec.paragraphs.forEach((pr) => aoa.push([pr]));
        }
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const sheetName = `${mId.slice(0, 18)}_${idx + 1}`.slice(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });
    });
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([out], { type: 'application/octet-stream' }), `${baseFilename}.xlsx`);
    return;
  }

  if (format === 'csv') {
    const lines: string[] = [];
    const escapeCsv = (v: string | number) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    targetMenus.forEach((mId) => {
      const structured = getStructuredMenuExport(mId, state);
      lines.push(escapeCsv(structured.title));
      structured.metaLines.forEach((ml) => lines.push(escapeCsv(ml)));
      structured.sections.forEach((sec) => {
        lines.push('');
        lines.push(escapeCsv(sec.heading));
        if (sec.headers && sec.rows) {
          lines.push(sec.headers.map(escapeCsv).join(','));
          sec.rows.forEach((r) => lines.push(r.map(escapeCsv).join(',')));
        }
        if (sec.paragraphs) {
          sec.paragraphs.forEach((pr) => lines.push(escapeCsv(pr)));
        }
      });
    });
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${baseFilename}.csv`);
    return;
  }

  if (format === 'txt') {
    const out: string[] = [];
    targetMenus.forEach((mId) => {
      const structured = getStructuredMenuExport(mId, state);
      out.push(`========================================\n${structured.title}\n========================================`);
      structured.metaLines.forEach((ml) => out.push(ml));
      structured.sections.forEach((sec) => {
        out.push(`\n--- ${sec.heading} ---`);
        if (sec.headers && sec.rows) {
          out.push(sec.headers.join(' | '));
          sec.rows.forEach((r) => out.push(r.join(' | ')));
        }
        if (sec.paragraphs) {
          sec.paragraphs.forEach((pr) => out.push(pr));
        }
      });
      out.push('\n');
    });
    const blob = new Blob([out.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${baseFilename}.txt`);
    return;
  }

  // Word (.docx)
  const children: Array<Paragraph | Table> = [];
  targetMenus.forEach((mId, menuIdx) => {
    const structured = getStructuredMenuExport(mId, state);
    if (menuIdx > 0) {
      children.push(new Paragraph({ pageBreakBefore: true, children: [] }));
    }
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: structured.title, bold: true, size: 28, color: '1B4353' })],
      }),
    );
    structured.metaLines.forEach((ml) => children.push(p(ml, { spaceAfter: 60 })));
    children.push(p(''));

    structured.sections.forEach((sec) => {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 160, after: 100 },
          children: [new TextRun({ text: sec.heading, bold: true, size: 23, color: '0F172A' })],
        }),
      );
      if (sec.headers && sec.rows) {
        children.push(buildDocxTable(sec.headers, sec.rows));
        children.push(p(''));
      }
      if (sec.paragraphs) {
        sec.paragraphs.forEach((pr) => children.push(p(pr, { spaceAfter: 80 })));
      }
    });
  });

  children.push(p(''));
  children.push(buildSignatureBlock(state));

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${baseFilename}.docx`);
}

export interface ImportedFileData {
  kind: 'full_state' | 'table_rows' | 'text_document';
  fileName: string;
  state?: AppState;
  rows?: string[][];
  text?: string;
  aiExtracted?: ExtractedDocumentResult;
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

export async function parseAnyUploadedFile(file: File, targetMenu: string): Promise<ImportedFileData> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (ext === 'json') {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.identitas && parsed.tpRows && parsed.modulAjar) {
      return { kind: 'full_state', fileName: file.name, state: parsed as AppState };
    }
    return { kind: 'text_document', fileName: file.name, text: JSON.stringify(parsed, null, 2) };
  }

  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<string[]>(firstSheet, { header: 1, defval: '' }) as string[][];
    const flatText = rows.map((r) => r.filter(Boolean).join(' | ')).filter(Boolean).join('\n');
    return { kind: 'table_rows', fileName: file.name, rows, text: flatText };
  }

  if (ext === 'docx') {
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    const text = result.value.trim();
    return { kind: 'text_document', fileName: file.name, text };
  }

  if (ext === 'txt' || ext === 'md' || ext === 'html' || ext === 'xml') {
    const text = await file.text();
    return { kind: 'text_document', fileName: file.name, text };
  }

  // Binary / PDF / Image fallback using Gemini extraction
  const buf = await file.arrayBuffer();
  const base64Data = arrayBufferToBase64(buf);
  const mimeType = file.type || (ext === 'pdf' ? 'application/pdf' : 'application/octet-stream');
  const aiExtracted = await extractDocumentWithAi({ mimeType, base64Data, targetMenu });
  return {
    kind: 'text_document',
    fileName: file.name,
    text: aiExtracted.extractedText || '',
    aiExtracted,
  };
}

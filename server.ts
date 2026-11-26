import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi pada panel Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractJson(text: string | undefined): unknown {
  if (!text) return null;
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let start = -1;
    let end = -1;
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = cleaned.lastIndexOf(']');
    } else if (firstBrace !== -1) {
      start = firstBrace;
      end = cleaned.lastIndexOf('}');
    }
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('Respons AI tidak berbentuk JSON yang valid.');
  }
}

app.post('/api/generate', async (req, res) => {
  try {
    const { task, payload } = req.body as { task: string; payload: Record<string, unknown> };
    if (!task) {
      return res.status(400).json({ error: 'Parameter task wajib diisi.' });
    }

    const ai = getAiClient();

    const systemInstruction = `Anda adalah pakar kurikulum merdeka, pembelajaran mendalam (Deep Learning: Bermakna, Berkesadaran, Menggembirakan), Taksonomi SOLO (Prestructural, Unistructural, Multistructural, Relational [C4], Extended Abstract [C5-C6]), dan guru profesional Mata Pelajaran Bahasa Jawa (SD/SMP/SMA di Indonesia, menguasai Ngoko, Krama, Aksara Jawa, Tembang Macapat, Wayang, Geguritan, Crita Rakyat, Paribasan, dan Sastra Jawa).
Selalu berikan jawaban dalam format JSON murni sesuai skema yang diminta tanpa teks pembuka atau penutup di luar JSON. Gunakan bahasa Indonesia edukatif yang dipadukan dengan kosakata/contoh Bahasa Jawa yang autentik dan tepat secara unggah-ungguh.`;

    let prompt = '';

    switch (task) {
      case 'cp_to_tp': {
        prompt = `Turunkan daftar Elemen & Capaian Pembelajaran (CP) Bahasa Jawa berikut menjadi Tujuan Pembelajaran (TP) yang operasional, terukur, dan bernuansa HOTS/SOLO.
Identitas: ${JSON.stringify(payload.identitas)}
Daftar Elemen & CP: ${JSON.stringify(payload.cpElements)}

Kembalikan JSON array of objects dengan properti persis:
[
  {
    "no": 1,
    "bab": "Bab 1 - ...",
    "elemen": "Nama elemen dari CP",
    "cp": "Ringkasan/teks CP terkait",
    "tp": "Tujuan pembelajaran lengkap (mengandung unsur ABCD / kompetensi Bahasa Jawa)",
    "semester": "Gasal" | "Genap"
  }
]
Buat minimal 6–10 TP yang mencakup semester Gasal dan Genap secara seimbang.`;
        break;
      }

      case 'atp_enrich': {
        prompt = `Berdasarkan daftar Tujuan Pembelajaran (TP) Bahasa Jawa berikut, lengkapi menjadi Alur Tujuan Pembelajaran (ATP) yang utuh.
Identitas: ${JSON.stringify(payload.identitas)}
TP Input: ${JSON.stringify(payload.tpRows)}

Kembalikan JSON array of objects dengan properti persis:
[
  {
    "no": 1,
    "elemen": "...",
    "capaianPembelajaran": "...",
    "tujuanPembelajaran": "...",
    "lingkupMateri": "Materi pokok spesifik Bahasa Jawa (misal: Crita Rakyat / Tembang Pangkur / Aksara Jawa / Unggah-Ungguh Basa)",
    "dimensiProfilLulusan": ["Penalaran Kritis", "Komunikasi"],
    "waktuJp": 8,
    "semester": "Gasal" | "Genap"
  }
]
Gunakan hanya nama dimensi dari: "Keimanan dan Ketaqwaan", "Kewargaan", "Penalaran Kritis", "Kreativitas", "Kolaborasi", "Kemandirian", "Komunikasi".`;
        break;
      }

      case 'kktp_generate': {
        prompt = `Buatkan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) interval nilai untuk setiap Tujuan Pembelajaran Bahasa Jawa berikut.
Identitas: ${JSON.stringify(payload.identitas)}
TP List: ${JSON.stringify(payload.tpRows)}

Kembalikan JSON array of objects dengan properti persis:
[
  {
    "kodeTp": "TP.1.1",
    "tujuanPembelajaran": "...",
    "perluBimbingan": "Deskripsi capaian rentang 0-60...",
    "cukup": "Deskripsi capaian rentang 61-75...",
    "baik": "Deskripsi capaian rentang 76-90...",
    "sangatBaik": "Deskripsi capaian rentang 91-100..."
  }
]`;
        break;
      }

      case 'modul_ajar': {
        prompt = `Buatkan konten lengkap Perencanaan Pembelajaran Mendalam (Deep Learning) Mata Pelajaran ${payload.mataPelajaran || 'Bahasa Jawa'} berorientasi Taksonomi SOLO level Relational (C4) dan Extended Abstract (C5–C6).
Data Input Guru:
- Satuan Pendidikan: ${payload.sekolah}
- Tahun Ajaran: ${payload.tahunAjaran}
- Kelas / Fase / Semester: ${payload.kelasFaseSemester}
- Mata Pelajaran: ${payload.mataPelajaran}
- Materi Pelajaran: ${payload.materiPelajaran}
- Alokasi Waktu: ${payload.alokasiWaktu}
- Model Pembelajaran Dipilih: ${payload.modelPembelajaran}
- Sintak Model yang harus diikuti: ${JSON.stringify(payload.sintaks)}

Kembalikan JSON object dengan properti persis:
{
  "kesiapanMurid": "Paragraf identifikasi kesiapan murid & diferensiasi (visual, kinestetik, auditori) sesuai materi Bahasa Jawa ini...",
  "karakteristikMateri": "Paragraf karakteristik materi (faktual, konseptual, prosedural, metakognitif) relevan dengan kehidupan nyata...",
  "dimensiChecklist": {
    "penalaranKritis": { "checked": true, "deskripsi": "..." },
    "kreativitas": { "checked": true, "deskripsi": "..." },
    "kolaborasi": { "checked": true, "deskripsi": "..." },
    "kemandirian": { "checked": false, "deskripsi": "..." },
    "komunikasi": { "checked": true, "deskripsi": "..." },
    "keimanan": { "checked": false, "deskripsi": "..." },
    "kewargaan": { "checked": false, "deskripsi": "..." }
  },
  "capaianPembelajaran": "CP Bahasa Jawa yang sesuai...",
  "tujuanPembelajaran": "TP format ABCD pada level C4-C6 (SOLO Relational/Extended Abstract)...",
  "praktikPedagogis": {
    "pendekatan": "Deep Learning (Bermakna, Berkesadaran, Menggembirakan), Experiential Learning, dan Contextual Inquiry Bahasa Jawa.",
    "metode": "Diskusi kelompok berdiferensiasi, analisis teks/tembang, dan presentasi unjuk kerja."
  },
  "lingkunganKemitraan": {
    "budayaBelajar": "...",
    "ruangFisik": "...",
    "kemitraanAntarmurid": "..."
  },
  "pemanfaatanDigital": {
    "platform": "...",
    "perangkat": "...",
    "mediaBahanAjar": "..."
  },
  "pendahuluan": ["...", "...", "...", "..."],
  "intiSintaks": [
    {
      "sintakTitle": "Sintak 1: ...",
      "deepLearningTag": "DEEP LEARNING - MEMAHAMI (Bermakna & Menggembirakan)",
      "aktivitas": ["...", "...", "..."]
    }
  ],
  "penutup": ["...", "...", "...", "..."],
  "asesmenFormatif": ["...", "..."],
  "asesmenSumatif": "Deskripsi asesmen sumatif level C4-C6 & Taksonomi SOLO (Relational - Extended Abstract)..."
}
Pastikan jumlah item dalam intiSintaks persis sesuai daftar sintak model pembelajaran yang diberikan!`;
        break;
      }

      case 'materi_ajar': {
        prompt = `Buatkan Bahan / Materi Ajar lengkap Bahasa Jawa dari materi inti berikut.
Identitas: ${JSON.stringify(payload.identitas)}
Materi Inti / Teks Sumber:
${payload.materiInti}

Kembalikan JSON object dengan properti persis:
{
  "judulMateri": "...",
  "bab": "...",
  "tujuanPembelajaran": "...",
  "petaKonsep": {
    "pusat": "Topik Utama",
    "cabang": [
      {
        "judul": "Subtopik 1",
        "poin": ["Detail 1", "Detail 2", "Detail 3"]
      }
    ]
  },
  "paragrafRingkasan": [
    "Paragraf 1...",
    "Paragraf 2...",
    "Paragraf 3..."
  ],
  "kosakataPenting": [
    { "ngoko": "...", "krama": "...", "arti": "..." }
  ],
  "contohKontekstual": "Contoh penerapan nyata / teks Bahasa Jawa lengkap..."
}`;
        break;
      }

      case 'lkpd': {
        prompt = `Buatkan Lembar Kerja Peserta Didik (LKPD) Bahasa Jawa yang interaktif, mendorong berpikir kritis (HOTS C4-C6 / SOLO), dan diakhiri kegiatan presentasi kelompok serta lembar refleksi siswa.
Identitas: ${JSON.stringify(payload.identitas)}
Materi yang dijadikan LKPD:
${payload.materiInput}

Kembalikan JSON object dengan properti persis:
{
  "judulLkpd": "...",
  "tujuanPembelajaran": "...",
  "apersepsi": "1 kegiatan apersepsi singkat yang memantik rasa ingin tahu murid...",
  "kegiatanInti": {
    "petunjuk": "...",
    "stimulus": "Teks/kasus/tembang Bahasa Jawa sebagai bahan analisis...",
    "tugasKritis": [
      "Pertanyaan/tugas analisis C4...",
      "Pertanyaan/tugas evaluasi C5...",
      "Tugas kreasi/proyek C6..."
    ],
    "panduanPresentasi": "Instruksi konkret mengajak siswa mempresentasikan hasil karyanya di depan kelas..."
  },
  "refleksiSiswa": [
    "Apa hal baru yang paling bermakna yang kamu pelajari hari ini?",
    "Bagian mana dari materi Bahasa Jawa ini yang masih menantang bagimu?",
    "Bagaimana kamu akan menerapkan unggah-ungguh atau nilai materi ini di rumah/sekolah?"
  ]
}`;
        break;
      }

      case 'soal_formatif': {
        const jumlah = Math.min(Number(payload.jumlahSoal) || 10, 15);
        prompt = `Buatkan paket Asesmen Formatif Bahasa Jawa lengkap berdasarkan inti materi berikut.
Inti Materi: ${payload.intiMateri}
Jenis Soal Diminta: ${JSON.stringify(payload.jenisSoal || ['Pilihan Ganda ABCD', 'Pilihan Ganda Kompleks / MCMA', 'Isian Pendek', 'Essay', 'Tes Lisan'])}
Jumlah Soal Total (maksimum 15): ${jumlah}
Identitas: ${JSON.stringify(payload.identitas)}

Kembalikan JSON object dengan properti persis:
{
  "kktp": "Kriteria Ketercapaian Tujuan Pembelajaran untuk asesmen formatif ini...",
  "kisiKisi": [
    {
      "no": 1,
      "tp": "...",
      "materi": "...",
      "indikatorSoal": "...",
      "levelKognitif": "C4 (Menganalisis) - SOLO Relational",
      "bentukSoal": "Pilihan Ganda ABCD",
      "noSoal": "1"
    }
  ],
  "soal": [
    {
      "no": 1,
      "bentuk": "Pilihan Ganda ABCD" | "Pilihan Ganda Kompleks / MCMA" | "Essay" | "Tes Lisan" | "Isian Pendek",
      "pertanyaan": "...",
      "opsi": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "kunciJawaban": "...",
      "skorMaksimal": 10,
      "pedomanPenskoran": "..."
    }
  ],
  "pedomanUmum": "Rumus nilai akhir = (Skor Perolehan / Skor Maksimal) x 100 dan deskripsi tindak lanjut..."
}`;
        break;
      }

      case 'soal_sumatif': {
        const jumlah = Math.min(Number(payload.jumlahSoal) || 20, 30);
        prompt = `Buatkan paket Asesmen Sumatif Bahasa Jawa lengkap berdasarkan inti materi berikut.
Inti Materi: ${payload.intiMateri}
Variasi Soal: Pilihan Ganda ABCD dan Pilihan Ganda Kompleks / MCMA.
Jumlah Soal Total (maksimum 30): ${jumlah}
Identitas: ${JSON.stringify(payload.identitas)}

Kembalikan JSON object dengan properti persis:
{
  "kktp": "KKTP Sumatif...",
  "kisiKisi": [
    {
      "no": 1,
      "tp": "...",
      "materi": "...",
      "indikatorSoal": "...",
      "levelKognitif": "C4 / C5 / C6",
      "bentukSoal": "Pilihan Ganda ABCD" | "Pilihan Ganda Kompleks / MCMA",
      "noSoal": "1"
    }
  ],
  "soal": [
    {
      "no": 1,
      "bentuk": "Pilihan Ganda ABCD" | "Pilihan Ganda Kompleks / MCMA",
      "pertanyaan": "...",
      "opsi": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "kunciJawaban": "...",
      "skorMaksimal": 5,
      "pedomanPenskoran": "..."
    }
  ],
  "pedomanUmum": "Rumus penskoran dan konversi nilai 0-100..."
}`;
        break;
      }

      case 'penilaian_rubrik': {
        prompt = `Buatkan instrumen penilaian lengkap Bahasa Jawa untuk kategori: "${payload.kategori}" dengan topik/materi "${payload.materi}".
Kembalikan JSON object dengan properti persis:
{
  "judul": "Instrumen ${payload.kategori}",
  "deskripsi": "...",
  "kolom": ["Aspek / Kriteria", "Skor 4 (Sangat Baik)", "Skor 3 (Baik)", "Skor 2 (Cukup)", "Skor 1 (Perlu Bimbingan)"],
  "baris": [
    ["Kriteria 1...", "...", "...", "...", "..."],
    ["Kriteria 2...", "...", "...", "...", "..."],
    ["Kriteria 3...", "...", "...", "...", "..."]
  ],
  "catatan": "Pedoman penskoran & tindak lanjut..."
}`;
        break;
      }

      case 'jurnal_entry': {
        prompt = `Buatkan 1 entri Jurnal Mengajar Bahasa Jawa yang realistis dan bermakna.
Input Guru: Bab=${payload.bab}, TP=${payload.tp}, Materi=${payload.materiPokok}
Kembalikan JSON object:
{
  "ringkasanKegiatan": "...",
  "metode": "...",
  "penilaian": "...",
  "refleksi": "..."
}`;
        break;
      }

      case 'import_cp_tp_cascade': {
        prompt = `Analisis dokumen CP / TP Bahasa Jawa yang di-upload guru berikut ini secara menyeluruh, lalu ekstrak dan susun menjadi struktur kurikulum lengkap agar otomatis terhubung ke semua sub-menu (Analisis CP, ATP, Alokasi Waktu, KKTP, Prota/Promes, Jurnal, Modul Ajar, Materi Ajar, LKPD, Soal, Penilaian).

Identitas Saat Ini: ${JSON.stringify(payload.identitas)}
Nama File: ${payload.fileName || '-'}
Isi Dokumen yang Di-upload:
${String(payload.rawText || '').slice(0, 24000)}

Tugas Anda:
1. Deteksi jika dokumen menyebut Fase/Kelas/Tahun Pelajaran/Satuan Pendidikan (jika tidak disebut, pertahankan identitas saat ini).
2. Ekstrak seluruh Elemen dan Capaian Pembelajaran (CP) Bahasa Jawa dari dokumen.
3. Ekstrak seluruh Tujuan Pembelajaran (TP) dari dokumen (atau turunkan secara akurat jika dokumen hanya berisi CP) lengkap dengan Bab, Elemen, CP, TP, Semester ("Gasal" / "Genap").
4. Lengkapi data ATP untuk tiap TP: lingkupMateri (topik spesifik Bahasa Jawa), dimensiProfilLulusan (pilih 2-3 dari: "Keimanan dan Ketaqwaan", "Kewargaan", "Penalaran Kritis", "Kreativitas", "Kolaborasi", "Kemandirian", "Komunikasi"), dan waktuJp (estimasi JP realistis, total setahun sekitar 40-64 JP untuk mapel Bahasa Jawa 2 JP/minggu).
5. Buatkan deskripsi KKTP (perluBimbingan, cukup, baik, sangatBaik) untuk setiap TP.

Kembalikan JSON object persis dengan struktur:
{
  "detectedIdentitas": {
    "fase": "opsional jika ada di dokumen",
    "kelas": "opsional jika ada di dokumen",
    "tahunPelajaran": "opsional jika ada di dokumen"
  },
  "cpElements": [
    { "elemen": "...", "capaianPembelajaran": "..." }
  ],
  "tpRows": [
    {
      "no": 1,
      "bab": "Bab 1: ...",
      "elemen": "...",
      "cp": "...",
      "tp": "...",
      "semester": "Gasal",
      "lingkupMateri": "...",
      "dimensiProfilLulusan": ["Penalaran Kritis", "Komunikasi"],
      "waktuJp": 8,
      "kktp": {
        "kodeTp": "TP.1",
        "perluBimbingan": "...",
        "cukup": "...",
        "baik": "...",
        "sangatBaik": "..."
      }
    }
  ]
}`;
        break;
      }

      default:
        return res.status(400).json({ error: `Task tidak dikenal: ${task}` });
    }

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
    if (payload.base64Data && payload.mimeType) {
      parts.push({
        inlineData: {
          mimeType: String(payload.mimeType),
          data: String(payload.base64Data),
        },
      });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractJson(response.text);
    return res.json({ data: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada generator AI.';
    console.error('[/api/generate] Error:', err);
    return res.status(500).json({ error: message });
  }
});

app.post('/api/extract-document', async (req, res) => {
  try {
    const { mimeType, base64Data, textContent, targetMenu } = req.body as {
      mimeType?: string;
      base64Data?: string;
      textContent?: string;
      targetMenu?: string;
    };

    const ai = getAiClient();
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    if (base64Data && mimeType) {
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    parts.push({
      text: `Ekstrak seluruh isi materi/teks/soal/tabel dari dokumen ini ke dalam ringkasan terstruktur berbahasa Indonesia/Jawa untuk kebutuhan menu "${targetMenu || 'umum'}".
${textContent ? `\nTeks tambahan:\n${textContent}` : ''}
Kembalikan JSON object:
{
  "title": "Judul dokumen atau topik utama",
  "extractedText": "Seluruh isi materi/teks penting yang berhasil diekstrak secara rapi",
  "detectedQuestions": [
    {
      "no": 1,
      "bentuk": "Pilihan Ganda ABCD",
      "pertanyaan": "...",
      "opsi": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "kunciJawaban": "..."
    }
  ]
}`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractJson(response.text);
    return res.json({ data: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengekstrak file.';
    console.error('[/api/extract-document] Error:', err);
    return res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Generator Bhs Jawa berjalan di http://localhost:${PORT}`);
  });
}

startServer();

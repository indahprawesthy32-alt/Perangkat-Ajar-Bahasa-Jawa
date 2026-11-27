import type { AppState, ModelPembelajaranId, ModulSintakItem, PenilaianInstrument } from '../types';

export const DIMENSI_PROFIL_OPTIONS = [
  'Keimanan dan Ketaqwaan',
  'Kewargaan',
  'Penalaran Kritis',
  'Kreativitas',
  'Kolaborasi',
  'Kemandirian',
  'Komunikasi',
] as const;

export const MODEL_PEMBELAJARAN_META: Record<
  ModelPembelajaranId,
  {
    label: string;
    shortLabel: string;
    sintaks: ModulSintakItem[];
  }
> = {
  PBL: {
    label: 'Problem Based Learning (PBL)',
    shortLabel: 'PBL',
    sintaks: [
      {
        sintakTitle: 'Sintak 1: Orientasi Murid pada Masalah Kontekstual',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI (Bermakna & Menggembirakan)',
        aktivitas: [
          'Guru menayangkan video/kasus penggunaan ragam bahasa atau fenomena budaya Jawa di kehidupan sehari-hari.',
          'Murid mengamati permasalahan kontekstual yang muncul dalam teks/situasi berbahasa Jawa.',
          'Guru memantik penalaran kritis (C4): mengapa penggunaan unggah-ungguh atau makna teks tersebut penting dianalisis?',
        ],
      },
      {
        sintakTitle: 'Sintak 2: Mengorganisasikan Murid untuk Belajar Berdiferensiasi',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI (Berkesadaran & Kolaboratif)',
        aktivitas: [
          'Guru membagi kelas ke dalam kelompok heterogen (4–5 anak) dengan peran eksplisit (Kapten, Pengamat, Notulis, Presenter).',
          'Guru membagikan LKPD berdiferensiasi sesuai kesiapan murid.',
          'Murid menyepakati aturan kerja tim yang berkesadaran: saling menyimak dengan unggah-ungguh dan berbicara bergantian.',
        ],
      },
      {
        sintakTitle: 'Sintak 3: Membimbing Penyelidikan Mandiri dan Kelompok',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (Joyful Experiential Learning)',
        aktivitas: [
          'Kelompok menginvestigasi masalah bahasa/sastra Jawa pada LKPD (level SOLO Relational C4).',
          'Kelompok menelaah struktur, kaidah, serta nilai budi pekerti dengan bimbingan guru bagi kelompok yang membutuhkan penguatan.',
        ],
      },
      {
        sintakTitle: 'Sintak 4: Mengembangkan dan Menyajikan Hasil Karya (Kreativitas Produk)',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (Kreatif & Bermakna)',
        aktivitas: [
          'Setiap kelompok menyusun hasil analisis dan rancangan solusi kreatif (C5–C6) dalam bentuk Peta Konsep/Poster/Dialog Bahasa Jawa.',
          'Perwakilan kelompok mempresentasikan hasil investigasinya dengan metode Galeri Berjalan (Window Shopping) atau unjuk peran.',
        ],
      },
      {
        sintakTitle: 'Sintak 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI & MEREFLEKSI',
        aktivitas: [
          'Guru memfasilitasi pleno klasikal: mengevaluasi ketepatan analisis murid terhadap kaidah Bahasa Jawa.',
          'Guru meluruskan miskonsepsi dan memberikan apresiasi atas ketekunan serta kolaborasi kelompok.',
        ],
      },
    ],
  },
  PJBL: {
    label: 'Project Based Learning (PjBL)',
    shortLabel: 'PjBL',
    sintaks: [
      {
        sintakTitle: 'Sintak 1: Pertanyaan Mendasar (Start With the Essential Question)',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI (Bermakna & Menantang)',
        aktivitas: [
          'Guru mengajukan pertanyaan pemantik tingkat tinggi (C4–C6) terkait pelestarian budaya dan bahasa Jawa melalui karya nyata.',
          'Murid mengeksplorasi contoh produk budaya Jawa (komik aksara, video dialog krama, atau antologi geguritan).',
        ],
      },
      {
        sintakTitle: 'Sintak 2: Mendesain Perencanaan Produk (Design a Plan for the Project)',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI & MENGAPLIKASI (Kolaboratif)',
        aktivitas: [
          'Murid dalam kelompok merancang desain proyek, pembagian tugas, alat bahan, dan kriteria mutu (SOLO Extended Abstract).',
        ],
      },
      {
        sintakTitle: 'Sintak 3: Menyusun Jadwal Pembuatan (Create a Schedule)',
        deepLearningTag: 'DEEP LEARNING - BERKESADARAN (Kemandirian)',
        aktivitas: [
          'Guru dan murid menyepakati linimasa pengerjaan proyek, target penyelesaian tiap tahap, dan waktu presentasi.',
        ],
      },
      {
        sintakTitle: 'Sintak 4: Memonitor Keaktifan dan Perkembangan Proyek',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (Experiential)',
        aktivitas: [
          'Murid memproduksi karya Bahasa Jawa secara kolaboratif sementara guru memantau progres, memberi umpan balik formatif, dan membimbing.',
        ],
      },
      {
        sintakTitle: 'Sintak 5: Menguji Hasil (Assess the Outcome)',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (Komunikatif & Menggembirakan)',
        aktivitas: [
          'Setiap kelompok mempresentasikan atau mementaskan hasil proyek Bahasa Jawa di hadapan teman sebaya untuk dinilai berdasarkan rubrik.',
        ],
      },
      {
        sintakTitle: 'Sintak 6: Evaluasi Pengalaman Belajar',
        deepLearningTag: 'DEEP LEARNING - MEREFLEKSI',
        aktivitas: [
          'Guru dan murid merefleksikan proses pembuatan proyek, kendala bahasa yang ditemui, dan makna budaya yang diperoleh.',
        ],
      },
    ],
  },
  STEAM: {
    label: 'STEAM (Science, Technology, Engineering, Arts, Mathematics)',
    shortLabel: 'STEAM',
    sintaks: [
      {
        sintakTitle: 'Sintak 1: Ask & Observe (Mengamati Fenomena Budaya & Sains)',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI (Kontekstual)',
        aktivitas: [
          'Murid mengamati keterkaitan budaya Jawa (misal: filosofi tembang, pola aksara, atau kearifan lokal) dengan unsur teknologi, seni, dan pola matematis/guru wilangan.',
        ],
      },
      {
        sintakTitle: 'Sintak 2: Imagine & Plan (Merancang Ide Lintas Disiplin)',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI & MENGAPLIKASI (Kreatif)',
        aktivitas: [
          'Murid menghubungkan konsep Bahasa Jawa dengan desain visual/digital (Technology & Arts) serta perhitungan pola/durasi/aturan (Mathematics & Engineering).',
        ],
      },
      {
        sintakTitle: 'Sintak 3: Create & Prototype (Membangun Karya Terpadu)',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (Experiential & Kolaboratif)',
        aktivitas: [
          'Kelompok membuat purwarupa karya (misal: papan permainan aksara Jawa, poster digital infografis krama, atau alat peraga wayang kardus).',
        ],
      },
      {
        sintakTitle: 'Sintak 4: Test & Improve (Uji Coba & Evaluasi C5)',
        deepLearningTag: 'DEEP LEARNING - MEREFLEKSI & MENGAPLIKASI',
        aktivitas: [
          'Kelompok menguji kelayakan bahasa, estetika seni, dan fungsi karya melalui umpan balik antar-kelompok lalu menyempurnakannya.',
        ],
      },
      {
        sintakTitle: 'Sintak 5: Share & Reflect (Publikasi Karya & Refleksi)',
        deepLearningTag: 'DEEP LEARNING - MEREFLEKSI (Bermakna)',
        aktivitas: [
          'Murid mempresentasikan karya STEAM-Bahasa Jawa dan merefleksikan integrasi nilai budaya dengan keterampilan abad 21.',
        ],
      },
    ],
  },
  DISCOVERY: {
    label: 'Discovery Learning',
    shortLabel: 'Discovery',
    sintaks: [
      {
        sintakTitle: 'Sintak 1: Pemberian Rangsangan (Stimulation)',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI (Menggembirakan)',
        aktivitas: [
          'Guru menyajikan teks sastra, rekaman audio tembang, atau kartu kalimat Ngoko–Krama untuk memicu rasa ingin tahu murid.',
        ],
      },
      {
        sintakTitle: 'Sintak 2: Pernyataan / Identifikasi Masalah (Problem Statement)',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI (Penalaran Kritis C4)',
        aktivitas: [
          'Murid merumuskan pertanyaan atau hipotesis sementara mengenai pola kaidah, makna tersirat, atau aturan penulisan Bahasa Jawa.',
        ],
      },
      {
        sintakTitle: 'Sintak 3: Pengumpulan Data (Data Collection)',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (Investigatif)',
        aktivitas: [
          'Murid menggali data dari bacaan, kamus bausastra/pepaking basa Jawa, dan wawancara singkat antar-teman.',
        ],
      },
      {
        sintakTitle: 'Sintak 4: Pengolahan Data (Data Processing)',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (SOLO Relational C4)',
        aktivitas: [
          'Kelompok mengelompokkan, membandingkan, dan menganalisis temuan pola kebahasaan pada tabel LKPD.',
        ],
      },
      {
        sintakTitle: 'Sintak 5: Pembuktian (Verification)',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI & MEREFLEKSI (C5)',
        aktivitas: [
          'Murid menguji kebenaran temuannya melalui diskusi kelas dan presentasi kelompok.',
        ],
      },
      {
        sintakTitle: 'Sintak 6: Menarik Simpulan (Generalization)',
        deepLearningTag: 'DEEP LEARNING - MEREFLEKSI (Extended Abstract C6)',
        aktivitas: [
          'Murid merumuskan prinsip umum/kaidah Bahasa Jawa dengan bahasanya sendiri dan mengaitkannya ke konteks baru.',
        ],
      },
    ],
  },
  INQUIRY: {
    label: 'Inquiry Learning (Berbasis Pembelajaran Mendalam)',
    shortLabel: 'Inquiry',
    sintaks: [
      {
        sintakTitle: 'Sintak 1: Orientasi & Inkuiri Bermakna',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI (Berkesadaran)',
        aktivitas: [
          'Guru menghadirkan fenomena budaya atau teks Bahasa Jawa autentik dan mengajak murid merenungkan relevansinya bagi identitas diri.',
        ],
      },
      {
        sintakTitle: 'Sintak 2: Merumuskan Pertanyaan Inkuiri (C4)',
        deepLearningTag: 'DEEP LEARNING - MEMAHAMI (Kritis)',
        aktivitas: [
          'Murid menyusun pertanyaan investigatif tingkat tinggi (mengapa, bagaimana dampak, apa alternatifnya) terhadap teks/fenomena Bahasa Jawa.',
        ],
      },
      {
        sintakTitle: 'Sintak 3: Mengumpulkan & Menguji Bukti (C4–C5)',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (Experiential Inquiry)',
        aktivitas: [
          'Murid menelusuri sumber primer (teks tembang, unggah-ungguh tutur, aksara) dan menguji kesesuaiannya dengan fakta sosial.',
        ],
      },
      {
        sintakTitle: 'Sintak 4: Sintesis Makna & Kreasi Solusi (C6)',
        deepLearningTag: 'DEEP LEARNING - MENGAPLIKASI (SOLO Extended Abstract)',
        aktivitas: [
          'Kelompok menyintesis temuan menjadi argumen tertulis atau produk komunikasi berbahasa Jawa yang santun dan bernalar.',
        ],
      },
      {
        sintakTitle: 'Sintak 5: Dialog Reflektif & Diseminasi',
        deepLearningTag: 'DEEP LEARNING - MEREFLEKSI (Bermakna & Menggembirakan)',
        aktivitas: [
          'Murid mempresentasikan temuan inkuiri, menerima pertanyaan balik dari teman, lalu menuliskan refleksi perubahan pemahaman.',
        ],
      },
    ],
  },
};

export const PENILAIAN_KATEGORI_LIST: PenilaianInstrument[] = [
  {
    id: 'rubrik_lkpd',
    kategori: 'Rubrik LKPD',
    judul: 'Rubrik Penilaian Lembar Kerja Peserta Didik (LKPD)',
    deskripsi: 'Menilai ketepatan analisis isi, penggunaan kaidah Bahasa Jawa, dan kedalaman berpikir kritis (C4–C6).',
    kolom: ['Aspek Penilaian', 'Sangat Baik (4)', 'Baik (3)', 'Cukup (2)', 'Perlu Bimbingan (1)'],
    baris: [
      ['Ketepatan Analisis Teks/Materi', 'Mampu menganalisis dan menyintesis seluruh unsur teks Jawa secara kritis dan disertai bukti akurat.', 'Mampu menganalisis sebagian besar unsur teks dengan bukti cukup tepat.', 'Mampu mengidentifikasi unsur dasar namun analisis belum mendalam.', 'Belum mampu mengidentifikasi unsur utama teks tanpa bimbingan penuh.'],
      ['Kesesuaian Unggah-Ungguh / Kaidah', 'Penggunaan basa Ngoko/Krama atau aksara sangat tepat sesuai konteks sosial.', 'Penggunaan kaidah tepat dengan 1–2 kekeliruan minor.', 'Terdapat beberapa ketidaksesuaian ragam bahasa.', 'Belum dapat membedakan ragam bahasa atau kaidah dasar.'],
      ['Kelengkapan & Kerapian Produk', 'LKPD terisi lengkap, runtut, kreatif, dan mudah dipahami.', 'LKPD terisi lengkap dan cukup rapi.', 'Sebagian LKPD terisi namun kurang terstruktur.', 'LKPD belum selesai dan kurang terbaca.'],
    ],
    catatan: 'Nilai = (Skor Perolehan / 12) x 100.',
  },
  {
    id: 'rubrik_studi_kasus',
    kategori: 'Rubrik Studi Kasus',
    judul: 'Rubrik Penilaian Studi Kasus Bahasa & Budaya Jawa',
    deskripsi: 'Menilai kemampuan murid memecahkan persoalan etika berbahasa atau pelestarian budaya Jawa.',
    kolom: ['Aspek Penilaian', 'Sangat Baik (4)', 'Baik (3)', 'Cukup (2)', 'Perlu Bimbingan (1)'],
    baris: [
      ['Identifikasi Masalah Kasus', 'Mengidentifikasi akar masalah dan sudut pandang budaya secara tajam (SOLO Relational).', 'Mengidentifikasi masalah utama dengan cukup jelas.', 'Hanya menyebutkan gejala masalah di permukaan.', 'Kesulitan menentukan inti permasalahan kasus.'],
      ['Argumentasi & Solusi', 'Memberikan solusi orisinal (C6) yang realistis dan selaras dengan nilai tepa selira.', 'Memberikan solusi logis namun masih bersifat umum.', 'Solusi kurang relevan dengan konteks kasus.', 'Belum mampu merumuskan solusi.'],
    ],
    catatan: 'Nilai = (Skor Perolehan / 8) x 100.',
  },
  {
    id: 'rubrik_simulasi',
    kategori: 'Rubrik Simulasi',
    judul: 'Rubrik Penilaian Simulasi / Pacelathon (Bermain Peran)',
    deskripsi: 'Menilai kelancaran wicara, ekspresi, gestur (solah bawa), dan ketepatan unggah-ungguh dalam simulasi.',
    kolom: ['Aspek Penilaian', 'Sangat Baik (4)', 'Baik (3)', 'Cukup (2)', 'Perlu Bimbingan (1)'],
    baris: [
      ['Pelafalan & Intonasi (Wirama)', 'Pelafalan aksara/kata Jawa sangat fasih, intonasi ekspresif dan wajar.', 'Pelafalan jelas, intonasi cukup sesuai.', 'Pelafalan kadang ragu dan intonasi datar.', 'Pelafalan kurang jelas dan sering terbata-bata.'],
      ['Unggah-Ungguh & Solah Bawa (Wiraga)', 'Pilihan diksi Ngoko/Krama dan sikap tubuh sangat santun sesuai peran.', 'Diksi dan sikap tubuh cukup sesuai peran.', 'Kadang tertukar antara ragam Ngoko dan Krama.', 'Belum menerapkan unggah-ungguh maupun gestur yang tepat.'],
    ],
    catatan: 'Nilai = (Skor Perolehan / 8) x 100.',
  },
  {
    id: 'rubrik_diskusi',
    kategori: 'Rubrik Diskusi',
    judul: 'Rubrik Penilaian Diskusi Kelompok',
    deskripsi: 'Mengukur partisipasi aktif, kemampuan menyimak pendapat teman, dan kontribusi gagasan.',
    kolom: ['Aspek Penilaian', 'Sangat Baik (4)', 'Baik (3)', 'Cukup (2)', 'Perlu Bimbingan (1)'],
    baris: [
      ['Kontribusi Gagasan', 'Aktif memberi ide bernalar kritis yang memperkaya diskusi kelompok.', 'Memberi pendapat relevan saat diminta atau sesekali berinisiatif.', 'Jarang berpendapat dan cenderung menyetujui saja.', 'Pasif dan tidak terlibat dalam diskusi.'],
      ['Etika Berkomunikasi', 'Menyimak dengan penuh perhatian dan menanggapi dengan bahasa santun.', 'Menyimak dengan baik dan menanggapi cukup sopan.', 'Sesekali memotong pembicaraan teman.', 'Kurang menghargai pendapat anggota kelompok lain.'],
    ],
    catatan: 'Diisi melalui observasi guru selama sintak kerja kelompok berlangsung.',
  },
  {
    id: 'catatan_anekdot',
    kategori: 'Catatan Anekdot',
    judul: 'Format Catatan Anekdot Perkembangan Murid',
    deskripsi: 'Rekaman kejadian bermakna harian terkait sikap, karakter Profil Lulusan, dan keterampilan berbahasa murid.',
    kolom: ['Tanggal', 'Nama Murid', 'Peristiwa / Perilaku Teramati', 'Dimensi Profil Lulusan', 'Tindak Lanjut Guru'],
    baris: [
      ['16 Oktober 2026', 'Bagas Pratama', 'Berinisiatif membantu teman membaca aksara Jawa pasangan dengan sabar dan menggunakan basa Krama saat bertanya ke guru.', 'Kolaborasi & Keimanan', 'Diberi apresiasi verbal dan dijadikan tutor sebaya kelompok visual.'],
      ['16 Oktober 2026', 'Siti Aminah', 'Masih malu saat diminta membaca geguritan di depan kelas, tetapi tulisannya sangat puitis.', 'Kemandirian & Kreativitas', 'Diberi kesempatan tampil berpasangan terlebih dahulu untuk membangun percaya diri.'],
    ],
    catatan: 'Catat kejadian spesifik secara objektif tanpa menghakimi.',
  },
  {
    id: 'peer_asesmen',
    kategori: 'Peer Asesmen',
    judul: 'Instrumen Peer Asesmen (Asesmen Antar Teman)',
    deskripsi: 'Lembar penilaian sejawat untuk menumbuhkan kesadaran reflektif dan objektivitas antar-murid saat presentasi.',
    kolom: ['No', 'Pernyataan Penilaian Teman', 'Selalu (4)', 'Sering (3)', 'Kadang (2)', 'Belum (1)'],
    baris: [
      ['1', 'Teman saya aktif berkontribusi menyelesaikan tugas Bahasa Jawa dalam kelompok.', '[ ]', '[ ]', '[ ]', '[ ]'],
      ['2', 'Teman saya berbicara dengan santun dan menggunakan unggah-ungguh yang baik saat presentasi.', '[ ]', '[ ]', '[ ]', '[ ]'],
      ['3', 'Teman saya mau mendengarkan masukan dari anggota kelompok lain.', '[ ]', '[ ]', '[ ]', '[ ]'],
    ],
    catatan: 'Nama Penilai: ................. | Nama Teman yang Dinilai: .................',
  },
  {
    id: 'sumatif_akhir_materi',
    kategori: 'Sumatif Akhir Materi',
    judul: 'Rekapitulasi Asesmen Sumatif Akhir Materi / Lingkup Materi',
    deskripsi: 'Rekap capaian murid pada akhir satu bab/lingkup materi Bahasa Jawa berdasarkan KKTP.',
    kolom: ['No', 'Nama Murid', 'Nilai Tes Tertulis', 'Nilai Unjuk Kerja', 'Nilai Akhir', 'Kategori KKTP', 'Keterangan'],
    baris: [
      ['1', 'Andika Wijaya', '88', '92', '90', 'Baik (76–90)', 'Tuntas / Pengayaan'],
      ['2', 'Nadia Kusuma', '72', '76', '74', 'Cukup (61–75)', 'Tuntas Minimal'],
      ['3', 'Raka Saputra', '56', '60', '58', 'Perlu Bimbingan (0–60)', 'Perlu Remedial'],
    ],
    catatan: 'Nilai Akhir = (60% Tes Tertulis + 40% Unjuk Kerja).',
  },
  {
    id: 'umpan_balik',
    kategori: 'Catatan Umpan Balik',
    judul: 'Catatan Umpan Balik Guru dan Murid',
    deskripsi: 'Dialog tertulis dua arah untuk memperkuat pembelajaran bermakna dan berkesadaran.',
    kolom: ['Nama Murid', 'Kekuatan yang Sudah Terlihat', 'Saran Perbaikan Spesifik (Feed Forward)', 'Respon / Komitmen Murid'],
    baris: [
      ['Andika Wijaya', 'Mampu membedakan basa Ngoko Alus dan Krama Alus dengan sangat tepat.', 'Perbanyak latihan menulis aksara Jawa menggunakan sandhangan wyanjana.', 'Saya akan berlatih menulis 5 kalimat aksara Jawa setiap akhir pekan.'],
    ],
    catatan: 'Umpan balik diberikan maksimal 2 hari setelah tugas dikumpulkan.',
  },
  {
    id: 'sts',
    kategori: 'Sumatif Tengah Semester',
    judul: 'Daftar Nilai Sumatif Tengah Semester (STS)',
    deskripsi: 'Rekap hasil evaluasi tengah semester Bahasa Jawa mencakup seluruh TP pada paruh pertama semester.',
    kolom: ['No', 'Nama Murid', 'TP 1', 'TP 2', 'Nilai STS', 'Capaian KKTP'],
    baris: [
      ['1', 'Andika Wijaya', '85', '90', '88', 'Baik'],
      ['2', 'Nadia Kusuma', '74', '78', '76', 'Baik'],
    ],
    catatan: 'STS dilaksanakan pada minggu efektif ke-9/10 sesuai kalender akademik.',
  },
  {
    id: 'sas',
    kategori: 'Sumatif Akhir Semester',
    judul: 'Daftar Nilai Sumatif Akhir Semester (SAS)',
    deskripsi: 'Rekap nilai akhir semester sebagai dasar penentuan nilai rapor Bahasa Jawa.',
    kolom: ['No', 'Nama Murid', 'Rata-rata Sumatif Lingkup Materi', 'Nilai STS', 'Nilai SAS', 'Nilai Rapor', 'Deskripsi Rapor Singkat'],
    baris: [
      ['1', 'Andika Wijaya', '88', '88', '90', '89', 'Menunjukkan penguasaan sangat baik dalam memahami cerita rakyat dan menerapkan unggah-ungguh basa Krama.'],
    ],
    catatan: 'Nilai Rapor = (2 x Rata-rata Lingkup Materi + STS + SAS) / 4.',
  },
  {
    id: 'perbaikan_pengayaan',
    kategori: 'Perbaikan & Pengayaan',
    judul: 'Lembar Program Perbaikan (Remedial) dan Pengayaan',
    deskripsi: 'Rencana layanan pembelajaran berdiferensiasi pasca asesmen sumatif.',
    kolom: ['No', 'Nama Murid', 'Nilai Awal', 'Jenis Program', 'Bentuk Kegiatan / Materi', 'Nilai Akhir', 'Paraf Guru'],
    baris: [
      ['1', 'Raka Saputra', '58', 'Perbaikan (Remedial)', 'Bimbingan kelompok kecil membaca teks Ngoko-Krama dengan kartu kosakata bergambar.', '76', ''],
      ['2', 'Andika Wijaya', '90', 'Pengayaan', 'Membuat naskah drama pendek (sandiwara) berbahasa Krama Alus bertema pelestarian lingkungan.', '95', ''],
    ],
    catatan: 'Remedial diberikan kepada murid dengan capaian < 61 atau belum mencapai KKTP.',
  },
  {
    id: 'analisis_penilaian',
    kategori: 'Analisis Hasil Penilaian',
    judul: 'Analisis Butir Soal dan Ketuntasan Hasil Penilaian',
    deskripsi: 'Pemetaan persentase ketuntasan klasikal serta identifikasi butir soal tersulit untuk evaluasi pembelajaran.',
    kolom: ['No Soal', 'Tujuan Pembelajaran', 'Jumlah Menjawab Benar', 'Jumlah Peserta', 'Persentase Ketuntasan (%)', 'Status Butir / Keputusan'],
    baris: [
      ['1', 'TP.1 (Alat Teknologi Tradisional dan Modern)', '26', '28', '92.9%', 'Diterima / Tuntas'],
      ['2', 'TP.2 (Busana Jawa Gagrag Ngayogyakarta)', '22', '28', '78.6%', 'Diterima / Tuntas'],
      ['3', 'TP.6 (Aksara Jawa Pasangan & Tembung Lingga)', '15', '28', '53.6%', 'Perlu Pengulangan Klasikal'],
    ],
    catatan: 'Ketuntasan klasikal tercapai apabila >= 75% murid mencapai kategori Baik/Cukup sesuai KKTP.',
  },
  {
    id: 'tindak_lanjut',
    kategori: 'Tindak Lanjut',
    judul: 'Rencana Tindak Lanjut Pembelajaran',
    deskripsi: 'Langkah strategis guru menindaklanjuti hasil analisis penilaian untuk pertemuan berikutnya.',
    kolom: ['Temuan Hasil Asesmen', 'Akar Penyebab', 'Strategi Tindak Lanjut', 'Target Waktu', 'Penanggung Jawab'],
    baris: [
      ['40% murid masih tertukar menggunakan Krama Lugu dan Krama Alus untuk diri sendiri vs orang tua.', 'Kurangnya pembiasaan praktik percakapan kontekstual di kelas.', 'Menerapkan pembiasaan "Selasa Berbasa Krama" 10 menit di awal pelajaran dan latihan simulasi telepon/bertamu.', 'Pertemuan Minggu Depan', 'Guru Mata Pelajaran'],
    ],
    catatan: 'Dievaluasi ulang pada asesmen formatif bab berikutnya.',
  },
  {
    id: 'refleksi_akhir_bab',
    kategori: 'Refleksi Akhir Bab',
    judul: 'Instrumen Refleksi Akhir Bab (Guru & Murid)',
    deskripsi: 'Evaluasi holistik keberhasilan metode, media, dan pemahaman mendalam murid setelah satu bab selesai.',
    kolom: ['Aspek Refleksi', 'Pertanyaan Pemandu', 'Catatan Hasil Refleksi'],
    baris: [
      ['Ketercapaian Tujuan', 'Apakah seluruh murid mampu mencapai TP pada level berpikir kritis (C4–C6)?', 'Sebagian besar murid (85%) berhasil menganalisis amanat teks dan membuat karya dialog dengan baik.'],
      ['Kegembiraan & Kebermaknaan', 'Bagian kegiatan mana yang paling disukai dan bermakna bagi murid?', 'Metode Galeri Berjalan dan simulasi pacelathon membuat murid antusias tanpa takut salah.'],
      ['Perbaikan Bab Berikutnya', 'Apa penyesuaian media atau diferensiasi yang perlu ditingkatkan?', 'Menyediakan rekaman audio pelafalan tembang macapat agar kelompok auditori lebih cepat menguasai titi laras.'],
    ],
    catatan: 'Diisi setiap akhir bab sebagai bagian dari siklus perbaikan berkelanjutan.',
  },
  {
    id: 'rubrik_meaningfull',
    kategori: 'Rubrik Meaningful',
    judul: 'Rubrik Meaningful Learning (Pembelajaran Bermakna, Berkesadaran, Menggembirakan)',
    deskripsi: 'Menilai kualitas keterlibatan mendalam (Deep Learning) murid selama proses pembelajaran Bahasa Jawa.',
    kolom: ['Dimensi Deep Learning', 'Sangat Bermakna (4)', 'Bermakna (3)', 'Mulai Terlihat (2)', 'Belum Terlihat (1)'],
    baris: [
      ['Berkesadaran (Mindful)', 'Murid fokus penuh, mengelola emosi dan peran kelompok dengan sadar serta menghormati perbedaan.', 'Murid fokus pada sebagian besar sesi dan menjalankan peran.', 'Murid sesekali terdistraksi dan perlu diingatkan.', 'Murid tidak fokus dan kurang terlibat dalam kesepakatan kelas.'],
      ['Bermakna (Meaningful)', 'Murid mampu mengaitkan materi Bahasa Jawa dengan pengalaman hidup nyata dan nilai budaya keluarga.', 'Murid memahami kegunaan materi dalam kehidupan sehari-hari.', 'Murid memahami materi sebatas hafalan teks.', 'Murid belum melihat keterkaitan materi dengan kehidupan nyata.'],
      ['Menggembirakan (Joyful)', 'Murid antusias, berani bereksplorasi tanpa takut salah, dan menunjukkan ekspresi gembira.', 'Murid mengikuti kegiatan dengan nyaman dan aktif.', 'Murid cenderung pasif menunggu instruksi.', 'Murid tampak tertekan atau enggan berpartisipasi.'],
    ],
    catatan: 'Mengukur kualitas proses Pembelajaran Mendalam (Deep Learning) di kelas.',
  },
];

export const DEFAULT_STATE: AppState = {
  identitas: {
    satuanPendidikan: 'SD Negeri Gentan',
    mataPelajaran: 'Bahasa Jawa',
    fase: 'C',
    kelas: '5',
    semester: 'Gasal',
    tahunPelajaran: '2026/2027',
    kotaTanggal: 'Ngaglik, 16 Oktober 2026',
    namaKepalaSekolah: 'Sri Wartini, S.Pd.SD',
    nipKepalaSekolah: '19700605 200502 2 010',
    namaGuru: 'Indah Prawesthy S, S.Pd',
    nipGuru: '19930114 202321 2 011',
  },
  cpElements: [
    {
      id: 'cp_c_1',
      elemen: 'Menyimak (Ngrungokake)',
      capaianPembelajaran:
        'Peserta didik mampu menganalisis informasi dan nilai luhur dari cerita singkat tokoh wayang Ramayana dan Mahabarata, peninggalan sejarah wilayah DIY, serta melantunkan dan memaknai tembang macapat Maskumambang dan Mijil.',
    },
    {
      id: 'cp_c_2',
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      capaianPembelajaran:
        'Peserta didik mampu memahami bacaan tentang alat teknologi tradisional dan modern, busana Jawa gagrag Ngayogyakarta, bahan dan manfaat jamu Jawa, geguritan sederhana, serta kaidah tembung lingga lan andhahan (ater-ater).',
    },
    {
      id: 'cp_c_3',
      elemen: 'Berbicara & Mempresentasikan (Micara)',
      capaianPembelajaran:
        'Peserta didik mampu mempraktikkan tata krama (unggah-ungguh basa lan sikap) tentang ajakan dan tanya jawab serta tata krama bertamu, serta membacakan geguritan dan tembang macapat secara ekspresif.',
    },
    {
      id: 'cp_c_4',
      elemen: 'Menulis (Nulis)',
      capaianPembelajaran:
        'Peserta didik mampu menulis kalimat sederhana menggunakan huruf Jawa beserta pasangannya, sandhangan, serta tanda baca (adeg-adeg, pada lingsa, pada lungsi) dan menerapkan tembung lingga lan andhahan dengan tepat.',
    },
  ],
  tpRows: [
    {
      id: 'tp_c5_1',
      no: 1,
      bab: 'Bab 1: Alat Teknologi Tradisional lan Modern',
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      cp: 'Memahami bacaan tentang alat teknologi tradisional dan modern, busana Jawa gagrag Ngayogyakarta, bahan dan manfaat jamu Jawa, geguritan sederhana, serta kaidah tembung lingga lan andhahan (ater-ater).',
      tp: 'Murid mampu membandingkan fungsi, manfaat, dan perubahan penggunaan alat teknologi tradisional dan modern dalam kehidupan masyarakat Jawa.',
      semester: 'Gasal',
    },
    {
      id: 'tp_c5_2',
      no: 2,
      bab: 'Bab 2: Busana Jawa Gagrag Ngayogyakarta',
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      cp: 'Memahami bacaan tentang alat teknologi tradisional dan modern, busana Jawa gagrag Ngayogyakarta, bahan dan manfaat jamu Jawa, geguritan sederhana, serta kaidah tembung lingga lan andhahan (ater-ater).',
      tp: 'Murid mampu menganalisis kelengkapan, nama bagian, serta makna filosofis busana Jawa gagrag Ngayogyakarta dengan tepat.',
      semester: 'Gasal',
    },
    {
      id: 'tp_c5_3',
      no: 3,
      bab: 'Bab 3: Geguritan Sederhana',
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      cp: 'Memahami bacaan tentang alat teknologi tradisional dan modern, busana Jawa gagrag Ngayogyakarta, bahan dan manfaat jamu Jawa, geguritan sederhana, serta kaidah tembung lingga lan andhahan (ater-ater).',
      tp: 'Murid mampu menafsirkan isi dan makna geguritan sederhana serta membacakan atau menciptakannya dengan wirama, wirasa, dan wiraga ekspresif.',
      semester: 'Gasal',
    },
    {
      id: 'tp_c5_4',
      no: 4,
      bab: 'Bab 4: Crita Wayang Ramayana',
      elemen: 'Menyimak (Ngrungokake)',
      cp: 'Menganalisis informasi dan nilai luhur dari cerita singkat tokoh wayang Ramayana dan Mahabarata, peninggalan sejarah wilayah DIY, serta melantunkan dan memaknai tembang macapat Maskumambang dan Mijil.',
      tp: 'Murid mampu menganalisis alur cerita singkat, watak tokoh wayang Ramayana, serta nilai keteladanan yang relevan bagi pelajar.',
      semester: 'Genap',
    },
    {
      id: 'tp_c5_5',
      no: 5,
      bab: 'Bab 5: Tata Krama Ajakan/Tanya Jawab & Tembang Macapat Maskumambang',
      elemen: 'Berbicara & Mempresentasikan (Micara)',
      cp: 'Mempraktikkan tata krama (unggah-ungguh basa lan sikap) tentang ajakan dan tanya jawab serta tata krama bertamu, serta membacakan geguritan dan tembang macapat secara ekspresif.',
      tp: 'Murid mampu mempraktikkan tata krama ajakan dan tanya jawab dengan santun serta menganalisis paugeran dan pitutur luhur tembang macapat Maskumambang.',
      semester: 'Genap',
    },
    {
      id: 'tp_c5_6',
      no: 6,
      bab: 'Bab 6: Aksara Jawa Pasangan serta Tembung Lingga lan Andhahan',
      elemen: 'Menulis (Nulis)',
      cp: 'Menulis kalimat sederhana menggunakan huruf Jawa beserta pasangannya, sandhangan, serta tanda baca (adeg-adeg, pada lingsa, pada lungsi) dan menerapkan tembung lingga lan andhahan dengan tepat.',
      tp: 'Murid mampu menulis kalimat sederhana menggunakan huruf Jawa beserta pasangannya serta membedakan tembung lingga dan andhahan (ater-ater) secara tepat.',
      semester: 'Genap',
    },
  ],
  atpRows: [
    {
      id: 'atp1',
      no: 1,
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      capaianPembelajaran: 'Memahami bacaan tentang alat teknologi tradisional dan modern dalam masyarakat Jawa.',
      tujuanPembelajaran: 'Murid mampu membandingkan fungsi, manfaat, dan perubahan penggunaan alat teknologi tradisional dan modern dalam kehidupan masyarakat Jawa.',
      lingkupMateri: 'Alat Teknologi Tradisional dan Modern',
      dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas'],
      waktuJp: 8,
      semester: 'Gasal',
    },
    {
      id: 'atp2',
      no: 2,
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      capaianPembelajaran: 'Memahami bacaan tentang busana Jawa gagrag Ngayogyakarta.',
      tujuanPembelajaran: 'Murid mampu menganalisis kelengkapan, nama bagian, serta makna filosofis busana Jawa gagrag Ngayogyakarta dengan tepat.',
      lingkupMateri: 'Busana Jawa Gagrag Ngayogyakarta',
      dimensiProfilLulusan: ['Kewargaan', 'Penalaran Kritis'],
      waktuJp: 8,
      semester: 'Gasal',
    },
    {
      id: 'atp3',
      no: 3,
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      capaianPembelajaran: 'Memahami pesan dan gaya bahasa teks sastra geguritan sederhana.',
      tujuanPembelajaran: 'Murid mampu menafsirkan isi dan makna geguritan sederhana serta membacakan atau menciptakannya dengan wirama, wirasa, dan wiraga ekspresif.',
      lingkupMateri: 'Geguritan Sederhana',
      dimensiProfilLulusan: ['Kreativitas', 'Komunikasi'],
      waktuJp: 8,
      semester: 'Gasal',
    },
    {
      id: 'atp4',
      no: 4,
      elemen: 'Menyimak (Ngrungokake)',
      capaianPembelajaran: 'Menganalisis informasi dan nilai luhur cerita singkat tokoh wayang Ramayana.',
      tujuanPembelajaran: 'Murid mampu menganalisis alur cerita singkat, watak tokoh wayang Ramayana, serta nilai keteladanan yang relevan bagi pelajar.',
      lingkupMateri: 'Cerita Singkat Tokoh Wayang Ramayana',
      dimensiProfilLulusan: ['Penalaran Kritis', 'Kewargaan'],
      waktuJp: 8,
      semester: 'Genap',
    },
    {
      id: 'atp5',
      no: 5,
      elemen: 'Berbicara & Mempresentasikan (Micara)',
      capaianPembelajaran: 'Mempraktikkan tata krama ajakan dan tanya jawab serta memaknai tembang macapat Maskumambang.',
      tujuanPembelajaran: 'Murid mampu mempraktikkan tata krama ajakan dan tanya jawab dengan santun serta menganalisis paugeran dan pitutur luhur tembang macapat Maskumambang.',
      lingkupMateri: 'Tata Krama Ajakan & Tanya Jawab serta Tembang Macapat Maskumambang',
      dimensiProfilLulusan: ['Komunikasi', 'Keimanan dan Ketaqwaan'],
      waktuJp: 10,
      semester: 'Genap',
    },
    {
      id: 'atp6',
      no: 6,
      elemen: 'Menulis (Nulis)',
      capaianPembelajaran: 'Menulis kalimat sederhana menggunakan huruf Jawa beserta pasangannya dan menerapkan tembung lingga lan andhahan.',
      tujuanPembelajaran: 'Murid mampu menulis kalimat sederhana menggunakan huruf Jawa beserta pasangannya serta membedakan tembung lingga dan andhahan (ater-ater) secara tepat.',
      lingkupMateri: 'Aksara Jawa Pasangan serta Tembung Lingga lan Andhahan (Ater-ater)',
      dimensiProfilLulusan: ['Kemandirian', 'Penalaran Kritis'],
      waktuJp: 10,
      semester: 'Genap',
    },
  ],
  alokasiWaktu: {
    menitPerJp: 35,
    bulanGasal: [
      { id: 'bg1', no: 1, namaBulan: 'Juli', jumlahMinggu: 5, jumlahHariEfektif: 12, jumlahMingguEfektif: 3, ket: '' },
      { id: 'bg2', no: 2, namaBulan: 'Agustus', jumlahMinggu: 4, jumlahHariEfektif: 19, jumlahMingguEfektif: 4, ket: '' },
      { id: 'bg3', no: 3, namaBulan: 'September', jumlahMinggu: 5, jumlahHariEfektif: 21, jumlahMingguEfektif: 5, ket: 'STS' },
      { id: 'bg4', no: 4, namaBulan: 'Oktober', jumlahMinggu: 5, jumlahHariEfektif: 22, jumlahMingguEfektif: 5, ket: '' },
      { id: 'bg5', no: 5, namaBulan: 'Nopember', jumlahMinggu: 5, jumlahHariEfektif: 21, jumlahMingguEfektif: 5, ket: '' },
      { id: 'bg6', no: 6, namaBulan: 'Desember', jumlahMinggu: 5, jumlahHariEfektif: 9, jumlahMingguEfektif: 1, ket: 'SAS' },
    ],
    bulanGenap: [
      { id: 'bn1', no: 1, namaBulan: 'Januari', jumlahMinggu: 5, jumlahHariEfektif: 16, jumlahMingguEfektif: 3, ket: '' },
      { id: 'bn2', no: 2, namaBulan: 'Februari', jumlahMinggu: 4, jumlahHariEfektif: 18, jumlahMingguEfektif: 3, ket: '' },
      { id: 'bn3', no: 3, namaBulan: 'Maret', jumlahMinggu: 5, jumlahHariEfektif: 16, jumlahMingguEfektif: 3, ket: 'STS' },
      { id: 'bn4', no: 4, namaBulan: 'April', jumlahMinggu: 5, jumlahHariEfektif: 14, jumlahMingguEfektif: 5, ket: '' },
      { id: 'bn5', no: 5, namaBulan: 'Mei', jumlahMinggu: 4, jumlahHariEfektif: 11, jumlahMingguEfektif: 3, ket: '' },
      { id: 'bn6', no: 6, namaBulan: 'Juni', jumlahMinggu: 5, jumlahHariEfektif: 3, jumlahMingguEfektif: 1, ket: 'SAS' },
    ],
    calcGasal: {
      jpPerMinggu: 2,
      jamEfektifKbmPerMinggu: 2,
      jamFormatif: 6,
      jamSumatif: 4,
      cadangan: 8,
    },
    calcGenap: {
      jpPerMinggu: 2,
      jamEfektifKbmPerMinggu: 2,
      jamFormatif: 4,
      jamSumatif: 4,
      cadangan: 2,
    },
    distribusi: [
      { id: 'd1', semester: 'Gasal', materiPokok: 'Alat Teknologi Tradisional dan Modern', alokasiJp: 8 },
      { id: 'd2', semester: 'Gasal', materiPokok: 'Busana Jawa Gagrag Ngayogyakarta', alokasiJp: 8 },
      { id: 'd3', semester: 'Gasal', materiPokok: 'Geguritan Sederhana', alokasiJp: 8 },
      { id: 'd4', semester: 'Genap', materiPokok: 'Cerita Singkat Tokoh Wayang Ramayana', alokasiJp: 8 },
      { id: 'd5', semester: 'Genap', materiPokok: 'Tata Krama Ajakan & Tanya Jawab serta Tembang Macapat Maskumambang', alokasiJp: 10 },
      { id: 'd6', semester: 'Genap', materiPokok: 'Aksara Jawa Pasangan serta Tembung Lingga lan Andhahan (Ater-ater)', alokasiJp: 10 },
    ],
    sumatifTotal: 8,
    formatifTotal: 10,
    cadanganTotal: 10,
  },
  kktpRows: [
    {
      id: 'k1',
      kodeTp: 'TP.1',
      tujuanPembelajaran: 'Murid mampu membandingkan fungsi, manfaat, dan perubahan penggunaan alat teknologi tradisional dan modern dalam kehidupan masyarakat Jawa.',
      perluBimbingan: 'Belum mampu membedakan contoh alat teknologi tradisional dan modern beserta kegunaannya tanpa pendampingan guru.',
      cukup: 'Mampu menyebutkan beberapa contoh alat tradisional dan modern, namun penjelasan perbedaan cara kerja masih sederhana.',
      baik: 'Mampu membandingkan fungsi, kelebihan, serta perubahan penggunaan alat teknologi tradisional dan modern secara tepat.',
      sangatBaik: 'Mampu menganalisis dampak perubahan teknologi secara kritis dan merancang gagasan pelestarian alat tradisional dalam kehidupan masa kini.',
    },
    {
      id: 'k2',
      kodeTp: 'TP.2',
      tujuanPembelajaran: 'Murid mampu menganalisis kelengkapan, nama bagian, serta makna filosofis busana Jawa gagrag Ngayogyakarta dengan tepat.',
      perluBimbingan: 'Masih kesulitan mengenali bagian utama busana Jawa gagrag Ngayogyakarta (blangkon, surjan, jarik) secara tepat.',
      cukup: 'Mampu menyebutkan nama bagian busana Jawa gagrag Ngayogyakarta meski makna filosofisnya belum dijelaskan lengkap.',
      baik: 'Mampu menganalisis kelengkapan dan makna filosofis busana Jawa gagrag Ngayogyakarta dengan runtut.',
      sangatBaik: 'Mampu membandingkan ciri khas gagrag Ngayogyakarta dengan penuh kebanggaan budaya serta menjelaskan filosofinya secara mendalam.',
    },
    {
      id: 'k3',
      kodeTp: 'TP.3',
      tujuanPembelajaran: 'Murid mampu menafsirkan isi dan makna geguritan sederhana serta membacakan atau menciptakannya dengan wirama, wirasa, dan wiraga ekspresif.',
      perluBimbingan: 'Membaca geguritan masih datar dan belum memahami makna tembung kias di dalamnya.',
      cukup: 'Mampu membaca dengan pelafalan jelas namun penjiwaan dan pemahaman makna geguritan masih terbatas.',
      baik: 'Mampu menafsirkan isi geguritan dengan tepat dan membacakannya dengan penghayatan baik.',
      sangatBaik: 'Mampu menafsirkan makna secara kritis serta membacakan atau menulis geguritan sederhana dengan wirama, wirasa, dan wiraga memukau.',
    },
    {
      id: 'k4',
      kodeTp: 'TP.4',
      tujuanPembelajaran: 'Murid mampu menganalisis alur cerita singkat, watak tokoh wayang Ramayana, serta nilai keteladanan yang relevan bagi pelajar.',
      perluBimbingan: 'Belum mampu membedakan tokoh utama dan wataknya dalam cerita singkat Ramayana tanpa bantuan pertanyaan pemandu.',
      cukup: 'Mampu menyebutkan tokoh wayang Ramayana dan alur dasarnya secara singkat.',
      baik: 'Mampu menganalisis watak tokoh Ramayana (Rama, Shinta, Laksmana, Hanoman, Rahwana) beserta amanatnya.',
      sangatBaik: 'Mampu mengevaluasi konflik moral dalam cerita Ramayana dan meneladani sikap ksatria dalam kehidupan sehari-hari.',
    },
    {
      id: 'k5',
      kodeTp: 'TP.5',
      tujuanPembelajaran: 'Murid mampu mempraktikkan tata krama ajakan dan tanya jawab dengan santun serta menganalisis paugeran dan pitutur luhur tembang macapat Maskumambang.',
      perluBimbingan: 'Belum konsisten membedakan ragam ngoko-krama saat ajakan/tanya jawab serta belum memahami paugeran Maskumambang.',
      cukup: 'Mampu mempraktikkan kalimat ajakan sederhana dan mengidentifikasi jumlah gatra Maskumambang.',
      baik: 'Mampu mempraktikkan tata krama ajakan dan tanya jawab dengan santun serta menentukan guru gatra, wilangan, lagu Maskumambang.',
      sangatBaik: 'Mampu menyusun dialog ajakan-tanya jawab yang sangat santun sekaligus melantunkan dan memaknai pitutur luhur Maskumambang.',
    },
    {
      id: 'k6',
      kodeTp: 'TP.6',
      tujuanPembelajaran: 'Murid mampu menulis kalimat sederhana menggunakan huruf Jawa beserta pasangannya serta membedakan tembung lingga dan andhahan (ater-ater) secara tepat.',
      perluBimbingan: 'Masih keliru menerapkan pasangan aksara Jawa untuk mematikan huruf serta belum dapat membedakan ater-ater.',
      cukup: 'Mampu membaca dan menulis kata sederhana dengan sebagian pasangan aksara Jawa serta mengenali tembung lingga.',
      baik: 'Mampu menulis kalimat sederhana beraksara Jawa pasangan dan mengidentifikasi tembung andhahan ber-ater-ater dengan tepat.',
      sangatBaik: 'Mampu mengalihaksarakan kalimat kompleks berpasangan aksara Jawa secara mandiri serta menganalisis proses pembentukan tembung andhahan.',
    },
  ],
  protaRows: [
    { id: 'pr1', no: 1, atp: 'Membandingkan fungsi, manfaat, dan perubahan alat teknologi tradisional dan modern', materiPokok: 'Alat Teknologi Tradisional dan Modern', semester: 'Gasal', alokasiJp: 8 },
    { id: 'pr2', no: 2, atp: 'Menganalisis kelengkapan, nama bagian, dan makna filosofis busana Jawa gagrag Ngayogyakarta', materiPokok: 'Busana Jawa Gagrag Ngayogyakarta', semester: 'Gasal', alokasiJp: 8 },
    { id: 'pr3', no: 3, atp: 'Menafsirkan makna serta membacakan atau menulis geguritan sederhana', materiPokok: 'Geguritan Sederhana', semester: 'Gasal', alokasiJp: 8 },
    { id: 'pr4', no: 4, atp: 'Menganalisis alur cerita singkat, watak tokoh wayang Ramayana, dan keteladanannya', materiPokok: 'Cerita Singkat Tokoh Wayang Ramayana', semester: 'Genap', alokasiJp: 8 },
    { id: 'pr5', no: 5, atp: 'Mempraktikkan tata krama ajakan & tanya jawab serta menganalisis tembang Maskumambang', materiPokok: 'Tata Krama Ajakan & Tanya Jawab serta Tembang Macapat Maskumambang', semester: 'Genap', alokasiJp: 10 },
    { id: 'pr6', no: 6, atp: 'Menulis kalimat aksara Jawa beserta pasangannya dan menerapkan tembung lingga-andhahan', materiPokok: 'Aksara Jawa Pasangan serta Tembung Lingga lan Andhahan (Ater-ater)', semester: 'Genap', alokasiJp: 10 },
  ],
  promesRows: [
    {
      id: 'pm1',
      no: 1,
      tp: 'Membandingkan alat teknologi tradisional dan modern dalam kehidupan masyarakat Jawa',
      materiPokok: 'Alat Teknologi Tradisional dan Modern',
      semester: 'Gasal',
      alokasiJp: 8,
      bulan: { jul: true, ags: true, sep: false, okt: false, nov: false, des: false, jan: false, feb: false, mar: false, apr: false, mei: false, jun: false },
    },
    {
      id: 'pm2',
      no: 2,
      tp: 'Menganalisis kelengkapan lan makna filosofis busana Jawa gagrag Ngayogyakarta',
      materiPokok: 'Busana Jawa Gagrag Ngayogyakarta',
      semester: 'Gasal',
      alokasiJp: 8,
      bulan: { jul: false, ags: true, sep: true, okt: true, nov: false, des: false, jan: false, feb: false, mar: false, apr: false, mei: false, jun: false },
    },
    {
      id: 'pm3',
      no: 3,
      tp: 'Menafsirkan isi geguritan sederhana dan membacakannya secara ekspresif',
      materiPokok: 'Geguritan Sederhana',
      semester: 'Gasal',
      alokasiJp: 8,
      bulan: { jul: false, ags: false, sep: false, okt: true, nov: true, des: false, jan: false, feb: false, mar: false, apr: false, mei: false, jun: false },
    },
    {
      id: 'pm4',
      no: 4,
      tp: 'Menganalisis alur dan watak tokoh dalam cerita singkat wayang Ramayana',
      materiPokok: 'Cerita Singkat Tokoh Wayang Ramayana',
      semester: 'Genap',
      alokasiJp: 8,
      bulan: { jul: false, ags: false, sep: false, okt: false, nov: false, des: false, jan: true, feb: true, mar: false, apr: false, mei: false, jun: false },
    },
    {
      id: 'pm5',
      no: 5,
      tp: 'Mempraktikkan tata krama ajakan/tanya jawab dan menganalisis tembang Maskumambang',
      materiPokok: 'Tata Krama Ajakan & Tanya Jawab serta Tembang Macapat Maskumambang',
      semester: 'Genap',
      alokasiJp: 10,
      bulan: { jul: false, ags: false, sep: false, okt: false, nov: false, des: false, jan: false, feb: true, mar: true, apr: true, mei: false, jun: false },
    },
    {
      id: 'pm6',
      no: 6,
      tp: 'Menulis kalimat aksara Jawa berpasangan dan membedakan tembung lingga-andhahan',
      materiPokok: 'Aksara Jawa Pasangan serta Tembung Lingga lan Andhahan (Ater-ater)',
      semester: 'Genap',
      alokasiJp: 10,
      bulan: { jul: false, ags: false, sep: false, okt: false, nov: false, des: false, jan: false, feb: false, mar: false, apr: true, mei: true, jun: false },
    },
  ],
  jurnalRows: [
    {
      id: 'j1',
      pertemuanKe: 1,
      hariTgl: 'Kamis, 16 Oktober 2026',
      bab: 'Bab 1: Alat Teknologi Tradisional lan Modern',
      tp: 'Murid mampu membandingkan fungsi, manfaat, dan perubahan penggunaan alat teknologi tradisional dan modern dalam kehidupan masyarakat Jawa.',
      materiPokok: 'Alat Teknologi Tradisional dan Modern',
      ringkasanKegiatan: 'Murid mengamati gambar lesung-alu, ani-ani, bajak sawah vs mesin modern; berdiskusi dalam kelompok heterogen membandingkan efisiensi dan kearifan lokalnya.',
      absensi: 'Hadir 28/28 (Nihil)',
      metode: 'PBL, Diskusi Kelompok Berdiferensiasi, Galeri Berjalan',
      penilaian: 'Observasi sikap profil lulusan & rubrik LKPD (rata-rata kelas 85)',
      refleksi: 'Murid antusias mengenal nama alat tradisional Jawa seperti tenggok, tampah, dan lesung.',
    },
  ],
  modulAjar: {
    mataPelajaran: 'Bahasa Jawa',
    materiPelajaran: 'Alat Teknologi Tradisional dan Modern',
    alokasiWaktu: '2 x 35 Menit (1 Pert)',
    modelPembelajaran: 'PBL',
    kesiapanMurid:
      'Peserta didik Kelas 5 (Fase C) mengenal berbagai gawai dan alat elektronik modern di rumah, namun sebagian belum mengenal nama serta fungsi alat teknologi tradisional Jawa (lesung, tampah, luku/bajak, kentongan). Diferensiasi difasilitasi melalui kelompok visual (kartu foto alat tradisional-modern), kinestetik (simulasi cara kerja alat), dan auditori (penjelasan lisan narasi budaya).',
    karakteristikMateri:
      'Materi Alat Teknologi Tradisional dan Modern mencakup pengetahuan faktual (nama alat berbahasa Jawa), konseptual (prinsip kerja ramah lingkungan vs efisiensi mesin), prosedural (membandingkan manfaat dalam tabel analisis), serta metakognitif (menghargai kearifan lokal sekaligus bijak memakai teknologi masa kini).',
    dimensiChecklist: {
      penalaranKritis: {
        checked: true,
        deskripsi: 'Membandingkan kelebihan, keterbatasan, dan dampak lingkungan alat teknologi tradisional serta modern (C4–C5).',
      },
      kreativitas: {
        checked: true,
        deskripsi: 'Merancang poster atau tabel infografis perbandingan piranti tradisional Jawa lan modern (C6).',
      },
      kolaborasi: {
        checked: true,
        deskripsi: 'Bekerja sama dalam kelompok heterogen menelaah pasangan alat tradisional dan penggantinya pada era modern.',
      },
      kemandirian: {
        checked: false,
        deskripsi: 'Menggali informasi nama alat rumah tangga tradisional Jawa dari orang tua di rumah.',
      },
      komunikasi: {
        checked: true,
        deskripsi: 'Mempresentasikan hasil perbandingan piranti tradisional dan modern memakai basa Jawa yang santun.',
      },
      keimanan: {
        checked: false,
        deskripsi: 'Mensyukuri akal budi manusia yang mampu menciptakan teknologi bermanfaat tanpa merusak alam.',
      },
      kewargaan: {
        checked: true,
        deskripsi: 'Menumbuhkan rasa bangga terhadap kecerdasan leluhur Jawa dalam merancang teknologi tepat guna.',
      },
    },
    capaianPembelajaran:
      'Peserta didik mampu memahami bacaan tentang alat teknologi tradisional dan modern, busana Jawa gagrag Ngayogyakarta, bahan dan manfaat jamu Jawa, geguritan sederhana, serta kaidah tembung lingga lan andhahan (ater-ater).',
    tujuanPembelajaran:
      'Melalui pengamatan gambar dan analisis bacaan, murid (Audience) mampu membandingkan fungsi, manfaat, serta dampak alat teknologi tradisional dan modern dalam kehidupan masyarakat Jawa (Behavior, C4–C6 Taksonomi SOLO) berbasis bukti kontekstual (Condition) dengan runtut dan santun (Degree).',
    praktikPedagogis: {
      pendekatan: 'Deep Learning (Bermakna, Berkesadaran, Menggembirakan), Experiential Learning, dan Contextual Cultural Inquiry.',
      metode: 'Diskusi kelompok berdiferensiasi, analisis perbandingan piranti tradisional–modern, dan presentasi Galeri Berjalan.',
    },
    lingkunganKemitraan: {
      budayaBelajar: 'Budaya saling mendengarkan, menghargai pengetahuan generasi terdahulu, dan berani menyampaikan gagasan dengan santun.',
      ruangFisik: 'Ruang kelas yang ditata menjadi 5 kelompok kolaboratif dengan sudut pajang kartu gambar piranti tradisional dan modern.',
      kemitraanAntarmurid: 'Kelompok heterogen (4–5 murid) dengan peran terstruktur (Kapten, Pengamat, Notulis, Presenter).',
    },
    pemanfaatanDigital: {
      platform: 'Video pendek proses menumbuk padi memakai lesung dibanding mesin penggiling modern & kartu kosakata digital.',
      perangkat: 'Proyektor LCD, Laptop guru, Speaker kelas.',
      mediaBahanAjar: 'LKPD Analisis Piranti Tradisional vs Modern & Kartu Gambar Piranti Jawa.',
    },
    pendahuluan: [
      'Orientasi, Salam Hangat ("Sugeng enjang, para siswa"), dan Doa Bersama yang dipimpin salah satu murid (Keimanan dan Ketaqwaan).',
      'Cek kehadiran, kesiapan belajar, serta Latihan Napas Sadar (Mindful Breathing) 2 menit untuk menumbuhkan ketenangan.',
      'Apersepsi Berkesadaran & Pertanyaan Pemantik: "Jaman biyen wong nutu pari nganggo lesung lan alu, saiki nganggo mesin selep. Apa bedane mupangat lan pangaribawane tumrap urip bebrayan?"',
      'Penyampaian Tujuan Pembelajaran dan peran murid sebagai pengamat teknologi budaya Jawa.',
    ],
    alokasiPendahuluan: '10 Menit',
    intiSintaks: MODEL_PEMBELAJARAN_META.PBL.sintaks,
    alokasiInti: '50 Menit',
    penutup: [
      'DEEP LEARNING – MEREFLEKSI: Murid menuliskan refleksi 3-2-1 (3 nama alat tradisional Jawa baru, 2 perbandingan manfaatnya dengan alat modern, 1 sikap bijak memakai teknologi).',
      'Menyimpulkan Pembelajaran: Guru dan murid menyimpulkan bahwa teknologi tradisional kaya nilai gotong royong dan ramah alam, sedangkan teknologi modern unggul dalam efisiensi.',
      'Asesmen Formatif Singkat: Kuis cepat analisis fungsi alat teknologi tradisional dan modern (C4).',
      'Tindak Lanjut: Murid mewawancarai orang tua/eyang tentang 2 alat dapur tradisional di rumah dan doa penutup.',
    ],
    alokasiPenutup: '10 Menit',
    asesmenFormatif: [
      'Penilaian Sikap (Profil Lulusan): Jurnal Observasi 7 Dimensi Profil Lulusan selama diskusi berlangsung.',
      'Penilaian Keterampilan: Rubrik LKPD perbandingan fungsi, kelebihan, dan pelestarian piranti tradisional vs modern.',
    ],
    asesmenSumatif:
      'Tes tertulis/unjuk kerja 5 butir soal analisis perbandingan dan evaluasi teknologi tradisional vs modern (Level Kognitif C4–C6 Taksonomi SOLO) dengan skala 0–100.',
  },
  materiAjar: {
    materiIntiInput:
      'Alat teknologi tradisional dan modern ing masyarakat Jawa: lesung-alu, luku/bajak, kentongan, lampu teplok lan gantine ing jaman modern.',
    judulMateri: 'Alat Teknologi Tradisional dan Modern',
    bab: 'Bab 1: Alat Teknologi Tradisional lan Modern',
    tujuanPembelajaran:
      'Murid mampu membandingkan fungsi, manfaat, dan perubahan penggunaan alat teknologi tradisional dan modern dalam kehidupan masyarakat Jawa.',
    petaKonsep: {
      pusat: 'Alat Teknologi Tradisional lan Modern',
      cabang: [
        {
          judul: 'Teknologi Tradisional Jawa',
          poin: ['Lesung & alu (nutu pari)', 'Luku/bajak, garu, ani-ani, tampah, lan kentongan'],
        },
        {
          judul: 'Teknologi Modern',
          poin: ['Traktor, mesin selep pari, kompor gas/induksi', 'Ponsel pintar & internet kanggo komunikasi cepat'],
        },
        {
          judul: 'Perbandingan Nilai & Dampak',
          poin: ['Tradisional: ramah lingkungan lan nguwatake gotong royong', 'Modern: luwih cepet, praktis, lan butuh kawicaksanan'],
        },
      ],
    },
    paragrafRingkasan: [
      'Sadurunge ana listrik lan mesin canggih, masyarakat Jawa wis duwe maneka warna piranti teknologi tradisional sing digawe saka pring, kayu, watu, lan wesi. Piranti iki digunakake kanggo tetanen, pawon, nganti komunikasi bebrayan.',
      'Tuladha piranti tradisional ing pertanian lan pawon yaiku luku (bajak) kanggo ngolah lemah sawah, lesung lan alu kanggo nutu pari, tampah kanggo napeni beras, sarta kendhil saka lemah lempung kanggo masak. Kanggo komunikasi jarak adoh, masyarakat biyen nganggo kentongan pring utawa bedhug.',
      'Ing jaman saiki, piranti kasebut akeh sing diganti teknologi modern kayata traktor, mesin selep pari, rice cooker, lan telepon genggam. Senajan piranti modern luwih cepet lan praktis, nilai gotong royong lan kearifan lingkungan saka piranti tradisional tetep kudu dieling lan diajeni.',
    ],
    kosakataPenting: [
      { ngoko: 'Piranti / Alat', krama: 'Pirantos', arti: 'Alat / perlengkapan' },
      { ngoko: 'Nutu pari', krama: 'Nutu pantun', arti: 'Menumbuk padi' },
      { ngoko: 'Gawe', krama: 'Damel', arti: 'Membuat' },
      { ngoko: 'Luwih gampang', krama: 'Langkung gampil', arti: 'Lebih mudah' },
      { ngoko: 'Jaman biyen', krama: 'Jaman rumiyin', arti: 'Zaman dahulu' },
    ],
    contohKontekstual:
      'Tuladha Perbandingan Nyata:\n1) Komunikasi: Biyen warga nuthuk kentongan nganggo irama tinamtu (titir/dara muluk) kanggo tandha bahaya utawa kumpul warga; saiki warta dikirim cepet liwat grup pesan ing ponsel.\n2) Pawon & Tetanen: Biyen nutu pari nganggo lesung lan alu bebarengan (gejog lesung) sing nguripake guyub rukun; saiki nganggo mesin selep supaya cepet rampung.',
  },
  lkpd: {
    materiInput: 'Alat Teknologi Tradisional dan Modern (Analisis Fungsi, Kelebihan, & Kearifan Lokal)',
    judulLkpd: 'LKPD Detektif Teknologi Tradisional vs Modern',
    tujuanPembelajaran:
      'Murid mampu membandingkan fungsi, manfaat, serta dampak penggunaan alat teknologi tradisional dan modern secara kritis.',
    apersepsi:
      'Coba pikirake: yen ing desa biyen lampu mati, warga nganggo lampu ublik/teplok lan komunikasi nganggo kentongan. Saiki yen listrik mati utawa sinyal ilang, piranti tradisional apa sing isih bisa nulungi kita?',
    kegiatanInti: {
      petunjuk: 'Diskusikan bersama kelompokmu (4–5 orang), bandingkan pasangan piranti tradisional lan modern ing ngisor iki, banjur presentasekna!',
      stimulus:
        'Tabel Kasus:\n1. Lesung & Alu vs Mesin Selep Pari\n2. Luku (Bajak Kerbau) vs Traktor\n3. Kentongan vs Telepon Genggam\n4. Kendi Lemah vs Dispenser Listrik',
      tugasKritis: [
        '1. [Analisis - C4] Sebutna fungsi utama saben piranti tradisional kasebut lan jelaske sebabe masyarakat saiki akeh sing pindhah menyang piranti modern!',
        '2. [Evaluasi - C5] Miturut panemumu, apa kaluwihane piranti tradisional (kayata lesung utawa kendi) sing ora diduweni piranti modern?',
        '3. [Kreasi & Presentasi - C6] Gawea usulan cara kreatif supaya generasi enom tetep tepung lan ngajeni piranti tradisional Jawa sanajan urip ing jaman digital!',
      ],
      panduanPresentasi:
        'Saben klompok ngirim 1 presenter kanggo njelaske tabel perbandingan ing ngarep kelas nganggo basa Jawa kang runtut, dene kanca liyane menehi tanggapan.',
    },
    refleksiSiswa: [
      'Piranti tradisional Jawa apa sing nembe dakmengerteni fungsine dina iki?',
      'Miturutku, kenapa kita kudu tetep ngerti piranti jaman biyen sanajan wis ana teknologi canggih?',
      'Kepriye caraku nggunakake teknologi modern kanthi wicaksana ing omah?',
    ],
  },
  soalFormatif: {
    intiMateri: 'Alat Teknologi Tradisional dan Modern dalam Kehidupan Masyarakat Jawa',
    jumlahSoal: 5,
    jenisDipilih: ['Pilihan Ganda ABCD', 'Pilihan Ganda Kompleks / MCMA', 'Isian Pendek', 'Essay', 'Tes Lisan'],
    kktp: 'Murid dinyatakan mencapai KKTP apabila memperoleh skor minimal 76 dari 100 dengan ketepatan membandingkan fungsi alat tradisional dan modern.',
    kisiKisi: [
      {
        id: 'kf1',
        no: 1,
        tp: 'Membandingkan fungsi alat teknologi tradisional dan modern',
        materi: 'Alat Teknologi Tradisional & Modern',
        indikatorSoal: 'Disajikan deskripsi kegiatan masyarakat Jawa, murid menentukan piranti tradisional yang sesuai fungsinya.',
        levelKognitif: 'C4 (Menganalisis)',
        bentukSoal: 'Pilihan Ganda ABCD',
        noSoal: '1',
      },
      {
        id: 'kf2',
        no: 2,
        tp: 'Menganalisis keunggulan alat tradisional dan modern',
        materi: 'Perbandingan Teknologi',
        indikatorSoal: 'Murid memilih dua pernyataan benar mengenai dampak perubahan teknologi tradisional ke modern.',
        levelKognitif: 'C4–C5',
        bentukSoal: 'Pilihan Ganda Kompleks / MCMA',
        noSoal: '2',
      },
      {
        id: 'kf3',
        no: 3,
        tp: 'Mengidentifikasi nama dan fungsi alat tradisional Jawa',
        materi: 'Kosakata Piranti Jawa',
        indikatorSoal: 'Murid melengkapi nama piranti tradisional pengolah lahan sawah.',
        levelKognitif: 'C4',
        bentukSoal: 'Isian Pendek',
        noSoal: '3',
      },
      {
        id: 'kf4',
        no: 4,
        tp: 'Mengevaluasi nilai kearifan lokal pada teknologi tradisional',
        materi: 'Analisis Perubahan Teknologi',
        indikatorSoal: 'Murid membandingkan nilai sosial gejog lesung dan mesin selep modern.',
        levelKognitif: 'C5 (Mengevaluasi)',
        bentukSoal: 'Essay',
        noSoal: '4',
      },
      {
        id: 'kf5',
        no: 5,
        tp: 'Menjelaskan sikap bijak menggunakan teknologi secara lisan',
        materi: 'Teknologi Masa Kini',
        indikatorSoal: 'Murid memaparkan secara lisan manfaat dan etika memakai gawai.',
        levelKognitif: 'C6 (Mencipta/Praktik)',
        bentukSoal: 'Tes Lisan',
        noSoal: '5',
      },
    ],
    soal: [
      {
        id: 'sf1',
        no: 1,
        bentuk: 'Pilihan Ganda ABCD',
        pertanyaan: 'Ing jaman biyen, warga desa migunakake piranti kang digawe saka pring utawa kayu kanggo menehi kabar darurat utawa ngumpulake warga ing pos rondha. Piranti kasebut yaiku...',
        opsi: [
          'A. Kentongan',
          'B. Tampah',
          'C. Ani-ani',
          'D. Luku',
        ],
        kunciJawaban: 'A',
        skorMaksimal: 15,
        pedomanPenskoran: 'Skor 15 jika memilih A (Kentongan), skor 0 jika salah.',
      },
      {
        id: 'sf2',
        no: 2,
        bentuk: 'Pilihan Ganda Kompleks / MCMA',
        pertanyaan: 'Pilihlah DUA pernyataan yang benar mengenai perbandingan alat teknologi tradisional lan modern!',
        opsi: [
          'A. Piranti modern kayata traktor bisa ngrampungake gawean sawah kanthi luwih cepet.',
          'B. Piranti tradisional lesung ora duwe nilai budaya lan gotong royong.',
          'C. Kendi lemah lempung bisa gawe banyu adhem alami tanpa energi listrik.',
          'D. Telepon genggam mung kena kanggo dolanan tanpa aturan wektu.',
        ],
        kunciJawaban: 'A dan C',
        skorMaksimal: 20,
        pedomanPenskoran: 'Skor 20 jika memilih A & C, skor 10 jika hanya 1 benar.',
      },
      {
        id: 'sf3',
        no: 3,
        bentuk: 'Isian Pendek',
        pertanyaan: 'Piranti tradisional kanggo mluku utawa ngolah lemah sawah kanthi ditarik kebo utawa sapi diarani ....',
        opsi: [],
        kunciJawaban: 'luku / bajak',
        skorMaksimal: 15,
        pedomanPenskoran: 'Skor 15 jika menjawab "luku" atau "bajak".',
      },
      {
        id: 'sf4',
        no: 4,
        bentuk: 'Essay',
        pertanyaan: 'Bandhingna antarane nutu pari nganggo lesung-alu karo nganggo mesin selep ditinjau saka wektu pengerjaan lan nilai kebersamaan warga!',
        opsi: [],
        kunciJawaban: 'Mesin selep luwih cepet lan ngirit tenaga, nanging nutu nganggo lesung lan alu nguwatake guyub rukun, gotong royong, lan dadi seni budaya gejog lesung.',
        skorMaksimal: 25,
        pedomanPenskoran: 'Membandingkan efisiensi waktu (12 poin) + nilai sosial budaya (13 poin).',
      },
      {
        id: 'sf5',
        no: 5,
        bentuk: 'Tes Lisan',
        pertanyaan: 'Critakna kanthi lisan nganggo basa Jawa kang sopan: kepriye caramu njaga keseimbangan antara nggunakake teknologi modern (ponsel) lan tetep ngajeni budaya Jawa?',
        opsi: [],
        kunciJawaban: 'Nggunakake ponsel kanggo sinau aksara Jawa lan komunikasi santun, ora lali wektu sinau, sarta tetep nguri-uri budaya Jawa ing padinan.',
        skorMaksimal: 25,
        pedomanPenskoran: 'Ketepatan isi argumen (15 poin) + kelancaran dan kesantunan tutur (10 poin).',
      },
    ],
    pedomanUmum: 'Nilai Akhir = (Jumlah Skor Perolehan / 100) x 100. Skor >= 76 dinyatakan tuntas KKTP.',
  },
  soalSumatif: {
    intiMateri: 'Alat Teknologi Tradisional & Modern, Busana Jawa Gagrag Ngayogyakarta, Geguritan Sederhana',
    jumlahSoal: 5,
    jenisDipilih: ['Pilihan Ganda ABCD', 'Pilihan Ganda Kompleks / MCMA'],
    kktp: 'Murid dinyatakan tuntas Sumatif Lingkup Materi apabila memperoleh nilai minimal 76.',
    kisiKisi: [
      {
        id: 'ks1',
        no: 1,
        tp: 'Menganalisis fungsi dan kearifan alat teknologi tradisional',
        materi: 'Alat Teknologi Tradisional dan Modern',
        indikatorSoal: 'Disajikan ilustrasi kegiatan warga, murid menentukan pasangan alat tradisional lan modern yang tepat.',
        levelKognitif: 'C4 (Menganalisis)',
        bentukSoal: 'Pilihan Ganda ABCD',
        noSoal: '1',
      },
      {
        id: 'ks2',
        no: 2,
        tp: 'Menganalisis bagian busana Jawa gagrag Ngayogyakarta',
        materi: 'Busana Jawa Gagrag Ngayogyakarta',
        indikatorSoal: 'Murid memilih dua kelengkapan busana adat pria gagrag Ngayogyakarta dengan tepat.',
        levelKognitif: 'C5 (Mengevaluasi)',
        bentukSoal: 'Pilihan Ganda Kompleks / MCMA',
        noSoal: '2',
      },
    ],
    soal: [
      {
        id: 'ss1',
        no: 1,
        bentuk: 'Pilihan Ganda ABCD',
        pertanyaan: 'Nalika panen pari ing sawah jaman rumiyin, para petani migunakake ani-ani kanggo methik pari siji mbaka siji kanthi ati-ati. Ing jaman modern, gawean kasebut diganti nganggo...',
        opsi: [
          'A. Mesin pemanen pari (combine harvester)',
          'B. Mesin jahit listrik',
          'C. Kipas angin listrik',
          'D. Kompor induksi',
        ],
        kunciJawaban: 'A',
        skorMaksimal: 20,
        pedomanPenskoran: 'Benar = 20, Salah = 0.',
      },
      {
        id: 'ss2',
        no: 2,
        bentuk: 'Pilihan Ganda Kompleks / MCMA',
        pertanyaan: 'Pilihlah DUA kelengkapan busana Jawa gagrag Ngayogyakarta kang dienggo ing sirah lan awak sisih ndhuwur kanggo kakung!',
        opsi: [
          'A. Blangkon mondholan Ngayogyakarta',
          'B. Surjan utawa pranakan',
          'C. Sanggul ukel tekuk',
          'D. Kebaya tangkepan',
        ],
        kunciJawaban: 'A dan B',
        skorMaksimal: 20,
        pedomanPenskoran: 'Benar kedua opsi = 20, benar 1 = 10, salah = 0.',
      },
    ],
    pedomanUmum: 'Nilai Sumatif = (Total Skor Perolehan / Total Skor Maksimal) x 100.',
  },
  penilaianList: PENILAIAN_KATEGORI_LIST,
};

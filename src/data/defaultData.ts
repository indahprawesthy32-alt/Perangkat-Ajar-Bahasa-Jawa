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
      ['1', 'TP 1 (Crita Rakyat)', '26', '28', '92.9%', 'Diterima / Tuntas'],
      ['2', 'TP 2 (Unggah-Ungguh Krama)', '21', '28', '75.0%', 'Diterima / Perlu Penguatan'],
      ['3', 'TP 3 (Aksara Pasangan)', '14', '28', '50.0%', 'Perlu Pengulangan Klasikal'],
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
      id: 'cp1',
      elemen: 'Menyimak (Ngrungokake)',
      capaianPembelajaran:
        'Peserta didik mampu menganalisis informasi berbahasa Jawa ragam ngoko dan krama dari teks aural (teks yang dibacakan dan/atau didengar) berupa crita rakyat, tembang macapat (Pangkur/Maskumambang), serta percakapan sehari-hari dengan penuh budi pekerti.',
    },
    {
      id: 'cp2',
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      capaianPembelajaran:
        'Peserta didik mampu membaca lancar, memahami ide pokok, pesan moral, dan unsur intrinsik dari teks nonsastra, teks sastra (geguritan, crita wayang Pandhawa), serta membaca kalimat sederhana beraksara Jawa (nglegena lan sandhangan).',
    },
    {
      id: 'cp3',
      elemen: 'Berbicara & Mempresentasikan (Micara)',
      capaianPembelajaran:
        'Peserta didik mampu menyampaikan informasi, menanggapi persoalan kontekstual, dan melakukan pacelathon (dialog) menggunakan unggah-ungguh basa Jawa (ngoko lan krama) secara santun, runtut, lan percaya diri.',
    },
    {
      id: 'cp4',
      elemen: 'Menulis (Nulis)',
      capaianPembelajaran:
        'Peserta didik mampu menulis gagasan, pengalaman, teks deskripsi budaya, geguritan sederhana, dan kata/kalimat beraksara Jawa menggunakan ejaan serta unggah-ungguh basa Jawa yang tepat.',
    },
  ],
  tpRows: [
    {
      id: 'tp1',
      no: 1,
      bab: 'Bab 1: Crita Rakyat',
      elemen: 'Menyimak (Ngrungokake)',
      cp: 'Menganalisis informasi dari teks aural berupa crita rakyat berbahasa Jawa.',
      tp: 'Murid mampu menganalisis unsur intrinsik serta nilai budi pekerti dalam crita rakyat Jawa yang disimak secara kritis.',
      semester: 'Gasal',
    },
    {
      id: 'tp2',
      no: 2,
      bab: 'Bab 2: Unggah-Ungguh Basa',
      elemen: 'Berbicara & Mempresentasikan (Micara)',
      cp: 'Melakukan pacelathon menggunakan unggah-ungguh basa Jawa (ngoko lan krama).',
      tp: 'Murid mampu merancang dan mempraktikkan pacelathon menggunakan basa ngoko alus dan krama alus sesuai lawan bicara dengan santun.',
      semester: 'Gasal',
    },
    {
      id: 'tp3',
      no: 3,
      bab: 'Bab 3: Geguritan',
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      cp: 'Memahami pesan moral dan gaya bahasa teks sastra geguritan.',
      tp: 'Murid mampu menafsirkan makna kias dan membacakan geguritan dengan wirama, wirasa, serta wiraga yang ekspresif.',
      semester: 'Gasal',
    },
    {
      id: 'tp4',
      no: 4,
      bab: 'Bab 4: Tembang Macapat Pangkur',
      elemen: 'Menyimak (Ngrungokake)',
      cp: 'Menganalisis struktur dan pitutur luhur tembang macapat.',
      tp: 'Murid mampu mengidentifikasi guru gatra, guru wilangan, guru lagu, serta mengevaluasi pitutur luhur tembang Pangkur dalam kehidupan nyata.',
      semester: 'Genap',
    },
    {
      id: 'tp5',
      no: 5,
      bab: 'Bab 5: Crita Wayang Pandhawa',
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      cp: 'Memahami karakter dan nilai keteladanan dalam crita wayang.',
      tp: 'Murid mampu membandingkan watak tokoh Pandhawa serta mengaitkan keteladanan tokoh dengan sikap kewargaan masa kini.',
      semester: 'Genap',
    },
    {
      id: 'tp6',
      no: 6,
      bab: 'Bab 6: Aksara Jawa & Sandhangan',
      elemen: 'Menulis (Nulis)',
      cp: 'Menulis kata/kalimat sederhana beraksara Jawa nglegena lan sandhangan.',
      tp: 'Murid mampu mengonversi kalimat latin bertema budaya lokal ke dalam tulisan aksara Jawa bersandhangan swara lan panyigeg wanda dengan tepat.',
      semester: 'Genap',
    },
  ],
  atpRows: [
    {
      id: 'atp1',
      no: 1,
      elemen: 'Menyimak (Ngrungokake)',
      capaianPembelajaran: 'Menganalisis informasi dari teks aural berupa crita rakyat berbahasa Jawa.',
      tujuanPembelajaran: 'Murid mampu menganalisis unsur intrinsik serta nilai budi pekerti dalam crita rakyat Jawa yang disimak secara kritis.',
      lingkupMateri: 'Crita Rakyat Jawa (Asal-usul Papan Panggonan)',
      dimensiProfilLulusan: ['Penalaran Kritis', 'Kewargaan'],
      waktuJp: 8,
      semester: 'Gasal',
    },
    {
      id: 'atp2',
      no: 2,
      elemen: 'Berbicara & Mempresentasikan (Micara)',
      capaianPembelajaran: 'Melakukan pacelathon menggunakan unggah-ungguh basa Jawa (ngoko lan krama).',
      tujuanPembelajaran: 'Murid mampu merancang dan mempraktikkan pacelathon menggunakan basa ngoko alus dan krama alus sesuai lawan bicara dengan santun.',
      lingkupMateri: 'Unggah-Ungguh Basa (Pacelathon Ngoko & Krama)',
      dimensiProfilLulusan: ['Komunikasi', 'Kolaborasi', 'Keimanan dan Ketaqwaan'],
      waktuJp: 10,
      semester: 'Gasal',
    },
    {
      id: 'atp3',
      no: 3,
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      capaianPembelajaran: 'Memahami pesan moral dan gaya bahasa teks sastra geguritan.',
      tujuanPembelajaran: 'Murid mampu menafsirkan makna kias dan membacakan geguritan dengan wirama, wirasa, serta wiraga yang ekspresif.',
      lingkupMateri: 'Teks Sastra Geguritan Modern',
      dimensiProfilLulusan: ['Kreativitas', 'Komunikasi'],
      waktuJp: 10,
      semester: 'Gasal',
    },
    {
      id: 'atp4',
      no: 4,
      elemen: 'Menyimak (Ngrungokake)',
      capaianPembelajaran: 'Menganalisis struktur dan pitutur luhur tembang macapat.',
      tujuanPembelajaran: 'Murid mampu mengidentifikasi guru gatra, guru wilangan, guru lagu, serta mengevaluasi pitutur luhur tembang Pangkur dalam kehidupan nyata.',
      lingkupMateri: 'Tembang Macapat Pangkur',
      dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas'],
      waktuJp: 8,
      semester: 'Genap',
    },
    {
      id: 'atp5',
      no: 5,
      elemen: 'Membaca & Memirsa (Maca & Nyemak)',
      capaianPembelajaran: 'Memahami karakter dan nilai keteladanan dalam crita wayang.',
      tujuanPembelajaran: 'Murid mampu membandingkan watak tokoh Pandhawa serta mengaitkan keteladanan tokoh dengan sikap kewargaan masa kini.',
      lingkupMateri: 'Crita Wayang Pandhawa',
      dimensiProfilLulusan: ['Penalaran Kritis', 'Kewargaan'],
      waktuJp: 8,
      semester: 'Genap',
    },
    {
      id: 'atp6',
      no: 6,
      elemen: 'Menulis (Nulis)',
      capaianPembelajaran: 'Menulis kata/kalimat sederhana beraksara Jawa nglegena lan sandhangan.',
      tujuanPembelajaran: 'Murid mampu mengonversi kalimat latin bertema budaya lokal ke dalam tulisan aksara Jawa bersandhangan swara lan panyigeg wanda dengan tepat.',
      lingkupMateri: 'Aksara Jawa (Nglegena & Sandhangan)',
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
      { id: 'd1', semester: 'Gasal', materiPokok: 'Crita Rakyat Jawa (Asal-usul Papan Panggonan)', alokasiJp: 8 },
      { id: 'd2', semester: 'Gasal', materiPokok: 'Unggah-Ungguh Basa (Pacelathon Ngoko & Krama)', alokasiJp: 10 },
      { id: 'd3', semester: 'Gasal', materiPokok: 'Teks Sastra Geguritan Modern', alokasiJp: 10 },
      { id: 'd4', semester: 'Genap', materiPokok: 'Tembang Macapat Pangkur', alokasiJp: 8 },
      { id: 'd5', semester: 'Genap', materiPokok: 'Crita Wayang Pandhawa', alokasiJp: 8 },
      { id: 'd6', semester: 'Genap', materiPokok: 'Aksara Jawa (Nglegena & Sandhangan)', alokasiJp: 10 },
    ],
    sumatifTotal: 8,
    formatifTotal: 10,
    cadanganTotal: 10,
  },
  kktpRows: [
    {
      id: 'k1',
      kodeTp: 'TP.1.1',
      tujuanPembelajaran: 'Menganalisis unsur intrinsik serta nilai budi pekerti dalam crita rakyat Jawa.',
      perluBimbingan: 'Belum mampu menemukan tokoh, latar, dan amanat cerita tanpa bantuan pertanyaan pemandu dari guru.',
      cukup: 'Mampu menyebutkan tokoh dan alur dasar cerita rakyat, namun analisis pesan moral masih bersifat umum.',
      baik: 'Mampu menganalisis seluruh unsur intrinsik dan mengaitkan amanat crita rakyat dengan perilaku sehari-hari.',
      sangatBaik: 'Mampu mengkritisi unsur intrinsik secara mendalam serta menyintesis nilai budi pekerti menjadi teladan kontekstual.',
    },
    {
      id: 'k2',
      kodeTp: 'TP.1.2',
      tujuanPembelajaran: 'Merancang dan mempraktikkan pacelathon menggunakan basa ngoko alus dan krama alus.',
      perluBimbingan: 'Masih sering mencampuradukkan ragam ngoko dan krama saat berdialog dengan orang yang lebih tua.',
      cukup: 'Mampu menggunakan krama lugu pada dialog sederhana meski intonasi dan gestur masih kaku.',
      baik: 'Mampu mempraktikkan pacelathon dengan pilihan kata ngoko/krama alus yang tepat dan sopan.',
      sangatBaik: 'Sangat fasih menyusun sekaligus memerankan pacelathon krama alus yang ekspresif, santun, dan kontekstual.',
    },
    {
      id: 'k3',
      kodeTp: 'TP.1.3',
      tujuanPembelajaran: 'Menafsirkan makna kias dan membacakan geguritan dengan wirama, wirasa, serta wiraga.',
      perluBimbingan: 'Membaca geguritan masih datar dan belum memahami makna tembung entar di dalamnya.',
      cukup: 'Mampu membaca dengan pelafalan jelas namun penjiwaan dan pemahaman makna kias masih terbatas.',
      baik: 'Mampu menafsirkan isi geguritan dengan tepat dan membacakannya dengan penghayatan baik.',
      sangatBaik: 'Mampu menafsirkan makna simbolik secara kritis serta membacakan geguritan dengan wirama, wirasa, dan wiraga memukau.',
    },
  ],
  protaRows: [
    { id: 'pr1', no: 1, atp: 'Menganalisis unsur intrinsik dan nilai budi pekerti crita rakyat Jawa', materiPokok: 'Crita Rakyat Jawa', semester: 'Gasal', alokasiJp: 8 },
    { id: 'pr2', no: 2, atp: 'Merancang dan mempraktikkan pacelathon ngoko alus lan krama alus', materiPokok: 'Unggah-Ungguh Basa', semester: 'Gasal', alokasiJp: 10 },
    { id: 'pr3', no: 3, atp: 'Menafsirkan makna kias dan membacakan geguritan', materiPokok: 'Geguritan Modern', semester: 'Gasal', alokasiJp: 10 },
    { id: 'pr4', no: 4, atp: 'Mengidentifikasi paugeran dan mengevaluasi pitutur tembang Pangkur', materiPokok: 'Tembang Macapat Pangkur', semester: 'Genap', alokasiJp: 8 },
    { id: 'pr5', no: 5, atp: 'Membandingkan watak tokoh Pandhawa dalam crita wayang', materiPokok: 'Crita Wayang Pandhawa', semester: 'Genap', alokasiJp: 8 },
    { id: 'pr6', no: 6, atp: 'Menulis kalimat aksara Jawa bersandhangan swara lan panyigeg', materiPokok: 'Aksara Jawa', semester: 'Genap', alokasiJp: 10 },
  ],
  promesRows: [
    {
      id: 'pm1',
      no: 1,
      tp: 'Menganalisis unsur intrinsik & budi pekerti crita rakyat Jawa',
      materiPokok: 'Crita Rakyat Jawa',
      semester: 'Gasal',
      alokasiJp: 8,
      bulan: { jul: true, ags: true, sep: false, okt: false, nov: false, des: false, jan: false, feb: false, mar: false, apr: false, mei: false, jun: false },
    },
    {
      id: 'pm2',
      no: 2,
      tp: 'Merancang & mempraktikkan pacelathon ngoko alus lan krama alus',
      materiPokok: 'Unggah-Ungguh Basa',
      semester: 'Gasal',
      alokasiJp: 10,
      bulan: { jul: false, ags: true, sep: true, okt: true, nov: false, des: false, jan: false, feb: false, mar: false, apr: false, mei: false, jun: false },
    },
    {
      id: 'pm3',
      no: 3,
      tp: 'Menafsirkan makna kias dan membacakan geguritan',
      materiPokok: 'Geguritan Modern',
      semester: 'Gasal',
      alokasiJp: 10,
      bulan: { jul: false, ags: false, sep: false, okt: true, nov: true, des: false, jan: false, feb: false, mar: false, apr: false, mei: false, jun: false },
    },
    {
      id: 'pm4',
      no: 4,
      tp: 'Menganalisis paugeran & pitutur luhur tembang Pangkur',
      materiPokok: 'Tembang Macapat Pangkur',
      semester: 'Genap',
      alokasiJp: 8,
      bulan: { jul: false, ags: false, sep: false, okt: false, nov: false, des: false, jan: true, feb: true, mar: false, apr: false, mei: false, jun: false },
    },
    {
      id: 'pm5',
      no: 5,
      tp: 'Membandingkan watak keteladanan tokoh Pandhawa',
      materiPokok: 'Crita Wayang Pandhawa',
      semester: 'Genap',
      alokasiJp: 8,
      bulan: { jul: false, ags: false, sep: false, okt: false, nov: false, des: false, jan: false, feb: true, mar: true, apr: true, mei: false, jun: false },
    },
    {
      id: 'pm6',
      no: 6,
      tp: 'Mengonversi kalimat latin ke aksara Jawa bersandhangan',
      materiPokok: 'Aksara Jawa',
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
      bab: 'Bab 2: Unggah-Ungguh Basa',
      tp: 'Murid mampu menganalisis perbedaan ragam ngoko alus dan krama alus dalam pacelathon.',
      materiPokok: 'Unggah-Ungguh Basa (Pacelathon Ngoko & Krama)',
      ringkasanKegiatan: 'Murid menyimak video pacelathon, berdiskusi dalam kelompok heterogen menggunakan LKPD, menyusun naskah dialog bertamu, dan presentasi Galeri Berjalan.',
      absensi: 'Hadir 28/28 (Nihil)',
      metode: 'PBL, Diskusi Kelompok Berdiferensiasi, Simulasi',
      penilaian: 'Observasi sikap profil lulusan & rubrik LKPD (rata-rata kelas 84)',
      refleksi: 'Murid sangat antusias saat simulasi pacelathon; 4 murid masih perlu penguatan kosakata krama inggil anggota tubuh.',
    },
  ],
  modulAjar: {
    mataPelajaran: 'Bahasa Jawa',
    materiPelajaran: 'Unggah-Ungguh Basa Jawa (Pacelathon Ngoko Alus lan Krama Alus)',
    alokasiWaktu: '2 x 35 Menit (1 Pert)',
    modelPembelajaran: 'PBL',
    kesiapanMurid:
      'Peserta didik memiliki pengetahuan dasar yang bervariasi mengenai bahasa Jawa sehari-hari (ngoko), namun perlu penguatan kesadaran penggunaan ragam krama alus kepada orang yang lebih tua. Kebutuhan diferensiasi difasilitasi melalui media belajar bertingkat: kelompok visual dengan kartu perbandingan kata Ngoko–Krama, kelompok kinestetik dengan simulasi peran bertamu, dan kelompok auditori dengan rekaman audio pacelathon.',
    karakteristikMateri:
      'Materi Unggah-Ungguh Basa mencakup pengetahuan faktual (kosakata ngoko-krama), konseptual (prinsip andhap asor), prosedural (menyusun dialog santun), dan metakognitif (kesadaran memilih ragam tutur sesuai mitra wicara). Materi ini dirancang relevan dengan interaksi nyata di keluarga, sekolah, dan masyarakat Jawa.',
    dimensiChecklist: {
      penalaranKritis: {
        checked: true,
        deskripsi: 'Menganalisis kesesuaian pilihan kata Ngoko/Krama dengan status mitra wicara serta dampaknya terhadap keharmonisan sosial (C4).',
      },
      kreativitas: {
        checked: true,
        deskripsi: 'Merancang naskah pacelathon kontekstual atau poster mini kamus saku Ngoko–Krama (C6).',
      },
      kolaborasi: {
        checked: true,
        deskripsi: 'Bekerja sama dalam kelompok heterogen menyusun dan memerankan dialog budaya Jawa.',
      },
      kemandirian: {
        checked: false,
        deskripsi: 'Mengelola tugas investigasi kosakata krama alus secara bertanggung jawab.',
      },
      komunikasi: {
        checked: true,
        deskripsi: 'Mempresentasikan analisis dan memerankan dialog di depan kelas dengan bahasa yang santun, runtut, dan percaya diri.',
      },
      keimanan: {
        checked: false,
        deskripsi: 'Mensyukuri anugerah kekayaan bahasa daerah yang mengajarkan tata krama dan rasa hormat kepada sesama.',
      },
      kewargaan: {
        checked: false,
        deskripsi: 'Menunjukkan kepedulian nyata melestarikan unggah-ungguh basa Jawa di lingkungan sekolah dan rumah.',
      },
    },
    capaianPembelajaran:
      'Pada akhir Fase C, peserta didik mampu menganalisis ragam bahasa dan mempraktikkan pacelathon menggunakan unggah-ungguh basa Jawa (ngoko lan krama) secara santun dalam kehidupan sehari-hari.',
    tujuanPembelajaran:
      'Melalui investigasi teks pacelathon dan simulasi peran, murid (Audience) mampu menganalisis ketepatan penggunaan basa ngoko alus dan krama alus serta merancang dialog santun (Behavior, C4–C6 Taksonomi SOLO Relational–Extended Abstract) berbasis bukti konteks sosial (Condition) dengan tepat dan percaya diri (Degree).',
    praktikPedagogis: {
      pendekatan: 'Deep Learning (Bermakna, Berkesadaran, Menggembirakan), Experiential Learning, dan Contextual Language Inquiry.',
      metode: 'Diskusi kelompok berdiferensiasi, analisis studi kasus dialog, dan presentasi unjuk peran.',
    },
    lingkunganKemitraan: {
      budayaBelajar: 'Budaya saling mendengarkan tanpa menginterupsi, berani bertanya tanpa takut salah berbahasa krama, serta kehangatan tepa selira.',
      ruangFisik: 'Ruang kelas yang ditata menjadi 5 kelompok kolaboratif dan sudut panggung mini untuk simulasi pacelathon.',
      kemitraanAntarmurid: 'Kelompok heterogen (4–5 murid) dengan peran terstruktur (Kapten, Pengamat Bahasa, Notulis, Presenter).',
    },
    pemanfaatanDigital: {
      platform: 'Video pendek contoh pacelathon anak dengan orang tua & audio pelafalan kosakata Jawa.',
      perangkat: 'Proyektor LCD, Laptop guru, Speaker kelas.',
      mediaBahanAjar: 'LKPD Unggah-Ungguh Basa & Kartu Perbandingan Ngoko–Krama.',
    },
    pendahuluan: [
      'Orientasi, Salam Hangat ("Sugeng enjang, para siswa"), dan Doa Bersama yang dipimpin salah satu murid (Keimanan dan Ketaqwaan).',
      'Cek kehadiran, kenyamanan suasana kelas, dan Latihan Napas Sadar (Mindful Breathing) 2 menit untuk membangun fokus dan ketenangan belajar.',
      'Apersepsi Berkesadaran & Pertanyaan Pemantik: Guru menanyakan pengalaman murid: "Kepriye carane sampeyan matur marang Bapak/Ibu utawa Pak Guru nalika nyuwun ijin? Apa bedane yen matur marang kanca sakanca?"',
      'Penyampaian Tujuan Pembelajaran dan skenario hari ini: menjadi "Detektif Unggah-Ungguh" untuk membedah ketepatan ragam bahasa dalam situasi nyata.',
    ],
    alokasiPendahuluan: '10 Menit',
    intiSintaks: MODEL_PEMBELAJARAN_META.PBL.sintaks,
    alokasiInti: '50 Menit',
    penutup: [
      'DEEP LEARNING – MEREFLEKSI (Refleksi Berkesadaran): Murid mengisi jurnal refleksi 3-2-1 (3 kosakata krama baru yang dipahami, 2 hal paling menggembirakan saat berdialog, 1 hal yang ingin dipraktikkan di rumah).',
      'Menyimpulkan Pembelajaran: Bersama-sama menyimpulkan prinsip unggah-ungguh basa sebagai wujud rasa hormat (ngajeni marang liyan).',
      'Asesmen Formatif Singkat: Kuis cepat 5 butir soal analisis ragam bahasa (level C4).',
      'Tindak Lanjut & Aksi Nyata Kewargaan: Murid diberi misi mempraktikkan minimal 3 kalimat krama alus kepada orang tua di rumah.',
      'Doa Penutup dan Salam Penuh Rasa Syukur.',
    ],
    alokasiPenutup: '10 Menit',
    asesmenFormatif: [
      'Penilaian Sikap (Profil Lulusan): Jurnal Observasi 7 Dimensi Profil Lulusan selama diskusi dan simulasi berlangsung.',
      'Penilaian Keterampilan: Rubrik unjuk kerja LKPD analisis dialog dan ketepatan unggah-ungguh saat presentasi Galeri Berjalan.',
    ],
    asesmenSumatif:
      'Tes tertulis/lisan 5 butir soal analisis kasus & kreasi kalimat (Level Kognitif C4–C6 Taksonomi SOLO Relational hingga Extended Abstract) dikonversikan ke skala 0–100.',
  },
  materiAjar: {
    materiIntiInput:
      'Unggah-ungguh basa Jawa: perbedaan Ngoko Lugu, Ngoko Alus, Krama Lugu, lan Krama Alus sarta penerapane ing pacelathon sedina-dina.',
    judulMateri: 'Unggah-Ungguh Basa Jawa: Ngoko lan Krama ing Pacelathon',
    bab: 'Bab 2: Tata Krama Berbahasa',
    tujuanPembelajaran:
      'Murid mampu membedakan ragam ngoko lan krama serta menggunakannya secara tepat dalam percakapan sehari-hari sesuai tata krama.',
    petaKonsep: {
      pusat: 'Unggah-Ungguh Basa Jawa',
      cabang: [
        {
          judul: 'Basa Ngoko',
          poin: ['Ngoko Lugu (antar kanca raket / marang wong enom)', 'Ngoko Alus (ngoko + tembung krama inggil kanggo ngajeni)'],
        },
        {
          judul: 'Basa Krama',
          poin: ['Krama Lugu (marang wong sing durung pati tepung)', 'Krama Alus / Inggil (marang wong tuwa, guru, sesepuh)'],
        },
        {
          judul: 'Prinsip Etika Tutur',
          poin: ['Tembung Krama Inggil ora kena kanggo awake dhewe', 'Diiringi solah bawa lan intonasi kang sareh'],
        },
      ],
    },
    paragrafRingkasan: [
      'Unggah-ungguh basa Jawa minangka tata pranatan utawa aturan sopan santun nalika guneman nganggo basa Jawa. Pemilihan tembung ditemtokake dening sapa sing ngomong, sapa sing diajak guneman, lan kahanan nalika pacelathon dumadi.',
      'Basa Ngoko kaperang dadi Ngoko Lugu lan Ngoko Alus. Ngoko Lugu kabeh tembunge ngoko, digunakake antarane kanca sakanca kang wis raket. Dene Ngoko Alus iku tembunge ngoko kecampuran krama inggil tumrap wong sing diajeni.',
      'Basa Krama Alus digunakake dening wong enom marang wong sing luwih tuwa, kayata murid marang guru utawa anak marang wong tuwa. Aturan wigati yaiku tembung krama inggil (kayata tindak, dhahar, sare) mung ditujokake kanggo wong sing diajeni, ora kanggo awake dhewe.',
    ],
    kosakataPenting: [
      { ngoko: 'Mangan', krama: 'Nedha (diri) / Dhahar (orang lain)', arti: 'Makan' },
      { ngoko: 'Lunga', krama: 'Kesah (diri) / Tindak (orang lain)', arti: 'Pergi' },
      { ngoko: 'Turu', krama: 'Tilem (diri) / Sare (orang lain)', arti: 'Tidur' },
      { ngoko: 'Takon', krama: 'Taken (diri) / Nyuwun pirsa (orang lain)', arti: 'Bertanya' },
      { ngoko: 'Omah', krama: 'Griya (diri) / Dalem (orang lain)', arti: 'Rumah' },
    ],
    contohKontekstual:
      'Contoh Dialog Krama Alus:\nMurid: "Nuwun sewu, Pak Guru. Kula badhe nyuwun pirsa, tugas aksara Jawa menika dipunkempalaken dinten menapa?"\nGuru: "Sesuk esuk wae ya, Le, jam pitu wis diklumpukake."',
  },
  lkpd: {
    materiInput: 'Unggah-Ungguh Basa Jawa (Analisis Kesalahan Kalimat Krama & Penyusunan Pacelathon)',
    judulLkpd: 'LKPD Detektif Unggah-Ungguh Basa Jawa',
    tujuanPembelajaran:
      'Murid mampu menganalisis ketepatan penggunaan tembung ngoko lan krama dalam teks dialog serta menyusun pacelathon santun untuk dipresentasikan.',
    apersepsi:
      'Coba bayangkan kalian bertemu Kepala Sekolah di gerbang sekolah pada pagi hari. Bandingkan dua sapaan ini: (1) "Pak, arep lunga menyang ngendi?" vs (2) "Sugeng enjang, Pak. Badhe tindak pundi?" Mana yang terasa lebih menghormati dan mengapa?',
    kegiatanInti: {
      petunjuk: 'Diskusikan bersama kelompokmu (4–5 orang), analisis kalimat di bawah ini secara kritis, lalu presentasikan hasilnya di depan kelas!',
      stimulus:
        'Teks Kasus:\nRina matur marang ibune: "Bu, kula badhe dhahar rumiyin amargi mangke badhe kesah sekolah. Ibu punapa sampun nedha?"',
      tugasKritis: [
        '1. [Analisis - C4] Temukan dua kesalahan penggunaan kata krama inggil pada ucapan Rina di atas, lalu jelaskan alasannya!',
        '2. [Evaluasi - C5] Mengapa kata "dhahar" tidak tepat dipakai Rina untuk dirinya sendiri, dan kata "nedha" kurang tepat ditujukan untuk ibunya?',
        '3. [Kreasi & Presentasi - C6] Perbaiki kalimat tersebut, lalu buatlah lanjutan dialog 4 baris antara Rina dan Ibu yang mencerminkan bakti anak. Siapkan peran untuk dipresentasikan di depan kelas!',
      ],
      panduanPresentasi:
        'Setiap kelompok maju ke depan kelas: 1 murid membacakan hasil analisis kesalahan kalimat, dan 2 murid memerankan dialog perbaikan dengan intonasi dan solah bawa yang santun. Kelompok lain memberi tanggapan apresiatif.',
    },
    refleksiSiswa: [
      'Apa hal baru yang paling penting saya pahami tentang penggunaan kata krama inggil hari ini?',
      'Bagian mana saat diskusi atau presentasi yang membuat saya paling bersemangat?',
      'Kalimat krama alus apa yang akan saya praktikkan kepada orang tua di rumah nanti sore?',
    ],
  },
  soalFormatif: {
    intiMateri: 'Unggah-Ungguh Basa Jawa (Ngoko Lugu, Ngoko Alus, Krama Lugu, Krama Alus)',
    jumlahSoal: 5,
    jenisDipilih: ['Pilihan Ganda ABCD', 'Pilihan Ganda Kompleks / MCMA', 'Isian Pendek', 'Essay', 'Tes Lisan'],
    kktp: 'Murid dinyatakan mencapai KKTP apabila memperoleh skor minimal 76 dari 100 dengan ketepatan analisis perbedaan ragam ngoko dan krama.',
    kisiKisi: [
      {
        id: 'kf1',
        no: 1,
        tp: 'Menganalisis ketepatan penggunaan basa krama alus',
        materi: 'Unggah-Ungguh Basa',
        indikatorSoal: 'Disajikan kalimat dialog murid kepada guru, murid dapat menentukan perbaikan diksi krama inggil yang tepat.',
        levelKognitif: 'C4 (Menganalisis)',
        bentukSoal: 'Pilihan Ganda ABCD',
        noSoal: '1',
      },
      {
        id: 'kf2',
        no: 2,
        tp: 'Mengidentifikasi pasangan tembung krama inggil yang tepat',
        materi: 'Kosakata Krama Inggil',
        indikatorSoal: 'Murid memilih lebih dari satu pernyataan benar tentang penggunaan tembung krama untuk orang lain.',
        levelKognitif: 'C4 (Menganalisis)',
        bentukSoal: 'Pilihan Ganda Kompleks / MCMA',
        noSoal: '2',
      },
      {
        id: 'kf3',
        no: 3,
        tp: 'Melengkapi kalimat rumpang dengan ragam krama',
        materi: 'Kosakata Krama',
        indikatorSoal: 'Murid melengkapi kalimat tentang kebiasaan orang tua dengan kata krama inggil yang sesuai.',
        levelKognitif: 'C3–C4',
        bentukSoal: 'Isian Pendek',
        noSoal: '3',
      },
      {
        id: 'kf4',
        no: 4,
        tp: 'Mengevaluasi kesalahan penggunaan unggah-ungguh dalam paragraf',
        materi: 'Analisis Teks Pacelathon',
        indikatorSoal: 'Murid mengevaluasi dan memperbaiki kalimat krama yang keliru penerapannya.',
        levelKognitif: 'C5 (Mengevaluasi)',
        bentukSoal: 'Essay',
        noSoal: '4',
      },
      {
        id: 'kf5',
        no: 5,
        tp: 'Mempraktikkan tuturan santun secara lisan',
        materi: 'Pacelathon',
        indikatorSoal: 'Murid mempraktikkan kalimat izin keluar kelas kepada guru secara lisan.',
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
        pertanyaan: 'Gatekna ukara iki: "Pak Guru, kula badhe kondur rumiyin amargi sakit." Tembung kang kurang trep ing ukara kasebut yaiku "kondur". Owahana supaya bener miturut unggah-ungguh!',
        opsi: [
          'A. Pak Guru, kula badhe mulih rumiyin amargi sakit.',
          'B. Pak Guru, kula badhe wangsul rumiyin amargi sakit.',
          'C. Pak Guru, kula badhe tindak rumiyin amargi gerah.',
          'D. Pak Guru, sampeyan badhe wangsul rumiyin amargi sakit.',
        ],
        kunciJawaban: 'B',
        skorMaksimal: 15,
        pedomanPenskoran: 'Skor 15 jika memilih B (wangsul untuk diri sendiri), skor 0 jika salah.',
      },
      {
        id: 'sf2',
        no: 2,
        bentuk: 'Pilihan Ganda Kompleks / MCMA',
        pertanyaan: 'Pilihlah DUA pernyataan yang benar mengenai penggunaan tembung krama inggil untuk orang yang lebih tua!',
        opsi: [
          'A. Kata "dhahar" digunakan untuk mempersilakan orang tua atau guru makan.',
          'B. Kata "sare" digunakan untuk menyatakan diri sendiri sedang tidur.',
          'C. Kata "tindak" digunakan saat menanyakan tujuan perjalanan guru.',
          'D. Kata "dalem" digunakan untuk menyebut rumah milik teman sebaya.',
        ],
        kunciJawaban: 'A dan C',
        skorMaksimal: 20,
        pedomanPenskoran: 'Skor 20 jika memilih kedua jawaban tepat (A & C), skor 10 jika hanya 1 benar.',
      },
      {
        id: 'sf3',
        no: 3,
        bentuk: 'Isian Pendek',
        pertanyaan: 'Eyang sampun ... wiwit jam sanga dalu amargi sayah. (Isilah dengan tembung krama inggil dari "tidur")',
        opsi: [],
        kunciJawaban: 'sare',
        skorMaksimal: 15,
        pedomanPenskoran: 'Skor 15 jika menjawab "sare" dengan ejaan benar.',
      },
      {
        id: 'sf4',
        no: 4,
        bentuk: 'Essay',
        pertanyaan: 'Analisislah kesalahan pada kalimat: "Bu, kula sampun dhahar sekul goreng, Ibu punapa sampun nedha?" lalu tuliskan perbaikan yang tepat!',
        opsi: [],
        kunciJawaban: 'Kesalahan: "dhahar" (krama inggil) dipakai untuk diri sendiri dan "nedha" dipakai untuk Ibu. Perbaikan: "Bu, kula sampun nedha sekul goreng, Ibu punapa sampun dhahar?"',
        skorMaksimal: 25,
        pedomanPenskoran: 'Menjelaskan alasan 2 kesalahan = 15 poin; menuliskan perbaikan tepat = 10 poin.',
      },
      {
        id: 'sf5',
        no: 5,
        bentuk: 'Tes Lisan',
        pertanyaan: 'Praktikkan secara lisan di depan guru: bagaimana cara meminta izin kepada Pak/Bu Guru untuk meminjam buku di perpustakaan menggunakan basa krama alus!',
        opsi: [],
        kunciJawaban: 'Contoh: "Nuwun sewu, Bu Guru. Kula nyuwun ijin badhe nyambut buku wonten perpustakaan."',
        skorMaksimal: 25,
        pedomanPenskoran: 'Ketepatan diksi krama (15 poin) + intonasi & sikap santun (10 poin).',
      },
    ],
    pedomanUmum: 'Nilai Akhir = (Jumlah Skor Perolehan / 100) x 100. Skor >= 76 dinyatakan tuntas KKTP.',
  },
  soalSumatif: {
    intiMateri: 'Crita Rakyat Jawa, Unggah-Ungguh Basa, lan Geguritan',
    jumlahSoal: 5,
    jenisDipilih: ['Pilihan Ganda ABCD', 'Pilihan Ganda Kompleks / MCMA'],
    kktp: 'Murid dinyatakan tuntas Sumatif Lingkup Materi apabila memperoleh nilai minimal 76.',
    kisiKisi: [
      {
        id: 'ks1',
        no: 1,
        tp: 'Menganalisis amanat crita rakyat Jawa',
        materi: 'Crita Rakyat',
        indikatorSoal: 'Disajikan kutipan crita rakyat, murid menganalisis nilai budi pekerti utama.',
        levelKognitif: 'C4 (Menganalisis)',
        bentukSoal: 'Pilihan Ganda ABCD',
        noSoal: '1',
      },
      {
        id: 'ks2',
        no: 2,
        tp: 'Menentukan kalimat krama alus yang tepat',
        materi: 'Unggah-Ungguh Basa',
        indikatorSoal: 'Murid memilih dua kalimat yang memenuhi kaidah krama alus dengan benar.',
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
        pertanyaan: 'Ing crita rakyat "Rawa Pening", Baru Klinthing sanajan wujud ula nanging tetep ngupadi kabecikan lan nulungi wong sing gelem ngajeni liyan. Pitutur luhur kang bisa dijupuk saka watak kasebut yaiku...',
        opsi: [
          'A. Aja seneng nyawang wong liya mung saka rupa njabane wae.',
          'B. Kita kudu ngumpulake bandha saakeh-akehe.',
          'C. Wong kang kuat mesthi menang ing saben pasulayan.',
          'D. Aja gelem tetulung marang wong kang ora dikenal.',
        ],
        kunciJawaban: 'A',
        skorMaksimal: 20,
        pedomanPenskoran: 'Benar = 20, Salah = 0.',
      },
      {
        id: 'ss2',
        no: 2,
        bentuk: 'Pilihan Ganda Kompleks / MCMA',
        pertanyaan: 'Pilihlah DUA kalimat basa krama alus yang benar penggunaannya!',
        opsi: [
          'A. Bapak tindak dhateng kantor nitih sepedha motor.',
          'B. Kula badhe sare rumiyin amargi sampun dalu.',
          'C. Ibu nembe maos koran wonten teras.',
          'D. Pak Guru sampun nedha sekul soto wonten kantin.',
        ],
        kunciJawaban: 'A dan C',
        skorMaksimal: 20,
        pedomanPenskoran: 'Benar kedua opsi = 20, benar 1 = 10, salah = 0.',
      },
    ],
    pedomanUmum: 'Nilai Sumatif = (Total Skor Perolehan / Total Skor Maksimal) x 100.',
  },
  penilaianList: PENILAIAN_KATEGORI_LIST,
};

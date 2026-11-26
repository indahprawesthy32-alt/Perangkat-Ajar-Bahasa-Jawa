export type MenuId =
  | 'analisis_cp'
  | 'atp'
  | 'alokasi_waktu'
  | 'kktp'
  | 'prota_promes'
  | 'jurnal'
  | 'modul_ajar'
  | 'materi_ajar'
  | 'lkpd'
  | 'soal'
  | 'penilaian';

export interface IdentitasSekolah {
  satuanPendidikan: string;
  mataPelajaran: string;
  fase: string;
  kelas: string;
  semester: string;
  tahunPelajaran: string;
  kotaTanggal: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaGuru: string;
  nipGuru: string;
}

export interface CpElement {
  id: string;
  elemen: string;
  capaianPembelajaran: string;
}

export interface TpRow {
  id: string;
  no: number;
  bab: string;
  elemen: string;
  cp: string;
  tp: string;
  semester: 'Gasal' | 'Genap';
}

export type DimensiProfilKey =
  | 'Keimanan dan Ketaqwaan'
  | 'Kewargaan'
  | 'Penalaran Kritis'
  | 'Kreativitas'
  | 'Kolaborasi'
  | 'Kemandirian'
  | 'Komunikasi';

export interface AtpRow {
  id: string;
  no: number;
  elemen: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  lingkupMateri: string;
  dimensiProfilLulusan: string[];
  waktuJp: number;
  semester: 'Gasal' | 'Genap';
}

export interface BulanAlokasi {
  id: string;
  no: number;
  namaBulan: string;
  jumlahMinggu: number;
  jumlahHariEfektif: number;
  jumlahMingguEfektif: number;
  ket: string;
}

export interface SemesterCalc {
  jpPerMinggu: number;
  jamEfektifKbmPerMinggu: number;
  jamFormatif: number;
  jamSumatif: number;
  cadangan: number;
}

export interface DistribusiMateri {
  id: string;
  semester: 'Gasal' | 'Genap';
  materiPokok: string;
  alokasiJp: number;
}

export interface AlokasiWaktuState {
  menitPerJp: number;
  bulanGasal: BulanAlokasi[];
  bulanGenap: BulanAlokasi[];
  calcGasal: SemesterCalc;
  calcGenap: SemesterCalc;
  distribusi: DistribusiMateri[];
  sumatifTotal: number;
  formatifTotal: number;
  cadanganTotal: number;
}

export interface KktpRow {
  id: string;
  kodeTp: string;
  tujuanPembelajaran: string;
  perluBimbingan: string;
  cukup: string;
  baik: string;
  sangatBaik: string;
}

export interface ProtaRow {
  id: string;
  no: number;
  atp: string;
  materiPokok: string;
  semester: 'Gasal' | 'Genap';
  alokasiJp: number;
}

export type MonthKey =
  | 'jul'
  | 'ags'
  | 'sep'
  | 'okt'
  | 'nov'
  | 'des'
  | 'jan'
  | 'feb'
  | 'mar'
  | 'apr'
  | 'mei'
  | 'jun';

export interface PromesRow {
  id: string;
  no: number;
  tp: string;
  materiPokok: string;
  semester: 'Gasal' | 'Genap';
  alokasiJp: number;
  bulan: Record<MonthKey, boolean>;
}

export interface JurnalRow {
  id: string;
  pertemuanKe: number;
  hariTgl: string;
  bab: string;
  tp: string;
  materiPokok: string;
  ringkasanKegiatan: string;
  absensi: string;
  metode: string;
  penilaian: string;
  refleksi: string;
}

export type ModelPembelajaranId =
  | 'PBL'
  | 'PJBL'
  | 'STEAM'
  | 'DISCOVERY'
  | 'INQUIRY';

export interface ModulSintakItem {
  sintakTitle: string;
  deepLearningTag: string;
  aktivitas: string[];
}

export interface ModulAjarState {
  mataPelajaran: string;
  materiPelajaran: string;
  alokasiWaktu: string;
  modelPembelajaran: ModelPembelajaranId;
  kesiapanMurid: string;
  karakteristikMateri: string;
  dimensiChecklist: {
    penalaranKritis: { checked: boolean; deskripsi: string };
    kreativitas: { checked: boolean; deskripsi: string };
    kolaborasi: { checked: boolean; deskripsi: string };
    kemandirian: { checked: boolean; deskripsi: string };
    komunikasi: { checked: boolean; deskripsi: string };
    keimanan: { checked: boolean; deskripsi: string };
    kewargaan: { checked: boolean; deskripsi: string };
  };
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  praktikPedagogis: {
    pendekatan: string;
    metode: string;
  };
  lingkunganKemitraan: {
    budayaBelajar: string;
    ruangFisik: string;
    kemitraanAntarmurid: string;
  };
  pemanfaatanDigital: {
    platform: string;
    perangkat: string;
    mediaBahanAjar: string;
  };
  pendahuluan: string[];
  alokasiPendahuluan: string;
  intiSintaks: ModulSintakItem[];
  alokasiInti: string;
  penutup: string[];
  alokasiPenutup: string;
  asesmenFormatif: string[];
  asesmenSumatif: string;
}

export interface MateriAjarState {
  materiIntiInput: string;
  judulMateri: string;
  bab: string;
  tujuanPembelajaran: string;
  petaKonsep: {
    pusat: string;
    cabang: Array<{ judul: string; poin: string[] }>;
  };
  paragrafRingkasan: string[];
  kosakataPenting: Array<{ ngoko: string; krama: string; arti: string }>;
  contohKontekstual: string;
}

export interface LkpdState {
  materiInput: string;
  judulLkpd: string;
  tujuanPembelajaran: string;
  apersepsi: string;
  kegiatanInti: {
    petunjuk: string;
    stimulus: string;
    tugasKritis: string[];
    panduanPresentasi: string;
  };
  refleksiSiswa: string[];
}

export type BentukSoalFormatif =
  | 'Pilihan Ganda ABCD'
  | 'Pilihan Ganda Kompleks / MCMA'
  | 'Essay'
  | 'Tes Lisan'
  | 'Isian Pendek';

export interface KisiKisiRow {
  id: string;
  no: number;
  tp: string;
  materi: string;
  indikatorSoal: string;
  levelKognitif: string;
  bentukSoal: string;
  noSoal: string;
}

export interface SoalItem {
  id: string;
  no: number;
  bentuk: BentukSoalFormatif;
  pertanyaan: string;
  opsi: string[];
  kunciJawaban: string;
  skorMaksimal: number;
  pedomanPenskoran: string;
}

export interface PaketSoalState {
  intiMateri: string;
  jumlahSoal: number;
  jenisDipilih: BentukSoalFormatif[];
  kktp: string;
  kisiKisi: KisiKisiRow[];
  soal: SoalItem[];
  pedomanUmum: string;
}

export interface PenilaianInstrument {
  id: string;
  kategori: string;
  judul: string;
  deskripsi: string;
  kolom: string[];
  baris: string[][];
  catatan: string;
}

export interface AppState {
  identitas: IdentitasSekolah;
  cpElements: CpElement[];
  tpRows: TpRow[];
  atpRows: AtpRow[];
  alokasiWaktu: AlokasiWaktuState;
  kktpRows: KktpRow[];
  protaRows: ProtaRow[];
  promesRows: PromesRow[];
  jurnalRows: JurnalRow[];
  modulAjar: ModulAjarState;
  materiAjar: MateriAjarState;
  lkpd: LkpdState;
  soalFormatif: PaketSoalState;
  soalSumatif: PaketSoalState;
  penilaianList: PenilaianInstrument[];
}

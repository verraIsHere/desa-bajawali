export const desaInfo = {
  name: 'Desa Bajawali',
  kepalaDesa: 'Ketut Langga, S.Ag',
  kecamatan: 'Lariang',
  kabupaten: 'Pasangkayu',
  provinsi: 'Sulawesi Barat',
  penduduk: '835',
  lakiLaki: '436',
  perempuan: '399',
  kk: '257',
  dusun: '4',
  rt: '8',
  luasWilayah: '7.125,816', // Ha
  ketinggian: '0–500 mdpl',
  curahHujan: '177,5 mm/tahun',
  suhu: '22°C–31°C',
  moto: 'BAJAWALIKU JAYA',
  tahunData: '2026',
}

export const batasWilayah = [
  { arah: 'Utara', batas: 'Desa Parabu' },
  { arah: 'Timur', batas: 'Desa Karave, Kecamatan Bulutaba' },
  { arah: 'Selatan', batas: 'HGU PT Unggul Widya Tek' },
  { arah: 'Barat', batas: 'Desa Singgani' },
]

export const lembagaPerekonomian = [
  { nama: 'Gapoktan', jumlah: 1, satuan: 'kelompok' },
  { nama: 'BUMDesa', jumlah: 1, satuan: 'kelompok' },
  { nama: 'Kelompok Tani', jumlah: 10, satuan: 'kelompok' },
  { nama: 'Kelompok Ternak', jumlah: 1, satuan: 'kelompok' },
]

export type SaranaItem = {
  nama: string
  jumlah?: number
  satuan?: string
}

export const saranaDesa: { kategori: string; items: SaranaItem[] }[] = [
  {
    kategori: 'Kesehatan',
    items: [
      { nama: 'PUSTU', jumlah: 1, satuan: 'unit' },
      { nama: 'POSKESDES', jumlah: 1, satuan: 'unit' },
      { nama: 'POSYANDU', jumlah: 1, satuan: 'unit' },
    ],
  },
  {
    kategori: 'Peribadatan',
    items: [
      { nama: 'Pura', jumlah: 6, satuan: 'unit' },
      { nama: 'Masjid', jumlah: 1, satuan: 'unit' },
      { nama: 'Mushola', jumlah: 2, satuan: 'unit' },
    ],
  },
  {
    kategori: 'Olahraga',
    items: [
      { nama: 'Lapangan Voly', jumlah: 2, satuan: 'buah' },
      { nama: 'Lapangan Bola Kaki', jumlah: 1, satuan: 'buah' },
      { nama: 'Lapangan Takraw', jumlah: 1, satuan: 'buah' },
    ],
  },
  {
    kategori: 'Kesenian',
    items: [
      { nama: 'Seni Gamelan', jumlah: 2, satuan: 'grup' },
      { nama: 'Seni Tari', jumlah: 3, satuan: 'grup' },
      { nama: 'Upacara Adat', jumlah: 2, satuan: 'grup' },
    ],
  },
  {
    kategori: 'Transportasi',
    items: [
      { nama: 'Angkutan Pedesaan', jumlah: 1, satuan: 'unit' },
      { nama: 'Motor Dinas', jumlah: 9, satuan: 'unit' },
    ],
  },
  {
    kategori: 'Pemerintahan',
    items: [
      { nama: 'Kantor Desa' },
      { nama: 'Gedung Kantor BPD' },
      { nama: 'Gedung PKK' },
      { nama: 'Balai Pertemuan' },
    ],
  },
]

export const mataPencaharian = [
  'Petani Pekebun',
  'Peternak',
  'Pedagang',
  'Buruh Tani',
  'Kontruksi',
  'Pegawai',
]

export const beritaDummy = [
  {
    id: '1',
    slug: 'penyerahan-hibah-motor-kepada-umat-hindu-dan-umat-islam',
    title: 'Penyerahan Hibah Motor kepada Umat Hindu dan Umat Islam',
    category: 'Pemerintahan',
    date: '22 Sep 2026',
    excerpt:
      'Pemerintah Desa Bajawali melaksanakan penyerahan hibah kendaraan motor kepada umat Hindu dan umat Islam sebagai bagian dari dukungan terhadap kegiatan keagamaan dan pelayanan masyarakat di Desa Bajawali.',
    content:
      'Pemerintah Desa Bajawali melaksanakan penyerahan hibah kendaraan motor kepada umat Hindu dan umat Islam sebagai bagian dari dukungan terhadap kegiatan keagamaan dan pelayanan masyarakat di Desa Bajawali. Penyerahan ini diharapkan dapat membantu menunjang mobilitas serta pelaksanaan kegiatan keagamaan masing-masing umat, sekaligus memperkuat kerukunan antarumat beragama yang selama ini terjalin dengan baik di Desa Bajawali.\n\nHibah kendaraan tersebut diharapkan dimanfaatkan sebaik-baiknya untuk mendukung operasional kegiatan kemasyarakatan, antara lain antar-jemput pelaksanaan kegiatan keagamaan, distribusi bantuan, serta mobilitas pengurus organisasi keagamaan di lingkungan desa. Penyerahan dilakukan secara simbolis di Kantor Desa Bajawali dan dihadiri oleh perangkat desa beserta tokoh masyarakat dari masing-masing umat.\n\nMelalui kegiatan ini, Pemerintah Desa Bajawali menegaskan komitmennya untuk melayani seluruh warga tanpa memandang latar belakang agama, serta terus membangun kebersamaan yang menjadi modal utama pembangunan desa.',
    image: '/gambar/galeri/galeri_2.webp',
  },
  {
    id: '2',
    slug: 'penyerahan-bpjs-ketenagakerjaan-kepada-pegawainsara',
    title: 'Penyerahan BPJS Ketenagakerjaan kepada Pegawainsara',
    category: 'Pemerintahan',
    date: '22 Sep 2026',
    excerpt:
      'Pemerintah Desa Bajawali melaksanakan kegiatan penyerahan BPJS Ketenagakerjaan kepada Pegawainsara sebagai bentuk perhatian terhadap perlindungan dan jaminan sosial bagi masyarakat yang menjalankan peran dalam kegiatan keagamaan.',
    content:
      'Pemerintah Desa Bajawali melaksanakan kegiatan penyerahan BPJS Ketenagakerjaan kepada Pegawainsara sebagai bentuk perhatian terhadap perlindungan dan jaminan sosial bagi masyarakat yang menjalankan peran dalam kegiatan keagamaan. Melalui kepesertaan BPJS Ketenagakerjaan, diharapkan penerima memperoleh perlindungan dalam menjalankan aktivitasnya serta dapat melaksanakan tugas dan pengabdian kepada masyarakat dengan lebih aman.\n\nKegiatan penyerahan ini sekaligus menjadi ajang sosialisasi tentang manfaat program jaminan sosial ketenagakerjaan, mulai dari jaminan kecelakaan kerja, jaminan hari tua, hingga santunan bagi peserta dan ahli warisnya. Dengan adanya perlindungan tersebut, para penerima diharapkan tidak lagi ragu dalam menjalankan tugas lapangan yang menuntut aktivitas fisik.\n\nPemerintah Desa Bajawali berkomitmen untuk terus memperluas cakupan perlindungan jaminan sosial bagi warganya, agar setiap pihak yang berkontribusi bagi kemajuan desa merasa aman dan dijamin kesejahteraannya.',
    image: '/gambar/galeri/galeri_6.webp',
  },
  {
    id: '3',
    slug: 'sosialisasi-surat-tanda-daftar-budidaya-std-b',
    title: 'Sosialisasi Surat Tanda Daftar Budidaya (STD-B)',
    category: 'Pertanian',
    date: '22 Sep 2026',
    excerpt:
      'Desa Bajawali mengikuti kegiatan sosialisasi Surat Tanda Daftar Budidaya (STD-B) tingkat berkebun dalam rangka penanganan Dana Bagi Hasil (DBH) Sawit Kabupaten Pasangkayu.',
    content:
      'Desa Bajawali mengikuti kegiatan sosialisasi Surat Tanda Daftar Budidaya (STD-B) tingkat berkebun dalam rangka penanganan Dana Bagi Hasil (DBH) Sawit Kabupaten Pasangkayu. Kegiatan ini diselenggarakan oleh Dinas Perkebunan dan Peternakan Kabupaten Pasangkayu Tahun Anggaran 2026 sebagai upaya memberikan pemahaman kepada masyarakat mengenai pendataan dan administrasi kegiatan budidaya perkebunan, khususnya yang berkaitan dengan komoditas kelapa sawit.\n\nSosialisasi memaparkan tata cara pengurusan STD-B, mulai dari persyaratan dokumen, alur pendaftaran, hingga peran kelompok pekebun dalam pendataan lahan. STD-B sendiri menjadi dokumen penting sebagai bukti legalitas usaha budidaya pekebun, yang sekaligus menjadi salah satu prasyarat dalam penyaluran Dana Bagi Hasil (DBH) Sawit kepada daerah.\n\nBagi pekebun Desa Bajawali, kegiatan ini memberikan kejelasan langkah administrasi yang harus dilakukan agar hak atas hasil kebun mereka dapat tercatat dan terlayani dengan baik. Pemerintah Desa Bajawali akan mendampingi warga dalam proses pendataan tersebut, sehingga seluruh pekebun di desa dapat terdaftar dan memperoleh manfaatnya.',
    image: '/gambar/galeri/galeri_9.webp',
  },
]

export const galeriDummy = [
   {
    id: '4',
    url: '/gambar/galeri/galeri_4.webp',
    caption: 'Foto Kebersamaan dan Dokumentasi Bersama Warga',
    category: 'Kegiatan Masyarakat',
  },
  {
    id: '1',
    url: '/gambar/galeri/galeri_2.webp',
    caption: 'Penyerahan Bantuan Hibah Sepeda Motor untuk Umat Hindu',
    category: 'Keagamaan',
  },
  {
    id: '2',
    url: '/gambar/galeri/galeri_3.webp',
    caption: 'Penyerahan Bantuan Hibah Sepeda Motor untuk Umat Islam',
    category: 'Keagamaan',
  },
  {
    id: '3',
    url: '/gambar/galeri/galeri_1.webp',
    caption: 'Peringatan Hari Ulang Tahun (Dirgahayu) RI ke-80',
    category: 'Kegiatan Masyarakat',
  },
 
  {
    id: '5',
    url: '/gambar/galeri/galeri_5.webp',
    caption: 'Aksi Gotong Royong Penambalan Jalan Berlubang',
    category: 'Infrastruktur',
  },
  {
    id: '6',
    url: '/gambar/galeri/galeri_6.webp',
    caption: 'Penyerahan Kartu BPJS Ketenagakerjaan bagi Pegawai Syara',
    category: 'Pemerintahan',
  },
  {
    id: '7',
    url: '/gambar/galeri/galeri_7.webp',
    caption: 'Dokumentasi Silaturahmi dan Kebersamaan Warga',
    category: 'Kegiatan Masyarakat',
  },
  {
    id: '8',
    url: '/gambar/galeri/galeri_8.webp',
    caption: 'Pelaksanaan Kegiatan Kelas Ibu Hamil Desa Bajawali',
    category: 'Kesehatan',
  },
  {
    id: '9',
    url: '/gambar/galeri/galeri_9.webp',
    caption: 'Sosialisasi Surat Tanda Daftar Budidaya (STD-B)',
    category: 'Pemerintahan',
  },
  {
    id: '10',
    url: '/gambar/galeri/galeri_10.webp',
    caption: 'Peringatan Hari Pramuka Desa Bajawali',
    category: 'Pemuda',
  },
  {
    id: '11',
    url: '/gambar/galeri/galeri_11.webp',
    caption: 'Gotong Royong Pembersihan Area Kantor Desa',
    category: 'Pemerintahan',
  },
  {
    id: '12',
    url: '/gambar/galeri/galeri_12.webp',
    caption: 'Panen Kelapa Sawit Bersama secara Gotong Royong',
    category: 'Potensi Alam',
  },
  {
    id: '13',
    url: '/gambar/galeri/galeri_13.webp',
    caption: 'Pemanenan Kelapa Sawit oleh Petani Desa Bajawali',
    category: 'Potensi Alam',
  },
]
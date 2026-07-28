export interface Reflection4C {
  connection: string;
  challenge: string;
  concept: string;
  change: string;
}

export interface Artifact {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'video';
  fileUrl: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  reflection4c?: Reflection4C;
  artifacts: Artifact[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  semester: number;
  reflection4c?: Reflection4C;
  topics: Topic[];
}

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'PPG-001',
    title: 'Pemahaman tentang Peserta Didik dan Pembelajarannya',
    description: 'Mata kuliah yang mendalami karakteristik, latar belakang, serta gaya belajar siswa SD.',
    semester: 1,
    reflection4c: {
      connection: 'Keterkaitan teori perkembangan anak Teori Piaget dengan praktik pembelajaran diferensiasi.',
      challenge: 'Tantangan menghadapi keberagaman tingkat konsentrasi peserta didik di kelas inklusif.',
      concept: 'Konsep kerangka kerja Pembelajaran Berdiferensiasi dan DAP (Developmentally Appropriate Practice).',
      change: 'Perubahan mindset dari mengajar secara generik menjadi berpusat pada minat individual anak.'
    },
    topics: [
      {
        id: 't1',
        title: 'Topik 1: Teori Perkembangan Anak & Asesmen Inisial',
        description: 'Pemetaan gaya belajar dan asesmen diagnostik non-kognitif awal.',
        reflection4c: {
          connection: 'Menghubungkan asesmen diagnostik dengan penyusunan Modul Ajar.',
          challenge: 'Menyusun instrumen asesmen yang ramah anak tanpa memicu ketakutan.',
          concept: 'Asesmen sebagai pembelajaran (Assessment as Learning).',
          change: 'Lebih rutin melakukan observasi perilaku harian anak.'
        },
        artifacts: [
          {
            id: 'a1',
            title: 'LK 2.1 Modul Ajar Berdiferensiasi',
            type: 'pdf',
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            description: 'Modul Ajar IPAS Kelas 4 dengan pendekatan diferensiasi proses & produk.'
          },
          {
            id: 'a2',
            title: 'Dokumentasi Praktik Asesmen',
            type: 'image',
            fileUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
            description: 'Foto suasana anak-anak mengerjakan pemetaan gaya belajar.'
          }
        ]
      }
    ]
  }
];
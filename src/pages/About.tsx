import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Award, Heart, Sparkles, MapPin, Mail, Compass, Target, CheckCircle2,
  Phone
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EducationItem {
  year: string;
  title: string;
  institution: string;
  description: string;
  color?: string;
}

export const About: React.FC = () => {
  const [profile, setProfile] = useState({
    fullName: 'Hana Permata, S.Pd.',
    title: 'Guru Pendidikan Dasar / SD',
    bio: 'Seorang pendidik berdedikasi tinggi yang berkomitmen mendampingi peserta didik bertumbuh sesuai kodrat alam dan zamannya.',
    philosophy: 'Saya percaya bahwa setiap anak lahir dengan keunikan dan potensinya masing-masing. Peran pendidik bukanlah menuntut atau mencetak, melainkan menuntun benih-benih kebaikan agar dapat mekar secara optimal dalam lingkungan belajar yang aman, nyaman, dan berpihak pada murid.',
    visionIndonesia: 'Mewujudkan pendidikan Indonesia yang inklusif, merata, berpusat pada murid, serta melahirkan generasi yang berdaya cipta, bernalar kritis, dan berkarakter kuat sesuai Profil Pelajar Pancasila.',
    visionTeacher: 'Menjadi pendidik profesional yang reflektif, adaptif terhadap kemajuan teknologi pembelajaran, mengedepankan diferensiasi, serta senantiasa menghadirkan pembelajaran yang memanusiakan hubungan dan berorientasi pada well-being murid.',
    mission: '1. Merancang dan memfasilitasi pembelajaran berdiferensiasi yang kontekstual, kolaboratif, dan menyenangkan.\n2. Melakukan asesmen diagnostik dan formatif secara berkala untuk memetakan kebutuhan serta perkembangan belajar murid.\n3. Mengintegrasikan teknologi digital secara bijak guna memperkaya pengalaman belajar di kelas.\n4. Membangun kemitraan strategis dengan orang tua dan komunitas demi ekosistem belajar yang suportif.\n5. Berkomitmen pada pengembangan diri berkelanjutan melalui komunitas praktisi dan refleksi mandiri.',
    email: 'hana.permata@example.com',
    location: 'Jakarta, Indonesia',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    nim: '202409012345',
    bidangStudi: 'Pendidikan Guru Sekolah Dasar (PGSD)',
    lptk: 'Universitas Negeri Yogyakarta',
    ttl: 'Jakarta, 15 Mei 1999',
    phone: '+62 812-3456-7890',
    gender: 'Perempuan',
    competencies: 'Manajemen Kelas Berpusat Murid, Kurikulum Merdeka, Pembelajaran Berdiferensiasi, Social Emotional Learning (SEL), Asesmen Otentik, Media Pembelajaran Digital'
  });

  const [education, setEducation] = useState<EducationItem[]>([
    { year: '2025 - Sekarang', title: 'Program Profesi Guru (PPG)', institution: 'Universitas Negeri Yogyakarta', description: 'Mengikuti program sertifikasi pendidik profesional Calon Guru.', color: 'bg-hana-yellow text-hana-navy' },
    { year: '2020 - 2024', title: 'S1 Pendidikan Guru Sekolah Dasar (PGSD)', institution: 'Universitas Negeri Yogyakarta', description: 'Lulus dengan Predikat Pujian (Cum Laude).', color: 'bg-hana-teal text-white' },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      if (data) {
        setProfile({
          fullName: data.full_name || 'Hana Permata, S.Pd.',
          title: data.title || 'Guru Pendidikan Dasar / SD',
          bio: data.bio || 'Seorang pendidik berdedikasi tinggi.',
          philosophy: data.philosophy || 'Saya percaya bahwa...',
          visionIndonesia: data.vision_indonesia || 'Mewujudkan pendidikan Indonesia yang inklusif, merata, berpusat pada murid, serta melahirkan generasi yang berdaya cipta, bernalar kritis, dan berkarakter kuat sesuai Profil Pelajar Pancasila.',
          visionTeacher: data.vision_teacher || 'Menjadi pendidik profesional yang reflektif, adaptif terhadap kemajuan teknologi pembelajaran, mengedepankan diferensiasi, serta senantiasa menghadirkan pembelajaran yang memanusiakan hubungan.',
          mission: data.mission || '1. Merancang pembelajaran berdiferensiasi.\n2. Melakukan asesmen formatif berkala.\n3. Mengintegrasikan teknologi pembelajaran secara interaktif.',
          email: data.email || 'hana.permata@example.com',
          location: data.location || 'Jakarta, Indonesia',
          photoUrl: data.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
          nim: data.nim || '202409012345',
          bidangStudi: data.bidang_studi || 'Pendidikan Guru Sekolah Dasar (PGSD)',
          lptk: data.lptk || 'Universitas Negeri Yogyakarta',
          ttl: data.ttl || 'Jakarta, 15 Mei 1999',
          phone: data.phone || '+62 812-3456-7890',
          gender: data.gender || 'Perempuan',
          competencies: data.competencies || 'Manajemen Kelas Berpusat Murid, Kurikulum Merdeka, Pembelajaran Berdiferensiasi, Social Emotional Learning (SEL), Asesmen Otentik, Media Pembelajaran Digital'
        });

        if (data.education_history && Array.isArray(data.education_history) && data.education_history.length > 0) {
          setEducation(data.education_history);
        }
      }
    };
    fetchProfile();
  }, []);

  const skillsList = (profile.competencies || '')
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-10">
      {/* 1. Header Profil Utama */}
      <section className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal flex flex-col md:flex-row items-center gap-8">
        <div className="w-40 h-40 rounded-full bg-hana-pink border-2 border-hana-navy p-2 shrink-0 shadow-brutal-sm relative">
          <img src={profile.photoUrl} alt={profile.fullName} className="w-full h-full object-cover rounded-full border border-hana-navy" />
          <span className="absolute bottom-1 right-1 bg-hana-yellow p-1.5 rounded-full border border-hana-navy">
            <Sparkles className="w-4 h-4 text-hana-navy" />
          </span>
        </div>
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-block bg-hana-teal text-white text-xs font-black px-3 py-1 rounded-full border border-hana-navy shadow-brutal-sm">
            👩‍🏫 {profile.title}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-hana-navy">{profile.fullName}</h1>
          <p className="text-slate-600 font-medium leading-relaxed">{profile.bio}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-sm font-bold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-4 h-4 text-hana-blue" /> {profile.location}
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <Mail className="w-4 h-4 text-hana-pink" /> {profile.email}
            </span>
            {profile.phone && (
              <span className="flex items-center gap-1.5 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-600" /> {profile.phone}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. Kartu Biodata Resmi Mahasiswa PPG */}
      <section className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-hana-navy pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-hana-yellow border-2 border-hana-navy flex items-center justify-center text-hana-navy shadow-brutal-sm font-black text-2xl">
              🪪
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-hana-blue tracking-wider">Identitas Resmi Pendidik</span>
              <h2 className="text-2xl font-black text-hana-navy">Biodata Mahasiswa PPG</h2>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs font-black px-3.5 py-1.5 rounded-full border-2 border-hana-navy shadow-brutal-sm w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Status: Mahasiswa PPG Aktif
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border-2 border-hana-navy rounded-xl shadow-brutal-sm">
            <span className="text-[11px] font-black uppercase text-slate-500">Nomor Induk Mahasiswa (NIM)</span>
            <p className="text-base font-extrabold text-hana-navy mt-1">{profile.nim || '-'}</p>
          </div>

          <div className="p-4 bg-slate-50 border-2 border-hana-navy rounded-xl shadow-brutal-sm">
            <span className="text-[11px] font-black uppercase text-slate-500">Bidang Studi PPG</span>
            <p className="text-base font-extrabold text-hana-navy mt-1">{profile.bidangStudi || '-'}</p>
          </div>

          <div className="p-4 bg-slate-50 border-2 border-hana-navy rounded-xl shadow-brutal-sm">
            <span className="text-[11px] font-black uppercase text-slate-500">LPTK Penyelenggara</span>
            <p className="text-base font-extrabold text-hana-navy mt-1">{profile.lptk || '-'}</p>
          </div>

          <div className="p-4 bg-slate-50 border-2 border-hana-navy rounded-xl shadow-brutal-sm">
            <span className="text-[11px] font-black uppercase text-slate-500">Tempat, Tanggal Lahir</span>
            <p className="text-base font-extrabold text-hana-navy mt-1">{profile.ttl || '-'}</p>
          </div>

          <div className="p-4 bg-slate-50 border-2 border-hana-navy rounded-xl shadow-brutal-sm">
            <span className="text-[11px] font-black uppercase text-slate-500">Jenis Kelamin</span>
            <p className="text-base font-extrabold text-hana-navy mt-1">{profile.gender || '-'}</p>
          </div>

          <div className="p-4 bg-slate-50 border-2 border-hana-navy rounded-xl shadow-brutal-sm">
            <span className="text-[11px] font-black uppercase text-slate-500">Nomor WhatsApp / HP</span>
            <p className="text-base font-extrabold text-hana-navy mt-1">{profile.phone || '-'}</p>
          </div>
        </div>
      </section>

      {/* 3. Filosofi Mengajar & Kompetensi Inti */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 bg-hana-yellow border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-4">
          <div className="flex items-center gap-2 text-hana-navy font-extrabold text-xl">
            <Heart className="w-6 h-6 fill-hana-navy" />
            <h2>Filosofi Mengajar (KHD)</h2>
          </div>
          <p className="text-hana-navy font-medium leading-relaxed whitespace-pre-line">{profile.philosophy}</p>
        </div>
        <div className="md:col-span-5 bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-4">
          <div className="flex items-center gap-2 text-hana-navy font-extrabold text-xl">
            <Award className="w-6 h-6 text-hana-blue" />
            <h2>Kompetensi Inti</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <span key={index} className="bg-slate-100 text-hana-navy text-xs font-bold px-3 py-1.5 rounded-full border border-hana-navy shadow-brutal-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Visi Pendidikan Indonesia & Visi Guru Profesional */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visi untuk Pendidikan Indonesia */}
        <div className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 border-2 border-hana-navy flex items-center justify-center text-teal-700 shadow-brutal-sm">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-teal-700 tracking-wider">Arah & Harapan Bangsa</span>
            <h2 className="text-2xl font-black text-hana-navy mt-1">Visi untuk Pendidikan Indonesia</h2>
          </div>
          <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line text-sm">
            {profile.visionIndonesia}
          </p>
        </div>

        {/* Visi sebagai Calon Guru Profesional */}
        <div className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-hana-navy flex items-center justify-center text-amber-700 shadow-brutal-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">Komitmen Keprofesian</span>
            <h2 className="text-2xl font-black text-hana-navy mt-1">Visi Calon Guru Profesional</h2>
          </div>
          <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line text-sm">
            {profile.visionTeacher}
          </p>
        </div>
      </section>

      {/* 5. Misi Guru Profesional */}
      <section className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-hana-pink text-white border-2 border-hana-navy flex items-center justify-center shadow-brutal-sm">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-hana-pink tracking-wider">Langkah Konkret</span>
            <h2 className="text-2xl font-black text-hana-navy">Misi Guru Profesional</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {profile.mission.split('\n').filter(line => line.trim().length > 0).map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 border-2 border-hana-navy rounded-xl shadow-brutal-sm">
              <CheckCircle2 className="w-5 h-5 text-hana-teal shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-hana-navy leading-relaxed">
                {item.replace(/^\d+[\.\)]\s*/, '')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Riwayat Pendidikan */}
      <section className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-6">
        <div className="flex items-center gap-2 text-hana-navy font-extrabold text-2xl">
          <GraduationCap className="w-7 h-7 text-hana-teal" />
          <h2>Riwayat Pendidikan</h2>
        </div>
        <div className="space-y-6">
          {education.map((edu, idx) => (
            <div key={idx} className="border-2 border-hana-navy rounded-2xl p-6 shadow-brutal-sm space-y-2 relative overflow-hidden bg-slate-50">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border border-hana-navy ${edu.color || 'bg-hana-yellow text-hana-navy'}`}>
                {edu.year}
              </span>
              <h3 className="text-xl font-bold text-hana-navy">{edu.title}</h3>
              <p className="text-sm font-semibold text-hana-blue">{edu.institution}</p>
              <p className="text-slate-600 text-sm font-medium leading-relaxed pt-1">{edu.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
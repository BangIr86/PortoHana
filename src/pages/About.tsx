import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, Heart, Sparkles, MapPin, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const About: React.FC = () => {
  const [profile, setProfile] = useState({
    fullName: 'Hana Permata, S.Pd.',
    title: 'Guru Pendidikan Dasar / SD',
    bio: 'Seorang pendidik berdedikasi tinggi...',
    philosophy: 'Saya percaya bahwa setiap anak lahir dengan keunikan...',
    email: 'hana.permata@example.com',
    location: 'Jakarta, Indonesia',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      if (data) {
        setProfile({
          fullName: data.full_name || 'Hana Permata, S.Pd.',
          title: data.title || 'Guru Pendidikan Dasar / SD',
          bio: data.bio || 'Seorang pendidik berdedikasi tinggi.',
          philosophy: data.philosophy || 'Saya percaya bahwa...',
          email: data.email || 'hana.permata@example.com',
          location: data.location || 'Jakarta, Indonesia',
          photoUrl: data.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
        });
      }
    };
    fetchProfile();
  }, []);

  const education = [
    { year: '2025 - Sekarang', title: 'Program Profesi Guru (PPG)', institution: 'Universitas Negeri', description: 'Mengikuti program sertifikasi pendidik profesional.', color: 'bg-hana-yellow' },
    { year: '2020 - 2024', title: 'S1 Pendidikan Guru', institution: 'Universitas Negeri', description: 'Lulus dengan Predikat Pujian (Cum Laude).', color: 'bg-hana-teal text-white' },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-12">
      <section className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal flex flex-col md:flex-row items-center gap-8">
        <div className="w-40 h-40 rounded-full bg-hana-pink border-2 border-hana-navy p-2 shrink-0 shadow-brutal-sm relative">
          <img src={profile.photoUrl} alt={profile.fullName} className="w-full h-full object-cover rounded-full border border-hana-navy" />
          <span className="absolute bottom-1 right-1 bg-hana-yellow p-1.5 rounded-full border border-hana-navy"><Sparkles className="w-4 h-4 text-hana-navy" /></span>
        </div>
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-block bg-hana-teal text-white text-xs font-bold px-3 py-1 rounded-full border border-hana-navy shadow-brutal-sm">👩‍🏫 {profile.title}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-hana-navy">{profile.fullName}</h1>
          <p className="text-slate-600 font-medium leading-relaxed">{profile.bio}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-sm font-bold">
            <span className="flex items-center gap-1.5 text-slate-700"><MapPin className="w-4 h-4 text-hana-blue" /> {profile.location}</span>
            <span className="flex items-center gap-1.5 text-slate-700"><Mail className="w-4 h-4 text-hana-pink" /> {profile.email}</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 bg-hana-yellow border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-4">
          <div className="flex items-center gap-2 text-hana-navy font-extrabold text-xl"><Heart className="w-6 h-6 fill-hana-navy" /><h2>Filosofi Mengajar</h2></div>
          <p className="text-hana-navy font-medium leading-relaxed">{profile.philosophy}</p>
        </div>
        <div className="md:col-span-5 bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-4">
          <div className="flex items-center gap-2 text-hana-navy font-extrabold text-xl"><Award className="w-6 h-6 text-hana-blue" /><h2>Kompetensi</h2></div>
          <div className="flex flex-wrap gap-2">
            {['Manajemen Kelas', 'Kurikulum Merdeka', 'Design Thinking', 'Modul Ajar', 'Media Digital'].map((skill, index) => (
              <span key={index} className="bg-slate-100 text-hana-navy text-xs font-bold px-3 py-1.5 rounded-full border border-hana-navy shadow-brutal-sm">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-6">
        <div className="flex items-center gap-2 text-hana-navy font-extrabold text-2xl"><GraduationCap className="w-7 h-7 text-hana-teal" /><h2>Riwayat Pendidikan</h2></div>
        <div className="space-y-6">
          {education.map((edu, idx) => (
            <div key={idx} className="border-2 border-hana-navy rounded-2xl p-6 shadow-brutal-sm space-y-2 relative overflow-hidden bg-slate-50">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border border-hana-navy ${edu.color}`}>{edu.year}</span>
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

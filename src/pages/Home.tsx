import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, GraduationCap, FileCheck, Sparkles, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState({
    fullName: 'Hana Permata, S.Pd.',
    title: 'Guru Pendidikan Dasar / SD',
    bio: 'Selamat datang di ruang dokumentasi & refleksi pembelajaran saya.',
    philosophy: 'Pendidikan bukan sekadar mengisi wadah yang kosong...',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
  });

  const [courseCount, setCourseCount] = useState<number>(0);
  const [artifactCount, setArtifactCount] = useState<number>(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      const { data: pData } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      if (pData) {
        setProfile({
          fullName: pData.full_name || 'Hana Permata, S.Pd.',
          title: pData.title || 'Guru SD',
          bio: pData.bio || 'Selamat datang...',
          philosophy: pData.philosophy || 'Pendidikan...',
          photoUrl: pData.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
        });
      }
      
      const { count: cCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      if (cCount !== null) setCourseCount(cCount);

      const { count: aCount } = await supabase.from('artifacts').select('*', { count: 'exact', head: true });
      if (aCount !== null) setArtifactCount(aCount);
    };
    fetchHomeData();
  }, []);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-12">
      <section className="relative bg-white border-2 border-hana-navy rounded-hana p-8 md:p-12 shadow-brutal overflow-hidden">
        <div className="absolute top-4 right-6 bg-hana-pink text-white font-black text-xs px-3 py-1.5 rounded-full border border-hana-navy shadow-brutal-sm rotate-6 hidden sm:block">
          ✨ PPG Calon Guru 2026
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hana-yellow border border-hana-navy text-xs font-bold text-hana-navy shadow-brutal-sm">
              <Sparkles className="w-3.5 h-3.5" /> Halo, Selamat Datang!
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-hana-navy leading-tight tracking-tight">
              Portofolio Digital <br />
              <span className="bg-hana-yellow px-2 py-0.5 rounded-lg border border-hana-navy inline-block mt-1">
                {profile.fullName}
              </span>
            </h1>
            <p className="text-slate-600 font-medium text-base md:text-lg leading-relaxed">{profile.bio}</p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/ppg-corner" className="px-6 py-3 bg-hana-yellow text-hana-navy font-black rounded-full border-2 border-hana-navy shadow-brutal hover:bg-yellow-300 transition-all flex items-center gap-2">
                Jelajahi Artefak <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="px-6 py-3 bg-white text-hana-navy font-bold rounded-full border-2 border-hana-navy shadow-brutal hover:bg-slate-50 transition-all">
                Tentang Saya
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-hana-teal rounded-hana border-2 border-hana-navy rotate-3 group-hover:rotate-6 transition-transform"></div>
              <div className="relative bg-white border-2 border-hana-navy rounded-hana p-4 shadow-brutal -rotate-2 group-hover:rotate-0 transition-transform">
                <img src={profile.photoUrl} alt={profile.fullName} className="w-full h-64 object-cover rounded-2xl border-2 border-hana-navy" />
                <div className="mt-4 text-center">
                  <h3 className="font-extrabold text-lg text-hana-navy">{profile.fullName}</h3>
                  <p className="text-xs font-semibold text-slate-500">{profile.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-hana-yellow border-2 border-hana-navy rounded-hana p-6 shadow-brutal flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-white rounded-2xl border-2 border-hana-navy"><BookOpen className="w-8 h-8 text-hana-navy" /></div>
          <div><span className="block text-3xl font-black text-hana-navy">{courseCount}</span><span className="text-xs font-extrabold text-hana-navy/80 uppercase">Mata Kuliah</span></div>
        </div>
        <div className="bg-hana-teal text-white border-2 border-hana-navy rounded-hana p-6 shadow-brutal flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-white text-hana-navy rounded-2xl border-2 border-hana-navy"><FileCheck className="w-8 h-8" /></div>
          <div><span className="block text-3xl font-black">{artifactCount}</span><span className="text-xs font-extrabold uppercase opacity-90">Artefak LK 2</span></div>
        </div>
        <div className="bg-hana-pink text-white border-2 border-hana-navy rounded-hana p-6 shadow-brutal flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-white text-hana-navy rounded-2xl border-2 border-hana-navy"><GraduationCap className="w-8 h-8" /></div>
          <div><span className="block text-3xl font-black">100%</span><span className="text-xs font-extrabold uppercase opacity-90">Refleksi 4C</span></div>
        </div>
      </section>

      <section className="bg-hana-navy text-white rounded-hana p-8 border-2 border-hana-navy shadow-brutal relative overflow-hidden">
        <div className="flex items-start gap-4">
          <Heart className="w-10 h-10 text-hana-yellow shrink-0 fill-hana-yellow" />
          <div className="space-y-2">
            <h4 className="text-xl font-extrabold text-hana-yellow">Filosofi Mengajar</h4>
            <blockquote className="text-slate-200 italic font-medium leading-relaxed">"{profile.philosophy}"</blockquote>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
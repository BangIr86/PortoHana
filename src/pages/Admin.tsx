import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, LayoutDashboard, BookOpen, User, FolderOpen, 
  ArrowRight, Plus, Trash2, Save, CheckCircle2, FileText, Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Course } from '../types/ppg';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profil' | 'matkul' | 'artefak' | 'refleksi'>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);

  const [profileId, setProfileId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    fullName: 'Hana Permata, S.Pd.',
    title: 'Guru Pendidikan Dasar / SD',
    bio: 'Seorang pendidik berdedikasi tinggi yang berfokus pada pembelajaran berpusat pada siswa.',
    philosophy: 'Pendidikan bukan sekadar mengisi wadah yang kosong, melainkan menyalakan api rasa ingin tahu.',
    email: 'hana.permata@example.com',
    location: 'Jakarta, Indonesia',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
  });

  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [artifactTitle, setArtifactTitle] = useState('');
  const [artifactType, setArtifactType] = useState<'pdf' | 'image' | 'video'>('pdf');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [artifactDesc, setArtifactDesc] = useState('');

  const [refleksiCourseId, setRefleksiCourseId] = useState('');
  const [connection, setConnection] = useState('');
  const [challenge, setChallenge] = useState('');
  const [concept, setConcept] = useState('');
  const [change, setChange] = useState('');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProfileData = async () => {
    const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
    if (data) {
      setProfileId(data.id);
      setProfile({
        fullName: data.full_name || '',
        title: data.title || '',
        bio: data.bio || '',
        philosophy: data.philosophy || '',
        email: data.email || '',
        location: data.location || '',
        photoUrl: data.photo_url || ''
      });
    }
  };

  const fetchSupabaseData = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(`id, code, title, description, semester, reflection_4c, topics (id, title, description, reflection_4c, artifacts ( id, title, type, file_url, description ))`)
      .order('created_at', { ascending: true });

    if (data) {
      const formatted: Course[] = data.map((c: any) => ({
        id: c.id, code: c.code, title: c.title, description: c.description, semester: c.semester, reflection4c: c.reflection_4c,
        topics: (c.topics || []).map((t: any) => ({
          id: t.id, title: t.title, description: t.description, reflection4c: t.reflection_4c,
          artifacts: (t.artifacts || []).map((a: any) => ({ id: a.id, title: a.title, type: a.type, fileUrl: a.file_url, description: a.description }))
        }))
      }));
      setCourses(formatted);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
      fetchSupabaseData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026') setIsAuthenticated(true);
    else { alert('Passcode salah!'); setPasscode(''); }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      full_name: profile.fullName,
      title: profile.title,
      bio: profile.bio,
      philosophy: profile.philosophy,
      email: profile.email,
      location: profile.location,
      photo_url: profile.photoUrl,
      updated_at: new Date().toISOString()
    };

    if (profileId) {
      await supabase.from('profiles').update(payload).eq('id', profileId);
    } else {
      const { data } = await supabase.from('profiles').insert([payload]).select().single();
      if (data) setProfileId(data.id);
    }
    showToast('Profil berhasil disimpan ke Database!');
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseCode) return;
    const { data } = await supabase.from('courses').insert([{ code: newCourseCode, title: newCourseTitle, description: newCourseDesc, semester: 1 }]).select().single();
    if (data) await supabase.from('topics').insert([{ course_id: data.id, title: 'Topik 1: ' + newCourseTitle, description: 'Topik perdana.' }]);
    setNewCourseCode(''); setNewCourseTitle(''); setNewCourseDesc('');
    showToast('Mata Kuliah berhasil disimpan!');
    fetchSupabaseData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Yakin hapus matkul ini?')) {
      await supabase.from('courses').delete().eq('id', id);
      showToast('Mata kuliah dihapus.'); fetchSupabaseData();
    }
  };

  const handleAddArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artifactTitle || !artifactUrl || !selectedTopicId) return;
    await supabase.from('artifacts').insert([{ topic_id: selectedTopicId, title: artifactTitle, type: artifactType, file_url: artifactUrl, description: artifactDesc }]);
    setArtifactTitle(''); setArtifactUrl(''); setArtifactDesc(''); setSelectedTopicId('');
    showToast('Artefak dipublikasikan!'); fetchSupabaseData();
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refleksiCourseId) return;
    await supabase.from('courses').update({ reflection_4c: { connection, challenge, concept, change } }).eq('id', refleksiCourseId);
    setConnection(''); setChallenge(''); setConcept(''); setChange(''); setRefleksiCourseId('');
    showToast('Refleksi 4C disimpan!'); fetchSupabaseData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 bg-hana-pink border-2 border-hana-navy rounded-2xl flex items-center justify-center mx-auto shadow-brutal-sm -rotate-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div><h2 className="text-2xl font-black text-hana-navy">Area Rahasia</h2></div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="••••" className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none bg-slate-50 font-black" autoFocus />
            <button type="submit" className="w-full py-3.5 bg-hana-yellow text-hana-navy font-black rounded-xl border-2 border-hana-navy shadow-brutal hover:bg-yellow-300 transition-all flex items-center justify-center gap-2">
              Buka Panel CMS <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profil', label: 'Profil Saya', icon: User },
    { id: 'matkul', label: 'Mata Kuliah', icon: BookOpen },
    { id: 'artefak', label: 'Kelola Artefak', icon: FolderOpen },
    { id: 'refleksi', label: 'Tulis Refleksi 4C', icon: Sparkles },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 relative">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-hana-navy text-white px-5 py-3 rounded-2xl border-2 border-white shadow-brutal flex items-center gap-2 font-bold text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-hana-yellow" /> {notification}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 min-h-[75vh]">
        <aside className="md:w-64 shrink-0 space-y-6">
          <div className="bg-hana-yellow border-2 border-hana-navy rounded-2xl p-6 shadow-brutal">
            <span className="text-xs font-black uppercase text-hana-navy/70">CMS Admin</span>
            <h3 className="font-black text-2xl text-hana-navy mt-1">PortoHana</h3>
          </div>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold border-2 transition-all text-left ${ activeTab === item.id ? 'bg-white border-hana-navy text-hana-navy shadow-brutal-sm translate-x-2' : 'border-transparent text-slate-600 hover:bg-white/50' }`}>
                <item.icon className="w-5 h-5" /> {item.label}
              </button>
            ))}
          </nav>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-600 border-2 border-transparent hover:bg-rose-50 w-full text-left mt-auto">
            <LogOut className="w-5 h-5" /> Keluar Panel
          </button>
        </aside>

        <main className="flex-1 bg-white border-2 border-hana-navy rounded-hana p-6 md:p-8 shadow-brutal relative">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4"><h2 className="text-2xl font-black text-hana-navy">Ringkasan Sistem</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-hana-yellow border-2 border-hana-navy p-5 rounded-2xl shadow-brutal-sm space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-hana-navy/80">Mata Kuliah Terdaftar</span>
                  <p className="text-4xl font-black text-hana-navy">{courses.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profil' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Kelola Informasi Profil</h2>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">Nama Lengkap & Gelar</label>
                    <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">Status / Subtitle</label>
                    <input type="text" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">Email</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">Lokasi (Kota, Negara)</label>
                    <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" placeholder="Contoh: Jakarta, Indonesia" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-hana-navy mb-1">URL Foto Profil (Drive/Google Photos/Unsplash)</label>
                  <input type="url" value={profile.photoUrl} onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" placeholder="https://..." />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-hana-navy mb-1">Biografi Singkat</label>
                  <textarea rows={2} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-medium text-sm bg-slate-50 resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-hana-navy mb-1">Filosofi Mengajar</label>
                  <textarea rows={3} value={profile.philosophy} onChange={(e) => setProfile({ ...profile, philosophy: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-medium text-sm bg-slate-50 resize-none"></textarea>
                </div>

                <button type="submit" className="px-6 py-3 bg-hana-blue text-white font-black text-sm rounded-xl border-2 border-hana-navy shadow-brutal hover:bg-blue-600 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> Simpan Profil ke Database
                </button>
              </form>
            </div>
          )}

          {activeTab === 'matkul' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4"><h2 className="text-2xl font-black text-hana-navy">Kelola Mata Kuliah</h2></div>
              <form onSubmit={handleAddCourse} className="bg-slate-50 border-2 border-hana-navy p-4 rounded-2xl space-y-3 shadow-brutal-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" placeholder="Kode (PPG-002)" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold" />
                  <input type="text" placeholder="Nama Mata Kuliah" value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} className="sm:col-span-2 px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold" />
                </div>
                <button type="submit" className="px-4 py-2 bg-hana-yellow text-hana-navy font-extrabold text-xs rounded-xl border-2 border-hana-navy shadow-brutal-sm">+ Simpan</button>
              </form>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="border-2 border-hana-navy p-4 rounded-2xl flex items-center justify-between gap-4 bg-white">
                    <div><span className="text-[10px] font-extrabold text-hana-blue uppercase">{course.code}</span><h4 className="font-extrabold text-sm text-hana-navy">{course.title}</h4></div>
                    <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-rose-600 border border-hana-navy rounded-xl hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'artefak' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4"><h2 className="text-2xl font-black text-hana-navy">Unggah Artefak</h2></div>
              <form onSubmit={handleAddArtifact} className="space-y-4">
                <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50">
                  <option value="" disabled>-- Pilih Topik --</option>
                  {courses.flatMap(c => c.topics.map(t => <option key={t.id} value={t.id}>{c.code} - {t.title}</option>))}
                </select>
                <input type="text" placeholder="Judul Artefak" value={artifactTitle} onChange={(e) => setArtifactTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select value={artifactType} onChange={(e) => setArtifactType(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50">
                    <option value="pdf">Document / PDF</option><option value="image">Foto</option><option value="video">Video</option>
                  </select>
                  <input type="url" placeholder="URL File" value={artifactUrl} onChange={(e) => setArtifactUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" />
                </div>
                <button type="submit" className="px-6 py-3 bg-hana-teal text-white font-black text-sm rounded-xl border-2 border-hana-navy shadow-brutal flex items-center gap-2"><FileText className="w-4 h-4" /> Simpan</button>
              </form>
            </div>
          )}

          {activeTab === 'refleksi' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4"><h2 className="text-2xl font-black text-hana-navy">Tulis Refleksi 4C</h2></div>
              <form onSubmit={handleSaveReflection} className="space-y-4">
                <select value={refleksiCourseId} onChange={(e) => setRefleksiCourseId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50">
                  <option value="" disabled>-- Pilih Matkul --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea rows={3} placeholder="Connection..." value={connection} onChange={(e) => setConnection(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy text-sm bg-amber-50 resize-none"></textarea>
                  <textarea rows={3} placeholder="Challenge..." value={challenge} onChange={(e) => setChallenge(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy text-sm bg-rose-50 resize-none"></textarea>
                  <textarea rows={3} placeholder="Concept..." value={concept} onChange={(e) => setConcept(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy text-sm bg-sky-50 resize-none"></textarea>
                  <textarea rows={3} placeholder="Change..." value={change} onChange={(e) => setChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy text-sm bg-emerald-50 resize-none"></textarea>
                </div>
                <button type="submit" className="px-6 py-3 bg-hana-navy text-white font-black text-sm rounded-xl border-2 border-hana-navy shadow-brutal flex items-center gap-2"><Sparkles className="w-4 h-4" /> Simpan Refleksi</button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;
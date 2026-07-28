import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, LayoutDashboard, BookOpen, User, FolderOpen, 
  ArrowRight, Plus, Trash2, Save, CheckCircle2, FileText 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Course, Artifact } from '../types/ppg';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profil' | 'matkul' | 'artefak'>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);

  // Data State Asli dari Supabase
  const [courses, setCourses] = useState<Course[]>([]);

  // Form State
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [artifactTitle, setArtifactTitle] = useState('');
  const [artifactType, setArtifactType] = useState<'pdf' | 'image' | 'video'>('pdf');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [artifactDesc, setArtifactDesc] = useState('');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // FETCH DATA DARI SUPABASE
  const fetchSupabaseData = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id, code, title, description, semester, reflection_4c,
        topics (
          id, title, description, reflection_4c,
          artifacts ( id, title, type, file_url, description )
        )
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Gagal memuat data:', error);
      return;
    }

    if (data) {
      const formatted: Course[] = data.map((c: any) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        description: c.description,
        semester: c.semester,
        reflection4c: c.reflection_4c,
        topics: (c.topics || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          reflection4c: t.reflection_4c,
          artifacts: (t.artifacts || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            type: a.type,
            fileUrl: a.file_url,
            description: a.description
          }))
        }))
      }));
      setCourses(formatted);
    }
  };

  // Muat data saat pertama kali login
  useEffect(() => {
    if (isAuthenticated) {
      fetchSupabaseData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026') {
      setIsAuthenticated(true);
    } else {
      alert('Passcode salah! Coba lagi.');
      setPasscode('');
    }
  };

  // TAMBAH MATA KULIAH (Ke Supabase)
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseCode) return;

    // 1. Simpan Matkul Baru
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert([{ code: newCourseCode, title: newCourseTitle, description: newCourseDesc, semester: 1 }])
      .select()
      .single();

    if (courseError) {
      alert('Gagal menambah mata kuliah!');
      return;
    }

    // 2. Otomatis buat 1 Topik default untuk menampung artefak
    if (courseData) {
      await supabase.from('topics').insert([{
        course_id: courseData.id,
        title: 'Topik 1: Pengantar ' + newCourseTitle,
        description: 'Topik perdana untuk mata kuliah ini.'
      }]);
    }

    setNewCourseCode('');
    setNewCourseTitle('');
    setNewCourseDesc('');
    showToast('Mata Kuliah baru berhasil disimpan ke Database!');
    fetchSupabaseData(); // Refresh data
  };

  // HAPUS MATA KULIAH
  const handleDeleteCourse = async (id: string) => {
    if (confirm('Yakin ingin menghapus mata kuliah ini dari database permanen?')) {
      await supabase.from('courses').delete().eq('id', id);
      showToast('Mata kuliah berhasil dihapus.');
      fetchSupabaseData(); // Refresh data
    }
  };

  // TAMBAH ARTEFAK (Ke Supabase)
  const handleAddArtifact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artifactTitle || !artifactUrl || !selectedTopicId) {
      alert('Judul, URL, dan Topik Artefak wajib diisi!');
      return;
    }

    const { error } = await supabase.from('artifacts').insert([{
      topic_id: selectedTopicId,
      title: artifactTitle,
      type: artifactType,
      file_url: artifactUrl,
      description: artifactDesc
    }]);

    if (error) {
      alert('Gagal mengunggah artefak!');
      return;
    }

    setArtifactTitle('');
    setArtifactUrl('');
    setArtifactDesc('');
    setSelectedTopicId('');
    showToast('Artefak berhasil dipublikasikan!');
    fetchSupabaseData(); // Refresh data
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 bg-hana-pink border-2 border-hana-navy rounded-2xl flex items-center justify-center mx-auto shadow-brutal-sm -rotate-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-hana-navy">Area Rahasia</h2>
            <p className="text-sm font-medium text-slate-600 mt-2">Masukkan Passcode untuk mengelola website PortoHana.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••"
              className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none focus:shadow-brutal-sm transition-all bg-slate-50 font-black"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-hana-yellow text-hana-navy font-black rounded-xl border-2 border-hana-navy shadow-brutal hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
            >
              Buka Panel CMS <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'matkul', label: 'Mata Kuliah', icon: BookOpen },
    { id: 'artefak', label: 'Kelola Artefak', icon: FolderOpen },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 relative">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-hana-navy text-white px-5 py-3 rounded-2xl border-2 border-white shadow-brutal flex items-center gap-2 font-bold text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-hana-yellow" />
          {notification}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 min-h-[75vh]">
        <aside className="md:w-64 shrink-0 space-y-6">
          <div className="bg-hana-yellow border-2 border-hana-navy rounded-2xl p-6 shadow-brutal">
            <span className="text-xs font-black uppercase text-hana-navy/70 tracking-wider">CMS Admin</span>
            <h3 className="font-black text-2xl text-hana-navy mt-1">PortoHana</h3>
          </div>
          
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold border-2 transition-all text-left ${
                    activeTab === item.id 
                      ? 'bg-white border-hana-navy text-hana-navy shadow-brutal-sm translate-x-2' 
                      : 'border-transparent text-slate-600 hover:bg-white/50 hover:border-hana-navy/30'
                  }`}
                >
                  <Icon className="w-5 h-5" /> {item.label}
                </button>
              );
            })}
          </nav>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-600 border-2 border-transparent hover:bg-rose-50 w-full text-left mt-auto">
            <LogOut className="w-5 h-5" /> Keluar Panel
          </button>
        </aside>

        <main className="flex-1 bg-white border-2 border-hana-navy rounded-hana p-6 md:p-8 shadow-brutal relative">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Ringkasan Sistem</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-hana-yellow border-2 border-hana-navy p-5 rounded-2xl shadow-brutal-sm space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-hana-navy/80">Mata Kuliah Terdaftar</span>
                  <p className="text-4xl font-black text-hana-navy">{courses.length}</p>
                </div>
                <div className="bg-hana-teal text-white border-2 border-hana-navy p-5 rounded-2xl shadow-brutal-sm space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-white/80">Total Artefak Diunggah</span>
                  <p className="text-4xl font-black">
                    {courses.reduce((acc, c) => acc + c.topics.reduce((tAcc, t) => tAcc + t.artifacts.length, 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matkul' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Kelola Mata Kuliah</h2>
              </div>

              <form onSubmit={handleAddCourse} className="bg-slate-50 border-2 border-hana-navy p-4 rounded-2xl space-y-3 shadow-brutal-sm">
                <h3 className="font-extrabold text-sm text-hana-navy flex items-center gap-2">
                  <Plus className="w-4 h-4 text-hana-blue" /> Tambah Mata Kuliah Baru
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" placeholder="Kode (e.g. PPG-002)" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold" />
                  <input type="text" placeholder="Nama Mata Kuliah" value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} className="sm:col-span-2 px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold" />
                </div>
                <button type="submit" className="px-4 py-2 bg-hana-yellow text-hana-navy font-extrabold text-xs rounded-xl border-2 border-hana-navy shadow-brutal-sm hover:bg-yellow-300">
                  + Simpan ke Database
                </button>
              </form>

              <div className="space-y-3">
                {courses.length === 0 && <p className="text-sm font-bold text-slate-500 text-center py-4">Belum ada mata kuliah di Database.</p>}
                {courses.map((course) => (
                  <div key={course.id} className="border-2 border-hana-navy p-4 rounded-2xl flex items-center justify-between gap-4 bg-white shadow-brutal-sm">
                    <div>
                      <span className="text-[10px] font-extrabold text-hana-blue uppercase">{course.code}</span>
                      <h4 className="font-extrabold text-sm text-hana-navy">{course.title}</h4>
                    </div>
                    <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-rose-600 border border-hana-navy rounded-xl hover:bg-rose-50" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'artefak' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Unggah Artefak Pembelajaran</h2>
              </div>

              <form onSubmit={handleAddArtifact} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-hana-navy mb-1">Pilih Topik Tersedia</label>
                  <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50">
                    <option value="" disabled>-- Pilih Topik Tempat Artefak Disimpan --</option>
                    {courses.flatMap(c => c.topics.map(t => (
                      <option key={t.id} value={t.id}>{c.code} - {t.title}</option>
                    )))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-hana-navy mb-1">Judul Artefak</label>
                  <input type="text" placeholder="e.g. LK 2.1 Modul Ajar" value={artifactTitle} onChange={(e) => setArtifactTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">Jenis Dokumen</label>
                    <select value={artifactType} onChange={(e) => setArtifactType(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50">
                      <option value="pdf">Document / PDF</option>
                      <option value="image">Dokumentasi Foto</option>
                      <option value="video">Video Praktik</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">URL Tautan File</label>
                    <input type="url" placeholder="https://..." value={artifactUrl} onChange={(e) => setArtifactUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-slate-50" />
                  </div>
                </div>

                <button type="submit" className="px-6 py-3 bg-hana-teal text-white font-black text-sm rounded-xl border-2 border-hana-navy shadow-brutal hover:bg-teal-600 transition-all flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Simpan ke Database
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, LayoutDashboard, BookOpen, User, FolderOpen, 
  ArrowRight, Plus, Trash2, Save, CheckCircle2, FileText, Sparkles, UploadCloud, Pencil, X, Mail, Layers, Compass, Target,
  MapPin, GraduationCap, IdCard
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Course } from '../types/ppg';

interface EducationItem {
  year: string;
  title: string;
  institution: string;
  description: string;
  color?: string;
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profil' | 'matkul' | 'topik' | 'artefak' | 'refleksi' | 'pesan'>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // State Profil & Biodata Lengkap
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profile, setProfile] = useState({ 
    fullName: '', 
    title: '', 
    bio: '', 
    philosophy: '', 
    visionIndonesia: '', 
    visionTeacher: '', 
    mission: '', 
    email: '', 
    location: '', 
    photoUrl: '',
    nim: '',
    bidangStudi: '',
    lptk: '',
    ttl: '',
    phone: '',
    gender: '',
    competencies: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // State Riwayat Pendidikan
  const [educationList, setEducationList] = useState<EducationItem[]>([
    { year: '2025 - Sekarang', title: 'Program Profesi Guru (PPG)', institution: 'Universitas Negeri', description: 'Mengikuti program sertifikasi pendidik profesional Calon Guru.', color: 'bg-hana-yellow text-hana-navy' },
    { year: '2020 - 2024', title: 'S1 Pendidikan Guru Sekolah Dasar (PGSD)', institution: 'Universitas Negeri', description: 'Lulus dengan Predikat Pujian (Cum Laude).', color: 'bg-hana-teal text-white' },
  ]);
  const [newEduYear, setNewEduYear] = useState('');
  const [newEduTitle, setNewEduTitle] = useState('');
  const [newEduInstitution, setNewEduInstitution] = useState('');
  const [newEduDesc, setNewEduDesc] = useState('');
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);
  const [editEduYear, setEditEduYear] = useState('');
  const [editEduTitle, setEditEduTitle] = useState('');
  const [editEduInstitution, setEditEduInstitution] = useState('');
  const [editEduDesc, setEditEduDesc] = useState('');

  // State Matkul
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editCourseCode, setEditCourseCode] = useState('');
  const [editCourseTitle, setEditCourseTitle] = useState('');

  // State Topik
  const [newTopicCourseId, setNewTopicCourseId] = useState('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicDesc, setEditTopicDesc] = useState('');

  // State Artefak
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [artifactTitle, setArtifactTitle] = useState('');
  const [artifactType, setArtifactType] = useState<'pdf' | 'image' | 'video'>('pdf');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [artifactInputType, setArtifactInputType] = useState<'link' | 'file'>('link');
  const [artifactFile, setArtifactFile] = useState<File | null>(null);
  const [editingArtifactId, setEditingArtifactId] = useState<string | null>(null);
  const [editArtifactTitle, setEditArtifactTitle] = useState('');
  const [editArtifactUrl, setEditArtifactUrl] = useState('');
  const [editArtifactType, setEditArtifactType] = useState<'pdf' | 'image' | 'video'>('pdf');

  // State Refleksi
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
        visionIndonesia: data.vision_indonesia || '',
        visionTeacher: data.vision_teacher || '',
        mission: data.mission || '',
        email: data.email || '', 
        location: data.location || '', 
        photoUrl: data.photo_url || '',
        nim: data.nim || '',
        bidangStudi: data.bidang_studi || '',
        lptk: data.lptk || '',
        ttl: data.ttl || '',
        phone: data.phone || '',
        gender: data.gender || '',
        competencies: data.competencies || ''
      });
      if (data.education_history && Array.isArray(data.education_history) && data.education_history.length > 0) {
        setEducationList(data.education_history);
        localStorage.setItem('hana_education_history', JSON.stringify(data.education_history));
      } else {
        const localEdu = localStorage.getItem('hana_education_history');
        if (localEdu) {
          try {
            const parsed = JSON.parse(localEdu);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setEducationList(parsed);
            }
          } catch (e) {}
        }
      }
    }
  };

  const fetchSupabaseData = async () => {
    const { data } = await supabase
      .from('courses')
      .select(`id, code, title, description, semester, reflection_4c, topics (id, title, description, reflection_4c, artifacts ( id, title, type, file_url, description ))`)
      .order('created_at', { ascending: true });
    
    if (data) {
      const formatted: Course[] = data.map((c: any) => ({
        id: c.id, 
        code: c.code, 
        title: c.title, 
        description: c.description, 
        semester: c.semester, 
        reflection4c: c.reflection_4c,
        topics: (c.topics || []).sort((a: any, b: any) => a.title.localeCompare(b.title)).map((t: any) => ({ 
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

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => { 
    if (isAuthenticated) { 
      fetchProfileData(); 
      fetchSupabaseData(); 
      fetchMessages(); 
    } 
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (passcode === '2026') setIsAuthenticated(true); 
    else { 
      alert('Passcode salah!'); 
      setPasscode(''); 
    } 
  };

  const handleSelectRefleksiCourse = (courseId: string) => {
    setRefleksiCourseId(courseId);
    const selectedCourse = courses.find(c => c.id === courseId);
    if (selectedCourse && selectedCourse.reflection4c) {
      setConnection(selectedCourse.reflection4c.connection || '');
      setChallenge(selectedCourse.reflection4c.challenge || '');
      setConcept(selectedCourse.reflection4c.concept || '');
      setChange(selectedCourse.reflection4c.change || '');
    } else {
      setConnection('');
      setChallenge('');
      setConcept('');
      setChange('');
    }
  };

  // PROFIL & BIODATA CRUD
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    let currentPhotoUrl = profile.photoUrl;
    if (imageFile) {
      setIsUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `foto-profil-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('avatars').upload(fileName, imageFile);
      if (error) { 
        alert('Gagal mengunggah foto!'); 
        setIsUploading(false); 
        return; 
      }
      currentPhotoUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
      setIsUploading(false); 
      setImageFile(null); 
      setProfile(prev => ({ ...prev, photoUrl: currentPhotoUrl }));
    }

    const payload: any = { 
      full_name: profile.fullName, 
      title: profile.title, 
      bio: profile.bio, 
      philosophy: profile.philosophy,
      vision_indonesia: profile.visionIndonesia,
      vision_teacher: profile.visionTeacher,
      mission: profile.mission,
      email: profile.email, 
      location: profile.location, 
      photo_url: currentPhotoUrl,
      nim: profile.nim,
      bidang_studi: profile.bidangStudi,
      lptk: profile.lptk,
      ttl: profile.ttl,
      phone: profile.phone,
      gender: profile.gender,
      competencies: profile.competencies,
      education_history: educationList,
      updated_at: new Date().toISOString() 
    };

    try {
      if (profileId) {
        const { error } = await supabase.from('profiles').update(payload).eq('id', profileId);
        if (error) {
          // Fallback jika kolom baru belum dimigrasi di PostgreSQL
          const fallbackPayload = {
            full_name: profile.fullName,
            title: profile.title,
            bio: profile.bio,
            philosophy: profile.philosophy,
            email: profile.email,
            location: profile.location,
            photo_url: currentPhotoUrl,
            updated_at: new Date().toISOString()
          };
          await supabase.from('profiles').update(fallbackPayload).eq('id', profileId);
          showToast('Profil dasar tersimpan! (Jalankan SQL migration untuk biodata lengkap)');
          return;
        }
      } else { 
        const { data, error } = await supabase.from('profiles').insert([payload]).select().single(); 
        if (data) setProfileId(data.id); 
        if (error) throw error;
      }
      showToast('Biodata, Profil & Visi Misi berhasil disimpan!');
    } catch (err: any) {
      alert('Gagal menyimpan profil: ' + (err.message || 'Error'));
    }
  };

  // RIWAYAT PENDIDIKAN CRUD (Auto-Save langsung ke Supabase & LocalStorage)
  const syncEducationToStorage = async (newList: EducationItem[]) => {
    setEducationList(newList);
    localStorage.setItem('hana_education_history', JSON.stringify(newList));

    if (profileId) {
      try {
        const { error } = await supabase.from('profiles').update({
          education_history: newList,
          updated_at: new Date().toISOString()
        }).eq('id', profileId);

        if (error) {
          console.warn('Kolom education_history mungkin belum ada di Supabase:', error.message);
        }
      } catch (err) {
        console.error('Gagal sync ke Supabase:', err);
      }
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduYear || !newEduTitle) return;
    const newItem: EducationItem = {
      year: newEduYear,
      title: newEduTitle,
      institution: newEduInstitution || '-',
      description: newEduDesc || '-',
      color: 'bg-hana-yellow text-hana-navy'
    };
    const updated = [...educationList, newItem];
    await syncEducationToStorage(updated);
    setNewEduYear('');
    setNewEduTitle('');
    setNewEduInstitution('');
    setNewEduDesc('');
    showToast('Riwayat pendidikan berhasil ditambahkan & disimpan!');
  };

  const handleUpdateEducation = async (index: number) => {
    const updated = [...educationList];
    updated[index] = {
      ...updated[index],
      year: editEduYear,
      title: editEduTitle,
      institution: editEduInstitution,
      description: editEduDesc
    };
    await syncEducationToStorage(updated);
    setEditingEduIndex(null);
    showToast('Riwayat pendidikan berhasil diperbarui & disimpan!');
  };

  const handleDeleteEducation = async (index: number) => {
    if (confirm('Yakin ingin menghapus riwayat pendidikan ini?')) {
      const updated = educationList.filter((_, i) => i !== index);
      await syncEducationToStorage(updated);
      showToast('Riwayat pendidikan berhasil dihapus & disimpan!');
    }
  };

  // MATKUL CRUD
  const handleAddCourse = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!newCourseTitle || !newCourseCode) return; 
    const { data } = await supabase.from('courses').insert([{ code: newCourseCode, title: newCourseTitle, semester: 1 }]).select().single(); 
    if (data) await supabase.from('topics').insert([{ course_id: data.id, title: 'Topik 1: Pengantar', description: 'Topik perdana.' }]); 
    setNewCourseCode(''); 
    setNewCourseTitle(''); 
    showToast('Matkul ditambahkan!'); 
    fetchSupabaseData(); 
  };
  const handleUpdateCourse = async (id: string) => { 
    await supabase.from('courses').update({ code: editCourseCode, title: editCourseTitle }).eq('id', id); 
    setEditingCourseId(null); 
    showToast('Matkul diperbarui!'); 
    fetchSupabaseData(); 
  };
  const handleDeleteCourse = async (id: string) => { 
    if (confirm('Yakin hapus matkul ini? Semua topik dan artefaknya akan ikut terhapus.')) { 
      await supabase.from('courses').delete().eq('id', id); 
      showToast('Matkul dihapus.'); 
      fetchSupabaseData(); 
    } 
  };

  // TOPIK CRUD
  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicCourseId || !newTopicTitle) return;
    await supabase.from('topics').insert([{ course_id: newTopicCourseId, title: newTopicTitle, description: newTopicDesc }]);
    setNewTopicTitle(''); 
    setNewTopicDesc(''); 
    showToast('Topik baru ditambahkan!'); 
    fetchSupabaseData();
  };
  const handleUpdateTopic = async (id: string) => { 
    await supabase.from('topics').update({ title: editTopicTitle, description: editTopicDesc }).eq('id', id); 
    setEditingTopicId(null); 
    showToast('Topik diperbarui!'); 
    fetchSupabaseData(); 
  };
  const handleDeleteTopic = async (id: string) => { 
    if (confirm('Yakin hapus topik ini beserta artefaknya?')) { 
      await supabase.from('topics').delete().eq('id', id); 
      showToast('Topik dihapus.'); 
      fetchSupabaseData(); 
    } 
  };

  // ARTEFAK CRUD
  const handleAddArtifact = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!artifactTitle || !selectedTopicId) return; 

    let finalUrl = artifactUrl;

    if (artifactInputType === 'file' && artifactFile) {
      setIsUploading(true);
      const fileExt = artifactFile.name.split('.').pop();
      const fileName = `artefak-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('artifacts').upload(fileName, artifactFile);
      if (error) { 
        alert('Gagal mengunggah file artefak!'); 
        setIsUploading(false); 
        return; 
      }
      finalUrl = supabase.storage.from('artifacts').getPublicUrl(fileName).data.publicUrl;
      setIsUploading(false);
    } else if (artifactInputType === 'link' && !artifactUrl) {
      alert('URL tidak boleh kosong!');
      return;
    }

    if (!finalUrl) return;

    await supabase.from('artifacts').insert([{ topic_id: selectedTopicId, title: artifactTitle, type: artifactType, file_url: finalUrl }]); 
    setArtifactTitle(''); 
    setArtifactUrl(''); 
    setArtifactFile(null); 
    setSelectedTopicId(''); 
    setArtifactType('pdf'); 
    setArtifactInputType('link'); 
    showToast('Artefak dipublikasikan!'); 
    fetchSupabaseData(); 
    if (e.target instanceof HTMLFormElement) e.target.reset();
  };

  const handleUpdateArtifact = async (id: string) => { 
    await supabase.from('artifacts').update({ 
      title: editArtifactTitle, 
      file_url: editArtifactUrl,
      type: editArtifactType 
    }).eq('id', id); 
    setEditingArtifactId(null); 
    showToast('Artefak diperbarui!'); 
    fetchSupabaseData(); 
  };

  const handleDeleteArtifact = async (id: string) => { 
    if (confirm('Yakin hapus artefak ini?')) { 
      await supabase.from('artifacts').delete().eq('id', id); 
      showToast('Artefak dihapus.'); 
      fetchSupabaseData(); 
    } 
  };

  // REFLEKSI CRUD
  const handleSaveReflection = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!refleksiCourseId) return; 
    await supabase.from('courses').update({ 
      reflection_4c: { connection, challenge, concept, change } 
    }).eq('id', refleksiCourseId); 
    
    setConnection(''); 
    setChallenge(''); 
    setConcept(''); 
    setChange(''); 
    setRefleksiCourseId(''); 
    showToast('Refleksi 4C disimpan!'); 
    fetchSupabaseData(); 
  };

  const handleDeleteReflection = async (courseId: string) => {
    if (confirm('Yakin ingin mengosongkan Refleksi 4C mata kuliah ini?')) {
      await supabase.from('courses').update({ reflection_4c: null }).eq('id', courseId);
      if (refleksiCourseId === courseId) {
        setConnection('');
        setChallenge('');
        setConcept('');
        setChange('');
      }
      showToast('Refleksi 4C berhasil dikosongkan.');
      fetchSupabaseData();
    }
  };

  // PESAN CRUD
  const handleDeleteMessage = async (id: string) => { 
    if (confirm('Yakin hapus pesan ini?')) { 
      await supabase.from('messages').delete().eq('id', id); 
      showToast('Pesan dihapus.'); 
      fetchMessages(); 
    } 
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
            <input 
              type="password" 
              value={passcode} 
              onChange={(e) => setPasscode(e.target.value)} 
              placeholder="••••" 
              className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none bg-slate-50 font-black" 
              autoFocus 
            />
            <button 
              type="submit" 
              className="w-full py-3.5 bg-hana-yellow text-hana-navy font-black rounded-xl border-2 border-hana-navy shadow-brutal hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
    { id: 'profil', label: 'Biodata & Profil', icon: User },
    { id: 'matkul', label: 'Mata Kuliah', icon: BookOpen },
    { id: 'topik', label: 'Kelola Topik', icon: Layers },
    { id: 'artefak', label: 'Kelola Artefak', icon: FolderOpen },
    { id: 'refleksi', label: 'Kelola Refleksi 4C', icon: Sparkles },
    { id: 'pesan', label: 'Pesan Masuk', icon: Mail },
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
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id as any)} 
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-extrabold border-2 transition-all text-left cursor-pointer ${
                  activeTab === item.id 
                    ? 'bg-white border-hana-navy text-hana-navy shadow-brutal-sm translate-x-2' 
                    : 'border-transparent text-slate-600 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center gap-3"><item.icon className="w-5 h-5" /> {item.label}</div>
                {item.id === 'pesan' && messages.length > 0 && (
                  <span className="bg-hana-pink text-white text-[10px] px-2 py-0.5 rounded-full">{messages.length}</span>
                )}
              </button>
            ))}
          </nav>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-600 border-2 border-transparent hover:bg-rose-50 w-full text-left mt-auto cursor-pointer"
          >
            <LogOut className="w-5 h-5" /> Keluar Panel
          </button>
        </aside>

        <main className="flex-1 bg-white border-2 border-hana-navy rounded-hana p-6 md:p-8 shadow-brutal relative">
          
          {/* TAB DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Ringkasan Sistem</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-hana-yellow border-2 border-hana-navy p-5 rounded-2xl shadow-brutal-sm space-y-2">
                  <span className="text-xs font-black uppercase text-hana-navy/80">Total Matkul</span>
                  <p className="text-4xl font-black text-hana-navy">{courses.length}</p>
                </div>
                <div className="bg-hana-teal text-white border-2 border-hana-navy p-5 rounded-2xl shadow-brutal-sm space-y-2">
                  <span className="text-xs font-black uppercase text-white/80">Total Artefak</span>
                  <p className="text-4xl font-black">{courses.reduce((acc, c) => acc + c.topics.reduce((tAcc, t) => tAcc + t.artifacts.length, 0), 0)}</p>
                </div>
                <div className="bg-hana-pink text-white border-2 border-hana-navy p-5 rounded-2xl shadow-brutal-sm space-y-2">
                  <span className="text-xs font-black uppercase text-white/80">Pesan Masuk</span>
                  <p className="text-4xl font-black">{messages.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB BIODATA, PROFIL & VISI MISI */}
          {activeTab === 'profil' && (
            <div className="space-y-8">
              <div className="border-b-2 border-hana-navy pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-hana-navy">Kelola Biodata Diri & Profil</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Ubah identitas resmi PPG, biodata diri, riwayat pendidikan, serta visi dan misi.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* 1. Foto Profil */}
                <div className="bg-slate-50 border-2 border-hana-navy p-5 rounded-2xl shadow-brutal-sm flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-slate-200 border-2 border-hana-navy overflow-hidden shrink-0">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" alt="Preview" />
                    ) : profile.photoUrl ? (
                      <img src={profile.photoUrl} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><User className="w-8 h-8" /></div>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-extrabold text-hana-navy mb-2">Unggah Foto Profil Baru</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} 
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-hana-navy file:font-bold file:bg-hana-yellow file:text-hana-navy hover:file:bg-yellow-300 transition-all cursor-pointer" 
                    />
                  </div>
                </div>

                {/* 2. Biodata Resmi Mahasiswa PPG */}
                <div className="bg-slate-50 border-2 border-hana-navy p-5 rounded-2xl space-y-4 shadow-brutal-sm">
                  <h3 className="font-black text-sm text-hana-navy flex items-center gap-2">
                    <IdCard className="w-4 h-4 text-hana-blue"/> Biodata Resmi Mahasiswa PPG
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">Nama Lengkap & Gelar</label>
                      <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. Hana Permata, S.Pd." />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">NIM PPG / No. Peserta</label>
                      <input type="text" value={profile.nim} onChange={(e) => setProfile({ ...profile, nim: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. 20240912345" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">Bidang Studi PPG</label>
                      <input type="text" value={profile.bidangStudi} onChange={(e) => setProfile({ ...profile, bidangStudi: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. Pendidikan Guru Sekolah Dasar (PGSD)" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">LPTK / Perguruan Tinggi</label>
                      <input type="text" value={profile.lptk} onChange={(e) => setProfile({ ...profile, lptk: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. Universitas Negeri Yogyakarta" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">Tempat, Tanggal Lahir (TTL)</label>
                      <input type="text" value={profile.ttl} onChange={(e) => setProfile({ ...profile, ttl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. Jakarta, 15 Mei 1999" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">Jenis Kelamin</label>
                      <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white">
                        <option value="">-- Pilih Jenis Kelamin --</option>
                        <option value="Perempuan">Perempuan</option>
                        <option value="Laki-laki">Laki-laki</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Kontak & Domisili */}
                <div className="bg-slate-50 border-2 border-hana-navy p-5 rounded-2xl space-y-4 shadow-brutal-sm">
                  <h3 className="font-black text-sm text-hana-navy flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-hana-teal"/> Kontak & Informasi Tambahan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">Status / Subtitle</label>
                      <input type="text" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. Mahasiswa PPG Calon Guru" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">Email</label>
                      <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. nama@gmail.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">No. WhatsApp / HP</label>
                      <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. +62 812-3456-7890" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-extrabold text-hana-navy mb-1">Domisili / Lokasi</label>
                      <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. Jakarta, Indonesia" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">Biografi Singkat</label>
                    <textarea rows={2} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-medium text-sm bg-white resize-none" placeholder="Tuliskan biografi singkat..."></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">Kompetensi Utama (Pisahkan dengan tanda koma)</label>
                    <input type="text" value={profile.competencies} onChange={(e) => setProfile({ ...profile, competencies: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" placeholder="e.g. Manajemen Kelas, Kurikulum Merdeka, Pembelajaran Berdiferensiasi, Asesmen Otentik" />
                  </div>
                </div>

                {/* 4. Filosofi & Visi Misi */}
                <div className="bg-slate-50 border-2 border-hana-navy p-5 rounded-2xl space-y-4 shadow-brutal-sm">
                  <h3 className="font-black text-sm text-hana-navy flex items-center gap-2">
                    <Target className="w-4 h-4 text-hana-pink"/> Filosofi Mengajar, Visi & Misi
                  </h3>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1">Filosofi Mengajar (Ki Hajar Dewantara)</label>
                    <textarea rows={3} value={profile.philosophy} onChange={(e) => setProfile({ ...profile, philosophy: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-medium text-sm bg-white resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-hana-teal" /> Visi untuk Pendidikan Indonesia
                    </label>
                    <textarea rows={3} value={profile.visionIndonesia} onChange={(e) => setProfile({ ...profile, visionIndonesia: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-medium text-sm bg-white resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-hana-yellow" /> Visi sebagai Calon Guru Profesional
                    </label>
                    <textarea rows={3} value={profile.visionTeacher} onChange={(e) => setProfile({ ...profile, visionTeacher: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-medium text-sm bg-white resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-hana-navy mb-1 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-hana-blue" /> Misi Guru Profesional
                    </label>
                    <textarea rows={4} value={profile.mission} onChange={(e) => setProfile({ ...profile, mission: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-medium text-sm bg-white resize-none" placeholder="Tuliskan misi per baris / poin"></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading} 
                  className="px-6 py-3.5 bg-hana-blue text-white font-black text-sm rounded-xl border-2 border-hana-navy shadow-brutal hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isUploading ? <UploadCloud className="w-4 h-4 animate-bounce" /> : <Save className="w-4 h-4" />} 
                  {isUploading ? 'Menyimpan...' : 'Simpan Semua Biodata, Profil & Visi Misi'}
                </button>
              </form>

              {/* 5. Kelola Riwayat Pendidikan */}
              <div className="bg-slate-50 border-2 border-hana-navy p-5 rounded-2xl space-y-5 shadow-brutal-sm mt-8">
                <div className="flex items-center justify-between border-b-2 border-hana-navy pb-3">
                  <h3 className="font-black text-sm text-hana-navy flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-hana-teal"/> Kelola Riwayat Pendidikan
                  </h3>
                </div>

                {/* Form Tambah Riwayat Pendidikan */}
                <form onSubmit={handleAddEducation} className="space-y-3 bg-white p-4 rounded-xl border-2 border-dashed border-hana-navy">
                  <span className="text-xs font-black uppercase text-hana-navy flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Tambah Jenjang Pendidikan Baru
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" placeholder="Tahun (e.g. 2020 - 2024)" value={newEduYear} onChange={e => setNewEduYear(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold" />
                    <input type="text" placeholder="Gelar / Jenjang (e.g. S1 PGSD)" value={newEduTitle} onChange={e => setNewEduTitle(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold" />
                    <input type="text" placeholder="Nama Universitas / Institusi" value={newEduInstitution} onChange={e => setNewEduInstitution(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold" />
                  </div>
                  <input type="text" placeholder="Keterangan singkat / Prestasi (e.g. Lulus dengan Pujian Cum Laude)" value={newEduDesc} onChange={e => setNewEduDesc(e.target.value)} className="w-full px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-medium" />
                  <button type="submit" className="px-4 py-2 bg-hana-yellow text-hana-navy font-black text-xs rounded-xl border-2 border-hana-navy shadow-brutal-sm cursor-pointer hover:bg-yellow-300">
                    Tambah ke Daftar
                  </button>
                </form>

                {/* List Riwayat Pendidikan */}
                <div className="space-y-3">
                  {educationList.map((edu, idx) => (
                    <div key={idx} className="bg-white border-2 border-hana-navy p-4 rounded-xl shadow-brutal-sm">
                      {editingEduIndex === idx ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input type="text" value={editEduYear} onChange={e => setEditEduYear(e.target.value)} className="px-3 py-1.5 text-xs font-bold border-2 border-hana-navy rounded-lg" placeholder="Tahun" />
                            <input type="text" value={editEduTitle} onChange={e => setEditEduTitle(e.target.value)} className="px-3 py-1.5 text-xs font-bold border-2 border-hana-navy rounded-lg" placeholder="Gelar / Jenjang" />
                            <input type="text" value={editEduInstitution} onChange={e => setEditEduInstitution(e.target.value)} className="px-3 py-1.5 text-xs font-bold border-2 border-hana-navy rounded-lg" placeholder="Institusi" />
                          </div>
                          <input type="text" value={editEduDesc} onChange={e => setEditEduDesc(e.target.value)} className="w-full px-3 py-1.5 text-xs font-medium border-2 border-hana-navy rounded-lg" placeholder="Keterangan" />
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => handleUpdateEducation(idx)} className="px-3 py-1.5 bg-hana-teal text-white font-bold text-xs border-2 border-hana-navy rounded-lg cursor-pointer">Simpan</button>
                            <button onClick={() => setEditingEduIndex(null)} className="px-3 py-1.5 bg-rose-100 text-rose-600 font-bold text-xs border-2 border-hana-navy rounded-lg cursor-pointer">Batal</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-hana-yellow border border-hana-navy">
                              {edu.year}
                            </span>
                            <h4 className="font-extrabold text-sm text-hana-navy mt-1">{edu.title}</h4>
                            <p className="text-xs font-bold text-hana-blue">{edu.institution}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{edu.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => {
                                setEditingEduIndex(idx);
                                setEditEduYear(edu.year);
                                setEditEduTitle(edu.title);
                                setEditEduInstitution(edu.institution);
                                setEditEduDesc(edu.description);
                              }}
                              className="p-1.5 text-hana-blue border border-hana-navy rounded-lg hover:bg-slate-50 cursor-pointer" 
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteEducation(idx)} 
                              className="p-1.5 text-rose-600 border border-hana-navy rounded-lg hover:bg-rose-50 cursor-pointer" 
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB MATKUL */}
          {activeTab === 'matkul' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Kelola Mata Kuliah</h2>
              </div>
              <form onSubmit={handleAddCourse} className="bg-slate-50 border-2 border-hana-navy p-4 rounded-2xl space-y-3 shadow-brutal-sm">
                <div className="flex items-center gap-2 font-extrabold text-hana-navy text-sm"><Plus className="w-4 h-4" /> Tambah Matkul Baru</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" placeholder="Kode (e.g. PPG-01)" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold bg-white" />
                  <input type="text" placeholder="Nama Mata Kuliah" value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} className="sm:col-span-2 px-3 py-2 rounded-xl border-2 border-hana-navy text-xs font-bold bg-white" />
                </div>
                <button type="submit" className="px-4 py-2 bg-hana-yellow text-hana-navy font-extrabold text-xs rounded-xl border-2 border-hana-navy shadow-brutal-sm cursor-pointer hover:bg-yellow-300">Simpan Matkul</button>
              </form>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="border-2 border-hana-navy p-4 rounded-2xl bg-white shadow-brutal-sm">
                    {editingCourseId === course.id ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input type="text" value={editCourseCode} onChange={e => setEditCourseCode(e.target.value)} className="w-full sm:w-28 px-3 py-1.5 text-xs font-bold border-2 border-hana-navy rounded-lg" placeholder="Kode" />
                        <input type="text" value={editCourseTitle} onChange={e => setEditCourseTitle(e.target.value)} className="w-full flex-1 px-3 py-1.5 text-sm font-bold border-2 border-hana-navy rounded-lg" placeholder="Nama Mata Kuliah" />
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateCourse(course.id)} className="p-2 bg-hana-teal text-white border-2 border-hana-navy rounded-lg cursor-pointer hover:bg-teal-600" title="Simpan"><CheckCircle2 className="w-4 h-4" /></button>
                          <button onClick={() => setEditingCourseId(null)} className="p-2 bg-rose-100 text-rose-600 border-2 border-hana-navy rounded-lg cursor-pointer hover:bg-rose-200" title="Batal"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-extrabold text-hana-blue uppercase bg-blue-50 px-2 py-0.5 rounded border border-hana-blue/30">{course.code}</span>
                          <h4 className="font-extrabold text-sm text-hana-navy mt-1">{course.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditingCourseId(course.id); setEditCourseCode(course.code); setEditCourseTitle(course.title); }} className="p-2 text-hana-blue border border-hana-navy rounded-xl hover:bg-slate-50 cursor-pointer" title="Edit Matkul"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-rose-600 border border-hana-navy rounded-xl hover:bg-rose-50 cursor-pointer" title="Hapus Matkul"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB TOPIK */}
          {activeTab === 'topik' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Kelola Topik / Bab</h2>
              </div>
              
              <form onSubmit={handleAddTopic} className="bg-slate-50 border-2 border-hana-navy p-4 rounded-2xl space-y-3 shadow-brutal-sm">
                <div className="flex items-center gap-2 font-extrabold text-hana-navy text-sm"><Plus className="w-4 h-4" /> Tambah Topik Baru</div>
                <select value={newTopicCourseId} onChange={e => setNewTopicCourseId(e.target.value)} className="w-full px-3 py-2 rounded-xl border-2 border-hana-navy text-sm font-bold bg-white">
                  <option value="" disabled>-- Pilih Mata Kuliah --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
                </select>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Judul Topik (Contoh: Topik 2: Asesmen)" value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-hana-navy text-sm font-bold bg-white" />
                  <input type="text" placeholder="Deskripsi Singkat" value={newTopicDesc} onChange={e => setNewTopicDesc(e.target.value)} className="px-3 py-2 rounded-xl border-2 border-hana-navy text-sm font-bold bg-white" />
                </div>
                <button type="submit" className="px-4 py-2 bg-hana-yellow text-hana-navy font-extrabold text-xs rounded-xl border-2 border-hana-navy shadow-brutal-sm cursor-pointer hover:bg-yellow-300">Simpan Topik</button>
              </form>

              <div className="space-y-4">
                {courses.map(c => (
                  <div key={c.id} className="border-2 border-hana-navy rounded-2xl bg-white shadow-brutal-sm overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2.5 border-b-2 border-hana-navy font-black text-hana-navy text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-hana-teal" /> {c.code} - {c.title}
                    </div>
                    <div className="p-4 space-y-2">
                      {c.topics.length === 0 && <p className="text-xs font-bold text-slate-400 italic">Belum ada topik.</p>}
                      {c.topics.map(t => (
                        <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-2 border-dashed border-hana-navy rounded-xl">
                          {editingTopicId === t.id ? (
                            <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                              <input type="text" value={editTopicTitle} onChange={e => setEditTopicTitle(e.target.value)} className="flex-1 px-2.5 py-1.5 text-xs font-bold border-2 border-hana-navy rounded-lg" placeholder="Judul Topik" />
                              <input type="text" value={editTopicDesc} onChange={e => setEditTopicDesc(e.target.value)} className="flex-1 px-2.5 py-1.5 text-xs font-medium border-2 border-hana-navy rounded-lg" placeholder="Deskripsi" />
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdateTopic(t.id)} className="p-1.5 bg-hana-teal text-white border-2 border-hana-navy rounded-lg cursor-pointer" title="Simpan"><CheckCircle2 className="w-4 h-4" /></button>
                                <button onClick={() => setEditingTopicId(null)} className="p-1.5 bg-rose-100 text-rose-600 border-2 border-hana-navy rounded-lg cursor-pointer" title="Batal"><X className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <h4 className="font-extrabold text-sm text-hana-navy">{t.title}</h4>
                                <p className="text-xs font-medium text-slate-500">{t.description || 'Tidak ada deskripsi'}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => { setEditingTopicId(t.id); setEditTopicTitle(t.title); setEditTopicDesc(t.description || ''); }} className="p-1.5 text-hana-blue border border-hana-navy rounded-lg hover:bg-slate-50 cursor-pointer" title="Edit Topik"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteTopic(t.id)} className="p-1.5 text-rose-600 border border-hana-navy rounded-lg hover:bg-rose-50 cursor-pointer" title="Hapus Topik"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB ARTEFAK */}
          {activeTab === 'artefak' && (
            <div className="space-y-8">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Kelola Artefak</h2>
              </div>
              
              <form onSubmit={handleAddArtifact} className="space-y-4 bg-slate-50 p-5 rounded-2xl border-2 border-hana-navy shadow-brutal-sm">
                <h3 className="font-extrabold text-sm text-hana-navy flex items-center gap-2"><Plus className="w-4 h-4"/> Unggah Artefak Baru</h3>
                <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white">
                  <option value="" disabled>-- Pilih Topik Tujuan --</option>
                  {courses.flatMap(c => c.topics.map(t => <option key={t.id} value={t.id}>{c.code} - {t.title}</option>))}
                </select>
                <input type="text" placeholder="Judul Artefak (e.g. Modul Ajar)" value={artifactTitle} onChange={(e) => setArtifactTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select value={artifactType} onChange={(e) => setArtifactType(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white">
                    <option value="pdf">Document / PDF</option>
                    <option value="image">Foto / Gambar</option>
                    <option value="video">Video</option>
                  </select>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-hana-navy cursor-pointer">
                        <input type="radio" name="artifactInputType" checked={artifactInputType === 'link'} onChange={() => setArtifactInputType('link')} className="accent-hana-navy" /> Link URL
                      </label>
                      <label className="flex items-center gap-2 text-sm font-bold text-hana-navy cursor-pointer">
                        <input type="radio" name="artifactInputType" checked={artifactInputType === 'file'} onChange={() => setArtifactInputType('file')} className="accent-hana-navy" /> Upload File
                      </label>
                    </div>
                    {artifactInputType === 'link' ? (
                      <input type="url" placeholder="URL File / Drive" value={artifactUrl} onChange={(e) => setArtifactUrl(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white" />
                    ) : (
                      <input type="file" onChange={(e) => setArtifactFile(e.target.files?.[0] || null)} className="w-full px-2 py-2 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-hana-navy file:text-white" />
                    )}
                  </div>
                </div>
                <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-hana-teal text-white font-black text-sm rounded-xl border-2 border-hana-navy shadow-brutal-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer">
                  <FileText className="w-4 h-4" /> {isUploading ? 'Menyimpan...' : 'Simpan Artefak'}
                </button>
              </form>

              {/* Daftar Artefak dengan Fitur Edit Lengkap */}
              <div className="space-y-4">
                <h3 className="font-black text-sm text-hana-navy">Daftar Artefak Tersimpan</h3>
                {courses.map(c => c.topics.map(t => t.artifacts.map(art => (
                  <div key={art.id} className="border-2 border-hana-navy p-4 rounded-xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-brutal-sm">
                    {editingArtifactId === art.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                        <input type="text" value={editArtifactTitle} onChange={e => setEditArtifactTitle(e.target.value)} className="flex-1 px-3 py-1.5 text-xs font-bold border-2 border-hana-navy rounded-lg" placeholder="Judul Artefak" />
                        <select value={editArtifactType} onChange={e => setEditArtifactType(e.target.value as any)} className="w-32 px-2 py-1.5 text-xs font-bold border-2 border-hana-navy rounded-lg">
                          <option value="pdf">PDF</option>
                          <option value="image">Gambar</option>
                          <option value="video">Video</option>
                        </select>
                        <input type="url" value={editArtifactUrl} onChange={e => setEditArtifactUrl(e.target.value)} className="flex-1 px-3 py-1.5 text-xs font-medium border-2 border-hana-navy rounded-lg" placeholder="URL File" />
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleUpdateArtifact(art.id)} className="p-2 bg-hana-teal text-white border-2 border-hana-navy rounded-lg cursor-pointer" title="Simpan"><CheckCircle2 className="w-4 h-4" /></button>
                          <button onClick={() => setEditingArtifactId(null)} className="p-2 bg-rose-100 text-rose-600 border-2 border-hana-navy rounded-lg cursor-pointer" title="Batal"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-hana-yellow border border-hana-navy">
                              {art.type}
                            </span>
                            <span className="text-xs font-bold text-slate-500 truncate">
                              ({c.code} - {t.title})
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-hana-navy truncate">{art.title}</h4>
                          <a href={art.fileUrl} target="_blank" rel="noreferrer" className="text-[11px] text-hana-blue hover:underline truncate block">
                            {art.fileUrl}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={() => { 
                              setEditingArtifactId(art.id); 
                              setEditArtifactTitle(art.title); 
                              setEditArtifactUrl(art.fileUrl); 
                              setEditArtifactType((art.type as any) || 'pdf');
                            }} 
                            className="p-2 text-hana-blue border border-hana-navy rounded-lg hover:bg-slate-50 cursor-pointer"
                            title="Edit Artefak"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteArtifact(art.id)} className="p-2 text-rose-600 border border-hana-navy rounded-lg hover:bg-rose-50 cursor-pointer" title="Hapus Artefak">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))))}
              </div>
            </div>
          )}

          {/* TAB REFLEKSI 4C */}
          {activeTab === 'refleksi' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Kelola Refleksi 4C Mata Kuliah</h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Pilih mata kuliah untuk menulis baru atau langsung mengedit refleksi yang sudah tersimpan.
                </p>
              </div>

              <form onSubmit={handleSaveReflection} className="space-y-4 bg-slate-50 p-5 rounded-2xl border-2 border-hana-navy shadow-brutal-sm">
                <div>
                  <label className="block text-xs font-extrabold text-hana-navy mb-1">Mata Kuliah Sasaran</label>
                  <select 
                    value={refleksiCourseId} 
                    onChange={(e) => handleSelectRefleksiCourse(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy font-bold text-sm bg-white"
                  >
                    <option value="" disabled>-- Pilih Matkul --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title} {c.reflection4c ? '✓ (Sudah ada refleksi)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-amber-900 mb-1">1. Connection (Keterkaitan materi)</label>
                    <textarea rows={3} placeholder="Apa keterkaitan materi dengan peran Anda sebagai pendidik?..." value={connection} onChange={(e) => setConnection(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy text-sm bg-amber-50 resize-none font-medium"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-rose-900 mb-1">2. Challenge (Tantangan & Perbedaan ide)</label>
                    <textarea rows={3} placeholder="Apa tantangan atau perbedaan pandangan yang Anda jumpai?..." value={challenge} onChange={(e) => setChallenge(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy text-sm bg-rose-50 resize-none font-medium"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-sky-900 mb-1">3. Concept (Konsep penting)</label>
                    <textarea rows={3} placeholder="Konsep utama apa yang Anda peroleh dari mata kuliah ini?..." value={concept} onChange={(e) => setConcept(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy text-sm bg-sky-50 resize-none font-medium"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-emerald-900 mb-1">4. Change (Perubahan yang dilakukan)</label>
                    <textarea rows={3} placeholder="Perubahan nyata apa yang akan Anda terapkan di kelas?..." value={change} onChange={(e) => setChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-hana-navy text-sm bg-emerald-50 resize-none font-medium"></textarea>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="px-6 py-3 bg-hana-navy text-white font-black text-sm rounded-xl border-2 border-hana-navy shadow-brutal flex items-center gap-2 cursor-pointer hover:bg-slate-800">
                    <Sparkles className="w-4 h-4 text-hana-yellow" /> Simpan Refleksi 4C
                  </button>
                  {refleksiCourseId && (
                    <button 
                      type="button" 
                      onClick={() => handleSelectRefleksiCourse('')} 
                      className="px-4 py-3 bg-white text-hana-navy font-bold text-sm rounded-xl border-2 border-hana-navy hover:bg-slate-100 cursor-pointer"
                    >
                      Batal / Bersihkan Form
                    </button>
                  )}
                </div>
              </form>

              {/* Daftar Refleksi yang Tersimpan */}
              <div className="space-y-4">
                <h3 className="font-black text-sm text-hana-navy">Status Refleksi Tiap Mata Kuliah</h3>
                {courses.map(c => (
                  <div key={c.id} className="border-2 border-hana-navy p-4 rounded-xl bg-white shadow-brutal-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-hana-blue uppercase bg-blue-50 px-2 py-0.5 rounded border border-hana-blue/30">{c.code}</span>
                      <h4 className="font-extrabold text-sm text-hana-navy mt-1">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {c.reflection4c ? '✅ Refleksi 4C sudah terisi' : '⚠️ Belum ada refleksi'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleSelectRefleksiCourse(c.id)} 
                        className="px-3 py-1.5 text-xs font-black text-hana-blue border-2 border-hana-navy rounded-lg hover:bg-blue-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit Refleksi
                      </button>
                      {c.reflection4c && (
                        <button 
                          onClick={() => handleDeleteReflection(c.id)} 
                          className="p-1.5 text-rose-600 border border-hana-navy rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Kosongkan Refleksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB PESAN MASUK */}
          {activeTab === 'pesan' && (
            <div className="space-y-6">
              <div className="border-b-2 border-hana-navy pb-4">
                <h2 className="text-2xl font-black text-hana-navy">Kotak Pesan Masuk 📬</h2>
              </div>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-hana-navy/30 rounded-2xl text-center text-slate-500 font-bold">
                    Belum ada pesan masuk.
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="bg-slate-50 border-2 border-hana-navy rounded-2xl p-5 shadow-brutal-sm relative">
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)} 
                        className="absolute top-4 right-4 p-2 text-rose-600 hover:bg-rose-100 rounded-xl cursor-pointer"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <h3 className="font-extrabold text-hana-navy text-lg">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} className="text-xs font-bold text-hana-blue hover:underline block mb-3">
                        {msg.email}
                      </a>
                      <div className="bg-white border-2 border-hana-navy p-4 rounded-xl text-sm font-medium text-slate-700 leading-relaxed">
                        "{msg.message}"
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;
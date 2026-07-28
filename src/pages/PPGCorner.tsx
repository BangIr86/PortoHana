import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Course, Reflection4C } from '../types/ppg';
import { ReflectionModal } from '../components/ReflectionModal';
import { BookOpen, FileText, ExternalLink, Sparkles, FolderOpen, Video, Image as ImageIcon } from 'lucide-react';

const PPGCorner: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeModal, setActiveModal] = useState<{ isOpen: boolean; title: string; reflection: Reflection4C }>({
    isOpen: false, title: '', reflection: { connection: '', challenge: '', concept: '', change: '' }
  });

  useEffect(() => {
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
      setIsLoading(false);
    };

    fetchSupabaseData();
  }, []);

  const openReflection = (title: string, reflection?: Reflection4C) => {
    if (!reflection) return;
    setActiveModal({ isOpen: true, title, reflection });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <section className="bg-hana-yellow border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-3">
        <span className="px-3 py-1 bg-white text-hana-navy text-xs font-black rounded-full border border-hana-navy shadow-brutal-sm">📚 Artefak & Refleksi LK 2</span>
        <h1 className="text-3xl md:text-4xl font-black text-hana-navy">PPG Corner</h1>
        <p className="text-hana-navy/90 font-semibold text-sm md:text-base leading-relaxed max-w-2xl">
          Ruang pameran karya, jurnal refleksi 4C, dan artefak pembelajaran riil dari Database.
        </p>
      </section>

      {isLoading ? (
        <div className="text-center py-20 font-black text-hana-navy text-2xl animate-pulse">
          🚀 Mengambil Data dari Supabase...
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 font-bold text-slate-500 border-2 border-dashed border-hana-navy/30 rounded-3xl">
          Belum ada data mata kuliah yang diunggah dari Panel Admin.
        </div>
      ) : (
        <div className="space-y-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border-2 border-hana-navy rounded-hana p-6 shadow-brutal space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-hana-navy">
                <div>
                  <span className="text-xs font-extrabold text-hana-blue uppercase tracking-wider">{course.code}</span>
                  <h2 className="text-xl md:text-2xl font-black text-hana-navy mt-1">{course.title}</h2>
                  <p className="text-slate-600 text-xs md:text-sm font-medium mt-1">{course.description}</p>
                </div>
                {course.reflection4c && (
                  <button onClick={() => openReflection(course.title, course.reflection4c)} className="px-4 py-2 bg-hana-teal text-white font-extrabold text-xs rounded-full border-2 border-hana-navy shadow-brutal hover:bg-teal-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Refleksi 4C
                  </button>
                )}
              </div>

              <div className="space-y-6 pl-0 md:pl-4">
                {course.topics.map((topic) => (
                  <div key={topic.id} className="bg-slate-50 border-2 border-hana-navy rounded-2xl p-5 shadow-brutal-sm space-y-4">
                    <div className="flex items-start gap-2.5">
                      <FolderOpen className="w-5 h-5 text-hana-blue shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-extrabold text-hana-navy text-base">{topic.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{topic.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {topic.artifacts.length === 0 && <p className="text-[10px] text-slate-400 italic">Belum ada artefak</p>}
                      {topic.artifacts.map((art) => (
                        <div key={art.id} className="bg-white border-2 border-hana-navy rounded-xl p-3 flex items-start gap-3 shadow-brutal-sm hover:-translate-y-0.5 transition-transform">
                          <div className="p-2 bg-hana-yellow border border-hana-navy rounded-lg shrink-0">
                            {art.type === 'pdf' && <FileText className="w-5 h-5 text-hana-navy" />}
                            {art.type === 'image' && <ImageIcon className="w-5 h-5 text-hana-navy" />}
                            {art.type === 'video' && <Video className="w-5 h-5 text-hana-navy" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-hana-navy truncate">{art.title}</h4>
                            <a href={art.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-black text-hana-blue hover:underline mt-1">
                              Lihat File <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ReflectionModal isOpen={activeModal.isOpen} onClose={() => setActiveModal({ ...activeModal, isOpen: false })} title={activeModal.title} reflection={activeModal.reflection} />
    </div>
  );
};

export default PPGCorner;
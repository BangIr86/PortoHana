import React, { useState } from 'react';
import { MOCK_COURSES } from '../types/ppg';
import type { Course, Reflection4C } from '../types/ppg';
import { ReflectionModal } from '../components/ReflectionModal';
import { FileText, ExternalLink, Sparkles, FolderOpen, Video, Image as ImageIcon } from 'lucide-react';

const PPGCorner: React.FC = () => {
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    title: string;
    reflection: Reflection4C;
  }>({
    isOpen: false,
    title: '',
    reflection: { connection: '', challenge: '', concept: '', change: '' }
  });

  const openReflection = (title: string, reflection?: Reflection4C) => {
    if (!reflection) return;
    setActiveModal({
      isOpen: true,
      title,
      reflection
    });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <section className="bg-hana-yellow border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-3">
        <span className="px-3 py-1 bg-white text-hana-navy text-xs font-black rounded-full border border-hana-navy shadow-brutal-sm">
          📚 Artefak & Refleksi LK 2
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-hana-navy">
          PPG Corner
        </h1>
        <p className="text-hana-navy/90 font-semibold text-sm md:text-base leading-relaxed max-w-2xl">
          Ruang pameran karya, jurnal refleksi 4C, dan artefak pembelajaran selama mengikuti perkuliahan Program Profesi Guru (PPG Calon Guru).
        </p>
      </section>

      {/* Course List */}
      <div className="space-y-8">
        {MOCK_COURSES.map((course: Course) => (
          <div key={course.id} className="bg-white border-2 border-hana-navy rounded-hana p-6 shadow-brutal space-y-6">
            
            {/* TINGKAT 1: MATA KULIAH */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-hana-navy">
              <div>
                <span className="text-xs font-extrabold text-hana-blue uppercase tracking-wider">
                  {course.code} • Semester {course.semester}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-hana-navy mt-1">
                  {course.title}
                </h2>
                <p className="text-slate-600 text-xs md:text-sm font-medium mt-1">
                  {course.description}
                </p>
              </div>

              {course.reflection4c && (
                <button
                  onClick={() => openReflection(`Refleksi Mata Kuliah: ${course.title}`, course.reflection4c)}
                  className="px-4 py-2 bg-hana-teal text-white font-extrabold text-xs rounded-full border-2 border-hana-navy shadow-brutal hover:bg-teal-600 transition-all shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Refleksi 4C Matkul
                </button>
              )}
            </div>

            {/* TINGKAT 2: TOPIK */}
            <div className="space-y-6 pl-0 md:pl-4">
              {course.topics.map((topic) => (
                <div key={topic.id} className="bg-slate-50 border-2 border-hana-navy rounded-2xl p-5 shadow-brutal-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <FolderOpen className="w-5 h-5 text-hana-blue shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-extrabold text-hana-navy text-base">{topic.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{topic.description}</p>
                      </div>
                    </div>

                    {topic.reflection4c && (
                      <button
                        onClick={() => openReflection(topic.title, topic.reflection4c)}
                        className="px-3 py-1.5 bg-white text-hana-navy font-bold text-xs rounded-full border border-hana-navy shadow-brutal-sm hover:bg-hana-yellow transition-colors shrink-0 self-start sm:self-auto"
                      >
                        Refleksi Topik 4C
                      </button>
                    )}
                  </div>

                  {/* TINGKAT 3: ARTEFAK */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {topic.artifacts.map((art) => (
                      <div key={art.id} className="bg-white border-2 border-hana-navy rounded-xl p-3 flex items-start gap-3 shadow-brutal-sm hover:-translate-y-0.5 transition-transform">
                        <div className="p-2 bg-hana-yellow border border-hana-navy rounded-lg shrink-0">
                          {art.type === 'pdf' && <FileText className="w-5 h-5 text-hana-navy" />}
                          {art.type === 'image' && <ImageIcon className="w-5 h-5 text-hana-navy" />}
                          {art.type === 'video' && <Video className="w-5 h-5 text-hana-navy" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-hana-navy truncate">{art.title}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{art.description}</p>
                          <a
                            href={art.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-black text-hana-blue hover:underline mt-1"
                          >
                            Lihat Dokumen <ExternalLink className="w-3 h-3" />
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

      {/* Modal Render */}
      <ReflectionModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal({ ...activeModal, isOpen: false })}
        title={activeModal.title}
        reflection={activeModal.reflection}
      />

    </div>
  );
};

export default PPGCorner;
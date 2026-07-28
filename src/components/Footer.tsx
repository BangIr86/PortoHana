import React from 'react';
import { Heart, Code, Briefcase, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="container mx-auto max-w-5xl px-4 py-8 mt-auto">
      <div className="bg-white border-2 border-hana-navy rounded-hana p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-brutal-sm">
        
        <div className="flex items-center gap-2 font-extrabold text-hana-navy text-sm md:text-base">
          <span>Dibuat dengan</span>
          <Heart className="w-5 h-5 text-hana-pink fill-hana-pink" />
          <span>oleh Hana Permata © 2026</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Ikon Code sebagai pengganti Github */}
          <a href="#" className="p-2.5 bg-slate-100 text-hana-navy rounded-full border-2 border-hana-navy hover:bg-hana-yellow hover:-translate-y-1 shadow-brutal-sm transition-all">
            <Code className="w-5 h-5" />
          </a>
          
          {/* Ikon Briefcase sebagai pengganti Linkedin */}
          <a href="#" className="p-2.5 bg-slate-100 text-hana-navy rounded-full border-2 border-hana-navy hover:bg-hana-blue hover:text-white hover:-translate-y-1 shadow-brutal-sm transition-all">
            <Briefcase className="w-5 h-5" />
          </a>
          
          {/* Ikon Mail untuk Kontak */}
          <a href="#" className="p-2.5 bg-slate-100 text-hana-navy rounded-full border-2 border-hana-navy hover:bg-hana-pink hover:text-white hover:-translate-y-1 shadow-brutal-sm transition-all">
            <Mail className="w-5 h-5" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
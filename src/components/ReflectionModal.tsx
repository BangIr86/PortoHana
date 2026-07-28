import React from 'react';
import { X, Lightbulb, Compass, Target, RefreshCw } from 'lucide-react';
import type { Reflection4C } from '../types/ppg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  reflection: Reflection4C;
}

export const ReflectionModal: React.FC<ModalProps> = ({ isOpen, onClose, title, reflection }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-hana-navy/60 backdrop-blur-sm">
      <div className="bg-white border-2 border-hana-navy rounded-hana p-6 md:p-8 max-w-2xl w-full shadow-brutal-lg relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-hana-navy">
          <div>
            <span className="inline-block px-3 py-1 bg-hana-yellow text-hana-navy text-xs font-extrabold rounded-full border border-hana-navy shadow-brutal-sm mb-1">
              ✨ Refleksi 4C (LK 2 PPG)
            </span>
            <h3 className="text-xl font-extrabold text-hana-navy">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border-2 border-hana-navy bg-slate-100 hover:bg-hana-pink hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content 4C Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          
          <div className="bg-amber-50 border-2 border-hana-navy p-4 rounded-2xl shadow-brutal-sm space-y-1">
            <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
              <Compass className="w-4 h-4 text-amber-600" />
              1. Connection
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{reflection.connection}</p>
          </div>

          <div className="bg-rose-50 border-2 border-hana-navy p-4 rounded-2xl shadow-brutal-sm space-y-1">
            <div className="flex items-center gap-2 font-black text-rose-900 text-sm">
              <Target className="w-4 h-4 text-rose-600" />
              2. Challenge
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{reflection.challenge}</p>
          </div>

          <div className="bg-sky-50 border-2 border-hana-navy p-4 rounded-2xl shadow-brutal-sm space-y-1">
            <div className="flex items-center gap-2 font-black text-sky-900 text-sm">
              <Lightbulb className="w-4 h-4 text-sky-600" />
              3. Concept
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{reflection.concept}</p>
          </div>

          <div className="bg-emerald-50 border-2 border-hana-navy p-4 rounded-2xl shadow-brutal-sm space-y-1">
            <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              4. Change
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{reflection.change}</p>
          </div>

        </div>

      </div>
    </div>
  );
};
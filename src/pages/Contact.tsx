import React from 'react';
import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <section className="bg-hana-pink border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-3 text-white relative overflow-hidden">
        <span className="px-3 py-1 bg-white text-hana-navy text-xs font-black rounded-full border border-hana-navy shadow-brutal-sm relative z-10">
          📬 Mari Berdiskusi
        </span>
        <h1 className="text-3xl md:text-4xl font-black relative z-10">Kontak Saya</h1>
        <p className="font-semibold text-sm md:text-base max-w-2xl text-white/90 relative z-10">
          Punya pertanyaan seputar dunia pendidikan, tawaran kolaborasi, atau sekadar ingin menyapa? Jangan ragu untuk mengirim pesan!
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Info Kontak Cepat */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border-2 border-hana-navy rounded-2xl p-6 shadow-brutal flex items-start gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-3 bg-hana-yellow rounded-xl border-2 border-hana-navy">
              <Mail className="w-6 h-6 text-hana-navy" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-hana-navy">Email</h3>
              <p className="text-sm font-medium text-slate-600 mt-1">hana.permata@example.com</p>
            </div>
          </div>

          <div className="bg-white border-2 border-hana-navy rounded-2xl p-6 shadow-brutal flex items-start gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-3 bg-hana-teal rounded-xl border-2 border-hana-navy text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-hana-navy">Lokasi</h3>
              <p className="text-sm font-medium text-slate-600 mt-1">Jakarta, Indonesia</p>
            </div>
          </div>
        </div>

        {/* Form Kontak UI Brutalist */}
        <div className="md:col-span-7 bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal">
          <div className="flex items-center gap-2 font-black text-xl text-hana-navy mb-6">
            <MessageSquare className="w-6 h-6 text-hana-blue" />
            Kirim Pesan
          </div>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-extrabold text-hana-navy mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_#1E293B] transition-all bg-slate-50 font-medium" 
                placeholder="Masukkan namamu..." 
              />
            </div>
            <div>
              <label className="block text-sm font-extrabold text-hana-navy mb-1.5">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_#1E293B] transition-all bg-slate-50 font-medium" 
                placeholder="nama@email.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-extrabold text-hana-navy mb-1.5">Pesan</label>
              <textarea 
                rows={4} 
                className="w-full px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_#1E293B] transition-all bg-slate-50 font-medium resize-none" 
                placeholder="Tulis pesanmu di sini..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full py-3.5 bg-hana-blue text-white font-black text-lg rounded-xl border-2 border-hana-navy shadow-brutal hover:bg-blue-600 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-5 h-5" /> Kirim Sekarang
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
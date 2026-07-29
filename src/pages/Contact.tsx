import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Semua kolom wajib diisi ya!');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('messages').insert([{ name, email, message }]);
    
    if (error) {
      alert('Gagal mengirim pesan!');
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setName(''); setEmail(''); setMessage('');
    setIsSubmitting(false);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      <section className="bg-hana-pink border-2 border-hana-navy rounded-hana p-8 shadow-brutal space-y-3 text-white relative overflow-hidden">
        <span className="px-3 py-1 bg-white text-hana-navy text-xs font-black rounded-full border border-hana-navy shadow-brutal-sm relative z-10">📬 Mari Berdiskusi</span>
        <h1 className="text-3xl md:text-4xl font-black relative z-10">Kontak Saya</h1>
        <p className="font-semibold text-sm md:text-base max-w-2xl text-white/90 relative z-10">
          Punya pertanyaan seputar dunia pendidikan, tawaran kolaborasi, atau sekadar ingin menyapa? Jangan ragu untuk mengirim pesan!
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border-2 border-hana-navy rounded-2xl p-6 shadow-brutal flex items-start gap-4">
            <div className="p-3 bg-hana-yellow rounded-xl border-2 border-hana-navy"><Mail className="w-6 h-6 text-hana-navy" /></div>
            <div>
              <h3 className="font-extrabold text-lg text-hana-navy">Email</h3>
              <p className="text-sm font-medium text-slate-600 mt-1">hana.permata@example.com</p>
            </div>
          </div>
          <div className="bg-white border-2 border-hana-navy rounded-2xl p-6 shadow-brutal flex items-start gap-4">
            <div className="p-3 bg-hana-teal rounded-xl border-2 border-hana-navy text-white"><MapPin className="w-6 h-6" /></div>
            <div>
              <h3 className="font-extrabold text-lg text-hana-navy">Lokasi</h3>
              <p className="text-sm font-medium text-slate-600 mt-1">Jakarta, Indonesia</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white border-2 border-hana-navy rounded-hana p-8 shadow-brutal">
          <div className="flex items-center gap-2 font-black text-xl text-hana-navy mb-6">
            <MessageSquare className="w-6 h-6 text-hana-blue" /> Kirim Pesan
          </div>
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-100 border-2 border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-700 font-bold">
              <CheckCircle2 className="w-5 h-5" /> Pesan Anda berhasil dikirim ke Admin!
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-extrabold text-hana-navy mb-1.5">Nama Lengkap</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none focus:shadow-brutal-sm transition-all bg-slate-50 font-medium" placeholder="Masukkan namamu..." />
            </div>
            <div>
              <label className="block text-sm font-extrabold text-hana-navy mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none focus:shadow-brutal-sm transition-all bg-slate-50 font-medium" placeholder="nama@email.com" />
            </div>
            <div>
              <label className="block text-sm font-extrabold text-hana-navy mb-1.5">Pesan</label>
              <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-hana-navy focus:outline-none focus:shadow-brutal-sm transition-all bg-slate-50 font-medium resize-none" placeholder="Tulis pesanmu di sini..."></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-hana-blue text-white font-black text-lg rounded-xl border-2 border-hana-navy shadow-brutal hover:bg-blue-600 active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
              <Send className="w-5 h-5" /> {isSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
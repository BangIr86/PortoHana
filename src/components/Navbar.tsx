import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, User, BookOpen, Mail, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/', icon: Sparkles },
    { name: 'Tentang', path: '/about', icon: User },
    { name: 'PPG Corner', path: '/ppg-corner', icon: BookOpen },
    { name: 'Kontak', path: '/contact', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-4 z-50 container mx-auto px-4 max-w-5xl">
      <nav className="bg-white/90 backdrop-blur-md border-2 border-hana-navy rounded-full px-6 py-3 shadow-brutal flex items-center justify-between transition-all">
        
        {/* LOGO BRAND */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-hana-yellow border-2 border-hana-navy flex items-center justify-center font-black text-lg group-hover:rotate-12 transition-transform">
            H
          </div>
          <span className="font-extrabold text-xl tracking-tight text-hana-navy">
            Porto<span className="text-hana-blue">Hana</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border-2 transition-all ${
                  active
                    ? 'bg-hana-yellow text-hana-navy border-hana-navy shadow-brutal-sm -translate-y-0.5'
                    : 'border-transparent text-slate-600 hover:text-hana-navy hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* CMS / ADMIN BUTTON */}
        <div className="hidden md:flex items-center">
          <Link
            to="/admin"
            className="p-2.5 rounded-full bg-slate-100 text-hana-navy border-2 border-hana-navy hover:bg-hana-pink hover:text-white transition-all shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
            title="Panel Admin"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>

        {/* HAMBURGER MOBILE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-full border-2 border-hana-navy bg-hana-yellow text-hana-navy shadow-brutal-sm"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden mt-3 bg-white border-2 border-hana-navy rounded-hana p-4 shadow-brutal flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`p-3 rounded-2xl font-bold text-base flex items-center gap-3 border-2 ${
                  active
                    ? 'bg-hana-yellow text-hana-navy border-hana-navy shadow-brutal-sm'
                    : 'border-transparent text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
          <hr className="border-hana-navy/20 my-1" />
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="p-3 rounded-2xl font-bold text-base flex items-center gap-3 border-2 border-hana-navy bg-slate-100 text-hana-navy hover:bg-hana-pink hover:text-white transition-all"
          >
            <Lock className="w-5 h-5" />
            Panel Admin CMS
          </Link>
        </div>
      )}
    </header>
  );
};
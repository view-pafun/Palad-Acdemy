import React from 'react';
import { Mail, Phone, MapPin, Heart, ShieldCheck, Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-[#000000] pt-16 sm:pt-20 pb-16 sm:pb-20 text-slate-300 font-['Mitr','Prompt',sans-serif] overflow-hidden border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Main Grid: Logo/Slogan/Social on left, Navigation columns on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Column 1: Brand, Logo, Slogan & Social Media (Left side as in ref) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center">
              <img 
                src="https://s.imgz.io/2026/10/14/-179871106970c83770.png"
                alt="PALAD ACADEMY"
                className="h-16 sm:h-20 md:h-24 w-auto max-w-[300px] sm:max-w-[360px] object-contain drop-shadow-lg brightness-110 transition-transform duration-300 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Slogan */}
            <p className="text-sm tracking-widest text-slate-400 font-['Mitr',sans-serif] font-medium leading-relaxed max-w-xs uppercase">
              PALAD ACADEMY
            </p>

            {/* Social Icons (Ref: Instagram, YouTube, Facebook, Line) */}
            <div className="flex items-center gap-3 pt-1">
              <a 
                href="#instagram" 
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-amber-400 hover:text-black flex items-center justify-center text-slate-200 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#youtube" 
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-amber-400 hover:text-black flex items-center justify-center text-slate-200 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="#facebook" 
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-amber-400 hover:text-black flex items-center justify-center text-slate-200 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#line" 
                aria-label="Line"
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-amber-400 hover:text-black flex items-center justify-center text-slate-200 transition-colors font-bold text-xs"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: หลักสูตร (Course Curriculum) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white text-sm tracking-wide mb-4 font-['Mitr',sans-serif]">
              หลักสูตร
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-light">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  ทั้งหมด
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  คอร์สยอดนิยม
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  สำหรับผู้เริ่มต้น
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  สำหรับมืออาชีพ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: เกี่ยวกับเรา (About Us) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-sm tracking-wide mb-4 font-['Mitr',sans-serif]">
              เกี่ยวกับเรา
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-light">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  เรื่องราวของเรา
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  ทีม
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stories')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  ร่วมงานกับเรา
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: ช่วยเหลือ (Help & Support) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white text-sm tracking-wide mb-4 font-['Mitr',sans-serif]">
              ช่วยเหลือ
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-light">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  คำถามที่พบบ่อย (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  ติดต่อเรา
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  ข้อกำหนดการใช้งาน
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  นโยบายความเป็นส่วนตัว
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-light gap-4">
          <p className="tracking-wide">
            © 2026 PALAD ACADEMY. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition">
              เงื่อนไขการใช้งาน
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition">
              ความปลอดภัยของข้อมูล
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-amber-400 transition flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Footer Artwork at bottom-right corner */}
      <div 
        aria-hidden="true"
        className="absolute bottom-0 right-0 pointer-events-none z-10 w-56 sm:w-72 md:w-96 lg:w-[440px] xl:w-[520px] max-w-[52vw] select-none"
      >
        <img
          src="https://s.imgz.io/2026/10/14/-19631e62c460b52a25.png"
          alt="PALAD ACADEMY Footer Artwork"
          className="w-full h-auto object-contain object-bottom-right opacity-95 drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </div>
    </footer>
  );
};

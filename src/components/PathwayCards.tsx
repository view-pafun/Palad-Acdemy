import React, { useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface PathwayCardsProps {
  onStartLifePath: () => void;
  onExploreCourses: () => void;
}

export const PathwayCards: React.FC<PathwayCardsProps> = ({
  onStartLifePath,
  onExploreCourses,
}) => {
  const [hoveredStep, setHoveredStep] = useState<'left' | 'right' | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: Centered at the top */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            เส้นทางทางการเรียนรู้
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed text-balance">
            เรียนรู้และพัฒนาตนเองอย่างเป็นระบบ ผ่าน 2 ขั้นตอนสำคัญสู่การเสริมสร้างศักยภาพแห่งอนาคต
          </p>
        </div>

        {/* Main Section Layout: Horizontal row on pure white background (Strictly NO rectangular cards or borders) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-4 xl:gap-8">
          {/* 1. Left Text Block with giant faint gray '01' background layer */}
          <div
            onMouseEnter={() => setHoveredStep('left')}
            onMouseLeave={() => setHoveredStep(null)}
            className="flex-1 max-w-sm lg:max-w-xs xl:max-w-sm relative cursor-pointer group text-left"
          >
            {/* Giant faint gray '01' decorative background text */}
            <span 
              aria-hidden="true"
              className="absolute -top-12 -left-6 sm:-left-8 text-[110px] sm:text-[140px] font-black text-slate-100/90 select-none pointer-events-none z-0 leading-none"
            >
              01
            </span>

            {/* Sharp foreground content */}
            <div className="relative z-10 font-['Mitr',sans-serif]">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3 group-hover:text-amber-500 transition-colors">
                ทำแบบทดสอบเส้นทางชีวิต
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                ทำแบบประเมินตนเอง 60 ข้อด้วยมาตรวัด Likert Scale (1-7) พร้อมระบบวิเคราะห์คะแนนย้อนกลับอัตโนมัติ และค้นพบจุดแข็ง 6 มิติเพื่อออกแบบเส้นทางชีวิต
              </p>
              {/* Outlined button with rounded corners: #FFC800 with no black border, turns black with white text on hover/active */}
              <button
                onClick={onStartLifePath}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-bold text-sm transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md border-0 group/btn"
              >
                <span>เริ่มทำแบบทดสอบ</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-transform" />
              </button>
            </div>
          </div>

          {/* 2. Left Illustration: ภาพ ทำแบบทดสอบเส้นทางชีวิต */}
          <div
            onMouseEnter={() => setHoveredStep('left')}
            onMouseLeave={() => setHoveredStep(null)}
            onClick={onStartLifePath}
            className="w-full sm:w-auto flex-1 flex items-center justify-center cursor-pointer group"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-60 lg:h-60 xl:w-72 xl:h-72 flex items-center justify-center">
              {/* Ambient radial blur glow that fades in on hover */}
              <div 
                aria-hidden="true"
                className={`absolute -inset-4 bg-amber-200/50 rounded-full blur-2xl transition-opacity duration-500 ease-in-out pointer-events-none ${
                  hoveredStep === 'left' ? 'opacity-90' : 'opacity-0 group-hover:opacity-90'
                }`} 
              />
              <img
                src="https://s.imgz.io/2026/10/12/a002b3e010ab2b23616cec313d439b71cbbb4334242784dc.png"
                alt="ภาพทำแบบทดสอบเส้นทางชีวิต"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain will-change-[transform,opacity] transition-all duration-500 ease-in-out drop-shadow-md ${
                  hoveredStep === 'left'
                    ? 'opacity-100 scale-105 drop-shadow-xl'
                    : hoveredStep === 'right'
                      ? 'opacity-50 scale-95'
                      : 'opacity-80 group-hover:opacity-100 hover:opacity-100 scale-100 group-hover:scale-105 hover:scale-105'
                }`}
              />
            </div>
          </div>

          {/* 3. Center Arrow: An orange arrow icon pointing to the right connecting the steps */}
          <div className="flex items-center justify-center shrink-0 my-2 lg:my-0 px-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#d97706] shadow-xs hover:scale-110 transition-transform">
              {/* Horizontal arrow for desktop, down arrow on mobile */}
              <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] hidden lg:block" />
              <ArrowDown className="w-6 h-6 stroke-[2.5] lg:hidden" />
            </div>
          </div>

          {/* 4. Right Illustration: ภาพ เข้าสู่บทเรียนออนไลน์ */}
          <div
            onMouseEnter={() => setHoveredStep('right')}
            onMouseLeave={() => setHoveredStep(null)}
            onClick={onExploreCourses}
            className="w-full sm:w-auto flex-1 flex items-center justify-center cursor-pointer group"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-60 lg:h-60 xl:w-72 xl:h-72 flex items-center justify-center">
              {/* Ambient radial blur glow that fades in on hover */}
              <div 
                aria-hidden="true"
                className={`absolute -inset-4 bg-amber-200/50 rounded-full blur-2xl transition-opacity duration-500 ease-in-out pointer-events-none ${
                  hoveredStep === 'right' ? 'opacity-90' : 'opacity-0 group-hover:opacity-90'
                }`} 
              />
              <img
                src="https://s.imgz.io/2026/10/12/33d66e8f4b66f0a749447911af51766dbc80946a0f1fb84f.png"
                alt="ภาพเข้าสู่บทเรียนออนไลน์"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain will-change-[transform,opacity] transition-all duration-500 ease-in-out drop-shadow-md ${
                  hoveredStep === 'right'
                    ? 'opacity-100 scale-105 drop-shadow-xl'
                    : hoveredStep === 'left'
                      ? 'opacity-50 scale-95'
                      : 'opacity-80 group-hover:opacity-100 hover:opacity-100 scale-100 group-hover:scale-105 hover:scale-105'
                }`}
              />
            </div>
          </div>

          {/* 5. Right Text Block: Title 'เข้าสู่บทเรียนออนไลน์', description, and a CTA button */}
          <div
            onMouseEnter={() => setHoveredStep('right')}
            onMouseLeave={() => setHoveredStep(null)}
            className="flex-1 max-w-sm lg:max-w-xs xl:max-w-sm relative cursor-pointer group text-left"
          >
            {/* Giant faint gray '02' decorative background text */}
            <span 
              aria-hidden="true"
              className="absolute -top-12 -left-6 sm:-left-8 text-[110px] sm:text-[140px] font-black text-slate-100/90 select-none pointer-events-none z-0 leading-none"
            >
              02
            </span>

            {/* Sharp foreground content */}
            <div className="relative z-10 font-['Mitr',sans-serif]">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-3 group-hover:text-amber-500 transition-colors">
                เข้าสู่บทเรียนออนไลน์
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                เรียนรู้หลักสูตร 4 คุณลักษณะสำคัญ ผ่านคอร์สวิดีโอคุณภาพสูง ฝึกแก้ปัญหาเชิงพื้นที่ และรับเกียรติบัตรรับรองจาก UDRU
              </p>
              {/* CTA button: #FFC800 with no black border, turns black with white text on hover/active */}
              <button
                onClick={onExploreCourses}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-bold text-sm transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md border-0 group/btn"
              >
                <span>เข้าสู่บทเรียนออนไลน์</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

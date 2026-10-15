import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Share2,
  Printer,
  RotateCcw,
  CheckCircle2,
  Compass,
  Award,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Cpu,
  Radio,
  Search,
  Globe,
  Network,
  Scale,
  HeartHandshake,
  Home,
  Sliders,
  Scan,
  Flame,
  ShieldAlert,
  Rocket,
  Info,
  TrendingUp,
  RefreshCw,
  Eye,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  calculateCosmicEvaluation,
  CosmicArchetype,
  CosmicPower
} from '../data/cosmicArchetypes';
import { Course } from '../types';

interface CosmicResultDashboardProps {
  answers?: Record<number, number>;
  userName?: string;
  onRetake?: () => void;
  onSelectCourse?: (course: Course) => void;
  onSwitchToCanvas?: () => void;
  isStudentDashboardView?: boolean;
}

export const CosmicResultDashboard: React.FC<CosmicResultDashboardProps> = ({
  answers = {},
  userName = 'นักศึกษา UDRU',
  onRetake,
  onSelectCourse,
  isStudentDashboardView = false,
}) => {
  // If answers is empty, check localStorage
  const activeAnswers = React.useMemo(() => {
    if (Object.keys(answers).length > 0) return answers;
    try {
      const saved = localStorage.getItem('udru_assessment_answers');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default sample if no answers yet so dashboard always looks full and beautiful
    const sample: Record<number, number> = {};
    for (let i = 1; i <= 60; i++) {
      sample[i] = (i % 3 === 0) ? 6 : (i % 2 === 0 ? 5 : 7);
    }
    return sample;
  }, [answers]);

  const evaluation = React.useMemo(() => {
    return calculateCosmicEvaluation(activeAnswers);
  }, [activeAnswers]);

  const activeArchetype = evaluation.dominantArchetype;
  const [selectedPower, setSelectedPower] = useState<CosmicPower | null>(null);
  const [showPowerModal, setShowPowerModal] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger celebration on initial mount if viewing fresh test results
  useEffect(() => {
    if (!isStudentDashboardView) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [isStudentDashboardView]);

  const handleShare = () => {
    const text = `ฉันได้ผลประเมินตัวตนแห่งจักรวาล: ${activeArchetype.nameTh} (${activeArchetype.personalityRole}) โดย UDRU Lifelong Learning!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const renderPowerIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Shield':
        return <Shield className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      case 'Network':
        return <Network className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'Home':
        return <Home className={className} />;
      case 'Sliders':
        return <Sliders className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Scan':
        return <Scan className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Rocket':
        return <Rocket className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };



  return (
    <div
      ref={cardRef}
      className="w-full space-y-8 font-['Mitr','Prompt',sans-serif] text-slate-800 animate-in fade-in duration-300"
    >
      {/* ========================================================================= */}
      {/* [SECTION 1] TOP SPLIT HERO: LEFT CHARACTER CARD & RIGHT SPIDER RADAR CHART */}
      {/* Replicating layout & aesthetic from image.png & cyber minimal theme */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* [SECTION 1] DOMINANT CHARACTER HERO CARD */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm relative overflow-hidden group">
        {/* Subtle Cyber Glow Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Character Illustration with Cyber Frame */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Yellow / Dark Accent Circle */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-50 via-slate-50 to-amber-100/60 border border-slate-200/80 -rotate-2" />
              
              {/* Character Image */}
              <img
                src={activeArchetype.imageUrl}
                alt={activeArchetype.nameTh}
                className="relative z-10 w-full h-full object-contain p-2 drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />

              {/* Star Stamp Callout */}
              <div className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-lg bg-black text-white text-[10px] font-bold tracking-wider shadow-xs flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3 h-3 text-[#FFE600]" />
                <span>{activeArchetype.themeEn}</span>
              </div>
            </div>
          </div>

          {/* Character Details */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {/* Top Spacecraft Callsign & Tag */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-[#FFE600] text-[10px] font-bold tracking-wider uppercase font-mono shadow-xs">
                {activeArchetype.nameEn}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {activeArchetype.callsign}
              </span>
            </div>

            {/* Title: เผ่าพันธุ์ */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                เผ่าพันธุ์ : {activeArchetype.fullName}
              </h2>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FFE600] text-black text-xs font-black shadow-xs">
                  ★ {activeArchetype.personalityRole} ({activeArchetype.personalityRoleEn})
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeArchetype.theme}
                </span>
              </div>
            </div>

            {/* Quote Pill */}
            <div className="p-3 bg-slate-50 border-l-4 border-amber-400 rounded-r-xl text-xs italic text-slate-700">
              "{activeArchetype.quote}"
            </div>

            {/* Persona Summary Description Text */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
              {activeArchetype.description}
            </p>

            {/* Action Button: "ข้อมูลเพิ่มเติม →" */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('cosmic-superpowers-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setShowPowerModal(true);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#000000] hover:text-[#FFE600] active:bg-[#000000] active:text-white text-black font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <span>ข้อมูลเพิ่มเติม (Superpowers)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[11px] text-slate-500 font-mono">
                ธีม: {activeArchetype.theme}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* [SECTION 2] ระบบพลังขับเคลื่อนประจำยานอวกาศ (Superpowers) */}
      {/* Exactly matching verbatim superpower texts for each character */}
      {/* ========================================================================= */}
      <div id="cosmic-superpowers-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>ระบบพลังขับเคลื่อนประจำยานอวกาศ (Superpowers)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {activeArchetype.fullName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {activeArchetype.callsign} · "{activeArchetype.quote}"
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copySuccess ? 'คัดลอกลิงก์แล้ว!' : 'แชร์ผลลัพธ์'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ PDF</span>
            </button>

            {onRetake && (
              <button
                onClick={onRetake}
                className="px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-black hover:text-[#FFE600] text-black text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ทำแบบทดสอบใหม่</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Superpower Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeArchetype.powers.map((p, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedPower(p);
                setShowPowerModal(true);
              }}
              className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all space-y-2 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-400/20 text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {renderPowerIcon(p.iconName, 'w-6 h-6 text-slate-950')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {idx + 1}. {p.title}
                    </h5>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      Power {idx + 1}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {p.titleEn}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {p.description}
              </p>
            </div>
          ))}
        </div>



        {/* ------------------------------------------------------------- */}
        {/* Taiwan Design Expo & CakeResume Identity Passport (Images 2, 3, 4) */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-mono tracking-widest text-[#FFE600] uppercase block mb-1">
                  SPACE IDENTITY PASSPORT · UDRU
                </span>
                <h4 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {activeArchetype.nameEn}
                </h4>
                <p className="text-sm text-slate-300 mt-1">
                  "{activeArchetype.quote}"
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {activeArchetype.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-slate-800 text-[#FFE600] text-xs font-bold border border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-['Mitr',sans-serif]">
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-medium block">
                  ระดับความมุ่งมั่นทุ่มเท
                </span>
                <span className="text-3xl font-black text-[#FFE600] font-mono block mt-1">
                  {activeArchetype.workaholismIndex}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Workaholism Index
                </span>
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-medium block">
                  ระดับความแม่นยำสมบูรณ์แบบ
                </span>
                <span className="text-3xl font-black text-emerald-400 font-mono block mt-1">
                  {activeArchetype.perfectionismLevel}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Perfectionism Level
                </span>
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-medium block">
                  ไอเทมนำโชคประจำจักรวาล
                </span>
                <span className="text-sm font-bold text-white block mt-2 line-clamp-1">
                  {activeArchetype.cosmicLuckyCharm}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {activeArchetype.luckyCharmDesc}
                </span>
              </div>
            </div>

            {/* Work Persona & Career Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/70 rounded-2xl p-4 border border-slate-800">
                <h5 className="text-xs font-bold text-[#FFE600] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>สไตล์การทำงาน (Work Persona)</span>
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeArchetype.workPersona}
                </p>
              </div>

              <div className="bg-slate-900/70 rounded-2xl p-4 border border-slate-800">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>แนวทางเส้นทางอาชีพ (Career Guide)</span>
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {activeArchetype.careerGuide}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeArchetype.recommendedRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Work Besties & Strictly Colleagues */}
            <div className="pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80">
                  <span className="text-xs font-bold text-emerald-400 block mb-2.5">
                    ✦ เผ่าพันธุ์คู่หูเพื่อนซี้ (Work Besties)
                  </span>
                  <div className="flex items-center gap-4">
                    {activeArchetype.besties.map((b) => (
                      <div key={b.id} className="flex items-center gap-2.5">
                        <img
                          src={b.imageUrl}
                          alt={b.name}
                          className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 object-contain p-1"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {b.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {b.relation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80">
                  <span className="text-xs font-bold text-amber-400 block mb-2.5">
                    ✦ เพื่อนร่วมงานต่างสาย (Strictly Colleagues)
                  </span>
                  <div className="flex items-center gap-4">
                    {activeArchetype.colleagues.map((c) => (
                      <div key={c.id} className="flex items-center gap-2.5">
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 object-contain p-1"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {c.relation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>ผลประเมินถูกประมวลผลและพร้อมแสดงผลในโปรไฟล์นักศึกษา</span>
          </div>

          {onSelectCourse && (
            <button
              onClick={() => onSelectCourse({} as any)}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>สำรวจหลักสูตรพัฒนาสมรรถนะ</span>
            </button>
          )}
        </div>
      </div>

      {/* Superpower Modal Popout */}
      {showPowerModal && selectedPower && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                  {renderPowerIcon(selectedPower.iconName, 'w-5 h-5 text-slate-950')}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedPower.title}</h4>
                  <p className="text-xs text-slate-400 font-mono">{selectedPower.titleEn}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPowerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedPower.description}
            </p>

            <button
              onClick={() => setShowPowerModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

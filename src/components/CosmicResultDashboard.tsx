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
  COSMIC_ARCHETYPES,
  SBO_12_DIMENSIONS,
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

  const [activeArchetype, setActiveArchetype] = useState<CosmicArchetype>(
    evaluation.dominantArchetype
  );
  const [hoveredSboId, setHoveredSboId] = useState<string | null>(null);
  const [selectedPower, setSelectedPower] = useState<CosmicPower | null>(null);
  const [showPowerModal, setShowPowerModal] = useState<boolean>(false);
  const [showAll12Sbo, setShowAll12Sbo] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [radarAnimKey, setRadarAnimKey] = useState<number>(0);
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

  // Keep active archetype in sync if evaluation changes
  useEffect(() => {
    setActiveArchetype(evaluation.dominantArchetype);
  }, [evaluation]);

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

  /**
   * Render the 12-Axis Spider / Radar Chart
   * Matches verbatim with image.png reference radar chart
   */
  const renderRadarChart = () => {
    const size = 520;
    const center = size / 2;
    const maxRadius = 175; // Radius corresponding to 80 on the grid
    const sboItems = evaluation.sboResults;
    const totalAxes = sboItems.length; // 12
    const angleStep = (Math.PI * 2) / totalAxes;

    // Grid levels: 20, 40, 60, 80 (where 80 is the outer boundary line in image.png)
    const gridLevels = [20, 40, 60, 80];

    // Compute vertex points
    const points = sboItems.map((item, i) => {
      // Angle: start at top (-PI/2) and rotate clockwise
      const angle = i * angleStep - Math.PI / 2;
      // Chart value: 0 to 80
      const clampedVal = Math.max(10, Math.min(80, item.chartValue));
      const r = (clampedVal / 80) * maxRadius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, angle, r, item, index: i };
    });

    const polygonPointsString = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    return (
      <div className="relative flex flex-col items-center justify-center w-full py-2 select-none">
        <svg
          key={radarAnimKey}
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[500px] h-auto overflow-visible drop-shadow-sm transition-all"
        >
          <defs>
            {/* Polished semi-transparent gradient fill */}
            <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#FFE600" stopOpacity="0.45" />
              <stop offset="65%" stopColor="#FACC15" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#EAB308" stopOpacity="0.18" />
            </radialGradient>

            <linearGradient id="radarStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EAB308" />
              <stop offset="50%" stopColor="#FFE600" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>

            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Circle/Polygonal Grid Lines (20, 40, 60, 80) */}
          {gridLevels.map((lvl) => {
            const r = (lvl / 80) * maxRadius;
            const webPoints = Array.from({ length: totalAxes })
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ');

            return (
              <g key={`grid-lvl-${lvl}`}>
                <polygon
                  points={webPoints}
                  fill={lvl === 80 ? '#f8fafc' : 'none'}
                  stroke="#cbd5e1"
                  strokeWidth="0.9"
                  strokeDasharray={lvl === 80 ? undefined : '2 2'}
                />
                {/* Horizontal scale values (0, 20, 40, 60, 80) along horizontal right spoke */}
                <text
                  x={center + r - 3}
                  y={center - 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono font-medium"
                >
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Center Zero label */}
          <text
            x={center - 8}
            y={center - 4}
            textAnchor="end"
            className="text-[10px] fill-slate-400 font-mono font-medium"
          >
            0
          </text>

          {/* 12 Spoke Axis Lines */}
          {Array.from({ length: totalAxes }).map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + maxRadius * Math.cos(angle);
            const y = center + maxRadius * Math.sin(angle);
            return (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* User Score Polygon Area with Glowing Cyber Border */}
          <polygon
            points={polygonPointsString}
            fill="url(#radarFillGrad)"
            stroke="url(#radarStrokeGrad)"
            strokeWidth="2.4"
            className="transition-all duration-700 ease-out"
            filter="url(#radarGlow)"
          />

          {/* Vertex Points & Interactive Hotspots */}
          {points.map((p) => {
            const isHovered = hoveredSboId === p.item.id;
            return (
              <g
                key={`pt-${p.item.id}`}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredSboId(p.item.id)}
                onMouseLeave={() => setHoveredSboId(null)}
              >
                {/* Outer ring on hover */}
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={9}
                    fill="none"
                    stroke="#EAB308"
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}
                {/* Point circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#000000' : '#EAB308'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* 12 Outer Dimension Labels in Thai (Exact matches to image.png) */}
          {points.map((p) => {
            const isHovered = hoveredSboId === p.item.id;
            const labelRadius = maxRadius + 32;
            const lx = center + labelRadius * Math.cos(p.angle);
            const ly = center + labelRadius * Math.sin(p.angle);

            // Text alignment based on horizontal position
            let textAnchor: 'start' | 'end' | 'middle' = 'middle';
            if (p.angle > -Math.PI / 2 + 0.2 && p.angle < Math.PI / 2 - 0.2) {
              textAnchor = 'start';
            } else if (p.angle > Math.PI / 2 + 0.2 || p.angle < -Math.PI / 2 - 0.2) {
              textAnchor = 'end';
            }

            return (
              <g
                key={`label-${p.item.id}`}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredSboId(p.item.id)}
                onMouseLeave={() => setHoveredSboId(null)}
              >
                <text
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                  className={`text-[11px] select-none font-['Mitr',sans-serif] transition-all duration-200 ${
                    isHovered
                      ? 'fill-amber-600 font-bold text-[12px]'
                      : 'fill-slate-700 font-medium'
                  }`}
                >
                  {p.item.label}
                </text>
                {/* Micro SBO Code Pill */}
                <text
                  x={lx}
                  y={ly + 12}
                  textAnchor={textAnchor}
                  className={`text-[9px] font-mono select-none font-semibold ${
                    isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {p.item.code} · {p.item.chartValue} pt
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered SBO Dimension Tooltip Pill */}
        {hoveredSboId && (
          <div className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150">
            {(() => {
              const item = evaluation.sboResults.find((s) => s.id === hoveredSboId);
              if (!item) return null;
              return (
                <>
                  <span className="font-bold text-[#FFE600] font-mono">
                    [{item.code}] {item.label}:
                  </span>
                  <span className="font-bold text-white">
                    คะแนน {item.chartValue}/80 ({item.percentage}%)
                  </span>
                  <span className="text-[11px] text-slate-300 hidden sm:inline">
                    · {item.description}
                  </span>
                </>
              );
            })()}
          </div>
        )}
      </div>
    );
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Dominant Character Card (Image 1 Style) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle Cyber Glow Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Spacecraft Callsign & Tag */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-[#FFE600] text-[10px] font-bold tracking-wider uppercase font-mono shadow-xs">
                {activeArchetype.nameEn}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {activeArchetype.callsign}
              </span>
            </div>

            {/* Title: เผ่าพันธุ์ : The Signal Broadcasters / เผ่าพันธุ์ผู้ส่งคลื่นความถี่ทะลุมิติ */}
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
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
            <div className="p-3 bg-slate-50 border-l-4 border-amber-400 rounded-r-xl mb-4 text-xs italic text-slate-700">
              "{activeArchetype.quote}"
            </div>

            {/* Character Illustration with Cyber Frame */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                {/* Yellow / Dark Accent Circle */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-50 via-slate-50 to-amber-100/60 border border-slate-200/80 -rotate-2" />
                
                {/* Character Image */}
                <img
                  src={activeArchetype.imageUrl}
                  alt={activeArchetype.nameTh}
                  className="relative z-10 w-full h-full object-contain p-2 drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />

                {/* Star Stamp Callout */}
                <div className="absolute bottom-2 left-2 z-20 px-3 py-1 rounded-lg bg-black text-white text-[10px] font-bold tracking-wider shadow-xs flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3 h-3 text-[#FFE600]" />
                  <span>{activeArchetype.themeEn}</span>
                </div>
              </div>
            </div>

            {/* Persona Summary Description Text */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left mt-4">
              {activeArchetype.description}
            </p>
          </div>

          {/* Action Button: "ข้อมูลเพิ่มเติม →" */}
          <div className="pt-6 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
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

        {/* Right Card: Student Base Outcome Radar Chart (Image 1 Style) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header: Student Base Outcome */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Student Base Outcome</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                    12 มิติ
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ผลการประเมินสมรรถนะนักศึกษา 12 มิติ (Spider / Radar Chart สเกล 0 - 80)
                </p>
              </div>

              {/* Chart Replay / Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRadarAnimKey((k) => k + 1)}
                  title="วาดกราฟใหม่ (Re-render Animation)"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">วาดกราฟใหม่</span>
                </button>
              </div>
            </div>

            {/* The 12-Axis Spider Radar Chart Component */}
            {renderRadarChart()}
          </div>

          {/* Quick Archetype Switcher Bar (allows previewing all 4 archetypes) */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-500">
              สลับดูตัวตนและพลังเผ่าพันธุ์อื่น:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {evaluation.archetypeResults.map((ar) => (
                <button
                  key={ar.id}
                  onClick={() => setActiveArchetype(ar.archetype)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                    activeArchetype.id === ar.id
                      ? 'bg-slate-950 text-[#FFE600] border-slate-950 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <span>{ar.archetype.personalityRole}</span>
                  <span className="text-[10px] opacity-75">({ar.percentage}%)</span>
                </button>
              ))}
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

        {/* 4 Archetypes Comparative Progress Bars */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span>สัดส่วนคะแนนทั้ง 4 เผ่าพันธุ์</span>
            <span className="text-[11px] text-slate-400 font-normal">(คำนวณจากแบบประเมิน 60 ข้อ)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {evaluation.archetypeResults.map((item) => {
              const isDominant = item.id === evaluation.dominantArchetype.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveArchetype(item.archetype)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeArchetype.id === item.id
                      ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/40 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {item.archetype.personalityRole}
                    </span>
                    <span className="text-xs font-mono font-black text-slate-950">
                      {item.percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.archetype.colorHex,
                      }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 truncate">
                    {item.archetype.nameEn}
                  </p>

                  {isDominant && (
                    <span className="mt-2 inline-block px-2 py-0.5 rounded-md bg-[#FFE600] text-black text-[10px] font-black">
                      ★ เผ่าพันธุ์เด่นสูงสุด
                    </span>
                  )}
                </div>
              );
            })}
          </div>
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

        {/* ------------------------------------------------------------- */}
        {/* 12 SBO Dimensions Skill Assessment Details */}
        {/* ------------------------------------------------------------- */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                รายละเอียดคะแนน Student Base Outcome (12 มิติ)
              </h4>
              <p className="text-xs text-slate-500">
                ดูรายละเอียดระดับคะแนนและคำอธิบายสมรรถนะแต่ละด้านอย่างละเอียด
              </p>
            </div>

            <button
              onClick={() => setShowAll12Sbo(!showAll12Sbo)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{showAll12Sbo ? 'ย่อรายละเอียด' : 'ดูรายละเอียดทั้งหมด 12 ด้าน'}</span>
              {showAll12Sbo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showAll12Sbo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 animate-in fade-in">
              {evaluation.sboResults.map((sbo) => (
                <div
                  key={sbo.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-white hover:border-amber-300 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-mono font-bold text-[10px]">
                      {sbo.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600">
                      {sbo.chartValue}/80 ({sbo.percentage}%)
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {sbo.label}
                  </h5>

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {sbo.description}
                  </p>
                </div>
              ))}
            </div>
          )}
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

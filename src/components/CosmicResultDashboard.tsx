import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Share2,
  Printer,
  RotateCcw,
  CheckCircle2,
  Compass,
  ArrowRight,
  Rocket,
  Star,
  ListFilter,
  Check,
  Eye,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  Atom,
  Target,
  Settings,
  HelpCircle,
  ExternalLink,
  Shield,
  Search,
  Cpu,
  Radio,
  Heart,
  Link as LinkIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  calculateCosmicEvaluation,
  COSMIC_ARCHETYPES,
  CosmicArchetype,
  CosmicPower,
  SBO_12_DIMENSIONS,
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
  userName = 'ผู้เข้ารับการประเมิน',
  onRetake,
  onSelectCourse,
  isStudentDashboardView = false,
}) => {
  // If answers is empty, default to stargazer profile answers
  const activeAnswers = React.useMemo(() => {
    if (Object.keys(answers).length > 0) return answers;
    try {
      const saved = localStorage.getItem('udru_assessment_answers');
      if (saved) return JSON.parse(saved);
    } catch {}
    const sample: Record<number, number> = {};
    for (let i = 1; i <= 60; i++) {
      sample[i] = (i % 3 === 0) ? 6 : (i % 2 === 0 ? 5 : 7);
    }
    return sample;
  }, [answers]);

  // Selected Archetype (Defaulting to star_gazers as requested)
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('star_gazers');
  const activeArchetype: CosmicArchetype = COSMIC_ARCHETYPES[selectedArchetypeId] || COSMIC_ARCHETYPES.star_gazers;

  // Radar Chart mode: '12_sbo' (default 12 SBO Spider Chart) | '12_table' | '6_strengths'
  const [radarMode, setRadarMode] = useState<'12_sbo' | '12_table' | '6_strengths'>('12_sbo');
  const [selectedSboId, setSelectedSboId] = useState<string>('sbo-1');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger celebration on initial mount
  useEffect(() => {
    if (!isStudentDashboardView) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
        });
      } catch {}
    }
  }, [isStudentDashboardView]);

  const handleShare = () => {
    const text = `ฉันได้ผลลัพธ์: ${activeArchetype.nameTh} (${activeArchetype.theme}) โดย PALAD Academy! ค้นพบเส้นทางชีวิตของคุณได้ที่นี่`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  // 12 SBO Dimensions (Student Base Outcome) for the 12-dimensional Spider Chart
  const sbo12Data = React.useMemo(() => {
    const evalData = calculateCosmicEvaluation(activeAnswers);
    const hasCustomAnswers = Object.keys(answers).length > 0;

    // Star Gazers archetype benchmark scores (Logic, Analysis, Future Planning, Precision)
    const starGazerScores: Record<string, number> = {
      'sbo-1': 96, // การตัดสินใจด้วยข้อเท็จจริง
      'sbo-2': 91, // การเติบโตทางความคิด
      'sbo-3': 85, // ยอมรับความแตกต่างอย่างสร้างสรรค์
      'sbo-4': 95, // ความจริงอิงเหตุ-ผล
      'sbo-5': 82, // เคารพและให้เกียรติ
      'sbo-6': 92, // ความสงสัยใคร่รู้
      'sbo-7': 94, // การวิเคราะห์เพื่อพัฒนา
      'sbo-8': 84, // การสร้างการมีส่วนร่วมเพื่อมุ่งผลสำเร็จ
      'sbo-9': 93, // เข้าใจปัจจุบัน เพื่อวางแผนอนาคต
      'sbo-10': 90, // เกาให้ถูกที่คัน
      'sbo-11': 88, // การเพิ่มผลลัพธ์อย่างมีคุณค่า
      'sbo-12': 82, // การร่วมแรงร่วมใจพัฒนา
    };

    return SBO_12_DIMENSIONS.map((dim, idx) => {
      const calculated = evalData.sboResults.find((r) => r.id === dim.id);
      const score = hasCustomAnswers && calculated ? calculated.percentage : (starGazerScores[dim.id] || 88);
      // 12 angles starting at top (-90 degrees) stepping 30 degrees clockwise
      const angle = -90 + (idx * 30);
      return {
        ...dim,
        score,
        angle,
      };
    });
  }, [activeAnswers, answers]);

  // Selected SBO detail item
  const activeSboItem = sbo12Data.find((s) => s.id === selectedSboId) || sbo12Data[0];

  // 12 SBO Radar Geometry (Center at 210, 210, Radius = 105)
  const sboCenter = 210;
  const sboRadius = 105;

  const getSboCoord = (angleDeg: number, ratio: number, radius = sboRadius) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: sboCenter + radius * ratio * Math.cos(angleRad),
      y: sboCenter + radius * ratio * Math.sin(angleRad),
    };
  };

  // SBO 12 Radar polygon points
  const sboRadarPoints = sbo12Data.map((dim) => {
    const pt = getSboCoord(dim.angle, dim.score / 100);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // 6 Strengths Radar Dimensions for Star Gazers
  const strengths6 = [
    { label: 'การวิเคราะห์เชิงลึก', sub: '(Deep Analysis)', score: 95, angle: -90 },
    { label: 'การตัดสินใจอย่างแม่นยำ', sub: '(Precision Decision)', score: 92, angle: -30 },
    { label: 'การคิดเชิงตรรกะ', sub: '(Logical Thinking)', score: 94, angle: 30 },
    { label: 'นวัตกรรมและจินตนาการ', sub: '(Innovation)', score: 88, angle: 90 },
    { label: 'การสื่อสารความซับซ้อนให้เข้าใจง่าย', sub: '(Clarity)', score: 84, angle: 150 },
    { label: 'การมองภาพอนาคต', sub: '(Future Vision)', score: 90, angle: 210 },
  ];

  // Helper for 6 dimensions radar
  const radarRadius = 100;
  const radarCenter = 160;

  const getCoordinates = (angleDeg: number, valueRatio: number, radius = radarRadius) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: radarCenter + radius * valueRatio * Math.cos(angleRad),
      y: radarCenter + radius * valueRatio * Math.sin(angleRad),
    };
  };

  const radarPoints = strengths6.map((dim) => {
    const ratio = dim.score / 100;
    const pt = getCoordinates(dim.angle, ratio);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // 6 Character Traits from prompt
  const characterTraits = [
    {
      icon: <Atom className="w-4 h-4 text-slate-900" />,
      text: 'แยกข้อเท็จจริงออกจากอารมณ์ได้อย่างชัดเจน',
    },
    {
      icon: <Target className="w-4 h-4 text-slate-900" />,
      text: 'ตัดสินใจอย่างมีเหตุผลและมีหลักฐานรองรับ',
    },
    {
      icon: <Eye className="w-4 h-4 text-slate-900" />,
      text: 'มองเห็นแบบแผนในข้อมูลหรือปัญหาที่ซับซ้อน',
    },
    {
      icon: <Lightbulb className="w-4 h-4 text-slate-900" />,
      text: 'คิดค้นทางออกใหม่เมื่อสถานการณ์ไม่อยู่ตัว',
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-slate-900" />,
      text: 'มองไกลและคำนวณผลกระทบล่วงหน้าได้ดี',
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-slate-900" />,
      text: 'อธิบายเรื่องยากให้คนเข้าใจได้ง่าย',
    },
  ];

  // 5 Superpowers in spaceship from prompt
  const spaceCrewAbilities = [
    {
      num: '01',
      title: 'เลนส์กรองคลื่นอารมณ์',
      titleEn: 'Emotional Interference Shield',
      iconSvg: (
        <div className="w-12 h-12 relative flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-800" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="32" rx="28" ry="10" stroke="#000" strokeWidth="2.5" strokeDasharray="4 2" />
            <circle cx="32" cy="32" r="16" fill="#FDE047" stroke="#000" strokeWidth="2.5" />
            <ellipse cx="32" cy="32" rx="28" ry="10" stroke="#000" strokeWidth="2.5" strokeDashoffset="20" />
            <circle cx="28" cy="28" r="3" fill="#fff" opacity="0.8" />
          </svg>
        </div>
      ),
      description:
        'ท่ามกลางความวุ่นวายและโกลาหล คุณคือคนที่สงบที่สุดบนยาน เพราะคุณสามารถแยกแยะ "ข้อเท็จจริง" ออกจาก "คลื่นอารมณ์" ได้อย่างเด็ดขาด คุณมองโลกและปัญหาด้วยสายตาอันเที่ยงตรงเหมือนกล้องโทรทรรศน์อวกาศที่ไม่ถูกบดบังด้วยหมอกควัน ทำให้ทุกการตัดสินใจของคุณเป็นกลาง แม่นยำ และแก้ปัญหาได้อย่างตรงจุดเสมอ',
    },
    {
      num: '02',
      title: 'เข็มทิศนำทางระดับวงโคจร',
      titleEn: 'Precision Navigation Decision',
      iconSvg: (
        <div className="w-12 h-12 relative flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-800" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="18" stroke="#000" strokeWidth="2.5" />
            <polygon points="32,18 36,32 32,46 28,32" fill="#F59E0B" stroke="#000" strokeWidth="1.5" />
            <polygon points="32,18 32,32 28,32" fill="#000" />
            <polygon points="18,32 32,36 46,32 32,28" stroke="#000" strokeWidth="1.5" fill="#FDE047" />
            <circle cx="32" cy="32" r="3" fill="#fff" stroke="#000" strokeWidth="1.5" />
          </svg>
        </div>
      ),
      description:
        'คุณไม่เคยปล่อยให้ยานพุ่งชนอุกกาบาตด้วยความหุนหันพลันแล่น ทุกก้าวที่คุณเลือกผ่านการคำนวณปัจจัย ความเสี่ยง และผลกระทบที่จะเกิดขึ้นในอีกหลายปีแสงข้างหน้าอย่างรอบคอบ การตัดสินใจของคุณมี "พิกัดและหลักฐาน" รองรับเสมอ ลูกเรือทุกคนจึงมอบความไว้วางใจให้คุณเป็นผู้นำทางและสถาปนิกผู้กำหนดทิศทางแห่งกาแล็กซี่',
    },
    {
      num: '03',
      title: 'ถอดรหัสความลับจักรวาล',
      titleEn: 'Deep Space Analytics',
      iconSvg: (
        <div className="w-12 h-12 relative flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-800" viewBox="0 0 64 64" fill="none">
            <ellipse cx="28" cy="28" rx="20" ry="8" stroke="#000" strokeWidth="2" />
            <circle cx="28" cy="28" r="12" fill="#FDE047" stroke="#000" strokeWidth="2.5" />
            <circle cx="34" cy="34" r="14" stroke="#000" strokeWidth="3" fill="none" />
            <line x1="44" y1="44" x2="56" y2="56" stroke="#000" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      ),
      description:
        'หัวใจสำคัญของคุณคือการวิเคราะห์เชิงเหตุผลตามหลักวิทยาศาสตร์ คุณหลงใหลในการขุดคุ้ยรายละเอียดลึกซึ้ง มองเห็นแบบแผน (Pattern) ในชุดข้อมูลหรือตรรกะอันซับซ้อนที่คนอื่นมองว่าไร้ระเบียบ ทำให้คุณสามารถคลี่คลายปริศนาที่ซับซ้อนของจักรวาลและองค์กรได้อย่างมีประสิทธิภาพ',
    },
    {
      num: '04',
      title: 'สมองกลสร้างนวัตกรรมข้ามมิติ',
      titleEn: 'Quantum Problem Solving',
      iconSvg: (
        <div className="w-12 h-12 relative flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-800" viewBox="0 0 64 64" fill="none">
            <path d="M32 14 C24 14 18 20 18 28 C18 34 22 38 24 42 L40 42 C42 38 46 34 46 28 C46 20 40 14 32 14 Z" fill="#FDE047" stroke="#000" strokeWidth="2.5" />
            <path d="M26 42 L26 48 L38 48 L38 42" stroke="#000" strokeWidth="2.5" fill="#fff" />
            <line x1="28" y1="52" x2="36" y2="52" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30 26 L34 22 L34 34" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ),
      description:
        'นอกจากตรรกะอันเป๊ะปังแล้ว คุณยังมีจินตนาการระดับทะลุมิติ เมื่อเจอวิกฤตที่ไม่มีคู่มือการแก้ปัญหาเขียนไว้ คุณคือคนแรกที่มองเห็นความเป็นไปได้นับล้านในความว่างเปล่า และคิดค้นทฤษฎีหรือนวัตกรรมใหม่ๆ มาผ่าทางตัน สร้างสรรค์ผลงานที่โดดเด่นจนทุกคนต้องทึ่ง',
    },
    {
      num: '05',
      title: 'เครื่องแปลสัญญาณกาแล็กซี่',
      titleEn: 'Cosmic Fact Translator',
      iconSvg: (
        <div className="w-12 h-12 relative flex items-center justify-center">
          <svg className="w-10 h-10 text-slate-800" viewBox="0 0 64 64" fill="none">
            <rect x="28" y="22" width="10" height="20" rx="2" fill="#FDE047" stroke="#000" strokeWidth="2" />
            <rect x="12" y="24" width="12" height="16" fill="#fff" stroke="#000" strokeWidth="2" />
            <rect x="42" y="24" width="12" height="16" fill="#fff" stroke="#000" strokeWidth="2" />
            <line x1="24" y1="32" x2="28" y2="32" stroke="#000" strokeWidth="2" />
            <line x1="38" y1="32" x2="42" y2="32" stroke="#000" strokeWidth="2" />
            <line x1="33" y1="14" x2="33" y2="22" stroke="#000" strokeWidth="2.5" />
            <circle cx="33" cy="14" r="2.5" fill="#F59E0B" />
          </svg>
        </div>
      ),
      description:
        'แม้มองเห็นภาพกว้างที่ไกลกว่าคนอื่นหลายปีแสง แต่คุณมีความสามารถพิเศษในการแปลข้อมูลและทฤษฎีอันยากยิ่ง ให้กลายเป็นภาษาที่เข้าใจง่าย คุณสามารถอธิบายเหตุผลเบื้องหลังของการตัดสินใจให้ทีมงานเห็นภาพชัดเจน สร้างความเชื่อมั่น และพาทุกคนมุ่งหน้าสู่เป้าหมายเดียวกันได้อย่างมั่นคง',
    },
  ];

  // Besties characters matching image 4
  const bestiesList = [
    {
      name: 'นักสร้างสรรค์',
      desc: 'เด่นไอเดียใหม่ และมุมมองใหม่ๆ',
      characterSvg: (
        <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-xs">
          <circle cx="40" cy="56" r="20" fill="#FFDE59" />
          <path d="M24 38 C20 38 18 32 22 28 C20 22 28 18 34 22 C38 16 48 16 52 22 C58 20 62 26 58 32 C62 36 58 42 52 40 Z" fill="#1E293B" />
          <circle cx="32" cy="30" r="2" fill="#fff" />
          <circle cx="44" cy="30" r="2" fill="#fff" />
          <path d="M40 38 L36 46 L42 46 L38 54" stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'นักสำรวจ',
      desc: 'ชอบลองสิ่งใหม่ๆ ไม่ยึดติดกรอบ',
      characterSvg: (
        <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-xs">
          <circle cx="40" cy="56" r="20" fill="#FFDE59" />
          <path d="M26 24 C26 24 32 16 40 16 C48 16 54 24 54 24 L58 28 L22 28 Z" fill="#F59E0B" stroke="#000" strokeWidth="2" />
          <circle cx="40" cy="38" r="12" fill="#1E293B" stroke="#000" strokeWidth="2" />
          <circle cx="40" cy="36" r="5" fill="#fff" />
          <circle cx="42" cy="35" r="2.5" fill="#000" />
        </svg>
      ),
    },
    {
      name: 'นักคิดต่าง',
      desc: 'มองโลกในมุมที่ แตกต่างและท้าทาย',
      characterSvg: (
        <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-xs">
          <circle cx="40" cy="56" r="20" fill="#FFDE59" />
          <ellipse cx="40" cy="36" rx="16" ry="14" fill="#fff" stroke="#000" strokeWidth="2.5" />
          <circle cx="32" cy="34" r="3.5" fill="#1E293B" />
          <circle cx="40" cy="28" r="3.5" fill="#1E293B" />
          <circle cx="48" cy="34" r="3.5" fill="#1E293B" />
          <circle cx="33" cy="33" r="1.5" fill="#fff" />
          <circle cx="41" cy="27" r="1.5" fill="#fff" />
          <circle cx="49" cy="33" r="1.5" fill="#fff" />
        </svg>
      ),
    },
  ];

  // Works well together characters matching image 4
  const worksWellList = [
    {
      name: 'นักสมดุล',
      desc: 'ช่วยให้ทุกไอเดีย ละเอียดรอบด้าน',
      characterSvg: (
        <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-xs">
          <circle cx="40" cy="56" r="20" fill="#FFDE59" />
          <ellipse cx="40" cy="36" rx="14" ry="18" fill="#fff" stroke="#000" strokeWidth="2.5" />
          <circle cx="40" cy="34" r="6" fill="#1E293B" />
          <circle cx="42" cy="32" r="2" fill="#fff" />
          <line x1="30" y1="48" x2="50" y2="48" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'นักวิเคราะห์',
      desc: 'เสริมมุมมองลึก และทำให้ข้อตกลงชัดเจน',
      characterSvg: (
        <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-xs">
          <circle cx="40" cy="56" r="20" fill="#FFDE59" />
          <circle cx="40" cy="34" r="14" fill="#1E293B" stroke="#000" strokeWidth="2" />
          <circle cx="40" cy="34" r="6" fill="#fff" />
          <circle cx="41" cy="33" r="3" fill="#000" />
        </svg>
      ),
    },
    {
      name: 'นักลงมือทำ',
      desc: 'เปลี่ยนไอเดียบนสมุด ให้เกิดขึ้นจริง',
      characterSvg: (
        <svg viewBox="0 0 80 80" className="w-16 h-16 drop-shadow-xs">
          <circle cx="40" cy="56" r="20" fill="#FFDE59" />
          <ellipse cx="32" cy="18" rx="4" ry="12" fill="#fff" stroke="#000" strokeWidth="2" />
          <ellipse cx="48" cy="18" rx="4" ry="12" fill="#fff" stroke="#000" strokeWidth="2" />
          <circle cx="40" cy="36" r="13" fill="#fff" stroke="#000" strokeWidth="2.5" />
          <circle cx="36" cy="35" r="2" fill="#000" />
          <circle cx="44" cy="35" r="2" fill="#000" />
          <polygon points="40,39 38,42 42,42" fill="#F59E0B" />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={cardRef}
      className="w-full bg-[#FFFFFF] min-h-screen font-['Prompt',sans-serif] text-slate-800 pb-16"
    >
      {/* Top Action Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold text-slate-500">
            รายงานผลการประเมินแบบทดสอบเส้นทางชีวิต (PALAD Life Path Assessment)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Archetype Switcher for Testing / Demonstrations */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-bold text-slate-700">
            <button
              onClick={() => setSelectedArchetypeId('star_gazers')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedArchetypeId === 'star_gazers'
                  ? 'bg-amber-400 text-slate-950 shadow-2xs'
                  : 'hover:text-slate-950'
              }`}
            >
              นักดูดาว (Star Gazer)
            </button>
            <button
              onClick={() => setSelectedArchetypeId('gravity_weavers')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedArchetypeId === 'gravity_weavers'
                  ? 'bg-amber-400 text-slate-950 shadow-2xs'
                  : 'hover:text-slate-950'
              }`}
            >
              ผู้ถักทอแรงโน้มถ่วง
            </button>
          </div>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'คัดลอกลิงก์แล้ว!' : 'แชร์ผลลัพธ์'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์ / PDF</span>
          </button>

          {onRetake && (
            <button
              onClick={onRetake}
              className="px-4 py-1.5 rounded-full bg-amber-400 hover:bg-black hover:text-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ทำแบบทดสอบใหม่</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION                                                   */}
        {/* Left: Heading, Subtitle, Description, Tags                                */}
        {/* Right: Character on Moon with Glowing Sun & Cosmic Orbit                  */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-white pt-4 pb-8 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Heading, Subtitle, Description, Tags */}
            <div className="lg:col-span-7 xl:col-span-7 text-left space-y-5 z-10">
              
              {/* Main Heading in bold brush style with hand-drawn yellow underline */}
              <div>
                <h1
                  className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-['Noto_Sans_Thai',sans-serif]"
                  style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
                >
                  <span
                    className="block font-black font-['Noto_Sans_Thai',sans-serif]"
                    style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
                  >
                    เผ่าพันธุ์นักดูดาว
                  </span>
                  <span
                    className="relative inline-block mt-1 font-black font-['Noto_Sans_Thai',sans-serif]"
                    style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
                  >
                    ผู้มองทะลุจักรวาล
                    {/* Hand-drawn curved yellow underline */}
                    <svg
                      className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4.5 pointer-events-none overflow-visible"
                      viewBox="0 0 240 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M3 11C60 3 170 2 237 9C180 14 100 15 35 15"
                        stroke="#FFC800"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  นักคิดวงโคจรลึก
                </h3>
              </div>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-2xl text-justify sm:text-left">
                คุณคือจอมวางแผนแห่งมิติเวลา ผู้ไม่ได้แค่นั่งมองความว่างเปล่าบนท้องฟ้า แต่กำลังคำนวณโครงสร้างของจักรวาลอยู่ในหัวตลอดเวลา คุณมีสติปัญญาอันแหลมคมในการแยกแยะข้อเท็จจริงออกจากความรู้สึก ตัดสินใจอย่างเที่ยงตรงด้วยเหตุผลเชิงตรรกะและหลักฐานที่ผ่านการวิเคราะห์มาอย่างถี่ถ้วน พร้อมทั้งใช้จินตนาการระดับทะลุขอบจักรวาลในการสร้างนวัตกรรมใหม่เพื่อแก้ปัญหาที่ยากที่สุด
              </p>

              {/* Pills / Tags (6 yellow pills matching design) */}
              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-2.5">
                {[
                  'คิดเป็นระบบ',
                  'ใช้เหตุผล',
                  'วิเคราะห์ลึก',
                  'มองไกล',
                  'สร้างนวัตกรรม',
                  'สื่อสารชัดเจน',
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1.5 rounded-full bg-[#FFF9D6] hover:bg-[#FFF2B2] text-slate-900 text-xs sm:text-sm font-bold border border-[#FDE047]/70 shadow-2xs transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Character on Moon with Glowing Sun and Cosmic Orbit */}
            <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center relative">
              {/* Back ambient halo */}
              <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-amber-200/50 via-yellow-100/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-none flex items-center justify-center">
                <img
                  src="https://s.imgz.io/2026/10/16/67bc0cb2bd72edae2aad213bc83b1b3c819fec653f409d7f.png"
                  alt="เผ่าพันธุ์นักดูดาวผู้มองทะลุจักรวาล"
                  className="w-full h-auto object-contain select-none drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.indexOf('stargazer_hero') === -1) {
                      target.src = '/stargazer_hero.png';
                    }
                  }}
                />
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: 3-CARD GRID                                                    */}
        {/* Card 1: ศักยภาพเด่นของคุณ (Spider Chart ทั้ง 12 มิติ Student Base Outcome) */}
        {/* Card 2: ตัวตนหลักของคุณ (Core Theoretician, 93%, Cosmic Telescope, Quote) */}
        {/* Card 3: ลักษณะเด่นของคุณ (6 Traits with yellow rounded icons)             */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* ------------------------------------------------------------- */}
            {/* Card 1 (Left): ศักยภาพเด่นของคุณ (YOUR STRENGTHS: SBO 12 มิติ)  */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
              
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    <Rocket className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      ศักยภาพเด่นของคุณ
                    </h3>
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold block">
                      STUDENT BASE OUTCOME (12 มิติ)
                    </span>
                  </div>
                </div>

                {/* SBO View Toggle Button */}
                <button
                  onClick={() => setRadarMode(radarMode === '12_sbo' ? '12_table' : '12_sbo')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="สลับโหมดมุมมองสมรรถนะ"
                >
                  <ListFilter className="w-3 h-3 text-slate-500" />
                  <span>{radarMode === '12_sbo' ? 'ดูตารางสรุป' : 'ดูกราฟเรดาร์'}</span>
                </button>
              </div>

              {/* Spider Chart View (12 Student Base Outcome Dimensions) */}
              {radarMode === '12_sbo' ? (
                <div className="relative w-full flex-1 flex flex-col items-center justify-center my-1 min-h-[340px]">
                  
                  {/* Decorative Cosmic Dots */}
                  <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-400 animate-pulse pointer-events-none" />
                  <div className="absolute top-8 right-10 w-1.5 h-1.5 rounded-full bg-slate-800 pointer-events-none" />
                  <div className="absolute top-20 left-4 w-2 h-2 rounded-full bg-amber-300 pointer-events-none" />
                  <div className="absolute bottom-16 right-6 w-2 h-2 rounded-full bg-slate-900 pointer-events-none" />

                  {/* SVG 12-Dimensional Radar Chart */}
                  <svg
                    className="w-full max-w-[390px] h-auto overflow-visible select-none"
                    viewBox="0 0 420 420"
                  >
                    <defs>
                      <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFF9D6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FFFDF5" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFDE59" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.35" />
                      </linearGradient>
                    </defs>

                    {/* Ambient Glow */}
                    <circle cx={sboCenter} cy={sboCenter} r={sboRadius + 15} fill="url(#radarGlow)" />

                    {/* Concentric 12-sided Polygons (Dodecagon at 5 grid levels: 20%, 40%, 60%, 80%, 100%) */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, lIdx) => {
                      const levelPoints = sbo12Data.map((dim) => {
                        const pt = getSboCoord(dim.angle, level);
                        return `${pt.x},${pt.y}`;
                      }).join(' ');
                      return (
                        <g key={lIdx}>
                          <polygon
                            points={levelPoints}
                            fill="none"
                            stroke={lIdx === 4 ? '#CBD5E1' : '#E2E8F0'}
                            strokeWidth={lIdx === 4 ? '1.5' : '1'}
                            strokeDasharray={lIdx === 4 ? 'none' : '3 3'}
                          />
                          {/* Percentage label on the vertical top axis */}
                          <text
                            x={sboCenter + 3}
                            y={sboCenter - sboRadius * level + 9}
                            fontSize="8"
                            fill="#94A3B8"
                            fontFamily="monospace"
                            className="select-none font-bold"
                          >
                            {Math.round(level * 100)}%
                          </text>
                        </g>
                      );
                    })}

                    {/* 12 Radial Spoke Lines */}
                    {sbo12Data.map((dim, sIdx) => {
                      const pt = getSboCoord(dim.angle, 1.0);
                      const isSelected = selectedSboId === dim.id;
                      return (
                        <line
                          key={sIdx}
                          x1={sboCenter}
                          y1={sboCenter}
                          x2={pt.x}
                          y2={pt.y}
                          stroke={isSelected ? '#F59E0B' : '#E2E8F0'}
                          strokeWidth={isSelected ? '1.5' : '1'}
                          className="transition-colors duration-200"
                        />
                      );
                    })}

                    {/* Data Polygon with Warm Yellow fill and Amber stroke */}
                    <polygon
                      points={sboRadarPoints}
                      fill="url(#polyGrad)"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />

                    {/* Data Vertices Dots for each of the 12 SBOs */}
                    {sbo12Data.map((dim) => {
                      const pt = getSboCoord(dim.angle, dim.score / 100);
                      const isSelected = selectedSboId === dim.id;
                      return (
                        <g
                          key={dim.id}
                          className="cursor-pointer group"
                          onClick={() => setSelectedSboId(dim.id)}
                        >
                          {isSelected && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="8"
                              fill="#FFC800"
                              fillOpacity="0.3"
                              className="animate-ping"
                            />
                          )}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isSelected ? '5.5' : '4'}
                            fill={isSelected ? '#FFC800' : '#0F172A'}
                            stroke={isSelected ? '#0F172A' : '#FFC800'}
                            strokeWidth="2"
                            className="transition-transform duration-200 group-hover:scale-125"
                          />
                        </g>
                      );
                    })}

                    {/* 12 Labels around the perimeter */}
                    {sbo12Data.map((dim) => {
                      // Position text outside outer polygon
                      const labelRadius = sboRadius + 22;
                      const ptOuter = getSboCoord(dim.angle, 1.0, labelRadius);
                      const isSelected = selectedSboId === dim.id;

                      const isTop = Math.abs(dim.angle + 90) < 5;
                      const isBottom = Math.abs(dim.angle - 90) < 5;
                      const rad = (dim.angle * Math.PI) / 180;
                      const cosVal = Math.cos(rad);
                      
                      const textAnchor = isTop || isBottom ? 'middle' : cosVal > 0.15 ? 'start' : 'end';
                      const dominantBaseline = isTop ? 'auto' : isBottom ? 'hanging' : 'middle';

                      // Truncated clean Thai label for the spider chart
                      const shortNames: Record<string, string> = {
                        'sbo-1': 'ตัดสินใจด้วยข้อเท็จจริง',
                        'sbo-2': 'เติบโตทางความคิด',
                        'sbo-3': 'ยอมรับความแตกต่าง',
                        'sbo-4': 'ความจริงอิงเหตุผล',
                        'sbo-5': 'เคารพและให้เกียรติ',
                        'sbo-6': 'ความสงสัยใคร่รู้',
                        'sbo-7': 'วิเคราะห์เพื่อพัฒนา',
                        'sbo-8': 'สร้างการมีส่วนร่วม',
                        'sbo-9': 'เข้าใจปัจจุบัน วางแผนอนาคต',
                        'sbo-10': 'เกาให้ถูกที่คัน',
                        'sbo-11': 'ผลลัพธ์มีคุณค่า',
                        'sbo-12': 'ร่วมแรงร่วมใจพัฒนา',
                      };

                      const labelText = shortNames[dim.id] || dim.label;

                      return (
                        <g
                          key={dim.id}
                          className="cursor-pointer group"
                          onClick={() => setSelectedSboId(dim.id)}
                        >
                          <text
                            x={ptOuter.x}
                            y={ptOuter.y}
                            textAnchor={textAnchor}
                            dominantBaseline={dominantBaseline}
                            className={`transition-all select-none ${
                              isSelected
                                ? 'fill-amber-600 font-black'
                                : 'fill-slate-700 hover:fill-amber-600 font-bold'
                            }`}
                            style={{ fontSize: '9px', fontFamily: "'Noto Sans Thai', sans-serif" }}
                          >
                            <tspan className="font-mono font-black fill-slate-900">{dim.code} </tspan>
                            <tspan>{labelText}</tspan>
                            <tspan className="font-mono font-black fill-amber-500"> {dim.score}%</tspan>
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Interactive Selected SBO Dimension Card */}
                  {activeSboItem && (
                    <div
                      onClick={() => {
                        // Cycle to next SBO on click
                        const curIdx = sbo12Data.findIndex((s) => s.id === activeSboItem.id);
                        const nextDim = sbo12Data[(curIdx + 1) % sbo12Data.length];
                        setSelectedSboId(nextDim.id);
                      }}
                      className="w-full mt-2 p-2.5 bg-gradient-to-r from-amber-50 to-yellow-50/80 border border-amber-200/90 rounded-2xl cursor-pointer hover:border-amber-400 transition-all text-left shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono font-black text-[10px]">
                            {activeSboItem.code}
                          </span>
                          <span className="font-black text-slate-900">
                            {activeSboItem.label}
                          </span>
                        </div>
                        <span className="font-black text-amber-600 text-xs font-mono">
                          {activeSboItem.score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        {activeSboItem.description}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400">
                        <span>คลิกเพื่อดูมิติถัดไป ({activeSboItem.number}/12)</span>
                        <span className="font-mono text-amber-700 font-semibold">{activeSboItem.nameEn}</span>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* 12 SBO Dimensions breakdown list view */
                <div className="my-2 space-y-2 py-1 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                  {sbo12Data.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedSboId(s.id);
                        setRadarMode('12_sbo');
                      }}
                      className="p-2 rounded-xl hover:bg-amber-50/60 transition-colors cursor-pointer border border-transparent hover:border-amber-200"
                    >
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                            {s.code}
                          </span>
                          {s.label}
                        </span>
                        <span className="font-bold text-slate-900 font-mono">{s.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{s.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom-Left Moon Crater Image as in design */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                <div className="w-20 sm:w-24 h-auto -ml-2 -mb-2">
                  <img
                    src="https://s.imgz.io/2026/10/16/1e129779877043ea084dd882830abde125c54dcd126ffa80.png"
                    alt="Moon Crater"
                    className="w-full h-auto object-contain select-none opacity-90"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.indexOf('stargazer_crater') === -1) {
                        target.src = '/stargazer_crater.png';
                      }
                    }}
                  />
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Student Base Outcome
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    12 มิติครบถ้วน
                  </span>
                </div>
              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* Card 2 (Center): ตัวตนหลักของคุณ (YOUR CORE TYPE)              */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4">
              
              {/* Card Header */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    ตัวตนหลักของคุณ
                  </h3>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold block">
                    YOUR CORE TYPE
                  </span>
                </div>
              </div>

              {/* Top Row: 2 Split Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 1. Yellow Note Card: The Core Theoretician */}
                <div className="bg-[#FFF9D6] rounded-2xl p-3.5 border border-[#FDE047]/80 shadow-2xs relative flex flex-col justify-between">
                  <div>
                    <h4 className="font-['Patrick_Hand',cursive] font-patrick text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-none mb-1">
                      The
                      <br />
                      Core Theoretician
                    </h4>
                  </div>

                  <div className="my-2 flex items-center justify-center">
                    {/* Hand-drawn sketch style planet */}
                    <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="14" fill="#000" />
                      <circle cx="30" cy="30" r="13" fill="#E2E8F0" />
                      <circle cx="28" cy="28" r="3" fill="#64748B" />
                      <circle cx="34" cy="34" r="2" fill="#64748B" />
                      <ellipse cx="32" cy="32" rx="26" ry="7" stroke="#000" strokeWidth="2.5" />
                    </svg>
                  </div>

                  <p className="text-[10px] text-slate-700 leading-tight font-medium">
                    นักคิดวงโคจรลึก คุ้นเคยและมีเหตุผล และเชื่อมโยงความเป็นไปได้ของจักรวาล
                  </p>
                </div>

                {/* 2. Analytic Power Stat Card */}
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="text-slate-900 font-bold text-xs">†</span>
                    <div>
                      <span className="text-[11px] font-bold block leading-tight text-slate-900">
                        ระดับพลังการวิเคราะห์
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 font-bold block">
                        ANALYTIC POWER
                      </span>
                    </div>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight block">
                      93%
                    </span>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1 overflow-hidden">
                      <div className="bg-[#FFC800] h-2.5 rounded-full w-[93%]" />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-tight">
                    พร้อมค้นหา เชื่อมโยงข้อมูล และตัดสินใจบนหลักฐานอย่างแม่นยำ
                  </p>
                </div>

              </div>

              {/* Quote Block (No "คำคม" in title as requested) */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-center shadow-xs">
                <span className="text-xs sm:text-sm font-bold tracking-wide italic block text-amber-300">
                  "มองเห็นความเป็นไปได้นับล้านในความว่างเปล่า"
                </span>
              </div>

              {/* Bottom: Signature Item (Cosmic Telescope) */}
              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-900">
                  <Settings className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-xs font-black">สัญลักษณ์ประจำตัว</span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold ml-1">
                    SIGNATURE ITEM
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center">
                  {/* Golden Telescope Drawing */}
                  <div className="col-span-5 flex items-center justify-center">
                    <svg className="w-20 h-16" viewBox="0 0 100 80" fill="none">
                      {/* Tripod legs */}
                      <line x1="50" y1="45" x2="25" y2="78" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      <line x1="50" y1="45" x2="50" y2="78" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      <line x1="50" y1="45" x2="75" y2="78" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                      {/* Tripod mount */}
                      <circle cx="50" cy="45" r="4" fill="#000" />
                      {/* Telescope body angled */}
                      <g transform="rotate(-30 50 40)">
                        <rect x="20" y="32" width="55" height="14" rx="2" fill="#F59E0B" stroke="#000" strokeWidth="2.5" />
                        <rect x="75" y="30" width="10" height="18" rx="2" fill="#000" />
                        <rect x="10" y="35" width="10" height="8" rx="1" fill="#000" />
                        <circle cx="85" cy="39" r="4" fill="#38BDF8" opacity="0.8" />
                      </g>
                    </svg>
                  </div>

                  <div className="col-span-7 space-y-1">
                    <h5 className="font-['Patrick_Hand',cursive] font-patrick text-xl font-bold text-slate-900 leading-none">
                      Cosmic Telescope
                    </h5>
                    <p className="text-[10px] text-slate-600 leading-snug">
                      มองทะลุความวุ่นวาย เห็นโครงสร้างที่ซ่อนอยู่ และค้นหาทิศทางใหม่ ในความไม่แน่นอน
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* Card 3 (Right): ลักษณะเด่นของคุณ (CHARACTER TRAITS)            */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
              
              {/* Card Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <ListFilter className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    ลักษณะเด่นของคุณ
                  </h3>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold block">
                    CHARACTER TRAITS
                  </span>
                </div>
              </div>

              {/* 6 Traits with yellow rounded icon pills */}
              <div className="space-y-3 flex-1 flex flex-col justify-around">
                {characterTraits.map((trait, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/70 hover:bg-[#FFFDE6] border border-slate-100 hover:border-amber-200 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFE566] flex items-center justify-center shrink-0 shadow-2xs">
                      {trait.icon}
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-tight">
                      {trait.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 text-center">
                <span className="text-[11px] text-slate-400 font-mono">
                  Core Attributes · The Star Gazers
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: พลังและคุณสมบัติประจำตัวในยานอวกาศ (SPACE CREW ABILITIES)     */}
        {/* 5 Column Cards matching prompt specifications                              */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          
          {/* Section Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="6" />
                <path d="M4 12c0-3 4-5 8-5s8 2 8 5-4 5-8 5-8-2-8-5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                พลังและคุณสมบัติประจำตัวในยานอวกาศ
              </h3>
              <span className="text-[11px] font-mono tracking-wider text-slate-400 font-bold block">
                SPACE CREW ABILITIES
              </span>
            </div>
          </div>

          {/* 5 Ability Cards across 5 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3.5 items-stretch">
            {spaceCrewAbilities.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 hover:bg-[#FFFDF5] rounded-2xl p-4 border border-slate-200/90 hover:border-amber-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 group"
              >
                <div>
                  {/* Top Number & Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {item.num}
                    </span>
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {item.iconSvg}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block mb-2 leading-tight">
                    ({item.titleEn})
                  </span>

                  {/* Verbatim Description */}
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Slot #{item.num}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: เพื่อนร่วมทาง (BESTIES & WORKS WELL) & READY FOR NEXT CTA       */}
        {/* Matching image 4 (Full Design View)                                       */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: เพื่อนร่วมทางที่เข้ากันได้ดี (BESTIES) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-slate-900 fill-slate-900" />
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    เพื่อนร่วมทางที่เข้ากันได้ดี
                  </h4>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold block">
                    BESTIES
                  </span>
                </div>
              </div>

              {/* 3 Besties Characters */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {bestiesList.map((b, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-2">
                    <div className="w-20 h-20 rounded-full bg-[#FFFBE6] flex items-center justify-center p-1 border border-amber-200/80 shadow-2xs">
                      {b.characterSvg}
                    </div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {b.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight block">
                      {b.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: แตกต่างกัน แต่ร่วมทางกันได้ดี (WORKS WELL TOGETHER) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-slate-900" />
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    แตกต่างกัน แต่ร่วมทางกันได้ดี
                  </h4>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold block">
                    WORKS WELL TOGETHER
                  </span>
                </div>
              </div>

              {/* 3 Works Well Characters */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {worksWellList.map((w, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-2">
                    <div className="w-20 h-20 rounded-full bg-[#FFFBE6] flex items-center justify-center p-1 border border-amber-200/80 shadow-2xs">
                      {w.characterSvg}
                    </div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {w.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight block">
                      {w.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Banner: READY FOR WHAT'S NEXT? */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#FFFDF5] via-[#FFF9DB] to-[#FFF3C4] border-2 border-amber-300/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            {/* Ambient moon illustration on right corner */}
            <div className="absolute right-0 bottom-0 w-48 h-48 opacity-15 pointer-events-none translate-x-10 translate-y-10">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" fill="#000" />
                <circle cx="35" cy="40" r="12" fill="#fff" opacity="0.2" />
                <circle cx="65" cy="55" r="8" fill="#fff" opacity="0.2" />
              </svg>
            </div>

            <div className="space-y-1 relative z-10">
              <h4 className="font-['Patrick_Hand',cursive] font-patrick text-2xl sm:text-3xl font-black text-slate-950 tracking-wide uppercase italic">
                READY FOR WHAT'S NEXT?
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xl">
                ค้นหาหลักสูตรที่เหมาะกับตัวตนของคุณ และต่อยอดศักยภาพของนักคิดวงโคจรลึกให้ไกลกว่าเดิม
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                onClick={() => {
                  if (onSelectCourse) {
                    onSelectCourse({} as any);
                  } else {
                    const el = document.getElementById('course-library');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-7 py-3 rounded-full bg-[#FFC800] hover:bg-black hover:text-white active:bg-black active:text-white text-slate-950 font-black text-sm transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer border-0"
              >
                <span>สำรวจหลักสูตรของเรา</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};

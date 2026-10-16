import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  Download, 
  Printer, 
  Share2, 
  Compass, 
  Award,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Brain,
  Search,
  Heart,
  Users,
  Target,
  Zap,
  Info,
  Star,
  FileText,
  BarChart2,
  Clock,
  Play,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ASSESSMENT_QUESTIONS, 
  DIMENSIONS, 
  SBO_PILLARS,
  SBO_SKILLS,
  LIKERT_SCALE, 
  calculateItemScore, 
  evaluateAssessment, 
  calculateSboProfile,
  AssessmentResult,
  SboAssessmentResult,
  AssessmentQuestion,
  DimensionInfo,
  LikertOption
} from '../data/assessmentQuestions';
import { calculateCosmicEvaluation } from '../data/cosmicArchetypes';
import { StarLikertButton } from './StarLikertButton';
import { ResultsSummary } from './ResultsSummary';
import { INITIAL_COURSES } from '../data/mockData';
import { Course } from '../types';

interface LifePathAssessmentProps {
  onSelectCourse?: (course: Course) => void;
}

export const LifePathAssessment: React.FC<LifePathAssessmentProps> = ({
  onSelectCourse
}) => {
  // Answers state: questionId -> rawRating (1..7)
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('udru_assessment_answers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Current active mode: 'test' (hero and questions on same page) | 'result'
  const [viewState, setViewState] = useState<'test' | 'result'>('test');
  // Saved assessment result
  const [result, setResult] = useState<AssessmentResult | null>(() => {
    try {
      const saved = localStorage.getItem('udru_assessment_latest_result');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Presentation mode: 'step' (section by section: 10 per page) | 'all' (all 60 in single list)
  const [displayMode, setDisplayMode] = useState<'step' | 'all'>('step');
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [filterUnansweredOnly, setFilterUnansweredOnly] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pillarKeys = Object.keys(SBO_PILLARS);
  const currentPillarId = pillarKeys[currentSectionIndex] || pillarKeys[0];
  const currentPillar = SBO_PILLARS[currentPillarId];

  // Auto-save answers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('udru_assessment_answers', JSON.stringify(answers));
    } catch {}
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = ASSESSMENT_QUESTIONS.length; // 60
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Compute dominant cosmic archetype for results header and view
  const cosmicEval = React.useMemo(() => {
    return calculateCosmicEvaluation(answers);
  }, [answers]);
  const dominantArchetype = cosmicEval.dominantArchetype;

  // Group questions by pillar
  const questionsByPillar = pillarKeys.map((pId) => ({
    pillar: SBO_PILLARS[pId],
    questions: ASSESSMENT_QUESTIONS.filter((q) => q.pillarId === pId)
  }));

  const currentSectionQuestions = ASSESSMENT_QUESTIONS.filter(
    (q) => q.pillarId === currentPillarId
  );

  const displayQuestions = (displayMode === 'step' ? currentSectionQuestions : ASSESSMENT_QUESTIONS)
    .filter((q) => {
      if (filterUnansweredOnly) {
        return answers[q.id] === undefined;
      }
      return true;
    });

  const handleSelectRating = (questionId: number, rating: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: rating
    }));

    // If autoAdvance is enabled and viewing step mode, check if we should gently scroll or move
    if (autoAdvance) {
      const currentIndexInView = displayQuestions.findIndex((q) => q.id === questionId);
      if (currentIndexInView >= 0 && currentIndexInView < displayQuestions.length - 1) {
        const nextQ = displayQuestions[currentIndexInView + 1];
        const nextElem = document.getElementById(`q-card-${nextQ.id}`);
        if (nextElem) {
          nextElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const handleClearAnswers = () => {
    if (window.confirm('คุณต้องการรีเซ็ตคำตอบทั้งหมด 60 ข้อเพื่อเริ่มต้นใหม่หรือไม่?')) {
      setAnswers({});
      setResult(null);
      localStorage.removeItem('udru_assessment_answers');
      localStorage.removeItem('udru_assessment_latest_result');
      setToastMessage('รีเซ็ตคำตอบเรียบร้อยแล้ว');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleFillDemo = () => {
    // Helpful demo helper for instant inspection of full results
    const sample: Record<number, number> = {};
    ASSESSMENT_QUESTIONS.forEach((q) => {
      // realistic varied distribution around 5-7 for standard, 1-3 for reverse
      if (q.isReverse) {
        sample[q.id] = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
      } else {
        sample[q.id] = Math.floor(Math.random() * 3) + 5; // 5, 6, 7
      }
    });
    setAnswers(sample);
    setToastMessage('กรอกตัวอย่างเพื่อทดสอบครบ 60 ข้อแล้ว');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      const remaining = totalQuestions - answeredCount;
      if (!window.confirm(`คุณยังตอบไม่ครบอีก ${remaining} ข้อ ต้องการประมวลผลคะแนนเลยหรือไม่? (ข้อที่ยังไม่ตอบจะถูกคิดค่าเป็นระดับปานกลาง)`)) {
        setFilterUnansweredOnly(true);
        return;
      }
    }

    const evalResult = evaluateAssessment(answers);
    setResult(evalResult);
    setViewState('result');
    try {
      localStorage.setItem('udru_assessment_latest_result', JSON.stringify(evalResult));
    } catch {}

    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}
  };

  const handlePrint = () => {
    window.print();
  };

  const getDimensionIcon = (dimId: string) => {
    switch (dimId) {
      case 'critical-thinking':
        return <Search className="w-5 h-5 text-blue-600" />;
      case 'growth-mindset':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'empathy-communication':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'teamwork-collaboration':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'self-management':
        return <Target className="w-5 h-5 text-emerald-500" />;
      case 'agility-resilience':
        return <Zap className="w-5 h-5 text-purple-500" />;
      default:
        return <Brain className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Mitr',sans-serif] text-slate-800 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HERO SECTION: Redesigned matching reference with full-height large image   */}
      {/* ========================================================================= */}
      {viewState !== 'result' && (
        <>
          <section
            className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-8 pb-10 sm:pt-10 sm:pb-12 lg:py-16 min-h-[560px] lg:min-h-[640px] flex items-center"
            style={{
              backgroundImage: `url('/lifepath_hero_bg.png')`,
              backgroundPosition: 'right bottom',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          >
            {/* Background Illustration covering section */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
              <img
                src="https://s.imgz.io/2026/10/16/-41c72bdcf36a7055b.png"
                alt="Life Path Background"
                className="w-full h-full object-cover object-right md:object-right-bottom select-none"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.indexOf('lifepath_hero_bg') === -1) {
                    target.src = '/lifepath_hero_bg.png';
                  }
                }}
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[480px] lg:min-h-[540px]">
                
                {/* Left Column: Title, Subtitle, Stats, Description, Highlights */}
                <div className="lg:col-span-7 xl:col-span-7 text-left space-y-5 sm:space-y-6 bg-white/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-4 sm:p-0 rounded-3xl">
                  
                  {/* Top Badge with Yellow Brush Rays: \ แบบทดสอบออกแบบชีวิต / */}
                  <div className="inline-flex items-center gap-2 select-none">
                    {/* Left Hand-drawn Rays */}
                    <svg
                      className="w-5 h-4 sm:w-6 sm:h-5 text-[#FFC800] shrink-0"
                      viewBox="0 0 24 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 15L1 9M11 14L7 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>

                    <span className="text-sm sm:text-base font-black text-slate-900 tracking-wide font-['Mitr',sans-serif]">
                      แบบทดสอบออกแบบชีวิต
                    </span>

                    {/* Right Hand-drawn Rays */}
                    <svg
                      className="w-5 h-4 sm:w-6 sm:h-5 text-[#FFC800] shrink-0"
                      viewBox="0 0 24 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 15L23 9M13 14L17 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Main Heading: ประเมิน / ออกแบบเส้นทางชีวิต */}
                  <div>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.12]">
                      <span className="block font-black text-slate-950 font-['Noto_Sans_Thai',sans-serif]">
                        ประเมิน <span className="text-[#F59E0B] font-bold">/</span>
                      </span>
                      <span className="relative inline-block font-black text-slate-950 font-['Noto_Sans_Thai',sans-serif]">
                        ออกแบบ
                        <span className="text-[#F59E0B] relative inline-block ml-1.5 sm:ml-2">
                          เส้นทางชีวิต
                          {/* 3 Radiating Yellow Rays above 'เส้นทางชีวิต' */}
                          <svg
                            className="absolute -top-4 sm:-top-6 -right-2 sm:-right-4 w-10 sm:w-14 h-7 sm:h-9 text-[#FFC800] overflow-visible pointer-events-none"
                            viewBox="0 0 54 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8 28L3 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            <path d="M26 24L28 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            <path d="M44 26L52 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                        </span>
                      </span>
                    </h1>
                  </div>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-slate-700 leading-snug">
                    ค้นพบตัวตน สไตล์การใช้ชีวิต และศักยภาพที่ซ่อนอยู่ในตัวคุณ
                  </p>

                  {/* 3 Quick Stat Cards in Row */}
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-lg">
                    {/* Card 1: 60 ข้อ */}
                    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs flex items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFF9D6] border border-[#FDE047]/60 flex items-center justify-center shrink-0 text-slate-900 shadow-2xs">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium block truncate">
                          จำนวนข้อ
                        </span>
                        <span className="text-sm sm:text-base font-black text-slate-900 block truncate">
                          60 ข้อ
                        </span>
                      </div>
                    </div>

                    {/* Card 2: 1 - 7 */}
                    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs flex items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFF9D6] border border-[#FDE047]/60 flex items-center justify-center shrink-0 text-slate-900 shadow-2xs">
                        <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium block truncate">
                          ระดับประเมิน
                        </span>
                        <span className="text-sm sm:text-base font-black text-slate-900 block truncate">
                          1 - 7
                        </span>
                      </div>
                    </div>

                    {/* Card 3: 10 - 15 นาที */}
                    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-2xs flex items-center gap-2.5 sm:gap-3 transition-transform hover:-translate-y-0.5">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFF9D6] border border-[#FDE047]/60 flex items-center justify-center shrink-0 text-slate-900 shadow-2xs">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium block truncate">
                          ใช้เวลาประมาณ
                        </span>
                        <span className="text-sm sm:text-base font-black text-slate-900 block truncate">
                          10 - 15 นาที
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description Paragraph */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl text-justify sm:text-left">
                    แบบประเมินตนเองที่จะชวนคุณมองลึกเข้าไปในความคิด ความรู้สึก และพฤติกรรม เพื่อเข้าใจจุดแข็งของคุณ ค้นหาศักยภาพที่ซ่อนอยู่ และเห็นภาพเส้นทางชีวิตที่ใช่ในแบบของคุณ
                  </p>

                  {/* Bottom 3 Highlights / Value Props */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 max-w-xl">
                    {/* Highlight 1: สะท้อนตัวตน */}
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">สะท้อนตัวตน</h4>
                        <p className="text-[11px] text-slate-500 font-medium">มองเห็นสิ่งที่เป็นคุณ</p>
                      </div>
                    </div>

                    {/* Highlight 2: เข้าใจตัวเองมากขึ้น */}
                    <div className="flex items-start gap-2.5">
                      <Heart className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">เข้าใจตัวเองมากขึ้น</h4>
                        <p className="text-[11px] text-slate-500 font-medium">ทั้งจุดแข็งและสิ่งที่อยากพัฒนา</p>
                      </div>
                    </div>

                    {/* Highlight 3: ต่อยอดเส้นทางชีวิต */}
                    <div className="flex items-start gap-2.5">
                      <TrendingUp className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">ต่อยอดเส้นทางชีวิต</h4>
                        <p className="text-[11px] text-slate-500 font-medium">วางแผนอนาคตได้อย่างมั่นใจ</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Transparent viewport for background artwork */}
                <div className="hidden lg:block lg:col-span-5 xl:col-span-5 h-full pointer-events-none select-none" />

              </div>
            </div>
          </section>

          {/* Sticky/Smooth Progress & Instructions Bar right under Hero */}
          <section className="bg-slate-50/80 border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>เริ่มทำแบบประเมินตนเอง 60 ข้อ</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold font-mono">
                    มาตรวัด 1 - 7 รูปดาว
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  เลือกคำตอบที่ตรงกับตัวคุณมากที่สุด โดย 1 = ไม่เห็นด้วยมาก และ 7 = เห็นด้วยมาก
                </p>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    ความคืบหน้า ({answeredCount}/60 ข้อ)
                  </span>
                  <span className="text-sm font-black text-amber-600 font-mono">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-28 sm:w-36 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW: RESULT SCREEN                                                       */}
      {/* ========================================================================= */}
      {viewState === 'result' ? (
        <main className="w-full animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <button
              onClick={() => {
                setViewState('test');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับหน้าหลักแบบทดสอบ</span>
            </button>
          </div>
          <ResultsSummary
            answers={answers}
            userName="ผู้เข้ารับการประเมิน"
            onRetake={() => {
              setViewState('test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCourse={onSelectCourse}
          />
        </main>
      ) : viewState === 'test' ? (
        /* VIEW: TEST QUESTIONS INTERACTION */
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          {/* Likert Scale Explanation Banner */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-slate-100/60 via-amber-50/30 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Star className="w-5 h-5 fill-white stroke-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      เกณฑ์การให้คะแนนแบบลิเคิร์ทสเกล 7 ระดับรูปดาว (Star Likert Scale 1 - 7)
                    </h3>
                    <p className="text-xs text-slate-600">
                      ปุ่มรูปดาวสีดำทรงกลมอ้วน น่ารักสะอาดตา มีเพียงหมายเลข 1 ถึง 7 โดยด้านซ้ายคือ <strong>"ไม่เห็นด้วยมาก"</strong> และด้านขวาคือ <strong>"เห็นด้วยมาก"</strong>
                    </p>
                  </div>
                </div>

                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/60">
                  คลิกที่ดาวเพื่อเลือกคำตอบ
                </span>
              </div>

              {/* 7-Star Showcase Preview Row: Left Label - 7 Stars - Right Label */}
              <div className="pt-2">
                <div className="hidden sm:flex items-center justify-between gap-4 md:gap-6 max-w-3xl mx-auto py-2">
                  <div className="text-left shrink-0 w-28 md:w-32">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block">
                      ไม่เห็นด้วยมาก
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      (ระดับ 1)
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 md:gap-3 flex-1 items-center justify-items-center">
                    {LIKERT_SCALE.map((opt) => (
                      <StarLikertButton
                        key={opt.value}
                        questionId="legend"
                        option={opt}
                        isSelected={opt.value === 4}
                        interactive={false}
                        size="md"
                      />
                    ))}
                  </div>

                  <div className="text-right shrink-0 w-28 md:w-32">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block">
                      เห็นด้วยมาก
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      (ระดับ 7)
                    </span>
                  </div>
                </div>

                {/* Mobile Preview (< sm) */}
                <div className="sm:hidden space-y-2 py-2">
                  <div className="grid grid-cols-7 gap-1 items-center justify-items-center">
                    {LIKERT_SCALE.map((opt) => (
                      <StarLikertButton
                        key={opt.value}
                        questionId="legend"
                        option={opt}
                        isSelected={opt.value === 4}
                        interactive={false}
                        size="sm"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 px-1 pt-1">
                    <span>ไม่เห็นด้วยมาก</span>
                    <span>เห็นด้วยมาก</span>
                  </div>
                </div>

                <p className="text-center text-[11px] text-slate-400 mt-1">
                  *ดาวที่เลือกจะเปลี่ยนเป็นสีดำทึบ พร้อมตัวเลขสีขาวเด่นชัด
                </p>
              </div>

              {/* Reverse Scoring Note */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/80 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-black text-xs mt-0.5">
                  -
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-amber-900">
                    การประมวลผลคะแนนย้อนกลับอัตโนมัติ (Reverse Scoring Logic)
                  </p>
                  <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
                    ข้อคำถามที่มีสัญลักษณ์ <span className="font-bold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded">(-)</span> เช่น คำถามที่สะท้อนการด่วนตัดสินใจหรืออคติทางความคิด ระบบจะคำนวณคะแนนย้อนกลับอัตโนมัติตามหลักจิตวิทยา (เลือก 7 ดาว คิดเป็น 1 คะแนน, เลือก 1 ดาว คิดเป็น 7 คะแนน) คุณสามารถตอบตามความรู้สึกจริงได้โดยตรง
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Progress & Controls Bar */}
          <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Progress Count */}
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800">
                    ความคืบหน้า: ตอบแล้ว {answeredCount} จาก {totalQuestions} ข้อ
                  </span>
                  <span className="font-extrabold text-amber-600">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* View Filters & Controls */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setDisplayMode('step')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      displayMode === 'step'
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ทีละส่วน (15 ข้อ)
                  </button>
                  <button
                    onClick={() => setDisplayMode('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      displayMode === 'all'
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ดูทั้งหมด 60 ข้อ
                  </button>
                </div>

                <button
                  onClick={() => setFilterUnansweredOnly(!filterUnansweredOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-0 ${
                    filterUnansweredOnly
                      ? 'bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>เฉพาะที่ยังไม่ตอบ ({totalQuestions - answeredCount})</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-0 ${
                    answeredCount >= totalQuestions
                      ? 'bg-[#000000] text-[#FFC800] hover:bg-slate-900 shadow-md ring-2 ring-[#FFC800]'
                      : 'bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span>ประมวลผลคะแนน</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step Navigation (when in 'step' mode) */}
            {displayMode === 'step' && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
                <div className="flex items-center gap-1.5">
                  {pillarKeys.map((pKey, idx) => {
                    const pQuestions = ASSESSMENT_QUESTIONS.filter((q) => q.pillarId === pKey);
                    const pAnswered = pQuestions.filter((q) => answers[q.id] !== undefined).length;
                    const isActive = idx === currentSectionIndex;

                    return (
                      <button
                        key={pKey}
                        onClick={() => setCurrentSectionIndex(idx)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                        }`}
                      >
                        <span>ส่วนที่ {idx + 1}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          pAnswered === pQuestions.length
                            ? 'bg-emerald-500 text-white'
                            : isActive
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {pAnswered}/{pQuestions.length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                    disabled={currentSectionIndex === 0}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="ส่วนก่อนหน้า"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSectionIndex(Math.min(pillarKeys.length - 1, currentSectionIndex + 1))}
                    disabled={currentSectionIndex === pillarKeys.length - 1}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="ส่วนถัดไป"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {displayQuestions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">คุณตอบครบทุกข้อในส่วนนี้แล้ว!</h3>
                <p className="text-xs text-slate-500 mt-1">สามารถกด "ประมวลผลคะแนน" ด้านบนเพื่อดูผลวิเคราะห์ได้ทันที</p>
                <button
                  onClick={handleSubmit}
                  className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold text-[#000000] bg-[#FFC800] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 transition-colors shadow-xs"
                >
                  ดูรายงานผลการประเมิน
                </button>
              </div>
            ) : (
              displayQuestions.map((question) => {
                const currentRating = answers[question.id];
                const isAnswered = currentRating !== undefined;

                return (
                  <div
                    key={question.id}
                    id={`q-card-${question.id}`}
                    className={`bg-white rounded-3xl p-5 sm:p-7 border transition-all duration-300 relative overflow-hidden ${
                      isAnswered
                        ? 'border-slate-200/90 shadow-xs hover:shadow-md'
                        : 'border-amber-400/90 bg-gradient-to-b from-amber-50/30 via-white to-white shadow-sm ring-1 ring-amber-400/30'
                    }`}
                  >
                    {/* Top Ambient Highlight for unanswered */}
                    {!isAnswered && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
                    )}

                    {/* Question Header: Number + Question Text together at top */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
                      <div className="flex items-start gap-3 flex-1">
                        <span className={`w-8 h-8 rounded-2xl text-xs font-black flex items-center justify-center shrink-0 shadow-xs transition-colors mt-0.5 ${
                          isAnswered
                            ? 'bg-slate-900 text-white'
                            : 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                        }`}>
                          {question.id}
                        </span>
                        
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                          {question.cleanText}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pl-11 sm:pl-0">
                        {isAnswered ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900 text-white shadow-2xs flex items-center gap-1.5 animate-in fade-in">
                            <Star className="w-3 h-3 fill-white stroke-white" />
                            <span>ตอบแล้ว: ระดับ {currentRating}</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100/70 text-amber-800 text-[10px] sm:text-[11px] font-semibold">
                            รอคำตอบ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Likert 7-Star Scale Selector with Left: ไม่เห็นด้วยมาก & Right: เห็นด้วยมาก */}
                    <div className="space-y-3">
                      {/* Desktop / Tablet Row: Left Label - 7 Stars - Right Label */}
                      <div className="hidden sm:flex items-center justify-between gap-4 md:gap-6 max-w-3xl mx-auto py-1">
                        <div className="text-left shrink-0 w-28 md:w-32">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block">
                            ไม่เห็นด้วยมาก
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            (ระดับ 1)
                          </span>
                        </div>

                        <div className="grid grid-cols-7 gap-2 md:gap-3 flex-1 items-center justify-items-center">
                          {LIKERT_SCALE.map((opt) => {
                            const isSelected = currentRating === opt.value;
                            return (
                              <StarLikertButton
                                key={opt.value}
                                questionId={question.id}
                                option={opt}
                                isSelected={isSelected}
                                onSelect={(val) => handleSelectRating(question.id, val)}
                                size="md"
                              />
                            );
                          })}
                        </div>

                        <div className="text-right shrink-0 w-28 md:w-32">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block">
                            เห็นด้วยมาก
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            (ระดับ 7)
                          </span>
                        </div>
                      </div>

                      {/* Mobile Row (< sm): 7 Stars on Top, Left & Right Labels Below */}
                      <div className="sm:hidden space-y-2 py-1">
                        <div className="grid grid-cols-7 gap-1 items-center justify-items-center">
                          {LIKERT_SCALE.map((opt) => {
                            const isSelected = currentRating === opt.value;
                            return (
                              <StarLikertButton
                                key={opt.value}
                                questionId={question.id}
                                option={opt}
                                isSelected={isSelected}
                                onSelect={(val) => handleSelectRating(question.id, val)}
                                size="sm"
                              />
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 px-1 pt-1">
                          <span>ไม่เห็นด้วยมาก</span>
                          <span>เห็นด้วยมาก</span>
                        </div>
                      </div>

                      {/* Active Response Confirmation Pill */}
                      {isAnswered && (
                        <div className="max-w-3xl mx-auto pt-2">
                          {(() => {
                            const opt = LIKERT_SCALE.find((o) => o.value === currentRating);
                            return (
                              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 animate-in fade-in duration-200">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-black inline-block" />
                                  <span>
                                    เลือกระดับ: <strong className="text-black font-black">{currentRating}</strong> {opt?.label && `(${opt.label})`}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  บันทึกคำตอบแล้ว
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Navigation & Submission Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {displayMode === 'step' && (
                <>
                  <button
                    onClick={() => {
                      setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1));
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    disabled={currentSectionIndex === 0}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>ตอนก่อนหน้า</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentSectionIndex(Math.min(pillarKeys.length - 1, currentSectionIndex + 1));
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    disabled={currentSectionIndex === pillarKeys.length - 1}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>ตอนถัดไป</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={handleClearAnswers}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="ล้างคำตอบทั้งหมด"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตคำตอบ</span>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Dev/Demo quick fill helper */}
              <button
                onClick={handleFillDemo}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="ทดลองกรอกคำตอบตัวอย่างทั้ง 60 ข้อทันที"
              >
                ทดลองสุ่มตอบ 60 ข้อ
              </button>

              <button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-0 ${
                  answeredCount >= totalQuestions
                    ? 'bg-[#000000] text-[#FFC800] hover:bg-slate-900 ring-2 ring-[#FFC800] shadow-[0_4px_16px_rgba(0,0,0,0.35)] scale-105'
                    : 'bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white shadow-[0_2px_10px_rgba(255,200,0,0.4)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Check className="w-4 h-4" />
                <span>ประมวลผลคะแนน ({answeredCount}/60 ข้อ)</span>
              </button>
            </div>
          </div>
        </main>
      ) : null}
    </div>
  );
};

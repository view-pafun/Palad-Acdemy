import React, { useState, useEffect } from 'react';
import { Maximize2, X, ArrowRight, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import HoverRevealCards, { CardItem } from '@/components/ui/cards';

interface LearningPathwaysProps {
  onStartLifePath?: () => void;
  onExploreCourses?: () => void;
}

interface FlashcardItem {
  id: number;
  numberText: string;
  title: string;
  englishTitle: string;
  image: string;
  shortDesc: string;
  description: string;
  themeColor: string;
  themeBg: string;
  badgeBg: string;
  borderColor: string;
  btnBg: string;
  glowColor: string;
  strengths: string[];
  motto: string;
}

export const LearningPathways: React.FC<LearningPathwaysProps> = ({
  onStartLifePath,
  onExploreCourses,
}) => {
  // Fullscreen expanded modal state
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  // View mode: 'hover' (HoverRevealCards from shadcn) or 'slide' (slide-up drawer)
  const [viewMode, setViewMode] = useState<'hover' | 'slide'>('hover');
  // Track which card has its text panel slid up ("เมื่อกดปุ่ม แล้วข้อความจึงเลื่อนขึ้นมา")
  const [slidUpCardId, setSlidUpCardId] = useState<number | null>(null);

  const toggleSlideUp = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlidUpCardId((prev) => (prev === id ? null : id));
  };

  const cards: FlashcardItem[] = [
    {
      id: 1,
      numberText: 'คุณลักษณะที่ ๑',
      title: 'นักคิดวงโคจรลึก',
      englishTitle: 'The Deep Orbit Thinker',
      image: 'https://i.postimg.cc/ydKhknmL/xele-ynn-xy-bn-dwng-c-nthr-s-hel-xng.png',
      shortDesc: 'ผู้ที่สามารถแยกแยะข้อเท็จจริงจากอารมณ์และความรู้สึก มีทักษะในการตัดสินใจโดยอาศัยข้อเท็จจริง',
      description: 'ผู้ที่สามารถแยกแยะข้อเท็จจริงจากอารมณ์และความรู้สึก มีทักษะในการตัดสินใจโดยอาศัยข้อเท็จจริง ใช้การวิเคราะห์เชิงเหตุผลและหลักฐาน พร้อมทั้งมีความคิดเชิงสร้างสรรค์ในการแก้ปัญหาและพัฒนาความคิดใหม่ ๆ',
      themeColor: '#2563EB',
      themeBg: 'bg-gradient-to-b from-blue-50 via-blue-100/60 to-indigo-100/80',
      badgeBg: 'bg-blue-600 text-white',
      borderColor: 'border-blue-200/90 hover:border-blue-500',
      btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      glowColor: 'bg-blue-400/25',
      strengths: ['การคิดวิเคราะห์เชิงตรรกะ', 'การตัดสินใจจากข้อมูลจริง', 'การแก้ปัญหาเชิงสร้างสรรค์'],
      motto: 'มองทะลุอคติ ตัดสินด้วยข้อเท็จจริงและเหตุผล'
    },
    {
      id: 2,
      numberText: 'คุณลักษณะที่ ๒',
      title: 'นักเชื่อมโยงดาวเคราะห์',
      englishTitle: 'The Planetary Connector',
      image: 'https://s.imgz.io/2026/10/14/-Riri02b8d1b6394c178a.png',
      shortDesc: 'ผู้ที่มีทักษะในการยอมรับและเคารพวัฒนธรรมและวิถีชีวิตของคนอื่น',
      description: 'ผู้ที่มีทักษะในการยอมรับและเคารพวัฒนธรรมและวิถีชีวิตของคนอื่น สามารถทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพ โดยสามารถหาจุดร่วมเพื่อสร้างความร่วมมือและบรรลุผลสำเร็จในโครงการหรือเป้าหมายได้',
      themeColor: '#059669',
      themeBg: 'bg-gradient-to-b from-emerald-50 via-emerald-100/60 to-teal-100/80',
      badgeBg: 'bg-emerald-600 text-white',
      borderColor: 'border-emerald-200/90 hover:border-emerald-500',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      glowColor: 'bg-emerald-400/25',
      strengths: ['การยอมรับความแตกต่าง', 'การทำงานร่วมกับผู้อื่น', 'การประสานพลังเพื่อผลลัพธ์'],
      motto: 'ผสานพลังความคิด เปลี่ยนความต่างเป็นความสำเร็จ'
    },
    {
      id: 3,
      numberText: 'คุณลักษณะที่ ๓',
      title: 'ผู้ส่งสารแห่งละอองดาว',
      englishTitle: 'The Stardust Messenger',
      image: 'https://s.imgz.io/2026/10/14/fbce02d787aa493ed617a36f3238fb2fa43a53d80deeeb8e.png',
      shortDesc: 'ผู้ที่เปิดใจรับฟังความคิดเห็นของผู้อื่น เคารพความเห็นต่าง',
      description: 'ผู้ที่เปิดใจรับฟังความคิดเห็นของผู้อื่น เคารพความเห็นต่าง และสามารถสื่อสารความคิดหรือข้อมูลอย่างชัดเจน โดยใช้ข้อเท็จจริงและเหตุผลในการสนทนา นอกจากนี้ยังสามารถสร้างการมีส่วนร่วมอย่างเหมาะสมเพื่อให้บรรลุเป้าหมายร่วมกัน',
      themeColor: '#D97706',
      themeBg: 'bg-gradient-to-b from-amber-50 via-amber-100/60 to-orange-100/80',
      badgeBg: 'bg-amber-600 text-white',
      borderColor: 'border-amber-200/90 hover:border-amber-500',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      glowColor: 'bg-amber-400/25',
      strengths: ['การฟังเชิงลึก (Active Listening)', 'การถ่ายทอดสารอย่างตรงประเด็น', 'การสร้างบรรยากาศการสนทนา'],
      motto: 'สื่อสารด้วยความจริงใจและเหตุผล เพื่อความเข้าใจร่วมกัน'
    },
    {
      id: 4,
      numberText: 'คุณลักษณะที่ ๔',
      title: 'นักปรุงแต่งสสารมืด',
      englishTitle: 'The Dark Matter Alchemist',
      image: 'https://s.imgz.io/2026/10/14/ba489060c24880e5b963df571946dc8fcb2b3d1e49bc3f42.png',
      shortDesc: 'ผู้ที่มีความสามารถในการปรับปรุง พัฒนา หรือสร้างกระบวนการใหม่ ๆ',
      description: 'ผู้ที่มีความสามารถในการปรับปรุง พัฒนา หรือสร้างกระบวนการใหม่ ๆ เพื่อเพิ่มคุณค่าของผลลัพธ์ มีความคิดสร้างสรรค์และกล้าที่จะรับมือกับความท้าทายใหม่ ๆ ผ่านการใช้ความคิดสร้างนวัตกรรมเพื่อการแก้ปัญหา',
      themeColor: '#7C3AED',
      themeBg: 'bg-gradient-to-b from-purple-50 via-purple-100/60 to-violet-100/80',
      badgeBg: 'bg-purple-600 text-white',
      borderColor: 'border-purple-200/90 hover:border-purple-500',
      btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
      glowColor: 'bg-purple-400/25',
      strengths: ['การคิดนอกกรอบ (Out-of-the-Box)', 'การทดลองและกล้าลงมือทำ', 'การสร้างมูลค่าเพิ่ม'],
      motto: 'จุดประกายไอเดียใหม่ เปลี่ยนปัญหาเป็นโอกาส'
    }
  ];

  // Prepared items for HoverRevealCards (Shadcn UI component)
  const hoverCardItems: CardItem[] = cards.map((card) => ({
    id: card.id,
    title: card.title,
    subtitle: card.shortDesc,
    imageUrl: card.image,
    bgGradient: card.themeBg,
    cardClassName: 'h-96 sm:h-[460px] rounded-3xl border-2 shadow-xl bg-contain bg-no-repeat bg-center',
  }));

  // Active expanded card object for fullscreen modal
  const activeCard = cards.find((c) => c.id === expandedCardId) || null;

  // Handle ESC key to close expanded modal or slid-up drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedCardId(null);
        setSlidUpCardId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNextCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!expandedCardId) return;
    const currentIndex = cards.findIndex((c) => c.id === expandedCardId);
    const nextIndex = (currentIndex + 1) % cards.length;
    setExpandedCardId(cards[nextIndex].id);
  };

  const handlePrevCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!expandedCardId) return;
    const currentIndex = cards.findIndex((c) => c.id === expandedCardId);
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    setExpandedCardId(cards[prevIndex].id);
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/40 to-[#ffffff] relative border-b border-slate-200/80 font-['Mitr',sans-serif] overflow-hidden w-full">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Responsive Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide uppercase mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" />
            <span>4 มิติคุณลักษณะที่สำคัญ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            คุณลักษณะของผู้เรียนรู้แห่งอนาคต
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-5">
            {viewMode === 'hover'
              ? 'Hover Reveal Cards (Shadcn UI) — เลื่อนเมาส์ผ่านการ์ดเพื่อดูเอฟเฟกต์โฟกัส และคลิกเพื่อดูรายละเอียดฉบับเต็ม'
              : 'ภาพเต็มสไตล์โมเดิร์น — กดปุ่มที่การ์ดเพื่อเลื่อนดูข้อความและทักษะสำคัญ'}
          </p>

          {/* View Mode Switcher */}
          <div className="inline-flex items-center p-1 rounded-full bg-slate-100 border border-slate-200/90 text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('hover')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                viewMode === 'hover'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Hover Reveal Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('slide')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                viewMode === 'slide'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Slide-up Cards</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display: HoverRevealCards or Slide-Up interactive cards */}
        {viewMode === 'hover' ? (
          <div className="flex justify-center">
            <HoverRevealCards
              items={hoverCardItems}
              onCardClick={(item) => setExpandedCardId(Number(item.id))}
              className="w-full max-w-7xl gap-6 p-0"
              cardClassName="h-[460px] sm:h-[500px] rounded-3xl border-2 shadow-xl bg-contain bg-no-repeat bg-center"
            />
          </div>
        ) : (
          /* 4-Column Responsive Grid: Full-bleed character image cards with slide-up text panel */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-6">
          {cards.map((card) => {
            const isSlidUp = slidUpCardId === card.id;

            return (
              <div
                key={card.id}
                className={`relative h-[480px] sm:h-[520px] rounded-3xl ${card.themeBg} ${card.borderColor} border-2 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden group select-none`}
              >
                {/* 1. Full Image Background & Character Illustration ("ทำภาพให้เต็ม แบบภาพที่แนบ") */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 overflow-hidden">
                  {/* Atmospheric radial glow */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-4 rounded-full blur-3xl ${card.glowColor} scale-125 group-hover:scale-135 transition-transform duration-700 pointer-events-none`}
                  />

                  {/* Top Floating Badge & Fullscreen Expand button */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${card.badgeBg} shadow-sm tracking-wide`}>
                      {card.numberText}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedCardId(card.id)}
                      title="ดูแบบเต็มจอ"
                      className="w-8 h-8 rounded-full bg-white/80 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Character Illustration - Centered & Filling the Card */}
                  <div className="relative z-10 flex-1 flex items-center justify-center py-2 px-2">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full max-h-[340px] sm:max-h-[370px] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Subtle bottom gradient to ensure text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* 2. Slide-up Text Panel ("เมื่อกดปุ่ม แล้วข้อความจึงเลื่อนขึ้นมา") */}
                <div
                  className={`absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white/95 backdrop-blur-md shadow-2xl border-t border-white/60 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${
                    isSlidUp
                      ? 'translate-y-0 h-[88%] sm:h-[86%]'
                      : 'translate-y-[calc(100%-84px)] h-[88%] sm:h-[86%]'
                  }`}
                >
                  {/* Top Bar of the Drawer (Always visible as bottom card bar when collapsed) */}
                  <div
                    onClick={(e) => toggleSlideUp(card.id, e)}
                    className="p-4 sm:p-5 pb-3 flex items-center justify-between cursor-pointer border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="pr-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {card.title}
                        </h3>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                          {card.englishTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {isSlidUp ? 'แตะปุ่มเพื่อย่อเก็บ' : card.shortDesc}
                      </p>
                    </div>

                    {/* The Trigger Button ("เมื่อกดปุ่ม แล้วข้อความจึงเลื่อนขึ้นมา") */}
                    <button
                      type="button"
                      onClick={(e) => toggleSlideUp(card.id, e)}
                      aria-label={isSlidUp ? 'ย่อข้อความลง' : 'เลื่อนข้อความขึ้นมา'}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl ${
                        isSlidUp
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : `${card.btnBg} shadow-sm hover:scale-105 active:scale-95`
                      } transition-all duration-200 cursor-pointer text-xs font-bold`}
                    >
                      <span>{isSlidUp ? 'ย่อลง' : 'ดูเนื้อหา'}</span>
                      {isSlidUp ? (
                        <ChevronRight className="w-4 h-4 rotate-90 transition-transform duration-300" />
                      ) : (
                        <ChevronRight className="w-4 h-4 -rotate-90 transition-transform duration-300" />
                      )}
                    </button>
                  </div>

                  {/* Slid-Up Revealed Content */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 pt-3 space-y-3.5 text-left custom-scrollbar">
                    {/* Motto Quote Badge */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-slate-800 text-xs italic font-medium">
                      <Sparkles className="w-4 h-4 text-[#FFC800] shrink-0 mt-0.5" />
                      <span>&ldquo;{card.motto}&rdquo;</span>
                    </div>

                    {/* Detailed Description */}
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        คำอธิบายคุณลักษณะ
                      </h4>
                      <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                        {card.description}
                      </p>
                    </div>

                    {/* Key Strengths Checklist */}
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        จุดเด่นและทักษะสำคัญ
                      </h4>
                      <div className="space-y-1.5">
                        {card.strengths.map((str, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{str}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick CTAs inside drawer */}
                    <div className="pt-2 flex flex-col gap-2">
                      {onStartLifePath && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartLifePath();
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>ทำแบบทดสอบเพื่อค้นหาตัวตน</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onExploreCourses && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onExploreCourses();
                          }}
                          className={`w-full py-2 px-3 rounded-xl ${card.btnBg} font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border-0`}
                        >
                          <span>ดูคอร์สที่เกี่ยวข้อง</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCardId(card.id);
                        }}
                        className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        เปิดดูแบบขยายเต็มหน้าจอ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* EXPANDED MODAL VIEW ("เมื่อคลิกแล้วจึงขยายขึ้น")            */}
      {/* ========================================================= */}
      {activeCard && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setExpandedCardId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl ${activeCard.themeBg} border-2 ${activeCard.borderColor} shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200`}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setExpandedCardId(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/90 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center shadow-md transition-all cursor-pointer z-20"
              aria-label="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation buttons (Prev / Next) */}
            <button
              type="button"
              onClick={handlePrevCard}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-slate-900 hover:text-white text-slate-700 items-center justify-center shadow-md transition-all cursor-pointer z-20"
              title="ก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-slate-900 hover:text-white text-slate-700 items-center justify-center shadow-md transition-all cursor-pointer z-20"
              title="ถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Expanded Modal Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              {/* Left Column: Enlarged Character Illustration */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className={`absolute inset-2 rounded-full blur-3xl ${activeCard.glowColor} scale-125 pointer-events-none`}
                  />
                  <img
                    src={activeCard.image}
                    alt={activeCard.title}
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="mt-4 text-center">
                  <span className={`inline-block text-xs font-bold px-3.5 py-1.5 rounded-full ${activeCard.badgeBg} shadow-xs`}>
                    {activeCard.numberText}
                  </span>
                </div>
              </div>

              {/* Right Column: In-depth Information & Key Strengths */}
              <div className="md:col-span-7 flex flex-col text-left">
                <div className="mb-4">
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {activeCard.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">
                    {activeCard.englishTitle}
                  </p>
                </div>

                {/* Motto Box */}
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 mb-4 shadow-2xs">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 italic flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFC800] shrink-0" />
                    <span>&ldquo;{activeCard.motto}&rdquo;</span>
                  </p>
                </div>

                {/* Full Description */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    คำอธิบายลักษณะ
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {activeCard.description}
                  </p>
                </div>

                {/* Key Strengths */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    จุดเด่นและทักษะสำคัญ
                  </h4>
                  <div className="space-y-2">
                    {activeCard.strengths.map((strength, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTAs inside expanded view */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {onStartLifePath && (
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedCardId(null);
                        onStartLifePath();
                      }}
                      className="flex-1 py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>ทำแบบทดสอบเพื่อค้นหาตัวตน</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  {onExploreCourses && (
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedCardId(null);
                        onExploreCourses();
                      }}
                      className={`py-3 px-5 rounded-xl ${activeCard.btnBg} font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer border-0`}
                    >
                      <span>ดูคอร์สที่เกี่ยวข้อง</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
};


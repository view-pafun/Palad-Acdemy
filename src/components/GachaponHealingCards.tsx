import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Copy, 
  Check, 
  X, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Gift, 
  Grid, 
  Bookmark, 
  BookmarkCheck,
  Music
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface HealingCard {
  id: number;
  text: string;
  category: 'กำลังใจ' | 'การเรียน' | 'คลายเหนื่อย' | 'การยอมรับตัวเอง' | 'ความหวัง';
  categoryLabel: string;
  subtext?: string;
  emoji: string;
  colorScheme: 'yellow' | 'pink' | 'blue' | 'green' | 'purple';
}

export const HEALING_CARDS: HealingCard[] = [
  {
    id: 1,
    text: 'วันนี้คุณเก่งมากแล้ว ที่ผ่านมาจนถึงวันนี้ ขอให้รู้ไว้ว่าคุณพยายามได้ดีเสมอ',
    category: 'กำลังใจ',
    categoryLabel: 'พลังใจอบอุ่น',
    subtext: 'ใจดีกับตัวเองในทุกย่างก้าวนะ',
    emoji: '💕',
    colorScheme: 'yellow'
  },
  {
    id: 2,
    text: 'เหนื่อยก็พักหน่อยนะ ไม่จำเป็นต้องเก่งตลอดเวลา แค่เป็นตัวเองในวันนี้ก็เพียงพอแล้ว',
    category: 'คลายเหนื่อย',
    categoryLabel: 'พักผ่อนหัวใจ',
    subtext: 'การพักผ่อนคือส่วนหนึ่งของการเดินทาง',
    emoji: '🌿',
    colorScheme: 'green'
  },
  {
    id: 3,
    text: 'ทุกก้าวที่ก้าวไปข้างหน้า ไม่ว่าจะเล็กแค่ไหน ล้วนมีความหมายและกำลังพาคุณไปสู่สิ่งที่ดีกว่า',
    category: 'การเรียน',
    categoryLabel: 'ก้าวไปข้างหน้า',
    subtext: 'ช้าหน่อยแต่ไม่หยุดเดินก็ยอดเยี่ยมแล้ว',
    emoji: '✨',
    colorScheme: 'yellow'
  },
  {
    id: 4,
    text: 'อย่าลืมใจดีกับตัวเองให้มากๆ เพราะคนที่อยู่กับคุณในทุกวินาทีของชีวิตคือตัวคุณเอง',
    category: 'การยอมรับตัวเอง',
    categoryLabel: 'รักและเมตตาตัวเอง',
    subtext: 'คุณคู่ควรกับความรักและความอบอุ่น',
    emoji: '💛',
    colorScheme: 'yellow'
  },
  {
    id: 5,
    text: 'ความผิดพลาดไม่ได้แปลว่าเราล้มเหลว มันคือบทเรียนที่จักรวาลกำลังส่งมาให้เราเติบโต',
    category: 'การเรียน',
    categoryLabel: 'บทเรียนชีวิต',
    subtext: 'ลุกขึ้นปัดฝุ่นแล้วเริ่มใหม่นะ',
    emoji: '🌱',
    colorScheme: 'green'
  },
  {
    id: 6,
    text: 'วันนี้อาจเป็นวันที่หนักหนา แต่อย่าลืมว่าท้องฟ้าหลังฝน มักจะมีรุ้งและแสงดาวที่งดงามเสมอ',
    category: 'ความหวัง',
    categoryLabel: 'ฟ้าหลังฝน',
    subtext: 'แสงสว่างใหม่รอคุณอยู่เสมอ',
    emoji: '🌈',
    colorScheme: 'blue'
  },
  {
    id: 7,
    text: 'คุณมีคุณค่าในแบบที่เป็นคุณ ไม่จำเป็นต้องเปรียบเทียบกับวงโคจรหรือความเร็วของใคร',
    category: 'การยอมรับตัวเอง',
    categoryLabel: 'คุณค่าในตัวเอง',
    subtext: 'แต่ละดวงดาวมีเวลาส่องแสงของตัวเอง',
    emoji: '🪐',
    colorScheme: 'purple'
  },
  {
    id: 8,
    text: 'หายใจเข้าลึกๆ ยิ้มให้ตัวเองหนึ่งที แล้วบอกตัวเองว่า "ฉันผ่านมันไปได้แน่นอน"',
    category: 'กำลังใจ',
    categoryLabel: 'เติมพลังใจ',
    subtext: 'สูดลมหายใจเพื่อเริ่มใหม่อย่างสดชื่น',
    emoji: '🌻',
    colorScheme: 'yellow'
  },
  {
    id: 9,
    text: 'อนุญาตให้ตัวเองได้พักผ่อน ได้กินของอร่อย และได้มีความสุขกับสิ่งเล็กๆ รอบตัวนะ',
    category: 'คลายเหนื่อย',
    categoryLabel: 'ความสุขเรียบง่าย',
    subtext: 'วันนี้ให้รางวัลตัวเองสักชิ้นนะ',
    emoji: '🍰',
    colorScheme: 'pink'
  },
  {
    id: 10,
    text: 'ไม่มีดอกไม้ดอกไหนบานได้ตลอดทั้งปี ให้เวลาตัวเองค่อยๆ ผลิดอกออกผลตามฤดูกาลนะ',
    category: 'การยอมรับตัวเอง',
    categoryLabel: 'จังหวะชีวิต',
    subtext: 'คุณกำลังเติบโตอย่างงดงาม',
    emoji: '🌸',
    colorScheme: 'pink'
  },
  {
    id: 11,
    text: 'ความเงียบสงบในใจ คือพื้นที่ปลอดภัยที่คุณสร้างได้ทุกเวลา เมื่อรู้สึกวุ่นวาย ลองกลับมาฟังเสียงหัวใจตัวเอง',
    category: 'คลายเหนื่อย',
    categoryLabel: 'พื้นที่ปลอดภัย',
    subtext: 'ใจที่สงบจะพบทางออกเสมอ',
    emoji: '🕊️',
    colorScheme: 'blue'
  },
  {
    id: 12,
    text: 'สิ่งที่คุณกังวลในวันนี้ อาจเป็นเพียงฝุ่นละอองในจักรวาลอันกว้างใหญ่ วันพรุ่งนี้จะมีแสงสว่างใหม่รออยู่',
    category: 'ความหวัง',
    categoryLabel: 'ปล่อยวางความกังวล',
    subtext: 'ทุกอย่างจะค่อยๆ คลี่คลาย',
    emoji: '☀️',
    colorScheme: 'yellow'
  },
  {
    id: 13,
    text: 'แม้ในวันที่มืดมิดที่สุด ดวงดาวก็ยังส่องแสงได้สว่างที่สุดเสมอ เชื่อมั่นในพลังในตัวคุณนะ',
    category: 'ความหวัง',
    categoryLabel: 'แสงสว่างในใจ',
    subtext: 'ความหวังไม่เคยหายไปไหน',
    emoji: '🌟',
    colorScheme: 'purple'
  },
  {
    id: 14,
    text: 'ขอบคุณตัวคุณเองที่อดทนและสู้มาได้ขนาดนี้ คุณคู่ควรกับความรักและความสุขที่สุดในโลก',
    category: 'กำลังใจ',
    categoryLabel: 'ขอบคุณตัวเอง',
    subtext: 'คุณคือคนที่น่ายกย่องที่สุด',
    emoji: '💖',
    colorScheme: 'pink'
  },
  {
    id: 15,
    text: 'การขอความช่วยเหลือไม่ใช่ความอ่อนแอ แต่มันคือความกล้าหาญในการดูแลตัวเอง',
    category: 'การยอมรับตัวเอง',
    categoryLabel: 'เปิดใจรับความช่วยเหลือ',
    subtext: 'ที่นี่ยังมีคนที่พร้อมรับฟังคุณเสมอ',
    emoji: '🤝',
    colorScheme: 'blue'
  },
  {
    id: 16,
    text: 'ค่อยๆ ก้าวไปทีละก้าว ไม่ต้องรีบร้อน ถึงช้ากว่าคนอื่น แต่ถึงอย่างมั่นคงและมีความสุขก็พอ',
    category: 'การเรียน',
    categoryLabel: 'ก้าวอย่างมั่นคง',
    subtext: 'ความสุขคือเป้าหมายที่แท้จริง',
    emoji: '🚶‍♂️',
    colorScheme: 'green'
  },
  {
    id: 17,
    text: 'สิ่งที่คุณทำลงไป แม้ไม่มีใครมองเห็น แต่ตัวคุณรู้ดีที่สุดว่าคุณทุ่มเทแค่ไหน ภูมิใจในตัวเองเถอะนะ',
    category: 'กำลังใจ',
    categoryLabel: 'ความพยายามที่งดงาม',
    subtext: 'หยาดเหงื่อทุกหยดมีความหมาย',
    emoji: '🎖️',
    colorScheme: 'yellow'
  },
  {
    id: 18,
    text: 'ปล่อยวางสิ่งที่ควบคุมไม่ได้ แล้วโฟกัสกับลมหายใจและสิ่งดีๆ ที่อยู่ตรงหน้าในปัจจุบัน',
    category: 'คลายเหนื่อย',
    categoryLabel: 'อยู่กับปัจจุบัน',
    subtext: 'ปัจจุบันขณะคือของขวัญที่ดีที่สุด',
    emoji: '🍃',
    colorScheme: 'green'
  },
  {
    id: 19,
    text: 'วันที่ไม่เป็นไปตามแผน ไม่ได้แปลว่าชีวิตพัง มันแค่พาเราไปเจอเส้นทางใหม่ที่น่าค้นหา',
    category: 'ความหวัง',
    categoryLabel: 'เปิดรับสิ่งใหม่',
    subtext: 'ทุกเส้นทางมีเสน่ห์ในตัวเอง',
    emoji: '🗺️',
    colorScheme: 'purple'
  },
  {
    id: 20,
    text: 'คุณคือของขวัญชิ้นสำคัญของโลกใบนี้ อย่าปล่อยให้คำพูดของใครมาบดบังประกายแสงในตัวคุณ',
    category: 'การยอมรับตัวเอง',
    categoryLabel: 'ประกายแสงในตัวคุณ',
    subtext: 'จงภูมิใจในตัวตนของคุณ',
    emoji: '🎁',
    colorScheme: 'pink'
  }
];

export const GachaponHealingCards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAllCardsModalOpen, setIsAllCardsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [savedCards, setSavedCards] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('palad_saved_healing_cards');
      return stored ? JSON.parse(stored) : [1];
    } catch {
      return [1];
    }
  });

  const currentCard = HEALING_CARDS[currentIndex] || HEALING_CARDS[0];

  const handleSpinGachapon = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Pick random index different from current
    let nextIdx = Math.floor(Math.random() * HEALING_CARDS.length);
    if (nextIdx === currentIndex) {
      nextIdx = (nextIdx + 1) % HEALING_CARDS.length;
    }

    setTimeout(() => {
      setCurrentIndex(nextIdx);
      setIsSpinning(false);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#F59E0B', '#F43F5E', '#3B82F6', '#10B981', '#FFE082']
        });
      } catch {}
    }, 700);
  };

  const handlePrevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + HEALING_CARDS.length) % HEALING_CARDS.length);
  };

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % HEALING_CARDS.length);
  };

  const handleCopyQuote = (card: HealingCard) => {
    try {
      navigator.clipboard.writeText(`"${card.text}" ${card.emoji}`);
      setCopiedId(card.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {}
  };

  const handleToggleSave = (cardId: number) => {
    setSavedCards((prev) => {
      const updated = prev.includes(cardId) 
        ? prev.filter((id) => id !== cardId) 
        : [...prev, cardId];
      try {
        localStorage.setItem('palad_saved_healing_cards', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const filteredCards = selectedFilter === 'all'
    ? HEALING_CARDS
    : HEALING_CARDS.filter((c) => c.category === selectedFilter);

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-[#FFFDF8] via-[#FFFDF5] to-[#FFFBE6] border-b border-amber-200/60 font-['Prompt',sans-serif] relative overflow-hidden">
      
      {/* Soft Ambient Sparkle Elements */}
      <div className="absolute top-6 left-12 text-amber-300/40 select-none pointer-events-none text-2xl animate-pulse">✦</div>
      <div className="absolute bottom-8 right-16 text-rose-300/40 select-none pointer-events-none text-xl animate-pulse delay-300">✦</div>
      <div className="absolute top-1/2 right-1/4 text-amber-400/30 select-none pointer-events-none text-3xl">✧</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Gachapon Banner Card (matching reference design) */}
        <div className="bg-[#FFFDF7] rounded-3xl sm:rounded-[36px] border-2 border-amber-200/90 shadow-sm hover:shadow-md transition-all p-5 sm:p-8 lg:p-10 relative overflow-hidden">
          
          {/* Subtle golden ambient glow inside card */}
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* ======================================================================= */}
            {/* LEFT COLUMN: Title & Description */}
            {/* ======================================================================= */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left space-y-3 sm:space-y-4">
              
              {/* Pink Pill Badge: ♫ เติมพลังใจในทุกวัน */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F4] text-[#E11D48] text-xs font-bold border border-rose-100/80 shadow-2xs w-fit">
                <Music className="w-3.5 h-3.5 fill-[#E11D48] text-[#E11D48]" />
                <span>เติมพลังใจในทุกวัน</span>
              </div>

              {/* Heading: สุ่มการ์ดกำลังใจ */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                สุ่มการ์ดกำลังใจ
              </h2>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-600 space-y-1 font-normal leading-relaxed">
                <p>ให้การ์ดเล็ก ๆ เป็นกำลังใจ</p>
                <p>ในทุกช่วงเวลาของคุณ</p>
                <p className="flex items-center gap-1 pt-1 text-slate-700 font-medium">
                  <span>ลองสุ่มสักใบ แล้วเก็บไว้เป็นพลังใจนะ</span>
                  <span>😊</span>
                </p>
              </div>

              {/* Status counter indicator */}
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>พร้อมสุ่ม 20+ ข้อความอบอุ่นหัวใจ</span>
              </div>

            </div>

            {/* ======================================================================= */}
            {/* CENTER COLUMN: Gachapon Machine & Current Note Card */}
            {/* ======================================================================= */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative">
              
              {/* Gachapon Machine Mascot Image */}
              <div className="relative shrink-0 flex items-center justify-center">
                
                {/* Radiant back halo */}
                <div className="absolute w-36 h-36 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />

                <div className={`relative transition-all duration-300 ${isSpinning ? 'scale-105 rotate-3' : 'hover:scale-102'}`}>
                  <img
                    src="https://s.imgz.io/2026/10/16/-11170190f364465d4.png"
                    alt="Palad Gachapon Machine"
                    className="w-36 sm:w-44 lg:w-48 h-auto object-contain select-none drop-shadow-md cursor-pointer"
                    onClick={handleSpinGachapon}
                    title="คลิกที่เครื่องกาชาปองเพื่อสุ่มการ์ด!"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.indexOf('gachapon_banner') === -1) {
                        target.src = '/gachapon_banner.png';
                      }
                    }}
                  />
                  {/* Floating heart sticker next to mascot */}
                  <div className="absolute top-8 right-2 text-rose-500 text-lg animate-bounce select-none pointer-events-none">
                    ❤️
                  </div>
                </div>
              </div>

              {/* Note Card: Sticky Note / Healing Quote Card */}
              <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center">
                <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm relative transition-all duration-300 min-h-[150px] flex flex-col justify-between">
                  
                  {/* Left Quotation Mark in yellow */}
                  <span className="absolute top-2 left-3 text-3xl sm:text-4xl font-serif text-[#F59E0B] leading-none select-none">
                    “
                  </span>

                  {/* Right Quotation Mark in yellow */}
                  <span className="absolute bottom-2 right-3 text-3xl sm:text-4xl font-serif text-[#F59E0B] leading-none select-none">
                    ”
                  </span>

                  {/* Card Category Tag */}
                  <div className="flex items-center justify-between mb-2 z-10 pl-5 pr-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                      {currentCard.categoryLabel}
                    </span>
                    <button
                      onClick={() => handleToggleSave(currentCard.id)}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                      title={savedCards.includes(currentCard.id) ? 'บันทึกแล้ว' : 'บันทึกการ์ดใบนี้'}
                    >
                      {savedCards.includes(currentCard.id) ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Quote Text */}
                  <div className="my-auto px-4 text-center z-10">
                    <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed font-['Prompt',sans-serif]">
                      {currentCard.text}
                    </p>
                    <span className="inline-block mt-2 text-base">
                      {currentCard.emoji}
                    </span>
                  </div>

                  {/* Action row on card */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 z-10">
                    <span>การ์ดที่ {currentIndex + 1}/{HEALING_CARDS.length}</span>
                    <button
                      onClick={() => handleCopyQuote(currentCard)}
                      className="inline-flex items-center gap-1 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedId === currentCard.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 font-bold">คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>คัดลอกข้อความ</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Pagination Dots below the Note Card (matching design) */}
                <div className="flex items-center justify-center gap-2 mt-3 select-none">
                  <button
                    onClick={handlePrevCard}
                    className="p-1 rounded-full hover:bg-amber-100/70 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="การ์ดก่อนหน้า"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((dotIdx) => {
                      const isActive = (currentIndex % 3) === dotIdx;
                      return (
                        <button
                          key={dotIdx}
                          onClick={() => setCurrentIndex((prev) => Math.floor(prev / 3) * 3 + dotIdx)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            isActive 
                              ? 'w-5 bg-[#F59E0B]' 
                              : 'w-2 bg-slate-200 hover:bg-slate-300'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextCard}
                    className="p-1 rounded-full hover:bg-amber-100/70 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="การ์ดถัดไป"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

            {/* ======================================================================= */}
            {/* RIGHT COLUMN: Actions & Handwritten Header */}
            {/* ======================================================================= */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center text-center lg:text-right space-y-3 sm:space-y-4">
              
              {/* Handwritten Note Style: คำเล็ก ๆ ที่อาจเปลี่ยนวันของคุณได้ ♡ */}
              <div className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                <span className="block font-bold">คำเล็ก ๆ</span>
                <span className="flex items-center justify-center lg:justify-end gap-1 text-slate-600">
                  <span>ที่อาจเปลี่ยนวันของคุณได้</span>
                  <span className="text-rose-500 font-bold">♡</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col w-full max-w-[200px] gap-2.5">
                
                {/* Primary Button: สุ่มเลย 🎁 */}
                <button
                  onClick={handleSpinGachapon}
                  disabled={isSpinning}
                  className="w-full py-3 px-6 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-75"
                >
                  <Gift className={`w-4 h-4 text-amber-300 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'กำลังสุ่ม...' : 'สุ่มเลย 🎁'}</span>
                </button>

                {/* Secondary Button: ดูการ์ดทั้งหมด */}
                <button
                  onClick={() => setIsAllCardsModalOpen(true)}
                  className="w-full py-2.5 px-6 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 hover:border-slate-800 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Grid className="w-3.5 h-3.5 text-slate-500" />
                  <span>ดูการ์ดทั้งหมด</span>
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* ALL HEALING CARDS MODAL (ดูการ์ดทั้งหมด)                                    */}
      {/* ========================================================================= */}
      {isAllCardsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-amber-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-[#FFFDF7]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎁</span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    คลังการ์ดกำลังใจทั้งหมด ({HEALING_CARDS.length} ใบ)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  เลือกอ่านและบันทึกการ์ดที่คุณชอบ หรือคัดลอกข้อความไปส่งต่อให้เพื่อนได้นะ
                </p>
              </div>
              <button
                onClick={() => setIsAllCardsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="px-5 sm:px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
                  selectedFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                ทั้งหมด ({HEALING_CARDS.length})
              </button>
              {['กำลังใจ', 'การเรียน', 'คลายเหนื่อย', 'การยอมรับตัวเอง', 'ความหวัง'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
                    selectedFilter === cat
                      ? 'bg-amber-500 text-white font-bold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((card) => {
                const isSelected = card.id === currentCard.id;
                const isSaved = savedCards.includes(card.id);
                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-400 shadow-sm ring-2 ring-amber-300'
                        : 'bg-[#FFFDF9] border-amber-100/90 hover:border-amber-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-2.5">
                        <span className="font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-full">
                          {card.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleSave(card.id)}
                            className="p-1 rounded-full hover:bg-white text-slate-400 hover:text-amber-500 transition cursor-pointer"
                            title={isSaved ? 'บันทึกแล้ว' : 'บันทึกการ์ดนี้'}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed font-['Prompt',sans-serif]">
                        "{card.text}"
                      </p>
                      
                      <div className="mt-2 text-right">
                        <span className="text-lg">{card.emoji}</span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-amber-200/40 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => {
                          const idx = HEALING_CARDS.findIndex((c) => c.id === card.id);
                          if (idx !== -1) setCurrentIndex(idx);
                          setIsAllCardsModalOpen(false);
                        }}
                        className="text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                      >
                        นำขึ้นหน้าหลัก
                      </button>

                      <button
                        onClick={() => handleCopyQuote(card)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        {copiedId === card.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 font-bold">คัดลอกแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>คัดลอก</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>บันทึกไว้ {savedCards.length} ใบ</span>
              <button
                onClick={() => setIsAllCardsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

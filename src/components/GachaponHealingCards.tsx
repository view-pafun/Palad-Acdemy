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
  const [burstHearts, setBurstHearts] = useState<Array<{
    id: number;
    emoji: string;
    tx: number;
    ty1: number;
    ty2: number;
    rot: number;
    duration: number;
    size: number;
    leftPercent: number;
    topPercent: number;
  }>>([]);
  const [savedCards, setSavedCards] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('palad_saved_healing_cards');
      return stored ? JSON.parse(stored) : [1];
    } catch {
      return [1];
    }
  });

  const currentCard = HEALING_CARDS[currentIndex] || HEALING_CARDS[0];

  const triggerHeartBurstEffect = () => {
    // 1. Spawning interactive animated floating hearts
    const HEART_EMOJIS = ['❤️', '💖', '💕', '💗', '💓', '💘', '💝', '✨'];
    const newHearts = Array.from({ length: 24 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.4;
      const distance = 40 + Math.random() * 110;
      return {
        id: Date.now() + i,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
        tx: Math.cos(angle) * distance,
        ty1: -30 - Math.random() * 50,
        ty2: -130 - Math.random() * 120,
        rot: (Math.random() - 0.5) * 60,
        duration: 1.6 + Math.random() * 0.8,
        size: 18 + Math.floor(Math.random() * 18),
        leftPercent: 50 + (Math.random() - 0.5) * 20,
        topPercent: 50 + (Math.random() - 0.5) * 20
      };
    });
    setBurstHearts(newHearts);
    setTimeout(() => setBurstHearts([]), 2500);

    // 2. Canvas confetti with hearts shape instead of scattered paper
    try {
      const heartShape = (confetti as any).shapeFromPath({
        path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z'
      });
      confetti({
        shapes: [heartShape],
        scalar: 2.6,
        particleCount: 50,
        spread: 85,
        origin: { y: 0.65 },
        colors: ['#FF2A6D', '#FF62A5', '#F43F5E', '#E11D48', '#FDA4AF', '#FFE4E6']
      });
    } catch {
      try {
        const textHeart = (confetti as any).shapeFromText({ text: '❤️', scalar: 2.4 });
        confetti({
          shapes: [textHeart],
          particleCount: 40,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#FF2A6D', '#F43F5E', '#E11D48']
        });
      } catch {}
    }
  };

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
      triggerHeartBurstEffect();
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
    <section className="py-10 sm:py-16 bg-white border-0 font-['Prompt',sans-serif] relative overflow-hidden group/gacha-container transition-colors duration-300">
      
      {/* Smooth Sparkle Particles that sparkle and pulse, glowing brighter on container hover/interaction */}
      <div className="absolute top-6 left-12 text-amber-400 select-none pointer-events-none text-2xl animate-sparkle-pulse opacity-40 group-hover/gacha-container:opacity-90 group-hover/gacha-container:scale-125 transition-all duration-500">✦</div>
      <div className="absolute bottom-8 right-16 text-rose-400 select-none pointer-events-none text-xl animate-sparkle-fast opacity-40 group-hover/gacha-container:opacity-90 group-hover/gacha-container:scale-125 transition-all duration-500 delay-200">✦</div>
      <div className="absolute top-1/3 right-1/4 text-amber-300 select-none pointer-events-none text-3xl animate-sparkle-pulse opacity-30 group-hover/gacha-container:opacity-80 group-hover/gacha-container:scale-130 transition-all duration-500 delay-500">✧</div>
      <div className="absolute bottom-1/4 left-1/5 text-purple-300 select-none pointer-events-none text-2xl animate-sparkle-fast opacity-30 group-hover/gacha-container:opacity-80 group-hover/gacha-container:scale-125 transition-all duration-500">✨</div>
      <div className="absolute top-10 right-12 text-amber-400 select-none pointer-events-none text-xl animate-sparkle-pulse opacity-30 group-hover/gacha-container:opacity-90 transition-all duration-500">✨</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Gachapon Banner Card: Pure White Background, No Borders, Smooth Glow & Soft Shadow */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] border-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500 p-6 sm:p-9 lg:p-12 relative overflow-hidden">
          
          {/* Subtle soft ambient aura on hover */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-50/30 rounded-full blur-3xl pointer-events-none opacity-60 group-hover/gacha-container:opacity-100 transition-opacity duration-700" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-50/30 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            
            {/* ======================================================================= */}
            {/* LEFT COLUMN: Title & Description (Span 3) */}
            {/* ======================================================================= */}
            <div className="lg:col-span-3 flex flex-col justify-center text-left space-y-3 sm:space-y-4">
              
              {/* Pink Pill Badge: ♫ เติมพลังใจในทุกวัน */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F4] text-[#E11D48] text-xs font-bold shadow-2xs w-fit">
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
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>พร้อมสุ่ม 20+ ข้อความอบอุ่นหัวใจ</span>
              </div>

            </div>

            {/* ======================================================================= */}
            {/* CENTER COLUMN: Gachapon Machine & Large Healing Quote Card (Span 6)     */}
            {/* ======================================================================= */}
            <div className="lg:col-span-6 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-7 relative">
              
              {/* Floating Bursting Hearts around Mascot & Card */}
              {burstHearts.map((heart) => (
                <span
                  key={heart.id}
                  className="absolute pointer-events-none select-none z-30 animate-heart-burst"
                  style={{
                    left: `${heart.leftPercent}%`,
                    top: `${heart.topPercent}%`,
                    fontSize: `${heart.size}px`,
                    ['--tx' as any]: `${heart.tx}px`,
                    ['--ty1' as any]: `${heart.ty1}px`,
                    ['--ty2' as any]: `${heart.ty2}px`,
                    ['--rot' as any]: `${heart.rot}deg`,
                    ['--duration' as any]: `${heart.duration}s`
                  }}
                >
                  {heart.emoji}
                </span>
              ))}

              {/* Gachapon Machine Mascot Image with Smooth Shake & Sparkle Interactive Animation */}
              <div className="relative shrink-0 flex items-center justify-center group/mascot">
                
                {/* Back glow halo pulsing on hover/interact */}
                <div className="absolute w-40 h-40 bg-rose-100/50 rounded-full blur-2xl pointer-events-none group-hover/mascot:scale-125 transition-transform duration-500" />

                {/* Floating sparkle icons around machine */}
                <div className="absolute -top-2 -left-2 text-rose-400 text-lg animate-sparkle-pulse pointer-events-none">💖</div>
                <div className="absolute -bottom-1 -right-2 text-amber-400 text-base animate-sparkle-fast pointer-events-none">✨</div>

                <div 
                  className={`relative transition-all duration-300 cursor-pointer ${
                    isSpinning 
                      ? 'scale-110 animate-smooth-shake' 
                      : 'hover:scale-105 hover:animate-smooth-shake group-hover/gacha-container:animate-gentle-float-shake'
                  }`}
                  onClick={handleSpinGachapon}
                  title="คลิกที่เครื่องกาชาปองเพื่อสุ่มการ์ด!"
                >
                  <img
                    src="https://s.imgz.io/2026/10/16/-11170190f364465d4.png"
                    alt="Palad Gachapon Machine"
                    className="w-40 sm:w-48 lg:w-52 h-auto object-contain select-none drop-shadow-lg"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.indexOf('gachapon_banner') === -1) {
                        target.src = '/gachapon_banner.png';
                      }
                    }}
                  />
                  {/* Floating heart sticker next to mascot */}
                  <div className="absolute top-8 right-2 text-rose-500 text-xl animate-bounce select-none pointer-events-none">
                    ❤️
                  </div>
                </div>
              </div>

              {/* Note Card: Sticky Note / Healing Quote Card (No Border, Soft Shadow) */}
              <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-center">
                <div className="w-full bg-white rounded-3xl p-6 sm:p-7 border-0 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] relative transition-all duration-300 min-h-[200px] sm:min-h-[230px] flex flex-col justify-between group/quote">
                  
                  {/* Left Quotation Mark in elegant soft rose/amber */}
                  <span className="absolute top-3 left-4 text-4xl sm:text-5xl font-serif text-rose-300/80 leading-none select-none pointer-events-none">
                    “
                  </span>

                  {/* Right Quotation Mark in elegant soft rose/amber */}
                  <span className="absolute bottom-3 right-4 text-4xl sm:text-5xl font-serif text-rose-300/80 leading-none select-none pointer-events-none">
                    ”
                  </span>

                  {/* Card Category Tag & Save Bookmark */}
                  <div className="flex items-center justify-between mb-3 z-10 pl-6 pr-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600">
                      {currentCard.categoryLabel}
                    </span>
                    <button
                      onClick={() => handleToggleSave(currentCard.id)}
                      className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title={savedCards.includes(currentCard.id) ? 'บันทึกแล้ว' : 'บันทึกการ์ดใบนี้'}
                    >
                      {savedCards.includes(currentCard.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-rose-500 fill-rose-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Large Quote Text */}
                  <div className="my-auto px-5 sm:px-7 text-center z-10 py-2">
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-relaxed font-['Prompt',sans-serif]">
                      {currentCard.text}
                    </p>
                    {currentCard.subtext && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal">
                        {currentCard.subtext}
                      </p>
                    )}
                    <span className="inline-block mt-3 text-2xl sm:text-3xl animate-bounce">
                      {currentCard.emoji}
                    </span>
                  </div>

                  {/* Action row on card */}
                  <div className="flex items-center justify-between pt-3 border-0 text-xs text-slate-400 z-10">
                    <span className="font-medium">การ์ดที่ {currentIndex + 1} / {HEALING_CARDS.length}</span>
                    <button
                      onClick={() => handleCopyQuote(currentCard)}
                      className="inline-flex items-center gap-1.5 hover:text-slate-800 font-medium transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-50"
                    >
                      {copiedId === currentCard.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 font-bold">คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>คัดลอกข้อความ</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Pagination Controls below the Note Card */}
                <div className="flex items-center justify-center gap-3 mt-3.5 select-none">
                  <button
                    onClick={handlePrevCard}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="การ์ดก่อนหน้า"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map((dotIdx) => {
                      const isActive = (currentIndex % 3) === dotIdx;
                      return (
                        <button
                          key={dotIdx}
                          onClick={() => setCurrentIndex((prev) => Math.floor(prev / 3) * 3 + dotIdx)}
                          className={`h-2.5 rounded-full transition-all cursor-pointer ${
                            isActive 
                              ? 'w-6 bg-slate-900' 
                              : 'w-2 bg-slate-200 hover:bg-slate-300'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextCard}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="การ์ดถัดไป"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* ======================================================================= */}
            {/* RIGHT COLUMN: Actions & Handwritten Header (Span 3)                     */}
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
                  className="w-full py-3.5 px-6 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-75"
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
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
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
                      ? 'bg-slate-800 text-white font-bold'
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
                        ? 'bg-slate-50 border-slate-900 shadow-sm ring-1 ring-slate-900'
                        : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-2.5">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                          {card.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleSave(card.id)}
                            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition cursor-pointer"
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

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => {
                          const idx = HEALING_CARDS.findIndex((c) => c.id === card.id);
                          if (idx !== -1) setCurrentIndex(idx);
                          setIsAllCardsModalOpen(false);
                        }}
                        className="text-slate-800 hover:text-black font-bold underline cursor-pointer"
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

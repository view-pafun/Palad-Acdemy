import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { EventItem } from '../types';

interface UpcomingEventsSliderProps {
  events: EventItem[];
  onSelectEvent?: (event: EventItem) => void;
  onExploreAllEvents?: () => void;
}

export const UpcomingEventsSlider: React.FC<UpcomingEventsSliderProps> = ({
  events,
  onSelectEvent,
  onExploreAllEvents,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [registeredMsg, setRegisteredMsg] = useState<string | null>(null);

  // Fallback high-res events if list is empty
  const displayEvents: EventItem[] = events && events.length > 0 ? events : [
    {
      id: 'ev-slide-1',
      title: 'Social Innovation Camp 2026: ค่ายระดมความคิดปั้นนวัตกรรมชุมชนอุดรธานี',
      type: 'Onsite',
      date: '15 - 17 พฤศจิกายน 2569',
      time: '09:00 - 17:00 น.',
      location: 'หอประชุมใหญ่ อาคารเฉลิมพระเกียรติ มรภ.อุดรธานี',
      speaker: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
      speakerTitle: 'หัวหน้าโครงการพัฒนาทักษะและการเรียนรู้ UDRU',
      seatsTotal: 120,
      seatsBooked: 96,
      category: 'แฮกกาธอน & เวิร์กช็อป',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
      description: 'เรียนรู้กระบวนการ Design Thinking ร่วมกับเครื่องมือ 4 ประการในการแก้ปัญหาเชิงพื้นที่จริง ชิงทุนต่อยอดผลงานกว่า 100,000 บาท',
      tags: ['มีเกียรติบัตร', 'อาหารฟรี', 'สะสม XP']
    },
    {
      id: 'ev-slide-2',
      title: 'Life Design Clinic & Webinar: เจาะลึกอาชีพแห่งอนาคตในยุค AI Disrupt',
      type: 'Online',
      date: '28 พฤศจิกายน 2569',
      time: '19:00 - 21:00 น.',
      location: 'Live Zoom Meeting & ถ่ายทอดสดทางเว็บไซต์',
      speaker: 'อ. รุ่งอรุณ เมธาวี',
      speakerTitle: 'ผู้เชี่ยวชาญการแนะแนวอาชีพและจิตวิทยา',
      seatsTotal: 500,
      seatsBooked: 432,
      category: 'สัมมนาออนไลน์',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      description: 'วิเคราะห์ทักษะข้ามศาสตร์ที่ตลาดต้องการ ถอดรหัสเป้าหมายชีวิต 4 มิติ และสร้างพิมพ์เขียวชีวิต (Life Blueprint) ร่วมกับอาจารย์ที่ปรึกษา',
      tags: ['ฟรีไม่มีค่าใช้จ่าย', 'ถามตอบสด']
    },
    {
      id: 'ev-slide-3',
      title: 'ตลาดนัดนวัตกร UDRU แฟร์ 2026: แสดงผลงานจริงและเวิร์กช็อปแก้ปัญหาชุมชน',
      type: 'Hybrid',
      date: '10 ธันวาคม 2569',
      time: '10:00 - 18:00 น.',
      location: 'ลานกิจกรรมหน้าหอสมุดกลาง มรภ.อุดรธานี',
      speaker: 'ทีมตัวแทนนักศึกษา 12 คณะ',
      speakerTitle: 'ผู้นำเสนอผลงานนวัตกรรมต้นแบบ',
      seatsTotal: 300,
      seatsBooked: 240,
      category: 'นิทรรศการ & โชว์เคส',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      description: 'สัมผัสและทดลองใช้นวัตกรรมแก้ปัญหาท้องถิ่น ชิมผลิตภัณฑ์ชุมชนที่นักศึกษาพัฒนาขึ้นจริง พร้อมรับฟังแรงบันดาลใจจากรุ่นพี่สู่รุ่นน้อง',
      tags: ['ของรางวัล', 'เปิดรับทุกคน']
    }
  ];

  const total = displayEvents.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Auto-advance slides every 6 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const currentEvent = displayEvents[currentIndex];

  return (
    <section className="py-14 sm:py-20 bg-white relative overflow-hidden font-['Prompt',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4 font-['Mitr',sans-serif]">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              กิจกรรมและเวิร์กช็อปที่กำลังจะมาถึง
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal font-['Sriracha',cursive]">
              เปิดโลกการเรียนรู้ ลงมือปฏิบัติจริง และสะสมประสบการณ์ร่วมกับเพื่อนๆ ทุกคณะ
            </p>
          </div>

          {onExploreAllEvents && (
            <button
              onClick={onExploreAllEvents}
              className="self-start sm:self-auto inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-950 hover:text-amber-600 transition cursor-pointer"
            >
              <span>ดูกิจกรรมทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Carousel Container (Large rounded rectangular image component border-radius: 1.5rem or more) */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full rounded-[2rem] overflow-hidden min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] shadow-xl group"
        >
          {/* Background Images with smooth fade/scale transition */}
          {displayEvents.map((event, idx) => (
            <div
              key={event.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              {/* Subtle bottom-to-top dark linear gradient overlay for 100% text readability */}
              <div 
                aria-hidden="true" 
                className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 via-40% to-transparent pointer-events-none" 
              />
            </div>
          ))}

          {/* Navigation Controls: Semi-transparent circular Next/Prev buttons overlaying left & right edges */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Content Overlay directly on top of the image layout near the bottom half */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-10 lg:p-14 flex flex-col justify-end">
            
            {/* Top Badge & Organizer Row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {/* Styled Badge showing Free or Type */}
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs border border-amber-300">
                เข้าร่วมฟรี (Free)
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                {currentEvent.category}
              </span>

              {/* Organizer Placeholder */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                  U
                </span>
                <span>จัดโดย: {currentEvent.speaker}</span>
              </div>
            </div>

            {/* 1. Event Title: Bold, premium typography */}
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight max-w-4xl drop-shadow-sm mb-3">
              {currentEvent.title}
            </h3>

            {/* 3. Short Description: Clean excerpt text (truncated to max 2 lines) */}
            <p className="line-clamp-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mb-6 font-normal drop-shadow-2xs">
              {currentEvent.description}
            </p>

            {/* Bottom Row: Event Details Grid + Sleek Fully-rounded CTA Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/15">
              
              {/* 4. Event Details Grid: Minimalist icons */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{currentEvent.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="line-clamp-1">{currentEvent.location}</span>
                </div>

                {/* Number of Attendees */}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>ผู้เข้าร่วม {currentEvent.seatsBooked}/{currentEvent.seatsTotal} ที่นั่ง</span>
                </div>
              </div>

              {/* 5. CTA Button: Sleek fully-rounded 'Join Event' button (#FFC800 with no black border, turns black on hover with white text) */}
              <button
                onClick={() => {
                  if (onSelectEvent) {
                    onSelectEvent(currentEvent);
                  } else {
                    setRegisteredMsg(`คุณได้ส่งคำขอเข้าร่วมกิจกรรม "${currentEvent.title}" เรียบร้อยแล้ว`);
                    setTimeout(() => setRegisteredMsg(null), 3500);
                  }
                }}
                className="self-start sm:self-auto px-7 py-3 rounded-full bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2 border-0 font-['Mitr',sans-serif] group/cta"
              >
                <span>{registeredMsg ? 'ลงทะเบียนแล้ว ✓' : 'ลงทะเบียนเข้าร่วม (Join Event)'}</span>
                <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 group-hover/cta:text-white transition-all" />
              </button>
            </div>
          </div>

          {registeredMsg && (
            <div className="absolute top-4 right-4 z-40 bg-slate-950 text-white px-4 py-2 rounded-2xl shadow-xl border border-amber-400 text-xs font-semibold animate-in fade-in">
              {registeredMsg}
            </div>
          )}

          {/* Bottom Center Pagination Dots: Active dot smoothly stretches into a horizontal capsule line */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {displayEvents.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-white shadow-sm'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState, useRef, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  Ticket,
  X,
  QrCode,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CalendarDays,
  Check
} from 'lucide-react';
import { EventItem } from '../types';

interface UpcomingEventsSliderProps {
  events: EventItem[];
  onSelectEvent?: (event: EventItem) => void;
  onExploreAllEvents?: () => void;
}

const MONTH_NAMES_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = [
  { th: 'อา.', en: 'SUN' },
  { th: 'จ.', en: 'MON' },
  { th: 'อ.', en: 'TUE' },
  { th: 'พ.', en: 'WED' },
  { th: 'พฤ.', en: 'THU' },
  { th: 'ศ.', en: 'FRI' },
  { th: 'ส.', en: 'SAT' },
];

export const UpcomingEventsSlider: React.FC<UpcomingEventsSliderProps> = ({
  events,
  onSelectEvent,
  onExploreAllEvents,
}) => {
  // Calendar state for the landing page section (defaults to October/November 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 10 = November, 9 = October
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-11-23');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('event-cwie-1');

  // Registration modal states
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [ticketData, setTicketData] = useState<{ name: string; email: string; phone: string; faculty: string; ticketId: string } | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formFaculty, setFormFaculty] = useState('');

  // Hover popover for calendar preview
  const [hoveredEvent, setHoveredEvent] = useState<{ event: EventItem; x: number; y: number } | null>(null);

  // References to event cards for smooth auto-scrolling
  const eventCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  // Parse ISO date helper
  const getEventDateIso = (event: EventItem): string => {
    if (event.isoDate) return event.isoDate;
    if (event.date.includes('23') && event.date.includes('พฤศจิกายน')) return '2026-11-23';
    if (event.date.includes('3') && event.date.includes('ตุลาคม')) return '2026-10-03';
    if (event.date.includes('22') && event.date.includes('ตุลาคม')) return '2026-10-22';
    if (event.date.includes('15') && event.date.includes('พฤศจิกายน')) return '2026-11-15';
    if (event.date.includes('8') && event.date.includes('พฤศจิกายน')) return '2026-11-08';
    if (event.date.includes('28') && event.date.includes('พฤศจิกายน')) return '2026-11-28';
    if (event.date.includes('10') && event.date.includes('พฤศจิกายน')) return '2026-11-10';
    return '2026-11-15';
  };

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      dayNumber: number;
      isCurrentMonth: boolean;
      isoDate: string;
      events: EventItem[];
    }[] = [];

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const iso = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNumber: dayNum,
        isCurrentMonth: false,
        isoDate: iso,
        events: []
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const iso = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter((ev) => getEventDateIso(ev) === iso);
      days.push({
        dayNumber: day,
        isCurrentMonth: true,
        isoDate: iso,
        events: dayEvents
      });
    }

    // Next month padding to fill complete grid
    const remainingSlots = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remainingSlots; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const iso = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        dayNumber: day,
        isCurrentMonth: false,
        isoDate: iso,
        events: []
      });
    }

    return days;
  }, [currentYear, currentMonth, events]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(10);
    setSelectedDate('2026-11-23');
    setSelectedEventId('event-cwie-1');
    scrollToEvent('event-cwie-1');
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollState = () => {
    if (listContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = listContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll to event in the left list when clicked on calendar
  const scrollToEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    const targetElement = eventCardRefs.current[eventId];
    if (targetElement && listContainerRef.current) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
      setTimeout(checkScrollState, 350);
    }
  };

  const scrollPrevCard = () => {
    if (listContainerRef.current) {
      const container = listContainerRef.current;
      const cardWidth = container.firstElementChild?.clientWidth || 360;
      container.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
      setTimeout(checkScrollState, 350);
    }
  };

  const scrollNextCard = () => {
    if (listContainerRef.current) {
      const container = listContainerRef.current;
      const cardWidth = container.firstElementChild?.clientWidth || 360;
      container.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
      setTimeout(checkScrollState, 350);
    }
  };

  const handleDayClick = (dayObj: { isoDate: string; events: EventItem[] }) => {
    setSelectedDate(dayObj.isoDate);
    if (dayObj.events.length > 0) {
      const firstEvent = dayObj.events[0];
      scrollToEvent(firstEvent.id);
    }
  };

  const handleEventChipClick = (e: React.MouseEvent, event: EventItem) => {
    e.stopPropagation();
    const iso = getEventDateIso(event);
    setSelectedDate(iso);
    scrollToEvent(event.id);
  };

  const handleCardClick = (event: EventItem) => {
    const iso = getEventDateIso(event);
    setSelectedDate(iso);
    setSelectedEventId(event.id);

    const [y, m] = iso.split('-').map(Number);
    if (y && m) {
      setCurrentYear(y);
      setCurrentMonth(m - 1);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    setTicketData({
      name: formName,
      email: formEmail,
      phone: formPhone || '08X-XXX-XXXX',
      faculty: formFaculty || 'มหาวิทยาลัยราชภัฏอุดรธานี',
      ticketId: `UDRU-${Math.floor(100000 + Math.random() * 900000)}`
    });
    setRegistrationSuccess(true);
  };

  const closeRegistration = () => {
    setRegisteringEvent(null);
    setRegistrationSuccess(false);
    setTicketData(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormFaculty('');
  };

  return (
    <section className="py-14 sm:py-20 bg-white relative overflow-hidden font-['Prompt','Kanit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ปฏิทินกิจกรรม & เวิร์กช็อป</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
              กิจกรรมและเวิร์กช็อปที่กำลังจะมาถึง
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              คลิกเลือกวันในปฏิทินเพื่อดูรายละเอียดกิจกรรม หรือเลื่อนดูเวิร์กช็อปที่เปิดรับสมัครในฝั่งซ้ายมือ
            </p>
          </div>

          {onExploreAllEvents && (
            <button
              onClick={onExploreAllEvents}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-xs hover:shadow-md"
            >
              <span>ดูกิจกรรมทั้งหมด (Grid View)</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          )}
        </div>

        {/* Side-by-Side Dual Pane Layout (Left: Scrollable Cards, Right: Calendar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT SIDE: Horizontal Card Carousel */}
          <div className="lg:col-span-5 flex flex-col space-y-4 relative min-w-0">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  รายการเวิร์กช็อป & กิจกรรม
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                  {events.length}
                </span>
              </div>

              {/* Desktop Navigation Arrow Controls (Header) */}
              <div className="hidden lg:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={scrollPrevCard}
                  disabled={!canScrollLeft}
                  title="การ์ดก่อนหน้า"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 shadow-xs transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollNextCard}
                  disabled={!canScrollRight}
                  title="การ์ดถัดไป"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 shadow-xs transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile/Tablet Swipe Hint */}
              <span className="text-[11px] text-slate-400 lg:hidden">
                ปัดซ้าย-ขวาเพื่อดูการ์ด
              </span>
            </div>

            {/* Carousel Container with Side Navigation Arrows */}
            <div className="relative group/carousel min-w-0">
              {/* Floating Side Left Arrow (Desktop only) */}
              <button
                type="button"
                onClick={scrollPrevCard}
                disabled={!canScrollLeft}
                aria-label="Previous card"
                className="hidden lg:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 shadow-md hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none items-center justify-center text-slate-800 transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>

              {/* Floating Side Right Arrow (Desktop only) */}
              <button
                type="button"
                onClick={scrollNextCard}
                disabled={!canScrollRight}
                aria-label="Next card"
                className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 shadow-md hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none items-center justify-center text-slate-800 transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>

              {/* Horizontal Scrollable Container with Scroll Snap */}
              <div
                ref={listContainerRef}
                onScroll={checkScrollState}
                className="flex flex-row overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-3 pt-1 px-1 focus:outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {events.map((event) => {
                  const seatsLeft = event.seatsTotal - event.seatsBooked;
                  const isFull = seatsLeft <= 0;
                  const isSelected = selectedEventId === event.id;

                  return (
                    <div
                      key={event.id}
                      ref={(el) => {
                        eventCardRefs.current[event.id] = el;
                      }}
                      onClick={() => handleCardClick(event)}
                      className={`w-[88%] sm:w-[360px] lg:w-full shrink-0 snap-start group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 shadow-lg ring-2 ring-emerald-500/20 translate-y-[-2px]'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      {/* Top Image with Badges */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Onsite pill */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white shadow-xs">
                            {event.type}
                          </span>
                        </div>

                        {/* Status pill */}
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                              event.statusBadge === 'หมดเวลารับสมัคร'
                                ? 'bg-slate-800/90 text-slate-300'
                                : 'bg-emerald-500 text-white'
                            }`}
                          >
                            {event.statusBadge || 'กำลังเปิดรับสมัคร'}
                          </span>
                        </div>

                        {/* Date pill over image */}
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/95 text-slate-800 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                            <CalendarIcon className="w-3 h-3 text-emerald-600" />
                            <span>{event.date}</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                            {event.title}
                          </h4>

                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2 mb-2.5">
                            {event.price && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  event.price === 'เข้าร่วมฟรี'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                    : 'bg-pink-50 text-pink-700 border border-pink-100'
                                }`}
                              >
                                {event.price}
                              </span>
                            )}
                            {event.criteriaBadge && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
                                {event.criteriaBadge}
                              </span>
                            )}
                          </div>

                          {/* Details box */}
                          <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 my-2.5">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-[11px]">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="text-[11px] truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="text-[11px] truncate">วิทยากร: {event.speaker}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer & Buttons */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2.5">
                            <span className="text-slate-500 text-[11px]">ที่นั่งคงเหลือ:</span>
                            <span
                              className={`font-bold font-mono text-xs ${
                                seatsLeft <= 10 ? 'text-rose-600' : 'text-emerald-700'
                              }`}
                            >
                              {seatsLeft} / {event.seatsTotal} ที่
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRegisteringEvent(event);
                              }}
                              disabled={isFull || event.statusBadge === 'หมดเวลารับสมัคร'}
                              className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                            >
                              <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                              <span>
                                {event.statusBadge === 'หมดเวลารับสมัคร'
                                  ? 'หมดเวลารับสมัคร'
                                  : isFull
                                  ? 'ที่นั่งเต็มแล้ว'
                                  : 'ลงทะเบียนเข้าร่วมฟรี'}
                              </span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(event);
                              }}
                              title="ดูบนปฏิทิน"
                              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Monthly Calendar */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={handlePrevMonth}
                    title="เดือนก่อนหน้า"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    title="เดือนถัดไป"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleGoToToday}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  วันนี้ (Today)
                </button>

                <div className="text-base sm:text-lg font-extrabold text-slate-900 ml-1">
                  <span>{MONTH_NAMES_TH[currentMonth]} {currentYear + 543}</span>
                  <span className="text-xs text-slate-400 font-normal ml-1.5 hidden sm:inline">
                    ({MONTH_NAMES_EN[currentMonth]} {currentYear})
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>คลิกวันเพื่อเลื่อนดูกิจกรรม</span>
              </div>
            </div>

            {/* Days Grid */}
            <div className="mt-4">
              {/* Weekday Names */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                {WEEKDAY_NAMES.map((w, idx) => (
                  <div
                    key={w.en}
                    className={`py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                      idx === 0
                        ? 'text-rose-500'
                        : idx === 6
                        ? 'text-indigo-500'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="hidden sm:inline">{w.en}</span>
                    <span className="sm:hidden">{w.th}</span>
                  </div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays.map((dayObj, index) => {
                  const hasEvents = dayObj.events.length > 0;
                  const isDaySelected = selectedDate === dayObj.isoDate;
                  const isToday =
                    dayObj.isoDate === '2026-11-23' ||
                    dayObj.isoDate === new Date().toISOString().split('T')[0];

                  return (
                    <div
                      key={index}
                      onClick={() => handleDayClick(dayObj)}
                      className={`min-h-[75px] sm:min-h-[92px] p-1.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer relative group ${
                        !dayObj.isCurrentMonth
                          ? 'bg-slate-50/40 border-slate-100 text-slate-300 opacity-60'
                          : isDaySelected
                          ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : hasEvents
                          ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                            isToday
                              ? 'bg-slate-900 text-white'
                              : isDaySelected
                              ? 'text-emerald-700 bg-emerald-100'
                              : dayObj.isCurrentMonth
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {dayObj.dayNumber}
                        </span>

                        {hasEvents && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 sm:hidden" />
                        )}
                      </div>

                      {/* Events Mini Chips */}
                      <div className="mt-1 space-y-1 flex-1 overflow-hidden">
                        {dayObj.events.slice(0, 2).map((ev) => {
                          const isEventActive = selectedEventId === ev.id;
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => handleEventChipClick(e, ev)}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoveredEvent({
                                  event: ev,
                                  x: rect.left,
                                  y: rect.bottom + 8
                                });
                              }}
                              onMouseLeave={() => setHoveredEvent(null)}
                              className={`px-1.5 py-0.5 rounded-md text-[10px] leading-tight truncate transition cursor-pointer flex items-center gap-1 ${
                                isEventActive
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-medium'
                              }`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full shrink-0 ${
                                  isEventActive ? 'bg-white' : 'bg-emerald-500'
                                }`}
                              />
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}

                        {dayObj.events.length > 2 && (
                          <div className="text-[9px] font-bold text-slate-400 px-1">
                            +{dayObj.events.length - 2} อื่นๆ
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom footnote */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  วันที่มีเวิร์กช็อป
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-slate-900" />
                  วันนี้
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Popover Tooltip for Calendar Chips */}
        {hoveredEvent && (
          <div
            className="fixed z-50 pointer-events-none shadow-xl bg-white rounded-2xl border border-slate-200 p-3 max-w-xs w-68 animate-in fade-in zoom-in-95"
            style={{
              left: Math.min(hoveredEvent.x, window.innerWidth - 290),
              top: Math.min(hoveredEvent.y, window.innerHeight - 230)
            }}
          >
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-2 bg-slate-100">
              <img
                src={hoveredEvent.event.image}
                alt={hoveredEvent.event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{hoveredEvent.event.date} • {hoveredEvent.event.time}</span>
            </div>
            <h5 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug">
              {hoveredEvent.event.title}
            </h5>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              {hoveredEvent.event.description}
            </p>
          </div>
        )}

        {/* Registration Modal & Official e-Ticket */}
        {registeringEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-auto">
              {!registrationSuccess ? (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-emerald-600" />
                      <span>ลงทะเบียนเข้าร่วมกิจกรรม</span>
                    </h3>
                    <button
                      onClick={closeRegistration}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4 text-xs">
                    <div className="font-bold text-slate-900 line-clamp-1">{registeringEvent.title}</div>
                    <div className="text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{registeringEvent.date} ({registeringEvent.time})</span>
                    </div>
                    <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span className="truncate">{registeringEvent.location}</span>
                    </div>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ชื่อ - นามสกุล *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="นาย/นางสาว..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        อีเมลสำหรับรับบัตรเข้างาน *
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="yourname@gmail.com หรือ saraban@udru.ac.th"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        เบอร์โทรศัพท์ติดต่อ
                      </label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="08X-XXX-XXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        คณะ / หน่วยงาน
                      </label>
                      <input
                        type="text"
                        value={formFaculty}
                        onChange={(e) => setFormFaculty(e.target.value)}
                        placeholder="เช่น คณะวิทยาศาสตร์ หรือบุคคลทั่วไป"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeRegistration}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                      >
                        ยืนยันการลงทะเบียน
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* e-Ticket Generated */
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">
                    ลงทะเบียนสำเร็จเรียบร้อย! 🎉
                  </h3>
                  <p className="text-xs text-slate-500">
                    นี่คือบัตรอิเล็กทรอนิกส์ (e-Ticket) สำหรับแสดงหน้างานหรือล็อกอินเข้าฟังออนไลน์
                  </p>

                  <div className="bg-slate-900 text-white rounded-3xl p-5 text-left relative overflow-hidden border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                        OFFICIAL E-TICKET
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {ticketData?.ticketId}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm mt-3 line-clamp-2">
                      {registeringEvent.title}
                    </h4>

                    <div className="mt-3 space-y-1 text-xs text-slate-300">
                      <p>👤 ผู้ถือบัตร: <span className="text-white font-semibold">{ticketData?.name}</span></p>
                      <p>📅 วันที่: {registeringEvent.date}</p>
                      <p>📍 สถานที่: {registeringEvent.location}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-slate-800 flex items-center justify-between">
                      <div className="text-[10px] text-slate-400">
                        สแกน QR Code เพื่อเช็คอินเข้างาน
                      </div>
                      <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center text-slate-900">
                        <QrCode className="w-10 h-10" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={closeRegistration}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                  >
                    เสร็จสิ้น
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

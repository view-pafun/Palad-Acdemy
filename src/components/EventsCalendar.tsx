import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  Ticket,
  X,
  QrCode,
  Search,
  Sparkles,
  Filter,
  Check,
  ChevronRight
} from 'lucide-react';
import { EventItem } from '../types';

interface EventsCalendarProps {
  events: EventItem[];
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({ events }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Onsite' | 'Online' | 'Hybrid'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Registration modal states
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [ticketData, setTicketData] = useState<{
    name: string;
    email: string;
    phone: string;
    faculty: string;
    ticketId: string;
  } | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formFaculty, setFormFaculty] = useState('');

  // Extract categories
  const categories = ['All', 'หลักสูตรอบรมเชิงลึก', 'แคมป์เชิงปฏิบัติการ', 'การพัฒนาทักษะหัวหน้างาน', 'เวิร์กช็อป & แฮกกาธอน', 'สัมมนาออนไลน์', 'นิทรรศการ & โชว์เคส'];

  const filteredEvents = events.filter((ev) => {
    const matchType = selectedFilter === 'All' || ev.type === selectedFilter;
    const matchCat = selectedCategory === 'All' || ev.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      ev.speaker.toLowerCase().includes(q);

    return matchType && matchCat && matchSearch;
  });

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
    <div className="py-10 sm:py-16 bg-[#f8fafc] min-h-screen font-['Prompt','Kanit',sans-serif] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Styled like image_21c5683b.png banner */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>เวิร์กชอป & กิจกรรมอบรมเชิงปฏิบัติการ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            เวิร์กชอป
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            กิจกรรมอบรมที่เปิดโอกาสให้ทุกคนได้พัฒนาทักษะ ค้นหาศักยภาพ และขยายมุมมองการเรียนรู้ในยุคดิจิทัล
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อเวิร์กช็อป, วิทยากร, สถานที่..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
              {(['All', 'Onsite', 'Online', 'Hybrid'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedFilter(mode)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    selectedFilter === mode
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode === 'All' ? 'ทั้งหมด' : mode === 'Onsite' ? 'Onsite' : mode === 'Online' ? 'Online' : 'Hybrid'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
            <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> หมวดหมู่:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'ทุกหมวดหมู่' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Responsive Grid of Cards - Exactly Matching image_21c5683b.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => {
            const seatsLeft = event.seatsTotal - event.seatsBooked;
            const isFull = seatsLeft <= 0;
            const isClosed = event.statusBadge === 'หมดเวลารับสมัคร';

            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Header with Overlaid Pills */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Top-Left Onsite Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e37112] text-white shadow-xs">
                      {event.type}
                    </span>
                  </div>

                  {/* Top-Right Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                        isClosed
                          ? 'bg-[#334155] text-white'
                          : 'bg-[#10b981] text-white'
                      }`}
                    >
                      {event.statusBadge || 'กำลังเปิดรับสมัคร'}
                    </span>
                  </div>

                  {/* Bottom-Left Date Pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-semibold px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{event.date}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug line-clamp-2 mb-3">
                      {event.title}
                    </h3>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {event.price && (
                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                            event.price === 'เข้าร่วมฟรี'
                              ? 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe]'
                              : 'bg-[#fdf2f8] text-[#db2777] border border-[#fbcfe8]'
                          }`}
                        >
                          {event.price}
                        </span>
                      )}

                      {event.criteriaBadge && (
                        <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{event.criteriaBadge}</span>
                        </span>
                      )}

                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                          isClosed
                            ? 'bg-[#1e293b] text-white'
                            : 'bg-[#059669] text-white'
                        }`}
                      >
                        {event.statusBadge || 'กำลังเปิดรับสมัคร'}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Info Details Box */}
                    <div className="space-y-2 text-xs text-slate-600 mb-4 bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">วิทยากร: {event.speaker}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Seats Indicator */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-slate-500">ที่นั่งคงเหลือ:</span>
                      <span
                        className={`font-bold font-mono ${
                          isFull
                            ? 'text-slate-400'
                            : seatsLeft <= 10
                            ? 'text-rose-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {seatsLeft} / {event.seatsTotal} ที่
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setRegisteringEvent(event)}
                      disabled={isFull || isClosed}
                      className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs ${
                        isFull || isClosed
                          ? 'bg-[#cbd5e1] text-[#64748b] cursor-not-allowed'
                          : 'bg-[#0f172a] hover:bg-[#1e293b] text-white cursor-pointer hover:shadow-md'
                      }`}
                    >
                      <Ticket className="w-4 h-4 text-emerald-400" />
                      <span>
                        {isClosed
                          ? 'หมดเวลารับสมัคร'
                          : isFull
                          ? 'ที่นั่งเต็มแล้ว'
                          : 'ลงทะเบียนเข้าร่วมฟรี'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
                        placeholder="เช่น คณะวิทยาศาสตร์ หรือหน่วยงานภายนอก"
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
    </div>
  );
};

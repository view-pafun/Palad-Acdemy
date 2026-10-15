import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Clock, CheckCircle2, Ticket, X, QrCode } from 'lucide-react';
import { EventItem } from '../types';

interface EventsCalendarProps {
  events: EventItem[];
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({ events }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Onsite' | 'Online'>('All');
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [ticketData, setTicketData] = useState<{ name: string; email: string; ticketId: string } | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formFaculty, setFormFaculty] = useState('');

  const filteredEvents = events.filter((ev) => {
    if (selectedFilter === 'All') return true;
    return ev.type === selectedFilter || ev.type === 'Hybrid';
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    setTicketData({
      name: formName,
      email: formEmail,
      ticketId: `TICK-${Math.floor(100000 + Math.random() * 900000)}`
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
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold mb-3">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>กิจกรรมและเวิร์กช็อปพัฒนาทักษะ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ปฏิทินกิจกรรม <span className="text-emerald-600">Events & Workshops</span>
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            ร่วมสัมมนา แฮกกาธอน และเวิร์กช็อปทั้งรูปแบบ Onsite มรภ.อุดรธานี และ Online ผ่านเว็บไซต์ พร้อมรับเกียรติบัตร
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
            {(['All', 'Onsite', 'Online'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedFilter(mode)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  selectedFilter === mode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'All' ? 'กิจกรรมทั้งหมด' : mode === 'Onsite' ? 'เข้าร่วมที่ มรภ.อุดรฯ (Onsite)' : 'เข้าร่วมออนไลน์ (Online)'}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => {
            const seatsLeft = event.seatsTotal - event.seatsBooked;
            const isFull = seatsLeft <= 0;

            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md text-white ${
                    event.type === 'Onsite' ? 'bg-amber-600' : event.type === 'Online' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {event.type}
                  </span>

                  <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                    {event.date}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2 leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
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
                        <span>วิทยากร: {event.speaker}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Seats indicator */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-slate-500">ที่นั่งคงเหลือ:</span>
                      <span className={`font-bold font-mono ${seatsLeft < 20 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {seatsLeft} / {event.seatsTotal} ที่
                      </span>
                    </div>

                    <button
                      onClick={() => setRegisteringEvent(event)}
                      disabled={isFull}
                      className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                    >
                      <Ticket className="w-4 h-4 text-emerald-400" />
                      <span>{isFull ? 'ที่นั่งเต็มแล้ว' : 'ลงทะเบียนเข้าร่วมฟรี'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Registration Modal & e-Ticket */}
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

                  <p className="text-xs text-slate-600 mb-4 font-medium line-clamp-1">
                    งาน: {registeringEvent.title}
                  </p>

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
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                        placeholder="เช่น คณะวิทยาศาสตร์ มรภ.อุดรธานี"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeRegistration}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-sm"
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

                  {/* e-Ticket Canvas */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 text-left relative overflow-hidden border border-slate-800 shadow-md">
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
                        สแกน QR Code เพื่อเช็คอิน
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

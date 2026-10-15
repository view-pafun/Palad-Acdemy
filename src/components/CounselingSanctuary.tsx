import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Send, 
  MessageSquare, 
  Star,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { Mentor, CounselingBooking } from '../types';

interface CounselingSanctuaryProps {
  mentors: Mentor[];
}

export const CounselingSanctuary: React.FC<CounselingSanctuaryProps> = ({ mentors }) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  // Active bookings list
  const [bookings, setBookings] = useState<CounselingBooking[]>([
    {
      id: 'book-sample',
      mentorId: 'mentor-2',
      mentorName: 'อ. รุ่งอรุณ เมธาวี',
      studentName: 'นศ. ตัวอย่าง (คุณ)',
      studentEmail: 'student@udru.ac.th',
      date: 'พรุ่งนี้',
      timeSlot: '13:30 - 14:30',
      topic: 'ปรึกษาความเครียดเรื่องการเลือกสายงานและโปรเจกต์จบ',
      status: 'confirmed',
      meetingCode: 'SANCTUARY-ROOM-882'
    }
  ]);

  // Virtual Web Call Room Simulation
  const [activeCallBooking, setActiveCallBooking] = useState<CounselingBooking | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'ระบบ', text: 'ยินดีต้อนรับสู่พื้นที่ปลอดภัย ทุกบทสนทนาถูกเข้ารหัสและรักษาความลับ 100%', time: '13:30' },
    { sender: 'อาจารย์ที่ปรึกษา', text: 'สวัสดีครับ ยินดีที่ได้คุยกันนะ วันนี้มีเรื่องอะไรที่อยากให้ครูช่วยรับฟังบ้าง เล่าได้ตามสบายเลยนะ', time: '13:31' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !selectedSlot || !topic.trim()) return;

    const newBooking: CounselingBooking = {
      id: `book-${Date.now()}`,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      studentName: studentName.trim() || 'นักศึกษาผู้ขอรับคำปรึกษา',
      studentEmail: studentEmail.trim() || 'student@udru.ac.th',
      date: selectedDay || 'วันพุธที่จะถึง',
      timeSlot: selectedSlot,
      topic: topic.trim(),
      status: 'confirmed',
      meetingCode: `SANCTUARY-ROOM-${Math.floor(100 + Math.random() * 900)}`
    };

    setBookings([newBooking, ...bookings]);
    setSelectedMentor(null);
    setTopic('');
    setSelectedSlot('');
    setSelectedDay('');
    alert('จองคิวปรึกษาเรียบร้อยแล้ว! ระบบส่งลิงก์การนัดหมายไปที่อีเมลของคุณ');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages([
      ...chatMessages,
      { sender: 'คุณ (นักศึกษา)', text: newMessage.trim(), time: 'เมื่อสักครู่' }
    ]);
    setNewMessage('');

    // Simulated mentor empathetic reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: activeCallBooking?.mentorName || 'อาจารย์ที่ปรึกษา', 
          text: 'ครูเข้าใจความรู้สึกตรงนี้เลยครับ มันไม่ง่ายเลยที่จะแบกรับความคาดหวังไว้คนเดียว เรามาค่อยๆ แยกแยะปัญหาทีละข้อด้วยกันนะ', 
          time: 'เมื่อสักครู่' 
        }
      ]);
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen font-['Prompt',sans-serif]">
      {/* 1. [ส่วนที่ 1: Hero Section ด้านบนสุด] - Full Width Clean Image Banner with Soft Fade Out */}
      <section className="relative w-full h-[240px] sm:h-[340px] md:h-[420px] lg:h-[480px] xl:h-[520px] overflow-hidden m-0 p-0 border-0 bg-white">
        {/* Full Width Edge-to-Edge Image with Center Focus */}
        <img
          src="https://s.imgz.io/2026/10/01/White-Blue-and-Yellow-Illustrated-Mental-Health-Presentation-3ed33a233d06cfcbb.png"
          alt="ช่องทางพักใจ Safe Space Hero Banner"
          className="w-full h-full object-cover object-center block border-0 outline-hidden"
          loading="eager"
        />

        {/* Soft Edge / Color Blending: Multi-stop linear gradient fading out smoothly to pure white */}
        <div 
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 sm:h-32 md:h-44 bg-gradient-to-b from-transparent via-white/40 via-white/80 to-white pointer-events-none"
        />
      </section>

      {/* 2. [ส่วนที่ 2: Content Section ถัดลงมาด้านล่าง] - Two-Column Layout */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* ฝั่งซ้ายมือ (Left Column): Mental Health Graphic Illustration */}
            <div className="lg:col-span-5 flex justify-center items-center order-2 lg:order-1">
              <div className="relative group w-full max-w-sm sm:max-w-md lg:max-w-full">
                <div className="absolute -inset-3 bg-gradient-to-tr from-rose-200/40 via-amber-200/30 to-teal-200/40 rounded-[2.5rem] blur-xl opacity-60 group-hover:opacity-90 transition duration-700 pointer-events-none" />
                <img
                  src="https://s.imgz.io/2026/10/01/White-Blue-and-Yellow-Illustrated-Mental-Health-Presentation8b5649f5d7d5b162.png"
                  alt="Mental Health Illustration ช่องทางพักใจ Safe Space"
                  className="relative w-full h-auto object-contain rounded-3xl drop-shadow-lg transform transition-transform duration-500 group-hover:scale-102"
                />
              </div>
            </div>

            {/* ฝั่งขวามือ (Right Column): Service Copywriting */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5 order-1 lg:order-2 text-left">
              
              {/* [แท็กขนาดเล็กด้านบน] */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-bold shadow-2xs self-start">
                <span>💖</span>
                <span>พื้นที่ปลอดภัยและสุขภาวะใจ (Mind & Heart Sanctuary)</span>
              </div>

              {/* [หัวข้อหลัก / H1] */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                ช่องทางพักใจ <span className="text-[#e11d48]">Safe Space</span>
              </h1>

              {/* [ข้อความอธิบาย / Paragraph] */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                ปรึกษาปัญหาการเรียน การค้นหาตัวตน ความเครียด หรือการทำงานพัฒนาตนเองแบบตัวต่อตัว (1-on-1) กับอาจารย์ผู้เชี่ยวชาญ พร้อมระบบนัดหมายและโทรปรึกษาผ่านเว็บไซต์ ปลอดภัย เป็นความลับ 100%
              </p>

              {/* Security & Confidentiality Badges */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200 text-emerald-800 shadow-2xs">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> 
                  <span>ข้อมูลทุกอย่างเป็นความลับ 100%</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50/80 border border-rose-200 text-rose-800 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> 
                  <span>อาจารย์ผู้ให้คำปรึกษาผ่านการรับรอง</span>
                </span>
              </div>

              {/* [ปุ่มกด / CTA Button] */}
              <div className="pt-2">
                <a
                  href="#mentors-grid"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-rose-300" />
                  <span>เลือกอาจารย์และนัดหมายเวลา</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. [ส่วนที่ 3: ทำไมการปรึกษาถึงช่วยคุณได้] - Two-Column Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#faf9f6]/70 border-b border-rose-100/60 font-['Prompt',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Main Title */}
          <div className="text-center sm:text-left mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>ประโยชน์ของการปรึกษา (Benefits of Counseling)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              ทำไมการปรึกษาถึงช่วยคุณได้
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* ฝั่งซ้ายมือ (Left Column - Text Content: ข้อดี 3 ข้อ) - แสดงก่อนบนมือถือ (order-1) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 order-1">
              
              {/* ข้อที่ 1 */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/80 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-4 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-2xs">
                  01
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    ช่วยสะท้อนให้เห็นถึงคุณค่าของตัวเอง
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    การปรึกษาพูดคุยจะช่วยคุณสะท้อนสิ่งต่างๆ ในมุมมองที่คุณอาจไม่เคยเห็นมาก่อน ทำให้เห็นวิธีแก้ปัญหาใหม่
                  </p>
                </div>
              </div>

              {/* ข้อที่ 2 */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/80 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-4 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-2xs">
                  02
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    พูดคุยเรื่องที่ไม่สามารถพูดกับใครได้
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    ผู้ให้คำปรึกษาจะรับฟังโดยไม่ตัดสิน และช่วยหาทางออกในเรื่องที่คุณไม่สามารถพูดกับใครได้
                  </p>
                </div>
              </div>

              {/* ข้อที่ 3 */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100/80 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-4 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-2xs">
                  03
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    มีความสุขเมื่อได้เข้าใจตัวเอง
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    การปรึกษาทำให้เราเข้าใจตัวเองดีขึ้น รู้ถึงความต้องการของตัวเอง และได้แนวทางการแก้ไขปัญหาต่างๆ
                  </p>
                </div>
              </div>

            </div>

            {/* ฝั่งขวามือ (Right Column - Image) - แสดงต่อลงมาบนมือถือ (order-2) */}
            <div className="lg:col-span-5 flex justify-center items-center order-2">
              <div className="relative group w-full max-w-sm sm:max-w-md lg:max-w-full">
                <div className="absolute -inset-3 bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-teal-200/40 rounded-[2.5rem] blur-xl opacity-60 group-hover:opacity-90 transition duration-700 pointer-events-none" />
                <img
                  src="https://s.imgz.io/2026/10/01/White-Blue-and-Yellow-Illustrated-Mental-Health-Presentation-1ff43e61b2838fc57.png"
                  alt="ภาพประกอบ ทำไมการปรึกษาถึงช่วยคุณได้"
                  className="relative w-full h-auto object-contain rounded-3xl drop-shadow-lg transform transition-transform duration-500 group-hover:scale-102"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Body Content: Active Bookings & Mentors */}
      <div id="mentors-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {/* Existing Active Bookings (Quick Access to Web Call) */}
        {bookings.length > 0 && (
          <div className="mb-12 bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  คิวนัดหมายปรึกษาของคุณ ({bookings.length} รายการ)
                </h3>
              </div>
              <span className="text-xs text-slate-500">พร้อมโทรผ่านเว็บได้ทันที</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-emerald-800">
                        {booking.mentorName}
                      </span>
                      <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-700">
                        {booking.timeSlot}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                      ประเด็น: {booking.topic}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveCallBooking(booking)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-emerald-100" />
                    <span>เข้าสู่ห้องโทรปรึกษาเสมือนจริง (Web Call)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentors Grid (Choose a Mentor to Book) */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>เลือกอาจารย์ที่ปรึกษาประจำศูนย์พักใจ</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 ring-4 ring-rose-100 shadow-sm">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base text-center mb-1">
                    {mentor.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 text-center leading-tight mb-3">
                    {mentor.academicTitle}
                  </p>

                  <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100 text-xs text-rose-900 italic mb-4 leading-relaxed text-center">
                    "{mentor.quote}"
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-[11px] font-bold text-slate-700">ความเชี่ยวชาญ:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((exp, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 mb-3 flex items-center justify-between">
                    <span>เปิดให้คำปรึกษา:</span>
                    <span className="font-bold text-emerald-700">{mentor.availableDays.join(', ')}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setSelectedDay(mentor.availableDays[0] || 'จันทร์');
                      setSelectedSlot(mentor.availableSlots[0] || '13:00 - 14:00');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>นัดหมายวันและเวลา</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMentor.avatar}
                    alt={selectedMentor.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      นัดหมายปรึกษากับ {selectedMentor.name}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedMentor.academicTitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMentor(null)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เลือกวันที่สะดวก
                  </label>
                  <div className="flex gap-2">
                    {selectedMentor.availableDays.map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                          selectedDay === day
                            ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        วัน{day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เลือกรอบเวลา (Time Slot)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMentor.availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center cursor-pointer ${
                          selectedSlot === slot
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {slot} น.
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ชื่อ-สกุล / ชื่อเล่น
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="เพื่อความสะดวกในการเรียกชื่อ"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      อีเมลรับลิงก์
                    </label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@udru.ac.th"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เรื่องที่ต้องการปรึกษาโดยย่อ (เก็บเป็นความลับ)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="เช่น เครียดเรื่องการเลือกอาชีพ, ปัญหาการทำงานกลุ่มกับเพื่อนในโครงการ, ท้อแท้หมดไฟ..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    ยืนยันการจองคิว
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Virtual Web Call Room Simulation Modal */}
        {activeCallBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-950 text-white rounded-3xl max-w-5xl w-full h-[85vh] shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
              {/* Top call info bar */}
              <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-xs sm:text-sm">
                    ห้องโทรปรึกษาเสมือนจริง: {activeCallBooking.mentorName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    ({activeCallBooking.meetingCode})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> เข้ารหัสแบบ End-to-End
                  </span>
                  <button
                    onClick={() => setActiveCallBooking(null)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    จบการโทร
                  </button>
                </div>
              </div>

              {/* Video Grid & Chat Area */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
                {/* Video Streams */}
                <div className="lg:col-span-2 p-4 grid grid-rows-2 gap-4 bg-slate-950">
                  {/* Remote (Mentor) Video */}
                  <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center filter brightness-90" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80)` }} />
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{activeCallBooking.mentorName} (ออนไลน์)</span>
                    </div>
                  </div>

                  {/* Local (Student) Video */}
                  <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                    {cameraOn ? (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto mb-2 font-bold">
                          👤
                        </div>
                        <p className="text-xs font-bold text-slate-300">กล้องของคุณเปิดอยู่</p>
                        <p className="text-[11px] text-slate-500">สภาพแวดล้อมปลอดภัยสำหรับการสนทนา</p>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 text-xs">
                        <VideoOff className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <span>ปิดกล้องแล้ว (โหมดเสียงเท่านั้น)</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${micOn ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>คุณ ({activeCallBooking.studentName})</span>
                    </div>
                  </div>
                </div>

                {/* Secure Chat Box */}
                <div className="border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col justify-between">
                  <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>กล่องข้อความส่วนตัว (Encrypted Chat)</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-emerald-300">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <div className="bg-slate-800 p-2.5 rounded-xl text-slate-200 leading-relaxed border border-slate-700/50">
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความคุยกับอาจารย์..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-700"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Call Control Strip */}
              <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex items-center justify-center gap-4">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                  }`}
                  title={micOn ? 'ปิดไมโครโฟน' : 'เปิดไมโครโฟน'}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setCameraOn(!cameraOn)}
                  className={`p-3 rounded-full transition cursor-pointer ${
                    cameraOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                  }`}
                  title={cameraOn ? 'ปิดกล้อง' : 'เปิดกล้อง'}
                >
                  {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setActiveCallBooking(null)}
                  className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>วางสาย</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

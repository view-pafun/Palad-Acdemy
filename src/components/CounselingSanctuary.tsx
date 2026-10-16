import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Calendar as CalendarIcon, 
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
  Sparkles,
  HelpCircle,
  X,
  Smile,
  ArrowRight,
  Info,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Compass,
  BookOpen,
  Users,
  Check,
  CalendarCheck2,
  FileText,
  User as UserIcon
import { Mentor, CounselingBooking, User } from '../types';
import { GachaponHealingCards } from './GachaponHealingCards';

interface CounselingSanctuaryProps {
  mentors: Mentor[];
  currentUser?: User | null;
}

// Dedicated Counselor list for Step 2
interface Specialist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tag: string;
  days: string;
}

export const CounselingSanctuary: React.FC<CounselingSanctuaryProps> = ({ mentors, currentUser }) => {
  // Step 1: Selected Topic
  const [selectedTopic, setSelectedTopic] = useState<string>('ความเครียดและความกังวล');
  const [customTopicText, setCustomTopicText] = useState<string>('');

  // Step 2: Selected Counselor
  const specialists: Specialist[] = [
    {
      id: 'spec-1',
      name: 'พี่เมย์',
      role: 'นักจิตวิทยาการปรึกษา & ดูแลสุขภาวะใจ',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      tag: 'รับฟัง & คลายกังวล',
      days: 'จันทร์, พุธ, ศุกร์'
    },
    {
      id: 'spec-2',
      name: 'อาจารย์ก้อง',
      role: 'ผู้เชี่ยวชาญด้าน Life Design & จิตวิทยา',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      tag: 'ค้นหาตัวตน & วางแผนชีวิต',
      days: 'อังคาร, พฤหัสบดี'
    },
    {
      id: 'spec-3',
      name: 'พี่นัท',
      role: 'ผู้เชี่ยวชาญการพัฒนาตนเองและอาชีพ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      tag: 'การเรียน & เตรียมสู่อาชีพ',
      days: 'จันทร์, อังคาร, ศุกร์'
    },
    {
      id: 'spec-4',
      name: 'อ. รุ่งอรุณ เมธาวี',
      role: 'อาจารย์ที่ปรึกษาอาวุโสด้านจิตวิทยา',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=300&q=80',
      tag: 'การปรับตัว & ความสัมพันธ์',
      days: 'พุธ, เสาร์'
    }
  ];

  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(specialists[0]);

  // Step 3: Calendar Date
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(3); // 3 = เมษายน (April)
  const monthNames = [
    'มกราคม 2567', 'กุมภาพันธ์ 2567', 'มีนาคม 2567', 
    'เมษายน 2567', 'พฤษภาคม 2567', 'มิถุนายน 2567',
    'กรกฎาคม 2567', 'สิงหาคม 2567', 'กันยายน 2567',
    'ตุลาคม 2567', 'พฤศจิกายน 2567', 'ธันวาคม 2567'
  ];
  const [selectedDayNum, setSelectedDayNum] = useState<number>(18);

  // Step 4: Time Slot
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '18:00 - 19:00'
  ];
  const [selectedSlot, setSelectedSlot] = useState<string>('13:00 - 14:00');

  // Confirmation Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [studentName, setStudentName] = useState(currentUser?.name || 'นางสาว พลัส นุ้ย');
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || 'plus.nui@palad.academy');
  const [studentNote, setStudentNote] = useState('');
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState(false);

  // Filter for Mentors Directory
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Active bookings list synced with localStorage
  const [bookings, setBookings] = useState<CounselingBooking[]>(() => {
    try {
      const stored = localStorage.getItem('palad_counseling_bookings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'book-sample',
        mentorId: 'mentor-2',
        mentorName: 'พี่เมย์ (นักจิตวิทยาการปรึกษา)',
        studentName: 'พลัส นุ้ย (คุณ)',
        studentEmail: 'student@palad.academy',
        date: '18 เมษายน 2567',
        timeSlot: '13:00 - 14:00',
        topic: 'ความเครียดและความกังวลเรื่องการเรียนและอนาคต',
        status: 'confirmed',
        meetingCode: 'SANCTUARY-ROOM-882'
      }
    ];
  });

  // Virtual Web Call Room Simulation
  const [activeCallBooking, setActiveCallBooking] = useState<CounselingBooking | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'ระบบ Safe Space', text: 'ยินดีต้อนรับสู่พื้นที่ปลอดภัย ทุกบทสนทนาถูกเข้ารหัสและรักษาความลับ 100% 🔒', time: '13:00' },
    { sender: 'พี่เมย์', text: 'สวัสดีจ้า วันนี้มีเรื่องอะไรที่อยากให้พี่ช่วยรับฟังบ้าง เล่าได้ตามสบายเลยนะ พี่อยู่ตรงนี้พร้อมรับฟังเสมอจ้ะ ✨', time: '13:01' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Available topics for Column 1
  const topicsList = [
    { title: 'ความเครียดและความกังวล', icon: '🌿', desc: 'ผ่อนคลายความกดดัน คลายกังวล' },
    { title: 'การเรียนและการปรับตัว', icon: '📚', desc: 'การจัดการเวลา วางแผนการเรียน' },
    { title: 'การค้นหาตัวตนและอนาคต', icon: '🧭', desc: 'สำรวจเป้าหมายและเส้นทางชีวิต' },
    { title: 'ความสัมพันธ์', icon: '💬', desc: 'เพื่อน ครอบครัว คนรอบข้าง' },
    { title: 'สุขภาพใจและความมั่นใจ', icon: '💛', desc: 'รักตัวเอง ฟื้นฟูพลังบวก' },
    { title: 'อื่นๆ', icon: '✍️', desc: 'ระบุหัวข้อที่คุณต้องการพูดคุย' }
  ];

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'self', label: 'ค้นหาตัวตน & วางแผนชีวิต' },
    { id: 'stress', label: 'ความเครียด & สุขภาวะใจ' },
    { id: 'career', label: 'การเรียน & เตรียมสู่อาชีพ' },
    { id: 'innovation', label: 'นวัตกรรม & กิจกรรม' },
  ];

  const filteredMentors = mentors.filter((m) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'self') {
      return m.expertise.some(e => e.includes('ค้นหาตัวเอง') || e.includes('เส้นทางชีวิต') || e.includes('Life Design'));
    }
    if (selectedCategory === 'stress') {
      return m.expertise.some(e => e.includes('ความเครียด') || e.includes('ความสัมพันธ์') || e.includes('จิตวิทยา'));
    }
    if (selectedCategory === 'career') {
      return m.expertise.some(e => e.includes('โลกการทำงาน') || e.includes('สตาร์ทอัพ') || e.includes('วิจัย') || e.includes('อาชีพ'));
    }
    if (selectedCategory === 'innovation') {
      return m.expertise.some(e => e.includes('นวัตกรรม') || e.includes('กิจกรรม') || e.includes('ผู้นำ') || e.includes('สร้างสรรค์'));
    }
    return true;
  });

  const handleOpenConfirm = () => {
    setIsConfirmModalOpen(true);
  };

  const handleFinalConfirmBooking = () => {
    const finalTopic = selectedTopic === 'อื่นๆ' && customTopicText.trim() 
      ? customTopicText.trim() 
      : selectedTopic;

    const newBooking: CounselingBooking = {
      id: `book-${Date.now()}`,
      mentorId: selectedSpecialist.id,
      mentorName: selectedSpecialist.name,
      studentName: studentName.trim() || 'นางสาว พลัส นุ้ย',
      studentEmail: studentEmail.trim() || 'student@palad.academy',
      date: `${selectedDayNum} ${monthNames[currentMonthIndex]}`,
      timeSlot: selectedSlot,
      topic: finalTopic,
      status: 'confirmed',
      meetingCode: `SANCTUARY-ROOM-${Math.floor(100 + Math.random() * 900)}`
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    try {
      localStorage.setItem('palad_counseling_bookings', JSON.stringify(updatedBookings));
    } catch {}

    setIsConfirmModalOpen(false);
    setBookingSuccessAlert(true);
    setStudentNote('');

    setTimeout(() => {
      setBookingSuccessAlert(false);
    }, 6000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { sender: 'คุณ (นักศึกษา)', text: newMessage.trim(), time: 'เมื่อสักครู่' }
    ]);
    const studentQuery = newMessage.trim();
    setNewMessage('');

    // Simulated empathetic counselor reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: activeCallBooking?.mentorName || 'อาจารย์ที่ปรึกษา', 
          text: `ครูเข้าใจความรู้สึกของคุณตรงนี้เลยนะ การที่เราได้เปิดใจพูดคุยเรื่อง "${studentQuery.length > 20 ? studentQuery.slice(0, 20) + '...' : studentQuery}" เป็นก้าวที่กล้าหาญมากเลย เรามาค่อยๆ คลี่คลายไปด้วยกันนะ 💛`, 
          time: 'เมื่อสักครู่' 
        }
      ]);
    }, 1500);
  };

  const scrollToBookingSteps = () => {
    const el = document.getElementById('booking-4-steps');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calendar days generator (April has 30 days)
  const daysInMonth = 30;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-[#FFFDF5] min-h-screen font-['Prompt',sans-serif] text-slate-800">
      
      {/* 1. HERO SECTION: "Safe Space" With Warm Background Illustration */}
      <section 
        className="relative overflow-hidden bg-white border-b border-amber-200/60 py-10 sm:py-14 lg:py-16 min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center"
        style={{
          backgroundImage: `url('/safe_space_bg_new.png')`,
          backgroundPosition: 'right bottom',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        {/* Full-bleed background illustration with fallback */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="https://s.imgz.io/2026/10/16/-5f67be63c1483f1d1.png"
            alt="Safe Space Background"
            className="w-full h-full object-cover object-right select-none"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.indexOf('safe_space_bg_new') === -1) {
                target.src = '/safe_space_bg_new.png';
              }
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Prominent Left-Aligned Heading with 'Nanum Pen Script' */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left space-y-5 lg:space-y-6 z-20 relative bg-white/60 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-4 sm:p-0 rounded-3xl">
              
              {/* Main Heading: "ช่องทางพักใจ Safe Space" */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.2]">
                ช่องทางพักใจ{' '}
                <span className="font-nanum-pen font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F59E0B] drop-shadow-xs inline-block tracking-normal ml-1.5 transform hover:scale-105 transition-transform duration-300">
                  Safe Space
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-xl">
                ปรึกษาปัญหาการเรียน การค้นหาตัวตน ความเครียด หรือการทำงานพัฒนาตนเองแบบตัวต่อตัว (1-on-1) กับอาจารย์ผู้เชี่ยวชาญ พร้อมระบบนัดหมายและการปรึกษาผ่านเว็บไซต์ ปลอดภัย เป็นความลับ 100%
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  onClick={scrollToBookingSteps}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4 text-amber-300" />
                  <span>เริ่มนัดหมาย</span>
                  <span className="text-amber-300 font-bold ml-1">→</span>
                </button>

                <button
                  onClick={() => setIsHowItWorksOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-slate-300 hover:border-slate-800 bg-white/90 hover:bg-white text-slate-800 font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>ดูวิธีการใช้งาน</span>
                </button>
              </div>

              {/* Features Badges: เป็นความลับ 100%, พูดคุยแบบ 1-on-1, นัดหมายง่าย, ปลอดภัยและอบอุ่น */}
              <div className="pt-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-amber-200/70 shadow-xs">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">เป็นความลับ 100%</span>
                </div>
                
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-amber-200/70 shadow-xs">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-slate-800">พูดคุยแบบ 1-on-1</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-amber-200/70 shadow-xs">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">นัดหมายง่าย</span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-amber-200/70 shadow-xs">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  <span className="font-semibold text-slate-800">ปลอดภัยและอบอุ่น</span>
                </div>
              </div>

            </div>

            {/* Right Column: Transparent viewport showcasing the background illustration */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-6 h-full min-h-[460px] pointer-events-none select-none" />

          </div>
        </div>
      </section>

      {/* SUCCESS BOOKING TOAST NOTIFICATION */}
      {bookingSuccessAlert && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3.5 animate-in slide-in-from-top-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h4 className="font-bold text-sm">นัดหมายสำเร็จเรียบร้อยแล้ว! 💛</h4>
            <p className="text-xs text-emerald-100">คุณสามารถตรวจสอบรอบเวลาและเข้าห้องโทรปรึกษาได้ที่ส่วนด้านล่าง</p>
          </div>
        </div>
      )}

      {/* 2. SECTION: เริ่มดูแลใจคุณได้ง่าย ๆ ใน 4 ขั้นตอน */}
      <section id="booking-4-steps" className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFDF5] to-[#FFFBE6] border-b border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row: Left Text + Right 4-Step Indicator (matching attached design) */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8 sm:mb-12">
            
            {/* Left Column: Heading and Subtitle */}
            <div className="text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/90 text-rose-500 text-xs sm:text-sm font-bold mb-3 shadow-2xs">
                <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>เริ่มติดต่อนัดหมาย</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                เริ่มดูแลใจได้ง่าย ๆ ใน{' '}
                <span className="text-[#FF9F00] font-black">4 ขั้นตอน</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2 font-normal">
                เลือกหัวข้อ เลือกผู้ให้คำปรึกษา เลือกวันเวลา แล้วมาพูดคุยกันนะ
              </p>
            </div>

            {/* Right Column: 4-Step Indicator matching attached design */}
            <div className="w-full lg:w-auto lg:min-w-[480px] xl:min-w-[530px]">
              <div className="grid grid-cols-4 relative items-start">
                
                {/* Connecting background line running behind circles */}
                <div className="absolute top-4 left-[12%] right-[12%] h-[2px] bg-slate-200 -z-0" />

                {/* Step 1 */}
                <div className="flex flex-col items-center relative z-10 px-1">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                    1
                  </div>
                  <div className="mt-2.5 p-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-800" />
                  </div>
                  <span className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 text-center whitespace-nowrap">
                    เลือกหัวข้อ
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center relative z-10 px-1">
                  <div className={`w-8 h-8 rounded-full ${selectedSpecialist ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-500 font-bold'} text-sm flex items-center justify-center shadow-xs transition-colors`}>
                    2
                  </div>
                  <div className="mt-2.5 p-2 flex items-center justify-center">
                    <UserIcon className={`w-5 h-5 ${selectedSpecialist ? 'text-amber-600' : 'text-slate-400'} transition-colors`} />
                  </div>
                  <span className={`mt-1.5 text-xs sm:text-sm ${selectedSpecialist ? 'font-bold text-slate-900' : 'font-medium text-slate-500'} text-center whitespace-nowrap`}>
                    เลือกผู้ให้คำปรึกษา
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center relative z-10 px-1">
                  <div className={`w-8 h-8 rounded-full ${selectedDayNum ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-500 font-bold'} text-sm flex items-center justify-center shadow-xs transition-colors`}>
                    3
                  </div>
                  <div className="mt-2.5 p-2 flex items-center justify-center">
                    <CalendarIcon className={`w-5 h-5 ${selectedDayNum ? 'text-amber-600' : 'text-slate-400'} transition-colors`} />
                  </div>
                  <span className={`mt-1.5 text-xs sm:text-sm ${selectedDayNum ? 'font-bold text-slate-900' : 'font-medium text-slate-500'} text-center whitespace-nowrap`}>
                    เลือกวันเวลา
                  </span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center relative z-10 px-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-bold text-sm flex items-center justify-center shadow-xs">
                    4
                  </div>
                  <div className="mt-2.5 p-2 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500 text-center whitespace-nowrap">
                    ยืนยันการนัดหมาย
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* Interactive Form / Card Layout (4 Sub-Columns) */}
          <div className="bg-white/95 rounded-[2.5rem] p-5 sm:p-7 lg:p-8 border-2 border-amber-200/80 shadow-xl shadow-amber-900/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-amber-100">
              
              {/* =========================================
                  COLUMN 1: เลือกหัวข้อ
              ========================================= */}
              <div className="flex flex-col justify-between pt-4 lg:pt-0 lg:pr-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                      1
                    </span>
                    <h3 className="font-black text-slate-900 text-base">
                      เลือกหัวข้อ
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    เลือกเรื่องที่อยากปรึกษา หรือระบุเอง
                  </p>

                  <div className="space-y-2">
                    {topicsList.map((t, idx) => {
                      const isSelected = selectedTopic === t.title;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedTopic(t.title)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-300 text-slate-900 font-bold shadow-xs'
                              : 'bg-white hover:bg-amber-50/50 border-amber-100/80 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{t.icon}</span>
                            <div>
                              <p className="text-xs sm:text-sm leading-tight">{t.title}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Custom Topic Input if "อื่นๆ" is selected */}
                  {selectedTopic === 'อื่นๆ' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="พิมพ์หัวข้อที่คุณอยากพูดคุย..."
                        value={customTopicText}
                        onChange={(e) => setCustomTopicText(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-amber-300 bg-amber-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>เลือกแล้ว:</span>
                  <span className="font-bold text-amber-900 truncate max-w-[150px]">
                    {selectedTopic === 'อื่นๆ' && customTopicText ? customTopicText : selectedTopic}
                  </span>
                </div>
              </div>

              {/* =========================================
                  COLUMN 2: เลือกผู้ให้คำปรึกษา
              ========================================= */}
              <div className="flex flex-col justify-between pt-6 lg:pt-0 lg:px-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                      2
                    </span>
                    <h3 className="font-black text-slate-900 text-base">
                      เลือกผู้ให้คำปรึกษา
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    อาจารย์และผู้เชี่ยวชาญพร้อมรับฟัง
                  </p>

                  <div className="space-y-2.5">
                    {specialists.map((spec) => {
                      const isSelected = selectedSpecialist.id === spec.id;
                      return (
                        <button
                          key={spec.id}
                          type="button"
                          onClick={() => setSelectedSpecialist(spec)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                              : 'bg-white hover:bg-amber-50/50 border-amber-100/80'
                          }`}
                        >
                          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-amber-200">
                            <img
                              src={spec.avatar}
                              alt={spec.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-1 ring-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                {spec.name}
                              </h4>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate leading-tight">
                              {spec.role}
                            </p>
                            <span className="inline-block mt-1 text-[9px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                              {spec.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>วันทำการ:</span>
                  <span className="font-bold text-amber-900">{selectedSpecialist.days}</span>
                </div>
              </div>

              {/* =========================================
                  COLUMN 3: เลือกวันเวลา (Interactive Calendar)
              ========================================= */}
              <div className="flex flex-col justify-between pt-6 lg:pt-0 lg:px-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                      3
                    </span>
                    <h3 className="font-black text-slate-900 text-base">
                      เลือกวันนัดหมาย
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    เลือกวันที่สะดวกในเดือนนี้
                  </p>

                  {/* Calendar Widget Container */}
                  <div className="bg-[#FFFDF5] p-3 rounded-2xl border border-amber-200/80 shadow-2xs">
                    
                    {/* Month Header Switcher */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <button
                        type="button"
                        onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentMonthIndex === 0}
                        className="p-1 rounded-lg hover:bg-amber-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {monthNames[currentMonthIndex]}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentMonthIndex((prev) => Math.min(monthNames.length - 1, prev + 1))}
                        disabled={currentMonthIndex === monthNames.length - 1}
                        className="p-1 rounded-lg hover:bg-amber-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 mb-1.5">
                      <span>อา</span>
                      <span>จ</span>
                      <span>อ</span>
                      <span>พ</span>
                      <span>พฤ</span>
                      <span>ศ</span>
                      <span>ส</span>
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {/* Blank offset for Monday start in April */}
                      <span />
                      
                      {daysArray.map((day) => {
                        const isSelected = selectedDayNum === day;
                        const isAvailable = day >= 10; // e.g. active selectable dates
                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => setSelectedDayNum(day)}
                            className={`h-7 w-7 sm:h-8 sm:w-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-slate-950 text-amber-300 font-bold shadow-xs scale-105'
                                : isAvailable
                                ? 'hover:bg-amber-200/80 text-slate-800'
                                : 'text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick date chips */}
                    <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex flex-wrap gap-1">
                      {[
                        { label: 'วันนี้ (16)', day: 16 },
                        { label: 'พรุ่งนี้ (17)', day: 17 },
                        { label: 'ศุกร์นี้ (19)', day: 19 }
                      ].map((chip) => (
                        <button
                          key={chip.day}
                          type="button"
                          onClick={() => setSelectedDayNum(chip.day)}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium cursor-pointer transition-all ${
                            selectedDayNum === chip.day
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-white hover:bg-amber-100 text-slate-600 border border-amber-200/60'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>วันที่เลือก:</span>
                  <span className="font-bold text-amber-900">
                    {selectedDayNum} {monthNames[currentMonthIndex]}
                  </span>
                </div>
              </div>

              {/* =========================================
                  COLUMN 4: เลือกช่วงเวลา & ปุ่ม "ถัดไป ->"
              ========================================= */}
              <div className="flex flex-col justify-between pt-6 lg:pt-0 lg:pl-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                      4
                    </span>
                    <h3 className="font-black text-slate-900 text-base">
                      เลือกช่วงเวลา
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    รอบเวลาแบบตัวต่อตัว (1 ชั่วโมง)
                  </p>

                  {/* Slot buttons grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-slate-950 text-amber-300 ring-2 ring-amber-400 shadow-sm'
                              : 'bg-white hover:bg-amber-50 text-slate-700 border border-amber-200/80 shadow-2xs'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selection Summary Box */}
                  <div className="bg-amber-50/90 rounded-2xl p-3 border border-amber-200/90 text-xs space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>สรุปข้อมูลการนัดหมาย</span>
                    </div>
                    <p className="text-slate-700 line-clamp-1">
                      <span className="text-slate-500">หัวข้อ: </span>
                      {selectedTopic === 'อื่นๆ' && customTopicText ? customTopicText : selectedTopic}
                    </p>
                    <p className="text-slate-700">
                      <span className="text-slate-500">ผู้ให้คำปรึกษา: </span>
                      {selectedSpecialist.name}
                    </p>
                    <p className="text-slate-700">
                      <span className="text-slate-500">วันเวลา: </span>
                      {selectedDayNum} เม.ย. ({selectedSlot})
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Button: "ถัดไป ->" สีดำด้านล่าง */}
                <div>
                  <button
                    type="button"
                    onClick={handleOpenConfirm}
                    className="w-full py-3.5 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>ถัดไป</span>
                    <span className="text-amber-300 font-black text-base">→</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    🔒 รักษาความลับ 100% ปลอดภัย ไร้กังวล
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. STEP 4 CONFIRMATION MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  4
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    ยืนยันการนัดหมาย (Safe Space)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ขั้นตอนสุดท้ายเพื่อเปิดห้องให้คำปรึกษาแบบ 1-on-1
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Booking Details Card */}
            <div className="bg-[#FFFDF5] rounded-3xl p-5 border border-amber-200/80 space-y-3 mb-5">
              <div className="flex items-center gap-3 pb-3 border-b border-amber-100">
                <img
                  src={selectedSpecialist.avatar}
                  alt={selectedSpecialist.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-300 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {selectedSpecialist.name}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedSpecialist.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">หัวข้อที่เลือก:</span>
                  <span className="font-bold text-slate-900">
                    {selectedTopic === 'อื่นๆ' && customTopicText ? customTopicText : selectedTopic}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">วันและเวลา:</span>
                  <span className="font-bold text-slate-900">
                    {selectedDayNum} {monthNames[currentMonthIndex]} ({selectedSlot})
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>ช่องทาง: ห้องโทรปรึกษาเสมือนจริงบนเว็บ (Web Call Room) ปลอดภัย 100%</span>
              </div>
            </div>

            {/* Student Info Inputs */}
            <div className="space-y-3.5 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อหรือชื่อเล่นที่อยากให้ผู้ให้คำปรึกษาเรียก:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="เช่น พลัส นุ้ย"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  อีเมลสำหรับรับการแจ้งเตือนและการนัดหมาย:
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="name@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ข้อความสั้นๆ ที่อยากฝากถึงอาจารย์ล่วงหน้า (ไม่บังคับ):
                </label>
                <textarea
                  rows={2}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="เช่น มีความกังวลเรื่องการเลือกสายงานในอนาคต อยากขอคำแนะนำ..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-1/3 py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-all"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={handleFinalConfirmBooking}
                className="w-2/3 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-xl cursor-pointer transition-all"
              >
                <CalendarCheck2 className="w-4 h-4 text-amber-300" />
                <span>ยืนยันการนัดหมายทันที 💛</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. GACHAPON HEALING CARDS SECTION: สุ่มการ์ดกำลังใจ (แทนรายการนัดหมายของคุณ) */}
      <div id="gachapon-cards-section">
        <GachaponHealingCards />
      </div>

      {/* 5. BENEFITS SECTION: "ทำไมการปรึกษาถึงช่วยคุณได้" */}
      <section className="py-12 sm:py-16 bg-[#FFFDF5] border-b border-amber-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center sm:text-left mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ประโยชน์ของการปรึกษา (Benefits of Counseling)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              ทำไมการปรึกษาถึงช่วยคุณได้
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Benefit 1 */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-black text-lg flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  ช่วยสะท้อนให้เห็นถึงคุณค่าของตัวเอง
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  การปรึกษาพูดคุยจะช่วยคุณสะท้อนสิ่งต่างๆ ในมุมมองที่คุณอาจไม่เคยเห็นมาก่อน ทำให้เห็นจุดแข็ง และค้นพบแนวทางการแก้ปัญหาใหม่ๆ ด้วยตัวคุณเอง
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-black text-lg flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  พูดคุยเรื่องที่ไม่สามารถพูดกับใครได้
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  ผู้ให้คำปรึกษาจะรับฟังอย่างตั้งใจโดยไม่ตัดสิน เป็นพื้นที่ที่คุณสามารถปลดปล่อยความรู้สึกหนักอึ้งได้อย่างสบายใจ และปลอดภัย 100%
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-3xl p-6 border border-blue-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 font-black text-lg flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  วางแผนอนาคตอย่างมั่นใจ
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  ไม่ว่าจะเป็นการเรียน การเลือกสายงาน หรือการจัดการกับความสับสน คุณจะได้รับแนวทางที่ปฏิบัติได้จริงและเหมาะกับคุณโดยเฉพาะ
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. MENTORS DIRECTORY */}
      <section id="mentors-grid" className="py-12 sm:py-16 bg-white/70 border-b border-amber-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                อาจารย์ผู้เชี่ยวชาญ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                เลือกอาจารย์ที่ปรึกษาประจำศูนย์พักใจ
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                อาจารย์ทุกท่านผ่านการรับรองและมีความเชี่ยวชาญพร้อมรับฟังคุณอย่างเข้าใจ
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-amber-100/50 p-1.5 rounded-2xl border border-amber-200 self-start md:self-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-[#FFFDF5] rounded-3xl p-6 border border-amber-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 ring-4 ring-amber-100 shadow-sm">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" title="พร้อมให้คำปรึกษา" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base text-center mb-1">
                    {mentor.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 text-center leading-tight mb-3">
                    {mentor.academicTitle}
                  </p>

                  <div className="bg-white p-3 rounded-2xl border border-amber-200/80 text-xs text-amber-950 italic mb-4 leading-relaxed text-center shadow-2xs">
                    "{mentor.quote}"
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-[11px] font-bold text-slate-700">ความเชี่ยวชาญ:</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((exp, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-0.5 rounded-lg">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 mb-3 flex items-center justify-between">
                    <span>เปิดให้คำปรึกษา:</span>
                    <span className="font-bold text-amber-800">{mentor.availableDays.join(', ')}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTopic('การค้นหาตัวตนและอนาคต');
                      scrollToBookingSteps();
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>นัดหมายวันและเวลา</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. HOW IT WORKS MODAL */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-900 text-lg">วิธีการใช้งาน Safe Space</h3>
              </div>
              <button
                onClick={() => setIsHowItWorksOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 mb-6">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">เลือกหัวข้อและผู้ให้คำปรึกษา</h4>
                  <p>เลือกหัวข้อที่คุณต้องการพูดคุย และผู้เชี่ยวชาญที่คุณรู้สึกสบายใจที่จะสนทนาด้วย</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">เลือกวันและรอบเวลา</h4>
                  <p>เลือกรอบเวลาที่อาจารย์เปิดรับนัดหมาย โดยไม่ต้องกังวลเรื่องการเดินทาง</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">เข้าห้อง Web Call 1-on-1</h4>
                  <p>เมื่อถึงเวลา นัดหมายจะแสดงในรายการนัดหมายของคุณ พร้อมปุ่มเข้าห้องโทรเสมือนจริง เปิดหรือปิดกล้องได้ตามที่คุณสบายใจ</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsHowItWorksOpen(false);
                scrollToBookingSteps();
              }}
              className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              เข้าใจแล้ว เริ่มนัดหมายเลย
            </button>
          </div>
        </div>
      )}

      {/* 8. VIRTUAL WEB CALL ROOM MODAL SIMULATION */}
      {activeCallBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-[2rem] max-w-4xl w-full h-[90vh] max-h-[750px] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Top Bar */}
            <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>ห้องโทรปรึกษาเสมือนจริง: {activeCallBooking.mentorName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800">
                      🔒 เข้ารหัส 100%
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    รหัสห้อง: {activeCallBooking.meetingCode} | รอบ: {activeCallBooking.timeSlot}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCallBooking(null)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>ออกจากห้อง</span>
              </button>
            </div>

            {/* Video & Chat Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              
              {/* Left: Video Area */}
              <div className="lg:col-span-8 bg-slate-950 p-4 flex flex-col justify-between relative overflow-hidden">
                
                {/* Counselor Screen */}
                <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                    alt="Counselor Video Feed"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{activeCallBooking.mentorName}</span>
                  </div>

                  {/* Student Picture-in-Picture */}
                  <div className="absolute bottom-3 right-3 w-32 h-24 sm:w-40 sm:h-28 rounded-xl bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-xl flex items-center justify-center">
                    {cameraOn ? (
                      <div className="w-full h-full bg-gradient-to-tr from-amber-900/60 to-slate-800 flex flex-col items-center justify-center text-center p-2">
                        <Smile className="w-7 h-7 text-amber-300 mb-1" />
                        <span className="text-[10px] text-slate-200 font-medium">กล้องของคุณ (เปิดอยู่)</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <VideoOff className="w-5 h-5 mb-1" />
                        <span className="text-[10px]">ปิดกล้อง</span>
                      </div>
                    )}
                    <span className="absolute bottom-1 left-2 text-[9px] bg-black/70 px-1.5 py-0.5 rounded text-slate-200">คุณ</span>
                  </div>
                </div>

                {/* Video Controls Bar */}
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`p-3 rounded-full transition-all cursor-pointer ${
                      micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                    }`}
                    title={micOn ? 'ปิดไมค์' : 'เปิดไมค์'}
                  >
                    {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setCameraOn(!cameraOn)}
                    className={`p-3 rounded-full transition-all cursor-pointer ${
                      cameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                    }`}
                    title={cameraOn ? 'ปิดกล้อง' : 'เปิดกล้อง'}
                  >
                    {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setActiveCallBooking(null)}
                    className="p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer"
                    title="วางสาย"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>

              </div>

              {/* Right: Private Chat Area */}
              <div className="lg:col-span-4 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
                
                {/* Chat Header */}
                <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>แชทส่วนตัวระหว่างการปรึกษา</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">ปลอดภัย 100%</span>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
                  {chatMessages.map((msg, idx) => {
                    const isMe = msg.sender.includes('คุณ');
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-400 mb-0.5">
                          {msg.sender} • {msg.time}
                        </span>
                        <div
                          className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                            isMe
                              ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none'
                              : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Send Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/90 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="พิมพ์ข้อความคุยกับอาจารย์..."
                    className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold flex items-center justify-center cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

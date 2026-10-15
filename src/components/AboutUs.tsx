import React, { useState } from 'react';
import { 
  Info, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Users, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Send,
  HelpCircle,
  Building
} from 'lucide-react';
import { FAQS } from '../data/mockData';

export const AboutUs: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [questionText, setQuestionText] = useState('');
  const [questionSender, setQuestionSender] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  const teamMembers = [
    {
      name: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
      role: 'ผู้อำนวยการศูนย์นวัตกรรมเพื่อการพัฒนาท้องถิ่น',
      department: 'คณะมนุษยศาสตร์และสังคมศาสตร์ UDRU',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      expertise: 'วิเคราะห์ปัญหาเชิงพื้นที่ & การบูรณาการข้ามศาสตร์'
    },
    {
      name: 'อ. รุ่งอรุณ เมธาวี',
      role: 'หัวหน้างานแนะแนวและสุขภาวะจิตนักศึกษา',
      department: 'ศูนย์ให้คำปรึกษาและสุขภาวะนักศึกษา UDRU',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      expertise: 'จิตวิทยาการปรึกษา & การออกแบบชีวิต (Life Design)'
    },
    {
      name: 'ดร. กรกช สุวรรณรัตน์',
      role: 'ที่ปรึกษาด้านเทคโนโลยีดิจิทัลและ AI',
      department: 'คณะวิทยาศาสตร์และเทคโนโลยี UDRU',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      expertise: 'AI เพื่อการศึกษา & นวัตกรรมชุมชนดิจิทัล'
    },
    {
      name: 'อ. นพดล ศักดิ์เจริญ',
      role: 'หัวหน้าฝ่ายพัฒนาสื่อนวัตกรรมและเกมการเรียนรู้',
      department: 'คณะครุศาสตร์ UDRU',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      expertise: 'Gamification & กิจกรรมกระบวนการกลุ่ม'
    }
  ];

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSent(true);
    setQuestionText('');
    setQuestionSender('');
    setTimeout(() => setQuestionSent(false), 4000);
  };

  return (
    <div className="py-12 bg-gradient-to-b from-[#f8faf8] via-white to-[#faf9f5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold mb-3">
            <Info className="w-3.5 h-3.5 text-emerald-700" />
            <span>เกี่ยวกับเรา (About Us)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            การจัดการเรียนรู้แบบใหม่ <span className="text-emerald-600">UDRU</span>
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            ขับเคลื่อนพลังบริสุทธิ์ของคนรุ่นใหม่ สู่การพัฒนาชุมชนท้องถิ่นที่ยั่งยืน
          </p>
        </div>

        {/* Core Vision & Mission Card (Exact brief requirements) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-100 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                🌱
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  การจัดการเรียนรู้แบบใหม่ !!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-700 font-semibold">
                  มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200/80">
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                "เปิดพื้นที่ให้นักศึกษาได้แสดงพลังบริสุทธิ์อย่างสร้างสรรค์ ผ่านการเรียนรู้ข้ามศาสตร์ <span className="font-bold text-emerald-900">(Multidisciplinary)</span> กับเพื่อนๆ ต่างคณะ ต่างสาขา เพื่อร่วมสนุกกับการเรียนรู้ที่จะลงมือแก้ปัญหาเชิงพื้นที่ ลงลึกวิเคราะห์ให้ถึงแก่นแท้แห่งสาเหตุของปัญหา แล้วระดมทรัพยากรและสรรพกำลังที่มีเพื่อแก้ไขแบบ <span className="font-bold text-emerald-800 underline decoration-amber-400 decoration-4">"เกาให้ถูกที่คัน"</span> และเรียนรู้การประยุกต์ใช้องค์ความรู้การปฏิบัติจริงเพื่อแก้ปัญหาชุมชนท้องถิ่นที่ซับซ้อนเกินกว่าจะแก้ปัญหาได้ด้วยศาสตร์เดียว หรือความรู้วิชาการแต่เพียงอย่างเดียว"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Target className="w-6 h-6 text-amber-500 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm mb-1">ลงลึกถึงแก่นแท้</h4>
                <p className="text-xs text-slate-500">
                  เข้าใจรากเหง้าปัญหาเชิงพื้นที่อย่างถ่องแท้ ไม่ฉาบฉวย
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Users className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm mb-1">เรียนรู้ข้ามศาสตร์</h4>
                <p className="text-xs text-slate-500">
                  ผสานจุดแข็งจากหลากหลายคณะ มารวมพลังเป็นทีมเดียว
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Sparkles className="w-6 h-6 text-emerald-500 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm mb-1">เกาให้ถูกที่คัน</h4>
                <p className="text-xs text-slate-500">
                  ส่งมอบผลงานนวัตกรรมที่ใช้งานได้จริงและชุมชนดูแลต่อได้
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personnel / Staff Section */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              บุคลากรและทีมงานคณาจารย์
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              คณาจารย์ผู้เชี่ยวชาญพร้อมให้คำปรึกษาและร่วมเดินทางเคียงข้างนักศึกษา
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition text-center"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 ring-4 ring-emerald-100 shadow-sm">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mb-1">
                  {member.role}
                </p>
                <p className="text-[11px] text-slate-500 mb-3">
                  {member.department}
                </p>
                <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-[10px] text-slate-600 font-medium">
                  {member.expertise}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Us Details (Exact brief requirements) */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                CONTACT INFORMATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-4">
                ติดต่อเรา มหาวิทยาลัยราชภัฏอุดรธานี
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                ยินดีต้อนรับนักศึกษา ครูอาจารย์ หน่วยงานภาคีเครือข่าย และชุมชนทุกท่าน สามารถติดต่อสอบถามข้อมูลการเรียนรู้และโครงการได้ทุกช่องทาง
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Phone */}
                <div className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-base">
                      หมายเลขโทรศัพท์อัตโนมัติ: 0-4221-1040-59
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      กดหมายเลขโทรศัพท์ภายในที่ต้องการติดต่อ หรือกด 0 เพื่อติดต่อ operator
                    </p>
                  </div>
                </div>

                {/* Email Central */}
                <div className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">อีเมลกลาง: saraban@udru.ac.th</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ฝ่ายประชาสัมพันธ์: <span className="text-emerald-300 font-medium">udru-pr@udru.ac.th</span>
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">ที่อยู่มหาวิทยาลัยราชภัฏอุดรธานี</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      64 ถนนทหาร ตำบลหมากแข้ง อำเภอเมือง จังหวัดอุดรธานี 41000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Campus Map Card */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>ศูนย์การเรียนรู้ ณ มหาวิทยาลัยราชภัฏอุดรธานี</span>
              </div>
              <div className="aspect-video rounded-xl bg-slate-950 overflow-hidden relative border border-slate-700 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=700&q=80"
                  alt="UDRU Campus"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <span className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg mb-2 shadow-lg animate-bounce">
                    📍
                  </span>
                  <p className="font-bold text-sm text-white">UDRU Main Campus</p>
                  <p className="text-[11px] text-slate-300">อาคารเฉลิมพระเกียรติฯ & ศูนย์นวัตกรรมเพื่อการพัฒนาท้องถิ่น</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center">
                เปิดให้บริการวันจันทร์ - ศุกร์ เวลา 08:30 - 16:30 น.
              </p>
            </div>
          </div>
        </div>

        {/* Q&A Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>คำถามที่พบบ่อย (Q&A)</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              ข้อสงสัยและคำถามเกี่ยวกับการใช้งาน
            </h2>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-800 text-sm sm:text-base hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ask question form */}
          <div className="mt-8 pt-6 border-t border-slate-200 max-w-2xl mx-auto text-center">
            <h4 className="font-bold text-slate-900 text-sm mb-2">
              ยังมีคำถามเพิ่มเติมหรือไม่?
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              พิมพ์คำถามของคุณเพื่อส่งตรงถึงฝ่ายประสานงานโครงการ
            </p>

            {questionSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-xs">
                ✨ ส่งคำถามเรียบร้อยแล้ว! เจ้าหน้าที่จะตอบกลับทางอีเมลโดยเร็วที่สุด
              </div>
            ) : (
              <form onSubmit={handleAskQuestion} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={questionSender}
                  onChange={(e) => setQuestionSender(e.target.value)}
                  placeholder="ชื่อและอีเมลของคุณ..."
                  className="w-full sm:w-1/3 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="พิมพ์ข้อคำถามของคุณที่นี่..."
                  className="w-full sm:w-2/3 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  ส่งคำถาม
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

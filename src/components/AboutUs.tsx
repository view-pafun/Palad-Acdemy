import React, { useState } from 'react';
import { 
  Target, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle
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
    <div className="py-10 sm:py-16 bg-white min-h-screen text-slate-700 font-['Prompt','Kanit',sans-serif] selection:bg-amber-100 selection:text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Section 1: Hero & Vision statement (Inspired by Image 1) */}
        <section className="relative bg-white pt-6 pb-12 border-b border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Col: Main Heading with gradient keywords */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.25] tracking-tight text-balance">
                เรา <span className="bg-gradient-to-r from-red-500 via-rose-500 to-fuchsia-600 bg-clip-text text-transparent font-black">สร้าง</span> พื้นที่รวมพลคนแตกต่าง ที่จะเปลี่ยนความ ‘<span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent font-black">ประหลาด</span>’ ของคุณให้กลายเป็น ‘<span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-black">พลัง</span>’ และ ‘<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-black">ตัวตน</span>’ ที่ไม่มีใครเลียนแบบได้
              </h1>
            </div>

            {/* Right Col: Story text */}
            <div className="lg:col-span-5 flex flex-col justify-center h-full">
              {/* Explanatory Narrative Paragraphs (Dark Grey, soft on the eyes) */}
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed pl-1 sm:pl-4 border-l-2 border-slate-100">
                <p>
                  <strong className="text-slate-800 font-semibold">ประหลาด Academy</strong> ก่อตั้งขึ้นบนความเชื่อที่ว่า ความยูนีคและความคิดนอกกรอบ <span className="text-slate-500 font-medium">(Unconventional)</span> คือสิ่งสร้างสรรค์ที่งดงามที่สุดในจักรวาล เราสร้างพื้นที่แห่งนี้ให้เป็นดั่งประภาคารคอยนำทางผู้เดินทางที่กำลังตั้งคำถามกับตัวเองว่า <span className="text-slate-800 font-medium italic">"ทำไมฉันถึงไม่เหมือนคนอื่น?"</span>
                </p>
                <p>
                  พื้นที่รวมพลคนแตกต่าง ที่จะเปลี่ยนความ ‘ประหลาด’ ของคุณให้กลายเป็น ‘พลัง’ และ ‘ตัวตน’ ที่ไม่มีใครเลียนแบบได้! เราเชื่อว่าความแปลกไม่ใช่ข้อผิดพลาดของระบบ แต่เป็นซิกเนเจอร์จากจักรวาลที่รอให้คุณมาค้นพบ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Two-Column Layout (Matching Reference Image 2) */}
        <section className="bg-white py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Heading + Big Standout Quote */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs sm:text-sm font-bold text-red-500 uppercase tracking-widest block mb-2">
                  Mission & Vision
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  พันธกิจ & วิสัยทัศน์
                </h2>
              </div>

              {/* Standout Quote in Quotation marks with dark grey font */}
              <div className="pt-2">
                <blockquote className="text-lg sm:text-xl font-bold text-slate-700 leading-snug border-l-4 border-amber-400 pl-4 py-1 italic">
                  “สร้างจักรวาลที่ทุกคนภูมิใจในความยูนีค และใช้ความประหลาดของตัวเองเปลี่ยนโลก”
                </blockquote>
              </div>
            </div>

            {/* Right Column: Detailed Paragraphs, Left-aligned, balanced */}
            <div className="lg:col-span-7 space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              {/* Pillars list */}
              <div className="bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-100 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p>
                    <strong className="text-slate-800 font-bold">Empower:</strong> เปลี่ยนความ 'ประหลาด' ให้กลายเป็น 'พลัง' และ 'ตัวตน'
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                  <p>
                    <strong className="text-slate-800 font-bold">Navigate:</strong> นำทางผู้คนไปค้นหาคำตอบของชีวิต
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <p>
                    <strong className="text-slate-800 font-bold">Unite:</strong> รวมพลคนคิดนอกกรอบเพื่อสร้างคอมมูนิตี้แห่งอนาคต
                  </p>
                </div>
              </div>

              {/* Goals / Commercialization section */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                  <Target className="w-3.5 h-3.5" />
                  <span>เป้าหมาย</span>
                </div>

                <div className="pt-1">
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    <strong className="text-slate-800 font-bold">Monetization & Commercialization:</strong> พัฒนาต่อยอดระบบแบบทดสอบบุคลิกภาพและโมเดลการเรียนรู้ ไปสู่บริการให้คำปรึกษาด้านทรัพยากรบุคคล (HR Solutions) สำหรับองค์กรที่ต้องการคัดสรรบุคลากรกลุ่ม Talent รวมถึงการพัฒนาหลักสูตรพิเศษ (Upskilling/Reskilling)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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

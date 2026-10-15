import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Award, 
  Users, 
  PlayCircle, 
  Sparkles, 
  ShieldCheck, 
  Share2, 
  Bookmark, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Video, 
  HelpCircle,
  Download,
  Flame,
  Zap,
  Lock,
  ExternalLink,
  FileText,
  RotateCcw,
  Cloud
} from 'lucide-react';
import { Course, User, CertificateData } from '../types';
import confetti from 'canvas-confetti';
import { CourseNotesSection } from './CourseNotesSection';

interface CourseDetailPageProps {
  course: Course;
  currentUser: User | null;
  onBack: () => void;
  onOpenPlayer?: (course: Course) => void;
  onOpenPayment?: (course: Course) => void;
  onIssueCertificate?: (cert: CertificateData) => void;
  onRequireLogin?: () => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  course,
  currentUser,
  onBack,
  onOpenPlayer,
  onOpenPayment,
  onIssueCertificate,
  onRequireLogin
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'notes' | 'quiz'>('overview');
  const [isEnrolled, setIsEnrolled] = useState(
    currentUser?.enrolledCourseIds.includes(course.id) || course.isFree
  );
  const [activeLessonId, setActiveLessonId] = useState<string>(
    course.modules[0]?.lessons[0]?.id || ''
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [enrollSuccessToast, setEnrollSuccessToast] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string | number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Total video clips calculation
  const totalClips = course.modules.reduce((acc, m) => acc + m.lessons.length, 0) || course.lessonsCount || 12;
  const totalMinutes = course.durationHours * 60;
  const hoursDisplay = `${course.durationHours} ชั่วโมง ${course.durationHours > 5 ? '27 นาที' : '00 นาที'}`;

  // Default learning outcomes if not defined
  const learningOutcomes = [
    'เข้าใจกรอบแนวคิดและหัวใจสำคัญของ ' + course.title,
    'ฝึกฝนทักษะการวิเคราะห์และแก้ไขปัญหาเชิงพื้นที่แบบเจาะลึก (Root Cause Analysis)',
    'ประยุกต์ใช้เครื่องมือปฏิบัติการจริงสำหรับการพัฒนาตนเองและชุมชน',
    'เรียนรู้วิธีการทำงานร่วมกับผู้อื่นข้ามศาสตร์ (Multidisciplinary Collaboration)',
    'ได้รับสิทธิสอบวัดระดับมาตรฐานเพื่อรับใบประกาศนียบัตรรับรองสมรรถนะดิจิทัล UDRU'
  ];

  // Active lesson object
  const currentActiveLesson = course.modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId) || course.modules[0]?.lessons[0];

  // Handle Enrollment
  const handleEnrollOrStart = () => {
    if (!isEnrolled) {
      setIsEnrolled(true);
      setEnrollSuccessToast(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
      setTimeout(() => setEnrollSuccessToast(false), 3500);
    }
    if (onOpenPlayer) {
      onOpenPlayer(course);
      return;
    }
    setIsPlaying(true);
    setActiveTab('curriculum');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Quick switch to taking notes for a specific lesson
  const handleTakeNoteForLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab('notes');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Handle Share Link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    if (!course.quiz) return;
    let correctCount = 0;
    course.quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / course.quiz.questions.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);

    if (percentage >= course.quiz.passingScorePercent && onIssueCertificate) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      const certData: CertificateData = {
        certificateId: `UDRU-${course.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: currentUser?.name || 'ณภัทร วงศ์เจริญ',
        courseTitle: course.title,
        issueDate: '1 ตุลาคม 2569',
        gradeScore: percentage,
        instructorName: course.instructor.name,
        organization: 'มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)',
        qrVerifyUrl: `https://udru-cert.ac.th/verify/${course.id}`
      };
      onIssueCertificate(certData);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-['Prompt',sans-serif] pb-24 lg:pb-16 text-slate-800">
      
      {/* Toast Notification */}
      {enrollSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 border border-emerald-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold">
            สมัครเข้าเรียนหลักสูตร "{course.title}" เรียบร้อยแล้ว!
          </span>
        </div>
      )}

      {/* Top Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับไปหน้ารวมคอร์ส</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-normal">
              <span>หน้าแรก</span>
              <span>/</span>
              <span>คอร์สเรียนออนไลน์</span>
              <span>/</span>
              <span className="text-emerald-700 font-medium truncate max-w-[260px]">{course.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('notes');
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>จดโน้ตส่วนตัว</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedLink ? 'คัดลอกลิงก์แล้ว' : 'แชร์คอร์สนี้'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Two-Column Layout (คอลัมน์ฝั่งซ้าย 8 คอลัมน์, คอลัมน์ฝั่งขวา 4 คอลัมน์) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ========================================================= */}
          {/* 1. คอลัมน์ฝั่งซ้าย (Main Content Area - 8 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-7">
            
            {/* 1.1 รูปภาพหน้าปกหลักสูตร / Video Player Area */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200/80 group">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Overlay badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-amber-300 font-bold text-xs shadow-md border border-amber-400/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{course.badge || 'หลักสูตรแนะนำ'}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-800 font-semibold text-xs shadow-md">
                  ระดับ: {course.level}
                </span>
              </div>

              {/* Price Tag Overlay */}
              <div className="absolute top-4 right-4">
                {course.isFree ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ฟรี (Free)</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-full bg-slate-950/95 text-amber-300 font-black text-xs sm:text-sm shadow-md border border-amber-400/40">
                    ฿{course.price?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Quick Play Trigger Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handleEnrollOrStart}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110 cursor-pointer"
                  title="เริ่มเรียนคลิปแรกทันที"
                >
                  <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.8] fill-current/10" />
                </button>
              </div>

              {/* Bottom title preview */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-emerald-300 font-medium mb-0.5">
                    {course.category} · รวม {totalClips} คลิปบทเรียน
                  </p>
                  <p className="text-sm sm:text-base font-bold line-clamp-1">
                    {course.title}
                  </p>
                </div>
                
                {/* Note Taking Quick Action Overlay */}
                <button
                  onClick={() => {
                    setActiveTab('notes');
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-emerald-600 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-300" />
                  <span>จดโน้ต</span>
                </button>
              </div>
            </div>

            {/* 1.2 หัวข้อหลักสูตร (Course Title) และข้อมูลเบื้องต้น */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                  {course.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{course.rating}</span>
                  <span className="text-slate-400 font-normal">({(course.studentsCount || 1420).toLocaleString()} รีวิว)</span>
                </div>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-normal">
                  อัปเดตล่าสุด: ตุลาคม 2026
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {course.description}
              </p>
            </div>

            {/* ========================================================= */}
            {/* Interactive Tab Navigation (ภาพรวม / บทเรียน / จดโน้ต / แบบทดสอบ) */}
            {/* ========================================================= */}
            <div className="flex items-center gap-2 border-b border-slate-200/90 pb-1.5 overflow-x-auto scrollbar-none pt-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>ภาพรวมหลักสูตร</span>
              </button>

              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === 'curriculum'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>เนื้อหาบทเรียน ({totalClips})</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 shrink-0 relative ${
                  activeTab === 'notes'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-emerald-300'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>จดโน้ตส่วนตัว (Firebase)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {course.quiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeTab === 'quiz'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>แบบทดสอบวัดผล</span>
                </button>
              )}
            </div>

            {/* ========================================================= */}
            {/* TAB CONTENT: TAB 1 - OVERVIEW (ภาพรวม)                     */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-7 animate-in fade-in duration-300">
                
                {/* Personal Notes Invitation Callout Banner */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                      📝
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>สมุดจดโน้ตส่วนตัวระหว่างเรียน</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Firebase Real-time
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        บันทึกสรุปความรู้ สูตร หรือประเด็นสำคัญประจำแต่ละบท ข้อมูลจะถูกผูกกับรหัสนักศึกษาของคุณในฐานข้อมูลคลาวด์ Firebase เข้าถึงได้จากทุกอุปกรณ์
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('notes');
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>เปิดสมุดจดโน้ตของคุณ</span>
                  </button>
                </div>

                {/* 1.3 หมวดหมู่และคำอธิบายบทเรียนฉบับเต็ม */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      <span>รายละเอียดหลักสูตรฉบับเต็ม (Course Overview)</span>
                    </h2>
                    <div className="text-sm text-slate-700 leading-relaxed space-y-3 font-normal">
                      <p>{course.longDescription}</p>
                      <p>
                        หลักสูตรนี้จัดทำขึ้นโดยทีมอาจารย์และผู้ทรงคุณวุฒิ มหาวิทยาลัยราชภัฏอุดรธานี โดยมุ่งเน้นการลงมือปฏิบัติจริง มีกรณีศึกษาจากพื้นที่จริงในภาคอีสาน และเครื่องมือในการสืบค้นข้อมูลชุมชนอย่างเป็นระบบ ผู้เรียนสามารถเรียนรู้ได้ด้วยตนเองตามจังหวะเวลาที่สะดวก พร้อมทำแบบทดสอบเพื่อขอรับเกียรติบัตรรับรองสมรรถนะ
                      </p>
                    </div>
                  </div>

                  {/* 1.4 รายการ "สิ่งที่คุณจะได้รับ" (Learning Outcomes) */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>สิ่งที่คุณจะได้รับจากหลักสูตรนี้ (Learning Outcomes)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {learningOutcomes.map((outcome, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex items-start gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                            {outcome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 1.6 ข้อมูลอาจารย์ผู้สอน (Instructor Bio) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>อาจารย์ผู้สอนประจำหลักสูตร (Instructor Profile)</span>
                  </h3>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover ring-2 ring-emerald-300 shadow-md"
                    />
                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        {course.instructor.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                        {course.instructor.title}
                      </p>
                      <p className="text-xs text-slate-500 font-normal">
                        มหาวิทยาลัยราชภัฏอุดรธานี (UDRU) · การพัฒนานวัตกรรมเพื่อท้องถิ่น
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* TAB CONTENT: TAB 2 - CURRICULUM (เนื้อหาบทเรียน)             */}
            {/* ========================================================= */}
            {activeTab === 'curriculum' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs animate-in fade-in duration-300 space-y-6">
                
                {/* Active Lesson Video Player Bar */}
                {currentActiveLesson && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] text-emerald-400 font-semibold block">กำลังเรียนรู้:</span>
                        <h4 className="text-sm font-bold text-white line-clamp-1">
                          {currentActiveLesson.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTakeNoteForLesson(currentActiveLesson.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-md shadow-emerald-600/30"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>จดโน้ตสำหรับบทนี้</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Video className="w-5 h-5 text-emerald-600" />
                      <span>เนื้อหาบทเรียนและโครงสร้างหลักสูตร (Curriculum)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {course.modules.length} โมดูลการเรียนรู้ · ทั้งหมด {totalClips} คลิปบทเรียน ({hoursDisplay})
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
                    {isEnrolled ? 'พร้อมเข้าเรียนทันที' : 'เข้าถึงได้ตลอดชีพ'}
                  </span>
                </div>

                {/* Module List Accordions */}
                <div className="space-y-4">
                  {course.modules.map((module, mIdx) => (
                    <div key={module.id} className="rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-50/40">
                      <div className="p-4 bg-slate-100/70 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white text-xs flex items-center justify-center">
                            {mIdx + 1}
                          </span>
                          <span>{module.title}</span>
                        </div>
                        <span className="text-xs font-normal text-slate-500">
                          {module.lessons.length} บทเรียน
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100 bg-white">
                        {module.lessons.map((lesson, lIdx) => {
                          const isSelected = activeLessonId === lesson.id;
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => {
                                setActiveLessonId(lesson.id);
                                handleEnrollOrStart();
                              }}
                              className={`p-3.5 px-5 flex items-center justify-between text-xs transition cursor-pointer hover:bg-emerald-50/60 ${
                                isSelected ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <PlayCircle className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600 fill-emerald-100' : 'text-slate-400'}`} />
                                <span>{lIdx + 1}. {lesson.title}</span>
                              </div>
                              
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-slate-400 text-[11px] font-mono">
                                  {lesson.durationMinutes} นาที
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTakeNoteForLesson(lesson.id);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-emerald-700 transition cursor-pointer"
                                  title="จดโน้ตสำหรับบทเรียนนี้"
                                >
                                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                </button>

                                {isEnrolled ? (
                                  <span className="text-[11px] text-emerald-600 font-semibold">ดูบทเรียน</span>
                                ) : (
                                  <span className="text-[11px] text-slate-400">ตัวอย่างฟรี</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quiz CTA Banner inside Curriculum */}
                {course.quiz && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                          ✍️
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {course.quiz.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            เกณฑ์ผ่าน: ได้คะแนน {course.quiz.passingScorePercent}% ขึ้นไปเพื่อรับใบประกาศนียบัตรทางการ
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleEnrollOrStart();
                          setActiveTab('quiz');
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                      >
                        ทำแบบทดสอบประเมินผล
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB CONTENT: TAB 3 - NOTES (จดโน้ตส่วนตัว เชื่อม Firebase) */}
            {/* ========================================================= */}
            {activeTab === 'notes' && (
              <div className="animate-in fade-in duration-300">
                <CourseNotesSection
                  course={course}
                  currentUser={currentUser}
                  activeLessonId={activeLessonId}
                  onRequireLogin={onRequireLogin}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB CONTENT: TAB 4 - QUIZ (แบบทดสอบวัดผล)                   */}
            {/* ========================================================= */}
            {activeTab === 'quiz' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs animate-in fade-in duration-300 space-y-6">
                {course.quiz ? (
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-500" />
                          <span>{course.quiz.title}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          จำนวน {course.quiz.questions.length} ข้อ · เกณฑ์ผ่าน {course.quiz.passingScorePercent}%
                        </p>
                      </div>

                      {quizSubmitted && (
                        <div className={`px-4 py-2 rounded-2xl font-bold text-sm ${
                          quizScore >= course.quiz.passingScorePercent 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          คะแนนที่ได้: {quizScore}% {quizScore >= course.quiz.passingScorePercent ? '(ผ่านเกณฑ์ 🎉)' : '(ยังไม่ผ่าน)'}
                        </div>
                      )}
                    </div>

                    {/* Quiz Questions */}
                    <div className="space-y-6">
                      {course.quiz.questions.map((q, qIdx) => {
                        const isAnswered = selectedAnswers[q.id] !== undefined;
                        const isCorrect = selectedAnswers[q.id] === q.correctOptionIndex;

                        return (
                          <div 
                            key={q.id} 
                            className={`p-5 rounded-2xl border transition-all ${
                              quizSubmitted 
                                ? (isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200')
                                : 'bg-slate-50/60 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-3.5">
                              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                {q.question}
                              </h4>
                            </div>

                            <div className="space-y-2 pl-9">
                              {q.options && q.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswers[q.id] === optIdx;
                                return (
                                  <label
                                    key={optIdx}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                                      isSelected
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${q.id}`}
                                      disabled={quizSubmitted}
                                      checked={isSelected}
                                      onChange={() => {
                                        setSelectedAnswers(prev => ({
                                          ...prev,
                                          [q.id]: optIdx
                                        }));
                                      }}
                                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Action Buttons */}
                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      {quizSubmitted ? (
                        <div className="flex items-center gap-3 w-full justify-between">
                          <button
                            onClick={handleRetakeQuiz}
                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>ทำแบบทดสอบอีกครั้ง</span>
                          </button>

                          {quizScore >= course.quiz.passingScorePercent && (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>ได้รับสิทธิออกใบประกาศนียบัตรเรียบร้อยแล้ว</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(selectedAnswers).length < course.quiz.questions.length}
                          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ส่งคำตอบเพื่อประเมินผล</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    หลักสูตรนี้ไม่มีแบบทดสอบวัดผล สามารถเรียนรู้และจดโน้ตได้ตามอัธยาศัย
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* 2. คอลัมน์ฝั่งขวา (Sticky Sidebar Detail - 4 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 sticky top-20 space-y-6">
            
            {/* กล่องข้อมูลสรุปรายละเอียด (Course Meta Box) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-100 shadow-xl space-y-6 relative overflow-hidden">
              
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

              {/* ราคาหลักสูตรหลักอย่างชัดเจน */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  ราคาหลักสูตร
                </span>
                {course.isFree ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                      ฟรี
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      (ไม่มีค่าใช้จ่ายในการเรียน)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-950">
                      ฿{course.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ฿{((course.price || 390) * 1.5).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      ลด 33%
                    </span>
                  </div>
                )}
              </div>

              {/* ปุ่มสั่งการในกล่องฝั่งขวา (Call-to-Action Buttons: #FFC800 with no black border, turns black on hover with white text) */}
              <div className="space-y-2.5 font-['Mitr',sans-serif]">
                {course.isFree ? (
                  <button
                    onClick={handleEnrollOrStart}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-extrabold text-sm sm:text-base shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 border-0 group/cta"
                  >
                    <PlayCircle className="w-5 h-5 group-hover/cta:text-white transition-colors" />
                    <span>{isEnrolled ? 'เข้าสู่ห้องเรียนทันที' : 'สนใจเข้าเรียน (สมัครเรียนฟรี)'}</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (onOpenPayment) {
                          onOpenPayment(course);
                        } else {
                          handleEnrollOrStart();
                        }
                      }}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-extrabold text-sm sm:text-base shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 border-0 group/cta"
                    >
                      <Sparkles className="w-5 h-5 group-hover/cta:text-white transition-colors" />
                      <span>ซื้อคอร์สเรียนนี้ (฿{course.price?.toLocaleString()})</span>
                    </button>

                    <button
                      onClick={handleEnrollOrStart}
                      className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white text-slate-800 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 border-0"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>ทดลองเรียนฟรี (3 บทแรก)</span>
                    </button>
                  </>
                )}
              </div>

              {/* Quick Note Box in Sidebar */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-950">
                    สมุดจดโน้ตส่วนตัว (Firebase)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                  บันทึกประเด็นสำคัญระหว่างเรียน ผูกกับบัญชีนักศึกษาของคุณใน Firebase
                </p>
                <button
                  onClick={() => {
                    setActiveTab('notes');
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-2xs transition cursor-pointer flex items-center justify-center gap-1.5 mt-1"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>เปิดสมุดจดโน้ตของฉัน</span>
                </button>
              </div>

              {/* รายการข้อมูลสรุปรายละเอียด (Course Meta Box Items) */}
              <div className="pt-3 border-t border-slate-100 space-y-3.5 text-xs">
                <span className="font-bold text-slate-800 block text-[13px]">
                  หลักสูตรนี้ประกอบด้วย:
                </span>

                {/* 1. จำนวนคลิปวิดีโอ */}
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>จำนวนคลิปวิดีโอ</span>
                  </div>
                  <strong className="text-slate-900 font-mono">{totalClips} คลิป</strong>
                </div>

                {/* 2. เวลาในการเรียนทั้งหมด */}
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>เวลาในการเรียนทั้งหมด</span>
                  </div>
                  <strong className="text-slate-900">{hoursDisplay}</strong>
                </div>

                {/* 3. จำนวนเพื่อนร่วมเรียน */}
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>จำนวนเพื่อนร่วมเรียน</span>
                  </div>
                  <strong className="text-slate-900 font-mono">
                    {(course.studentsCount || 1420).toLocaleString()} คน
                  </strong>
                </div>

                {/* 4. ใบประกาศนียบัตร */}
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>ใบประกาศนียบัตร</span>
                  </div>
                  {course.hasCertificate ? (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> มีใบประกาศฯ UDRU
                    </span>
                  ) : (
                    <span className="text-slate-400">ไม่มีใบประกาศฯ</span>
                  )}
                </div>

                {/* สิทธิประโยชน์เพิ่มเติม */}
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>การเข้าถึงเนื้อหา</span>
                  </div>
                  <strong className="text-slate-900">เข้าถึงได้ตลอดชีพ</strong>
                </div>
              </div>

              {/* Guarantee Box */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>รับรองมาตรฐานหลักสูตรโดยมหาวิทยาลัยราชภัฏอุดรธานี</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. Responsive Fixed Bottom Bar บนหน้าจอมือถือ */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">ราคาหลักสูตร</span>
          {course.isFree ? (
            <span className="text-xl font-black text-emerald-600 leading-none">ฟรี</span>
          ) : (
            <span className="text-xl font-black text-slate-900 leading-none">฿{course.price?.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => {
              setActiveTab('notes');
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
            className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer"
            title="สมุดจดโน้ต"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={handleEnrollOrStart}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{course.isFree ? (isEnrolled ? 'เข้าห้องเรียน' : 'สนใจเข้าเรียนฟรี') : 'ซื้อคอร์สเรียนนี้'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

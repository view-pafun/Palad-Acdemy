import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Search, 
  X,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Course, BlogTopic, PeerStory, QuizResultRecord } from '../../types';
import { INITIAL_REGISTERED_USERS, INITIAL_QUIZ_RESULTS } from '../../data/adminMockData';

interface DashboardAnalyticsTabProps {
  courses: Course[];
  blogs: BlogTopic[];
  stories: PeerStory[];
}

export const DashboardAnalyticsTab: React.FC<DashboardAnalyticsTabProps> = ({
  courses,
  blogs,
  stories,
}) => {
  const [registeredUsers] = useState(INITIAL_REGISTERED_USERS);
  const [quizResults] = useState<QuizResultRecord[]>(INITIAL_QUIZ_RESULTS);
  const [selectedQuizResult, setSelectedQuizResult] = useState<QuizResultRecord | null>(null);
  const [searchQuizQuery, setSearchQuizQuery] = useState('');
  const [searchUserQuery, setSearchUserQuery] = useState('');

  // Total counts
  const totalPostsCount = blogs.length + stories.length;
  const totalCoursesCount = courses.length;
  const activeUsersCount = 3842;
  const totalQuizTakersCount = 2480;

  // Filtered Quiz Results
  const filteredQuizResults = quizResults.filter(q =>
    q.studentName.toLowerCase().includes(searchQuizQuery.toLowerCase()) ||
    q.studentId.includes(searchQuizQuery) ||
    q.courseTitle.toLowerCase().includes(searchQuizQuery.toLowerCase())
  );

  // Filtered Registered Users
  const filteredUsers = registeredUsers.filter(u =>
    u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.studentId.includes(searchUserQuery) ||
    u.faculty.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-['Mitr',sans-serif]">
      
      {/* 1. Header Overview & Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>ภาพรวมสถิติระบบและผลการประเมิน (Analytics Dashboard)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            สรุปข้อมูลผู้เข้าใช้, สมาชิกที่ลงทะเบียน, ยอดทำแบบทดสอบ และประสิทธิภาพหลักสูตรออนไลน์
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>ข้อมูลเรียลไทม์: ตุลาคม 2026</span>
        </div>
      </div>

      {/* 2. KPI Metrics Cards (6 Cards as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: Active Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">ผู้เข้าใช้ (Active)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {activeUsersCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% สัปดาห์นี้
            </span>
          </div>
        </div>

        {/* Card 2: Registered Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">ผู้ลงทะเบียน</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {registeredUsers.length + 5200}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              บัญชีนักศึกษา & บุคลากร
            </span>
          </div>
        </div>

        {/* Card 3: Total Quiz Takers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">ผู้ทำแบบทดสอบ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {totalQuizTakersCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-amber-700 font-semibold block mt-1">
              อัตราสอบผ่าน 88.5%
            </span>
          </div>
        </div>

        {/* Card 4: Individual Quiz Records */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">ผลทดสอบรายคน</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {quizResults.length}
            </span>
            <span className="text-[11px] text-purple-700 font-semibold block mt-1">
              บันทึกผลมาตรฐาน
            </span>
          </div>
        </div>

        {/* Card 5: Total Posts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">โพสต์ทั้งหมด</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {totalPostsCount}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              บล็อก ({blogs.length}) · เรื่องเล่า ({stories.length})
            </span>
          </div>
        </div>

        {/* Card 6: Total Courses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold text-slate-600">หลักสูตรทั้งหมด</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {totalCoursesCount}
            </span>
            <span className="text-[11px] text-teal-700 font-semibold block mt-1">
              เปิดสอนออนไลน์
            </span>
          </div>
        </div>

      </div>

      {/* 3. Trend Visual Graph (CSS Bar Chart of Daily Visitors) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              สถิติการเข้าใช้งานและกิจกรรมประจำสัปดาห์ (Weekly Activity)
            </h3>
            <p className="text-xs text-slate-400">เปรียบเทียบยอดการเข้าเรียนและทำแบบทดสอบรายวัน</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" /> เข้าชมเว็บไซต์
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> ทำแบบทดสอบ
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-44 sm:h-52 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
          {[
            { day: 'จันทร์', visits: 2450, quizzes: 320, pct: 70 },
            { day: 'อังคาร', visits: 3100, quizzes: 410, pct: 85 },
            { day: 'พุธ', visits: 2900, quizzes: 380, pct: 80 },
            { day: 'พฤหัสฯ', visits: 3840, quizzes: 510, pct: 100 },
            { day: 'ศุกร์', visits: 3350, quizzes: 450, pct: 90 },
            { day: 'เสาร์', visits: 1980, quizzes: 210, pct: 55 },
            { day: 'อาทิตย์', visits: 2200, quizzes: 280, pct: 60 }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                {/* Bar 1: Visits */}
                <div 
                  className="w-1/2 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110 relative"
                  style={{ height: `${bar.pct}%` }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 font-mono">
                    {bar.visits} ครั้ง
                  </span>
                </div>
                {/* Bar 2: Quizzes */}
                <div 
                  className="w-1/2 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110 relative"
                  style={{ height: `${Math.max(15, bar.pct * 0.45)}%` }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 font-mono">
                    {bar.quizzes} ชุด
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Section: จำนวนผลทำแบบทดสอบรายบุคคล (Individual Quiz Results Table & Modal) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>ผลการทำแบบทดสอบรายบุคคล (Individual Quiz Results)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คลิกปุ่ม "ดูคะแนนและรายละเอียด" เพื่อตรวจสอบคำตอบข้อต่อข้อและสถานะใบประกาศนียบัตร
            </p>
          </div>

          {/* Search box for Quiz Results */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัสนักศึกษา, คอร์ส..."
              value={searchQuizQuery}
              onChange={(e) => setSearchQuizQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quiz Results Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ผู้เข้าสอบ</th>
                <th className="py-3.5 px-4">หลักสูตร</th>
                <th className="py-3.5 px-4 text-center">คะแนนที่ได้</th>
                <th className="py-3.5 px-4 text-center">ผลการประเมิน</th>
                <th className="py-3.5 px-4">วันที่สอบ / เวลา</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuizResults.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{result.studentName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{result.studentId} · {result.faculty}</p>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-800 font-medium">
                    {result.courseTitle}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {result.score}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      (เกณฑ์ผ่าน {result.passingScore}%)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {result.passed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ผ่านเกณฑ์</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>ไม่ผ่านเกณฑ์</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    <span className="block text-slate-700">{result.takenAt}</span>
                    <span className="text-slate-400">ใช้เวลา: {result.timeSpent}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedQuizResult(result)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-[11px] transition cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>เปิดดูคะแนนและรายละเอียด</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Section: รายชื่อผู้สมัครเข้าใช้งาน & จำนวนผู้ลงทะเบียน (Registered Users Table) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>รายชื่อผู้สมัครเข้าใช้งานและลงทะเบียน (Registered Users)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงบัญชีผู้ใช้งานระบบทั้งหมด พร้อมสังกัดคณะและสถิติการเรียน
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ใช้, รหัสนักศึกษา..."
              value={searchUserQuery}
              onChange={(e) => setSearchUserQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ผู้ใช้งาน</th>
                <th className="py-3.5 px-4">คณะ / สาขาวิชา</th>
                <th className="py-3.5 px-4">อีเมลมหาวิทยาลัย</th>
                <th className="py-3.5 px-4 text-center">คอร์สที่ลง</th>
                <th className="py-3.5 px-4 text-center">คะแนนสะสม (XP)</th>
                <th className="py-3.5 px-4">วันที่ลงทะเบียน</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{user.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {user.faculty}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    {user.enrolledCount} คอร์ส
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-amber-600">
                    {user.points} XP
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {user.registeredDate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Individual Quiz Result Details Modal */}
      {selectedQuizResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-800">
            
            <button
              onClick={() => setSelectedQuizResult(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                🏆
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    ผลคะแนนสอบและคำตอบรายข้อ
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedQuizResult.passed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedQuizResult.passed ? 'ผ่านเกณฑ์มาตรฐาน' : 'ยังไม่ผ่าน'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {selectedQuizResult.studentName} ({selectedQuizResult.studentId}) · {selectedQuizResult.faculty}
                </p>
                <p className="text-xs text-emerald-800 font-semibold">
                  หลักสูตร: "{selectedQuizResult.courseTitle}"
                </p>
              </div>
            </div>

            {/* Score Summary Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block">คะแนนที่ทำได้</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {selectedQuizResult.score}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block">เกณฑ์ผ่าน</span>
                <span className="text-2xl font-black text-slate-600 font-mono">
                  {selectedQuizResult.passingScore}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block">เวลาที่ใช้</span>
                <span className="text-base font-bold text-slate-800 font-mono mt-1 block">
                  {selectedQuizResult.timeSpent}
                </span>
              </div>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                การตรวจสอบคำตอบทีละข้อ (Item Analysis)
              </h4>

              {selectedQuizResult.details && selectedQuizResult.details.length > 0 ? (
                selectedQuizResult.details.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      item.isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        ข้อที่ {idx + 1}: {item.question}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${
                        item.isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                      }`}>
                        {item.isCorrect ? 'ถูกต้อง +1' : 'ตอบผิด 0'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] pt-1 border-t border-slate-200/60">
                      <p className="text-slate-700">
                        คำตอบของผู้เข้าสอบ: <strong className={item.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{item.selectedAnswer}</strong>
                      </p>
                      {!item.isCorrect && (
                        <p className="text-emerald-800">
                          คำตอบที่ถูกต้องคือ: <strong>{item.correctAnswer}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">ไม่มีข้อมูลคำตอบย่อย</p>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedQuizResult(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

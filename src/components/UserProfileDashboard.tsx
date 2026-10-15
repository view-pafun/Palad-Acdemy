import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Camera, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Trophy, 
  Heart, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  Plus, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Clock, 
  Paperclip, 
  Send, 
  Compass, 
  Lock, 
  Users, 
  FileText, 
  Check, 
  Eye, 
  EyeOff, 
  Edit3,
  X,
  Radar,
  RotateCcw
} from 'lucide-react';
import { User, Course, BlogTopic, CertificateData, AchievementBadge } from '../types';
import { ProfileAvatarModal } from './ProfileAvatarModal';
import { CosmicResultDashboard } from './CosmicResultDashboard';

interface UserProfileDashboardProps {
  currentUser: User | null;
  courses: Course[];
  blogs: BlogTopic[];
  onSwitchRole: (newRole: 'student' | 'instructor' | 'admin' | 'lecturer') => void;
  onNavigateToTab: (tab: string) => void;
  onClose?: () => void;
  onOpenCertificateVault?: () => void;
  onUpdateAvatar?: (newUrl: string) => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({
  currentUser,
  courses,
  blogs,
  onSwitchRole,
  onNavigateToTab,
  onClose,
  onOpenCertificateVault,
  onUpdateAvatar,
}) => {
  // Current user role: 'instructor' / 'lecturer' (Teacher/Expert) or 'student' (Student/General User)
  const isTeacher = currentUser?.role === 'instructor' || currentUser?.role === 'lecturer';
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && currentUser) {
        const updated = { ...currentUser, avatar: dataUrl };
        try {
          localStorage.setItem('udru_current_user', JSON.stringify(updated));
        } catch {}
        showToast('อัปเดตรูปโปรไฟล์สำเร็จเรียบร้อยแล้ว!');
      }
    };
    reader.readAsDataURL(file);
  };

  // System Announcement visibility toggle
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Virtual Card Flip Modal state
  const [showVirtualCard, setShowVirtualCard] = useState(false);

  // Navigation Tabs: 'blogs' | 'courses' | 'events' | 'certificates' | 'notifications' | 'assessment'
  const [activeTab, setActiveTab] = useState<'blogs' | 'courses' | 'events' | 'certificates' | 'notifications' | 'assessment'>('blogs');

  // Blog Sub-filter: 'my_ideas' | 'credited' | 'drafts' | 'saved' | 'liked'
  const [blogSubFilter, setBlogSubFilter] = useState<'my_ideas' | 'credited' | 'drafts' | 'saved' | 'liked'>('my_ideas');

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstNameTh: isTeacher ? 'ธีรภัทร' : 'ณภัทร',
    lastNameTh: isTeacher ? 'วัฒนโกศล' : 'วงศ์เจริญ',
    firstNameEn: isTeacher ? 'Theerapat' : 'Naphat',
    lastNameEn: isTeacher ? 'Wattanakoosol' : 'Wongcharoen',
    gender: 'ชาย',
    birthDate: isTeacher ? '1984-06-15' : '2003-09-24',
    educationLevel: isTeacher ? 'ปริญญาเอก (Ph.D. Social Innovation)' : 'ปริญญาตรี ปีที่ 3',
    employmentStatus: isTeacher ? 'อาจารย์ประจำมหาวิทยาลัยราชภัฏอุดรธานี' : 'นักศึกษาภาคปกติ (UDRU)',
    faculty: isTeacher ? 'คณะมนุษยศาสตร์และสังคมศาสตร์' : 'คณะวิทยาศาสตร์ สาขาสิ่งแวดล้อม',
    phone: '089-456-7890',
    externalEmail: isTeacher ? 'theerapat.prof@gmail.com' : 'naphat.dev@gmail.com',
    showContactPublicly: false,
    address: '64 ถนนทหาร ตำบลหมากแข้ง อำเภอเมือง จังหวัดอุดรธานี 41000',
    connectedGoogle: true,
    connectedFacebook: false
  });

  // Teacher Event Creation Modal state
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [eventCreatedToast, setEventCreatedToast] = useState(false);

  // Teacher Document Upload in Knowledge Base
  const [teacherUploadedFile, setTeacherUploadedFile] = useState<string | null>(null);

  // Student Sanctuary Consultation Booking
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingSuccessToast, setBookingSuccessToast] = useState(false);

  // Social Stats
  const followersCount = isTeacher ? 1420 : 388;
  const followingCount = isTeacher ? 120 : 194;
  const usernameHandle = isTeacher ? '@theerapat_udru' : '@naphat_engineer';

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessToast(true);
    setIsEditingProfile(false);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  // Mock Notifications for Social Feed
  const [socialNotifications] = useState([
    {
      id: 'sn-1',
      user: 'อาจารย์ รุ่งอรุณ เมธาวี',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      action: 'แสดงความคิดเห็นในบทความของคุณ',
      detail: '"แนวคิดเรื่องการวิเคราะห์ปัญหาขยะชุมชนยอดเยี่ยมมากค่ะ"',
      time: '15 นาทีที่แล้ว',
      type: 'comment'
    },
    {
      id: 'sn-2',
      user: 'กิตติศักดิ์ พรหมรักษา (นักศึกษา UDRU)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      action: 'เริ่มกดติดตามคุณ',
      detail: 'เริ่มติดตามคอนเทนต์และแนวคิดของคุณแล้ว',
      time: '2 ชั่วโมงที่แล้ว',
      type: 'follow'
    },
    {
      id: 'sn-3',
      user: 'วรรณิสา แก้วมณี',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      action: 'กดหัวใจและบันทึกโพสต์ของคุณ',
      detail: 'โพสต์: "ถอดบทเรียนการลงพื้นที่บ้านโนนสมบูรณ์"',
      time: '5 ชั่วโมงที่แล้ว',
      type: 'like'
    }
  ]);

  return (
    <div className="bg-white min-h-screen text-slate-800 font-['Prompt',sans-serif]">
      {/* Toast Notifications */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-purple-500 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-purple-400" />
          <span className="text-xs sm:text-sm font-medium">บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว</span>
        </div>
      )}

      {eventCreatedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-medium">สร้างกิจกรรมใหม่และเปิดรับสมัครสำเร็จ!</span>
        </div>
      )}

      {bookingSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium">จองคิวนัดหมายปรึกษาพักใจสำเร็จ! พี่เลี้ยงจะติดต่อกลับ</span>
        </div>
      )}

      {/* Close button if presented in a modal / overlay */}
      {onClose && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-end">
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>ปิดหน้าต่างโปรไฟล์</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* [ส่วนที่ 1] ด้านบนสุด (Header Banner Section) */}
      {/* ========================================================================= */}
      <section className="relative bg-white pb-6 border-b border-slate-100">
        {/* Cover Banner (โทนสีส้มอิฐ/น้ำตาล Terracotta ตามภาพตัวอย่าง) */}
        <div className="w-full h-44 sm:h-56 md:h-64 bg-gradient-to-r from-[#b45309] via-[#c2410c] to-[#9a3412] relative overflow-hidden">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end justify-between pb-4">
            <span className="text-white/40 text-xs font-mono tracking-widest uppercase">
              UDRU LIFELONG LEARNING & SOCIAL ENGINEERS
            </span>
          </div>
        </div>

        {/* Profile Lockup & System Announcement Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Left: Avatar overlapping banner + User Identification */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* User Avatar with Camera Update Icon */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 ring-2 ring-purple-100">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                {/* Camera upload button */}
                <button
                  onClick={() => setShowCropModal(true)}
                  title="อัปเดตและครอบตัดรูปภาพโปรไฟล์ใหม่ (Upload & Crop Profile Picture)"
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-slate-900 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all cursor-pointer group-hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Identification: Real Name & Role Status */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {profileForm.firstNameTh} {profileForm.lastNameTh}
                  </h1>
                  {/* Status/Role Tag */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isTeacher 
                      ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    {isTeacher ? '(สิทธิ์ อาจารย์ / ผู้ทรงคุณวุฒิ)' : '(สิทธิ์ นักศึกษา)'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
                  {profileForm.firstNameEn} {profileForm.lastNameEn} · {profileForm.faculty}
                </p>

                {/* Role Switcher Toolbar for evaluation / quick testing */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">สลับสิทธิ์ LMS:</span>
                  <button
                    onClick={() => onSwitchRole('student')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      !isTeacher && currentUser?.role !== 'admin'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🎓 นักศึกษา (Student)
                  </button>
                  <button
                    onClick={() => onSwitchRole('instructor')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isTeacher
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    👨‍🏫 ผู้สอน (Instructor)
                  </button>
                  <button
                    onClick={() => onSwitchRole('admin')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentUser?.role === 'admin'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ⚙️ แอดมิน (Admin)
                  </button>
                </div>
              </div>
            </div>

            {/* Right: System Announcement (บอร์ดประกาศข่าว - แถบสีม่วงสดด้านบนขวา) */}
            <div className="w-full lg:max-w-md">
              <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl p-4 shadow-lg border border-purple-500/30 relative">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                    <span className="text-xs font-bold tracking-wider uppercase text-purple-200">
                      บอร์ดประกาศข่าวพิเศษ (System Announcement)
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAnnouncement(!showAnnouncement)}
                    className="text-[11px] text-purple-200 hover:text-white underline cursor-pointer flex items-center gap-1 font-medium"
                  >
                    {showAnnouncement ? 'ซ่อนรายละเอียด' : 'แสดงรายละเอียด'}
                    {showAnnouncement ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showAnnouncement && (
                  <div className="mt-2 text-xs text-purple-100 leading-relaxed animate-in fade-in">
                    <p className="font-semibold text-white">
                      📢 ขอเชิญร่วมส่งผลงานประกวดนวัตกรรม ประจำปี 2569
                    </p>
                    <p className="mt-1 text-[11px] text-purple-200">
                      {isTeacher 
                        ? 'อาจารย์ที่ปรึกษาสามารถคลิกสร้างกลุ่มและยื่นข้อเสนอโครงการของนักศึกษาในระบบได้แล้ววันนี้' 
                        : 'นักศึกษาสามารถรวมกลุ่ม 3-5 คน เพื่อเข้าร่วมเวิร์กช็อปและขอรับทุนพัฒนาพื้นที่ 10,000 บาท'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Main 3-Column / Grid Layout Structure */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ======================================================================= */}
          {/* [ส่วนที่ 2] แถบด้านข้างซ้าย (Sidebar Widgets & Personal Info) - 4 Cols */}
          {/* ======================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Account Credentials Card (กล่องสีเทาจางสำหรับค่าคงที่ที่แก้ไขไม่ได้) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Account Credentials (ข้อมูลบัญชีประจำตัว)</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* CMU/UDRU LE ACCOUNT */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    CMU LE / UDRU ACCOUNT
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 break-all">
                      {isTeacher ? 'theerapat.w@udru.ac.th' : 'view.paf@lifelong.cmu.ac.th'}
                    </span>
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </div>
                </div>

                {/* LEARNER ID / USER ID */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    LEARNER ID / USER ID
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {isTeacher ? '820491024' : '719524219'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                      Verified
                    </span>
                  </div>
                </div>

                {/* CMU LIFELONG CARD: ปุ่มกดดูบัตรเสมือนจริง */}
                <button
                  onClick={() => setShowVirtualCard(!showVirtualCard)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>ดูบัตรเสมือนจริง (CMU LIFELONG CARD)</span>
                </button>
              </div>

              {/* Virtual Card Preview / Flip Display */}
              {showVirtualCard && (
                <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white border-2 border-purple-400/40 shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">
                      VIRTUAL LEARNER CARD
                    </span>
                    <span className="text-xs font-bold text-emerald-400">ACTIVE</span>
                  </div>
                  <p className="font-extrabold text-base tracking-tight mb-1">
                    {profileForm.firstNameTh} {profileForm.lastNameTh}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">{profileForm.faculty}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10 font-mono">
                    <span>ID: {isTeacher ? '820491024' : '719524219'}</span>
                    <span>EXP: 2028-12-31</span>
                  </div>
                </div>
              )}
            </div>

            {/* กล่องเมนูข้อมูลส่วนตัว (Edit Profile Form) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <UserIcon className="w-4 h-4 text-purple-700" />
                  <span>ข้อมูลส่วนตัว (Edit Profile)</span>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-xs font-medium text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'ยกเลิก' : 'แก้ไขข้อมูล'}</span>
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* Firstname / Lastname TH */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">ชื่อ (ภาษาไทย)</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.firstNameTh}
                      onChange={(e) => setProfileForm({ ...profileForm, firstNameTh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">นามสกุล (ภาษาไทย)</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.lastNameTh}
                      onChange={(e) => setProfileForm({ ...profileForm, lastNameTh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                    />
                  </div>
                </div>

                {/* Firstname / Lastname EN */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Firstname (EN)</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.firstNameEn}
                      onChange={(e) => setProfileForm({ ...profileForm, firstNameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Lastname (EN)</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.lastNameEn}
                      onChange={(e) => setProfileForm({ ...profileForm, lastNameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                    />
                  </div>
                </div>

                {/* Gender & Birthdate */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">เพศ</label>
                    <select
                      disabled={!isEditingProfile}
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition cursor-pointer"
                    >
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                      <option value="ไม่ระบุ">ไม่ระบุ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">วัน/เดือน/ปีเกิด</label>
                    <input
                      type="date"
                      disabled={!isEditingProfile}
                      value={profileForm.birthDate}
                      onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                    />
                  </div>
                </div>

                {/* Education / Employment Status */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    ข้อมูลการศึกษา / สถานะภาพการทำงาน
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={profileForm.employmentStatus}
                    onChange={(e) => setProfileForm({ ...profileForm, employmentStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                  />
                </div>

                {/* Contact Info: Phone & External Email */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="tel"
                    disabled={!isEditingProfile}
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">อีเมลภายนอก</label>
                  <input
                    type="email"
                    disabled={!isEditingProfile}
                    value={profileForm.externalEmail}
                    onChange={(e) => setProfileForm({ ...profileForm, externalEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                  />
                </div>

                {/* Toggle Switch: แสดงข้อมูลนี้บนหน้าโปรไฟล์สาธารณะหรือไม่ */}
                <div className="pt-1 flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <div className="pr-2">
                    <p className="text-[11px] font-bold text-purple-950">แสดงเบอร์และอีเมลสาธารณะ</p>
                    <p className="text-[10px] text-purple-700">อนุญาตให้ผู้ใช้อื่นเห็นข้อมูลติดต่อ</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileForm.showContactPublicly}
                      onChange={(e) => setProfileForm({ ...profileForm, showContactPublicly: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Address */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">ที่อยู่ที่ติดต่อได้สะดวก</label>
                  <textarea
                    rows={2}
                    disabled={!isEditingProfile}
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100 text-slate-900 focus:outline-purple-600 transition"
                  />
                </div>

                {/* การเชื่อมต่อ Account: ปุ่มกดผูกบัญชีโซเชียลมีเดีย */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">เชื่อมต่อบัญชีโซเชียล</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, connectedGoogle: !profileForm.connectedGoogle })}
                      className={`px-3 py-2 rounded-xl text-[11px] font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        profileForm.connectedGoogle 
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Google</span>
                      {profileForm.connectedGoogle ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, connectedFacebook: !profileForm.connectedFacebook })}
                      className={`px-3 py-2 rounded-xl text-[11px] font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        profileForm.connectedFacebook 
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Facebook</span>
                      {profileForm.connectedFacebook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Save button if editing */}
                {isEditingProfile && (
                  <button
                    type="submit"
                    className="w-full mt-3 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                  >
                    บันทึกข้อมูลส่วนตัว
                  </button>
                )}
              </form>
            </div>

            {/* Dynamic Role Widget (Sidebar addition) */}
            {/* Logic for Student: Life Blueprint quick shortcut */}
            {!isTeacher && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-xs">
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>เมนูเสริมเฉพาะนักศึกษา</span>
                </div>
                <p className="text-xs text-amber-800 mb-3 leading-relaxed">
                  สำรวจตัวตน 4 มิติ และสร้างพิมพ์เขียวชีวิตของคุณได้ทันที
                </p>
                <button
                  onClick={() => onNavigateToTab('lifepath')}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>แบบทดสอบเส้นทางชีวิต (Life Blueprint)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Logic for Teacher: Advisor link to Sanctuary */}
            {isTeacher && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 rounded-3xl p-5 shadow-2xs">
                <div className="flex items-center gap-2 mb-2 text-purple-900 font-bold text-xs">
                  <Heart className="w-4 h-4 text-purple-700 fill-purple-200" />
                  <span>เมนูอาจารย์ที่ปรึกษา (Advisor)</span>
                </div>
                <p className="text-xs text-purple-800 mb-3 leading-relaxed">
                  เข้าสู่ห้องให้คำปรึกษา 1-on-1 และตรวจดูคิวนัดหมายของนักศึกษาในโครงการช่องทางพักใจ
                </p>
                <button
                  onClick={() => onNavigateToTab('sanctuary')}
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>เข้าสู่ห้องที่ปรึกษา "ช่องทางพักใจ"</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ======================================================================= */}
          {/* [ส่วนที่ 3] พื้นที่คอนเทนต์หลักและแท็บระบบ (Main Content & Navigation Tabs) - 8 Cols */}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Bar of Section 3: Social Stats (Followers / Following) Style Lemon8 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                  {usernameHandle}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)
                </p>
              </div>

              {/* Social Stats Counters */}
              <div className="flex items-center gap-8">
                <div className="text-center sm:text-right">
                  <span className="text-lg font-black text-slate-900 block leading-tight font-mono">
                    {followersCount.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">ผู้ติดตาม (Followers)</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center sm:text-right">
                  <span className="text-lg font-black text-slate-900 block leading-tight font-mono">
                    {followingCount.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">กำลังติดตาม (Following)</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center sm:text-right">
                  <span className="text-lg font-black text-purple-700 block leading-tight font-mono">
                    {currentUser?.points || 850} XP
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">คะแนนสะสม</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (แถบเมนูหลักสลับคอนเทนต์ มีเส้นใต้สีน้ำเงินเข้ม/ม่วงวิ่งตาม) */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-2 sm:p-3 shadow-2xs">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto border-b border-slate-100 pb-2">
                
                {/* Tab 1: Blogs / Ideas */}
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'blogs'
                      ? 'text-purple-900 font-bold bg-purple-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>บล็อกและไอเดีย</span>
                  </div>
                  {activeTab === 'blogs' && (
                    <span className="absolute bottom-[-9px] left-3 right-3 h-[3px] bg-purple-700 rounded-full" />
                  )}
                </button>

                {/* Tab 2: Enrolled Courses */}
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'courses'
                      ? 'text-purple-900 font-bold bg-purple-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>หลักสูตรที่ลงทะเบียน</span>
                  </div>
                  {activeTab === 'courses' && (
                    <span className="absolute bottom-[-9px] left-3 right-3 h-[3px] bg-purple-700 rounded-full" />
                  )}
                </button>

                {/* Tab 3: Joined Events */}
                <button
                  onClick={() => setActiveTab('events')}
                  className={`relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'events'
                      ? 'text-purple-900 font-bold bg-purple-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>กิจกรรมที่เข้าร่วม</span>
                  </div>
                  {activeTab === 'events' && (
                    <span className="absolute bottom-[-9px] left-3 right-3 h-[3px] bg-purple-700 rounded-full" />
                  )}
                </button>

                {/* Tab 4: Certificates */}
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'certificates'
                      ? 'text-purple-900 font-bold bg-purple-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>คลังเกียรติบัตร</span>
                  </div>
                  {activeTab === 'certificates' && (
                    <span className="absolute bottom-[-9px] left-3 right-3 h-[3px] bg-purple-700 rounded-full" />
                  )}
                </button>

                {/* Tab 5: Notification Center */}
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'notifications'
                      ? 'text-purple-900 font-bold bg-purple-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <span>การแจ้งเตือนโซเชียล</span>
                  </div>
                  {activeTab === 'notifications' && (
                    <span className="absolute bottom-[-9px] left-3 right-3 h-[3px] bg-purple-700 rounded-full" />
                  )}
                </button>

                {/* Tab 6: Assessment & SBO Radar */}
                <button
                  onClick={() => setActiveTab('assessment')}
                  className={`relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'assessment'
                      ? 'text-slate-950 font-bold bg-[#FFC800] shadow-2xs'
                      : 'text-slate-700 hover:text-black hover:bg-amber-50/70'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Radar className="w-4 h-4 text-slate-900" />
                    <span>ผลทดสอบตัวตน & SBO Radar</span>
                  </div>
                  {activeTab === 'assessment' && (
                    <span className="absolute bottom-[-9px] left-3 right-3 h-[3px] bg-slate-950 rounded-full" />
                  )}
                </button>
              </div>

              {/* TAB 1 CONTENT: Blogs & Ideas with Role-Based dynamic logic */}
              {activeTab === 'blogs' && (
                <div className="pt-4 space-y-4">
                  {/* Sub-Filters Header & Role-Based Posting Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    {/* Sub-filter chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                      {[
                        { id: 'my_ideas', label: 'ไอเดียของฉัน' },
                        { id: 'credited', label: 'ไอเดียที่ได้รับเครดิต' },
                        { id: 'drafts', label: 'แบบร่าง' },
                        { id: 'saved', label: 'ไอเดียที่เก็บไว้' },
                        { id: 'liked', label: 'บล็อกที่กดหัวใจ' },
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setBlogSubFilter(sub.id as any)}
                          className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                            blogSubFilter === sub.id
                              ? 'bg-purple-700 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>

                    {/* Role-Based Posting Action:
                        - Teacher: สามารถโพสต์ในห้องคลังความรู้หลัก และแนบไฟล์เอกสารได้
                        - Student: ห้ามโพสต์ในคลังความรู้หลัก อนุญาตเฉพาะหมวด "พี่ถึงน้อง"
                    */}
                    <div>
                      {isTeacher ? (
                        /* Teacher Permission: Knowledge base posting + Attachment upload */
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onNavigateToTab('blog');
                            }}
                            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>เขียนบทความคลังความรู้ (อาจารย์)</span>
                          </button>
                          
                          {/* Attach file tool button */}
                          <label className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer transition flex items-center gap-1 text-xs font-medium" title="แนบไฟล์งาน/เอกสารประกอบ">
                            <Upload className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">แนบไฟล์</span>
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setTeacherUploadedFile(e.target.files[0].name);
                                  showToast(`แนบไฟล์เอกสารประกอบ "${e.target.files[0].name}" เรียบร้อยแล้ว`);
                                }
                              }} 
                            />
                          </label>
                        </div>
                      ) : (
                        /* Student Strict Permission: Post ONLY in "พี่ถึงน้อง" category */
                        <button
                          onClick={() => {
                            onNavigateToTab('stories');
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>เขียนเล่าเรื่อง "พี่ถึงน้อง"</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Attachment Notice if uploaded by Teacher */}
                  {isTeacher && teacherUploadedFile && (
                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-purple-700" />
                        <span>ไฟล์แนบเอกสารวิชาการ: <strong>{teacherUploadedFile}</strong></span>
                      </div>
                      <button onClick={() => setTeacherUploadedFile(null)} className="text-purple-600 hover:text-purple-900">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Blog Cards List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {blogs.slice(0, 4).map((post) => (
                      <div key={post.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 hover:shadow-md transition">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                          <span className="font-semibold text-purple-700">{post.category}</span>
                          <span>{post.createdAt}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-rose-500">
                              <Heart className="w-3.5 h-3.5 fill-rose-500" />
                              {post.likesCount || 12}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {post.comments?.length || 4}
                            </span>
                          </div>
                          <button
                            onClick={() => onNavigateToTab('blog')}
                            className="text-purple-700 hover:underline font-medium text-xs cursor-pointer"
                          >
                            อ่านบทความ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2 CONTENT: Enrolled Courses */}
              {activeTab === 'courses' && (
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">หลักสูตรที่ลงทะเบียนไว้</span>
                    <button onClick={() => onNavigateToTab('courses')} className="text-xs text-purple-700 hover:underline font-semibold cursor-pointer">
                      ดูคอร์สทั้งหมดในระบบ →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {courses.slice(0, 3).map((c, i) => (
                      <div key={c.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img src={c.thumbnail} alt={c.title} className="w-16 h-12 object-cover rounded-xl" />
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                            <p className="text-xs text-slate-500">{c.instructor?.name || 'อาจารย์ผู้เชี่ยวชาญ'} · {c.durationHours} ชั่วโมง</p>
                          </div>
                        </div>

                        <div className="w-full sm:w-48 text-right">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">ความก้าวหน้า</span>
                            <span className="font-bold text-purple-700">{i === 0 ? '100%' : '65%'}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-700 rounded-full" style={{ width: i === 0 ? '100%' : '65%' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3 CONTENT: Events with Role-Based dynamic logic */}
              {activeTab === 'events' && (
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">กิจกรรมและเวิร์กช็อปล่าสุด</span>
                    
                    {/* Role-Based Event Action:
                        - Teacher: ปรากฏปุ่มสีเหลืองเด่นชัด "+ สร้างกิจกรรม"
                        - Student: ไม่มีปุ่มสร้าง ทำได้เพียงกดขอเข้าร่วม
                    */}
                    {isTeacher ? (
                      <button
                        onClick={() => setShowCreateEventModal(true)}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                        <span>+ สร้างกิจกรรม (สิทธิ์อาจารย์)</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">เลือกกดขอเข้าร่วมกิจกรรมที่สนใจ</span>
                    )}
                  </div>

                  {/* Event Creation Modal for Teacher */}
                  {showCreateEventModal && (
                    <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950">สร้างกิจกรรมใหม่ในระบบ (Teacher Role)</span>
                        <button onClick={() => setShowCreateEventModal(false)} className="text-amber-800 hover:text-black">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <input
                          type="text"
                          placeholder="ชื่อกิจกรรม / เวิร์กช็อป"
                          value={newEventTitle}
                          onChange={(e) => setNewEventTitle(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-amber-200 bg-white"
                        />
                        <input
                          type="date"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="px-3 py-2 rounded-xl border border-amber-200 bg-white"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!newEventTitle) return;
                          setShowCreateEventModal(false);
                          setEventCreatedToast(true);
                          setNewEventTitle('');
                          setTimeout(() => setEventCreatedToast(false), 3500);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        บันทึกและเผยแพร่กิจกรรม
                      </button>
                    </div>
                  )}

                  {/* Events list */}
                  <div className="space-y-3">
                    {[
                      {
                        title: 'อบรมเครื่องมือ 4 คุณลักษณะสำคัญกับการวิเคราะห์ข้อมูลชุมชน',
                        date: '15 พฤศจิกายน 2569',
                        location: 'ห้องประชุมเฉลิมพระเกียรติ UDRU',
                        seats: 'รับ 60 ที่นั่ง',
                        joined: true
                      },
                      {
                        title: 'เสวนาวิชาการ: นวัตกรรมสังคมเพื่อการท่องเที่ยวเชิงนิเวศน์อีสานเหนือ',
                        date: '28 พฤศจิกายน 2569',
                        location: 'Online ผ่าน Zoom Meeting',
                        seats: 'รับ 100 ที่นั่ง',
                        joined: false
                      }
                    ].map((ev, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                            {ev.date}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{ev.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{ev.location} · {ev.seats}</p>
                        </div>

                        {/* Button logic */}
                        {ev.joined ? (
                          <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>เข้าร่วมแล้ว</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => showToast(`คุณได้ส่งคำขอเข้าร่วมกิจกรรม "${ev.title}" เรียบร้อยแล้ว`)}
                            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs transition self-start sm:self-center cursor-pointer"
                          >
                            ขอเข้าร่วมกิจกรรม
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Student Only Widget: ตารางเวลานัดหมายคุยพักใจ (Sanctuary Booking Widget) */}
                  {!isTeacher && (
                    <div className="mt-6 pt-5 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <h4 className="text-sm font-bold text-slate-900">
                          ตารางเวลานัดหมายคุยพักใจ (ช่องทางพักใจ 1-on-1)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        คลิกเลือกช่วงเวลาที่คุณสะดวกเพื่อจองคิวนัดหมายปรึกษากับอาจารย์หรือพี่เลี้ยงประจำศูนย์พักใจ
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          'จันทร์ 13:00 - 14:00',
                          'อังคาร 10:00 - 11:00',
                          'พุธ 15:00 - 16:00',
                          'ศุกร์ 14:00 - 15:00'
                        ].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer text-center ${
                              selectedSlot === slot
                                ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      {selectedSlot && (
                        <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-200">
                          <span className="text-xs text-rose-900">ช่วงเวลาที่เลือก: <strong>{selectedSlot}</strong></span>
                          <button
                            onClick={() => {
                              setBookingSuccessToast(true);
                              setSelectedSlot(null);
                              setTimeout(() => setBookingSuccessToast(false), 3500);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                          >
                            ยืนยันการจองคิว
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4 CONTENT: Certificates */}
              {activeTab === 'certificates' && (
                <div className="pt-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">เกียรติบัตรรับรองสมรรถนะ (UDRU Lifelong Certificates)</span>
                      <span className="text-[11px] text-emerald-700 font-semibold">ยืนยันความถูกต้องด้วยระบบดิจิทัล</span>
                    </div>
                    {onOpenCertificateVault && (
                      <button
                        onClick={onOpenCertificateVault}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                      >
                        <Award className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                        <span>เปิดหน้าต่าง Certificate Vault 🏆</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: '4 คุณลักษณะสำคัญกับการพัฒนาท้องถิ่น',
                        date: '10 มีนาคม 2569',
                        code: 'UDRU-SE-2026-0891'
                      },
                      {
                        title: 'การประยุกต์ใช้ AI เพื่อการวิจัยชุมชน',
                        date: '24 กุมภาพันธ์ 2569',
                        code: 'UDRU-AI-2026-0412'
                      }
                    ].map((cert, i) => (
                      <div key={i} className="p-4 rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50/40 relative">
                        <div className="flex items-center justify-between text-xs text-purple-700 mb-2 font-mono">
                          <span>{cert.code}</span>
                          <Award className="w-4 h-4 text-amber-500" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{cert.title}</h4>
                        <p className="text-xs text-slate-500 mb-4">ออกให้เมื่อ: {cert.date}</p>
                        <button
                          onClick={() => {
                            if (onOpenCertificateVault) {
                              onOpenCertificateVault();
                            } else {
                              showToast(`เปิดดูเกียรติบัตรฉบับเต็มของ ${cert.title}`);
                            }
                          }}
                          className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>เปิดดูใน Certificate Vault</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5 CONTENT: Notification Center (Social Feed Style) */}
              {activeTab === 'notifications' && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">รายการแจ้งเตือนสไตล์ Social Feed</span>
                    <span className="text-xs text-slate-400">อัปเดตแบบเรียลไทม์</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {socialNotifications.map((sn) => (
                      <div key={sn.id} className="py-3 flex items-start gap-3.5 hover:bg-slate-50/80 p-2 rounded-xl transition">
                        <img src={sn.avatar} alt={sn.user} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100" />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="text-slate-800">
                            <strong className="text-slate-900">{sn.user}</strong> {sn.action}
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1 italic">
                            {sn.detail}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{sn.time}</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6 CONTENT: Assessment & SBO Radar Dashboard */}
              {activeTab === 'assessment' && (
                <div className="pt-4 space-y-4">
                  <div className="bg-gradient-to-r from-amber-50 to-slate-50 p-4 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-black text-[#FFE600] flex items-center justify-center font-bold">
                        ✦
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          ผลการประเมินสมรรถนะ Student Base Outcome (12 มิติ) & ตัวตนแห่งจักรวาล
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          ประมวลผลจากแบบประเมิน 60 ข้อประจำตัวของ {currentUser?.name || profileForm.firstNameTh}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateToTab('lifepath')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>ทำแบบทดสอบใหม่</span>
                    </button>
                  </div>

                  <CosmicResultDashboard
                    userName={currentUser?.name || profileForm.firstNameTh}
                    isStudentDashboardView={true}
                    onRetake={() => onNavigateToTab('lifepath')}
                  />
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Live Profile Picture Upload and Crop Modal */}
      {showCropModal && (
        <ProfileAvatarModal
          currentUser={currentUser}
          onClose={() => setShowCropModal(false)}
          onUpdateAvatar={(newUrl) => {
            if (currentUser) {
              const updated = { ...currentUser, avatar: newUrl };
              try {
                localStorage.setItem('udru_current_user', JSON.stringify(updated));
              } catch {}
            }
            if (onUpdateAvatar) {
              onUpdateAvatar(newUrl);
            }
            setShowCropModal(false);
            showToast('อัปเดตและครอบตัดรูปโปรไฟล์สำเร็จเรียบร้อยแล้ว!');
          }}
        />
      )}
    </div>
  );
};

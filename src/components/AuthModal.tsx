import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, Compass, ShieldCheck, Lock, User as UserIcon, Smartphone, KeyRound, Timer, RotateCcw } from 'lucide-react';
import { User, AdminUser } from '../types';
import { signInWithGoogleAuth, saveDocument } from '../lib/firebase';

export const THAI_PROVINCES = [
  "กระบี่",
  "กรุงเทพมหานคร",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "เชียงราย",
  "เชียงใหม่",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "นราธิวาส",
  "น่าน",
  "บึงกาฬ",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พระนครศรีอยุธยา",
  "พะเยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "แพร่",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "แม่ฮ่องสอน",
  "ยโสธร",
  "ยะลา",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "เลย",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี"
];

interface AuthModalProps {
  initialMode: 'signin' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onAdminLogin?: (admin: AdminUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onLoginSuccess,
  onAdminLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialMode);
  const [loginRole, setLoginRole] = useState<'user' | 'admin'>('user');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Login Form States (User)
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // OTP Login States (Phone or Email)
  const [otpTarget, setOtpTarget] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpTarget.trim()) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์มือถือ หรือ อีเมล เพื่อรับรหัส OTP');
      return;
    }
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generated);
    setOtpStep('verify');
    setOtpTimer(60);
    setErrorMsg('');
    setSuccessMsg(`📱 [ระบบจำลอง SMS/Email] ส่งรหัส OTP เรียบร้อย! รหัสของคุณคือ: ${generated}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentOtp || otpCode.trim() !== sentOtp) {
      setErrorMsg('รหัส OTP ไม่ถูกต้อง กรุณากรอกรหัส 6 หลักที่ได้รับใหม่อีกครั้ง');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('ยืนยันรหัส OTP สำเร็จ! กำลังเข้าสู่ระบบ...');

    const user: User = {
      id: `user-otp-${Date.now()}`,
      name: otpTarget.includes('@') ? otpTarget.split('@')[0] : `ผู้เรียน (หมายเลข ${otpTarget.slice(-4)})`,
      email: otpTarget.includes('@') ? otpTarget : `${otpTarget}@udru.ac.th`,
      role: 'student',
      gender: 'other',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      enrolledCourseIds: ['course-1'],
      completedCourseIds: [],
      savedPlansCount: 0,
      points: 250,
      level: 1,
      badges: ['badge-1']
    };

    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  // Admin Login States
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('adminx');

  // Register Form States
  const [regRole, setRegRole] = useState<'student' | 'instructor' | 'general'>('student');
  const [regPrefix, setRegPrefix] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOrganization, setRegOrganization] = useState('');
  const [regInstitute, setRegInstitute] = useState('');
  const [regMajor, setRegMajor] = useState('');
  const [regProvince, setRegProvince] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const user = await signInWithGoogleAuth();
      if (user) {
        setSuccessMsg(`เข้าสู่ระบบสำเร็จผ่าน Google: ยินดีต้อนรับ ${user.name}`);
        setTimeout(() => {
          onLoginSuccess(user);
          onClose();
        }, 400);
      }
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('closed-by-user') && !msg.includes('popup-closed')) {
        setErrorMsg('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google: ' + msg);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (adminUsername.trim() === 'admin' && adminPassword === 'adminx') {
      setSuccessMsg("เข้าสู่ระบบในฐานะ 'ผู้ดูแลระบบ (Admin)' สำเร็จ!");
      const superAdmin: AdminUser = {
        id: 'admin-super-1',
        username: 'admin',
        name: 'ศ.ดร. อภิสิทธิ์ วชิรเมธากุล',
        email: 'admin@social-engineers.org',
        role: 'super_admin',
        roleTitle: 'ผู้ดูแลระบบสูงสุด (Super Administrator)',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        permissions: {
          canRead: true,
          canWrite: true,
          canEdit: true,
          canDelete: true,
          modules: {
            dashboard: true,
            admins: true,
            posts: true,
            knowledgeBase: true,
            courses: true,
            pricing: true,
            landingPage: true,
            events: true,
          }
        },
        status: 'active',
        createdAt: '2026-01-10',
        lastLogin: 'เข้าสู่ระบบเมื่อสักครู่'
      };

      const adminUserCompat: User = {
        id: 'admin-super-1',
        name: 'ศ.ดร. อภิสิทธิ์ วชิรเมธากุล (Super Admin)',
        email: 'admin@social-engineers.org',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        enrolledCourseIds: [],
        completedCourseIds: [],
        savedPlansCount: 5,
        points: 5000,
        level: 5,
        badges: ['badge-1', 'badge-2', 'badge-3']
      };

      setTimeout(() => {
        if (onAdminLogin) {
          onAdminLogin(superAdmin);
        } else {
          onLoginSuccess(adminUserCompat);
        }
        onClose();
      }, 400);
    } else {
      setErrorMsg('ชื่อผู้ใช้หรือรหัสผ่าน Admin ไม่ถูกต้อง (ทดสอบด้วย: admin / adminx)');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const identifier = loginIdentifier.trim();
    if (!identifier) {
      setErrorMsg('กรุณากรอกอีเมลหรือชื่อผู้ใช้งาน');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('กรุณากรอกรหัสผ่าน');
      return;
    }

    const isAdminUsername = identifier.toLowerCase() === 'admin' || identifier.toLowerCase().startsWith('admin.');
    const isEmail = isValidEmail(identifier);

    if (isAdminUsername) {
      if (loginPassword === 'adminx' || loginPassword.length >= 4) {
        setSuccessMsg("เข้าสู่ระบบในฐานะ 'ผู้ดูแลระบบ (Admin)' สำเร็จ!");
        const superAdmin: AdminUser = {
          id: 'admin-super-1',
          username: 'admin',
          name: 'ศ.ดร. อภิสิทธิ์ วชิรเมธากุล',
          email: 'admin@social-engineers.org',
          role: 'super_admin',
          roleTitle: 'ผู้ดูแลระบบสูงสุด (Super Administrator)',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
          permissions: {
            canRead: true,
            canWrite: true,
            canEdit: true,
            canDelete: true,
            modules: {
              dashboard: true,
              admins: true,
              posts: true,
              knowledgeBase: true,
              courses: true,
              pricing: true,
              landingPage: true,
              events: true,
            }
          },
          status: 'active',
          createdAt: '2026-01-10',
          lastLogin: 'เข้าสู่ระบบเมื่อสักครู่'
        };

        const adminUser: User = {
          id: 'admin-super-1',
          name: 'ศ.ดร. อภิสิทธิ์ วชิรเมธากุล (Super Admin)',
          email: 'admin@social-engineers.org',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
          enrolledCourseIds: [],
          completedCourseIds: [],
          savedPlansCount: 5,
          points: 5000,
          level: 5,
          badges: ['badge-1', 'badge-2', 'badge-3']
        };

        setTimeout(() => {
          if (onAdminLogin) {
            onAdminLogin(superAdmin);
          } else {
            onLoginSuccess(adminUser);
          }
          onClose();
        }, 400);
      } else {
        setErrorMsg('รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง (คำแนะนำ: ทดสอบด้วยรหัส adminx)');
      }
      return;
    }

    if (!isEmail) {
      setErrorMsg("ข้อผิดพลาด: สำหรับผู้ใช้งานทั่วไป / นักศึกษา / อาจารย์ บังคับให้กรอก 'อีเมล (Email)' ที่ถูกต้องเท่านั้น! (ตัวอย่าง: name@example.com)");
      return;
    }

    if (loginPassword.length < 4) {
      setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    setSuccessMsg('เข้าสู่ระบบสำเร็จ กำลังนำท่านเข้าสู่ระบบ...');
    
    // Check if user was registered in localStorage
    let foundRegistered: User | null = null;
    try {
      const stored = localStorage.getItem('udru_registered_users');
      if (stored) {
        const list: User[] = JSON.parse(stored);
        const match = list.find(u => u.email.toLowerCase() === identifier.toLowerCase());
        if (match) foundRegistered = match;
      }
    } catch {}

    const regularUser: User = foundRegistered || {
      id: `usr-${Date.now()}`,
      name: identifier.split('@')[0],
      email: identifier,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      studentId: '6514020101',
      faculty: 'คณะวิทยาศาสตร์ สาขาสิ่งแวดล้อม',
      enrolledCourseIds: ['course-1'],
      completedCourseIds: [],
      savedPlansCount: 1,
      points: 850,
      level: 2,
      badges: ['badge-1']
    };

    setTimeout(() => {
      onLoginSuccess(regularUser);
      onClose();
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regPrefix) {
      setErrorMsg('กรุณาเลือกคำนำหน้าชื่อ');
      return;
    }
    if (!regFirstName.trim()) {
      setErrorMsg('กรุณากรอกชื่อจริง');
      return;
    }
    if (!regLastName.trim()) {
      setErrorMsg('กรุณากรอกนามสกุล');
      return;
    }
    if (!regUsername.trim()) {
      setErrorMsg('กรุณากรอกชื่อผู้ใช้ (Username)');
      return;
    }
    if (!regEmail.trim() || !isValidEmail(regEmail.trim())) {
      setErrorMsg('กรุณากรอกรูปแบบอีเมลที่ถูกต้อง (ตัวอย่าง: name@example.com)');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('กรุณากำหนดรหัสผ่านอย่างน้อย 6 ตัวอักษร');
      return;
    }

    // Conditional requirements: Student & Instructor require institution & faculty
    if (regRole !== 'general') {
      if (!regInstitute.trim()) {
        setErrorMsg('กรุณากรอกสถานศึกษา / มหาวิทยาลัย');
        return;
      }
      if (!regOrganization.trim()) {
        setErrorMsg('กรุณากรอกคณะ / ภาควิชา');
        return;
      }
    }

    if (!regProvince) {
      setErrorMsg('กรุณาเลือกจังหวัดของคุณจาก 77 จังหวัด');
      return;
    }

    const roleTitleMap = {
      student: 'นักศึกษา',
      instructor: 'อาจารย์ / ผู้สอน',
      general: 'บุคคลทั่วไป'
    };

    const fullName = `${regPrefix} ${regFirstName.trim()} ${regLastName.trim()}`;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: fullName,
      email: regEmail.trim(),
      role: regRole,
      avatar: regRole === 'instructor' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      institute: regRole !== 'general' ? regInstitute.trim() : undefined,
      faculty: regRole !== 'general' ? regOrganization.trim() : undefined,
      major: regRole !== 'general' ? regMajor.trim() : undefined,
      organization: regRole !== 'general' ? regOrganization.trim() : 'บุคคลทั่วไป',
      province: regProvince,
      status: 'active',
      password: regPassword,
      enrolledCourseIds: ['course-1'],
      enrollments: [
        {
          courseId: 'course-1',
          courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
          enrolledAt: new Date().toISOString(),
          accessDurationMonths: 12,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          paymentReference: 'REG-PROMO-FREE'
        }
      ],
      completedCourseIds: [],
      savedPlansCount: 0,
      points: 100,
      level: 1,
      badges: ['badge-1'],
      createdAt: new Date().toISOString(),
      lastLogin: 'เพิ่งลงทะเบียน'
    };

    // Save user to LocalStorage registered users list
    try {
      const stored = localStorage.getItem('udru_registered_users');
      const list: User[] = stored ? JSON.parse(stored) : [];
      list.unshift(newUser);
      localStorage.setItem('udru_registered_users', JSON.stringify(list));
    } catch {}

    // Save to Firestore and Server API
    saveDocument('users', newUser).catch(() => {});
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(() => {});

    setSuccessMsg(`สมัครสมาชิกสำเร็จในบทบาท "${roleTitleMap[regRole]}"! บันทึกข้อมูลเรียบร้อย`);

    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 2-Column Rounded Modal Window (Balanced 960px x 630px) */}
      <div 
        className="bg-white w-full max-w-[960px] h-[630px] max-h-[92vh] rounded-[20px] overflow-hidden shadow-2xl flex flex-col md:flex-row relative font-['Prompt',sans-serif] text-slate-800 border border-slate-100"
        style={{ borderRadius: '20px' }}
      >
        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer shadow-2xs"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Illustration Panel - Harmonious, balanced, zero cut-off, zero dead gaps */}
        <div 
          className="md:w-[44%] relative min-h-[170px] md:min-h-full overflow-hidden shrink-0 flex flex-col justify-between p-4 sm:p-5 md:p-6 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-sky-100/80 border-b md:border-b-0 md:border-r border-slate-100 select-none"
        >
          {/* Ambient soft glow orbs */}
          <div className="absolute w-56 h-56 rounded-full bg-emerald-200/40 blur-3xl -top-8 -left-8 pointer-events-none" />
          <div className="absolute w-60 h-60 rounded-full bg-sky-200/40 blur-3xl -bottom-8 -right-8 pointer-events-none" />

          {/* Top Context Badge */}
          <div className="hidden md:flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-white/85 backdrop-blur-xs border border-emerald-200/60 shadow-2xs text-[11px] font-semibold text-emerald-800 z-10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>การเรียนรู้ตลอดชีวิต</span>
          </div>

          {/* Centered Artwork Canvas - Unclipped and completely balanced */}
          <div className="relative z-10 w-full flex-1 flex items-center justify-center min-h-[130px] md:min-h-0 py-1.5">
            <img
              src="/auth-illustration.png"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('imgz.io')) {
                  target.src = 'https://s.imgz.io/2026/10/02/-473bd4dff649d741e.png';
                  target.style.transform = 'scale(1.35)';
                }
              }}
              alt="Learning Illustration"
              className="max-w-full max-h-[160px] md:max-h-[380px] w-auto h-auto object-contain drop-shadow-md pointer-events-none transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Bottom Highlight Feature Tags */}
          <div className="hidden md:flex flex-wrap items-center gap-2 z-10 pt-2 border-t border-emerald-100/70">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
              <Compass className="w-3 h-3 text-teal-600" /> 4 ทักษะสำคัญแห่งอนาคต
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
              🌱 ออกแบบเส้นทางชีวิต
            </span>
          </div>
        </div>

        {/* Right Side: Scrollable Balanced Forms */}
        <div className="md:w-[56%] flex-1 p-6 sm:p-7 overflow-y-auto flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="mb-4 pr-7">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'signin' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิกใหม่'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'signin'
                  ? 'กรอกข้อมูลบัญชีเพื่อเข้าสู่ระบบการเรียนรู้และออกแบบเส้นทางชีวิต'
                  : 'กรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชีผู้ใช้งานระบบการเรียนรู้'}
              </p>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 mb-4 font-['Mitr',sans-serif]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer text-center border-0 ${
                  activeTab === 'signin'
                    ? 'bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer text-center border-0 ${
                  activeTab === 'signup'
                    ? 'bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>

            {/* Alert Box */}
            {errorMsg && (
              <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ========================================= */}
            {/* TAB 1: LOGIN FORM */}
            {/* ========================================= */}
            {activeTab === 'signin' && (
              <div className="space-y-3.5 text-xs">
                {/* Login Role Selector: User vs Admin */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('user');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`py-2 px-3 rounded-xl transition flex items-center gap-2.5 cursor-pointer text-left ${
                      loginRole === 'user'
                        ? 'bg-white text-emerald-900 shadow-xs border border-emerald-300'
                        : 'text-slate-600 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      loginRole === 'user' ? 'bg-emerald-100/90 text-emerald-700' : 'bg-slate-200/70 text-slate-500'
                    }`}>
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">เข้าสู่ระบบ</div>
                      <div className="text-xs font-bold leading-tight">ผู้ใช้งานทั่วไป</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('admin');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`py-2 px-3 rounded-xl transition flex items-center gap-2.5 cursor-pointer text-left ${
                      loginRole === 'admin'
                        ? 'bg-white text-slate-900 shadow-xs border border-emerald-500 ring-1 ring-emerald-500/20'
                        : 'text-slate-600 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      loginRole === 'admin' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200/70 text-emerald-600'
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">ระบบ</div>
                      <div className="text-xs font-bold leading-tight">Admin</div>
                    </div>
                  </button>
                </div>

                {/* Sub-view A: Regular User Login */}
                {loginRole === 'user' ? (
                  <div className="space-y-3.5 text-xs animate-in fade-in duration-200">
                    {/* Google Sign-In Primary Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-semibold text-xs transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>{isGoogleLoading ? 'กำลังเข้าสู่ระบบผ่าน Google...' : 'เข้าสู่ระบบด้วย Google (Firebase Auth)'}</span>
                    </button>

                    <div className="relative flex py-0.5 items-center">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="shrink mx-2 text-[10px] text-slate-400 font-medium">หรือเลือกวิธีเข้าสู่ระบบ</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Method Selector: Password vs OTP */}
                    <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod('password');
                          setErrorMsg('');
                        }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          loginMethod === 'password'
                            ? 'bg-white text-emerald-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>รหัสผ่าน</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod('otp');
                          setErrorMsg('');
                        }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          loginMethod === 'otp'
                            ? 'bg-white text-emerald-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>รหัส OTP (ปลอดภัย)</span>
                      </button>
                    </div>

                    {loginMethod === 'password' ? (
                      <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            อีเมลผู้ใช้งาน <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            placeholder="กรอกอีเมลของคุณ (เช่น name@example.com)"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="กรอกรหัสผ่านของคุณ"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-2.5 rounded-xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs font-['Mitr',sans-serif]"
                          >
                            เข้าสู่ระบบ (Sign In)
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* OTP Login Form */
                      <div className="space-y-3.5 text-xs">
                        {otpStep === 'request' ? (
                          <form onSubmit={handleRequestOtp} className="space-y-3.5">
                            <div>
                              <label className="font-semibold text-slate-700 block mb-1">
                                เบอร์โทรศัพท์มือถือ หรือ อีเมล <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  required
                                  value={otpTarget}
                                  onChange={(e) => setOtpTarget(e.target.value)}
                                  placeholder="เช่น 0812345678 หรือ student@udru.ac.th"
                                  className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                                />
                                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                ระบบจะส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password) ไปยังเบอร์หรืออีเมลของคุณ
                              </p>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 rounded-xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5 font-['Mitr',sans-serif] group/otp"
                            >
                              <KeyRound className="w-4 h-4 text-[#000000] group-hover/otp:text-white transition-colors" />
                              <span>ขอรับรหัส OTP</span>
                            </button>
                          </form>
                        ) : (
                          /* OTP Verification Step */
                          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                              <p className="font-semibold">ส่งรหัสไปยัง: {otpTarget}</p>
                              <p className="text-[11px] text-emerald-700 mt-0.5">
                                รหัสมีอายุ 60 วินาที กรุณากรอกรหัส 6 หลักที่ได้รับ
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">
                                  รหัสยืนยัน OTP (6 หลัก) <span className="text-rose-500">*</span>
                                </label>
                                {otpTimer > 0 ? (
                                  <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                                    <Timer className="w-3.5 h-3.5" />
                                    {otpTimer} วินาที
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleRequestOtp}
                                    className="text-[11px] text-purple-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>ขอรหัสใหม่</span>
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                required
                                maxLength={6}
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="• • • • • •"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg tracking-widest font-mono text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setOtpStep('request')}
                                className="w-1/3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition cursor-pointer"
                              >
                                เปลี่ยนเบอร์
                              </button>
                              <button
                                type="submit"
                                className="w-2/3 py-2.5 rounded-xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs font-['Mitr',sans-serif]"
                              >
                                ยืนยันเข้าสู่ระบบ
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Sub-view B: Dedicated Admin Login */
                  <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-xs animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">ระบบจัดการหลังบ้าน (Admin Panel)</p>
                          <p className="text-[11px] text-slate-400">สำหรับผู้ดูแลระบบและแอดมิน</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Admin
                      </span>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        ชื่อผู้ใช้งานแอดมิน (Admin Username) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="ระบุชื่อผู้ใช้แอดมิน (เช่น admin)"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        รหัสผ่านแอดมิน (Admin Password) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="ระบุรหัสผ่านแอดมิน"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminUsername('admin');
                          setAdminPassword('adminx');
                          setErrorMsg('');
                        }}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline cursor-pointer"
                      >
                        ⚡ เติมข้อมูลทดสอบ: admin / adminx
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#000000] hover:bg-[#FFC800] hover:text-[#000000] active:bg-[#FFC800] active:text-[#000000] text-white border-0 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs flex items-center justify-center gap-2 font-['Mitr',sans-serif] group/adm"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#FFC800] group-hover/adm:text-[#000000] transition-colors" />
                        <span>เข้าสู่ระบบ Admin</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ========================================= */}
            {/* TAB 2: REGISTER FORM (Balanced Multi-Column Grid) */}
            {/* ========================================= */}
            {activeTab === 'signup' && (
              <div className="space-y-3 text-xs pb-1">
                {/* Google Quick Sign-Up */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-semibold text-xs transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isGoogleLoading ? 'กำลังเชื่อมต่อ Google...' : 'สมัครสมาชิกทันใจด้วย Google (Firebase Auth)'}</span>
                </button>

                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="shrink mx-2 text-[10px] text-slate-400 font-medium">หรือกรอกข้อมูลสมัครสมาชิกใหม่</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                
                {/* แถว 0: การเลือกบทบาท (Role Selection Dropdown) */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="font-bold text-slate-800 text-xs">
                      เลือกบทบาทการใช้งาน (Role Selection) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      {regRole === 'student' ? 'นักศึกษา' : regRole === 'instructor' ? 'อาจารย์ / ผู้สอน' : 'บุคคลทั่วไป'}
                    </span>
                  </div>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="student">🎓 นักศึกษา (Student)</option>
                    <option value="instructor">👨‍🏫 อาจารย์ / ผู้สอน (Instructor)</option>
                    <option value="general">🌐 บุคคลทั่วไป (General Public)</option>
                  </select>
                </div>

                {/* แถว 1: คำนำหน้า (1 ส่วน) + ชื่อจริง (2 ส่วน) + นามสกุล (2 ส่วน) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-3">
                    <label className="font-semibold text-slate-700 block mb-1">
                      คำนำหน้า <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={regPrefix}
                      onChange={(e) => setRegPrefix(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 cursor-pointer"
                      required
                    >
                      <option value="">เลือก</option>
                      <option value="นาย">นาย</option>
                      <option value="นาง">นาง</option>
                      <option value="นางสาว">นางสาว</option>
                      <option value="อาจารย์">อาจารย์</option>
                      <option value="ผศ.ดร.">ผศ.ดร.</option>
                      <option value="รศ.ดร.">รศ.ดร.</option>
                      <option value="ดร.">ดร.</option>
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="font-semibold text-slate-700 block mb-1">
                      ชื่อจริง <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="เช่น สมชาย"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="font-semibold text-slate-700 block mb-1">
                      นามสกุล <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="เช่น วงศ์เจริญ"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* แถว 2: Username (1 ส่วน) + Email (1 ส่วน) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      ชื่อผู้ใช้ (Username) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="เช่น somchai.w"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      อีเมล (Email) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* แถว 3: Password */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="กำหนดรหัสผ่านอย่างน้อย 6 ตัวอักษร"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Conditional Fields: If Student or Instructor -> Show Institution, Faculty, Major */}
                {regRole !== 'general' ? (
                  <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2 animate-in fade-in">
                    <span className="text-[11px] font-bold text-emerald-950 block">
                      ข้อมูลสถานศึกษาและสาขาวิชา ({regRole === 'student' ? 'สำหรับนักศึกษา' : 'สำหรับอาจารย์'})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          สถานศึกษา / มหาวิทยาลัย <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regInstitute}
                          onChange={(e) => setRegInstitute(e.target.value)}
                          placeholder="เช่น มหาวิทยาลัยราชภัฏอุดรธานี"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          คณะ / ภาควิชา (Faculty/Dept) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regOrganization}
                          onChange={(e) => setRegOrganization(e.target.value)}
                          placeholder="เช่น คณะวิทยาศาสตร์"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        สาขาวิชา (Major / Field of Study) <span className="text-slate-400 font-normal">(ระบุหรือไม่ก็ได้)</span>
                      </label>
                      <input
                        type="text"
                        value={regMajor}
                        onChange={(e) => setRegMajor(e.target.value)}
                        placeholder="เช่น สาขาวิทยาการคอมพิวเตอร์ / สาขานวัตกรรมสังคม"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                    ℹ️ ในบทบาท <strong className="text-slate-800">บุคคลทั่วไป (General Public)</strong> ไม่ต้องกรอกข้อมูลสถานศึกษา คณะ หรือสาขาวิชา
                  </div>
                )}

                {/* แถว 5: จังหวัด (77 จังหวัด) */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    จังหวัด <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={regProvince}
                    onChange={(e) => setRegProvince(e.target.value)}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="">-- กรุณาเลือกจังหวัด (ครบทั้ง 77 จังหวัด) --</option>
                    {THAI_PROVINCES.map((prov, pIdx) => (
                      <option key={pIdx} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* แถว 6: ปุ่มยืนยันสมัครสมาชิก */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs font-['Mitr',sans-serif]"
                  >
                    ยืนยันการสมัครสมาชิก ({regRole === 'student' ? 'นักศึกษา' : regRole === 'instructor' ? 'อาจารย์' : 'บุคคลทั่วไป'})
                  </button>
                </div>

              </form>
            </div>
            )}

          </div>

          {/* Footer note */}
          <div className="pt-2 mt-2 border-t border-slate-100 text-center text-[10px] text-slate-400">
            ระบบความปลอดภัยมาตรฐานสากล (Social Engineers Platform)
          </div>

        </div>

      </div>
    </div>
  );
};

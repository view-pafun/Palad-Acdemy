import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      // Required credentials: admin / adminx
      if (username.trim() === 'admin' && password === 'adminx') {
        const superAdmin: AdminUser = {
          id: 'admin-super-1',
          username: 'admin',
          name: 'ศ.ดร. อภิสิทธิ์ วชิรเมธากุล',
          email: 'admin@udru.ac.th',
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
        setIsLoading(false);
        onLoginSuccess(superAdmin);
      } else {
        setIsLoading(false);
        setErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง (ทดสอบด้วย: admin / adminx)');
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('adminx');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4 sm:p-6 font-['Mitr',sans-serif] relative overflow-hidden">
      
      {/* Top Bar with Back to Website */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 z-10">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold transition cursor-pointer border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          <span>กลับสู่หน้าเว็บไซต์หลัก</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          UDRU Security Gateway
        </span>
      </div>

      {/* Main Login Card (Clean White) */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl relative z-10 text-slate-800">
        
        {/* Header Branding */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-300">
            <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            เข้าสู่ระบบผู้ดูแลระบบ
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            UDRU Admin Panel · ศูนย์การเรียนรู้ตลอดชีวิต
          </p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div 
          onClick={handleFillDemo}
          className="mb-6 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/60 transition cursor-pointer flex items-center justify-between group"
          title="คลิกเพื่อเติมข้อมูลทดสอบทันที"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <div className="text-left text-xs">
              <span className="font-bold text-slate-900 block">สิทธิ์เริ่มต้น (Default Demo):</span>
              <span className="text-[11px] text-slate-600 font-mono">user: <strong>admin</strong> | pass: <strong>adminx</strong></span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-800 group-hover:underline">
            คลิกใส่ข้อมูล ⚡
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้ เช่น admin"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน เช่น adminx"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>กำลังตรวจสอบสิทธิ์...</span>
                </>
              ) : (
                <span>เข้าสู่ระบบบริหารจัดการ (Sign In)</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            เฉพาะผู้ดูแลระบบและบุคลากรที่ได้รับมอบหมายเท่านั้น
          </p>
        </div>
      </div>
    </div>
  );
};

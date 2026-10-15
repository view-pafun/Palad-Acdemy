import React from 'react';
import { ShieldAlert, LogOut, Laptop, ArrowRight, Lock } from 'lucide-react';

interface ConcurrentLoginModalProps {
  isOpen: boolean;
  userName: string;
  onForceContinue: () => void;
  onSignOut: () => void;
}

export const ConcurrentLoginModal: React.FC<ConcurrentLoginModalProps> = ({
  isOpen,
  userName,
  onForceContinue,
  onSignOut,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in font-['Prompt',sans-serif]">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-200 text-slate-800 relative">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-5 mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>ระบบป้องกันการล็อกอินซ้อน (Concurrent Login Protection)</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            ตรวจพบการเข้าใช้งานซ้อน!
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            บัญชีของคุณ (<strong>{userName}</strong>) กำลังถูกเปิดใช้งานจากอุปกรณ์หรือแท็บอื่นพร้อมกัน 
            เพื่อป้องกันการแชร์บัญชีและรักษาลิขสิทธิ์เนื้อหาคอร์สเรียน ระบบได้ตัดการเชื่อมต่อของเซสชันนี้ชั่วคราว
          </p>
        </div>

        {/* Device Info Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-6">
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-slate-400" />
              สถานะเซสชัน
            </span>
            <span className="font-semibold text-rose-600">ถูกตัดการเชื่อมต่อ</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>มาตรการความปลอดภัย</span>
            <span className="font-mono text-slate-600">จำกัด 1 บัญชีต่อ 1 อุปกรณ์</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onForceContinue}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ใช้งานอุปกรณ์นี้ต่อ (ตัดเซสชันเครื่องอื่น)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSignOut}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบทันที</span>
          </button>
        </div>
      </div>
    </div>
  );
};

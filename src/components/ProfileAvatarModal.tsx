import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Check, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { User, AdminUser } from '../types';

interface ProfileAvatarModalProps {
  currentUser: User | null;
  currentAdmin?: AdminUser | null;
  onClose: () => void;
  onUpdateAvatar: (newAvatarUrl: string) => void;
}

const PRESET_AVATARS = [
  { label: 'อาจารย์ 1 (วิชาการ)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'อาจารย์ 2 (เชี่ยวชาญ)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'นักศึกษา 1 (มุ่งมั่น)', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' },
  { label: 'นักศึกษา 2 (สร้างสรรค์)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { label: 'ผู้บริหารระบบ', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
  { label: 'บุคคลทั่วไป', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
];

export const ProfileAvatarModal: React.FC<ProfileAvatarModalProps> = ({
  currentUser,
  currentAdmin,
  onClose,
  onUpdateAvatar,
}) => {
  const currentAvatar = currentAdmin?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSelectedAvatar(result);
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setSelectedAvatar(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleSave = () => {
    onUpdateAvatar(selectedAvatar);
    onClose();
  };

  const roleName = currentAdmin ? 'ผู้ดูแลระบบ (Admin)' : currentUser?.role === 'instructor' ? 'อาจารย์ผู้สอน (Instructor)' : currentUser?.role === 'student' ? 'นักศึกษา (Student)' : 'บุคคลทั่วไป';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in font-['Prompt',sans-serif]">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-800">จัดการรูปโปรไฟล์</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{roleName}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            ปรับเปลี่ยนรูปประจำตัว (Profile Picture)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            อัปโหลดรูปภาพใหม่จากอุปกรณ์ ปรับขนาดซูม หรือเลือกจากรูปประจำตัวทางการ
          </p>
          {errorMessage && (
            <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
              ⚠️ {errorMessage}
            </div>
          )}
        </div>

        {/* Live Circular Crop Preview */}
        <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-emerald-500/30 bg-slate-200 flex items-center justify-center">
            <img
              src={selectedAvatar}
              alt="Avatar Preview"
              style={{ transform: `scale(${zoomLevel})` }}
              className="w-full h-full object-cover transition-transform duration-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          {/* Zoom Slider Control */}
          <div className="w-64 mt-4 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>ย่อ</span>
              <span>ปรับซูมภาพ ({Math.round(zoomLevel * 100)}%)</span>
              <span>ขยาย</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.05"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Upload Controls */}
        <div className="space-y-4">
          
          {/* File Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span>{isUploading ? 'กำลังประมวลผลรูปภาพ...' : 'อัปโหลดรูปภาพใหม่จากเครื่องคอมพิวเตอร์ / มือถือ'}</span>
            </button>
          </div>

          {/* Preset Avatars Grid */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              หรือเลือกจากภาพต้นแบบทางการ (Official Avatars):
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(preset.url)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer ${
                    selectedAvatar === preset.url
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-transparent hover:border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                  title={preset.label}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover"
                  />
                  {selectedAvatar === preset.url && (
                    <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL Input */}
          <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
            <input
              type="url"
              placeholder="หรือใส่ลิงก์รูปภาพ URL โดยตรง..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono text-slate-800"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              ดึงภาพ
            </button>
          </form>

        </div>

        {/* Modal Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>บันทึกรูปโปรไฟล์ใหม่</span>
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url = window.location.href,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialPlatforms = [
    {
      name: 'Facebook',
      color: 'bg-[#1877F2] text-white',
      icon: '📘',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Line',
      color: 'bg-[#06C755] text-white',
      icon: '💬',
      href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'X (Twitter)',
      color: 'bg-black text-white',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'TikTok',
      color: 'bg-slate-900 text-white',
      icon: '🎵',
      href: `https://www.tiktok.com/`,
    },
    {
      name: 'Lemon8',
      color: 'bg-[#FFE600] text-slate-900',
      icon: '🍋',
      href: `https://www.lemon8-app.com/`,
    },
    {
      name: 'Instagram',
      color: 'bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white',
      icon: '📸',
      href: `https://www.instagram.com/`,
    },
    {
      name: 'YouTube',
      color: 'bg-[#FF0000] text-white',
      icon: '▶️',
      href: `https://www.youtube.com/`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs font-['Prompt',sans-serif]">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-amber-100 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-xl">
            🌻
          </div>
          <h3 className="text-lg font-bold text-slate-900">แบ่งปันไอเดียดีๆ นี้</h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{title}</p>
        </div>

        {/* Social Buttons Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTimeout(onClose, 500)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all duration-200 group text-center cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-2xl ${platform.color} flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform mb-1.5`}>
                {platform.icon}
              </div>
              <span className="text-xs font-medium text-slate-700">{platform.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full bg-transparent px-2 text-xs text-slate-600 select-all outline-hidden truncate"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกลิงก์</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

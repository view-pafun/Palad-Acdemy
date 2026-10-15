import React, { useState } from 'react';
import { ExternalLink, Sparkles, RefreshCw, Compass } from 'lucide-react';

interface CosmicPersonalityTestViewProps {
  onBackToHome?: () => void;
}

export const CosmicPersonalityTestView: React.FC<CosmicPersonalityTestViewProps> = ({
  onBackToHome,
}) => {
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    window.open('/cosmic-test.html', '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col font-['Kanit',sans-serif]">
      {/* Top Bar for In-App View */}
      <div className="bg-white border-b-2 border-slate-900 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black text-[#FFE600] border border-black flex items-center justify-center font-bold text-sm shadow-xs">
            ✦
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>แบบทดสอบถอดรหัสตัวตนแห่งจักรวาล</span>
              <span className="px-2 py-0.5 bg-[#FFE600] text-black text-[10px] font-bold uppercase border border-black hidden sm:inline-block">
                60 QUESTIONS • 4 ARCHETYPES
              </span>
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              ค้นพบสปีชีส์อวกาศและศักยภาพพิเศษประจำตัวคุณ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-all cursor-pointer"
            >
              ← กลับหน้าแรก
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            title="รีเซ็ตแบบทดสอบ"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">เริ่มใหม่</span>
          </button>

          <button
            onClick={handleOpenNewTab}
            className="px-3.5 py-1.5 bg-black hover:bg-[#FFE600] text-white hover:text-black font-bold text-xs uppercase tracking-wider border border-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดเต็มจอ (Full View)</span>
          </button>
        </div>
      </div>

      {/* Embedded High-Fidelity Interactive Applet */}
      <div className="flex-1 w-full bg-white relative">
        <iframe
          key={iframeKey}
          src="/cosmic-test.html"
          title="Cosmic Personality Test"
          className="w-full h-[calc(100vh-120px)] border-0"
          style={{ minHeight: '850px' }}
        />
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { X, Award, Download, Printer, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificateData } from '../types';

interface CertificateModalProps {
  certificate: CertificateData;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-amber-200">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm sm:text-base">
              ใบประกาศนียบัตรสำเร็จการศึกษา (Official Certificate)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="พิมพ์เอกสาร"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">พิมพ์</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Template */}
        <div className="p-6 sm:p-10 bg-[#fdfbf7] relative">
          {/* Ornate Gold Border */}
          <div className="border-4 border-amber-400/80 rounded-2xl p-6 sm:p-10 relative bg-white shadow-inner text-center">
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 text-amber-400 text-xl font-serif">❖</div>
            <div className="absolute top-2 right-2 text-amber-400 text-xl font-serif">❖</div>
            <div className="absolute bottom-2 left-2 text-amber-400 text-xl font-serif">❖</div>
            <div className="absolute bottom-2 right-2 text-amber-400 text-xl font-serif">❖</div>

            {/* University & Project Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md border-2 border-amber-300">
                🌱
              </div>
            </div>

            <p className="text-xs uppercase tracking-widest text-emerald-800 font-bold mb-1">
              โครงการพัฒนาทักษะและการเรียนรู้ตลอดชีวิต (Lifelong Learning)
            </p>
            <p className="text-[11px] text-slate-500 mb-4">
              มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)
            </p>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-wide mb-2 text-amber-900">
              ใบประกาศนียบัตรรับรองสมรรถนะ
            </h3>
            <p className="text-xs text-slate-500 mb-6 italic">CERTIFICATE OF ACHIEVEMENT</p>

            <p className="text-xs sm:text-sm text-slate-600 mb-2">ขอมอบประกาศนียบัตรฉบับนี้เพื่อแสดงว่า</p>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 font-serif border-b-2 border-amber-300 pb-2 inline-block px-8 mb-4">
              {certificate.studentName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-2">
              ได้ผ่านการศึกษาและผ่านเกณฑ์การประเมินแบบทดสอบขั้นสูงในหลักสูตร
            </p>

            <h4 className="text-base sm:text-lg font-bold text-slate-900 max-w-xl mx-auto mb-6">
              "{certificate.courseTitle}"
            </h4>

            {/* Score & Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 mt-6 items-end">
              {/* Date */}
              <div className="text-left text-xs text-slate-500">
                <p className="font-semibold text-slate-700">วันที่สำเร็จการศึกษา:</p>
                <p>{certificate.issueDate}</p>
                <p className="text-[10px] text-emerald-600 mt-1 font-bold">ผลคะแนน: {certificate.gradeScore}% (ผ่านเกณฑ์ดีเยี่ยม)</p>
              </div>

              {/* Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-2 border-amber-200 shadow-md flex items-center justify-center text-white">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <span className="text-[9px] font-bold text-amber-800 uppercase mt-1 tracking-wider">
                  VERIFIED OFFICIAL
                </span>
              </div>

              {/* Instructor Signature */}
              <div className="text-right text-xs text-slate-500">
                <div className="font-serif italic text-sm font-bold text-slate-800 mb-1">
                  {certificate.instructorName}
                </div>
                <p className="text-[10px] text-slate-400">อาจารย์ประจำหลักสูตร UDRU</p>
                <p className="text-[9px] font-mono text-slate-400 mt-1">ID: {certificate.certificateId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ใบประกาศนียบัตรนี้ออกโดยระบบอัตโนมัติ มีรหัสตรวจสอบย้อนกลับได้</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const verifyUrl = `${window.location.origin}?verify=${certificate.certificateId}`;
                try {
                  navigator.clipboard.writeText(verifyUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                } catch {}
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'คัดลอกลิงก์แล้ว! ✓' : 'แชร์ลิงก์'}</span>
            </button>
            <a
              href={`/api/certificates/${certificate.certificateId}/download?studentName=${encodeURIComponent(certificate.studentName)}&courseTitle=${encodeURIComponent(certificate.courseTitle)}&instructor=${encodeURIComponent(certificate.instructorName)}&date=${encodeURIComponent(certificate.issueDate)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด / พิมพ์ PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

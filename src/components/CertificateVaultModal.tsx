import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Download, 
  Share2, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Star,
  Eye,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { CertificateData } from '../types';
import confetti from 'canvas-confetti';

export interface VaultCertificate extends CertificateData {
  category: 'ทักษะชีวิต & อนาคต' | 'ดิจิทัล & AI' | 'นวัตกรรมชุมชน' | 'สิ่งแวดล้อม';
  hours: number;
  skills: string[];
  signatureTitle: string;
}

interface CertificateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  onViewFullCertificate: (cert: CertificateData) => void;
}

export const INITIAL_VAULT_CERTIFICATES: VaultCertificate[] = [
  {
    certificateId: 'UDRU-SE-2026-0891',
    studentName: 'ณภัทร วงศ์เจริญ',
    courseTitle: '4 ทักษะสำคัญกับการพัฒนาท้องถิ่น',
    issueDate: '10 มีนาคม 2569',
    gradeScore: 98,
    instructorName: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
    signatureTitle: 'ผู้อำนวยการศูนย์การเรียนรู้ UDRU',
    organization: 'โครงการพัฒนาทักษะและการเรียนรู้ตลอดชีวิต',
    qrVerifyUrl: 'https://social-engineers.org/verify/UDRU-SE-2026-0891',
    category: 'ทักษะชีวิต & อนาคต',
    hours: 18,
    skills: ['Problem Solving', 'Community Problem Solving', 'Design Thinking']
  },
  {
    certificateId: 'UDRU-AI-2026-0412',
    studentName: 'ณภัทร วงศ์เจริญ',
    courseTitle: 'การประยุกต์ใช้ AI เพื่อการวิจัยชุมชนและวิเคราะห์ข้อมูล',
    issueDate: '24 กุมภาพันธ์ 2569',
    gradeScore: 95,
    instructorName: 'ดร. นันทิดา ชัยปัญญา',
    signatureTitle: 'หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์',
    organization: 'โครงการพัฒนาทักษะและการเรียนรู้ตลอดชีวิต',
    qrVerifyUrl: 'https://social-engineers.org/verify/UDRU-AI-2026-0412',
    category: 'ดิจิทัล & AI',
    hours: 14,
    skills: ['Prompt Engineering', 'Data Analytics', 'AI for Research']
  },
  {
    certificateId: 'UDRU-ENV-2026-0155',
    studentName: 'ณภัทร วงศ์เจริญ',
    courseTitle: 'นวัตกรรมจัดการขยะและสิ่งแวดล้อมอัจฉริยะในท้องถิ่นอีสาน',
    issueDate: '15 มกราคม 2569',
    gradeScore: 92,
    instructorName: 'อ. รุ่งอรุณ เมธาวี',
    signatureTitle: 'ประธานหลักสูตรวิทยาศาสตร์สิ่งแวดล้อม',
    organization: 'โครงการพัฒนาทักษะและการเรียนรู้ตลอดชีวิต',
    qrVerifyUrl: 'https://social-engineers.org/verify/UDRU-ENV-2026-0155',
    category: 'สิ่งแวดล้อม',
    hours: 12,
    skills: ['Waste Management', 'Circular Economy', 'Green Campus']
  },
  {
    certificateId: 'UDRU-COM-2025-0988',
    studentName: 'ณภัทร วงศ์เจริญ',
    courseTitle: 'การสื่อสารอย่างเห็นอกเห็นใจและการรับฟังเชิงลึก (Empathic Listening)',
    issueDate: '28 ธันวาคม 2568',
    gradeScore: 96,
    instructorName: 'ผศ. มณฑิตา บุญมี',
    signatureTitle: 'ผู้เชี่ยวชาญด้านจิตวิทยาและการสื่อสารองค์กร',
    organization: 'โครงการพัฒนาทักษะและการเรียนรู้ตลอดชีวิต',
    qrVerifyUrl: 'https://social-engineers.org/verify/UDRU-COM-2025-0988',
    category: 'ทักษะชีวิต & อนาคต',
    hours: 10,
    skills: ['Active Listening', 'Conflict Resolution', 'Empathy']
  }
];

export const CertificateVaultModal: React.FC<CertificateVaultModalProps> = ({
  isOpen,
  onClose,
  studentName = 'ณภัทร วงศ์เจริญ',
  onViewFullCertificate
}) => {
  const [certificates, setCertificates] = useState<VaultCertificate[]>(INITIAL_VAULT_CERTIFICATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  
  // Sharing popover / modal state
  const [activeShareCert, setActiveShareCert] = useState<VaultCertificate | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Download simulation toast
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter logic
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'ทั้งหมด' || cert.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate summary metrics
  const totalCertificates = certificates.length;
  const totalHours = certificates.reduce((acc, c) => acc + c.hours, 0);
  const avgScore = Math.round(certificates.reduce((acc, c) => acc + c.gradeScore, 0) / (totalCertificates || 1));

  // Handle PDF Download
  const handleDownloadPDF = (cert: VaultCertificate) => {
    setDownloadToast(`กำลังดาวน์โหลดเอกสาร PDF สำหรับ "${cert.courseTitle}"`);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }

    // Trigger browser print or save dialog after brief feedback
    setTimeout(() => {
      setDownloadToast(null);
      onViewFullCertificate(cert);
    }, 1200);
  };

  // Handle Copy Verification Link
  const handleCopyLink = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 font-['Prompt',sans-serif]">
      
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-emerald-900 border border-emerald-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold">{downloadToast}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-white">
        
        {/* Top Header Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  Certificate Vault
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  UDRU Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                คลังประวัติเกียรติบัตรและใบประกาศนียบัตรรับรองสมรรถนะดิจิทัลทั้งหมดของคุณ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">เกียรติบัตรที่ได้รับ</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {totalCertificates}
                </span>
                <span className="text-xs text-slate-400">ใบ</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">ชั่วโมงเรียนรู้สะสม</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {totalHours}
                </span>
                <span className="text-xs text-slate-400">ชั่วโมง</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">คะแนนเฉลี่ยรวม</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                  {avgScore}%
                </span>
                <span className="text-xs text-amber-300 font-semibold">(ระดับดีเยี่ยม)</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">การยืนยันตัวตน</span>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>UDRU Digital Seal</span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/70">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาตามชื่อหลักสูตร, รหัสเกียรติบัตร, หรืออาจารย์..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ทั้งหมด', 'ทักษะชีวิต & อนาคต', 'ดิจิทัล & AI', 'สิ่งแวดล้อม'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Image Gallery Grid */}
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCertificates.map((cert) => (
                <div
                  key={cert.certificateId}
                  className="group relative bg-[#fdfbf7] rounded-3xl p-5 sm:p-6 text-slate-900 border-2 border-amber-300 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle Background Pattern & Gold Corner Ribbons */}
                  <div className="absolute top-2 left-2 text-amber-500/70 text-xs font-serif select-none pointer-events-none">❖</div>
                  <div className="absolute top-2 right-2 text-amber-500/70 text-xs font-serif select-none pointer-events-none">❖</div>
                  <div className="absolute bottom-2 left-2 text-amber-500/70 text-xs font-serif select-none pointer-events-none">❖</div>
                  <div className="absolute bottom-2 right-2 text-amber-500/70 text-xs font-serif select-none pointer-events-none">❖</div>

                  {/* Certificate Mockup Canvas Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-amber-200/80 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          🌱
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                            โครงการพัฒนาทักษะและการเรียนรู้ตลอดชีวิต
                          </p>
                          <p className="text-[9px] text-slate-500">
                            มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)
                          </p>
                        </div>
                      </div>

                      {/* Grade Badge */}
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>คะแนน {cert.gradeScore}%</span>
                      </div>
                    </div>

                    {/* Certificate Body */}
                    <div className="text-center py-2 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-amber-800 font-bold">
                        CERTIFICATE OF ACHIEVEMENT
                      </p>
                      <h4 className="text-xs text-slate-600">
                        ขอมอบประกาศนียบัตรนี้เพื่อแสดงว่า
                      </h4>
                      <h3 className="text-lg sm:text-xl font-black text-emerald-800 font-serif border-b border-amber-300/80 inline-block px-4 pb-0.5">
                        {cert.studentName}
                      </h3>
                      <p className="text-xs text-slate-600 pt-1">
                        ได้สำเร็จการศึกษาตามเกณฑ์มาตรฐานในหลักสูตร
                      </p>
                      <p className="text-sm font-bold text-slate-900 line-clamp-2 max-w-md mx-auto">
                        "{cert.courseTitle}"
                      </p>
                    </div>

                    {/* Metadata & Skill tags */}
                    <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                      <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {cert.certificateId}
                      </span>
                      <span>ออกให้เมื่อ: <strong>{cert.issueDate}</strong></span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {cert.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Buttons (ดาวน์โหลด PDF / แชร์ลงโซเชียล / ดูฉบับเต็ม) */}
                  <div className="mt-5 pt-4 border-t border-amber-200/80 grid grid-cols-3 gap-2">
                    
                    {/* 1. ปุ่มลัดดาวน์โหลด PDF */}
                    <button
                      onClick={() => handleDownloadPDF(cert)}
                      className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      title="ดาวน์โหลดไฟล์ PDF เกียรติบัตร"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate">ดาวน์โหลด PDF</span>
                    </button>

                    {/* 2. ปุ่มลัดแชร์ลงโซเชียลมีเดีย */}
                    <button
                      onClick={() => setActiveShareCert(cert)}
                      className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      title="แชร์เกียรติบัตรลงโซเชียลมีเดีย"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-100" />
                      <span className="truncate">แชร์ผลงาน</span>
                    </button>

                    {/* 3. ปุ่มดูใบประกาศฉบับเต็ม */}
                    <button
                      onClick={() => onViewFullCertificate(cert)}
                      className="py-2.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      title="เปิดดูเกียรติบัตรฉบับเต็มสำหรับพิมพ์"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-950" />
                      <span className="truncate">ดูฉบับเต็ม</span>
                    </button>

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-700">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-300">ไม่พบเกียรติบัตรที่ตรงกับเงื่อนไขการค้นหา</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                ลองปรับคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อค้นหาเกียรติบัตรในระบบ
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ทั้งหมด');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition cursor-pointer"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}

        </div>

        {/* Bottom Footer Note */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ใบประกาศนียบัตรทุกใบได้รับการรับรองมาตรฐาน ตรวจสอบความถูกต้องได้ตลอด 24 ชั่วโมง</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            ระบบ Lifelong E-Portfolio
          </span>
        </div>

      </div>

      {/* Social Media Share Sub-Modal */}
      {activeShareCert && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-amber-400/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => {
                setActiveShareCert(null);
                setCopiedLink(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">แชร์เกียรติบัตรของคุณ</h3>
                <p className="text-xs text-slate-400">อวดความสำเร็จและทักษะใหม่ลงโซเชียลมีเดีย</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 mb-5">
              <p className="text-xs font-bold text-amber-300">{activeShareCert.courseTitle}</p>
              <p className="text-[11px] text-slate-400 mt-1">รหัสรับรอง: {activeShareCert.certificateId}</p>
            </div>

            {/* Social Shortcuts */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              <button
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeShareCert.qrVerifyUrl)}`, '_blank');
                }}
                className="p-3 rounded-2xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/40 text-center transition cursor-pointer flex flex-col items-center gap-1.5"
              >
                <span className="text-lg">📘</span>
                <span className="text-[10px] font-bold text-blue-300">Facebook</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(activeShareCert.qrVerifyUrl)}`, '_blank');
                }}
                className="p-3 rounded-2xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/40 text-center transition cursor-pointer flex flex-col items-center gap-1.5"
              >
                <span className="text-lg">💼</span>
                <span className="text-[10px] font-bold text-blue-300">LinkedIn</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`ผมเพิ่งได้รับใบประกาศนียบัตร "${activeShareCert.courseTitle}" จาก UDRU Lifelong Learning!`)}&url=${encodeURIComponent(activeShareCert.qrVerifyUrl)}`, '_blank');
                }}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-center transition cursor-pointer flex flex-col items-center gap-1.5"
              >
                <span className="text-lg">𝕏</span>
                <span className="text-[10px] font-bold text-slate-300">X (Twitter)</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(activeShareCert.qrVerifyUrl)}`, '_blank');
                }}
                className="p-3 rounded-2xl bg-[#06C755]/20 hover:bg-[#06C755]/30 border border-[#06C755]/40 text-center transition cursor-pointer flex flex-col items-center gap-1.5"
              >
                <span className="text-lg">💬</span>
                <span className="text-[10px] font-bold text-emerald-300">LINE</span>
              </button>
            </div>

            {/* Direct Verification Link Copy */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                ลิงก์ตรวจสอบเกียรติบัตรทางการ (Official Verification URL):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={activeShareCert.qrVerifyUrl}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={() => handleCopyLink(activeShareCert.qrVerifyUrl)}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอก</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

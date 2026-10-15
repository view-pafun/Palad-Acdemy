import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Send, 
  Image as ImageIcon, 
  Users, 
  Tags, 
  CheckCircle2, 
  FileText, 
  Check, 
  Eye, 
  Trash2,
  BookmarkCheck,
  Plus
} from 'lucide-react';
import { BlogTopic, PeerStory } from '../../types';

interface KnowledgeBaseTabProps {
  onAddBlog: (newBlog: BlogTopic) => void;
  onAddStory: (newStory: PeerStory) => void;
}

export const KnowledgeBaseTab: React.FC<KnowledgeBaseTabProps> = ({
  onAddBlog,
  onAddStory,
}) => {
  // Destination Category: 'library' (ห้องสมุดความรู้) or 'story' (พี่ถึงน้อง)
  const [targetCategory, setTargetCategory] = useState<'library' | 'story'>('library');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subCategory, setSubCategory] = useState('นวัตกรรมชุมชน');
  const [authorName, setAuthorName] = useState('ฝ่ายวิชาการ UDRU (Admin Official)');
  const [authorRole, setAuthorRole] = useState('ฝ่ายส่งเสริมการเรียนรู้ตลอดชีวิต');
  const [authorFaculty, setAuthorFaculty] = useState('คณะวิทยาศาสตร์');
  const [authorYear, setAuthorYear] = useState('ศิษย์เก่า รุ่น 3');
  const [coverImageUrl, setCoverImageUrl] = useState('https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80');
  const [tagsInput, setTagsInput] = useState('นวัตกรรม, การเรียนรู้, มรภ.อุดร');
  const [content, setContent] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('⚠️ กรุณากรอกหัวข้อและเนื้อหาให้ครบถ้วน');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    if (targetCategory === 'library') {
      const newBlog: BlogTopic = {
        id: `blog-admin-${Date.now()}`,
        title: title.trim(),
        category: subCategory,
        tags: tagsArray.length > 0 ? tagsArray : ['การเรียนรู้', 'องค์ความรู้'],
        ideasCount: 1,
        author: authorName.trim(),
        authorRole: authorRole.trim(),
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        createdAt: 'เพิ่งเผยแพร่',
        coverImage: coverImageUrl.trim(),
        content: content.trim(),
        likesCount: 0,
        isFeatured: true,
        views: 1,
        comments: []
      };
      onAddBlog(newBlog);
      showToast(`เผยแพร่บทความเข้าสู่ "ห้องสมุดความรู้" สำเร็จแล้ว!`);
    } else {
      const newStory: PeerStory = {
        id: `story-admin-${Date.now()}`,
        title: title.trim(),
        authorName: authorName.trim(),
        authorFaculty: authorFaculty.trim(),
        authorYear: authorYear.trim(),
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        careerTrack: 'นักนวัตกรอาสา & นักพัฒนาพื้นที่',
        content: content.trim(),
        keyTakeaway: keyTakeaway.trim() || 'ความพยายามและการร่วมมือกับชุมชนคือรากฐานของความสำเร็จ',
        date: 'วันนี้',
        likes: 0,
        commentsCount: 0,
        tags: tagsArray.length > 0 ? tagsArray : ['พี่ถึงน้อง', 'แรงบันดาลใจ'],
        views: 1
      };
      onAddStory(newStory);
      showToast(`เผยแพร่เรื่องเล่าเข้าสู่ "พี่ถึงน้อง" สำเร็จแล้ว!`);
    }

    // Reset Form
    setTitle('');
    setContent('');
    setKeyTakeaway('');
  };

  return (
    <div className="space-y-6 font-['Mitr',sans-serif]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-2.5 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>จัดการห้องสมุดและชุมชน (Knowledge Base & Community)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            สร้างและเผยแพร่คอนเทนต์ใหม่เข้าสู่ระบบโดยตรง แบ่งแยก 2 หมวดหมู่ชัดเจน
          </p>
        </div>
      </div>

      {/* 2 Clear Category Switcher Cards as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Category Option 1: ห้องสมุดความรู้ */}
        <div
          onClick={() => setTargetCategory('library')}
          className={`p-5 rounded-3xl border-2 transition cursor-pointer flex items-start gap-4 ${
            targetCategory === 'library'
              ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${
            targetCategory === 'library' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
          }`}>
            📚
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">1. ห้องสมุดความรู้ (Knowledge Library)</h3>
              {targetCategory === 'library' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                  เลือกหมวดนี้
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              บทความวิชาการ, นวัตกรรมชุมชน, เทคนิคการใช้ AI, กิจกรรมโฮมรูม และองค์ความรู้สำหรับพัฒนาทักษะแห่งอนาคต
            </p>
          </div>
        </div>

        {/* Category Option 2: พี่ถึงน้อง */}
        <div
          onClick={() => setTargetCategory('story')}
          className={`p-5 rounded-3xl border-2 transition cursor-pointer flex items-start gap-4 ${
            targetCategory === 'story'
              ? 'bg-blue-50/60 border-blue-500 shadow-md ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${
            targetCategory === 'story' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
          }`}>
            🌱
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">2. พี่ถึงน้อง (Peer to Peer Stories)</h3>
              {targetCategory === 'story' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                  เลือกหมวดนี้
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              เรื่องเล่าประสบการณ์ลงพื้นที่จริงของรุ่นพี่, การก้าวข้ามอุปสรรค, แรงบันดาลใจ และข้อคิดการเติบโตในรั้วมหาวิทยาลัย
            </p>
          </div>
        </div>

      </div>

      {/* Content Creation Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
            <Plus className="w-5 h-5 text-emerald-600" />
            <span>
              สร้างคอนเทนต์ใหม่เข้าสู่: <strong className={targetCategory === 'library' ? 'text-emerald-700' : 'text-blue-700'}>
                {targetCategory === 'library' ? 'ห้องสมุดความรู้' : 'พี่ถึงน้อง'}
              </strong>
            </span>
          </div>
          <span className="text-xs text-slate-400">เผยแพร่ทันทีหลังกดบันทึก</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Title */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5 text-xs sm:text-sm">
              หัวข้อบทความ / เรื่องเล่า (Title) *
            </label>
            <input
              type="text"
              required
              placeholder={targetCategory === 'library' ? 'เช่น เทคนิคการสร้างนวัตกรรมชุมชนด้วยแนวคิด 4 ประการ' : 'เช่น ประสบการณ์ลงพื้นที่บ้านเชียง เรียนรู้ชีวิตจริงนอกห้องเรียน'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold text-sm text-slate-900"
            />
          </div>

          {/* Sub-category & Author Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {targetCategory === 'library' ? (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">หมวดหมู่ย่อย</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="นวัตกรรมชุมชน">นวัตกรรมชุมชน</option>
                  <option value="AI และเทคโนโลยี">AI และเทคโนโลยี</option>
                  <option value="การจัดการเรียนรู้">การจัดการเรียนรู้</option>
                  <option value="การพัฒนาตนเอง">การพัฒนาตนเอง</option>
                  <option value="งานวิจัย/วิชาการ">งานวิจัย/วิชาการ</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">คณะของผู้เล่า</label>
                <input
                  type="text"
                  value={authorFaculty}
                  onChange={(e) => setAuthorFaculty(e.target.value)}
                  placeholder="เช่น คณะวิทยาการจัดการ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">ชื่อผู้เขียน / ผู้เล่า *</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="เช่น อ. ดร. รุ่งอรุณ เมธาวี หรือ นายธนภัทร (รุ่นพี่)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {targetCategory === 'library' ? 'ตำแหน่ง / สังกัด' : 'รุ่น / ชั้นปี'}
              </label>
              <input
                type="text"
                value={targetCategory === 'library' ? authorRole : authorYear}
                onChange={(e) => targetCategory === 'library' ? setAuthorRole(e.target.value) : setAuthorYear(e.target.value)}
                placeholder={targetCategory === 'library' ? 'เช่น อาจารย์ประจำ มรภ.อุดรฯ' : 'เช่น นักศึกษา รุ่น 4'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

          </div>

          {/* Cover Image Upload / URL with Live Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>ภาพหน้าปกบทความ (Cover Image URL)</span>
              </label>
              <span className="text-[11px] text-slate-400">แนะนำสัดส่วน 16:9</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 relative aspect-video rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                <img
                  src={coverImageUrl}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="md:col-span-8 space-y-2">
                <input
                  type="url"
                  required
                  placeholder="ใส่ลิงก์ภาพหน้าปก เช่น https://images.unsplash.com/..."
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />

                {/* Quick preset selector */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">ภาพสำเร็จรูป:</span>
                  {[
                    { label: 'ชุมชน/พื้นที่', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80' },
                    { label: 'เทคโนโลยี AI', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
                    { label: 'การทำงานร่วมกัน', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80' },
                    { label: 'การศึกษา', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80' }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverImageUrl(p.url)}
                      className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-[10px] text-slate-600 hover:text-emerald-700 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
              <Tags className="w-3.5 h-3.5 text-slate-500" />
              <span>แท็กคีย์เวิร์ด (คั่นด้วยจุลภาค ,)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="เช่น นวัตกรรม, การเรียนรู้, ชุมชนเข้มแข็ง, เครื่องมือวิจัย"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Special Field for Story: Key Takeaway */}
          {targetCategory === 'story' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                ข้อคิดสำคัญสำหรับน้องๆ (Key Takeaway)
              </label>
              <input
                type="text"
                value={keyTakeaway}
                onChange={(e) => setKeyTakeaway(e.target.value)}
                placeholder="เช่น ก้าวแรกอาจยากที่สุด แต่เมื่อเริ่มลงมือทำ ชุมชนพร้อมเปิดรับเราเสมอ"
                className="w-full p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 text-blue-950 font-medium"
              />
            </div>
          )}

          {/* Rich Content Text */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              เนื้อหาบทความฉบับเต็ม (Rich Content Text) *
            </label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="เขียนเนื้อหาบทความ รายละเอียดขั้นตอนการดำเนินงาน กรณีศึกษา และบทเรียนที่ได้รับ..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 leading-relaxed text-xs sm:text-sm text-slate-800"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              className={`px-7 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2 ${
                targetCategory === 'library'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>บันทึกและเผยแพร่ทันที (Publish to {targetCategory === 'library' ? 'ห้องสมุด' : 'พี่ถึงน้อง'})</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

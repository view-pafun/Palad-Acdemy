import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Video, 
  HelpCircle, 
  Check, 
  Tag, 
  Eye, 
  Image as ImageIcon,
  Send,
  Bold,
  Italic,
  List,
  Quote,
  Link as LinkIcon
} from 'lucide-react';
import { User, BlogTopic, PeerStory } from '../types';

interface CreatePostModalProps {
  type: 'blog' | 'story';
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (postData: any) => void;
  onSwitchRole?: (newRole: 'student' | 'lecturer') => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  type,
  currentUser,
  onClose,
  onSubmit,
  onSwitchRole
}) => {
  // Step 1: Select Format ('choose' vs 'editor')
  const [step, setStep] = useState<'choose' | 'editor'>('choose');
  const [formatType, setFormatType] = useState<'clip' | 'story' | 'assisted'>('story');

  // Form Fields
  const [title, setTitle] = useState('');
  const [tagInput, setTagInput] = useState('นวัตกรรมชุมชน, ทักษะชีวิต');
  const [tags, setTags] = useState<string[]>(['นวัตกรรมชุมชน', 'ทักษะชีวิต']);
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80');
  const [content, setContent] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [isAiRelated, setIsAiRelated] = useState(false);

  // Check role permissions:
  // - Blog library (ห้องสมุดความรู้): for lecturers / admins
  // - Peer story (พี่ถึงน้อง): for students
  const isLecturer = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  const isRoleDenied = type === 'blog' && !isLecturer;

  const handleSelectFormat = (fmt: 'clip' | 'story' | 'assisted') => {
    setFormatType(fmt);
    setStep('editor');
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const splitTags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    setTags(Array.from(new Set([...tags, ...splitTags])));
    setTagInput('');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (type === 'blog') {
      const newBlog: BlogTopic = {
        id: `blog-${Date.now()}`,
        title: title.trim(),
        category: tags[0] || 'การเรียนรู้ข้ามศาสตร์',
        tags: tags,
        ideasCount: 1,
        author: currentUser?.name || 'อาจารย์ผู้สอน',
        authorRole: 'อาจารย์ผู้ทรงคุณวุฒิ UDRU',
        authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        createdAt: 'เมื่อสักครู่',
        coverImage: coverUrl,
        content: content.trim(),
        likesCount: 1,
        views: 1,
        inspireCount: 1,
        cheerCount: 0,
        comments: []
      };
      onSubmit(newBlog);
    } else {
      const newStory: PeerStory = {
        id: `story-${Date.now()}`,
        title: title.trim(),
        authorName: currentUser?.name || 'นักศึกษาผู้แบ่งปัน',
        authorFaculty: currentUser?.faculty || 'มหาวิทยาลัยราชภัฏอุดรธานี',
        authorYear: 'นักศึกษาปี 3',
        authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
        careerTrack: tags[0] || 'นวัตกรพัฒนาชุมชน',
        content: content.trim(),
        keyTakeaway: keyTakeaway || 'ความสำเร็จเริ่มต้นจากการกล้าลงมือทำและเรียนรู้จากปัญหาจริง',
        date: 'เมื่อสักครู่',
        likes: 1,
        commentsCount: 0,
        tags: tags,
        coverImage: coverUrl,
        views: 1,
        inspireCount: 1,
        cheerCount: 0,
        comments: []
      };
      onSubmit(newStory);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto relative">
        {/* If Role Denied in Blog Library */}
        {isRoleDenied ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl font-bold">
              🎓
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              พื้นที่เผยแพร่องค์ความรู้สำหรับอาจารย์
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              ห้องสมุดความรู้ออกแบบไว้ให้อาจารย์และผู้เชี่ยวชาญร่วมแบ่งปันองค์ความรู้
              <br />
              สำหรับนักศึกษา สามารถร่วมแบ่งปันประสบการณ์และเรื่องเล่าในหน้า <span className="font-semibold text-emerald-700">"พี่ถึงน้อง"</span> ได้ทันที!
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onSwitchRole && (
                <button
                  onClick={() => onSwitchRole('lecturer')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  สลับเป็นบทบาทอาจารย์ (Demo Switcher)
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                ปิดหน้าต่างนี้
              </button>
            </div>
          </div>
        ) : step === 'choose' ? (
          /* Step 1 Modal: "แบ่งปันแบบไหนดี?" (Image 4 & 5 Exact Design) */
          <div className="p-6 sm:p-8 text-center">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mx-auto">
                แบ่งปันแบบไหนดี?
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 absolute top-5 right-5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-md mx-auto">
              {type === 'blog' 
                ? 'แบ่งปันเทคนิคการสอน บทความ และไอเดียการเรียนรู้ข้ามศาสตร์'
                : 'แบ่งปันประสบการณ์จริง เส้นทางการเรียนรู้ และเรื่องเล่าพี่ถึงน้อง'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Option 1 */}
              <div
                onClick={() => handleSelectFormat('clip')}
                className="border-2 border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all hover:shadow-md cursor-pointer group flex flex-col items-center justify-between"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform">
                  🎬
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">คลิป/ไฟล์</h4>
                  <p className="text-xs text-slate-500">อธิบายนิดเดียว เน้นสื่อวิดีโอหรือสไลด์</p>
                </div>
              </div>

              {/* Option 2 */}
              <div
                onClick={() => handleSelectFormat('story')}
                className="border-2 border-emerald-500 bg-emerald-50/30 rounded-2xl p-6 text-center transition-all hover:shadow-md cursor-pointer group flex flex-col items-center justify-between"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform">
                  📝
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">ขอเล่าเอง</h4>
                  <p className="text-xs text-slate-500">เขียนบทความ ถ่ายทอดประสบการณ์เต็มรูปแบบ</p>
                </div>
              </div>

              {/* Option 3 */}
              <div
                onClick={() => handleSelectFormat('assisted')}
                className="border-2 border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all hover:shadow-md cursor-pointer group flex flex-col items-center justify-between"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform">
                  💡
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">ให้ทีมโค้ชช่วย</h4>
                  <p className="text-xs text-slate-500">มีเทมเพลตโครงร่างช่วยจัดไอเดียให้เป็นระเบียบ</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              โพสต์ในนาม: <span className="font-semibold text-slate-800">{currentUser?.name}</span> ({isLecturer ? 'อาจารย์' : 'นักศึกษา'})
            </div>
          </div>
        ) : (
          /* Step 2: Full Rich Editor (Image 4 & 5 Layout) */
          <form onSubmit={handlePublish} className="p-6 sm:p-8 space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-950 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับ</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('บันทึกแบบร่างสำเร็จ')}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  แบบร่าง
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs hover:shadow transition-colors cursor-pointer"
                >
                  เผยแพร่
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid: Cover upload on left, Title & Tags on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Upload Box */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/60 aspect-video relative group overflow-hidden">
                {coverUrl ? (
                  <>
                    <img src={coverUrl} alt="cover" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-white bg-slate-900/80 px-3 py-1.5 rounded-xl font-medium">
                        เปลี่ยนภาพปก
                      </span>
                    </div>
                  </>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">เลือก / อัปโหลดภาพปก / คลิปวิดีโอ</p>
                    <p className="text-[11px] text-slate-400 mt-1">คำแนะนำ: ขนาดไฟล์ควรน้อยกว่า 20 MB</p>
                  </div>
                )}
              </div>

              {/* Title & Tags */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
                    <label>ชื่อไอเดีย / เรื่องเล่า</label>
                    <span className="text-slate-400 font-mono text-[11px]">{title.length} / 60</span>
                  </div>
                  <input
                    type="text"
                    maxLength={60}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ตั้งชื่อบอกว่าไอเดียนี้เกี่ยวกับอะไร..."
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
                    <label>ติดแท็กให้ไอเดีย</label>
                    <span className="text-slate-400 text-[11px]">เพื่อให้ได้รับการมองเห็นมากขึ้น</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="ใส่แท็ก คั่นด้วยจุลภาค เช่น นวัตกรรม, AI"
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      เพิ่มแท็ก
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t, idx) => (
                      <span key={idx} className="text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Checkbox */}
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none bg-slate-50 p-3 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={isAiRelated}
                onChange={(e) => setIsAiRelated(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>กดติ๊กถูก หากไอเดียนี้เกี่ยวข้องกับ AI หรือการพัฒนาชุมชนเชิงพื้นที่</span>
            </label>

            {/* Rich Editor Area */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 font-semibold mb-1.5">
                <label>เล่าไอเดีย / ประสบการณ์</label>
                <span className="text-slate-400 text-[11px]">พิมพ์เนื้อหาและใส่รายละเอียด</span>
              </div>

              {/* Editor Toolbar */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-1 text-slate-600 text-xs">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"><List className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"><Quote className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"><LinkIcon className="w-3.5 h-3.5" /></button>
                </div>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="เริ่มเล่าและแปะภาพประกอบตรงนี้เลย..."
                  required
                  className="w-full p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                เผยแพร่บทความ (+30 XP)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

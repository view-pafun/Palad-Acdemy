import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowDownCircle, 
  Plus, 
  X, 
  FileText, 
  Check, 
  Eye, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Video, 
  RotateCcw, 
  RotateCw, 
  Eraser, 
  Paperclip,
  Sparkles,
  Layers,
  Save,
  Send
} from 'lucide-react';
import { User, BlogTopic, SharedAttachment } from '../types';

interface BlogEditorPageProps {
  currentUser: User | null;
  initialTopic?: BlogTopic | null;
  onBack: () => void;
  onPublish: (topic: BlogTopic) => void;
  onSaveDraft?: (topic: BlogTopic) => void;
}

export const BlogEditorPage: React.FC<BlogEditorPageProps> = ({
  currentUser,
  initialTopic,
  onBack,
  onPublish,
  onSaveDraft,
}) => {
  // Form fields
  const [title, setTitle] = useState(initialTopic?.title || '');
  const [coverUrl, setCoverUrl] = useState(
    initialTopic?.coverImage || 
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80'
  );
  const [category, setCategory] = useState(initialTopic?.category || 'นวัตกรรมชุมชน');
  const [tags, setTags] = useState<string[]>(
    initialTopic?.tags && initialTopic.tags.length > 0 
      ? initialTopic.tags 
      : ['นวัตกรรมชุมชน', 'การพัฒนาตนเอง']
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Credit section
  const [creditType, setCreditType] = useState('ต่อยอดจากไอเดียในระบบ');
  const [creditSearch, setCreditSearch] = useState(initialTopic?.credits || '');

  // Files
  const [attachments, setAttachments] = useState<SharedAttachment[]>(
    initialTopic?.attachments || [
      {
        id: 'att-1',
        name: 'S__2654351_แผนกิจกรรม.pdf',
        size: '2.4 MB',
        type: 'pdf',
        url: '#',
        downloadsCount: 14
      },
      {
        id: 'att-2',
        name: 'FlashCards_สื่อสะกิดความรู้สึก.docx',
        size: '1.8 MB',
        type: 'doc',
        url: '#',
        downloadsCount: 28
      }
    ]
  );

  // Checkbox
  const [isCommunityProject, setIsCommunityProject] = useState(true);

  // Rich Text Editor State
  const [content, setContent] = useState(
    initialTopic?.content || 
    `ที่มาของไอเดีย หรือ จุดประสงค์การสอน\n\nจากการจัดกิจกรรมการเรียนรู้และลงพื้นที่สำรวจชุมชน พบว่าเด็กๆ และคนในพื้นที่มีความต้องการสื่อสะกิดความรู้สึกเพื่อเปิดใจพูดคุยกันอย่างสร้างสรรค์ จึงออกแบบสื่อชิ้นนี้ขึ้นเพื่อให้ทุกคนเข้าถึงได้ง่ายและร่วมแก้ปัญหาเชิงพื้นที่ไปด้วยกัน\n\nขั้นตอนและวิธีการนำไปใช้:\n1. แจกการ์ดสะกิดความรู้สึกให้ผู้เข้าร่วมกิจกรรม\n2. จับคู่แลกเปลี่ยนมุมมอง 5 นาที\n3. สะท้อนการเรียนรู้และสรุปเป็นข้อเสนอแนะในการพัฒนาชุมชน`
  );

  // Modals & Popovers
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Add Tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // File upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > 15) {
      showToast('สามารถอัปโหลดไฟล์รวมกันได้สูงสุด 15 ไฟล์');
      return;
    }

    const newItems: SharedAttachment[] = Array.from(files).map((f, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.name.endsWith('.pdf') ? 'pdf' : f.name.endsWith('.doc') || f.name.endsWith('.docx') ? 'doc' : 'image',
      url: URL.createObjectURL(f),
      downloadsCount: 0
    }));

    setAttachments([...attachments, ...newItems]);
    showToast(`อัปโหลดไฟล์สำเร็จ ${files.length} รายการ`);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  // Text formatting helpers
  const applyFormat = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'ข้อความ'}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 6));
    }, 10);
  };

  // Pre-made Inskru-styled Educational & Social Innovation Templates
  const templates = [
    {
      id: 'tmpl-1',
      title: 'กิจกรรมการสอน & สื่อสะกิดความรู้สึก',
      description: 'โครงสร้างแบบ Inskru สำหรับแบ่งปันใบงาน บอร์ดเกม หรือการ์ดสะกิดความคิด',
      text: `ที่มาของไอเดีย หรือ จุดประสงค์การสอน\nจากการจัดกิจกรรมการเรียนรู้ พบว่าผู้เรียนต้องการสื่อที่ช่วยสื่อสารความรู้สึกและความคิดเห็นอย่างเปิดกว้าง จึงได้พัฒนาสื่อกิจกรรมชิ้นนี้ขึ้นมา\n\nอุปกรณ์และสื่อที่ใช้:\n- ชุดการ์ดคำถามสะกิดความคิด\n- แผ่นบันทึกความรู้สึกและสมุดบันทึกสรุปผล\n\nขั้นตอนการจัดกิจกรรม:\n1. ชวนพูดคุยเปิดประเด็นสร้างความคุ้นเคย (Ice-breaking)\n2. ให้ผู้เรียนเลือกการ์ดที่ตรงกับความรู้สึกและแลกเปลี่ยนกับเพื่อนคู่คิด\n3. สรุปบทเรียนร่วมกันทั้งห้อง\n\nข้อเสนอแนะในการนำไปปรับใช้:\nสามารถปรับเปลี่ยนหัวข้อการ์ดให้สอดคล้องกับบริบทชุมชนหรือเนื้อหารายวิชาได้`
    },
    {
      id: 'tmpl-2',
      title: 'นวัตกรรมชุมชน 4 ประการ',
      description: 'โครงสร้างแบบนักนวัตกร: ระบุปัญหาเชิงพื้นที่ วิเคราะห์รากเหง้า และแก้ไขแบบเกาให้ถูกที่คัน',
      text: `1. สภาพปัญหาเชิงพื้นที่และบริบทชุมชน:\nอธิบายปัญหาจริงที่พบในพื้นที่เป้าหมาย จ.อุดรธานี และเหตุผลที่ต้องเร่งแก้ไข\n\n2. การสืบค้นถึงรากเหง้าแห่งสาเหตุ (Root Cause Analysis):\nจากการลงพื้นที่พูดคุยกับชาวบ้านและผู้นำชุมชน พบว่าต้นตอที่แท้จริงคืออะไร\n\n3. การระดมทรัพยากรและบูรณาการข้ามศาสตร์:\nทีมนักศึกษาได้ผสานความรู้จากคณะใดบ้าง และประสานความร่วมมือกับใคร\n\n4. นวัตกรรมที่ส่งมอบและการสร้างความยั่งยืน ("เกาให้ถูกที่คัน"):\nผลลัพธ์ที่เป็นรูปธรรม ชุมชนสามารถดูแลรักษาและต่อยอดได้ด้วยตนเองอย่างไร`
    },
    {
      id: 'tmpl-3',
      title: 'เรื่องเล่าและประสบการณ์พี่ถึงน้อง',
      description: 'เล่าบันทึกบทเรียน การก้าวข้ามอุปสรรค และคำแนะนำสู่น้องๆ รุ่นต่อไป',
      text: `จุดเริ่มต้นและแรงบันดาลใจ:\nเล่าถึงวันแรกที่ตัดสินใจเข้าร่วมโครงการ และเป้าหมายที่ตั้งไว้ในใจ\n\nสิ่งที่ได้เรียนรู้และอุปสรรคระหว่างทาง:\nเจอปัญหาอะไรบ้าง และปรับวิธีคิด (Mindset) อย่างไรจึงก้าวผ่านมาได้\n\nข้อคิดและกำลังใจที่อยากส่งต่อให้น้องๆ:\nคำแนะนำสำคัญ 3 ข้อที่อยากให้น้องๆ นำไปใช้ในการเรียนและการทำโครงงานชุมชน`
    }
  ];

  const handleApplyTemplate = (tmplText: string) => {
    setContent(tmplText);
    setShowTemplateModal(false);
    showToast('เปลี่ยนเทมเพลตเรียบร้อย');
  };

  // Publish handler
  const handlePublishClick = () => {
    if (!title.trim()) {
      showToast('⚠️ กรุณากรอกชื่อไอเดีย / หัวข้อบล็อกก่อนเผยแพร่');
      return;
    }
    if (!content.trim()) {
      showToast('⚠️ กรุณากรอกเนื้อหาเล่าไอเดียก่อนเผยแพร่');
      return;
    }

    const newTopic: BlogTopic = {
      id: initialTopic?.id || `blog-${Date.now()}`,
      title: title.trim(),
      category,
      tags: tags.length > 0 ? tags : ['นวัตกรรมชุมชน'],
      ideasCount: 1,
      author: currentUser?.name || 'ครูนับหนึ่งแล้วนะ (มรภ.อุดรธานี)',
      authorRole: currentUser?.faculty ? `นักศึกษา ${currentUser.faculty}` : 'ผู้ร่วมเรียนรู้ มรภ.อุดรธานี',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      createdAt: 'วันนี้ (เพิ่งเผยแพร่)',
      updatedAt: 'วันนี้',
      coverImage: coverUrl,
      content,
      likesCount: 0,
      inspireCount: 0,
      cheerCount: 0,
      views: 1,
      comments: [],
      attachments,
      credits: creditSearch ? `${creditType}: ${creditSearch}` : undefined,
      status: 'published'
    };

    onPublish(newTopic);
  };

  // Draft handler
  const handleSaveDraftClick = () => {
    if (!title.trim()) {
      showToast('กรุณากรอกชื่อไอเดียเพื่อบันทึกแบบร่าง');
      return;
    }

    const draftTopic: BlogTopic = {
      id: initialTopic?.id || `draft-${Date.now()}`,
      title: title.trim(),
      category,
      tags,
      ideasCount: 0,
      author: currentUser?.name || 'ผู้ใช้งาน UDRU',
      authorRole: 'นักศึกษา มรภ.อุดรธานี',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      createdAt: 'แบบร่าง',
      coverImage: coverUrl,
      content,
      likesCount: 0,
      comments: [],
      attachments,
      credits: creditSearch ? `${creditType}: ${creditSearch}` : undefined,
      status: 'draft'
    };

    if (onSaveDraft) {
      onSaveDraft(draftTopic);
    } else {
      showToast('บันทึกแบบร่างไว้ในเครื่องเรียบร้อย');
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 font-['Prompt',sans-serif]">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2 text-sm animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs sm:text-sm border border-slate-200 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่ห้องสมุดความรู้</span>
          </button>

          <div className="text-right">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              โหมดเขียนและแบ่งปันไอเดีย (Inskru Style)
            </span>
          </div>
        </div>

        {/* Main Editor Card Form matching Image 1 & 8 */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
          
          {/* Row 1: Cover Upload (Left) & Title + Tag (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Box: Upload Cover (5 columns) */}
            <div className="md:col-span-5">
              <div 
                onClick={() => coverInputRef.current?.click()}
                className="relative rounded-3xl bg-white hover:bg-amber-50/20 border-2 border-dashed border-slate-300 hover:border-amber-400 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[220px] group overflow-hidden"
              >
                {coverUrl ? (
                  <>
                    <img 
                      src={coverUrl} 
                      alt="Cover Preview" 
                      className="absolute inset-0 w-full h-full object-cover rounded-3xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                      <ArrowDownCircle className="w-8 h-8 text-amber-400 mb-1" />
                      <span className="text-xs font-semibold">คลิกเพื่อเปลี่ยนภาพหน้าปก</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform">
                      <ArrowDownCircle className="w-7 h-7 text-white fill-amber-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-1">
                      เลือก / อัพโหลดภาพปก / คลิปวิดีโอ
                    </p>
                    <p className="text-xs text-slate-400">
                      คำแนะนำ: ขนาดไฟล์น้อยกว่า 20 MB
                    </p>
                  </>
                )}
                <input 
                  ref={coverInputRef}
                  type="file" 
                  accept="image/*,video/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setCoverUrl(URL.createObjectURL(f));
                      showToast('อัปโหลดภาพหน้าปกสำเร็จ');
                    }
                  }}
                />
              </div>

              {/* Preset cover quick picks */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 shrink-0 text-[11px]">ภาพตัวอย่าง:</span>
                {[
                  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
                  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
                  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverUrl(preset)}
                    className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0 hover:scale-110 transition cursor-pointer"
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Box: Idea Title & Tags (7 columns) */}
            <div className="md:col-span-7 space-y-5">
              
              {/* ชื่อไอเดีย with counter 0/60 */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  ชื่อไอเดีย
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={60}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ตั้งชื่อเพื่อบอกว่าไอเดียนี้เกี่ยวกับอะไร"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition pr-16"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 select-none">
                    {title.length} / 60
                  </div>
                </div>
              </div>

              {/* ติดแท็กให้ไอเดีย */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <label className="block text-sm font-bold text-slate-900">
                      ติดแท็กให้ไอเดีย
                    </label>
                    <p className="text-xs text-slate-500">
                      ติดแท็ก เพื่อให้ไอเดียได้รับการมองเห็นมากขึ้น
                    </p>
                  </div>

                  {!isAddingTag && (
                    <button
                      type="button"
                      onClick={() => setIsAddingTag(true)}
                      className="px-4 py-1.5 rounded-full border border-slate-700 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-semibold transition cursor-pointer"
                    >
                      เพิ่มแท็ก
                    </button>
                  )}
                </div>

                {/* Tag Input Form */}
                {isAddingTag && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="พิมพ์แท็ก เช่น บอร์ดเกม, สื่อการสอน..."
                      className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs focus:outline-hidden"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      เพิ่ม
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingTag(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Display Current Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-500 cursor-pointer text-slate-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* หมวดหมู่หลัก */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  หมวดหมู่เนื้อหา
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:border-amber-400"
                >
                  <option value="นวัตกรรมชุมชน">นวัตกรรมชุมชน</option>
                  <option value="การศึกษาและสื่อการสอน">การศึกษาและสื่อการสอน</option>
                  <option value="เทคโนโลยีและดิจิทัล">เทคโนโลยีและดิจิทัล</option>
                  <option value="สิ่งแวดล้อมและสุขภาพ">สิ่งแวดล้อมและสุขภาพ</option>
                  <option value="ทักษะชีวิตและการออกแบบเป้าหมาย">ทักษะชีวิตและการออกแบบเป้าหมาย</option>
                </select>
              </div>

            </div>
          </div>

          {/* Row 2: ไอเดียนี้ต่อยอดมาจาก ... */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              ไอเดียนี้ต่อยอดมาจาก ...
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={creditType}
                onChange={(e) => setCreditType(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-hidden sm:w-56 shrink-0"
              >
                <option value="ต่อยอดจากไอเดียในระบบ">ต่อยอดจากไอเดียในระบบ</option>
                <option value="อ้างอิงจากบทความวิชาการ">อ้างอิงจากบทความวิชาการ</option>
                <option value="ร่วมมือกับชุมชนอุดรธานี">ร่วมมือกับชุมชนอุดรธานี</option>
                <option value="คิดค้นและลงมือทำเอง">คิดค้นและลงมือทำเอง</option>
              </select>
              <span className="hidden sm:inline text-slate-400 font-bold">:</span>
              <input
                type="text"
                value={creditSearch}
                onChange={(e) => setCreditSearch(e.target.value)}
                placeholder="พิมพ์เพื่อค้นหาไอเดียต้นฉบับ หรือระบุชื่อผู้ให้แรงบันดาลใจ..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-400 focus:bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              ลองกด 'พรีวิว' เพื่อดูตัวอย่างการแสดงผลเครดิตไอเดีย
            </p>
          </div>

          {/* Row 3: แบ่งปันไฟล์ที่เกี่ยวข้อง (Attachment/File Sharing) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div>
              <label className="block text-sm font-bold text-slate-900">
                แบ่งปันไฟล์ที่เกี่ยวข้อง
              </label>
              <p className="text-xs text-slate-500">
                อัพโหลดไฟล์รวมกันได้สูงสุด 15 ไฟล์และรวมกันไม่เกิน 20 MB (รองรับ Word, PDF, รูปภาพ)
              </p>
            </div>

            {/* Dotted Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-3xl bg-white hover:bg-amber-50/20 border-2 border-dashed border-slate-300 hover:border-amber-400 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
                <ArrowDownCircle className="w-6 h-6 text-white fill-amber-500" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                คลิกเพื่ออัพโหลด
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                คำแนะนำ: ควรใช้รูปภาพ/ไฟล์ ขนาดน้อยกว่า 20 MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>จำนวนไฟล์ {attachments.length}/15, ขนาดรวม {attachments.reduce((acc, a) => acc + (parseFloat(a.size) || 1), 0).toFixed(1)} MB</span>
            </div>

            {/* List of attachments */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xs font-bold">
                        {file.type === 'pdf' ? 'PDF' : file.type === 'doc' ? 'DOC' : 'IMG'}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-800 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400">{file.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Checkbox */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCommunityProject}
                  onChange={(e) => setIsCommunityProject(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
                />
                <span>กดติ๊กถูก หากไอเดียนี้เกี่ยวข้องกับโครงงานพัฒนาชุมชน มรภ.อุดรธานี</span>
              </label>
            </div>
          </div>

          {/* Row 4: Rich Text Editor ("เล่าไอเดีย") matching Image 2 & 7 */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#ff6b00]">
                เล่าไอเดีย
              </h3>
              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-1.5 rounded-full border border-slate-800 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-semibold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>เปลี่ยนเทมเพลต</span>
              </button>
            </div>

            {/* Formatter Toolbar matching Image 2 & 7 with orange rounded border */}
            <div className="border-2 border-[#ff6b00] rounded-3xl overflow-hidden shadow-xs bg-white">
              
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-[#fffbf7] border-b border-orange-200/60 text-slate-700 text-xs">
                
                {/* Paragraph dropdown */}
                <select 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'h2') applyFormat('\n## ', '\n');
                    if (val === 'h3') applyFormat('\n### ', '\n');
                  }}
                  className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-xs cursor-pointer focus:outline-hidden mr-1"
                >
                  <option value="p">¶ ข้อความทั่วไป</option>
                  <option value="h2">หัวข้อหลัก (H2)</option>
                  <option value="h3">หัวข้อย่อย (H3)</option>
                </select>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Bold */}
                <button
                  type="button"
                  onClick={() => applyFormat('**', '**')}
                  title="ตัวหนา"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer font-bold"
                >
                  <Bold className="w-4 h-4" />
                </button>

                {/* Italic */}
                <button
                  type="button"
                  onClick={() => applyFormat('*', '*')}
                  title="ตัวเอียง"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer italic"
                >
                  <Italic className="w-4 h-4" />
                </button>

                {/* Underline */}
                <button
                  type="button"
                  onClick={() => applyFormat('<u>', '</u>')}
                  title="ขีดเส้นใต้"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <Underline className="w-4 h-4" />
                </button>

                {/* Strikethrough */}
                <button
                  type="button"
                  onClick={() => applyFormat('~~', '~~')}
                  title="ขีดฆ่า"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Bullet List */}
                <button
                  type="button"
                  onClick={() => applyFormat('\n- ')}
                  title="รายการแบบจุด"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <List className="w-4 h-4" />
                </button>

                {/* Numbered List */}
                <button
                  type="button"
                  onClick={() => applyFormat('\n1. ')}
                  title="รายการแบบตัวเลข"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Alignments */}
                <button
                  type="button"
                  onClick={() => showToast('จัดข้อความชิดซ้าย')}
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('จัดข้อความกึ่งกลาง')}
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('จัดข้อความชิดขวา')}
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('จัดข้อความกระจายเท่ากัน')}
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Insert Link / Media */}
                <button
                  type="button"
                  onClick={() => {
                    const u = prompt('กรอก URL ลิงก์ที่ต้องการแนบ:');
                    if (u) applyFormat(`[ลิงก์](${u})`);
                  }}
                  title="แทรกลิงก์"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const imgUrl = prompt('กรอก URL รูปภาพประกอบในเนื้อหา:');
                    if (imgUrl) applyFormat(`\n![รูปภาพประกอบ](${imgUrl})\n`);
                  }}
                  title="แทรกรูปภาพ"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const vUrl = prompt('กรอก URL วิดีโอ YouTube/คลิป:');
                    if (vUrl) applyFormat(`\n[วิดีโอแนะนำ](${vUrl})\n`);
                  }}
                  title="แทรกวิดีโอ"
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                {/* Undo / Redo */}
                <button
                  type="button"
                  onClick={() => showToast('ย้อนกลับ')}
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-500 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast('ทำซ้ำ')}
                  className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-500 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setContent('')}
                  title="ล้างเนื้อหา"
                  className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-500 hover:text-rose-600 cursor-pointer ml-auto"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Area */}
              <textarea
                ref={textareaRef}
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="เริ่มเล่าและแปะภาพประกอบตรงนี้เลย ..."
                className="w-full p-4 sm:p-6 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden leading-relaxed resize-y bg-transparent"
              />
            </div>
          </div>

        </div>

        {/* Bottom Action Bar matching Image 6 */}
        <div className="sticky bottom-6 z-40 bg-white/95 backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-slate-200 flex items-center justify-between gap-4 max-w-xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 cursor-pointer"
          >
            ยกเลิก
          </button>

          {/* Action Pills */}
          <div className="flex items-center gap-3">
            {/* Button 1: พรีวิว */}
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-900 hover:text-white text-slate-800 font-medium text-xs sm:text-sm transition cursor-pointer shadow-2xs"
            >
              {isPreviewMode ? 'ปิดพรีวิว' : 'พรีวิว'}
            </button>

            {/* Button 2: แบบร่าง */}
            <button
              type="button"
              onClick={handleSaveDraftClick}
              className="px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-900 hover:text-white text-slate-800 font-medium text-xs sm:text-sm transition cursor-pointer shadow-2xs"
            >
              แบบร่าง
            </button>

            {/* Button 3: เผยแพร่ (Yellow Pill) */}
            <button
              type="button"
              onClick={handlePublishClick}
              className="px-7 py-2.5 rounded-full bg-[#ffc000] hover:bg-[#ffb000] active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>เผยแพร่</span>
            </button>
          </div>
        </div>

      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs font-['Prompt',sans-serif]">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">เลือกเทมเพลตโครงสร้างเนื้อหา</h3>
                <p className="text-xs text-slate-500">เลือกเทมเพลตเริ่มต้นเพื่อช่วยให้เขียนเล่าไอเดียได้ง่ายและน่าสนใจยิ่งขึ้น</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all p-5 flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{tmpl.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{tmpl.description}</p>
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-mono line-clamp-3 whitespace-pre-line">
                      {tmpl.text}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApplyTemplate(tmpl.text)}
                    className="self-end px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition cursor-pointer shadow-2xs"
                  >
                    ใช้เทมเพลตนี้
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {isPreviewMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-['Prompt',sans-serif]">
          <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                ตัวอย่างการแสดงผลก่อนเผยแพร่จริง (Preview)
              </span>
              <button
                onClick={() => setIsPreviewMode(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {title || 'ยังไม่ได้ระบุชื่อไอเดีย'}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>โดย: {currentUser?.name || 'ครูนับหนึ่งแล้วนะ'}</span>
              <span>•</span>
              <span>{category}</span>
              {creditSearch && (
                <>
                  <span>•</span>
                  <span className="text-amber-700 font-medium">เครดิต: {creditType} - {creditSearch}</span>
                </>
              )}
            </div>

            {coverUrl && (
              <div className="rounded-2xl overflow-hidden max-h-96 shadow-xs">
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line py-2">
              {content || 'ยังไม่มีเนื้อหา'}
            </div>

            {attachments.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2">ไฟล์ที่แบ่งปัน ({attachments.length} ไฟล์):</h4>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((a) => (
                    <span key={a.id} className="text-xs px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-700">
                      📎 {a.name} ({a.size})
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                กลับไปแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

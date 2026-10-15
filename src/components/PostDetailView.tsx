import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Eye, 
  MessageSquare, 
  Heart,
  Send, 
  CheckCircle2, 
  Sparkles, 
  Image as ImageIcon,
  Download,
  Check,
  Copy,
  Paperclip
} from 'lucide-react';
import { BlogTopic, PeerStory, User, PostComment, SharedAttachment } from '../types';
import { SocialShareModal } from './SocialShareModal';

interface PostDetailViewProps {
  post: BlogTopic | PeerStory;
  type: 'blog' | 'story';
  currentUser: User | null;
  onBack: () => void;
  onRewardXP: (amount: number, reason: string) => void;
  onUpdatePost?: (updatedPost: BlogTopic | PeerStory) => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({
  post,
  type,
  currentUser,
  onBack,
  onRewardXP,
  onUpdatePost,
}) => {
  // Reaction states
  const [inspireCount, setInspireCount] = useState(post.inspireCount || 12);
  const [hasInspired, setHasInspired] = useState(false);
  const [cheerCount, setCheerCount] = useState(post.cheerCount || 8);
  const [hasCheered, setHasCheered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Tab: 'exchange' (all comments) or 'applied' (comments marked as applied)
  const [activeTab, setActiveTab] = useState<'exchange' | 'applied'>('exchange');

  // Comment input state
  const [commentText, setCommentText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [isAppliedChecked, setIsAppliedChecked] = useState(false);

  // Attachments / shared media
  const [attachments, setAttachments] = useState<SharedAttachment[]>(
    post.attachments && post.attachments.length > 0
      ? post.attachments
      : [
          {
            id: 'f-1',
            name: 'S__2654351.jpg',
            size: '1.4 MB',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
            downloadsCount: 42
          },
          {
            id: 'f-2',
            name: 'S__2654350.jpg',
            size: '1.2 MB',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
            downloadsCount: 35
          },
          {
            id: 'f-3',
            name: 'S__2654341.jpg',
            size: '1.8 MB',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
            downloadsCount: 19
          }
        ]
  );

  // Comments list
  const [comments, setComments] = useState<PostComment[]>(
    post.comments && post.comments.length > 0
      ? post.comments
      : [
          {
            id: 'c-1',
            authorName: 'ณภัทร วงศ์เจริญ',
            authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            authorRole: 'นักศึกษารุ่น 4',
            content: 'ได้ไอเดียไปปรับใช้กับกลุ่มเยาวชนในหมู่บ้านมากเลยครับ โดยเฉพาะตอนสะกิดตอบความรู้สึก เด็กๆ น่าจะเปิดใจได้ง่ายขึ้นมากเลย!',
            createdAt: '2 วันที่แล้ว',
            likes: 6,
            sticker: '🌟 สุดยอด',
            isUsed: true
          },
          {
            id: 'c-2',
            authorName: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            authorRole: 'อาจารย์ที่ปรึกษา',
            content: 'เป็นตัวอย่างที่ดีของการใช้กระบวนการทางจิตวิทยาการศึกษาผสานกับการพัฒนาศักยภาพผู้เรียน ชื่นชมการจัดทำคู่มือและใบงานที่นำไปใช้ต่อได้จริงครับ',
            createdAt: '1 วันที่แล้ว',
            likes: 9,
            sticker: '🎉 ได้แรงบันดาลใจ',
            isUsed: false
          }
        ]
  );

  // Inskru-styled cute cartoon stickers
  const stickers = [
    { id: 'st-1', label: 'อยากอ่านอีก', emoji: '💛 อยากอ่านอีก' },
    { id: 'st-2', label: 'รอติดตาม', emoji: '👀 รอติดตาม' },
    { id: 'st-3', label: 'ขอเอาไปใช้น้า', emoji: '🙌 ขอยืมไปใช้น้า' },
    { id: 'st-4', label: 'สู้ๆ น้า', emoji: '💪 สู้ๆ น้า' },
    { id: 'st-5', label: 'สุดยอด', emoji: '🌟 สุดยอด' },
    { id: 'st-6', label: 'ไอเดียแจ่ม', emoji: '💡 ไอเดียแจ่มมาก' },
    { id: 'st-7', label: 'ขอบคุณที่แชร์', emoji: '🙏 ขอบคุณที่แบ่งปัน' },
  ];

  // Quick reply prompt pills (Image 3)
  const quickPills = [
    'อยากรู้เพิ่มเติมว่า...',
    'อ่านแล้วทำให้...',
    'น่าประยุกต์กับ...',
    'ไปใช้แล้วจะรีบกลับมาบอกนะ',
    'ขอบคุณที่แบ่งปันน้า',
    'ขอยืมไปใช้กับ...'
  ];

  // Handlers for Reactions
  const handleInspireClick = () => {
    if (hasInspired) {
      setInspireCount((prev) => prev - 1);
      setHasInspired(false);
    } else {
      setInspireCount((prev) => prev + 1);
      setHasInspired(true);
      onRewardXP(10, 'กดให้กำลังใจ "ได้แรงบันดาลใจ"');
    }
  };

  const handleCheerClick = () => {
    if (hasCheered) {
      setCheerCount((prev) => prev - 1);
      setHasCheered(false);
    } else {
      setCheerCount((prev) => prev + 1);
      setHasCheered(true);
      onRewardXP(10, 'ส่งกำลังใจ "ลงไอเดียอีกน้า~"');
    }
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && !selectedSticker) return;

    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      authorName: currentUser?.name || 'view_pafun',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      authorRole: currentUser?.faculty || 'สมาชิกคอมมูนิตี้',
      content: commentText.trim(),
      createdAt: 'เมื่อสักครู่',
      likes: 0,
      sticker: selectedSticker || undefined,
      isUsed: isAppliedChecked
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setCommentText('');
    setSelectedSticker(null);
    setIsAppliedChecked(false);

    onRewardXP(25, 'ร่วมแลกเปลี่ยนความคิดเห็นในห้องสมุดความรู้');
  };

  // Download simulation
  const handleDownloadFile = (attId: string) => {
    setAttachments((prev) => 
      prev.map((a) => a.id === attId ? { ...a, downloadsCount: a.downloadsCount + 1 } : a)
    );
    alert('ระบบกำลังดาวน์โหลดไฟล์ลงในอุปกรณ์ของคุณ');
  };

  const handleDownloadAll = () => {
    setAttachments((prev) => 
      prev.map((a) => ({ ...a, downloadsCount: a.downloadsCount + 1 }))
    );
    alert(`กำลังดาวน์โหลดไฟล์ทั้งหมด (${attachments.length} ไฟล์) ในรูปแบบ ZIP Archive`);
  };

  // Author details
  const authorName = 'author' in post ? post.author : (post as PeerStory).authorName;
  const authorAvatar = 'authorAvatar' in post ? post.authorAvatar : (post as PeerStory).authorAvatar;
  const authorRole = 'authorRole' in post ? post.authorRole : `${(post as PeerStory).authorFaculty} (ปี ${(post as PeerStory).authorYear})`;
  const coverImage = 'coverImage' in post ? post.coverImage : (post as PeerStory).coverImage || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80';
  const postDate = 'createdAt' in post ? post.createdAt : (post as PeerStory).date;
  const views = post.views || 176;

  // Filtered comments based on activeTab
  const filteredComments = activeTab === 'applied' 
    ? comments.filter((c) => c.isUsed)
    : comments;

  const appliedCount = comments.filter((c) => c.isUsed).length;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://udru-social-engineer.app';
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(`${post.title} - แพลตฟอร์มการเรียนรู้ตลอดชีวิต`);

  const handleQuickCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      onRewardXP(10, 'แชร์และส่งต่อบทความสู่คอมมูนิตี้');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 font-['Prompt',sans-serif]">
      
      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={post.title}
        url={currentUrl}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs sm:text-sm border border-slate-200 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้ารวมไอเดีย</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer shadow-2xs"
              title="แชร์บทความนี้"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full border transition cursor-pointer shadow-2xs ${
                isBookmarked 
                  ? 'bg-amber-400 border-amber-400 text-slate-950' 
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title={isBookmarked ? 'บันทึกแล้ว' : 'บันทึกไว้ดูภายหลัง'}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Main Article Container */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
          
          {/* 1. Header Section matching Image 4 & 9 */}
          <div className="space-y-4">
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-snug tracking-tight">
              {post.title}
            </h1>

            {/* Author Row with Engagement Bar matching Image 4 & 9 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-100">
              
              {/* Author Avatar & Name & Date */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-xs">
                    😊
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm sm:text-base">
                    <span className="text-amber-600 font-extrabold text-xs">ins</span>
                    <span>{authorName}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-normal">
                    {postDate} {post.updatedAt && `(แก้ไข ${post.updatedAt})`}
                  </p>
                </div>
              </div>

              {/* Stats & Actions (Views, Comments, Reactions, Share, Bookmark) matching Image 4 & 10 */}
              <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-600 select-none">
                <div className="flex items-center gap-1" title="ยอดผู้เข้าชม">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold">{views}</span>
                </div>

                <div className="flex items-center gap-1" title="คอมเมนต์">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold">{comments.length}</span>
                </div>

                {/* Reaction Quick Counters */}
                <button
                  onClick={handleInspireClick}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition cursor-pointer ${
                    hasInspired 
                      ? 'bg-rose-50 border-rose-300 text-rose-700' 
                      : 'border-slate-200 hover:border-rose-300'
                  }`}
                  title="ได้แรงบันดาลใจ"
                >
                  <Heart className={`w-3.5 h-3.5 ${hasInspired ? 'fill-rose-500 text-rose-500' : 'fill-rose-200 text-rose-500'}`} />
                  <span className="font-bold">{inspireCount}</span>
                </button>

                <button
                  onClick={handleCheerClick}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition cursor-pointer ${
                    hasCheered 
                      ? 'bg-rose-50 border-rose-300 text-rose-800' 
                      : 'border-slate-200 hover:border-rose-300'
                  }`}
                  title="ลงไอเดียอีกน้า~"
                >
                  <span className="text-sm">💐</span>
                  <span className="font-bold">{cheerCount}</span>
                </button>

                <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-8 h-8 rounded-full border border-slate-700 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer"
                  title="แชร์"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-8 h-8 rounded-full border transition flex items-center justify-center cursor-pointer ${
                    isBookmarked 
                      ? 'bg-amber-400 border-amber-400 text-slate-950' 
                      : 'border-slate-700 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="บันทึก"
                >
                  <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>

            </div>
          </div>

          {/* Banner / Cover Image */}
          {coverImage && (
            <div className="rounded-3xl overflow-hidden shadow-sm max-h-[460px] w-full bg-slate-100">
              <img
                src={coverImage}
                alt={post.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* 2. Content Body */}
          <div className="space-y-6 text-slate-800 leading-relaxed font-normal text-sm sm:text-base">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-l-4 border-amber-400 pl-3">
              ที่มาของไอเดีย หรือ จุดประสงค์การสอน
            </h2>

            <div className="whitespace-pre-line leading-relaxed text-slate-700">
              {post.content}
            </div>

            {/* Key Takeaway if Peer Story */}
            {'keyTakeaway' in post && (post as PeerStory).keyTakeaway && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h3 className="font-bold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>บทเรียนสำคัญ (Key Takeaway) สำหรับน้องๆ:</span>
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 font-medium">
                  {(post as PeerStory).keyTakeaway}
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 3. ไฟล์ที่แบ่งปัน (Shared Files / Downloads Section) matching Image 5 */}
          <div className="pt-8 border-t border-slate-100 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                ไฟล์ที่แบ่งปัน
              </h3>
            </div>

            {/* File Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="h-40 bg-slate-100 overflow-hidden relative">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                      {file.size}
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="text-xs font-semibold text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        ดาวน์โหลด {file.downloadsCount} ครั้ง
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownloadFile(file.id)}
                      className="w-8 h-8 rounded-full border border-slate-300 hover:border-amber-400 hover:bg-amber-400 text-slate-700 hover:text-slate-950 flex items-center justify-center shrink-0 transition cursor-pointer"
                      title="ดาวน์โหลดไฟล์นี้"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleDownloadAll}
                className="px-5 py-2 rounded-full border border-slate-700 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-semibold transition cursor-pointer shadow-2xs flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดทั้งหมด ({attachments.length} ไฟล์)</span>
              </button>
            </div>
          </div>

          {/* 4. Reaction Section ("ไอเดียนี้เป็นไงบ้าง?") matching Image 3 */}
          <div className="pt-8 border-t border-slate-100 space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                ไอเดียนี้เป็นไงบ้าง?
              </h3>

              {/* Two Inskru-styled cute interactive reaction buttons */}
              <div className="flex items-center justify-center gap-8">
                {/* 1. Heart (ได้แรงบันดาลใจ) */}
                <button
                  onClick={handleInspireClick}
                  className={`flex flex-col items-center group cursor-pointer transition-transform duration-200 active:scale-95 ${
                    hasInspired ? 'scale-105' : ''
                  }`}
                >
                  <div className="relative mb-1">
                    <div className={`w-14 h-14 rounded-full border bg-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform ${
                      hasInspired 
                        ? 'border-rose-400 bg-rose-50/60' 
                        : 'border-slate-300 group-hover:border-rose-400'
                    }`}>
                      <Heart className={`w-7 h-7 transition-all ${
                        hasInspired ? 'text-rose-500 fill-rose-500 scale-110' : 'text-rose-500 fill-rose-100 group-hover:fill-rose-300'
                      }`} />
                    </div>
                    <span className="absolute -top-1 -right-2 text-xs font-bold text-slate-700 bg-white px-1.5 rounded-full border border-slate-200">
                      {inspireCount}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-rose-600">
                    ได้แรงบันดาลใจ
                  </span>
                </button>

                {/* 2. Flower Bouquet */}
                <button
                  onClick={handleCheerClick}
                  className={`flex flex-col items-center group cursor-pointer transition-transform duration-200 active:scale-95 ${
                    hasCheered ? 'scale-105' : ''
                  }`}
                >
                  <div className="relative mb-1">
                    <div className="w-14 h-14 rounded-full border border-slate-300 group-hover:border-rose-400 bg-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                      💐
                    </div>
                    <span className="absolute -top-1 -right-2 text-xs font-bold text-slate-700 bg-white px-1.5 rounded-full border border-slate-200">
                      {cheerCount}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-rose-600">
                    ลงไอเดียอีกน้า~
                  </span>
                </button>
              </div>

              {/* Action Pills: แลกเปลี่ยน / นำไปใช้แล้ว / Share / Bookmark matching Image 3 */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('exchange')}
                  className={`px-5 py-2 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'exchange'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>แลกเปลี่ยน ({comments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('applied')}
                  className={`px-5 py-2 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'applied'
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>นำไปใช้แล้ว ({appliedCount})</span>
                </button>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-9 h-9 rounded-full border border-slate-300 hover:border-slate-700 flex items-center justify-center text-slate-700 transition cursor-pointer"
                  title="แชร์"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-9 h-9 rounded-full border transition flex items-center justify-center cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-400 border-amber-400 text-slate-950'
                      : 'border-slate-300 hover:border-slate-700 text-slate-700'
                  }`}
                  title="บันทึก"
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>

            </div>

            {/* Author Bio Card matching Image 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover border border-amber-300"
                />
                <div>
                  <p className="text-xs text-slate-400">แบ่งปันโดย</p>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {authorName}
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">{authorRole}</p>
                </div>
              </div>

              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                  isFollowing
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-[#ffc000] hover:bg-[#ffb000] text-slate-950'
                }`}
              >
                {isFollowing ? 'กำลังติดตาม' : 'ติดตาม'}
              </button>
            </div>

            {/* Dedicated Social Share Section to expand reach and community learning */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-emerald-50/70 border border-amber-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span>แชร์บทความนี้ลงโซเชียลมีเดีย</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                        ขยายคอมมูนิตี้
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600">
                      ร่วมแบ่งปันไอเดียและสร้างแรงบันดาลใจให้เพื่อนนักศึกษาและเครือข่ายแลกเปลี่ยนเรียนรู้
                    </p>
                  </div>
                </div>

                {/* Instant Copy Link Button */}
                <button
                  onClick={handleQuickCopy}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>คัดลอกลิงก์สำเร็จแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอกลิงก์บทความ</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1-click Direct Social Share Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span className="text-sm">📘</span>
                  <span>Facebook</span>
                </a>

                {/* LINE */}
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-[#06C755] hover:bg-[#05b54d] text-white text-xs font-semibold shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span className="text-sm">💬</span>
                  <span>LINE</span>
                </a>

                {/* X (Twitter) */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-black hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span className="text-sm">𝕏</span>
                  <span>X (Twitter)</span>
                </a>

                {/* All Social Platforms / More */}
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white hover:bg-amber-100/60 text-slate-800 border border-slate-200 text-xs font-semibold shadow-xs transition cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span className="text-sm">✨</span>
                  <span>โซเชียลอื่นๆ</span>
                </button>
              </div>
            </div>

            {/* 5. Comment & Discussion Area ("แลกเปลี่ยน :)") matching Image 3 */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold text-slate-900">
                แลกเปลี่ยน :)
              </h3>

              {/* Comment Box Container with White Background */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
                
                {/* User Header */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold">
                    👧
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {currentUser?.name || 'view_pafun'}
                  </span>
                </div>

                {/* Horizontal Cute Cartoon Stickers Row */}
                <div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {stickers.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedSticker(selectedSticker === st.emoji ? null : st.emoji)}
                        className={`px-3 py-1.5 rounded-full text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1 border ${
                          selectedSticker === st.emoji
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold scale-105 shadow-2xs'
                            : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{st.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* "ได้นำไปใช้แล้ว" Checkbox */}
                <div>
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAppliedChecked}
                      onChange={(e) => setIsAppliedChecked(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>ได้นำไปใช้แล้ว (เพิ่มในแท็บ นำไปใช้แล้ว)</span>
                  </label>
                </div>

                {/* Textarea Form */}
                <form onSubmit={handleAddComment} className="space-y-3">
                  <div className="bg-white rounded-2xl border border-slate-300 p-3 sm:p-4 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/50 transition">
                    <textarea
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="ส่งกำลังใจให้เจ้าของไอเดียหรือบอกเล่าประสบการณ์ ข้อเสนอแนะหลังนำไอเดียนี้ไปใช้ ตรงนี้ได้เลย :)"
                      className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden resize-none bg-transparent"
                    />

                    {/* Quick Reply Pills matching Image 3 */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {quickPills.map((pill, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCommentText((prev) => prev ? `${prev} ${pill}` : pill)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-900 text-[11px] font-normal transition cursor-pointer"
                        >
                          {pill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Sticker Badge */}
                  {selectedSticker && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 text-xs rounded-full">
                      <span>สติ๊กเกอร์ที่เลือก: {selectedSticker}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedSticker(null)}
                        className="text-amber-700 hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* Bottom Form Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => alert('คุณสามารถแนบรูปภาพผลงานหลังนำไปใช้ได้')}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                      title="แนบรูปภาพผลงาน"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    <button
                      type="submit"
                      disabled={!commentText.trim() && !selectedSticker}
                      className="px-6 py-2 rounded-full bg-slate-900 hover:bg-emerald-600 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <span>แลกเปลี่ยน</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

              </div>

              {/* List of Comments */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-700">
                    {activeTab === 'applied' ? `คอมเมนต์ที่นำไปใช้แล้ว (${filteredComments.length})` : `การแลกเปลี่ยนทั้งหมด (${filteredComments.length})`}
                  </span>
                  <span>เรียงตามล่าสุด</span>
                </div>

                {filteredComments.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    ยังไม่มีข้อความในหมวดนี้ มาร่วมเป็นคนแรกที่ส่งกำลังใจหรือนำไปใช้กันเถอะ!
                  </div>
                ) : (
                  filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-8 h-8 rounded-full object-cover border border-amber-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{comment.authorName}</span>
                              {comment.isUsed && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>นำไปใช้แล้ว</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                          </div>
                        </div>

                        {comment.sticker && (
                          <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 font-medium">
                            {comment.sticker}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 pl-10 whitespace-pre-line leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </article>

      </div>
    </div>
  );
};

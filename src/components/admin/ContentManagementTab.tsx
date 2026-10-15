import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
  Heart,
  MessageSquare
} from 'lucide-react';
import { BlogTopic, PeerStory } from '../../types';

interface ContentManagementTabProps {
  blogs: BlogTopic[];
  stories: PeerStory[];
  onUpdateBlog: (updatedBlog: BlogTopic) => void;
  onDeleteBlog: (blogId: string) => void;
  onUpdateStory: (updatedStory: PeerStory) => void;
  onDeleteStory: (storyId: string) => void;
}

type UnifiedPost = {
  id: string;
  type: 'blog' | 'story';
  title: string;
  category: string;
  author: string;
  authorAvatar: string;
  authorRole?: string;
  coverImage: string;
  content: string;
  likes: number;
  commentsCount: number;
  status: 'approved' | 'pending' | 'blocked';
  date: string;
  rawBlog?: BlogTopic;
  rawStory?: PeerStory;
};

export const ContentManagementTab: React.FC<ContentManagementTabProps> = ({
  blogs,
  stories,
  onUpdateBlog,
  onDeleteBlog,
  onUpdateStory,
  onDeleteStory,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'blog' | 'story'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'blocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editing Post Modal State (Special Admin capability: Edit Cover Image & Content Text)
  const [editingPost, setEditingPost] = useState<UnifiedPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<UnifiedPost | null>(null);

  // Status mapping stored locally for interactive demo
  const [statusMap, setStatusMap] = useState<Record<string, 'approved' | 'pending' | 'blocked'>>({
    'blog-1': 'approved',
    'blog-2': 'approved',
    'blog-3': 'approved',
    'blog-4': 'pending',
    'story-1': 'approved',
    'story-2': 'approved',
    'story-3': 'pending',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Combine blogs & stories into unified list
  const unifiedPosts: UnifiedPost[] = [
    ...blogs.map(b => ({
      id: b.id,
      type: 'blog' as const,
      title: b.title,
      category: b.category,
      author: b.author,
      authorAvatar: b.authorAvatar,
      authorRole: b.authorRole,
      coverImage: b.coverImage,
      content: b.content,
      likes: b.likesCount,
      commentsCount: b.comments?.length || Math.floor(b.ideasCount / 30) || 12,
      status: statusMap[b.id] || (b.status === 'draft' ? 'pending' : 'approved'),
      date: b.createdAt,
      rawBlog: b
    })),
    ...stories.map(s => ({
      id: s.id,
      type: 'story' as const,
      title: s.title,
      category: 'พี่ถึงน้อง',
      author: s.authorName,
      authorAvatar: s.authorAvatar,
      authorRole: `${s.authorFaculty} (${s.authorYear})`,
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      content: s.content,
      likes: s.likes,
      commentsCount: s.commentsCount,
      status: statusMap[s.id] || 'approved',
      date: s.date,
      rawStory: s
    }))
  ];

  // Filtering
  const filteredPosts = unifiedPosts.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Moderation: Approve
  const handleApprove = (post: UnifiedPost) => {
    setStatusMap(prev => ({ ...prev, [post.id]: 'approved' }));
    showToast(`อนุมัติโพสต์ "${post.title}" เรียบร้อยแล้ว`);
  };

  // Moderation: Block
  const handleBlock = (post: UnifiedPost) => {
    setStatusMap(prev => ({ ...prev, [post.id]: 'blocked' }));
    showToast(`บล็อกโพสต์ "${post.title}" ชั่วคราวแล้ว`);
  };

  // Moderation: Delete
  const handleDelete = (post: UnifiedPost) => {
    setPostToDelete(post);
  };

  // Save Admin Edited Content (Cover Image & Text)
  const handleSavePostEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (editingPost.type === 'blog' && editingPost.rawBlog) {
      const updated: BlogTopic = {
        ...editingPost.rawBlog,
        title: editingPost.title,
        coverImage: editingPost.coverImage,
        content: editingPost.content,
        category: editingPost.category,
      };
      onUpdateBlog(updated);
    } else if (editingPost.type === 'story' && editingPost.rawStory) {
      const updated: PeerStory = {
        ...editingPost.rawStory,
        title: editingPost.title,
        content: editingPost.content,
      };
      onUpdateStory(updated);
    }

    setEditingPost(null);
    showToast(`บันทึกการแก้ไขหน้าปกและเนื้อหาของ "${editingPost.title}" เรียบร้อยแล้ว`);
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
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>จัดการโพสต์และบล็อก (Content Management & Moderation)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            อนุมัติ บล็อก หรือลบโพสต์ของผู้ใช้ พร้อมความสามารถพิเศษในการแก้ไขรูปหน้าปกและเนื้อหาได้โดยตรง
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs self-start sm:self-auto font-mono">
          รวมคอนเทนต์ทั้งหมด: <strong>{unifiedPosts.length}</strong> รายการ
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อโพสต์, ผู้เขียน, หรือหมวดหมู่..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Type & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Post Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterType('blog')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${filterType === 'blog' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
            >
              บทความบล็อก
            </button>
            <button
              onClick={() => setFilterType('story')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${filterType === 'story' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'}`}
            >
              เรื่องเล่าพี่ถึงน้อง
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">สถานะ: ทั้งหมด</option>
            <option value="approved">อนุมัติแล้ว (Approved)</option>
            <option value="pending">รอการอนุมัติ (Pending)</option>
            <option value="blocked">ถูกบล็อก (Blocked)</option>
          </select>
        </div>
      </div>

      {/* Content Posts Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ภาพหน้าปก & ชื่อโพสต์</th>
                <th className="py-3.5 px-4">ผู้เขียน</th>
                <th className="py-3.5 px-4">ประเภท / หมวดหมู่</th>
                <th className="py-3.5 px-4 text-center">สถิติ (Likes/Comments)</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-right">การจัดการของ Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/70 transition">
                  {/* Thumbnail & Title */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative group">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setEditingPost(JSON.parse(JSON.stringify(post)))}
                          className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
                          title="คลิกเพื่อเปลี่ยนรูปหน้าปก"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 line-clamp-1 hover:text-emerald-700 cursor-pointer" onClick={() => setEditingPost(JSON.parse(JSON.stringify(post)))}>
                          {post.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-semibold text-slate-800 block truncate max-w-[120px]">{post.author}</span>
                        <span className="text-[10px] text-slate-400 block">{post.date}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category & Type */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] block w-fit mb-1">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {post.type === 'blog' ? '💡 บทความความรู้' : '🌱 เรื่องเล่ารุ่นพี่'}
                    </span>
                  </td>

                  {/* Metrics */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-slate-500 font-mono text-[11px]">
                      <span className="flex items-center gap-1 text-rose-600">
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <MessageSquare className="w-3 h-3" />
                        {post.commentsCount}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {post.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>อนุมัติแล้ว</span>
                      </span>
                    )}
                    {post.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px]">
                        <span>รอตรวจสอบ</span>
                      </span>
                    )}
                    {post.status === 'blocked' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px]">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>ถูกบล็อก</span>
                      </span>
                    )}
                  </td>

                  {/* Admin Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Special Edit Button */}
                      <button
                        onClick={() => setEditingPost(JSON.parse(JSON.stringify(post)))}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                        title="แก้ไขหน้าปกและเนื้อหาโดยตรง"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline">แก้ไข</span>
                      </button>

                      {/* Approve Button */}
                      {post.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(post)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer text-[11px] font-semibold"
                          title="อนุมัติโพสต์"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </button>
                      )}

                      {/* Block Button */}
                      {post.status !== 'blocked' && (
                        <button
                          onClick={() => handleBlock(post)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer text-[11px] font-semibold"
                          title="บล็อกโพสต์"
                        >
                          <XCircle className="w-3.5 h-3.5 text-amber-600" />
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(post)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                        title="ลบโพสต์"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Admin Modal: Edit Cover Image & Content Text */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-800">
            
            <button
              onClick={() => setEditingPost(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  สิทธิ์ผู้ดูแลระบบ: แก้ไขหน้าปกและเนื้อหาโพสต์ (Admin Content Override)
                </h3>
                <p className="text-xs text-slate-500">
                  แก้ไขข้อความหรือรูปภาพที่ผู้ใช้งานลงไว้ เพื่อความถูกต้องและเหมาะสมตามมาตรฐาน
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePostEdit} className="space-y-4 text-xs">
              
              {/* 1. Cover Image Section */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>แก้ไขรูปภาพหน้าปก (Cover Image URL)</span>
                </label>
                
                {/* Live Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 border border-slate-300 max-h-48">
                  <img
                    src={editingPost.coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md">
                    ตัวอย่างรูปภาพสด
                  </span>
                </div>

                <input
                  type="url"
                  required
                  placeholder="https://... ใส่ลิงก์ URL รูปภาพใหม่"
                  value={editingPost.coverImage}
                  onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-mono"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">รูปแนะนำ:</span>
                  {[
                    { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80' },
                    { label: 'ชุมชน', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80' },
                    { label: 'บอร์ดเกม', url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80' },
                    { label: 'สิ่งแวดล้อม', url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=600&q=80' }
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setEditingPost({ ...editingPost, coverImage: preset.url })}
                      className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-[10px] text-slate-600 hover:text-emerald-700 whitespace-nowrap cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Title Input */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">หัวข้อโพสต์ / บทความ *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-bold text-slate-900"
                />
              </div>

              {/* 3. Category Input */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">หมวดหมู่</label>
                <input
                  type="text"
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {/* 4. Content Text Input */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">เนื้อหาบทความฉบับเต็ม (Content Text) *</label>
                <textarea
                  rows={6}
                  required
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="เขียนหรือแก้ไขเนื้อหาบทความ..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
                />
              </div>

              {/* Bottom Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition cursor-pointer shadow-sm"
                >
                  บันทึกการแก้ไข (อัปเดตทันที)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal: Delete Post Confirmation */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">ยืนยันการลบโพสต์?</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{postToDelete.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  if (postToDelete.type === 'blog') {
                    onDeleteBlog(postToDelete.id);
                  } else {
                    onDeleteStory(postToDelete.id);
                  }
                  showToast(`ลบโพสต์ "${postToDelete.title}" สำเร็จ`);
                  setPostToDelete(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                ลบโพสต์
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

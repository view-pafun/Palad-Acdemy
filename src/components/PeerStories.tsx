import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  Eye, 
  Share2, 
  Bookmark, 
  Search,
  Sparkles,
  Quote
} from 'lucide-react';
import { PeerStory, User } from '../types';
import { CreatePostModal } from './CreatePostModal';
import { SocialShareModal } from './SocialShareModal';

interface PeerStoriesProps {
  stories: PeerStory[];
  currentUser: User | null;
  onAddStory: (story: PeerStory) => void;
  onSelectStory: (story: PeerStory) => void;
  onSwitchRole: (role: 'student' | 'lecturer') => void;
}

export const PeerStories: React.FC<PeerStoriesProps> = ({
  stories,
  currentUser,
  onAddStory,
  onSelectStory,
  onSwitchRole,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('ทั้งหมด');
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'latest'>('all');
  
  // Share & bookmark states
  const [sharingStory, setSharingStory] = useState<PeerStory | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const tracks = [
    'ทั้งหมด',
    'นวัตกรพัฒนาชุมชน',
    'เกษตรปลอดภัย & สิ่งแวดล้อม',
    'เทคโนโลยี & สื่อสร้างสรรค์',
    'ศึกษาศาสตร์ & แนะแนว',
    'การตลาดชุมชน'
  ];

  const filteredStories = stories.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.authorFaculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTrack = selectedTrack === 'ทั้งหมด' || s.careerTrack.includes(selectedTrack);

    let matchesTab = true;
    if (activeTab === 'popular') {
      matchesTab = (s.likes || 0) >= 150 || (s.views || 0) >= 1000;
    }

    return matchesSearch && matchesTrack && matchesTab;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handleShareClick = (story: PeerStory, e: React.MouseEvent) => {
    e.stopPropagation();
    setSharingStory(story);
  };

  return (
    <div className="py-10 sm:py-14 bg-[#fcfbf9] min-h-screen font-['Prompt',sans-serif]">
      
      {/* Social Share Modal for Sub-Blog Sharing */}
      {sharingStory && (
        <SocialShareModal
          isOpen={!!sharingStory}
          onClose={() => setSharingStory(null)}
          title={sharingStory.title}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner - Community Peer Mentorship Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-emerald-200/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>โครงการพี่ถึงน้อง (Peer Mentorship & Stories)</span>
              <span className="text-slate-300 font-light" aria-hidden="true">·</span>
              <span className="text-slate-600 font-normal">แชร์เรื่องจริงจากใจนักศึกษา สไตล์คอมมูนิตี้</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              พี่ถึงน้อง: ประสบการณ์และการเติบโต
            </h1>
            <p className="mt-2 text-slate-600 text-sm sm:text-base font-normal max-w-2xl">
              พื้นที่ให้นักศึกษารุ่นพี่ ถ่ายทอดประสบการณ์ลงพื้นที่จริง ก้าวข้ามอุปสรรค และออกแบบชีวิตในมหาวิทยาลัย
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Student Sharing Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ แบ่งปันเรื่องเล่าของฉัน</span>
            </button>
          </div>
        </div>

        {/* Filter Controls (Warm Cream & Rounded, matching Knowledge Library) */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-emerald-100 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search */}
            <div className="w-full sm:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเรื่องเล่าพี่ถึงน้อง, สายอาชีพ, ผู้เขียน..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 bg-white"
              />
            </div>

            {/* Segmented Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-medium self-stretch sm:self-auto justify-center">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-white text-slate-900 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ทั้งหมด ({stories.length})
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'popular' 
                    ? 'bg-white text-slate-900 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌟 เรื่องเล่ายอดนิยม
              </button>
            </div>
          </div>

          {/* Track Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-4 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer font-medium ${
                  selectedTrack === track
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-[#fdfbf7] hover:bg-emerald-50 text-slate-700 border border-slate-200/80'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Feed & Sub-blog Card Grid matching Knowledge Library */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filteredStories.map((story) => {
            const isBookmarked = bookmarkedIds.includes(story.id);
            const viewsCount = story.views || 680;
            const commentsCount = story.comments ? story.comments.length : (story.commentsCount || 0);
            const inspire = story.inspireCount || story.likes || 12;
            const cheer = story.cheerCount || Math.floor((story.likes || 10) * 0.45);
            
            // Fallback cover if none
            const cover = story.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={story.id}
                onClick={() => onSelectStory(story)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* 1. ภาพปก (Cover Image) */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={cover}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Career Track Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-emerald-800 shadow-xs border border-white/50">
                        {story.careerTrack}
                      </span>
                    </div>

                    {/* Action buttons (Share & Bookmark) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleShareClick(story, e)}
                        className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md hover:bg-emerald-500 hover:text-white text-slate-700 flex items-center justify-center transition shadow-xs cursor-pointer"
                        title="แชร์ไปยังโซเชียลมีเดีย"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => toggleBookmark(story.id, e)}
                        className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition shadow-xs cursor-pointer ${
                          isBookmarked 
                            ? 'bg-amber-400 text-slate-950' 
                            : 'bg-white/95 hover:bg-amber-100 text-slate-700'
                        }`}
                        title="บันทึกเรื่องเล่านี้"
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* 2. Card Content Body */}
                  <div className="p-5 sm:p-6 space-y-3">
                    
                    {/* 2.1 รูปภาพโปรไฟล์ & ชื่อผู้เขียน */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={story.authorAvatar}
                          alt={story.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[7px] font-bold">
                          🌱
                        </span>
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {story.authorName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {story.authorFaculty} · {story.authorYear}
                        </p>
                      </div>
                    </div>

                    {/* 2.2 หัวข้อ (Title) */}
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {story.title}
                    </h3>

                    {/* 2.3 เนื้อหาเกริ่นนำ (Excerpt) */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {story.content}
                    </p>

                    {/* 2.4 บทเรียนสำคัญ (Key Takeaway Highlight) */}
                    {story.keyTakeaway && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 line-clamp-2 italic flex items-start gap-1.5">
                        <Quote className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">"{story.keyTakeaway}"</span>
                      </div>
                    )}

                    {/* 2.5 แท็ก (Tags) */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {story.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-normal">
                          #{tag}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

                {/* 3. สถิติใต้การ์ด (Card Stats Footer: ยอดคนดู, ยอดคนคอมเม้น, ยอดคนกดหัวใจ) */}
                <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 select-none">
                  
                  {/* Left: ยอดคนดู & ยอดคนคอมเม้น */}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title="ยอดผู้เข้าชม">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{viewsCount}</span>
                    </span>
                    <span className="flex items-center gap-1" title="ยอดความคิดเห็น">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{commentsCount}</span>
                    </span>
                  </div>

                  {/* Right: ยอดคนกดหัวใจ & กำลังใจ */}
                  <div className="flex items-center gap-2">
                    <span 
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50/80 border border-rose-200 text-rose-800 text-[11px] font-bold" 
                      title="ยอดคนกดหัวใจ / ได้แรงบันดาลใจ"
                    >
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{inspire}</span>
                    </span>
                    <span 
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-900 text-[11px] font-bold" 
                      title="ส่งดอกไม้กำลังใจ"
                    >
                      <span>💐</span>
                      <span>{cheer}</span>
                    </span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state if no filter results */}
        {filteredStories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="font-bold text-slate-800 text-base">ไม่พบเรื่องเล่าที่ตรงกับคำค้นหา</h3>
            <p className="text-xs text-slate-500">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่ทั้งหมด</p>
          </div>
        )}

        {/* Create Modal for Students */}
        {isCreateModalOpen && (
          <CreatePostModal
            type="story"
            currentUser={currentUser}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={onAddStory}
            onSwitchRole={onSwitchRole}
          />
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Eye, 
  Share2,
  Bookmark,
  CheckCircle2,
  Layers,
  Heart
} from 'lucide-react';
import { BlogTopic, User } from '../types';
import { SocialShareModal } from './SocialShareModal';

interface BlogLibraryProps {
  topics: BlogTopic[];
  currentUser: User | null;
  onAddTopic: (topic: BlogTopic) => void;
  onSelectTopic: (topic: BlogTopic) => void;
  onOpenCreatePage: () => void;
  onSwitchRole: (role: 'student' | 'lecturer') => void;
}

export const BlogLibrary: React.FC<BlogLibraryProps> = ({
  topics,
  currentUser,
  onAddTopic,
  onSelectTopic,
  onOpenCreatePage,
  onSwitchRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'latest'>('all');
  
  // Share modal state
  const [sharingTopic, setSharingTopic] = useState<BlogTopic | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Unique categories
  const dynamicCategories = ['ทั้งหมด', ...Array.from(new Set(topics.map((t) => t.category)))];

  const filteredTopics = topics.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ทั้งหมด' || t.category === selectedCategory;

    let matchesTab = true;
    if (activeTab === 'recommended') matchesTab = !!t.isFeatured;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handleShareClick = (topic: BlogTopic, e: React.MouseEvent) => {
    e.stopPropagation();
    setSharingTopic(topic);
  };

  return (
    <div className="py-10 sm:py-14 bg-white min-h-screen font-['Prompt',sans-serif]">
      
      {/* Social Share Modal */}
      {sharingTopic && (
        <SocialShareModal
          isOpen={!!sharingTopic}
          onClose={() => setSharingTopic(null)}
          title={sharingTopic.title}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner - Inskru Community Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-amber-200/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>ห้องสมุดความรู้ & ไอเดีย (Knowledge Sharing Space)</span>
              <span className="text-slate-300 font-light" aria-hidden="true">·</span>
              <span className="text-slate-600 font-normal">สไตล์คอมมูนิตี้แบ่งปันความรู้เพื่อสังคม</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ห้องสมุดความรู้และไอเดียชุมชน
            </h1>
            <p className="mt-2 text-slate-600 text-sm sm:text-base font-normal max-w-2xl">
              พื้นที่รวมสื่อการเรียนรู้ นวัตกรรมข้ามศาสตร์ และไอเดียแก้ปัญหาเชิงพื้นที่โดยอาจารย์และนักศึกษา มรภ.อุดรธานี
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Create Post Button -> Direct full page link, NO POPUP */}
            <button
              onClick={onOpenCreatePage}
              className="px-6 py-3 rounded-full bg-[#ffc000] hover:bg-[#ffb000] text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ แบ่งปันไอเดียใหม่</span>
            </button>
          </div>
        </div>

        {/* Filter Controls (Warm Cream & Rounded) */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-amber-100 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search */}
            <div className="w-full sm:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาไอเดีย, สื่อการสอน, ผู้เขียน..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 bg-white"
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
                ทั้งหมด ({topics.length})
              </button>
              <button
                onClick={() => setActiveTab('recommended')}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'recommended' 
                    ? 'bg-white text-slate-900 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌟 แนะนำโดยอาจารย์
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer font-medium ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-[#fdfbf7] hover:bg-amber-50 text-slate-700 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Feed & Card View matching Inskru Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filteredTopics.map((topic) => {
            const isBookmarked = bookmarkedIds.includes(topic.id);
            const viewsCount = topic.views || 176;
            const commentsCount = topic.comments ? topic.comments.length : 2;
            const inspire = topic.inspireCount || 12;
            const cheer = topic.cheerCount || 8;

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-amber-400/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={topic.coverImage}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow-xs border border-white/50">
                        {topic.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {/* Quick Share Button on Card */}
                      <button
                        onClick={(e) => handleShareClick(topic, e)}
                        className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md hover:bg-amber-400 text-slate-700 hover:text-slate-950 flex items-center justify-center transition shadow-xs cursor-pointer"
                        title="แชร์ไปยังโซเชียล"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Bookmark Button on Card */}
                      <button
                        onClick={(e) => toggleBookmark(topic.id, e)}
                        className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition shadow-xs cursor-pointer ${
                          isBookmarked 
                            ? 'bg-amber-400 text-slate-950' 
                            : 'bg-white/95 hover:bg-amber-100 text-slate-700'
                        }`}
                        title="บันทึก"
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 space-y-3">
                    
                    {/* Author Row with Avatar */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={topic.authorAvatar}
                          alt={topic.author}
                          className="w-8 h-8 rounded-full object-cover border border-amber-300"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[8px] font-bold">
                          😊
                        </span>
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {topic.author}
                        </p>
                        <p className="text-[10px] text-slate-400">{topic.createdAt}</p>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                      {topic.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {topic.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {topic.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Card Stats Footer (Views, Comments, Reactions) */}
                <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 select-none">
                  
                  {/* Left: Views & Comments */}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title="ผู้เข้าชม">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{viewsCount}</span>
                    </span>
                    <span className="flex items-center gap-1" title="คอมเมนต์">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{commentsCount}</span>
                    </span>
                  </div>

                  {/* Right: Reaction Counts (Heart & Bouquet) */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50/80 border border-rose-200 text-rose-800 text-[11px] font-bold" title="ได้แรงบันดาลใจ">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{inspire}</span>
                    </span>
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-900 text-[11px] font-bold" title="ลงไอเดียอีกน้า~">
                      <span>💐</span>
                      <span>{cheer}</span>
                    </span>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

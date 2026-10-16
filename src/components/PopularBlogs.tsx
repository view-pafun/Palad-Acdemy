import React from 'react';
import { ArrowRight, PlusCircle, MessageSquare, Eye, Heart } from 'lucide-react';
import { BlogTopic } from '../types';

interface PopularBlogsProps {
  topics: BlogTopic[];
  onSelectTopic: (topic: BlogTopic) => void;
  onExploreAll: () => void;
  onOpenCreateModal: () => void;
}

export const PopularBlogs: React.FC<PopularBlogsProps> = ({
  topics,
  onSelectTopic,
  onExploreAll,
  onOpenCreateModal,
}) => {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              ประเด็นความรู้น่าสนใจ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              แลกเปลี่ยนไอเดีย เทคนิคการเรียนรู้ และนวัตกรรมข้ามศาสตร์ที่กำลังเป็นที่นิยม
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Button 1: Slate 100 -> Black on hover with white text */}
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs border-0 group/share"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600 group-hover/share:text-white transition-colors" />
              <span>+ แบ่งปันไอเดียใหม่</span>
            </button>

            {/* Button 2: #FFC800 with no black border -> Black on hover with white text */}
            <button
              onClick={onExploreAll}
              className="px-4 py-2.5 rounded-xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-1 cursor-pointer border-0 group/btn"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-white transition-all" />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {topics.slice(0, 3).map((topic) => {
            const viewsCount = topic.views || Math.max(850, topic.ideasCount * 2 + 120);
            const commentsCount = topic.comments?.length || Math.max(12, Math.floor(topic.ideasCount / 35));
            const likesCount = topic.likesCount || Math.max(65, Math.floor(topic.ideasCount / 8));

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                {/* Card Thumbnail */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={topic.coverImage}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-medium flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> คลิกเพื่ออ่านบทความเต็ม
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors line-clamp-1 mb-2.5">
                      {topic.title}
                    </h3>

                    {/* Clean unboxed tags */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-3.5 font-normal">
                      <span className="font-semibold text-amber-500">{topic.category}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      {topic.tags.map((tag, idx) => (
                        <span key={idx} className="text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* รูป/ชื่อ ผู้เขียน (Author Avatar & Name) */}
                    <div className="flex items-center gap-2.5 pt-1 pb-3">
                      <img
                        src={topic.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                        alt={topic.author}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {topic.author}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {topic.authorRole || 'นักคิดเพื่อสังคม'} · {topic.createdAt || 'เผยแพร่แล้ว'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: ยอดคนเข้าดู / ยอดคนแสดงความเห็น / ยอดคนกดใจ */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    {/* ยอดคนเข้าดู (Views) */}
                    <div className="flex items-center gap-1 text-slate-600 hover:text-slate-900" title="ยอดผู้เข้าชม">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="tabular-nums">{viewsCount.toLocaleString()}</span>
                    </div>

                    {/* ยอดคนแสดงความเห็น (Comments) */}
                    <div className="flex items-center gap-1 text-slate-600 hover:text-slate-900" title="ความคิดเห็น">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span className="tabular-nums">{commentsCount.toLocaleString()}</span>
                    </div>

                    {/* ยอดคนกดใจ (Likes / Hearts) */}
                    <div className="flex items-center gap-1 text-rose-600 font-semibold" title="ยอดถูกใจ">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span className="tabular-nums">{likesCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

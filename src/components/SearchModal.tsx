import React, { useState } from 'react';
import { Search, X, BookOpen, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { Course, BlogTopic, EventItem } from '../types';

interface SearchModalProps {
  courses: Course[];
  blogs: BlogTopic[];
  events: EventItem[];
  onClose: () => void;
  onSelectCourse: (course: Course) => void;
  onSelectBlog: (blog: BlogTopic) => void;
  onNavigate: (tab: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  courses,
  blogs,
  events,
  onClose,
  onSelectCourse,
  onSelectBlog,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const matchingCourses = trimmed
    ? courses.filter(c => c.title.toLowerCase().includes(trimmed) || c.description.toLowerCase().includes(trimmed))
    : [];

  const matchingBlogs = trimmed
    ? blogs.filter(b => b.title.toLowerCase().includes(trimmed) || b.tags.some(t => t.toLowerCase().includes(trimmed)))
    : [];

  const matchingEvents = trimmed
    ? events.filter(e => e.title.toLowerCase().includes(trimmed) || e.description.toLowerCase().includes(trimmed))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาคอร์สเรียน, ประเด็นน่าสนใจ, กิจกรรม..."
            className="w-full text-sm sm:text-base outline-none text-slate-900 placeholder-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!trimmed ? (
            <div className="text-center py-8 text-xs text-slate-400">
              ลองพิมพ์คำค้นหา เช่น <span className="font-semibold text-emerald-700">"AI"</span>, <span className="font-semibold text-emerald-700">"นวัตกรรม"</span>, หรือ <span className="font-semibold text-emerald-700">"โฮมรูม"</span>
            </div>
          ) : matchingCourses.length === 0 && matchingBlogs.length === 0 && matchingEvents.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              ไม่พบผลลัพธ์สำหรับ "{query}"
            </div>
          ) : (
            <>
              {matchingCourses.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>หลักสูตรออนไลน์ ({matchingCourses.length})</span>
                  </p>
                  <div className="space-y-1.5">
                    {matchingCourses.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectCourse(c);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs transition cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800 line-clamp-1">{c.title}</span>
                        <span className="text-emerald-700 font-bold shrink-0">เข้าเรียน →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingBlogs.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>ประเด็นความรู้ & ไอเดีย ({matchingBlogs.length})</span>
                  </p>
                  <div className="space-y-1.5">
                    {matchingBlogs.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          onSelectBlog(b);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs transition cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800 line-clamp-1">{b.title}</span>
                        <span className="text-amber-700 font-bold shrink-0">{b.ideasCount} ไอเดีย →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingEvents.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>กิจกรรม & เวิร์กช็อป ({matchingEvents.length})</span>
                  </p>
                  <div className="space-y-1.5">
                    {matchingEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => {
                          onNavigate('events');
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs transition cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800 line-clamp-1">{e.title}</span>
                        <span className="text-purple-700 font-bold shrink-0">{e.type} →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

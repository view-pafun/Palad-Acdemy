import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Star, Award, CheckCircle, Sparkles, FileText, PlayCircle } from 'lucide-react';
import { Course } from '../types';

interface CourseLibraryProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const CourseLibrary: React.FC<CourseLibraryProps> = ({
  courses,
  onSelectCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'cert'>('all');

  const categories = ['ทั้งหมด', 'นวัตกรรมชุมชน', 'เทคโนโลยีและ AI', 'การพัฒนาตนเอง', 'เกมและการเรียนรู้'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ทั้งหมด' || course.category === selectedCategory;

    let matchesType = true;
    if (filterType === 'free') matchesType = course.isFree;
    if (filterType === 'cert') matchesType = course.hasCertificate;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="py-12 bg-gradient-to-b from-[#f8faf8] to-white min-h-screen font-['Prompt',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>หลักสูตรออนไลน์คุณภาพสูง</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            คลังหลักสูตรออนไลน์ <span className="text-emerald-600">Online Academy</span>
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base font-normal">
            เติมเต็มสมรรถนะการทำงาน การแก้ปัญหาเชิงพื้นที่ และนวัตกรรมดิจิทัล พร้อมระบบสอบรับใบประกาศนียบัตรอัตโนมัติ
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อหลักสูตร, ผู้สอน, ทักษะที่ต้องการ..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Free / Certificate Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold cursor-pointer transition ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterType('free')}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold cursor-pointer transition ${
                  filterType === 'free'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                หลักสูตรฟรี
              </button>
              <button
                onClick={() => setFilterType('cert')}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold cursor-pointer transition ${
                  filterType === 'cert'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                มีใบประกาศฯ
              </button>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0">หมวดหมู่:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <span>พบทั้งหมด {filteredCourses.length} หลักสูตร</span>
          <span>มาตรฐานการรับรองคุณภาพการศึกษา</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              {/* Thumbnail with pricing badge */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {course.badge && (
                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md">
                    {course.badge}
                  </span>
                )}
                {course.isFree ? (
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> ฟรี
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-slate-900 text-amber-300 font-black text-xs px-3 py-1 rounded-full shadow-md">
                    ฿{course.price?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Course Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-normal">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                      {course.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {course.durationHours} ชม.
                    </span>
                    <span>•</span>
                    <span>{course.lessonsCount} บทเรียน</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
                    {course.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        {course.instructor.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Price & Certificate info */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-slate-600">
                        {course.hasCertificate ? 'มีใบประกาศนียบัตร' : 'เรียนรู้ด้วยตนเอง'}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      {course.isFree ? (
                        <span className="text-base font-black text-emerald-600">ฟรี</span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-400">ราคา</span>
                          <span className="text-base font-black text-slate-900">฿{course.price?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2 Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 font-['Mitr',sans-serif]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white text-slate-800 font-bold text-xs transition cursor-pointer text-center flex items-center justify-center gap-1 border-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>อ่านรายละเอียด</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course);
                      }}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-xs bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 group/btn"
                    >
                      <PlayCircle className="w-3.5 h-3.5 group-hover/btn:text-white transition-colors" />
                      <span>{course.isFree ? 'สนใจเข้าเรียน' : 'ทดลองเรียนฟรี'}</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Star, 
  Award, 
  CheckCircle, 
  Users, 
  Sparkles,
  FileText,
  PlayCircle
} from 'lucide-react';
import { Course } from '../types';

interface FeaturedCoursesProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onExploreAllCourses: () => void;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({
  courses,
  onSelectCourse,
  onExploreAllCourses,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [courses]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const cardWidth = 360;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#fbfcfb] relative border-b border-slate-200/70 overflow-hidden font-['Prompt',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Slider Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              คอร์สเรียนแนะนำ <span className="text-amber-500">Online Academy</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              เลื่อนดูหลักสูตรยอดนิยม พัฒนาทักษะแห่งอนาคต และรับเกียรติบัตรรับรองสมรรถนะ
            </p>
          </div>

          {/* Action buttons & Slider Arrows */}
          <div className="flex items-center gap-3">
            {/* View all courses button: #FFC800 with no black border, turns black with white text on hover/active */}
            <button
              onClick={onExploreAllCourses}
              className="px-4 py-2.5 rounded-xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs border-0 group"
            >
              <span>ดูคอร์สทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="เลื่อนซ้าย"
                className={`p-2 rounded-lg transition cursor-pointer ${
                  canScrollLeft
                    ? 'text-slate-800 hover:bg-slate-100 hover:text-emerald-700'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-200" />
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="เลื่อนขวา"
                className={`p-2 rounded-lg transition cursor-pointer ${
                  canScrollRight
                    ? 'text-slate-800 hover:bg-slate-100 hover:text-emerald-700'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Card Slider / Carousel */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div
            ref={sliderRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="w-[300px] sm:w-[350px] md:w-[380px] shrink-0 snap-start bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* 1. ภาพหน้าปกคอร์สเรียน (Course Thumbnail) + ป้ายราคา & ป้ายสถานะ */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {course.badge && (
                    <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-amber-300 font-semibold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{course.badge}</span>
                    </span>
                  )}

                  {/* การแสดงป้ายราคา/สถานะราคา: ชัดเจน ฟรี / มีค่าใช้จ่าย */}
                  <div className="absolute top-3 right-3">
                    {course.isFree ? (
                      <span className="bg-emerald-600/95 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                        <span>ฟรี</span>
                      </span>
                    ) : (
                      <span className="bg-slate-950/90 backdrop-blur-md text-amber-300 font-black text-xs px-3 py-1 rounded-full shadow-md">
                        ฿{course.price?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Level & duration chip on bottom of image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/95">
                    <span className="bg-slate-900/80 backdrop-blur-sm px-2.5 py-0.5 rounded-md font-medium">
                      {course.category}
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-sm px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" /> {course.durationHours} ชม.
                    </span>
                  </div>
                </div>

                {/* 2. เนื้อหาในการ์ด: ชื่อคอร์ส, คำอธิบายสั้นๆ, ข้อมูลผู้สอน */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* ชื่อหลักสูตร (Course Title) */}
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2 leading-snug">
                      {course.title}
                    </h3>

                    {/* คำอธิบายเนื้อหาคอร์สสั้นๆ (Short Description) */}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
                      {course.description}
                    </p>
                  </div>

                  <div>
                    {/* ข้อมูลอาจารย์ผู้สอน & ผู้เรียน */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">
                            {course.instructor.name}
                          </p>
                          <p className="text-[10px] text-slate-400">ผู้สอน</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-bold justify-end">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{course.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {(course.studentsCount || 1200).toLocaleString()} ผู้เรียน
                        </span>
                      </div>
                    </div>

                    {/* การแสดงป้ายราคา/สถานะราคา ชัดเจนด้านล่าง */}
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

                    {/* 3. ปุ่มปฏิบัติการ (Action Buttons) 2 ปุ่มด้านล่างสุดของการ์ด */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* ปุ่มที่ 1: "อ่านรายละเอียด" (Secondary Button) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCourse(course);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white text-slate-800 font-bold text-xs transition cursor-pointer text-center flex items-center justify-center gap-1 font-['Mitr',sans-serif] border-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>อ่านรายละเอียด</span>
                      </button>

                      {/* ปุ่มที่ 2: "สนใจเข้าเรียน" หรือ "ทดลองเรียนฟรี" (Primary Button #FFC800 / #000000 with NO black border, turns black on hover with white text) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCourse(course);
                        }}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-xs bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white border-0 font-['Mitr',sans-serif] group/btn"
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
    </section>
  );
};

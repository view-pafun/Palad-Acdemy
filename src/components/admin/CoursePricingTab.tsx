import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  DollarSign, 
  CheckCircle2, 
  X, 
  Clock, 
  Star, 
  Award, 
  Users, 
  Sparkles, 
  CreditCard,
  Save,
  Check,
  Zap,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Video,
  FileText,
  Link,
  HelpCircle,
  Upload,
  Layers,
  Shuffle,
  GripVertical,
  Mic,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Course, MembershipPlan, Lesson, Chapter, QuizQuestion, CourseAssignment, MediaType } from '../../types';
import { INITIAL_MEMBERSHIP_PLANS } from '../../data/adminMockData';

interface CoursePricingTabProps {
  courses: Course[];
  onAddCourse: (newCourse: Course) => void;
  onUpdateCourse: (updatedCourse: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  instructorFilterName?: string; // If set, only show courses assigned to this instructor
}

type EditTabMode = 'basic' | 'curriculum' | 'quiz' | 'assignment';

export const CoursePricingTab: React.FC<CoursePricingTabProps> = ({
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  instructorFilterName,
}) => {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(INITIAL_MEMBERSHIP_PLANS);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{ moduleIndex: number; lessonIndex: number } | null>(null);
  const [draggedModule, setDraggedModule] = useState<number | null>(null);
  const [editTab, setEditTab] = useState<EditTabMode>('basic');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Course Form State
  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'นวัตกรรมชุมชน',
    level: 'เริ่มต้น' as 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง' | 'ทุกระดับ',
    durationHours: 10,
    lessonsCount: 6,
    instructorName: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
    instructorTitle: 'ผู้เชี่ยวชาญประจำ มรภ.อุดรธานี',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    isFree: true,
    price: 390,
    hasCertificate: true,
    badge: 'หลักสูตรใหม่'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Course Handler
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseForm.title.trim()) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: newCourseForm.title.trim(),
      slug: `course-${Date.now()}`,
      description: newCourseForm.description.trim(),
      longDescription: newCourseForm.longDescription.trim() || newCourseForm.description.trim(),
      category: newCourseForm.category,
      level: newCourseForm.level,
      durationHours: Number(newCourseForm.durationHours) || 8,
      lessonsCount: Number(newCourseForm.lessonsCount) || 4,
      rating: 5.0,
      studentsCount: 1,
      instructor: {
        name: newCourseForm.instructorName,
        title: newCourseForm.instructorTitle,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      thumbnail: newCourseForm.thumbnail,
      badge: newCourseForm.badge,
      isFree: newCourseForm.isFree,
      price: newCourseForm.isFree ? undefined : Number(newCourseForm.price),
      hasCertificate: newCourseForm.hasCertificate,
      modules: [
        {
          id: 'm1',
          title: 'บทที่ 1: การสำรวจบริบทและความต้องการที่แท้จริง',
          lessons: [
            { 
              id: 'l1', 
              title: 'บทนำ: กระบวนการคิดและตั้งโจทย์', 
              durationMinutes: 20,
              videoUrl: 'https://flow.google.com/shared/video/demo',
              requiresVideoCompletion: true,
              isLocked: false
            },
            { 
              id: 'l2', 
              title: 'เครื่องมือและวิธีปฏิบัติงานจริง', 
              durationMinutes: 25,
              requiresVideoCompletion: true,
              isLocked: true
            }
          ]
        }
      ],
      quiz: {
        title: `แบบทดสอบประเมินสมรรถนะ: ${newCourseForm.title.trim()}`,
        passingScorePercent: 80,
        timeLimitMinutes: 10,
        attemptLimit: 3,
        shuffleQuestions: true,
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            question: 'เป้าหมายหลักในการพัฒนาทักษะนี้เพื่ออะไร?',
            options: [
              'เพื่อสร้างต้นแบบการเรียนรู้ที่ยั่งยืนและตรงจุด',
              'เพื่อจำแนกปัญหาแบบฉาบฉวย',
              'เพื่อเพิ่มค่าใช้จ่ายโครงการ',
              'ไม่มีข้อใดถูก'
            ],
            correctOptionIndex: 0,
            explanation: 'การออกแบบเพื่อความยั่งยืนและการลงมือปฏิบัติจริงคือหัวใจสำคัญ'
          }
        ]
      },
      assignments: [
        {
          id: `assign-${Date.now()}`,
          courseId: `course-${Date.now()}`,
          title: 'ภาระงานปฏิบัติการ: รายงานผลการประยุกต์ใช้ความรู้',
          description: 'จัดทำรายงานสรุป 1 หน้า อธิบายแนวทางแก้ปัญหาและผลลัพธ์ที่คาดหวัง',
          dueDate: '31 ตุลาคม 2026',
          maxScore: 20,
          allowFileUpload: true
        }
      ]
    };

    onAddCourse(newCourse);
    setShowAddCourseModal(false);
    showToast(`เพิ่มหลักสูตรใหม่ "${newCourse.title}" เรียบร้อยแล้ว`);
  };

  // Save Course Edit Handler
  const handleSaveCourseEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    onUpdateCourse(editingCourse);
    setEditingCourse(null);
    showToast(`อัปเดตข้อมูล โครงสร้างบทเรียน และราคาหลักสูตร "${editingCourse.title}" สำเร็จแล้ว`);
  };

  // Quick Price Switch on Course
  const handleQuickTogglePrice = (course: Course) => {
    const updated: Course = {
      ...course,
      isFree: !course.isFree,
      price: !course.isFree ? undefined : 390
    };
    onUpdateCourse(updated);
    showToast(`ปรับสถานะราคาของ "${course.title}" เป็น ${updated.isFree ? 'ฟรี' : '฿390'}`);
  };

  // Update Membership Plan Price
  const handleUpdatePlanPrice = (planId: string, newPrice: number) => {
    setMembershipPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, price: newPrice };
      }
      return p;
    }));
    showToast(`อัปเดตราคาแพ็กเกจสมาชิกเรียบร้อยแล้ว`);
  };

  // --- Curriculum Structure Helpers ---
  const handleMoveModule = (moduleIndex: number, direction: 'up' | 'down') => {
    if (!editingCourse) return;
    const mods = [...editingCourse.modules];
    const targetIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
    if (targetIndex < 0 || targetIndex >= mods.length) return;
    const temp = mods[moduleIndex];
    mods[moduleIndex] = mods[targetIndex];
    mods[targetIndex] = temp;
    setEditingCourse({ ...editingCourse, modules: mods });
  };

  const handleAddModule = () => {
    if (!editingCourse) return;
    const newMod = {
      id: `m-${Date.now()}`,
      title: `บทที่ ${editingCourse.modules.length + 1}: หัวข้อใหม่`,
      lessons: [
        {
          id: `l-${Date.now()}`,
          title: 'บทเรียนใหม่',
          durationMinutes: 20,
          requiresVideoCompletion: true,
          isLocked: false
        }
      ]
    };
    setEditingCourse({ ...editingCourse, modules: [...editingCourse.modules, newMod] });
  };

  const handleDeleteModule = (moduleIndex: number) => {
    if (!editingCourse) return;
    const mods = editingCourse.modules.filter((_, idx) => idx !== moduleIndex);
    setEditingCourse({ ...editingCourse, modules: mods });
  };

  const handleMoveLesson = (moduleIndex: number, lessonIndex: number, direction: 'up' | 'down') => {
    if (!editingCourse) return;
    const mods = [...editingCourse.modules];
    const lessons = [...mods[moduleIndex].lessons];
    const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;
    const temp = lessons[lessonIndex];
    lessons[lessonIndex] = lessons[targetIndex];
    lessons[targetIndex] = temp;
    mods[moduleIndex] = { ...mods[moduleIndex], lessons };
    setEditingCourse({ ...editingCourse, modules: mods });
  };

  const handleAddLesson = (moduleIndex: number) => {
    if (!editingCourse) return;
    const mods = [...editingCourse.modules];
    const lessons = [...mods[moduleIndex].lessons];
    lessons.push({
      id: `l-${Date.now()}`,
      title: `หัวข้อย่อย ${lessons.length + 1}`,
      durationMinutes: 25,
      requiresVideoCompletion: true,
      isLocked: false
    });
    mods[moduleIndex] = { ...mods[moduleIndex], lessons };
    setEditingCourse({ ...editingCourse, modules: mods });
  };

  const handleDeleteLesson = (moduleIndex: number, lessonIndex: number) => {
    if (!editingCourse) return;
    const mods = [...editingCourse.modules];
    mods[moduleIndex] = {
      ...mods[moduleIndex],
      lessons: mods[moduleIndex].lessons.filter((_, idx) => idx !== lessonIndex)
    };
    setEditingCourse({ ...editingCourse, modules: mods });
  };

  const handleLessonDrop = (targetModuleIndex: number, targetLessonIndex: number) => {
    if (!draggedLesson || !editingCourse) return;
    const { moduleIndex: sourceModuleIndex, lessonIndex: sourceLessonIndex } = draggedLesson;
    if (sourceModuleIndex === targetModuleIndex && sourceLessonIndex === targetLessonIndex) return;

    const mods = [...editingCourse.modules];
    const sourceLessons = [...mods[sourceModuleIndex].lessons];
    const [movedLesson] = sourceLessons.splice(sourceLessonIndex, 1);

    if (sourceModuleIndex === targetModuleIndex) {
      sourceLessons.splice(targetLessonIndex, 0, movedLesson);
      mods[sourceModuleIndex] = { ...mods[sourceModuleIndex], lessons: sourceLessons };
    } else {
      const targetLessons = [...mods[targetModuleIndex].lessons];
      targetLessons.splice(targetLessonIndex, 0, movedLesson);
      mods[sourceModuleIndex] = { ...mods[sourceModuleIndex], lessons: sourceLessons };
      mods[targetModuleIndex] = { ...mods[targetModuleIndex], lessons: targetLessons };
    }

    setEditingCourse({ ...editingCourse, modules: mods });
    setDraggedLesson(null);
    showToast(`จัดเรียงลำดับบทเรียนเรียบร้อย (Drag & Drop)`);
  };

  const handleModuleDrop = (targetModuleIndex: number) => {
    if (draggedModule === null || !editingCourse || draggedModule === targetModuleIndex) return;
    const mods = [...editingCourse.modules];
    const [movedModule] = mods.splice(draggedModule, 1);
    mods.splice(targetModuleIndex, 0, movedModule);
    setEditingCourse({ ...editingCourse, modules: mods });
    setDraggedModule(null);
    showToast(`จัดเรียงลำดับบทเรียนใหญ่เรียบร้อย (Drag & Drop)`);
  };

  // --- Quiz Bank Helpers ---
  const handleAddQuizQuestion = () => {
    if (!editingCourse) return;
    const currentQuiz = editingCourse.quiz || {
      title: `แบบทดสอบ: ${editingCourse.title}`,
      passingScorePercent: 80,
      timeLimitMinutes: 10,
      attemptLimit: 3,
      shuffleQuestions: true,
      questions: []
    };
    const newQuestion: QuizQuestion = {
      id: Date.now(),
      type: 'multiple_choice',
      question: 'คำถามข้อใหม่',
      options: ['ตัวเลือก A', 'ตัวเลือก B', 'ตัวเลือก C', 'ตัวเลือก D'],
      correctOptionIndex: 0,
      explanation: 'คำอธิบายเฉลย'
    };
    setEditingCourse({
      ...editingCourse,
      quiz: {
        ...currentQuiz,
        questions: [...currentQuiz.questions, newQuestion]
      }
    });
  };

  const handleDeleteQuizQuestion = (qIndex: number) => {
    if (!editingCourse || !editingCourse.quiz) return;
    const questions = editingCourse.quiz.questions.filter((_, idx) => idx !== qIndex);
    setEditingCourse({
      ...editingCourse,
      quiz: { ...editingCourse.quiz, questions }
    });
  };

  return (
    <div className="space-y-8 font-['Mitr',sans-serif]">
      
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
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>จัดการหลักสูตรและราคา (LMS Course & CMS Management)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            จัดโครงสร้างบทเรียน ล็อคเนื้อหา (Drip Content), คลังข้อสอบ และแบบประเมินราคาหลักสูตร
          </p>
        </div>

        <button
          onClick={() => setShowAddCourseModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-emerald-300" />
          <span>+ เพิ่มหลักสูตรใหม่ (Add Course)</span>
        </button>
      </div>

      {/* Section 1: Course List Table (CRUD) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              รายชื่อหลักสูตรทั้งหมดในระบบ ({courses.length} หลักสูตร)
            </h3>
            <p className="text-xs text-slate-400 font-normal">
              คลิกปุ่ม "แก้ไข" เพื่อจัดการโครงสร้างเนื้อหา บทเรียน ข้อสอบ และราคาอย่างละเอียด
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            มาตรฐาน UDRU E-Learning
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">หลักสูตร</th>
                <th className="py-3.5 px-4">อาจารย์ผู้สอน</th>
                <th className="py-3.5 px-4">หมวดหมู่ / ระดับ</th>
                <th className="py-3.5 px-4 text-center">ชั่วโมง / คลิป</th>
                <th className="py-3.5 px-4 text-center">ราคาหลักสูตร (Pricing)</th>
                <th className="py-3.5 px-4 text-center">ผู้เรียน</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/70 transition">
                  {/* Course Details */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-11 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <p 
                          className="font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer" 
                          onClick={() => {
                            setEditingCourse(JSON.parse(JSON.stringify(course)));
                            setEditTab('basic');
                          }}
                        >
                          {course.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 font-normal mt-0.5">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <span className="font-semibold block">{course.instructor.name}</span>
                        <span className="text-[10px] text-slate-400">{course.instructor.title}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">ระดับ: {course.level}</span>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="font-bold text-slate-800">{course.durationHours} ชม.</span>
                    <span className="text-[10px] text-slate-400 block">{course.lessonsCount} บท</span>
                  </td>

                  {/* Pricing Switcher */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleQuickTogglePrice(course)}
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition cursor-pointer ${
                        course.isFree
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {course.isFree ? '● เรียนฟรี' : `฿${course.price?.toLocaleString()}`}
                    </button>
                  </td>

                  {/* Students count */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {(course.studentsCount || 1200).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingCourse(JSON.parse(JSON.stringify(course)));
                          setEditTab('basic');
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                        title="แก้ไขหลักสูตร"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline">แก้ไข</span>
                      </button>

                      <button
                        onClick={() => setCourseToDelete(course)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                        title="ลบหลักสูตร"
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

      {/* Section 2: Membership Subscription Pricing Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>ระบบจัดการราคาสมาชิก (Membership Subscription Pricing)</span>
            </h3>
            <p className="text-xs text-slate-400 font-normal">
              แก้ไขราคาสมัครสมาชิกประเภทต่างๆ แบบทันที (Real-time Price Update)
            </p>
          </div>
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">
            ปรับราคาได้อิสระ
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-5 border-2 transition relative flex flex-col justify-between ${
                plan.isPopular ? 'border-amber-400 bg-amber-50/30 shadow-md' : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-6 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                  แผนยอดนิยม (MOST POPULAR)
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{plan.name}</h4>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {plan.billingCycle}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">{plan.description}</p>

                {/* Price Edit Input */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 mb-4 space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    แก้ไขราคา (บาท):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900 font-mono">฿</span>
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handleUpdatePlanPrice(plan.id, Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-black font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{plan.periodLabel}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-slate-600 text-xs space-y-1.5">
                {plan.features.slice(0, 3).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD NEW COURSE */}
      {/* ======================================================== */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-800">
            <button
              onClick={() => setShowAddCourseModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">เพิ่มหลักสูตรใหม่ (Add Course)</h3>
                <p className="text-xs text-slate-500">กรอกข้อมูลเบื้องต้นและกำหนดราคาหลักสูตร</p>
              </div>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">ชื่อหลักสูตร *</label>
                <input
                  type="text"
                  required
                  value={newCourseForm.title}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                  placeholder="เช่น การออกแบบนวัตกรรมสังคมเพื่อการพัฒนาเชิงพื้นที่"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">หมวดหมู่</label>
                  <select
                    value={newCourseForm.category}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="นวัตกรรมชุมชน">นวัตกรรมชุมชน</option>
                    <option value="ทักษะดิจิทัล & AI">ทักษะดิจิทัล & AI</option>
                    <option value="การพัฒนาตนเอง">การพัฒนาตนเอง</option>
                    <option value="ภาวะผู้นำ & การสื่อสาร">ภาวะผู้นำ & การสื่อสาร</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ระดับความยาก</label>
                  <select
                    value={newCourseForm.level}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, level: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="เริ่มต้น">ระดับเริ่มต้น</option>
                    <option value="ปานกลาง">ระดับปานกลาง</option>
                    <option value="ขั้นสูง">ระดับขั้นสูง</option>
                    <option value="ทุกระดับ">ทุกระดับความรู้</option>
                  </select>
                </div>
              </div>

              {/* Price Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">การกำหนดราคาหลักสูตร (Pricing Model):</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="isFree"
                      checked={newCourseForm.isFree}
                      onChange={() => setNewCourseForm({ ...newCourseForm, isFree: true })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-700">หลักสูตรเรียนฟรี (Free)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="isFree"
                      checked={!newCourseForm.isFree}
                      onChange={() => setNewCourseForm({ ...newCourseForm, isFree: false })}
                      className="text-slate-900 focus:ring-emerald-500"
                    />
                    <span>มีค่าใช้จ่าย (Paid)</span>
                  </label>
                </div>

                {!newCourseForm.isFree && (
                  <div className="pt-2 flex items-center gap-3">
                    <label className="text-slate-700 font-semibold shrink-0">ระบุราคา (บาท):</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newCourseForm.price}
                      onChange={(e) => setNewCourseForm({ ...newCourseForm, price: Number(e.target.value) })}
                      className="w-40 p-2 bg-white border border-slate-300 rounded-xl font-bold font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">คำอธิบายสั้นๆ (Description)</label>
                <textarea
                  rows={2}
                  value={newCourseForm.description}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, description: e.target.value })}
                  placeholder="สรุปเนื้อหาคอร์สสั้นๆ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition cursor-pointer shadow-sm"
                >
                  สร้างหลักสูตรและเปิดสอน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: FULL COURSE CMS & CURRICULUM EDITOR */}
      {/* ======================================================== */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-800 flex flex-col">
            
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">แก้ไขหลักสูตร & โครงสร้าง CMS</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{editingCourse.title}</p>
              </div>
            </div>

            {/* Sub-nav tabs for editing */}
            <div className="flex items-center gap-2 mb-5 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setEditTab('basic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  editTab === 'basic' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>ข้อมูล & ราคา</span>
              </button>

              <button
                type="button"
                onClick={() => setEditTab('curriculum')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  editTab === 'curriculum' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>โครงสร้างบทเรียน & Drip Content ({editingCourse.modules.length} บท)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditTab('quiz')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  editTab === 'quiz' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>คลังข้อสอบ & เกณฑ์ผ่าน ({editingCourse.quiz?.questions.length || 0} ข้อ)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditTab('assignment')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  editTab === 'assignment' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>ภาระงาน (Assignments)</span>
              </button>
            </div>

            <form onSubmit={handleSaveCourseEdit} className="space-y-4 text-xs flex-1">
              
              {/* TAB 1: BASIC INFO & PRICING */}
              {editTab === 'basic' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">ชื่อหลักสูตร *</label>
                    <input
                      type="text"
                      required
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>

                  {/* Pricing Switcher */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 block">ราคาหลักสูตร (Pricing):</span>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold">
                        <input
                          type="radio"
                          name="editIsFree"
                          checked={editingCourse.isFree}
                          onChange={() => setEditingCourse({ ...editingCourse, isFree: true, price: undefined })}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-emerald-700">หลักสูตรเรียนฟรี (Free)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-semibold">
                        <input
                          type="radio"
                          name="editIsFree"
                          checked={!editingCourse.isFree}
                          onChange={() => setEditingCourse({ ...editingCourse, isFree: false, price: editingCourse.price || 390 })}
                          className="text-slate-900 focus:ring-emerald-500"
                        />
                        <span>มีค่าใช้จ่าย (Paid)</span>
                      </label>
                    </div>

                    {!editingCourse.isFree && (
                      <div className="pt-2 flex items-center gap-3">
                        <label className="text-slate-700 font-semibold shrink-0">กำหนดราคา (บาท):</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={editingCourse.price || 390}
                          onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                          className="w-40 p-2 bg-white border border-slate-300 rounded-xl font-bold font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">หมวดหมู่</label>
                      <input
                        type="text"
                        value={editingCourse.category}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">อาจารย์ผู้สอน</label>
                      <input
                        type="text"
                        value={editingCourse.instructor.name}
                        onChange={(e) => setEditingCourse({
                          ...editingCourse,
                          instructor: { ...editingCourse.instructor, name: e.target.value }
                        })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">คำอธิบายฉบับเต็ม</label>
                    <textarea
                      rows={3}
                      value={editingCourse.longDescription}
                      onChange={(e) => setEditingCourse({ ...editingCourse, longDescription: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CURRICULUM, CHAPTERS & DRIP LOCKING */}
              {editTab === 'curriculum' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">จัดการโครงสร้างบทเรียน & Drip Content Locking</h4>
                      <p className="text-[11px] text-slate-400">
                        จัดลำดับบทเรียน (Up / Down) และกำหนดเงื่อนไขการปลดล็อค (ต้องดูวิดีโอจบ หรือต้องสอบผ่าน)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddModule}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ เพิ่มบทใหม่</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingCourse.modules.map((module, mIdx) => (
                      <div key={module.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="font-bold text-slate-500 font-mono text-xs">#{mIdx + 1}</span>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => {
                                const mods = [...editingCourse.modules];
                                mods[mIdx] = { ...mods[mIdx], title: e.target.value };
                                setEditingCourse({ ...editingCourse, modules: mods });
                              }}
                              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveModule(mIdx, 'up')}
                              disabled={mIdx === 0}
                              className="p-1 rounded bg-white border border-slate-200 disabled:opacity-30"
                              title="เลื่อนขึ้น"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveModule(mIdx, 'down')}
                              disabled={mIdx === editingCourse.modules.length - 1}
                              className="p-1 rounded bg-white border border-slate-200 disabled:opacity-30"
                              title="เลื่อนลง"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteModule(mIdx)}
                              className="p-1 rounded bg-rose-50 text-rose-600 border border-rose-200"
                              title="ลบบทนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Lessons inside module */}
                        <div className="space-y-2 pl-4 border-l-2 border-slate-200">
                          {module.lessons.map((lesson, lIdx) => (
                            <div key={lesson.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-[10px] text-slate-400 font-mono">{mIdx + 1}.{lIdx + 1}</span>
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => {
                                      const mods = [...editingCourse.modules];
                                      const lCopy = [...mods[mIdx].lessons];
                                      lCopy[lIdx] = { ...lCopy[lIdx], title: e.target.value };
                                      mods[mIdx] = { ...mods[mIdx], lessons: lCopy };
                                      setEditingCourse({ ...editingCourse, modules: mods });
                                    }}
                                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                  />
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <input
                                    type="number"
                                    value={lesson.durationMinutes}
                                    onChange={(e) => {
                                      const mods = [...editingCourse.modules];
                                      const lCopy = [...mods[mIdx].lessons];
                                      lCopy[lIdx] = { ...lCopy[lIdx], durationMinutes: Number(e.target.value) };
                                      mods[mIdx] = { ...mods[mIdx], lessons: lCopy };
                                      setEditingCourse({ ...editingCourse, modules: mods });
                                    }}
                                    className="w-14 p-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono text-xs"
                                    title="นาที"
                                  />
                                  <span className="text-[10px] text-slate-400">น.</span>
                                  
                                  <button
                                    type="button"
                                    onClick={() => handleMoveLesson(mIdx, lIdx, 'up')}
                                    disabled={lIdx === 0}
                                    className="p-1 rounded bg-slate-50 border border-slate-200 disabled:opacity-30"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveLesson(mIdx, lIdx, 'down')}
                                    disabled={lIdx === module.lessons.length - 1}
                                    className="p-1 rounded bg-slate-50 border border-slate-200 disabled:opacity-30"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLesson(mIdx, lIdx)}
                                    className="p-1 rounded bg-rose-50 text-rose-600 border border-rose-200"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Drip Content & Prerequisites Toggles */}
                              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={lesson.isLocked || false}
                                    onChange={(e) => {
                                      const mods = [...editingCourse.modules];
                                      const lCopy = [...mods[mIdx].lessons];
                                      lCopy[lIdx] = { ...lCopy[lIdx], isLocked: e.target.checked };
                                      mods[mIdx] = { ...mods[mIdx], lessons: lCopy };
                                      setEditingCourse({ ...editingCourse, modules: mods });
                                    }}
                                    className="rounded text-rose-600"
                                  />
                                  <span>🔒 ล็อคเนื้อหา (Locked)</span>
                                </label>

                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={lesson.requiresVideoCompletion !== false}
                                    onChange={(e) => {
                                      const mods = [...editingCourse.modules];
                                      const lCopy = [...mods[mIdx].lessons];
                                      lCopy[lIdx] = { ...lCopy[lIdx], requiresVideoCompletion: e.target.checked };
                                      mods[mIdx] = { ...mods[mIdx], lessons: lCopy };
                                      setEditingCourse({ ...editingCourse, modules: mods });
                                    }}
                                    className="rounded text-emerald-600"
                                  />
                                  <span>▶️ ต้องดูวิดีโอจนจบเพื่อปลดล็อค</span>
                                </label>

                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={lesson.requiresQuizPassed || false}
                                    onChange={(e) => {
                                      const mods = [...editingCourse.modules];
                                      const lCopy = [...mods[mIdx].lessons];
                                      lCopy[lIdx] = { ...lCopy[lIdx], requiresQuizPassed: e.target.checked };
                                      mods[mIdx] = { ...mods[mIdx], lessons: lCopy };
                                      setEditingCourse({ ...editingCourse, modules: mods });
                                    }}
                                    className="rounded text-amber-600"
                                  />
                                  <span>🏆 ต้องสอบผ่าน Quiz ก่อน</span>
                                </label>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddLesson(mIdx)}
                            className="w-full py-1.5 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:text-emerald-700 text-[11px] font-semibold transition"
                          >
                            + เพิ่มบทเรียนย่อยในบทนี้
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: QUIZ & EXAM BANK */}
              {editTab === 'quiz' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">คลังข้อสอบและการตั้งค่าแบบทดสอบ</h4>
                      <p className="text-[11px] text-slate-400">รองรับข้อสอบทั้งแบบปรนัย (ชอยส์) และอัตนัย (บรรยาย) พร้อมระบบสุ่มข้อสอบ</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddQuizQuestion}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ เพิ่มข้อสอบใหม่</span>
                    </button>
                  </div>

                  {editingCourse.quiz && (
                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">เกณฑ์คะแนนผ่าน (%)</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={editingCourse.quiz.passingScorePercent}
                          onChange={(e) => setEditingCourse({
                            ...editingCourse,
                            quiz: { ...editingCourse.quiz!, passingScorePercent: Number(e.target.value) }
                          })}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">เวลาทำข้อสอบ (นาที)</label>
                        <input
                          type="number"
                          min={1}
                          value={editingCourse.quiz.timeLimitMinutes}
                          onChange={(e) => setEditingCourse({
                            ...editingCourse,
                            quiz: { ...editingCourse.quiz!, timeLimitMinutes: Number(e.target.value) }
                          })}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">สิทธิ์สอบสูงสุด (ครั้ง)</label>
                        <input
                          type="number"
                          min={1}
                          value={editingCourse.quiz.attemptLimit || 3}
                          onChange={(e) => setEditingCourse({
                            ...editingCourse,
                            quiz: { ...editingCourse.quiz!, attemptLimit: Number(e.target.value) }
                          })}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold font-mono text-center"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={editingCourse.quiz.shuffleQuestions || false}
                            onChange={(e) => setEditingCourse({
                              ...editingCourse,
                              quiz: { ...editingCourse.quiz!, shuffleQuestions: e.target.checked }
                            })}
                            className="rounded text-amber-600"
                          />
                          <span>🔀 สุ่มคำถาม (Shuffle)</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="space-y-3">
                    {(editingCourse.quiz?.questions || []).map((q, qIdx) => (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs">ข้อ {qIdx + 1}:</span>
                              <select
                                value={q.type || 'multiple_choice'}
                                onChange={(e) => {
                                  const questions = [...(editingCourse.quiz?.questions || [])];
                                  questions[qIdx] = { ...questions[qIdx], type: e.target.value as any };
                                  setEditingCourse({ ...editingCourse, quiz: { ...editingCourse.quiz!, questions } });
                                }}
                                className="p-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                              >
                                <option value="multiple_choice">ปรนัย (4 ตัวเลือก)</option>
                                <option value="open_ended">อัตนัย (บรรยาย)</option>
                              </select>
                            </div>

                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => {
                                const questions = [...(editingCourse.quiz?.questions || [])];
                                questions[qIdx] = { ...questions[qIdx], question: e.target.value };
                                setEditingCourse({ ...editingCourse, quiz: { ...editingCourse.quiz!, questions } });
                              }}
                              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-xs"
                              placeholder="ระบุโจทย์คำถาม..."
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteQuizQuestion(qIdx)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* If Multiple Choice */}
                        {q.type !== 'open_ended' && q.options && (
                          <div className="space-y-1.5 pl-4 border-l-2 border-slate-200">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${q.id}`}
                                  checked={q.correctOptionIndex === optIdx}
                                  onChange={() => {
                                    const questions = [...(editingCourse.quiz?.questions || [])];
                                    questions[qIdx] = { ...questions[qIdx], correctOptionIndex: optIdx };
                                    setEditingCourse({ ...editingCourse, quiz: { ...editingCourse.quiz!, questions } });
                                  }}
                                  className="text-emerald-600"
                                />
                                <span className="font-mono text-xs w-5 font-bold">{String.fromCharCode(65 + optIdx)}:</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const questions = [...(editingCourse.quiz?.questions || [])];
                                    const optCopy = [...(questions[qIdx].options || [])];
                                    optCopy[optIdx] = e.target.value;
                                    questions[qIdx] = { ...questions[qIdx], options: optCopy };
                                    setEditingCourse({ ...editingCourse, quiz: { ...editingCourse.quiz!, questions } });
                                  }}
                                  className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* If Open Ended */}
                        {q.type === 'open_ended' && (
                          <div className="pl-4 border-l-2 border-blue-200 space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 block">แนวคำตอบตัวอย่าง (Sample Answer):</label>
                            <textarea
                              rows={2}
                              value={q.sampleAnswer || ''}
                              onChange={(e) => {
                                const questions = [...(editingCourse.quiz?.questions || [])];
                                questions[qIdx] = { ...questions[qIdx], sampleAnswer: e.target.value };
                                setEditingCourse({ ...editingCourse, quiz: { ...editingCourse.quiz!, questions } });
                              }}
                              placeholder="ระบุแนวคำตอบสำหรับเทียบเคียง..."
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ASSIGNMENTS */}
              {editTab === 'assignment' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">การบ้านและภาระงาน (Course Assignment Portal)</h4>
                      <p className="text-[11px] text-slate-400">กำหนดโจทย์ กำหนดส่ง และสิทธิ์การแนบไฟล์รายงาน</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">หัวข้อภาระงาน</label>
                      <input
                        type="text"
                        value={editingCourse.assignments?.[0]?.title || 'รายงานสรุปผลการแก้ปัญหาเชิงพื้นที่'}
                        onChange={(e) => {
                          const existingAssign = editingCourse.assignments?.[0] || {
                            id: `assign-${editingCourse.id}`,
                            courseId: editingCourse.id,
                            title: '',
                            description: '',
                            maxScore: 20,
                            allowFileUpload: true
                          };
                          setEditingCourse({
                            ...editingCourse,
                            assignments: [{ ...existingAssign, title: e.target.value }]
                          });
                        }}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">คำชี้แจงการส่งงาน</label>
                      <textarea
                        rows={3}
                        value={editingCourse.assignments?.[0]?.description || ''}
                        onChange={(e) => {
                          const existingAssign = editingCourse.assignments?.[0] || {
                            id: `assign-${editingCourse.id}`,
                            courseId: editingCourse.id,
                            title: 'รายงาน',
                            description: '',
                            maxScore: 20,
                            allowFileUpload: true
                          };
                          setEditingCourse({
                            ...editingCourse,
                            assignments: [{ ...existingAssign, description: e.target.value }]
                          });
                        }}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">คะแนนเต็ม</label>
                        <input
                          type="number"
                          value={editingCourse.assignments?.[0]?.maxScore || 20}
                          onChange={(e) => {
                            const existingAssign = editingCourse.assignments?.[0] || {
                              id: `assign-${editingCourse.id}`,
                              courseId: editingCourse.id,
                              title: 'รายงาน',
                              description: '',
                              maxScore: 20,
                              allowFileUpload: true
                            };
                            setEditingCourse({
                              ...editingCourse,
                              assignments: [{ ...existingAssign, maxScore: Number(e.target.value) }]
                            });
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">กำหนดส่ง</label>
                        <input
                          type="text"
                          value={editingCourse.assignments?.[0]?.dueDate || '31 ตุลาคม 2026'}
                          onChange={(e) => {
                            const existingAssign = editingCourse.assignments?.[0] || {
                              id: `assign-${editingCourse.id}`,
                              courseId: editingCourse.id,
                              title: 'รายงาน',
                              description: '',
                              maxScore: 20,
                              allowFileUpload: true
                            };
                            setEditingCourse({
                              ...editingCourse,
                              assignments: [{ ...existingAssign, dueDate: e.target.value }]
                            });
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-slate-400">
                  ระบบบันทึกความคืบหน้าลงใน LocalStorage, Firestore และ Server API อัตโนมัติ
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-slate-950 hover:bg-emerald-600 text-white font-bold transition shadow-sm cursor-pointer"
                  >
                    บันทึกการแก้ไขหลักสูตร
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">ยืนยันการลบหลักสูตร?</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{courseToDelete.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCourse(courseToDelete.id);
                  showToast(`ลบหลักสูตร "${courseToDelete.title}" แล้ว`);
                  setCourseToDelete(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                ลบหลักสูตร
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

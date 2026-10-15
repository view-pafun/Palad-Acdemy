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
  Check, 
  ArrowLeft,
  Video, 
  FileText, 
  HelpCircle, 
  Upload, 
  Layers, 
  Calendar, 
  AlertTriangle,
  Globe,
  Settings,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Eye,
  Search,
  Filter,
  Image as ImageIcon,
  Film,
  Link as LinkIcon,
  Table as TableIcon,
  Mic,
  Gift,
  CheckSquare,
  Tag,
  Code,
  Minus,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  Zap,
  Lock,
  Unlock,
  Radio,
  FileCheck2,
  Copy,
  BarChart2,
  Bookmark
} from 'lucide-react';
import { Course, Quiz, QuizQuestion } from '../../types';

interface CoursePricingTabProps {
  courses: Course[];
  onAddCourse: (newCourse: Course) => void;
  onUpdateCourse: (updatedCourse: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  instructorFilterName?: string;
}

type ManageTab = 'overview' | 'curriculum' | 'participants' | 'settings' | 'engagement';
type StatusFilter = 'published' | 'draft' | 'archived';
type MissionType = 'article' | 'video' | 'quiz';

interface MissionFormState {
  id: string;
  moduleIndex: number;
  lessonIndex: number | null; // null if new
  title: string;
  contentType: MissionType;
  durationMinutes: number;
  contentDetails: string;
  videoUrl: string;
  requiresVideoCompletion: boolean;
  quizData: Quiz;
}

const PRESET_COVERS = [
  {
    name: 'Ice Breaking Card',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    tag: 'กิจกรรมกลุ่ม'
  },
  {
    name: 'การ์ดวิศวกรสังคม',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    tag: 'วิศวกรสังคม'
  },
  {
    name: 'วงล้ออารมณ์ (Emotion Wheel)',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    tag: 'จิตวิทยา'
  },
  {
    name: 'นวัตกรรมสังคมและการแก้ปัญหา',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    tag: 'นวัตกรรม'
  },
  {
    name: 'Life Design & อนาคต',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    tag: 'วางแผนชีวิต'
  },
  {
    name: 'เทคโนโลยีและ AI เพื่อการศึกษา',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    tag: 'AI Tools'
  }
];

export const CoursePricingTab: React.FC<CoursePricingTabProps> = ({
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  // Navigation & Selection State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<ManageTab>('overview');
  
  // List Filter State
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Mission / Content Editor State (Screenshots 3 & 4)
  const [editingMission, setEditingMission] = useState<MissionFormState | null>(null);
  const [activeMissionDropdownModule, setActiveMissionDropdownModule] = useState<number | null>(null);
  const [collapsedModules, setCollapsedModules] = useState<Record<number, boolean>>({});

  // Modals & Feedback
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to get effective course status
  const getCourseStatus = (c: Course): StatusFilter => {
    if (c.status) return c.status;
    return 'published';
  };

  // Filtered courses for Table
  const publishedCourses = courses.filter(c => getCourseStatus(c) === 'published');
  const draftCourses = courses.filter(c => getCourseStatus(c) === 'draft');
  const archivedCourses = courses.filter(c => getCourseStatus(c) === 'archived');

  const currentTabCourses = courses.filter(c => {
    const matchesStatus = getCourseStatus(c) === statusFilter;
    const matchesQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    return matchesStatus && matchesQuery && matchesCategory;
  });

  // Calculate quick stats
  const totalStudents = courses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);
  const paidCourses = courses.filter(c => !c.isFree && c.price);
  const estimatedRevenue = paidCourses.reduce((acc, c) => acc + ((c.price || 0) * (c.studentsCount || 0)), 0);

  // -------------------------------------------------------------
  // Course Creation Handlers
  // -------------------------------------------------------------
  const handleCreateNewBlankCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: 'โปรแกรมกิจกรรมใหม่ (ยังไม่ระบุชื่อ)',
      slug: `activity-${Date.now()}`,
      description: 'คำอธิบายสั้นเกี่ยวกับกิจกรรมการเรียนรู้และเป้าหมายของหลักสูตร',
      longDescription: 'อธิบายรายละเอียดโครงสร้างการเรียนรู้ วัตถุประสงค์ และประโยชน์ที่จะได้รับสำหรับผู้เข้าร่วมอบรม',
      category: 'วิศวกรสังคม UDRU',
      level: 'เริ่มต้น',
      durationHours: 4,
      lessonsCount: 1,
      rating: 5.0,
      studentsCount: 0,
      instructor: {
        name: 'อาจารย์ผู้สอนประจำหลักสูตร',
        title: 'ผู้เชี่ยวชาญการเรียนรู้ มรภ.อุดรธานี',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      badge: 'ฉบับร่างใหม่',
      isFree: true,
      hasCertificate: true,
      status: 'draft',
      scheduleType: 'flexible',
      durationLimitType: 'unlimited',
      createdAt: '15 ต.ค. 2569',
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'ฐานที่ 1: การเรียนรู้และภารกิจเริ่มต้น',
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: 'บทนำ: ทำความเข้าใจภาพรวมและกติกา',
              durationMinutes: 15,
              contentType: 'article',
              contentDetails: 'ยินดีต้อนรับสู่โปรแกรมกิจกรรม ในบทเรียนนี้เราจะมาทำความเข้าใจแนวทางการเรียนรู้และเป้าหมายร่วมกัน',
              isLocked: false
            }
          ]
        }
      ]
    };

    onAddCourse(newCourse);
    setSelectedCourse(newCourse);
    setActiveSubTab('overview');
    showToast('สร้างโครงร่างโปรแกรมกิจกรรมใหม่เรียบร้อยแล้ว');
  };

  const handleCreateAiCourse = () => {
    if (!aiTopicInput.trim()) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      const topic = aiTopicInput.trim();
      const newCourse: Course = {
        id: `course-ai-${Date.now()}`,
        title: topic,
        slug: `ai-${Date.now()}`,
        description: `หลักสูตรและภารกิจการเรียนรู้เชิงปฏิบัติการ: ${topic} ออกแบบด้วยกระบวนการวิศวกรสังคม UDRU`,
        longDescription: `พัฒนาศักยภาพผู้เรียนรอบด้านด้วยเนื้อหาเชิงลึก การลงมือปฏิบัติจริง และการวัดผลประเมินสมรรถนะตามมาตรฐาน มรภ.อุดรธานี`,
        category: 'นวัตกรรมชุมชน',
        level: 'ทุกระดับ',
        durationHours: 6,
        lessonsCount: 3,
        rating: 5.0,
        studentsCount: 0,
        instructor: {
          name: 'ทีมพัฒนาวิศวกรสังคม UDRU',
          title: 'ผู้เชี่ยวชาญการจัดกระบวนการเรียนรู้',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        },
        thumbnail: PRESET_COVERS[Math.floor(Math.random() * PRESET_COVERS.length)].url,
        badge: 'สร้างโดยใช้ AI',
        isFree: true,
        hasCertificate: true,
        status: 'draft',
        scheduleType: 'flexible',
        durationLimitType: 'unlimited',
        createdAt: '15 ต.ค. 2569',
        modules: [
          {
            id: `m-ai-1`,
            title: `ฐานที่ 1: แก่นคิดและกรอบการทำงานของ ${topic}`,
            lessons: [
              {
                id: `l-ai-1`,
                title: `บทความ: ความรู้พื้นฐานและแนวคิดสำคัญ`,
                durationMinutes: 20,
                contentType: 'article',
                contentDetails: `เนื้อหาและคู่มือปฏิบัติการเกี่ยวกับ ${topic} เพื่อให้ผู้เข้าร่วมมีความรู้ความเข้าใจก่อนเริ่มลงมือทำภารกิจจริง`,
                isLocked: false
              },
              {
                id: `l-ai-2`,
                title: `วิดีโอ: กรณีศึกษาและวิธีนำไปปรับใช้จริง`,
                durationMinutes: 25,
                contentType: 'video',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                requiresVideoCompletion: true,
                isLocked: false
              },
              {
                id: `l-ai-3`,
                title: `แบบทดสอบ: ประเมินความเข้าใจเกี่ยวกับ ${topic}`,
                durationMinutes: 15,
                contentType: 'quiz',
                isLocked: false
              }
            ]
          }
        ],
        quiz: {
          title: `แบบทดสอบประเมินสมรรถนะ: ${topic}`,
          passingScorePercent: 80,
          timeLimitMinutes: 15,
          questions: [
            {
              id: 1,
              question: `เป้าหมายหลักในการดำเนินกิจกรรม "${topic}" คือข้อใด?`,
              options: [
                'เพื่อสร้างองค์ความรู้ที่ยั่งยืนและนำไปแก้ปัญหาได้จริง',
                'เพื่อทำตามคำสั่งโดยไม่ต้องมีส่วนร่วม',
                'เพื่อเพิ่มภาระงานในระบบ',
                'ไม่มีข้อใดถูกต้อง'
              ],
              correctOptionIndex: 0,
              explanation: 'หัวใจสำคัญของวิศวกรสังคมคือการเข้าใจปัญหาและสร้างผลลัพธ์ที่ตอบโจทย์อย่างแท้จริง'
            }
          ]
        }
      };

      onAddCourse(newCourse);
      setSelectedCourse(newCourse);
      setIsAiGenerating(false);
      setShowAiModal(false);
      setAiTopicInput('');
      setActiveSubTab('overview');
      showToast(`AI สร้างโครงร่างหลักสูตร "${topic}" สำเร็จแล้ว!`);
    }, 900);
  };

  // -------------------------------------------------------------
  // Course State Updater
  // -------------------------------------------------------------
  const handleSaveCourseChanges = (updated: Course, msg = 'บันทึกการเปลี่ยนแปลงหลักสูตรเรียบร้อยแล้ว') => {
    setSelectedCourse(updated);
    onUpdateCourse(updated);
    showToast(msg);
  };

  const handleTogglePublishStatus = () => {
    if (!selectedCourse) return;
    const nextStatus: StatusFilter = selectedCourse.status === 'published' ? 'draft' : 'published';
    const updated: Course = {
      ...selectedCourse,
      status: nextStatus,
      badge: nextStatus === 'published' ? 'ใช้งานอยู่' : 'ฉบับร่าง'
    };
    handleSaveCourseChanges(updated, `เปลี่ยนสถานะเป็น "${nextStatus === 'published' ? 'เผยแพร่แล้ว (ใช้งานอยู่)' : 'ฉบับร่าง'}" สำเร็จ`);
  };

  // -------------------------------------------------------------
  // Module & Lesson Management (Screenshot 3 & 4)
  // -------------------------------------------------------------
  const toggleModuleCollapse = (index: number) => {
    setCollapsedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddNewModule = () => {
    if (!selectedCourse) return;
    const newMod = {
      id: `mod-${Date.now()}`,
      title: `ฐานที่ ${selectedCourse.modules.length + 1}: ชื่อฐานการเรียนรู้ใหม่`,
      lessons: []
    };
    const updated = {
      ...selectedCourse,
      modules: [...selectedCourse.modules, newMod]
    };
    handleSaveCourseChanges(updated, 'เพิ่มฐานการเรียนรู้ใหม่เรียบร้อยแล้ว');
  };

  const handleDeleteModule = (moduleIndex: number) => {
    if (!selectedCourse) return;
    if (selectedCourse.modules.length <= 1) {
      alert('หลักสูตรต้องมีอย่างน้อย 1 ฐานการเรียนรู้');
      return;
    }
    const filtered = selectedCourse.modules.filter((_, idx) => idx !== moduleIndex);
    const updated = { ...selectedCourse, modules: filtered };
    handleSaveCourseChanges(updated, 'ลบฐานการเรียนรู้เรียบร้อยแล้ว');
  };

  const handleOpenAddMission = (moduleIndex: number, type: MissionType) => {
    setActiveMissionDropdownModule(null);
    setEditingMission({
      id: `lesson-${Date.now()}`,
      moduleIndex,
      lessonIndex: null,
      title: type === 'article' ? 'บทความ: หัวข้อเนื้อหาใหม่' : type === 'video' ? 'วิดีโอ: บรรยายบทเรียนใหม่' : 'แบบทดสอบ: วัดความรู้ประจำฐาน',
      contentType: type,
      durationMinutes: type === 'quiz' ? 15 : 20,
      contentDetails: '',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      requiresVideoCompletion: true,
      quizData: {
        title: 'แบบทดสอบความเข้าใจ',
        passingScorePercent: 80,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'คำถามข้อที่ 1 เกี่ยวกับบทเรียนนี้คืออะไร?',
            options: [
              'ตัวเลือกคำตอบ A (ถูกต้อง)',
              'ตัวเลือกคำตอบ B',
              'ตัวเลือกคำตอบ C',
              'ตัวเลือกคำตอบ D'
            ],
            correctOptionIndex: 0,
            explanation: 'อธิบายเหตุผลของข้อที่ถูกต้อง'
          }
        ]
      }
    });
  };

  const handleOpenEditMission = (moduleIndex: number, lessonIndex: number) => {
    if (!selectedCourse) return;
    const lesson = selectedCourse.modules[moduleIndex].lessons[lessonIndex];
    setEditingMission({
      id: lesson.id,
      moduleIndex,
      lessonIndex,
      title: lesson.title,
      contentType: lesson.contentType || (lesson.videoUrl ? 'video' : 'article'),
      durationMinutes: lesson.durationMinutes || 20,
      contentDetails: lesson.contentDetails || lesson.summary || '',
      videoUrl: lesson.videoUrl || '',
      requiresVideoCompletion: !!lesson.requiresVideoCompletion,
      quizData: lesson.quizData || selectedCourse.quiz || {
        title: `แบบทดสอบ: ${lesson.title}`,
        passingScorePercent: 80,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'คำถามทดสอบความเข้าใจ?',
            options: ['ตัวเลือกที่ 1', 'ตัวเลือกที่ 2', 'ตัวเลือกที่ 3', 'ตัวเลือกที่ 4'],
            correctOptionIndex: 0,
            explanation: 'คำอธิบายเฉลย'
          }
        ]
      }
    });
  };

  const handleSaveMission = () => {
    if (!selectedCourse || !editingMission) return;
    if (!editingMission.title.trim()) {
      alert('กรุณาระบุชื่อภารกิจ');
      return;
    }

    const modules = [...selectedCourse.modules];
    const mod = { ...modules[editingMission.moduleIndex] };
    const lessons = [...mod.lessons];

    const newLessonData = {
      id: editingMission.id,
      title: editingMission.title.trim(),
      durationMinutes: Number(editingMission.durationMinutes) || 15,
      contentType: editingMission.contentType,
      contentDetails: editingMission.contentDetails,
      videoUrl: editingMission.contentType === 'video' ? editingMission.videoUrl : undefined,
      requiresVideoCompletion: editingMission.contentType === 'video' ? editingMission.requiresVideoCompletion : undefined,
      quizData: editingMission.contentType === 'quiz' ? editingMission.quizData : undefined,
      isLocked: false
    };

    if (editingMission.lessonIndex === null) {
      lessons.push(newLessonData);
    } else {
      lessons[editingMission.lessonIndex] = newLessonData;
    }

    mod.lessons = lessons;
    modules[editingMission.moduleIndex] = mod;

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const updated = {
      ...selectedCourse,
      modules,
      lessonsCount: totalLessons
    };

    handleSaveCourseChanges(updated, `บันทึกภารกิจ "${editingMission.title}" เรียบร้อยแล้ว`);
    setEditingMission(null);
  };

  const handleDeleteLesson = (moduleIndex: number, lessonIndex: number) => {
    if (!selectedCourse) return;
    const modules = [...selectedCourse.modules];
    modules[moduleIndex] = {
      ...modules[moduleIndex],
      lessons: modules[moduleIndex].lessons.filter((_, idx) => idx !== lessonIndex)
    };
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const updated = { ...selectedCourse, modules, lessonsCount: totalLessons };
    handleSaveCourseChanges(updated, 'ลบภารกิจเรียบร้อยแล้ว');
  };

  // Import Mission Presets
  const handleImportMissionPreset = (moduleIndex: number) => {
    if (!selectedCourse) return;
    const modules = [...selectedCourse.modules];
    const mod = { ...modules[moduleIndex] };
    mod.lessons = [
      ...mod.lessons,
      {
        id: `l-preset-${Date.now()}-1`,
        title: 'บทความ: คู่มือการจัดกิจกรรมและการตั้งคำถามเปิดใจ',
        durationMinutes: 15,
        contentType: 'article',
        contentDetails: 'การเปิดใจและการสร้างบรรยากาศปลอดภัยในการแลกเปลี่ยนความคิดเห็น เป็นหัวใจสำคัญในการทำความเข้าใจปัญหาชุมชน',
        isLocked: false
      },
      {
        id: `l-preset-${Date.now()}-2`,
        title: 'วิดีโอ: สาธิตขั้นตอนและเทคนิค Facilitator',
        durationMinutes: 20,
        contentType: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        requiresVideoCompletion: true,
        isLocked: false
      },
      {
        id: `l-preset-${Date.now()}-3`,
        title: 'แบบทดสอบ: ประเมินผลความเข้าใจหลังฝึกอบรม',
        durationMinutes: 10,
        contentType: 'quiz',
        isLocked: false
      }
    ];
    modules[moduleIndex] = mod;
    const updated = {
      ...selectedCourse,
      modules,
      lessonsCount: modules.reduce((acc, m) => acc + m.lessons.length, 0)
    };
    handleSaveCourseChanges(updated, 'นำเข้าภารกิจตัวอย่าง (บทความ, วิดีโอ, แบบทดสอบ) สำเร็จ');
  };

  // Insert Rich Tag/Content into textarea
  const handleInsertRichTool = (toolName: string, snippet: string) => {
    if (!editingMission) return;
    setEditingMission({
      ...editingMission,
      contentDetails: (editingMission.contentDetails ? editingMission.contentDetails + '\n\n' : '') + snippet
    });
    showToast(`แทรกเครื่องมือ "${toolName}" ลงในเนื้อหา`);
  };

  // Image Upload Reader (Cover Photo)
  const handleFileUploadCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourse) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleSaveCourseChanges({ ...selectedCourse, thumbnail: result }, 'อัปเดตรูปภาพปกหลักสูตรเรียบร้อยแล้ว');
        setShowCoverPicker(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // VIEW A: COURSE MANAGEMENT DETAIL VIEW (Screenshots 2, 3, 4)
  // =========================================================================
  if (selectedCourse) {
    const isPublished = selectedCourse.status === 'published';
    const isFree = selectedCourse.isFree !== false;
    const isFlexible = selectedCourse.scheduleType !== 'scheduled';
    const isUnlimited = selectedCourse.durationLimitType !== 'limited';

    return (
      <div className="space-y-6 font-['Mitr',sans-serif] animate-in fade-in duration-200">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-700 animate-in slide-in-from-bottom-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Breadcrumb & Page Header (Screenshot 2) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button 
              onClick={() => setSelectedCourse(null)}
              className="hover:text-blue-600 transition flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>โปรแกรมกิจกรรม</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">
              {selectedCourse.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition cursor-pointer"
                title="ย้อนกลับไปหน้ารายการ"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {selectedCourse.title}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isPublished 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-slate-200 text-slate-700 border border-slate-300'
                }`}>
                  {isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                </span>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>ดูตัวอย่าง</span>
              </button>

              <button
                onClick={handleTogglePublishStatus}
                className={`px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
                  isPublished
                    ? 'bg-slate-800 hover:bg-slate-900 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isPublished ? 'บันทึกเป็นฉบับร่าง' : 'เผยแพร่'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs (Screenshot 2) */}
        <div className="border-b border-slate-200 flex items-center gap-1 sm:gap-6 overflow-x-auto text-xs font-bold text-slate-500">
          <button
            onClick={() => { setEditingMission(null); setActiveSubTab('overview'); }}
            className={`py-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'overview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ภาพรวม</span>
          </button>

          <button
            onClick={() => setActiveSubTab('curriculum')}
            className={`py-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'curriculum' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>เนื้อหา</span>
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] flex items-center justify-center font-mono">
              {selectedCourse.modules.reduce((a, m) => a + m.lessons.length, 0)}
            </span>
          </button>

          <button
            onClick={() => { setEditingMission(null); setActiveSubTab('participants'); }}
            className={`py-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'participants' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ผู้เข้าร่วม</span>
            <span className="text-[10px] text-slate-400">({selectedCourse.studentsCount || 0})</span>
          </button>

          <button
            onClick={() => { setEditingMission(null); setActiveSubTab('settings'); }}
            className={`py-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'settings' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>การตั้งค่า</span>
          </button>

          <button
            onClick={() => { setEditingMission(null); setActiveSubTab('engagement'); }}
            className={`py-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'engagement' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>การมีส่วนร่วม</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 1: ภาพรวม (Overview - Screenshot 2)                   */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            {/* Hero Course Card (Matching Screenshot 2) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
                <div className="flex items-center gap-4">
                  {/* Thumbnail with overlay change */}
                  <div 
                    onClick={() => setShowCoverPicker(true)}
                    className="w-24 h-20 sm:w-32 sm:h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative group cursor-pointer shrink-0 shadow-2xs"
                  >
                    <img 
                      src={selectedCourse.thumbnail} 
                      alt={selectedCourse.title}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-bold">
                      <ImageIcon className="w-4 h-4 mr-1" /> เปลี่ยนรูปปก
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {selectedCourse.title}
                    </h2>
                    
                    {/* Badge Meta Row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{isFlexible ? 'ไม่จำกัดเวลา' : 'กำหนดเวลา'}</span>
                      </span>

                      <span className="w-1 h-1 rounded-full bg-slate-300" />

                      <span className="flex items-center gap-1.5 font-medium">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span>สาธารณะ</span>
                      </span>

                      <span className="w-1 h-1 rounded-full bg-slate-300" />

                      <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{isFree ? 'ฟรี' : `฿${selectedCourse.price?.toLocaleString()}`}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSubTab('settings')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>แก้ไขการตั้งค่า</span>
                </button>
              </div>

              {/* Connected Features Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">ฟีเจอร์ที่เชื่อมต่ออยู่ :</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> ระบบอัตโนมัติ
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> ใบประกาศนียบัตร
                </span>
                <button 
                  onClick={() => setActiveSubTab('settings')}
                  className="px-2.5 py-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold transition cursor-pointer"
                >
                  + เพิ่มฟีเจอร์
                </button>
              </div>
            </div>

            {/* Checklist Card (Screenshot 2) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ตั้งค่าโปรแกรมกิจกรรมออนไลน์ของคุณให้เรียบร้อย
                  </h3>
                  <p className="text-xs text-slate-500">ดูขั้นตอนถัดไปเพื่อเตรียมความพร้อมก่อนเปิดให้ผู้เรียนเข้าร่วม</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full w-4/6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">4/6</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {/* Step 1 */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-slate-800 font-medium">สร้างเนื้อหาโปรแกรมของคุณ (เพิ่มบทความ, วิดีโอ, แบบทดสอบ)</span>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('curriculum')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold transition cursor-pointer shrink-0"
                  >
                    เพิ่มเนื้อหา
                  </button>
                </div>

                {/* Step 2 */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-slate-800 font-medium">กำหนดราคาโปรแกรม (เลือกฟรี หรือกำหนดราคาเรียน)</span>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('settings')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold transition cursor-pointer shrink-0"
                  >
                    กำหนดราคา
                  </button>
                </div>

                {/* Step 3 */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-slate-800 font-medium">กำหนดเวลาและระยะเวลาการเข้าร่วมอบรม</span>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('settings')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold transition cursor-pointer shrink-0"
                  >
                    ตั้งเวลา
                  </button>
                </div>

                {/* Step 4 */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-slate-800 font-medium">เปลี่ยนรูปปกคอร์สอบรมให้สวยงามและน่าสนใจ</span>
                  </div>
                  <button
                    onClick={() => setShowCoverPicker(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold transition cursor-pointer shrink-0"
                  >
                    เปลี่ยนรูปปก
                  </button>
                </div>

                {/* Step 5 */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-slate-500 font-medium">เชื่อมต่อช่องทางชำระเงิน (PromptPay / บัตรเครดิต)</span>
                  </div>
                  <button
                    onClick={() => showToast('ระบบเชื่อมต่อกับช่องทางชำระเงินของมหาวิทยาลัยเรียบร้อย')}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer shrink-0"
                  >
                    วิธีการเชื่อมต่อ
                  </button>
                </div>

                {/* Step 6 */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-slate-500 font-medium">ปรับแต่งหน้าเพจโปรแกรมกิจกรรม และตรวจสอบผล</span>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer shrink-0"
                  >
                    ไปที่ Editor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 2: เนื้อหา (Content & Missions - Screenshots 3 & 4)   */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'curriculum' && (
          <div className="space-y-6">
            {/* If currently editing an individual mission (Screenshot 4) */}
            {editingMission ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 animate-in fade-in">
                {/* Header of Mission Editor */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingMission(null)}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                        {editingMission.contentType === 'article' && '📰 ภารกิจประเภท: บทความ (Article)'}
                        {editingMission.contentType === 'video' && '🎥 ภารกิจประเภท: วิดีโอ (Video)'}
                        {editingMission.contentType === 'quiz' && '📝 ภารกิจประเภท: แบบทดสอบ (Quiz)'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {editingMission.lessonIndex === null ? 'สร้างภารกิจใหม่' : 'แก้ไขภารกิจ'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingMission(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveMission}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>บันทึกภารกิจ</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  {/* Mission Title Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      ชื่อภารกิจ / ชื่อบทเรียน *
                    </label>
                    <input
                      type="text"
                      value={editingMission.title}
                      onChange={(e) => setEditingMission({ ...editingMission, title: e.target.value })}
                      placeholder="เช่น บทนำ: การใช้วงล้ออารมณ์เพื่อเปิดใจ"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        ระยะเวลาโดยประมาณ (นาที)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={editingMission.durationMinutes}
                        onChange={(e) => setEditingMission({ ...editingMission, durationMinutes: Number(e.target.value) })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        ประเภทภารกิจ
                      </label>
                      <select
                        value={editingMission.contentType}
                        onChange={(e) => setEditingMission({ ...editingMission, contentType: e.target.value as MissionType })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                      >
                        <option value="article">📰 บทความ (Article)</option>
                        <option value="video">🎥 วิดีโอ (Video)</option>
                        <option value="quiz">📝 แบบทดสอบ (Quiz)</option>
                      </select>
                    </div>
                  </div>

                  {/* VIDEO SPECIFIC INPUTS */}
                  {editingMission.contentType === 'video' && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                      <label className="block text-xs font-bold text-blue-950">
                        URL วิดีโอ (YouTube / Vimeo / MP4 / Loom)
                      </label>
                      <input
                        type="text"
                        value={editingMission.videoUrl}
                        onChange={(e) => setEditingMission({ ...editingMission, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full p-2.5 bg-white border border-blue-200 rounded-xl text-xs font-mono"
                      />

                      <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={editingMission.requiresVideoCompletion}
                          onChange={(e) => setEditingMission({ ...editingMission, requiresVideoCompletion: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>ต้องดูวิดีโอจนจบก่อนจึงจะถือว่าผ่านภารกิจนี้</span>
                      </label>
                    </div>
                  )}

                  {/* QUIZ SPECIFIC INPUTS */}
                  {editingMission.contentType === 'quiz' && (
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-amber-600" />
                          <span>เกณฑ์การประเมินแบบทดสอบ</span>
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-600">คะแนนผ่าน:</span>
                          <input
                            type="number"
                            min={10}
                            max={100}
                            value={editingMission.quizData.passingScorePercent}
                            onChange={(e) => setEditingMission({
                              ...editingMission,
                              quizData: { ...editingMission.quizData, passingScorePercent: Number(e.target.value) }
                            })}
                            className="w-16 p-1 bg-white border border-amber-300 rounded text-center font-bold"
                          />
                          <span className="text-slate-600">%</span>
                        </div>
                      </div>

                      {/* Quiz Questions List */}
                      <div className="space-y-3">
                        <label className="block font-bold text-slate-800 text-xs">
                          ข้อสอบ ({editingMission.quizData.questions.length} ข้อ)
                        </label>
                        {editingMission.quizData.questions.map((q, qIdx) => (
                          <div key={qIdx} className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-800">ข้อที่ {qIdx + 1}</span>
                              {editingMission.quizData.questions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const qs = editingMission.quizData.questions.filter((_, idx) => idx !== qIdx);
                                    setEditingMission({
                                      ...editingMission,
                                      quizData: { ...editingMission.quizData, questions: qs }
                                    });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                                >
                                  ลบข้อนี้
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => {
                                const qs = [...editingMission.quizData.questions];
                                qs[qIdx] = { ...qs[qIdx], question: e.target.value };
                                setEditingMission({
                                  ...editingMission,
                                  quizData: { ...editingMission.quizData, questions: qs }
                                });
                              }}
                              placeholder="ระบุโจทย์คำถาม..."
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                            
                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {(q.options || ['ตัวเลือก 1', 'ตัวเลือก 2', 'ตัวเลือก 3', 'ตัวเลือก 4']).map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-1.5">
                                  <input
                                    type="radio"
                                    name={`correct-${qIdx}`}
                                    checked={q.correctOptionIndex === oIdx}
                                    onChange={() => {
                                      const qs = [...editingMission.quizData.questions];
                                      qs[qIdx] = { ...qs[qIdx], correctOptionIndex: oIdx };
                                      setEditingMission({
                                        ...editingMission,
                                        quizData: { ...editingMission.quizData, questions: qs }
                                      });
                                    }}
                                  />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const qs = [...editingMission.quizData.questions];
                                      const opts = [...(qs[qIdx].options || [])];
                                      opts[oIdx] = e.target.value;
                                      qs[qIdx] = { ...qs[qIdx], options: opts };
                                      setEditingMission({
                                        ...editingMission,
                                        quizData: { ...editingMission.quizData, questions: qs }
                                      });
                                    }}
                                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const newQ: QuizQuestion = {
                              id: editingMission.quizData.questions.length + 1,
                              question: 'คำถามข้อใหม่?',
                              options: ['ตัวเลือก A (ถูก)', 'ตัวเลือก B', 'ตัวเลือก C', 'ตัวเลือก D'],
                              correctOptionIndex: 0,
                              explanation: 'คำอธิบายเฉลย'
                            };
                            setEditingMission({
                              ...editingMission,
                              quizData: {
                                ...editingMission.quizData,
                                questions: [...editingMission.quizData.questions, newQ]
                              }
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition cursor-pointer"
                        >
                          + เพิ่มข้อคำถาม
                        </button>
                      </div>
                    </div>
                  )}

                  {/* RICH WORKSPACE (Matching Screenshot 4) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      เนื้อหาและรายละเอียดวิธีการทำภารกิจ
                    </label>

                    {/* Rich Editor Area */}
                    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
                      <div className="p-4 min-h-[220px]">
                        <textarea
                          rows={8}
                          value={editingMission.contentDetails}
                          onChange={(e) => setEditingMission({ ...editingMission, contentDetails: e.target.value })}
                          placeholder="+ เขียนรายละเอียดวิธีการทำภารกิจนี้ ระบุคำแนะนำ ขั้นตอน และสิ่งที่ผู้เข้าร่วมต้องปฏิบัติ..."
                          className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-y leading-relaxed"
                        />
                      </div>

                      {/* Interactive Bottom Toolbar (Matching Screenshot 4 exactly!) */}
                      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-1 text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('รูปภาพ', '![รูปภาพประกอบ](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80)')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="แทรกรูปภาพ"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('แกลเลอรี', '::: แกลเลอรีภาพกิจกรรม :::')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="แกลเลอรีภาพ"
                        >
                          <Layers className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('เส้นคั่น', '\n---\n')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="เส้นคั่นเนื้อหา"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('กล่องข้อความ/โค้ด', '> 💡 เกร็ดความรู้สำคัญ: ')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="กล่องข้อความ / Quote"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('วิดีโอ', '[ชมวิดีโอคลิกที่นี่](https://www.youtube.com)')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="แทรกวิดีโอ"
                        >
                          <Video className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('ของรางวัล/แต้ม XP', '🎁 รางวัลเมื่อทำภารกิจสำเร็จ: +50 XP & เข็มกลัด')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="ของรางวัล / XP"
                        >
                          <Gift className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('ปฏิทิน', '📅 กำหนดส่งงาน: ภายใน 7 วันหลังเริ่มเรียน')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="ปฏิทิน / กำหนดการ"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('เช็คลิสต์ภารกิจ', '- [ ] ขั้นตอนที่ 1: ลงชื่อเข้าร่วม\n- [ ] ขั้นตอนที่ 2: ดาวน์โหลดการ์ด\n- [ ] ขั้นตอนที่ 3: สรุปผล')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="เช็คลิสต์งาน"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('ป้ายกำกับ', '#วิศวกรสังคม #IceBreaking #UDRU')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="ป้ายกำกับ / Tag"
                        >
                          <Tag className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('โค้ด', '```\n// ตัวอย่างคำสั่ง\n```')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="Code block"
                        >
                          <Code className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('สื่อภาพยนตร์', '🎬 วิดีโอสารคดีชุมชน มรภ.อุดรธานี')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="มีเดีย / ภาพยนตร์"
                        >
                          <Film className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('ลิงก์', '[ดาวน์โหลดเอกสารประกอบ](https://udru.ac.th)')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="แทรกลิงก์"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('ตาราง', '| ขั้นตอน | ผู้รับผิดชอบ | ผลลัพธ์ |\n|---|---|---|\n| 1 | นักศึกษา | สรุปรายงาน |')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="แทรกตาราง"
                        >
                          <TableIcon className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertRichTool('เสียง Audio', '🔊 ฟังพอดแคสต์สรุปบทเรียน (Audio Guide)')}
                          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                          title="ไฟล์เสียง Audio"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Modules List View (Screenshot 3) */
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">เนื้อหา</h3>
                    <p className="text-xs text-slate-500">จัดการฐานการเรียนรู้และภารกิจ (บทความ, วิดีโอ, แบบทดสอบ)</p>
                  </div>

                  <button
                    onClick={handleAddNewModule}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ เพิ่ม</span>
                  </button>
                </div>

                {/* Modules Accordion List */}
                <div className="space-y-4">
                  {selectedCourse.modules.map((module, mIdx) => {
                    const isCollapsed = !!collapsedModules[mIdx];
                    const isDropdownOpen = activeMissionDropdownModule === mIdx;

                    return (
                      <div 
                        key={module.id || mIdx}
                        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-visible"
                      >
                        {/* Module Header Bar (Matching Screenshot 3) */}
                        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-slate-400 font-mono text-xs cursor-grab select-none">
                              ::::
                            </span>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => {
                                const mods = [...selectedCourse.modules];
                                mods[mIdx] = { ...mods[mIdx], title: e.target.value };
                                handleSaveCourseChanges({ ...selectedCourse, modules: mods });
                              }}
                              className="font-bold text-sm text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 px-2 py-1 rounded-lg border border-transparent w-full max-w-lg"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleModuleCollapse(mIdx)}
                              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                            </button>

                            {selectedCourse.modules.length > 1 && (
                              <button
                                onClick={() => handleDeleteModule(mIdx)}
                                className="p-2 rounded-xl hover:bg-rose-50 text-rose-500 transition cursor-pointer"
                                title="ลบฐานนี้"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Collapsible Content Area */}
                        {!isCollapsed && (
                          <div className="p-4 sm:p-6 space-y-4">
                            {/* Mission Action Buttons Row (Screenshot 3) */}
                            <div className="flex flex-wrap items-center gap-3 relative">
                              {/* + เพิ่มภารกิจ Dropdown Button */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setActiveMissionDropdownModule(isDropdownOpen ? null : mIdx)}
                                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs border border-blue-200"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>+ เพิ่มภารกิจ</span>
                                </button>

                                {/* Dropdown Menu (Screenshot 3) */}
                                {isDropdownOpen && (
                                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenAddMission(mIdx, 'article')}
                                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition cursor-pointer"
                                    >
                                      <FileText className="w-4 h-4 text-blue-500" />
                                      <span>บทความ</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenAddMission(mIdx, 'video')}
                                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition cursor-pointer"
                                    >
                                      <Video className="w-4 h-4 text-rose-500" />
                                      <span>วิดีโอ</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenAddMission(mIdx, 'quiz')}
                                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition cursor-pointer"
                                    >
                                      <HelpCircle className="w-4 h-4 text-amber-500" />
                                      <span>แบบทดสอบ</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* นำเข้าข้อมูลภารกิจ Button */}
                              <button
                                type="button"
                                onClick={() => handleImportMissionPreset(mIdx)}
                                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
                              >
                                <Upload className="w-4 h-4 text-slate-500" />
                                <span>นำเข้าข้อมูลภารกิจ</span>
                              </button>
                            </div>

                            {/* Missions List Under This Module */}
                            {module.lessons.length === 0 ? (
                              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-400">
                                ยังไม่มีภารกิจในฐานนี้ คลิก "+ เพิ่มภารกิจ" เพื่อเพิ่มบทความ วิดีโอ หรือแบบทดสอบ
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {module.lessons.map((lesson, lIdx) => {
                                  const cType = lesson.contentType || (lesson.videoUrl ? 'video' : 'article');
                                  return (
                                    <div
                                      key={lesson.id || lIdx}
                                      className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between gap-4 transition group"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="text-slate-300 font-mono text-xs select-none">::::</span>

                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-2xs">
                                          {cType === 'article' && <div className="w-full h-full rounded-xl bg-blue-500 flex items-center justify-center"><FileText className="w-4 h-4" /></div>}
                                          {cType === 'video' && <div className="w-full h-full rounded-xl bg-rose-500 flex items-center justify-center"><Video className="w-4 h-4" /></div>}
                                          {cType === 'quiz' && <div className="w-full h-full rounded-xl bg-amber-500 flex items-center justify-center"><HelpCircle className="w-4 h-4" /></div>}
                                        </div>

                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-xs text-slate-900">{lesson.title}</h4>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-slate-600">
                                              {cType === 'article' ? 'บทความ' : cType === 'video' ? 'วิดีโอ' : 'แบบทดสอบ'}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-slate-400 flex items-center gap-2">
                                            <span>⏱️ {lesson.durationMinutes} นาที</span>
                                            {lesson.requiresVideoCompletion && <span>• ต้องดูจบ</span>}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition">
                                        <button
                                          onClick={() => handleOpenEditMission(mIdx, lIdx)}
                                          className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 shadow-2xs transition cursor-pointer"
                                          title="แก้ไขภารกิจนี้"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          onClick={() => handleDeleteLesson(mIdx, lIdx)}
                                          className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 shadow-2xs transition cursor-pointer"
                                          title="ลบภารกิจนี้"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* + เพิ่มฐาน... Button at Bottom (Screenshot 3) */}
                <button
                  onClick={handleAddNewModule}
                  className="w-full py-4 rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/40 text-slate-600 hover:text-blue-600 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ เพิ่มฐาน...</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 4: การตั้งค่า (Core User Requirements 1 to 5!)       */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-8 animate-in fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900">การตั้งค่าหลักสูตร / โปรแกรมกิจกรรม</h3>
              <p className="text-xs text-slate-500">กำหนดชื่อ, ตารางเวลา, ระยะเวลา, ราคา และเปลี่ยนรูปภาพปกของหลักสูตร</p>
            </div>

            {/* REQUIREMENT 1: ตั้งชื่อหลักสูตร */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">1. ข้อมูลและชื่อหลักสูตร (Course Title & Info)</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    ชื่อหลักสูตร *
                  </label>
                  <input
                    type="text"
                    value={selectedCourse.title}
                    onChange={(e) => handleSaveCourseChanges({ ...selectedCourse, title: e.target.value })}
                    placeholder="เช่น สร้างบทสนทนาด้วย Ice Breaking Card"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">หมวดหมู่</label>
                    <input
                      type="text"
                      value={selectedCourse.category}
                      onChange={(e) => handleSaveCourseChanges({ ...selectedCourse, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">ผู้สอน / วิทยากร</label>
                    <input
                      type="text"
                      value={selectedCourse.instructor.name}
                      onChange={(e) => handleSaveCourseChanges({
                        ...selectedCourse,
                        instructor: { ...selectedCourse.instructor, name: e.target.value }
                      })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">คำอธิบายย่อ</label>
                  <textarea
                    rows={2}
                    value={selectedCourse.description}
                    onChange={(e) => handleSaveCourseChanges({ ...selectedCourse, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* REQUIREMENT 2: กำหนดเวลาที่ผู้เข้าร่วมอบรม (ไม่กำหนดเวลา / กำหนดเวลา) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">2. กำหนดเวลาที่ผู้เข้าร่วมอบรม</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: ไม่กำหนดเวลา */}
                <div 
                  onClick={() => handleSaveCourseChanges({ ...selectedCourse, scheduleType: 'flexible' })}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    isFlexible ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    isFlexible ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {isFlexible && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">ไม่กำหนดเวลา (Self-paced)</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ผู้เข้าร่วมสามารถเริ่มต้นอบรมได้ทันที ฝึกด้วยตนเองตามสะดวกทุกเวลา
                    </p>
                  </div>
                </div>

                {/* Option 2: กำหนดเวลา */}
                <div 
                  onClick={() => handleSaveCourseChanges({ ...selectedCourse, scheduleType: 'scheduled' })}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    !isFlexible ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    !isFlexible ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {!isFlexible && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-xs text-slate-900 block">กำหนดเวลา (Scheduled Session)</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      กำหนดวันเวลาเปิด-ปิดรับสมัคร หรือช่วงเวลาอบรมพร้อมกัน
                    </p>

                    {!isFlexible && (
                      <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-600 font-bold block mb-1">วันที่เริ่มต้น:</label>
                          <input 
                            type="date"
                            value={selectedCourse.scheduleStartDate || '2026-11-01'}
                            onChange={(e) => handleSaveCourseChanges({ ...selectedCourse, scheduleStartDate: e.target.value })}
                            className="w-full p-1.5 bg-white border border-blue-300 rounded-lg text-xs" 
                          />
                        </div>
                        <div>
                          <label className="text-slate-600 font-bold block mb-1">วันที่สิ้นสุด:</label>
                          <input 
                            type="date"
                            value={selectedCourse.scheduleEndDate || '2026-11-30'}
                            onChange={(e) => handleSaveCourseChanges({ ...selectedCourse, scheduleEndDate: e.target.value })}
                            className="w-full p-1.5 bg-white border border-blue-300 rounded-lg text-xs" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* REQUIREMENT 3: กำหนดระยะเวลาการเข้าร่วมอบรม (ไม่จำกัด / จำกัดเวลา) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Clock className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">3. กำหนดระยะเวลาการเข้าร่วมอบรม</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: ไม่จำกัด */}
                <div 
                  onClick={() => handleSaveCourseChanges({ ...selectedCourse, durationLimitType: 'unlimited' })}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    isUnlimited ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    isUnlimited ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {isUnlimited && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">ไม่จำกัด (Anytime Access)</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ผู้เข้าร่วมสามารถเข้าร่วมได้ทุกเมื่อ และเรียนซ้ำได้ตลอดชีพไม่มีวันหมดอายุ
                    </p>
                  </div>
                </div>

                {/* Option 2: จำกัดเวลา */}
                <div 
                  onClick={() => handleSaveCourseChanges({ ...selectedCourse, durationLimitType: 'limited' })}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    !isUnlimited ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    !isUnlimited ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {!isUnlimited && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-xs text-slate-900 block">จำกัดเวลา (Time-Limited Completion)</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ผู้เข้าร่วมจะต้องเข้าร่วมให้เสร็จตามระยะเวลาที่กำหนดหลังลงทะเบียน
                    </p>

                    {!isUnlimited && (
                      <div className="mt-3 pt-3 border-t border-blue-200 flex items-center gap-2 text-xs">
                        <label className="text-slate-700 font-bold shrink-0">ต้องทำให้เสร็จภายใน:</label>
                        <input
                          type="number"
                          min={1}
                          value={selectedCourse.durationLimitDays || 30}
                          onChange={(e) => handleSaveCourseChanges({
                            ...selectedCourse,
                            durationLimitDays: Number(e.target.value)
                          })}
                          className="w-20 p-1.5 bg-white border border-blue-300 rounded-lg text-center font-bold font-mono"
                        />
                        <span className="text-slate-600 font-bold">วัน</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* REQUIREMENT 4: กำหนดราคา (ฟรี / มีค่าใช้จ่าย) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">4. กำหนดราคา (Pricing)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: ฟรี */}
                <div 
                  onClick={() => handleSaveCourseChanges({ ...selectedCourse, isFree: true, price: undefined })}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    isFree ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    isFree ? 'border-emerald-600' : 'border-slate-300'
                  }`}>
                    {isFree && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-emerald-800 block">ฟรี (Free)</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      เปิดให้ผู้เรียน นิสิตนักศึกษา และบุคคลทั่วไปเข้าเรียนได้โดยไม่มีค่าใช้จ่าย
                    </p>
                  </div>
                </div>

                {/* Option 2: มีค่าใช้จ่าย */}
                <div 
                  onClick={() => handleSaveCourseChanges({ ...selectedCourse, isFree: false, price: selectedCourse.price || 390 })}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                    !isFree ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    !isFree ? 'border-blue-600' : 'border-slate-300'
                  }`}>
                    {!isFree && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-xs text-slate-900 block">มีค่าใช้จ่าย (Paid Course)</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      กำหนดราคาค่าลงทะเบียนเข้าร่วมอบรม
                    </p>

                    {!isFree && (
                      <div className="mt-3 pt-3 border-t border-blue-200 flex items-center gap-2 text-xs">
                        <label className="text-slate-700 font-bold shrink-0">ราคา (บาท):</label>
                        <span className="font-mono font-bold text-slate-900">฿</span>
                        <input
                          type="number"
                          min={1}
                          value={selectedCourse.price || 390}
                          onChange={(e) => handleSaveCourseChanges({
                            ...selectedCourse,
                            price: Number(e.target.value)
                          })}
                          className="w-32 p-1.5 bg-white border border-blue-300 rounded-lg font-bold font-mono text-slate-900"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* REQUIREMENT 5: สามารถเปลี่ยนรูปปกคอร์สอบรมได้ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">5. รูปภาพปกคอร์สอบรม (Cover Photo)</h4>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Live Preview */}
                <div className="w-full sm:w-64 h-36 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative shadow-sm shrink-0">
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/70 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                    รูปปกปัจจุบัน
                  </div>
                </div>

                <div className="space-y-3 flex-1 text-xs">
                  <p className="text-slate-600">
                    เปลี่ยนรูปภาพปกคอร์สได้โดยการอัปโหลดไฟล์จากเครื่อง หรือระบุลิงก์รูปภาพ
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>อัปโหลดรูปภาพใหม่</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUploadCover}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowCoverPicker(true)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-slate-600" />
                      <span>เลือกจากภาพสำเร็จรูป</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">หรือระบุ Image URL โดยตรง:</label>
                    <div className="flex items-center gap-2 max-w-md">
                      <input
                        type="text"
                        value={selectedCourse.thumbnail}
                        onChange={(e) => handleSaveCourseChanges({ ...selectedCourse, thumbnail: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 3: ผู้เข้าร่วม (Participants)                         */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'participants' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">ผู้เข้าร่วมอบรม</h3>
                <p className="text-xs text-slate-500">รายชื่อนักศึกษาและผู้ลงทะเบียนในหลักสูตรนี้ ({selectedCourse.studentsCount || 0} คน)</p>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-100">
                  <tr>
                    <th className="py-3 px-4">ผู้เข้าร่วม</th>
                    <th className="py-3 px-4">วันที่ลงทะเบียน</th>
                    <th className="py-3 px-4">ความคืบหน้า</th>
                    <th className="py-3 px-4">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                        ณภ
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">ณภัทร วงศ์เจริญ</span>
                        <span className="text-[11px] text-slate-400">naphat.w@udru.ac.th</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">15 ต.ค. 2569</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-full" />
                        </div>
                        <span className="font-mono text-emerald-600 font-bold">100%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        สำเร็จการอบรม
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                        ศิ
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">ศิริพร บุญเสริม</span>
                        <span className="text-[11px] text-slate-400">siriporn.b@udru.ac.th</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">14 ต.ค. 2569</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-2/3" />
                        </div>
                        <span className="font-mono text-blue-600 font-bold">66%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        กำลังเรียน
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 5: การมีส่วนร่วม (Engagement)                         */}
        {/* ------------------------------------------------------------- */}
        {activeSubTab === 'engagement' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">อัตราการจบหลักสูตร</span>
              <p className="text-2xl font-black text-slate-900 font-mono">87.5%</p>
              <span className="text-[11px] text-emerald-600 font-semibold">สูงกว่าค่าเฉลี่ย 12%</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">คะแนนประเมินเฉลี่ย</span>
              <p className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span>{selectedCourse.rating || 5.0}</span>
              </p>
              <span className="text-[11px] text-slate-500">จากผู้ตอบแบบสอบถาม 120 คน</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">คะแนนแบบทดสอบเฉลี่ย</span>
              <p className="text-2xl font-black text-blue-600 font-mono">88 / 100</p>
              <span className="text-[11px] text-blue-600 font-semibold">เกณฑ์ผ่าน: 80%</span>
            </div>
          </div>
        )}

        {/* COVER PHOTO PICKER MODAL */}
        {showCoverPicker && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>เลือกรูปภาพปกหลักสูตร</span>
                </h3>
                <button 
                  onClick={() => setShowCoverPicker(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">เลือกจากคลังรูปภาพแนะนำ:</span>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                  {PRESET_COVERS.map((preset, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => {
                        handleSaveCourseChanges({ ...selectedCourse, thumbnail: preset.url }, 'เปลี่ยนรูปภาพปกเรียบร้อยแล้ว');
                        setShowCoverPicker(false);
                      }}
                      className="group rounded-xl border border-slate-200 overflow-hidden relative cursor-pointer hover:border-blue-500 transition shadow-2xs"
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-24 object-cover group-hover:scale-105 transition" />
                      <div className="p-1.5 bg-white text-[11px] font-bold text-slate-800 truncate">
                        {preset.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                  + อัปโหลดจากคอมพิวเตอร์
                  <input type="file" accept="image/*" onChange={handleFileUploadCover} className="hidden" />
                </label>
                <button
                  onClick={() => setShowCoverPicker(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW MODAL */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  👁️ มุมมองผู้เรียน (Student Preview)
                </span>
                <button onClick={() => setShowPreviewModal(false)} className="p-1.5 rounded-xl hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden h-48 relative border border-slate-200">
                <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                      {selectedCourse.category}
                    </span>
                    <h3 className="text-lg font-bold">{selectedCourse.title}</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed">{selectedCourse.description}</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">ราคาหลักสูตร</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {isFree ? 'ฟรี' : `฿${selectedCourse.price?.toLocaleString()}`}
                    </span>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                    ลงทะเบียนเรียน
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW B: MAIN COURSES LIST (Matching Screenshot 1)
  // =========================================================================
  return (
    <div className="space-y-6 font-['Mitr',sans-serif] animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-700 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Row (Matching Screenshot 1) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            โปรแกรมกิจกรรมออนไลน์
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            สร้างและโปรโมตโปรแกรมกิจกรรมของคุณ
          </p>
        </div>

        {/* Top Right Buttons (Screenshot 1) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-600 font-bold text-xs border border-blue-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>สร้างโดยใช้ AI</span>
          </button>

          <button
            onClick={handleCreateNewBlankCourse}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ สร้างใหม่</span>
          </button>
        </div>
      </div>

      {/* 2 Promotional / Setup Banner Cards (Screenshot 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4 relative overflow-hidden group">
          <div className="space-y-3 z-10 max-w-[65%]">
            <h3 className="font-bold text-sm text-slate-900">
              เริ่มต้นกับโปรแกรมกิจกรรมออนไลน์
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
              เปลี่ยนความเชี่ยวชาญของคุณให้เป็นโปรแกรมกิจกรรม คอร์สต่าง ๆ และภารกิจท้าทายด้วยเครื่องมือการตลาดและการมีส่วนร่วมที่ทรงพลังของชุมชน
            </p>
            <button
              onClick={handleCreateNewBlankCourse}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              ศึกษาเพิ่มเติม
            </button>
          </div>

          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-purple-100 to-amber-100 p-2 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
            <BookOpen className="w-12 h-12 text-blue-600 opacity-90 group-hover:scale-110 transition duration-300" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4 relative overflow-hidden group">
          <div className="space-y-3 z-10 max-w-[65%]">
            <h3 className="font-bold text-sm text-slate-900">
              กำหนดราคาโปรแกรมกิจกรรม
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
              เลือกวิธีให้ผู้เข้าร่วมชำระเงิน สามารถเปิดให้เรียนฟรีเพื่อขยายชุมชน หรือกำหนดราคาเพื่อสนับสนุนกิจกรรม
            </p>
            <button
              onClick={() => {
                if (courses.length > 0) {
                  setSelectedCourse(courses[0]);
                  setActiveSubTab('settings');
                }
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              กำหนดการตั้งราคา
            </button>
          </div>

          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 p-2 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
            <DollarSign className="w-12 h-12 text-emerald-600 opacity-90 group-hover:scale-110 transition duration-300" />
          </div>
        </div>
      </div>

      {/* Metrics Row (Screenshot 1) */}
      <div className="bg-white rounded-3xl px-6 py-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          <div>
            <span className="text-slate-400 block text-[11px]">รายได้ทั้งหมด</span>
            <span className="text-sm font-black text-slate-900 font-mono">
              ฿{estimatedRevenue.toLocaleString()}
            </span>
          </div>

          <div className="border-l border-slate-100 pl-6 sm:pl-10">
            <span className="text-slate-400 block text-[11px]">ผู้เข้าร่วมใหม่</span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {totalStudents}
            </span>
          </div>

          <div className="border-l border-slate-100 pl-6 sm:pl-10">
            <span className="text-slate-400 block text-[11px]">ผู้เข้าร่วมที่มีส่วนร่วม</span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {courses.filter(c => (c.studentsCount || 0) > 0).length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-700 text-xs focus:outline-none">
            <option>30 วันที่ผ่านมา</option>
            <option>7 วันที่ผ่านมา</option>
            <option>ทั้งหมด</option>
          </select>
          <button 
            onClick={() => showToast('เปิดรายงานสรุปสถิติผู้เรียน')}
            className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            ดูรายงาน
          </button>
        </div>
      </div>

      {/* Status Tabs & Action Filter Bar (Screenshot 1) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('published')}
              className={`py-3 px-1 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'published'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>เผยแพร่แล้ว</span>
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                statusFilter === 'published' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {publishedCourses.length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('draft')}
              className={`py-3 px-1 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'draft'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>ฉบับร่าง</span>
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                statusFilter === 'draft' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {draftCourses.length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('archived')}
              className={`py-3 px-1 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'archived'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>เก็บถาวรแล้ว</span>
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                statusFilter === 'archived' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {archivedCourses.length}
              </span>
            </button>
          </div>

          {/* Search & Filter Buttons */}
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>ตัวกรอง</span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหา..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 w-36 sm:w-48 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Courses Table (Screenshot 1) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-5">โปรแกรมกิจกรรม</th>
                  <th className="py-4 px-4 text-center">ผู้เข้าร่วม</th>
                  <th className="py-4 px-4">ราคา</th>
                  <th className="py-4 px-4">สถานะ</th>
                  <th className="py-4 px-4">วันที่สร้าง</th>
                  <th className="py-4 px-4">ตารางเวลา</th>
                  <th className="py-4 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentTabCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <span>ไม่พบโปรแกรมกิจกรรมในหมวดหมู่นี้</span>
                    </td>
                  </tr>
                ) : (
                  currentTabCourses.map((course) => {
                    const isCourseFree = course.isFree !== false;
                    const isCourseFlexible = course.scheduleType !== 'scheduled';
                    const cStatus = getCourseStatus(course);

                    return (
                      <tr 
                        key={course.id}
                        className="hover:bg-slate-50/70 transition cursor-pointer group"
                        onClick={() => {
                          setSelectedCourse(course);
                          setActiveSubTab('overview');
                        }}
                      >
                        {/* Course Column */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                                {course.title}
                              </h4>
                              <span className="text-[11px] text-slate-400">
                                {course.category} • {course.modules.length} ฐาน
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Participants */}
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                          {course.studentsCount || 0}
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 font-bold">
                          {isCourseFree ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ฟรี
                            </span>
                          ) : (
                            <span className="font-mono text-slate-900">
                              ฿{course.price?.toLocaleString()}
                            </span>
                          )}
                        </td>

                        {/* Status Badge (Matching Screenshot 1) */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            cStatus === 'published'
                              ? 'bg-emerald-600 text-white'
                              : cStatus === 'draft'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {cStatus === 'published' ? 'ใช้งานอยู่' : cStatus === 'draft' ? 'ฉบับร่าง' : 'เก็บถาวร'}
                          </span>
                        </td>

                        {/* Date Created */}
                        <td className="py-4 px-4 text-slate-600 text-[11px]">
                          {course.createdAt || '15 ต.ค. 2569'}
                        </td>

                        {/* Schedule (Matching Screenshot 1) */}
                        <td className="py-4 px-4 text-slate-600 text-[11px]">
                          {isCourseFlexible ? (
                            <span>ฝึกด้วยตนเอง | ไม่กำหนดเวลา</span>
                          ) : (
                            <span>กำหนดเวลา {course.scheduleStartDate || 'เร็วๆ นี้'}</span>
                          )}
                        </td>

                        {/* Action Menu */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setActiveSubTab('curriculum');
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition"
                              title="จัดการเนื้อหา"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setCourseToDelete(course)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                              title="ลบหลักสูตร"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI CREATOR MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>สร้างโปรแกรมกิจกรรมด้วย AI</span>
              </h3>
              <button onClick={() => setShowAiModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                ระบุชื่อเรื่อง ทักษะ หรือประเด็นที่ต้องการจัดกิจกรรม AI จะช่วยสร้างโครงสร้างบทเรียน บทความ วิดีโอ และข้อสอบให้โดยอัตโนมัติ
              </p>

              <div>
                <label className="font-bold text-slate-800 block mb-1">หัวข้อกิจกรรม / หลักสูตร *</label>
                <input
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  placeholder="เช่น การออกแบบเกมเพื่อการศึกษา, ทักษะนักประสานชุมชน"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Sample Topics Pill */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">ตัวอย่าง:</span>
                {['การสื่อสารอย่างเข้าอกเข้าใจ', 'Ice Breaking ขั้นสูง', 'เทคนิค Empathy Interview'].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAiTopicInput(s)}
                    className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2 py-0.5 rounded-md font-medium text-slate-700 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={isAiGenerating || !aiTopicInput.trim()}
                onClick={handleCreateAiCourse}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-xs"
              >
                {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isAiGenerating ? 'กำลังสร้างโครงร่าง...' : 'สร้างทันที'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">ยืนยันการลบหลักสูตร?</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                คุณกำลังจะลบ "{courseToDelete.title}" ออกจากระบบ
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
              <button
                onClick={() => setCourseToDelete(null)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  onDeleteCourse(courseToDelete.id);
                  setCourseToDelete(null);
                  showToast(`ลบหลักสูตร "${courseToDelete.title}" เรียบร้อยแล้ว`);
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

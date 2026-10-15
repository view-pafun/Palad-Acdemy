import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause,
  CheckCircle, 
  Award, 
  Clock, 
  FileText, 
  HelpCircle, 
  RotateCcw, 
  ChevronRight,
  AlertCircle,
  Lock,
  Unlock,
  Upload,
  CheckCircle2,
  ExternalLink,
  Volume2,
  Sparkles,
  Shuffle,
  Gauge,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  Send,
  Headphones,
  FileCode,
  ArrowUp,
  ArrowDown,
  Layers,
  Check,
  Share2
} from 'lucide-react';
import { Course, CertificateData, User, Lesson, QuizQuestion, CourseAssignment, AssignmentSubmission, MediaType } from '../types';

interface CoursePlayerModalProps {
  course: Course;
  currentUser: User | null;
  onClose: () => void;
  onIssueCertificate: (cert: CertificateData) => void;
  onOpenPayment: (course: Course) => void;
}

interface TimestampNote {
  id: string;
  lessonId: string;
  timeSeconds: number;
  timeFormatted: string;
  text: string;
  createdAt: string;
}

interface LessonDiscussion {
  id: string;
  lessonId: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  question: string;
  createdAt: string;
  likes: number;
  replies: {
    id: string;
    userName: string;
    userAvatar: string;
    userRole?: string;
    text: string;
    createdAt: string;
  }[];
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  currentUser,
  onClose,
  onIssueCertificate,
  onOpenPayment,
}) => {
  const isTeacherOrAdmin = currentUser?.role === 'instructor' || currentUser?.role === 'lecturer' || currentUser?.role === 'admin';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'lessons' | 'notes' | 'discussion' | 'quiz' | 'assignments'>('lessons');
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // Editable lesson order state for chapters / topics
  const [modulesState, setModulesState] = useState(() => course.modules);
  const allLessons = modulesState.flatMap((m) => m.lessons);

  // Playback & Video Speed Control (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [currentPlayTimeSec, setCurrentPlayTimeSec] = useState<number>(0);

  // Auto Resume state & toast
  const [autoResumeNotice, setAutoResumeNotice] = useState<string | null>(null);

  // Completed Lessons for Drip Content Locking
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`course_progress_${currentUser?.id || 'anon'}_${course.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['l1'];
  });

  // Instructor Preview Mode (Bypass all locks for inspection)
  const [instructorBypassLocks, setInstructorBypassLocks] = useState(false);

  // Interactive Timestamped Notes
  const [timestampNotes, setTimestampNotes] = useState<TimestampNote[]>(() => {
    try {
      const saved = localStorage.getItem(`course_ts_notes_${currentUser?.id || 'anon'}_${course.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'n-1',
        lessonId: allLessons[0]?.id || 'l1',
        timeSeconds: 45,
        timeFormatted: '00:45',
        text: 'ประเด็นสำคัญ: การระบุผู้มีส่วนได้ส่วนเสียในชุมชน (Stakeholder Mapping)',
        createdAt: 'เมื่อวานนี้'
      },
      {
        id: 'n-2',
        lessonId: allLessons[0]?.id || 'l1',
        timeSeconds: 150,
        timeFormatted: '02:30',
        text: 'แนวทางประยุกต์เครื่องมือ Lean Canvas สำหรับการแก้ปัญหาความยากจนในชนบท',
        createdAt: 'เมื่อวานนี้'
      }
    ];
  });
  const [newNoteText, setNewNoteText] = useState('');

  // Lesson Q&A Discussion Board
  const [discussions, setDiscussions] = useState<LessonDiscussion[]>(() => {
    try {
      const saved = localStorage.getItem(`course_discussions_${course.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'disc-1',
        lessonId: allLessons[0]?.id || 'l1',
        userName: 'พิชญ์สินี มงคลวัฒน์',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        userRole: 'Student',
        question: 'ในกรณีที่ชุมชนไม่ยอมเปิดรับนวัตกรรมใหม่ เราควรมีขั้นตอนในการเข้าหาผู้นำชุมชนอย่างไรก่อนคะ?',
        createdAt: '2 วันที่แล้ว',
        likes: 8,
        replies: [
          {
            id: 'rep-1',
            userName: course.instructor.name,
            userAvatar: course.instructor.avatar,
            userRole: 'Instructor',
            text: 'คำถามดีมากครับ ครูแนะนำให้เริ่มจาก "การฟังเชิงลึก" (Deep Listening) และค้นหา Pain Point ร่วมกันก่อน โดยยังไม่ต้องเสนอสิ่งใหม่ทันทีครับ',
            createdAt: '1 วันที่แล้ว'
          }
        ]
      }
    ];
  });
  const [newQuestionText, setNewQuestionText] = useState('');
  const [replyInputText, setReplyInputText] = useState<Record<string, string>>({});

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string | number, number>>({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Record<string | number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`quiz_passed_${currentUser?.id || 'anon'}_${course.id}`) === 'true';
    } catch {
      return false;
    }
  });
  const [quizAttempts, setQuizAttempts] = useState<number>(1);
  const maxAttempts = course.quiz?.attemptLimit || 3;
  const [timeLeft, setTimeLeft] = useState(course.quiz ? course.quiz.timeLimitMinutes * 60 : 600);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  // Assignment state
  const defaultAssignment: CourseAssignment = course.assignments?.[0] || {
    id: `assign-${course.id}`,
    courseId: course.id,
    title: 'ภาระงานปฏิบัติการ: แผนงานนวัตกรรมแก้ปัญหาเชิงพื้นที่',
    description: 'จัดทำเอกสารข้อเสนอโครงการ 1 หน้า (Lean Canvas) สรุปปัญหาชุมชน กลุ่มเป้าหมาย และโมเดลนวัตกรรมที่บูรณาการศาสตร์ความรู้',
    dueDate: '31 ตุลาคม 2026',
    maxScore: 20,
    allowFileUpload: true
  };

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(`course_assignments_${currentUser?.id || 'anon'}_${course.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: `sub-${Date.now()}`,
        assignmentId: defaultAssignment.id,
        courseId: course.id,
        courseTitle: course.title,
        studentId: currentUser?.studentId || '6514020101',
        studentName: currentUser?.name || 'ณภัทร วงศ์เจริญ',
        studentEmail: currentUser?.email || 'naphat.w@udru.ac.th',
        submittedAt: '28 ก.ย. 2026, 15:40 น.',
        fileName: 'Project_Proposal_UDRU_Community_2026.pdf',
        fileSize: '2.4 MB',
        notes: 'ส่งข้อเสนอโครงงานนวัตกรรมแก้ปัญหาดินเค็มและส่งเสริมเกษตรอินทรีย์ตามที่ได้รับมอบหมายครับ',
        status: 'graded',
        score: 19,
        maxScore: 20,
        instructorFeedback: 'ยอดเยี่ยมมากครับ การวิเคราะห์ Root Cause ครอบคลุม และโมเดลสร้างรายได้ชุมชนมีความเป็นไปได้จริง นำไปต่อยอดโครงการวิจัยได้เลย',
        audioFeedbackUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
        gradedBy: course.instructor.name,
        gradedAt: '29 ก.ย. 2026, 10:15 น.'
      }
    ];
  });

  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [assignmentSuccessToast, setAssignmentSuccessToast] = useState(false);

  // Instructor grading state
  const [gradingScore, setGradingScore] = useState<number>(18);
  const [gradingFeedback, setGradingFeedback] = useState<string>('');

  // Active Lesson
  const currentLesson = allLessons[activeLessonIndex] || allLessons[0];
  const lessonMediaType: MediaType = currentLesson?.mediaType || 'video';

  // Helper format seconds to mm:ss
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Check and hydrate auto-resume timestamp when lesson changes
  useEffect(() => {
    if (!currentLesson) return;
    const key = `resume_time_${currentUser?.id || 'anon'}_${course.id}_${currentLesson.id}`;
    const savedTime = localStorage.getItem(key);
    if (savedTime && Number(savedTime) > 10) {
      const sec = Number(savedTime);
      setCurrentPlayTimeSec(sec);
      const approxDuration = (currentLesson.durationMinutes || 20) * 60;
      setVideoProgress(Math.min(100, Math.round((sec / approxDuration) * 100)));
      setAutoResumeNotice(`ระบบจดจำเวลาเดิม: เล่นต่อจากนาทีที่ ${formatSeconds(sec)}`);
      setTimeout(() => setAutoResumeNotice(null), 4000);
    } else {
      setCurrentPlayTimeSec(0);
      setVideoProgress(completedLessonIds.includes(currentLesson.id) ? 100 : 0);
    }
    setIsPlaying(false);
  }, [activeLessonIndex, course.id, currentLesson?.id]);

  // Video progress simulation ticker with playback speed consideration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && videoProgress < 100) {
      const stepInterval = Math.max(200, Math.round(1000 / playbackSpeed));
      interval = setInterval(() => {
        setCurrentPlayTimeSec((prevSec) => {
          const nextSec = prevSec + 5;
          const totalDuration = (currentLesson?.durationMinutes || 20) * 60;
          const pct = Math.min(100, Math.round((nextSec / totalDuration) * 100));
          setVideoProgress(pct);

          // Save auto-resume bookmark to storage
          try {
            localStorage.setItem(
              `resume_time_${currentUser?.id || 'anon'}_${course.id}_${currentLesson?.id}`,
              String(nextSec)
            );
          } catch {}

          if (pct >= 100) {
            setIsPlaying(false);
            handleMarkCurrentLessonComplete();
          }
          return nextSec;
        });
      }, stepInterval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoProgress, playbackSpeed, currentLesson]);

  // Save progress helper
  const saveCompletedLessons = (list: string[]) => {
    setCompletedLessonIds(list);
    try {
      localStorage.setItem(`course_progress_${currentUser?.id || 'anon'}_${course.id}`, JSON.stringify(list));
    } catch {}
  };

  const handleMarkCurrentLessonComplete = () => {
    if (!currentLesson) return;
    if (!completedLessonIds.includes(currentLesson.id)) {
      const nextList = [...completedLessonIds, currentLesson.id];
      saveCompletedLessons(nextList);
    }
    setVideoProgress(100);
  };

  // Check if a lesson is locked based on prerequisites or drip rules
  const isLessonLocked = (index: number) => {
    if (instructorBypassLocks) return false;
    if (index === 0) return false; // First lesson is always accessible
    const prevLesson = allLessons[index - 1];
    const curLesson = allLessons[index];

    if (curLesson.isLocked) return true;

    if (curLesson.requiresVideoCompletion !== false) {
      if (prevLesson && !completedLessonIds.includes(prevLesson.id)) {
        return true;
      }
    }

    if (curLesson.requiresQuizPassed && !quizPassed) {
      return true;
    }

    return false;
  };

  const handleSelectLesson = (index: number) => {
    if (isLessonLocked(index)) return;
    setActiveLessonIndex(index);
  };

  // Seek video by clicking timestamp note or scrubber
  const handleSeekToTime = (seconds: number) => {
    setCurrentPlayTimeSec(seconds);
    const totalDuration = (currentLesson?.durationMinutes || 20) * 60;
    setVideoProgress(Math.min(100, Math.round((seconds / totalDuration) * 100)));
    setIsPlaying(true);
  };

  // Add Timestamped Note
  const handleAddTimestampNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: TimestampNote = {
      id: `ts-${Date.now()}`,
      lessonId: currentLesson.id,
      timeSeconds: currentPlayTimeSec,
      timeFormatted: formatSeconds(currentPlayTimeSec),
      text: newNoteText.trim(),
      createdAt: 'เมื่อสักครู่'
    };

    const nextList = [newNote, ...timestampNotes];
    setTimestampNotes(nextList);
    try {
      localStorage.setItem(`course_ts_notes_${currentUser?.id || 'anon'}_${course.id}`, JSON.stringify(nextList));
    } catch {}
    setNewNoteText('');
  };

  // Add Discussion Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newDisc: LessonDiscussion = {
      id: `disc-${Date.now()}`,
      lessonId: currentLesson.id,
      userName: currentUser?.name || 'ผู้เรียนรู้ (Student)',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      userRole: currentUser?.role === 'instructor' ? 'Instructor' : 'Student',
      question: newQuestionText.trim(),
      createdAt: 'เมื่อสักครู่',
      likes: 1,
      replies: []
    };

    const nextList = [newDisc, ...discussions];
    setDiscussions(nextList);
    try {
      localStorage.setItem(`course_discussions_${course.id}`, JSON.stringify(nextList));
    } catch {}
    setNewQuestionText('');
  };

  // Reply to discussion
  const handleAddReply = (discussionId: string) => {
    const replyText = replyInputText[discussionId];
    if (!replyText || !replyText.trim()) return;

    const updated = discussions.map((d) => {
      if (d.id === discussionId) {
        return {
          ...d,
          replies: [
            ...d.replies,
            {
              id: `rep-${Date.now()}`,
              userName: currentUser?.name || (isTeacherOrAdmin ? 'อาจารย์ผู้สอน' : 'เพื่อนร่วมชั้น'),
              userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
              userRole: isTeacherOrAdmin ? 'Instructor' : 'Student',
              text: replyText.trim(),
              createdAt: 'เมื่อสักครู่'
            }
          ]
        };
      }
      return d;
    });

    setDiscussions(updated);
    try {
      localStorage.setItem(`course_discussions_${course.id}`, JSON.stringify(updated));
    } catch {}
    setReplyInputText({ ...replyInputText, [discussionId]: '' });
  };

  // Upvote discussion
  const handleLikeDiscussion = (discussionId: string) => {
    const updated = discussions.map((d) => (d.id === discussionId ? { ...d, likes: d.likes + 1 } : d));
    setDiscussions(updated);
  };

  // Reorder lessons (Move Up / Down) for micro-learning management
  const handleMoveLesson = (moduleIndex: number, lessonIndex: number, direction: 'up' | 'down') => {
    const targetModule = { ...modulesState[moduleIndex] };
    const list = [...targetModule.lessons];
    const newIdx = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    if (newIdx < 0 || newIdx >= list.length) return;

    const temp = list[lessonIndex];
    list[lessonIndex] = list[newIdx];
    list[newIdx] = temp;

    targetModule.lessons = list;
    const nextModules = [...modulesState];
    nextModules[moduleIndex] = targetModule;
    setModulesState(nextModules);
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (!course.quiz) return;
    const questionsToGrade = shuffledQuestions.length > 0 ? shuffledQuestions : course.quiz.questions;
    let correctCount = 0;

    questionsToGrade.forEach((q) => {
      if (q.type === 'open_ended') {
        if ((openEndedAnswers[q.id] || '').trim().length >= 5) {
          correctCount++;
        }
      } else {
        if (userAnswers[q.id] === q.correctOptionIndex) {
          correctCount++;
        }
      }
    });

    const scorePercent = Math.round((correctCount / questionsToGrade.length) * 100);
    setQuizScore(scorePercent);
    setQuizSubmitted(true);
    setQuizAttempts((prev) => prev + 1);

    const passing = scorePercent >= (course.quiz.passingScorePercent || 75);
    if (passing) {
      setQuizPassed(true);
      try {
        localStorage.setItem(`quiz_passed_${currentUser?.id || 'anon'}_${course.id}`, 'true');
      } catch {}

      const cert: CertificateData = {
        certificateId: `UDRU-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
        studentName: currentUser?.name || 'ณภัทร วงศ์เจริญ',
        courseTitle: course.title,
        issueDate: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
        gradeScore: scorePercent,
        instructorName: course.instructor.name,
        organization: 'มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)',
        qrVerifyUrl: `https://social-engineers.org/verify/cert?id=UDRU-${course.id}`
      };
      onIssueCertificate(cert);
    }
  };

  // Retake quiz
  const handleRetakeQuiz = () => {
    if (quizAttempts > maxAttempts) return;
    setQuizSubmitted(false);
    setUserAnswers({});
    setOpenEndedAnswers({});
    setTimeLeft(course.quiz ? course.quiz.timeLimitMinutes * 60 : 600);
    if (course.quiz?.shuffleQuestions) {
      const qList = [...course.quiz.questions];
      qList.sort(() => Math.random() - 0.5);
      setShuffledQuestions(qList);
    }
  };

  // Submit Assignment
  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionFileName.trim()) return;

    setIsSubmittingAssignment(true);
    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId: defaultAssignment.id,
      courseId: course.id,
      courseTitle: course.title,
      studentId: currentUser?.studentId || '6514020101',
      studentName: currentUser?.name || 'ณภัทร วงศ์เจริญ',
      studentEmail: currentUser?.email || 'student@udru.ac.th',
      submittedAt: 'ส่งเมื่อสักครู่',
      fileName: submissionFileName.trim(),
      fileSize: '3.1 MB',
      notes: submissionNotes.trim() || 'ส่งรายงานฉบับสมบูรณ์',
      status: 'pending',
      maxScore: defaultAssignment.maxScore,
    };

    const nextSubs = [newSub, ...submissions];
    setSubmissions(nextSubs);
    try {
      localStorage.setItem(`course_assignments_${currentUser?.id || 'anon'}_${course.id}`, JSON.stringify(nextSubs));
    } catch {}

    setTimeout(() => {
      setIsSubmittingAssignment(false);
      setSubmissionFileName('');
      setSubmissionNotes('');
      setAssignmentSuccessToast(true);
      setTimeout(() => setAssignmentSuccessToast(false), 3500);
    }, 450);
  };

  // Grade Assignment
  const handleGradeSubmission = (submissionId: string) => {
    const updated = submissions.map((s) => {
      if (s.id === submissionId) {
        return {
          ...s,
          status: 'graded' as const,
          score: gradingScore,
          instructorFeedback: gradingFeedback || 'ตรวจแล้ว ผลงานเป็นไปตามเกณฑ์มาตรฐาน มีการวิเคราะห์เชิงลึกดีเยี่ยม',
          gradedBy: currentUser?.name || course.instructor.name,
          gradedAt: 'เพิ่งตรวจเสร็จ'
        };
      }
      return s;
    });
    setSubmissions(updated);
    try {
      localStorage.setItem(`course_assignments_${currentUser?.id || 'anon'}_${course.id}`, JSON.stringify(updated));
    } catch {}
    setGradingFeedback('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto font-['Mitr','Prompt',sans-serif]">
      <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col border border-slate-200">
        
        {/* Top Header Bar */}
        <div className="bg-slate-950 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-amber-400/20">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 text-base shadow-xs">
              ⚡
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {course.title}
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  LMS Learning Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                ผู้สอน: {course.instructor.name} · {course.instructor.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Instructor Override Mode Indicator */}
            {isTeacherOrAdmin && (
              <button
                onClick={() => setInstructorBypassLocks(!instructorBypassLocks)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  instructorBypassLocks
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
                title="โหมดผู้สอน: ปลดล็อคบทเรียนทั้งหมดเพื่อตรวจสอบ"
              >
                {instructorBypassLocks ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{instructorBypassLocks ? 'ปลดล็อคบทเรียนแล้ว (ครู)' : 'จำลองโหมดครู'}</span>
              </button>
            )}

            {!course.isFree && (
              <button
                onClick={() => onOpenPayment(course)}
                className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-yellow-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                ชำระค่าลงทะเบียน (฿{course.price?.toLocaleString()})
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="bg-slate-100 px-4 sm:px-6 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs sm:text-sm font-semibold shrink-0 gap-2">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'lessons'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ห้องเรียน & มัลติมีเดีย ({allLessons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <Bookmark className="w-4 h-4 text-slate-900" />
              <span>จดบันทึก Timecode ({timestampNotes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'discussion'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-slate-900" />
              <span>ถาม-ตอบประจำบท (Q&A) ({discussions.length})</span>
            </button>

            {course.quiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                <Award className="w-4 h-4 text-slate-900" />
                <span>แบบทดสอบ & เกียรติบัตร</span>
                {quizPassed && (
                  <span className="text-[10px] bg-slate-950 text-amber-300 font-bold px-1.5 py-0.5 rounded-full">
                    ผ่านแล้ว ✓
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'assignments'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-900" />
              <span>ส่งการบ้าน & ตรวจงาน ({submissions.length})</span>
            </button>
          </div>

          {activeTab === 'quiz' && (
            <div className="flex items-center gap-2 text-xs font-mono bg-amber-100 text-slate-950 px-3 py-1 rounded-full border border-amber-300 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>เวลาที่เหลือ: {Math.floor(timeLeft / 60)}:{(timeLeft % 60 < 10 ? '0' : '')}{timeLeft % 60}</span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* ======================================================== */}
          {/* TAB 1: LESSONS WITH MULTI-MEDIA & SPEED & AUTO-RESUME     */}
          {/* ======================================================== */}
          {activeTab === 'lessons' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Media Player Column */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Auto Resume Toast Alert */}
                {autoResumeNotice && (
                  <div className="p-3 bg-amber-100 border border-amber-300 rounded-2xl text-slate-950 text-xs font-bold flex items-center justify-between gap-2 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{autoResumeNotice}</span>
                    </div>
                    <button
                      onClick={() => handleSeekToTime(0)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 hover:bg-slate-800 text-[11px] font-semibold cursor-pointer"
                    >
                      เริ่มใหม่ตั้งแต่ต้น
                    </button>
                  </div>
                )}

                {/* 1. MEDIA CONTAINER (VIDEO STREAMING / AUDIO PODCAST / PDF SLIDES / LINK) */}
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center text-white border-2 border-slate-900 shadow-xl group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-500 group-hover:scale-105" 
                    style={{ backgroundImage: `url(${course.thumbnail})` }} 
                  />

                  {/* Format: PODCAST / AUDIO */}
                  {lessonMediaType === 'podcast' ? (
                    <div className="relative z-10 text-center p-6 space-y-4 w-full max-w-md">
                      <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                        <Headphones className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                          🎙️ พอดแคสต์เสียงความรู้ (Audio Podcast)
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                          {currentLesson?.title}
                        </h4>
                      </div>

                      {/* Audio waveform visualization */}
                      <div className="flex items-center justify-center gap-1.5 h-10 py-1">
                        {[20, 45, 80, 50, 95, 60, 30, 85, 40, 70, 90, 35].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1.5 bg-amber-400 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'opacity-60'}`}
                            style={{ height: `${isPlaying ? h : 20}%` }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-md transition"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                          <span>{isPlaying ? 'หยุดชั่วคราว' : 'เริ่มเล่นไฟล์เสียง'}</span>
                        </button>
                      </div>
                    </div>
                  ) : lessonMediaType === 'pdf' ? (
                    /* Format: PDF SLIDES VIEWER */
                    <div className="relative z-10 text-center p-6 space-y-3 w-full max-w-md">
                      <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                          📄 เอกสารสไลด์บรรยาย (PDF Presentation)
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                          {currentLesson?.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300">
                        พร้อมสไลด์ประกอบ 45 หน้า ดาวน์โหลดไปศึกษาทบทวนออฟไลน์ได้
                      </p>
                      <button
                        onClick={handleMarkCurrentLessonComplete}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>อ่านจบแล้ว (ทำเครื่องหมายว่าเรียนจบ)</span>
                      </button>
                    </div>
                  ) : (
                    /* Format: VIDEO STREAMING (DEFAULT) */
                    <div className="relative z-10 text-center p-6 space-y-3 w-full max-w-lg">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 hover:bg-yellow-400 text-slate-950 flex items-center justify-center pl-1 shadow-2xl hover:scale-105 transition-transform mx-auto cursor-pointer"
                        title={isPlaying ? 'หยุดชั่วคราว' : 'เริ่มเล่นวิดีโอ'}
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 fill-slate-950" />
                        ) : (
                          <Play className="w-8 h-8 fill-slate-950" />
                        )}
                      </button>
                      <div>
                        <p className="font-extrabold text-base sm:text-xl text-white tracking-tight">
                          {currentLesson?.title || 'บทเรียนออนไลน์'}
                        </p>
                        <p className="text-xs text-slate-300 mt-1">
                          ความยาว {currentLesson?.durationMinutes || 25} นาที · ความคมชัด 1080p Full HD Adaptive
                        </p>
                      </div>

                      {/* Video Scrubber & Playhead Tracker */}
                      <div className="w-full pt-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1 font-mono">
                          <span>{formatSeconds(currentPlayTimeSec)}</span>
                          <span className="font-bold text-amber-300">{videoProgress}% เสร็จสิ้น</span>
                          <span>{formatSeconds((currentLesson?.durationMinutes || 20) * 60)}</span>
                        </div>
                        <div 
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickPct = (e.clientX - rect.left) / rect.width;
                            const total = (currentLesson?.durationMinutes || 20) * 60;
                            handleSeekToTime(Math.round(total * clickPct));
                          }}
                          className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-3 transition-all"
                        >
                          <div 
                            className="h-full bg-amber-400 transition-all duration-300" 
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. PLAYBACK CONTROLS: SPEED SELECTOR (0.5x - 2.0x) & QUICK TIMESTAMP NOTE BUTTON */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  {/* Speed Multiplier Button Group */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mr-1">
                      <Gauge className="w-3.5 h-3.5 text-amber-500" />
                      <span>ความเร็ว:</span>
                    </span>
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                          playbackSpeed === spd
                            ? 'bg-slate-950 text-amber-400 shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Actions: Bookmark current timestamp + Mark completed */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const note: TimestampNote = {
                          id: `ts-${Date.now()}`,
                          lessonId: currentLesson.id,
                          timeSeconds: currentPlayTimeSec,
                          timeFormatted: formatSeconds(currentPlayTimeSec),
                          text: `บันทึกจุดสำคัญประจำบทเรียน (${formatSeconds(currentPlayTimeSec)})`,
                          createdAt: 'เมื่อสักครู่'
                        };
                        setTimestampNotes([note, ...timestampNotes]);
                        setActiveTab('notes');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>จดโน้ตที่ [{formatSeconds(currentPlayTimeSec)}]</span>
                    </button>

                    <button
                      onClick={handleMarkCurrentLessonComplete}
                      disabled={completedLessonIds.includes(currentLesson?.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:cursor-default"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{completedLessonIds.includes(currentLesson?.id) ? 'ดูจบแล้ว ✓' : 'ทำเครื่องหมายว่าดูจบ'}</span>
                    </button>
                  </div>
                </div>

                {/* Lesson Description & Multi-format resource attachments */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      วัตถุประสงค์และสาระสำคัญของบทนี้
                    </h4>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Micro-learning Unit
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {course.longDescription}
                  </p>
                  
                  {/* Downloadable / External Resources Row */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span>เอกสารประกอบและสไลด์บรรยาย (PDF & Worksheets)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href="#download"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('กำลังดาวน์โหลดเอกสารประกอบการเรียนฉบับเต็ม (.pdf)');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>ดาวน์โหลดสไลด์ (.PDF)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Syllabus with Drag & Drop / Reorder Simulation & Drip Locks */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        โครงสร้างบทเรียน (Curriculum)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {isTeacherOrAdmin ? 'โหมดผู้สอน: สลับลำดับหัวข้อได้' : 'ปลดล็อกตามลำดับ (Drip Content)'}
                      </p>
                    </div>
                    <span className="text-xs text-slate-950 font-black bg-amber-400 px-2.5 py-1 rounded-full shadow-2xs font-mono">
                      {completedLessonIds.length}/{allLessons.length} บท
                    </span>
                  </div>

                  {/* Modules Accordion */}
                  <div className="space-y-3">
                    {modulesState.map((module, mIdx) => (
                      <div key={module.id} className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                          <span className="line-clamp-1">{module.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">
                            {module.lessons.length} ตอน
                          </span>
                        </div>
                        
                        <div className="space-y-1.5">
                          {module.lessons.map((lesson, lIdx) => {
                            const lessonIndex = allLessons.findIndex((l) => l.id === lesson.id);
                            const isCurrent = allLessons[activeLessonIndex]?.id === lesson.id;
                            const isLocked = isLessonLocked(lessonIndex);
                            const isCompleted = completedLessonIds.includes(lesson.id);

                            return (
                              <div
                                key={lesson.id}
                                className={`w-full p-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                                  isCurrent
                                    ? 'bg-slate-950 text-white font-bold shadow-xs'
                                    : isLocked
                                    ? 'bg-slate-100 text-slate-400 opacity-70'
                                    : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/60'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectLesson(lessonIndex)}
                                  disabled={isLocked}
                                  className="flex items-center gap-2 min-w-0 pr-2 text-left flex-1 cursor-pointer disabled:cursor-not-allowed"
                                >
                                  {isLocked ? (
                                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  ) : isCompleted ? (
                                    <CheckCircle className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-400' : 'text-slate-900'} shrink-0`} />
                                  ) : (
                                    <Play className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-400' : 'text-slate-400'} shrink-0`} />
                                  )}
                                  <span className="line-clamp-1 truncate">{lesson.title}</span>
                                </button>

                                <div className="shrink-0 flex items-center gap-1.5">
                                  {/* Instructor reorder controls */}
                                  {isTeacherOrAdmin && (
                                    <div className="flex items-center gap-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleMoveLesson(mIdx, lIdx, 'up')}
                                        disabled={lIdx === 0}
                                        title="เลื่อนขึ้น"
                                        className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20 cursor-pointer"
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleMoveLesson(mIdx, lIdx, 'down')}
                                        disabled={lIdx === module.lessons.length - 1}
                                        title="เลื่อนลง"
                                        className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20 cursor-pointer"
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}

                                  {isLocked ? (
                                    <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                                      ล็อค
                                    </span>
                                  ) : (
                                    <span className={`text-[10px] font-mono ${isCurrent ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                                      {lesson.durationMinutes} น.
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {course.quiz && (
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="w-full mt-4 py-3 rounded-2xl bg-amber-400 hover:bg-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
                    >
                      <Award className="w-4 h-4" />
                      <span>ไปทำแบบทดสอบเพื่อรับใบประกาศนียบัตร →</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: INTERACTIVE TIMESTAMPTED NOTES                     */}
          {/* ======================================================== */}
          {activeTab === 'notes' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-amber-500" />
                      <span>สมุดจดบันทึกย่อผูกกับ Timecode (Timestamped Notes)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      จดโน้ตแล้วคลิกที่ตัวเลขเวลา เพื่อกระโดดไปยังช่วงวินาทีที่สอนได้ทันที
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-100 text-slate-950 border border-amber-300">
                    เวลาปัจจุบัน: [{formatSeconds(currentPlayTimeSec)}]
                  </span>
                </div>

                <form onSubmit={handleAddTimestampNote} className="space-y-3">
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={`พิมพ์ข้อความบันทึกย่อของคุณ (ระบบจะบันทึกพร้อม Timecode [${formatSeconds(currentPlayTimeSec)}])...`}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-amber-300 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>บันทึกโน้ต ณ เวลา [{formatSeconds(currentPlayTimeSec)}]</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Timestamp Notes List */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-slate-600 uppercase tracking-wider">
                  บันทึกย่อของคุณทั้งหมด ({timestampNotes.length} รายการ)
                </h5>

                {timestampNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-start justify-between gap-4 hover:border-amber-400 transition"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            handleSeekToTime(note.timeSeconds);
                            setActiveTab('lessons');
                          }}
                          className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black font-mono text-xs hover:bg-yellow-400 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="คลิกเพื่อกระโดดไปยังวิดีโอนาทีนี้"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>[{note.timeFormatted}]</span>
                        </button>
                        <span className="text-[11px] text-slate-400">{note.createdAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {note.text}
                      </p>
                    </div>

                    <button
                      onClick={() => setTimestampNotes(timestampNotes.filter((n) => n.id !== note.id))}
                      className="text-slate-300 hover:text-rose-500 transition p-1"
                      title="ลบโน้ตนี้"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: LESSON Q&A DISCUSSION BOARD                       */}
          {/* ======================================================== */}
          {activeTab === 'discussion' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    <span>กระดานถาม-ตอบประจำบทเรียน (Q&A Community)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ตั้งข้อสงสัยเพื่อให้อาจารย์ผู้สอนและเพื่อนร่วมชั้นเข้ามาช่วยตอบและแลกเปลี่ยน
                  </p>
                </div>

                <form onSubmit={handleAddQuestion} className="space-y-3">
                  <textarea
                    rows={3}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="พิมพ์คำถามหรือประเด็นข้อสงสัยของคุณประจำบทนี้..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newQuestionText.trim()}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-yellow-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>โพสต์คำถามใหม่</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Discussions List */}
              <div className="space-y-4">
                {discussions.map((disc) => (
                  <div key={disc.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={disc.userAvatar} alt={disc.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{disc.userName}</span>
                          <span className="text-[10px] text-slate-400 block">{disc.createdAt}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLikeDiscussion(disc.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
                        <span>{disc.likes} มีประโยชน์</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {disc.question}
                    </p>

                    {/* Replies */}
                    {disc.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-amber-300 space-y-2 pt-1">
                        {disc.replies.map((rep) => (
                          <div key={rep.id} className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <span>{rep.userName}</span>
                                {rep.userRole === 'Instructor' && (
                                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                                    อาจารย์ผู้สอน
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{rep.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply Form */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        value={replyInputText[disc.id] || ''}
                        onChange={(e) => setReplyInputText({ ...replyInputText, [disc.id]: e.target.value })}
                        placeholder="พิมพ์ข้อความตอบกลับ..."
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => handleAddReply(disc.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold cursor-pointer"
                      >
                        ตอบกลับ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: QUIZ & ASSESSMENT BANK (MCQ + OPEN-ENDED)         */}
          {/* ======================================================== */}
          {activeTab === 'quiz' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Header Box */}
              <div className="bg-slate-950 rounded-3xl p-6 text-white border-2 border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 font-black text-base sm:text-lg mb-1 text-white">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>{course.quiz?.title || 'แบบทดสอบประเมินสมรรถนะมาตรฐาน'}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    เกณฑ์ผ่าน: ได้คะแนน {course.quiz?.passingScorePercent || 80}% ขึ้นไป · สอบได้สูงสุด {maxAttempts} ครั้ง (ทำไปแล้ว {quizAttempts - 1} ครั้ง)
                  </p>
                </div>

                {course.quiz?.shuffleQuestions && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shrink-0">
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>สุ่มข้อสอบอัตโนมัติ</span>
                  </span>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {(shuffledQuestions.length > 0 ? shuffledQuestions : (course.quiz?.questions || [])).map((q, qIndex) => {
                  const selectedOpt = userAnswers[q.id];
                  const isOpenEnded = q.type === 'open_ended';

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                          ข้อที่ {qIndex + 1}: {q.question}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {isOpenEnded ? 'อัตนัย (บรรยาย)' : 'ปรนัย (ชอยส์)'}
                        </span>
                      </div>

                      {/* Render Multiple Choice */}
                      {!isOpenEnded && q.options && (
                        <div className="space-y-2">
                          {q.options.map((option, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            let optStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                            if (quizSubmitted) {
                              if (optIdx === q.correctOptionIndex) {
                                optStyle = 'border-amber-500 bg-amber-50 text-slate-950 font-bold';
                              } else if (isSelected && optIdx !== q.correctOptionIndex) {
                                optStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                              }
                            } else if (isSelected) {
                              optStyle = 'border-slate-950 bg-amber-100 text-slate-950 font-black shadow-2xs';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  if (quizSubmitted) return;
                                  setUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                }}
                                className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 transition cursor-pointer ${optStyle}`}
                              >
                                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0 font-mono font-bold">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{option}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Render Open-Ended Question Textarea */}
                      {isOpenEnded && (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            disabled={quizSubmitted}
                            value={openEndedAnswers[q.id] || ''}
                            onChange={(e) => setOpenEndedAnswers({ ...openEndedAnswers, [q.id]: e.target.value })}
                            placeholder="พิมพ์คำตอบเชิงวิเคราะห์หรือแนวทางแก้ไขปัญหาของคุณที่นี่..."
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                          />
                          {quizSubmitted && q.sampleAnswer && (
                            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-900">
                              <strong className="block mb-1 text-amber-900">แนวคำตอบตัวอย่าง (Model Answer):</strong>
                              {q.sampleAnswer}
                            </div>
                          )}
                        </div>
                      )}

                      {quizSubmitted && q.explanation && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                          <span className="font-bold text-slate-900">คำอธิบายและเฉลย: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit & Results Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                {quizSubmitted ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div>
                      <p className="text-base font-extrabold text-slate-900">
                        คะแนนที่คุณทำได้: <span className={quizScore >= (course.quiz?.passingScorePercent || 75) ? 'text-amber-600 font-mono text-2xl font-black' : 'text-rose-600 font-mono text-2xl font-black'}>{quizScore}%</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {quizScore >= (course.quiz?.passingScorePercent || 75) 
                          ? '🎉 ยินดีด้วย! คุณผ่านเกณฑ์การประเมิน ระบบออกใบประกาศนียบัตรดิจิทัลพร้อมรหัสตรวจสอบแล้ว' 
                          : 'คะแนนยังไม่ถึงเกณฑ์ที่กำหนด คุณสามารถทบทวนบทเรียนและทำข้อสอบใหม่ได้'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {quizScore >= (course.quiz?.passingScorePercent || 75) ? (
                        <button
                          onClick={() => {
                            const cert: CertificateData = {
                              certificateId: `UDRU-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
                              studentName: currentUser?.name || 'ณภัทร วงศ์เจริญ',
                              courseTitle: course.title,
                              issueDate: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
                              gradeScore: quizScore,
                              instructorName: course.instructor.name,
                              organization: 'มหาวิทยาลัยราชภัฏอุดรธานี (UDRU)',
                              qrVerifyUrl: `https://social-engineers.org/verify`
                            };
                            onIssueCertificate(cert);
                          }}
                          className="px-6 py-3 rounded-2xl bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-black text-xs shadow-md transition cursor-pointer border-0"
                        >
                          ดูใบประกาศนียบัตร (Certificate) 🏆
                        </button>
                      ) : (
                        <button
                          onClick={handleRetakeQuiz}
                          disabled={quizAttempts > maxAttempts}
                          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#000000] hover:text-white text-slate-800 text-xs font-bold cursor-pointer disabled:opacity-50 border-0 transition"
                        >
                          ทำข้อสอบใหม่อีกครั้ง ({quizAttempts}/{maxAttempts})
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length === 0 && Object.keys(openEndedAnswers).length === 0}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FFC800] text-[#000000] hover:bg-[#000000] hover:text-white active:bg-[#000000] active:text-white font-extrabold text-sm shadow-md cursor-pointer transition border-0"
                  >
                    ส่งคำตอบและตรวจผลคะแนนทันที
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: ASSIGNMENT PORTAL & GRADING                       */}
          {/* ======================================================== */}
          {activeTab === 'assignments' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {assignmentSuccessToast && (
                <div className="p-3.5 bg-amber-100 border border-amber-300 rounded-2xl text-slate-950 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>ส่งรายงานและไฟล์การบ้านเรียบร้อยแล้ว! อาจารย์ผู้สอนจะดำเนินการตรวจและให้ข้อเสนอแนะ</span>
                </div>
              )}

              {/* Assignment Brief Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-full shadow-2xs">
                    ภาระงานประจำหลักสูตร (Assignment)
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-bold">
                    กำหนดส่ง: {defaultAssignment.dueDate || '31 ต.ค. 2026'} · คะแนนเต็ม {defaultAssignment.maxScore} คะแนน
                  </span>
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  {defaultAssignment.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {defaultAssignment.description}
                </p>
              </div>

              {/* Upload Submission Form */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>ส่งงาน / แนบไฟล์รายงาน (Submission Portal)</span>
                </h4>

                <form onSubmit={handleSubmitAssignment} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      ชื่อไฟล์ หรือ อัปโหลดเอกสาร (PDF, DOCX, ZIP) *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={submissionFileName}
                        onChange={(e) => setSubmissionFileName(e.target.value)}
                        placeholder="เช่น รายงานนวัตกรรมแก้ปัญหาเชิงพื้นที่_กลุ่ม5.pdf"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setSubmissionFileName(`UDRU_Assignment_${Date.now().toString().slice(-4)}.pdf`)}
                        className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold shrink-0 cursor-pointer"
                      >
                        จำลองแนบไฟล์
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      ข้อความหรือบันทึกเพิ่มเติมถึงอาจารย์ผู้สอน
                    </label>
                    <textarea
                      rows={2}
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      placeholder="สรุปผลงาน หรือประเด็นที่ต้องการให้อาจารย์ช่วยตรวจเป็นพิเศษ..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingAssignment || !submissionFileName.trim()}
                      className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-yellow-400 text-slate-950 font-black transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isSubmittingAssignment ? 'กำลังส่งงาน...' : 'ยืนยันการส่งการบ้าน (Submit Assignment)'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Submissions History & Grading Feedback */}
              <div className="space-y-3.5">
                <h4 className="font-extrabold text-sm text-slate-900">
                  ประวัติการส่งงานและผลการประเมิน ({submissions.length} รายการ)
                </h4>

                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{sub.fileName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">ส่งโดย: {sub.studentName} · {sub.submittedAt}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.status === 'graded' ? (
                          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs font-mono shadow-2xs">
                            คะแนน: {sub.score} / {sub.maxScore} (ผ่าน)
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                            ⏳ รออาจารย์ตรวจ
                          </span>
                        )}
                      </div>
                    </div>

                    {sub.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                        <strong className="text-slate-800">บันทึกของผู้เรียน:</strong> {sub.notes}
                      </p>
                    )}

                    {/* Instructor Feedback Box */}
                    {sub.status === 'graded' && sub.instructorFeedback && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2 text-slate-950">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 flex items-center gap-1.5 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-amber-600" />
                            <span>ข้อเสนอแนะจากอาจารย์ ({sub.gradedBy})</span>
                          </strong>
                          <span className="text-[10px] text-slate-500 font-mono">{sub.gradedAt}</span>
                        </div>
                        <p className="leading-relaxed font-medium">{sub.instructorFeedback}</p>

                        {sub.audioFeedbackUrl && (
                          <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-900 font-bold">
                            <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>ข้อเสนอแนะเสียงจากอาจารย์ (Audio Memo - 0:45 นาที) พร้อมให้ฟัง</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Teacher / Admin Grading Tool */}
                    {isTeacherOrAdmin && sub.status === 'pending' && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 mt-2">
                        <strong className="text-slate-900 block font-bold">ส่วนตรวจการบ้านสำหรับอาจารย์/แอดมิน:</strong>
                        <div className="flex items-center gap-3">
                          <label className="text-slate-700 font-bold">ให้คะแนน (เต็ม {sub.maxScore}):</label>
                          <input
                            type="number"
                            min={0}
                            max={sub.maxScore}
                            value={gradingScore}
                            onChange={(e) => setGradingScore(Number(e.target.value))}
                            className="w-20 p-2 bg-white border border-slate-300 rounded-xl font-black font-mono text-center text-slate-950"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={gradingFeedback}
                          onChange={(e) => setGradingFeedback(e.target.value)}
                          placeholder="พิมพ์ข้อเสนอแนะและการประเมินผลงานนักศึกษา..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                        <button
                          onClick={() => handleGradeSubmission(sub.id)}
                          className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs transition cursor-pointer"
                        >
                          บันทึกผลการตรวจและส่งข้อเสนอแนะ
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

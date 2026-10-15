export type UserRole = 'student' | 'instructor' | 'lecturer' | 'general' | 'admin';

export interface UserEnrollment {
  courseId: string;
  courseTitle?: string;
  enrolledAt: string;
  expiresAt?: string | null;
  accessDurationMonths?: number;
  status: 'active' | 'expired' | 'suspended';
  paymentReference?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  gender?: 'male' | 'female' | 'other';
  studentId?: string;
  institute?: string;
  faculty?: string;
  major?: string;
  organization?: string;
  province?: string;
  status?: 'active' | 'suspended';
  password?: string;
  enrolledCourseIds: string[];
  enrollments?: UserEnrollment[];
  completedCourseIds: string[];
  savedPlansCount: number;
  points: number;
  level: number;
  badges: string[];
  createdAt?: string;
  lastLogin?: string;
}

export type MediaType = 'video' | 'podcast' | 'pdf' | 'link';

export interface LessonResource {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'link' | 'document';
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  mediaType?: MediaType;
  videoUrl?: string;
  audioUrl?: string;
  pdfUrl?: string;
  externalLink?: string;
  summary?: string;
  isLocked?: boolean;
  requiresVideoCompletion?: boolean;
  requiresQuizPassed?: boolean;
  dripType?: 'none' | 'weekly' | 'days_after_enrollment';
  dripWeek?: number;
  dripUnlockDays?: number;
  resources?: LessonResource[];
  order?: number;
  completedByStudent?: boolean;
  watchProgressPercent?: number;
}

export interface QuizQuestion {
  id: number | string;
  type?: 'multiple_choice' | 'open_ended';
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  sampleAnswer?: string;
  explanation?: string;
}

export interface Quiz {
  id?: string;
  title: string;
  passingScorePercent: number;
  timeLimitMinutes: number;
  attemptLimit?: number;
  shuffleQuestions?: boolean;
  questions: QuizQuestion[];
}

export interface CourseAssignment {
  id: string;
  courseId: string;
  chapterId?: string;
  title: string;
  description: string;
  dueDate?: string;
  maxScore: number;
  allowFileUpload: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  courseId: string;
  courseTitle?: string;
  chapterId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  notes?: string;
  status: 'pending' | 'graded';
  score?: number;
  maxScore: number;
  instructorFeedback?: string;
  audioFeedbackUrl?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  order: number;
  isLocked?: boolean;
  dripUnlockDate?: string;
  lessons: Lesson[];
  quiz?: Quiz;
  assignment?: CourseAssignment;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  level: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง' | 'ทุกระดับ';
  durationHours: number;
  lessonsCount: number;
  rating: number;
  studentsCount: number;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  thumbnail: string;
  badge?: string;
  isFree: boolean;
  price?: number;
  hasCertificate: boolean;
  accessDurationMonths?: number; // e.g. 12 = 1 ปี, 0 = ตลอดชีพ
  status?: 'published' | 'draft' | 'archived'; // เผยแพร่แล้ว, ฉบับร่าง, เก็บถาวรแล้ว
  scheduleType?: 'flexible' | 'scheduled'; // ไม่กำหนดเวลา | กำหนดเวลา
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  durationLimitType?: 'unlimited' | 'limited'; // ไม่จำกัด (เข้าร่วมได้ทุกเมื่อ) | จำกัดเวลา (ต้องเสร็จตามระยะเวลาที่กำหนด)
  durationLimitDays?: number; // จำนวนวัน เช่น 30, 60, 90 วัน
  createdAt?: string; // วันที่สร้าง เช่น "15 ต.ค. 2569"
  modules: {
    id: string;
    title: string;
    description?: string;
    lessons: {
      id: string;
      title: string;
      durationMinutes: number;
      contentType?: 'article' | 'video' | 'quiz';
      mediaType?: MediaType;
      videoUrl?: string;
      audioUrl?: string;
      pdfUrl?: string;
      externalLink?: string;
      summary?: string;
      contentDetails?: string; // รายละเอียดวิธีการทำภารกิจ / บทความเนื้อหา
      isLocked?: boolean;
      requiresVideoCompletion?: boolean;
      requiresQuizPassed?: boolean;
      quizData?: Quiz;
      dripType?: 'none' | 'weekly' | 'days_after_enrollment';
      dripWeek?: number;
      dripUnlockDays?: number;
      resources?: LessonResource[];
    }[];
  }[];
  chapters?: Chapter[];
  assignments?: CourseAssignment[];
  quiz?: Quiz;
}

export interface CertificateData {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  gradeScore: number;
  instructorName: string;
  organization: string;
  qrVerifyUrl: string;
}

export interface SharedAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'file';
  url: string;
  downloadsCount: number;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  likes: number;
  sticker?: string;
  isUsed?: boolean;
}

export interface CourseNote {
  id: string;
  userId: string;
  studentName?: string;
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogTopic {
  id: string;
  title: string;
  category: string;
  tags: string[];
  ideasCount: number;
  author: string;
  authorRole: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt?: string;
  coverImage: string;
  content: string;
  likesCount: number;
  isFeatured?: boolean;
  views?: number;
  inspireCount?: number;
  cheerCount?: number;
  comments?: PostComment[];
  attachments?: SharedAttachment[];
  credits?: string;
  status?: 'published' | 'draft';
}

export interface PeerStory {
  id: string;
  title: string;
  authorName: string;
  authorFaculty: string;
  authorYear: string;
  authorAvatar: string;
  careerTrack: string;
  content: string;
  keyTakeaway: string;
  date: string;
  updatedAt?: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  views?: number;
  inspireCount?: number;
  cheerCount?: number;
  comments?: PostComment[];
  attachments?: SharedAttachment[];
  credits?: string;
  coverImage?: string;
  status?: 'published' | 'draft';
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Onsite' | 'Online' | 'Hybrid';
  date: string;
  time: string;
  location: string;
  speaker: string;
  speakerTitle: string;
  seatsTotal: number;
  seatsBooked: number;
  category: string;
  image: string;
  description: string;
  tags: string[];
}

export interface Mentor {
  id: string;
  name: string;
  academicTitle: string;
  expertise: string[];
  department: string;
  avatar: string;
  quote: string;
  rating: number;
  availableDays: string[];
  availableSlots: string[];
}

export interface CounselingBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  studentName: string;
  studentEmail: string;
  date: string;
  timeSlot: string;
  topic: string;
  status: 'confirmed' | 'in_call' | 'completed';
  meetingCode: string;
}

export interface LifePathAssessment {
  // Head: เป้าหมาย
  headGoals: string;
  dreamCareers: string[];
  
  // Arms: ความรู้ ทักษะ
  strongSkills: string[];
  growthSkills: string[];
  
  // Legs: เงื่อนไขและสถานการณ์
  familySituation: string;
  financialCondition: string;
  locationPreference: string;
  
  // Heart: ความชอบ ความเชื่อ
  coreValues: string[];
  passions: string;
  
  // Output
  personalityType?: string;
  personalityDesc?: string;
  recommendedCareers?: {
    title: string;
    matchPercent: number;
    description: string;
    suitableEnvironment: string;
    requiredSkills: string[];
  }[];
  
  // Plans
  planA: {
    title: string;
    steps: string[];
    timeline: string;
  };
  planB: {
    title: string;
    contingencyReason: string;
    steps: string[];
  };
}

export interface PaymentSlip {
  orderId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: 'promptpay' | 'credit_card' | 'slip_upload';
  payerName: string;
  payerPhone: string;
  paidAt: string;
  receiptNumber: string;
}

export interface AdminPermissions {
  canRead: boolean;
  canWrite: boolean;
  canEdit: boolean;
  canDelete: boolean;
  modules: {
    dashboard: boolean;
    admins: boolean;
    posts: boolean;
    knowledgeBase: boolean;
    courses: boolean;
    pricing: boolean;
    landingPage: boolean;
    events: boolean;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'super_admin' | 'sub_admin';
  roleTitle: string;
  avatar: string;
  permissions: AdminPermissions;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

export interface QuizResultRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  faculty: string;
  courseId: string;
  courseTitle: string;
  score: number;
  passingScore: number;
  passed: boolean;
  takenAt: string;
  timeSpent: string;
  details?: {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  originalPrice?: number;
  periodLabel: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  status: 'active' | 'inactive';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  faculty: string;
  level: number;
  levelTitle: string;
  xp: number;
  completedCoursesCount: number;
  badgesCount: number;
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category?: string;
  courseId?: string;
  courseTitle?: string;
  tags?: string[];
  author?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  likes?: number;
  views?: number;
  commentsCount?: number;
  isPinned?: boolean;
  comments?: ForumComment[];
  createdAt: string;
}

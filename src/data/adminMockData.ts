import { AdminUser, QuizResultRecord, MembershipPlan } from '../types';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-super-1',
    username: 'admin',
    name: 'ศ.ดร. อภิสิทธิ์ วชิรเมธากุล (Super Admin)',
    email: 'admin@udru.ac.th',
    role: 'super_admin',
    roleTitle: 'ผู้ดูแลระบบสูงสุด (Super Administrator)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    permissions: {
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: true,
      modules: {
        dashboard: true,
        admins: true,
        posts: true,
        knowledgeBase: true,
        courses: true,
        pricing: true,
        landingPage: true,
        events: true,
      }
    },
    status: 'active',
    createdAt: '2026-01-10 08:30',
    lastLogin: 'วันนี้, 10:24 น.'
  },
  {
    id: 'admin-sub-1',
    username: 'passakorn.edu',
    name: 'ผศ.ดร. ภาสกร เมธาพงศ์ (Sub-Admin)',
    email: 'passakorn.m@udru.ac.th',
    role: 'sub_admin',
    roleTitle: 'ฝ่ายบริหารจัดการหลักสูตรและวิชาการ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    permissions: {
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: false,
      modules: {
        dashboard: true,
        admins: false,
        posts: true,
        knowledgeBase: true,
        courses: true,
        pricing: false,
        landingPage: false,
        events: true,
      }
    },
    status: 'active',
    createdAt: '2026-02-15 11:20',
    lastLogin: 'เมื่อวาน, 16:45 น.'
  },
  {
    id: 'admin-sub-2',
    username: 'wanwisa.c',
    name: 'น.ส. วรรณวิสา ชัยรัตน์ (Sub-Admin)',
    email: 'wanwisa.c@udru.ac.th',
    role: 'sub_admin',
    roleTitle: 'ผู้ประสานงานคอมมูนิตี้และคลังความรู้',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    permissions: {
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: false,
      modules: {
        dashboard: true,
        admins: false,
        posts: true,
        knowledgeBase: true,
        courses: false,
        pricing: false,
        landingPage: true,
        events: true,
      }
    },
    status: 'active',
    createdAt: '2026-03-01 09:00',
    lastLogin: '28 ก.ย. 2026, 14:10 น.'
  },
  {
    id: 'admin-sub-3',
    username: 'teerapat.advisor',
    name: 'ผศ.ดร. ธีรภัทร วัฒนโกศล (Sub-Admin)',
    email: 'teerapat.w@udru.ac.th',
    role: 'sub_admin',
    roleTitle: 'หัวหน้าโครงการพัฒนาทักษะ UDRU',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: {
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: true,
      modules: {
        dashboard: true,
        admins: false,
        posts: true,
        knowledgeBase: true,
        courses: true,
        pricing: true,
        landingPage: true,
        events: true,
      }
    },
    status: 'active',
    createdAt: '2026-01-20 10:00',
    lastLogin: 'วันนี้, 09:12 น.'
  }
];

export const INITIAL_REGISTERED_USERS = [
  {
    id: 'u-1',
    name: 'ณภัทร วงศ์เจริญ',
    studentId: '6514020101',
    email: 'naphat.w@udru.ac.th',
    faculty: 'คณะวิทยาศาสตร์ สาขาสิ่งแวดล้อม',
    avatar: 'https://s.imgz.io/2026/10/01/-2154c895934348119.png',
    registeredDate: '15 ส.ค. 2026',
    status: 'ปกติ (Active)',
    enrolledCount: 4,
    points: 850
  },
  {
    id: 'u-2',
    name: 'กานต์ธิดา โชคประสิทธิ์',
    studentId: '6511030452',
    email: 'kanthida.c@udru.ac.th',
    faculty: 'คณะวิทยาการจัดการ สาขาการตลาด',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    registeredDate: '20 ส.ค. 2026',
    status: 'ปกติ (Active)',
    enrolledCount: 3,
    points: 720
  },
  {
    id: 'u-3',
    name: 'ชัยวัฒน์ เกียรติสกุล',
    studentId: '6412090123',
    email: 'chaiwat.k@udru.ac.th',
    faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    registeredDate: '25 ส.ค. 2026',
    status: 'ปกติ (Active)',
    enrolledCount: 2,
    points: 540
  },
  {
    id: 'u-4',
    name: 'ปรียาภรณ์ บุญศรี',
    studentId: '6615010045',
    email: 'preeyaporn.b@udru.ac.th',
    faculty: 'คณะครุศาสตร์ สาขาการประถมศึกษา',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    registeredDate: '01 ก.ย. 2026',
    status: 'ปกติ (Active)',
    enrolledCount: 5,
    points: 980
  },
  {
    id: 'u-5',
    name: 'ธีรยุทธ พงษ์ศิริ',
    studentId: '6513040089',
    email: 'teerayuth.p@udru.ac.th',
    faculty: 'คณะเทคโนโลยี สาขาเกษตรศาสตร์',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    registeredDate: '10 ก.ย. 2026',
    status: 'ปกติ (Active)',
    enrolledCount: 3,
    points: 690
  },
  {
    id: 'u-6',
    name: 'อรอุมา ศรีสวัสดิ์',
    studentId: '6514020188',
    email: 'onuma.s@udru.ac.th',
    faculty: 'คณะวิทยาศาสตร์ สาขาเคมี',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    registeredDate: '18 ก.ย. 2026',
    status: 'ปกติ (Active)',
    enrolledCount: 2,
    points: 430
  }
];

export const INITIAL_QUIZ_RESULTS: QuizResultRecord[] = [
  {
    id: 'qz-101',
    studentId: '6514020101',
    studentName: 'ณภัทร วงศ์เจริญ',
    studentEmail: 'naphat.w@udru.ac.th',
    faculty: 'คณะวิทยาศาสตร์',
    courseId: 'course-1',
    courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
    score: 95,
    passingScore: 80,
    passed: true,
    takenAt: '28 ก.ย. 2026, 14:32 น.',
    timeSpent: '07:45 นาที',
    details: [
      {
        question: 'แนวคิดการแก้ปัญหาแบบ "เกาให้ถูกที่คัน" ในการพัฒนาชุมชน มีความหมายตรงกับข้อใด?',
        selectedAnswer: 'การวิเคราะห์และเข้าใจรากเหง้าของปัญหาจริงก่อนลงมือทำอย่างตรงจุด',
        correctAnswer: 'การวิเคราะห์และเข้าใจรากเหง้าของปัญหาจริงก่อนลงมือทำอย่างตรงจุด',
        isCorrect: true
      },
      {
        question: 'หัวใจสำคัญของการเรียนรู้แบบข้ามศาสตร์ (Multidisciplinary) คืออะไร?',
        selectedAnswer: 'การนำจุดแข็งและมุมมองของแต่ละคณะมาร่วมต่อยอดแก้ปัญหาที่ซับซ้อน',
        correctAnswer: 'การนำจุดแข็งและมุมมองของแต่ละคณะมาร่วมต่อยอดแก้ปัญหาที่ซับซ้อน',
        isCorrect: true
      },
      {
        question: 'ขั้นตอนใดควรเกิดขึ้นก่อนการระดมทรัพยากรลงสู่ชุมชน?',
        selectedAnswer: 'การทำความเข้าใจบริบทและความต้องการเชิงลึกของคนในพื้นที่ (Empathy)',
        correctAnswer: 'การทำความเข้าใจบริบทและความต้องการเชิงลึกของคนในพื้นที่ (Empathy)',
        isCorrect: true
      },
      {
        question: 'ข้อใดคือตัวอย่างของ "ต้นแบบนวัตกรรมชุมชนที่ยั่งยืน"?',
        selectedAnswer: 'โครงการที่ชุมชนสามารถบริหารจัดการต่อได้เองแม้เสร็จสิ้นโครงการวิจัย',
        correctAnswer: 'โครงการที่ชุมชนสามารถบริหารจัดการต่อได้เองแม้เสร็จสิ้นโครงการวิจัย',
        isCorrect: true
      }
    ]
  },
  {
    id: 'qz-102',
    studentId: '6511030452',
    studentName: 'กานต์ธิดา โชคประสิทธิ์',
    studentEmail: 'kanthida.c@udru.ac.th',
    faculty: 'คณะวิทยาการจัดการ',
    courseId: 'course-2',
    courseTitle: 'AI & Digital Tools for Next-Gen Learning',
    score: 88,
    passingScore: 75,
    passed: true,
    takenAt: '27 ก.ย. 2026, 19:15 น.',
    timeSpent: '08:12 นาที',
    details: [
      {
        question: 'หลักการที่ดีในการเขียนคำสั่ง (Prompt) ให้ AI ทำงานได้แม่นยำคืออะไร?',
        selectedAnswer: 'ระบุบทบาท (Role), บริบท (Context), คำสั่งที่ชัดเจน (Task) และรูปแบบผลลัพธ์ (Format)',
        correctAnswer: 'ระบุบทบาท (Role), บริบท (Context), คำสั่งที่ชัดเจน (Task) และรูปแบบผลลัพธ์ (Format)',
        isCorrect: true
      },
      {
        question: 'ข้อควรระวังสำคัญที่สุดในการนำข้อมูลจาก AI ไปใช้งานทางวิชาการคืออะไร?',
        selectedAnswer: 'ต้องตรวจสอบข้อเท็จจริง (Fact-checking) ป้องกันการเกิดข้อมูลบิดเบือน (Hallucination)',
        correctAnswer: 'ต้องตรวจสอบข้อเท็จจริง (Fact-checking) ป้องกันการเกิดข้อมูลบิดเบือน (Hallucination)',
        isCorrect: true
      }
    ]
  },
  {
    id: 'qz-103',
    studentId: '6412090123',
    studentName: 'ชัยวัฒน์ เกียรติสกุล',
    studentEmail: 'chaiwat.k@udru.ac.th',
    faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
    courseId: 'course-1',
    courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
    score: 65,
    passingScore: 80,
    passed: false,
    takenAt: '25 ก.ย. 2026, 11:04 น.',
    timeSpent: '09:50 นาที',
    details: [
      {
        question: 'แนวคิดการแก้ปัญหาแบบ "เกาให้ถูกที่คัน" ในการพัฒนาชุมชน มีความหมายตรงกับข้อใด?',
        selectedAnswer: 'การแก้ปัญหาเฉพาะหน้าตามที่เกิดข้อร้องเรียน',
        correctAnswer: 'การวิเคราะห์และเข้าใจรากเหง้าของปัญหาจริงก่อนลงมือทำอย่างตรงจุด',
        isCorrect: false
      },
      {
        question: 'หัวใจสำคัญของการเรียนรู้แบบข้ามศาสตร์ (Multidisciplinary) คืออะไร?',
        selectedAnswer: 'การนำจุดแข็งและมุมมองของแต่ละคณะมาร่วมต่อยอดแก้ปัญหาที่ซับซ้อน',
        correctAnswer: 'การนำจุดแข็งและมุมมองของแต่ละคณะมาร่วมต่อยอดแก้ปัญหาที่ซับซ้อน',
        isCorrect: true
      }
    ]
  },
  {
    id: 'qz-104',
    studentId: '6615010045',
    studentName: 'ปรียาภรณ์ บุญศรี',
    studentEmail: 'preeyaporn.b@udru.ac.th',
    faculty: 'คณะครุศาสตร์',
    courseId: 'course-3',
    courseTitle: 'Self-Discovery & Life Design: ถอดรหัสเป้าหมาย',
    score: 92,
    passingScore: 80,
    passed: true,
    takenAt: '24 ก.ย. 2026, 16:40 น.',
    timeSpent: '06:30 นาที',
    details: [
      {
        question: 'แก่นของโมเดล 4 มิติ (หัว แขน ขา หัวใจ) มุ่งเน้นอะไรเป็นลำดับแรก?',
        selectedAnswer: 'การสำรวจคุณค่าและความเชื่อภายในจิตใจ (Heart / Core Values)',
        correctAnswer: 'การสำรวจคุณค่าและความเชื่อภายในจิตใจ (Heart / Core Values)',
        isCorrect: true
      }
    ]
  },
  {
    id: 'qz-105',
    studentId: '6513040089',
    studentName: 'ธีรยุทธ พงษ์ศิริ',
    studentEmail: 'teerayuth.p@udru.ac.th',
    faculty: 'คณะเทคโนโลยี',
    courseId: 'course-2',
    courseTitle: 'AI & Digital Tools for Next-Gen Learning',
    score: 100,
    passingScore: 75,
    passed: true,
    takenAt: '22 ก.ย. 2026, 13:20 น.',
    timeSpent: '05:15 นาที',
    details: [
      {
        question: 'หลักการที่ดีในการเขียนคำสั่ง (Prompt) ให้ AI ทำงานได้แม่นยำคืออะไร?',
        selectedAnswer: 'ระบุบทบาท (Role), บริบท (Context), คำสั่งที่ชัดเจน (Task) และรูปแบบผลลัพธ์ (Format)',
        correctAnswer: 'ระบุบทบาท (Role), บริบท (Context), คำสั่งที่ชัดเจน (Task) และรูปแบบผลลัพธ์ (Format)',
        isCorrect: true
      },
      {
        question: 'ข้อควรระวังสำคัญที่สุดในการนำข้อมูลจาก AI ไปใช้งานทางวิชาการคืออะไร?',
        selectedAnswer: 'ต้องตรวจสอบข้อเท็จจริง (Fact-checking) ป้องกันการเกิดข้อมูลบิดเบือน (Hallucination)',
        correctAnswer: 'ต้องตรวจสอบข้อเท็จจริง (Fact-checking) ป้องกันการเกิดข้อมูลบิดเบือน (Hallucination)',
        isCorrect: true
      }
    ]
  }
];

export const INITIAL_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-monthly',
    name: 'สมาชิกรายเดือน (Monthly Pass)',
    billingCycle: 'monthly',
    price: 199,
    originalPrice: 290,
    periodLabel: 'บาท / เดือน',
    description: 'เหมาะสำหรับผู้ที่ต้องการทดลองเรียนและสะสมทักษะระยะสั้น',
    features: [
      'เข้าเรียนได้ทุกคอร์สออนไลน์ในระบบกว่า 25+ หลักสูตร',
      'ทำแบบทดสอบประเมินผลได้ไม่จำกัด',
      'ดาวน์โหลดเอกสารประกอบการเรียนได้ทุกวิชา',
      'ใบประกาศนียบัตรรับรองสมรรถนะดิจิทัล UDRU'
    ],
    isPopular: false,
    status: 'active'
  },
  {
    id: 'plan-yearly',
    name: 'สมาชิกรายปี (Annual All-Access)',
    billingCycle: 'yearly',
    price: 1590,
    originalPrice: 2388,
    periodLabel: 'บาท / ปี (ประหยัด 33%)',
    description: 'แผนยอดนิยมสำหรับนักศึกษาและบุคลากรเพื่อการพัฒนาต่อเนื่องตลอดปี',
    features: [
      'สิทธิ์เข้าเรียนทุกหลักสูตรที่มีในปัจจุบันและหลักสูตรใหม่ตลอด 1 ปี',
      'สิทธิ์สอบและรับใบประกาศนียบัตรรับรองสมรรถนะครบทุกหลักสูตร',
      'เข้าถึงเวิร์กช็อปออนไลน์พิเศษกับอาจารย์ผู้เชี่ยวชาญฟรี',
      'สิทธิ์จองคิวห้องให้คำปรึกษา 1-on-1 "ช่องทางพักใจ" บุริมสิทธิ์',
      'ดาวน์โหลดโค้ด แม่แบบ และเครื่องมือนวัตกรรมชุมชนฉบับเต็ม'
    ],
    isPopular: true,
    status: 'active'
  },
  {
    id: 'plan-lifetime',
    name: 'สมาชิกตลอดชีพ (Lifetime Access)',
    billingCycle: 'lifetime',
    price: 3990,
    originalPrice: 5990,
    periodLabel: 'จ่ายครั้งเดียวตลอดชีพ',
    description: 'เข้าถึงคลังปัญญาและการเรียนรู้ตลอดไป ไม่มีวันหมดอายุ',
    features: [
      'สิทธิ์การเข้าถึงตลอดชีพ (Lifetime Access) ทุกเนื้อหาในระบบ',
      'รวมทุกคอร์สระดับ Advanced และการอบรมพิเศษในอนาคต',
      'ป้ายเกียรติยศ "พันธมิตรตลอดชีพ" บนโปรไฟล์และประกาศนียบัตร',
      'สิทธิ์เข้าร่วมโครงการทดลองภาคสนามและการระดมทุนนวัตกรรมท้องถิ่น',
      'ระบบ Support โดยตรงจากคณะอาจารย์ผู้ทรงคุณวุฒิ'
    ],
    isPopular: false,
    status: 'active'
  }
];

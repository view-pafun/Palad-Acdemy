export interface AssessmentQuestion {
  id: number;
  text: string;
  cleanText: string;
  isReverse: boolean;
  dimensionId: string;
  dimensionName: string;
  sboId: string;
  sboCode: string;
  sboName: string;
  pillarId: string;
  pillarName: string;
}

export interface SboPillarInfo {
  id: string;
  code: string;
  name: string;
  title: string;
  description: string;
  color: string;
  bgLight: string;
  borderLight: string;
  accentHex: string;
  iconName: string;
  sboIds: string[];
}

export interface SboSkillInfo {
  id: string; // e.g. 'sbo-1'
  code: string; // e.g. 'SBO1'
  number: number; // 1..12
  name: string;
  nameEn: string;
  pillarId: string;
  pillarName: string;
  description: string;
  questionIds: number[];
  color: string;
  bgLight: string;
  borderLight: string;
  accentHex: string;
  iconName: string;
  strengthAdvice: string;
  growthAdvice: string;
  recommendedCourseIds: string[];
}

export interface DimensionInfo {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  color: string;
  bgLight: string;
  borderLight: string;
  iconName: string;
  strengthAdvice: string;
  growthAdvice: string;
  recommendedCourseIds: string[];
}

export interface LikertOption {
  value: number;
  label: string;
  shortLabel: string;
  color: string;
  hexStart: string;
  hexEnd: string;
  accentColor: string;
  bgSoft: string;
  borderSoft: string;
  glowColor: string;
}

export const LIKERT_SCALE: LikertOption[] = [
  { 
    value: 1, 
    label: 'ไม่เห็นด้วยอย่างยิ่ง', 
    shortLabel: 'ไม่เห็นด้วยมาก', 
    color: 'from-rose-500 to-rose-700',
    hexStart: '#f43f5e',
    hexEnd: '#be123c',
    accentColor: '#e11d48',
    bgSoft: 'bg-rose-50',
    borderSoft: 'border-rose-200',
    glowColor: 'rgba(244, 63, 94, 0.45)'
  },
  { 
    value: 2, 
    label: 'ไม่เห็นด้วย', 
    shortLabel: 'ไม่เห็นด้วย', 
    color: 'from-orange-500 to-orange-700',
    hexStart: '#f97316',
    hexEnd: '#c2410c',
    accentColor: '#ea580c',
    bgSoft: 'bg-orange-50',
    borderSoft: 'border-orange-200',
    glowColor: 'rgba(249, 115, 22, 0.45)'
  },
  { 
    value: 3, 
    label: 'ค่อนข้างไม่เห็นด้วย', 
    shortLabel: 'ค่อนข้างไม่เห็นด้วย', 
    color: 'from-amber-400 to-amber-600',
    hexStart: '#fbbf24',
    hexEnd: '#d97706',
    accentColor: '#b45309',
    bgSoft: 'bg-amber-50',
    borderSoft: 'border-amber-200',
    glowColor: 'rgba(251, 191, 36, 0.45)'
  },
  { 
    value: 4, 
    label: 'เป็นกลาง / ปานกลาง', 
    shortLabel: 'ปานกลาง', 
    color: 'from-indigo-500 to-indigo-700',
    hexStart: '#6366f1',
    hexEnd: '#4338ca',
    accentColor: '#4f46e5',
    bgSoft: 'bg-indigo-50',
    borderSoft: 'border-indigo-200',
    glowColor: 'rgba(99, 102, 241, 0.45)'
  },
  { 
    value: 5, 
    label: 'ค่อนข้างเห็นด้วย', 
    shortLabel: 'ค่อนข้างเห็นด้วย', 
    color: 'from-lime-500 to-lime-700',
    hexStart: '#84cc16',
    hexEnd: '#4d7c0f',
    accentColor: '#65a30d',
    bgSoft: 'bg-lime-50',
    borderSoft: 'border-lime-200',
    glowColor: 'rgba(132, 204, 22, 0.45)'
  },
  { 
    value: 6, 
    label: 'เห็นด้วย', 
    shortLabel: 'เห็นด้วย', 
    color: 'from-emerald-500 to-emerald-700',
    hexStart: '#10b981',
    hexEnd: '#047857',
    accentColor: '#059669',
    bgSoft: 'bg-emerald-50',
    borderSoft: 'border-emerald-200',
    glowColor: 'rgba(10, 185, 129, 0.45)'
  },
  { 
    value: 7, 
    label: 'เห็นด้วยอย่างยิ่ง', 
    shortLabel: 'เห็นด้วยมาก', 
    color: 'from-teal-500 to-teal-700',
    hexStart: '#06b6d4',
    hexEnd: '#0f766e',
    accentColor: '#0d9488',
    bgSoft: 'bg-teal-50',
    borderSoft: 'border-teal-200',
    glowColor: 'rgba(6, 182, 212, 0.45)'
  },
];

export const SBO_PILLARS: Record<string, SboPillarInfo> = {
  'pillar-thinker': {
    id: 'pillar-thinker',
    code: 'นักคิด',
    name: 'วิศวกรสังคม นักคิด (SBO1 - SBO4)',
    title: 'ทักษะทางวิศวกรสังคม: นักคิด',
    description: 'ความสามารถในการตัดสินใจด้วยข้อมูลความจริง การมีกรอบคิดแบบเติบโต ยอมรับความแตกต่าง และสืบค้นสาเหตุที่แท้จริงของปัญหา',
    color: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    accentHex: '#2563eb',
    iconName: 'Brain',
    sboIds: ['sbo-1', 'sbo-2', 'sbo-3', 'sbo-4']
  },
  'pillar-coordinator': {
    id: 'pillar-coordinator',
    code: 'นักประสาน',
    name: 'วิศวกรสังคม นักประสาน (SBO5 - SBO8)',
    title: 'ทักษะทางวิศวกรสังคม: นักประสาน',
    description: 'ความฉลาดทางอารมณ์ การสื่อสารเชิงบวก การสร้างสัมพันธภาพ และการหลอมรวมความร่วมมือเพื่อเป้าหมายร่วม',
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    accentHex: '#059669',
    iconName: 'Users',
    sboIds: ['sbo-5', 'sbo-6', 'sbo-7', 'sbo-8']
  },
  'pillar-problem-solver': {
    id: 'pillar-problem-solver',
    code: 'นักแก้ปัญหา',
    name: 'วิศวกรสังคม นักแก้ปัญหา (SBO9 - SBO10)',
    title: 'ทักษะทางวิศวกรสังคม: นักแก้ปัญหา',
    description: 'การคิดเชิงวิพากษ์เพื่อเจาะลึกทางออก การประเมินทางเลือก และความคิดสร้างสรรค์พัฒนานวัตกรรมที่มีคุณค่า',
    color: 'text-amber-600',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    accentHex: '#d97706',
    iconName: 'Target',
    sboIds: ['sbo-9', 'sbo-10']
  },
  'pillar-innovator': {
    id: 'pillar-innovator',
    code: 'นักสร้างนวัตกรรม',
    name: 'วิศวกรสังคม นักสร้างนวัตกรรม (SBO11 - SBO12)',
    title: 'ทักษะทางวิศวกรสังคม: นักสร้างนวัตกรรม',
    description: 'ความมุ่งมั่นลงมือทำจริงอย่างไม่ย่อท้อ การปรับเปลี่ยนแผนอย่างยืดหยุ่น และการอุทิศตนสร้างผลกระทบเชิงบวกให้แก่สังคมส่วนรวม',
    color: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    accentHex: '#7c3aed',
    iconName: 'Sparkles',
    sboIds: ['sbo-11', 'sbo-12']
  }
};

export const SBO_SKILLS: Record<string, SboSkillInfo> = {
  'sbo-1': {
    id: 'sbo-1',
    code: 'SBO1',
    number: 1,
    name: 'การตัดสินใจด้วยข้อเท็จจริง',
    nameEn: 'Fact-Based Decision Making',
    pillarId: 'pillar-thinker',
    pillarName: 'นักคิด',
    description: 'ไม่ด่วนสรุปจากคำบอกเล่า ตรวจสอบที่มาของข้อมูล และใช้หลักฐานเชิงประจักษ์ประกอบการประเมินสถานการณ์',
    questionIds: [1, 2, 3, 4],
    color: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    accentHex: '#2563eb',
    iconName: 'Search',
    strengthAdvice: 'คุณมีความรอบคอบและวิจารณญาณสูง ไม่หลงเชื่อข่าวง่ายๆ และเป็นที่พึ่งพาด้านการตัดสินใจที่มีหลักการ',
    growthAdvice: 'ฝึกเปิดใจทดลองหาข้อมูลจากหลากหลายมิติ และตัดสินใจอย่างรวดเร็วขึ้นในภาวะข้อมูลไม่ครบถ้วน',
    recommendedCourseIds: ['course-1', 'course-4']
  },
  'sbo-2': {
    id: 'sbo-2',
    code: 'SBO2',
    number: 2,
    name: 'การเติบโตทางความคิด',
    nameEn: 'Growth Mindset & Resilience',
    pillarId: 'pillar-thinker',
    pillarName: 'นักคิด',
    description: 'มองความล้มเหลวเป็นโอกาสเรียนรู้ เปิดใจรับคำติชมเพื่อพัฒนาตนเอง และมีความเชื่อมั่นว่าทุกปัญหามีทางออก',
    questionIds: [5, 6, 7, 8, 9],
    color: 'text-sky-600',
    bgLight: 'bg-sky-50',
    borderLight: 'border-sky-200',
    accentHex: '#0284c7',
    iconName: 'TrendingUp',
    strengthAdvice: 'คุณมีพลังใจสูง ยืดหยุ่น ไม่ท้อถอยต่อคำวิจารณ์ และมองหาแง่มุมการเติบโตจากทุกสถานการณ์',
    growthAdvice: 'ระวังความสมบูรณ์แบบนิยม (Perfectionism) ที่อาจทำให้ส่งงานล่าช้า ฝึกแนวคิดส่งมอบผลงานแบบทำซ้ำต่อเนื่อง',
    recommendedCourseIds: ['course-2', 'course-5']
  },
  'sbo-3': {
    id: 'sbo-3',
    code: 'SBO3',
    number: 3,
    name: 'ยอมรับความแตกต่างอย่างสร้างสรรค์',
    nameEn: 'Constructive Diversity & Inclusion',
    pillarId: 'pillar-thinker',
    pillarName: 'นักคิด',
    description: 'การเปิดรับฟังเสียงส่วนน้อย การเคารพมุมมองที่หลากหลาย และการนำความเห็นต่างมาสังเคราะห์อย่างมีคุณค่า',
    questionIds: [10, 11, 12, 13],
    color: 'text-cyan-600',
    bgLight: 'bg-cyan-50',
    borderLight: 'border-cyan-200',
    accentHex: '#0891b2',
    iconName: 'CheckCircle2',
    strengthAdvice: 'คุณมีภาวะผู้นำที่เปิดกว้าง ให้เกียรติทุกคนในกลุ่ม และสร้างพื้นที่ปลอดภัยในการแลกเปลี่ยนความคิดเห็น',
    growthAdvice: 'ฝึกทักษะการสรุปรวมความคิดเห็นที่ขัดแย้งให้ออกมาเป็นข้อตกลงร่วมกันอย่างมีประสิทธิภาพ',
    recommendedCourseIds: ['course-1', 'course-6']
  },
  'sbo-4': {
    id: 'sbo-4',
    code: 'SBO4',
    number: 4,
    name: 'เข้าใจสาเหตุที่แท้จริงของปัญหา',
    nameEn: 'Root Cause Analysis',
    pillarId: 'pillar-thinker',
    pillarName: 'นักคิด',
    description: 'การวิเคราะห์เจาะลึกเพื่อหาสาเหตุรากเหง้า (Root Cause) ไม่มองเพียงผิวเผิน และรับฟังเหตุผลของผู้อื่น',
    questionIds: [14, 15, 16, 17, 18],
    color: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-200',
    accentHex: '#4f46e5',
    iconName: 'Crosshair',
    strengthAdvice: 'คุณมีความสามารถในการสืบค้นต้นตอของปัญหาได้อย่างแม่นยำ ไม่โทษผู้อื่นหรือสิ่งแวดล้อมโดยไร้เหตุผล',
    growthAdvice: 'ใช้เครื่องมือวิเคราะห์เชิงโครงสร้าง เช่น 5 Whys หรือ Fishbone Diagram เพิ่มเติมในงานกลุ่ม',
    recommendedCourseIds: ['course-3', 'course-4']
  },
  'sbo-5': {
    id: 'sbo-5',
    code: 'SBO5',
    number: 5,
    name: 'การจัดการอารมณ์ตนเอง',
    nameEn: 'Emotional Self-Regulation',
    pillarId: 'pillar-coordinator',
    pillarName: 'นักประสาน',
    description: 'การควบคุมอารมณ์เมื่อสถานการณ์ไม่เป็นไปตามคาด การรู้เท่าทันความรู้สึกตนเอง และการระงับความขัดแย้ง',
    questionIds: [19, 20, 21, 22, 23],
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    accentHex: '#059669',
    iconName: 'Heart',
    strengthAdvice: 'คุณมีวุฒิภาวะทางอารมณ์ที่ดี มีความสุขุม สงบสติได้ดีเมื่อเผชิญสถานการณ์กดดันหรือขัดแย้ง',
    growthAdvice: 'ฝึกวิธีผ่อนคลายความเครียดเชิงรุก เช่น การเจริญสติ หรือการเผชิญหน้ากับความเครียดอย่างมีกลยุทธ์',
    recommendedCourseIds: ['course-2', 'course-6']
  },
  'sbo-6': {
    id: 'sbo-6',
    code: 'SBO6',
    number: 6,
    name: 'การสร้างความสัมพันธ์เชิงบวก',
    nameEn: 'Positive Relationship Building',
    pillarId: 'pillar-coordinator',
    pillarName: 'นักประสาน',
    description: 'ความใส่ใจเห็นอกเห็นใจผู้อื่น การสร้างบรรยากาศที่เป็นมิตร และความพร้อมที่จะสนับสนุนช่วยเหลือผู้อื่น',
    questionIds: [24, 25, 26, 27, 28],
    color: 'text-teal-600',
    bgLight: 'bg-teal-50',
    borderLight: 'border-teal-200',
    accentHex: '#0d9488',
    iconName: 'Smile',
    strengthAdvice: 'คุณมีความอบอุ่น มีน้ำใจ เข้าถึงง่าย และสร้างสายสัมพันธ์ที่ไว้วางใจได้เสมอ',
    growthAdvice: 'ฝึกความกล้าในการเริ่มต้นบทสนทนากับบุคคลที่ไม่คุ้นเคยเพื่อขยายเครือข่ายพันธมิตร',
    recommendedCourseIds: ['course-1', 'course-3']
  },
  'sbo-7': {
    id: 'sbo-7',
    code: 'SBO7',
    number: 7,
    name: 'การสื่อสารอย่างมีประสิทธิภาพ',
    nameEn: 'Effective Communication',
    pillarId: 'pillar-coordinator',
    pillarName: 'นักประสาน',
    description: 'สื่อสารความคิดชัดเจนตรงประเด็น ตั้งใจรับฟังอย่างลึกซึ้ง ไม่พูดแทรก และปรับสไตล์ให้เหมาะกับผู้ฟัง',
    questionIds: [29, 30, 31, 32, 33],
    color: 'text-green-600',
    bgLight: 'bg-green-50',
    borderLight: 'border-green-200',
    accentHex: '#16a34a',
    iconName: 'MessageSquare',
    strengthAdvice: 'คุณมีทักษะการฟังที่ยอดเยี่ยม สื่อสารได้กระจ่างชัด และปรับตัวเข้ากับผู้คนหลากหลายได้ดี',
    growthAdvice: 'ฝึกสื่อสารความรู้สึกที่แท้จริงอย่างกล้าหาญและสุภาพ (Assertive Communication) เพื่อป้องกันการเก็บกด',
    recommendedCourseIds: ['course-1', 'course-4']
  },
  'sbo-8': {
    id: 'sbo-8',
    code: 'SBO8',
    number: 8,
    name: 'การประสานความร่วมมือ',
    nameEn: 'Collaborative Teamwork',
    pillarId: 'pillar-coordinator',
    pillarName: 'นักประสาน',
    description: 'พลังในการทำงานร่วมกัน การเปิดรับฟังเพื่อเป้าหมายของทีม และการให้คุณค่าแก่ความสำเร็จของส่วนรวม',
    questionIds: [34, 35, 36, 37, 38],
    color: 'text-lime-600',
    bgLight: 'bg-lime-50',
    borderLight: 'border-lime-200',
    accentHex: '#65a30d',
    iconName: 'Users',
    strengthAdvice: 'คุณเป็นผู้เล่นทีมที่ยอดเยี่ยม (Team Player) พร้อมประสานพลังและขับเคลื่อนกลุ่มไปสู่เป้าหมายร่วมกัน',
    growthAdvice: 'เรียนรู้ทักษะการเป็นผู้นำการอำนวยการ (Facilitator) เพื่อช่วยไกล่เกลี่ยเมื่อทีมติดขัดในทางเลือก',
    recommendedCourseIds: ['course-1', 'course-6']
  },
  'sbo-9': {
    id: 'sbo-9',
    code: 'SBO9',
    number: 9,
    name: 'การคิดเชิงวิพากษ์เพื่อแก้ปัญหา',
    nameEn: 'Critical Thinking & Problem Solving',
    pillarId: 'pillar-problem-solver',
    pillarName: 'นักแก้ปัญหา',
    description: 'การตั้งคำถามรอบด้าน ตรวจสอบความถูกต้อง เชื่อมโยงสาเหตุและผลกระทบ และประเมินทางเลือกที่คุ้มค่าที่สุด',
    questionIds: [39, 40, 41, 42, 43],
    color: 'text-amber-600',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    accentHex: '#d97706',
    iconName: 'Zap',
    strengthAdvice: 'คุณมีตรรกะที่เฉียบแหลม มองเห็นจุดเชื่อมโยงของปัญหาได้เร็ว และเลือกทางออกได้อย่างชาญฉลาด',
    growthAdvice: 'หลีกเลี่ยงการแก้ปัญหาตามความเคยชิน ลองตั้งคำถาม "มีวิธีที่แปลกใหม่และดีกว่าเดิมหรือไม่"',
    recommendedCourseIds: ['course-3', 'course-5']
  },
  'sbo-10': {
    id: 'sbo-10',
    code: 'SBO10',
    number: 10,
    name: 'การคิดสร้างสรรค์และนวัตกรรม',
    nameEn: 'Creativity & Innovation',
    pillarId: 'pillar-problem-solver',
    pillarName: 'นักแก้ปัญหา',
    description: 'การมองหาโอกาสและแนวทางที่แตกต่าง ชอบทดลองสิ่งใหม่ๆ แม้มีความเสี่ยง และสร้างโซลูชันที่นำไปใช้ได้จริง',
    questionIds: [44, 45, 46, 47, 48],
    color: 'text-orange-600',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    accentHex: '#ea580c',
    iconName: 'Lightbulb',
    strengthAdvice: 'คุณมีความคิดสร้างสรรค์ กล้าคิดนอกกรอบ และสามารถแปลงไอเดียแปลกใหม่ให้กลายเป็นประโยชน์ที่จับต้องได้',
    growthAdvice: 'ฝึกความอดทนในการทำงานในสภาพแวดล้อมที่ไร้แบบแผนชัดเจน เพื่อขยายพื้นที่ความคิดสร้างสรรค์ให้กว้างขึ้น',
    recommendedCourseIds: ['course-2', 'course-4']
  },
  'sbo-11': {
    id: 'sbo-11',
    code: 'SBO11',
    number: 11,
    name: 'การลงมือปฏิบัติจริง',
    nameEn: 'Action Orientation & Execution',
    pillarId: 'pillar-innovator',
    pillarName: 'นักสร้างนวัตกรรม',
    description: 'ความมุ่งมั่นแปลงแผนงานไปสู่การกระทำ ไม่ผัดวันประกันพรุ่ง ยืดหยุ่นเมื่อเจออุปสรรค และกัดไม่ปล่อยจนสำเร็จ',
    questionIds: [49, 50, 51, 52, 53],
    color: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    accentHex: '#7c3aed',
    iconName: 'Flame',
    strengthAdvice: 'คุณมีพลังการขับเคลื่อนผลงานสูง (High Execution) มีวินัย ไม่ท้อถอย และมุ่งมั่นทำให้สำเร็จตามคำมั่นสัญญา',
    growthAdvice: 'หมั่นทบทวนความคุ้มค่าและจัดลำดับความสำคัญของงาน เพื่อไม่ให้สูญเสียพลังไปกับงานที่ไม่สร้างผลลัพธ์สูง',
    recommendedCourseIds: ['course-3', 'course-5']
  },
  'sbo-12': {
    id: 'sbo-12',
    code: 'SBO12',
    number: 12,
    name: 'การสร้างผลกระทบเชิงบวกต่อสังคม',
    nameEn: 'Social Impact & Civic Mindset',
    pillarId: 'pillar-innovator',
    pillarName: 'นักสร้างนวัตกรรม',
    description: 'มุ่งมั่นใช้ความรู้พัฒนาสังคม มีจิตอาสา คำนึงถึงประโยชน์ส่วนรวม และเชื่อมั่นว่าตนเองสร้างการเปลี่ยนแปลงที่ดีได้',
    questionIds: [54, 55, 56, 57, 58, 59, 60],
    color: 'text-violet-600',
    bgLight: 'bg-violet-50',
    borderLight: 'border-violet-200',
    accentHex: '#6d28d9',
    iconName: 'Globe',
    strengthAdvice: 'คุณมีหัวใจของวิศวกรสังคมที่แท้จริง มุ่งสร้างประโยชน์ให้สังคม มีสำนึกพลเมือง และสร้างแรงบันดาลใจให้คนรอบข้าง',
    growthAdvice: 'เชื่อมโยงผลประโยชน์ส่วนตนและเป้าหมายสังคมให้เกื้อกูลกัน เพื่อให้สามารถสร้างการเปลี่ยนแปลงได้อย่างยั่งยืนในระยะยาว',
    recommendedCourseIds: ['course-1', 'course-6']
  }
};

// Map each SBO to legacy dimension ID for backward compatibility
export const DIMENSIONS: Record<string, DimensionInfo> = {
  'critical-thinking': {
    id: 'critical-thinking',
    name: 'การตัดสินใจด้วยข้อเท็จจริงและคิดวิเคราะห์ (SBO1 & SBO9)',
    nameEn: 'Critical Thinking & Fact Analysis',
    description: 'ความสามารถในการตรวจสอบแหล่งที่มา เปรียบเทียบข้อเท็จจริง และไม่ด่วนสรุปข้อมูล',
    color: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    iconName: 'Search',
    strengthAdvice: 'คุณมีความสามารถในการคัดกรองข้อมูลที่เป็นเลิศ เป็นคนช่างสังเกต และไม่ตกเป็นเหยื่อของข่าวปลอม',
    growthAdvice: 'เปิดโอกาสให้กับการทดลองสิ่งใหม่ แม้ในสถานการณ์ที่มีข้อมูลไม่ครบถ้วน',
    recommendedCourseIds: ['course-1', 'course-4']
  },
  'growth-mindset': {
    id: 'growth-mindset',
    name: 'กรอบคิดแบบเติบโตและการเรียนรู้ (SBO2 & SBO4)',
    nameEn: 'Growth Mindset & Root Cause',
    description: 'การมองความล้มเหลวเป็นบทเรียน เปิดใจรับคำติชม และหาสาเหตุที่แท้จริงของปัญหา',
    color: 'text-amber-600',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    iconName: 'Sparkles',
    strengthAdvice: 'คุณมีพลังใจในการฟื้นตัวสูง มองทุกอุปสรรคเป็นบันไดก้าวสำคัญ',
    growthAdvice: 'หมั่นจดบันทึกการเรียนรู้รายสัปดาห์ เพื่อตกผลึกข้อคิดให้กลายเป็นแนวทางปฏิบัติ',
    recommendedCourseIds: ['course-2', 'course-5']
  },
  'empathy-communication': {
    id: 'empathy-communication',
    name: 'การจัดการอารมณ์และการสื่อสาร (SBO5, SBO6, SBO7)',
    nameEn: 'Mindful Communication & Empathy',
    description: 'การฟังอย่างลึกซึ้ง การใช้ถ้อยคำที่สร้างสรรค์ และความฉลาดทางอารมณ์',
    color: 'text-rose-600',
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-200',
    iconName: 'Heart',
    strengthAdvice: 'คุณเป็นผู้รับฟังที่ดีเยี่ยม เข้าใจความรู้สึกของคนรอบข้าง และสร้างสะพานเชื่อมสัมพันธ์ด้วยความจริงใจ',
    growthAdvice: 'ฝึกสื่อสารแบบ Assertive คือการแสดงความต้องการของตนเองอย่างชัดเจนและสุภาพ',
    recommendedCourseIds: ['course-1', 'course-3']
  },
  'teamwork-collaboration': {
    id: 'teamwork-collaboration',
    name: 'การประสานความร่วมมือและยอมรับความต่าง (SBO3 & SBO8)',
    nameEn: 'Collaborative Teamwork & Diversity',
    description: 'การร่วมมือกับผู้อื่นเพื่อเป้าหมายส่วนรวม การเคารพเสียงส่วนน้อย และการหลอมรวมพลัง',
    color: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-200',
    iconName: 'Users',
    strengthAdvice: 'คุณเห็นคุณค่าของพลังกลุ่ม เชื่อมั่นในศักยภาพของทุกคน และสร้างบรรยากาศที่เปิดกว้าง',
    growthAdvice: 'เรียนรู้เทคนิคการบริหารการประชุมเพื่อขับเคลื่อนมติกลุ่มให้บรรลุผลรวดเร็ว',
    recommendedCourseIds: ['course-1', 'course-6']
  },
  'self-management': {
    id: 'self-management',
    name: 'ความคิดสร้างสรรค์และลงมือทำจริง (SBO10 & SBO11)',
    nameEn: 'Innovation & Action Orientation',
    description: 'การตั้งเป้าหมาย มุ่งมั่นลงมือปฏิบัติ และการคิดค้นแนวทางสร้างสรรค์',
    color: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    iconName: 'Target',
    strengthAdvice: 'คุณมีความมุ่งมั่น มีวินัยสูง และแปลงแผนงานไปสู่ผลสัมฤทธิ์ได้อย่างเป็นรูปธรรม',
    growthAdvice: 'หลีกเลี่ยงการผัดวันประกันพรุ่ง และทดลองปล่อยผลงานเวอร์ชันแรกออกทดสอบก่อน',
    recommendedCourseIds: ['course-3', 'course-5']
  },
  'agility-resilience': {
    id: 'agility-resilience',
    name: 'การสร้างผลกระทบเชิงบวกต่อสังคม (SBO12)',
    nameEn: 'Social Impact & Civic Leadership',
    description: 'การอุทิศตนช่วยเหลือสังคม มีสำนึกพลเมือง และสร้างการเปลี่ยนแปลงที่ดีให้ชุมชน',
    color: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    iconName: 'Zap',
    strengthAdvice: 'คุณมีจิตวิญญาณแห่งการให้ มีความรับผิดชอบต่อส่วนรวม และสร้างแรงกระเพื่อมเชิงบวก',
    growthAdvice: 'เชื่อมโยงเป้าหมายทางวิชาการและอาชีพเข้ากับโจทย์ของชุมชนท้องถิ่นอย่างเป็นระบบ',
    recommendedCourseIds: ['course-2', 'course-4']
  }
};

/**
 * EXACT 60 Questions Mapped to the 12 SBO Skill Areas and 4 Pillars:
 * 
 * Pillar 1: วิศวกรสังคม นักคิด (SBO1 - SBO4)
 * - SBO1: Q1 - Q4
 * - SBO2: Q5 - Q9
 * - SBO3: Q10 - Q13
 * - SBO4: Q14 - Q18
 * 
 * Pillar 2: วิศวกรสังคม นักประสาน (SBO5 - SBO8)
 * - SBO5: Q19 - Q23
 * - SBO6: Q24 - Q28
 * - SBO7: Q29 - Q33
 * - SBO8: Q34 - Q38
 * 
 * Pillar 3: วิศวกรสังคม นักแก้ปัญหา (SBO9 - SBO10)
 * - SBO9: Q39 - Q43
 * - SBO10: Q44 - Q48
 * 
 * Pillar 4: วิศวกรสังคม นักสร้างนวัตกรรม (SBO11 - SBO12)
 * - SBO11: Q49 - Q53
 * - SBO12: Q54 - Q60
 */
export const RAW_QUESTIONS_DATA = [
  // SBO1: การตัดสินใจด้วยข้อเท็จจริง (1-4)
  { id: 1, text: 'ขนมเพิ่งหมดอายุเมื่อวาน คุณคิดว่ามันน่าจะกินได้', isReverse: false, sboId: 'sbo-1', dimensionId: 'critical-thinking' },
  { id: 2, text: 'คุณยังไม่เชื่อข้อมูลใดจนกว่าจะรู้ที่มาของข้อมูลนั้น', isReverse: false, sboId: 'sbo-1', dimensionId: 'critical-thinking' },
  { id: 3, text: 'คุณคิดว่าการตัดสินผู้อื่นจากเรื่องเล่าของคนอื่นเป็นสิ่งที่ไม่ควรทำ', isReverse: false, sboId: 'sbo-1', dimensionId: 'critical-thinking' },
  { id: 4, text: 'คุณคิดว่าจะฝึกงานที่โรงพยาบาลใกล้บ้าน เพราะรุ่นพี่บอกว่าเจ้าหน้าที่โรงพยาบาลดูแลดีมาก (-)', isReverse: true, sboId: 'sbo-1', dimensionId: 'critical-thinking' },

  // SBO2: การเติบโตทางความคิด (5-9)
  { id: 5, text: 'คุณมองว่าความล้มเหลวเป็นโอกาสในการเรียนรู้และเติบโต', isReverse: false, sboId: 'sbo-2', dimensionId: 'growth-mindset' },
  { id: 6, text: 'คุณไม่พอใจทุกครั้งที่มีคนมาแสดงความเห็นว่าผลงานของคุณยังไม่ดี (-)', isReverse: true, sboId: 'sbo-2', dimensionId: 'growth-mindset' },
  { id: 7, text: 'คุณมักคิดเสมอว่าทุกปัญหามีทางออก', isReverse: false, sboId: 'sbo-2', dimensionId: 'growth-mindset' },
  { id: 8, text: 'คุณไม่ชอบทำงานกลุ่ม เพราะมีแต่คนมุ่งเอาเปรียบกัน (-)', isReverse: true, sboId: 'sbo-2', dimensionId: 'teamwork-collaboration' },
  { id: 9, text: 'คุณอาจส่งงานให้อาจารย์ช้าหน่อย เพราะคุณตั้งใจทำให้ดีที่สุด (-)', isReverse: true, sboId: 'sbo-2', dimensionId: 'growth-mindset' },

  // SBO3: ยอมรับความแตกต่างอย่างสร้างสรรค์ (10-13)
  { id: 10, text: 'คุณรู้สึกรำคาญเมื่อมีสมาชิกในทีมแสดงความคิดเห็นบ่อยๆ ตลอดการประชุม (-)', isReverse: true, sboId: 'sbo-3', dimensionId: 'teamwork-collaboration' },
  { id: 11, text: 'คุณเชื่อว่าการรับฟังข้อเสนอแนะ/คำติชมของผู้อื่นจะช่วยให้งานพัฒนาขึ้น', isReverse: false, sboId: 'sbo-3', dimensionId: 'growth-mindset' },
  { id: 12, text: 'เมื่อต้องตัดสินใจ คุณเชื่อว่ามติจากเสียงใหญ่เป็นสิ่งที่ต้องทำตามเสมอ (-)', isReverse: true, sboId: 'sbo-3', dimensionId: 'teamwork-collaboration' },
  { id: 13, text: 'คุณเชื่อว่าการให้โอกาสเสียงส่วนน้อย ได้แสดงความคิดเห็นเป็นการสร้างการยอมรับความแตกต่าง', isReverse: false, sboId: 'sbo-3', dimensionId: 'teamwork-collaboration' },

  // SBO4: เข้าใจสาเหตุที่แท้จริงของปัญหา (14-18)
  { id: 14, text: 'คุณยอมรับที่จะฟังเหตุผล เมื่อเพื่อนร่วมงานทำงานไม่เสร็จตามกำหนด', isReverse: false, sboId: 'sbo-4', dimensionId: 'growth-mindset' },
  { id: 15, text: 'คุณไม่ใส่ใจเมื่อคนในทีมไม่ช่วยทำงาน เพราะคุณคิดว่าช่างมันเถอะ ทำเองก็ได้ (-)', isReverse: true, sboId: 'sbo-4', dimensionId: 'growth-mindset' },
  { id: 16, text: 'คุณคิดว่าการค้นหาสาเหตุที่แท้จริงของปัญหาเป็นสิ่งสำคัญในการแก้ไขปัญหา', isReverse: false, sboId: 'sbo-4', dimensionId: 'growth-mindset' },
  { id: 17, text: 'คุณเชื่อว่าปัญหาที่เกิดขึ้นกับคุณ มักเกิดจากผู้อื่นหรือสิ่งแวดล้อม (-)', isReverse: true, sboId: 'sbo-4', dimensionId: 'growth-mindset' },
  { id: 18, text: 'คุณมักจะวิเคราะห์สถานการณ์เพื่อหาสาเหตุที่แท้จริงก่อนที่จะตัดสินใจแก้ไขปัญหา', isReverse: false, sboId: 'sbo-4', dimensionId: 'growth-mindset' },

  // SBO5: การจัดการอารมณ์ตนเอง (19-23)
  { id: 19, text: 'คุณสามารถควบคุมอารมณ์ได้ดี เมื่อสถานการณ์ไม่เป็นไปตามที่คุณคาดหวัง', isReverse: false, sboId: 'sbo-5', dimensionId: 'empathy-communication' },
  { id: 20, text: 'คุณมักจะรู้สึกหงุดหงิดง่าย เมื่อต้องเผชิญกับสถานการณ์ที่ไม่เป็นไปตามแผน (-)', isReverse: true, sboId: 'sbo-5', dimensionId: 'empathy-communication' },
  { id: 21, text: 'คุณยอมรับอารมณ์ความรู้สึกของตนเองได้ แม้จะเป็นความรู้สึกที่ไม่ดีก็ตาม', isReverse: false, sboId: 'sbo-5', dimensionId: 'empathy-communication' },
  { id: 22, text: 'คุณหลีกเลี่ยงการเผชิญหน้ากับความเครียดโดยการหันไปทำกิจกรรมอื่น เช่น เล่นเกม หรือดูหนัง เพื่อลืมปัญหาไปชั่วคราว (-)', isReverse: true, sboId: 'sbo-5', dimensionId: 'empathy-communication' },
  { id: 23, text: 'คุณสามารถสงบสติอารมณ์ได้ เมื่อเกิดความขัดแย้งกับผู้อื่น', isReverse: false, sboId: 'sbo-5', dimensionId: 'empathy-communication' },

  // SBO6: การสร้างความสัมพันธ์เชิงบวก (24-28)
  { id: 24, text: 'คุณใส่ใจ และพยายามทำความเข้าใจความรู้สึกของผู้อื่น', isReverse: false, sboId: 'sbo-6', dimensionId: 'empathy-communication' },
  { id: 25, text: 'คุณรู้สึกว่าการทำความเข้าใจความรู้สึกของผู้อื่นเป็นเรื่องยากสำหรับคุณ (-)', isReverse: true, sboId: 'sbo-6', dimensionId: 'empathy-communication' },
  { id: 26, text: 'คุณมักสร้างบรรยากาศที่ดี และเป็นมิตรเมื่ออยู่ร่วมกับผู้อื่น', isReverse: false, sboId: 'sbo-6', dimensionId: 'empathy-communication' },
  { id: 27, text: 'คุณไม่ชอบที่จะเริ่มต้นบทสนทนากับคนที่ไม่คุ้นเคย (-)', isReverse: true, sboId: 'sbo-6', dimensionId: 'empathy-communication' },
  { id: 28, text: 'คุณพร้อมที่จะสนับสนุน และช่วยเหลือผู้อื่นเมื่อพวกเขามีปัญหา', isReverse: false, sboId: 'sbo-6', dimensionId: 'empathy-communication' },

  // SBO7: การสื่อสารอย่างมีประสิทธิภาพ (29-33)
  { id: 29, text: 'คุณสามารถสื่อสารความคิด และความรู้สึกของคุณได้อย่างชัดเจน และตรงประเด็น', isReverse: false, sboId: 'sbo-7', dimensionId: 'empathy-communication' },
  { id: 30, text: 'คุณมักจะหลีกเลี่ยงการพูดความรู้สึกที่แท้จริงของตนเอง เพราะกลัวว่าจะทำให้ผู้อื่นไม่พอใจ (-)', isReverse: true, sboId: 'sbo-7', dimensionId: 'empathy-communication' },
  { id: 31, text: 'คุณตั้งใจรับฟังผู้อื่นอย่างเต็มที่ เพื่อทำความเข้าใจสิ่งที่พวกเขาต้องการสื่อสาร', isReverse: false, sboId: 'sbo-7', dimensionId: 'empathy-communication' },
  { id: 32, text: 'คุณมักจะพูดแทรกเมื่อผู้อื่นยังพูดไม่จบ เพราะคุณอยากจะแสดงความคิดเห็นของตนเอง (-)', isReverse: true, sboId: 'sbo-7', dimensionId: 'empathy-communication' },
  { id: 33, text: 'คุณสามารถปรับเปลี่ยนวิธีการสื่อสาร เพื่อให้เหมาะสมกับผู้ฟังที่แตกต่างกัน', isReverse: false, sboId: 'sbo-7', dimensionId: 'empathy-communication' },

  // SBO8: การประสานความร่วมมือ (34-38)
  { id: 34, text: 'คุณรู้สึกสนุก และมีพลังเมื่อได้ทำงานร่วมกับผู้อื่นในทีม', isReverse: false, sboId: 'sbo-8', dimensionId: 'teamwork-collaboration' },
  { id: 35, text: 'คุณมักจะทำงานคนเดียว เพราะรู้สึกว่าการทำงานร่วมกับผู้อื่นมักเกิดปัญหา และความล่าช้า (-)', isReverse: true, sboId: 'sbo-8', dimensionId: 'teamwork-collaboration' },
  { id: 36, text: 'คุณเปิดรับความคิดเห็นที่แตกต่าง และพร้อมที่จะนำมาปรับใช้เพื่อเป้าหมายร่วมกันของทีม', isReverse: false, sboId: 'sbo-8', dimensionId: 'teamwork-collaboration' },
  { id: 37, text: 'คุณมักจะยึดมั่นในความคิดเห็นของตนเอง และยากที่จะยอมรับความคิดเห็นของผู้อื่นในการทำงานกลุ่ม (-)', isReverse: true, sboId: 'sbo-8', dimensionId: 'teamwork-collaboration' },
  { id: 38, text: 'คุณให้ความสำคัญกับความสำเร็จของทีมมากกว่าความสำเร็จของตนเอง', isReverse: false, sboId: 'sbo-8', dimensionId: 'teamwork-collaboration' },

  // SBO9: การคิดเชิงวิพากษ์เพื่อแก้ปัญหา (39-43)
  { id: 39, text: 'คุณมักจะตั้งคำถาม และตรวจสอบข้อมูลจากหลายๆ แหล่ง ก่อนที่จะเชื่อ หรือนำมาใช้ในการแก้ปัญหา', isReverse: false, sboId: 'sbo-9', dimensionId: 'critical-thinking' },
  { id: 40, text: 'คุณมักจะยอมรับข้อมูล หรือข้อเสนอแนะแรกที่ได้รับ โดยไม่ได้ตรวจสอบความถูกต้องอย่างละเอียด (-)', isReverse: true, sboId: 'sbo-9', dimensionId: 'critical-thinking' },
  { id: 41, text: 'คุณสามารถมองเห็นความเชื่อมโยงระหว่างสาเหตุ และผลกระทบของปัญหาได้อย่างชัดเจน', isReverse: false, sboId: 'sbo-9', dimensionId: 'critical-thinking' },
  { id: 42, text: 'คุณมักจะแก้ไขปัญหาตามความเคยชิน หรือตามที่เคยทำมา โดยไม่ได้คิดหาวิธีใหม่ๆ ที่อาจจะดีกว่า (-)', isReverse: true, sboId: 'sbo-9', dimensionId: 'critical-thinking' },
  { id: 43, text: 'คุณสามารถประเมินทางเลือกต่างๆ ในการแก้ปัญหา และเลือกทางเลือกที่เหมาะสมที่สุดได้', isReverse: false, sboId: 'sbo-9', dimensionId: 'critical-thinking' },

  // SBO10: การคิดสร้างสรรค์และนวัตกรรม (44-48)
  { id: 44, text: 'คุณมักจะมองหาโอกาสใหม่ๆ หรือแนวทางที่แตกต่างในการทำงาน หรือแก้ปัญหา', isReverse: false, sboId: 'sbo-10', dimensionId: 'self-management' },
  { id: 45, text: 'คุณรู้สึกอึดอัดเมื่อต้องทำงานที่ไม่มีขั้นตอน หรือวิธีการที่ชัดเจน และแน่นอน (-)', isReverse: true, sboId: 'sbo-10', dimensionId: 'self-management' },
  { id: 46, text: 'คุณชอบทดลองทำสิ่งใหม่ๆ แม้ว่าจะมีความเสี่ยงที่จะล้มเหลว', isReverse: false, sboId: 'sbo-10', dimensionId: 'self-management' },
  { id: 47, text: 'คุณมักจะหลีกเลี่ยงการเปลี่ยนแปลง และชอบทำสิ่งต่างๆ ในแบบเดิมๆ ที่คุ้นเคย (-)', isReverse: true, sboId: 'sbo-10', dimensionId: 'self-management' },
  { id: 48, text: 'คุณสามารถคิดค้นแนวทาง หรือวิธีการใหม่ๆ ที่มีประโยชน์ และนำไปใช้ได้จริง', isReverse: false, sboId: 'sbo-10', dimensionId: 'self-management' },

  // SBO11: การลงมือปฏิบัติจริง (49-53)
  { id: 49, text: 'คุณมีความมุ่งมั่น และตั้งใจจริงในการนำความคิด หรือแผนงานไปสู่การปฏิบัติ', isReverse: false, sboId: 'sbo-11', dimensionId: 'self-management' },
  { id: 50, text: 'คุณมักจะผลัดวันประกันพรุ่ง และเลื่อนการลงมือทำออกไปเรื่อยๆ (-)', isReverse: true, sboId: 'sbo-11', dimensionId: 'self-management' },
  { id: 51, text: 'คุณสามารถปรับเปลี่ยนแผนการทำงานได้อย่างยืดหยุ่น เมื่อเผชิญกับอุปสรรค หรือสถานการณ์ที่เปลี่ยนแปลง', isReverse: false, sboId: 'sbo-11', dimensionId: 'self-management' },
  { id: 52, text: 'คุณมักจะยอมแพ้ได้ง่ายเมื่อพบกับความยากลำบาก หรือความล้มเหลวในการทำงาน (-)', isReverse: true, sboId: 'sbo-11', dimensionId: 'self-management' },
  { id: 53, text: 'คุณพยายามทำงานให้เสร็จสิ้นตามเป้าหมาย แม้ว่าจะต้องใช้เวลา และความพยายามอย่างมาก', isReverse: false, sboId: 'sbo-11', dimensionId: 'self-management' },

  // SBO12: การสร้างผลกระทบเชิงบวกต่อสังคม (54-60)
  { id: 54, text: 'คุณมีความมุ่งมั่นที่จะใช้ความรู้ ความสามารถของตนเองเพื่อช่วยเหลือ และพัฒนาสังคม', isReverse: false, sboId: 'sbo-12', dimensionId: 'agility-resilience' },
  { id: 55, text: 'คุณรู้สึกว่าปัญหาสังคมเป็นเรื่องไกลตัว และไม่ได้เกี่ยวข้องกับคุณโดยตรง (-)', isReverse: true, sboId: 'sbo-12', dimensionId: 'agility-resilience' },
  { id: 56, text: 'คุณพร้อมที่จะมีส่วนร่วมในกิจกรรม หรือโครงการที่เป็นประโยชน์ต่อส่วนรวม', isReverse: false, sboId: 'sbo-12', dimensionId: 'agility-resilience' },
  { id: 57, text: 'คุณให้ความสำคัญกับผลประโยชน์ส่วนตนมากกว่าผลประโยชน์ของสังคม หรือส่วนรวม (-)', isReverse: true, sboId: 'sbo-12', dimensionId: 'agility-resilience' },
  { id: 58, text: 'คุณเชื่อว่าการกระทำเล็กๆ ของคุณสามารถสร้างการเปลี่ยนแปลงที่ดีขึ้นให้กับสังคมได้', isReverse: false, sboId: 'sbo-12', dimensionId: 'agility-resilience' },
  { id: 59, text: 'คุณรู้สึกกระตือรือร้นที่จะร่วมมือกับผู้อื่นในการแก้ไขปัญหาสังคม', isReverse: false, sboId: 'sbo-12', dimensionId: 'agility-resilience' },
  { id: 60, text: 'คุณมักจะหลีกเลี่ยงการมีส่วนร่วมในกิจกรรมอาสา หรือกิจกรรมเพื่อสังคม (-)', isReverse: true, sboId: 'sbo-12', dimensionId: 'agility-resilience' },
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = RAW_QUESTIONS_DATA.map((item) => {
  const sbo = SBO_SKILLS[item.sboId];
  const pillar = sbo ? SBO_PILLARS[sbo.pillarId] : undefined;
  const dim = DIMENSIONS[item.dimensionId];
  // Clean question text by stripping the trailing (-) if present, while keeping isReverse flag
  const cleanText = item.text.replace(/\s*\(\-\)\s*$/, '').trim();
  return {
    ...item,
    cleanText,
    dimensionName: dim ? dim.name : item.dimensionId,
    sboCode: sbo ? sbo.code : 'SBO',
    sboName: sbo ? sbo.name : '',
    pillarId: sbo ? sbo.pillarId : 'pillar-thinker',
    pillarName: pillar ? pillar.code : 'นักคิด'
  };
});

/**
 * Calculates item score based on psychometric reverse coding rule:
 * If item is standard: score = rawRating (1..7)
 * If item has (-): score = 8 - rawRating (e.g. 7 becomes 1, 1 becomes 7)
 */
export function calculateItemScore(rawRating: number, isReverse: boolean): number {
  if (isReverse) {
    return 8 - rawRating;
  }
  return rawRating;
}

export interface SboScoreDetail {
  sboId: string;
  code: string;
  number: number;
  name: string;
  nameEn: string;
  pillarId: string;
  pillarName: string;
  score: number;
  maxScore: number;
  average: number; // 1.00 - 7.00
  percentage: number; // 0 - 100
  level: string;
  questionCount: number;
  info: SboSkillInfo;
}

export interface PillarScoreDetail {
  pillarId: string;
  code: string;
  name: string;
  title: string;
  score: number;
  maxScore: number;
  average: number;
  percentage: number;
  level: string;
  sboCodes: string[];
  info: SboPillarInfo;
}

export interface SboAssessmentResult {
  completedAt: string;
  totalScore: number; // 60..420
  totalMaxScore: number; // 420
  percentage: number;
  averageRating: number; // 1.00..7.00
  level: {
    tier: string;
    badge: string;
    title: string;
    summary: string;
    personaTitle: string;
  };
  sboScores: Record<string, SboScoreDetail>;
  sboList: SboScoreDetail[]; // sorted by SBO 1..12
  pillarScores: Record<string, PillarScoreDetail>;
  pillarList: PillarScoreDetail[];
  topStrengths: SboScoreDetail[];
  growthOpportunities: SboScoreDetail[];
  dominantPillar: PillarScoreDetail;
  answers: Record<number, number>;
}

export function calculateSboProfile(answers: Record<number, number> = {}): SboAssessmentResult {
  let totalScore = 0;
  const sboAccumulator: Record<string, { total: number; count: number }> = {};
  const pillarAccumulator: Record<string, { total: number; count: number }> = {};

  Object.keys(SBO_SKILLS).forEach((id) => {
    sboAccumulator[id] = { total: 0, count: 0 };
  });

  Object.keys(SBO_PILLARS).forEach((id) => {
    pillarAccumulator[id] = { total: 0, count: 0 };
  });

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const rawRating = answers[q.id] ?? 4;
    const itemScore = calculateItemScore(rawRating, q.isReverse);
    totalScore += itemScore;

    if (sboAccumulator[q.sboId]) {
      sboAccumulator[q.sboId].total += itemScore;
      sboAccumulator[q.sboId].count += 1;
    }

    if (pillarAccumulator[q.pillarId]) {
      pillarAccumulator[q.pillarId].total += itemScore;
      pillarAccumulator[q.pillarId].count += 1;
    }
  });

  const totalMaxScore = ASSESSMENT_QUESTIONS.length * 7; // 420
  const percentage = Math.round((totalScore / totalMaxScore) * 100);
  const averageRating = Number((totalScore / ASSESSMENT_QUESTIONS.length).toFixed(2));

  // Determine overall tier
  let levelTier = 'ระดับปานกลาง';
  let levelBadge = '🌱 วิศวกรสังคมผู้เริ่มต้น (Emerging Social Engineer)';
  let levelTitle = 'ผู้มีความพร้อมและกำลังสั่งสมประสบการณ์วิศวกรสังคม';
  let personaTitle = 'นักพัฒนาสังคมรุ่นใหม่ (Emerging Social Explorer)';
  let levelSummary = 'คุณมีรากฐานทักษะที่ดี พร้อมเปิดรับการฝึกฝนทักษะการตัดสินใจ การสื่อสาร และการลงมือปฏิบัติจริงเพื่อสร้างความเปลี่ยนแปลง';

  if (totalScore >= 360) {
    levelTier = 'ระดับยอดเยี่ยม';
    levelBadge = '🌟 สุดยอดวิศวกรสังคมนวัตกร (Master Social Engineer)';
    levelTitle = 'ผู้นำการเปลี่ยนแปลงและการสร้างนวัตกรรมสังคมชั้นเลิศ';
    personaTitle = 'ผู้นำนวัตกรรมสังคมเชิงยุทธศาสตร์ (Visionary Change Agent)';
    levelSummary = 'คุณมีสมรรถนะครบทั้ง 4 ด้าน: คิดวิเคราะห์เฉียบคม ประสานงานไร้รอยต่อ แก้ปัญหาอย่างสร้างสรรค์ และลงมือสร้างผลกระทบต่อสังคมอย่างยั่งยืน';
  } else if (totalScore >= 310) {
    levelTier = 'ระดับสูงมาก';
    levelBadge = '🚀 วิศวกรสังคมผู้ขับเคลื่อน (Active Social Innovator)';
    levelTitle = 'ผู้มีความพร้อมสูงในการขับเคลื่อนและพัฒนาชุมชน';
    personaTitle = 'นักคิดและนักประสานงานเชิงรุก (Agile Community Catalyst)';
    levelSummary = 'คุณมีจุดเด่นในการทำงานร่วมกับผู้อื่น พร้อมเผชิญหน้ากับความท้าทาย และสามารถต่อยอดทักษะการสร้างนวัตกรรมได้อย่างโดดเด่น';
  } else if (totalScore >= 250) {
    levelTier = 'ระดับดี';
    levelBadge = '🎯 วิศวกรสังคมผู้สร้างสรรค์ (Capable Social Changemaker)';
    levelTitle = 'ผู้มีศักยภาพรอบด้านและพร้อมพัฒนาสู่การเป็นผู้นำ';
    personaTitle = 'นักแก้ปัญหาและร่วมมือ (Collaborative Problem Solver)';
    levelSummary = 'คุณมีทักษะพื้นฐานที่ดีในหลายมิติ สามารถมุ่งเน้นเสริมทักษะเฉพาะด้าน เช่น การสื่อสารหรือการลงมือทำจริงให้ก้าวกระโดดยิ่งขึ้น';
  }

  // Calculate 12 SBO scores
  const sboScores: Record<string, SboScoreDetail> = {};
  const sboList: SboScoreDetail[] = [];

  Object.entries(SBO_SKILLS).forEach(([sboId, skillInfo]) => {
    const acc = sboAccumulator[sboId] || { total: 0, count: skillInfo.questionIds.length };
    const maxScore = acc.count * 7;
    const pct = maxScore > 0 ? Math.round((acc.total / maxScore) * 100) : 0;
    const avg = acc.count > 0 ? Number((acc.total / acc.count).toFixed(2)) : 0;

    let level = 'ระดับปานกลาง';
    if (pct >= 85) level = 'โดดเด่นเป็นพิเศษ';
    else if (pct >= 70) level = 'ระดับดีมาก';
    else if (pct >= 55) level = 'ระดับดี';
    else level = 'ควรพัฒนาเพิ่ม';

    const detail: SboScoreDetail = {
      sboId,
      code: skillInfo.code,
      number: skillInfo.number,
      name: skillInfo.name,
      nameEn: skillInfo.nameEn,
      pillarId: skillInfo.pillarId,
      pillarName: skillInfo.pillarName,
      score: acc.total,
      maxScore,
      average: avg,
      percentage: pct,
      level,
      questionCount: acc.count,
      info: skillInfo
    };

    sboScores[sboId] = detail;
    sboList.push(detail);
  });

  // Calculate 4 Pillar scores
  const pillarScores: Record<string, PillarScoreDetail> = {};
  const pillarList: PillarScoreDetail[] = [];

  Object.entries(SBO_PILLARS).forEach(([pId, pInfo]) => {
    const acc = pillarAccumulator[pId] || { total: 0, count: 0 };
    const maxScore = acc.count * 7;
    const pct = maxScore > 0 ? Math.round((acc.total / maxScore) * 100) : 0;
    const avg = acc.count > 0 ? Number((acc.total / acc.count).toFixed(2)) : 0;

    let level = 'ระดับปานกลาง';
    if (pct >= 85) level = 'โดดเด่นมาก';
    else if (pct >= 70) level = 'ระดับดีมาก';
    else if (pct >= 55) level = 'ระดับดี';
    else level = 'ควรพัฒนาเพิ่ม';

    const pDetail: PillarScoreDetail = {
      pillarId: pId,
      code: pInfo.code,
      name: pInfo.name,
      title: pInfo.title,
      score: acc.total,
      maxScore,
      average: avg,
      percentage: pct,
      level,
      sboCodes: pInfo.sboIds.map(id => SBO_SKILLS[id]?.code || id),
      info: pInfo
    };

    pillarScores[pId] = pDetail;
    pillarList.push(pDetail);
  });

  // Sort SBOs for top strengths & growth opportunities
  const sortedByScore = [...sboList].sort((a, b) => b.percentage - a.percentage);
  const topStrengths = sortedByScore.slice(0, 3);
  const growthOpportunities = sortedByScore.slice(-3).reverse();

  // Find dominant pillar
  const dominantPillar = [...pillarList].sort((a, b) => b.percentage - a.percentage)[0] || pillarList[0];

  return {
    completedAt: new Date().toISOString(),
    totalScore,
    totalMaxScore,
    percentage,
    averageRating,
    level: {
      tier: levelTier,
      badge: levelBadge,
      title: levelTitle,
      summary: levelSummary,
      personaTitle
    },
    sboScores,
    sboList,
    pillarScores,
    pillarList,
    topStrengths,
    growthOpportunities,
    dominantPillar,
    answers
  };
}

export interface AssessmentResult {
  completedAt: string;
  totalScore: number;
  totalMaxScore: number;
  percentage: number;
  averageRating: number;
  level: {
    tier: string;
    badge: string;
    title: string;
    summary: string;
  };
  dimensionScores: Record<string, {
    score: number;
    maxScore: number;
    average: number;
    percentage: number;
    level: string;
  }>;
  topStrengths: DimensionInfo[];
  growthOpportunities: DimensionInfo[];
  answers: Record<number, number>;
  sboProfile?: SboAssessmentResult;
}

export function evaluateAssessment(answers: Record<number, number>): AssessmentResult {
  const sboProfile = calculateSboProfile(answers);

  let totalScore = 0;
  const dimensionAccumulator: Record<string, { total: number; count: number }> = {};

  Object.keys(DIMENSIONS).forEach((dimId) => {
    dimensionAccumulator[dimId] = { total: 0, count: 0 };
  });

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const rawRating = answers[q.id] ?? 4;
    const itemScore = calculateItemScore(rawRating, q.isReverse);
    totalScore += itemScore;

    if (dimensionAccumulator[q.dimensionId]) {
      dimensionAccumulator[q.dimensionId].total += itemScore;
      dimensionAccumulator[q.dimensionId].count += 1;
    }
  });

  const totalMaxScore = ASSESSMENT_QUESTIONS.length * 7;
  const percentage = Math.round((totalScore / totalMaxScore) * 100);
  const averageRating = Number((totalScore / ASSESSMENT_QUESTIONS.length).toFixed(2));

  const dimensionScores: AssessmentResult['dimensionScores'] = {};
  const dimensionListWithScores: { dimId: string; percentage: number; average: number }[] = [];

  Object.entries(dimensionAccumulator).forEach(([dimId, data]) => {
    const maxScore = data.count * 7;
    const dimPercentage = maxScore > 0 ? Math.round((data.total / maxScore) * 100) : 0;
    const dimAvg = data.count > 0 ? Number((data.total / data.count).toFixed(2)) : 0;

    let dimLevel = 'ปานกลาง';
    if (dimPercentage >= 85) dimLevel = 'โดดเด่นเป็นพิเศษ';
    else if (dimPercentage >= 70) dimLevel = 'ระดับดีมาก';
    else if (dimPercentage >= 55) dimLevel = 'ระดับดี';
    else dimLevel = 'ควรพัฒนาเพิ่ม';

    dimensionScores[dimId] = {
      score: data.total,
      maxScore,
      average: dimAvg,
      percentage: dimPercentage,
      level: dimLevel
    };

    dimensionListWithScores.push({ dimId, percentage: dimPercentage, average: dimAvg });
  });

  dimensionListWithScores.sort((a, b) => b.percentage - a.percentage);

  const topStrengths = dimensionListWithScores
    .slice(0, 3)
    .map(item => DIMENSIONS[item.dimId])
    .filter(Boolean);

  const growthOpportunities = dimensionListWithScores
    .slice(-2)
    .reverse()
    .map(item => DIMENSIONS[item.dimId])
    .filter(Boolean);

  return {
    completedAt: sboProfile.completedAt,
    totalScore,
    totalMaxScore,
    percentage,
    averageRating,
    level: {
      tier: sboProfile.level.tier,
      badge: sboProfile.level.badge,
      title: sboProfile.level.title,
      summary: sboProfile.level.summary,
    },
    dimensionScores,
    topStrengths,
    growthOpportunities,
    answers,
    sboProfile
  };
}


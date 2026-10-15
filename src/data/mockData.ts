import { Course, BlogTopic, PeerStory, EventItem, Mentor, ForumPost, AchievementBadge, LeaderboardUser } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-ice-breaking',
    title: 'สร้างบทสนทนาด้วย Ice Breaking Card',
    slug: 'ice-breaking-card',
    description: 'เรียนรู้เทคนิคการละลายพฤติกรรมและการเปิดใจเพื่อสร้างบทสนทนาที่มีพลังและมีความหมาย ด้วยเครื่องมือ Ice Breaking Card สำหรับวิศวกรสังคม',
    longDescription: 'หลักสูตรเชิงปฏิบัติการเพื่อเสริมสร้างทักษะการเป็นผู้นำกระบวนการ (Facilitator) ผ่านการใช้การ์ด Ice Breaking ช่วยให้ผู้เข้าร่วมสามารถเปิดใจ แลกเปลี่ยนมุมมอง และสร้างบรรยากาศที่ปลอดภัยและสร้างสรรค์ในการทำงานกลุ่ม',
    category: 'กระบวนการกลุ่ม & Soft Skills',
    level: 'เริ่มต้น',
    durationHours: 4,
    lessonsCount: 3,
    rating: 5.0,
    studentsCount: 340,
    instructor: {
      name: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
      title: 'ผู้เชี่ยวชาญการพัฒนานวัตกรรมชุมชน UDRU',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    badge: 'กิจกรรมยอดนิยม',
    isFree: true,
    hasCertificate: true,
    status: 'published',
    scheduleType: 'flexible',
    durationLimitType: 'unlimited',
    createdAt: '15 ต.ค. 2569',
    modules: [
      {
        id: 'm-ice-1',
        title: 'ฐานที่ 1: การใช้การ์ดสร้างบทสนทนา',
        lessons: [
          {
            id: 'l-ice-1',
            title: 'บทนำ: ทำไมต้อง Ice Breaking และจิตวิทยาการเปิดใจ',
            durationMinutes: 15,
            contentType: 'article',
            contentDetails: 'การเปิดใจเป็นก้าวแรกที่สำคัญที่สุดในการทำงานร่วมกัน Ice Breaking Card ถูกออกแบบมาเพื่อทลายกำแพงความเงียบ โดยเริ่มจากคำถามที่ไม่ตัดสิน และเปิดโอกาสให้ทุกคนได้เล่าเรื่องราวของตนเอง',
            isLocked: false
          },
          {
            id: 'l-ice-2',
            title: 'วิดีโอสาธิต: เทคนิคการเปิดวงสนทนา 4 ระดับ',
            durationMinutes: 20,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            requiresVideoCompletion: true,
            isLocked: false
          },
          {
            id: 'l-ice-3',
            title: 'แบบทดสอบ: ความเข้าใจการเป็น Facilitator เบื้องต้น',
            durationMinutes: 15,
            contentType: 'quiz',
            isLocked: false
          }
        ]
      }
    ]
  },
  {
    id: 'course-social-engineer-intro',
    title: 'แนะนำตัวด้วยการ์ดวิศวกรสังคม',
    slug: 'intro-social-engineer-cards',
    description: 'ค้นหาตัวตนและสะท้อนทักษะ 4 แกนหลัก (นักคิด นักประสาน นักแก้ปัญหา นักสร้างนวัตกรรม) ผ่านการแนะนำตัวเชิงลึกด้วยการ์ดวิศวกรสังคม',
    longDescription: 'เครื่องมือสำคัญสำหรับนิสิตนักศึกษาวิศวกรสังคม ในการทำความรู้จักตนเองและเพื่อนร่วมทีมอย่างลึกซึ้งผ่านภาพและคีย์เวิร์ดทรงพลัง',
    category: 'วิศวกรสังคม UDRU',
    level: 'เริ่มต้น',
    durationHours: 3,
    lessonsCount: 3,
    rating: 4.95,
    studentsCount: 520,
    instructor: {
      name: 'อ. รุ่งอรุณ เมธาวี',
      title: 'ผู้เชี่ยวชาญด้านจิตวิทยาและการแนะแนว',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    badge: 'คอร์สแนะนำ',
    isFree: true,
    hasCertificate: true,
    status: 'published',
    scheduleType: 'flexible',
    durationLimitType: 'unlimited',
    createdAt: '14 ต.ค. 2569',
    modules: [
      {
        id: 'm-se-1',
        title: 'ฐานที่ 1: การ์ดสะท้อนพลัง 4 ทิศ',
        lessons: [
          {
            id: 'l-se-1',
            title: 'คู่มือการแนะนำตัวด้วยการ์ดวิศวกรสังคม',
            durationMinutes: 15,
            contentType: 'article',
            contentDetails: 'วิศวกรสังคมประกอบด้วย 4 บทบาทหลัก ได้แก่ นักคิด นักประสาน นักแก้ปัญหา และนักสร้างนวัตกรรม ในบทความนี้เราจะแนะนำวิธีการเลือกการ์ดที่สะท้อนจุดแข็งของตนเอง',
            isLocked: false
          },
          {
            id: 'l-se-2',
            title: 'วิดีโอตัวอย่าง: กรณีศึกษาการแนะนำตัวในเวทีชุมชน',
            durationMinutes: 20,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            requiresVideoCompletion: true,
            isLocked: false
          }
        ]
      }
    ]
  },
  {
    id: 'course-emotion-wheel',
    title: 'วงล้ออารมณ์',
    slug: 'emotion-wheel',
    description: 'การรู้เท่าทันอารมณ์และความรู้สึกของตนเองและผู้อื่นด้วย Emotion Wheel เพื่อการสื่อสารอย่างเข้าอกเข้าใจและมีประสิทธิภาพ',
    longDescription: 'วงล้ออารมณ์ (The Emotion Wheel) เป็นเครื่องมือทางจิตวิทยาที่ช่วยจำแนกความรู้สึกที่ซับซ้อนให้ชัดเจน ช่วยให้นักศึกษาสามารถระบุอารมณ์ จัดการความเครียด และสร้างความสัมพันธ์เชิงบวกในการทำงานร่วมกับผู้อื่น',
    category: 'จิตวิทยาและการพัฒนาตนเอง',
    level: 'เริ่มต้น',
    durationHours: 6,
    lessonsCount: 4,
    rating: 5.0,
    studentsCount: 0,
    instructor: {
      name: 'อ. รุ่งอรุณ เมธาวี',
      title: 'ผู้เชี่ยวชาญด้านจิตวิทยาและการแนะแนว',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    badge: 'ฉบับร่าง',
    isFree: true,
    hasCertificate: true,
    status: 'draft',
    scheduleType: 'flexible',
    durationLimitType: 'unlimited',
    createdAt: '15 ต.ค. 2569',
    modules: [
      {
        id: 'm-wheel-1',
        title: 'วงล้ออารมณ์',
        lessons: [
          {
            id: 'l-wheel-1',
            title: 'บทนำ: ทำความรู้จักวงล้ออารมณ์และระดับความรู้สึกลึกซึ้ง',
            durationMinutes: 20,
            contentType: 'article',
            contentDetails: 'อารมณ์พื้นฐานของมนุษย์ เช่น สุข เศร้า โกรธ กลัว มักมีอารมณ์ย่อยที่ซ่อนอยู่เบื้องหลัง การสำรวจวงล้ออารมณ์ช่วยให้เราเข้าใจตนเองและเข้าใจผู้อื่นอย่างแท้จริง',
            isLocked: false
          },
          {
            id: 'l-wheel-2',
            title: 'วิดีโอ: เวิร์กช็อปถอดรหัสความรู้สึกในสถานการณ์ขัดแย้ง',
            durationMinutes: 25,
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            requiresVideoCompletion: true,
            isLocked: false
          },
          {
            id: 'l-wheel-3',
            title: 'แบบทดสอบ: ประเมินการรู้เท่าทันอารมณ์ (Emotional Literacy Quiz)',
            durationMinutes: 15,
            contentType: 'quiz',
            isLocked: false
          }
        ]
      }
    ],
    quiz: {
      title: 'แบบทดสอบประเมินการรู้เท่าทันอารมณ์',
      passingScorePercent: 80,
      timeLimitMinutes: 15,
      questions: [
        {
          id: 1,
          question: 'เมื่อรู้สึก "หงุดหงิด" ลึกๆ แล้วอาจเกิดจากอารมณ์พื้นฐานใดในวงล้ออารมณ์?',
          options: [
            'ความสุข',
            'ความกลัว หรือ ความโกรธ ที่ไม่ได้รับการตอบสนอง',
            'ความเบื่อหน่าย',
            'ความกระตือรือร้น'
          ],
          correctOptionIndex: 1,
          explanation: 'ความหงุดหงิดมักเป็นอารมณ์ระดับทุติยภูมิที่ต่อยอดมาจากความกลัวหรือความโกรธ'
        }
      ]
    }
  },
  {
    id: 'course-1',
    title: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่ (Social Innovation for Community)',
    slug: 'social-innovation-udru',
    description: 'เรียนรู้กระบวนการแก้ปัญหาชุมชนอย่างลึกซึ้ง วิเคราะห์ถึงแก่นแท้ของปัญหา และลงมือปฏิบัติจริงแบบ "เกาให้ถูกที่คัน"',
    longDescription: 'หลักสูตรเรือธงของ มหาวิทยาลัยราชภัฏอุดรธานี ออกแบบมาเพื่อให้นักศึกษาทุกคณะได้ผสานศาสตร์ความรู้ (Multidisciplinary) ระดมทรัพยากร และสร้างโมเดลนวัตกรรมที่ตอบโจทย์วิถีชีวิตชุมชนท้องถิ่นภาคอีสานอย่างยั่งยืน',
    category: 'นวัตกรรมชุมชน',
    level: 'เริ่มต้น',
    durationHours: 12,
    lessonsCount: 8,
    rating: 4.9,
    studentsCount: 1420,
    instructor: {
      name: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
      title: 'ผู้เชี่ยวชาญการพัฒนานวัตกรรมชุมชน UDRU',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    badge: 'คอร์สแนะนำยอดนิยม',
    isFree: true,
    hasCertificate: true,
    status: 'published',
    scheduleType: 'flexible',
    durationLimitType: 'unlimited',
    createdAt: '10 ต.ค. 2569',
    modules: [
      {
        id: 'm1',
        title: 'โมดูลที่ 1: การสำรวจบริบทและความต้องการที่แท้จริงของชุมชน',
        lessons: [
          { id: 'l1', title: 'การถอดรหัสปัญหาท้องถิ่น: ไม่ใช่แค่ผิวน้ำแต่ลงถึงรากเหง้า', durationMinutes: 25 },
          { id: 'l2', title: 'เครื่องมือ Empathy Interview สำหรับลงพื้นที่จริง', durationMinutes: 30 }
        ]
      },
      {
        id: 'm2',
        title: 'โมดูลที่ 2: การผสานศาสตร์หลากหลาย (Multidisciplinary Synergy)',
        lessons: [
          { id: 'l3', title: 'เมื่อสายวิทย์ x สายศิลป์ x บริหารธุรกิจ รวมพลัง', durationMinutes: 35 },
          { id: 'l4', title: 'การสร้างต้นแบบนวัตกรรมชุมชนและทดสอบแบบ Lean Prototype', durationMinutes: 40 }
        ]
      }
    ],
    quiz: {
      title: 'แบบทดสอบประเมินสมรรถนะ: นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
      passingScorePercent: 80,
      timeLimitMinutes: 10,
      questions: [
        {
          id: 1,
          question: 'แนวคิดการแก้ปัญหาแบบ "เกาให้ถูกที่คัน" มีความหมายตรงกับข้อใดมากที่สุด?',
          options: [
            'การแจกงบประมาณให้ชาวบ้านนำไปใช้ตามใจชอบ',
            'การวิเคราะห์และเข้าใจรากเหง้าของปัญหาจริงก่อนลงมือทำอย่างตรงจุด',
            'การนำเทคโนโลยีราคาแพงจากต่างประเทศมาติดตั้งทันที',
            'การแก้ปัญหาเฉพาะหน้าตามที่เกิดข้อร้องเรียน'
          ],
          correctOptionIndex: 1,
          explanation: '"เกาให้ถูกที่คัน" หมายถึงการสืบค้นจนพบสาเหตุที่แท้จริง (Root Cause) แล้วบูรณาการองค์ความรู้แก้ปัญหาให้ตรงจุด ไม่ฉาบฉวย'
        },
        {
          id: 2,
          question: 'หัวใจสำคัญของการเรียนรู้แบบข้ามศาสตร์ (Multidisciplinary) คืออะไร?',
          options: [
            'นักศึกษาทุกคนต้องมีความรู้เท่ากันในทุกสาขาวิชา',
            'การนำจุดแข็งและมุมมองของแต่ละคณะมาร่วมต่อยอดแก้ปัญหาที่ซับซ้อน',
            'การทำงานคนเดียวเพื่อความคล่องตัวสูงสุด',
            'การปฏิเสธความรู้วิชาการเดิมทั้งหมด'
          ],
          correctOptionIndex: 1,
          explanation: 'ปัญหาชุมชนยุคใหม่มีความซับซ้อนเกินกว่าจะใช้ศาสตร์เดียว การรวมพลังข้ามคณะจึงตอบโจทย์ได้รอบด้าน'
        },
        {
          id: 3,
          question: 'ขั้นตอนใดควรเกิดขึ้นก่อนการระดมทรัพยากรลงสู่ชุมชน?',
          options: [
            'การทำสรุปรายงานผลโครงการล่วงหน้า',
            'การจัดงานแถลงข่าวเปิดตัวโครงการ',
            'การทำความเข้าใจบริบทและความต้องการเชิงลึกของคนในพื้นที่ (Empathy)',
            'การประกวดออกแบบโลโก้สินค้าชุมชน'
          ],
          correctOptionIndex: 2,
          explanation: 'การลงลึกทำความเข้าใจความต้องการและเสียงของชุมชน (Empathy & Field Analysis) เป็นก้าวแรกที่สำคัญที่สุด'
        },
        {
          id: 4,
          question: 'ข้อใดคือตัวอย่างของ "ต้นแบบนวัตกรรมชุมชนที่ยั่งยืน"?',
          options: [
            'โครงการที่ชุมชนสามารถบริหารจัดการต่อได้เองแม้เสร็จสิ้นโครงการวิจัย',
            'โครงการที่ต้องพึ่งพางบจากมหาวิทยาลัยตลอดเวลา',
            'โครงการที่มีเฉพาะอาจารย์และนักศึกษาทำ ชุมชนไม่มีส่วนร่วม',
            'โครงการที่มีเอกสารหนามากกว่า 500 หน้า'
          ],
          correctOptionIndex: 0,
          explanation: 'ความยั่งยืนเกิดขึ้นเมื่อชุมชนเป็นเจ้าของร่วมและสามารถขับเคลื่อนต่อเนื่องได้'
        }
      ]
    }
  },
  {
    id: 'course-2',
    title: 'AI & Digital Tools for Next-Gen Learning: ทักษะ AI พลิกโฉมการเรียนรู้',
    slug: 'ai-digital-tools-learning',
    description: 'ใช้ประโยชน์จาก AI และ Generative Tools ในการศึกษา วิจัย ออกแบบกิจกรรมการเรียนรู้ และนำเสนออย่างมืออาชีพ',
    longDescription: 'คอร์สปูพื้นฐานการประยุกต์ใช้ Prompt Engineering, Generative AI และเครื่องมือดิจิทัลยุคใหม่ เพื่อเพิ่มผลผลิตทางการเรียนรู้และการทำงานของคนรุ่นใหม่ (Gen Z)',
    category: 'เทคโนโลยีและ AI',
    level: 'เริ่มต้น',
    durationHours: 8,
    lessonsCount: 6,
    rating: 4.95,
    studentsCount: 2310,
    instructor: {
      name: 'ดร. กรกช สุวรรณรัตน์',
      title: 'อาจารย์ผู้ทรงคุณวุฒิด้านเทคโนโลยีสารสนเทศ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    badge: 'มาแรงที่สุด',
    isFree: true,
    hasCertificate: true,
    modules: [
      {
        id: 'm1',
        title: 'โมดูล 1: AI Prompting สำหรับการสืบค้นและระดมสมอง',
        lessons: [
          { id: 'l1', title: 'เขียนคำสั่ง AI ให้ได้ผลลัพธ์ระดับผู้เชี่ยวชาญ', durationMinutes: 20 },
          { id: 'l2', title: 'AI ช่วยสังเคราะห์รายงานและบทความวิชาการ', durationMinutes: 30 }
        ]
      }
    ],
    quiz: {
      title: 'แบบทดสอบวัดผล: AI & Generative Learning Tools',
      passingScorePercent: 75,
      timeLimitMinutes: 10,
      questions: [
        {
          id: 1,
          question: 'หลักการที่ดีในการเขียนคำสั่ง (Prompt) ให้ AI ทำงานได้แม่นยำคืออะไร?',
          options: [
            'เขียนให้สั้นที่สุดเท่าที่จะทำได้คำเดียวจบ',
            'ระบุบทบาท (Role), บริบท (Context), คำสั่งที่ชัดเจน (Task) และรูปแบบผลลัพธ์ (Format)',
            'พิมพ์ตัวพิมพ์ใหญ่ทั้งหมดเพื่อเน้นย้ำ',
            'คัดลอกคำถามจากข้อสอบโดยไม่ต้องให้บริบท'
          ],
          correctOptionIndex: 1,
          explanation: 'การกำหนด Persona, Context, Goal และ Output Format ทำให้ AI ตอบได้ตรงเป้าและมีคุณภาพสูงสุด'
        },
        {
          id: 2,
          question: 'ข้อควรระวังสำคัญที่สุดในการนำข้อมูลจาก AI ไปใช้งานทางวิชาการคืออะไร?',
          options: [
            'AI ตอบเร็วเกินไป',
            'ต้องตรวจสอบข้อเท็จจริง (Fact-checking) ป้องกันการเกิดข้อมูลบิดเบือน (Hallucination)',
            'AI ไม่สามารถสรุปข้อความภาษาไทยได้',
            'ต้องขออนุญาตก่อนเปิดหน้าเว็บ'
          ],
          correctOptionIndex: 1,
          explanation: 'Generative AI อาจสร้างข้อมูลที่ดูน่าเชื่อถือแต่ไม่ถูกต้อง จึงต้อง Cross-check ตรวจสอบแหล่งอ้างอิงเสมอ'
        }
      ]
    }
  },
  {
    id: 'course-3',
    title: 'Self-Discovery & Life Design: ถอดรหัสเป้าหมายและเส้นทางอาชีพในฝัน',
    slug: 'self-discovery-lifepath',
    description: 'เจาะลึก 4 องค์ประกอบชีวิต (หัว-แขน-ขา-หัวใจ) เพื่อค้นหาศักยภาพที่แท้จริงและวางแผนชีวิตทั้ง Plan A และ Plan B',
    longDescription: 'อ้างอิงกระบวนการออกแบบชีวิตแบบ Life Design Thinking ร่วมกับโมเดลการเรียนรู้ตลอดชีวิต มรภ.อุดรธานี',
    category: 'การพัฒนาตนเอง',
    level: 'ทุกระดับ',
    durationHours: 10,
    lessonsCount: 7,
    rating: 4.88,
    studentsCount: 1890,
    instructor: {
      name: 'อ. รุ่งอรุณ เมธาวี',
      title: 'ผู้เชี่ยวชาญด้านจิตวิทยาและการแนะแนวอาชีพ',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    badge: 'คอร์สสร้างแรงบันดาลใจ',
    isFree: true,
    hasCertificate: true,
    modules: [
      {
        id: 'm1',
        title: 'โมดูล 1: สำรวจตัวตนรอบด้าน 4 มิติ',
        lessons: [
          { id: 'l1', title: 'แยกแยะความฝัน ความถนัด และแรงขับเคลื่อนภายใน', durationMinutes: 25 },
          { id: 'l2', title: 'สำรวจข้อจำกัดและเปลี่ยนสภาพแวดล้อมให้เป็นพลัง', durationMinutes: 30 }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Mastering Board Games & Gamified Learning: พลังบอร์ดเกมเพื่อการเรียนรู้',
    slug: 'gamified-learning-boardgames',
    description: 'ออกแบบกระบวนการเรียนรู้ผ่านเกมและบอร์ดเกม เพื่อฝึกทักษะการคิดเชิงกลยุทธ์ การเจรจา และการทำงานเป็นทีม',
    longDescription: 'เปิดโลก Gamification ในห้องเรียนและชุมชน สร้างสื่อการเรียนรู้เชิงสร้างสรรค์ที่ทำให้ผู้เรียนสนุก ตื่นรู้ และลงมือทำจริง',
    category: 'เกมและการเรียนรู้',
    level: 'ปานกลาง',
    durationHours: 6,
    lessonsCount: 5,
    rating: 4.92,
    studentsCount: 980,
    instructor: {
      name: 'อ. นพดล ศักดิ์เจริญ',
      title: 'นักออกแบบการเรียนรู้ด้วยเกม',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
    badge: 'หลักสูตรเฉพาะทาง',
    isFree: false,
    price: 390,
    hasCertificate: true,
    modules: [
      {
        id: 'm1',
        title: 'โมดูล 1: แก่นแท้ของกลไกเกม (Game Mechanics)',
        lessons: [
          { id: 'l1', title: 'ออกแบบเป้าหมาย กฎเกณฑ์ และความสนุกในการเรียนรู้', durationMinutes: 25 }
        ]
      }
    ]
  }
];

export const INITIAL_BLOG_TOPICS: BlogTopic[] = [
  {
    id: 'blog-1',
    title: 'Daily Intention: เริ่มต้นวันใหม่อย่างมีเป้าหมายด้วย "การ์ดเจตจำนงพลังใจ"',
    category: 'การพัฒนาตนเอง & Soft Skills',
    tags: ['Daily Intention', 'การ์ดพลังใจ', 'Mindset', 'สติรู้ตัว', 'โค้ชเจ้ฝน'],
    ideasCount: 840,
    author: 'โค้ชเจ้ฝน (นงรัตน์ อิสโร)',
    authorRole: 'ผู้เชี่ยวชาญด้าน Soft Skills & Facilitator',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '1 วันที่แล้ว',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    content: 'คุณเคยรู้สึกไหมว่าในหลายๆ วัน ชีวิตเราไหลไปตามความเร่งรีบของตารางงานตั้งแต่เช้าจรดเย็น จนรู้สึกหมดพลังโดยไม่รู้ว่าได้ทำอะไรที่มีความหมายต่อใจตัวเองหรือยัง?\n\nแนวคิด "Daily Intention" หรือการตั้งเจตจำนงประจำวัน ไม่ใช่เพียงรายการสิ่งที่ต้องทำ (To-Do List) แต่คือการตั้งคำถามกับตัวเองอย่างลึกซึ้งว่า "วันนี้เราเลือกที่จะดำเนินชีวิตด้วยสภาวะจิตใจและท่าทีแบบไหน"\n\nในการทำงานของโค้ชเจ้ฝน เราได้ออกแบบชุดการ์ด Daily Intention ขึ้นมาเพื่อเป็นเครื่องมือฝึกสติในชีวิตประจำวัน เพียงสุ่มเลือกการ์ด 1 ใบในยามเช้า เช่น:\n• การฟังอย่างลึกซึ้ง (Deep Listening): วันนี้ฉันจะเปิดใจรับฟังผู้อื่นโดยไม่ตัดสิน\n• ความเมตตาต่อตนเอง (Self-Compassion): วันนี้ฉันจะใจดีกับตัวเองเมื่อมีสิ่งที่ไม่เป็นดั่งใจ\n• ความกล้าหาญ (Courage): วันนี้ฉันจะก้าวข้ามความกลัวและกล้าที่จะแสดงความคิดเห็น\n• ความเบิกบานและขอบคุณ (Joy & Gratitude): วันนี้ฉันจะมองหาแง่งามในสิ่งเล็กๆ รอบตัว\n\nเมื่อเรากำหนดเจตจำนงไว้ตั้งแต่เช้า การ์ดใบนั้นจะทำหน้าที่ประหนึ่งเข็มทิศประจำใจ เมื่อเจอสถานการณ์ท้าทาย เราจะสามารถดึงสติตัวเองกลับมาสู่เจตจำนงที่เราเลือกได้ทันที',
    likesCount: 428,
    isFeatured: true,
    views: 1240,
    inspireCount: 312,
    credits: 'ถอดบทเรียนจาก: fonfonwebsite.wixsite.com/nongrat-issaro-1/blog'
  },
  {
    id: 'blog-2',
    title: 'Street Strategy (ยุทธศาสตร์ข้างถนน): ถอดบทเรียนชีวิตประจำวัน สู่มุมมองเชิงกลยุทธ์',
    category: 'กระบวนการคิดและกลยุทธ์',
    tags: ['Street Strategy', 'ยุทธศาสตร์ข้างถนน', 'Critical Thinking', 'การปรับตัว', 'การตัดสินใจ'],
    ideasCount: 620,
    author: 'โค้ชเจ้ฝน (นงรัตน์ อิสโร)',
    authorRole: 'ที่ปรึกษากลยุทธ์ & Soft Skills Coach',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '3 วันที่แล้ว',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    content: 'คำว่า "กลยุทธ์" หรือ "ยุทธศาสตร์" มักถูกมองว่าเป็นเรื่องยากที่จำกัดอยู่เฉพาะในห้องประชุมผู้บริหารหรือตำราเล่มหนา แต่ความจริงแล้ว ยุทธศาสตร์ที่เฉียบคมและทรงพลังที่สุดมักซ่อนอยู่ในวิถีชีวิตริมทางและชีวิตประจำวันของเรา\n\n"Street Strategy หรือ ยุทธศาสตร์ข้างถนน" คือกระบวนการที่โค้ชเจ้ฝนชวนทุกคนฝึกสังเกตและถอดบทเรียนจากปรากฏการณ์จริง:\n1. การจับสัญญาณความเปลี่ยนแปลง (Sensing & Environmental Scanning): สังเกตว่าร้านค้าชุมชนปรับตัวอย่างไรเมื่อพฤติกรรมลูกค้าเปลี่ยน การจัดวางสินค้า และการใช้คำพูดที่สร้างความรู้สึกเป็นกันเอง\n2. การมองเห็นจุดเชื่อมโยง (Connecting the Dots): การผสานทรัพยากรที่มีอยู่อย่างจำกัดให้เกิดผลลัพธ์คุ้มค่าสูงสุด เช่นเดียวกับวิถีชีวิตชาวบ้านที่ใช้ภูมิปัญญาท้องถิ่นแก้ปัญหาเฉพาะหน้า\n3. ความยืดหยุ่นและคล่องตัว (Strategic Agility): เมื่อเกิดเหตุการณ์ไม่คาดฝัน การตัดสินใจที่ฉับไวและปรับแผนทันทีโดยไม่ยึดติดกับกรอบเดิม\n\nเมื่อเราฝึกมองชีวิตข้างถนนด้วยแว่นตายุทธศาสตร์ เราจะพัฒนาทักษะการคิดเชิงวิเคราะห์ (Analytical Thinking) และสามารถนำไปประยุกต์ใช้กับการออกแบบโครงการ การแก้ปัญหา และการทำงานร่วมกับผู้คนได้อย่างเป็นธรรมชาติ',
    likesCount: 385,
    isFeatured: true,
    views: 980,
    inspireCount: 245,
    credits: 'ถอดบทเรียนจาก: fonfonwebsite.wixsite.com/nongrat-issaro-1/blog'
  },
  {
    id: 'blog-3',
    title: 'เข้าใจสมอง 3 ส่วน (Triune Brain Theory) สู่การสื่อสารและการออกแบบการเรียนรู้ที่เข้าถึงใจ',
    category: 'จิตวิทยาและการเรียนรู้',
    tags: ['Triune Brain', 'สมอง 3 ส่วน', 'การเรียนรู้', 'จิตวิทยา', 'การสื่อสาร'],
    ideasCount: 512,
    author: 'โค้ชเจ้ฝน (นงรัตน์ อิสโร)',
    authorRole: 'ผู้เชี่ยวชาญด้านการออกแบบการเรียนรู้',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '5 วันที่แล้ว',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    content: 'เคยสงสัยไหมว่าทำไมหลายครั้งที่เราใช้เหตุผลและข้อมูลที่ถูกต้องทุกประการในการอธิบาย แต่อีกฝ่ายกลับมีท่าทีต่อต้าน ปิดรับ หรือตอบสนองด้วยอารมณ์ฉุนเฉียว?\n\nคำตอบทางวิทยาศาสตร์สมองอธิบายผ่านทฤษฎี "สมอง 3 ส่วน" (Triune Brain Theory):\n1. สมองสัตว์เลื้อยคลาน (Reptilian Brain): ควบคุมสัญชาตญาณความอยู่รอด (สู้ วิ่งหนี หรือนิ่งงัน - Fight, Flight, Freeze) ตอบสนองเร็วที่สุดและคอยระวังภัยตลอดเวลา\n2. สมองสัตว์เลี้ยงลูกด้วยนม (Limbic System): ศูนย์กลางของอารมณ์ ความรู้สึก ความผูกพัน ความไว้วางใจ และความปลอดภัยทางใจ\n3. สมองส่วนหน้า (Neocortex): สมองชั้นนอกสุดที่ทำหน้าที่คิดวิเคราะห์ ใช้เหตุผล ตรรกะ ความคิดสร้างสรรค์ และการวางแผนระยะยาว\n\nกฎทองของการจัดกระบวนการเรียนรู้และการสื่อสารคือ: ข้อมูลจะเดินทางขึ้นสู่สมองส่วนหน้า (Neocortex) ได้ก็ต่อเมื่อ สมองสัตว์เลื้อยคลานรู้สึกปลอดภัย และสมองส่วนอารมณ์รู้สึกเปิดใจและเป็นมิตรเสียก่อน\n\nหากผู้ฟังรู้สึกถูกคุกคาม ถูกตัดสิน หรือกลัวเสียหน้า สมองจะตัดสัญญาณไปที่โหมดเอาตัวรอดทันที ดังนั้น ในทุกคลาสของโค้ชเจ้ฝน การสร้าง "พื้นที่ปลอดภัย (Psychological Safety)" จึงเป็นขั้นตอนแรกที่สำคัญที่สุดเสมอ',
    likesCount: 495,
    isFeatured: true,
    views: 1450,
    inspireCount: 390,
    credits: 'ถอดบทเรียนจาก: fonfonwebsite.wixsite.com/nongrat-issaro-1/blog'
  },
  {
    id: 'blog-4',
    title: 'Heartflow Facilitation: ศิลปะการฟังด้วยหัวใจ (Deep Listening) เพื่อสร้างแรงบันดาลใจ',
    category: 'การเป็นกระบวนกรและการสื่อสาร',
    tags: ['Deep Listening', 'การฟังด้วยหัวใจ', 'Facilitation', 'พื้นที่ปลอดภัย', 'Engage to Inspire'],
    ideasCount: 730,
    author: 'โค้ชเจ้ฝน (นงรัตน์ อิสโร)',
    authorRole: 'Facilitator & ผู้ร่วมก่อตั้งกระบวนการเรียนรู้',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '1 สัปดาห์ที่แล้ว',
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    content: 'ในสังคมปัจจุบันที่ทุกคนต่างส่งเสียงและรีบแสดงความคิดเห็น ทักษะที่ทรงคุณค่าและสร้างพลังขับเคลื่อนได้มากที่สุดกลับกลายเป็นการ "ฟังด้วยหัวใจ" (Deep Listening)\n\nกระบวนการ Heartflow Facilitation ชวนเราฝึกการฟังใน 3 ระดับ:\n• Level 1: ฟังเพื่อเตรียมพูด (Internal Listening) - สนใจแต่เสียงในหัวตัวเองว่าเมื่อไหร่เขาจะพูดจบเพื่อเราจะได้แย้งหรือเสนอความคิดของเรา\n• Level 2: ฟังเพื่อจับใจความ (Focused Listening) - มุ่งจดจ่ออยู่กับคำพูด เนื้อหาสาระ และตรรกะของผู้พูด\n• Level 3: ฟังด้วยหัวใจและรับรู้สนามพลัง (Global & Empathic Listening) - ฟังจนสัมผัสได้ถึงอารมณ์ ความรู้สึก ความกังวล และความปรารถนาที่ซ่อนอยู่เบื้องหลังคำพูด\n\nเมื่อใครคนหนึ่งได้รับการรับฟังอย่างลึกซึ้งโดยไม่มีใครขัดจังหวะ ไม่รีบให้คำแนะนำ และไม่ตัดสิน ความมหัศจรรย์จะเกิดขึ้น ความอัดอั้นจะคลายตัว ผู้พูดจะเริ่มมองเห็นคำตอบในใจของตนเอง และความสัมพันธ์จะก้าวข้ามไปสู่ความร่วมมือที่แท้จริง',
    likesCount: 520,
    isFeatured: true,
    views: 1680,
    inspireCount: 420,
    credits: 'ถอดบทเรียนจาก: fonfonwebsite.wixsite.com/nongrat-issaro-1/blog'
  },
  {
    id: 'blog-5',
    title: 'ปลดล็อกศักยภาพเยาวชน: วิธีช่วยเด็กๆ ค้นพบจุดแข็ง (Strengths) และตัวตนที่แท้จริง',
    category: 'การพัฒนาตนเอง & Soft Skills',
    tags: ['ค้นพบจุดแข็ง', 'Strengths', 'เยาวชน', 'Self-Discovery', 'Soft Skills'],
    ideasCount: 415,
    author: 'โค้ชเจ้ฝน (นงรัตน์ อิสโร)',
    authorRole: 'โค้ชพัฒนาศักยภาพเด็กและเยาวชน',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '1 สัปดาห์ที่แล้ว',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    content: 'บ่อยครั้งที่ระบบการศึกษาและค่านิยมสังคมพยายามวัดคุณค่าของเด็กด้วยมาตรฐานเดียวกัน จนทำให้เด็กที่มีศักยภาพเฉพาะด้านรู้สึกว่าตนเอง "ไม่เก่งพอ" หรือขาดความมั่นใจ\n\nในการทำกระบวนการค้นพบจุดแข็ง (Strengths-based Coaching) ของโค้ชเจ้ฝน เราให้ความสำคัญกับการมองเห็น "เพชรที่ซ่อนอยู่ในตัวเด็ก":\n1. ปรับมุมมองจาก "ซ่อมจุดอ่อน" มาเป็น "ต่อยอดจุดแข็ง": การมุ่งแก้แต่จุดอ่อนจะทำให้เด็กกลายเป็นคนธรรมดา แต่การทุ่มเทพัฒนาจุดแข็งจะสร้างความเป็นเลิศ\n2. ใช้เครื่องมือสะท้อนตัวตน: เช่น การใช้การ์ดสะท้อนคุณลักษณะ (Character Cards) ให้เพื่อนและครูช่วยกันสะท้อนสิ่งที่พวกเขาชื่นชมในตัวเด็ก\n3. พื้นที่ลงมือปฏิบัติจริง: เปิดโอกาสให้เด็กได้ลงมือทำโครงการที่ตอบโจทย์ความสนใจของเขา เพื่อสัมผัสกับสภาวะลื่นไหล (Flow State)\n\nเมื่อเด็กได้ตระหนักรู้ในจุดแข็งของตนเอง แววตาของเขาจะเปลี่ยนไป ความภาคภูมิใจในตนเอง (Self-Esteem) จะถูกสร้างขึ้นจากภายใน ซึ่งจะเป็นเกราะคุ้มกันจิตใจที่แข็งแกร่งที่สุดในวันที่เขาต้องเผชิญกับอุปสรรคในอนาคต',
    likesCount: 462,
    views: 1120,
    inspireCount: 295,
    credits: 'ถอดบทเรียนจาก: fonfonwebsite.wixsite.com/nongrat-issaro-1/blog'
  },
  {
    id: 'blog-6',
    title: 'AAR (After Action Review): เครื่องมือสะท้อนคิดเพื่อการเติบโตอย่างก้าวกระโดด',
    category: 'การถอดบทเรียนและพัฒนาตนเอง',
    tags: ['AAR', 'After Action Review', 'การถอดบทเรียน', 'Continuous Learning', 'Growth Mindset'],
    ideasCount: 390,
    author: 'โค้ชเจ้ฝน (นงรัตน์ อิสโร)',
    authorRole: 'ผู้เชี่ยวชาญด้าน Soft Skills & Facilitator',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '2 สัปดาห์ที่แล้ว',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    content: 'เรามักได้ยินว่า "ประสบการณ์คือครูที่ดีที่สุด" แต่ความเป็นจริงคือ ประสบการณ์ที่ผ่านไปโดยไม่ได้ถูกไตร่ตรอง อาจกลายเป็นเพียงความเคยชินเดิมๆ\n\nการทำ After Action Review (AAR) คือเครื่องมือสะท้อนคิด (Reflection) ที่เปลี่ยนทุกกิจกรรม การทำงาน และแม้กระทั่งความผิดพลาด ให้กลายเป็นปัญญาเพื่อการก้าวต่อไป โดยใช้ 4 คำถามหลัก:\n1. เป้าหมายตั้งต้นของเราคืออะไร? (What was our goal?)\n2. สิ่งที่เกิดขึ้นจริงในทางปฏิบัติคืออะไร? (What actually happened?)\n3. อะไรคือสาเหตุที่ทำให้ผลลัพธ์ตรงหรือต่างจากเป้าหมาย? (Why did it happen?)\n4. จากบทเรียนนี้ ในครั้งต่อไปเราจะรักษาอะไรไว้ และจะพัฒนาปรับปรุงอะไรให้ดียิ่งขึ้น? (What will we do differently next time?)\n\nหัวใจสูงสุดของ AAR คือ "วัฒนธรรมที่ไม่กล่าวโทษใคร (No Blame Culture)" เราไม่ได้มองหาว่าใครผิด แต่เรากำลังมองหาว่าระบบหรือวิธีการใดที่จะช่วยให้ทีมเติบโตไปด้วยกันได้อย่างยั่งยืน',
    likesCount: 375,
    views: 940,
    inspireCount: 230,
    credits: 'ถอดบทเรียนจาก: fonfonwebsite.wixsite.com/nongrat-issaro-1/blog'
  }
];

export const INITIAL_PEER_STORIES: PeerStory[] = [
  {
    id: 'story-1',
    title: 'จากเด็กไม่กล้าพูด สู่ผู้นำทีมโครงการลงพื้นที่แก้ปัญหาน้ำเสียชุมชน',
    authorName: 'ณภัทร วงศ์เจริญ (เต้)',
    authorFaculty: 'คณะวิทยาศาสตร์ สาขาสิ่งแวดล้อม',
    authorYear: 'ปี 3 รุ่น 4',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    careerTrack: 'นวัตกรพัฒนาชุมชน',
    content: 'ตอนปี 1 ผมเคยคิดว่าการเรียนแค่ในตำราและสอบให้ผ่านก็พอแล้ว จนได้เข้าร่วมโครงการที่เปิดให้จับกลุ่มกับเพื่อนต่างคณะ ได้ทั้งเพื่อนสาขาบัญชี นิเทศ และครุศาสตร์ มาร่วมกันสำรวจชุมชนจริง ความรู้สึกที่เห็นผลงานเราช่วยชาวบ้านได้จริง ทำให้ผมรู้ว่านี่คือสิ่งที่อยากทำในชีวิต\n\nกระบวนการทำงานเริ่มจากการรับฟังอย่างตั้งใจ โดยไม่ตัดสินปัญหาล่วงหน้า เราลงไปคลุกคลีกับชาวบ้านจนค้นพบว่าปัญหาน้ำเสียเกิดจากเศษตะกอนจากแปลงผัก จึงช่วยกันทำระบบดักกรองชีวภาพแบบเรียบง่ายแต่ได้ผลเกินคาด',
    keyTakeaway: 'อย่ากลัวที่จะเริ่มพูดคุยกับเพื่อนต่างคณะ ความคิดเห็นที่ต่างกันคือจุดเริ่มต้นของสิ่งใหม่เสมอ',
    date: '28 กันยายน 2026',
    likes: 142,
    inspireCount: 86,
    cheerCount: 56,
    views: 890,
    commentsCount: 18,
    tags: ['สิ่งแวดล้อม', 'ผู้นำเยาวชน', 'พัฒนาชุมชน'],
    comments: [
      {
        id: 'sc-1',
        authorName: 'วรินทร ศรีสุนทร',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        authorRole: 'นักศึกษารุ่น 5',
        content: 'อ่านแล้วมีพลังมากเลยค่ะ พี่เต้ ตอนนี้กลุ่มหนูก็กำลังเตรียมลงพื้นที่ชุมชนรอบมหาลัยเหมือนกัน ได้เทคนิคการฟังแบบไม่ตัดสินไปใช้แน่นอนค่ะ',
        createdAt: '1 วันที่แล้ว',
        likes: 5,
        sticker: '🌟 สุดยอด',
        isUsed: true
      },
      {
        id: 'sc-2',
        authorName: 'ผศ.ดร. นันทิยา กิตติคุณ',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
        authorRole: 'อาจารย์ที่ปรึกษาโครงการ',
        content: 'เห็นการเติบโตของเต้และทีมแล้วภูมิใจมากครับ จากวันแรกที่ไม่กล้าจับไมค์พูด วันนี้เป็นผู้นำสร้างประโยชน์ให้ชุมชนได้จริง ชื่นชมครับ',
        createdAt: '2 วันที่แล้ว',
        likes: 8,
        sticker: '🎉 ได้แรงบันดาลใจ'
      }
    ]
  },
  {
    id: 'story-2',
    title: 'ใช้ทักษะกราฟิกช่วยชาวบ้านขายของออนไลน์ ยอดขายโต 300%',
    authorName: 'กานต์ธิดา โชคประสิทธิ์ (มิ้นท์)',
    authorFaculty: 'คณะวิทยาการจัดการ สาขาการตลาดดิจิทัล',
    authorYear: 'ปี 4 รุ่น 3',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    careerTrack: 'เทคโนโลยี & สื่อสร้างสรรค์',
    content: 'ชุมชนผ้าทอย้อมครามมีของดีระดับพรีเมียม แต่ขาดการสื่อสารที่ตรงใจคนรุ่นใหม่ ทีมของเราจึงเข้าไปช่วยออกแบบเรื่องราว (Storytelling) ปรับแพ็กเกจจิ้ง และเปิด TikTok Shop ให้คุณยายสอนเทคนิคการทอ ตอนนี้ออเดอร์ล้นจนผลิตแทบไม่ทัน\n\nการพาคุณยายมาไลฟ์สดกลายเป็นไวรัล เพราะคนดูสัมผัสได้ถึงความจริงใจและภูมิปัญญาดั้งเดิม ทำให้ผ้าครามกลายเป็นสินค้าทันสมัยที่วัยรุ่นอยากอุดหนุน',
    keyTakeaway: 'ทักษะที่มีค่าที่สุด ไม่ใช่แค่เทคโนโลยีสูงส่ง แต่คือความเข้าใจหัวอกของคนที่เขาต้องการความช่วยเหลือ',
    date: '25 กันยายน 2026',
    likes: 245,
    inspireCount: 162,
    cheerCount: 83,
    views: 1420,
    commentsCount: 32,
    tags: ['การตลาดชุมชน', 'TikTokShop', 'ผ้าครามอุดร'],
    comments: [
      {
        id: 'sc-3',
        authorName: 'ธนกฤต วิทยานุกูล',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        authorRole: 'นักศึกษาคณะวิทยาการจัดการ',
        content: 'ชอบเคสนี้มากครับ การเชื่อมโยงภูมิปัญญาท้องถิ่นเข้ากับแพลตฟอร์มของคนรุ่นใหม่ทำให้เห็นภาพการนำทักษะมาใช้จริงชัดเจนเลย',
        createdAt: '3 วันที่แล้ว',
        likes: 12,
        sticker: '💡 ไอเดียแจ่มมาก'
      }
    ]
  },
  {
    id: 'story-3',
    title: 'เปลี่ยนความชอบเล่นเกม สู่การออกแบบเกมการศึกษาให้โรงเรียนชนบท',
    authorName: 'พีรดนย์ ศรีสุข (อาร์ต)',
    authorFaculty: 'คณะครุศาสตร์ สาขาคอมพิวเตอร์ศึกษา',
    authorYear: 'ปี 3 รุ่น 4',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    careerTrack: 'ศึกษาศาสตร์ & แนะแนว',
    content: 'ผมเคยโดนว่าว่าติดเกม แต่อาจารย์เปิดโอกาสให้นำกลไกเกมมาประยุกต์ทำบอร์ดเกมสอนวิทยาศาสตร์ให้น้องๆ ประถม ผลคือเด็กๆ แย่งกันเล่นและคะแนนสอบดีขึ้นอย่างเห็นได้ชัด\n\nเราออกแบบระบบการ์ดภารกิจที่จำลองวัฏจักรชีวิตของแมลงในท้องถิ่น เด็กๆ จะได้เรียนรู้ผ่านการวางแผนและเล่นร่วมกับเพื่อนอย่างสนุกสนาน',
    keyTakeaway: 'ทุก Passion ของเรามีคุณค่า ถ้าเราหาวิธีเชื่อมโยงมันเพื่อสร้างประโยชน์ให้ผู้อื่น',
    date: '20 กันยายน 2026',
    likes: 198,
    inspireCount: 124,
    cheerCount: 74,
    views: 1105,
    commentsCount: 24,
    tags: ['Gamification', 'ครุศาสตร์', 'บอร์ดเกม'],
    comments: []
  },
  {
    id: 'story-4',
    title: 'Smart Farming ชุมชน: นำเซนเซอร์ IoT ไปช่วยแปลงผักอินทรีย์ของกลุ่มแม่บ้าน',
    authorName: 'อภิสิทธิ์ วงศ์ปัญญา (โอ๊ค)',
    authorFaculty: 'คณะเทคโนโลยี สาขาเกษตรศาสตร์ดิจิทัล',
    authorYear: 'ปี 4 รุ่น 3',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    careerTrack: 'เกษตรปลอดภัย & สิ่งแวดล้อม',
    content: 'เกษตรกรในชุมชนมักประสบปัญหาการให้น้ำไม่สม่ำเสมอและต้นทุนค่าไฟสูง ทีมเราจึงนำบอร์ดไมโครคอนโทรลเลอร์ราคาประหยัดมาต่อกับเซนเซอร์วัดความชื้นในดิน ตั้งเวลารดน้ำผ่านสมาร์ทโฟน ช่วยลดค่าน้ำได้ 40% และผลผลิตงามขึ้นสม่ำเสมอ',
    keyTakeaway: 'เทคโนโลยีที่ดีไม่จำเป็นต้องแพง แต่อยู่ที่ความเข้าใจง่ายและตอบโจทย์วิถีชีวิตจริงของชาวบ้าน',
    date: '18 กันยายน 2026',
    likes: 176,
    inspireCount: 110,
    cheerCount: 66,
    views: 940,
    commentsCount: 15,
    tags: ['SmartFarm', 'IoT', 'เกษตรอินทรีย์'],
    comments: []
  },
  {
    id: 'story-5',
    title: 'พื้นที่ปลอดภัยในรั้วมหาวิทยาลัย: ก่อตั้งกลุ่มรับฟังความรู้สึกลดความเครียดเพื่อนนักศึกษา',
    authorName: 'ชนิกานต์ วัฒนดำรงค์ (ฟ้า)',
    authorFaculty: 'คณะมนุษยศาสตร์ สาขาจิตวิทยาการให้คำปรึกษา',
    authorYear: 'ปี 3 รุ่น 4',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    careerTrack: 'ศึกษาศาสตร์ & แนะแนว',
    content: 'หลายคนคิดว่าการแก้ปัญหาเน้นแค่เรื่องกายภาพ แต่สุขภาพใจของเพื่อนๆ ก็นับเป็นเรื่องเร่งด่วน พวกเราจึงจัดตั้งกลุ่ม "ฟังด้วยหัวใจ" เปิดรับฟังเรื่องกังวลใจทั้งเรื่องเรียน อนาคต และความสัมพันธ์ โดยมีอาจารย์คอยให้คำปรึกษาหนุนหลัง',
    keyTakeaway: 'การฟังอย่างลึกซึ้งโดยไม่รีบให้คำแนะนำ เป็นของขวัญที่เยียวยาจิตใจมนุษย์ได้อย่างทรงพลังที่สุด',
    date: '14 กันยายน 2026',
    likes: 280,
    inspireCount: 195,
    cheerCount: 85,
    views: 1680,
    commentsCount: 41,
    tags: ['สุขภาพจิต', 'พื้นที่ปลอดภัย', 'MentalHealth'],
    comments: []
  },
  {
    id: 'story-6',
    title: 'ปั้นแบรนด์ท่องเที่ยวชุมชนริมหนองประจักษ์ ผ่านคลิปสั้นและการเล่าเรื่องเชิงวัฒนธรรม',
    authorName: 'กิตติศักดิ์ พรหมมาศ (นนท์)',
    authorFaculty: 'คณะนิเทศศาสตร์ สาขาภาพยนตร์และดิจิทัลมีเดีย',
    authorYear: 'ปี 2 รุ่น 5',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    careerTrack: 'เทคโนโลยี & สื่อสร้างสรรค์',
    content: 'จังหวัดของเรามีเสน่ห์ทางวัฒนธรรมและอาหารพื้นถิ่นซ่อนอยู่เพียบ ผมใช้กล้องมือถือกับโดรนตัวเล็กๆ ถ่ายทอดมุมมอง Unseen ของตลาดเช้าและวิถีคนริมหนองประจักษ์ มียอดชมสะสมใน TikTok กว่าล้านวิว ช่วยดึงดูดนักท่องเที่ยวเข้าชุมชนอย่างยั่งยืน',
    keyTakeaway: 'มุมมองที่เราเห็นชินตา อาจเป็นเรื่องน่าอัศจรรย์สำหรับคนอื่น จงใช้สายตาแห่งความรักถ่ายทอดบ้านเกิดของเรา',
    date: '10 กันยายน 2026',
    likes: 310,
    inspireCount: 220,
    cheerCount: 90,
    views: 2250,
    commentsCount: 53,
    tags: ['หนองประจักษ์', 'เที่ยวอุดร', 'ShortVideo'],
    comments: []
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: 'Workshop: ถอดรหัสปัญหาเชิงพื้นที่ สู่โมเดลธุรกิจเพื่อสังคม (Social Hackathon)',
    type: 'Onsite',
    date: '15 ตุลาคม 2026',
    time: '09:00 - 16:30 น.',
    location: 'หอประชุมใหญ่ อาคารเฉลิมพระเกียรติฯ มหาวิทยาลัยราชภัฏอุดรธานี',
    speaker: 'รศ.ดร. นันทิยา และทีมที่ปรึกษา',
    speakerTitle: 'ผู้อำนวยการศูนย์นวัตกรรมเพื่อการพัฒนาท้องถิ่น',
    seatsTotal: 120,
    seatsBooked: 98,
    category: 'เวิร์กช็อป & แฮกกาธอน',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
    description: 'ร่วมระดมสมองข้ามคณะ 2 วันเต็ม ปั้นไอเดียนวัตกรรมแก้ปัญหาจริงในจังหวัดอุดรธานี ชิงทุนสนับสนุนเพื่อลงมือทำจริงมูลค่ารวมกว่า 100,000 บาท',
    tags: ['Hackathon', 'มีเกียรติบัตร', 'อาหารกลางวันฟรี']
  },
  {
    id: 'event-2',
    title: 'Live Webinar: Life Design Clinic วางแผนชีวิตในยุค AI Disrupt',
    type: 'Online',
    date: '22 ตุลาคม 2026',
    time: '19:00 - 21:00 น.',
    location: 'Zoom Meeting & ถ่ายทอดสดผ่านเว็บไซต์ LifePath Space',
    speaker: 'อ. รุ่งอรุณ เมธาวี & ทีมวิทยากร',
    speakerTitle: 'ผู้เชี่ยวชาญการออกแบบอาชีพและทักษะแห่งอนาคต',
    seatsTotal: 500,
    seatsBooked: 412,
    category: 'สัมมนาออนไลน์',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    description: 'เรียนรู้วิธีสำรวจตัวเอง เจาะลึกตลาดแรงงานอนาคต และตั้งเป้าหมายชีวิตแบบ Agile ที่ปรับตัวได้กับทุกสถานการณ์',
    tags: ['ออนไลน์', 'ถาม-ตอบสด', 'ดาวน์โหลดสไลด์']
  },
  {
    id: 'event-3',
    title: 'ตลาดนัดนวัตกรรมชุมชนและผลงานนักศึกษา แฟร์ 2026',
    type: 'Hybrid',
    date: '5 พฤศจิกายน 2026',
    time: '10:00 - 18:00 น.',
    location: 'ลานกิจกรรมหน้าหอสมุดกลาง UDRU & Virtual Showcase',
    speaker: 'ตัวแทนนักศึกษา 12 ทีม',
    speakerTitle: 'ผู้นำเสนอผลงานนวัตกรรมชุมชน',
    seatsTotal: 300,
    seatsBooked: 185,
    category: 'นิทรรศการ',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    description: 'สัมผัสผลงานจริง ชิม ช็อป ร่วมกิจกรรมเวิร์กช็อปงานฝีมือ และรับฟังเรื่องเล่าสร้างแรงบันดาลใจจากเพื่อนๆ',
    tags: ['นิทรรศการ', 'ของรางวัล', 'เข้าชมฟรี']
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
    academicTitle: 'อาจารย์ & หัวหน้าฝ่ายนวัตกรรมชุมชน',
    expertise: ['นวัตกรรมสังคม', 'การวางแผนโครงการ', 'การแก้ไขปัญหาเชิงพื้นที่', 'การทำงานเป็นทีม'],
    department: 'คณะมนุษยศาสตร์และสังคมศาสตร์ UDRU',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    quote: 'ทุกปัญหาในชุมชนมีทางออกเสมอ เมื่อเราตั้งต้นด้วยการรับฟังอย่างลึกซึ้งและจริงใจ',
    rating: 4.95,
    availableDays: ['จันทร์', 'พุธ', 'ศุกร์'],
    availableSlots: ['13:00 - 14:00', '14:30 - 15:30', '16:00 - 17:00']
  },
  {
    id: 'mentor-2',
    name: 'อ. รุ่งอรุณ เมธาวี',
    academicTitle: 'นักจิตวิทยาการปรึกษา & ผู้เชี่ยวชาญการแนะแนวเส้นทางชีวิต',
    expertise: ['ความเครียดการเรียน', 'ค้นหาตัวเอง', 'การออกแบบชีวิต (Life Design)', 'ความสัมพันธ์'],
    department: 'ศูนย์ให้คำปรึกษาและสุขภาวะนักศึกษา UDRU',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    quote: 'ที่นี่คือพื้นที่ปลอดภัยของคุณ ไม่มีคำตัดสิน มีเพียงพื้นที่รับฟังและช่วยกันคลี่คลาย',
    rating: 5.0,
    availableDays: ['อังคาร', 'พฤหัสบดี', 'เสาร์'],
    availableSlots: ['10:00 - 11:00', '13:30 - 14:30', '15:30 - 16:30']
  },
  {
    id: 'mentor-3',
    name: 'ดร. กรกช สุวรรณรัตน์',
    academicTitle: 'อาจารย์ผู้ทรงคุณวุฒิด้านเทคโนโลยีดิจิทัลและการวิจัยประยุกต์',
    expertise: ['เทคโนโลยี AI', 'การเตรียมตัวสู่โลกการทำงาน', 'การทำวิจัยข้ามศาสตร์', 'สตาร์ทอัพ'],
    department: 'คณะวิทยาศาสตร์และเทคโนโลยี UDRU',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    quote: 'อย่ากลัวเทคโนโลยี แต่จงเรียนรู้ที่จะควบคุมและใช้มันเพื่อสร้างคุณค่าให้สังคม',
    rating: 4.92,
    availableDays: ['จันทร์', 'พฤหัสบดี'],
    availableSlots: ['09:30 - 10:30', '14:00 - 15:00', '17:00 - 18:00']
  },
  {
    id: 'mentor-4',
    name: 'อ. นพดล ศักดิ์เจริญ',
    academicTitle: 'ผู้เชี่ยวชาญด้าน Gamification & การพัฒนาสื่อการเรียนรู้',
    expertise: ['การออกแบบกิจกรรม', 'ภาวะผู้นำ', 'ความคิดสร้างสรรค์', 'การสื่อสารนำเสนอ'],
    department: 'คณะครุศาสตร์ UDRU',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    quote: 'การเรียนรู้ที่ดีที่สุด คือการเรียนรู้ที่เต็มไปด้วยเสียงหัวเราะและการลงมือทดลอง',
    rating: 4.88,
    availableDays: ['พุธ', 'ศุกร์'],
    availableSlots: ['11:00 - 12:00', '15:00 - 16:00']
  }
];

export const CAREER_DATABASE = [
  {
    title: 'นักพัฒนานวัตกรรมสังคม (Social Innovation Specialist)',
    category: 'นวัตกรรม & ชุมชน',
    matchTraits: ['ชอบแก้ปัญหา', 'ทำงานร่วมกับผู้คน', 'คิดนอกกรอบ', 'ใส่ใจสังคม'],
    environment: 'พื้นที่ชุมชน ร่วมกับองค์กรพัฒนาเอกชน สถาบันการศึกษา หรือเทศบาลท้องถิ่น',
    description: 'เชื่อมโยงปัญหาของชุมชนกับองค์ความรู้และเทคโนโลยีสมัยใหม่ เพื่อสร้างบริการหรือผลิตภัณฑ์ที่ยั่งยืน'
  },
  {
    title: 'นักออกแบบการเรียนรู้ยุคใหม่ (Learning Experience Designer - LXD)',
    category: 'การศึกษา & เทคโนโลยี',
    matchTraits: ['ชอบแบ่งปัน', 'เข้าใจจิตวิทยาผู้เรียน', 'ใช้สื่อดิจิทัลเก่ง', 'คิดอย่างเป็นระบบ'],
    environment: 'สถาบันการศึกษา บริษัท EdTech หรือฝ่ายพัฒนาบุคลากรในองค์กรชั้นนำ',
    description: 'ออกแบบหลักสูตร เกม และกิจกรรมการเรียนรู้ที่กระตุ้นให้ผู้เรียนเกิดแรงบันดาลใจและพัฒนาสมรรถนะจริง'
  },
  {
    title: 'ผู้จัดการโครงการพัฒนาชุมชน (Community Project Manager)',
    category: 'การบริหารจัดการ',
    matchTraits: ['การวางแผน', 'การเจรจาต่อรอง', 'การสื่อสารข้ามศาสตร์', 'ความเป็นผู้นำ'],
    environment: 'โครงการพัฒนาจังหวัด หน่วยงานรัฐบาล หรือมูลนิธิเพื่อการพัฒนา',
    description: 'บริหารงบประมาณ ทีมงาน และกำหนดการของโครงการเพื่อส่งมอบผลลัพธ์ที่จับต้องได้ให้แก่ท้องถิ่น'
  },
  {
    title: 'นักพัฒนาเนื้อหาและสื่อสารองค์กรเพื่อสังคม (Impact Content Creator)',
    category: 'สื่อสารมวลชน & ครีเอทีฟ',
    matchTraits: ['เล่าเรื่องเก่ง', 'สร้างสรรค์สื่อดิจิทัล', 'จับประเด็นไว', 'เข้าถึงคนรุ่นใหม่'],
    environment: 'เอเจนซี่โฆษณา ช่องทางออนไลน์อิสระ หรือสตูดิโอสื่อสร้างสรรค์',
    description: 'นำเสนอเรื่องราวของคนตัวเล็กตัวน้อยและประเด็นสังคมให้กลายเป็นไวรัลที่สร้างความตระหนักรู้และการเปลี่ยนแปลง'
  },
  {
    title: 'นักวิเคราะห์ข้อมูลและเทคโนโลยีการเรียนรู้ (EdTech Data Analyst)',
    category: 'ข้อมูล & เทคโนโลยี',
    matchTraits: ['ชอบตัวเลขและสถิติ', 'คิดวิเคราะห์เชิงตรรกะ', 'ใช้ AI คล่อง', 'สนใจพฤติกรรมมนุษย์'],
    environment: 'บริษัทสตาร์ทอัพเทคโนโลยี องค์กรวิจัย หรือศูนย์นวัตกรรมดิจิทัล',
    description: 'วิเคราะห์แนวโน้มการเรียนรู้เพื่อปรับปรุงระบบการศึกษาให้ตอบโจทย์ผู้เรียนเฉพาะบุคคล (Personalized Learning)'
  }
];

export const FAQS = [
  {
    q: 'แพลตฟอร์มการเรียนรู้ มหาวิทยาลัยราชภัฏอุดรธานี คืออะไร?',
    a: 'เป็นพื้นที่การจัดการเรียนรู้แบบใหม่ที่เปิดโอกาสให้นักศึกษาทุกคณะได้มารวมพลังข้ามศาสตร์ (Multidisciplinary) ลงมือสำรวจและแก้ปัญหาเชิงพื้นที่ของชุมชนท้องถิ่นอย่างแท้จริง ผ่านกระบวนการคิดวิเคราะห์ให้ถึงแก่นแท้แห่งสาเหตุ แล้วระดมทรัพยากรแก้ไขแบบ "เกาให้ถูกที่คัน"'
  },
  {
    q: 'ใครสามารถเรียนคอร์สและใช้งานแพลตฟอร์มนี้ได้บ้าง?',
    a: 'นักศึกษา มรภ.อุดรธานี ทุกชั้นปี ทุกคณะ รวมถึงนักเรียนมัธยมศึกษาตอนปลาย ครู อาจารย์ และประชาชนทั่วไปที่สนใจพัฒนาทักษะชีวิต ทักษะการทำงาน และออกแบบเส้นทางชีวิตของตนเอง สามารถลงทะเบียนใช้งานได้ฟรีทันที'
  },
  {
    q: 'การทำแบบประเมิน "ออกแบบเส้นทางชีวิต" ได้อะไรบ้าง?',
    a: 'คุณจะได้ทบทวนตนเองรอบด้าน 4 มิติ (หัว-แขน-ขา-หัวใจ) ระบบจะประมวลผลการ์ดบุคลิกภาพเฉพาะตัว แนะนำอาชีพที่เหมาะสมพร้อมคะแนนความแมตช์ และช่วยคุณร่างแผนหลัก (Plan A) ร่วมกับแผนสำรอง (Plan B) พร้อมส่งออกเป็นเอกสารสรุปส่วนตัวได้'
  },
  {
    q: 'ระบบออกใบประกาศนียบัตร (Certificate) ทำงานอย่างไร?',
    a: 'เมื่อผู้เรียนศึกษาบทเรียนครบตามเกณฑ์ และทำแบบทดสอบประจำหลักสูตรผ่านเกณฑ์คะแนน (ตั้งแต่ 75-80% ขึ้นไป) ระบบจะสร้างใบรับรองอิเล็กทรอนิกส์พร้อมรหัสตรวจสอบและ QR Code เฉพาะบุคคลให้ดาวน์โหลดและพิมพ์ได้ทันที'
  },
  {
    q: 'การจองคิว "ช่องทางพักใจ" ปลอดภัยและเป็นความลับหรือไม่?',
    a: 'ปลอดภัย 100% ข้อมูลการปรึกษาทุกเรื่องจะถูกเก็บเป็นความลับสูงสุดตามจรรยาบรรณวิชาชีพการให้คำปรึกษา นักศึกษาสามารถเลือกนัดหมายวันเวลาที่สะดวก และพูดคุยแบบตัวต่อตัวผ่านระบบวิดีโอคอลบนเว็บหรือห้องพบปะได้'
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'forum-1',
    title: 'เทคนิคการทำ Empathy Interview ลงพื้นที่จริงในชุมชนแบบชาวบ้านไม่เกร็ง',
    content: 'สวัสดีเพื่อนๆ ทุกคนครับ พอดีทีมเรากำลังเตรียมลงพื้นที่ อ.กุมภวาปี เพื่อสำรวจปัญหาขยะและสิ่งแวดล้อม อยากสอบถามรุ่นพี่ว่ามีคำถามหรือเทคนิคการละลายพฤติกรรมอย่างไรบ้าง ที่ทำให้ชาวบ้านรู้สึกสบายใจและเปิดใจเล่าปัญหาที่แท้จริงให้ฟังครับ?',
    category: 'นวัตกรรมชุมชน',
    courseId: 'course-1',
    courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
    tags: ['ลงพื้นที่', 'Empathy', 'การมีส่วนร่วม', 'กุมภวาปี'],
    authorName: 'ณภัทร วงศ์เจริญ (เต้)',
    authorRole: 'นักศึกษา ปี 3',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    createdAt: '3 ชั่วโมงที่แล้ว',
    likes: 18,
    views: 142,
    isPinned: true,
    comments: [
      {
        id: 'c1',
        authorName: 'ผศ.ดร. ธีรภัทร วัฒนโกศล',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        authorRole: 'อาจารย์ที่ปรึกษา',
        content: 'เริ่มต้นด้วยการถามสารทุกข์สุกดิบเรื่องดินฟ้าอากาศ ผลผลิตการเกษตรก่อนเสมอครับ อย่าเพิ่งเปิดสมุดจดทันที ให้เน้นฟังด้วยใจ นั่งระดับเดียวกับชาวบ้าน แล้วค่อยๆ เชื่อมโยงเข้าประเด็น',
        createdAt: '2 ชั่วโมงที่แล้ว',
        likes: 9
      },
      {
        id: 'c2',
        authorName: 'กานต์ธิดา (มิ้นท์)',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        authorRole: 'นักศึกษารุ่น 3',
        content: 'พกขนมหรือของฝากเล็กๆ น้อยๆ ไปฝากคุณตาคุณยายด้วยนะคะ เวลาคุยให้ช่วยทำงานบ้านเล็กๆ น้อยๆ เช่น ช่วยเด็ดพริก คุยไปด้วยเพลินมากค่ะ ได้ข้อมูลลึกซึ้งแน่นอน!',
        createdAt: '1 ชั่วโมงที่แล้ว',
        likes: 7
      }
    ]
  },
  {
    id: 'forum-2',
    title: 'ชวนระดมไอเดีย: นำ AI Generative มาช่วยชาวบ้านออกแบบลายผ้าครามร่วมสมัย',
    content: 'อยากชวนเพื่อนๆ ต่างคณะ มาร่วมกันทดลองใช้ Midjourney / Stable Diffusion สร้างลวดลายผ้าครามที่ยังคงเอกลักษณ์บ้านเชียงและลายดั้งเดิม แต่ใส่ลูกเล่นสไตล์ Minimal สำหรับเจาะกลุ่ม Gen Z เพื่อนๆ มี Prompt หรือมุมมองอย่างไรบ้างครับ?',
    category: 'เทคโนโลยีและ AI',
    courseId: 'course-2',
    courseTitle: 'AI & Digital Tools for Next-Gen Learning',
    tags: ['AI', 'ผ้าคราม', 'บ้านเชียง', 'Cross-Disciplinary'],
    authorName: 'พีรดนย์ (อาร์ต)',
    authorRole: 'นักศึกษา ครุศาสตร์',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    createdAt: 'เมื่อวานนี้',
    likes: 24,
    views: 280,
    comments: [
      {
        id: 'c3',
        authorName: 'ชลธิชา (เนย)',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        authorRole: 'สาขาการตลาด',
        content: 'น่าสนใจมากเลยค่ะ ทางการตลาดมองว่าถ้าทำเป็นสินค้าแนว Tote Bag หรือหมวก Bucket ลายผ้าครามโมเดิร์น วัยรุ่นซื้อแน่นอน เดี๋ยวขอร่วมทีมด้วยนะคะ!',
        createdAt: 'เมื่อวานนี้',
        likes: 5
      }
    ]
  },
  {
    id: 'forum-3',
    title: 'สอบถามข้อสอบท้ายคอร์ส นวัตกรรมสังคม ข้อ 2 เรื่อง Multidisciplinary',
    content: 'มีข้อสงสัยตรงจุดที่อธิบายความแตกต่างระหว่างการทำงานแบบแยกส่วน กับการบูรณาการข้ามศาสตร์ อาจารย์เน้นย้ำประเด็นไหนในการทำแบบทดสอบให้ได้คะแนนเต็มครับ?',
    category: 'คำถามจากหลักสูตร',
    courseId: 'course-1',
    courseTitle: 'นวัตกรรมสังคมและการแก้ปัญหาเชิงพื้นที่',
    tags: ['แบบทดสอบ', 'Cer.', 'ข้อสอบ'],
    authorName: 'ศุภกิตติ์ มงคล',
    authorRole: 'นักศึกษา วิทยาการจัดการ',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    createdAt: '2 วันที่แล้ว',
    likes: 8,
    views: 95,
    comments: []
  }
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-1',
    title: 'นักออกแบบเส้นทางชีวิต',
    description: 'ทำแบบประเมินตนเองครบ 4 มิติ (หัว แขน ขา ใจ) และสร้างแผนที่ชีวิต',
    icon: '🧭',
    xpReward: 100,
    category: 'lifepath',
    unlocked: true,
    unlockedAt: '30 ก.ย. 2026'
  },
  {
    id: 'badge-2',
    title: 'ผู้พิชิตหลักสูตรแรก',
    description: 'สำเร็จการศึกษาคอร์สออนไลน์ 1 คอร์ส และสอบผ่านเกณฑ์รับใบประกาศนียบัตร',
    icon: '🎓',
    xpReward: 200,
    category: 'course',
    unlocked: true,
    unlockedAt: '30 ก.ย. 2026'
  },
  {
    id: 'badge-3',
    title: 'นักจุดประกายไอเดีย',
    description: 'ตั้งกระทู้หรือแบ่งปันประเด็นความรู้ในเว็บบอร์ดชุมชน',
    icon: '💡',
    xpReward: 50,
    category: 'community',
    unlocked: true,
    unlockedAt: '30 ก.ย. 2026'
  },
  {
    id: 'badge-4',
    title: 'ผู้เชี่ยวชาญ AI & นวัตกรรม',
    description: 'ทำแบบทดสอบ AI & Digital Tools ได้คะแนนเต็ม 100%',
    icon: '⚡',
    xpReward: 150,
    category: 'course',
    unlocked: false
  },
  {
    id: 'badge-5',
    title: 'หัวใจเพื่อชุมชน (Community Hero)',
    description: 'ลงทะเบียนและเข้าร่วมกิจกรรมเวิร์กช็อปลงพื้นที่จริง',
    icon: '🌱',
    xpReward: 120,
    category: 'event',
    unlocked: false
  },
  {
    id: 'badge-6',
    title: 'เพื่อนช่วยเพื่อน (Top Contributor)',
    description: 'ตอบคำถามและให้คำแนะนำที่มีประโยชน์แก่เพื่อนๆ ในคอมมูนิตี้เกิน 5 ครั้ง',
    icon: '🤝',
    xpReward: 100,
    category: 'community',
    unlocked: false
  }
];

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'usr-top-1',
    name: 'กานต์ธิดา โชคประสิทธิ์ (มิ้นท์)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    faculty: 'คณะวิทยาการจัดการ',
    level: 5,
    levelTitle: 'ปรมาจารย์แห่งการเรียนรู้ (Master)',
    xp: 2450,
    completedCoursesCount: 4,
    badgesCount: 6
  },
  {
    rank: 2,
    id: 'usr-top-2',
    name: 'ณภัทร วงศ์เจริญ (เต้)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    faculty: 'คณะวิทยาศาสตร์ สาขาสิ่งแวดล้อม',
    level: 4,
    levelTitle: 'ผู้นำการเปลี่ยนแปลง (Changemaker)',
    xp: 1980,
    completedCoursesCount: 3,
    badgesCount: 5
  },
  {
    rank: 3,
    id: 'usr-top-3',
    name: 'พีรดนย์ ศรีสุข (อาร์ต)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    faculty: 'คณะครุศาสตร์',
    level: 4,
    levelTitle: 'ผู้นำการเปลี่ยนแปลง',
    xp: 1720,
    completedCoursesCount: 3,
    badgesCount: 4
  },
  {
    rank: 4,
    id: 'usr-top-4',
    name: 'ชลธิชา มั่นคง (เนย)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    faculty: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
    level: 3,
    levelTitle: 'นักนวัตกรสร้างสรรค์',
    xp: 1350,
    completedCoursesCount: 2,
    badgesCount: 3
  },
  {
    rank: 5,
    id: 'usr-top-5',
    name: 'ธนภูมิ สุขเกษม',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    faculty: 'คณะเทคโนโลยีการเกษตร',
    level: 3,
    levelTitle: 'นักนวัตกรสร้างสรรค์',
    xp: 1120,
    completedCoursesCount: 2,
    badgesCount: 3
  }
];


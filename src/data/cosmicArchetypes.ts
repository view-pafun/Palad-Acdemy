export interface CosmicPower {
  title: string;
  titleEn: string;
  description: string;
  iconName: string;
}

export interface CosmicArchetype {
  id: 'star_gazers' | 'gravity_weavers' | 'signal_broadcasters' | 'mad_alchemists';
  nameEn: string;
  nameTh: string;
  fullName: string;
  theme: string;
  themeEn: string;
  callsign: string;
  quote: string;
  personalityRole: string; // นักคิด, นักประสาน, นักสื่อสาร, นักสร้างนวัตกรรม
  personalityRoleEn: string; // Thinker, Coordinator, Communicator, Innovator
  description: string;
  imageUrl: string;
  colorHex: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  hashtags: string[];
  workPersona: string;
  careerGuide: string;
  recommendedRoles: string[];
  workaholismIndex: number;
  perfectionismLevel: number;
  cosmicLuckyCharm: string;
  luckyCharmDesc: string;
  besties: {
    id: string;
    name: string;
    relation: string;
    imageUrl: string;
  }[];
  colleagues: {
    id: string;
    name: string;
    relation: string;
    imageUrl: string;
  }[];
  powers: CosmicPower[];
}

export const COSMIC_ARCHETYPES: Record<string, CosmicArchetype> = {
  star_gazers: {
    id: 'star_gazers',
    nameEn: 'The Star Gazers',
    nameTh: 'เผ่าพันธุ์นักดูดาวผู้มองทะลุจักรวาล',
    fullName: 'The Star Gazers / เผ่าพันธุ์นักดูดาวผู้มองทะลุจักรวาล',
    theme: 'The Core Theoretician / นักคิดวงโคจรลึก',
    themeEn: 'The Core Theoretician',
    callsign: 'ผู้กำหนดทิศทางแห่งกาแล็กซี่',
    quote: 'มองเห็นความเป็นไปได้นับล้านในความว่างเปล่า',
    personalityRole: 'นักคิดวงโคจรลึก',
    personalityRoleEn: 'The Core Theoretician',
    description:
      'คุณคือจอมวางแผนแห่งมิติเวลา ผู้ไม่ได้แค่นั่งมองความว่างเปล่าบนท้องฟ้า แต่กำลังคำนวณโครงสร้างของจักรวาลอยู่ในหัวตลอดเวลา คุณมีสติปัญญาอันแหลมคมในการแยกแยะข้อเท็จจริงออกจากความรู้สึก ตัดสินใจอย่างเที่ยงตรงด้วยเหตุผลเชิงตรรกะและหลักฐานที่ผ่านการวิเคราะห์มาอย่างถี่ถ้วน พร้อมทั้งใช้จินตนาการระดับทะลุขอบจักรวาลในการสร้างนวัตกรรมใหม่เพื่อแก้ปัญหาที่ยากที่สุด',
    imageUrl: 'https://s.imgz.io/2026/10/16/67bc0cb2bd72edae2aad213bc83b1b3c819fec653f409d7f.png',
    colorHex: '#F59E0B',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    badgeBg: 'bg-amber-400 text-slate-950',
    badgeText: 'text-amber-600',
    hashtags: ['#DeepThinker', '#LogicFirst', '#GalaxyArchitect', '#FactDriven'],
    workPersona:
      'สุขุม ลุ่มลึก มองภาพรวมได้กว้างไกลหลายปีแสง วิเคราะห์ข้อมูลและตรรกะซับซ้อนได้อย่างเฉียบแหลม เป็นเสาหลักด้านการตัดสินใจที่มีหลักฐานรองรับเสมอ',
    careerGuide:
      'เหมาะกับงานวิเคราะห์ข้อมูลเชิงลึก การวางกลยุทธ์องค์กร การวิจัยพัฒนาวิทยาศาสตร์และเทคโนโลยี และสถาปัตยกรรมระบบขั้นสูง',
    recommendedRoles: ['นักวิจัยนวัตกรรม', 'Data Scientist / Analyst', 'นักวางแผนยุทธศาสตร์', 'System Architect'],
    workaholismIndex: 89,
    perfectionismLevel: 94,
    cosmicLuckyCharm: 'Cosmic Telescope',
    luckyCharmDesc: 'มองทะลุความวุ่นวาย เห็นโครงสร้างที่ซ่อนอยู่ และค้นหาทิศทางใหม่ ในความไม่แน่นอน',
    besties: [
      {
        id: 'creator',
        name: 'นักสร้างสรรค์',
        relation: 'เด่นไอเดียใหม่ และมุมมองใหม่ๆ',
        imageUrl: 'https://s.imgz.io/2026/10/14/-Riri02b8d1b6394c178a.png',
      },
      {
        id: 'explorer',
        name: 'นักสำรวจ',
        relation: 'ชอบลองสิ่งใหม่ๆ ไม่ยึดติดกรอบ',
        imageUrl: 'https://s.imgz.io/2026/10/14/ba489060c24880e5b963df571946dc8fcb2b3d1e49bc3f42.png',
      },
      {
        id: 'think_different',
        name: 'นักคิดต่าง',
        relation: 'มองโลกในมุมที่ แตกต่างและท้าทาย',
        imageUrl: 'https://s.imgz.io/2026/10/14/fbce02d787aa493ed617a36f3238fb2fa43a53d80deeeb8e.png',
      },
    ],
    colleagues: [
      {
        id: 'balancer',
        name: 'นักสมดุล',
        relation: 'ช่วยให้ทุกไอเดีย ละเอียดรอบด้าน',
        imageUrl: 'https://s.imgz.io/2026/10/14/fbce02d787aa493ed617a36f3238fb2fa43a53d80deeeb8e.png',
      },
      {
        id: 'analyst',
        name: 'นักวิเคราะห์',
        relation: 'เสริมมุมมองลึก และทำให้ข้อตกลงชัดเจน',
        imageUrl: 'https://s.imgz.io/2026/10/14/-Riri02b8d1b6394c178a.png',
      },
      {
        id: 'doer',
        name: 'นักลงมือทำ',
        relation: 'เปลี่ยนไอเดียบนสมุด ให้เกิดขึ้นจริง',
        imageUrl: 'https://s.imgz.io/2026/10/14/ba489060c24880e5b963df571946dc8fcb2b3d1e49bc3f42.png',
      },
    ],
    powers: [
      {
        title: 'เลนส์กรองคลื่นอารมณ์',
        titleEn: 'Emotional Interference Shield',
        description:
          'ท่ามกลางความวุ่นวายและโกลาหล คุณคือคนที่สงบที่สุดบนยาน เพราะคุณสามารถแยกแยะ "ข้อเท็จจริง" ออกจาก "คลื่นอารมณ์" ได้อย่างเด็ดขาด คุณมองโลกและปัญหาด้วยสายตาอันเที่ยงตรงเหมือนกล้องโทรทรรศน์อวกาศที่ไม่ถูกบดบังด้วยหมอกควัน ทำให้ทุกการตัดสินใจของคุณเป็นกลาง แม่นยำ และแก้ปัญหาได้อย่างตรงจุดเสมอ',
        iconName: 'Shield',
      },
      {
        title: 'เข็มทิศนำทางระดับวงโคจร',
        titleEn: 'Precision Navigation Decision',
        description:
          'คุณไม่เคยปล่อยให้ยานพุ่งชนอุกกาบาตด้วยความหุนหันพลันแล่น ทุกก้าวที่คุณเลือกผ่านการคำนวณปัจจัย ความเสี่ยง และผลกระทบที่จะเกิดขึ้นในอีกหลายปีแสงข้างหน้าอย่างรอบคอบ การตัดสินใจของคุณมี "พิกัดและหลักฐาน" รองรับเสมอ ลูกเรือทุกคนจึงมอบความไว้วางใจให้คุณเป็นผู้นำทางและสถาปนิกผู้กำหนดทิศทางแห่งกาแล็กซี่',
        iconName: 'Compass',
      },
      {
        title: 'ถอดรหัสความลับจักรวาล',
        titleEn: 'Deep Space Analytics',
        description:
          'หัวใจสำคัญของคุณคือการวิเคราะห์เชิงเหตุผลตามหลักวิทยาศาสตร์ คุณหลงใหลในการขุดคุ้ยรายละเอียดลึกซึ้ง มองเห็นแบบแผน (Pattern) ในชุดข้อมูลหรือตรรกะอันซับซ้อนที่คนอื่นมองว่าไร้ระเบียบ ทำให้คุณสามารถคลี่คลายปริศนาที่ซับซ้อนของจักรวาลและองค์กรได้อย่างมีประสิทธิภาพ',
        iconName: 'Search',
      },
      {
        title: 'สมองกลสร้างนวัตกรรมข้ามมิติ',
        titleEn: 'Quantum Problem Solving',
        description:
          'นอกจากตรรกะอันเป๊ะปังแล้ว คุณยังมีจินตนาการระดับทะลุมิติ เมื่อเจอวิกฤตที่ไม่มีคู่มือการแก้ปัญหาเขียนไว้ คุณคือคนแรกที่มองเห็นความเป็นไปได้นับล้านในความว่างเปล่า และคิดค้นทฤษฎีหรือนวัตกรรมใหม่ๆ มาผ่าทางตัน สร้างสรรค์ผลงานที่โดดเด่นจนทุกคนต้องทึ่ง',
        iconName: 'Cpu',
      },
      {
        title: 'เครื่องแปลสัญญาณกาแล็กซี่',
        titleEn: 'Cosmic Fact Translator',
        description:
          'แม้มองเห็นภาพกว้างที่ไกลกว่าคนอื่นหลายปีแสง แต่คุณมีความสามารถพิเศษในการแปลข้อมูลและทฤษฎีอันยากยิ่ง ให้กลายเป็นภาษาที่เข้าใจง่าย คุณสามารถอธิบายเหตุผลเบื้องหลังของการตัดสินใจให้ทีมงานเห็นภาพชัดเจน สร้างความเชื่อมั่น และพาทุกคนมุ่งหน้าสู่เป้าหมายเดียวกันได้อย่างมั่นคง',
        iconName: 'Radio',
      },
    ],
  },

  gravity_weavers: {
    id: 'gravity_weavers',
    nameEn: 'The Gravity Weavers',
    nameTh: 'เผ่าพันธุ์ผู้ถักทอแรงโน้มถ่วง',
    fullName: 'The Gravity Weavers / เผ่าพันธุ์ผู้ถักทอแรงโน้มถ่วง',
    theme: 'The Cosmic Diplomat / นักเชื่อมโยงดาวเคราะห์',
    themeEn: 'The Cosmic Diplomat',
    callsign: 'ทูตสัมพันธไมตรีแห่งกาแล็กซี่',
    quote: 'การเชื่อมโยงความต่าง คือพลังที่ยิ่งใหญ่ที่สุดในการสร้างความเป็นหนึ่งเดียว',
    personalityRole: 'นักประสาน',
    personalityRoleEn: 'Coordinator',
    description:
      'คุณคือ นักประสาน (Coordinator) คุณเป็นผู้ที่มีความเข้าใจและเคารพในความหลากหลาย ไม่ว่าจะเป็นวัฒนธรรม วิถีชีวิต หรือภูมิหลังของผู้คน คุณพร้อมเปิดใจรับฟังและเรียนรู้จากความแตกต่างเหล่านั้น นอกจากนี้ คุณยังมีจุดเด่นในการสร้างความร่วมมือในทีม เป็นผู้ที่พร้อมจะลงมือช่วยเหลือและสนับสนุนผู้อื่น เพื่อให้ทีมก้าวไปสู่เป้าหมายร่วมกันได้อย่างมีพลังและยั่งยืน',
    imageUrl: 'https://s.imgz.io/2026/10/14/-Riri02b8d1b6394c178a.png',
    colorHex: '#059669',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-900 text-emerald-100',
    badgeText: 'text-emerald-600',
    hashtags: ['#EmpathyGravity', '#CosmicHarmonizer', '#TeamBridge', '#CultureBeacon'],
    workPersona:
      'เข้าอกเข้าใจผู้อื่นอย่างลึกซึ้ง ไกล่เกลี่ยความขัดแย้งได้อย่างละมุนละม่อม สร้างบรรยากาศการทำงานที่อบอุ่น ปลอดภัย และดึงศักยภาพของทุกคนมารวมกันเป็นหนึ่งเดียว',
    careerGuide:
      'เหมาะกับงานบริหารจัดการความสัมพันธ์บุคคล ประสานงานโครงการข้ามสายงาน ชุมชนสัมพันธ์ และการพัฒนาทรัพยากรมนุษย์',
    recommendedRoles: ['ผู้จัดการโครงการ (Project Manager)', 'นักประสานงานชุมชน', 'People Operations / HR', 'นักเจรจาไกล่เกลี่ย'],
    workaholismIndex: 82,
    perfectionismLevel: 86,
    cosmicLuckyCharm: 'บีคอนลูกแก้วปรับจูนแรงโน้มถ่วง (Gravity Sphere)',
    luckyCharmDesc: 'สร้างสนามพลังความอบอุ่นและดึงดูดความร่วมมืออันราบรื่น',
    besties: [
      {
        id: 'signal_broadcasters',
        name: 'The Signal Broadcasters',
        relation: 'คู่หูสื่อสารเปิดใจ',
        imageUrl: 'https://s.imgz.io/2026/10/14/fbce02d787aa493ed617a36f3238fb2fa43a53d80deeeb8e.png',
      },
      {
        id: 'star_gazers',
        name: 'The Star Gazers',
        relation: 'คู่หูเสาหลักตรรกะ',
        imageUrl: 'https://i.postimg.cc/ydKhknmL/xele-ynn-xy-bn-dwng-c-nthr-s-hel-xng.png',
      },
    ],
    colleagues: [
      {
        id: 'mad_alchemists',
        name: 'The Mad Alchemists',
        relation: 'ผู้ช่วยจัดระเบียบไอเดีย',
        imageUrl: 'https://s.imgz.io/2026/10/14/ba489060c24880e5b963df571946dc8fcb2b3d1e49bc3f42.png',
      },
    ],
    powers: [
      {
        title: 'เครือข่ายสนามโน้มถ่วงเชื่อมกาแล็กซี่',
        titleEn: 'Interstellar Gravity Mesh',
        description:
          'เชื่อมประสานความแตกต่างทางวัฒนธรรมและความคิด ให้กลายเป็นพลังขับเคลื่อนเดียวกัน',
        iconName: 'Network',
      },
      {
        title: 'คลื่นเรโซแนนซ์ความเข้าอกเข้าใจ',
        titleEn: 'Empathy Resonance Frequency',
        description:
          'จับคลื่นอารมณ์และสภาพจิตใจของลูกเรือ เพื่อฟื้นฟูและสร้างบรรยากาศที่อบอุ่น ปลอดภัย',
        iconName: 'HeartHandshake',
      },
      {
        title: 'สะพานเชื่อมแรงดึงดูด',
        titleEn: 'Gravitational Bridge Builder',
        description:
          'ผสานความขัดแย้งและสร้างข้อตกลงร่วมกันด้วยความยุติธรรมและสร้างสรรค์',
        iconName: 'Scale',
      },
      {
        title: 'เครื่องขยายพลังความร่วมมือ',
        titleEn: 'Synergy Core Amplifier',
        description:
          'กระตุ้นจุดแข็งของลูกเรือแต่ละดวงดาว เพื่อรวมกันสร้างผลลัพธ์ที่ยิ่งใหญ่เกินขีดจำกัด',
        iconName: 'Zap',
      },
    ],
  },

  signal_broadcasters: {
    id: 'signal_broadcasters',
    nameEn: 'The Signal Broadcasters',
    nameTh: 'เผ่าพันธุ์ผู้ส่งคลื่นความถี่ทะลุมิติ',
    fullName: 'The Signal Broadcasters / เผ่าพันธุ์ผู้ส่งคลื่นความถี่ทะลุมิติ',
    theme: 'The Galactic Empath / ผู้ส่งสารแห่งละอองดาว',
    themeEn: 'The Galactic Empath',
    callsign: 'ผู้สื่อสารแห่งพายุสุริยะ',
    quote: 'เสียงที่จริงใจและหัวใจที่เปิดกว้าง สามารถข้ามผ่านความเงียบงันของจักรวาลได้เสมอ',
    personalityRole: 'นักสื่อสาร',
    personalityRoleEn: 'Communicator',
    description:
      'คุณคือ นักสื่อสาร (Communicator) คุณเป็นผู้ฟังที่ยอดเยี่ยม สามารถรับฟังความคิดเห็นที่แตกต่างได้อย่างเปิดใจและเป็นกลาง โดยไม่ด่วนตัดสิน คุณยังมีความสามารถในการบริหารจัดการอารมณ์ของตนเองได้เป็นอย่างดี สามารถจัดการกับความเครียดและแรงกดดันได้อย่างมีสติ พร้อมที่จะปรับเปลี่ยนมุมมองเพื่อรับมือกับสถานการณ์ต่าง ๆ ได้อย่างยืดหยุ่นและสง่างาม',
    imageUrl: 'https://s.imgz.io/2026/10/14/fbce02d787aa493ed617a36f3238fb2fa43a53d80deeeb8e.png',
    colorHex: '#d97706',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    badgeBg: 'bg-amber-900 text-amber-100',
    badgeText: 'text-amber-600',
    hashtags: ['#StardustVoice', '#OnAirBroadcast', '#UnbiasedListener', '#StoryIgniter'],
    workPersona:
      'มีวาทศิลป์ในการเล่าเรื่อง สื่อสารได้ตรงจุดและน่าประทับใจ เปิดใจรับฟังความคิดเห็นรอบด้านโดยไม่อคติ และเปลี่ยนข้อมูลที่ซับซ้อนให้เข้าใจง่ายและสร้างแรงบันดาลใจ',
    careerGuide:
      'เหมาะกับงานสื่อสารมวลชน การตลาดดิจิทัล การสร้างสรรค์คอนเทนต์ การประชาสัมพันธ์ และผู้นำการนำเสนอระดับองค์กร',
    recommendedRoles: ['Content Creator / Media Lead', 'นักประชาสัมพันธ์และการตลาด', 'พิธีกร / โฆษกองค์กร', 'Corporate Communications'],
    workaholismIndex: 85,
    perfectionismLevel: 88,
    cosmicLuckyCharm: 'ไมโครโฟนบรอดคาสต์คลื่นดาว (Stardust Mic)',
    luckyCharmDesc: 'ขยายเสียงกระซิบแห่งแรงบันดาลใจให้ก้องกังวานไปทั่วกาแล็กซี่',
    besties: [
      {
        id: 'gravity_weavers',
        name: 'The Gravity Weavers',
        relation: 'คู่หูประสานสัมพันธ์',
        imageUrl: 'https://s.imgz.io/2026/10/14/-Riri02b8d1b6394c178a.png',
      },
      {
        id: 'mad_alchemists',
        name: 'The Mad Alchemists',
        relation: 'คู่หูเล่าเรื่องนวัตกรรม',
        imageUrl: 'https://s.imgz.io/2026/10/14/ba489060c24880e5b963df571946dc8fcb2b3d1e49bc3f42.png',
      },
    ],
    colleagues: [
      {
        id: 'star_gazers',
        name: 'The Star Gazers',
        relation: 'คู่หูวิเคราะห์ตรรกะ',
        imageUrl: 'https://i.postimg.cc/ydKhknmL/xele-ynn-xy-bn-dwng-c-nthr-s-hel-xng.png',
      },
    ],
    powers: [
      {
        title: 'จานรับสัญญาณไร้อคติ',
        titleEn: 'Unbiased Signal Receiver',
        description:
          'เปิดรับทุกคลื่นความคิดเห็นอย่างเป็นกลาง เข้าใจมุมมองที่แตกต่างโดยปราศจากอคติ',
        iconName: 'Radio',
      },
      {
        title: 'เครื่องแปลงสัญญาณละอองดาว',
        titleEn: 'Stardust Wave Converter',
        description:
          'ถ่ายทอดความคิดและเรื่องราวที่ซับซ้อนให้กลายเป็นข้อความที่สร้างแรงบันดาลใจและทรงพลัง',
        iconName: 'Sparkles',
      },
      {
        title: 'สนามกระจายความเข้าอกเข้าใจ',
        titleEn: 'Empathy Dispersion Field',
        description:
          'สร้างสนามความถี่แห่งการรับฟัง ช่วยให้ทุกชีวิตในยานกล้าที่จะพูดและแบ่งปันความจริง',
        iconName: 'Globe',
      },
      {
        title: 'คอนเดนเซอร์ปรับสมดุลแรงกดดัน',
        titleEn: 'Atmospheric Pressure Regulator',
        description:
          'สลายความตึงเครียดและความกดดันในห้วงอวกาศ รักษาสภาพจิตใจที่มั่นคงและยืดหยุ่น',
        iconName: 'Sliders',
      },
    ],
  },

  mad_alchemists: {
    id: 'mad_alchemists',
    nameEn: 'The Mad Alchemists',
    nameTh: 'เผ่าพันธุ์นักปรุงแต่งสสารมืด',
    fullName: 'The Mad Alchemists / เผ่าพันธุ์นักปรุงแต่งสสารมืด',
    theme: 'The Reality Shifter / นักแปรธาตุควอนตัม',
    themeEn: 'The Reality Shifter',
    callsign: 'นักประดิษฐ์นอกรีตแห่งห้วงมิติ',
    quote: 'เปลี่ยนความโกลาหล ให้เป็นเทคโนโลยีเปลี่ยนโลก',
    personalityRole: 'นักสร้างนวัตกรรม',
    personalityRoleEn: 'Innovator',
    description:
      'คุณคือ นักสร้างนวัตกรรม (Innovator) คุณมองเห็นความเป็นไปได้ใหม่ ๆ ท่ามกลางความไม่แน่นอน กล้าคิด กล้าทดลอง และกล้าท้าทายกรอบความคิดเดิม ๆ คุณมีความหลงใหลในการแก้ปัญหาที่ซับซ้อน และไม่กลัวความล้มเหลว เพราะคุณมองว่าทุกข้อผิดพลาดคือข้อมูลสำคัญที่จะนำไปสู่นวัตกรรมที่แท้จริง',
    imageUrl: 'https://s.imgz.io/2026/10/14/ba489060c24880e5b963df571946dc8fcb2b3d1e49bc3f42.png',
    colorHex: '#7c3aed',
    accentBg: 'bg-purple-50',
    accentBorder: 'border-purple-200',
    badgeBg: 'bg-purple-900 text-purple-100',
    badgeText: 'text-purple-600',
    hashtags: ['#DarkMatterMaker', '#ChaosToTech', '#BreakTheRules', '#PrototypeHero'],
    workPersona:
      'ไม่กลัวความล้มเหลว กล้าคิดนอกกรอบ ท้าทายขนบเดิมๆ ลงมือทดลองทำอย่างรวดเร็ว (Fail fast, learn faster) และแปลงไอเดียบ้าบิ่นให้กลายเป็นผลงานที่เปลี่ยนโลกได้จริง',
    careerGuide:
      'เหมาะกับงานสตาร์ทอัป นวัตกรรมเทคโนโลยี การออกแบบผลิตภัณฑ์ต้นแบบ (Product Prototyping) การเป็นผู้ประกอบการรุ่นใหม่ และ R&D',
    recommendedRoles: ['Founder / Entrepreneur', 'Product Designer & Maker', 'Creative Technologist', 'นักวิจัยนวัตกรรมต้นแบบ'],
    workaholismIndex: 93,
    perfectionismLevel: 78,
    cosmicLuckyCharm: 'เครื่องเร่งอนุภาคแปรธาตุพกพา (Matter Synthesizer)',
    luckyCharmDesc: 'ช่วยเร่งปฏิกิริยาไอเดียหลุดโลกให้กลายเป็นต้นแบบที่จับต้องได้',
    besties: [
      {
        id: 'star_gazers',
        name: 'The Star Gazers',
        relation: 'คู่หูวางรากฐานทฤษฎี',
        imageUrl: 'https://i.postimg.cc/ydKhknmL/xele-ynn-xy-bn-dwng-c-nthr-s-hel-xng.png',
      },
      {
        id: 'signal_broadcasters',
        name: 'The Signal Broadcasters',
        relation: 'คู่หูเล่าเรื่องผลิตภัณฑ์',
        imageUrl: 'https://s.imgz.io/2026/10/14/fbce02d787aa493ed617a36f3238fb2fa43a53d80deeeb8e.png',
      },
    ],
    colleagues: [
      {
        id: 'gravity_weavers',
        name: 'The Gravity Weavers',
        relation: 'ผู้ช่วยประสานงานระบบ',
        imageUrl: 'https://s.imgz.io/2026/10/14/-Riri02b8d1b6394c178a.png',
      },
    ],
    powers: [
      {
        title: 'สแกนเนอร์ควอนตัมค้นหาโอกาส',
        titleEn: 'Quantum Opportunity Scanner',
        description:
          'มองเห็นทางออกและความเป็นไปได้ใหม่ ๆ ซ่อนอยู่ในจุดที่มืดมิดและซับซ้อนที่สุด',
        iconName: 'Scan',
      },
      {
        title: 'เตาปฏิกรณ์สสารมืดต้นแบบ',
        titleEn: 'Dark Matter Prototyping Engine',
        description:
          'เปลี่ยนไอเดียที่บ้าบิ่นให้กลายเป็นผลงานต้นแบบได้อย่างรวดเร็วและจับต้องได้',
        iconName: 'Flame',
      },
      {
        title: 'เกราะคุ้มกันความเสี่ยงควอนตัม',
        titleEn: 'Quantum Risk Immunity',
        description:
          'กล้าเผชิญหน้ากับความล้มเหลว นำบทเรียนจากการพังทลายมาอัปเกรดนวัตกรรมขั้นต่อไป',
        iconName: 'ShieldAlert',
      },
      {
        title: 'แกนปฏิวัติกาแล็กซี่',
        titleEn: 'Galactic Revolution Core',
        description:
          'จุดประกายความเปลี่ยนแปลงในวงกว้าง สร้างผลกระทบเชิงบวกที่ยั่งยืนให้แก่ระบบดาวเคราะห์',
        iconName: 'Rocket',
      },
    ],
  },
};

/**
 * 12 Dimensions of Student Base Outcome (SBO)
 * Matches verbatim with image.png reference radar chart
 */
export interface SboDimensionItem {
  id: string; // sbo-1 .. sbo-12
  code: string; // SBO1 .. SBO12
  number: number;
  label: string; // Exact Thai label from image.png
  nameEn: string;
  pillarId: string;
  archetypeId: 'star_gazers' | 'gravity_weavers' | 'signal_broadcasters' | 'mad_alchemists';
  description: string;
}

export const SBO_12_DIMENSIONS: SboDimensionItem[] = [
  {
    id: 'sbo-1',
    code: 'SBO1',
    number: 1,
    label: 'การตัดสินใจด้วยข้อเท็จจริง',
    nameEn: 'Fact-Based Decision Making',
    pillarId: 'pillar-thinker',
    archetypeId: 'star_gazers',
    description: 'ไม่ด่วนสรุปจากคำบอกเล่า ตรวจสอบที่มาของข้อมูล และใช้หลักฐานเชิงประจักษ์ประกอบการตัดสินใจ',
  },
  {
    id: 'sbo-2',
    code: 'SBO2',
    number: 2,
    label: 'การเติบโตทางความคิด',
    nameEn: 'Growth Mindset & Resilience',
    pillarId: 'pillar-thinker',
    archetypeId: 'star_gazers',
    description: 'มองความผิดพลาดเป็นโอกาสเรียนรู้ พร้อมปรับตัวและเปิดรับคำติชมเพื่อพัฒนาทักษะตนเองอยู่เสมอ',
  },
  {
    id: 'sbo-3',
    code: 'SBO3',
    number: 3,
    label: 'ยอมรับความแตกต่างอย่างสร้างสรรค์',
    nameEn: 'Constructive Diversity & Inclusion',
    pillarId: 'pillar-thinker',
    archetypeId: 'gravity_weavers',
    description: 'เปิดรับฟังมุมมองที่แตกต่าง เคารพความหลากหลาย และสังเคราะห์ความคิดเห็นต่างให้เกิดประโยชน์',
  },
  {
    id: 'sbo-4',
    code: 'SBO4',
    number: 4,
    label: 'ความจริงอิงเหตุ-ผล',
    nameEn: 'Truth & Logical Reasoning',
    pillarId: 'pillar-thinker',
    archetypeId: 'star_gazers',
    description: 'สืบค้นต้นตอของปัญหาอย่างมีเหตุผล เชื่อมโยงหลักการ ไม่สรุปด้วยอารมณ์หรืออคติส่วนตัว',
  },
  {
    id: 'sbo-5',
    code: 'SBO5',
    number: 5,
    label: 'เคารพและให้เกียรติ',
    nameEn: 'Respect & Emotional Empathy',
    pillarId: 'pillar-coordinator',
    archetypeId: 'gravity_weavers',
    description: 'ความเข้าอกเข้าใจผู้อื่น ให้เกียรติในศักดิ์ศรีความเป็นมนุษย์ และควบคุมอารมณ์ในภาวะขัดแย้ง',
  },
  {
    id: 'sbo-6',
    code: 'SBO6',
    number: 6,
    label: 'ความสงสัยใคร่รู้',
    nameEn: 'Inquisitive Curiosity',
    pillarId: 'pillar-coordinator',
    archetypeId: 'mad_alchemists',
    description: 'ความกระตือรือร้นในการตั้งคำถาม แสวงหาความรู้ใหม่ๆ และสำรวจโอกาสที่ซ่อนอยู่ในความไม่แน่นอน',
  },
  {
    id: 'sbo-7',
    code: 'SBO7',
    number: 7,
    label: 'การวิเคราะห์เพื่อพัฒนา',
    nameEn: 'Analytics for Continuous Growth',
    pillarId: 'pillar-coordinator',
    archetypeId: 'star_gazers',
    description: 'นำข้อมูลและผลลัพธ์การทำงานมาทบทวน วิเคราะห์จุดแข็งจุดอ่อนเพื่อยกระดับมาตรฐานอย่างต่อเนื่อง',
  },
  {
    id: 'sbo-8',
    code: 'SBO8',
    number: 8,
    label: 'การสร้างการมีส่วนร่วมเพื่อมุ่งผลสำเร็จ',
    nameEn: 'Participatory Engagement',
    pillarId: 'pillar-coordinator',
    archetypeId: 'signal_broadcasters',
    description: 'เปิดพื้นที่ให้ทุกคนได้แสดงความคิดเห็น มีส่วนร่วมในการกำหนดเป้าหมายและลงมือปฏิบัติร่วมกัน',
  },
  {
    id: 'sbo-9',
    code: 'SBO9',
    number: 9,
    label: 'เข้าใจปัจจุบัน เพื่อวางแผนอนาคต',
    nameEn: 'Present Understanding for Future Planning',
    pillarId: 'pillar-problem-solver',
    archetypeId: 'star_gazers',
    description: 'ประเมินสถานการณ์และปัจจัยแวดล้อมในปัจจุบันได้อย่างถ่องแท้ เพื่อวางแผนรับมืออนาคตอย่างรอบคอบ',
  },
  {
    id: 'sbo-10',
    code: 'SBO10',
    number: 10,
    label: 'เกาให้ถูกที่คัน',
    nameEn: 'Pinpoint Problem Solving',
    pillarId: 'pillar-problem-solver',
    archetypeId: 'mad_alchemists',
    description: 'มองทะลุจุดคอขวดและแก้ปัญหาที่จุดหัวใจสำคัญได้อย่างตรงจุด รวดเร็ว และมีประสิทธิภาพสูงสุด',
  },
  {
    id: 'sbo-11',
    code: 'SBO11',
    number: 11,
    label: 'การเพิ่มผลลัพธ์อย่างมีคุณค่า',
    nameEn: 'High-Value Impact Enhancement',
    pillarId: 'pillar-innovator',
    archetypeId: 'mad_alchemists',
    description: 'มุ่งมั่นเพิ่มพูนประสิทธิภาพงาน สร้างสรรค์ผลลัพธ์ที่มีมูลค่าสูงและสร้างประโยชน์เป็นรูปธรรม',
  },
  {
    id: 'sbo-12',
    code: 'SBO12',
    number: 12,
    label: 'การร่วมแรงร่วมใจพัฒนา',
    nameEn: 'Collaborative Community Development',
    pillarId: 'pillar-innovator',
    archetypeId: 'gravity_weavers',
    description: 'พลังความสามัคคี อุทิศตนช่วยเหลือส่วนรวม และขับเคลื่อนสังคมหรือชุมชนสู่การพัฒนาที่ยั่งยืน',
  },
];

/**
 * Score calculation helper:
 * Computes scores for both the 12 SBO dimensions and the 4 Cosmic Archetypes.
 */
export function calculateCosmicEvaluation(answers: Record<number, number> = {}) {
  // Mapping of questions to 4 archetypes (15 questions each = 60 questions total)
  // star_gazers: 1-15 (Logic, Analysis, Strategic Thinker)
  // gravity_weavers: 16-30 (Empathy, Coordinator, Community, Team)
  // signal_broadcasters: 31-45 (Communicator, Listener, Voice, Engagement)
  // mad_alchemists: 46-60 (Innovator, Risk, Maker, Problem Solver)
  const archetypeScores: Record<string, { total: number; maxScore: number; count: number }> = {
    star_gazers: { total: 0, maxScore: 15 * 7, count: 0 },
    gravity_weavers: { total: 0, maxScore: 15 * 7, count: 0 },
    signal_broadcasters: { total: 0, maxScore: 15 * 7, count: 0 },
    mad_alchemists: { total: 0, maxScore: 15 * 7, count: 0 },
  };

  // 12 SBO scores
  // Each SBO has 5 questions in 60-question set
  const sboScores: Record<string, { total: number; maxScore: number; count: number }> = {};
  SBO_12_DIMENSIONS.forEach((dim) => {
    sboScores[dim.id] = { total: 0, maxScore: 5 * 7, count: 0 };
  });

  // Calculate scores from answers (default rating is 5 if empty)
  for (let qId = 1; qId <= 60; qId++) {
    const rawVal = answers[qId] ?? 5;

    // Archetype assignment
    let archKey = 'star_gazers';
    if (qId <= 15) archKey = 'star_gazers';
    else if (qId <= 30) archKey = 'gravity_weavers';
    else if (qId <= 45) archKey = 'signal_broadcasters';
    else archKey = 'mad_alchemists';

    archetypeScores[archKey].total += rawVal;
    archetypeScores[archKey].count += 1;

    // SBO assignment (5 questions per SBO: 1-5 -> SBO1, 6-10 -> SBO2, ..., 56-60 -> SBO12)
    const sboIndex = Math.min(12, Math.floor((qId - 1) / 5) + 1);
    const sboId = `sbo-${sboIndex}`;
    if (sboScores[sboId]) {
      sboScores[sboId].total += rawVal;
      sboScores[sboId].count += 1;
    }
  }

  // Archetype percentages & averages
  const archetypeResults = Object.entries(archetypeScores).map(([key, data]) => {
    const pct = data.count > 0 ? Math.round((data.total / data.maxScore) * 100) : 75;
    const avg = data.count > 0 ? Number((data.total / data.count).toFixed(2)) : 5.25;
    return {
      id: key,
      archetype: COSMIC_ARCHETYPES[key],
      score: data.total,
      maxScore: data.maxScore,
      percentage: pct,
      average: avg,
    };
  });

  // Sort archetypes descending
  archetypeResults.sort((a, b) => b.percentage - a.percentage);
  const dominantArchetype = archetypeResults[0].archetype;

  // SBO 12 dimensions values (normalized 0 - 100, and scaled value 0 - 80 for radar chart like image.png)
  const sboResults = SBO_12_DIMENSIONS.map((dim) => {
    const data = sboScores[dim.id] || { total: 25, maxScore: 35, count: 5 };
    const pct = data.count > 0 ? Math.round((data.total / data.maxScore) * 100) : 70;
    const avg = data.count > 0 ? Number((data.total / data.count).toFixed(2)) : 4.9;
    // Scaled to 0-80 chart grid as shown on image.png
    const chartValue = Math.round((pct / 100) * 80);
    return {
      ...dim,
      score: data.total,
      maxScore: data.maxScore,
      percentage: pct,
      average: avg,
      chartValue,
    };
  });

  return {
    dominantArchetype,
    archetypeResults,
    sboResults,
    totalAnswered: Object.keys(answers).length,
  };
}

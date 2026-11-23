export type Locale = "en" | "th";
export type Localized = Record<Locale, string>;
export const text = (en: string, th: string): Localized => ({ en, th });
export const contact = {
  email: "ribbinpo@gmail.com",
  github: "https://github.com/ribbinpo",
  linkedin: "https://linkedin.com/in/teerawut-saesim-31781420b",
};
// Section anchors in page order. `copy[locale].nav` holds the matching labels.
export const sections = [
  "about",
  "experience",
  "projects",
  "recognition",
  "education",
  "contact",
] as const;
export const copy = {
  en: {
    nav: ["About", "Experience", "Projects", "Recognition", "Education", "Contact"],
    home: "home",
    letsTalk: "Let’s talk",
    role: "Software Engineer",
    heroKicker: "Software Engineer // Full-stack & AI systems",
    heroTitle: "Thoughtful systems. Meaningful experiences",
    heroText:
      "I’m Teerawut Saesim. I design software architectures and build end-to-end products — connecting intuitive interfaces, resilient systems, and practical AI.",
    viewProjects: "Explore my work",
    download: "Download CV",
    cvNote: "PDF · English",
    current: "Currently at Dragon e-tech",
    heroTags: "Ideas / Architecture / AI / Cloud",
    heroCallout: "Architecture · AI · Systems",
    mascotAlt:
      "Anime-style robot mascot in a teal jacket and magenta sneakers, leaping forward and making a peace sign",
    pauseAnimation: "Pause animation",
    playAnimation: "Play animation",
    pause: "Pause",
    play: "Play",
    ticker: ["Full-stack", "Software architecture", "AI agents", "Cloud & DevOps"],
    tickerLabel: "Focus areas",
    tickerTagline: "Systems built to last",
    aboutLabel: "01 // A little about me",
    aboutAside: "Disciplines & mindset",
    aboutTitle: "Curious by nature. Engineer by practice",
    aboutText:
      "I work across the full software lifecycle: understanding a business problem, shaping an architecture, building the product, and keeping it running. My experience spans web and mobile applications, blockchain integrations, and AI-powered workflows.",
    aboutMore:
      "Beyond the screen, I’m drawn to hardware, circuit design, and robotics. I enjoy exploring how things work — and finding thoughtful ways to make them work better.",
    expertise: "Expertise",
    expertiseList: "Areas of expertise",
    focus: "What I bring",
    toolkit: "Toolkit",
    expLabel: "02 // The journey",
    expAside: "2022 — Present",
    expTitle: "Experience, built over time",
    currentBadge: "Current",
    projectsLabel: "03 // Selected work",
    projectsTitle: "Selected projects",
    projectsText:
      "A selection of professional projects, from customer experiences to digital asset infrastructure.",
    allWork: "All work on GitHub",
    carousel: "Project slides",
    carouselRole: "carousel",
    slideRole: "slide",
    previous: "Previous projects",
    next: "Next projects",
    of: "of",
    noProjects: "Projects are being updated. Check back soon.",
    details: "Explore project",
    project: "Project",
    problem: "The challenge",
    contribution: "My contribution",
    outcome: "The outcome",
    close: "Close",
    closeProject: "Close project details",
    awardsLabel: "05 // Beyond the day job",
    awardsAside: "Hackathons & awards",
    awardsTitle: "Building. Learning. Recognized",
    award: "Award",
    participation: "Participation",
    visit: "View project",
    eduLabel: "06 // Foundations",
    eduTitle: "Engineering starts with curiosity",
    university: "Prince of Songkla University",
    campus: "Phuket Campus",
    degree: "Bachelor of Engineering · Digital Engineering",
    studyDates: "2019 — 2023",
    gpa: "GPA 3.84 / 4.00",
    courses:
      "Web Programming · Data Structures & Algorithms · Internet of Things · AI",
    contactLabel: "07 // Let’s connect",
    contactTitle: "Good work starts with a conversation",
    contactText:
      "Have a role, a challenging problem, or an idea to exchange? I’d love to hear from you.",
    copyEmail: "Copy email address",
    copied: "Email address copied",
    copyFailed: "Could not copy. You can select the email address below.",
    newTab: "(opens in a new tab)",
    top: "Back to top",
    footerNav: "Footer",
    menu: "Open navigation",
    navigation: "Navigation",
    theme: "Choose theme",
    switchTo: "Switch to",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    skip: "Skip to content",
    notifications: "Notifications",
  },
  th: {
    nav: ["เกี่ยวกับผม", "ประสบการณ์", "ผลงาน", "ความสำเร็จ", "การศึกษา", "ติดต่อ"],
    home: "หน้าแรก",
    letsTalk: "คุยกันเลย",
    role: "วิศวกรซอฟต์แวร์",
    heroKicker: "วิศวกรซอฟต์แวร์ // ฟูลสแตกและระบบ AI",
    heroTitle: "ออกแบบระบบอย่างใส่ใจ สร้างประสบการณ์ที่มีความหมาย",
    heroText:
      "ผม Teerawut Saesim ออกแบบสถาปัตยกรรมซอฟต์แวร์และพัฒนาผลิตภัณฑ์แบบครบวงจร เชื่อมต่อส่วนติดต่อที่ใช้งานง่าย ระบบที่เชื่อถือได้ และ AI ที่ใช้งานได้จริง",
    viewProjects: "สำรวจผลงาน",
    download: "ดาวน์โหลด CV",
    cvNote: "PDF · ภาษาอังกฤษ",
    current: "ปัจจุบันทำงานที่ Dragon e-tech",
    heroTags: "แนวคิด / สถาปัตยกรรม / AI / คลาวด์",
    heroCallout: "สถาปัตยกรรม · AI · ระบบ",
    mascotAlt:
      "มาสคอตหุ่นยนต์สไตล์อนิเมะสวมแจ็กเก็ตสีเขียวอมฟ้าและรองเท้าผ้าใบสีบานเย็น กำลังกระโดดไปข้างหน้าพร้อมชูสองนิ้ว",
    pauseAnimation: "หยุดภาพเคลื่อนไหว",
    playAnimation: "เล่นภาพเคลื่อนไหว",
    pause: "หยุด",
    play: "เล่น",
    ticker: ["ฟูลสแตก", "สถาปัตยกรรมซอฟต์แวร์", "เอเจนต์ AI", "คลาวด์และ DevOps"],
    tickerLabel: "ด้านที่เชี่ยวชาญ",
    tickerTagline: "ระบบที่สร้างให้ใช้งานได้ยาวนาน",
    aboutLabel: "01 // รู้จักผม",
    aboutAside: "ศาสตร์และแนวคิด",
    aboutTitle: "เริ่มจากความสงสัย ลงมือทำด้วยวิศวกรรม",
    aboutText:
      "ผมทำงานตลอดวงจรการพัฒนาซอฟต์แวร์ ตั้งแต่ทำความเข้าใจโจทย์ธุรกิจ ออกแบบสถาปัตยกรรม พัฒนาผลิตภัณฑ์ ไปจนถึงดูแลระบบให้ทำงานอย่างต่อเนื่อง มีประสบการณ์ด้านเว็บ แอปพลิเคชันมือถือ การเชื่อมต่อบล็อกเชน และกระบวนการทำงานที่ขับเคลื่อนด้วย AI",
    aboutMore:
      "นอกเหนือจากซอฟต์แวร์ ผมสนใจฮาร์ดแวร์ การออกแบบวงจร และหุ่นยนต์ ชอบเรียนรู้ว่าสิ่งต่าง ๆ ทำงานอย่างไร และค้นหาวิธีทำให้ทำงานได้ดียิ่งขึ้น",
    expertise: "ความเชี่ยวชาญ",
    expertiseList: "ด้านความเชี่ยวชาญ",
    focus: "สิ่งที่ผมให้ความสำคัญ",
    toolkit: "เครื่องมือ",
    expLabel: "02 // เส้นทางการทำงาน",
    expAside: "2565 — ปัจจุบัน",
    expTitle: "ประสบการณ์ที่สั่งสมจากการลงมือทำ",
    currentBadge: "ปัจจุบัน",
    projectsLabel: "03 // ผลงานคัดสรร",
    projectsTitle: "โปรเจกต์ที่คัดสรร",
    projectsText:
      "ตัวอย่างผลงานจากการทำงาน ตั้งแต่ประสบการณ์ลูกค้าไปจนถึงโครงสร้างพื้นฐานสินทรัพย์ดิจิทัล",
    allWork: "ผลงานทั้งหมดบน GitHub",
    carousel: "สไลด์โปรเจกต์",
    carouselRole: "ภาพหมุนเวียน",
    slideRole: "สไลด์",
    previous: "โปรเจกต์ก่อนหน้า",
    next: "โปรเจกต์ถัดไป",
    of: "จาก",
    noProjects: "กำลังอัปเดตผลงาน แวะกลับมาดูอีกครั้งเร็ว ๆ นี้",
    details: "ดูรายละเอียดผลงาน",
    project: "โครงการ",
    problem: "โจทย์ของโครงการ",
    contribution: "สิ่งที่ผมพัฒนา",
    outcome: "ผลลัพธ์",
    close: "ปิด",
    closeProject: "ปิดรายละเอียดโครงการ",
    awardsLabel: "05 // เรียนรู้นอกเวลางาน",
    awardsAside: "แฮกกาธอนและรางวัล",
    awardsTitle: "สร้างสรรค์ เรียนรู้ และได้รับการยอมรับ",
    award: "รางวัล",
    participation: "เข้าร่วมการแข่งขัน",
    visit: "ดูโครงการ",
    eduLabel: "06 // พื้นฐานการเรียนรู้",
    eduTitle: "วิศวกรรมเริ่มต้นจากความอยากรู้",
    university: "มหาวิทยาลัยสงขลานครินทร์",
    campus: "วิทยาเขตภูเก็ต",
    degree: "วิศวกรรมศาสตรบัณฑิต · วิศวกรรมดิจิทัล",
    studyDates: "พ.ศ. 2562 — 2566",
    gpa: "เกรดเฉลี่ย 3.84 / 4.00",
    courses:
      "การเขียนโปรแกรมเว็บ · โครงสร้างข้อมูลและอัลกอริทึม · อินเทอร์เน็ตของสรรพสิ่ง · AI",
    contactLabel: "07 // มาพูดคุยกัน",
    contactTitle: "งานที่ดีเริ่มต้นจากบทสนทนา",
    contactText:
      "มีโอกาสร่วมงาน โจทย์ที่ท้าทาย หรือแนวคิดที่อยากแลกเปลี่ยน ยินดีพูดคุยครับ",
    copyEmail: "คัดลอกอีเมล",
    copied: "คัดลอกอีเมลแล้ว",
    copyFailed: "ไม่สามารถคัดลอกได้ คุณสามารถเลือกข้อความอีเมลด้านล่างได้",
    newTab: "(เปิดในแท็บใหม่)",
    top: "กลับด้านบน",
    footerNav: "ส่วนท้าย",
    menu: "เปิดเมนูนำทาง",
    navigation: "เมนูนำทาง",
    theme: "เลือกธีม",
    switchTo: "เปลี่ยนเป็น",
    light: "สว่าง",
    dark: "มืด",
    system: "ตามระบบ",
    language: "ภาษา",
    skip: "ข้ามไปยังเนื้อหา",
    notifications: "การแจ้งเตือน",
  },
};
export type Copy = (typeof copy)[Locale];
export const experiences = [
  {
    company: "Dragon e-tech",
    role: text("Software Engineer", "วิศวกรซอฟต์แวร์"),
    dates: text("Apr 2024 — Present", "เม.ย. 2567 — ปัจจุบัน"),
    focus: text("Current role", "บทบาทปัจจุบัน"),
    current: true,
    description: text(
      "Designing end-to-end solutions and the systems behind them.",
      "ออกแบบโซลูชันแบบครบวงจรและระบบที่รองรับการทำงาน",
    ),
    points: [
      text(
        "Design software architectures using microservices, cloud services, and domain-driven design.",
        "ออกแบบสถาปัตยกรรมด้วยไมโครเซอร์วิส คลาวด์ และแนวคิด Domain-driven design",
      ),
      text(
        "Build AI agents with the LangChain ecosystem to support business workflows and automation.",
        "พัฒนา AI Agent ด้วยระบบนิเวศ LangChain เพื่อสนับสนุนงานธุรกิจและระบบอัตโนมัติ",
      ),
      text(
        "Lead technical decisions, coordinate delivery, and manage deployments, CI/CD, and observability.",
        "นำการตัดสินใจด้านเทคนิค ประสานงานส่งมอบ และดูแลการติดตั้งระบบ CI/CD และการสังเกตการณ์ระบบ",
      ),
    ],
  },
  {
    company: "Finstable",
    role: text("Full-stack Developer", "นักพัฒนาฟูลสแตก"),
    dates: text("Nov 2022 — Apr 2024", "พ.ย. 2565 — เม.ย. 2567"),
    focus: text("Web & blockchain", "เว็บและบล็อกเชน"),
    current: false,
    description: text(
      "Connecting web, mobile, and blockchain to business needs.",
      "เชื่อมต่อเว็บ มือถือ และบล็อกเชนให้ตอบโจทย์ธุรกิจ",
    ),
    points: [
      text(
        "Developed and tested web and mobile applications with smart contract integrations.",
        "พัฒนาและทดสอบเว็บและแอปมือถือที่เชื่อมต่อกับสมาร์ตคอนแทรกต์",
      ),
      text(
        "Worked with customers on requirements and scope; created technical specifications and process diagrams.",
        "ทำงานร่วมกับลูกค้าเพื่อกำหนดความต้องการและขอบเขต จัดทำข้อกำหนดทางเทคนิคและแผนภาพกระบวนการ",
      ),
      text(
        "Taught frontend and backend development and presented products to international clients at B2GC.",
        "สอนการพัฒนาฟรอนต์เอนด์และแบ็กเอนด์ และนำเสนอผลิตภัณฑ์แก่ลูกค้าต่างชาติในงาน B2GC",
      ),
    ],
  },
  {
    company: "Trienpont International",
    role: text("Full-stack Developer", "นักพัฒนาฟูลสแตก"),
    dates: text("Jun 2022 — Sep 2022", "มิ.ย. 2565 — ก.ย. 2565"),
    focus: text("Product foundations", "พื้นฐานการพัฒนาผลิตภัณฑ์"),
    current: false,
    description: text(
      "Building a foundation in collaborative product development.",
      "สร้างพื้นฐานการพัฒนาผลิตภัณฑ์ร่วมกับทีม",
    ),
    points: [
      text(
        "Developed and tested full-stack web features and evaluated development tools and standards.",
        "พัฒนาและทดสอบฟีเจอร์เว็บแบบฟูลสแตก พร้อมประเมินเครื่องมือและมาตรฐานการพัฒนา",
      ),
      text(
        "Contributed to workflow and technology discussions and presented progress to customers.",
        "ร่วมออกแบบกระบวนการทำงานและเลือกเทคโนโลยี พร้อมนำเสนอความคืบหน้าให้ลูกค้า",
      ),
    ],
  },
];
export const skillGroups = [
  {
    title: text("Interfaces & applications", "ส่วนติดต่อและแอปพลิเคชัน"),
    skills: [
      "JavaScript / TypeScript",
      "React / Next.js / Nuxt / Taro",
      "React Native / Tauri",
    ],
  },
  {
    title: text("Systems & architecture", "ระบบและสถาปัตยกรรม"),
    skills: [
      "Node.js / Express / NestJS",
      "Python / Go",
      "Software Architecture",
      "Solidity / Smart Contracts",
    ],
  },
  {
    title: text("AI & automation", "AI และระบบอัตโนมัติ"),
    skills: ["LangChain ecosystem", "AI Agents", "Langfuse"],
  },
  {
    title: text("Cloud & operations", "คลาวด์และการดูแลระบบ"),
    skills: [
      "Docker / Kubernetes",
      "Git / CI/CD",
      "Grafana Stack",
      "Huawei Cloud / GCP",
    ],
  },
];
export type ExpertiseIcon = "code" | "architecture" | "ai";
// Section 01 cards. Selecting a card shows its description, points and toolkit.
export const expertise: {
  id: string;
  icon: ExpertiseIcon;
  title: Localized;
  summary: Localized;
  description: Localized;
  points: Localized[];
  skills: string[];
}[] = [
  {
    id: "full-stack",
    icon: "code",
    title: text("Full-stack development", "การพัฒนาฟูลสแตก"),
    summary: text(
      "Thoughtful interfaces. Reliable applications.",
      "ส่วนติดต่อที่ใส่ใจ แอปพลิเคชันที่เชื่อถือได้",
    ),
    description: text(
      "Web and mobile products built end to end, from the interface people touch to the APIs and data behind it.",
      "พัฒนาเว็บและแอปมือถือแบบครบวงจร ตั้งแต่ส่วนที่ผู้ใช้สัมผัสไปจนถึง API และข้อมูลเบื้องหลัง",
    ),
    points: [
      text("End-to-end product development", "พัฒนาผลิตภัณฑ์แบบครบวงจร"),
      text(
        "Web and mobile apps with smart contract integrations",
        "เว็บและแอปมือถือที่เชื่อมต่อกับสมาร์ตคอนแทรกต์",
      ),
      text(
        "Requirements turned into clear technical specifications",
        "แปลงความต้องการเป็นข้อกำหนดทางเทคนิคที่ชัดเจน",
      ),
    ],
    skills: skillGroups[0].skills,
  },
  {
    id: "architecture",
    icon: "architecture",
    title: text("Software architecture", "สถาปัตยกรรมซอฟต์แวร์"),
    summary: text(
      "Systems designed to work together.",
      "ออกแบบระบบให้ทำงานร่วมกัน",
    ),
    description: text(
      "Systems shaped with microservices, cloud services, and domain-driven design, so teams can change them with confidence.",
      "ออกแบบระบบด้วยไมโครเซอร์วิส บริการคลาวด์ และแนวคิด Domain-driven design เพื่อให้ทีมปรับเปลี่ยนระบบได้อย่างมั่นใจ",
    ),
    points: [
      text(
        "Architecture with maintainability in mind",
        "ออกแบบสถาปัตยกรรมที่ดูแลต่อได้ง่าย",
      ),
      text(
        "Technical decisions and delivery coordination",
        "นำการตัดสินใจด้านเทคนิคและประสานการส่งมอบ",
      ),
      text(
        "Deployments, CI/CD, and observability",
        "ดูแลการติดตั้งระบบ CI/CD และการสังเกตการณ์ระบบ",
      ),
    ],
    skills: [...skillGroups[1].skills, ...skillGroups[3].skills],
  },
  {
    id: "ai",
    icon: "ai",
    title: text("AI & automation", "AI และระบบอัตโนมัติ"),
    summary: text(
      "Intelligence applied to everyday work.",
      "นำปัญญาประดิษฐ์มาใช้ในงานประจำวัน",
    ),
    description: text(
      "AI agents built with the LangChain ecosystem, applied where they remove repetitive work from real business workflows.",
      "พัฒนา AI Agent ด้วยระบบนิเวศ LangChain และนำไปใช้ในจุดที่ช่วยลดงานซ้ำซากในกระบวนการทำงานจริงของธุรกิจ",
    ),
    points: [
      text(
        "AI that supports real business workflows",
        "ใช้ AI เพื่อตอบโจทย์การทำงานของธุรกิจ",
      ),
      text(
        "Agents traced and evaluated with Langfuse",
        "Agent ที่ติดตามและประเมินผลด้วย Langfuse",
      ),
      text(
        "Automation that reduces manual data entry",
        "ระบบอัตโนมัติที่ช่วยลดการกรอกข้อมูลด้วยมือ",
      ),
    ],
    skills: skillGroups[2].skills,
  },
];
export const achievements = [
  {
    name: "BillBOS",
    event: "Bitkub Blockathon 2023",
    result: text(
      "1st prize & 2 sponsor prizes",
      "รางวัลชนะเลิศและรางวัลสปอนเซอร์ 2 รางวัล",
    ),
    description: text(
      "Decentralized advertising on NEAR Protocol.",
      "ระบบโฆษณาแบบกระจายศูนย์บน NEAR Protocol",
    ),
    awarded: true,
    placed: true,
    url: "https://devpost.com/software/billbos",
  },
  {
    name: "SuperCall",
    event: "Axelarthon 2023",
    result: text("4th runner-up", "รองชนะเลิศอันดับ 4"),
    description: text(
      "Transaction pipelines with cross-chain execution.",
      "เครื่องมือรวมธุรกรรมเป็นกระบวนการ รองรับการทำงานข้ามเชน",
    ),
    awarded: true,
    placed: true,
    url: "https://devfolio.co/projects/supercall-be25",
  },
  {
    name: "Shout Protocol",
    event: "ETHOnline 2023",
    result: text("Sponsor prize", "รางวัลสปอนเซอร์"),
    description: text(
      "A Web3 social platform for increasing post exposure.",
      "แพลตฟอร์มสังคม Web3 เพื่อเพิ่มการมองเห็นโพสต์",
    ),
    awarded: true,
    placed: false,
    url: "https://ethglobal.com/showcase/shout-protocol-7fik4",
  },
  {
    name: "Videfi",
    event: "HackFS 2023 · ETHGlobal",
    result: text("Sponsor prize", "รางวัลสปอนเซอร์"),
    description: text(
      "Content ownership through decentralized storage.",
      "ส่งเสริมความเป็นเจ้าของเนื้อหาด้วยพื้นที่จัดเก็บแบบกระจายศูนย์",
    ),
    awarded: true,
    placed: false,
    url: "https://ethglobal.com/showcase/videfi-nvth7",
  },
  {
    name: "NSC 2022",
    event: "National Software Contest 2022",
    result: text(
      "Consolation prize · Final round",
      "รางวัลชมเชย · รอบชิงชนะเลิศ",
    ),
    description: text(
      "A digital platform for medical personnel to manage COVID-19 case data.",
      "แพลตฟอร์มดิจิทัลสำหรับบุคลากรทางการแพทย์เพื่อจัดการข้อมูลผู้ป่วยโควิด-19",
    ),
    awarded: true,
    placed: false,
  },
  {
    name: "Tradelink",
    event: "Constellation · Chainlink",
    result: text("Hackathon participant", "เข้าร่วมแฮกกาธอน"),
    description: text(
      "Peer-to-peer NFT and token trading with cross-chain support using CCIP.",
      "แพลตฟอร์มแลกเปลี่ยน NFT และโทเคนระหว่างผู้ใช้ รองรับข้ามเชนด้วย CCIP",
    ),
    awarded: false,
    placed: false,
    url: "https://devpost.com/software/tradelink",
  },
  {
    name: "Muddy Heart",
    event: "Autonomous Worlds 2023 · ETHGlobal",
    result: text("Hackathon participant", "เข้าร่วมแฮกกาธอน"),
    description: text(
      "An on-chain action RPG powered by the MUD engine.",
      "เกมแอ็กชัน RPG บนเชนที่พัฒนาด้วย MUD engine",
    ),
    awarded: false,
    placed: false,
    url: "https://ethglobal.com/showcase/muddy-heart-cdm0k",
  },
];

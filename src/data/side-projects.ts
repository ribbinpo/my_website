import { type Localized } from "@/data/profile";

export type ProjectArtwork =
  "network" | "website" | "payment" | "wallet" | "survey";

export interface Project {
  id: string;
  artwork?: ProjectArtwork;
  name: string;
  company: string;
  category: string;
  kind: Localized;
  summary: Localized;
  challenge: Localized;
  contributions: Localized[];
  outcome: Localized;
  tags: Localized[];
}
// Optional translations for category names. Unlisted categories use their name as-is.
export const PROJECT_CATEGORY_LABELS: Record<string, Localized> = {
  web: { en: "Web & AI", th: "เว็บและ AI" },
  blockchain: { en: "Blockchain & Mobile", th: "บล็อกเชนและมือถือ" },
};

// Edit, add, or reorder entries here. Cards, filters, and dialogs render from this list.
// The existing CV projects are retained until replacement side-project content is supplied.
export const SIDE_PROJECTS: readonly Project[] = [
  // {
  //   id: "crm",
  //   artwork: "network",
  //   name: "CRM System",
  //   company: "Dragon e-tech",
  //   category: "web",
  //   kind: text("Customer intelligence", "ข้อมูลเชิงลึกลูกค้า"),
  //   summary: text(
  //     "Customer relationships, connected. Everyday operations, assisted by AI.",
  //     "เชื่อมโยงความสัมพันธ์กับลูกค้า พร้อม AI ช่วยงานประจำวัน",
  //   ),
  //   challenge: text(
  //     "Bring customer information and mall services together while reducing manual reporting and receipt entry.",
  //     "รวมข้อมูลลูกค้าและบริการของศูนย์การค้า พร้อมลดงานรายงานและกรอกใบเสร็จด้วยมือ",
  //   ),
  //   contributions: [
  //     text(
  //       "Centralized profiles, interaction history, and shopping behavior for segmentation and relationship management.",
  //       "รวมโปรไฟล์ ประวัติการติดต่อ และพฤติกรรมการซื้อ เพื่อแบ่งกลุ่มและดูแลความสัมพันธ์กับลูกค้า",
  //     ),
  //     text(
  //       "Integrated promotions, vouchers, notifications, bookings, surveys, and customer challenges.",
  //       "เชื่อมต่อโปรโมชัน คูปอง การแจ้งเตือน การจอง แบบสำรวจ และกิจกรรมสำหรับลูกค้า",
  //     ),
  //     text(
  //       "Built an AI chatbot for customer data analysis and automated receipt data extraction.",
  //       "พัฒนาแชตบอต AI เพื่อวิเคราะห์ข้อมูลลูกค้า และดึงข้อมูลจากใบเสร็จอัตโนมัติ",
  //     ),
  //   ],
  //   outcome: text(
  //     "Helped staff answer operational questions and reduced manual information lookup and data entry.",
  //     "ช่วยพนักงานตอบคำถามในการดำเนินงาน และลดการค้นหาข้อมูลและกรอกข้อมูลด้วยมือ",
  //   ),
  //   tags: [
  //     text("AI", "AI"),
  //     text("CRM", "CRM"),
  //     text("Automation", "ระบบอัตโนมัติ"),
  //   ],
  // },
  // {
  //   id: "sbm",
  //   artwork: "website",
  //   name: "SBM Website",
  //   company: "Dragon e-tech",
  //   category: "web",
  //   kind: text("Content & discovery", "เนื้อหาและการค้นพบ"),
  //   summary: text(
  //     "An independently managed web presence, built for discovery.",
  //     "เว็บไซต์ที่ทีมงานจัดการเองได้ พร้อมรองรับการค้นหา",
  //   ),
  //   challenge: text(
  //     "Enable staff to manage store information, promotions, and events without relying on IT support.",
  //     "ให้ทีมงานจัดการข้อมูลร้านค้า โปรโมชัน และกิจกรรมได้โดยไม่ต้องพึ่งฝ่ายไอที",
  //   ),
  //   contributions: [
  //     text(
  //       "Enabled CMS-based content management and implemented metadata, structured data, robots.txt, and sitemaps.",
  //       "พัฒนาการจัดการเนื้อหาผ่าน CMS พร้อมข้อมูลเมตา ข้อมูลแบบมีโครงสร้าง robots.txt และ sitemap",
  //     ),
  //     text(
  //       "Optimized page loading and image compression; integrated Google Analytics and Search Console.",
  //       "ปรับปรุงการโหลดหน้าและบีบอัดภาพ พร้อมเชื่อมต่อ Google Analytics และ Search Console",
  //     ),
  //     text(
  //       "Configured CI/CD pipelines for automated deployments.",
  //       "ตั้งค่ากระบวนการ CI/CD เพื่อติดตั้งระบบอัตโนมัติ",
  //     ),
  //   ],
  //   outcome: text(
  //     "Reduced reliance on IT for content updates and supported discoverability and search performance tracking.",
  //     "ลดการพึ่งพาฝ่ายไอทีในการอัปเดตเนื้อหา และรองรับการค้นพบเว็บไซต์และติดตามผลการค้นหา",
  //   ),
  //   tags: [text("CMS", "CMS"), text("SEO", "SEO"), text("CI/CD", "CI/CD")],
  // },
  // {
  //   id: "transcrypt",
  //   artwork: "payment",
  //   name: "Transcrypt V2",
  //   company: "Finstable",
  //   category: "blockchain",
  //   kind: text("Crypto payment gateway", "ระบบรับชำระด้วยคริปโท"),
  //   summary: text(
  //     "Fiat-priced orders. Crypto payments. One connected workflow.",
  //     "ตั้งราคาด้วยเงินทั่วไป รับชำระด้วยคริปโท ในกระบวนการเดียว",
  //   ),
  //   challenge: text(
  //     "Let merchants accept cryptocurrency while pricing orders in fiat and reviewing payment activity.",
  //     "ให้ร้านค้ารับคริปโทได้โดยตั้งราคาเป็นเงินทั่วไปและตรวจสอบประวัติการชำระเงินได้",
  //   ),
  //   contributions: [
  //     text(
  //       "Built QR-based payments using EIP-681 and converted fiat order amounts into cryptocurrency amounts.",
  //       "พัฒนาการชำระผ่าน QR ด้วย EIP-681 และแปลงยอดคำสั่งซื้อจากเงินทั่วไปเป็นคริปโท",
  //     ),
  //     text(
  //       "Built transaction reporting and integrated cryptocurrency payments into vending machines.",
  //       "พัฒนารายงานธุรกรรมและเชื่อมต่อการชำระด้วยคริปโทเข้ากับตู้จำหน่ายสินค้า",
  //     ),
  //     text(
  //       "Integrated Phcpay to enable conversion to fiat through the TradingPool dealer platform.",
  //       "เชื่อมต่อ Phcpay เพื่อแปลงคริปโทเป็นเงินทั่วไปผ่านแพลตฟอร์มตัวแทน TradingPool",
  //     ),
  //   ],
  //   outcome: text(
  //     "Simplified payment initiation for merchants and customers and supported automated purchases.",
  //     "ช่วยให้ร้านค้าและลูกค้าเริ่มชำระเงินได้ง่ายขึ้น และรองรับการซื้อสินค้าอัตโนมัติ",
  //   ),
  //   tags: [
  //     text("EIP-681", "EIP-681"),
  //     text("Payments", "การชำระเงิน"),
  //     text("Blockchain", "บล็อกเชน"),
  //   ],
  // },
  // {
  //   id: "wallet",
  //   artwork: "wallet",
  //   name: "Fin Wallet",
  //   company: "Finstable",
  //   category: "blockchain",
  //   kind: text("Multi-network mobile wallet", "กระเป๋ามือถือหลายเครือข่าย"),
  //   summary: text(
  //     "Digital assets across EVM networks, together in one app.",
  //     "รวมสินทรัพย์ดิจิทัลจากเครือข่าย EVM ไว้ในแอปเดียว",
  //   ),
  //   challenge: text(
  //     "Make managing cryptocurrencies across multiple EVM-compatible networks more straightforward.",
  //     "ทำให้การจัดการคริปโทบนหลายเครือข่ายที่รองรับ EVM ง่ายขึ้น",
  //   ),
  //   contributions: [
  //     text(
  //       "Developed a mobile wallet for storing, managing, and transferring cryptocurrencies.",
  //       "พัฒนากระเป๋ามือถือสำหรับเก็บ จัดการ และโอนคริปโท",
  //     ),
  //     text(
  //       "Brought multiple EVM-compatible networks into one mobile experience.",
  //       "รวมหลายเครือข่ายที่รองรับ EVM ให้ใช้งานผ่านแอปมือถือเดียว",
  //     ),
  //   ],
  //   outcome: text(
  //     "Simplified digital asset management through a single mobile application.",
  //     "ทำให้การจัดการสินทรัพย์ดิจิทัลง่ายขึ้นผ่านแอปมือถือเดียว",
  //   ),
  //   tags: [
  //     text("Mobile", "มือถือ"),
  //     text("EVM", "EVM"),
  //     text("Wallet", "กระเป๋าดิจิทัล"),
  //   ],
  // },
  // {
  //   id: "rabbit",
  //   artwork: "survey",
  //   name: "Rabbit Rewards",
  //   company: "Trienpont International",
  //   category: "web",
  //   kind: text("Survey back office", "ระบบหลังบ้านแบบสำรวจ"),
  //   summary: text(
  //     "A better feedback loop between customers and businesses.",
  //     "เชื่อมเสียงของลูกค้าเข้ากับการตัดสินใจของธุรกิจ",
  //   ),
  //   challenge: text(
  //     "Encourage customer feedback and let administrators manage surveys and reward points independently.",
  //     "ส่งเสริมให้ลูกค้าแสดงความคิดเห็น และให้ผู้ดูแลจัดการแบบสำรวจและคะแนนได้เอง",
  //   ),
  //   contributions: [
  //     text(
  //       "Built a survey platform with points redeemable for promotions.",
  //       "พัฒนาแพลตฟอร์มแบบสำรวจพร้อมคะแนนสำหรับแลกโปรโมชัน",
  //     ),
  //     text(
  //       "Enabled custom survey creation and reward management without developer support.",
  //       "รองรับการสร้างแบบสำรวจและจัดการรางวัลโดยไม่ต้องพึ่งนักพัฒนา",
  //     ),
  //     text(
  //       "Visualized survey responses to inform marketing decisions.",
  //       "แสดงผลข้อมูลคำตอบเพื่อสนับสนุนการตัดสินใจด้านการตลาด",
  //     ),
  //   ],
  //   outcome: text(
  //     "Helped administrators understand feedback and manage customer engagement independently.",
  //     "ช่วยผู้ดูแลเข้าใจความคิดเห็นและจัดการการมีส่วนร่วมของลูกค้าได้เอง",
  //   ),
  //   tags: [
  //     text("Surveys", "แบบสำรวจ"),
  //     text("Rewards", "รางวัล"),
  //     text("Data visualization", "การแสดงผลข้อมูล"),
  //   ],
  // },
];

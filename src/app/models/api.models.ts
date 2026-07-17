/**
 * The API contract, in the camelCase the backend's API Resources emit.
 *
 * Image fields arrive as absolute URLs (ready for `<img src>`). To change one, upload
 * the file via `ApiService.upload()` and send the returned `path` back on the next
 * create/update — the backend accepts either the path or the URL it handed out.
 */

export type SiteType = 'Home' | 'Office' | 'Building';
export type SiteStatus = 'Pending' | 'Completed' | 'Dispute';
export type ItemSection = 'left' | 'middle' | 'right';
export type HelpTopic = 'Individual' | 'Residential' | 'Commercial';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  logo: string | null;
  companyName: string | null;
  phone: string | null;
}

export interface Banner {
  id?: number;
  tagline: string | null;
  heading: string;
  description: string;
  image: string | null;
  buttonText: string | null;
}

export interface Faq {
  id?: number;
  question: string;
  answer: string;
}

export interface Service {
  id?: number;
  title: string;
  description: string;
  icon?: string | null;
  tag?: string | null;
}

export interface Testimonial {
  id?: number;
  clientImage: string | null;
  clientName: string;
  designation: string;
  feedback: string;
  rating: number;
}

export interface TeamMember {
  id?: number;
  photo: string | null;
  name: string;
  position: string;
  email: string;
  phone: string;
  siteId: number | null;
  siteName?: string;
}

export interface GalleryItem {
  id?: number;
  image: string | null;
  title: string | null;
  siteId: number | null;
  siteName?: string;
}

export interface AboutCompany {
  id?: number;
  image: string | null;
  sectionLabel: string | null;
  mainHeading: string;
  mainDescription: string;
  feature1: string | null;
  feature2: string | null;
  feature3: string | null;
  foundationDescription: string | null;
}

export interface WhyChooseUs {
  id?: number;
  sectionLabel: string;
  mainHeading: string;
  mainDescription: string;
  mainImage: string | null;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
}

export interface ContactDetail {
  id?: number;
  phone: string;
  email: string;
  address: string;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
}

/**
 * A message left on the public contact page. Visitors create these through
 * `POST /api/public/contact-queries`; the admin panel only reads, marks and deletes them.
 */
export interface ContactQuery {
  id?: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  helpTopics: HelpTopic[];
  isRead?: boolean;
  submittedAt?: string;
}

export interface ServiceDetail {
  id?: number;
  serviceId?: number | null;
  mainTitle: string;
  mainDescription: string;
  heroImage: string | null;
  secondaryImage: string | null;
  benefitsTitle: string;
  benefitsDescription: string;
  servicesHeading: string;
  servicesDescription: string;
  detail1Title: string;
  detail1Description: string;
  detail2Title: string;
  detail2Description: string;
  detail3Title: string;
  detail3Description: string;
  benefit1Title: string;
  benefit1Description: string;
  benefit2Title: string;
  benefit2Description: string;
  benefit3Title: string;
  benefit3Description: string;
  benefit4Title: string;
  benefit4Description: string;
  benefit5Title: string;
  benefit5Description: string;
  benefit6Title: string;
  benefit6Description: string;
}

export interface SitePayment {
  id?: number;
  siteId?: number;
  date: string | null;
  amount: number | null;
  description?: string | null;
}

export interface Site {
  id?: number;
  name: string;
  location: string;
  type: SiteType;
  status: SiteStatus;
  budget: number;
  advance: number;
  /** Computed server-side as budget − advance − sum(payments). Read-only. */
  remaining?: number;
  payments?: SitePayment[];
}

export interface SiteInfoItem {
  id?: number;
  siteInfoId?: number;
  itemName: string;
  section: ItemSection;
  sortOrder?: number;
  rate: number | null;
  quantity: number | null;
  /** Computed server-side as rate × quantity. Read-only. */
  total: number | null;
}

export interface SiteInfoAttendance {
  id?: number;
  siteInfoId?: number;
  date: string | null;
  sortOrder?: number;
  engineerSalary: number | null;
  bajri: number | null;
  bajriPayment: number | null;
  sand: number | null;
  sandPayment: number | null;
  bricks: number | null;
  bricksPayment: number | null;
  cement: number | null;
  cementPayment: number | null;
  cementMinus: number | null;
  cementPlus: number | null;
  steel: number | null;
  steelPayment: number | null;
  steelPlus: number | null;
  steelMinus: number | null;
}

export interface SiteInfoReceipt {
  id?: number;
  siteInfoId?: number;
  filePath: string;
  url: string;
}

export interface SiteInfo {
  id?: number;
  siteId: number | null;
  siteName?: string;
  dateStarted: string | null;
  dateEnded: string | null;
  blockNo: string | null;
  streetNo: string | null;
  houseNo: string | null;
  status: SiteStatus;
  mukadam?: string | null;
  ownerName?: string | null;
  items?: SiteInfoItem[];
  attendance?: SiteInfoAttendance[];
  /** Sent as a list of paths/URLs on write; comes back as objects on read. */
  receipts?: SiteInfoReceipt[];
}

export interface Material {
  id?: number;
  name: string;
  unit: string;
  rate: number;
  stock: number;
}

export interface MaterialPurchase {
  id: number;
  materialId: number;
  siteId: number;
  site: string;
  date: string;
  quantity: number;
  rate: number;
  total: number;
  supplier: string | null;
}

/** `GET /api/materials/{id}/purchases` — the ledger plus the summary above the table. */
export interface MaterialPurchaseReport {
  purchases: MaterialPurchase[];
  totalQuantity: number;
  totalAmount: number;
  averageRate: number;
}

export interface InstantEntryPayload {
  siteId: number;
  itemName: string;
  rate: number;
  quantity: number;
}

export interface RecentSite {
  id: number;
  name: string;
  type: SiteType;
  location: string;
  status: SiteStatus;
}

export interface DashboardStats {
  totalEarning: number;
  totalSpent: number;
  totalProjectsAmount: number;
  totalSites: number;
  totalServices: number;
  totalTeamMembers: number;
  totalMaterials: number;
  recentSites: RecentSite[];
}

/**
 * The 51 line items of the cost sheet, in the order the sheet prints them: three
 * columns of 17. Shared by the site-info sheet and the instant-entry picker; the
 * backend validates every write against this same list.
 */
export const SITE_INFO_ITEMS: Record<ItemSection, string[]> = {
  left: [
    'A', 'Bore Work', 'Excavation Work', 'Backfilling Work', 'Gera',
    'Steel Wire', 'Basement Rooftop', 'Shuttering Flat Film',
    'Shuttering (Ground Floor)', 'Shuttering (First Floor)',
    'Steel Work Labor', 'Chunai Labor', 'Kacha Labor',
    'Plaster', 'Aluminum', 'Cameras', 'Geaser',
  ],
  middle: [
    'Electric Pipes', 'Electric Wire', 'Electrician Amount', 'Electric Fitting',
    'Fans', 'Lights etc', 'Sanitary Pipes', 'Sanitory Labor',
    'Sanitory Materials', 'Paint', 'Painter Amount', 'Peeling',
    'Graphing', 'Ceiling', 'Stairs Marble', 'SS Reiling', 'Wall Paper',
  ],
  right: [
    'Marble', 'Marble Labor', 'Tiles', 'Tiles Labor', 'Door Lock',
    'Chips', 'Chips Work', 'Bond', 'Tiff tile', 'Kitchen Hod',
    'Burner', 'Glass', 'Safety Grill', 'Doors', 'Cupboards',
    'Lenter Machine', 'Cost',
  ],
};

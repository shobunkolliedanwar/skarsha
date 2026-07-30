export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  accent_color: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LinkItem = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  url: string;
  description: string | null;
  icon: string | null;
  thumbnail_url: string | null;
  click_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryWithLinks = Category & { links: LinkItem[] };

export type AdminSession = {
  sub: string;
  username: string;
};

export type PremiumPlan = "monthly" | "lifetime";

export type User = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  is_premium: boolean;
  premium_plan: PremiumPlan | null;
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserSession = {
  sub: string;
  email: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  link_id: string;
  created_at: string;
};

export type PremiumTransactionStatus = "pending" | "paid" | "failed" | "expired";

export type PremiumTransaction = {
  id: string;
  user_id: string;
  plan: PremiumPlan;
  amount: number;
  status: PremiumTransactionStatus;
  tripay_merchant_ref: string;
  tripay_reference: string | null;
  payment_method: string | null;
  paid_at: string | null;
  expired_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  updated_at: string;
};

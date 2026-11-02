import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  MessageSquare,
  Settings,
  Users,
  Image,
  Award,
  CheckCircle2,
  Users2,
  LayoutTemplate,
  LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const mainNav: NavigationItem[] = [
  { name: 'الرئيسية', href: '/dashboard', icon: LayoutDashboard },
  { name: 'الخدمات', href: '/dashboard/services', icon: Layers },
  { name: 'المشاريع', href: '/dashboard/projects', icon: Briefcase },
  { name: 'المقالات', href: '/dashboard/blog', icon: FileText },
  { name: 'الرسائل', href: '/dashboard/messages', icon: MessageSquare },
];

export const contentNav: NavigationItem[] = [
  { name: 'خطوات العمل', href: '/dashboard/work-steps', icon: CheckCircle2 },
  { name: 'فريق العمل', href: '/dashboard/team', icon: Users2 },
  { name: 'آراء العملاء', href: '/dashboard/testimonials', icon: Award },
  { name: 'أقسام الصفحات', href: '/dashboard/page-sections', icon: LayoutTemplate },
];

export const adminNav: NavigationItem[] = [
  { name: 'المستخدمين', href: '/dashboard/users', icon: Users },
  { name: 'مكتبة الوسائط', href: '/dashboard/media', icon: Image },
  { name: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
];

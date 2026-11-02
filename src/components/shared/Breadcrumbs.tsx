import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

const routeTitleMap: Record<string, string> = {
  dashboard: 'الرئيسية',
  services: 'الخدمات',
  projects: 'المشاريع',
  blog: 'المقالات',
  messages: 'الرسائل',
  'work-steps': 'خطوات العمل',
  team: 'فريق العمل',
  testimonials: 'آراء العملاء',
  'page-sections': 'أقسام الصفحات',
  users: 'المستخدمين',
  media: 'مكتبة الوسائط',
  settings: 'الإعدادات',
  profile: 'الملف الشخصي',
  new: 'إضافة جديد',
  edit: 'تعديل',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length <= 1) {
    return null;
  }

  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;
    const title = routeTitleMap[segment] || (isNaN(Number(segment)) ? segment : `#${segment}`);

    return { title, url, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        title="الرئيسية"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {breadcrumbItems.slice(1).map((item, index) => (
        <div key={item.url} className="flex items-center gap-1.5">
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
          {item.isLast ? (
            <span className="text-foreground font-semibold px-1 py-0.5 rounded-md bg-muted/60">
              {item.title}
            </span>
          ) : (
            <Link
              to={item.url}
              className="hover:text-foreground transition-colors px-1 py-0.5 rounded-md hover:bg-muted"
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

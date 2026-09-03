import {
  Users, TrendingUp, LucideIcon, MessageSquare,
  FileText, ArrowUpRight, ArrowDownRight,
  Eye, Plus, Briefcase, Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stat {
  title: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  change: string;
  positive: boolean;
  gradient: string;
  glow: string;
  spark: number[];
}

const recentActivity = [
  { id: 1, type: 'مقال جديد', desc: 'تم نشر مقال "أهمية التسويق الرقمي"', time: 'منذ 10 دقائق', icon: FileText, color: 'text-[#7c6cf6] bg-[#7c6cf6]/10' },
  { id: 2, type: 'رسالة',     desc: 'رسالة جديدة من أحمد محمد', time: 'منذ 35 دقيقة', icon: MessageSquare, color: 'text-[#d99a2b] bg-[#f5b942]/10' },
  { id: 3, type: 'مشروع',     desc: 'تم إضافة مشروع "تطبيق الهواتف"', time: 'منذ ساعتين', icon: Briefcase, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40' },
  { id: 4, type: 'زائر',      desc: '1,234 زائر جديد اليوم', time: 'منذ 3 ساعات', icon: Users, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
];

const quickActions = [
  { title: 'إضافة مقال', desc: 'كتابة ونشر مقال جديد', href: '/dashboard/blog/new', icon: FileText, gradient: 'from-[#8b7cf6] to-[#5b4fe0]' },
  { title: 'مشروع جديد', desc: 'إضافة مشروع لمعرض الأعمال', href: '/dashboard/projects', icon: Briefcase, gradient: 'from-cyan-500 to-cyan-600' },
  { title: 'الرسائل',    desc: 'عرض رسائل التواصل',      href: '/dashboard/messages', icon: MessageSquare, gradient: 'from-[#f5b942] to-[#d97706]' },
  { title: 'الإعدادات',  desc: 'ضبط إعدادات الموقع',     href: '/dashboard/settings', icon: Globe, gradient: 'from-slate-500 to-slate-600' },
];

function Sparkline({ data, id }: { data: number[]; id: string }) {
  const w = 100, h = 32;
  const max = Math.max(...data), min = Math.min(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  });
  const area = `0,${h} ${points.join(' ')} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#fill-${id})`} />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Dashboard() {
  const stats: Stat[] = [
    {
      title: 'إجمالي الزوار', value: '12,345', sub: 'خلال آخر 30 يوم',
      icon: Users, change: '+12.5%', positive: true,
      gradient: 'linear-gradient(135deg, #8b7cf6 0%, #5b4fe0 100%)',
      glow: 'rgba(124,108,246,0.35)',
      spark: [4, 6, 5, 8, 7, 9, 12],
    },
    {
      title: 'مشاهدات الصفحات', value: '45,678', sub: 'متوسط يومي: 1,522',
      icon: Eye, change: '+8.3%', positive: true,
      gradient: 'linear-gradient(135deg, #22c1dc 0%, #0e7490 100%)',
      glow: 'rgba(34,193,220,0.35)',
      spark: [10, 9, 11, 10, 13, 12, 15],
    },
    {
      title: 'رسائل جديدة', value: '89', sub: '14 رسالة اليوم',
      icon: MessageSquare, change: '+21%', positive: true,
      gradient: 'linear-gradient(135deg, #f5b942 0%, #d97706 100%)',
      glow: 'rgba(245,185,66,0.35)',
      spark: [3, 5, 4, 6, 5, 8, 9],
    },
    {
      title: 'معدل التفاعل', value: '6.4%', sub: 'معدل الصناعة: 4.2%',
      icon: TrendingUp, change: '+2.1%', positive: true,
      gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
      glow: 'rgba(52,211,153,0.35)',
      spark: [5, 5, 6, 5, 7, 6, 7],
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            مرحباً بك 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            هذه لمحة عامة عن أداء موقع Nexora اليوم
          </p>
        </div>
        <Link
          to="/dashboard/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: 'linear-gradient(135deg, #8b7cf6, #5b4fe0)',
            boxShadow: '0 8px 24px -8px rgba(91,79,224,0.55)',
          }}
        >
          <Plus className="h-4 w-4" />
          <span>إضافة محتوى</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 text-white relative overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1"
            style={{ background: stat.gradient, boxShadow: `0 12px 28px -12px ${stat.glow}` }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold bg-white/20 rounded-full px-2.5 py-1 backdrop-blur-sm">
                {stat.positive
                  ? <ArrowUpRight className="h-3 w-3" />
                  : <ArrowDownRight className="h-3 w-3" />
                }
                {stat.change}
              </div>
            </div>

            <div className="relative mt-4">
              <p className="text-3xl font-bold tracking-tight tabular-nums">{stat.value}</p>
              <p className="text-sm font-medium text-white/85 mt-0.5">{stat.title}</p>
              <p className="text-xs text-white/60 mt-1">{stat.sub}</p>
            </div>

            <div className="relative mt-3 -mx-1">
              <Sparkline data={stat.spark} id={`spark-${i}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full" style={{ background: 'linear-gradient(180deg, #8b7cf6, #5b4fe0)' }} />
              <h2 className="text-base font-bold text-foreground">النشاط الأخير</h2>
            </div>
            <button className="text-xs text-[#5b4fe0] dark:text-[#a99bfa] font-medium hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.desc}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0 hidden group-hover:inline-flex">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-8 w-1 rounded-full" style={{ background: 'linear-gradient(180deg, #8b7cf6, #5b4fe0)' }} />
            <h2 className="text-base font-bold text-foreground">إجراءات سريعة</h2>
          </div>
          <div className="space-y-2.5">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border hover:border-[#7c6cf6]/30 hover:bg-accent/40 transition-all duration-200 group"
              >
                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{action.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-[#7c6cf6] transition-colors shrink-0 rotate-90 group-hover:rotate-45" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mini Performance Bar */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 rounded-full" style={{ background: 'linear-gradient(180deg, #8b7cf6, #5b4fe0)' }} />
            <h2 className="text-base font-bold text-foreground">أداء المحتوى</h2>
          </div>
          <span className="text-xs text-muted-foreground">آخر 7 أيام</span>
        </div>
        <div className="space-y-4">
          {[
            { label: 'المقالات', value: 78, color: 'from-[#8b7cf6] to-[#5b4fe0]' },
            { label: 'المشاريع', value: 54, color: 'from-cyan-500 to-cyan-600' },
            { label: 'الخدمات', value: 91, color: 'from-[#f5b942] to-[#d97706]' },
            { label: 'الرسائل',  value: 35, color: 'from-emerald-500 to-emerald-600' },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-16 shrink-0">{bar.label}</span>
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${bar.color} transition-all duration-700`}
                  style={{ width: `${bar.value}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-8 text-left tabular-nums">{bar.value}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
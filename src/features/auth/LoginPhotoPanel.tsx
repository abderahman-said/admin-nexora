import image from '@/assets/login-img.png';
import logo from '@/assets/logo.png';

const LoginPhotoPanel = () => {
  return (
    <div className="hidden md:flex md:w-1/2 p-4 lg:p-6 bg-muted/20">
      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border/60 shadow-elevated">
        <img
          src={image}
          alt="Nexora Admin Platform"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Sleek SaaS gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-950/40" />

        {/* Logo badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-16 h-16 bg-white rounded-md " />
        </div>

        {/* Headline + Value proposition */}
        <div className="absolute bottom-0 inset-x-0 p-8 lg:p-10 text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>نظام إدارة محتوى فائق السرعة</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight leading-snug">
            إدارة مرنة ومتطورة لكافة أعمالك
          </h2>
          <p className="text-white/75 text-xs lg:text-sm leading-relaxed max-w-md">
            تحكّم متكامل في الخدمات، المشاريع، المدونة، وصندوق التواصل عبر تجربة استخدام سلسة وعالية الكفاءة.
          </p>

          <div className="border-t border-white/15 pt-5 mt-8 flex items-center justify-between text-xs text-white/60">
            <span>منصة Nexora سريعة وآمنة</span>
            <span className="font-mono">v1.0 SaaS Suite</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPhotoPanel;

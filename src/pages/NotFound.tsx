import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background_main text-foreground px-4 text-center overflow-hidden" dir="rtl">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md">
        {/* Modern 404 display */}
        <div className="relative mb-6 select-none flex items-center justify-center">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-muted/80">
            404
          </span>
        </div>

        {/* Text content */}
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-sm">
            الصفحة التي تبحث عنها قد تكون تم نقلها أو حذفها أو أن الرابط غير صحيح.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
          <Button asChild size="default" className="rounded-xl gap-2 shadow-xs">
            <Link to="/dashboard">
              <Home className="h-4 w-4" />
              <span>العودة للرئيسية</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="rounded-xl gap-2 shadow-2xs"
            onClick={() => window.history.back()}
          >
            <button type="button" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              <span>الرجوع للخلف</span>
            </button>
          </Button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-xs text-muted-foreground">
          رمز الخطأ:{' '}
          <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">
            404 NOT_FOUND
          </span>
        </p>
      </div>
    </div>
  );
}

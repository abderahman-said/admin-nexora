import { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top" dir="rtl">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>تم استعادة الاتصال بالإنترنت بنجاح.</span>
      </div>
    );
  }

  return (
    <div className="bg-danger text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top" dir="rtl">
      <WifiOff className="w-3.5 h-3.5 animate-pulse" />
      <span>أنت غير متصل بالإنترنت حالياً. قد لا يتم حفظ التعديلات الجديدة.</span>
    </div>
  );
}

export default OfflineBanner;

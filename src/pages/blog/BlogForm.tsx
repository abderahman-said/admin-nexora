import { Save, ArrowRight, ImagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogForm() {
  return (
    <div className="space-y-6 p-2 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/blog" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <ArrowRight className="w-5 h-5 text-foreground rotate-180" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إضافة مقال جديد</h1>
            <p className="text-muted-foreground mt-1">كتابة ونشر مقال جديد في المدونة</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Save className="w-5 h-5" />
          <span className="hidden sm:inline">حفظ المقال</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">عنوان المقال</label>
              <input type="text" placeholder="اكتب عنوان المقال هنا..." className="w-full bg-background border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">المحتوى</label>
              <textarea rows={15} placeholder="اكتب محتوى المقال هنا..." className="w-full bg-background border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-foreground"></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">حالة النشر</label>
              <select className="w-full bg-background border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground">
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">التصنيف</label>
              <select className="w-full bg-background border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground">
                <option value="web">تطوير المواقع</option>
                <option value="mobile">تطبيقات الموبايل</option>
                <option value="marketing">تسويق رقمي</option>
              </select>
            </div>
          </div>

          <div className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-medium text-foreground">الصورة البارزة</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <ImagePlus className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-foreground">انقر لرفع صورة</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP حتى 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

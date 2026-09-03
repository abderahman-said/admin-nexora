import { Plus, Edit, Trash, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogList() {
  const posts = [
    { id: 1, title: 'كيف تبدأ في تطوير الويب؟', category: 'تطوير المواقع', date: '2026-08-20', status: 'منشور' },
    { id: 2, title: 'أهمية تطبيقات الهواتف للشركات', category: 'تطبيقات الموبايل', date: '2026-08-22', status: 'مسودة' },
  ];

  return (
    <div className="space-y-6 p-2 md:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">المقالات</h1>
          <p className="text-muted-foreground mt-1">إدارة مقالات المدونة الخاصة بموقعك</p>
        </div>
        <Link
          to="/dashboard/blog/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مقال</span>
        </Link>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium text-start">عنوان المقال</th>
                <th className="px-6 py-4 font-medium text-start">التصنيف</th>
                <th className="px-6 py-4 font-medium text-start">التاريخ</th>
                <th className="px-6 py-4 font-medium text-start">الحالة</th>
                <th className="px-6 py-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{post.category}</td>
                  <td className="px-6 py-4 text-muted-foreground">{post.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'منشور' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

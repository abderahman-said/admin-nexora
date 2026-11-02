import { Calendar } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { PostFormData } from '../types/post.types';

interface PostPublishSettingsProps {
  register: UseFormRegister<PostFormData>;
  isPublished: boolean;
}

export function PostPublishSettings({
  register,
  isPublished,
}: PostPublishSettingsProps) {
  return (
    <div className="pt-4 border-t space-y-4">
      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        <span>حالة النشر والجدولة (Publishing Status)</span>
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-1.5">
          <div className="h-5 flex items-center">
            <span className="text-xs font-semibold text-foreground">حالة النشر</span>
          </div>
          <label className="flex items-center gap-2.5 h-10 px-3.5 border border-border rounded-xl bg-card hover:bg-muted/30 cursor-pointer shadow-2xs transition-colors">
            <input
              type="checkbox"
              {...register('is_published')}
              className="w-4 h-4 rounded text-primary focus:ring-primary/40"
            />
            <span className="text-xs font-semibold text-foreground">
              نشر المقال الآن (مرئي للزوار)
            </span>
          </label>
        </div>

        {isPublished && (
          <div className="space-y-1.5">
            <div className="h-5 flex items-center">
              <label className="text-xs font-semibold text-foreground">
                تاريخ ووقت النشر المحدد (اختياري للجدولة)
              </label>
            </div>
            <Input type="datetime-local" {...register('published_at')} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PostPublishSettings;

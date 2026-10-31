import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Power, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useToggleTestimonial,
} from '../hooks/useContent';
import { Testimonial } from '../types/content.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import TranslatableInput from '@/components/shared/TranslatableInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TestimonialsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Testimonial | null>(null);

  const { data: res, isLoading, isError, refetch } = useTestimonials();
  const { mutate: createTestimonial, isPending: creating } = useCreateTestimonial();
  const { mutate: updateTestimonial, isPending: updating } = useUpdateTestimonial();
  const { mutate: deleteTestimonial, isPending: deleting } = useDeleteTestimonial();
  const { mutate: toggleTestimonial } = useToggleTestimonial();

  const testimonials = res?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    client_name: { ar: string; en: string };
    client_job: { ar: string; en: string };
    comment: { ar: string; en: string };
    rating: number;
    is_active: boolean;
  }>({
    defaultValues: {
      client_name: { ar: '', en: '' },
      client_job: { ar: '', en: '' },
      comment: { ar: '', en: '' },
      rating: 5,
      is_active: true,
    },
  });

  useEffect(() => {
    if (editingItem) {
      reset({
        client_name: { ar: editingItem.client_name?.ar || '', en: editingItem.client_name?.en || '' },
        client_job: { ar: editingItem.client_job?.ar || '', en: editingItem.client_job?.en || '' },
        comment: { ar: editingItem.comment?.ar || '', en: editingItem.comment?.en || '' },
        rating: editingItem.rating || 5,
        is_active: editingItem.is_active ?? true,
      });
    } else {
      reset({
        client_name: { ar: '', en: '' },
        client_job: { ar: '', en: '' },
        comment: { ar: '', en: '' },
        rating: 5,
        is_active: true,
      });
    }
  }, [editingItem, reset]);

  const onOpenNew = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const onEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingItem) {
      updateTestimonial(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingItem(null);
          },
        }
      );
    } else {
      createTestimonial(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteTestimonial(selectedItem.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedItem(null);
        },
      });
    }
  };

  const columns: Column<Testimonial>[] = [
    {
      header: 'العميل',
      cell: (item) => (
        <div>
          <p className="font-bold text-foreground">{item.client_name?.ar || item.client_name?.en}</p>
          <p className="text-xs text-muted-foreground">{item.client_job?.ar || item.client_job?.en || 'عميل'}</p>
        </div>
      ),
    },
    {
      header: 'التعليق',
      cell: (item) => (
        <p className="text-xs text-muted-foreground max-w-sm truncate">
          "{item.comment?.ar || item.comment?.en || '—'}"
        </p>
      ),
    },
    {
      header: 'التقييم',
      align: 'center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-0.5 text-amber-500">
          {Array.from({ length: item.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
        </div>
      ),
    },
    {
      header: 'الحالة',
      align: 'center',
      cell: (item) => <StatusBadge status={item.is_active} />,
    },
    {
      header: 'الإجراءات',
      align: 'center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            title="تفعيل / تعطيل"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => toggleTestimonial(item.id)}
          >
            <Power className={`w-4 h-4 ${item.is_active ? 'text-emerald-500' : 'text-slate-400'}`} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="تعديل الرأي"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => onEdit(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSelectedItem(item);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      <PageHeader
        title="آراء وتقييمات العملاء"
        description="إدارة التقييمات والتوصيات الظاهرة في الصفحة الرئيسية"
        action={
          <Button
            onClick={onOpenNew}
            className="rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رأي عميل</span>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={testimonials}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد آراء مسجلة"
        emptyDescription="أضف آراء عملائك لبناء المصداقية وتشجيع الزوار."
        keyExtractor={(item) => item.id}
      />

      {/* Form Dialog (Create & Edit) */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader className="text-right border-b pb-4">
            <DialogTitle className="text-lg font-bold">
              {editingItem ? 'تعديل تقييم العميل' : 'إضافة تقييم جديد'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <TranslatableInput
              label="اسم العميل"
              nameAr="client_name.ar"
              nameEn="client_name.en"
              register={register}
              errorAr={errors.client_name?.ar?.message}
              errorEn={errors.client_name?.en?.message}
              required
            />

            <TranslatableInput
              label="الوظيفة / الشركة"
              nameAr="client_job.ar"
              nameEn="client_job.en"
              register={register}
              placeholderAr="مثال: مدير تنفيذي في شركة..."
              placeholderEn="e.g. CEO at..."
            />

            <TranslatableInput
              label="نص الرأي / التوصية"
              nameAr="comment.ar"
              nameEn="comment.en"
              register={register}
              errorAr={errors.comment?.ar?.message}
              errorEn={errors.comment?.en?.message}
              isTextarea
              rows={3}
              required
            />

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">التقييم (النجوم)</label>
              <select
                {...register('rating', { valueAsNumber: true })}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم - ممتاز)</option>
                <option value={4}>⭐⭐⭐⭐ (4 نجوم - جيد جداً)</option>
                <option value={3}>⭐⭐⭐ (3 نجوم - جيد)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">
                إلغاء
              </Button>
              <LoadingButton
                type="submit"
                loading={creating || updating}
                loadingText="جاري الحفظ..."
                className="rounded-xl px-6"
              >
                {editingItem ? 'حفظ التعديلات' : 'حفظ التقييم'}
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف رأي العميل"
        description={`هل أنت متأكد من حذف هذا التقييم؟`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

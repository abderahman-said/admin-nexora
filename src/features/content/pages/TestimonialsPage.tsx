import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useToggleTestimonial,
} from '../hooks/useContent';
import { Testimonial, TestimonialFormData } from '../types/content.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getTestimonialsColumns } from '../components/testimonials.columns';
import { TestimonialFormDialog } from '../components/TestimonialFormDialog';

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

  const handleCreate = (data: TestimonialFormData, file: File | null) => {
    createTestimonial(
      { ...data, client_image: file },
      {
        onSuccess: () => setFormOpen(false),
      }
    );
  };

  const handleUpdate = (
    id: number,
    dirty: Partial<TestimonialFormData>,
    file: File | null
  ) => {
    updateTestimonial(
      { id, data: { ...dirty, client_image: file } },
      {
        onSuccess: () => {
          setFormOpen(false);
          setEditingItem(null);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    deleteTestimonial(selectedItem.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedItem(null);
      },
    });
  };

  const columns = useMemo(
    () =>
      getTestimonialsColumns({
        onToggle: toggleTestimonial,
        onEdit: (item) => {
          setEditingItem(item);
          setFormOpen(true);
        },
        onDelete: (item) => {
          setSelectedItem(item);
          setDeleteOpen(true);
        },
      }),
    [toggleTestimonial]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="آراء وتقييمات العملاء"
        description="إدارة التقييمات والتوصيات الظاهرة في الصفحة الرئيسية"
        action={
          <Button
            onClick={() => {
              setEditingItem(null);
              setFormOpen(true);
            }}
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

      <TestimonialFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingItem(null);
        }}
        editingItem={editingItem}
        totalCount={testimonials.length}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        isLoading={creating || updating}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedItem(null);
        }}
        title="حذف رأي العميل"
        description="هل أنت متأكد من حذف هذا التقييم؟"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

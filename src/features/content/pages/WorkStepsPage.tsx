import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Power } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useWorkSteps,
  useCreateWorkStep,
  useUpdateWorkStep,
  useDeleteWorkStep,
  useToggleWorkStep,
} from '../hooks/useContent';
import { WorkStep } from '../types/content.types';
import toast from 'react-hot-toast';
import { getDirtyValues } from '@/lib/dirtyValues';
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

export default function WorkStepsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkStep | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkStep | null>(null);

  const { data: res, isLoading, isError, refetch } = useWorkSteps();
  const { mutate: createStep, isPending: creating } = useCreateWorkStep();
  const { mutate: updateStep, isPending: updating } = useUpdateWorkStep();
  const { mutate: deleteStep, isPending: deleting } = useDeleteWorkStep();
  const { mutate: toggleStep } = useToggleWorkStep();

  const steps = res?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<{
    step_number: number;
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    is_active: boolean;
  }>({
    mode: 'onChange',
    defaultValues: {
      step_number: 1,
      title: { ar: '', en: '' },
      description: { ar: '', en: '' },
      is_active: true,
    },
  });

  useEffect(() => {
    if (editingStep) {
      reset({
        step_number: editingStep.step_number || 1,
        title: { ar: editingStep.title?.ar || '', en: editingStep.title?.en || '' },
        description: { ar: editingStep.description?.ar || '', en: editingStep.description?.en || '' },
        is_active: editingStep.is_active ?? true,
      });
    } else {
      reset({
        step_number: steps.length + 1,
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        is_active: true,
      });
    }
  }, [editingStep, steps.length, reset]);

  const onOpenNew = () => {
    setEditingStep(null);
    setFormOpen(true);
  };

  const onEdit = (step: WorkStep) => {
    setEditingStep(step);
    setFormOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingStep) {
      const original = {
        step_number: editingStep.step_number || 1,
        title: { ar: editingStep.title?.ar || '', en: editingStep.title?.en || '' },
        description: { ar: editingStep.description?.ar || '', en: editingStep.description?.en || '' },
        is_active: editingStep.is_active ?? true,
      };
      const dirtyPayload = getDirtyValues(dirtyFields, data, original);
      if (Object.keys(dirtyPayload).length === 0) {
        toast('لا توجد تعديلات للحفظ', { icon: 'ℹ️' });
        return;
      }
      updateStep(
        { id: editingStep.id, data: dirtyPayload },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingStep(null);
          },
        }
      );
    } else {
      createStep(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (selectedStep) {
      deleteStep(selectedStep.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedStep(null);
        },
      });
    }
  };

  const columns: Column<WorkStep>[] = [
    {
      header: 'رقم الخطوة',
      align: 'center',
      cell: (item) => (
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs inline-flex items-center justify-center">
          {item.step_number}
        </span>
      ),
    },
    {
      header: 'العنوان',
      cell: (item) => (
        <div className="font-bold text-foreground">
          {item.title?.ar || item.title?.en}
        </div>
      ),
    },
    {
      header: 'الوصف',
      cell: (item) => (
        <p className="text-xs text-muted-foreground max-w-sm truncate">
          {item.description?.ar || item.description?.en || '—'}
        </p>
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
            onClick={() => toggleStep(item.id)}
          >
            <Power className={`w-4 h-4 ${item.is_active ? 'text-emerald-500' : 'text-slate-400'}`} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="تعديل الخطوة"
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
              setSelectedStep(item);
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
        title="خطوات ومراحل العمل"
        description="إدارة خطوات سير العمل وطريقة تقديم الخدمات المعروضة بالموقع"
        action={
          <Button
            onClick={onOpenNew}
            className="rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة خطوة جديدة</span>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={steps}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد خطوات مضافة"
        emptyDescription="أضف خطوات العمل لتوضيح أسلوب تقديم خدماتك لعملائك."
        keyExtractor={(item) => item.id}
      />

      {/* Form Dialog (Create & Edit) */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader className="text-right border-b pb-4">
            <DialogTitle className="text-lg font-bold">
              {editingStep ? 'تعديل خطوة العمل' : 'إضافة خطوة عمل جديدة'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">ترتيب الخطوة (رقم)</label>
              <input
                type="number"
                min={1}
                {...register('step_number', { required: true, valueAsNumber: true })}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <TranslatableInput
              label="عنوان الخطوة"
              nameAr="title.ar"
              nameEn="title.en"
              register={register}
              errorAr={errors.title?.ar?.message}
              errorEn={errors.title?.en?.message}
              required
            />

            <TranslatableInput
              label="شرح الخطوة"
              nameAr="description.ar"
              nameEn="description.en"
              register={register}
              errorAr={errors.description?.ar?.message}
              errorEn={errors.description?.en?.message}
              isTextarea
              rows={3}
              required
            />

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">
                إلغاء
              </Button>
              <LoadingButton
                type="submit"
                loading={creating || updating}
                disabled={Boolean(editingStep && !isDirty) || creating || updating}
                loadingText="جاري الحفظ..."
                className="rounded-xl px-6"
              >
                {editingStep ? 'حفظ التعديلات' : 'حفظ الخطوة'}
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف خطوة العمل"
        description={`هل أنت متأكد من حذف هذه الخطوة؟`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

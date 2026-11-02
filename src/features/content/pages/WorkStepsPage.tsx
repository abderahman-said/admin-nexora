import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import {
  useWorkSteps,
  useCreateWorkStep,
  useUpdateWorkStep,
  useDeleteWorkStep,
  useToggleWorkStep,
} from '../hooks/useContent';
import { WorkStep, WorkStepFormData } from '../types/content.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getWorkStepsColumns } from '../components/workSteps.columns';
import { WorkStepFormDialog } from '../components/WorkStepFormDialog';

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

  const handleCreate = (data: WorkStepFormData, file: File | null) => {
    createStep(
      { ...data, icon: file },
      {
        onSuccess: () => setFormOpen(false),
      }
    );
  };

  const handleUpdate = (
    id: number,
    dirty: Partial<WorkStepFormData>,
    file: File | null
  ) => {
    updateStep(
      { id, data: { ...dirty, icon: file } },
      {
        onSuccess: () => {
          setFormOpen(false);
          setEditingStep(null);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedStep) return;
    deleteStep(selectedStep.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedStep(null);
      },
    });
  };

  const columns = useMemo(
    () =>
      getWorkStepsColumns({
        onToggle: toggleStep,
        onEdit: (step) => {
          setEditingStep(step);
          setFormOpen(true);
        },
        onDelete: (step) => {
          setSelectedStep(step);
          setDeleteOpen(true);
        },
      }),
    [toggleStep]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="خطوات ومراحل العمل"
        description="إدارة خطوات سير العمل وطريقة تقديم الخدمات المعروضة بالموقع"
        action={
          <Button
            onClick={() => {
              setEditingStep(null);
              setFormOpen(true);
            }}
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
        emptyDescription="أضف خطوات العمل لتوضيح أسلوب تقديم خدماتك للمتعاملين."
        keyExtractor={(item) => item.id}
      />

      <WorkStepFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingStep(null);
        }}
        editingStep={editingStep}
        totalCount={steps.length}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        isLoading={creating || updating}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedStep(null);
        }}
        title="حذف خطوة العمل"
        description="هل أنت متأكد من حذف هذه الخطوة نهائياً؟"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

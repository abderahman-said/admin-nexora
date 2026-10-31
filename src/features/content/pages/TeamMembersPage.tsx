import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Power } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  useToggleTeamMember,
} from '../hooks/useContent';
import { TeamMember } from '../types/content.types';
import toast from 'react-hot-toast';
import { getDirtyValues, createPatchFormData } from '@/lib/dirtyValues';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import TranslatableInput from '@/components/shared/TranslatableInput';
import ImageUploadPreview from '@/components/shared/ImageUploadPreview';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TeamMembersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: res, isLoading, isError, refetch } = useTeamMembers();
  const { mutate: createMember, isPending: creating } = useCreateTeamMember();
  const { mutate: updateMember, isPending: updating } = useUpdateTeamMember();
  const { mutate: deleteMember, isPending: deleting } = useDeleteTeamMember();
  const { mutate: toggleMember } = useToggleTeamMember();

  const members = res?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<{
    name: { ar: string; en: string };
    job_title: { ar: string; en: string };
    badge_text: { ar: string; en: string };
    is_active: boolean;
  }>({
    mode: 'onChange',
    defaultValues: {
      name: { ar: '', en: '' },
      job_title: { ar: '', en: '' },
      badge_text: { ar: '', en: '' },
      is_active: true,
    },
  });

  useEffect(() => {
    if (editingMember) {
      reset({
        name: { ar: editingMember.name?.ar || '', en: editingMember.name?.en || '' },
        job_title: { ar: editingMember.job_title?.ar || '', en: editingMember.job_title?.en || '' },
        badge_text: { ar: editingMember.badge_text?.ar || '', en: editingMember.badge_text?.en || '' },
        is_active: editingMember.is_active ?? true,
      });
    } else {
      reset({
        name: { ar: '', en: '' },
        job_title: { ar: '', en: '' },
        badge_text: { ar: '', en: '' },
        is_active: true,
      });
    }
  }, [editingMember, reset]);

  const onOpenNew = () => {
    setEditingMember(null);
    setPhotoFile(null);
    setModalOpen(true);
  };

  const onOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setPhotoFile(null);
    setModalOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingMember) {
      const original = {
        name: { ar: editingMember.name?.ar || '', en: editingMember.name?.en || '' },
        job_title: { ar: editingMember.job_title?.ar || '', en: editingMember.job_title?.en || '' },
        badge_text: { ar: editingMember.badge_text?.ar || '', en: editingMember.badge_text?.en || '' },
        is_active: editingMember.is_active ?? true,
      };
      const dirty = getDirtyValues(dirtyFields, data, original);
      if (Object.keys(dirty).length === 0 && !photoFile) {
        toast('لا توجد تعديلات للحفظ', { icon: 'ℹ️' });
        return;
      }
      const patchFd = createPatchFormData(dirty, { image: photoFile });
      updateMember(
        { id: editingMember.id, data: patchFd },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingMember(null);
            setPhotoFile(null);
          },
        }
      );
    } else {
      const fd = new FormData();
      fd.append('name[ar]', data.name.ar);
      fd.append('name[en]', data.name.en);
      fd.append('job_title[ar]', data.job_title.ar);
      fd.append('job_title[en]', data.job_title.en);
      if (data.badge_text?.ar) fd.append('badge_text[ar]', data.badge_text.ar);
      if (data.badge_text?.en) fd.append('badge_text[en]', data.badge_text.en);
      fd.append('is_active', data.is_active ? '1' : '0');
      if (photoFile) fd.append('image', photoFile);

      createMember(fd, {
        onSuccess: () => {
          setModalOpen(false);
          reset();
          setPhotoFile(null);
        },
      });
    }
  };

  const handleDelete = () => {
    if (selectedMember) {
      deleteMember(selectedMember.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedMember(null);
        },
      });
    }
  };

  const columns: Column<TeamMember>[] = [
    {
      header: 'عضو الفريق',
      cell: (item) => {
        const imgUrl = getMediaUrl(item.image);
        return (
          <div className="flex items-center gap-3">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={item.name?.ar}
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {item.name?.ar?.slice(0, 2) || 'TM'}
              </div>
            )}
            <div>
              <p className="font-bold text-foreground">{item.name?.ar || item.name?.en}</p>
              <p className="text-xs text-muted-foreground">{item.job_title?.ar || item.job_title?.en}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'شارة التميز',
      cell: (item) => (
        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
          {item.badge_text?.ar || item.badge_text?.en || '—'}
        </span>
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
            onClick={() => toggleMember(item.id)}
          >
            <Power className={`w-4 h-4 ${item.is_active ? 'text-emerald-500' : 'text-slate-400'}`} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="تعديل"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => onOpenEdit(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSelectedMember(item);
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
        title="فريق العمل"
        description="إدارة بطاقات ومعلومات أعضاء وكوادر الشركة"
        action={
          <Button
            onClick={onOpenNew}
            className="rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عضو فريق</span>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا يوجد أعضاء فريق"
        emptyDescription="أضف أعضاء الفريق لتعريف الزوار بالكوادر المتميزة لديك."
        keyExtractor={(item) => item.id}
      />

      {/* Modal Dialog for Add & Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader className="text-right border-b pb-4">
            <DialogTitle className="text-lg font-bold">
              {editingMember ? 'تعديل بيانات عضو الفريق' : 'إضافة عضو فريق جديد'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <TranslatableInput
              label="الاسم الكامل"
              nameAr="name.ar"
              nameEn="name.en"
              register={register}
              errorAr={errors.name?.ar?.message}
              errorEn={errors.name?.en?.message}
              required
            />

            <TranslatableInput
              label="المسمى الوظيفي"
              nameAr="job_title.ar"
              nameEn="job_title.en"
              register={register}
              errorAr={errors.job_title?.ar?.message}
              errorEn={errors.job_title?.en?.message}
              required
            />

            <TranslatableInput
              label="شارة أو تمييز (اختياري)"
              nameAr="badge_text.ar"
              nameEn="badge_text.en"
              register={register}
              placeholderAr="مثال: قائد الفريق أو خبير"
              placeholderEn="e.g. Team Lead"
            />

            <ImageUploadPreview
              label="الصورة الشخصية"
              currentImageUrl={getMediaUrl(editingMember?.image)}
              onChange={setPhotoFile}
              aspectRatio="square"
            />

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl">
                إلغاء
              </Button>
              <LoadingButton
                type="submit"
                loading={creating || updating}
                disabled={Boolean(editingMember && !isDirty && !photoFile) || creating || updating}
                loadingText="جاري الحفظ..."
                className="rounded-xl px-6"
              >
                {editingMember ? 'حفظ التعديلات' : 'حفظ العضو'}
              </LoadingButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف عضو الفريق"
        description={`هل أنت متأكد من حذف هذا العضو؟`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

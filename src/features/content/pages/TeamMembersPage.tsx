import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import {
  useTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  useToggleTeamMember,
} from '../hooks/useContent';
import { TeamMember, TeamMemberFormData } from '../types/content.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getTeamMembersColumns } from '../components/teamMembers.columns';
import { TeamMemberFormDialog } from '../components/TeamMemberFormDialog';

export default function TeamMembersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { data: res, isLoading, isError, refetch } = useTeamMembers();
  const { mutate: createMember, isPending: creating } = useCreateTeamMember();
  const { mutate: updateMember, isPending: updating } = useUpdateTeamMember();
  const { mutate: deleteMember, isPending: deleting } = useDeleteTeamMember();
  const { mutate: toggleMember } = useToggleTeamMember();

  const members = res?.data || [];

  const handleCreate = (data: TeamMemberFormData, file: File | null) => {
    createMember(
      { ...data, image: file },
      {
        onSuccess: () => setModalOpen(false),
      }
    );
  };

  const handleUpdate = (
    id: number,
    dirty: Partial<TeamMemberFormData>,
    file: File | null
  ) => {
    updateMember(
      { id, data: { ...dirty, image: file } },
      {
        onSuccess: () => {
          setModalOpen(false);
          setEditingMember(null);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedMember) return;
    deleteMember(selectedMember.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedMember(null);
      },
    });
  };

  const columns = useMemo(
    () =>
      getTeamMembersColumns({
        onToggle: toggleMember,
        onEdit: (item) => {
          setEditingMember(item);
          setModalOpen(true);
        },
        onDelete: (item) => {
          setSelectedMember(item);
          setDeleteOpen(true);
        },
      }),
    [toggleMember]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="فريق العمل"
        description="إدارة بطاقات ومعلومات أعضاء وكوادر الشركة"
        action={
          <Button
            onClick={() => {
              setEditingMember(null);
              setModalOpen(true);
            }}
            className="rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عضو جديد</span>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا يوجد أعضاء مسجلين"
        emptyDescription="أضف أفراد الفريق لعرض خبراتهم وأدوارهم للعملاء."
        keyExtractor={(item) => item.id}
      />

      <TeamMemberFormDialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingMember(null);
        }}
        editingMember={editingMember}
        totalCount={members.length}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        isLoading={creating || updating}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedMember(null);
        }}
        title="حذف عضو الفريق"
        description="هل أنت متأكد من حذف هذا العضو نهائياً؟"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

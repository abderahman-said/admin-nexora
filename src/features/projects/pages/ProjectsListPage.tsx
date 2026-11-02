import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useDeleteProject, useToggleProject } from '../hooks/useProjects';
import { Project } from '../types/project.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getProjectsColumns } from '../components/projects.columns';

export default function ProjectsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = useProjects();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const { mutate: toggleProject } = useToggleProject();

  const projects = response?.data || [];

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.title?.ar?.toLowerCase().includes(q) ||
        p.title?.en?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q)
    );
  }, [projects, search]);

  const handleDelete = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedProject(null);
        },
      });
    }
  };

  const columns = useMemo(
    () =>
      getProjectsColumns({
        onToggleField: (id, field) => toggleProject({ id, field }),
        onEdit: (item) => navigate(`/dashboard/projects/${item.id}/edit`),
        onDelete: (item) => {
          setSelectedProject(item);
          setDeleteOpen(true);
        },
      }),
    [toggleProject, navigate]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="معرض المشاريع"
        description="إدارة مشاريع وأعمال الشركة، تصنيفاتها وأجزائها وتفاصيلها البرمجية"
        action={
          <Button
            onClick={() => navigate('/dashboard/projects/new')}
            className="rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مشروع جديد</span>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filteredProjects}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد مشاريع مضافة"
        emptyDescription="أضف أول مشروع في معرض أعمالك لإبهار عملائك."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'ابحث باسم المشروع أو الرابط...',
        }}
        keyExtractor={(item) => item.id}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedProject(null);
        }}
        title="حذف المشروع"
        description={`هل أنت متأكد من حذف مشروع "${
          selectedProject?.title?.ar || selectedProject?.title?.en
        }"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

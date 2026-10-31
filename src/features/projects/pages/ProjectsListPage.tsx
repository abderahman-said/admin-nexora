import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Power, Star, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useDeleteProject, useToggleProject } from '../hooks/useProjects';
import { Project } from '../types/project.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';

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

  const columns: Column<Project>[] = [
    {
      header: 'المشروع',
      cell: (item) => {
        const cover = getMediaUrl(item.cover_image) || getMediaUrl(item.image);
        return (
          <div className="flex items-center gap-3">
            {cover ? (
              <img
                src={cover}
                alt={item.title?.ar}
                className="w-12 h-12 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="font-bold text-foreground">{item.title?.ar || item.title?.en}</p>
              <p className="text-xs text-muted-foreground">{item.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'الخدمة التابعة',
      cell: (item) => (
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
          {item.service?.title?.ar || item.service?.title?.en || 'غير محدد'}
        </span>
      ),
    },
    {
      header: 'مميز',
      align: 'center',
      cell: (item) => (
        <button
          onClick={() => toggleProject({ id: item.id, field: 'is_featured' })}
          className={`p-1.5 rounded-lg transition-colors ${item.is_featured ? 'text-amber-500 bg-amber-500/10' : 'text-slate-300 hover:text-slate-500'}`}
          title={item.is_featured ? 'مشروع مميز' : 'تمييز المشروع'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
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
            onClick={() => toggleProject({ id: item.id, field: 'is_active' })}
          >
            <Power className={`w-4 h-4 ${item.is_active ? 'text-emerald-500' : 'text-slate-400'}`} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="تعديل"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => navigate(`/dashboard/projects/${item.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSelectedProject(item);
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
        title="إدارة المشاريع"
        description="استعراض وإدارة معرض أعمال الشركة والمشاريع المنجزة"
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
        emptyDescription="ابدأ بإضافة أول مشروع لمعرض أعمالك."
        emptyActionLabel="إضافة مشروع الآن"
        onEmptyAction={() => navigate('/dashboard/projects/new')}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'ابحث عن مشروع...',
        }}
        keyExtractor={(item) => item.id}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف المشروع"
        description={`هل أنت متأكد من حذف المشروع "${selectedProject?.title?.ar || selectedProject?.title?.en}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

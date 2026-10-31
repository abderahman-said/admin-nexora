import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Power, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useServices, useDeleteService, useToggleService } from '../hooks/useServices';
import { Service } from '../types/service.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';

export default function ServicesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = useServices();
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();
  const { mutate: toggleService } = useToggleService();

  const services = response?.data || [];

  const filteredServices = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter(
      (s) =>
        s.title?.ar?.toLowerCase().includes(q) ||
        s.title?.en?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
    );
  }, [services, search]);

  const handleDelete = () => {
    if (selectedService) {
      deleteService(selectedService.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedService(null);
        },
      });
    }
  };

  const columns: Column<Service>[] = [
    {
      header: 'اسم الخدمة',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-foreground">{item.title?.ar || item.title?.en}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'الوصف المختصر',
      cell: (item) => (
        <p className="text-xs text-muted-foreground max-w-sm truncate">
          {item.short_description?.ar || item.short_description?.en || '—'}
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
            onClick={() => toggleService(item.id)}
          >
            <Power className={`w-4 h-4 ${item.is_active ? 'text-emerald-500' : 'text-slate-400'}`} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="تعديل"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            onClick={() => navigate(`/dashboard/services/${item.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSelectedService(item);
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
        title="إدارة الخدمات"
        description="استعراض وتعديل باقة الخدمات التي تقدمها الشركة"
        action={
          <Button
            onClick={() => navigate('/dashboard/services/new')}
            className="rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة خدمة جديدة</span>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={filteredServices}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد خدمات مضافة"
        emptyDescription="ابدأ بإضافة أول خدمة لتظهر في موقعك."
        emptyActionLabel="إضافة خدمة الآن"
        onEmptyAction={() => navigate('/dashboard/services/new')}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'ابحث باسم الخدمة أو الرابط...',
        }}
        keyExtractor={(item) => item.id}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف الخدمة"
        description={`هل أنت متأكد من حذف الخدمة "${selectedService?.title?.ar || selectedService?.title?.en}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

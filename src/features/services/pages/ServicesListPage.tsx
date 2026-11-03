import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useServices, useDeleteService, useToggleService } from '../hooks/useServices';
import { Service } from '../types/service.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { useCanWrite } from '@/hooks/useCanWrite';
import { getServicesColumns } from '../components/services.columns';

export default function ServicesListPage() {
  const navigate = useNavigate();
  const canWrite = useCanWrite();
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

  const columns = useMemo(
    () =>
      getServicesColumns({
        onToggle: (id) => toggleService(id),
        onEdit: (item) => navigate(`/dashboard/services/${item.id}/edit`),
        onDelete: (item) => {
          setSelectedService(item);
          setDeleteOpen(true);
        },
      }),
    [toggleService, navigate]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="إدارة الخدمات"
        description="استعراض وتعديل باقة الخدمات التي تقدمها الشركة"
        action={
          canWrite ? (
            <Button
              onClick={() => navigate('/dashboard/services/new')}
              className="rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة خدمة جديدة</span>
            </Button>
          ) : undefined
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
        emptyActionLabel={canWrite ? 'إضافة خدمة الآن' : undefined}
        onEmptyAction={
          canWrite ? () => navigate('/dashboard/services/new') : undefined
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'ابحث باسم الخدمة أو الرابط...',
        }}
        keyExtractor={(item) => item.id}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedService(null);
        }}
        title="حذف الخدمة"
        description={`هل أنت متأكد من حذف الخدمة "${
          selectedService?.title?.ar || selectedService?.title?.en
        }"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

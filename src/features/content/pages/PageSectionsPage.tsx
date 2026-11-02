import { useState, useMemo } from 'react';
import { usePageSections, useUpdatePageSection } from '../hooks/useContent';
import { PageSection } from '../types/content.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import { getPageSectionsColumns } from '../components/pageSections.columns';
import { PageSectionFormDialog } from '../components/PageSectionFormDialog';

export default function PageSectionsPage() {
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const { data: res, isLoading, isError, refetch } = usePageSections();
  const { mutate: updateSection, isPending: updating } = useUpdatePageSection();

  const sections = res?.data || [];

  const handleUpdate = (slug: string, payload: FormData) => {
    updateSection(
      { slug, data: payload },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedSection(null);
        },
      }
    );
  };

  const columns = useMemo(
    () =>
      getPageSectionsColumns({
        onEdit: (sec) => {
          setSelectedSection(sec);
          setEditOpen(true);
        },
      }),
    []
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="أقسام ومحتوى الصفحات"
        description="تعديل نصوص وصور الأقسام الثابتة في صفحات الموقع (عن الشركة، تواصل، الرئيسية)"
      />

      <DataTable
        columns={columns}
        data={sections}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد أقسام مسجلة"
        emptyDescription="سيتم عرض أقسام الصفحات الثابتة هنا."
        keyExtractor={(item, index) => item.section_key || item.slug || item.id || index}
      />

      <PageSectionFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedSection(null);
        }}
        section={selectedSection}
        onUpdate={handleUpdate}
        isLoading={updating}
      />
    </div>
  );
}

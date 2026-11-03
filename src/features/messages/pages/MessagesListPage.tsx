import { useState, useMemo } from 'react';
import {
  useMessages,
  useDeleteMessage,
  useUpdateMessageStatus,
} from '../hooks/useMessages';
import { ContactMessage, MessageStatus } from '../types/message.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useCanWrite } from '@/hooks/useCanWrite';
import { getMessagesColumns } from '../components/messages.columns';
import { MessageDetailsDialog } from '../components/MessageDetailsDialog';

export default function MessagesListPage() {
  const canWrite = useCanWrite();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = useMessages();
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateMessageStatus();

  const messages = response?.data || [];

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        !search.trim() ||
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase()) ||
        m.subject?.toLowerCase().includes(search.toLowerCase()) ||
        m.message?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  const handleOpenDetails = (item: ContactMessage) => {
    setSelectedMessage(item);
    setViewDialogOpen(true);
    if (canWrite && item.status === 'new') {
      updateStatus({ id: item.id, status: 'read' });
    }
  };

  const handleUpdateStatus = (status: MessageStatus) => {
    if (!selectedMessage) return;
    updateStatus(
      { id: selectedMessage.id, status },
      {
        onSuccess: () =>
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null)),
      }
    );
  };

  const handleDelete = () => {
    if (selectedMessage) {
      deleteMessage(selectedMessage.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedMessage(null);
        },
      });
    }
  };

  const columns = useMemo(
    () =>
      getMessagesColumns({
        canWrite,
        onOpenDetails: handleOpenDetails,
        onDelete: (item) => {
          setSelectedMessage(item);
          setDeleteOpen(true);
        },
      }),
    [canWrite]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8" dir="rtl">
      <PageHeader
        title="رسائل التواصل"
        description="استعراض والرد على رسائل واستفسارات زوار الموقع"
        action={
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl text-xs font-semibold">
            {['all', 'new', 'read', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === st
                    ? 'bg-card text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st === 'all'
                  ? 'الكل'
                  : st === 'new'
                  ? 'جديدة'
                  : st === 'read'
                  ? 'مقروءة'
                  : 'مغلقة'}
              </button>
            ))}
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={filteredMessages}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="لا توجد رسائل"
        emptyDescription="لم تتلق أي رسائل في هذا القسم بعد."
        search={{
          value: search,
          onChange: setSearch,
          placeholder: 'ابحث بالاسم، البريد أو محتوى الرسالة...',
        }}
        keyExtractor={(item) => item.id}
      />

      <MessageDetailsDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        message={selectedMessage}
        canWrite={canWrite}
        onUpdateStatus={handleUpdateStatus}
        isUpdatingStatus={updatingStatus}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedMessage(null);
        }}
        title="حذف الرسالة"
        description={`هل أنت متأكد من حذف رسالة "${selectedMessage?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

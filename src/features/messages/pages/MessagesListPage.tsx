import { useState, useMemo } from 'react';
import { Eye, Trash2, Mail, Phone, Calendar, User } from 'lucide-react';
import { useMessages, useDeleteMessage, useUpdateMessageStatus } from '../hooks/useMessages';
import { ContactMessage, MessageStatus } from '../types/message.types';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function MessagesListPage() {
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
    if (item.status === 'new') {
      updateStatus({ id: item.id, status: 'read' });
    }
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

  const columns: Column<ContactMessage>[] = [
    {
      header: 'المرسل',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'الموضوع',
      cell: (item) => (
        <div>
          <p className="font-medium text-foreground text-sm">{item.subject || 'بدون موضوع'}</p>
          <p className="text-xs text-muted-foreground truncate max-w-xs">{item.message}</p>
        </div>
      ),
    },
    {
      header: 'الهاتف',
      cell: (item) => <span className="text-xs text-muted-foreground font-mono">{item.phone || '—'}</span>,
    },
    {
      header: 'الحالة',
      align: 'center',
      cell: (item) => <StatusBadge status={item.status} type="message" />,
    },
    {
      header: 'التاريخ',
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : '—'}
        </span>
      ),
    },
    {
      header: 'الإجراءات',
      align: 'center',
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            title="عرض التفاصيل"
            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => handleOpenDetails(item)}
          >
            <Eye className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            title="حذف"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              setSelectedMessage(item);
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
        title="رسائل التواصل"
        description="استعراض والرد على رسائل واستفسارات زوار الموقع"
        action={
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl text-xs font-semibold">
            {['all', 'new', 'read', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === st ? 'bg-card text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st === 'all' ? 'الكل' : st === 'new' ? 'جديدة' : st === 'read' ? 'مقروءة' : 'مغلقة'}
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

      {/* Message Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-xl" dir="rtl">
          <DialogHeader className="text-right border-b pb-4">
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              <span>تفاصيل الرسالة</span>
              {selectedMessage && (
                <StatusBadge status={selectedMessage.status} type="message" />
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border">
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5" /> الاسم
                  </span>
                  <p className="font-semibold text-foreground">{selectedMessage.name}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
                  </span>
                  <p className="font-semibold text-foreground">{selectedMessage.email}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5" /> الهاتف
                  </span>
                  <p className="font-semibold text-foreground">{selectedMessage.phone || 'غير متوفر'}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5" /> تاريخ الإرسال
                  </span>
                  <p className="font-semibold text-foreground">
                    {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString('ar-EG') : '—'}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">الموضوع:</span>
                <p className="font-bold text-foreground text-base">{selectedMessage.subject || 'بدون موضوع'}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">نص الرسالة:</span>
                <div className="bg-muted/30 p-4 rounded-xl border border-border text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">تغيير الحالة:</span>
                  {(['new', 'read', 'in_progress', 'closed'] as MessageStatus[]).map((st) => (
                    <button
                      key={st}
                      disabled={updatingStatus || selectedMessage.status === st}
                      onClick={() =>
                        updateStatus(
                          { id: selectedMessage.id, status: st },
                          {
                            onSuccess: () =>
                              setSelectedMessage((prev) => (prev ? { ...prev, status: st } : null)),
                          }
                        )
                      }
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        selectedMessage.status === st
                          ? 'border-primary bg-primary text-primary-foreground font-bold'
                          : 'border-border hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {st === 'new' ? 'جديدة' : st === 'read' ? 'مقروءة' : st === 'in_progress' ? 'قيد المتابعة' : 'مغلقة'}
                    </button>
                  ))}
                </div>

                <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="rounded-xl">
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف الرسالة"
        description={`هل أنت متأكد من حذف رسالة "${selectedMessage?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

import { Mail, Phone, Calendar, User } from 'lucide-react';
import { ContactMessage, MessageStatus } from '../types/message.types';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MessageDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: ContactMessage | null;
  onUpdateStatus: (status: MessageStatus) => void;
  isUpdatingStatus: boolean;
}

export function MessageDetailsDialog({
  open,
  onOpenChange,
  message,
  onUpdateStatus,
  isUpdatingStatus,
}: MessageDetailsDialogProps) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>تفاصيل الرسالة</span>
            <StatusBadge status={message.status} type="message" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border">
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5" /> الاسم
              </span>
              <p className="font-semibold text-foreground">{message.name}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
              </span>
              <p className="font-semibold text-foreground">{message.email}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5" /> الهاتف
              </span>
              <p className="font-semibold text-foreground">
                {message.phone || 'غير متوفر'}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5" /> تاريخ الإرسال
              </span>
              <p className="font-semibold text-foreground">
                {message.created_at
                  ? new Date(message.created_at).toLocaleString('ar-EG')
                  : '—'}
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-1">
              الموضوع:
            </span>
            <p className="font-bold text-foreground text-base">
              {message.subject || 'بدون موضوع'}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-1">
              نص الرسالة:
            </span>
            <div className="bg-muted/30 p-4 rounded-xl border border-border text-foreground leading-relaxed whitespace-pre-wrap">
              {message.message}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">تغيير الحالة:</span>
              {(['new', 'read', 'in_progress', 'closed'] as MessageStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    disabled={isUpdatingStatus || message.status === st}
                    onClick={() => onUpdateStatus(st)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      message.status === st
                        ? 'border-primary bg-primary text-primary-foreground font-bold'
                        : 'border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {st === 'new'
                      ? 'جديدة'
                      : st === 'read'
                      ? 'مقروءة'
                      : st === 'in_progress'
                      ? 'قيد المتابعة'
                      : 'مغلقة'}
                  </button>
                )
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MessageDetailsDialog;

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { ContactMessage } from '@/features/messages/types/message.types';

interface DashboardRecentMessagesProps {
  messages: ContactMessage[];
}

export function DashboardRecentMessages({ messages }: DashboardRecentMessagesProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm">أحدث الرسائل الواردة</h3>
          <p className="text-[11px] text-muted-foreground">استفسارات تم استلامها مؤخراً</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/messages')}
          className="text-xs text-primary hover:text-primary"
        >
          عرض الكل
        </Button>
      </div>

      <div className="divide-y divide-border/60">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground py-8 text-center">
            لا توجد رسائل واردة حالياً
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => navigate('/dashboard/messages')}
              className="py-3 flex items-center justify-between hover:bg-muted/40 px-2 rounded-xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8.5 h-8.5 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                  {msg.name?.slice(0, 1) || '؟'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {msg.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                    {msg.subject || msg.message}
                  </p>
                </div>
              </div>
              <div className="shrink-0 ms-2">
                <StatusBadge status={msg.status} type="message" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardRecentMessages;

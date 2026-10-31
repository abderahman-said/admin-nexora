export type MessageStatus = 'new' | 'read' | 'in_progress' | 'closed';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
}

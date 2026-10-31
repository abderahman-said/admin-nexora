export interface MediaItem {
  id: number;
  name: string;
  file_name?: string;
  file_path?: string;
  url?: string;
  folder?: string;
  mime_type?: string;
  size?: number | string;
  created_at?: string;
}

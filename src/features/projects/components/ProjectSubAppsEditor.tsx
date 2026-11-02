import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectPartApp } from '../types/project.types';

interface ProjectSubAppsEditorProps {
  apps?: ProjectPartApp[];
  onAddApp: () => void;
  onRemoveApp: (appIdx: number) => void;
  onUpdateApp: (
    appIdx: number,
    field: 'title' | 'description',
    lang: 'ar' | 'en',
    val: string
  ) => void;
}

export function ProjectSubAppsEditor({
  apps = [],
  onAddApp,
  onRemoveApp,
  onUpdateApp,
}: ProjectSubAppsEditorProps) {
  return (
    <div className="p-3.5 bg-background border rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">
          التطبيقات الفرعية (Apps - مثال: تطبيق العميل، تطبيق السائق)
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddApp}
          className="h-7 text-xs rounded-lg flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          <span>إضافة تطبيق</span>
        </Button>
      </div>

      {apps.map((app, appIdx) => (
        <div key={appIdx} className="p-2.5 border rounded-lg bg-muted/10 space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">
              تطبيق #{appIdx + 1}
            </span>
            <button
              type="button"
              onClick={() => onRemoveApp(appIdx)}
              className="text-destructive hover:bg-destructive/10 p-1 rounded"
              title="حذف التطبيق الفرعي"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              type="text"
              value={app.title?.ar || ''}
              onChange={(e) => onUpdateApp(appIdx, 'title', 'ar', e.target.value)}
              placeholder="اسم التطبيق (عربي) *"
              className="h-8.5 px-2.5 text-xs"
            />
            <Input
              type="text"
              dir="ltr"
              value={app.title?.en || ''}
              onChange={(e) => onUpdateApp(appIdx, 'title', 'en', e.target.value)}
              placeholder="App Title (EN) *"
              className="h-8.5 px-2.5 text-xs font-sans"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              type="text"
              value={app.description?.ar || ''}
              onChange={(e) => onUpdateApp(appIdx, 'description', 'ar', e.target.value)}
              placeholder="وصف التطبيق (عربي - اختياري)"
              className="h-8.5 px-2.5 text-xs"
            />
            <Input
              type="text"
              dir="ltr"
              value={app.description?.en || ''}
              onChange={(e) => onUpdateApp(appIdx, 'description', 'en', e.target.value)}
              placeholder="App Description (EN - optional)"
              className="h-8.5 px-2.5 text-xs font-sans"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectSubAppsEditor;

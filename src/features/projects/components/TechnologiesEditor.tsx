import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TechnologiesEditorProps {
  technologies?: string[];
  onChange: (techs: string[]) => void;
}

export function TechnologiesEditor({
  technologies = [],
  onChange,
}: TechnologiesEditorProps) {
  const [techs, setTechs] = useState<string[]>(technologies || []);
  const [inputVal, setInputVal] = useState('');

  // Keep internal state in sync with external prop
  useEffect(() => {
    setTechs(technologies || []);
  }, [technologies]);

  const addTech = (text: string) => {
    const raw = text
      .split(/[,،]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (raw.length === 0) return;
    const combined = Array.from(new Set([...techs, ...raw])).slice(0, 15);
    setTechs(combined);
    onChange(combined);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      e.stopPropagation();
      addTech(inputVal);
    }
  };

  const removeTech = (indexToRemove: number) => {
    const filtered = techs.filter((_, i) => i !== indexToRemove);
    setTechs(filtered);
    onChange(filtered);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">
          التقنيات المستخدمة (اكتب واضغط Enter أو أضف)
        </label>
        <span className="text-[11px] text-muted-foreground">{techs.length} / 15</span>
      </div>

      {techs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
          {techs.map((tech, idx) => (
            <span
              key={`${tech}-${idx}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20"
            >
              <span>{tech}</span>
              <button
                type="button"
                onClick={() => removeTech(idx)}
                className="hover:text-destructive transition-colors p-0.5 rounded"
                title="حذف"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {techs.length < 15 && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="مثال: React, Laravel, Flutter, PostgreSQL..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addTech(inputVal);
            }}
            disabled={!inputVal.trim()}
            className="h-10 px-4 rounded-xl text-xs font-medium shrink-0"
          >
            إضافة
          </Button>
        </div>
      )}
    </div>
  );
}

export default TechnologiesEditor;

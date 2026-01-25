'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

interface SizeInputProps {
  label: string;
  minValue: number | undefined;
  maxValue: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  unit?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  className?: string;
}

export function SizeInput({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  unit = 'cm',
  minPlaceholder = '最小',
  maxPlaceholder = '最大',
  className,
}: SizeInputProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMinChange(value ? Number(value) : undefined);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMaxChange(value ? Number(value) : undefined);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="number"
            value={minValue ?? ''}
            onChange={handleMinChange}
            placeholder={minPlaceholder}
            min={0}
            className="pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {unit}
          </span>
        </div>
        <span className="text-slate-400">〜</span>
        <div className="relative flex-1">
          <Input
            type="number"
            value={maxValue ?? ''}
            onChange={handleMaxChange}
            placeholder={maxPlaceholder}
            min={0}
            className="pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

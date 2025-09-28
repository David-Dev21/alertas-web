'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  buttonClassName?: string;
  id?: string;
}

export function DatePicker({ label, placeholder = 'Seleccionar fecha', value, onSelect, disabled, className, buttonClassName, id }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onSelect?.(date);
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className={cn('w-[130px] h-8 justify-start text-left font-normal', !value && 'text-muted-foreground', buttonClassName)}
          >
            {value ? format(value, 'dd/MM/yyyy', { locale: es }) : placeholder}
            <ChevronDownIcon className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar mode="single" selected={value} captionLayout="dropdown" onSelect={handleSelect} disabled={disabled} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
}

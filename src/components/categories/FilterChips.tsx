import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterChip = {
  key: string;
  label: string;
  onClear: () => void;
};

type FilterChipsProps = {
  chips: FilterChip[];
  onClearAll?: () => void;
  labelText?: string;
  className?: string;
};

export function FilterChips({
  chips,
  onClearAll,
  labelText,
  className,
}: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-sm", className)}>
      {onClearAll && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-full px-3"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
      {labelText && <span className="text-muted-foreground">{labelText}</span>}
      {chips.map((chip) => (
        <Button
          key={chip.key}
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-full gap-1"
          onClick={chip.onClear}
        >
          {chip.label}
          <X className="size-4" />
        </Button>
      ))}
    </div>
  );
}

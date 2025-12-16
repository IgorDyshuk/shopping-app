import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SizeOption = {
  id: string;
  label: string;
};

type ProductSizePickerProps = {
  options: SizeOption[];
  selected?: string;
  onSelect: (id: string) => void;
};

export function ProductSizePicker({
  options,
  selected,
  onSelect,
}: ProductSizePickerProps) {
  return (
    <Card className="p-4">
      <CardContent className="px-0">
        <div className="flex flex-col gap-2">
          <span className="text-xs md:text-sm text-muted-foreground">
            Розмір
          </span>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
              <Button
                key={opt.id}
                type="button"
                variant={selected === opt.id ? "default" : "outline"}
                size="sm"
                className="min-w-16"
                onClick={() => onSelect(opt.id)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

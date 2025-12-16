import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Characteristic = {
  label: string;
  value: string;
};

type ProductCharacteristicsProps = {
  items: Characteristic[];
  className?: string;
};

export function ProductCharacteristics({
  items,
  className,
}: ProductCharacteristicsProps) {
  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="px-0">
        <div className="grid gap-4 md:grid-cols-[1fr_2fr] items-start">
          <div className="text-2xl font-semibold">Характеристики</div>
          <div className="flex flex-col">
            {items.map(({ label, value }) => (
              <div
                key={label}
                className="grid gap-3 md:grid-cols-[1fr_1fr] items-start text-sm leading-relaxed"
              >
                <div className="flex gap-3 py-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="flex-1 border-b border-dashed border-border/70" />
                </div>
                <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr] gap-2 py-2">
                  <span className="text-foreground text-right md:text-left">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

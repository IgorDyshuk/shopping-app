import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type ProfileSidebarProps = {
  items: SidebarItem[];
  activeId: string;
  onChange: (id: SidebarItem["id"]) => void;
  title: string;
};

export function ProfileSidebar({
  items,
  activeId,
  onChange,
  title,
}: ProfileSidebarProps) {
  return (
    <div className="h-fit gap-4">
      <div className="px-3 sm:px-6 py-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex flex-col gap-2 px-3 sm:px-6 pb-4">
        {items.map((item) => (
          <Button
            key={item.id}
            variant={activeId === item.id ? "default" : "ghost"}
            className="justify-start"
            onClick={() => onChange(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

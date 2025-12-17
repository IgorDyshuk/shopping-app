import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type SectionLink = {
  id: string;
  label: string;
  disabled?: boolean;
};

type ProductSectionsNavProps = {
  sections: SectionLink[];
  className?: string;
  offset?: number;
};

const DEFAULT_OFFSET = 110;

export function ProductSectionsNav({
  sections,
  offset = DEFAULT_OFFSET,
}: ProductSectionsNavProps) {
  const [activeId, setActiveId] = useState<string | undefined>();

  const firstSectionId = useMemo(() => sections[0]?.id, [sections]);
  const firstAvailable = useMemo(
    () => sections.find((s) => !s.disabled),
    [sections]
  );

  useEffect(() => {
    if (!activeId && firstAvailable?.id) {
      setActiveId(firstAvailable.id);
    }
  }, [activeId, firstAvailable]);

  const handleNavigate = (id: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveId(id);
    if (id === firstSectionId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!sections.length) return null;

  return (
    <div className={`sticky top-[60px] z-20 flex md:hidden xl:flex`}>
      <nav
        aria-label="Product sections"
        className="w-full overflow-x-auto rounded-lg border bg-background/80 backdrop-blur px-2"
      >
        <div className="flex flex-nowrap overflow-auto items-center gap-2">
          {sections.map(({ id, label, disabled }) => {
            const isActive = activeId === id;
            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                onClick={() => handleNavigate(id, disabled)}
                className={cn(
                  "select-none border-2 border-t-transparent border-l-transparent border-r-transparent px-3 py-2 text-sm transition hover:border-b-primary hover:text-primary hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-border transition-color duration-150 text-nowrap",
                  isActive
                    ? "border-b-primary  text-primary"
                    : "border-transparent text-foreground"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

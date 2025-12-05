import { useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon, X } from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
};

function SearchBar({ className }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const { data: products, isLoading } = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !products) return [];
    return products
      .filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [products, query]);

  const showSuggestions = (open || closing) && query.trim().length > 0;

  const startClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (open && target && !containerRef.current?.contains(target)) {
        startClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, closing]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full max-w-xl", className)}
    >
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setClosing(false);
            setFocused(true);
          }}
          onFocus={() => {
            setOpen(true);
            setClosing(false);
            setFocused(true);
          }}
          onBlur={() => {
            setTimeout(() => startClose(), 120);
            setTimeout(() => setFocused(false), 120);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              startClose();
              setTimeout(() => inputRef.current?.blur(), 0);
            }
          }}
          placeholder="Search products..."
          aria-expanded={showSuggestions}
        />
        {focused && (
          <InputGroupAddon align="inline-end" className="sm:hidden">
            <button
              type="button"
              aria-label="Close search"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              onMouseDown={(event) => {
                event.preventDefault();
                setQuery("");
                setOpen(false);
                setClosing(false);
                setFocused(false);
                inputRef.current?.blur();
              }}
            >
              <X className="size-4" />
            </button>
          </InputGroupAddon>
        )}
      </InputGroup>

      {showSuggestions && (
        <div
          className={`absolute left-0 right-0 top-full z-0 mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg ${
            closing
              ? "animate-out fade-out-0 zoom-out-95 duration-150"
              : "animate-in fade-in-0 zoom-in-95 duration-150"
          }`}
        >
          <div className="max-h-96 overflow-auto">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : !filtered.length ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      className="flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-accent/60 hover:cursor-pointer"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setQuery(product.title);
                        startClose();
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-tight">
                          {product.title}
                        </span>
                      </div>
                      <span className="ml-auto text-sm font-semibold">
                        ${product.price.toFixed(2)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { SearchBar };

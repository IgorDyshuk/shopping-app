import { useEffect, useRef, useState } from "react";
import { SearchIcon, X, ShoppingCart } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { NavigationMenuComplete } from "@/components/layout/Header/NavigationMenu";
import { SearchBar } from "@/components/layout/Header/SearchBar";
import LogIn from "./Header/LogInForm";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { User } from "lucide-react";

type HeaderProps = {
  showSidebar?: boolean;
};

function Header({ showSidebar = false }: HeaderProps) {
  const navigate = useNavigate();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { open, openMobile, isMobile } = useSidebar();
  const isSidebarOpen = isMobile ? openMobile : open;
  const [isTabletUp, setIsTabletUp] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => setIsTabletUp(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const headerLeft =
    showSidebar && isTabletUp ? (isSidebarOpen ? "255px" : "47px") : "0px";

  useEffect(() => {
    if (!showSearchBar) {
      setIsEntering(false);
      return;
    }
    setIsEntering(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsEntering(false));
    });
  }, [showSearchBar]);

  useEffect(() => {
    if (!showSearchBar) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (
        target &&
        !overlayRef.current?.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        startHide();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSearchBar]);

  const startHide = () => {
    setIsHiding(true);
    setTimeout(() => {
      setShowSearchBar(false);
      setIsHiding(false);
    }, 180);
  };

  return (
    <header
      className="fixed right-0 top-0 z-40 border-b bg-background transition-[left] duration-185 ease-linear"
      style={{ left: headerLeft }}
    >
      <div className="relative">
        <div className="mx-auto flex w-full max-w-[1464px] flex-col gap-3 p-3">
          <div className="relative z-20 flex items-center gap-3">
            <div className="flex items-center gap-2">
              {showSidebar && <SidebarTrigger />}
              <Link to="/" className="text-lg font-semibold text-nowrap">
                Test Shop
              </Link>
            </div>

            <div className="flex flex-1 items-center gap-4">
              {!showSidebar && (
                <div className="hidden flex-1 items-center gap-4 min-[867px]:flex">
                  <NavigationMenuComplete />
                </div>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <Button
                  ref={toggleRef}
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setShowSearchBar((prev) => {
                      if (prev) {
                        startHide();
                        return prev;
                      }
                      return true;
                    })
                  }
                  aria-expanded={showSearchBar}
                  aria-label="Search"
                >
                  {showSearchBar ? (
                    <X className="size-5" />
                  ) : (
                    <SearchIcon className="size-5" />
                  )}
                </Button>

                {!showSidebar && (
                  <LogIn
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Account"
                        className=" text-white hover:cursor-po"
                      >
                        <User className="size-6 text-foreground" />
                      </Button>
                    }
                  />
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Cart"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {showSearchBar && (
          <div
            ref={overlayRef}
            className={`absolute left-0 right-0 top-full z-40 px-3 pb-3 transition-all duration-200 ${
              isHiding || isEntering
                ? "opacity-0 -translate-y-1"
                : "opacity-100 translate-y-0"
            }`}
          >
            <SearchBar
              className="w-full max-w-2xl mx-auto"
              autoFocus
              onRequestClose={startHide}
            />
          </div>
        )}
      </div>
    </header>
  );
}

export { Header };

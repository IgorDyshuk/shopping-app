import { NavigationMenuComplete } from "@/components/layout/Header/NavigationMenu";
import { LanguageSwitcher } from "@/components/layout/Header/LanguageSwitcher";
import { SearchBar } from "@/components/layout/Header/SearchBar";
import LogIn from "./Header/LogInForm";
import SignUp from "./Header/SIgnUpForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

type HeaderProps = {
  showSidebar?: boolean;
};

function Header({ showSidebar = false }: HeaderProps) {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3 px-2 md:px-4 py-3">
        <div className="relative z-20 flex items-center gap-3">
          <div className="flex items-center gap-2">
            {showSidebar && <SidebarTrigger />}
            <div className="text-lg font-semibold text-nowrap">Test Shop</div>
          </div>

          {!showSidebar && (
            <>
              <div className="hidden flex-1 items-center gap-4 min-[867px]:flex">
                <NavigationMenuComplete />
              </div>
              <div className="hidden min-[1044px]:flex items-center gap-3">
                <div className="hidden min-[1516px]:flex items-center gap-3">
                  <SearchBar className="w-[460px]" />
                </div>
                <LogIn />
                <SignUp />
              </div>
            </>
          )}

          <div className="ml-auto shrink-0">
            <LanguageSwitcher />
          </div>
        </div>

        {!showSidebar && (
          <div className="min-[1516px]:hidden w-full flex justify-center">
            <SearchBar className="w-full max-w-2xl" />
          </div>
        )}

        {showSidebar && (
          <div className="flex w-full justify-center">
            <SearchBar className="w-full max-w-2xl" />
          </div>
        )}
      </div>
    </header>
  );
}

export { Header };

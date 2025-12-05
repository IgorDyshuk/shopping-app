import { NavigationMenuComplete } from "@/components/layout/Header/NavigationMenu";
import { LanguageSwitcher } from "@/components/layout/Header/LanguageSwitcher";
import { SearchBar } from "@/components/layout/Header/SearchBar";

function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1800px] items-center gap-4 px-4 py-3">
        <div className="text-lg font-semibold">Test Shop</div>
        <NavigationMenuComplete />
        <div className="flex gap-3 ml-auto">
          <SearchBar />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export { Header };

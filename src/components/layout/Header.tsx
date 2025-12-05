import { NavigationMenuComplete } from "@/components/layout/Header/NavigationMenu";
import { LanguageSwitcher } from "@/components/layout/Header/LanguageSwitcher";
import { SearchBar } from "@/components/layout/Header/SearchBar";
import LogIn from "./Header/LogInForm";
import SignUp from "./Header/SIgnUpForm";

function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex flex-col w-full max-w-[1800px] items-center gap-4 px-4 py-3 lg:flex-row">
        <div className="text-lg font-semibold">Test Shop</div>
        <NavigationMenuComplete />
        <div className="ml-auto flex flex-col items-center gap-3 lg:flex-row">
          <SearchBar />
          <LanguageSwitcher />
          <LogIn />
          <SignUp />
        </div>
      </div>
    </header>
  );
}

export { Header };

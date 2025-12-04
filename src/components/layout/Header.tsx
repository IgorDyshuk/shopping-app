import { LanguageSwitcher } from "@/components/layout/Header/LanguageSwitcher";

function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="text-lg font-semibold">Test Shop</div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

export { Header };

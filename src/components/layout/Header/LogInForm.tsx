import { useEffect, useState } from "react";

import { GalleryVerticalEnd } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

type LogInProps = {
  className?: string;
};

export default function LogIn({ className }: LogInProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    document.addEventListener("open-login", handleOpen as EventListener);
    return () =>
      document.removeEventListener("open-login", handleOpen as EventListener);
  }, []);

  const switchToSignup = () => {
    setOpen(false);
    document.dispatchEvent(new CustomEvent("open-signup"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full border border-input bg-white px-4 text-foreground shadow-none hover:bg-accent hover:text-foreground",
            className
          )}
          onClick={() => setOpen(true)}
        >
          {t("auth.login")}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-lg">
        <div className="bg-muted flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6 md:p-10 rounded-md">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <a
              href="#"
              className="flex items-center gap-2 self-center font-medium"
            >
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              website name.
            </a>
            <LoginForm onSwitchToSignup={switchToSignup} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

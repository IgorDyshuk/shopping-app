import { useEffect, useState, type ReactNode } from "react";

import { GalleryVerticalEnd } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/use-auth";

type LogInProps = {
  className?: string;
  trigger?: ReactNode;
};

export default function LogIn({ className, trigger }: LogInProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => {
      if (isAuthenticated) return;
      setOpen(true);
    };
    document.addEventListener("open-login", handleOpen as EventListener);
    return () =>
      document.removeEventListener("open-login", handleOpen as EventListener);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) setOpen(false);
  }, [isAuthenticated]);

  const handleOpenChange = (next: boolean) => {
    if (isAuthenticated && next) return;
    setOpen(next);
  };

  return (
    <Dialog open={!isAuthenticated && open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full border border-input bg-white px-4 text-foreground shadow-none hover:bg-accent hover:text-foreground",
              className
            )}
            onClick={() => handleOpenChange(true)}
            disabled={isAuthenticated}
          >
            {t("auth.login")}
          </Button>
        )}
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
            <LoginForm
              onClose={() => setOpen(false)}
              onSuccess={() => {
                setOpen(false);
                navigate("/profile");
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

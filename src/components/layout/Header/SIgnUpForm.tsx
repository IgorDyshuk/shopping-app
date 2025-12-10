import { GalleryVerticalEnd } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignupForm } from "@/components/signup-form";
import { cn } from "@/lib/utils";

type SignUpProps = {
  className?: string;
};

export default function SignUp({ className }: SignUpProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          type="submit"
          className={cn("rounded-full px-4", className)}
        >
          Sign up
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
            <SignupForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

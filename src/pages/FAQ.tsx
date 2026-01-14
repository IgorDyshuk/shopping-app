import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function FAQPage() {
  const { t } = useTranslation("faq");
  const { hash, search } = useLocation();
  const formRef = useRef<HTMLDivElement | null>(null);
  const items = t("items", { returnObjects: true }) as {
    q: string;
    a: string;
  }[];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(
        t("form.error", { defaultValue: "Please fill out all fields." })
      );
      return;
    }
    toast.success(
      t("form.success", { defaultValue: "Your message has been sent." })
    );
    setName("");
    setEmail("");
    setMessage("");
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    const scrollToForm =
      hash === "#contact" || params.get("section") === "contact";
    if (scrollToForm && formRef.current) {
      const y =
        formRef.current.getBoundingClientRect().top +
        window.scrollY -
        80; /* offset from top */
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [hash, search]);

  return (
    <section className="w-full my-18 sm:my-20 md:my-24">
      <div className="mx-auto w-full max-w-[960px] space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("intro")}</p>
        </div>

        <div className="space-y-4">
          {items?.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-card/60 p-4 space-y-2"
            >
              <h2 className="text-lg font-semibold">{item.q}</h2>
              <p className="text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div
          ref={formRef}
          id="contact"
          className="border rounded-lg p-4 bg-card/60 space-y-4"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{t("form.title")}</h3>
            <p className="text-muted-foreground">{t("form.subtitle")}</p>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label
                className="text-sm text-muted-foreground"
                htmlFor="faq-name"
              >
                {t("form.name")}
              </label>
              <Input
                id="faq-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t("form.placeholderName")}
                className="bg-muted/60"
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-sm text-muted-foreground"
                htmlFor="faq-email"
              >
                {t("form.email")}
              </label>
              <Input
                id="faq-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("form.placeholderEmail")}
                className="bg-muted/60"
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-sm text-muted-foreground"
                htmlFor="faq-message"
              >
                {t("form.message")}
              </label>
              <Textarea
                id="faq-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder={t("form.placeholderMessage")}
                className="bg-muted/60"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground"></div>
              <Button type="submit" variant="outline">
                {t("form.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default FAQPage;

const footerLinks = {
  marketplace: [
    { label: "Drops", href: "#drops" },
    { label: "Catalog", href: "#catalog" },
    { label: "Creators", href: "#creators" },
  ],
  support: [
    { label: "FAQ", href: "#faq" },
    { label: "Help center", href: "#support" },
    { label: "Returns", href: "#returns" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Terms", href: "#terms" },
    { label: "Privacy", href: "#privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-3">
            <div className="text-xl font-semibold">Test Shop</div>
            <p className="text-sm text-muted-foreground">
              Resale marketplace for influencer drops and curated finds. Buy,
              sell, and discover limited pieces from your favorite creators.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3 justify-end">
            <FooterColumn title="Marketplace" links={footerLinks.marketplace} />
            <FooterColumn title="Support" links={footerLinks.support} />
            <FooterColumn title="Company" links={footerLinks.company} />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Test Shop. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: { label: string; href: string }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-foreground/80 hover:text-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

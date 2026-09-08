import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/lib/content/types";
import { AdSlot } from "./AdSlot";

export function Footer({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-line py-8 text-xs text-faint">
      <Container className="flex flex-col gap-6">
        <AdSlot placement="footer" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          {settings.instagramUrl ? (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {settings.instagramHandle ?? "Instagram"}
            </a>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}

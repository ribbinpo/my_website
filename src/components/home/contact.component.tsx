import { useState } from "react";
import { Copy } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { toast } from "sonner";
import { Reveal } from "@/components/home/reveal.component";
import { DisplayHeading } from "@/components/home/section-heading.component";
import { contact, copy, type Locale } from "@/data/profile";
import { studioButton } from "@/lib/studio-button";

export function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [copyFailed, setCopyFailed] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopyFailed(false);
      toast.success(t.copied);
    } catch {
      setCopyFailed(true);
      toast.error(t.copyFailed);
    }
  }

  const social = [
    { href: contact.github, label: "GitHub", Icon: FaGithub },
    { href: contact.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="flex min-h-screen-section flex-col justify-center border-b border-primary bg-surface-container"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-gutter-xl px-gutter-md py-section md:px-page-margin lg:grid-cols-12">
        <Reveal className="flex flex-col gap-gutter-md lg:col-span-7">
          <p className="section-label font-label text-label-md text-primary uppercase">
            {t.contactLabel}
          </p>
          <DisplayHeading id="contact-title">{t.contactTitle}</DisplayHeading>
        </Reveal>
        <Reveal index={2} className="flex flex-col items-start gap-gutter-md lg:col-span-5">
          <p className="text-body-lg text-on-surface">{t.contactText}</p>
          <div className="contact-email flex flex-wrap items-center gap-gutter-sm">
            <a
              href={`mailto:${contact.email}`}
              className={studioButton({ variant: "primary", size: "lg" })}
            >
              {t.letsTalk} <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className={studioButton({ variant: "surface", size: "lg" })}
            >
              <span className="sr-only">{t.copyEmail}: </span>
              <span className="normal-case">{contact.email}</span>
              <Copy aria-hidden="true" />
            </button>
          </div>
          {copyFailed && (
            <p role="status" className="copy-fallback text-body-sm text-on-surface">
              {t.copyFailed}{" "}
              <a
                href={`mailto:${contact.email}`}
                className="font-label font-semibold text-primary underline underline-offset-4 select-all"
              >
                {contact.email}
              </a>
            </p>
          )}
          <ul className="flex flex-wrap items-center gap-gutter-sm pt-gutter-xs">
            {social.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={studioButton({ variant: "surface", size: "sm" })}
                >
                  <Icon aria-hidden="true" />
                  {label} <span aria-hidden="true">↗</span>
                  <span className="sr-only">{t.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

import { siteConfig } from "@/config/site";

type SocialName = keyof typeof siteConfig.socials;
type SocialVariant = "footer" | "header" | "menu";

const socials: Array<{ name: SocialName; label: string }> = [
  { name: "instagram", label: "Instagram" },
  { name: "tiktok", label: "TikTok" },
  { name: "facebook", label: "Facebook" },
];

function SocialIcon({ name }: { name: SocialName }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4.4" />
        <circle cx="12" cy="12" r="3.45" />
        <circle cx="17.35" cy="6.85" r=".75" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.2 5.2v9.15a4.15 4.15 0 1 1-3.05-4" />
        <path d="M14.2 5.2c.75 2.4 2.15 3.85 4.6 4.25" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.7 20v-7h2.55l.4-3h-2.95V8.1c0-.9.28-1.52 1.55-1.52h1.58V3.9c-.28-.04-1.25-.12-2.36-.12-2.35 0-3.96 1.43-3.96 4.08V10H8v3h2.5v7" />
    </svg>
  );
}

export function SocialLinks({ variant = "footer" }: { variant?: SocialVariant }) {
  return (
    <nav className={`social-links social-links--${variant}`} aria-label="Social media">
      {socials.map(({ name, label }) => (
        <a
          key={name}
          href={siteConfig.socials[name]}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          title={label}
          className="social-link"
        >
          <SocialIcon name={name} />
        </a>
      ))}
    </nav>
  );
}

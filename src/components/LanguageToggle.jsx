import { LOCALES, useLocale, useT } from "../i18n";

export default function LanguageToggle({ className = "", compact = false }) {
  const { locale, setLocale } = useLocale();
  const { t } = useT();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/20 bg-ink/30 p-0.5 ${className}`}
      role="group"
      aria-label={t("language")}
    >
      {LOCALES.map((item) => {
        const active = locale === item.code;
        return (
          <button
            key={item.code}
            type="button"
            className={`rounded-full px-2 py-1 text-[0.62rem] font-bold tracking-[0.08em] transition-colors ${
              active ? "bg-gold text-ink" : "text-cream/70 hover:text-gold"
            }`}
            aria-pressed={active}
            aria-label={item.native}
            onClick={() => setLocale(item.code)}
          >
            {compact ? item.label : item.label}
          </button>
        );
      })}
    </div>
  );
}

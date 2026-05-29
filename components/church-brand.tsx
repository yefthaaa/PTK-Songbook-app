import Image from "next/image";
import { APP_NAME, APP_SUBTITLE, CHURCH_LOGO_ALT, CHURCH_LOGO_SRC } from "@/lib/branding";

type ChurchBrandProps = {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
};

const sizeMap = {
  sm: { logo: 40, title: "text-base", sub: "text-[10px]" },
  md: { logo: 56, title: "text-xl sm:text-2xl", sub: "text-xs" },
  lg: { logo: 72, title: "text-2xl sm:text-3xl", sub: "text-sm" },
};

export function ChurchBrand({
  size = "md",
  showSubtitle = true,
  title = APP_NAME,
  subtitle = APP_SUBTITLE,
  className = "",
}: ChurchBrandProps) {
  const s = sizeMap[size];

  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      <Image
        src={CHURCH_LOGO_SRC}
        alt={CHURCH_LOGO_ALT}
        width={s.logo}
        height={s.logo}
        className="shrink-0 rounded-full shadow-[0_8px_20px_-12px_rgba(18,50,95,0.45)]"
        priority={size !== "sm"}
      />
      <div className="min-w-0">
        <p className={`font-bold tracking-tight text-aion-navy ${s.title}`}>{title}</p>
        {showSubtitle ? (
          <p className={`mt-0.5 font-medium text-aion-navy/70 ${s.sub}`}>{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

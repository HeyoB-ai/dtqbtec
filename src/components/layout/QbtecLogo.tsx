import { cn } from "@/lib/utils";

/** Stylized QBtec logo placeholder — industrial "Q" mark with orange accent. */
export function QbtecLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-auto", className)}
      role="img"
      aria-label="QBtec logo (placeholder)"
    >
      <defs>
        <linearGradient id="qbGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8650A" />
          <stop offset="100%" stopColor="#b54607" />
        </linearGradient>
      </defs>
      {/* rounded square base */}
      <rect x="3" y="3" width="42" height="42" rx="10" fill="#161b22" stroke="#21262d" strokeWidth="1.5" />
      {/* Q ring */}
      <circle cx="24" cy="23" r="11" fill="none" stroke="url(#qbGrad)" strokeWidth="4.5" />
      {/* Q tail */}
      <rect x="28" y="28" width="9" height="4.5" rx="2.25" transform="rotate(45 30 30)" fill="url(#qbGrad)" />
      {/* gear teeth hint */}
      <g fill="#E8650A">
        <rect x="22.5" y="6" width="3" height="3" rx="0.6" />
        <rect x="22.5" y="37.5" width="3" height="3" rx="0.6" />
      </g>
    </svg>
  );
}

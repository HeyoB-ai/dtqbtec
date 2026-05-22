"use client";

/** Boot splash with a factory silhouette + loading bar. */
export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink grid-glow">
      <svg viewBox="0 0 320 120" className="w-[320px] max-w-[70vw]">
        {/* ground line */}
        <line x1="0" y1="100" x2="320" y2="100" stroke="#E8650A" strokeWidth="1.5" opacity="0.5" />
        {/* factory silhouette (saw-tooth roof) */}
        <g fill="#21262d">
          <rect x="20" y="60" width="120" height="40" />
          <polygon points="20,60 45,44 45,60" />
          <polygon points="50,60 75,44 75,60" />
          <polygon points="80,60 105,44 105,60" />
          <polygon points="110,60 135,44 135,60" />
          {/* chimney */}
          <rect x="150" y="34" width="14" height="66" />
          {/* main hall */}
          <rect x="180" y="52" width="120" height="48" />
          <rect x="196" y="64" width="14" height="14" fill="#0d1117" />
          <rect x="220" y="64" width="14" height="14" fill="#0d1117" />
          <rect x="244" y="64" width="14" height="14" fill="#0d1117" />
          <rect x="268" y="64" width="14" height="14" fill="#0d1117" />
        </g>
        {/* heat shimmer from chimney */}
        <path
          d="M157 34 q-6 -10 0 -18 t0 -16"
          fill="none"
          stroke="#E8650A"
          strokeWidth="2"
          opacity="0.6"
          strokeDasharray="5 5"
          className="animate-flow"
        />
      </svg>
      <div className="mt-8 text-center">
        <div className="text-lg font-semibold tracking-tight text-foreground">
          QB<span className="text-primary">tec</span> Operations Intelligence
        </div>
        <div className="mt-1 text-xs text-muted-foreground">Fabrieksdata initialiseren — Woerden…</div>
      </div>
      <div className="mt-5 h-1 w-56 max-w-[60vw] overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 animate-ticker bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  );
}

export function Legend({
  title,
  items,
}: {
  title?: string;
  items: { color: string; label: string }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card/85 px-3 py-2 backdrop-blur">
      {title && <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>}
      <div className="space-y-1">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: it.color }} />
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}

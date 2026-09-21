export function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block border border-line-strong bg-void px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
      {children}
    </span>
  );
}

export function TagList({
  tags,
  className = "",
}: {
  tags: readonly string[];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Tags">
      {tags.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}

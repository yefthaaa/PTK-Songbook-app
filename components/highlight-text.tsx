type HighlightTextProps = {
  text: string;
  query?: string;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function HighlightText({ text, query }: HighlightTextProps) {
  const safeQuery = query?.trim();

  if (!safeQuery) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${escapeRegex(safeQuery)})`, "ig");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === safeQuery.toLowerCase();
        return isMatch ? (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-emerald-100 px-0.5 text-slate-900 dark:bg-emerald-900/70 dark:text-emerald-100"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </>
  );
}


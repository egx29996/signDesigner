import { useState, type ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-border px-1 py-2"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {title}
        </span>
        <span className="text-[11px] text-text-muted">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="py-2">{children}</div>}
    </div>
  );
}

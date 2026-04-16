import { ReactNode } from "react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PageShellProps) {
  return (
    <main className="app-shell">
      <div className="content-grid">
        <section className="panel section-stack px-6 py-8 sm:px-8">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="eyebrow">{eyebrow}</p>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-copy)] sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--color-copy-muted)] sm:text-lg">
                  {description}
                </p>
              </div>
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </header>
        </section>

        {children}
      </div>
    </main>
  );
}

type StatusTone = "info" | "success" | "warning" | "danger";

type StatusCardProps = {
  title: string;
  description: string;
  tone?: StatusTone;
};

const toneClassName: Record<StatusTone, string> = {
  info: "status-info",
  success: "status-success",
  warning: "status-warning",
  danger: "status-danger",
};

export function StatusCard({
  title,
  description,
  tone = "info",
}: StatusCardProps) {
  return (
    <article className="panel flex flex-col gap-4 p-5">
      <span
        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneClassName[tone]}`}
      >
        {title}
      </span>
      <p className="text-sm leading-6 text-[var(--color-copy-muted)]">
        {description}
      </p>
    </article>
  );
}

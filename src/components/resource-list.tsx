import { resourceMeta } from "@/lib/enums";
import { formatBytes } from "@/lib/format";
import { cx } from "./ui";

export type ResourceItem = {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  fileName: string;
  sizeBytes: number;
  externalUrl: string | null;
};

/**
 * The download pack. Locked state still lists what is inside — seeing the
 * material you would get is a large part of why people enrol.
 */
export function ResourceList({
  resources,
  locked = false,
  compact = false,
}: {
  resources: ResourceItem[];
  locked?: boolean;
  compact?: boolean;
}) {
  if (!resources.length) {
    return (
      <p className="text-sm text-ink-400">No downloads attached to this lesson.</p>
    );
  }

  return (
    <ul className={cx("space-y-2", compact && "space-y-1.5")}>
      {resources.map((resource) => {
        const meta = resourceMeta(resource.kind);
        const extension = resource.fileName.split(".").pop()?.toUpperCase();

        const inner = (
          <>
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sand-100 text-base ring-1 ring-inset ring-sand-200"
            >
              {meta.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="truncate font-medium text-ink-900">{resource.title}</span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                  {meta.label}
                </span>
              </span>
              {!compact && resource.description ? (
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                  {resource.description}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 text-right text-[11px] text-ink-400">
              {locked ? (
                <span aria-label="Enrol to download">🔒</span>
              ) : (
                <>
                  <span className="block font-medium text-ink-500">{extension}</span>
                  <span>{formatBytes(resource.sizeBytes)}</span>
                </>
              )}
            </span>
          </>
        );

        const shared =
          "flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-inset transition-colors";

        return (
          <li key={resource.id}>
            {locked ? (
              <div className={cx(shared, "bg-sand-50/60 text-ink-400 ring-sand-200")}>
                {inner}
              </div>
            ) : (
              <a
                href={resource.externalUrl ?? `/api/resources/${resource.id}`}
                download={resource.externalUrl ? undefined : resource.fileName}
                target={resource.externalUrl ? "_blank" : undefined}
                rel={resource.externalUrl ? "noopener noreferrer" : undefined}
                className={cx(
                  shared,
                  "bg-white ring-sand-200 hover:bg-ink-50 hover:ring-ink-200",
                )}
              >
                {inner}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

import type { LucideIcon } from "lucide-react";

interface AdminPagePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Temporary empty state. Replace the page that uses it once the real page is built. */
export function AdminPagePlaceholder({
  icon: Icon,
  title,
  description,
}: AdminPagePlaceholderProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.09] px-6 py-16 text-center">
      <span className="flex size-10 items-center justify-center rounded-md border border-white/[0.09] bg-white/[0.02] text-[#D9A53A]">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-sm font-semibold text-zinc-100">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
    </div>
  );
}

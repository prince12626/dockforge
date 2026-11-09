import { cn } from "./cn";

interface AdminAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
}

function initialsOf(name?: string | null): string {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function AdminAvatar({ name, image, className }: AdminAvatarProps) {
  const base =
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-[#D9A53A]";

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        referrerPolicy="no-referrer"
        className={cn(base, "object-cover", className)}
      />
    );
  }

  return (
    <span aria-hidden="true" className={cn(base, className)}>
      {initialsOf(name)}
    </span>
  );
}

"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

export type ConfirmDialogType = "warning" | "success" | "error";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: ReactNode;
  /** Controls the accent colour and default icon. Defaults to "warning". */
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  /** Shows a spinner on the confirm button and blocks closing. */
  loading?: boolean;
  /** Text shown on the confirm button while loading. Defaults to confirmText. */
  loadingText?: string;
  /** Defaults to false for "success", true for the others. */
  showCancel?: boolean;
  /** Replaces the default icon for the type. */
  icon?: ReactNode;
}

const defaultIcons: Record<ConfirmDialogType, ReactNode> = {
  warning: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M12 3.5l9.5 16.5h-19L12 3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17.4h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.7 2.7L16 9.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/**
 * Reusable confirmation dialog. Render it inside the page's root element
 * (it is position: fixed) so it inherits the page fonts.
 *
 * <ConfirmDialog
 *   open={open}
 *   type="error"
 *   title="Delete this VPS?"
 *   description="This action cannot be undone."
 *   confirmText="Delete"
 *   loading={deleting}
 *   onClose={() => setOpen(false)}
 *   onConfirm={handleDelete}
 * />
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  type = "warning",
  confirmText,
  cancelText = "Cancel",
  loading = false,
  loadingText,
  showCancel,
  icon,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const withCancel = showCancel ?? type !== "success";
  const confirmLabel = confirmText ?? (type === "success" ? "Done" : "Confirm");

  // Lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Initial focus: cancel if present (safer for destructive actions)
  useEffect(() => {
    if (!open) return;
    (cancelRef.current ?? confirmRef.current)?.focus();
  }, [open]);

  // Escape to close, Tab stays inside the dialog
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled)"),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="cd-overlay fixed inset-0 z-[60] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={`cd-panel cd-${type} relative w-full max-w-md rounded-2xl p-6 md:p-7`}
      >
        <div className="cd-icon flex h-12 w-12 items-center justify-center rounded-xl">
          {icon ?? defaultIcons[type]}
        </div>

        <h2 id={titleId} className="cd-title mt-5 text-xl font-semibold md:text-2xl">
          {title}
        </h2>

        {description && (
          <div id={descId} className="cd-desc mt-2 text-sm leading-6">
            {description}
          </div>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {withCancel && (
            <button
              ref={cancelRef}
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cd-btn cd-btn-ghost h-11 rounded-xl px-6 text-sm font-medium"
            >
              {cancelText}
            </button>
          )}

          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="cd-btn cd-btn-confirm inline-flex h-11 items-center justify-center gap-2.5 rounded-xl px-6 text-sm font-semibold"
          >
            {loading && (
              <svg viewBox="0 0 24 24" className="cd-spin h-4 w-4" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity=".25" />
                <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {loading ? (loadingText ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        .cd-overlay {
          --cd-black: var(--color-black, #08090B);
          --cd-white: var(--color-white, #F5F3EF);
          background: color-mix(in srgb, var(--cd-black) 72%, transparent);
          -webkit-backdrop-filter: blur(6px);
                  backdrop-filter: blur(6px);
          animation: cd-fade .2s ease both;
        }
        .cd-warning { --cd-accent: var(--color-yellow, #FFC900); }
        .cd-error   { --cd-accent: #FF6B6B; }
        .cd-success { --cd-accent: #6EE7A8; }

        .cd-panel {
          color: var(--cd-white);
          background:
            radial-gradient(ellipse 80% 70% at 0% 0%, color-mix(in srgb, var(--cd-accent) 10%, transparent), transparent 65%),
            color-mix(in srgb, var(--cd-white) 4%, var(--cd-black));
          border: 1px solid color-mix(in srgb, var(--cd-white) 13%, transparent);
          box-shadow:
            0 40px 90px -30px #000,
            0 30px 80px -50px color-mix(in srgb, var(--cd-accent) 50%, transparent);
          animation: cd-pop .25s cubic-bezier(.22, 1, .36, 1) both;
        }
        .cd-panel::before {
          content: "";
          position: absolute;
          top: -1px;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--cd-accent), transparent);
          opacity: .8;
        }
        .cd-icon {
          color: var(--cd-accent);
          background: color-mix(in srgb, var(--cd-accent) 11%, transparent);
          border: 1px solid color-mix(in srgb, var(--cd-accent) 32%, transparent);
          box-shadow: 0 0 36px -8px color-mix(in srgb, var(--cd-accent) 55%, transparent);
        }
        .cd-title {
          font-family: var(--font-db-display), inherit;
          letter-spacing: -0.03em;
          color: var(--cd-white);
        }
        .cd-desc { color: color-mix(in srgb, var(--cd-white) 62%, transparent); }
        .cd-desc strong { color: var(--cd-white); font-weight: 600; }

        .cd-btn { transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease, opacity .2s ease; }
        .cd-btn:disabled { opacity: .55; cursor: not-allowed; }
        .cd-btn:focus-visible { outline: 2px solid var(--cd-white); outline-offset: 2px; }

        .cd-btn-ghost {
          color: color-mix(in srgb, var(--cd-white) 85%, transparent);
          background: color-mix(in srgb, var(--cd-white) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--cd-white) 14%, transparent);
        }
        .cd-btn-ghost:hover:not(:disabled) {
          background: color-mix(in srgb, var(--cd-white) 9%, transparent);
          border-color: color-mix(in srgb, var(--cd-white) 30%, transparent);
        }

        .cd-btn-confirm {
          color: var(--cd-black);
          background: var(--cd-accent);
          box-shadow:
            0 8px 28px -10px color-mix(in srgb, var(--cd-accent) 70%, transparent),
            inset 0 1px 0 color-mix(in srgb, var(--cd-white) 40%, transparent);
        }
        .cd-btn-confirm:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 12px 36px -8px color-mix(in srgb, var(--cd-accent) 85%, transparent),
            inset 0 1px 0 color-mix(in srgb, var(--cd-white) 40%, transparent);
        }

        .cd-spin { animation: cd-rotate .8s linear infinite; }
        @keyframes cd-rotate { to { transform: rotate(360deg); } }
        @keyframes cd-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cd-pop { from { opacity: 0; transform: translateY(10px) scale(.97); } to { opacity: 1; transform: none; } }

        @media (prefers-reduced-motion: reduce) {
          .cd-overlay, .cd-panel, .cd-spin { animation: none; }
          .cd-btn { transition: none; }
          .cd-btn-confirm:hover:not(:disabled) { transform: none; }
        }
      `}</style>
    </div>
  );
}
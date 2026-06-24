export default function PageLoader({
  label = "Loading",
  minHeight = "min-h-[40vh]",
  size = "lg",
}) {
  const sizeClasses =
    size === "sm"
      ? "h-8 w-8 border-2"
      : "h-12 w-12 border-4";

  return (
    <div
      className={`flex ${minHeight} flex-col items-center justify-center gap-4 px-4`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`${sizeClasses} animate-spin rounded-full border-primary border-t-transparent candy-shadow-primary`}
        aria-hidden
      />
      <p className="text-sm font-bold text-on-surface-variant">{label}…</p>
    </div>
  );
}

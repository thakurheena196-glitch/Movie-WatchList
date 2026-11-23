const STATUS_CONFIG = {
  to_watch: {
    label: "To Watch",
    icon: "◷",
    classes: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },

  watching: {
    label: "Watching",
    icon: "▶",
    classes: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  },

  done: {
    label: "Completed",
    icon: "✓",
    classes: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.to_watch;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${config.classes}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

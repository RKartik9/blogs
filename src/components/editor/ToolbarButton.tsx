import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
};

export function ToolbarButton({ icon: Icon, label, onClick, active = false, disabled = false }: Props) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-lg transition-colors disabled:opacity-30 ${
        active
          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
      }`}
    >
      <Icon className="size-4" strokeWidth={2.25} />
    </button>
  );
}

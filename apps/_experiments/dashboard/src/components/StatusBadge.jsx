import { getStatusLabel, getStatusColor } from '../data/labels';

export default function StatusBadge({ status }) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${color.bg} ${color.text} ${color.border}`}
    >
      {label}
    </span>
  );
}

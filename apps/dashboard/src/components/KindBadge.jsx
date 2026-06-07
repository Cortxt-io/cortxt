import { getKindLabel, getKindColor } from '../data/labels';

export default function KindBadge({ kind }) {
  if (!kind) return null;
  const color = getKindColor(kind);
  const label = getKindLabel(kind);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${color.bg} ${color.text} ${color.border}`}
    >
      {label}
    </span>
  );
}

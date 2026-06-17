import { getFamilyLabel, getFamilyColor } from '../data/labels';

export default function FamilyBadge({ family }) {
  const label = getFamilyLabel(family);
  const color = getFamilyColor(family);

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border bg-surface border-border"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {label}
    </span>
  );
}

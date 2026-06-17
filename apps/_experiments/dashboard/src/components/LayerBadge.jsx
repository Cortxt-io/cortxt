import { getLayerLabel, getLayerColor } from '../data/labels';

export default function LayerBadge({ layer }) {
  if (!layer) return null;
  const label = getLayerLabel(layer);
  const color = getLayerColor(layer);

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border bg-surface border-border"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {label}
    </span>
  );
}

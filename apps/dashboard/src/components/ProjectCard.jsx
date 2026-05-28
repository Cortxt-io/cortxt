import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import FamilyBadge from './FamilyBadge';
import LayerBadge from './LayerBadge';
import { getStageLabel } from '../data/labels';

function roiColor(value) {
  if (value >= 250) return 'var(--success)';
  if (value > 0) return '#f59e0b';
  return 'var(--muted)';
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/project/' + project.slug)}
      className="cursor-pointer rounded-lg border border-border bg-surface p-5 transition-all hover:border-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]"
    >
      {/* Title */}
      <h3 className="text-lg font-bold text-text mb-2">{project.title}</h3>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <StatusBadge status={project.status} />
        <LayerBadge layer={project.layer} />
        <FamilyBadge family={project.family} />
      </div>

      {/* Stage */}
      <p
        className="text-xs mb-2"
        style={{ fontFamily: '"JetBrains Mono", monospace', color: 'var(--muted)' }}
      >
        {getStageLabel(project.mvp_stage)}
      </p>

      {/* ROI */}
      <p className="text-sm font-semibold mb-2" style={{ color: roiColor(project.roi_percent) }}>
        ROI {project.roi_percent ?? 0}%
      </p>

      {/* Summary */}
      {project.summary && (
        <p className="text-sm text-muted line-clamp-2">{project.summary}</p>
      )}
    </div>
  );
}

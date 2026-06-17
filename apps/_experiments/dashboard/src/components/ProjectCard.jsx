import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import FamilyBadge from './FamilyBadge';
import LayerBadge from './LayerBadge';
import KindBadge from './KindBadge';
import { getStageLabel, getNodeStageLabel, getNodeStageColor } from '../data/labels';

function roiColor(value) {
  if (value >= 250) return 'var(--success)';
  if (value > 0) return '#f59e0b';
  return 'var(--muted)';
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const hasKind = !!project.kind;
  const hasCost = project.cost_sek > 0 || project.value_sek > 0;

  // Fallback: stage → status, kind → family
  const displayStage = hasKind
    ? getNodeStageLabel(project.stage)
    : getStageLabel(project.mvp_stage);
  const stageColor = hasKind
    ? getNodeStageColor(project.stage)
    : undefined;

  return (
    <div
      onClick={() => navigate('/project/' + project.slug)}
      className="cursor-pointer rounded border border-border bg-surface p-4 transition-colors hover:border-accent"
    >
      {/* Title */}
      <h3 className="text-lg font-bold text-text mb-2">{project.title}</h3>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {hasKind ? (
          <KindBadge kind={project.kind} />
        ) : (
          <>
            <StatusBadge status={project.status} />
            <LayerBadge layer={project.layer} />
            <FamilyBadge family={project.family} />
          </>
        )}
      </div>

      {/* Stage */}
      <p
        className="text-xs mb-2"
        style={{ fontFamily: '"JetBrains Mono", monospace', color: stageColor || 'var(--muted)' }}
      >
        {displayStage}
      </p>

      {/* Part-of breadcrumb */}
      {project.part_of && (
        <p className="text-xs mb-2" style={{ fontFamily: '"JetBrains Mono", monospace', color: 'var(--muted)' }}>
          in {project.part_of}
        </p>
      )}

      {/* ROI — only show for nodes that actually have cost/value */}
      {hasCost && (
        <p className="text-sm font-semibold mb-2" style={{ color: roiColor(project.roi_percent) }}>
          ROI {project.roi_percent ?? 0}%
        </p>
      )}

      {/* Summary */}
      {project.summary && (
        <p className="text-sm text-muted line-clamp-2">{project.summary}</p>
      )}
    </div>
  );
}
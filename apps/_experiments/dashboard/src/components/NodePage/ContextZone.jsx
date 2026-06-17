import { marked } from 'marked';
import { useNavigate } from 'react-router-dom';
import NodeRelationsList from '../NodeRelationsList';
import KindBadge from '../KindBadge';
import { getNodeStageColor, getNodeStageLabel, getKindLabel } from '../../data/labels';

marked.use({ breaks: true, gfm: true });

function renderMarkdown(content) {
  if (!content) return null;
  return (
    <div
      className="prose"
      style={{ marginTop: 8 }}
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  );
}

function SectionBlock({ name, content }) {
  if (!content) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 11,
        color: 'var(--muted)',
        fontWeight: 600,
        fontFamily: '"JetBrains Mono", monospace',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {name}
      </div>
      {renderMarkdown(content)}
    </div>
  );
}

function ChildChip({ project, showStage, showKind }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/project/${project.slug}`)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 4,
        fontSize: 12,
        fontFamily: '"JetBrains Mono", monospace',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {showStage && project.stage && (
        <div style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: getNodeStageColor(project.stage),
          flexShrink: 0,
        }} />
      )}
      {showKind && project.kind && (
        <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
          {getKindLabel(project.kind)}
        </span>
      )}
      <span>{project.title || project.slug}</span>
    </button>
  );
}

export default function ContextZone({ kind, meta, sections, zoneSections, projects, slug }) {
  const children = projects.filter((p) => p.part_of === slug);

  function renderConsumedSections(sectionNames) {
    if (!sectionNames || !sections) return null;
    return sectionNames.map((name) =>
      sections[name] ? (
        <SectionBlock key={name} name={name} content={sections[name]} />
      ) : null
    );
  }

  return (
    <div style={{
      position: 'sticky',
      top: 16,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 16,
    }}>
      {/* Label */}
      <div style={{
        fontSize: 11,
        color: 'var(--muted)',
        fontWeight: 600,
        fontFamily: '"JetBrains Mono", monospace',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        SAMMANHANG
      </div>

      {/* Component kind */}
      {kind === 'component' && (
        <div>
          <NodeRelationsList partOf={meta?.part_of} feeds={meta?.feeds} dependsOn={meta?.depends_on} />
        </div>
      )}

      {/* System kind */}
      {kind === 'system' && (
        <div>
          {renderConsumedSections(zoneSections?.sammanhang)}
          {children.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: 11,
                color: 'var(--muted)',
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                INGÅENDE KOMPONENTER
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {children.map((child) => (
                  <ChildChip key={child.slug} project={child} showStage />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Framework kind */}
      {kind === 'framework' && (
        <div>
          {renderConsumedSections(zoneSections?.sammanhang)}
          {children.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: 11,
                color: 'var(--muted)',
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                INGÅENDE SYSTEM
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {children.map((child) => (
                  <ChildChip key={child.slug} project={child} showKind />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fallback for unknown/no kind */}
      {!kind && (
        <div>
          <NodeRelationsList partOf={meta?.part_of} feeds={meta?.feeds} dependsOn={meta?.depends_on} />
        </div>
      )}
    </div>
  );
}

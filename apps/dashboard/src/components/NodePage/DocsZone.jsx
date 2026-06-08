import { useState } from 'react';
import { marked } from 'marked';

marked.use({ breaks: true, gfm: true });

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
        }}
      >
        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{open ? '▼' : '▶'}</span>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--text)',
        }}>
          {title}
        </span>
      </button>
      {open && <div style={{ marginTop: '0.75rem' }}>{children}</div>}
    </div>
  );
}

function FileGroup({ name, files }) {
  if (!files || files.length === 0) return null;

  return (
    <CollapsibleSection title={`${name.charAt(0).toUpperCase() + name.slice(1)} (${files.length} ${files.length === 1 ? 'file' : 'files'})`}>
      <div>
        {files.map((f, i) => (
          <div key={i} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.8rem',
              color: 'var(--accent)',
              marginBottom: '0.5rem',
              margin: 0,
            }}>
              {f.filename}
            </h4>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: marked.parse(f.content || '') }}
            />
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

export default function DocsZone({ sections, consumedSections, projectFiles }) {
  // Compute remaining sections not consumed by other zones
  const remainingSections = sections
    ? Object.keys(sections).filter(
        (key) => !consumedSections.has(key) && sections[key]
      )
    : [];

  const hasRemaining = remainingSections.length > 0;
  const hasFiles = projectFiles && Object.keys(projectFiles).some((k) => projectFiles[k]?.length > 0);

  if (!hasRemaining && !hasFiles) return null;

  return (
    <div style={{ marginTop: 24 }}>
      {/* Remaining sections */}
      {hasRemaining && remainingSections.map((key) => (
        <CollapsibleSection key={key} title={key}>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: marked.parse(sections[key]) }}
          />
        </CollapsibleSection>
      ))}

      {/* Project files */}
      {hasFiles && (
        <div style={{ marginTop: hasRemaining ? '1rem' : 0 }}>
          <div style={{
            fontSize: 11,
            color: 'var(--muted)',
            fontWeight: 600,
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            PROJECT FILES
          </div>
          {Object.entries(projectFiles).map(([dir, files]) => (
            <FileGroup key={dir} name={dir} files={files} />
          ))}
        </div>
      )}
    </div>
  );
}

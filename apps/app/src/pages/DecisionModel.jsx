import { useParams, Link } from 'react-router-dom';
import { Container, Section, Eyebrow, H1, H2, Lead } from '@cortxt/ui';
import { useDecisionModel } from '../lib/useModels.js';
import { HealthBadge } from '../components/HealthBadge.jsx';
import { StatusTag } from '../components/StatusTag.jsx';

/* Decision-model view — a readable brief for one model (the "report" leg).
 * Renders meta + prose sections from /api/node/<slug>/full plus open issues.
 * No new backend: this is a projection of what CNS Core already exposes. */
export default function DecisionModel() {
  const { slug } = useParams();
  const { model, issues, loading, error } = useDecisionModel(slug);

  if (loading) return <Wrap><p className="placeholder">Hämtar beslutsmodell …</p></Wrap>;
  if (error || !model || model.status === 'error') {
    return (
      <Wrap>
        <p className="placeholder">
          Kunde inte hämta <code>{slug}</code> ({error || model?.message || 'okänt fel'}).
        </p>
      </Wrap>
    );
  }

  const meta = model.meta || {};
  const sections = model.sections || {};
  const sectionEntries = Object.entries(sections).filter(([, v]) => v && v.trim());

  return (
    <Wrap>
      <div className="page-head">
        <Eyebrow><Link to="/portfolj">← Portfölj</Link></Eyebrow>
        <H1>{meta.title || slug}</H1>
        <div className="decision-meta">
          <HealthBadge level={meta.health?.level} />
          <StatusTag live={Boolean(meta.url_live)} />
          {meta.domain && <span className="cx-label">{meta.domain}</span>}
        </div>
      </div>

      {meta.summary && <p>{meta.summary}</p>}

      {(meta.url_live || meta.url_repo) && (
        <p className="model-card__links">
          {meta.url_live && <a href={meta.url_live} target="_blank" rel="noreferrer">Öppna live ↗</a>}
          {meta.url_repo && <a href={meta.url_repo} target="_blank" rel="noreferrer">Repo ↗</a>}
        </p>
      )}

      {sectionEntries.map(([name, text]) => (
        <div className="decision-section" key={name}>
          <H2>{name}</H2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{text}</p>
        </div>
      ))}

      <div className="decision-section">
        <H2>Öppna uppgifter</H2>
        {issues.length ? (
          <ul className="decision-issues">
            {issues.map((i) => (
              <li key={i.number}>
                <a href={i.html_url || '#'} target="_blank" rel="noreferrer">#{i.number}</a> {i.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="tool-meta">Inga öppna issues på noden.</p>
        )}
      </div>
    </Wrap>
  );
}

function Wrap({ children }) {
  return <Section><Container>{children}</Container></Section>;
}

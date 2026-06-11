import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useEventstream from '../hooks/useEventstream';
import { getEventColor } from '../data/labels';

function relativeTime(dateStr) {
  if (!dateStr) return '';
  try {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'nu';
    if (diffMin < 60) return `${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d`;
    return new Date(dateStr).toLocaleDateString('sv-SE', { dateStyle: 'short' });
  } catch {
    return '';
  }
}

function dayLabel(dateStr) {
  try {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Idag';
    if (d.toDateString() === yesterday.toDateString()) return 'Igår';
    return d.toLocaleDateString('sv-SE', { dateStyle: 'long' });
  } catch {
    return dateStr;
  }
}

function groupByDay(events) {
  const groups = {};
  for (const ev of events) {
    const key = (() => {
      try { return new Date(ev.when).toDateString(); } catch { return 'unknown'; }
    })();
    if (!groups[key]) groups[key] = { label: dayLabel(ev.when), dateKey: key, events: [] };
    groups[key].events.push(ev);
  }
  // Sort newest first
  return Object.values(groups).sort((a, b) => {
    const da = new Date(a.events[0]?.when ?? 0).getTime();
    const db = new Date(b.events[0]?.when ?? 0).getTime();
    return db - da;
  });
}

export default function Timeline({ slug, projects = [] }) {
  const navigate = useNavigate();
  const { events, source, loading, error } = useEventstream(slug ? { slug } : {});

  const filteredEvents = useMemo(
    () => (slug ? events.filter((ev) => ev.slug === slug) : events),
    [events, slug]
  );
  const dayGroups = useMemo(() => groupByDay(filteredEvents), [filteredEvents]);

  // Build slug→title lookup
  const titleBySlug = useMemo(() => {
    const map = {};
    for (const p of projects) map[p.slug] = p.title;
    return map;
  }, [projects]);

  if (loading && events.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--muted)', padding: 8 }}>Laddar aktivitet…</div>;
  }

  if (error) {
    return <div style={{ fontSize: 13, color: '#fb7185', padding: 8 }}>Kunde inte ladda aktivitet: {error}</div>;
  }

  if (events.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--muted)', padding: 8 }}>Ingen aktivitet än</div>;
  }

  return (
    <div>
      {/* Fallback notice */}
      {source === 'fallback' && (
        <div style={{
          fontSize: 11,
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono, monospace)',
          marginBottom: 8,
          padding: '4px 8px',
          background: 'rgba(100,116,139,0.08)',
          borderRadius: 4,
        }}>
          Redis ej tillgänglig, visar arkiv
        </div>
      )}

      {dayGroups.map((group) => (
        <div key={group.dateKey} style={{ marginBottom: 16 }}>
          {/* Day header */}
          <div style={{
            fontSize: 11,
            color: 'var(--muted)',
            fontWeight: 600,
            fontFamily: 'var(--font-mono, monospace)',
            marginBottom: 6,
            letterSpacing: '0.05em',
          }}>
            {group.label}
          </div>

          {/* Events */}
          <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 16 }}>
            {group.events.map((ev) => {
              const color = getEventColor(ev.what);
              const nodeSlug = ev.slug; // event.slug for navigation (NOT event.where)
              const nodeTitle = nodeSlug ? titleBySlug[nodeSlug] : null;

              return (
                <div key={ev.id} style={{
                  position: 'relative',
                  marginBottom: 8,
                  paddingBottom: 8,
                }}>
                  {/* Dot on the left border */}
                  <div style={{
                    position: 'absolute',
                    left: -7,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: color,
                    border: '2px solid var(--bg)',
                  }} />

                  {/* Event content */}
                  <div style={{ paddingLeft: 4 }}>
                    {/* Title line */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                      {nodeSlug ? (
                        <button
                          onClick={() => navigate(`/project/${nodeSlug}`)}
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: 'var(--accent)',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontFamily: 'inherit',
                          }}
                        >
                          {nodeTitle || nodeSlug}
                        </button>
                      ) : null}
                      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: nodeSlug ? 400 : 600 }}>
                        {ev.why}
                      </span>
                    </div>

                    {/* Subtitle */}
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      {ev.who && <span>{ev.who}</span>}
                      {ev.where && <span>{ev.where}</span>}
                      <span>{relativeTime(ev.when)}</span>
                      <span style={{ opacity: 0.6 }}>{ev.what}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
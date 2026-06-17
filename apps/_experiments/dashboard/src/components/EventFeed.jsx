import useEventstream from '../hooks/useEventstream';
import { useState, useEffect, useRef } from 'react';

const SOURCE_COLORS = {
  github: '#4ec9b0',
  devwatch: '#007acc',
  manual: '#858585',
  webhook: '#dcdcaa',
};

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
}

export default function EventFeed({ onNewEvents }) {
  const { events, loading, error } = useEventstream();
  const prevCount = useRef(0);

  // Notify parent of new events
  useEffect(() => {
    if (events.length > prevCount.current && prevCount.current > 0) {
      onNewEvents && onNewEvents(events.length - prevCount.current);
    }
    prevCount.current = events.length;
  }, [events.length, onNewEvents]);

  if (loading && events.length === 0) {
    return <div style={{ fontSize: 12, color: 'var(--muted)' }}>Laddar händelser...</div>;
  }

  if (error) {
    return <div style={{ fontSize: 12, color: '#f44747' }}>Fel: {error}</div>;
  }

  if (events.length === 0) {
    return <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Inga händelser</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {events.slice(0, 50).map((ev, i) => {
        const source = ev.source || 'manual';
        const color = SOURCE_COLORS[source] || '#858585';
        return (
          <div key={ev.id || i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '3px 0',
            fontSize: 12,
            borderBottom: '1px solid rgba(60,60,60,0.3)',
          }}>
            <span style={{ color: 'var(--muted)', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", minWidth: 70 }}>
              {formatDate(ev.timestamp)} {formatTime(ev.timestamp)}
            </span>
            <span style={{
              padding: '1px 5px',
              borderRadius: 2,
              fontSize: 10,
              fontWeight: 600,
              background: `${color}22`,
              color: color,
              textTransform: 'uppercase',
              minWidth: 55,
              textAlign: 'center',
            }}>
              {source}
            </span>
            <span style={{ color: 'var(--accent)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", minWidth: 100 }}>
              {ev.slug || '—'}
            </span>
            <span style={{ color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ev.event_type || ev.description || ev.message || ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

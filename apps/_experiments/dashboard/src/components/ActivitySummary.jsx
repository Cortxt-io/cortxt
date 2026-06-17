import { marked } from 'marked';
import useDevlog from '../hooks/useDevlog';

marked.use({ breaks: true, gfm: true });

export default function ActivitySummary() {
  const { digest, generatedAt, status, loading, error } = useDevlog();

  if (loading) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 20,
        color: 'var(--muted)',
        fontSize: 13,
      }}>
        Laddar sammanfattning…
      </div>
    );
  }

  if (error || status === 'not_found') {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 20,
      }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Ingen sammanfattning än — kör Uppdatera underlag
        </div>
      </div>
    );
  }

  if (!digest) {
    return null;
  }

  const formattedDate = generatedAt
    ? (() => {
        try { return new Date(generatedAt).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }); } catch { return generatedAt; }
      })()
    : '';

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 20,
      marginBottom: 16,
    }}>
      <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(digest) }} />
      {formattedDate && (
        <div style={{
          fontSize: 11,
          color: 'var(--muted)',
          fontFamily: 'var(--font-mono, monospace)',
          marginTop: 12,
        }}>
          {formattedDate}
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BriefView({ brief, loading, error, refresh, generatedAt }) {
  const navigate = useNavigate();
  const [showQuestPrompt, setShowQuestPrompt] = useState(false);

  if (loading) {
    return (
      <div style={{ padding: 32, maxWidth: 1100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>Portfolio Brief</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Skeleton pulse animation */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 20,
                opacity: 0.5,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              <div style={{ height: 16, background: 'var(--border)', borderRadius: 4, marginBottom: 8, width: '60%' }} />
              <div style={{ height: 12, background: 'var(--border)', borderRadius: 4, width: '80%' }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32, maxWidth: 1100 }}>
        <h1 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--text)' }}>Portfolio Brief</h1>
        <div style={{
          background: 'rgba(251,113,185,0.08)',
          border: '1px solid rgba(251,113,185,0.2)',
          borderRadius: 8,
          padding: 16,
          color: 'var(--text)',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Kunde inte generera brief</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{error}</div>
          <button
            onClick={refresh}
            style={{
              padding: '6px 16px',
              borderRadius: 4,
              fontSize: 13,
              fontFamily: 'var(--font-mono, monospace)',
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
            }}
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div style={{ padding: 32, maxWidth: 1100 }}>
        <h1 style={{ margin: '0 0 16px', fontSize: 22, color: 'var(--text)' }}>Portfolio Brief</h1>
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: 'var(--muted)',
          fontSize: 14,
        }}>
          <p>Inga projekt i portföljen.</p>
        </div>
      </div>
    );
  }

  const { situation, priorities, blockers, quest_suggestion, pending_recommendation } = brief;

  function buildQuestPrompt() {
    if (!quest_suggestion) return '';
    return (
      `Projekt: ${quest_suggestion.target_slug}\n` +
      `Quest: ${quest_suggestion.title}\n\n` +
      `${quest_suggestion.description}\n\n` +
      `Motivering: ${quest_suggestion.estimated_impact}\n\n` +
      `[Läs projects/${quest_suggestion.target_slug}/project.md och relevanta planning/-filer innan du börjar.]`
    );
  }

  function copyQuestPrompt() {
    const text = buildQuestPrompt();
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function formatGeneratedAt() {
    if (!generatedAt) return '';
    try {
      return new Date(generatedAt).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return generatedAt;
    }
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 22, color: 'var(--text)' }}>Dagens brief</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {generatedAt && (
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)' }}>
              {formatGeneratedAt()}
            </span>
          )}
          <button
            onClick={refresh}
            style={{
              padding: '6px 14px',
              borderRadius: 4,
              fontSize: 13,
              fontFamily: 'var(--font-mono, monospace)',
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
            }}
          >
            Generera ny ↻
          </button>
        </div>
      </div>

      {/* Situation + Quest suggestion */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Situation */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 20,
        }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-mono, monospace)' }}>
            SITUATION
          </div>
          <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
            {situation}
          </div>
        </div>

        {/* Quest suggestion */}
        {quest_suggestion && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 20,
          }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-mono, monospace)' }}>
              QUEST-FÖRSLAG
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>
              {quest_suggestion.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>
              {quest_suggestion.description}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4, marginBottom: 12 }}>
              <span style={{ fontWeight: 600 }}>Mål:</span> {quest_suggestion.target_slug}
              <span style={{ marginLeft: 12, fontWeight: 600 }}>Impact:</span> {quest_suggestion.estimated_impact}
            </div>
            <button
              onClick={() => setShowQuestPrompt(!showQuestPrompt)}
              style={{
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 12,
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
              }}
            >
              {showQuestPrompt ? 'Dölj prompt' : 'Förbered quest-prompt →'}
            </button>
          </div>
        )}
      </div>

      {/* Quest prompt expandable */}
      {showQuestPrompt && quest_suggestion && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>
              QODER-PROMPT
            </span>
            <button
              onClick={copyQuestPrompt}
              style={{
                padding: '4px 12px',
                borderRadius: 4,
                fontSize: 12,
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid var(--muted)',
                color: 'var(--muted)',
              }}
            >
              Kopiera
            </button>
          </div>
          <pre style={{
            fontSize: 13,
            color: 'var(--text)',
            background: 'var(--bg)',
            borderRadius: 4,
            padding: 12,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-mono, monospace)',
            lineHeight: 1.5,
          }}>
            {buildQuestPrompt()}
          </pre>
        </div>
      )}

      {/* Priorities */}
      {priorities && priorities.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>
            PRIORITERINGAR
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
            {priorities.map((p) => (
              <div
                key={p.slug}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 16,
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/project/${p.slug}`)}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono, monospace)' }}>
                    [{p.slug}]
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                    {p.title}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, marginBottom: 4 }}>
                  {p.reason}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
                  Nästa: {p.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blockers */}
      {blockers && blockers.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>
            BLOCKERS
          </div>
          {blockers.map((b) => (
            <div
              key={b.slug}
              style={{
                background: 'rgba(251,113,185,0.06)',
                border: '1px solid rgba(251,113,185,0.15)',
                borderRadius: 6,
                padding: '10px 14px',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 12, color: '#fb7185', fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>
                [{b.slug}]
              </span>
              <span style={{ fontSize: 13, color: 'var(--text)' }}>
                {b.blocker}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Pending recommendation */}
      {pending_recommendation && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-mono, monospace)' }}>
            PENDING-REKOMMENDATION
          </div>
          <div style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 6,
            padding: '12px 16px',
            fontSize: 13,
            color: 'var(--text)',
            lineHeight: 1.6,
          }}>
            {pending_recommendation}
          </div>
        </div>
      )}
    </div>
  );
}
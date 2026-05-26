import { content } from '../data/content';

export default function Footer() {
  const { builder } = content;

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '1.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.78rem',
          color: 'var(--muted)',
        }}
      >
        Cortxt · cortxt.io · © 2026
      </span>
      <a
        href={builder.github}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.78rem',
          color: 'var(--accent)',
        }}
      >
        GitHub
      </a>
    </footer>
  );
}

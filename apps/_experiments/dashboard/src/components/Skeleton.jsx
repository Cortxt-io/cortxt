export default function Skeleton({ rows = 3, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 24, ...style }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton-bar"
          style={{
            height: i === 0 ? 16 : 12,
            width: i === 0 ? '60%' : i === rows - 1 ? '40%' : '80%',
          }}
        />
      ))}
    </div>
  );
}

export default function StatusBar({ projectCount = 0, questCount = 0, hasNewEvents = false }) {
  return (
    <div className="status-bar">
      <span>⬡ {projectCount} projekt</span>
      <span>☑ {questCount} quests</span>
      <div style={{ flex: 1 }} />
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: hasNewEvents ? '#4ec9b0' : '#858585',
          animation: hasNewEvents ? 'pulse 2s ease-in-out infinite' : 'none',
        }} />
        <span style={{ fontSize: 11 }}>{hasNewEvents ? '⚡ Live' : '● Idle'}</span>
      </span>
      <span>cortxt v0.1</span>
    </div>
  );
}

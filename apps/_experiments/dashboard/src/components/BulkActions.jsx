import { useState } from 'react';
import { analyzeProject, updateProject } from '../lib/api';
import { useToast } from '../hooks/useToast';

export default function BulkActions({ count, nodes, onDeselect }) {
  const { toast } = useToast();
  const [running, setRunning] = useState(false);

  const handleAnalyze = async () => {
    setRunning(true);
    try {
      for (const node of nodes) {
        await analyzeProject(node.data.project.slug);
      }
      toast(`${count} projekt analyserade`, 'success');
    } catch (err) {
      toast(`Analys misslyckades: ${err.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  const handleStageChange = async (newStage) => {
    setRunning(true);
    try {
      for (const node of nodes) {
        await updateProject(node.data.project.slug, { status: newStage });
      }
      toast(`${count} projekt → ${newStage}`, 'success');
    } catch (err) {
      toast(`Kunde inte ändra: ${err.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  const btnStyle = {
    padding: '4px 10px', fontSize: 11, border: '1px solid #3c3c3c',
    borderRadius: 3, background: 'transparent', color: '#cccccc',
    cursor: 'pointer', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  return (
    <div style={{
      position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      zIndex: 100, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
      background: '#252526', border: '1px solid #3c3c3c', borderRadius: 6,
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    }}>
      <span style={{ fontSize: 11, color: '#858585' }}>{count} valda</span>
      <button style={btnStyle} onClick={handleAnalyze} disabled={running}>
        🧠 Analysera
      </button>
      <select
        onChange={(e) => { if (e.target.value) handleStageChange(e.target.value); e.target.value = ''; }}
        style={{ ...btnStyle, padding: '3px 6px' }}
        defaultValue=""
      >
        <option value="" disabled>Ändra stage...</option>
        <option value="idea">Idea</option>
        <option value="building">Building</option>
        <option value="working">Working</option>
      </select>
      <button style={{ ...btnStyle, color: '#858585' }} onClick={onDeselect}>✕ Avmarkera</button>
    </div>
  );
}

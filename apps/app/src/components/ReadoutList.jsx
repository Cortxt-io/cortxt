/* A list of model rows with shared loading / error / empty states.
 * Replaces ModelGrid; keeps pages declarative. */
import { ReadoutRow } from './ReadoutRow.jsx';

export function ReadoutList({ models, loading, error, hrefFor, emptyText = 'Inga modeller ännu.' }) {
  if (loading) return <p className="placeholder">Hämtar från CNS Core …</p>;
  if (error) {
    return (
      <p className="placeholder">
        Kunde inte nå CNS Core ({error}). Kontrollera att backenden svarar på <code>/api/nodes</code>.
      </p>
    );
  }
  if (!models.length) return <p className="placeholder">{emptyText}</p>;
  return (
    <div className="readout-list">
      {models.map((m) => <ReadoutRow key={m.slug} model={m} href={hrefFor ? hrefFor(m) : undefined} />)}
    </div>
  );
}

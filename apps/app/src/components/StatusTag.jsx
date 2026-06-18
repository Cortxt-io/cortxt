/* Live/build status, derived from whether the model has a live URL.
 * Mono — part of the instrument-readout voice. */
export function StatusTag({ live }) {
  return (
    <span className={`status-tag ${live ? 'status-tag--live' : 'status-tag--wip'}`}>
      {live ? 'live' : 'byggs'}
    </span>
  );
}

import { Navigate } from 'react-router-dom';

// #/pending redirects to #/analyze — kept for backwards-compat with bookmarks
export default function PendingView() {
  return <Navigate to="/analyze" replace />;
}

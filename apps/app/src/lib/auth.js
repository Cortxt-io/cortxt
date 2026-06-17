/* Auth seam (placeholder).
 *
 * No auth stack is wired yet. When adding Clerk / Supabase / Auth0:
 *  - wrap <App/> in the provider (apps/app/src/main.jsx),
 *  - replace useAuth() below with the provider's hook,
 *  - gate routes in App.jsx on `user`.
 * Keep all auth access behind this module so the rest of the app stays decoupled.
 */
export function useAuth() {
  return {
    user: null,           // null = signed out (placeholder)
    signIn: () => alert('Auth not wired yet — Clerk/Supabase/Auth0 goes here.'),
    signOut: () => {},
  };
}

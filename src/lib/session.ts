const SESSION_KEY = "borrowlend-session";

export interface Session {
  token: string;
  expiresAt: number; // ms epoch
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as Session;
    if (!session.token || !session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export function isSessionValid(session: Session | null): boolean {
  return !!session && session.expiresAt > Date.now();
}

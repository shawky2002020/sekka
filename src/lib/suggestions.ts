export interface Suggestion {
  id: string;
  procedure: string;
  governorate: string;
  knownOffice?: string;
  problem?: string;
  phone?: string;
  createdAt: number;
}

const KEY = "sikka.suggestions.v1";

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read(): Suggestion[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: Suggestion[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100)));
  } catch {
    /* ignore */
  }
}

export function saveSuggestion(input: Omit<Suggestion, "id" | "createdAt">): string {
  const items = read();
  const id = `s-${Date.now().toString(36)}`;
  items.unshift({ ...input, id, createdAt: Date.now() });
  write(items);
  return id;
}

export function listSuggestions(): Suggestion[] {
  return read();
}

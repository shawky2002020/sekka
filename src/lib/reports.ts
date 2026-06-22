export interface Report {
  id: string;
  serviceId: string;
  governorate: string;
  type: string;
  changed: string;
  notes?: string;
  occurredAt?: string;
  phone?: string;
  createdAt: number;
}

const KEY = "sikka.reports.v1";

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read(): Report[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: Report[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100)));
  } catch {
    /* ignore */
  }
}

export function saveReport(input: Omit<Report, "id" | "createdAt">): string {
  const items = read();
  const id = `r-${Date.now().toString(36)}`;
  items.unshift({ ...input, id, createdAt: Date.now() });
  write(items);
  return id;
}

export function listReports(): Report[] {
  return read();
}

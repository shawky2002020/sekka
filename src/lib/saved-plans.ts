export interface SavedPlan {
  id: string;
  serviceId: string;
  answers: Record<string, string>;
  checkedItems: Record<string, boolean>;
  readiness: number;
  createdAt: number;
  updatedAt: number;
}

const KEY = "sikka.savedPlans.v2";

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read(): SavedPlan[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => ({
      checkedItems: {},
      updatedAt: p.createdAt ?? Date.now(),
      readiness: 0,
      ...p,
    })) as SavedPlan[];
  } catch {
    return [];
  }
}

function write(plans: SavedPlan[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(plans.slice(0, 30)));
  } catch {
    /* quota or privacy mode — ignore */
  }
}

export function savePlan(input: {
  serviceId: string;
  answers: Record<string, string>;
  readiness?: number;
  checkedItems?: Record<string, boolean>;
}): string {
  const plans = read();
  const id = `${input.serviceId}-${Date.now().toString(36)}`;
  const now = Date.now();
  plans.unshift({
    id,
    serviceId: input.serviceId,
    answers: input.answers,
    checkedItems: input.checkedItems ?? {},
    readiness: input.readiness ?? 0,
    createdAt: now,
    updatedAt: now,
  });
  write(plans);
  return id;
}

export function getPlan(id: string): SavedPlan | undefined {
  return read().find((p) => p.id === id);
}

export function listPlans(): SavedPlan[] {
  return read().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function removePlan(id: string) {
  write(read().filter((p) => p.id !== id));
}

export function updatePlan(id: string, patch: Partial<Omit<SavedPlan, "id" | "createdAt">>) {
  const plans = read();
  const idx = plans.findIndex((p) => p.id === id);
  if (idx < 0) return;
  plans[idx] = { ...plans[idx], ...patch, updatedAt: Date.now() };
  write(plans);
}

export function readinessStatus(r: number): { label: string; tone: "success" | "warning" | "danger" } {
  if (r >= 85) return { label: "جاهز", tone: "success" };
  if (r >= 50) return { label: "راجع الناقص", tone: "warning" };
  return { label: "محتاج مراجعة", tone: "danger" };
}

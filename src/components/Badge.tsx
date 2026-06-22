import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary-soft text-primary border-primary/20",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning-foreground border-warning/30",
  danger: "bg-danger-soft text-danger border-danger/20",
  info: "bg-accent text-accent-foreground border-accent-foreground/10",
};

export function Badge({ children, tone = "neutral", className = "" }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${toneClass[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function badgeToneFor(label: string): BadgeTone {
  if (["مطلوب", "أصل", "أصل + صورة"].includes(label)) return "primary";
  if (label === "صورة") return "info";
  if (["يحتاج ختم", "حسب الحالة", "قد يُطلب", "حسب المكتب", "للذكور"].includes(label)) return "warning";
  if (["تمت المراجعة", "مراجعة حديثة"].includes(label)) return "success";
  if (label === "مهم") return "danger";
  return "neutral";
}

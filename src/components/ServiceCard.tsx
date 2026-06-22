import { Link } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, Car, FileSignature, IdCard, Store, FileText } from "lucide-react";
import type { Service } from "@/lib/services-data";
import { Badge } from "./Badge";

const iconFor = (id: string) => {
  switch (id) {
    case "kaab-amal": return Briefcase;
    case "renew-id": return IdCard;
    case "driving-license": return Car;
    case "contract-auth": return FileSignature;
    case "commercial-reg": return Store;
    default: return FileText;
  }
};

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  const Icon = iconFor(service.id);

  const inner = (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-semibold text-foreground truncate">{service.name}</h3>
          {service.popular && <Badge tone="primary">شائع</Badge>}
          {service.comingSoon && <Badge tone="warning">قريبًا</Badge>}
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
        {!compact && !service.comingSoon && (
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>⏱ {service.averageDuration}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>زحام {service.congestionLevel}</span>
          </div>
        )}
        {service.comingSoon && (
          <p className="mt-2 text-[11px] text-muted-foreground">بنراجع بياناتها قبل ما نعرض خطة كاملة.</p>
        )}
      </div>
      {!service.comingSoon && <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180 group-hover:text-primary transition" />}
    </div>
  );

  if (service.comingSoon) {
    return (
      <Link
        to="/suggest"
        className="group block rounded-2xl border border-dashed border-border bg-card/60 p-5 transition-all hover:border-primary/30"
      >
        {inner}
      </Link>
    );
  }

  return (
    <Link
      to="/service/$id"
      params={{ id: service.id }}
      className="group block rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
    >
      {inner}
    </Link>
  );
}

export function TrustNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card/60 px-4 py-3 text-xs text-muted-foreground leading-relaxed ${className}`}>
      <span className="font-medium text-foreground">سِكّة دليل مساعد وليس جهة حكومية.</span>{" "}
      المعلومات قد تختلف حسب المحافظة أو المكتب. راجع الجهة الرسمية عند الحاجة.
    </div>
  );
}

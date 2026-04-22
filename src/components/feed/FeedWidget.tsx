import { Sparkles, Trophy, Lightbulb } from "lucide-react";

export function FeedWidget({ kind }: { kind: "theme" | "creators" | "inspiration" }) {
  if (kind === "theme") {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-accent/30 to-primary/10 border border-primary/20 p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AYIN TEMASI
        </div>
        <p className="mt-2 font-serif text-xl font-bold">Bahar Çiçekleri Koleksiyonu</p>
        <p className="mt-1 text-sm text-muted-foreground">
          #BaharModu etiketiyle bahar projelerini paylaş, ayın üreticisi seçil.
        </p>
      </div>
    );
  }
  if (kind === "creators") {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Trophy className="h-3.5 w-3.5" /> BU HAFTANIN ÜRETİCİLERİ
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {["🧶","🪡","🧵","🎨"].map((e, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl">{e}</div>
              <span className="text-xs">Üretici {i+1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-medium text-primary">
        <Lightbulb className="h-3.5 w-3.5" /> İLHAM KARTI
      </div>
      <p className="mt-2 font-serif text-lg font-semibold">Yarım kalan projene dön!</p>
      <p className="mt-1 text-sm text-muted-foreground">Bugün 30 dakika ayır, küçük bir adım atılsın yeter.</p>
    </div>
  );
}
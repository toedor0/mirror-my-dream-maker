import { Plus, MessageCircleQuestion, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  onCreate: (preset?: "uretim" | "atolye" | "oneri") => void;
  onAuthOpen: () => void;
}

const actions = [
  { key: "uretim" as const, label: "Proje Paylaş", icon: Plus, color: "text-emerald-700 dark:text-emerald-400" },
  { key: "atolye" as const, label: "Soru Sor", icon: MessageCircleQuestion, color: "text-rose-700 dark:text-rose-400" },
  { key: "oneri" as const, label: "Ürün Öner", icon: Star, color: "text-amber-700 dark:text-amber-400" },
];

export function QuickShareCard({ onCreate, onAuthOpen }: Props) {
  const { user } = useAuth();
  const handle = (preset: "uretim" | "atolye" | "oneri") => {
    if (!user) return onAuthOpen();
    onCreate(preset);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-1">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.key}
              onClick={() => handle(a.key)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
            >
              <Icon className={`h-3.5 w-3.5 ${a.color}`} />
              {a.label}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => handle("uretim")}
        className="mt-2 w-full rounded-xl border border-border bg-input/30 px-4 py-2.5 text-left text-sm text-muted-foreground transition hover:bg-input/50"
      >
        Projeni anlat...
      </button>
    </div>
  );
}

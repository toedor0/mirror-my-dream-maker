import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FeedList } from "@/components/feed/FeedList";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({ component: Index });

const tabs = [
  { v: "all", label: "Tümü" },
  { v: "uretim", label: "Üretimler" },
  { v: "atolye", label: "Atölye" },
  { v: "oneri", label: "Öneriler" },
  { v: "blog", label: "Blog" },
] as const;

type Filter = typeof tabs[number]["v"];

function Index() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"all" | "following">("all");

  return (
    <AppLayout>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">Akışınız</h1>
      <p className="mt-1 text-sm text-muted-foreground">Topluluğundan en son paylaşımlar</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.v}
            onClick={() => setFilter(t.v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === t.v ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {user && (
        <div className="mt-3 inline-flex rounded-full bg-muted p-1">
          {(["all", "following"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3.5 py-1 text-xs transition ${
                view === v ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
              }`}
            >
              {v === "all" ? "Herkes" : "Takip Ettiklerim"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <FeedList filter={filter} />
      </div>
    </AppLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FeedList } from "@/components/feed/FeedList";
import { CATEGORIES } from "@/lib/post-helpers";
import { useState } from "react";

export const Route = createFileRoute("/kesfet")({ component: Kesfet });

function Kesfet() {
  const [cat, setCat] = useState<string | undefined>();
  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold">Keşfet</h1>
      <p className="text-sm text-muted-foreground">Kategoriye göre içerik bul</p>
      <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-2">
        <button onClick={() => setCat(undefined)} className={`rounded-2xl border p-3 text-sm ${!cat ? "border-primary bg-accent" : "border-border bg-card"}`}>
          ✨ Tümü
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.value} onClick={() => setCat(c.value)} className={`rounded-2xl border p-3 text-sm ${cat === c.value ? "border-primary bg-accent" : "border-border bg-card hover:bg-muted/50"}`}>
            <div className="text-2xl">{c.emoji}</div>
            <div className="mt-1 text-xs">{c.label}</div>
          </button>
        ))}
      </div>
      <div className="mt-6"><FeedList category={cat} /></div>
    </AppLayout>
  );
}

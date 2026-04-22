import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FeedList } from "@/components/feed/FeedList";

export const Route = createFileRoute("/atolye")({ component: Atolye });

function Atolye() {
  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold">Atölye</h1>
      <p className="text-sm text-muted-foreground">Sorular, çözümler, ipuçları</p>
      <div className="mt-6"><FeedList filter="atolye" /></div>
    </AppLayout>
  );
}

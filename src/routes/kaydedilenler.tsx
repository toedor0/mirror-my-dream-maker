import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FeedList } from "@/components/feed/FeedList";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/kaydedilenler")({ component: Saved });

function Saved() {
  const { user } = useAuth();
  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold">Kaydedilenler</h1>
      {!user ? (
        <p className="mt-4 text-sm text-muted-foreground">Kaydettiklerini görmek için giriş yap.</p>
      ) : (
        <div className="mt-6"><FeedList savedByUser /></div>
      )}
    </AppLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { timeAgo } from "@/lib/post-helpers";

export const Route = createFileRoute("/bildirimler")({ component: Notifs });

function Notifs() {
  const { user } = useAuth();
  const { data = [] } = useQuery({
    queryKey: ["notifs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*, actor:profiles!notifications_actor_id_fkey(display_name,avatar_emoji,username)")
        .eq("recipient_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold">Bildirimler</h1>
      {!user ? (
        <p className="mt-4 text-sm text-muted-foreground">Giriş yap.</p>
      ) : data.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Henüz bildirim yok.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {data.map((n: { id: string; read: boolean; type: string; created_at: string; actor?: { display_name?: string; avatar_emoji?: string | null } | null }) => (
            <div key={n.id} className={`flex items-center gap-3 rounded-xl border border-border p-3 ${!n.read ? "bg-accent/30" : "bg-card"}`}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">{n.actor?.avatar_emoji ?? "🧵"}</div>
              <div className="flex-1 text-sm">
                <span className="font-medium">{n.actor?.display_name ?? "Biri"}</span>{" "}
                {n.type === "like" ? "gönderini beğendi" : n.type === "comment" ? "yorum yaptı" : n.type === "follow" ? "seni takip etti" : n.type === "save" ? "gönderini kaydetti" : "sorununu çözdü"}
                <p className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</p>
              </div>
              {!n.read && <div className="h-2 w-2 rounded-full bg-primary" />}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

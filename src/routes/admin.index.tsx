import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, MessageSquare, Heart, Wrench, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const since = new Date(Date.now() - 7 * 86400000).toISOString();
      const [users, posts, comments, likes, atolye, solved, recentUsers, recentPosts] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("comments").select("post_id", { count: "exact", head: true }),
        supabase.from("likes").select("post_id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("type", "atolye"),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("atolye_status", "cozuldu"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", since),
        supabase.from("posts").select("id", { count: "exact", head: true }).gte("created_at", since),
      ]);
      return {
        users: users.count ?? 0, posts: posts.count ?? 0,
        comments: comments.count ?? 0, likes: likes.count ?? 0,
        atolye: atolye.count ?? 0, solved: solved.count ?? 0,
        recentUsers: recentUsers.count ?? 0, recentPosts: recentPosts.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Kullanıcı", value: stats?.users ?? 0, icon: Users, sub: `+${stats?.recentUsers ?? 0} bu hafta`, color: "text-blue-600" },
    { label: "Paylaşım", value: stats?.posts ?? 0, icon: FileText, sub: `+${stats?.recentPosts ?? 0} bu hafta`, color: "text-emerald-600" },
    { label: "Yorum", value: stats?.comments ?? 0, icon: MessageSquare, sub: "toplam", color: "text-amber-600" },
    { label: "Beğeni", value: stats?.likes ?? 0, icon: Heart, sub: "toplam", color: "text-rose-600" },
    { label: "Atölye Sorusu", value: stats?.atolye ?? 0, icon: Wrench, sub: "toplam", color: "text-purple-600" },
    { label: "Çözülen Sorun", value: stats?.solved ?? 0, icon: CheckCircle2, sub: `${stats?.atolye ? Math.round((stats.solved / stats.atolye) * 100) : 0}% çözüm oranı`, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</span>
              <Icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className="mt-3 font-serif text-3xl font-bold">{c.value.toLocaleString("tr-TR")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

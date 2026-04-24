import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { timeAgo, categoryEmoji } from "@/lib/post-helpers";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/posts")({ component: AdminPosts });

function AdminPosts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "uretim" | "atolye" | "oneri" | "blog">("all");

  const { data: posts = [] } = useQuery({
    queryKey: ["admin-posts", filter],
    queryFn: async () => {
      let q = supabase.from("posts").select("id,title,content,type,category,hidden,created_at,author_id,image_url").order("created_at", { ascending: false }).limit(100);
      if (filter !== "all") q = q.eq("type", filter);
      const { data: posts } = await q;
      const ids = (posts ?? []).map((p) => p.author_id);
      const { data: authors } = ids.length
        ? await supabase.from("profiles").select("id,username,display_name,avatar_emoji").in("id", ids)
        : { data: [] as { id: string; username: string; display_name: string; avatar_emoji: string | null }[] };
      const am = new Map((authors ?? []).map((a) => [a.id, a]));
      return (posts ?? []).map((p) => ({ ...p, author: am.get(p.author_id) }));
    },
  });

  const filtered = posts.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  const toggleHidden = async (id: string, hidden: boolean) => {
    const { error } = await supabase.from("posts").update({ hidden: !hidden }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(hidden ? "Görünür yapıldı" : "Gizlendi");
    qc.invalidateQueries({ queryKey: ["admin-posts"] });
    qc.invalidateQueries({ queryKey: ["feed"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Bu paylaşımı kalıcı olarak silmek istiyor musun?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Silindi");
    qc.invalidateQueries({ queryKey: ["admin-posts"] });
    qc.invalidateQueries({ queryKey: ["feed"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Başlığa göre ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs rounded-full" />
        <div className="flex gap-1 rounded-full bg-muted/50 p-1">
          {(["all", "uretim", "atolye", "oneri", "blog"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === f ? "bg-background shadow" : "text-muted-foreground"}`}>
              {f === "all" ? "Tümü" : f}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} sonuç</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Paylaşım</th>
              <th className="px-4 py-3 text-left">Yazar</th>
              <th className="px-4 py-3 text-left">Tip</th>
              <th className="px-4 py-3 text-left">Tarih</th>
              <th className="px-4 py-3 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className={p.hidden ? "bg-amber-50/30 dark:bg-amber-950/20" : ""}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-9 w-9 flex-shrink-0 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent text-base">{categoryEmoji(p.category)}</div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.title}</p>
                      {p.hidden && <span className="text-[10px] text-amber-700 dark:text-amber-400">Gizli</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.author ? (
                    <Link to="/profil/$username" params={{ username: p.author.username }} className="flex items-center gap-1.5 hover:underline">
                      <span>{p.author.avatar_emoji ?? "🧵"}</span>
                      <span className="truncate text-xs">{p.author.display_name}</span>
                    </Link>
                  ) : <span className="text-xs text-muted-foreground">—</span>}
                </td>
                <td className="px-4 py-3"><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">{p.type}</span></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(p.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleHidden(p.id, p.hidden)} title={p.hidden ? "Göster" : "Gizle"}>
                      {p.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(p.id)} title="Sil">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">Paylaşım bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

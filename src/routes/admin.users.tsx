import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ShieldCheck, ShieldOff, Ban, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { timeAgo } from "@/lib/post-helpers";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

type Row = {
  id: string;
  username: string;
  display_name: string;
  avatar_emoji: string | null;
  city: string | null;
  created_at: string;
  roles: string[];
  banned: boolean;
};

function AdminUsers() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const [search, setSearch] = useState("");

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<Row[]> => {
      const [profiles, roles, bans] = await Promise.all([
        supabase.from("profiles").select("id,username,display_name,avatar_emoji,city,created_at").order("created_at", { ascending: false }).limit(200),
        supabase.from("user_roles").select("user_id,role"),
        supabase.from("user_bans").select("user_id,expires_at"),
      ]);
      const rm = new Map<string, string[]>();
      (roles.data ?? []).forEach((r) => {
        const arr = rm.get(r.user_id) ?? [];
        arr.push(r.role);
        rm.set(r.user_id, arr);
      });
      const banned = new Set(
        (bans.data ?? [])
          .filter((b) => !b.expires_at || new Date(b.expires_at) > new Date())
          .map((b) => b.user_id),
      );
      return (profiles.data ?? []).map((p) => ({
        ...p,
        roles: rm.get(p.id) ?? ["user"],
        banned: banned.has(p.id),
      }));
    },
  });

  const filtered = rows.filter((r) =>
    !search || r.username.includes(search.toLowerCase()) || r.display_name.toLowerCase().includes(search.toLowerCase()),
  );

  const setRole = async (userId: string, role: "admin" | "moderator" | "user") => {
    if (!isAdmin) return toast.error("Sadece admin rol değiştirebilir");
    // Clean existing non-user roles, then add desired
    await supabase.from("user_roles").delete().eq("user_id", userId).in("role", ["admin", "moderator"]);
    if (role !== "user") {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
    }
    // ensure 'user' row exists
    await supabase.from("user_roles").insert({ user_id: userId, role: "user" }).select().maybeSingle();
    toast.success("Rol güncellendi");
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const toggleBan = async (userId: string, banned: boolean) => {
    if (!isAdmin) return toast.error("Sadece admin");
    if (banned) {
      const { error } = await supabase.from("user_bans").delete().eq("user_id", userId);
      if (error) return toast.error(error.message);
      toast.success("Ban kaldırıldı");
    } else {
      const reason = prompt("Ban sebebi (opsiyonel):") ?? null;
      const { error } = await supabase.from("user_bans").insert({ user_id: userId, reason, banned_by: user?.id });
      if (error) return toast.error(error.message);
      toast.success("Kullanıcı banlandı");
    }
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input placeholder="Kullanıcı ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs rounded-full" />
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} kullanıcı</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Kullanıcı</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Şehir</th>
              <th className="px-4 py-3 text-left">Kayıt</th>
              <th className="px-4 py-3 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((r) => {
              const isAdminRow = r.roles.includes("admin");
              const isModRow = r.roles.includes("moderator");
              return (
                <tr key={r.id} className={r.banned ? "bg-destructive/5" : ""}>
                  <td className="px-4 py-3">
                    <Link to="/profil/$username" params={{ username: r.username }} className="flex items-center gap-2 hover:underline">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base">{r.avatar_emoji ?? "🧵"}</div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{r.display_name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">@{r.username}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {isAdminRow && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">Admin</span>}
                      {isModRow && <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-600">Moderatör</span>}
                      {!isAdminRow && !isModRow && <span className="text-[10px] text-muted-foreground">Üye</span>}
                      {r.banned && <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">Banlı</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.city ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {isAdmin && r.id !== user?.id && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Admin yap" onClick={() => setRole(r.id, isAdminRow ? "user" : "admin")}>
                            {isAdminRow ? <ShieldOff className="h-4 w-4 text-primary" /> : <ShieldCheck className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Moderatör yap" onClick={() => setRole(r.id, isModRow ? "user" : "moderator")}>
                            <Shield className={`h-4 w-4 ${isModRow ? "text-blue-600" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title={r.banned ? "Banı kaldır" : "Banla"} onClick={() => toggleBan(r.id, r.banned)}>
                            {r.banned ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">Kullanıcı bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

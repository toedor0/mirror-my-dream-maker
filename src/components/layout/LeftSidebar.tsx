import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, Package, Wrench, Star, Bookmark, FileText, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useCategories, useCategoryCounts } from "@/lib/categories";
import { Button } from "@/components/ui/button";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  postType?: "uretim" | "atolye" | "oneri" | "blog";
}

const navItems: NavItem[] = [
  { to: "/", label: "Akış", icon: Home },
  { to: "/kesfet", label: "Proje Kütüphanem", icon: BookOpen, postType: "uretim" },
  { to: "/kesfet", label: "Malzeme Veritabanı", icon: Package },
  { to: "/atolye", label: "Atölye Masası", icon: Wrench, postType: "atolye" },
  { to: "/kesfet", label: "Ürün Rehberi", icon: Star, postType: "oneri" },
  { to: "/kesfet", label: "Blog", icon: FileText, postType: "blog" },
  { to: "/kaydedilenler", label: "Kaydettiklerim", icon: Bookmark },
];

export function LeftSidebar({ onAuthOpen }: { onAuthOpen: () => void }) {
  const { user, profile } = useAuth();
  const { isMod } = useRole();
  const location = useLocation();
  const { data: categories = [] } = useCategories();
  const { data: catCounts } = useCategoryCounts();

  const { data: typeCounts } = useQuery({
    queryKey: ["nav-type-counts"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("type");
      const m: Record<string, number> = {};
      (data ?? []).forEach((p) => { m[p.type] = (m[p.type] ?? 0) + 1; });
      m.all = (data ?? []).length;
      return m;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["profile-stats", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const [posts, followers, solved] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", profile!.id),
        supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", profile!.id),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", profile!.id).eq("atolye_status", "cozuldu"),
      ]);
      return { posts: posts.count ?? 0, followers: followers.count ?? 0, solved: solved.count ?? 0 };
    },
  });

  const isActive = (to: string) => location.pathname === to;
  const totalCount = typeCounts?.all ?? 0;

  const itemCount = (item: NavItem) => {
    if (item.to === "/") return totalCount;
    if (item.postType) return typeCounts?.[item.postType] ?? 0;
    return undefined;
  };

  return (
    <div className="space-y-5">
      {/* Profile card */}
      {user && profile ? (
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl shadow-sm">
            {profile.avatar_emoji ?? "🧵"}
          </div>
          <p className="mt-2.5 truncate font-serif text-sm font-bold">{profile.display_name}</p>
          <p className="truncate text-xs text-muted-foreground">@{profile.username}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100/60 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            ⭐ Seviye 3
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 border-t border-border pt-3 text-center">
            <div>
              <p className="text-sm font-bold">{stats?.posts ?? 0}</p>
              <p className="text-[10px] text-muted-foreground">Projeler</p>
            </div>
            <div>
              <p className="text-sm font-bold">{stats?.followers ?? 0}</p>
              <p className="text-[10px] text-muted-foreground">Takipçi</p>
            </div>
            <div>
              <p className="text-sm font-bold">{stats?.solved ?? 0}</p>
              <p className="text-[10px] text-muted-foreground">Çözümleri</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-serif text-sm font-semibold leading-snug">Topluluğa katıl</p>
          <p className="mt-1 text-xs text-muted-foreground">Projelerini kaydet, paylaş, üret.</p>
          <Button onClick={onAuthOpen} size="sm" className="mt-3 w-full rounded-full">
            Ücretsiz Kaydol
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div>
        <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navigasyon
        </p>
        <nav className="space-y-0.5">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.to) && idx === 0;
            const count = itemCount(item);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  active ? "bg-accent/70 font-semibold text-accent-foreground" : "hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="truncate">{item.label}</span>
                </span>
                {count !== undefined && (
                  <span className="text-[10px] font-medium text-muted-foreground">{count}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Categories */}
      <div>
        <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Kategoriler
        </p>
        <nav className="space-y-0.5">
          {categories.map((c) => {
            const count = catCounts?.get(c.slug) ?? 0;
            return (
              <Link
                key={c.slug}
                to="/kesfet"
                search={{ kategori: c.slug } as never}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-md text-sm"
                    style={{ backgroundColor: `color-mix(in oklab, ${c.color} 18%, transparent)` }}
                  >
                    {c.emoji}
                  </span>
                  <span className="truncate">{c.label}</span>
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">{count}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {isMod && (
        <div>
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Yönetim
          </p>
          <Link
            to="/admin"
            className="flex items-center gap-2.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            <Shield className="h-4 w-4" />
            <span>Admin Paneli</span>
          </Link>
        </div>
      )}
    </div>
  );
}

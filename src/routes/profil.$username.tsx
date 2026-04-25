import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FeedList } from "@/components/feed/FeedList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Bookmark, Wrench, BarChart3, Pencil } from "lucide-react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

export const Route = createFileRoute("/profil/$username")({ component: Profile });

function Profile() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
      if (data && user) {
        const { data: f } = await supabase.from("follows").select("follower_id").eq("follower_id", user.id).eq("following_id", data.id).maybeSingle();
        setFollowing(!!f);
      }
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["profile-stats", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const [postsRes, followersRes, followingRes, solvedRes] = await Promise.all([
        supabase.from("posts").select("type", { count: "exact" }).eq("author_id", profile!.id),
        supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", profile!.id),
        supabase.from("follows").select("following_id", { count: "exact", head: true }).eq("follower_id", profile!.id),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", profile!.id).eq("atolye_status", "cozuldu"),
      ]);
      const byType = new Map<string, number>();
      (postsRes.data ?? []).forEach((p) => byType.set(p.type, (byType.get(p.type) ?? 0) + 1));
      return {
        total: postsRes.count ?? 0,
        uretim: byType.get("uretim") ?? 0,
        atolye: byType.get("atolye") ?? 0,
        oneri: byType.get("oneri") ?? 0,
        blog: byType.get("blog") ?? 0,
        followers: followersRes.count ?? 0,
        following: followingRes.count ?? 0,
        solved: solvedRes.count ?? 0,
      };
    },
  });

  const toggleFollow = async () => {
    if (!user) return toast.error("Takip etmek için giriş yap");
    if (!profile || user.id === profile.id || followLoading) return;
    const wasFollowing = following;
    setFollowing(!wasFollowing);
    setFollowLoading(true);
    try {
      if (wasFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: profile.id });
        if (error) throw error;
        toast.success(`${profile.display_name} takip ediliyor`);
      }
      queryClient.invalidateQueries({ queryKey: ["profile-stats", profile.id] });
    } catch (e) {
      setFollowing(wasFollowing);
      toast.error((e as Error).message ?? "İşlem başarısız");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <AppLayout>
      {!profile ? (
        <p className="text-muted-foreground">Profil bulunamadı.</p>
      ) : (
        <>
          <div className="h-32 rounded-2xl bg-gradient-to-br from-primary/30 via-accent to-primary/10" />
          <div className="-mt-12 flex flex-col sm:flex-row sm:items-end gap-4 px-2">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-card border-4 border-background text-4xl shadow">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.display_name} className="h-full w-full object-cover" />
              ) : (
                profile.avatar_emoji ?? "🧵"
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold">{profile.display_name}</h1>
              <p className="text-sm text-muted-foreground">@{profile.username} {profile.city && `· ${profile.city}`}</p>
              {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
            </div>
            {user && user.id === profile.id && (
              <Button onClick={() => setEditOpen(true)} variant="outline" className="rounded-full">
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Profili Düzenle
              </Button>
            )}
            {user && user.id !== profile.id && (
              <Button
                onClick={toggleFollow}
                disabled={followLoading}
                variant={following ? "outline" : "default"}
                className="rounded-full"
              >
                {following ? "Takiptesin" : "Takip Et"}
              </Button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 px-2 sm:max-w-md">
            <StatBox label="Üretim" value={stats?.uretim ?? 0} />
            <StatBox label="Takipçi" value={stats?.followers ?? 0} />
            <StatBox label="Çözüm" value={stats?.solved ?? 0} />
          </div>

          <Tabs defaultValue="uretim" className="mt-8">
            <TabsList className="w-full justify-start gap-1 rounded-full bg-muted/50 p-1">
              <TabsTrigger value="uretim" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Üretimler
                <span className="ml-1.5 text-[10px] text-muted-foreground">{stats?.uretim ?? 0}</span>
              </TabsTrigger>
              {user && user.id === profile.id && (
                <TabsTrigger value="kaydedilen" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow">
                  <Bookmark className="mr-1.5 h-3.5 w-3.5" /> Kaydedilenler
                </TabsTrigger>
              )}
              <TabsTrigger value="atolye" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow">
                <Wrench className="mr-1.5 h-3.5 w-3.5" /> Atölye
                <span className="ml-1.5 text-[10px] text-muted-foreground">{stats?.atolye ?? 0}</span>
              </TabsTrigger>
              <TabsTrigger value="istatistik" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow">
                <BarChart3 className="mr-1.5 h-3.5 w-3.5" /> İstatistik
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uretim" className="mt-5">
              <FeedList filter="uretim" authorId={profile.id} />
            </TabsContent>
            {user && user.id === profile.id && (
              <TabsContent value="kaydedilen" className="mt-5">
                <FeedList savedByUser />
              </TabsContent>
            )}
            <TabsContent value="atolye" className="mt-5">
              <FeedList filter="atolye" authorId={profile.id} />
            </TabsContent>
            <TabsContent value="istatistik" className="mt-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatBox label="Toplam Paylaşım" value={stats?.total ?? 0} />
                <StatBox label="Üretim" value={stats?.uretim ?? 0} />
                <StatBox label="Atölye" value={stats?.atolye ?? 0} />
                <StatBox label="Öneri" value={stats?.oneri ?? 0} />
                <StatBox label="Blog" value={stats?.blog ?? 0} />
                <StatBox label="Çözülen Sorun" value={stats?.solved ?? 0} />
                <StatBox label="Takipçi" value={stats?.followers ?? 0} />
                <StatBox label="Takip" value={stats?.following ?? 0} />
              </div>
            </TabsContent>
          </Tabs>
          <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
        </>
      )}
    </AppLayout>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="font-serif text-2xl font-bold">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { FeedList } from "@/components/feed/FeedList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profil/$username")({ component: Profile });

function Profile() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);

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

  const toggleFollow = async () => {
    if (!user || !profile) return toast.error("Giriş yap");
    if (following) {
      setFollowing(false);
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", profile.id);
    } else {
      setFollowing(true);
      await supabase.from("follows").insert({ follower_id: user.id, following_id: profile.id });
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
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card border-4 border-background text-4xl shadow">
              {profile.avatar_emoji ?? "🧵"}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold">{profile.display_name}</h1>
              <p className="text-sm text-muted-foreground">@{profile.username} {profile.city && `· ${profile.city}`}</p>
              {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
            </div>
            {user && user.id !== profile.id && (
              <Button onClick={toggleFollow} variant={following ? "outline" : "default"} className="rounded-full">
                {following ? "Takiptesin" : "Takip Et"}
              </Button>
            )}
          </div>
          <div className="mt-8">
            <h2 className="font-serif text-lg font-semibold mb-4">Paylaşımlar</h2>
            <FeedList authorId={profile.id} />
          </div>
        </>
      )}
    </AppLayout>
  );
}

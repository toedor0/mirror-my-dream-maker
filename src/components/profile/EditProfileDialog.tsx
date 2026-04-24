import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya 5MB'dan büyük olamaz");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Sadece görsel yükleyebilirsiniz");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      toast.success("Görsel yüklendi, kaydetmeyi unutma");
    } catch (err: any) {
      toast.error(err.message ?? "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || profile?.display_name || "Kullanıcı",
        bio: bio.trim() || null,
        city: city.trim() || null,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profil güncellendi");
    onOpenChange(false);
  };

  const initials = (displayName || profile?.username || "?").slice(0, 2).toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Profili Düzenle</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <Avatar className="h-24 w-24 border-4 border-background shadow">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
            ) : null}
            <AvatarFallback className="text-2xl">
              {profile?.avatar_emoji ?? initials}
            </AvatarFallback>
          </Avatar>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="rounded-full"
          >
            {uploading ? (
              <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Yükleniyor...</>
            ) : (
              <><Upload className="mr-2 h-3.5 w-3.5" /> Görsel Yükle</>
            )}
          </Button>
          {avatarUrl && (
            <button
              type="button"
              onClick={() => setAvatarUrl(null)}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Görseli kaldır
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="display_name">Ad Soyad</Label>
            <Input
              id="display_name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={60}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">Şehir</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength={60}
              placeholder="İstanbul"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Hakkımda</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={240}
              rows={3}
              placeholder="Kendinden kısaca bahset..."
            />
            <p className="text-right text-[11px] text-muted-foreground">{bio.length}/240</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving ? <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Kaydediliyor</> : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
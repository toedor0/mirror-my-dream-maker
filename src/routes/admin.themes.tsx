import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/themes")({ component: AdminThemes });

interface Theme {
  id: string;
  title: string;
  description: string | null;
  hashtag: string;
  image_url: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

function AdminThemes() {
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const { data: themes = [] } = useQuery({
    queryKey: ["admin-themes"],
    queryFn: async (): Promise<Theme[]> => {
      const { data } = await supabase.from("weekly_themes").select("*").order("starts_at", { ascending: false });
      return (data ?? []) as Theme[];
    },
  });

  const [draft, setDraft] = useState({
    title: "", description: "", hashtag: "", image_url: "",
    starts_at: today, ends_at: nextWeek,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-themes"] });

  const create = async () => {
    if (!draft.title || !draft.hashtag) return toast.error("Başlık ve hashtag zorunlu");
    const tag = draft.hashtag.startsWith("#") ? draft.hashtag : `#${draft.hashtag}`;
    const { error } = await supabase.from("weekly_themes").insert({ ...draft, hashtag: tag, is_active: true });
    if (error) return toast.error(error.message);
    setDraft({ title: "", description: "", hashtag: "", image_url: "", starts_at: today, ends_at: nextWeek });
    toast.success("Tema eklendi");
    refresh();
  };

  const toggle = async (id: string, active: boolean) => {
    const { error } = await supabase.from("weekly_themes").update({ is_active: !active }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Bu temayı silmek istiyor musun?")) return;
    const { error } = await supabase.from("weekly_themes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Silindi");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg font-bold">Yeni Haftalık Tema</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input placeholder="Tema başlığı" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <Input placeholder="#hashtag" value={draft.hashtag} onChange={(e) => setDraft({ ...draft, hashtag: e.target.value })} />
          <Input type="date" value={draft.starts_at} onChange={(e) => setDraft({ ...draft, starts_at: e.target.value })} />
          <Input type="date" value={draft.ends_at} onChange={(e) => setDraft({ ...draft, ends_at: e.target.value })} />
          <Input placeholder="Görsel URL (opsiyonel)" value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} className="sm:col-span-2" />
          <Textarea placeholder="Açıklama" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="sm:col-span-2" rows={2} />
        </div>
        <Button onClick={create} className="mt-3 rounded-full"><Plus className="mr-1 h-4 w-4" /> Tema Ekle</Button>
      </div>

      <div className="space-y-3">
        {themes.map((t) => (
          <div key={t.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
            {t.image_url && <img src={t.image_url} alt={t.title} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold">{t.title}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{t.hashtag}</span>
              </div>
              {t.description && <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>}
              <p className="mt-1 text-[11px] text-muted-foreground">{t.starts_at} → {t.ends_at}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Switch checked={t.is_active} onCheckedChange={() => toggle(t.id, t.is_active)} />
                <span className="text-xs text-muted-foreground">{t.is_active ? "Aktif" : "Pasif"}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(t.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {themes.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Henüz tema eklenmedi.</p>
        )}
      </div>
    </div>
  );
}

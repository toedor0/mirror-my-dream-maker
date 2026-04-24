import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

function AdminCategories() {
  const qc = useQueryClient();
  const { data: cats = [] } = useCategories();
  const [draft, setDraft] = useState({ slug: "", label: "", emoji: "✨", color: "oklch(0.7 0.12 60)" });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["category-counts"] });
  };

  const create = async () => {
    if (!draft.slug || !draft.label) return toast.error("Slug ve label zorunlu");
    const sort_order = (cats[cats.length - 1]?.sort_order ?? 0) + 1;
    const { error } = await supabase.from("categories").insert({ ...draft, sort_order });
    if (error) return toast.error(error.message);
    setDraft({ slug: "", label: "", emoji: "✨", color: "oklch(0.7 0.12 60)" });
    toast.success("Kategori eklendi");
    refresh();
  };

  const update = async (id: string, patch: Partial<{ label: string; emoji: string; color: string; sort_order: number }>) => {
    const { error } = await supabase.from("categories").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Güncellendi");
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istiyor musun? Mevcut paylaşımlardaki etiket sıfırlanacak.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Silindi");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg font-bold">Yeni Kategori</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-5">
          <Input placeholder="slug (ör: orgu)" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
          <Input placeholder="Görünen ad" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          <Input placeholder="Emoji" value={draft.emoji} onChange={(e) => setDraft({ ...draft, emoji: e.target.value })} maxLength={4} />
          <Input placeholder="Renk (oklch)" value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} />
          <Button onClick={create} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> Ekle</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Önizleme</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Ad</th>
              <th className="px-4 py-3 text-left">Emoji</th>
              <th className="px-4 py-3 text-left">Renk</th>
              <th className="px-4 py-3 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cats.map((c) => (
              <CatRow key={c.id} cat={c} onSave={(patch) => update(c.id, patch)} onDelete={() => remove(c.id)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CatRow({ cat, onSave, onDelete }: { cat: { id: string; slug: string; label: string; emoji: string; color: string }; onSave: (p: Partial<{ label: string; emoji: string; color: string }>) => void; onDelete: () => void }) {
  const [label, setLabel] = useState(cat.label);
  const [emoji, setEmoji] = useState(cat.emoji);
  const [color, setColor] = useState(cat.color);
  const dirty = label !== cat.label || emoji !== cat.emoji || color !== cat.color;

  return (
    <tr>
      <td className="px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md text-base" style={{ backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)` }}>{emoji}</span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{cat.slug}</td>
      <td className="px-4 py-3"><Input value={label} onChange={(e) => setLabel(e.target.value)} className="h-8" /></td>
      <td className="px-4 py-3"><Input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="h-8 w-16" maxLength={4} /></td>
      <td className="px-4 py-3"><Input value={color} onChange={(e) => setColor(e.target.value)} className="h-8 font-mono text-xs" /></td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          {dirty && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onSave({ label, emoji, color })} title="Kaydet">
              <Save className="h-4 w-4 text-primary" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete} title="Sil">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

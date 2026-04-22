import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, parseHashtags } from "@/lib/post-helpers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X, Star } from "lucide-react";

type PostType = "uretim" | "atolye" | "oneri" | "blog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [type, setType] = useState<PostType>("uretim");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [emoji, setEmoji] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [brandName, setBrandName] = useState("");
  const [brandCategory, setBrandCategory] = useState("");
  const [brandRating, setBrandRating] = useState(5);
  const [brandPriceLabel, setBrandPriceLabel] = useState("");
  const [brandUsageMonths, setBrandUsageMonths] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setTitle(""); setContent(""); setCategory(""); setEmoji("");
    setImageFile(null); setImagePreview("");
    setBrandName(""); setBrandCategory(""); setBrandRating(5);
    setBrandPriceLabel(""); setBrandUsageMonths("");
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error("Görsel 5MB'dan büyük olamaz");
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!user) return;
    if (!title.trim()) return toast.error("Başlık gerekli");
    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("post-images").upload(path, imageFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const insert = {
        author_id: user.id,
        type,
        title: title.trim(),
        content: content.trim() || null,
        category: category || null,
        hashtags: parseHashtags(`${title} ${content}`),
        image_url: imageUrl,
        emoji: emoji || null,
        atolye_status: type === "atolye" ? ("bekliyor" as const) : null,
        brand_name: type === "oneri" ? (brandName.trim() || null) : null,
        brand_category: type === "oneri" ? (brandCategory.trim() || null) : null,
        brand_rating: type === "oneri" ? brandRating : null,
        brand_price_label: type === "oneri" ? (brandPriceLabel.trim() || null) : null,
        brand_usage_months: type === "oneri" && brandUsageMonths ? parseInt(brandUsageMonths, 10) : null,
      };

      const { error } = await supabase.from("posts").insert(insert);
      if (error) throw error;
      toast.success("Paylaşıldı! 🎉");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Yeni Paylaşım</DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as PostType)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="uretim">🎨 Üretim</TabsTrigger>
            <TabsTrigger value="atolye">🔧 Atölye</TabsTrigger>
            <TabsTrigger value="oneri">⭐ Öneri</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>{type === "atolye" ? "Sorununu özetle" : "Başlık"}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder={
              type === "uretim" ? "Bahar şal projem"
              : type === "atolye" ? "İlmek atlamış görünüyor, yardım?"
              : "Bu yünü öneririm!"
            } />
          </div>

          <div className="space-y-1.5">
            <Label>{type === "atolye" ? "Detaylı açıkla" : "Açıklama"}</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={1500} rows={4} placeholder="#hashtag yazabilirsin..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Seç..." /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Emoji (görsel yoksa)</Label>
              <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} placeholder="🧶" />
            </div>
          </div>

          {type === "oneri" && (
            <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3">
              <p className="text-sm font-medium">Ürün Bilgileri</p>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Marka adı" value={brandName} onChange={(e) => setBrandName(e.target.value)} maxLength={80} />
                <Input placeholder="Ürün kategorisi" value={brandCategory} onChange={(e) => setBrandCategory(e.target.value)} maxLength={60} />
                <Input placeholder="Fiyat etiketi (Uygun, Premium...)" value={brandPriceLabel} onChange={(e) => setBrandPriceLabel(e.target.value)} maxLength={40} />
                <Input type="number" placeholder="Kaç aydır kullanıyor" value={brandUsageMonths} onChange={(e) => setBrandUsageMonths(e.target.value)} min={0} max={240} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm mr-2">Puan:</span>
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setBrandRating(n)}>
                    <Star className={`h-5 w-5 ${n <= brandRating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Görsel</Label>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="" className="rounded-xl max-h-60 w-full object-cover" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(""); }}
                  className="absolute top-2 right-2 rounded-full bg-background/90 p-1.5 shadow"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground hover:bg-muted/60 transition">
                <ImagePlus className="h-5 w-5" />
                Görsel ekle (max 5MB)
                <input type="file" accept="image/*" className="sr-only" onChange={onFile} />
              </label>
            )}
          </div>

          <Button onClick={submit} disabled={loading} className="w-full rounded-full">
            {loading ? "Paylaşılıyor..." : "Paylaş"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
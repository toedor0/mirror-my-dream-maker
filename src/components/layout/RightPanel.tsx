import { Flame, Calendar, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const monthThemes: Record<number, { tag: string; title: string; desc: string; img: string }> = {
  0: { tag: "#KışModu", title: "Kış Modu", desc: "Kalın yün ve sıcak renkler", img: "https://images.unsplash.com/photo-1599933310642-8f07bdea2991?w=600&q=80" },
  1: { tag: "#SevgiDikişi", title: "Sevgi Dikişi", desc: "Sevdiklerine bir el emeği", img: "https://images.unsplash.com/photo-1612538498488-3c4dca5cb12d?w=600&q=80" },
  2: { tag: "#BaharÇiçekleri", title: "Bahar Çiçekleri Koleksiyonu", desc: "Bu hafta bahar temalı projelerinizi #BaharÇiçekleri etiketi ile paylaşın", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  3: { tag: "#NisanYağmuru", title: "Nisan Yağmuru", desc: "Yağmurlu günler için renkli işler", img: "https://images.unsplash.com/photo-1515895850162-7ca5ac08889e?w=600&q=80" },
  4: { tag: "#MayısBahçesi", title: "Mayıs Bahçesi", desc: "Yeşil ve canlı tonlarla", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  5: { tag: "#YazRüzgarı", title: "Yaz Rüzgarı", desc: "Hafif keten, deniz tonları", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80" },
};

export function RightPanel() {
  const month = new Date().getMonth();
  const theme = monthThemes[month] ?? monthThemes[2];

  const { data: trends = [] } = useQuery({
    queryKey: ["trend-tags"],
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("hashtags, created_at")
        .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
      const counts = new Map<string, number>();
      (data ?? []).forEach((p) => {
        (p.hashtags ?? []).forEach((tag: string) => {
          const t = tag.startsWith("#") ? tag : `#${tag}`;
          counts.set(t, (counts.get(t) ?? 0) + 1);
        });
      });
      return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([tag, count]) => ({ tag, count }));
    },
  });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold">
          <Flame className="h-4 w-4 text-primary" /> Trend Konular
        </h3>
        <div className="mt-3 space-y-2.5">
          {trends.length === 0 ? (
            <p className="text-xs text-muted-foreground">Henüz trend yok.</p>
          ) : (
            trends.map((t) => (
              <div key={t.tag} className="flex items-center justify-between text-sm">
                <span className="font-medium text-primary cursor-pointer hover:underline">{t.tag}</span>
                <span className="text-[10px] text-muted-foreground">{t.count} bu hafta</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold">
          <Calendar className="h-4 w-4 text-primary" /> Bu Haftanın Teması
        </h3>
        <div className="mt-3 aspect-video overflow-hidden rounded-xl bg-accent/40">
          <img src={theme.img} alt={theme.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <p className="mt-3 font-serif text-sm font-bold leading-snug">{theme.title}</p>
        <p className="mt-1 text-xs text-muted-foreground leading-snug">{theme.desc}</p>
        <Button size="sm" className="mt-3 w-full rounded-full">Katıl</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold">
          <Sparkles className="h-4 w-4 text-primary" /> Bu platform farklı
        </h3>
        <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
          <li>• Projelerini ve çözümlerini arşivle</li>
          <li>• Malzeme veritabanı ile hangi ipliği kullandığını unutma</li>
          <li>• Atölye sorunlarına gerçek çözümler bulun</li>
          <li>• Deneyimli kullanıcılardan öneriler</li>
          <li>• Tüm araçlar bir arada, tek platform</li>
        </ul>
      </div>
    </div>
  );
}

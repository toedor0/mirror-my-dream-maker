import { Flame, Calendar, Sparkles, Users } from "lucide-react";

const trendTopics = [
  { tag: "#örgü", count: 234 },
  { tag: "#dikiş", count: 189 },
  { tag: "#nakış", count: 156 },
  { tag: "#makrome", count: 145 },
  { tag: "#amigurumi", count: 87 },
];

const monthThemes: Record<number, { tag: string; title: string; desc: string; img: string }> = {
  0: { tag: "#KışModu", title: "Kış Modu", desc: "Kalın yün ve sıcak renkler", img: "https://images.unsplash.com/photo-1599933310642-8f07bdea2991?w=600&q=80" },
  1: { tag: "#SevgiDikişi", title: "Sevgi Dikişi", desc: "Sevdiklerine bir el emeği", img: "https://images.unsplash.com/photo-1612538498488-3c4dca5cb12d?w=600&q=80" },
  2: { tag: "#BaharModu", title: "Bahar Çiçekleri", desc: "Bu hafta bahar temalı projelerinizi paylaşın", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  3: { tag: "#NisanYağmuru", title: "Nisan Yağmuru", desc: "Yağmurlu günler için renkli işler", img: "https://images.unsplash.com/photo-1515895850162-7ca5ac08889e?w=600&q=80" },
};

export function RightPanel() {
  const month = new Date().getMonth();
  const theme = monthThemes[month] ?? monthThemes[2];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold">
          <Flame className="h-4 w-4 text-primary" /> Trend Konular
        </h3>
        <div className="mt-3 space-y-2.5">
          {trendTopics.map((t) => (
            <div key={t.tag} className="flex items-center justify-between text-sm">
              <span className="font-medium text-primary cursor-pointer hover:underline">{t.tag}</span>
              <span className="text-xs text-muted-foreground">+{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold">
          <Calendar className="h-4 w-4 text-primary" /> Ayın Teması
        </h3>
        <div className="mt-3 aspect-video overflow-hidden rounded-xl bg-accent/40">
          <img src={theme.img} alt={theme.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <p className="mt-3 font-serif text-base font-semibold">{theme.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{theme.desc}</p>
        <span className="mt-2 inline-block text-xs font-medium text-primary">{theme.tag}</span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold">
          <Sparkles className="h-4 w-4 text-primary" /> Bu platform farklı
        </h3>
        <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          <li>• Projelerini ve çözümlerini arşivle</li>
          <li>• Malzeme veritabanı ile ipliklerini hatırla</li>
          <li>• Atölye sorunlarına çözüm bul</li>
          <li>• Deneyimli kullanıcılardan öneriler</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold">
          <Users className="h-4 w-4 text-primary" /> Şu Anda Aktif
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {["🧑‍🎨", "👩‍🦰", "👨", "👩"].map((e, i) => (
              <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-accent text-sm">
                {e}
              </div>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">+42 kişi</span>
        </div>
      </div>
    </div>
  );
}
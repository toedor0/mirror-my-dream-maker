import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Home, Monitor, Package, Wrench, Star, BookOpen, Bookmark,
  Flame, Calendar, Sparkles, Users, Moon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const navItems = [
  { icon: Home, label: "Akış", count: 234, active: true },
  { icon: Monitor, label: "Proje Kütüphanem", count: 23 },
  { icon: Package, label: "Malzeme Veritabanım", count: 1240 },
  { icon: Wrench, label: "Atölye Masası", count: 45 },
  { icon: Star, label: "Ürün Rehberi", count: 892 },
  { icon: BookOpen, label: "Blog", count: 34 },
  { icon: Bookmark, label: "Kaydettiklerim", count: 12 },
];

const categories = [
  { emoji: "🧶", label: "Örgü & Tığ", count: 234 },
  { emoji: "🧵", label: "Dikiş & Nakış", count: 189 },
  { emoji: "🪢", label: "Makrome", count: 156 },
  { emoji: "🎨", label: "Diğer El İşleri", count: 98 },
  { emoji: "🪡", label: "Kanaviçe", count: 76 },
  { emoji: "🧸", label: "Amigurumi", count: 112 },
];

const trendTopics = [
  { tag: "#örgü", count: 234 },
  { tag: "#dikiş", count: 189 },
  { tag: "#nakış", count: 156 },
  { tag: "#makrome", count: 145 },
  { tag: "#ahşap", count: 98 },
  { tag: "#amigurumi", count: 87 },
];

const tabs = ["Tümü", "Üretimler", "Atölye", "Öneriler", "Blog"];

function Index() {
  const [activeTab, setActiveTab] = useState("Tümü");
  const [feedView, setFeedView] = useState<"Herkes" | "Takip Ettiklerim">("Herkes");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-serif text-sm font-bold text-primary-foreground">
              ÇD
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">Çift Dikiş</span>
          </div>

          <div className="relative flex-1 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Proje, malzeme, üye veya çözüm ara..."
              className="w-full rounded-full border border-border bg-input/50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-foreground hover:text-primary transition">
              Giriş Yap
            </button>
            <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              Kaydol
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition">
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[260px_1fr_320px]">
        {/* Left Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-accent/40 p-5">
            <p className="text-sm font-medium">Kaydet, paylaş ve topluluğa katıl</p>
            <button className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              Ücretsiz Kaydol →
            </button>
          </div>

          <div>
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigasyon
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                      item.active
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-primary" />
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.count}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kategoriler
            </p>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-muted transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base">{cat.emoji}</span>
                    {cat.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Feed */}
        <main>
          <h1 className="font-serif text-4xl font-bold tracking-tight">Akışınız</h1>
          <p className="mt-1 text-sm text-muted-foreground">Topluluğunuzdan en son paylaşımlar</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 inline-flex rounded-full bg-muted p-1">
            {(["Herkes", "Takip Ettiklerim"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFeedView(v)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  feedView === v ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-serif text-2xl font-semibold">Henüz içerik yok</p>
            <p className="mt-2 text-sm text-muted-foreground">İlk paylaşımı sen yap!</p>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold">
              <Flame className="h-5 w-5 text-primary" /> Trend Konular
            </h3>
            <div className="mt-4 space-y-3">
              {trendTopics.map((t) => (
                <div key={t.tag} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-primary hover:underline cursor-pointer">{t.tag}</span>
                  <span className="text-xs text-muted-foreground">+{t.count} bu hafta</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold">
              <Calendar className="h-5 w-5 text-primary" /> Bu Haftanın Teması
            </h3>
            <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-accent/40">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                alt="Bahar Çiçekleri"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-3 font-serif text-lg font-semibold">Bahar Çiçekleri Koleksiyonu</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Bu hafta bahar temalı projelerinizi #bahar2026 etiketiyle paylaşın!
            </p>
            <button className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              Katıl
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold">
              <Sparkles className="h-5 w-5 text-primary" /> Bu platform farklı
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Projelerinizi ve çözümlerinizi arşivleyin</li>
              <li>• Malzeme veritabanıyla hangi ipliği kullandığınızı unutmayın</li>
              <li>• Atölye sorunlarına gerçek çözümler bulun</li>
              <li>• Deneyimli kullanıcılardan öneriler alın</li>
              <li>• Tüm projelerinizi tek platformda toplayın</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold">
              <Users className="h-5 w-5 text-primary" /> Şu Anda Aktif
            </h3>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🧑‍🎨", "👩‍🦰", "👨", "👩"].map((e, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-accent text-sm"
                  >
                    {e}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">+42 kişi</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

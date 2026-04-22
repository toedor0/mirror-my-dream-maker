import { ReactNode, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Search, Home, Compass, Bell, User, Bookmark, Wrench, Sparkles,
  Moon, Sun, Plus, LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import { RightPanel } from "@/components/layout/RightPanel";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { to: "/", label: "Akış", icon: Home, exact: true },
  { to: "/kesfet", label: "Keşfet", icon: Compass },
  { to: "/atolye", label: "Atölye", icon: Wrench },
  { to: "/bildirimler", label: "Bildirimler", icon: Bell, requiresAuth: true },
  { to: "/kaydedilenler", label: "Kaydedilenler", icon: Bookmark, requiresAuth: true },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top header - mobile/condensed search */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 lg:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-serif text-sm font-bold text-primary-foreground">
              ÇD
            </div>
            <span className="font-serif text-xl font-bold tracking-tight hidden sm:inline">Çift Dikiş</span>
          </Link>

          <div className="relative flex-1 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Proje, malzeme, üye veya çözüm ara..."
              className="w-full rounded-full border border-border bg-input/40 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggle}
              className="rounded-full"
              aria-label="Tema değiştir"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <>
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="rounded-full gap-1.5"
                  size="sm"
                >
                  <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Paylaş</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-lg hover:opacity-80 transition">
                      {profile?.avatar_emoji ?? "🧵"}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profil/$username" params={{ username: profile?.username ?? "" }}>
                        <User className="mr-2 h-4 w-4" /> Profilim
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" /> Çıkış
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
                  Giriş
                </Button>
                <Button size="sm" className="rounded-full" onClick={() => setAuthOpen(true)}>
                  Kaydol
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 lg:px-6 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        {/* Left navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, "exact" in item ? item.exact : false);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition ${
                    active ? "bg-accent font-semibold text-accent-foreground" : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 text-primary" /> {item.label}
                </Link>
              );
            })}

            {!user && (
              <div className="mt-6 rounded-2xl bg-accent/40 p-4">
                <p className="text-sm font-medium leading-snug">
                  Kaydet, paylaş ve topluluğa katıl.
                </p>
                <Button onClick={() => setAuthOpen(true)} className="mt-3 w-full rounded-full" size="sm">
                  Ücretsiz Kaydol →
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Main column */}
        <main className="min-w-0">{children}</main>

        {/* Right panel */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <RightPanel />
          </div>
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-background/95 backdrop-blur lg:hidden">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to, "exact" in item ? item.exact : false);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs ${
                active ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      {user && <CreatePostDialog open={createOpen} onOpenChange={setCreateOpen} />}
    </div>
  );
}
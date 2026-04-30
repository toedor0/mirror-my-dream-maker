import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Search, Bell, User, Moon, Sun, Plus, LogOut, Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type CreatePreset = "uretim" | "atolye" | "oneri" | "blog";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<CreatePreset>("uretim");
  const navigate = useNavigate();
  const location = useLocation();
  const initialQ = location.pathname === "/ara" ? (location.search as { q?: string }).q ?? "" : "";
  const [searchText, setSearchText] = useState(initialQ);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchText.trim();
    if (!q) return;
    navigate({ to: "/ara", search: { q } });
  };

  const openCreate = (preset: CreatePreset = "uretim") => {
    if (!user) return setAuthOpen(true);
    setCreateType(preset);
    setCreateOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="flex h-16 w-full items-center gap-4 px-4 lg:px-8 xl:px-12">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-serif text-sm font-bold text-primary-foreground">
              ÇD
            </div>
            <span className="font-serif text-xl font-bold tracking-tight hidden sm:inline">
              Çift Dikiş
            </span>
          </Link>

          <form onSubmit={submitSearch} className="relative flex-1 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Ara: kelime, @kullanıcı veya #etiket"
              className="w-full rounded-full border border-border bg-input/40 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background"
            />
          </form>

          <div className="flex items-center gap-1.5">
            {user && (
              <Button onClick={() => openCreate("uretim")} className="rounded-full gap-1.5" size="sm">
                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Paylaş</span>
              </Button>
            )}
            {user && (
              <Link
                to="/bildirimler"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition"
                aria-label="Bildirimler"
              >
                <Bell className="h-4 w-4 text-primary" />
              </Link>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={toggle}
              className="rounded-full h-9 w-9"
              aria-label="Tema değiştir"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-lg hover:opacity-80 transition">
                    {profile.avatar_emoji ?? "🧵"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profil/$username" params={{ username: profile.username }}>
                      <User className="mr-2 h-4 w-4" /> Profilim
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/kaydedilenler">
                      <Bookmark className="mr-2 h-4 w-4" /> Kaydettiklerim
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Çıkış
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

      <div className="grid w-full gap-6 px-4 py-6 lg:px-8 xl:px-12 lg:grid-cols-[280px_minmax(0,1fr)_320px] xl:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
            <LeftSidebar onAuthOpen={() => setAuthOpen(true)} />
          </div>
        </aside>

        <main className="min-w-0 mx-auto w-full max-w-3xl">
          {/* Provide context for child via React context-free prop drilling */}
          <AppLayoutContext.Provider value={{ openCreate, openAuth: () => setAuthOpen(true) }}>
            {children}
          </AppLayoutContext.Provider>
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
            <RightPanel />
          </div>
        </aside>
      </div>

      <footer className="mt-8 border-t border-border/60 bg-muted/20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row lg:px-8 xl:px-12">
          <p>© {new Date().getFullYear()} Çift Dikiş — El işi topluluğu</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/gizlilik" className="hover:text-foreground transition">
              Gizlilik Politikası
            </Link>
            <Link to="/kvkk" className="hover:text-foreground transition">
              KVKK Aydınlatma
            </Link>
            <Link to="/cerez" className="hover:text-foreground transition">
              Çerez Politikası
            </Link>
          </nav>
        </div>
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      {user && (
        <CreatePostDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          defaultType={createType}
        />
      )}
    </div>
  );
}

import { createContext, useContext } from "react";

interface Ctx {
  openCreate: (preset?: CreatePreset) => void;
  openAuth: () => void;
}

const AppLayoutContext = createContext<Ctx>({ openCreate: () => {}, openAuth: () => {} });
export const useAppLayout = () => useContext(AppLayoutContext);

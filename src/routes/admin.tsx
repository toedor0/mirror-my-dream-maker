import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, Users, Tag, Calendar, ShieldAlert, Lock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { isPinVerified, clearPinVerified } from "@/lib/admin-pin";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const tabs = [
  { to: "/admin", label: "Özet", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts", label: "İçerikler", icon: FileText },
  { to: "/admin/users", label: "Kullanıcılar", icon: Users },
  { to: "/admin/categories", label: "Kategoriler", icon: Tag },
  { to: "/admin/themes", label: "Temalar", icon: Calendar },
];

function AdminLayout() {
  const { user, loading } = useAuth();
  const { isMod, loading: rl } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const isPinRoute = location.pathname === "/admin/giris";
  const [pinOk, setPinOk] = useState<boolean>(() => isPinVerified());

  useEffect(() => {
    if (!loading && !rl && user && isMod && !isPinRoute && !isPinVerified()) {
      navigate({ to: "/admin/giris", search: { redirect: location.pathname } });
    }
  }, [loading, rl, user, isMod, isPinRoute, navigate, location.pathname]);

  useEffect(() => {
    const sync = () => setPinOk(isPinVerified());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (loading || rl) {
    return <AppLayout><div className="h-32 animate-pulse rounded-2xl bg-muted/40" /></AppLayout>;
  }

  if (!user || !isMod) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-serif text-2xl font-bold">Erişim engellendi</h1>
          <p className="mt-2 text-sm text-muted-foreground">Bu sayfa sadece admin ve moderatörler içindir.</p>
        </div>
      </AppLayout>
    );
  }

  if (isPinRoute) {
    return <Outlet />;
  }

  if (!pinOk) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-serif text-2xl font-bold">PIN gerekli</h1>
          <p className="mt-2 text-sm text-muted-foreground">Yönetim paneline girmek için PIN kodunu doğrulaman gerekiyor.</p>
          <Button onClick={() => navigate({ to: "/admin/giris" })} className="mt-4 rounded-full">
            PIN Gir
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Yönetim Paneli</h1>
          <p className="mt-1 text-sm text-muted-foreground">Topluluk yönetimi ve içerik moderasyonu</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Admin</div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-full text-xs"
            onClick={() => {
              clearPinVerified();
              setPinOk(false);
              navigate({ to: "/admin/giris" });
            }}
          >
            <LogOut className="h-3.5 w-3.5" /> Kilitle
          </Button>
        </div>
      </div>

      <nav className="mb-6 flex gap-1 overflow-x-auto rounded-full bg-muted/50 p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                active ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </Link>
          );
        })}
      </nav>

      <Outlet />
    </AppLayout>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldAlert, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { hashPin, generateSalt, markPinVerified, isPinVerified } from "@/lib/admin-pin";

export const Route = createFileRoute("/admin/giris")({ component: AdminLogin });

function AdminLogin() {
  const { user, loading } = useAuth();
  const { isMod, loading: rl } = useRole();
  const navigate = useNavigate();

  const [pinExists, setPinExists] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || !isMod) return;
    (async () => {
      const { data } = await supabase
        .from("admin_pin_settings")
        .select("id")
        .maybeSingle();
      setPinExists(!!data);
    })();
  }, [user, isMod]);

  useEffect(() => {
    if (isPinVerified() && user && isMod) {
      navigate({ to: "/admin" });
    }
  }, [user, isMod, navigate]);

  if (loading || rl) {
    return <AppLayout><div className="h-32 animate-pulse rounded-2xl bg-muted/40" /></AppLayout>;
  }

  if (!user || !isMod) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border p-12 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-serif text-2xl font-bold">Erişim engellendi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Admin paneline girmek için önce admin hesabınla giriş yapmalısın.
          </p>
        </div>
      </AppLayout>
    );
  }

  const setupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return toast.error("PIN en az 4 karakter olmalı");
    if (pin !== pin2) return toast.error("PIN'ler eşleşmiyor");
    setBusy(true);
    try {
      const salt = generateSalt();
      const pin_hash = await hashPin(pin, salt);
      const { error } = await supabase
        .from("admin_pin_settings")
        .insert({ id: true, pin_hash, salt, set_by: user.id });
      if (error) throw error;
      markPinVerified();
      toast.success("PIN belirlendi ve doğrulandı");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "PIN kaydedilemedi");
    } finally {
      setBusy(false);
    }
  };

  const verifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase
        .from("admin_pin_settings")
        .select("pin_hash, salt")
        .eq("id", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("PIN bulunamadı");
      const hashed = await hashPin(pin, data.salt);
      if (hashed !== data.pin_hash) {
        toast.error("Hatalı PIN");
        setPin("");
        return;
      }
      markPinVerified();
      toast.success("Doğrulandı");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Doğrulama başarısız");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            {pinExists ? <Lock className="h-6 w-6 text-primary" /> : <KeyRound className="h-6 w-6 text-primary" />}
          </div>
          <h1 className="mt-5 text-center font-serif text-2xl font-bold">
            {pinExists === null ? "Yükleniyor..." : pinExists ? "Admin PIN" : "Admin PIN belirle"}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {pinExists
              ? "Yönetim paneline girmek için PIN kodunu gir."
              : "İlk girişte bir PIN kodu belirle. Bundan sonra panele her girdiğinde bu PIN sorulacak."}
          </p>

          {pinExists === false && (
            <form onSubmit={setupPin} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Yeni PIN (en az 4 karakter)</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  minLength={4}
                />
              </div>
              <div className="space-y-1.5">
                <Label>PIN tekrar</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  value={pin2}
                  onChange={(e) => setPin2(e.target.value)}
                  required
                  minLength={4}
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-full">
                {busy ? "Kaydediliyor..." : "PIN Belirle"}
              </Button>
            </form>
          )}

          {pinExists === true && (
            <form onSubmit={verifyPin} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label>PIN</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={busy || !pin} className="w-full rounded-full">
                {busy ? "Doğrulanıyor..." : "Doğrula"}
              </Button>
            </form>
          )}

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            PIN oturumu yalnızca sekmeni kapatana kadar geçerlidir.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

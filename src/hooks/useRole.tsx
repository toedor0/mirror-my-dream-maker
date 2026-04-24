import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppRole = "admin" | "moderator" | "user";

export function useRole() {
  const { user } = useAuth();
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["user-roles", user?.id],
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    queryFn: async (): Promise<AppRole[]> => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });

  return {
    roles,
    isAdmin: roles.includes("admin"),
    isMod: roles.includes("admin") || roles.includes("moderator"),
    loading: isLoading,
  };
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  slug: string;
  label: string;
  emoji: string;
  color: string;
  sort_order: number;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    staleTime: 1000 * 60 * 60,
    queryFn: async (): Promise<Category[]> => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      return (data ?? []) as Category[];
    },
  });
}

export function useCategoryCounts() {
  return useQuery({
    queryKey: ["category-counts"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("category");
      const map = new Map<string, number>();
      (data ?? []).forEach((p) => {
        if (p.category) map.set(p.category, (map.get(p.category) ?? 0) + 1);
      });
      return map;
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  features: string[];
  price: number;
  turnaround_days: number | null;
  is_popular: boolean | null;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  } | null;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          category:service_categories(id, name, slug, icon)
        `)
        .eq("is_active", true)
        .order("is_popular", { ascending: false });

      if (error) throw error;

      return data.map((service) => ({
        ...service,
        features: Array.isArray(service.features) ? service.features : [],
      })) as Service[];
    },
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
}

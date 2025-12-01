import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Purchase {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  amount_paid: number | null;
  intake_data: Record<string, unknown>;
  ai_draft: string | null;
  due_date: string | null;
  service: {
    id: string;
    name: string;
    slug: string;
  };
}

export function usePurchases() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["purchases", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          service:services(id, name, slug)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Purchase[];
    },
    enabled: !!user,
  });
}

export function useCreateCheckout() {
  const { session } = useAuth();

  return useMutation({
    mutationFn: async ({
      serviceId,
      serviceName,
      price,
    }: {
      serviceId: string;
      serviceName: string;
      price: number;
    }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            serviceId,
            serviceName,
            price,
            successUrl: `${window.location.origin}/dashboard?payment=success`,
            cancelUrl: `${window.location.origin}/services?payment=cancelled`,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout");
      }

      return response.json();
    },
  });
}

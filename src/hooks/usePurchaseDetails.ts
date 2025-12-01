import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ServiceDocument {
  id: string;
  purchase_id: string;
  user_id: string;
  name: string;
  file_path: string | null;
  content: string | null;
  document_type: string;
  version: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseMessage {
  id: string;
  purchase_id: string;
  user_id: string;
  content: string;
  role: string;
  created_at: string;
}

export interface PurchaseWithDetails {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  amount_paid: number | null;
  intake_data: Record<string, any> | null;
  ai_draft: string | null;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    turnaround_days: number | null;
    features: string[] | null;
  } | null;
}

export const usePurchaseDetails = (purchaseId: string) => {
  return useQuery({
    queryKey: ["purchase-details", purchaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          service:services(id, name, description, price, turnaround_days, features)
        `)
        .eq("id", purchaseId)
        .single();

      if (error) throw error;
      return data as PurchaseWithDetails;
    },
    enabled: !!purchaseId,
  });
};

export const useServiceDocuments = (purchaseId: string) => {
  return useQuery({
    queryKey: ["service-documents", purchaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_documents")
        .select("*")
        .eq("purchase_id", purchaseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ServiceDocument[];
    },
    enabled: !!purchaseId,
  });
};

export const usePurchaseMessages = (purchaseId: string) => {
  return useQuery({
    queryKey: ["purchase-messages", purchaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_messages")
        .select("*")
        .eq("purchase_id", purchaseId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as PurchaseMessage[];
    },
    enabled: !!purchaseId,
  });
};

export const useSendPurchaseMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      purchaseId,
      content,
      role = "user",
    }: {
      purchaseId: string;
      content: string;
      role?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("purchase_messages")
        .insert({
          purchase_id: purchaseId,
          user_id: user.id,
          content,
          role,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-messages", variables.purchaseId],
      });
    },
  });
};

type ServiceStatus = "draft" | "intake_pending" | "ai_drafting" | "lawyer_review" | "client_review" | "completed" | "cancelled";

export const useUpdatePurchaseStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      purchaseId,
      status,
    }: {
      purchaseId: string;
      status: ServiceStatus;
    }) => {
      const { data, error } = await supabase
        .from("purchases")
        .update({ status })
        .eq("id", purchaseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-details", variables.purchaseId],
      });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      toast({ title: "Status updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

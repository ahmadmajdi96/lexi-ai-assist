import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// AI Configurations
export const useAIConfigurations = () => {
  return useQuery({
    queryKey: ["ai-configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_configurations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAIConfiguration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from("ai_configurations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-configurations"] });
      toast({ title: "AI Configuration updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating configuration", description: error.message, variant: "destructive" });
    },
  });
};

// Templates
export const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (template: { name: string; category: string; content: string; jurisdiction?: string }) => {
      const { data, error } = await supabase
        .from("templates")
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({ title: "Template created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error creating template", description: error.message, variant: "destructive" });
    },
  });
};

// Jurisdictions
export const useJurisdictions = () => {
  return useQuery({
    queryKey: ["jurisdictions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jurisdictions")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};

// All Users (admin view)
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles separately
      const userIds = profiles?.map((p) => p.id) || [];
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      if (rolesError) throw rolesError;

      // Map roles to profiles
      const roleMap = new Map(roles?.map((r) => [r.user_id, r]) || []);
      
      return profiles?.map((profile) => ({
        ...profile,
        user_roles: roleMap.get(profile.id) ? [roleMap.get(profile.id)] : [],
      }));
    },
  });
};

// All Purchases (admin view)
export const useAllPurchases = () => {
  return useQuery({
    queryKey: ["all-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          service:services(name, price)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately to avoid foreign key issues
      const userIds = [...new Set(data?.map((p: any) => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name")
        .in("id", userIds);
      
      const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
      
      return data?.map((purchase: any) => ({
        ...purchase,
        profile: profileMap.get(purchase.user_id) || null
      }));
    },
  });
};

// Activity Logs
export const useActivityLogs = () => {
  return useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });
};

// System Settings
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*");

      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data, error } = await supabase
        .from("system_settings")
        .update({ value })
        .eq("key", key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast({ title: "Setting updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating setting", description: error.message, variant: "destructive" });
    },
  });
};

// Services management
export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (service: {
      name: string;
      slug: string;
      description?: string;
      price: number;
      category_id?: string;
      features?: string[];
      turnaround_days?: number;
    }) => {
      const { data, error } = await supabase
        .from("services")
        .insert(service)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Service created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error creating service", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Service updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating service", description: error.message, variant: "destructive" });
    },
  });
};

// User role management
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "client" | "lawyer" | "admin" }) => {
      // First check if role exists
      const { data: existing } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      toast({ title: "User role updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating role", description: error.message, variant: "destructive" });
    },
  });
};

// Check if current user is admin
export const useIsAdmin = () => {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) return false;
      return data?.role === "admin";
    },
  });
};

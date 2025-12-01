import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CompanyFile {
  id: string;
  name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  service_id: string | null;
  description: string | null;
  is_active: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useCompanyFiles = (category?: string) => {
  return useQuery({
    queryKey: ["company-files", category],
    queryFn: async () => {
      let query = supabase
        .from("company_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CompanyFile[];
    },
  });
};

export const useUploadCompanyFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      file,
      category,
      serviceId,
      description,
    }: {
      file: File;
      category: string;
      serviceId?: string;
      description?: string;
    }) => {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("company-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { data, error } = await supabase
        .from("company_files")
        .insert({
          name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          category,
          service_id: serviceId || null,
          description: description || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-files"] });
      toast({ title: "File uploaded successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCompanyFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: CompanyFile) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("company-files")
        .remove([file.file_path]);

      if (storageError) console.error("Storage delete error:", storageError);

      // Delete database record
      const { error } = await supabase
        .from("company_files")
        .delete()
        .eq("id", file.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-files"] });
      toast({ title: "File deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

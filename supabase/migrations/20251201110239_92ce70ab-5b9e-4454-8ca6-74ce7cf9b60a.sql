-- Create company_files table for admin uploads (company identity, service templates, etc.)
CREATE TABLE public.company_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT NOT NULL DEFAULT 'general', -- 'company_identity', 'service_template', 'legal_reference'
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_documents table for user-specific generated documents
CREATE TABLE public.service_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT,
  content TEXT, -- For AI-generated content stored as text
  document_type TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'final', 'amendment'
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending', -- 'pending', 'generated', 'reviewed', 'approved'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_messages table for service-specific chat
CREATE TABLE public.purchase_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'user', 'assistant', 'system'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_messages ENABLE ROW LEVEL SECURITY;

-- Company files policies
CREATE POLICY "Admins can manage company files" ON public.company_files
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active company files" ON public.company_files
FOR SELECT USING (is_active = true);

-- Service documents policies
CREATE POLICY "Users can view their own service documents" ON public.service_documents
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own service documents" ON public.service_documents
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all service documents" ON public.service_documents
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Purchase messages policies
CREATE POLICY "Users can view their own purchase messages" ON public.purchase_messages
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchase messages" ON public.purchase_messages
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchase messages" ON public.purchase_messages
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for company files
INSERT INTO storage.buckets (id, name, public) VALUES ('company-files', 'company-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for company files
CREATE POLICY "Admins can upload company files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'company-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update company files" ON storage.objects
FOR UPDATE USING (bucket_id = 'company-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete company files" ON storage.objects
FOR DELETE USING (bucket_id = 'company-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view company files" ON storage.objects
FOR SELECT USING (bucket_id = 'company-files');

-- Add triggers for updated_at
CREATE TRIGGER update_company_files_updated_at
BEFORE UPDATE ON public.company_files
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_documents_updated_at
BEFORE UPDATE ON public.service_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Create storage bucket for intake documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('intake-documents', 'intake-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for intake documents
CREATE POLICY "Users can upload their own intake documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'intake-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own intake documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'intake-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own intake documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'intake-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all intake documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'intake-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);
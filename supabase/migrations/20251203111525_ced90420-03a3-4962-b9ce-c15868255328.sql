-- Add policy for admins to update purchases
CREATE POLICY "Admins can update all purchases" 
ON public.purchases 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add policy for admins to update service_documents
CREATE POLICY "Admins can update service documents" 
ON public.service_documents 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));
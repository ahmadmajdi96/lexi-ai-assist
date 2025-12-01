-- Add admin policies for services table
CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for profiles (to view all users)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for purchases (to view all)
CREATE POLICY "Admins can view all purchases"
ON public.purchases
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for user_roles (to manage roles)
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for service_categories
CREATE POLICY "Admins can manage service categories"
ON public.service_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for documents (to view all)
CREATE POLICY "Admins can view all documents"
ON public.documents
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
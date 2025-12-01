-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('client', 'lawyer', 'admin');

-- Create service status enum
CREATE TYPE public.service_status AS ENUM ('draft', 'intake_pending', 'ai_drafting', 'lawyer_review', 'client_review', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create service_categories table
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.service_categories(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  price INTEGER NOT NULL, -- in cents
  turnaround_days INTEGER DEFAULT 2,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) NOT NULL,
  status service_status NOT NULL DEFAULT 'intake_pending',
  assigned_lawyer_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  amount_paid INTEGER, -- in cents
  intake_data JSONB DEFAULT '{}'::jsonb,
  ai_draft TEXT,
  final_document TEXT,
  notes TEXT,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  version INTEGER DEFAULT 1,
  is_final BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ai_chat_sessions table
CREATE TABLE public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
  service_context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ai_chat_messages table
CREATE TABLE public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table (client-lawyer communication)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles: Only viewable by the user themselves
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Service categories: Public read
CREATE POLICY "Anyone can view service categories"
  ON public.service_categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- Services: Public read
CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Purchases: Users can view/manage their own purchases
CREATE POLICY "Users can view their own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchases"
  ON public.purchases FOR UPDATE
  USING (auth.uid() = user_id);

-- Documents: Users can manage documents for their purchases
CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- AI Chat Sessions: Users can manage their own sessions
CREATE POLICY "Users can view their own chat sessions"
  ON public.ai_chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat sessions"
  ON public.ai_chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
  ON public.ai_chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- AI Chat Messages: Users can manage messages in their sessions
CREATE POLICY "Users can view their own chat messages"
  ON public.ai_chat_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ai_chat_sessions
    WHERE ai_chat_sessions.id = ai_chat_messages.session_id
    AND ai_chat_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create chat messages"
  ON public.ai_chat_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ai_chat_sessions
    WHERE ai_chat_sessions.id = session_id
    AND ai_chat_sessions.user_id = auth.uid()
  ));

-- Messages: Users can view messages for their purchases
CREATE POLICY "Users can view messages for their purchases"
  ON public.messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.purchases
    WHERE purchases.id = messages.purchase_id
    AND purchases.user_id = auth.uid()
  ));

CREATE POLICY "Users can send messages for their purchases"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM public.purchases
    WHERE purchases.id = purchase_id
    AND purchases.user_id = auth.uid()
  ));

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Assign default client role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at
  BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default service categories
INSERT INTO public.service_categories (name, slug, description, icon) VALUES
  ('Contracts', 'contracts', 'Contract drafting and review services', 'FileText'),
  ('Business', 'business', 'Business formation and corporate services', 'Building2'),
  ('Employment', 'employment', 'Employment law and HR documentation', 'Users'),
  ('Intellectual Property', 'ip', 'Trademark, copyright, and patent services', 'Lightbulb'),
  ('Real Estate', 'realestate', 'Property and real estate legal services', 'Home');

-- Insert default services
INSERT INTO public.services (category_id, name, slug, description, features, price, turnaround_days, is_popular) VALUES
  ((SELECT id FROM service_categories WHERE slug = 'contracts'), 'Non-Disclosure Agreement (NDA)', 'nda', 'Protect your confidential information with a professionally drafted NDA.', '["AI-generated draft", "Lawyer review", "E-signature ready", "Unlimited revisions"]', 19900, 1, true),
  ((SELECT id FROM service_categories WHERE slug = 'contracts'), 'Service Agreement', 'service-agreement', 'Comprehensive service contracts for freelancers and agencies.', '["Custom clauses", "Payment terms", "Liability protection", "Termination clauses"]', 29900, 2, false),
  ((SELECT id FROM service_categories WHERE slug = 'business'), 'LLC Formation', 'llc-formation', 'Complete LLC setup with articles of organization and operating agreement.', '["State filing", "EIN application", "Operating agreement", "Compliance guide"]', 39900, 5, true),
  ((SELECT id FROM service_categories WHERE slug = 'business'), 'Corporation Formation', 'corporation', 'Incorporate your business with all necessary documentation.', '["Articles of incorporation", "Bylaws", "Stock certificates", "Board resolutions"]', 59900, 7, false),
  ((SELECT id FROM service_categories WHERE slug = 'employment'), 'Employment Contract', 'employment-contract', 'Comprehensive employment agreements for your team.', '["Job description", "Compensation details", "Benefits", "Non-compete clause"]', 24900, 2, false),
  ((SELECT id FROM service_categories WHERE slug = 'employment'), 'Employee Handbook', 'employee-handbook', 'Complete employee handbook with policies and procedures.', '["Company policies", "HR procedures", "Compliance", "Code of conduct"]', 49900, 7, false),
  ((SELECT id FROM service_categories WHERE slug = 'ip'), 'Trademark Registration', 'trademark', 'Protect your brand with federal trademark registration.', '["Trademark search", "Application filing", "Office action response", "Registration"]', 59900, 14, true),
  ((SELECT id FROM service_categories WHERE slug = 'ip'), 'Copyright Registration', 'copyright', 'Register your creative works for legal protection.', '["Application prep", "Filing", "Certificate", "Infringement guidance"]', 34900, 7, false),
  ((SELECT id FROM service_categories WHERE slug = 'realestate'), 'Lease Agreement', 'lease-agreement', 'Residential or commercial lease agreements.', '["Customizable terms", "Security deposit", "Maintenance clauses", "Renewal options"]', 29900, 2, false),
  ((SELECT id FROM service_categories WHERE slug = 'realestate'), 'Real Estate Purchase Agreement', 'purchase-agreement', 'Comprehensive purchase agreements for property transactions.', '["Contingencies", "Closing terms", "Title requirements", "Disclosure schedules"]', 44900, 5, false);